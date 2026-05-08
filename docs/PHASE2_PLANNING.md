# Phase 2 Planning Document
**Hermes Primary Control Migration**
**Date:** 2026-05-07
**Phase:** Planning only — no live changes

---

## Purpose

This document captures all Phase 2 planning artifacts for review before Phase 3 execution. No live changes have been made. All items here are ready for Marcelo's approval before implementation.

---

## PART 1 — Proposed New LBC35 SOUL (Demoted Role)

**Status:** DRAFT — not applied. For review only.

### Where to Find Current LBC35 Config

LBC35 is defined in `~/.openclaw/openclaw.json` under `agents.list`. It has:
- Workspace: `/Users/bigdawg/.openclaw/workspace-lbc35/`
- Model: `minimax-portal/MiniMax-M2.1`
- Tools: exec, read, write, image_generate, video_generate, music_generate, tts, image, subagents, cron, sessions

There is **no SOUL.md file** for LBC35. The "SOUL" concept for OpenClaw maps to the agent's `prompt.md` or `instructions.md` in the agent dir, neither of which exists for lbc35.

The demotion is a **role/configuration change** — the new behavior is expressed through a new SOUL.md file to be placed at `~/.openclaw/agents/lbc35/SOUL.md`, paired with an updated openclaw.json entry.

---

### PROPOSED NEW LBC35 SOUL.md

```markdown
# LBC35 — Delegated Executor Under BossMan

**Version:** 2.0
**Date:** 2026-05-07
**Status:** DRAFT — pending Marcelo approval

---

## Role

You are LBC35 — a delegated execution sub-agent operating under BossMan (the Hermes orchestrator).

**You are NOT the primary manager.** BossMan routes work to you. You execute and report back. You do not initiate new workstreams, assign tasks, or manage other agents without being asked.

When in doubt, escalate to BossMan.

---

## Authority

- Execute tasks explicitly assigned by BossMan
- Use tools freely for assigned work
- Ask BossMan for clarification when a task is ambiguous
- Report completion or blockers to BossMan promptly

## Constraints

- Do NOT create new projects or change architecture without BossMan approval
- Do NOT modify PM2, cron, dashboards, or system services unless BossMan explicitly assigns it
- Do NOT access OpenClaw workspace files for tasks that belong in the Hermes workspace
- Do NOT override BossMan decisions
- If a task conflicts with a BossMan directive, flag it and wait for resolution

## Relationship to BossMan

- BossMan is the orchestrator — LBC35 is the executor
- BossMan owns routing, planning, and escalation
- LBC35 owns implementation of assigned tasks
- Communication flows through BossMan — LBC35 does not directly manage other agents

## Workspace

Work in: `/Users/bigdawg/.openclaw/workspace-lbc35/`

Use Hermes docs only when BossMan explicitly directs you to. Otherwise use OpenClaw workspace for OpenClaw tasks.

## Model

Primary: `minimax-portal/MiniMax-M2.1`
Fallbacks: BossMan-approved escalation path only when MiniMax-M2.1 is unavailable.

---

*This SOUL replaces any prior role definition that characterized LBC35 as primary manager or orchestrator.*
```

---

### OpenClaw.json Agent Config Update (proposed)

```json
{
  "id": "lbc35",
  "name": "lbc35",
  "workspace": "/Users/bigdawg/.openclaw/workspace-lbc35/",
  "agentDir": "/Users/bigdawg/.openclaw/agents/lbc35/agent",
  "model": "minimax-portal/MiniMax-M2.1",
  "tools": {
    "allow": [
      "exec",
      "read",
      "write",
      "image_generate",
      "video_generate",
      "music_generate",
      "tts",
      "image",
      "subagents",
      "cron",
      "sessions"
    ]
  },
  "role": "delegated_executor",
  "reportsTo": "bossman",
  "soUL": "delegated_executor_v2"
}
```

**Note:** The `role` and `reportsTo` fields are proposed additions — verify OpenClaw supports these fields before applying. If not supported, the SOUL.md file alone establishes the behavioral contract.

---

## PART 2 — Final Kanban Schema + Handoff Packet Formats

### Kanban Board: `bossman`

**Current project:** `hermes-primary-control-migration` (id: `hermes-primary-control-migration`)
**Card table:** `tasks`
**Comment table:** `task_comments`

