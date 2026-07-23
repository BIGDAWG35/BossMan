"""
Write Dominoes loop design brief.
"""
from pathlib import Path

CONTENT = """# Dominoes Verification Loop Design Brief (v1.0)

**Card:** `t_dominoes_verification_loop_v1_20260723`
**Date:** 2026-07-23
**Lane (design):** Loop Engineering
**Lanes (runtime):** Loop Engineering (orchestration) + QA-Verification (Pass A/B/C/E) + Builder (Pass D) + Knowledge Canon (Pass F + captures)
**Marcelo approval:** received 2026-07-23 via Telegram

---

## Goal

Make Dominoes a verified, stable, review-ready product via a recurring loop that:
1. Spin up the stack.
2. Run the canonical verification matrix.
3. Log defects by severity.
4. Route fixes to Builder.
5. Re-test after fixes.
6. Write a one-page review brief with verdict (PASS / PASS-WITH-FIX / CHANGE-RECOMMENDED / BLOCKED-ON-MARCELO).

---

## Loop shape (Pass A → Pass F)

```
Pass A: spin-up + smoke-test
  -> docker compose up -d postgres redis pgadmin
  -> pm2 start ecosystem.dominoes.config.cjs
  -> smoke-test.sh (12 client routes + server /health)
  -> BLOCKER if not up

Pass B: verification matrix
  -> DOMINOES_VERIFICATION_MATRIX.md (Pass B1-B7 sections)
  -> Each test runs in isolation
  -> result per row: PASS / PASS-WITH-FIX / FAIL / NOT-TESTED

Pass C: defect log
  -> DOMINOES_KNOWN_ISSUES.md gets one cycle-section appended
  -> Each defect gets a severity tier (P0/P1/P2/P3)

Pass D: route fixes
  -> Each P0/P1 defect spawns a child card -> assignee=builder
  -> P2 also routed; P3 batched once/week

Pass E: re-test
  -> After Builder-fix card closes, qa-verification card is auto-created
  -> Re-run Pass A + relevant Pass B section
  -> PASS = defect marked RESOLVED on the cycle-log
  -> FAIL = defect reopened; loop back to Pass D

Pass F: review brief
  -> ~/.hermes/logs/dominoes-verification-YYYY-MM-DD.md written
  -> One-page summary: verdict + what works + what's broken + what's blocked
  -> Telegram escalation only when: P0 defect found, OR Pass A breaks, OR verdict == BLOCKED-ON-MARCELO
```

---

## Cadence

| Mode | Cadence | Trigger |
|---|---|---|
| **Hardening** | TWICE per week (Tue 18:00 PT + Sat 10:00 PT) for first 4 weeks | scheduled cron |
| **Weekly review (after hardening over)** | ONCE per week (Sunday 18:00 PT) | scheduled cron |
| **On-demand re-run** | After each Builder-fix card closes | kanban auto-trigger |

**Phase 1 (Weeks 1-4):** Hardening cadence (2x/week). Defect velocity monitored.
**Phase 2 (Weeks 5-8):** If defect velocity < 1/week, revert to weekly review.

---

## No-spam rules (Permanent)

| Rule | Where | Why |
|---|---|---|
| Silent healthy runs | cron `deliver: local` | Cron + Automation Policy |
| Telegram only on P0 defect OR Pass A fail OR BLOCKED-ON-MARCELO | prompt-level escape valve | Cron + Automation Policy |
| Max 1 Telegram message per cron run | prompt-level | One-shot per tick |
| 7-day lock window on Pass F brief | state file (no multiple briefs/week) | Loop Engineering convention |
| Defects are tracked in `DOMINOES_KNOWN_ISSUES.md`, not via Telegram | persistent log, not chat | Telegram is notification, not transcript |

---

## Artifact outputs

| Path | Format | Cadence |
|---|---|---|
| `~/.hermes/logs/dominoes-verification-YYYY-MM-DD.md` | Markdown brief | each loop run |
| `~/.hermes/knowledge/DOMINOES_KNOWN_ISSUES.md` | Append-only defect log | each cycle that surfaces defects |
| `~/.hermes/state/dominoes-verification.state` | JSON state file (last_run_at, last_verdict, blockers_count) | each run |
| `~/.hermes/logs/dominoes-verification-ESCALATE.md` | escalation marker (when blockers) | only on blockers |

---

## Cron registration (Ops Lane implementer)

### Scheduled cron (hardening: Tue + Sat)

```yaml
id: <assigned at registration>
name: Dominoes Verification Loop -- Hardening
schedule:
  kind: cron
  expr: "0 1 * * 2,7"  # Tue 18:00 PT + Sun 01:00 UTC (Sun) [placeholder; Ops picks]
prompt: |
  You are the Dominoes Verification Loop. Run Pass A through Pass F.

  Steps:
  1. Run `bash ~/.hermes/scripts/dominoes-verification.sh`.
  2. The script handles:
     - docker compose up -d
     - pm2 start ecosystem.dominoes.config.cjs
     - smoke-test.sh
     - Pass B (verification matrix subset -- only the rows marked "this cycle")
     - Pass C (defect log)
     - Pass D (route defects as builder/qa-verification child cards)
     - Pass E (re-test previously fixed defects)
     - Pass F (one-page review brief)

  The script returns 0 if all healthy; non-zero (10/20/30) for P0/P1/P2-blocker findings.
  Exit 0 and exit 10/20/30 == silent (delivery decision is logged but not Telegram-notified).
  Exit 99 == BLOCKED-ON-MARCELO (Telegram notify required).

  Cron-approval flag: marcelo_approved=true on card t_dominoes_verification_loop_v1_20260723
  DO NOT spend more than 20 minutes per cron run; budget minutes wisely.
deliver: local
workdir: /Users/bigdawg/Projects/dominoes-pwa
```

### On-demand cron (after Builder-fix cards close)

This is a kanban-triggered re-run, not a scheduled cron. The Builder-fix card body includes a reference to the relevant Pass B section; when that card closes, BossMan triggers a focused re-test on the affected Pass B sections only (skipping A unless A.2 - A.3 are suspected affected by the fix).

---

## QA verifier (qa-verification lane)

QA runs **Pass A + Pass B** in every loop run. Builder runs Pass D. Knowledge Canon runs Pass F capture.

| Pass | Owner | Model | Risk |
|---|---|---|---|
| A | Loop Engineering + Ops | M3 (orchestration); Ops directly runs compose/pm2 | standard |
| B | QA | Claude (gameplay + chat flows are safety/multi-stakeholder) | high -- use Claude |
| C | QA | M3 (defect categorization is structured) | low |
| D | Builder (writes fixes) | DeepSeek (default builder model) | standard |
| E | QA | Claude (re-test) | high |
| F | Knowledge Canon + Loop | M3 (brief writing) | low |

---

## Money / store boundaries (Permanent)

**Current product:**
- NO live payments
- NO App Store / Google Play packaging
- NO platform custody/payout
- Host-managed contributions (Zelle/Venmo) STAY EXTERNAL -- host handles money, app may add coordination UX later.

The loop **does NOT** attempt: live payments, App Store packaging, Google Play packaging, custody logic, payout automation.

If a verification cycle surfaces a perceived need for ANY of these (e.g., "AI suggests adding platform payments"), the loop logs it as `FUTURE-BOUNDARY` in the matrix but does NOT implement it.

---

## Pitfalls (do NOT do)

- ❌ Skip Pass A (always run spin-up first; a stale build breaks Pass B).
- ❌ Mark a defect RESOLVED without Pass E re-test.
- ❌ Run the loop without `marcelo_approved=true` on the card body (Cron + Automation Policy).
- ❌ Build any payment / App Store / Google Play packaging in the loop.
- ❌ Use M3 for Pass B (gameplay correctness is safety-sensitive; Claude is mandatory).
- ❌ Send Telegram for healthy runs (silent; only P0/P1/P2-blocker/99 escapes notify).
- ❌ Edit `LEARNED_DOMINOES.md` "Architecture" section without 6-month-durable evidence.
- ❌ Re-build npm install during the loop (use `npm rebuild` instead; node_modules churn is a Builder concern).

---

## Status

**Design:** complete (this brief).
**Loop cron:** pending Ops registration (Ops Lane implements after Marcelo approval -- which is THIS card's body).
**On-demand re-run:** pending kanban automation (Loop Engineering sets up the trigger).
**Canon captures:** Pass F captures `LEARNED_DOMINOES.md` and `DOMINOES_KNOWN_ISSUES.md`.

**Owner next:** Ops Lane registers the scheduled cron using the template above. QA-Verification lane begins Break-testing on next loop run.

**Cycle 1 verdict (already run):** BLOCKED -- arm64 native-modules defect found. P0 child card `t_dominoes_defect_p0_arm64_native_modules_20260723` is OPEN. Re-test in next cycle.
"""

fp = Path('/Users/bigdawg/.hermes/logs/dominoes-loop-design-20260723.md')
fp.write_text(CONTENT)
print(f"OK wrote {fp.stat().st_size} bytes to {fp}")
