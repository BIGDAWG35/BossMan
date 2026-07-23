#!/usr/bin/env bash
# hermes-canon-drift-check.sh — periodic drift verification across Hermes / Obsidian / GitHub.
#
# Permanent 2026-07-20: invoked by the doc-hygiene goal loop on its monthly cadence.
#
# Compares md5 of the 4 V3 canonical files across:
#   - Hermes canon source: ~/.hermes/knowledge/
#   - Obsidian mirror: ~/Obsidian/Hermes/V3-Canon/
#   - GitHub mirror:    ~/Repos/BossMan/docs/hermes-canon/
#
# On drift: writes a kanban card (via direct DB insert) and a summary log.
# On clean: silent unless --verbose.

set -euo pipefail

CANON_DIR=~/.hermes/knowledge
OBS_DIR=~/Obsidian/Hermes/V3-Canon
GH_DIR=~/Repos/BossMan/docs/hermes-canon

CANON_FILES=(
  "ROLES_AND_CHAIN_OF_COMMAND.md|ROLES_AND_CHAIN_OF_COMMAND.md|V3 – Roles and Chain of Command.md"
  "LEARNED_7_RULE_CONTRACT.md|LEARNED_7_RULE_CONTRACT.md|V3 – 7-Rule Contract.md"
  "LEARNED_V3_MODEL_STACK.md|LEARNED_V3_MODEL_STACK.md|V3 – Model Stack and Routing.md"
  "LEARNED_V3_TOKEN_ECONOMICS.md|LEARNED_V3_TOKEN_ECONOMICS.md|V3 – Token Economics.md"
  # Permanent 2026-07-22 (Card t_learned_pm2_health_monitor_driftfix_20260722):
  # Add LEARNED_PM2_HEALTH_MONITOR.md to the drift-check — this file is the canonical
  # source of truth for the PM2 CLI wrapper policy + pmd-web auto-repair rule. Drift
  # detection is critical because the file has been silently reverted by a stray
  # process in past work sessions.
  "LEARNED_PM2_HEALTH_MONITOR.md|LEARNED_PM2_HEALTH_MONITOR.md|V3 – PM2 Health Monitor.md"
)

LOG_DIR=~/.hermes/archive/hermes-canon-drift
TS=$(date +%Y%m%d_%H%M%S)
LOG="$LOG_DIR/drift-check-$TS.log"
mkdir -p "$LOG_DIR"
exec >>"$LOG" 2>&1

VERBOSE=false
for arg in "$@"; do
  case "$arg" in
    --verbose|-v) VERBOSE=true ;;
  esac
done

echo "═══════════════════════════════════════════════════════════════"
echo "  hermes-canon-drift-check — $TS"
echo "═══════════════════════════════════════════════════════════════"

DRIFT_COUNT=0
DRIFT_REPORT=""

for ROW in "${CANON_FILES[@]}"; do
  IFS='|' read -r CANON GH OBS <<< "$ROW"
  C="$CANON_DIR/$CANON"
  G="$GH_DIR/$GH"
  O="$OBS_DIR/$OBS"

  C_MD5=""
  G_MD5=""
  O_MD5=""
  C_HASH="(missing)"
  G_HASH="(missing)"
  O_HASH="(missing)"

  # Strip mirror frontmatter + leading metadata blockquote before hashing so we
  # compare bodies only. Uses ~/.hermes/scripts/lib/strip_mirror_metadata.awk.
  strip_mirror_metadata() {
    awk -f ~/.hermes/scripts/lib/strip_mirror_metadata.awk "$1"
  }

  [ -f "$C" ] && C_MD5=$(printf "%s" "$(strip_mirror_metadata "$C")" | md5 -q)
  [ -f "$G" ] && G_MD5=$(printf "%s" "$(strip_mirror_metadata "$G")" | md5 -q)
  [ -f "$O" ] && O_MD5=$(printf "%s" "$(strip_mirror_metadata "$O")" | md5 -q)

  [ -n "$C_MD5" ] && C_HASH="$C_MD5"
  [ -n "$G_MD5" ] && G_HASH="$G_MD5"
  [ -n "$O_MD5" ] && O_HASH="$O_MD5"

  STATUS="OK"
  if [ "$C_MD5" != "$G_MD5" ] || [ "$C_MD5" != "$O_MD5" ]; then
    STATUS="DRIFT"
    DRIFT_COUNT=$((DRIFT_COUNT + 1))
    DRIFT_REPORT="${DRIFT_REPORT}
  - $CANON
    canon: $C_HASH
    obs:   $O_HASH
    gh:    $G_HASH"
  fi

  if $VERBOSE || [ "$STATUS" = "DRIFT" ]; then
    echo "  [$STATUS] $CANON"
    echo "    canon: $C_HASH"
    echo "    obs:   $O_HASH"
    echo "    gh:    $G_HASH"
  fi