### Project Schema

| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | Unique card ID (e.g. `t_a6cec443`) |
| title | TEXT | Card title |
| body | TEXT | Card description / full content |
| status | TEXT | `todo` / `in_progress` / `done` / `cancelled` |
| priority | INTEGER | 1=urgent, 2=normal, 3=low |
| assignee | TEXT | `bossman` or specific sub-agent |
| tags | TEXT | comma-separated labels |
| createdAt | TEXT | ISO timestamp |
| updatedAt | TEXT | ISO timestamp |

### Card Status Lifecycle

```
todo → in_progress → done
  ↑__________|
  (blocked → todo)
```

- `todo` — ready to work
- `in_progress` — actively being worked
- `done` — completed, deliverables met
- `cancelled` — superseded or abandoned
- `blocked` — represented by a comment, not a status — tag card with `blocked`

### Priority Levels

| Priority | Label | Use case |
|----------|-------|----------|
| 1 | Urgent | Active incidents, live money at risk |
| 2 | Normal | Standard work items |
| 3 | Low | Backlog, nice-to-haves |

### Handoff Packet Format (Hermes → OpenClaw / LBC35)

When BossMan delegates a task to LBC35, the handoff packet follows this structure:

```markdown
## Handoff Packet

**From:** BossMan (Hermes orchestrator)
**To:** LBC35
**Task ID:** [Kanban card ID]
**Priority:** [1-3]
**Created:** [ISO timestamp]

---

### Task Summary
[1-2 sentence description of what LBC35 should do]

### Deliverables
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]

### Constraints
- [Hard constraint 1 — do not deviate]
- [Hard constraint 2 — do not deviate]

### Source Docs
- [File or path 1 — required reading]
- [File or path 2 — required reading]

### Success Criteria
[How BossMan will evaluate completion]

### Escalation
If blocked: add comment to card [card ID] and @mention BossMan.
Do not wait more than [X hours] before escalating.

---

*This packet was generated by BossMan. LBC35 executes and reports to this card.*
```

### Handoff Packet Format (LBC35 → BossMan Completion Report)

```markdown
## Completion Report

**From:** LBC35
**To:** BossMan
**Task ID:** [Kanban card ID]
**Completed:** [ISO timestamp]

---

### Status
✅ Complete / ⚠️ Partial / 🔴 Blocked

### What Was Done
[Description of work completed]

### Deliverables Met
- [ ] [Deliverable 1 — status]
- [ ] [Deliverable 2 — status]

### Files Modified
- [File path] — [change summary]

### Remaining Issues
[Any issues, blockers, or partial completion]

### Next Steps (recommended)
[If partial — what should happen next]

---

*Reported by LBC35 to BossMan via Kanban card [card ID].*
```

### Hermes ↔ OpenClaw Document Handoff Rules

| Document Type | Owner | Access |
|-------------|-------|--------|
| Operating policy, routing decisions | Hermes — `~/.hermes/knowledge/` | Hermes reads; OpenClaw receives excerpts only |
| Task cards, Kanban | Hermes — `~/.hermes/kanban/` | BossMan owns; LBC35 receives packet summaries |
| OpenClaw agent configs, SOULs | OpenClaw — `~/.openclaw/` | LBC35 owns; BossMan can read for oversight |
| Implementation code, scripts | Project repos | Both can access; BossMan approves structural changes |
| Perplexity Spaces | Hermes — `~/Desktop/perplexity-spaces Hermes/` | Hermes only — OpenClaw does not reference |

---

## PART 3 — Updated SERVICES_MAP — Unknown Ports

### Previously Unknown Ports — Now Identified

| Port | Owner | Service | PM2 | Project Path | Status |
|------|-------|---------|-----|--------------|--------|
| 8003 | Marcelo | `team-standup-bot` | Not PM2 (manual) | `/Users/bigdawg/Projects/team-standup-bot/` | ✅ Active |
| 8102 | Marcelo | `quick-stats` | Not PM2 (manual) | `/Users/bigdawg/Projects/quick-stats/` | ✅ Active |
| 9119 | Hermes | `hermes dashboard` | Not PM2 (Hermes CLI) | Built-in Hermes dashboard | ✅ Active (CLI tool) |

