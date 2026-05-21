#!/bin/bash
# ============================================================
# weekly-systems-improvement.sh — Phase 12
# Hermes Weekly Systems Improvement Loop
# Schedule: Monday 08:00 AM local via Hermes cron (no_agent)
# Silent when healthy — report only when issues found
# ============================================================

set -uo pipefail  # removed -e so individual check failures don't abort

HERMES_DIR="$HOME/.hermes"
KNOWLEDGE_DIR="$HERMES_DIR/knowledge/memory"
CLAW_BACKUP="$HOME/Desktop/CLAW-Backup"
BOSS_MAN="$HOME/Projects/BossMan"
LOG_DIR="$HERMES_DIR/logs"
REPORT_DATE=$(date +%Y-%m-%d)
REPORT_PATH="$KNOWLEDGE_DIR/SYSTEMS_IMPROVEMENT_$REPORT_DATE.md"
MEMORY_LOG="$KNOWLEDGE_DIR/MEMORY_CAPTURE_LOG.md"
SCRIPT_DIR="$HERMES_DIR/scripts"
TMP_REPORT="/tmp/systems-raw-$$.txt"

# Ensure dirs exist
mkdir -p "$KNOWLEDGE_DIR" "$LOG_DIR"

# Helper: log only to stderr (silent to stdout)
info() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >&2; }

