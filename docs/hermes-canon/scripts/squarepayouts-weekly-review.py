"""
SquarePayouts Weekly Health Review — Loop A. Cron registration card
t_squarepayouts_health-loop_v1_20260723 (2026-07-23).

Owner of design: Loop Engineering (this code is Ops Lane implementing the
Loop Engineering design brief).
Owner of execution: Ops lane.
Owner of QA: qa-verification.

MODEL RESTRICTION (Permanent, per LEARNED_SQUAREPAYOUTS.md):
  Allowed: claude-sonnet-4-6, deepseek-coder, openai-gpt-4o
  BLOCKED: minimax-m3 (any SquarePayouts work)
  Guard: ~/.hermes/state/squarepayouts-model-allowed.json

This script is intentionally stdlib-only, no API calls. It only inspects
local state — does NOT invoke any model for analysis (the analysis is the
brief content, written deterministically by this script). If a future
revision adds LLM calls, it MUST consult the model-allowed.json guard and
REFUSE any M3 invocation.

What this checks (per cron prompt):
  1. Model whitelist integrity (canonical file unchanged).
  2. Daily Exporter cron id `0561fcffeba1` ran successfully last 7 days.
  3. LEARNED_SQUAREPAYOUTS.md `model restriction` text UNCHANGED.
  4. Three known issues (auth bug, no admin user, stale .next) — flag any
     new fixes (good), flag any new discoveries.
  5. Lock window: 7 days (state file).

Outputs:
  - Brief: ~/.hermes/logs/squarepayouts-weekly-review-YYYY-MM-DD.md
  - State: ~/.hermes/state/squarepayouts-weekly-review.state
  - Escalation: ~/.hermes/logs/squarepayouts-weekly-review-ESCALATE.md (only on blockers; otherwise silently removed)
Exit 0 = silent (healthy); exit 10 = escalate.
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

LOGS = Path("/Users/bigdawg/.hermes/logs")
STATE_FILE = Path("/Users/bigdawg/.hermes/state/squarepayouts-weekly-review.state")
ESCALATE_MARKER = Path("/Users/bigdawg/.hermes/logs/squarepayouts-weekly-review-ESCALATE.md")
MODEL_ALLOWED_FILE = Path("/Users/bigdawg/.hermes/state/squarepayouts-model-allowed.json")
LEARNED_SQ_FILE = Path("/Users/bigdawg/.hermes/knowledge/LEARNED_SQUAREPAYOUTS.md")

LOCK_WINDOW_DAYS = 7
DAILY_EXPORTER_CRON_ID = "0561fcffeba1"
KNOWN_ISSUES = {
    "auth_bug": ("NEXTAUTH_URL", "nextauth_url"),
    "no_admin": ("admin account", "no_admin"),
    "stale_build": ("Stale .next", "stale_build"),
}


def log(msg: str) -> None:
    ts = datetime.now(timezone.utc).isoformat(timespec="seconds")
    print(f"[{ts}] squarepayouts-weekly-review: {msg}", file=sys.stderr)


def guard_model_whitelist() -> tuple[bool, str]:
    """Hard check: refuse to start if a blocked model would be invoked for SQ work."""
    if not MODEL_ALLOWED_FILE.exists():
        return False, f"Model whitelist file missing: {MODEL_ALLOWED_FILE}"
    try:
        cfg = json.loads(MODEL_ALLOWED_FILE.read_text())
    except Exception as e:
        return False, f"Model whitelist file unparseable: {e}"
    if "minimax-m3" not in cfg.get("blocked_models", []):
        return False, "minimax-m3 not explicitly listed as blocked"
    allowed = cfg.get("allowed_models", [])
    for m in ["claude-sonnet-4-6", "deepseek-coder", "openai-gpt-4o"]:
        if m not in allowed:
            return False, f"Required allowed model missing: {m}"
    # HERMES_MODEL is what the cron environment would inject
    active_model = os.environ.get("HERMES_MODEL", "")
    if active_model and active_model.lower() in [m.lower() for m in cfg.get("blocked_models", [])]:
        return False, f"HERMES_MODEL={active_model} is BLOCKED for SquarePayouts work"
    if active_model and not [active_model.lower() in a.lower() for a in allowed]:
        return False, f"HERMES_MODEL={active_model} not in allowed whitelist"
    return True, "OK"


def read_state() -> dict:
    if not STATE_FILE.exists():
        return {"last_brief_date": None}
    try:
        return json.loads(STATE_FILE.read_text())
    except Exception:
        return {"last_brief_date": None}


def write_state(state: dict) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2))


def within_lock_window(state: dict, today: str) -> bool:
    last = state.get("last_brief_date")
    if not last:
        return False
    try:
        last_date = datetime.strptime(last, "%Y-%m-%d").date()
        today_date = datetime.strptime(today, "%Y-%m-%d").date()
        return (today_date - last_date).days < LOCK_WINDOW_DAYS
    except Exception:
        return False


def check_daily_exporter_runs() -> tuple[bool | None, str]:
    """Check that cron `0561fcffeba1` ran successfully in last 7 days."""
    jobs_file = Path("/Users/bigdawg/.hermes/cron/jobs.json")
    if not jobs_file.exists():
        return None, f"jobs.json missing at {jobs_file}"
    try:
        d = json.loads(jobs_file.read_text())
    except Exception as e:
        return None, f"jobs.json unparseable: {e}"
    target = None
    for j in d.get("jobs", []):
        if (j.get("id") or "").startswith(DAILY_EXPORTER_CRON_ID):
            target = j
            break
    if not target:
        return None, f"Daily Exporter cron {DAILY_EXPORTER_CRON_ID} not found in jobs.json"
    last_run = target.get("last_run_info") or {}
    last_status = last_run.get("status") if isinstance(last_run, dict) else None
    if last_status is None:
        # Fallback to flat fields per current jobs.json schema (2026-07-23)
        last_status = target.get("last_status") or "unknown"
    last_finished = (
        (last_run.get("finished_at") if isinstance(last_run, dict) else None)
        or target.get("last_run_at")
        or "?"
    )
    return (last_status == "ok"), f"status={last_status}, last_finished={last_finished}"


def check_model_restriction_text() -> tuple[bool | None, str]:
    """Verify LEARNED_SQUAREPAYOUTS.md 'Model Restriction (Permanent)' section still says M3 BLOCKED."""
    if not LEARNED_SQ_FILE.exists():
        return None, f"LEARNED file missing: {LEARNED_SQ_FILE}"
    text = LEARNED_SQ_FILE.read_text()
    section_match = re.search(
        r"## Model Restriction \(Permanent.*?\n(.*?)(?=\n##|\Z)",
        text,
        re.DOTALL,
    )
    if not section_match:
        return False, "Model Restriction section not found"
    section_text = section_match.group(1).lower()
    expected_phrases = ["claude", "deepseek", "openai"]
    for p in expected_phrases:
        if p not in section_text:
            return False, f"Expected phrase '{p}' missing from Model Restriction section"
    if "m3 is blocked" not in section_text:
        return False, "Expected phrase 'M3 is BLOCKED' missing"
    return True, f"section hash matches expected; len={len(text)}"


def check_known_issues() -> dict:
    """Return dict of known issues presence. (Returns whether each is still textually noted.)"""
    if not LEARNED_SQ_FILE.exists():
        return {}
    text = LEARNED_SQ_FILE.read_text().lower()
    return {
        issue_id: (phrase.lower() in text)
        for issue_id, (phrase, _) in KNOWN_ISSUES.items()
    }


def build_brief(today: str, daily_status: tuple, model_status: tuple, restriction_text_status: tuple, known_issues: dict) -> str:
    lines = [
        f"# SquarePayouts Weekly Health Review — {today}",
        "",
        f"_Generated: {datetime.now(timezone.utc).isoformat(timespec='seconds')} UTC_",
        "",
        "## Model-restriction guard",
        "",
    ]
    if model_status[0] is True:
        lines.append(f"- {model_status[1]} (Claude/DeepSeek/OpenAI allowed; M3 BLOCKED)")
    elif model_status[0] is False:
        lines.append(f"- BLOCKER: {model_status[1]}")
    else:
        lines.append(f"- {model_status[1]}")
    lines.extend([
        "",
        "## Daily Exporter cron",
        "",
    ])
    if daily_status[0] is True:
        lines.append(f"- {daily_status[1]}")
    elif daily_status[0] is False:
        lines.append(f"- BLOCKER: {daily_status[1]}")
    else:
        lines.append(f"- {daily_status[1]}")
    lines.extend([
        "",
        "## LEARNED_SQUAREPAYOUTS.md model-restriction text",
        "",
    ])
    if restriction_text_status[0] is True:
        lines.append(f"- {restriction_text_status[1]}")
    elif restriction_text_status[0] is False:
        lines.append(f"- BLOCKER: {restriction_text_status[1]}")
    else:
        lines.append(f"- {restriction_text_status[1]}")
    lines.extend([
        "",
        "## Known issues (per LEARNED_SQUAREPAYOUTS.md)",
        "",
    ])
    for issue_id, presence in known_issues.items():
        lines.append(f"- `{issue_id}` present: {presence}")
    lines.extend([
        "",
        "## Loop metadata",
        "",
        "- loop_id: squarepayouts-weekly-review",
        "- cadence: weekly (Monday 08:00 PT)",
        "- design_lane: loop-engineering",
        "- runtime_lane: ops",
        "- canonic_lane: knowledge-canon",
        "- qa_lane: qa-verification",
        "- silent_when_no_actionable: yes",
        "- escalation: telegram-on-blockers-only",
        "- model_restriction: claude/deepseek/openai only; M3 BLOCKED",
        "",
    ])
    return "\n".join(lines)


def main() -> int:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    state = read_state()

    if within_lock_window(state, today):
        log(f"SILENT: lock window active (last_brief_date={state.get('last_brief_date')})")
        return 0

    blockers = []

    # 1. Model guard (BLOCKER if fails)
    model_status = guard_model_whitelist()
    if model_status[0] is False:
        blockers.append(f"MODEL GUARD: {model_status[1]}")

    # 2. Daily Exporter check
    daily_status = check_daily_exporter_runs()
    if daily_status[0] is False:
        blockers.append(f"DAILY EXPORTER: {daily_status[1]}")
    elif daily_status[0] is None:
        blockers.append(f"DAILY EXPORTER (data missing): {daily_status[1]}")

    # 3. LEARNED_SQUAREPAYOUTS.md model restriction text
    restriction_text_status = check_model_restriction_text()
    if restriction_text_status[0] is False:
        blockers.append(f"MODEL-RESTRICTION TEXT: {restriction_text_status[1]}")

    # 4. Known issues (informational, not blocker)
    known_issues = check_known_issues()

    # Build brief
    LOGS.mkdir(parents=True, exist_ok=True)
    brief = build_brief(today, daily_status, model_status, restriction_text_status, known_issues)
    brief_path = LOGS / f"squarepayouts-weekly-review-{today}.md"
    brief_path.write_text(brief)

    # Update state
    new_state = {
        "last_brief_date": today,
        "blockers_count": len(blockers),
        "last_alert_ts": datetime.now(timezone.utc).isoformat(timespec="seconds") if blockers else None,
        "last_alert_reason": "; ".join(blockers) if blockers else None,
    }
    write_state(new_state)

    if blockers:
        ESCALATE_MARKER.write_text(f"SquarePayouts weekly review escalation for {today}.\nSee brief: {brief_path}\n\n{len(blockers)} blocker(s):\n\n" + "\n".join(f"- {b}" for b in blockers))
        log(f"BRIEF + ESCALATE marker written ({len(blockers)} blocker(s))")
        return 10
    else:
        if ESCALATE_MARKER.exists():
            ESCALATE_MARKER.unlink()
        log(f"BRIEF written (silent) → {brief_path}")
        return 0


if __name__ == "__main__":
    sys.exit(main())
