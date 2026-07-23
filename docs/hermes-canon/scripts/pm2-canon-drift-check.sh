#!/bin/bash
# pm2-canon-drift-check.sh — Detect silent drift in LEARNED_PM2_HEALTH_MONITOR.md
#
# Permanent 2026-07-22 (Card t_learned_pm2_health_monitor_driftfix_20260722).
# Companion file: LEARNED_PM2_HEALTH_MONITOR.md
#
# What it does:
#   1. Computes md5 of LEARNED_PM2_HEALTH_MONITOR.md (full file + 3 protected sections)
#   2. Compares to baseline stored in ~/.hermes/state/pm2-canon-baseline.json
#   3. If any hash differs → drift detected → create kanban card + log + alert
#   4. Mirrors (Obsidian + BossMan repo) also verified
#
# Schedule: every 6 hours via cron (or call manually)
# Exit codes:
#   0 = no drift
#   1 = drift detected (file modified, no matching PHASEREPORT entry)
#   2 = baseline missing (first run, create baseline)
#   3 = mirror drift (file changed but mirrors haven't updated)
#
# Compatibility: macOS bash 3.2.57 (no associative arrays, no `declare -A`)

set -uo pipefail

CANON=~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md
MIRROR_OBS=~/Obsidian/Hermes/V3-Canon/V3\ –\ PM2\ Health\ Monitor.md
MIRROR_REPO=~/Repos/BossMan/docs/hermes-canon/LEARNED_PM2_HEALTH_MONITOR.md
BASELINE=~/.hermes/state/pm2-canon-baseline.json
LOG=~/.hermes/logs/pm2-canon-drift-check.log
KANBAN_DB=~/.hermes/kanban/boards/bossman/kanban.db

log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*" | tee -a "$LOG" >&2; }

# ── All the work happens in Python (portable, no bash array issues) ──────
python3 << PYEOF
import os, sys, json, hashlib, subprocess, datetime, sqlite3

CANON = os.path.expanduser("~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md")
MIRROR_OBS = os.path.expanduser("~/Obsidian/Hermes/V3-Canon/V3 – PM2 Health Monitor.md")
MIRROR_REPO = os.path.expanduser("~/Repos/BossMan/docs/hermes-canon/LEARNED_PM2_HEALTH_MONITOR.md")
BASELINE = os.path.expanduser("~/.hermes/state/pm2-canon-baseline.json")
LOG = os.path.expanduser("~/.hermes/logs/pm2-canon-drift-check.log")
KANBAN_DB = os.path.expanduser("~/.hermes/kanban/boards/bossman/kanban.db")

SECTION_MARKERS = [
    "## PM2 CLI Usage Policy",
    "## CLI Wrapper Rollout Complete",
    "## pmd-web Auto-Repair Rule",
]

