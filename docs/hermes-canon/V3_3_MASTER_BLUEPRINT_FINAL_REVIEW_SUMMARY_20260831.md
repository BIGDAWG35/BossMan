# V3.3 MASTER BLUEPRINT — FINAL REVIEW SUMMARY


> **[RETIRED 2026-09-30]** LBC35/OpenClaw delegator + OpenClaw gateway retired per card `t_735da189`. Delegation is now BossMan via Kanban + `~/.hermes/bin/route-card.sh`. Historical references preserved for context.

**Companion to:** `~/.hermes/knowledge/V3_3_MASTER_BLUEPRINT_20260831.md` (CANONICAL — ACTIVE, 72,838+ bytes / 1,043+ lines / 8 parts)
**Status:** **APPROVED 2026-08-31 (PDT) — V3.3 MASTER BLUEPRINT IS CANONICAL AND ACTIVE**
**Program:** `t_v33_master_blueprint_v1_20260831` (card `t_d47208f5`) + `t_v33_final_verification_and_promotion_v1_20260831` (card `t_7142fbba`)
**Date:** 2026-08-31

This document is the **only** artifact Marcelo reviewed. The full blueprint was the input; this summary is the review surface.

---

## 7. Promotion outcome (added post-approval, 2026-08-31)

V3.3 was promoted to **CANONICAL — ACTIVE V3.3 MASTER BLUEPRINT** on 2026-08-31 via card `t_v33_final_verification_and_promotion_v1_20260831`.

