# Architecture Evolution — OpenClaw-Primary to Hermes-Primary

**Source:** OPERATING_BLUEPRINT.md, Phase 2-5 reports, LBC35_SOUL_v2
**Status:** Active

---

## Timeline

```
BEFORE PHASE 2 (OpenClaw-primary era)
├── LBC35 = primary orchestrator
├── OpenClaw Brain = primary vault
├── Bots managed autonomously by LBC35
├── No Kanban — work tracked in session/memory
└── Telegram → LBC35 → bots

AFTER PHASE 2 (Hermes-primary era)
├── BossMan/Hermes = primary orchestrator
├── ~/.hermes/knowledge/ = primary vault
├── LBC35 = delegated executor only
├── Kanban board = single source of truth
└── Telegram → BossMan → Kanban → LBC35 → bots
```

---

## What Changed and Why

### Before Phase 2

**Architecture:**
```
Marcelo → OpenClaw/LBC35 → bot team
```

**Problems:**
1. LBC35 was making autonomous decisions without Marcelo's approval
2. No single source of truth — work scattered across session logs and memory
3. No formal Kanban — tasks not tracked with status, priority, assignees
4. OpenClaw Brain was primary vault — mixed with agent operational notes
5. Bots were managed by LBC35 without formal guardrails on capital-risk decisions

**Evidence:** Phase 1 audit confirmed all of this — LBC35 was listed as "Manager, orchestrator, oversight lead" in AGENTS.md.

---

### Phase 2 Decision (2026-05-07)

Marcelo decided to restructure so that:
1. BossMan (Hermes) becomes the primary orchestrator — all work routes through it
2. Kanban becomes the single source of truth for all work
3. LBC35 is demoted to "delegated executor" — only acts on what BossMan explicitly assigns
4. OpenClaw Brain becomes secondary/archive
5. Bots are coordinated by LBC35 within the scope of BossMan-assigned tasks

**Key document:** LBC35_SOUL_v2_delegated_executor.md (created Phase 2)

---

### Phase 3 Update (2026-05-10)

OpenClaw Brain core docs (SOUL.md, AGENTS.md, TOOLS.md) updated to reflect the new architecture:
- LBC35 "orchestrator" role removed
- Phase 3 Architecture Note added to SOUL.md
- AGENTS.md role retitled to "Delegated Executor, Implementation Coordinator"
- TOOLS.md primary orchestration changed from "LBC35" to "BossMan/Hermes"
- PROTOCOL.md, SYSTEM_INSTRUCTIONS.md, docs/SYSTEM_SERVICES_MAP.md archived

**Key commits:** `f5eaa691` (Wave 1), `399141d` (Wave 2)

---

### Phase 4 — Kanban Schema + Basecamp (2026-05-07)

Kanban board created with:
- 6 columns: todo, planned, running, blocked, done, awaiting_approval
- Card structure: id, title, body, status, assignee, priority, timestamps, comments
- Basecamp projects for SquarePayouts and BakeryOps with testing checklists
- Card Table in Triage for feedback normalization

**Key concept:** No work happens off the Kanban board.

---

### Phase 5 — Telegram Controls (2026-05-08)

BossMan connected to Telegram so Marcelo can manage the Kanban board from anywhere:
- Natural language commands interpreted by BossMan
- CLI calls executed against the Kanban database
- Responses returned via Telegram

**Key document:** TELEGRAM_COMMANDS.md

---

## Current Architecture (Post-Phase 5)

```
┌──────────────────────────────────────────────────────┐
│  Marcelo (human, decision authority)                │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Hermes — BossMan profile (primary orchestrator)     │
│  • MiniMax 2.7 model                               │
│  • Owns Kanban board                               │
│  • Owns OPERATING_BLUEPRINT.md                     │
│  • Connected to Telegram                           │
└──────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────┐
│  Hermes Kanban (bossman board)                      │
│  • Single source of truth for all work             │
│  • 6 columns: todo→planned→running→blocked→done    │
│  • Cards: id, title, body, status, assignee, pri    │
└──────────────────────────────────────────────────────┘
                         ↓
          ┌──────────┬──────────┬──────────┐
          ↓          ↓          ↓          ↓
     ┌─────────┐ ┌─────────┐ ┌────────┐ ┌────────┐
     │ Builder │ │   Ops   │ │Trading │ │Content │
     └─────────┘ └─────────┘ └────────┘ └────────┘
          ↓
┌──────────────────────────────────────────────────────┐
│  LBC35 (delegated executor)                         │
│  • Only acts on tasks BossMan assigns              │
│  • Cannot self-assign or create workstreams        │
│  • Coordinates bot team within assigned scope     │
│  • Reads OpenClaw Brain files (SOUL, AGENTS)      │
└──────────────────────────────────────────────────────┘
                         ↓
              ┌──────────────────┐
              │ Bot team         │
              │ DWDAWGBOT        │
              │ YTDAWGBOT        │
              │ CSdawgbot        │
              │ SMDAWGBOT        │
              │ etc.             │
              └──────────────────┘
```

---

## Key Documents

| Document | Role |
|----------|------|
| `OPERATING_BLUEPRINT.md` | Canonical architecture (v1.2) |
| `LBC35_SOUL_v2_delegated_executor.md` | LBC35 role definition |
| `KANBAN_SCHEMA.md` (in PHASE4_REPORT) | Kanban structure |
| `TELEGRAM_COMMANDS.md` | Telegram control reference |
| `SERVICES_MAP.md` | Port and service map |
| OpenClaw SOUL.md (updated) | LBC35 identity + Phase 3 note |
| OpenClaw AGENTS.md (updated) | LBC35 role (delegated executor) |
| OpenClaw TOOLS.md (updated) | Orchestration, vault, cron |