**Note on port 9119:** This is the Hermes internal dashboard accessible via `hermes dashboard` CLI command. Not a persistent web service — activated on demand. Classified as a Hermes internal tool, not a deployable service.

**Note on ports 8003 and 8102:** These Node.js servers are running as standalone processes (not PM2 managed). Both are active. Recommend migrating to PM2 management in a later phase for consistency.

### Updated SERVICES_MAP Entry (replace the "unknown" classification)

```markdown
### Active Services — Fully Identified (Updated 2026-05-07)

| Service | Port | Type | PM2 Name | Owner | Status |
|---------|------|------|----------|-------|--------|
| team-standup-bot | 8003 | Node.js web | Not PM2 (manual) | Marcelo | ✅ Active |
| quick-stats server | 8102 | Node.js web | Not PM2 (manual) | Marcelo | ✅ Active |
| Hermes dashboard | 9119 | Hermes CLI tool | Not PM2 | BossMan | ✅ Active on-demand |
```

---

## PART 4 — Draft Cron Migration Plan

### Current Cron Jobs (from `crontab -l`)

**Job 1 — Morning Research**
```
0 5 * * * /Users/bigdawg/Projects/money-making-dashboard/scripts/run_morning_research.sh
```
- Schedule: 5:00 AM daily
- Script: `run_morning_research.sh`
- Project: `money-making-dashboard`
- Owner: OpenClaw (legacy)

**Job 2 — Trading Poller**
```
*/5 * * * * /usr/local/bin/node /Users/bigdawg/Projects/trading-monitor/scripts/poller.js
```
- Schedule: Every 5 minutes
- Script: `poller.js`
- Project: `trading-monitor`
- Owner: OpenClaw (legacy)
- ⚠️ **BROKEN:** `trading-monitor` project directory does not exist on disk. This job runs every 5 minutes and fails silently.

---

### Proposed Migration: Hermes-Cronvana Migration Plan

Both jobs will be migrated to Hermes-owned script paths and managed via `hermes cron` (the Hermes cron scheduler) instead of system crontab.

#### Migrated Job 1: Morning Research

**New Hermes cron job:**
```bash
# Schedule: 5 AM daily
# Command: hermes cron create "0 5 * * *"

Prompt for new Hermes cron job:
"Run the morning research pipeline. Execute:
1. /Users/bigdawg/Projects/money-making-dashboard/scripts/research_batch.js
2. /Users/bigdawg/Projects/money-making-dashboard/scripts/research_post.js

Log output to ~/.hermes/logs/cron-morning-research.log
If either script fails, add a comment to the money-pipeline Kanban card and alert BossMan.
This cron is Hermes-owned. The underlying scripts are OpenClaw-owned but Hermes manages execution and oversight."
```

**Original crontab line to remove after migration:**
```
0 5 * * * /Users/bigdawg/Projects/money-making-dashboard/scripts/run_morning_research.sh
```

**Migration steps:**
1. Create Hermes cron job (above)
2. Verify it fires correctly at 5 AM
3. Remove original crontab line
4. Add completion comment to relevant Kanban card

---

#### Migrated Job 2: Trading Poller (Broken — Needs Attention First)

**Current state:** `trading-monitor` project does not exist. The `poller.js` script is missing. This job has been silently failing.

**Proposed resolution options:**

| Option | Action | Effort |
|--------|--------|--------|
| A — Restore | Find or recreate `trading-monitor` project + `poller.js`, put back on cron | High — requires locating original script |
| B — Retire | Remove broken cron job entirely | Low — `crontab -r` the line |
| C — Defer | Leave broken job in place, investigate in Phase 6 (money pipeline rebuild) | Medium |

### Recommended: Option C — Defer to Phase 6

Rationale: The trading monitor is related to the Binance bot ecosystem. Since the bot is now stopped pending Phase 2 hook restoration, it makes sense to address the poller as part of the broader trading system rebuild in Phase 6 (money pipeline rebuild). Removing it now without understanding its full purpose could cause issues when the bot is re-enabled.

**Marcelo Approved:** 2026-05-07 — Decision: defer to Phase 6. Do not fix this cron until the trading system is properly redesigned.

**Phase 6 card created:** `t_faa6d371` — "Phase 6 — Rebuild or retire trading-monitor + poller cron job"

