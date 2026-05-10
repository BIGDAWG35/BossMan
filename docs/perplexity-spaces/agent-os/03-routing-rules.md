# Routing Rules — How Work Flows

**Source:** OPERATING_BLUEPRINT.md v1.2 (lines 23-46)
**Status:** Active — canonical routing model

---

## Primary Flow

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

## Routing Summary

| Who | Role | Routes To |
|-----|------|-----------|
| Marcelo | Decision authority — approves all significant work | BossMan |
| BossMan (Hermes bossman profile) | Orchestrator, router, planner, approver | Kanban → assigns to profiles |
| Hermes Builder | Code, dashboards, scripts, repos | Executes assigned tasks |
| Hermes Ops | PM2, runtime, ports, infra | Executes assigned tasks |
| Hermes Trading | Market research, signals | Executes assigned tasks |
| Hermes Content | YouTube, scripts, docs | Executes assigned tasks |
| LBC35/OpenClaw | Legacy delegated executor | Only executes what BossMan assigns |

---

## Work Assignment Rules

1. **No work happens off the Kanban board** — all tasks tracked as cards
2. **BossMan routes** — Marcelo sends to BossMan, BossMan creates card and assigns
3. **LBC35 cannot self-assign** — BossMan must explicitly route to LBC35
4. **Profiles execute** — builder/ops/trading/content execute what bossman assigns
5. **LBC35 reports back** — completion or blockers as comments on the card
6. **BossMan closes card** — LBC35 does not mark cards done

---

## Telegram Routing (via BossMan)

Marcelo → Telegram → BossMan → Kanban CLI → Kanban board

BossMan interprets natural-language Telegram messages and executes corresponding `hermes kanban` CLI calls. Responses return to Marcelo via Telegram.

Quick commands:
```
new card [title]              → Create card
list my cards                 → List assigned cards
move [id] to done            → Complete card
comment on [id]: [message]   → Add comment
```

---

## What BossMan Does NOT Route To LBC35

- Strategic decisions (profit targets, capital allocation, phase priorities)
- New project creation or architecture changes
- Deleting or archiving cards
- Modifying Perplexity Spaces
- Stopping or starting PM2 services
- Changing cron jobs
- Accessing Marcelo's personal accounts (email, banking, etc.)

All of the above require Marcelo's explicit approval.

---

## Bot Team (via LBC35)

When LBC35 receives an assigned task, it may route sub-tasks to specialized bots:

| Bot | Specialty |
|-----|-----------|
| DWDAWGBOT | Coding, web dev, Cursor work |
| YTDAWGBOT | YouTube: setup, optimization, strategy, ops |
| SMDAWGBOT | Social media, web/content monitoring |
| IDEASDAWGBOT | Idea capture, brainstorming, routing |
| CSdawgbot | Crypto, stocks, market trends |
| Debuggingdawgbot | Debugging, security |
| OPdawgbot | Operations, finance |
| Chacha13bot | Isolated sandbox (no shared projects/settings) |

LBC35 coordinates bot sub-tasks but does not autonomously assign them — all bot routing is within the scope of BossMan-assigned tasks.
