# Phase 2-5 History — What Changed and Why

**Source:** PHASE2_PLANNING.md, PHASE3_PLANNING.md, PHASE4_REPORT.md, PHASE5_REPORT.md
**Context:** This is a condensed summary of the architecture transition from OpenClaw-primary to Hermes-primary

---

## Why the Architecture Changed

Before Phase 2, Marcelo was running a multi-agent system with LBC35 (OpenClaw) as the primary orchestrator. As the system grew (10+ PM2 processes, cron jobs, multiple bots, dashboards), Marcelo recognized that:

1. **LBC35 was making too many autonomous decisions** — routing work without explicit approval
2. **No single source of truth** — work was tracked in multiple places (Obsidian, memory, session logs)
3. **No formal Kanban** — tasks were not formally tracked with status, priority, assignees
4. **OpenClaw Brain was the primary vault** — Marcelo's knowledge was mixed with agent operational notes
5. **Bots were managed by LBC35 directly** — no guardrails on capital-risk decisions (trading bots)

The Phase 1 audit confirmed all of this. Phase 2 was the redesign.

---

## Phase 2: Architecture Redesign (2026-05-07)

**Decision:** Make Hermes/BossMan the primary orchestrator, demote LBC35 to delegated executor.

### Key Changes
- New LBC35 SOUL v2 created: "delegated executor under BossMan"
- Routing model: Marcelo → BossMan → Kanban → LBC35 → bots
- Kanban board created as single source of truth (`bossman` board)
- OpenClaw Brain vault designated as secondary/archive
- Hermes `~/.hermes/knowledge/` designated as primary vault

### Phase 2 Output
- `OPERATING_BLUEPRINT.md` v1.0 created
- `LBC35_SOUL_v2_delegated_executor.md` created
- Kanban schema defined
- Bot team placed under LBC35 coordination (within delegated scope)

---

## Phase 3: OpenClaw Docs Update (2026-05-10)

**Decision:** Update all OpenClaw core docs to reflect Hermes-primary architecture.

### Key Changes
- SOUL.md (OpenClaw): Removed "LBC35 = default orchestrator", replaced with Phase 3 Architecture Note
- AGENTS.md (OpenClaw): Added demotion header, retitled role to "Delegated Executor, Implementation Coordinator"
- TOOLS.md (OpenClaw): Updated primary orchestration (BossMan/Hermes), updated vault hierarchy, updated cron ownership table
- PROTOCOL.md, SYSTEM_INSTRUCTIONS.md, docs/SYSTEM_SERVICES_MAP.md: Archived to `archive/phase-2-deprecated/`

### Phase 3 Output
- Commit `f5eaa6917f4d3ce70058df196a930b8da1bde129`: Wave 1 core doc updates
- Commit `399141d`: Wave 2 archive created

---

## Phase 4: Kanban Schema + Basecamp Integration (2026-05-07)

**Decision:** Integrate Hermes Kanban with Basecamp for project management.

### Key Changes
- Kanban board: columns (todo, planned, running, blocked, done, awaiting_approval)
- Card structure: id, title, body, status, assignee, priority, timestamps, comments
- Basecamp project for each app (SquarePayouts, BakeryOps, Money Pipeline)
- Card Table in Triage status for all incoming feedback
- Normalization rule: all feedback → [BUG] / [UX] / [SUGGESTION] cards in Triage

### Phase 4 Output
- PHASE4_REPORT.md with Kanban schema
- Basecamp projects created for SquarePayouts and BakeryOps
- Testing workflow: pinned guide + project-specific checklist per Basecamp project

---

## Phase 5: Telegram Controls (2026-05-08)

**Decision:** Connect BossMan to Telegram so Marcelo can manage Kanban from anywhere.

### Key Changes
- BossMan connected to Telegram — receives messages, interprets, executes Kanban CLI calls
- All Telegram commands documented in `TELEGRAM_COMMANDS.md`
- Quick reference card created for Marcelo's phone
- 4 example workflows documented
- OPERATING_BLUEPRINT.md updated to v1.2 with Telegram section

### Phase 5 Output
- Commit `d2b8f89`: TELEGRAM_COMMANDS.md + OPERATING_BLUEPRINT v1.2
- Card `t_43dec590` marked done

---

## Current State (Post-Phase 5)

| Component | Status |
|-----------|--------|
| BossMan orchestrator | ✅ Active — routes all work |
| Kanban board | ✅ Active — single source of truth |
| LBC35 (delegated) | ✅ Active — executes assigned tasks |
| Telegram controls | ✅ Active — Marcelo can manage from anywhere |
| Perplexity Spaces | ✅ Built — Hermes-primary architecture |
| OpenClaw docs | ✅ Updated — Hermes-primary |
| OpenClaw Brain | Secondary/archive — no longer primary |

---

## Active Blockers

| Phase | Card | Blocker |
|-------|------|---------|
| Phase 6 | `t_71fdab1a` | Money Pipeline finance data source not confirmed |
| Phase 6 | `t_faa6d371` | Binance bot pre-trade-hook missing — needs restoration approval |

---

## Files to Reference

- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — v1.2 canonical
- `~/.hermes/knowledge/PHASE2_PLANNING.md` — Phase 2 planning
- `~/.hermes/knowledge/PHASE4_REPORT.md` — Kanban schema
- `~/.hermes/knowledge/PHASE5_REPORT.md` — Telegram controls
- `~/.hermes/knowledge/LBC35_SOUL_v2_delegated_executor.md` — LBC35 role