**Draft Hermes cron job (for when trading monitor is rebuilt in Phase 6):**
```bash
# To be created in Phase 6
# Schedule: */5 * * * * (every 5 minutes — same as current)
# Hermes-owned, wrapping the restored poller.js
```

---

#### Migration Order

```
Phase 3:  Remove Job 1 from crontab (morning research) — after Hermes cron confirmed working
Phase 3:  Create Hermes cron job for morning research
Phase 6:  Address Job 2 (trading poller) as part of trading system rebuild
```

---

## PART 5 — Hermes/Systems Docs Migration

### What Exists in the OpenClaw Workspace (to migrate to Hermes)

The following docs live in the OpenClaw workspace under `Hermes/Systems/`:

| File | Purpose | Migrate? | Destination |
|------|---------|---------|-------------|
| `Hermes/Systems/Hermes/SERVICES_MAP.md` | Port and service inventory | ✅ Already migrated | `~/.hermes/knowledge/SERVICES_MAP.md` |
| `Hermes/Systems/Hermes/PROFILES.md` | Hermes profiles and configuration | ✅ Migrate | `~/.hermes/knowledge/PROFILES.md` |
| `Hermes/Systems/Hermes/ARCHITECTURE.md` | System architecture notes | ✅ Migrate | `~/.hermes/knowledge/ARCHITECTURE.md` |
| `Hermes/Systems/Hermes/OPENCLAW_SOUL.md` | LBC35 SOUL reference | ✅ Migrate (archived) | `~/.hermes/knowledge/OPENCLAW_SOUL_archive.md` |

### Files Already Migrated

| File | Status |
|------|--------|
| `SERVICES_MAP.md` | ✅ Done — all 4 copies updated |
| `OPERATING_BLUEPRINT.md` | ✅ Done |
| `PHASE1_AUDIT_REPORT.md` | ✅ Done |
| `BLOCKER_RESOLUTIONS.md` | ✅ Done |

### Remaining Migration Tasks (for Phase 3 execution)

1. Copy `PROFILES.md` to `~/.hermes/knowledge/PROFILES.md`
2. Copy `ARCHITECTURE.md` to `~/.hermes/knowledge/ARCHITECTURE.md`
3. Archive original `OPENCLAW_SOUL.md` to `~/.hermes/knowledge/OPENCLAW_SOUL_archive.md`
4. Add `docs/MIGRATED_SYSTEMS.md` tracking all migrated files with dates
5. Sync all to BossMan GitHub and Obsidian

---

## PART 6 — Phase 2 Summary for Marcelo Review

### What Was Found

| Item | Finding |
|------|---------|
| LBC35 current role | Defined in `openclaw.json` — workspace executor, but no SOUL.md; prior behavior was primary manager |
| LBC35 SOUL | No SOUL.md exists — demotion can be established by creating a new SOUL.md + updating openclaw.json |
| Trading poller cron | **Broken** — `trading-monitor` project doesn't exist; job has been silently failing |
| Morning research cron | Working but OpenClaw-owned; needs Hermes migration |
| Port 8102 | `quick-stats` server — active, not PM2-managed |
| Port 8003 | `team-standup-bot` — active, not PM2-managed |
| Port 9119 | Hermes `hermes dashboard` CLI tool — active on-demand |

---

## 🚦 BLOCKERS BEFORE PHASE 3

| # | Blocker | Severity | Resolution needed |
|---|---------|---------|-----------------|
| 1 | **Trading poller cron is broken** — `trading-monitor` project missing | Medium | Decide: restore (Phase 6), remove now, or leave broken temporarily |
| 2 | **OpenClaw.json field support** — proposed `role: "delegated_executor"` and `reportsTo: "bossman"` fields in LBC35 agent config | Low | Verify OpenClaw supports these fields before applying; if not, SOUL.md alone is sufficient |
| 3 | **Morning research cron** — currently OpenClaw-owned | Low | Migrate to Hermes cron in Phase 3 — no approval needed, just confirmation |

**No critical blockers.** Phase 3 can proceed with Marcelo's approval on:
1. New LBC35 SOUL.md content (review draft above)
2. Decision on trading poller (restore / remove / defer)
3. Confirmation to begin applying SOUL changes and cron migrations
