# Hermes Sub-Agent Master Blueprint

**Status:** Approved v1.0 — Phase 0/1 complete, Phase 2 in progress
**System:** BossMan / Hermes Agent OS
**Date:** 2026-06-17 (original draft) — 2026-06-18 (saved to mirrors)
**Owner:** BossMan Hermes
**Canonical mirrors (in sync order):**
1. `~/.hermes/knowledge/hermes-sub-agent-master-blueprint.md` (primary)
2. `~/Obsidian/Hermes/10_Operating-Blueprint/hermes-sub-agent-master-blueprint.md` (vault)
3. `~/Repos/BossMan/docs/hermes-sub-agent-master-blueprint.md` (GitHub)
4. `~/.hermes/spaces/agent-os/hermes-sub-agent-master-blueprint.md` (Spaces — agent-os reference)

**v3 alignment:** This blueprint is the **lane-ownership layer** sitting on top of v3 execution routing. It does NOT modify v3 model roles, Computer Use ownership, escalation logic, or routing rules. All v3 docs remain the execution source of truth.

---

# Hermes Sub-Agent Master Blueprint

**Status:** Draft for approval before implementation  
**System:** BossMan / Hermes Agent OS  
**Date:** 2026-06-17

## Purpose

This blueprint defines the approved sub-agent architecture for BossMan after the v3 AI stack cleanup. It is designed to expand operational lanes without breaking the current v3 routing model, model roles, delegation rules, or documentation hierarchy.

The design keeps BossMan as the single orchestrator, preserves LBC35 as a delegated executor only, and introduces sub-agents as lane owners rather than competing managers or free-roaming bots. The goal is to improve control, reduce confusion, support 24/7 project operations, and turn more outputs into reusable knowledge, skills, and artifacts so token spend declines over time.

## Non-breaking design

The new sub-agent layer does **not** replace the v3 AI stack. The v3 stack remains the system of record for routing, model roles, QA, escalation, and build metrics.

Implementation should follow these rules:

- BossMan remains the only orchestrator, planner, approval surface, and final status surface.
- LBC35 remains a delegated executor and does not create workstreams, choose models, or change architecture on its own.
- Sub-agents are lane definitions and operating profiles, not alternate orchestrators.
- Model routing stays exactly as defined by v3: Research, Design, Build, Harden, QA, Docs.
- Computer Use ownership stays with BossMan and does not move to sub-agents unless explicitly assigned in canon-compliant handoff packets.
- All work continues to live on the Kanban board, with no hidden missions or side channels.

This means the rollout is additive, not disruptive. The sub-agent system sits **on top of** v3 as a lane-and-ownership framework while v3 remains the execution-routing framework.

## Final sub-agent roster

The recommended final roster is nine sub-agents total.

| Sub-agent | Mission | Primary scope |
|---|---|---|
| Builder | Build working systems and features. | Features, fixes, implementation, integrations, shipping code. |
| Content | Produce user-facing and knowledge-facing written assets. | Copy, prompts, docs, specs, README-quality output, polished artifacts. |
| Ops | Keep infrastructure and automations healthy. | PM2, cron, monitors, runtime hygiene, service audits, system stability. |
| Trading | Own money intelligence and monetization thinking. | Crypto, stocks, market intel, pricing, packaging, monetization logic, financial operating decisions. |
| Self-Improvement / Curriculum | Improve Marcelo as an operator over time. | Learning plans, curricula, skill ladders, lessons capture, review systems. |
| Loop Engineering / Goals | Design self-working loops that move goals forward. | Goal systems, weekly loops, automation logic, review cycles, progress machinery. |
| QA / Verification | Try to break work before it is presented. | Step-5 QA, regression checks, edge cases, signoff confidence, red-team review. |
| Research / Intel | Turn external info into usable action. | Step-1 research, docs, APIs, current-state verification, competitor/process intelligence. |
| Knowledge / Canon / Reuse | Convert outputs into reusable system memory. | Canon docs, LEARNED rules, skills, templates, mirrors, token-cost containment, reusable artifact capture. |

## Sub-agent responsibilities

### Builder

Builder owns implementation delivery. It should operate inside the v3 build flow and never bypass the modelplan, QA requirements, or card logging rules.

### Content

Content owns all written outputs that need to be clear, polished, and reusable. This includes prompts, instructions, docs, internal writeups, and final-facing language that ships into repos or knowledge layers.

### Ops

Ops owns runtime reliability and automation hygiene. This lane includes PM2, cron, health monitors, cleanup audits, service stability, and operational enforcement of existing system rules.

### Trading

Trading is no longer just crypto-bot thinking. It should formally include crypto, stocks, market intelligence, monetization design, price-setting, packaging logic, and operational finance decisions for products and services.

### Self-Improvement / Curriculum

This lane owns all learning architecture for Marcelo. It should create staged curricula, review structures, durable lesson capture, and operator-improvement systems similar to the existing crypto-learning formalization.

### Loop Engineering / Goals

This lane owns the machinery that turns goals into recurring progress. It should define triggers, review loops, auto-advance patterns, approval points, and no-spam-safe recurring structures that actually move work forward.

### QA / Verification

QA / Verification is a distinct lane because v3 formalized Step 5 QA as a named stage, mandatory for critical cards touching money, PII, infra, trading, auth, or public APIs. This agent does not primarily build; it tries to break, verify, and harden before presentation.

### Research / Intel

Research / Intel owns structured discovery. Since v3 makes research the first step for non-trivial work, this lane should own fact gathering, doc digestion, source linking, and turning research into clear card-ready inputs.

### Knowledge / Canon / Reuse

