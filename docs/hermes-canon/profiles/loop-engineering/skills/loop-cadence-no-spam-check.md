---
name: loop-cadence-no-spam-check
description: |
  Skill: audit an EXISTING loop against the Hermes no-spam rules.
  When to load: BossMan dispatched Loop to "audit cron X" / "check no-spam
  on loop Y" / "verify cadence compliance" / "review pmd-watchdog alerting" /
  similar. Source: t_subagent_loop_rollout_v1_20260723 (Phase 2), 2026-07-23.
version: 1.0
---

# loop-cadence-no-spam-check

**Purpose.** Define a reusable audit workflow for **existing recurring loops** — verify they obey Hermes' no-spam rules (Cron + Automation Policy, AGENTS § Autonomous Notification Policy), confirm cadence is reasonable, and surface drift before Marcelo notices.

**When to load this skill.** BossMan dispatched Loop with one of:
- "audit cron X for spam compliance"
- "check that loop Y uses the right frequency"
- "review pmd-watchdog / travel-os-watchdog / similar watcher alert noise"
- "verify the drift-check cron isn't spamming"

If the cron has never been reviewed, is brand new (no behavioral baseline), or is for a critical L1 alert (e.g., live-money bot failure), ask BossMan whether to audit at all — sometimes a noisy critical alert is correct.

---

## 1. Inputs the skill expects

| Field | Source | Required? |
|---|---|---|
| `cron_id` (or `name`) | handoff packet or `~/.hermes/cron/jobs.json` | yes |
| `script_path` (the actual executable) | from cron row | yes |
| Recent Telegram / kanban-card log | `~/.hermes/cron/output/<cron_id>/` | yes |
| Lane file for the implementing lane | `~/.hermes/knowledge/<lane>.md` | optional |
| Existing LEARNED_<DOMAIN>.md | `~/.hermes/knowledge/` | optional |

---

## 2. The 7-point audit checklist

Run each check, record PASS/FAIL/CONCERN, then produce a verdict.

### Check 1 — Delivery target

- **Rule:** No loop sends `deliver: origin` (Telegram to Marcelo) without explicit Marcelo approval recorded on the kanban card.
- **Question:** Does this cron row have `deliver: origin` AND a `cron_approval_flag = marcelo_approved=true`?
- **Failure mode:** "Telegram-only loop with no approval" → emit a `cron_approval_drift` kanban card.

### Check 2 — Frequency vs urgency

- **Rule:** A loop's cadence must be **proportional to the failure mode it's detecting.**
- **Heuristics:**

| Failure mode | Acceptable cadence | Over-aggressive |
|---|---|---|
| Live-money bot down | every 1-5 min | none — escalate lower priority |
| PM2 process down | every 5-15 min | every 1 min = noise |
| Drift detection | weekly / monthly | daily = noise |
| Weekly review | weekly | twice daily = noise |
| Drift/canon change | on-demand | cron-tick = noise |

### Check 3 — Alert deduplication (state file)

- **Rule:** Every recurring alert-creating loop must have a **state file** (e.g., `~/.hermes/state/<loop>.state`) that records the last alert timestamp + last alert reason.
- **Failure mode:** Loop fires on every tick without checking if the same alert sent within the last N minutes. → This is what caused the recent pmd-watchdog spam (Card `t_pmd_watchdog_fix_loophealth_20260723`).
- **Recommended pattern:**
  ```bash
  STATE=~/.hermes/state/<loop>.state
  LAST_ALERT_TS=$(jq -r .last_alert_ts "$STATE" 2>/dev/null || echo 0)
  if [ $(( $(date +%s) - LAST_ALERT_TS )) -lt $ALERT_LOCK_WINDOW ]; then
    log "SILENT (lock window $ALERT_LOCK_WINDOW sec)"
    exit 0
  fi
  # ...alert logic...
  jq -n --arg ts "$(date +%s)" --arg reason "$REASON" \
    '{last_alert_ts: $ts, last_alert_reason: $reason}' > "$STATE"
  ```

### Check 4 — Auto-repair vs notification loop split

- **Rule:** A loop that auto-repairs (e.g., `pmd-web-auto-repair.sh`) must **NOT also send Telegram alerts on every failed repair**. Auto-repair is silent-by-default; notifications happen only after auto-repair exhausts its budget.
- **Failure mode:** Loop auto-restarts a service AND pings Marcelo on every restart → noise.
- **Recommended pattern:**
  - Auto-repair (silent): rate-limited, no Telegram.
  - Auto-repair EXHAUSTED (loud): 1 Telegram, then back to silent.

