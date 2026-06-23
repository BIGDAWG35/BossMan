# Security & PM2 Watch — Monthly Cron Proposal (NOT REGISTERED)

**Date:** 2026-06-23
**Author:** BossMan (Phase S1 P4, kanban `t_89ce7840`)
**Status:** 📋 PROPOSAL — awaiting operator approval
**Goal card:** `t_e56d53cd`
**Loop spec:** `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`
**Alignment matrix:** `~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md`

This is a complete, fully-specified proposal for a monthly Security & PM2
Watch cron. **The cron is NOT registered.** It will not run automatically
until operator approves the proposal and explicitly asks BossMan to register
it.

---

## TL;DR

A thin cron wrapper that calls the Security & PM2 Watch Goal Loop once a
month, with **no Telegram pings** unless a P0 or FAIL finding surfaces.
Local-only by default. The S1 loop wraps (does not replace) the existing
`security-watch` daily/weekly drivers and `pm2-health-check` 5-min cron —
all of which are already active and blessed.

| Field | Value |
|---|---|
| Schedule | `30 23 1 * *` (1st of each month, 23:30 PT — 30 min after doc-hygiene to avoid contention) |
| Mode | report-only (no auto-fix) by default |
| Delivery | local-only when PASS; Telegram only when P0/FAIL |
| Estimated runtime | 10-15 minutes |
| Estimated cost | ~$0.20 per run (DeepSeek Step-5 verifier) |
| Status | **NOT REGISTERED** |
| Pre-existing infra (do NOT duplicate) | security-watch-daily (133f6f655d59), security-watch-weekly (1b1e3e82a86a), PM2 Health Monitor |

---

## Why a monthly cadence (not weekly)?

- **Daily + weekly coverage already exists** — security-watch-daily and
  security-watch-weekly produce daily diffs and weekly briefs. These are the
  fast loop.
- **Monthly loop is the slow, deliberate, governance-grade layer** — it
  produces the PHASEREPORT entry, validates BLESSED-LISTS.md is still
  accurate, and updates the long-lived Goal card body.
- **Cost discipline** — Step-5 QA on every cycle = ~$0.20/month is acceptable;
  weekly would be $0.80/month with no incremental signal since the weekly
  brief already triggers on P0s.

---

## Schedule

```cron
# Security & PM2 Watch — Monthly Goal Loop
# Status: PROPOSAL (not yet approved by operator)
# Schedule: 1st of each month, 23:30 PT (after-hours, low-noise window)
#   30 minutes after doc-hygiene cron (which fires 23:00 PT) to avoid contention
# Behavior: report-only, no Telegram unless P0
# Goal card: t_e56d53cd
# Loop spec: ~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md
# Alignment matrix: ~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md
# PRE-EXISTING INFRA (do not duplicate):
#   - security-watch-daily (133f6f655d59, 17 3 * * *, local)
#   - security-watch-weekly (1b1e3e82a86a, 42 18 * * 0, local)
#   - PM2 Health Monitor (every 5 min, local)
30 23 1 * * cd ~ && bash ~/.hermes/scripts/security-pm2-monthly.sh >> ~/.hermes/logs/security-pm2.log 2>&1
```

**Time-window rationale:** 23:30 PT on the 1st of the month is:

- 30 min after doc-hygiene cron (no contention between two report-only loops)
- After Marcelo's normal work hours (no notification noise)
- After the first-of-month financial cron (if any) settles
- 1 hour 18 min after security-watch-weekly fires (Sunday 18:42 PT) — no overlap

---

## Behavior

### Default (no P0 finding)

