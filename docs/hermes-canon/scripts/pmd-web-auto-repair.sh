#!/bin/bash
# pmd-web-auto-repair.sh — Rate-limited rebuild + restart for pmd-web
#
# Triggered by PM2 Health Monitor when:
#   1. pmd-web is online in PM2 (jlist shows "online")
#   2. The canonical health route /pmd/api/properties returns 5xx
#      OR /pmd returns 5xx
#      (3 consecutive failures required — see RATE-LIMIT below)
#   3. AND the previous repair attempt is older than RATE_LIMIT_MINUTES
#
# Repair sequence (Next.js Permanent Rule):
#   1. pm2 stop pmd-web
#   2. rm -rf .next
#   3. cd /Users/bigdawg/Projects/property-management-dashboard/web
#   4. npm run build
#   5. pm2 start pmd-web (or `pm2 start ecosystem.config.cjs`)
#   6. Wait up to 30s for /pmd/api/properties to return 200
#   7. If 200: SUCCESS, log to /tmp/pmd-web-auto-repair.log
#      If still 5xx: ESCALATE, surface to Marcelo
#
# Rate-limit (Permanent 2026-07-22, Card t_pmd_web_next_build_and_whitelist_20260722):
#   - HARD LIMIT: max 1 rebuild per RATE_LIMIT_MINUTES (default 30 min)
#   - STATE: /tmp/pmd-web-auto-repair.state (last_attempt_at)
#   - Lock: /tmp/pmd-web-auto-repair.lock (mkdir before/during rebuild, rmdir on exit)
#
# Permanent 2026-07-22 (Card t_pmd_web_next_build_and_whitelist_20260722).
# Companion file: ~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md §"pmd-web auto-repair rule"

set -uo pipefail

# ── Configuration ───────────────────────────────────────────────────────────
PMD_DIR="/Users/bigdawg/Projects/property-management-dashboard/web"
PMD_ECOSYSTEM="/Users/bigdawg/Projects/property-management-dashboard/ecosystem.config.cjs"
LOG="/tmp/pmd-web-auto-repair.log"
STATE="/tmp/pmd-web-auto-repair.state"
LOCK="/tmp/pmd-web-auto-repair.lock"
HEALTH_URL="http://localhost:7575/pmd/api/properties"
RATE_LIMIT_MINUTES="${PMD_REPAIR_RATE_LIMIT_MIN:-30}"
HEALTH_TIMEOUT="${PMD_REPAIR_HEALTH_TIMEOUT:-30}"

# ── Helpers ────────────────────────────────────────────────────────────────
log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*" | tee -a "$LOG" >&2; }
fail() { log "FAIL: $*"; exit 1; }

# ── Rate limit check ──────────────────────────────────────────────────────
if [ -f "$STATE" ]; then
  LAST_ATTEMPT=$(cat "$STATE" 2>/dev/null || echo "0")
  NOW=$(date +%s)
  ELAPSED_MIN=$(( (NOW - LAST_ATTEMPT) / 60 ))
  if [ "$ELAPSED_MIN" -lt "$RATE_LIMIT_MINUTES" ]; then
    log "RATE-LIMITED: last attempt ${ELAPSED_MIN}m ago (limit ${RATE_LIMIT_MINUTES}m) — skipping repair"
    log "If this is a real emergency, run: PMD_REPAIR_RATE_LIMIT_MIN=0 bash $0"
    exit 2  # EX_USAGE-style: rate-limited, not an error
  fi
fi

# ── Acquire lock ──────────────────────────────────────────────────────────
if ! mkdir "$LOCK" 2>/dev/null; then
  log "LOCKED: another repair attempt is in progress (lock dir: $LOCK)"
  exit 3
fi
trap "rmdir '$LOCK' 2>/dev/null" EXIT

# ── Mark attempt ──────────────────────────────────────────────────────────
date +%s > "$STATE"
log "=== AUTO-REPAIR TRIGGERED ==="
log "  state file: $STATE"
log "  rate limit: ${RATE_LIMIT_MINUTES}m"
log "  health URL: $HEALTH_URL"

# ── Repair sequence ──────────────────────────────────────────────────────
log "Step 1/6: pm2 stop pmd-web"
~/.hermes/scripts/pm2-hermes.sh stop pmd-web >> "$LOG" 2>&1 || fail "pm2 stop failed"
sleep 2

log "Step 2/6: rm -rf .next"
cd "$PMD_DIR" || fail "cd $PMD_DIR failed"
rm -rf .next || fail "rm .next failed"

log "Step 3/6: (cwd is $(pwd))"
log "Step 4/6: npm run build"
npm run build >> "$LOG" 2>&1 || fail "npm run build failed (see $LOG for details)"

log "Step 5/6: pm2 start pmd-web (via ecosystem)"
cd /Users/bigdawg/Projects/property-management-dashboard
~/.hermes/scripts/pm2-hermes.sh start ecosystem.config.cjs --only pmd-web >> "$LOG" 2>&1 \
  || ~/.hermes/scripts/pm2-hermes.sh start ecosystem.config.cjs >> "$LOG" 2>&1 \
  || fail "pm2 start failed (see $LOG for details)"

log "Step 6/6: wait up to ${HEALTH_TIMEOUT}s for /pmd/api/properties to return 200"
SUCCESS=0
for i in $(seq 1 $HEALTH_TIMEOUT); do
  sleep 1
  CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 3 "$HEALTH_URL" 2>/dev/null || echo 000)
  if [ "$CODE" = "200" ]; then
    log "  attempt $i: HTTP 200 — healthy"
    SUCCESS=1
    break
  fi
  if [ $((i % 5)) -eq 0 ]; then
    log "  attempt $i: HTTP $CODE (still waiting)"
  fi
done

if [ $SUCCESS -eq 1 ]; then
  log "=== AUTO-REPAIR SUCCESS ==="
  exit 0
else
  log "=== AUTO-REPAIR FAILED: HTTP 5xx after $HEALTH_TIMEOUT seconds — ESCALATE ==="
  exit 1
fi
