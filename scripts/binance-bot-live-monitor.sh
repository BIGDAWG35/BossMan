#!/usr/bin/env bash
# binance-bot live monitor — 5 min cron watchdog
# Detects: crash, restart spike, bad mode, balance mismatch, failed health-check, API failure
# Silent when healthy. Writes a FAIL file only on detection.
# Hermes cron infrastructure delivers the FAIL file to Telegram (origin channel).
set -uo pipefail

BOT_NAME="binance-bot"
BOT_PORT=8104
OUT_DIR="$HOME/.hermes/cron/output"
FAIL_FILE="$OUT_DIR/${BOT_NAME}-monitor-FAIL.md"
HEALTH_OUTPUT="$OUT_DIR/${BOT_NAME}-monitor-output.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S %Z")
PROBLEMS=()
DETAILS=""

mkdir -p "$OUT_DIR"

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
    [ "${RESTARTS:-0}" -gt 2 ] && PROBLEMS+=("RESTART_SPIKE:$RESTARTS") && DETAILS+=$'\n- Restart count spiked: '$RESTARTS' (>2)'
    [ "${UNSTABLE:-0}" -gt 0 ] && PROBLEMS+=("UNSTABLE_RESTARTS:$UNSTABLE") && DETAILS+=$'\n- Unstable restart counter: '$UNSTABLE' (>0 means pre-start or startup failed)'
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
  # DOTENV_CONFIG_QUIET=true suppresses dotenv's "injecting env" tip output.
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
    DETAILS+=$'\n- Live Binance.US API call failed: '"'$EXCHANGE_USDT'"
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

# ── Outcome ──
if [ ${#PROBLEMS[@]} -eq 0 ]; then
  # Healthy — silent (no FAIL file)
  rm -f "$FAIL_FILE"
  echo "[$TIMESTAMP] OK — all 5 checks passed" >> "$HEALTH_OUTPUT"
  exit 0
fi

# Problems detected — write FAIL file (Hermes cron will deliver to Telegram)
cat > "$FAIL_FILE" << EOF
🚨 **Binance Bot Live Monitor — ${#PROBLEMS[@]} issue(s) detected**

**Time:** $TIMESTAMP
**Detected:** ${PROBLEMS[*]}

**Details:**$DETAILS

**Action:** review the listed problems; auto-recovery may already be in progress. If state does not normalize within 10 minutes, escalate to Marcelo with a manual pm2 stop / node safe-start.js / node restart-health-check.js cycle.
EOF

echo "[$TIMESTAMP] FAIL — ${PROBLEMS[*]}" >> "$HEALTH_OUTPUT"
exit 1