1. Cron fires at 23:30 PT on the 1st of each month
2. Script `~/.hermes/scripts/security-pm2-monthly.sh` runs (to be created when approved)
3. Script:
   - Creates a `S1.YYYYMM` parent card linked to Goal `t_e56d53cd`
   - Spawns 3 children:
     - `S1.YYYYMM.A` — PM2 whitelist vs actual
     - `S1.YYYYMM.B` — Cron/LaunchAgent audit
     - `S1.YYYYMM.C` — Basic security checks (consumes security-watch weekly brief)
   - Each child runs to completion (≤10 min total)
   - Synthesizes findings into `~/.hermes/knowledge/SECURITY_LOOP/SECURITY_PM2_REVIEW_YYYY-MM.md` (≤200 lines)
   - Writes one-line PHASEREPORT entry at top of `~/Projects/BossMan/PHASEREPORT.md`
   - Updates Goal card body `t_e56d53cd` with `## YYYY-MM-DD` log entry
4. Step-5 QA verdict: `PASS` or `CAVEAT` → **silent local output only**
5. No Telegram ping

### On P0 or FAIL finding

1. Above + **single Telegram ping** in the format below
2. Each P0 spawns a separate fix card (per Step-5 of spec)
3. P0 cards are NOT auto-closed (operator decision)
4. Next cycle's REVIEW step carries P0 forward

**Telegram format (P0 only):**
```
🚨 SECURITY & PM2 CYCLE YYYY-MM: P0 FOUND
   Category: <PM2 | cron | LaunchAgent | security>
   Severity: P0
   Finding: <one-line>
   Card: t_...
   Action: <awaiting operator review>
```

---

## Estimated runtime breakdown

| Step | Duration | Cost |
|---|---|---|
| INTAKE (PM2 + cron + LaunchAgent snapshots) | ~30 sec | $0.00 |
| DECOMPOSE (3 child cards) | ~5 sec | $0.00 |
| EXECUTE (diff vs baseline, listener scan) | ~5 min | $0.02 |
| Step-5 QA (DeepSeek verdict) | ~2 min | $0.15 |
| REVIEW (synthesize report) | ~3 min | $0.02 |
| DONE (commit + mirror + PHASEREPORT) | ~1 min | $0.01 |
| **Total** | **~10-15 min** | **~$0.20** |

If Step-5 escalates to Tier 2 (real issue + sensitive), add ~$0.30
(Claude verification), bringing total to ~$0.50. Acceptable for monthly.

---

## What this cron does NOT do (explicit STOPs)

The S1 loop wraps the existing security-watch + pm2-health-check infrastructure
within a strict scope. The cron CANNOT:

- Touch money-pipeline, bakery, pmd-web, squarepayouts, binance-bot,
  trading-control, csdawg-dashboard
- Edit `.env`, `secrets.json`, or any auth-bearing file
- Edit SOUL.md, AGENTS.md, ROUTING-RULES.md, MODELROUTINGWORKFLOW.md
- Open/close/repoint any public or VPN port
- Make vendor/API/billing decisions
- Make product-direction decisions
- Auto-fix any P0 (P0s spawn separate cards for operator review)
- Re-register or modify the existing security-watch daily/weekly crons
  (or the PM2 Health Monitor cron)
- Send Telegram pings unless P0/FAIL (per spec, "alert EXCEPTION-ONLY")

These are **HARD STOPS** in both the S1 spec's Scope & STOPs and the 4
primary skills' Scope & STOPs blocks (per alignment matrix).

---

## Crontab verification (as of 2026-06-23)

```bash
$ crontab -l | grep -i "security.*monthly\|pm2.*monthly\|security-pm2"
# (empty)
```

**Confirmed:** No S1 cron registered. ✅

```bash
$ crontab -l
# (bossman crontab, 4 entries: 2 health-cron-wrapper + 2 health-check.js)
```

The 4 existing crontab entries are the **system-level** health-check
infrastructure (`restart-services.sh` and `health-check.js`). The S1 loop
runs at the **user level** (Hermes cron + Goal Loop pattern) and does not
interfere with the system-level health crons.

---

## Hermes cron verification (as of 2026-06-23)

```bash
$ hermes cron list | grep -i "security.*monthly\|pm2.*monthly\|security-pm2"
# (empty)
```

**Confirmed:** No S1 Hermes cron registered. ✅

