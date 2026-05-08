# Hermes First Operating Blueprint
**Version:** 1.1
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

### Priority Levels

| Priority | Meaning |
|----------|---------|
| 1 | Critical — must address before anything else |
| 2 | High — schedule this phase |
| 3 | Medium — backfill when capacity allows |

### Card Lifecycle

```
inbox → planned → running → client_testing → feedback_review → done
                 ↑
           (blocked ← awaiting_approval)
```

---

## Routing Rules

| Incoming task type | → Assign to | Via |
|--------------------|-------------|-----|
| Routing, planning, approval decisions | `bossman` | Direct |
| Code, features, dashboards, scripts, Git work | `builder` (Hermes) | BossMan assigns |
| Runtime, PM2, ports, infra, servers | `ops` (Hermes) | BossMan assigns |
| Market research, trading signals, crypto | `trading` (Hermes) | BossMan assigns |
| YouTube, content, scripts, docs | `content` (Hermes) | BossMan assigns |
| Legacy OpenClaw tasks, microapps | `lbc35` | **Handoff packet ONLY** |
| One-off research, reading, cross-repo synthesis | `lbc35` | **Handoff packet ONLY** |
| Tasks not matching above | `bossman` | Escalate |

**Rule:** LBC35 receives work **exclusively** via handoff packet. No other routing path to LBC35 is valid.

---

## Handoff Packet Format (Standard)

### BossMan → Agent

```
From: BossMan
To: [agent_id]
Task ID: [kanban_card_id]
Priority: 1-3
Created: [ISO timestamp]

### Task Summary
[1-3 sentences — what, why, and what success looks like]

### Deliverables
- [ ] [Deliverable 1 — specific and testable]
- [ ] [Deliverable 2]

### Constraints
- [Hard constraint 1 — what NOT to do]
- [Hard constraint 2]

### Source Docs
- [File path] — required reading before starting
- [File path] — reference only

### Success Criteria
[How BossMan evaluates completion]

### Escalation
If blocked: comment on card + @mention BossMan. Do not wait.

*Generated by BossMan. All work authorized here.*
```

### Agent → BossMan (completion report)

```
From: [agent_id]
To: BossMan
Task ID: [kanban_card_id]
Status: ✅ Complete / ⚠️ Partial / 🔴 Blocked
Completed: [ISO timestamp]

### What Was Done
[Description of actions taken]

### Deliverables
- [x] [Deliverable 1] — ✅ done / ⚠️ partial
- [ ] [Deliverable 2] — reason if not done

### Files Modified
- [Path] — [change summary]

### Issues / Blockers
[Any remaining issues]

*Reported by [agent_id] to BossMan via Kanban card [ID].*
```

---

## LBC35 Constraint Checklist

LBC35 **must NOT** under any circumstances:
- [ ] Self-assign tasks — wait for BossMan handoff packet
- [ ] Create new Kanban cards without BossMan approval
- [ ] Modify PM2 processes, cron jobs, or system services
- [ ] Retire or alter dashboards
- [ ] Access or modify Perplexity Spaces
- [ ] Change routing rules or agent profiles
- [ ] Create new projects or change architecture
- [ ] Modify openclaw.json or agent SOUL files
- [ ] Access services outside delegated scope
- [ ] Override BossMan decisions

LBC35 **may** without asking:
- Use exec, read, write, image_generate, video_generate, music_generate, tts, subagents, cron, sessions tools freely within assigned task scope
- Ask BossMan for clarification when task is ambiguous
- Report blockers promptly via Kanban card comment

---

## Migration Phases

| Phase | Title | Status |
|-------|-------|--------|
| Phase 0 | Save blueprint and freeze architecture | ✅ Done |
| Phase 1 | Audit OpenClaw assets, PM2, cron, bots, dashboards, ports | ✅ Done |
| Phase 2 | Define Hermes as primary control plane | ✅ Done |
| Phase 3 | Demote LBC35 to delegated execution coordinator | ✅ Done |
| Phase 4 | Implement Kanban schema + Hermes↔OpenClaw handoff model | ✅ Done |
| Phase 5 | Add Telegram mobile controls for Kanban through BossMan | 🔜 Next |
| Phase 6 | Pilot the new workflow using the money pipeline rebuild | 🔜 Next |
| Phase 7 | Retire old PM dashboard and rebuild Perplexity Spaces | 🔜 Next |

---

## What NOT to Do Yet (Until Approved)

- ❌ Do NOT shut down PM2, cron, dashboards, or bots
- ❌ Do NOT rewrite LBC35's role
- ❌ Do NOT delete any Perplexity Spaces
- ❌ Do NOT make OpenClaw execute anything autonomously

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
| 1.0 | 2026-05-07 | Initial — Hermes-first, BossMan orchestrator, OpenClaw demoted |
| 1.1 | 2026-05-08 | Phase 4 — handoff packet format, routing checklist, LBC35 constraints, production workflow diagram, 3 test handoffs verified |
