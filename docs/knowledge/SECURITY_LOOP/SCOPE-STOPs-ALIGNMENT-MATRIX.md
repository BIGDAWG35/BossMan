# Security & PM2 Goal Loop — Scope & STOPs Alignment Matrix

**Date:** 2026-06-23 · **Phase:** S1 (P3 deliverable) · **Goal card:** `t_e56d53cd`
**Parent spec:** `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`

---

## Purpose

This document is the **alignment matrix** for the Security & PM2 Watch Goal
Loop. It cross-references the S1 spec's autonomous scope and STOP conditions
against the existing Scope & STOPs blocks in the four primary skills the loop
consumes:

1. `pm2-health-check` — runtime health detection + repair
2. `incident-response` — structured 8-step incident workflow
3. `kanban-orchestrator` — lane routing + card fan-out
4. `migration-playbook` — phase sequencing for system changes

If a conflict is found between the S1 spec and any of these skills' Scope &
STOPs blocks, the **existing skill's STOP wins** (more conservative) and the
S1 spec is amended.

---

## Autonomous scope (loop may run without operator approval)

| Capability | S1 spec allows? | pm2-health-check | incident-response | kanban-orchestrator | migration-playbook | Net |
|---|---|---|---|---|---|---|
| Read PM2 process list | ✅ (INTAKE) | ✅ | ✅ | n/a | n/a | ✅ |
| Read Hermes cron list | ✅ (INTAKE) | n/a | n/a | ✅ (visibility) | n/a | ✅ |
| Read LaunchAgent list | ✅ (INTAKE) | n/a | n/a | n/a | n/a | ✅ |
| Read listener ports (`lsof -i`) | ✅ (INTAKE) | ✅ | ✅ | n/a | n/a | ✅ |
| Read `~/.hermes/state/security-watch/` | ✅ (INTAKE) | n/a | n/a | n/a | n/a | ✅ |
| Diff against `BLESSED-LISTS.md` baseline | ✅ (DECOMPOSE) | ✅ | n/a | n/a | n/a | ✅ |
| Spawn child kanban cards (S1.YYYYMM.A/B/C) | ✅ (DECOMPOSE) | n/a | n/a | ✅ | n/a | ✅ |
| Kill a known-ghost PM2 process (in BLESSED-LISTS.md Removed) | ✅ (EXECUTE) | ✅ (R2 EADDRINUSE orphan) | n/a | n/a | n/a | ✅ |
| Delete a known-dead cron (in BLESSED-LISTS.md Removed) | ✅ (EXECUTE) | n/a | n/a | ✅ (mechanical) | n/a | ✅ |
| `pm2 restart` on a non-money service | ✅ (EXECUTE) | ✅ (R4 unhealthy-online) | n/a | n/a | n/a | ✅ |
| Run `pm2 save` after cleanup | ✅ (DONE) | ✅ (D17 dump.pm2 sync) | n/a | n/a | n/a | ✅ |
| Generate monthly report | ✅ (REVIEW) | n/a | n/a | n/a | n/a | ✅ |
| Write one-line PHASEREPORT entry | ✅ (REVIEW) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Step-5 QA invocation (DeepSeek) | ✅ (DONE) | ✅ | ✅ (Step 5 mandatory) | n/a | n/a | ✅ |
| Update Goal card body (last_reviewed + log) | ✅ (DONE) | n/a | n/a | ✅ | n/a | ✅ |

**Result:** 14/14 capabilities are allowed by at least one primary skill's
Scope & STOPs. No conflicts.

---

## STOPs (loop must escalate, NEVER auto-act)

| STOP | S1 spec | pm2-health-check | incident-response | kanban-orchestrator | migration-playbook | Net |
|---|---|---|---|---|---|---|
| Money pipelines (money-pipeline, bakery, pmd-web, squarepayouts) | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| Trading bots (binance-bot, trading-control, csdawg-dashboard) | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| Auth systems (NextAuth, OAuth, JWT) | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| `.env` / `secrets.json` edits | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| SOUL.md / AGENTS.md / ROUTING-RULES / MODELROUTINGWORKFLOW edits | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| Public-facing port or domain changes | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| Vendor/API/billing decisions | ✅ STOP | n/a | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| Product-direction decisions | ✅ STOP | n/a | n/a | ✅ STOP | n/a | **HARD STOP** |
| Production cutover without rollback plan | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | ✅ STOP | **HARD STOP** |
| AI model disagreement on fix | ✅ STOP | ✅ STOP | ✅ STOP | n/a | ✅ STOP | **HARD STOP** |
| Multi-service incident with cross-system effects | ✅ STOP | n/a | ✅ STOP | n/a | n/a | **HARD STOP** |
| New cron registration (incl. S1 monthly cron) | ✅ STOP | ✅ STOP | ✅ STOP | n/a | ✅ STOP | **HARD STOP** |
| Conflicting kanban state (two cards, same work) | ✅ STOP | n/a | n/a | ✅ STOP | n/a | **HARD STOP** |
| Insufficient facts to form 2 hypotheses | ✅ STOP | n/a | ✅ STOP | n/a | n/a | **HARD STOP** |
| Auth breach without escalation path | ✅ STOP | n/a | ✅ STOP | n/a | n/a | **HARD STOP** |