The 28 existing Hermes crons (per `S1-INTAKE-hermes-cron-2026-06-23.txt`)
do not include the S1 monthly loop. The 2 security-watch crons (daily +
weekly) are the active security drivers and remain untouched.

---

## Approval gate (per Phase 2 carve-out + S1 spec)

Per `~/.hermes/knowledge/ROUTING-LEDGER.md` v3:

- "New cron schedule / cadence changes" is a Phase 2 carve-out category
- "New crons or recurring automations" is in incident-response STOPs
- "New cron schedules triggered as part of [any] migration" is in
  migration-playbook STOPs
- "Any new cron registration" is an explicit STOP in the S1 spec

**The S1 cron is proposal-only until Marcelo explicitly approves it and asks
BossMan to register it.**

---

## Operator options (waiting on)

| Choice | Meaning |
|---|---|
| **A. Approve as proposed** | Register `30 23 1 * *` crontab line exactly as above. Default behavior, local-only Telegram-when-P0. |
| **B. Approve with changes** | Operator edits schedule / behavior / delivery in this proposal and approves the modified version. |
| **C. Defer / don't register** | Loop remains manual — S1 runs only when BossMan is asked to do a monthly review. Goal card stays in `ready` but no cron drives it. |
| **D. Run first cycle manually** | Operator asks BossMan to execute one S1 cycle now (without registering cron) to validate the loop. Cron registration decided based on first cycle result. |

**Standing assumption:** If no operator response within 7 days of this
proposal, BossMan takes no action (cron stays unregistered). This is
**not** an autonomous decision; the S1 spec requires explicit operator
approval per Phase 2 carve-out + S1 STOP.

---

## Pre-registration checklist (when/if approved)

When operator approves A or B, BossMan will:

1. [ ] Create `~/.hermes/scripts/security-pm2-monthly.sh` with the 5-step
       loop (INTAKE → DECOMPOSE → EXECUTE → REVIEW → DONE)
2. [ ] Create `~/.hermes/logs/security-pm2.log` (touch, 0644)
3. [ ] Add the crontab line (with operator's chosen schedule) to crontab
4. [ ] Verify with `crontab -l | grep security-pm2-monthly` (should return 1 line)
5. [ ] Add a sibling entry to the BLESSED-LISTS.md crontab section
6. [ ] Run one manual first cycle to validate the loop
7. [ ] Step-5 QA on the first cycle
8. [ ] If PASS: append a "First cycle result" note to this proposal
9. [ ] Update the Goal card body with the cron registration
10. [ ] PHASEREPORT entry: "2026-MM-DD — Security & PM2 monthly cron registered"

---

## References

- **S1 Goal card:** `t_e56d53cd` (long-lived, stays in `ready`)
- **S1 spec:** `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`
- **Alignment matrix:** `~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md`
- **Precedent (parallel proposal):** `~/.hermes/knowledge/DOC-HYGIENE-CRON-PROPOSAL_2026-06-23.md`
- **Pre-existing infra (BLESSED, do not duplicate):**
  - Skill: `~/.hermes/skills/security-watch/SKILL.md` (Phase 3+4, 2 active crons)
  - Skill: `~/.hermes/skills/pm2-health-check/SKILL.md` (Phase 2, 1 active cron)
- **Pattern source:** `~/.hermes/skills/goal-loop/SKILL.md`
- **Governance:** `~/.hermes/knowledge/ROUTING-LEDGER.md` v3 (Phase 2 carve-outs)
- **Phase S1 parent:** kanban `t_21f1db14`
- **Phase S1 child:** P4 (this proposal), P5 (wire + commit, pending)

---

## Provenance

- **Drafted:** 2026-06-23 (Phase S1, S1-P4)
- **Author:** BossMan (autonomous, M3 lead, M2.7 executor)
- **Reviewer:** DeepSeek (Step-5 QA, in S1-P5)
- **Approver:** Marcelo (operator, **PENDING**)
- **Next review:** 2026-07-01 (first proposed fire date, contingent on approval)
