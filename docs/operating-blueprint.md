# Hermes First Operating Blueprint
**Version:** 1.0
**Date:** 2026-05-07
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
│  Hermes Kanban (bossman board)                       │
│  Single source of truth for project state            │
│  All work tracked here. No work happens off-board.  │
└──────────────────────────────────────────────────────┘
    ↓ routes to ↓
┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│ Hermes      │  │ Hermes       │  │ Hermes       │
│ Builder     │  │ Ops          │  │ Trading      │
│ (builder)   │  │ (ops)        │  │ (trading)   │
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

| Status | Meaning |
|--------|---------|
| `inbox` | Raw incoming, not triaged |
| `planned` | Triaged, queued |
| `running` | Work in progress |
| `client_testing` | Build ready for testers |
| `feedback_review` | Processing feedback |
| `blocked` | Waiting on something |
| `awaiting_approval` | Needs Marcelo's sign-off |
| `done` | Completed |

---

## Routing Rules

| Task type | → Assign to |
|-----------|-------------|
| Routing, planning, approvals | `bossman` |
| Code, features, dashboards, Git | `builder` |
| Runtime, PM2, ports, infra | `ops` |
| Market research, signals | `trading` |
| Content, YouTube, docs | `content` |
| OpenClaw execution tasks | `lbc35` (explicit assignment only) |

---

## Hermes ↔ OpenClaw Handoff Protocol

When BossMan assigns work to OpenClaw/LBC35:

1. BossMan creates a Kanban card with:
   - Clear deliverable description
   - Explicit constraints (what NOT to do)
   - Deadline if applicable
   - Success criteria
2. BossMan moves card to `planned` — OpenClaw picks it up
3. OpenClaw executes and reports completion on the card
4. BossMan reviews and moves to `done` or `feedback_review`

**OpenClaw must NOT:**
- Create its own Kanban cards
- Act on tasks not assigned by BossMan
- Modify routing rules or profiles
- Access services outside its delegated scope

---

## Migration Phases

| Phase | Title | Status |
|-------|-------|--------|
| Phase 0 | Save blueprint and freeze architecture | ✅ Done |
| Phase 1 | Audit OpenClaw assets, PM2, cron, bots, dashboards, ports | 🔜 Next |
| Phase 2 | Define Hermes as primary control plane | 🔜 Next |
| Phase 3 | Demote LBC35 to delegated execution coordinator | 🔜 Next |
| Phase 4 | Implement Kanban schema + Hermes↔OpenClaw handoff model | 🔜 Next |
| Phase 5 | Add Telegram mobile controls for Kanban through BossMan | 🔜 Next |
| Phase 6 | Pilot the new workflow using the money pipeline rebuild | 🔜 Next |
| Phase 7 | Retire old PM dashboard and rebuild Perplexity Spaces | 🔜 Next |

---

## What NOT to Do Yet (Until Approved)

- ❌ Do NOT shut down PM2, cron, dashboards, or bots
- ❌ Do NOT rewrite LBC35's role
- ❌ Do NOT delete any Perplexity Spaces
- ❌ Do NOT make OpenClaw execute anything autonomously

These actions require Marcelo's explicit approval after reviewing the Phase 1 audit report.

---

## Document Locations

| Copy | Path |
|------|------|
| Local | `/Users/bigdawg/Desktop/hermes-docs/operating-blueprint.md` |
| GitHub | `BIGDAWG35/BossMan/docs/operating-blueprint.md` |
| Obsidian | `/Users/bigdawg/Obsidian/Hermes/Systems/operating-blueprint.md` |
| Hermes knowledge | `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-07 | Initial — Hermes-first, BossMan orchestrator, OpenClaw demoted to delegated executor |