done

echo ""
echo "Total drift: $DRIFT_COUNT file(s)"

# Permanent 2026-07-22 (Card t_agents_md_prune_driftfix_20260722):
# Special-case check for AGENTS.md (at ~/.hermes/AGENTS.md, NOT in knowledge/).
# Also checks SOUL.md (similar location). Both are kernel-docs with size budgets.

for KERNEL_FILE in "AGENTS.md" "SOUL.md"; do
  case "$KERNEL_FILE" in
    AGENTS.md) CANON=~/.hermes/AGENTS.md; OBS=~/Obsidian/Hermes/AGENTS.md; GH=~/Repos/BossMan/docs/hermes-canon/AGENTS.md ;;
    SOUL.md) CANON=~/.hermes/SOUL.md; OBS=~/Obsidian/Hermes/SOUL.md; GH=~/Repos/BossMan/docs/hermes-canon/SOUL.md ;;
  esac

  C_MD5=""
  G_MD5=""
  O_MD5=""
  if [ -f "$CANON" ]; then
    C_MD5=$(md5 -q "$CANON")
    SIZE=$(wc -c < "$CANON")
    if [ "$SIZE" -gt 40960 ]; then  # 40 KB hard cap
      STATUS="SIZE_VIOLATION"
      DRIFT_COUNT=$((DRIFT_COUNT + 1))
      DRIFT_REPORT="${DRIFT_REPORT}
  - $KERNEL_FILE: SIZE $SIZE bytes > 40 KB cap"
    fi
  fi
  [ -f "$OBS" ] && O_MD5=$(md5 -q "$OBS")
  [ -f "$GH" ] && G_MD5=$(md5 -q "$GH")

  if [ -n "$C_MD5" ] && [ -n "$G_MD5" ] && [ "$C_MD5" != "$G_MD5" ]; then
    STATUS="DRIFT"
    DRIFT_COUNT=$((DRIFT_COUNT + 1))
    DRIFT_REPORT="${DRIFT_REPORT}
  - $KERNEL_FILE: canon ${C_MD5} != gh ${G_MD5}"
  fi
  if [ -n "$C_MD5" ] && [ -n "$O_MD5" ] && [ "$C_MD5" != "$O_MD5" ]; then
    STATUS="DRIFT"
    DRIFT_COUNT=$((DRIFT_COUNT + 1))
    DRIFT_REPORT="${DRIFT_REPORT}
  - $KERNEL_FILE: canon ${C_MD5} != obs ${O_MD5}"
  fi

  if $VERBOSE; then
    echo "  [$KERNEL_FILE] canon=$C_MD5 obs=$O_MD5 gh=$G_MD5"
  fi
done

if [ $DRIFT_COUNT -gt 0 ]; then
  echo ""
  echo "Drift detected. Surfacing kanban card..."

  # Insert kanban card (t_drift_fix_v3_canon_…)
  CARD_ID="t_drift_fix_v3_canon_${TS}"
  NOW=$(date +%s)

  # We DO NOT silently fix; we surface for review.
  python3 - "$CARD_ID" "$NOW" "$DRIFT_REPORT" <<'PY'
import sqlite3, sys
card_id, now, drift = sys.argv[1], int(sys.argv[2]), sys.argv[3]
db = "/Users/bigdawg/.hermes/kanban/boards/bossman/kanban.db"
body = f"""project: Cross-Cutting

# V3 canon drift detected — review

The doc-hygiene loop detected {drift.count('-')} file(s) out of sync across Hermes / Obsidian / GitHub mirrors.

## Drift
{drift}

## Action
1. Review which source is authoritative (Hermes canon in ~/.hermes/knowledge/ wins)
2. Re-run `bash ~/.hermes/scripts/hermes-canon-sync.sh` to bring GitHub mirror in sync
3. Re-run `bash ~/.hermes/scripts/hermes-canon-sync.sh` then manually refresh Obsidian V3-Canon folder if needed
4. Do NOT edit Obsidian/GitHub mirrors to "fix" them — only edit Hermes canon

## Operator note
This card is created automatically by the drift-check script. The loop never silently rewrites mirrors.
"""

