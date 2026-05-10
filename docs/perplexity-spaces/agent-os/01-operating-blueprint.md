# Operating Blueprint
**Version:** 1.2
**Date:** 2026-05-08
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** Canonical — governs all work routing

---

## Overview

This document defines Hermes as the **primary control plane** for Marcelo's operations, with LBC35/OpenClaw as a **delegated execution layer** under BossMan's orchestration. All new work routes through Hermes. OpenClaw executes only what BossMan explicitly assigns.

---

## Core Operating Principle

> **BossMan routes. OpenClaw executes. Hermes knows.**
>
> Hermes (specifically BossMan via the bossman profile) is the single orchestration authority. All incoming tasks, questions, and work requests flow through BossMan first. BossMan decides what to do, what to delegate, and what to archive — never the other way around.

---

## System Map

```
Marcelo (human, decision authority)
    ↓
Hermes — BossMan profile (primary orchestrator, MiniMax 2.7)
    ↓
┌──────────────────────────────────────────────────────┐
│  Hermes Kanban (bossman board)                     │
│  Single source of truth for project state           │
│  All work tracked here. No work happens off-board. │
└──────────────────────────────────────────────────────┘
    ↓ routes to ↓
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ Hermes      │  │ Hermes       │  │ Hermes       │
│ Builder     │  │ Ops          │  │ Trading      │
└─────────────┘  └──────────────┘  └──────────────┘
    ↓                   ↓                 ↓
┌──────────────────────────────────────────────────────┐
│  LBC35 / OpenClaw (delegated executor)             │
│  Only acts on tasks BossMan explicitly assigns.      │
│  No autonomous decisions outside delegated scope.   │
└──────────────────────────────────────────────────────┘
```

---

## Profile Roles

| Profile | Role | Authority |
|---------|------|----------|
| **bossman** | Orchestrator, router, planner, approver | PRIMARY — routes all work |
| **builder** | Code, dashboards, scripts, repos | Executes what bossman assigns |
| **ops** | PM2, runtime, ports, infra | Executes what bossman assigns |
| **trading** | Market research, signals | Executes what bossman assigns |
| **content** | YouTube, scripts, docs | Executes what bossman assigns |
| **LBC35/OpenClaw** | Legacy executor | DEMOTED — delegated work only |

---

## Model Stack Policy

| Model | Role | When to Use |
|-------|------|------------|
| **MiniMax 2.7** | Primary brain | Everything, all day |
| **DeepSeek** | Analysis backup | MiniMax hits ceiling on complexity |
| **OpenAI** | Production text backup | Need clean production code/docs |
| **Claude** | Long-form reasoning backup | All models conflict or stall |

---

## Kanban Board

**Board:** `bossman`
**DB:** `~/.hermes/kanban/boards/bossman/kanban.db`
**Rule:** All work goes on the board. No work happens off-board.

### Columns / Statuses

- `todo` — New, not started
- `planned` — Queued, next up
- `running` — In progress
- `blocked` — Waiting on something
- `done` — Completed
- `awaiting_approval` — Needs Marcelo sign-off

### Card Structure

Every card has:
- `id` — Unique card ID (e.g. `t_71fdab1a`)
- `title` — Short description
- `body` — Full details, handoff context, links
- `status` — Current column
- `assignee` — Who is working it (bossman, builder, ops, trading, content, lbc35)
- `priority` — 1 (highest) to 3 (lowest)
- `created` / `updated` timestamps
- `comments` — Thread of discussion

---

## Telegram Control

**BossMan is connected to Telegram.** Marcelo sends natural-language requests to BossMan via Telegram. BossMan interprets and executes Kanban CLI calls. Responses come back to this Telegram chat.

### Quick Telegram Commands

```
new card [title]                          → Create card
list my cards                             → List assigned cards
list blocked                              → List blocked cards
show [card id]                            → Show card detail
move [id] to [status]                     → Change status
comment on [id]: [message]               → Add comment
assign [id] to [profile]                 → Assign card
block [id] because [reason]              → Block card
unblock [id]                             → Unblock card
```

### Profiles Available

`bossman` | `builder` | `ops` | `trading` | `content` | `lbc35`

---

## Phase Roadmap

| Phase | Status | Summary |
|-------|--------|---------|
| Phase 0 | ✅ Complete | Hermes install, profiles, tools |
| Phase 1 | ✅ Complete | Full audit of OpenClaw ecosystem |
| Phase 2 | ✅ Complete | Hermes-primary architecture finalized |
| Phase 3 | ✅ Complete | OpenClaw docs updated — LBC35 demoted to delegated executor |
| Phase 4 | ✅ Complete | Kanban schema + Basecamp integration |
| Phase 5 | ✅ Complete | Telegram controls for Kanban |
| Phase 6 | 🔴 Blocked | Money Pipeline rebuild + Binance bot fix — awaiting Marcelo decisions |
| Phase 7 | ⚠️ Partial | Perplexity Spaces done; PM dashboard retirement pending |

### Phase 6 Blockers (ACTIVE)

| Card | Blocker |
|------|---------|
| `t_71fdab1a` — Money Pipeline rebuild | Finance data source not confirmed — Marcelo must decide |
| `t_faa6d371` — Trading monitor fix | Binance bot pre-trade-hook missing — Marcelo must approve restoration |

---

## Architecture Evolution

### Before Phase 2 (OpenClaw-primary)

```
Marcelo → OpenClaw/LBC35 → bot team
```

LBC35 was primary orchestrator. OpenClaw Brain Obsidian vault was primary brain. Bots managed autonomously by LBC35.

### After Phase 2 (Hermes-primary)

```
Marcelo → BossMan/Hermes → Kanban board → LBC35 → bot team
```

BossMan routes all work. Kanban is single source of truth. LBC35 executes delegated tasks only. OpenClaw Brain is secondary/archive.

---

## Source Files

- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — This file
- `~/.hermes/knowledge/LBC35_SOUL_v2_delegated_executor.md` — LBC35 role definition
- `~/.hermes/knowledge/TELEGRAM_COMMANDS.md` — Telegram command reference
- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