This lane is critical for preventing cost drift. It should own canon hygiene, mirrors, reusable skills, LEARNED rules, project knowledge docs, templates, and the rule that paid-model outputs must be captured into reusable artifacts instead of dying in chat history.

## Cost-control rule

The system should formalize a new permanent rule under Knowledge / Canon / Reuse:

**No paid-model call should end as chat-only output if the result is reusable.**

Reusable outputs should be captured into one of the following:

- `.hermesknowledge` document.
- LEARNED rule file.
- Reusable skill.
- MD template or operating blueprint.
- Kanban card artifact path or commit SHA logged on the card.
- Repo doc or Obsidian mirror when the content is durable.

This rule fits the existing v3 token-and-cost policy, which already requires rough model usage logging and output locations so future work can reuse prior outputs instead of repaying for the same reasoning.

## MD file standard

Every sub-agent should have its own dedicated MD file. Existing sub-agent files should be updated or replaced so all agents follow one uniform structure.

Recommended file sections for every sub-agent MD:

1. Title and status.
2. Mission.
3. In-scope responsibilities.
4. Out-of-scope responsibilities.
5. Relationship to BossMan.
6. Relationship to LBC35 and delegated executors.
7. Required handoff packet fields.
8. Verification standard.
9. Knowledge capture and artifact rules.
10. Escalation triggers.
11. Canon files this agent must obey first.
12. Version history.

Recommended file set:

- `builder.md`
- `content.md`
- `ops.md`
- `trading.md`
- `self-improvement-curriculum.md`
- `loop-engineering-goals.md`
- `qa-verification.md`
- `research-intel.md`
- `knowledge-canon-reuse.md`

## Phase plan

### Phase 0 — Freeze and protect current v3

Before changing any agent files, freeze the current v3 architecture as the active execution baseline. Routing Rules v3 and AGENTS v3 remain the source of truth during the whole rollout.

Deliverables:
- Confirm current v3 docs are the baseline.
- Do not change routing logic, model roles, Computer Use ownership, or escalation rules during sub-agent rollout.
- Open a parent Kanban card for the sub-agent architecture rollout.

### Phase 1 — Blueprint approval

Approve this master blueprint before any implementation. The purpose is to lock the roster, the lane definitions, and the non-breaking rollout rules first so file creation does not drift.

Deliverables:
- Final approved roster of nine sub-agents.
- Final naming convention for each agent.
- Approval that Knowledge / Canon / Reuse owns token-cost containment.
- Approval that v3 remains unchanged as the routing layer.

### Phase 2 — Inventory current agent files

Audit what MD files already exist for current sub-agents and identify which should be updated versus replaced. This should happen before writing new files so naming and placement stay clean.

Deliverables:
- Inventory table of current sub-agent MD files.
- Decision per file: keep, rewrite, replace, or archive.
- Canonical destination folder for the new agent files.

### Phase 3 — Draft all agent MD files

Create the full set of nine sub-agent MD files using a common template. Keep them role-focused and avoid mixing project history into them, because durable rules belong in canon and project specifics belong in project docs and cards.

Deliverables:
- Nine drafted agent MD files.
- Uniform structure across all files.
- Explicit in-scope and out-of-scope boundaries to prevent overlap.

### Phase 4 — Wire the handoff model

Update handoff expectations so BossMan can route by lane without changing the v3 model stack. This phase should clarify that lane selection determines ownership, while model selection still follows Routing Rules v3.

Deliverables:
- Short addendum in canon describing lane routing versus model routing.
- Handoff packet examples for at least Builder, QA, Loop Engineering, and Knowledge / Canon / Reuse.
- Clarification that sub-agents do not override v3 model roles.

### Phase 5 — Knowledge and reuse enforcement

Add the anti-drift rules for reusable outputs and cost control. This is where the token-recycling concern becomes a formal operating standard instead of a remembered habit.

Deliverables:
- Permanent rule: no reusable paid-model output remains chat-only.
- Capture destinations defined by content type.
- Monthly reuse review added to build-metrics or adjacent review cadence.

### Phase 6 — Soft activation

Activate the new sub-agent architecture without changing underlying routing behavior. BossMan begins using the new lane names on cards and handoffs while execution still follows the existing v3 build flow.

Deliverables:
- New sub-agent names used on selected cards.
- Trial handoffs in low-risk work first.
- Verify there is no confusion between lane owner and model role.

### Phase 7 — Full adoption and cleanup

After the soft activation succeeds, replace old sub-agent references, archive legacy wording, and update mirrors so the system reads as one clean architecture.

Deliverables:
- Legacy sub-agent wording cleaned up.
- Mirrors updated in the right order.
- PHASEREPORT entry added after rollout is verified.

## Safe implementation rule

The safest way to implement this without interfering with the v3 AI stack is to keep a strict separation between these two layers:

- **Layer 1: v3 execution routing** — models, QA, escalation, cost policy, Computer Use rules, and Kanban fields remain unchanged.
- **Layer 2: sub-agent lane ownership** — defines who owns the workstream category, the documentation, and the handoff boundary.

If that separation is preserved, the system does not get messy. Problems only appear if sub-agents are allowed to become alternate orchestrators or if lane ownership starts replacing the formal v3 model-routing rules.

## Recommended next actions

1. Approve the nine-agent roster and phase plan.
2. Inventory existing sub-agent MD files before editing anything.
3. Draft the shared MD template once, then generate all nine files from it.
4. Add the Knowledge / Canon / Reuse cost-capture rule before activation so token drift is controlled from day one.
5. Roll out in soft activation mode first, then clean up legacy wording only after verification.