### Check 5 — Explainability on Telegram

- **Rule:** Any Telegram alert must explain **what happened**, **what auto-fix ran**, and **what Marcelo should do (if anything)** — in <=3 lines.
- **Failure mode:** "🚨 alert: cron failed" → uninformative noise.

### Check 6 — Cron registration trail

- **Rule:** Every cron must have a corresponding kanban card with explicit `cron_approval_flag = marcelo_approved=true` (or `=false` for read-only run) PLUS a PHASEREPORT entry when the cron is created / changed.
- **Failure mode:** "Ghost cron" (not on the kanban board).

### Check 7 — Lane conformance

- **Rule:** Cron work that matches a lane (Ops, Trading, Loop, etc.) must respect the lane's canonical file. If a cron purports to do Ops work but isn't owned by `ops.md`, that's a drift.
- **Failure mode:** "Anon ops" — auto-magic cron with no lane owner.

---

## 3. Output: the audit brief

Loop produces a single markdown brief at `~/.hermes/logs/<cron_id>-audit-YYYY-MM-DD.md` containing:

```markdown
# Loop audit — <cron_id>

| Check | Result | Notes |
|------|--------|-------|
| 1: Delivery target | PASS/FAIL | evidence |
| 2: Frequency vs urgency | PASS/FAIL/CONCERN | evidence |
| 3: Alert deduplication | PASS/FAIL | evidence |
| 4: Auto-repair split | PASS/FAIL | evidence |
| 5: Explainability | PASS/FAIL | evidence |
| 6: Cron registration trail | PASS/FAIL | evidence |
| 7: Lane conformance | PASS/FAIL | evidence |

## Verdict
[OVERALL PASS / OVERALL FAIL — needs (X) fixes / N changes]

## Suggested changes
1. ...
2. ...

## Recommended owner
[Ops / Trading / knowledge-canon / other]
```

If **any FAIL**, Loop creates a `t_drift_<cron_id>_<date>` kanban card so the implementing lane (Ops / Trading / etc.) is tagged for follow-up.

---

## 4. Existing loops this skill has audited (canonical examples)

| Cron | Last audit | Verdict | Reference |
|---|---|---|---|
| pmd-watchdog (Card `t_pmd_watchdog_fix_loophealth_20260723`) | 2026-07-23 | FAIL → fixed | Wrapper-can't-see-canonical-daemon bug; is_pm2_online was always false → 50 false alerts. Now uses direct canonical PM2 query. |
| hermes-canon-drift-check (weekly) | 2026-07-23 | PASS | Weekly cadence; silent-by-default; md5-only checks; auto-creates drift cards. |
| PM2 Health Monitor (cron `01dff7ff61e4`) | 2026-07-22 | PASS | Silent-by-default; Layer-2 Loop Health Audit pattern; ~4 KB output. |

---

## 5. Pitfalls (do NOT do)

- ❌ "Audit every cron weekly" — that's noise. Audit triggered, ad-hoc, or quarterly only.
- ❌ Silence a critical alert by adding a lock window without BossMan approval — silent-on-critical can lose money.
- ❌ Recommend delivery changes without explicit Marcelo approval card reference.
- ❌ Auditing a cron owned by another lane (Trading / Content) without a handoff packet to that lane.

---

## 6. Quick reference

**Common fixes Loop proposes:**

| Symptom | Fix |
|---|---|
| Telegram every 5 min | Add state file; check last-alert timestamp; silent if < N seconds |
| Auto-repair spam | Move auto-repair to silent path; only alert on exhaustion |
| Cadence too tight | Cadence ≥ 2× typical recovery time |
| Cron not on the board | Auto-create drift kanban card; request registration + Marcelo approval |
| Lane ownership unclear | Tag the canonical lane file; recommend handoff to that lane |

**Audit frequency:** quarterly + on-demand (when Marcelo / BossMan flags spam).

---

**Version:** 1.0 (2026-07-23). Permanent while Loop Engineering lane active. Mirror: `~/Repos/BossMan/docs/hermes-canon/skills/loop-cadence-no-spam-check.md`.
