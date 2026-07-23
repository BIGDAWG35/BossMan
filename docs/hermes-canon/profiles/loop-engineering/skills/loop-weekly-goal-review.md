---
name: loop-weekly-goal-review
description: |
  Skill: design / design-review / audit of weekly goal-review loops.
  When to load: Loop Engineering is asked to design a new weekly goal-review
  loop (e.g., weekly portfolio review, weekly content pipeline review),
  audit an existing weekly loop for cadence/spam compliance, or write
  the prompt for a scheduled `Weekly review` cron tick.
  Source card: t_subagent_loop_rollout_v1_20260723 (Phase 2), 2026-07-23.
version: 1.0
---

# loop-weekly-goal-review

**Purpose.** Define a reusable workflow for designing and operating **weekly goal-review loops** — recurring scheduled tasks that review goal progress, surface blockers, and route follow-ups without spamming Marcelo.

**When to load this skill.** BossMan dispatched Loop with one of:
- a kanban card body that names a weekly cadence ("weekly review", "Sunday 6pm PT", "every Monday morning")
- an existing weekly loop that needs cadence / no-spam / artifact-destination review
- a "design a weekly review for X" request

If the work is one-off (single project, no recurrence), DO NOT load this skill — close as outside-of-loop scope and route to a different lane.

---

## 1. Inputs the skill expects

| Field | Source | Required? |
|---|---|---|
| Goal name + owner | handoff packet | yes |
| Existing loop (if any) — `cron_id` / `scripts/<name>.sh` / `LEARNED_<DOMAIN>.md` | handoff packet or `~/.hermes/scripts/` | yes if auditing |
| Cadence preference | BossMan / Marcelo | yes (or design-cadence-call) |
| Data sources (logs, APIs, files) | handoff packet | yes |
| Artifact destination (LEARNED_*.md / kanban comment / log file) | handoff packet | yes |
| No-spam constraints | handoff packet | yes |

---

## 2. The design workflow (5 steps)

### 2.1 — Verify it belongs to Loop

Ask: **does this work have recurring cadence?** If no, hand off to the lane that owns the work (Builder, Trading, etc.) and stop. Loop is for loops, not one-offs.

### 2.2 — Read the existing canonical record

Before designing, read:
- `~/.hermes/knowledge/loop-engineering-goals.md` (Loop's lane contract)
- The handoff packet's `blueprint_ref` / `LEARNED_<DOMAIN>.md` if present
- `~/.hermes/scripts/<existing-loop>.sh` if reviewing an existing loop
- The cron row in `~/.hermes/cron/jobs.json` (cron_id, schedule, prompt)

### 2.3 — Choose the cadence + no-spam policy

Cadence templates Loop commonly uses (pick or customize):

| Pattern | When to use |
|---|---|
| **Weekly Sunday 18:00 PT** | end-of-week review; default for weekly cadence |
| **Weekly Monday 08:00 PT** | start-of-week planning |
| **Bi-weekly Friday 17:00** | sprint closeout |
| **Monthly 1st 09:00** | monthly reviews (PM2 Health Monitor monthly variant) |

No-spam defaults:
- **Silent when healthy**: loop produces no output for "all-OK" runs unless explicitly approved otherwise.
- **Single Telegram per lock-window**: alerts deferred through the canonical card-create pattern; no chat-only outputs.
- **Delivery default**: `local` (save to artifact destination). `origin` (Telegram) only if Marcelo explicitly approved.
- **State file**: every loop maintains a state file at `~/.hermes/state/<loop>.state` to detect alert fatigue.

### 2.4 — Design the loop's prompt / script

The loop prompt is the most failure-prone part. Use this structure:

```
You are running the {{LOOP_NAME}} weekly review.
At {{CADENCE_TIME}} PT.

STEP 1 — Gather:
  Read: {{DATA_SOURCES}}
  Summarize (<=8 lines).

STEP 2 — Compare against goals:
  Cross-check with {{LEARNED_<DOMAIN>.md}} goals.
  Identify blockers + progress.

STEP 3 — Decide:
  - "all-on-track"        -> SILENT (no output)
  - "blocker-detected"    -> create kanban card `t_<loop>_blocker_<date>`
  - "drift-detected"      -> create drift card per hermes-canon-drift-check pattern

STEP 4 — Report:
  Append artifact to {{ARTIFACT_DESTINATION}}.
  NEVER send Telegram to Marcelo directly.
```

For Step-5 QA (per `LEARNED_7_RULE_CONTRACT.md`), the prompt must end with:

> "Append a one-line audit to `~/logs/<loop>-audit.log` showing pass/fail + evidence."

### 2.5 — Capture + report

Every Loop deliverable ends with:
1. A **kanban card comment** describing what was designed/changed.
2. An **artifact** at `ARTIFACT_DESTINATION` (LEARNED_*.md update or new design doc).
3. A **PHASEREPORT** entry if the change is material (new recurring loop registered, existing loop redesigned).

---

## 3. Existing loops this skill already covers

| Loop | Cron id | Cadence | Design owner | Runtime owner |
|---|---|---|---|---|
| Crypto Weekly Learning and Intel Review | (private) | Sunday 18:00 PT | **Loop (this skill)** | Trading |
| PM2 Health Monitor weekly audit | `01dff7ff61e4` | weekly | **Loop (this skill)** | Ops |

Use those as reference implementations.

---

## 4. Pitfalls (do NOT do)

- ❌ Modify an existing cron without `cron_approval_flag = marcelo_approved=true` on the card.
- ❌ Add a Telegram route for "all-OK" runs (silent-by-default policy).
- ❌ Send `delivery: origin` without explicit Marcelo approval.
- ❌ Hand off the design without a dry-run test.
- ❌ Loop itself runs the cron — Loop DESIGNS the loop; Trading / Ops / Knowledge Canon operates it.

---

## 5. Quick reference

**Cron registration template** (Loop designs, Ops approves + registers):

```yaml
name: <loop_name>
schedule: "0 18 * * 0"  # Sunday 6pm PT (cron UTC) - adjust for TZ
script: ~/.hermes/scripts/<loop_name>.sh
prompt: <see 2.4 above>
deliver: local
cron_approval_flag: marcelo_approved=true on card <CARD_ID>
```

**State file path** (silent-by-default state):

```bash
STATE_FILE=~/.hermes/state/<loop_name>.state
LAST_ALERT=$(jq -r .last_alert "$STATE_FILE" 2>/dev/null || echo "never")
NOW=$(date +%s)
if [ $((NOW - LAST_ALERT_TS)) -lt $((7 * 24 * 3600)) ]; then
  echo "[$(date)] SILENT: alert sent within last 7 days; skip" >> $LOG
  exit 0
fi
```

---

**Version:** 1.0 (2026-07-23). Permanent while Loop Engineering lane active. Mirror: `~/Repos/BossMan/docs/hermes-canon/skills/loop-weekly-goal-review.md`.