def log(msg):
    line = "[{}] {}".format(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S %Z"), msg)
    with open(LOG, "a") as f:
        f.write(line + "\n")
    print(line)

def md5_file(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()

def extract_section(content, marker):
    """Extract content from `marker` line until the next `## ` heading."""
    lines = content.split("\n")
    start = None
    for i, line in enumerate(lines):
        if line.strip().startswith(marker):
            start = i
            break
    if start is None:
        return ""
    # Capture until next `## ` (but not the marker itself)
    buf = [lines[start]]
    for line in lines[start + 1:]:
        if line.startswith("## ") and not line.startswith(marker):
            break
        buf.append(line)
    return "\n".join(buf)

# ── Compute current state ────────────────────────────────────────────────
if not os.path.exists(CANON):
    log("FAIL: {} does not exist".format(CANON))
    sys.exit(99)

current_md5 = md5_file(CANON)
log("Current md5: {}".format(current_md5))

with open(CANON, "r") as f:
    content = f.read()

current_sections = {}
for marker in SECTION_MARKERS:
    sec = extract_section(content, marker)
    h = hashlib.md5(sec.encode("utf-8")).hexdigest()
    current_sections[marker] = h
    log("  section '{}' hash: {}".format(marker, h))

# Mirror check
obs_md5 = md5_file(MIRROR_OBS) if os.path.exists(MIRROR_OBS) else None
repo_md5 = md5_file(MIRROR_REPO) if os.path.exists(MIRROR_REPO) else None
if obs_md5 is None:
    log("WARN: Obsidian mirror missing")
if repo_md5 is None:
    log("WARN: BossMan repo mirror missing")

# ── First run: create baseline ──────────────────────────────────────────
os.makedirs(os.path.dirname(BASELINE), exist_ok=True)
os.makedirs(os.path.dirname(LOG), exist_ok=True)

if not os.path.exists(BASELINE):
    log("First run: creating baseline at {}".format(BASELINE))
    data = {
        "created_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "card": "t_learned_pm2_health_monitor_driftfix_20260722",
        "file_md5": current_md5,
        "sections": current_sections,
        "comment": "Initial baseline after Card t_learned_pm2_health_monitor_driftfix_20260722. Update only via the standard edit-and-mirror flow (add PHASEREPORT entry, then update baseline hash).",
    }
    with open(BASELINE, "w") as f:
        json.dump(data, f, indent=2)
    log("Baseline created. Future runs will detect drift.")
    sys.exit(0)

# ── Compare to baseline ────────────────────────────────────────────────
with open(BASELINE, "r") as f:
    baseline = json.load(f)

drift = False
drift_details = []

baseline_md5 = baseline.get("file_md5", "")
if baseline_md5 and baseline_md5 != current_md5:
    drift = True
    drift_details.append("  - full file md5: {} → {}".format(baseline_md5, current_md5))

baseline_sections = baseline.get("sections", {})
for marker, current_hash in current_sections.items():
    baseline_hash = baseline_sections.get(marker, "")
    if baseline_hash and baseline_hash != current_hash:
        drift = True
        drift_details.append("  - section '{}' hash: {} → {}".format(marker, baseline_hash, current_hash))

if obs_md5 and obs_md5 != current_md5:
    drift = True
    drift_details.append("  - Obsidian mirror md5: {} (expected {})".format(obs_md5, current_md5))
if repo_md5 and repo_md5 != current_md5:
    drift = True
    drift_details.append("  - BossMan repo mirror md5: {} (expected {})".format(repo_md5, current_md5))

if not drift:
    log("OK: no drift detected")
    sys.exit(0)

# ── Drift detected ────────────────────────────────────────────────────
log("DRIFT DETECTED:")
for line in drift_details:
    log(line)

# ── Create kanban card ────────────────────────────────────────────────
card_id = "t_drift_pm2_canon_{}".format(datetime.datetime.now().strftime("%Y%m%d_%H%M%S"))
body = """project: Infra

**DRIFT DETECTED in LEARNED_PM2_HEALTH_MONITOR.md by pm2-canon-drift-check.sh (run {ts})**

Drift details:
```
{details}
```

**Expected action by operator:**
1. Check if the drift is intentional (a new card is updating the canon — look for recent PHASEREPORT entries)
2. If intentional: append a PHASEREPORT entry + update baseline: `python3 -c "import json; d=json.load(open('$BASELINE')); d['file_md5']='$current_md5'; d['sections']={...}; json.dump(d, open('$BASELINE','w'), indent=2)"`
3. If unintentional: the canon was reverted by a stray process. Restore from the most recent known-good state. Investigate which process wrote the drift (check `hermes agent logs` + recent sub-agent runs).

**Background:** Card t_learned_pm2_health_monitor_driftfix_20260722 (2026-07-22) installed this drift-check after observing silent reverts of the 'PM2 CLI Usage Policy' section across multiple work sessions.

STATUS: todo""".format(
    ts=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    details="\n".join(drift_details),
    BASELINE=BASELINE,
    current_md5=current_md5,
)

if os.path.exists(KANBAN_DB):
    try:
        conn = sqlite3.connect(KANBAN_DB)
        cur = conn.cursor()
        now = int(datetime.datetime.now(datetime.timezone.utc).timestamp())
        cur.execute(
            "INSERT INTO tasks (id, title, body, assignee, status, priority, created_at, max_runtime_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (card_id, "DRIFT in LEARNED_PM2_HEALTH_MONITOR.md", body, "ops", "todo", "high", now, 600),
        )
        conn.commit()
        conn.close()
        log("  created kanban card: {}".format(card_id))
    except Exception as e:
        log("  ERROR: failed to create kanban card: {}".format(e))
else:
    log("  kanban DB not found; skipping card creation")

# ── Telegram alert (best-effort) ────────────────────────────────────
try:
    subprocess.run(
        ["hermes", "exec", "notify", "--message", "🚨 DRIFT in LEARNED_PM2_HEALTH_MONITOR.md — {}".format(card_id)],
        capture_output=True, timeout=10,
    )
except Exception:
    pass  # best-effort

sys.exit(1)
PYEOF