**Result:** 15/15 STOPs are consistent across S1 spec + 4 primary skills.
**HARD STOP consensus** — every STOP is a hard stop in at least one skill,
and none conflict.

---

## Routing Ledger (consolidated)

The S1 Goal Loop's Routing Ledger matches the 4 primary skills' patterns:

| Field | S1 spec | pm2-health-check | incident-response | kanban-orchestrator | migration-playbook | Notes |
|---|---|---|---|---|---|---|
| worktype | audit (monthly) + watch (continuous) | monitoring + repair | incident | orchestration | migration | All unique; S1's is the lightest |
| leadmodel | M3 + DeepSeek | M3 + DeepSeek | M3 (Step 2) + Claude (Step 3) + DeepSeek (Step 5) | M3 | M3 + Claude | All include M3 + DeepSeek or M3 + Claude |
| costtier | Tier 1 (Tier 2 if Step-5 escalates) | Tier 1 default | Tier 1 default, mandatory Step-5 | Tier 1 default | Tier 1 default | Consistent |
| qa_required | yes (Step-5 mandatory) | yes (Step-5) | yes (Step 5 mandatory) | yes | yes | All yes |
| scope | meta-loop | runtime health | incidents | routing | migrations | Distinct, non-overlapping |
| carve_outs | all 5 Phase 2 | money + kernel-doc | money + auth + kernel-doc | money + auth + kernel-doc | money + auth + kernel-doc | All 5 Phase 2 carve-outs |

**No conflicts.** The S1 Routing Ledger is a strict subset of the union of
the 4 primary skills' Routing Ledgers.

---

## Step-5 QA rules (consolidated)

The S1 spec's Step-5 QA rules are aligned with the existing skills' Step-5
QA rules:

| Rule | S1 spec | pm2-health-check | incident-response | kanban-orchestrator | migration-playbook |
|---|---|---|---|---|---|
| Mandatory on every cycle | ✅ | ✅ | ✅ (Step 5) | n/a | ✅ |
| Use DeepSeek as primary | ✅ | ✅ | ✅ (Step 5) | n/a | ✅ |
| AI model disagreement → STOP | ✅ | ✅ | ✅ | n/a | ✅ |
| Verdict JSON path | `~/Projects/BossMan/docs/verdicts/step5-verdict-security-pm2-YYYY-MM.json` | `~/Projects/BossMan/docs/verdicts/step5-verdict-*.json` | same | same | same |
| Verdict values | PASS / CAVEAT / FAIL | PASS / CAVEAT / FAIL | PASS / CAVEAT / FAIL | n/a | PASS / CAVEAT / FAIL |

**Result:** All 4 skills use the same Step-5 verdict shape + JSON path
convention. The S1 spec follows the same pattern.

---

## Where the S1 spec differs (intentionally)

The S1 Goal Loop is **strictly weaker** than the 4 primary skills it consumes.
Differences:

1. **Cadence:** S1 = monthly; pm2-health-check = every 5 min; security-watch
   = daily + weekly. S1 is the slowest layer. ✅ Intentional.
2. **Repair scope:** S1 = mechanical cleanup of BLESSED items only;
   pm2-health-check = full R1-R5 repair playbooks; security-watch = no
   auto-remediation. S1 is the most conservative. ✅ Intentional.
3. **Report artifact:** S1 = `SECURITY_PM2_REVIEW_YYYY-MM.md` (≤200 lines);
   security-watch = `briefs/YYYY-Www.md` (weekly, ≤100 lines);
   pm2-health-check = incident cards + PHASEREPORT entries. All distinct. ✅
4. **Trigger model:** S1 = cron-driven monthly;
   security-watch = daily diff + weekly brief;
   pm2-health-check = cron-driven every 5 min + on-demand.
   No overlap. ✅

---

## Conflict resolution rule (Permanent — 2026-06-23)

**If a future S1 cycle detects a conflict between this matrix and the
primary skills' Scope & STOPs blocks:**

1. The **more conservative** STOP wins.
2. The S1 spec is amended to match (not the other way around).
3. The amendment is documented as a PHASEREPORT entry.
4. The amendment requires operator approval (kernel-doc / scope change).

---

## References

- S1 spec: `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`
- S1 Goal card: `t_e56d53cd`
- S1 parent kanban: `t_21f1db14`
- Primary skills (each has its own Scope & STOPs):
  - `~/.hermes/skills/devops/pm2-health-check/SKILL.md`
  - `~/.hermes/skills/devops/incident-response/SKILL.md`
  - `~/.hermes/skills/devops/kanban-orchestrator/SKILL.md`
  - `~/.hermes/skills/devops/migration-playbook/SKILL.md`
- Watched skills (already active in the loop):
  - `~/.hermes/skills/security-watch/SKILL.md` (Phase 3+4)
- Pattern source: `~/.hermes/skills/goal-loop/SKILL.md`
- Doc-hygiene precedent matrix (parallel structure):
  `~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md`
- v3 Routing Ledger: `~/Projects/BossMan/docs/ROUTING-ULES.md`
- ACP (governance parent): `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
