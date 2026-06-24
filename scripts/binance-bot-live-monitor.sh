#!/usr/bin/env bash
# binance-bot live monitor — 5 min cron watchdog
# Detects: crash, restart SPIKE (delta-in-window), bad mode, balance mismatch,
#          failed health-check, API failure.
# Silent when healthy. Writes a FAIL file only on detection.
# Hermes cron infrastructure delivers the FAIL file to Telegram (origin channel).
#
# 2026-06-23 rewrite (t_d6aabd51, T1 trading/money lane):
# - RESTART_SPIKE detection changed from CUMULATIVE lifetime count to
#   DELTA-IN-WINDOW (3 restarts in 10 min) — eliminates forever-spam after
#   legitimate deploy restarts.
# - 30-min cooldown: one alert per spike, no repeat during cooldown.
# - MAINT probe: silences ALL alerts when operator has filed a maintenance
#   window for a known deploy / DB migration / config change.
#
# No-spam policy: silent when healthy. FAIL file written only on detection.
# Telegram routing is handled by Hermes cron job `binance-bot-live-monitor`.
set -uo pipefail

BOT_NAME="binance-bot"
BOT_PORT=8104
OUT_DIR="$HOME/.hermes/cron/output"
FAIL_FILE="$OUT_DIR/${BOT_NAME}-monitor-FAIL.md"
HEALTH_OUTPUT="$OUT_DIR/${BOT_NAME}-monitor-output.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S %Z")
NOW_EPOCH=$(date +%s)
NOW_MS=$(python3 -c "import time; print(int(time.time()*1000))")

# ── Spike detection config ──
STATE_DIR="$HOME/.hermes/state"
STATE_FILE="$STATE_DIR/${BOT_NAME}-restart-history.json"
MAINT_FILE="$STATE_DIR/${BOT_NAME}-MAINTENANCE"
SPIKE_THRESHOLD=3
SPIKE_WINDOW=600       # 10 minutes (seconds)
SPIKE_COOLDOWN=1800    # 30 minutes (seconds)
HISTORY_RETENTION=1200 # prune restarts older than 2 windows

PROBLEMS=()
DETAILS=""
mkdir -p "$OUT_DIR" "$STATE_DIR"

# ── 0. MAINT probe — silences ALL alerts during operator-filed maintenance ──
if [ -f "$MAINT_FILE" ]; then
  MAINT_UNTIL=$(python3 -c "import json;print(json.load(open('$MAINT_FILE')).get('until',0))" 2>/dev/null || echo 0)
  MAINT_REASON=$(python3 -c "import json;print(json.load(open('$MAINT_FILE')).get('reason','unknown'))" 2>/dev/null || echo "unknown")
  if [ "$NOW_EPOCH" -lt "$MAINT_UNTIL" ]; then
    echo "[$TIMESTAMP] MAINT silenced (until $(date -r "$MAINT_UNTIL" '+%Y-%m-%d %H:%M:%S %Z' 2>/dev/null || echo "$MAINT_UNTIL"), reason: $MAINT_REASON)" >> "$HEALTH_OUTPUT"
    exit 0
  else
    # Window expired — auto-cleanup
    rm -f "$MAINT_FILE"
    echo "[$TIMESTAMP] MAINT window expired — re-enabling alerts" >> "$HEALTH_OUTPUT"
  fi
fi

# ── 0.5 Load state file (idempotent init) ──
if [ -f "$STATE_FILE" ] && [ -s "$STATE_FILE" ]; then
  STATE_VALID=$(python3 -c "import json; json.load(open('$STATE_FILE')); print('ok')" 2>/dev/null || echo "bad")
  if [ "$STATE_VALID" != "ok" ]; then
    # Corrupt state — back up and re-init
    mv "$STATE_FILE" "${STATE_FILE}.corrupt.$(date +%s)"
    echo "[$TIMESTAMP] WARN: corrupt state file — re-initialized" >> "$HEALTH_OUTPUT"
  fi
fi
if [ ! -f "$STATE_FILE" ]; then
  python3 -c "
import json
state = {
  'restart_history': [],
  'last_restart_time': 0,
  'last_spike_at': 0,
  'cooldown_until': 0,
  'last_start_at': 0,
  'version': 1
}
with open('$STATE_FILE','w') as f: json.dump(state, f, indent=2)
"
fi
LAST_RESTART_TIME=$(python3 -c "import json;print(json.load(open('$STATE_FILE')).get('last_restart_time',0))")
COOLDOWN_UNTIL=$(python3 -c "import json;print(json.load(open('$STATE_FILE')).get('cooldown_until',0))")

