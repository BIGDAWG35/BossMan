# Hermes First Operating Blueprint
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

|| Model | Role | When to Use |
|-------|------|------------|
| **MiniMax 2.7** | Primary brain — orchestrator, routing, creative expansion, second-pass ideas | Everything except SquarePayouts |
| **DeepSeek** | Deep reasoning, technical validation, edge-case analysis, crypto logic, cycle comparison | Low-cost backup, all projects |
| **OpenAI** | Synthesis, product framing, operational writing, summarization | Clean production output, all projects |
| **Claude** | Architecture planning, workflow design, structured kanban planning, prompt/agent design | High-stakes review, all models conflict |
| **Perplexity** | Research, Deep Research, web reasoning, process analysis, crypto research, verification | Browser/Brave QA path |

### SquarePayouts Model Restriction (Permanent — 2026-05-20)

**MiniMax 2.7 is BLOCKED for all SquarePayouts work.** Use Claude, DeepSeek, or OpenAI only. Applies to all subagents and delegated executors.

### Detailed Tool Strategy → AGENTS.md

Tool-by-task strategy (Perplexity desktop app vs Hermes Computer Use vs Browser QA vs Terminal) is documented permanently in `AGENTS.md` under **Tool Strategy by Task Type**.

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
| Phase 5 | Add Telegram mobile controls for Kanban through BossMan | ✅ Done |
| Phase 6 | Pilot the new workflow using the money pipeline rebuild | ✅ Done |
| Phase 7 | Money Pipeline — operator mode (live usage, no new features) | 🔜 Active |
| Phase 8 | Source-required intake gate (highest-leverage data quality fix) | 🔜 Next |

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

|| Version | Date | Change ||
|---------|------|--------|
|| 1.0 | 2026-05-07 | Initial — Hermes-first, BossMan orchestrator, OpenClaw demoted ||
|| 1.1 | 2026-05-08 | Phase 4 — handoff packet format, routing checklist, LBC35 constraints, production workflow diagram, 3 test handoffs verified ||
|| 1.2 | 2026-05-20 | Track 1 additions — self-improvement rules, self-audit rules, verified sub-agent roster, memory capture policy ||

---

## Self-Audit Rules (Permanent)

BossMan performs a self-audit after every Kanban card completion:

| Question | Action if Uncomfortable Answer |
|----------|--------------------------------|
| Was the deliverable actually achieved? | Create follow-up card, don't close loose ends |
| Was Marcelo's time used well? | If no, write memory entry + improve routing |
| Did BossMan know enough at the start? | If no, add pre-flight check to the skill or workflow |
| Should this create a follow-up? | Create card immediately — don't drift |
| Is the documentation still accurate? | If stale, update before marking done |

### PM2 Health Monitor (Permanent — 2026-05-15, updated 2026-05-20)

**Job ID:** `d4f07e0c180f` — Hermes cron, `no_agent` mode, every 5 minutes
**Script:** `~/.hermes/scripts/pm2-health-monitor.sh`
**Monitored:** `binance-bot` | `squarepayouts` | `money-pipeline` | `bakery`