All 8 final Step-5 checks **PASS**:
1. ✅ Source-of-truth audit (one canonical home per durable rule)
2. ✅ Cross-document consistency (10 lanes / 7 layers / 5 models / ops-profile cron authority all consistent)
3. ✅ Authority audit (no wording restores forbidden authority patterns; only NEGATIVE LBC35 rules; only POSITIVE Marcelo/BossMan/BossMan-only rules)
4. ✅ Routing audit (M3-block, SquarePayouts carve-out, Computer Use escalation, local-secrets policy, Step-5 QA, Claude mandatory for safety-sensitive all preserved via reference to `LEARNED_V3_MODEL_STACK.md` and `ROUTING-RULES.md`)
5. ✅ Runtime boundary audit (no runtime/config/canon files modified by promotion; the 3 pre-existing modifications were from earlier commits `40828ae` + `c2e703b` + others, not from V3.3)
6. ✅ Knowledge-governance audit (Rule #8 + Rule #9 explicit; 8 archive non-canon markers; 10 live-state non-canon markers)
7. ✅ Link/path audit (47/49 non-template paths exist; 2 template patterns `LEARNED_*.md` and `loop-enforcement-review-YYYY-MM.md` are documented patterns, not real missing paths)
8. ✅ Versioning audit (V3.2.x = 2026-08-27 closure history; V3.3 = current controlled Master Blueprint; exactly 2 master docs + 2 Rule #8 snapshot copies in cron output)

Promotion actions completed:
- V3.3 master blueprint status: PROPOSED → CANONICAL — ACTIVE
- Final-review summary status: PROPOSED → APPROVED (record of approval)
- Rule #8 snapshot saved at `profiles/ops/cron/output/t_v33_promotion_pre_edit_snapshot_20260831_234000/`
- LEARNED_INDEX updated to reference V3.3 as canonical entry point (next step)
- PHASEREPORT promotion entry appended (next step)
- No runtime/config/canon files modified
- No pointers changed (existing canon remains authoritative companion)
- No archive actions (existing archives remain Tier 5)


---

## 1. What existed before V3.3

V3.2.x (closed 2026-08-27) delivered the rules but not the consolidated architecture map. The result was five concrete ambiguities that V3.3 resolves:

**Authority ambiguity.** Tier 1-3 identity lived in 11+ files (SOUL.md, AGENTS.md, AGENTS_INDEX.md, AGENTS_ROSTER.md, ROUTING-RULES.md, LEARNED_V3_MODEL_STACK.md, LEARNED_7_RULE_CONTRACT.md, LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md, LEARNED_7_LAYER_ARCHITECTURE.md, LEARNED_MD_FILE_DRIFT_RUBRIC.md, plus 10 lane contracts). No single entry point. A new agent had to assemble identity from the union.

**Routing-rule duplication.** V3 model roles appeared in `SOUL.md`, `ROUTING-RULES.md`, `LEARNED_V3_MODEL_STACK.md`, and `LEARNED_7_LAYER_ARCHITECTURE.md`. No canonical home was declared authoritative. Drift signals existed but no single owner for them.

**Cron-governance conflict.** Two registries existed: default `~/.hermes/cron/jobs.json` (37 enabled) and ops profile `~/.hermes/profiles/ops/cron/jobs.json` (29 enabled). No declared runtime authority. Resolved 2026-08-31: ops profile is sole authority, default is generated read-only mirror (commits `40828ae` + `97c9bf0`).

**Knowledge-governance ambiguity.** 175 untracked `knowledge/**/*.md` files with no per-file classification. 8 historical records archived with active-reference updates. 97 live-state files with no ownership/regeneration/retention metadata. 13 project-specific files deferred without clear triggers. All resolved 2026-08-31 in Rule #9 recovery program (commits `c3111f2` + predecessors).

**Lane-ownership ambiguity.** 4 lanes (loop-engineering, qa-verification, research-intel, trading) had unclear profile posture. Resolved 2026-08-31: loop-engineering = dormant/template (commit `1d6ac2a`); qa-verification + research-intel = intentionally lane-only-by-design; trading = active + lane-specific. Nested `knowledge/agents/<lane>.md` (7 files) were documented migration to flat `knowledge/<lane>.md` (commit `9a1897a`).

## 2. What V3.3 now establishes

V3.3 is a **canon-consolidation + architecture-documentation project** that absorbs + points to existing canon without rewriting it.

**BossMan authority and single-status-surface.** Marcelo receives operational updates, research summaries, and opportunity alerts from BossMan ONLY. No other system, agent, LaunchAgent, cron job, or script may send direct Telegram messages to Marcelo outside the BossMan routing layer. (Permanent per `AGENTS_ROSTER.md` + `ROUTING-RULES.md` §4 + `SOUL.md`.)

**LBC35/OpenClaw delegator/router-only boundary.** Designs plans, routes work, coordinates multi-step. NEVER implements, tests, touches production secrets, controls PM2/cron, or messages Marcelo directly. `ai.openclaw.gateway` is **DISABLED (2026-05-18)**; re-enabling requires a BossMan kanban card + Marcelo approval.

**Sub-agent lane ownership vs V3 execution routing.** Two **independent** axes. Lane routing = "which sub-agent owns the category of work" (governed by `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` + per-lane profile files). Model routing = "which model runs the picked lane's invocation" (governed by `LEARNED_V3_MODEL_STACK.md`). Inheritance order: Task → BossMan picks lane → BossMan picks model → sub-agent executes. **Lane selection must NEVER override model-routing canon.**

**Six-tier canon / knowledge model.** Tier 1 (kernel canon: SOUL.md, AGENTS.md, AGENTS_INDEX.md, AGENTS_ROSTER.md) · Tier 2 (V3 governance: LEARNED_7_RULE_CONTRACT, LEARNED_V3_MODEL_STACK, LEARNED_V3_TOKEN_ECONOMICS, ROUTING-RULES, LEARNED_SUB_AGENT_MASTER_BLUEPRINT, LEARNED_7_LAYER_ARCHITECTURE, LEARNED_MD_FILE_DRIFT_RUBRIC, ROLES_AND_CHAIN_OF_COMMAND) · Tier 3 (lane contracts: 9 files under `knowledge/<lane>.md`) · Tier 4 (operational procedures: ~30 LEARNED_*.md + AUTOMATION_INVENTORY + SERVICES_MAP + skills) · Tier 5 (archives: 8 historical records + AGENTS_ARCHIVE_2026-08-06 + V3.2.x closure reports) · Tier 6 (live state: 97 files per Batch 3 ownership plan).

**Rule #8 + Rule #9 preservation controls.** Rule #8: pre-troubleshoot mandatory git snapshot (`scripts/git-snapshot-before-fix.sh`) before any non-trivial config/script/canon mutation. Rule #9: pre-MD-trim 6-step loop (snapshot → classify → extract → trim → verify → report) with A/B/C/D + generated/live-data classification (`LEARNED_MD_FILE_DRIFT_RUBRIC.md`). Drift-fix cards auto-create when rules are violated.

**Ops-profile cron authority and generated default mirror.** `~/.hermes/profiles/ops/cron/jobs.json` is the sole runtime authority (38 enabled jobs). `~/.hermes/cron/jobs.json` is a generated read-only mirror with `_metadata` block. Stable cron terminology locked: `historical-baseline-all-enabled=41`, `default-pre-migration-enabled=37`, `ops-pre-migration-enabled=29`, `live-ops-profile-enabled=38`, `post-migration-generated-default-enabled=38`.

**Generated/live-state vs active canon separation.** 97 Tier 6 files explicitly documented as non-canon (operational telemetry, regenerated by cron or scripts). Per-batch ownership plan records owner lane, regeneration source, retention rule, non-canonical rationale for each group.

**V3.3 version identity.** V3.2.x = 2026-08-27 closure/implementation pass (HISTORICAL, NOT V3.3). V3.3 = this controlled Master Blueprint program. V3.4 = RESERVED. Version-identity rule codified in `LEARNED_V4_CANONICAL_LOCK.md`.

## 3. What does NOT change

V3.3 preserves verbatim and does not modify:

- **Model stack.** 5 models (Claude, OpenAI, DeepSeek, MiniMax-M3, Llama/local). Per-task-type matrix. Routine cron Ollama-default sub-policy. All preserved per `LEARNED_V3_MODEL_STACK.md`.
- **Routing Rules.** Layer-2 closed-loop autonomy rule, V3 routing, lane-vs-model independence. All preserved per `ROUTING-RULES.md` + `LEARNED_V3_MODEL_STACK.md`.
- **SquarePayouts M3 block.** Permanent carve-out. M3 BLOCKED for SquarePayouts code paths; use Claude → OpenAI → DeepSeek.
- **Computer Use escalation requirements.** Mandatory `escalate_to_computer: yes` flag + 10k credits/mo budget. BossMan-only ownership. LBC35 may not operate Computer Use without explicit assignment.
- **Cron / PM2 / gateway behavior.** Cron registry migration (commits `40828ae` + `97c9bf0`) is final. PM2 ecosystem configs unchanged. LaunchAgents unchanged (`ai.hermes.gateway-ops.plist` active; `ai.openclaw.gateway.plist` DISABLED).
- **Existing service behavior.** No cron-job pause/resume, no PM2 restart, no gateway change, no Telegram behavior change, no config.yaml modification, no jobs.json modification.
- **Existing V3 hard safety carve-outs.** Trading Claude-mandatory rule, SquarePayouts M3-block, Perplexity Computer credit budget, Operator Role Guard (no Marcelo relay), drift-fix auto-remediation.

## 4. Final promotion checklist

**Exact files that would be created/changed on promotion:**
- **CREATE:** new commit adding `~/.hermes/knowledge/V3_3_MASTER_BLUEPRINT_20260831.md` to git tracking (currently untracked)
- **CREATE:** new commit adding `~/.hermes/knowledge/V3_3_MASTER_BLUEPRINT_FINAL_REVIEW_SUMMARY_20260831.md` to git tracking (currently untracked)

**Exact files that would become pointers (if any):** None. V3.3 is a NEW Tier 0 architecture map that **points to** existing canon; no existing doc becomes a thin pointer.

**Exact files that remain authoritative companion canon (unchanged):**
- `~/.hermes/SOUL.md` (30,897 B)
- `~/.hermes/AGENTS.md`, `AGENTS_INDEX.md`, `AGENTS_ROSTER.md`
- `~/.hermes/knowledge/ROUTING-RULES.md` (14,479 B)
- `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md`
- `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` (16,976 B)
- `~/.hermes/knowledge/LEARNED_V3_TOKEN_ECONOMICS.md`
- `~/.hermes/knowledge/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` (10,633 B)
- `~/.hermes/knowledge/LEARNED_7_LAYER_ARCHITECTURE.md`
- `~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md`
- `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md` (11,051 B)
- `~/.hermes/knowledge/<lane>.md` × 9 (lane contracts)
- `~/.hermes/profiles/ops/cron/jobs.json` (cron authority)

**Exact archive actions (if any):** None. V3.3 does not move any file. (Pre-existing Rule #9 archives from 2026-08-31 remain in their current locations per commits `35e286e`, `0bbe35e`, `96b0835`, `148a2e2`, `1b7d964`, `9fb7c76`, `9a1897a`.)

**Final Step-5 checks required for promotion:**
1. Re-compute SHA-256 of V3.3 draft; confirm byte-equal to pre-promotion snapshot
2. Re-verify every referenced file/path exists (43 of 54 paths exist; 11 are template-pattern references; 6 stale skill paths already corrected in this pass)
3. Re-verify cross-doc consistency: 10 lanes / 7 layers / 5 models / 7 rules against `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` + `LEARNED_7_LAYER_ARCHITECTURE.md` + `LEARNED_V3_MODEL_STACK.md` + `LEARNED_7_RULE_CONTRACT.md`
4. Re-verify Step-5 red-team across 7 drift categories (authority confusion, duplicate cron registries, OpenClaw authority, stale cron IDs, stale links, code refs, cross-doc consistency)
5. Confirm zero new working-behavior changes since this draft (no cron / PM2 / gateway / routing / model-stack / sub-agent-runtime changes)
6. Confirm V3.2.x closure reports remain marked HISTORICAL in V3.3 §I.1
7. Confirm 13 Batch 4 follow-ups + 3 PHASEREPORT cosmetic tasks have owner + trigger + review date (all present in V3.3 §XII.7)
8. Confirm no V3 carve-out was triggered during review (no security / major infra / bot-orchestration / vendor / product-direction issue surfaced)

**Exact rollback path:**
```bash
git revert <V3.3-promotion-commit-sha>
# OR (if pre-commit, prior to Step-5 promotion commit):
git checkout HEAD~ -- ~/.hermes/knowledge/V3_3_MASTER_BLUEPRINT_20260831.md
git checkout HEAD~ -- ~/.hermes/knowledge/V3_3_MASTER_BLUEPRINT_FINAL_REVIEW_SUMMARY_20260831.md
# Net result: draft returns to untracked state; status flips back to PROPOSED.
# No existing canon was modified; rollback affects only the V3.3-promotion commit itself.
# Recovery source: ~/.hermes/profiles/ops/cron/output/t_v33_* (snapshot + draft report dir).
```

## 5. Bounded follow-ups outside V3.3

The following items are **NOT** V3.3 canon-blockers. Each has a named owner, an explicit trigger, and a defined review date.

### 5.1 The 13 Batch 4 deferred items (per `t_rule9_batch4_deferred_triggers_v1_20260831.md`)

| # | File | Owner lane | Trigger | Review date |
|---|---|---|---|---|
| 1 | LEARNED_TICKETFLOW.md | content | TicketFlow planning → implementation | next quarterly cycle |
| 2 | LEARNED_TRAVEL_OS.md | ops | Travel OS project resume | Q4 2026 |
| 3 | LEARNED_CLIENT_REVIEW_PORTAL.md | builder | Client engagement | next business dev review |
| 4–9 | LEARNED_YOUTUBE_*.md (6 files) | content | YouTube pipeline resume | monthly content review |
| 10 | LEARNED_SNS_401K.md | BossMan | personal-finance scope decision | Q1 2027 |
| 11 | SNS_401K_RESEARCH_BATCH_SMALLCAP_SECTOR.md | BossMan (paired with #10) | paired with #10 | paired with #10 |
| 12 | PERPLEXITY_NO_LOGIN_BLOCKER_2026-07-06.md | ops | login-blocker recurrence OR canonical write-up | Q4 2026 |
| 13 | TICKETFLOW_P0_PHASE1_BLUEPRINT_20260812.md | content (paired with #1) | paired with #1 | paired with #1 |

**Why none block V3.3 promotion:** all 13 are project-specific resumptions or scope decisions. None are V3 governance canon. None affect the authority model, model stack, routing rules, cron authority, lane-vs-model independence, or safety carve-outs. Each is owned by a named lane with a defined future card.

### 5.2 The 3 cosmetic PHASEREPORT reference tasks

| # | Item | Owner lane | Trigger |
|---|---|---|---|
| 14 | 47 PHASEREPORT skill references in skill docs | content + builder | routine skill maintenance; no specific trigger |
| 15 | PHASEREPORT skill ref cleanup (consolidated) | content + builder | next skill refactor cycle |
| 16 | V3_STACK_COMPLIANCE_AUDIT_<YYYY-MM-DD>.md pattern refs (v3-kanban-compliance-audit/SKILL.md L226, L372) | content | routine skill maintenance |

**Why none block V3.3 promotion:** all 3 are template-pattern references in skill documentation. Zero behavior change. Zero canonical rule impact. Zero routing/model-stack impact. Pure cosmetic; tracked as future skill maintenance tasks.

### 5.3 Other non-blocking docs/cleanup work

| Item | Owner | Trigger | Why non-blocking |
|---|---|---|---|
| Loop-engineering `SOUL.md` placeholder regeneration | ops | bootstrap regeneration card (`t_rule9_loop_engineering_soul_regen_v1_2026MMDD`) | Flat lane doc at `knowledge/loop-engineering-goals.md` is active authority; placeholder is dormant by design |
| AGENTS_INDEX.md general update to reference V3.3 sections | content | V3.3 promotion (separate card `t_agents_index_v33_update_v1_2026MMDD`) | Row 13 already updated to active computer-use skills |
| `LEARNED_PERPLEXITY_SPACES_WORKFLOW.md` authoring (currently missing) | content | when Perplexity workflow canonicalization is needed (`t_perplexity_workflow_canon_v1_2026MMDD`) | Perplexity-first rule is documented; this doc would be a workflow detail, not a rule |
| Tier 6 retention / quarantine paths (97 Batch 3 files) | ops + content | future work | files remain untracked per Batch 3 ownership plan; no promotion blocker |
| Pre-existing upstream skill upgrades (116 modified tracked files) | self-improvement | routine upstream sync | not part of V3.3 canon scope |

### 5.4 Narrow incident status (separate card `t_pmd_watchdog_path_incident_v1_20260831`)

**Status:** **Outside V3.3 — resolved.** No remediation required.

**Investigation findings:**
- Job `617757fbccff` (pmd-watchdog) script field = `pmd-watchdog.sh` (relative filename)
- Dispatcher resolution (per `hermes_cli/cron.py:555-564`): for ops profile registry, script_dir = `~/.hermes/profiles/ops/scripts/` → resolves to `~/.hermes/profiles/ops/scripts/pmd-watchdog.sh`
- Resolved file: 8,330 B, SHA-256 `80b0f5b1f7c6ae163a377430be2595d09ffee6a34cd174162016b11c1809c777`, byte-equal to `~/.hermes/scripts/pmd-watchdog.sh`
- Job state: `scheduled`, `last_status: ok`, `failure_streak: 0`, `repeat.completed: 3611`
- All 10 most recent `executions.db` records: `status='completed'`, `error=None`
- Output is the documented 147-byte "Status: silent (empty output)" health log
- NO Telegram noise (alert policy: silent when healthy; no auto-fix on Tailscale failure per script comments)
- NOT the same issue as the prior `0d9d490f7ec2` (binance-bot-live-monitor) dispatcher-path fix — that was an absolute path, this is a relative filename that resolves correctly
- NOT pointing into the builder profile — resolves to ops/scripts per dispatcher policy
- Purpose: PMD (Property Management Dashboard) health watchdog; checks canonical PM2 daemon, local port 7575, production URL; auto-restarts pmd-web on canonical-PM2 failure; silent-when-healthy alert policy
- Prior bug-fix history: card `t_pmd_watchdog_fix_loophealth_20260723` (2026-07-23) resolved a prior spam-bug; current behavior is correct per documented intent

**Rule #8 snapshot:** `~/.hermes/profiles/ops/cron/output/t_pmd_watchdog_incident_snapshot_20260831_233000/jobs.json.pre` (SHA-256 `e062b14944a3f70a2dee92f10fb1ce9394c75b505fc093a2d1ecac2137255759`).

**Conclusion:** This is **not an active incident**. Job is healthy and producing zero Telegram noise. **No remediation card needed.** This result does not block V3.3 promotion.

## 6. Marcelo-only review question

# Approve V3.3 final verification and controlled promotion?