# ── 1. PM2 process state ──
PM2_JSON=$(pm2 jlist 2>/dev/null)
if [ -z "$PM2_JSON" ]; then
  PROBLEMS+=("PM2_DAEMON_DOWN")
  DETAILS+=$'\n- PM2 daemon not responding to jlist'
else
  BOT_INFO=$(echo "$PM2_JSON" | python3 -c "
import json, sys
procs = json.load(sys.stdin)
for p in procs:
    if p['name'] == '$BOT_NAME':
        e = p.get('pm2_env', {})
        m = p.get('monit', {})
        print(f'status={e.get(\"status\")} restarts={e.get(\"restart_time\")} unstable={e.get(\"unstable_restarts\")} pid={p.get(\"pid\")} mem={m.get(\"memory\",0)}')
")
  if [ -z "$BOT_INFO" ]; then
    PROBLEMS+=("PROCESS_NOT_FOUND")
    DETAILS+=$'\n- binance-bot not in PM2 process list'
  else
    STATUS=$(echo "$BOT_INFO" | sed -n 's/.*status=\([a-z_]*\).*/\1/p')
    RESTARTS=$(echo "$BOT_INFO" | sed -n 's/.*restarts=\([0-9]*\).*/\1/p')
    UNSTABLE=$(echo "$BOT_INFO" | sed -n 's/.*unstable=\([0-9]*\).*/\1/p')
    PID=$(echo "$BOT_INFO" | sed -n 's/.*pid=\([0-9]*\).*/\1/p')

    [ "$STATUS" != "online" ] && PROBLEMS+=("STATUS_NOT_ONLINE:$STATUS") && DETAILS+=$'\n- PM2 status is not online: '$STATUS
    [ "${UNSTABLE:-0}" -gt 0 ] && PROBLEMS+=("UNSTABLE_RESTARTS:$UNSTABLE") && DETAILS+=$'\n- Unstable restart counter: '$UNSTABLE' (>0 means pre-start or startup failed)'

    # ── 1a. DELTA-IN-WINDOW spike detection (replaces cumulative count check) ──
    if [ "${RESTARTS:-0}" -gt 0 ]; then
      # Update restart history: append NEW restarts since last check
      if [ "$RESTARTS" -gt "$LAST_RESTART_TIME" ]; then
        DELTA=$((RESTARTS - LAST_RESTART_TIME))
        # Append `DELTA` timestamps (approximate: spread across last 60s)
        python3 -c "
import json, time
with open('$STATE_FILE') as f: s = json.load(f)
hist = s.get('restart_history', [])
now = $NOW_EPOCH
for i in range($DELTA):
    # backdate slightly so concurrent restarts don't all share the same timestamp
    hist.append(now - (($DELTA - 1 - i) * 10))
s['restart_history'] = hist
with open('$STATE_FILE','w') as f: json.dump(s, f, indent=2)
"
      fi

      # Count restarts in window
      RESTART_COUNT_IN_WINDOW=$(python3 -c "
import json, time
with open('$STATE_FILE') as f: s = json.load(f)
hist = s.get('restart_history', [])
window_start = $NOW_EPOCH - $SPIKE_WINDOW
in_window = [t for t in hist if t >= window_start]
print(len(in_window))
")

      # Prune history (keep only restarts in 2-window retention)
      python3 -c "
import json, time
with open('$STATE_FILE') as f: s = json.load(f)
hist = s.get('restart_history', [])
cutoff = $NOW_EPOCH - $HISTORY_RETENTION
hist = [t for t in hist if t >= cutoff]
s['restart_history'] = hist
s['last_restart_time'] = $RESTARTS
s['last_start_at'] = $NOW_MS
with open('$STATE_FILE','w') as f: json.dump(s, f, indent=2)
"

      # Trigger condition: delta-in-window >= threshold AND cooldown expired
      if [ "$RESTART_COUNT_IN_WINDOW" -ge "$SPIKE_THRESHOLD" ]; then
        if [ "$NOW_EPOCH" -ge "$COOLDOWN_UNTIL" ]; then
          PROBLEMS+=("RESTART_SPIKE:$RESTART_COUNT_IN_WINDOW")
          DETAILS+=$'\n- Restart spike: '$RESTART_COUNT_IN_WINDOW' restarts in last '$SPIKE_WINDOW's (threshold: '$SPIKE_THRESHOLD')'
          DETAILS+=$'\n- PM2 restart_time now: '$RESTARTS' (cumulative since 2026-06-22)'
          DETAILS+=$'\n- Cooldown: 30 min — further spike alerts silenced until next window'
          # Set cooldown
          NEW_COOLDOWN=$((NOW_EPOCH + SPIKE_COOLDOWN))
          python3 -c "
import json
with open('$STATE_FILE') as f: s = json.load(f)
s['last_spike_at'] = $NOW_EPOCH
s['cooldown_until'] = $NEW_COOLDOWN
with open('$STATE_FILE','w') as f: json.dump(s, f, indent=2)
"
        else
          # During cooldown — silent log only
          REMAINING=$((COOLDOWN_UNTIL - NOW_EPOCH))
          echo "[$TIMESTAMP] SPIKE silent (cooldown: ${REMAINING}s remaining, count: $RESTART_COUNT_IN_WINDOW)" >> "$HEALTH_OUTPUT"
        fi
      fi
    fi
  fi
fi

# ── 2. Bot API responds + status is LIVE (not PAPER) ──
API_JSON=$(curl -sS --max-time 5 "http://127.0.0.1:${BOT_PORT}/api/status" 2>/dev/null)
if [ -z "$API_JSON" ]; then
  PROBLEMS+=("API_UNREACHABLE")
  DETAILS+=$'\n- Bot /api/status not reachable on port '$BOT_PORT
else
  MODE=$(echo "$API_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('mode','unknown'))" 2>/dev/null)
  PAPERMODE=$(echo "$API_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('paperMode','unknown'))" 2>/dev/null)
  BALANCE=$(echo "$API_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('balance',0))" 2>/dev/null)

  if [ "$MODE" != "LIVE" ]; then
    PROBLEMS+=("BAD_MODE:$MODE")
    DETAILS+=$'\n- Bot mode is not LIVE: '$MODE' (expected LIVE)'
  fi
  if [ "$PAPERMODE" != "False" ]; then
    PROBLEMS+=("PAPER_FLAG_TRUE")
    DETAILS+=$'\n- paperMode flag is True (expected False for LIVE)'
  fi

  # ── 3. Balance matches exchange (signed call) ──
  EXCHANGE_USDT=$(cd "$HOME/Projects/binance-bot" && DOTENV_CONFIG_QUIET=true node -e "
const crypto=require('crypto');
require('dotenv').config({path:'./.env', quiet: true});
const ts=Date.now();
const qs='timestamp='+ts+'&recvWindow=5000';
const sig=crypto.createHmac('sha256',process.env.BINANCEUS_API_SECRET).update(qs).digest('hex');
require('https').get({hostname:'api.binance.us',path:'/api/v3/account?'+qs+'&signature='+sig,method:'GET',headers:{'X-MBX-APIKEY':process.env.BINANCEUS_API_KEY}},res=>{
  let d='';res.on('data',c=>d+=c);res.on('end',()=>{
    try {
      const j=JSON.parse(d);
      const usdt=j.balances.find(b=>b.asset==='USDT');
      process.stdout.write(String(parseFloat(usdt.free||'0')));
    } catch(e) { process.stdout.write('API_ERROR'); }
  });
}).on('error',e=>{process.stdout.write('NETWORK_ERROR');});
" 2>/dev/null)

  if [ -z "$EXCHANGE_USDT" ] || [ "$EXCHANGE_USDT" = "API_ERROR" ] || [ "$EXCHANGE_USDT" = "NETWORK_ERROR" ]; then
    PROBLEMS+=("EXCHANGE_API_FAIL")
    DETAILS+=$'\n- Live Binance.US API call failed: '"$EXCHANGE_USDT"
  else
    # Compare with 2% tolerance
    DIFF=$(python3 -c "
bot_bal=$BALANCE
exch_bal=$EXCHANGE_USDT
diff=abs(bot_bal - exch_bal)
tol=bot_bal * 0.02
print(f'{diff:.4f}|{tol:.4f}|{\"OK\" if diff <= tol else \"MISMATCH\"}')
")
    DIFFVAL=$(echo "$DIFF" | cut -d'|' -f1)
    TOLVAL=$(echo "$DIFF" | cut -d'|' -f2)
    DIFFSTAT=$(echo "$DIFF" | cut -d'|' -f3)
    if [ "$DIFFSTAT" = "MISMATCH" ]; then
      PROBLEMS+=("BALANCE_MISMATCH")
      DETAILS+=$'\n- Balance mismatch: bot=$BALANCE  exchange=$EXCHANGE_USDT  diff=$DIFFVAL  tol=$TOLVAL'
    fi
  fi
fi

# ── 4. Run binance-health-check (PM2 process + DB + balance + log errors) ──
HEALTH_OUT=$(cd "$HOME/Projects/binance-bot" && node health-check.js 2>&1)
HEALTH_EXIT=$?
if [ $HEALTH_EXIT -ne 0 ]; then
  PROBLEMS+=("HEALTH_CHECK_FAIL")
  DETAILS+=$'\n- binance-health-check.js exited non-zero:'
  DETAILS+=$'\n```'
  DETAILS+=$'\n'"$(echo "$HEALTH_OUT" | tail -15)"
  DETAILS+=$'\n```'
fi

# ── 5. PM2 error log new errors since last check ──
ERROR_LOG="$HOME/.pm2/logs/binance-bot-error.log"
if [ -f "$ERROR_LOG" ] && [ -s "$ERROR_LOG" ]; then
  NEW_ERRORS=$(grep -c -E "SyntaxError|ReferenceError|TypeError|SQLITE_ERROR|UnhandledPromise" "$ERROR_LOG" 2>/dev/null)
  if [ "${NEW_ERRORS:-0}" -gt 0 ]; then
    PROBLEMS+=("NEW_PM2_ERRORS:$NEW_ERRORS")
    DETAILS+=$'\n- '$NEW_ERRORS' new error(s) in PM2 error log:'
    DETAILS+=$'\n```'
    DETAILS+=$'\n'"$(grep -E "SyntaxError|ReferenceError|TypeError|SQLITE_ERROR|UnhandledPromise" "$ERROR_LOG" | head -3)"
    DETAILS+=$'\n```'
  fi
fi

PRE_TRADE_HOOK_FILE="/Users/bigdawg/Projects/trading-review/pre-trade-hook.js"
if [ ! -f "$PRE_TRADE_HOOK_FILE" ]; then
  PROBLEMS+=("PRE_TRADE_HOOK_MISSING")
  DETAILS+=$'\n- pre-trade-hook.js not found at: '$PRE_TRADE_HOOK_FILE
else
  HOOK_LOAD=$(cd "$HOME/Projects/binance-bot" && node -e "
    try {
      const m = require('$PRE_TRADE_HOOK_FILE');
      process.stdout.write('OK:' + (typeof m === 'function' ? 'function' : (m && m.default ? 'default' : 'module')));
    } catch (e) {
      process.stdout.write('FAIL:' + e.message);
    }
  " 2>&1)
  case "$HOOK_LOAD" in
    OK:*) ;;
    *)
      PROBLEMS+=("PRE_TRADE_HOOK_LOAD_FAIL")
      DETAILS+=$'\n- pre-trade-hook.js reload failed: '$HOOK_LOAD
      ;;
  esac
fi

# ── Outcome ──
if [ ${#PROBLEMS[@]} -eq 0 ]; then
  # Healthy — silent (no FAIL file)
  rm -f "$FAIL_FILE"
  echo "[$TIMESTAMP] OK — all checks passed" >> "$HEALTH_OUTPUT"
  exit 0
fi

# Problems detected — write FAIL file (Hermes cron will deliver to Telegram)
cat > "$FAIL_FILE" << EOF
🚨 **Binance Bot Live Monitor — ${#PROBLEMS[@]} issue(s) detected**

**Time:** $TIMESTAMP
**Detected:** ${PROBLEMS[*]}

**Details:**$DETAILS

**Action:** review the listed problems; auto-recovery may already be in progress. For RESTART_SPIKE: cooldown is active for 30 min — repeated alerts during cooldown are silenced. If state does not normalize within 30 minutes, escalate to Marcelo with a manual pm2 stop / node safe-start.js / node restart-health-check.js cycle.
EOF

echo "[$TIMESTAMP] FAIL — ${PROBLEMS[*]}" >> "$HEALTH_OUTPUT"
exit 1