# Helper: check a PM2 service and emit a structured line
check_pm2() {
  local name="$1"; local project="$2"
  local raw
  raw=$(pm2 jlist 2>/dev/null) || { echo "[PROJECT:$project][WARNING] Could not run pm2 jlist"; return; }

  # Handle "no entries" or other non-JSON output
  if ! echo "$raw" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
    if echo "$raw" | grep -qi "no entries\|error\|cannot"; then
      echo "[PROJECT:$project][IMPROVE] PM2 returned no entries — service list unclear"
    else
      echo "[PROJECT:$project][WARNING] PM2 returned invalid JSON — check PM2 status manually"
    fi
    return
  fi

  local status uptime restarts
  local raw_clean=$(echo "$raw" | python3 -c "
import sys, json
services = json.load(sys.stdin)
s = [x for x in services if x.get('name') == '$name']
if not s:
    print('NOT_FOUND')
    sys.exit(0)
d = s[0]
env = d.get('pm2_env', {})
up = d.get('monit', {}).get('uptime', 0)
rst = env.get('restart_time', 0)
mem = round(d.get('monit', {}).get('memory', 0) / 1048576, 1)
pmid = env.get('pm_id', -1)
print(json.dumps({'status': env.get('status','UNKNOWN'), 'uptime': up, 'restarts': rst, 'memory_mb': mem, 'pm2_id': pmid}))
" 2>/dev/null) || { echo "[PROJECT:$project][WARNING] Could not parse PM2 data for $name"; return; }

  if [[ "$raw_clean" == "NOT_FOUND" ]]; then
    echo "[PROJECT:$project][CRITICAL] $name NOT FOUND in PM2 — service is down"
    return
  fi

  status=$(echo "$raw_clean" | python3 -c "import sys,json; print(json.load(sys.stdin)['status'])" 2>/dev/null || echo "ERR")
  restarts=$(echo "$raw_clean" | python3 -c "import sys,json; print(json.load(sys.stdin)['restarts'])" 2>/dev/null || echo "0")
  uptime_s=$(echo "$raw_clean" | python3 -c "import sys,json; print(json.load(sys.stdin)['uptime'])" 2>/dev/null || echo "0")

  local days=$((uptime_s / 86400))
  local hours=$((uptime_s % 86400 / 3600))
  local mins=$((uptime_s % 3600 / 60))
  if [[ days -gt 0 ]]; then uptime_f="${days}D ${hours}h"; else uptime_f="${hours}h ${mins}m"; fi

  if [[ "$status" != "online" ]]; then
    echo "[PROJECT:$project][CRITICAL] $name not online (status: $status) — uptime: $uptime_f"
  elif [[ restarts -gt 5 ]]; then
    echo "[PROJECT:$project][WARNING] $name has $restarts restarts — possible instability (uptime: $uptime_f)"
  elif [[ restarts -gt 2 ]]; then
    echo "[PROJECT:$project][IMPROVE] $name has $restarts restarts — investigate pattern (uptime: $uptime_f)"
  fi
}

# Helper: check if port is open
check_port() {
  local port="$1"; local label="$2"
  if ! nc -z -w 3 127.0.0.1 "$port" 2>/dev/null; then
    echo "[PROJECT:$label][WARNING] Port $port ($label) is not responding"
  fi
}

# ── Collect all checks to temp file ───────────────────────
> "$TMP_REPORT"

info "Starting weekly systems audit..."

# 1. PM2 Services
info "Checking PM2 services..."
check_pm2 binance-bot BinanceBot >> "$TMP_REPORT"
check_pm2 money-pipeline MoneyPipeline >> "$TMP_REPORT"
check_pm2 squarepayouts SquarePayouts >> "$TMP_REPORT"
check_pm2 bakery BakeryOps >> "$TMP_REPORT"
check_pm2 cloudflare-tunnel CloudflareTunnel >> "$TMP_REPORT"

# 2. Critical ports
info "Checking critical ports..."
check_port 8104 "Binance Bot" >> "$TMP_REPORT"
check_port 8020 "Money Pipeline" >> "$TMP_REPORT"
check_port 8030 "SquarePayouts" >> "$TMP_REPORT"
check_port 8040 "BakeryOps" >> "$TMP_REPORT"
check_port 8100 "Mission Control" >> "$TMP_REPORT"
check_port 8140 "Mission Control Alt" >> "$TMP_REPORT"
check_port 8003 "Team Standup" >> "$TMP_REPORT"
check_port 8001 "Mission Control Primary" >> "$TMP_REPORT"

# 3. Hermes Gateway + CuaDriver
info "Checking Hermes Gateway + CuaDriver..."
gw_pid=$(launchctl list 2>/dev/null | grep "ai.hermes.gateway" | awk '{print $1}' || echo "NOT_FOUND")
if [[ -z "$gw_pid" ]] || [[ "$gw_pid" == "-" ]] || [[ "$gw_pid" == "NOT_FOUND" ]]; then
  echo "[PROJECT:Hermes][CRITICAL] hermes-gateway LaunchAgent not running" >> "$TMP_REPORT"
else
  echo "[PROJECT:Hermes][OK] hermes-gateway active (PID $gw_pid)" >> "$TMP_REPORT"
fi

cuadriver_pid=$(ps aux | grep -v grep | grep "/Applications/CuaDriver.app/Contents/MacOS/cua-driver" | awk '{print $2}' | head -1 || echo "")
sock_file="$HOME/Library/Caches/cua-driver/cua-driver.sock"
if [[ -z "$cuadriver_pid" ]]; then
  # Check if sock exists and is recent (process might have just died)
  if [[ -S "$sock_file" ]]; then
    # sock exists — try to ping it
    if /Applications/CuaDriver.app/Contents/MacOS/cua-driver ping "$sock_file" 2>/dev/null; then
      echo "[PROJECT:Hermes][OK] cua-driver responding on socket (sock exists, process check inconclusive)" >> "$TMP_REPORT"
    else
      echo "[PROJECT:Hermes][IMPROVE] cua-driver sock exists but process not responding — may need restart" >> "$TMP_REPORT"
    fi
  else
    echo "[PROJECT:Hermes][WARNING] cua-driver not running (sock missing)" >> "$TMP_REPORT"
  fi
else
  echo "[PROJECT:Hermes][OK] cua-driver active (PID $cuadriver_pid)" >> "$TMP_REPORT"
fi

# 4. Cron jobs
info "Checking cron jobs..."
cron_raw=$(crontab -l 2>/dev/null || true)
if echo "$cron_raw" | grep -qE "binance-bot|crypto-intel|csdawg"; then
  echo "[PROJECT:CryptoIntel][OK] Binance/Crypto cron entries present" >> "$TMP_REPORT"
else
  echo "[PROJECT:CryptoIntel][IMPROVE] No Binance/Crypto cron entries found" >> "$TMP_REPORT"
fi
if echo "$cron_raw" | grep -qE "hermes|weekly|systems-improvement"; then
  echo "[PROJECT:Hermes][OK] Hermes systems cron present" >> "$TMP_REPORT"
fi

# 5. Binance Bot LIVE mode
info "Checking Binance Bot mode..."
if [[ -f "$HOME/Projects/binance-bot/.env" ]]; then
  if grep -q "PAPER_MODE=false" "$HOME/Projects/binance-bot/.env" 2>/dev/null; then
    echo "[PROJECT:BinanceBot][TRADING] Binance Bot is in LIVE mode — monitor closely" >> "$TMP_REPORT"
    last_fill=$(grep -a "ORDER.*FILLED\|order filled\|buy order\|sell order" "$HOME/Projects/binance-bot/logs/bot.log" 2>/dev/null | tail -1 | cut -d'[' -f1 | xargs || echo "unknown")
    [[ -n "$last_fill" ]] && echo "[PROJECT:BinanceBot][TRADING] Last trade log: $last_fill" >> "$TMP_REPORT"
  fi
fi

# 6. Disk space
info "Checking disk space..."
disk_pct=$(df -h "$HOME" 2>/dev/null | tail -1 | awk '{print $5}' | tr -d '%' || echo "0")
if [[ "$disk_pct" -gt 85 ]]; then
  echo "[PROJECT:Hermes][WARNING] Disk usage at ${disk_pct}% — consider cleanup" >> "$TMP_REPORT"
fi

# 7. Error log check (Binance Bot)
info "Checking Binance Bot error log..."
BOT_DIR="$HOME/Projects/binance-bot"
BOT_LOG="$BOT_DIR/bot.log"
if [[ -f "$BOT_LOG" ]]; then
  error_count=$(wc -l < "$BOT_LOG" 2>/dev/null || echo "0")
  last_error_date=$(tail -5 "$BOT_LOG" 2>/dev/null | grep -a "error\|Error\|ERROR" | tail -1 | cut -d'[' -f1 | xargs || echo "none")
  if [[ -n "$last_error_date" && "$last_error_date" != "none" ]]; then
    echo "[PROJECT:BinanceBot][IMPROVE] bot.log has error references (last match: $last_error_date)" >> "$TMP_REPORT"
  fi
fi

# ── Count issues ───────────────────────────────────────────
ISSUES_RAW=$(grep -c "CRITICAL\|WARNING\|IMPROVE" "$TMP_REPORT" 2>/dev/null || echo "0")
ISSUES_FOUND=$((ISSUES_RAW))

info "Audit complete — $ISSUES_FOUND issue(s) found."

# ── If no issues, exit silently ───────────────────────────
if [[ "$ISSUES_FOUND" -eq 0 ]]; then
  info "All systems healthy — no issues found. Exiting silently."
  rm -f "$TMP_REPORT"
  exit 0
fi

# ── Generate formatted report via Python ──────────────────
info "Generating report..."
python3 "$SCRIPT_DIR/systems-improvement-report.py" \
  "$REPORT_DATE" \
  "$REPORT_PATH" \
  "$MEMORY_LOG" \
  < "$TMP_REPORT"

# ── Sync to CLAW-Backup and GitHub ─────────────────────────
info "Syncing to backup locations..."
mkdir -p "$CLAW_BACKUP"
cp "$REPORT_PATH" "$CLAW_BACKUP/SYSTEMS_IMPROVEMENT_$REPORT_DATE.md" 2>/dev/null || true

if [[ -d "$BOSS_MAN" ]]; then
  cp "$REPORT_PATH" "$BOSS_MAN/SYSTEMS_IMPROVEMENT_$REPORT_DATE.md" 2>/dev/null || true
  (cd "$BOSS_MAN" && git add "SYSTEMS_IMPROVEMENT_$REPORT_DATE.md" 2>/dev/null \
    && git commit -m "feat(systems): weekly improvement report $REPORT_DATE" 2>/dev/null \
    && git push 2>/dev/null || true) &
fi

rm -f "$TMP_REPORT"
info "Phase 12 weekly audit complete."
exit 0