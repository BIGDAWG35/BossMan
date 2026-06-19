#!/bin/bash
# -----------------------------------------------------------------------------
# daily_pipeline.sh — full DAILY RADAR pipeline runner
#
# Stages:
#   1. census          — Stage 1 heat-tag scan (top 10 of 121 USDT pairs)
#   2a. briefs         — Stage 3 DeepSeek per-pair briefs (15 pairs)
#   2b. research_prompt- Stage 2 Phase A: generate research prompt file per coin
#   2c. research_run   — Stage 2 Phase B: Brave Search, fall back to internal
#   2d. research_finalize — Stage 2 finalize: merge into JSON for memo
#   3. memo            — Stage 4 DeepSeek synthesis (calls API 2x: draft + sanity)
#   4. decision        — Stage 5: write data/daily_radar.json for bot to read
#
# Degraded-mode contract:
#   - Any stage that fails logs to RUN_LOG and the pipeline continues
#   - Missing research → research_quality=PARTIAL, never blocks decisions
#   - Decision layer NEVER changes trading behavior without research; advisory only
#   - Bot continues under existing gates regardless of pipeline outcome
#
# Token + cost: each stage script logs tokens/cost; this wrapper aggregates them
# into $RUN_LOG and writes a top-level summary line.
#
# Cron target: midday local PDT — Stage 7 spec from 2026-06-19 card.
#
# Usage:
#   scripts/daily_pipeline.sh              # full run for today
#   scripts/daily_pipeline.sh --date YYYY-MM-DD  # backfill
#   scripts/daily_pipeline.sh --dry-run    # echo commands without executing
# -----------------------------------------------------------------------------

set -u  # do NOT use -e: degraded-mode means we keep going on failures

# ---- Paths ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
KNOWLEDGE_DIR="$HOME/.hermes/knowledge/crypto-intel/daily"
mkdir -p "$KNOWLEDGE_DIR"

# ---- Args ----
TARGET_DATE="$(date +%Y-%m-%d)"
DRY_RUN=0
while [ $# -gt 0 ]; do
  case "$1" in
    --date)     TARGET_DATE="$2"; shift 2 ;;
    --dry-run)  DRY_RUN=1; shift ;;
    -h|--help)
      sed -n '2,40p' "$0"; exit 0 ;;
    *)          echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

RUN_LOG="$KNOWLEDGE_DIR/run_log_${TARGET_DATE}.jsonl"
SUMMARY="$KNOWLEDGE_DIR/run_summary_${TARGET_DATE}.json"

# Clear stale run logs for this date (fresh run)
[ "$DRY_RUN" -eq 0 ] && : > "$RUN_LOG"

# ---- Helpers ----
# macOS BSD `date` doesn't support %3N (millisecond precision), so use Python
# for elapsed-time math.  Cheap (<10ms) and cross-platform-safe.
_now_ms() {
  python3 -c "import time; print(int(time.time()*1000))"
}

log_event() {
  local stage="$1" status="$2" elapsed_ms="$3" extra="$4"
  local ts; ts="$(python3 -c "import datetime; print(datetime.datetime.utcnow().isoformat()+'Z')")"
  printf '{"ts":"%s","stage":"%s","status":"%s","elapsed_ms":%s,"date":"%s"%s}\n' \
    "$ts" "$stage" "$status" "$elapsed_ms" "$TARGET_DATE" "$extra" >> "$RUN_LOG"
}

run_stage() {
  local label="$1"; shift
  local cmd=("$@")
  local t0 t1 elapsed_ms status out
  echo ""
  echo "=== $label ==="
  echo "+ ${cmd[*]}"
  if [ "$DRY_RUN" -eq 1 ]; then
    log_event "$label" "dry_run" 0 ""
    return 0
  fi
  t0=$(_now_ms)
  if out=$("${cmd[@]}" 2>&1); then
    status="ok"
  else
    status="fail"
  fi
  t1=$(_now_ms)
  elapsed_ms=$((t1 - t0))
  echo "$out" | tail -8
  log_event "$label" "$status" "$elapsed_ms" ""
  [ "$status" = "ok" ]
  return 0  # never abort — degraded mode
}

# ---- Stage 1: census ----
run_stage "stage_1_census" \
  node "$SCRIPT_DIR/daily_census.js"

# ---- Stage 3 briefs first (Stage 2 internal research depends on Stage 3) ----
run_stage "stage_3_briefs" \
  node "$SCRIPT_DIR/daily_pair_brief.js"

# ---- Stage 2 Phase A: research prompt generation (uses today; no --date flag) ----
run_stage "stage_2_phase_a_research_prompts" \
  node "$SCRIPT_DIR/daily_research.js" --phase-a

# ---- Stage 2 Phase B: research fetch (try Brave, fall back to internal) ----
if [ "$DRY_RUN" -eq 0 ]; then
  if ! out=$(node "$SCRIPT_DIR/daily_research.js" --phase-b-all --source brave 2>&1); then
    echo "[pipeline] Brave fetch failed or rate-limited, falling back to internal-only derivation"
    log_event "stage_2_phase_b_brave" "fallback_to_internal" 0 ',"reason":"brave_failed_or_rate_limited"'
    run_stage "stage_2_phase_b_internal_fallback" \
      node "$SCRIPT_DIR/daily_research.js" --phase-b-all --source internal
  else
    log_event "stage_2_phase_b_brave" "ok" 0 ""
    echo "$out" | tail -5
  fi
else
  log_event "stage_2_phase_b_brave" "dry_run" 0 ""
fi

# ---- Stage 2 finalize (uses today; no --date flag) ----
run_stage "stage_2_finalize" \
  node "$SCRIPT_DIR/daily_research.js" --finalize

# ---- Stage 4: memo (DeepSeek) ----
run_stage "stage_4_memo" \
  node "$SCRIPT_DIR/daily_memo.js" --date "$TARGET_DATE"

# ---- Stage 5: decision ----
run_stage "stage_5_decision" \
  node "$SCRIPT_DIR/daily_decision.js" --date "$TARGET_DATE"

# ---- Summary ----
if [ "$DRY_RUN" -eq 0 ]; then
  echo ""
  echo "=== run summary ==="
  # Aggregate run_log into a summary object
  node -e "
    const fs = require('fs');
    const lines = fs.readFileSync('$RUN_LOG', 'utf8').trim().split('\n').filter(Boolean);
    const events = lines.map(l => JSON.parse(l));
    const stages = events.map(e => ({ stage: e.stage, status: e.status, elapsed_ms: e.elapsed_ms }));
    const total_ms = events.reduce((s, e) => s + (e.elapsed_ms || 0), 0);
    const failed = events.filter(e => e.status === 'fail').length;
    const ok = events.filter(e => e.status === 'ok').length;
    const summary = {
      date: '$TARGET_DATE',
      completed_at: new Date().toISOString(),
      total_stages: events.length,
      ok_count: ok,
      failed_count: failed,
      total_elapsed_ms: total_ms,
      stages,
    };
    fs.writeFileSync('$SUMMARY', JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  "
  echo ""
  echo "Run log:    $RUN_LOG"
  echo "Run summary: $SUMMARY"
fi

exit 0