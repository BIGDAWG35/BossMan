#!/usr/bin/env bash
# binance-bot auto-ticketing — comment on t_0f9f7820 when monitor detects an issue.
# Triggered by the FAIL file created by binance-bot-live-monitor.sh.
# Silent when no FAIL file exists.

FAIL_FILE="$HOME/.hermes/cron/output/binance-bot-monitor-FAIL.md"
INCIDENT_CARD="t_0f9f7820"
SENTINEL_DIR="$HOME/.hermes/cron/output"
SENTINEL="$SENTINEL_DIR/binance-bot-ticketing-last.txt"

# Only act if FAIL file exists
if [ ! -f "$FAIL_FILE" ]; then
  exit 0
fi

# Read FAIL content (capped to 2000 chars to fit in a comment)
FAIL_BODY=$(head -c 2000 "$FAIL_FILE" 2>/dev/null)
if [ -z "$FAIL_BODY" ]; then
  exit 0
fi

# Idempotency: if we already commented within the last 4 minutes, skip
LAST_SENT=0
if [ -f "$SENTINEL" ]; then
  LAST_SENT=$(stat -f %m "$SENTINEL" 2>/dev/null || echo 0)
fi
NOW=$(date +%s)
if [ $((NOW - LAST_SENT)) -lt 240 ]; then
  # Already commented recently — the cron-job scheduler is re-firing the same FAIL
  exit 0
fi

# Comment on the incident card
TS=$(date "+%Y-%m-%d %H:%M:%S %Z")
COMMENT_BODY="[binance-bot-live-monitor @ $TS]

$FAIL_BODY

_(auto-posted by binance-bot-live-monitor.sh cron)"

hermes kanban comment "$INCIDENT_CARD" "$COMMENT_BODY" --author "binance-bot-monitor" 2>&1 | tail -3

# Update sentinel
date +%s > "$SENTINEL"

exit 0