**Alert Rules (Marcelo's standing policy — 2026-05-16):**
1. **Silent when healthy** — zero messages if all services are online.
2. **Auto-fix silently** — restart down service with NO alert during fix attempt.
3. **Alert ONLY on two conditions:**
   - `SUCCESS`: service was down + auto-recovered → ONE message: "✅ FIXED: [service] was down, auto-restarted at [time]. Now stable."
   - `ESCALATION`: service is down + auto-restart FAILED → ONE message: "🚨 NEEDS ATTENTION: [service] is down and could not be auto-recovered. Manual fix required."
4. **No duplicate alerts** — lockfile per service (`/tmp/pm2-alert-[service].lock`) prevents repeated alerts.
**Log:** `~/logs/pm2-health.log`

### Weekly Systems Review (Permanent)

BossMan runs a weekly review every Monday morning covering:
- PM2 health log — any restarts or failures
- Kanban board — open cards, blocked items, aging tasks
- Cron jobs — any missed runs or errors
- Service ports — any anomalies from baseline
- Memory files — any stale entries to clean up
- Security audit schedule — confirm quarterly pentests are current

### Sub-Agent Performance Tracking (Permanent)

BossMan tracks per sub-agent:
- Completion rate (did work get done or blocked/failed?)
- Quality of handoffs (were summaries clear enough to act on?)
- Marcelo's satisfaction (any direct feedback?)
- Patterns — which profile works best for which task type

Findings update the routing rules in SOUL.md and this blueprint.

---

## Verified Sub-Agent Roster (Permanent — 2026-05-20)

All profiles exist and are operational on this machine:

| Profile | Role | Authority | Status |
|---------|------|----------|--------|
| `bossman` | Orchestrator, router, planner, approver | PRIMARY — routes all work | ✅ Active |
| `builder` | Code, dashboards, scripts, repos | Executes what bossman assigns | ✅ Active |
| `ops` | PM2, runtime, ports, infra | Executes what bossman assigns | ✅ Active |
| `trading` | Market research, signals | Executes what bossman assigns | ✅ Active |
| `content` | YouTube, scripts, docs | Executes what bossman assigns | ✅ Active |

LBC35/OpenClaw is a **delegated executor** — receives work exclusively via BossMan handoff packet. No autonomous actions.

---

## Memory Capture Policy (Permanent — 2026-05-20)

### Structured Tags

All memory entries use these tags for searchability:

| Tag | Use For |
|-----|---------|
| `[DECISION]` | Architectural choices, routing decisions, trade-offs |
| `[ARCHITECTURE]` | System design, service topology, data flows |
| `[SECURITY]` | Patches, vulnerabilities, hardening actions |
| `[PRICING]` | Product pricing, cost analysis, revenue decisions |
| `[PRODUCT]` | Feature planning, UX decisions, user feedback |
| `[ROUTING]` | Model selection, agent assignment, tool choice |
| `[WORKFLOW]` | Process improvements, automation patterns |
| `[TRADING]` | Binance signals, market analysis, bot config |
| `[PERFORMANCE]` | Speed improvements, resource optimization |
| `[PREFERENCE]` | Marcelo's stated likes/dislikes/tastes |

### Capture Triggers

- **Correction:** Marcelo corrects BossMan → immediately save what was wrong + correct approach
- **Preference:** Marcelo expresses a preference → immediately save to `memory` (user profile)
- **Workflow win:** BossMan discovers a better approach → save as skill within session
- **Tool quirk:** Tool behaves unexpectedly → save to `LEARNED_*.md` within session
- **Repeated failure:** Same error twice → save root cause + fix
- **Decision made:** Nontrivial choice → save to `memory/YYYY-MM-DD.md` same day
- **Delegation success:** Sub-agent outperforms expectations → note routing pattern

### Memory Files

| File | Contents | Update Frequency |
|------|----------|-----------------|
| `~/.hermes/memory/` | Marcelo's preferences, user profile facts | On expression |
| `~/.hermes/profiles/bossman/skills/` | Reusable workflows, proven approaches | On discovery |
| `~/.hermes/knowledge/LEARNED_*.md` | Tool workarounds, system quirks | Within session |
| `~/.hermes/knowledge/memory/YYYY-MM-DD.md` | Daily decisions, context | Same day |
| `~/.hermes/knowledge/LEARNED_CORE_ARCHITECTURE.md` | System design insights | On change |

### Retrieval Before Action

Before creating a Kanban card, spawning a sub-agent, or starting a deep-dive:
1. Check `memory` for Marcelo's preferences
2. Check relevant `LEARNED_*.md` for prior context
3. Run `session_search` for recent patterns

No "fresh start" assumption — continuity is the default.

### Trusted Learning Rules (Permanent)

- **Verified sources only** — don't trust a claim just because it's popular or repeated; verify before acting
- **Evidence-backed findings** — if you can't verify it, explicitly flag the confidence level as low
- **Compare when uncertain** — when confidence is low, run the same query through multiple models/sources and compare
- **Refine based on outcomes** — after every workflow, note what worked and what didn't; update patterns accordingly
- **No speculation as fact** — always label hypothesis vs. confirmed finding; don't let assumptions compound
- **Known vs. assumed** — known facts are durable; assumptions change; store them in separate sections so they can be updated independently

---

## Telegram Mobile Controls

---

## Telegram Mobile Controls

BossMan is already connected to Telegram. Send commands directly from your phone — BossMan interprets them and routes to the Kanban board.

### Quick Commands

| Action | Telegram message |
|--------|-----------------|
| Create card | `new card [title]` |
| List my cards | `list my cards` |
| List blocked | `list blocked cards` |
| Show card | `show [card id]` |
| Move card | `move [id] to [status]` |
| Add comment | `comment on [id]: [message]` |
| Assign | `assign [id] to [profile]` |
| Block | `block [id] because [reason]` |
| Unblock | `unblock [id]` |
| Request approval | `move [id] to awaiting approval` |

**Valid statuses:** `todo` | `planned` | `running` | `blocked` | `done` | `awaiting_approval`

**Profiles:** `bossman` | `builder` | `ops` | `trading` | `content` | `lbc35`

> Full command reference: `~/.hermes/knowledge/TELEGRAM_COMMANDS.md`

### Perplexity & Spaces Tool Selection Policy

When to use each tool:

| Tool | When to Use |
|---|---|
| **Perplexity Pro + Spaces** | Live research, Space-specific context, Deep Research reasoning |
| **Browser QA** | Normal web-app testing, DOM-level troubleshooting, localhost app flows |
| **Hermes Computer Use** | Real app/PWA/native UI on Mac mini (Perplexity app, Basecamp PWA, native app) |
| **Local code/CLI/DB** | Implementation, backend debugging, schema inspection |

**Perplexity ownership:** BossMan owns all Perplexity/Spaces coordination. Sub-agents may NOT access or modify Spaces without explicit BossMan assignment.

**Verification rule (all agents):** Any Space update (title, description, prompt, docs, deletions) must be confirmed after execution. Update is not complete until right Space was updated, content is correct, metadata is correct, obsolete content removed, result matches blueprint.

> Full Perplexity workflow: `~/.hermes/SOUL.md` — "Perplexity & Spaces Coordination"

### Example Workflows

**New task from anywhere:**
```
"new card Add Binance trading pause — assign to builder — priority 1"
→ BossMan creates card, assigns to builder, replies with card ID
```

**Quick board check:**
```
"what's blocked"
→ BossMan replies with all blocked cards and reasons
```

**Approve and close:**
```
"move t_1a4193ba to done"
→ BossMan marks done, replies confirmation
```

### What NOT to Do via Telegram

Still requires explicit BossMan approval:
- Stop/start PM2 services
- Change cron jobs
- Retire dashboards
- Modify Perplexity Spaces
- Delete cards