conn = sqlite3.connect(db); cur = conn.cursor()
cur.execute("""
INSERT OR REPLACE INTO tasks (id, title, body, status, priority, assignee, created_at, started_at)
VALUES (?, ?, ?, 'todo', 2, 'bossman', ?, ?)
""", (card_id, "V3 canon drift — review and re-sync", body, now, now))
conn.commit()
conn.close()
print(f"  ✓ Card created: {card_id}")
PY
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Layer-2 Loop-Health drift patterns (Permanent 2026-07-22, Card B)"
echo "═══════════════════════════════════════════════════════════════"

LOOP_HEALTH_DB=~/.hermes/kanban/boards/bossman/kanban.db
LOOP_HEALTH_DRIFT_COUNT=0
LOOP_HEALTH_DRIFT_REPORT=""

if [ -f "$LOOP_HEALTH_DB" ]; then
  # Run python scanner; emit a kanban drift-fix card if any pattern hits
  python3 << 'PYLOOP'
import sqlite3, re, sys, time

db = "/Users/bigdawg/.hermes/kanban/boards/bossman/kanban.db"
conn = sqlite3.connect(db); cur = conn.cursor()

# Patterns — each tuple: (pattern_name, regex_applied_to_body)
DRIFT_PATTERNS = [
    ("marcelo-as-relay",
     r"ask Marcelo (to interpret|what this means)|ask Big Dawg to relay",
     "Card body uses Marcelo as relay/log-interpreter pattern (Layer-2 violation)."),
    ("missing-step5-evidence",
     r"qa_required:\s*yes(?!.*qastatus:\s*passed)",
     "Critical card has `qa_required: yes` but no `qastatus: passed` Step-5 evidence."),
    ("loop-complete-yes-but-no-perplexity",
     r"loop_complete:\s*yes(?!.*perplexity_first:\s*yes)",
     "Card claims loop_complete=yes but perplexity_first is not yes — Perplexity-first rule violation."),
    ("loop-complete-yes-but-no-knowledge-capture",
     r"loop_complete:\s*yes(?!.*knowledge_capture:\s*yes)",
     "Card claims loop_complete=yes but knowledge_capture is not yes — missing reusable output capture."),
]

def strip_code_blocks(text):
    """Remove fenced code blocks and indented blocks before pattern matching.
    Prevents false positives on schema examples like:
      loop_complete: yes | no   # in a ```yaml code block
    """
    # Remove fenced code blocks (```...```)
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Remove indented blocks (lines starting with 4+ spaces)
    text = re.sub(r'^    .*$', '', text, flags=re.MULTILINE)
    return text

cur.execute("SELECT id, title, body FROM tasks WHERE status='done' AND body LIKE '%routing_ledger:%'")
findings = []  # list of (pattern_name, card_id, title)
for cid, title, body in cur.fetchall():
    if not body:
        continue
    # Strip code blocks so schema examples in docs don't trigger false positives
    body_scan = strip_code_blocks(body)
    for pname, regex, _desc in DRIFT_PATTERNS:
        # Use lookahead only when the regex already contains it (negative patterns above do)
        if re.search(regex, body_scan, re.DOTALL):
            findings.append((pname, cid, title))

conn.close()

if not findings:
    print("  OK: no loop-health drift findings on done cards")
    sys.exit(0)

print(f"  {len(findings)} drift finding(s):")
for pname, cid, title in findings:
    print(f"    [{pname}] {cid}: {title[:70]}")

# Create ONE drift-fix card consolidating findings (Permanent rule: don't spam)
now = int(time.time())
card_id = f"t_drift_fix_layer2_loop_health_{now}"
body = f"""project: Cross-Cutting

# Layer-2 Loop-Health drift — review

The Layer-2 closed-loop autonomy drift-scan found {len(findings)} finding(s) on done cards.

## Patterns detected

"""
for pname, cid, title in findings:
    body += f"- **[{pname}]** `{cid}` — {title[:90]}\n"

body += """
## Action
1. Review each finding above.
2. Open sub-cards (linked to this parent) for individual fixes.
3. BossMan addresses each — does NOT escalate to Marcelo unless V3 carve-out triggers.

## Operator note
This card is created automatically by `hermes-canon-drift-check.sh` (Layer-2 pattern set, Permanent 2026-07-22 Card B). The drift-scan never silently rewrites history.
"""

conn = sqlite3.connect(db); cur = conn.cursor()
cur.execute("""
INSERT OR REPLACE INTO tasks (id, title, body, status, priority, assignee, created_at, started_at)
VALUES (?, ?, ?, 'todo', 2, 'bossman', ?, ?)
""", (card_id, "Layer-2 Loop-Health drift — review", body, now, now))
conn.commit()
conn.close()
print(f"  ✓ Card created: {card_id}")
PYLOOP
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  hermes-canon-drift-check — done"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Log: $LOG"