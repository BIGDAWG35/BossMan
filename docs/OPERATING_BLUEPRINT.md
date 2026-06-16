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

## Routing Ledger (Mandatory — Every AI Kanban Card)

**Every Kanban card involving AI work MUST include a Routing Ledger in the card body.**

```yaml
## Routing Ledger
work_type:           # new_build | existing_build | troubleshooting | audit | refactor
primary_artifact:     # main repo/app/dashboard/prompt/service/doc being changed
lead_model:          # primary model for this card (MiniMax|DeepSeek|Claude|OpenAI|Perplexity|Local)
supporting_models:   # models/tools allowed to assist (comma-separated)
review_models:       # models allowed to review/critique but NOT overwrite
final_integrator:    # BossMan|builder|ops|trading|content — who merges canonical artifact
cost_tier:           # 1|2|3|4|5
last_model_used:     # [model] — last model that actually touched this artifact
next_model_planned:  # [model] — next model expected to act (or "none")
```

**Rules:**
- One owner per artifact per phase — only `lead_model` can modify the artifact
- Reviewers may NOT overwrite — only comment/propose via card comments
- No ad-hoc model use — every model touching this artifact must be named in the Ledger
- All model activity logged — BossMan adds a card comment after each model activation:
  ```
  [MODEL USED]: [model] | [REASON]: [why chosen] | [ARTIFACT]: [file] | [OUTCOME]: [result] | [NEXT]: [handoff note]
  ```

**Three Blueprint Types:**

| Type | Use For | Key Fields |
|------|---------|-----------|
| **Kickoff** | New projects/major builds | goal, deliverables, model_ownership_matrix, approval_gates, final_integrator |
| **Continuation** | Existing builds + features | what_exists, what_is_changing, previous_owners, new_owners, handoff_rules |
| **Triage** | Troubleshooting/debugging | bug_description, affected_artifacts, primary_troubleshooter, supporting_models, final_integrator |

**Cost-aware escalation:**
```
Tier 1 (free) → Tier 2 (free local) → Tier 3 (MiniMax) → Tier 4 (DeepSeek/OpenAI/Claude) → Tier 5 (Perplexity Computer)
```
Always try lower tiers first. Tier 4/5 outputs MUST be saved to `~/.hermes/knowledge/` for reuse.

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

### Incident Ownership and Troubleshooting Mode

- Any Kanban card with `status: incident`, or `status: blocked` with a body containing incident|outage|broken|down|not working|error, or label `troubleshooting`, is **owned** by Hermes Troubleshooting Mode and must run via the v3.0 routing map and Troubleshooting Mode skill.
- All such incidents must use the 7-section response template: Incident Summary, Type, Facts, Root Cause, Fix Plan, QA / Risk Review, Runbook Notes, Escalation, with ALERT blocks following `error-escalation.md` for Level 2–3 events.
- For issues touching money-pipeline, Binance bot, Telegram gateway, or Tailscale, apply thresholds and page Marcelo immediately when alert conditions from `health-monitoring.md` and `error-escalation.md` are met.

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

## Binance Bot — 24/7 ONLINE Policy (Permanent — 2026-06-16, Phase 6 Track B)

**Crypto is 24/7, so `binance-bot` is expected ONLINE 24/7 with `autostart: true`.** This is the new normal under Phase 6 Track B. The earlier "stopped = healthy, online = alert" stance is retired.

### Expected state

- `binance-bot` status: `online`
- `autostart`: `true`
- `restart_time`: 0 (or low and stable)
- `/api/status`: 200, `mode=LIVE`, `paperMode=false`

### Allowed OFF states (both required to suppress alerts)

- **Maintenance window** — kanban card exists with `label:maintenance` and title contains `binance`
- **Open incident card** — kanban card exists with `label:incident` and title contains `binance`

If neither is on the board, STOPPED is a **L2/L3 alert**.

### Alert conditions (Binance bot only)

- `binance-bot` STOPPED with no maintenance/incident card → **L2/L3 ALERT**
- `restart_time >= 5` in 24h → **L2**
- `/api/status` non-200, empty, or shows `totalExposure > maxExposure * 1.10`, or open position that contradicts the most recent signal → **L2/L3**
- `pm2 logs` shows exceptions, crash loops, or > 3 safe-start failures in 60 min → **L2**
- `cooldownActive=true` for > 4h in a single UTC day → **L3**
- `dailyLimitHit=true` more than 2 days in a row → **L3**

### Do NOT alert just because `binance-bot` is online

ONLINE is the expected state. BossMan stays silent on a healthy bot. PM2 Health Monitor cron (`01dff7ff61e4`) checks the kanban for `maintenance` / `incident` cards before paging Marcelo on a STOPPED state.

### Code/docs of record

- `~/Projects/binance-bot/RUNBOOK.md` — §"Operational Policy — 24/7 ONLINE" + §"Maintenance Windows"
- `~/.hermes/knowledge/error-escalation.md` — §"Binance Bot — Expected State (24/7 ONLINE, Phase 6 Track B)"
- `~/.hermes/knowledge/health-monitoring.md` — expected-state flip in front matter
- `~/.hermes/skills/devops/pm2-health-check/SKILL.md` — §"BINANCE-BOT 24/7 RULE"
- PM2 Health Monitor cron prompt (`01dff7ff61e4`) — 24/7 block appended
- Kanban card `t_1c502da6` — Phase 6 Track B go-live card, body updated

---

## Version History

|| Version | Date | Change ||
|---------|------|--------|
|| 1.0 | 2026-05-07 | Initial — Hermes-first, BossMan orchestrator, OpenClaw demoted ||
|| 1.1 | 2026-05-08 | Phase 4 — handoff packet format, routing checklist, LBC35 constraints, production workflow diagram, 3 test handoffs verified ||
|| 1.2 | 2026-05-20 | Track 1 additions — self-improvement rules, self-audit rules, verified sub-agent roster, memory capture policy ||
|| 1.3 | 2026-06-16 | Phase 6 Track B — Binance bot 24/7 ONLINE policy codified; routing lock + Troubleshooting Mode fully wired |

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
- Run `hermes doctor` and confirm there are no `health.warnings.forbidden_global_default` or routing drift warnings before approving any routing or incident configuration changes.

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

### 4-Tier Memory Storage (Phase 2 — Active)

| Tier | Storage | Use For | Limit |
|------|---------|---------|-------|
| **1** | `memory` tool | Marcelo's preferences, corrections, environment facts | ~2200 chars |
| **2** | `~/.hermes/knowledge/` | Durable docs, project context, system insights | Unlimited |
| **3** | `~/Desktop/CLAW-Backup/` | Obsidian reference blueprints | Unlimited |
| **4** | `BIGDAWG35/BossMan/` | GitHub durable blueprints | Unlimited |

**Policy file:** `~/.hermes/knowledge/memory/MEMORY_POLICY.md`
**Master index:** `~/.hermes/knowledge/memory/MEMORY_CAPTURE_LOG.md`
**Trading intelligence:** `~/.hermes/knowledge/memory/memory-trading-intelligence.md` (ISOLATED — no execution logic)
**Daily log:** `~/.hermes/knowledge/memory/YYYY-MM-DD.md`

### Save Triggers (9 — Phase 2 Active)
1. User corrections → immediate (memory tool + log)
2. User preferences → immediate (memory tool)
3. Workflow wins → before next similar task (skill file)
4. Tool quirks → within session (LEARNED_*.md)
5. Repeated failures → before continuing (LEARNED_*.md)
6. Major decisions → same day (memory/YYYY-MM-DD.md)
7. Delegation outcomes → end of session (log)
8. Performance findings → before next session (LEARNED_*.md)
9. Trading intelligence → after verification, isolated (memory-trading-intelligence.md)

### Exclusion Rules (5 — Phase 2 Active)
1. Ephemeral task progress — NOT saved
2. Speculation/unverified guesses — NOT saved (mark `[NEEDS VERIFICATION]`)
3. Anything stale within 7 days — NOT saved
4. Raw data dumps — NOT saved
5. Info existing in source files — NOT saved

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

## Self-Audit & Performance (Phase 3 — Active)

**Policy file:** `~/.hermes/knowledge/memory/SELF_AUDIT_CHECKLIST.md`
**Findings log:** `~/.hermes/knowledge/memory/PERFORMANCE_FINDINGS.md`
**Health monitor:** `~/.hermes/scripts/pm2-health-monitor.sh` (cron job `d4f07e0c180f`, every 5 min)

### 5-Tier Audit Cadence

| Tier | Cadence | Duration | Owner |
|------|---------|----------|-------|
| T1 Health Pulse | 5 min | <30 sec | Hermes cron (no_agent) |
| T2 Daily Scan | Daily | 2-5 min | BossMan |
| T3 Weekly Review | Monday 8 AM | 15-20 min | BossMan via cron |
| T4 Monthly Deep Audit | 1st of month | 45-60 min | BossMan + sub-agents |
| T5 Event-Driven | On error | Varies | BossMan |

### T1 — Health Pulse (Automated, Every 5 Min)

**Script:** `~/.hermes/scripts/pm2-health-monitor.sh`
**Services:** binance-bot, squarepayouts, money-pipeline, bakery, cloudflare-tunnel
**Rules:** Silent when healthy | Auto-restart on down | ✅ FIXED on recovery | 🚨 NEEDS ATTENTION on fail | 🚨 CRASH LOOP at ≥5 restarts | Dedup via lockfile

### T2 — Daily Scan

```bash
pm2 jlist | python3 -c "import json,sys; [print(f\"{p['name']}: {p['pm2_env']['restart_time']} restarts\") for p in json.load(sys.stdin) if p['pm2_env']['restart_time']>0]"
grep -h "Error\|WARN" ~/.pm2/logs/*-error*.log | tail -50
pm2 save && echo "PM2 synced"
```

### T3 — Weekly Review (Monday 8 AM)

Template: `~/.hermes/knowledge/WEEKLY_REVIEW_TEMPLATE.md` — PM2 health, logs, Kanban backlog, memory quality, project status, strategic.

### T4 — Monthly Deep Audit (1st of Month)

Service map, PM2 sync, architecture, security, memory audit, cron/LaunchAgent audit, backup verification.

### [PERFORMANCE] Memory Entry Format

```
[YYYY-MM-DD] [PERFORMANCE] [PROJECT:Name]
Finding: <what>
Severity: LOW/MEDIUM/HIGH
Commands: <what was run>
Fix: <what was done>
Prevention: <what to do differently>
```

### Key Findings (2026-05-22)
- **BinanceBot:** SQLITE_ERROR + ReferenceError — Phase 10 fixes
- **MoneyPipeline:** research broken since ~2026-04-07 — Phase 8 fixes
- **Bakery:** EADDRINUSE port 3001 resolved
- **Hermes:** Health monitor extended to 5 services

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

---

## File Delivery Workflow (Permanent — Default for All File Deliverables)

**Applies to:** Every file-based deliverable — documents, PDFs, PowerPoints, spreadsheets, images, videos, audio, archives, reports, screenshots, and any other binary or document output.

**A file is ONLY complete when ALL THREE are done:**
1. ✅ Saved locally (source of truth)
2. ✅ Sent successfully to Telegram as an attachment
3. ✅ Logged on Kanban card with version + delivery status

**Local path alone is NOT delivery. Telegram attachment alone is NOT delivery. Both + Kanban log = complete.**

**The Kanban card CANNOT be marked Done unless Marcelo explicitly approves an exception.**

### Kanban Card Fields (required for every file deliverable)

- `request_summary`: what was asked for
- `deliverable_type`: PDF / PPTX / XLSX / image / video / audio / doc / zip / other
- `status`: Requested → In Progress → File Generated → Sent to Telegram → Waiting for Feedback → Revised → Approved / Blocked
- `local_save_path`: absolute path on Mac mini
- `telegram_delivery_status`: Pending | Sent | Failed
- `revision_count`: v1, v2, v3…
- `blockers_or_errors`: exact error if Telegram delivery failed

### Caption Format (required on every Telegram file delivery)

```
[filename]
[what it is]
Version: v1 | draft | final
Sent: YYYY-MM-DD HH:MM
```

### File Type Telegram Rules

| File type | Telegram method |
|---|---|
| PDF, DOCX, PPTX, XLSX, ZIP, TXT | Document attachment |
| Image (JPG, PNG, WebP) | Photo or document |
| Video (MP4, MOV) | Video attachment |
| Audio (MP3, OGG, M4A) | Audio or document |
| Screenshot | Photo (preferred for preview) |

### Telegram Delivery Failure → Blocked Protocol

If Telegram delivery fails:
1. Set Kanban card status → **Blocked**
2. Record exact error in `blockers_or_errors`
3. Report to Marcelo: Status, File, Local Path, Error reason
4. Do NOT mark the card Done
5. Retry once after diagnosing
6. If persistent failure, escalate to Marcelo

### Revision Protocol

If Marcelo requests changes:
1. Increment revision (v1 → v2 → v3)
2. Set status → In Progress
3. Regenerate → save locally
4. Send revised file to Telegram as **new attachment**
5. Update Kanban card with new version
6. Caption: `Version: v2 (revised per feedback)`

### Execution Handoff

When work is delegated via Kanban:
- BossMan creates/updates the card before delegation
- Executor works within assigned scope, reports completion or blockers on the same card
- BossMan verifies Telegram delivery before closing
- LBC35 / OpenClaw executes within this workflow only — does not change workflow or mark cards Done on its own

### Response Format (completion)

```
- Status: Sent to Telegram
- File: [filename]
- Local Path: [full path]
- Telegram: Delivered successfully
- Kanban: [card name or ID]
- Version: [v1, v2, etc.]
```

### Response Format (failure)

```
- Status: Blocked
- File: [filename]
- Local Path: [full path]
- Telegram: Failed
- Error: [exact reason]
- Kanban: [card name or ID]
```

### Clarify Before Execution

Ask Marcelo to clarify if the request is ambiguous:
- File format not specified (PDF vs DOCX?)
- Purpose unclear (internal vs external client?)
- Naming convention not defined

### Skill Reference

Codified as permanent skill: `~/.hermes/skills/file-delivery-workflow/SKILL.md`

This workflow is the default for ALL file deliverables unless Marcelo explicitly says "don't send via Telegram."

---

## Perplexity-Assisted Planning Workflow

**Applies to:** All projects and features that need research, specs, or architecture review before implementation.

### Planning Layer

**Perplexity Space "Agent OS — Marcelo's Hermes Orchestrator"** is the designated planning/spec layer for:
- Hermes architecture discussions
- Feature implementation planning
- Research-backed spec development
- Trade-off analysis before Marcelo commits

### Decision Authority

**Marcelo remains the decision authority.** He reviews Perplexity-generated specs and approves:
- Major features and architecture changes
- Execution plans and resource commitments
- Go/no-go on delegated implementation

Marcelo approves with a simple response: `A` (approve), `B` (change something), or `C` (not now).

### BossMan Handoff After Approval

After Marcelo approves via Telegram/Perplexity:
1. BossMan reads the Perplexity-generated spec
2. BossMan creates a Kanban card with the spec as the card body
3. BossMan assigns the card to the appropriate profile (builder, ops, etc.)
4. BossMan executes or delegates implementation
5. BossMan reports completion back to Marcelo

**BossMan only escalates back to Marcelo for:**
- Blocker decisions that cannot be resolved autonomously
- Architecture trade-offs with significant downstream impact
- Final sign-off on completed work

### Handoff Example

```
Marcelo (via Perplexity or Telegram):
  "We should add TTS voice replies to BossMan Telegram"
  
Perplexity Space → generates spec:
  - Triggers: /voice, "read this aloud"
  - Provider: MiniMax TTS abstracted behind interface
  - Text always sent; TTS failure = text only
  - Implementation: extend send_message tool

Marcelo reviews → approves via Telegram: "A"

BossMan → Kanban:
  hermes kanban create "Implement Telegram TTS replies" \
    --body "$(cat <<'EOF'
    ## Goal
    Add optional TTS voice replies to BossMan Telegram chat.
    
    ## Triggers
    - /voice
    - "read this aloud"
    - "say it"
    
    ## Behavior
    - Default: text only
    - Triggered: text + MiniMax TTS voice note
    - TTS failure: text only, error logged
    
    ## Implementation
    - Extend send_message tool with generate_tts flag
    - Abstract TTS provider behind interface
    - Update TELEGRAM_COMMANDS.md
    
    ## Constraints
    - Text always present; never voice-only by default
    - MiniMax as initial TTS provider
    - Provider swappable via config
    EOF
    )" \
    --assignee builder --priority 1 --board bossman

BossMan replies to Marcelo:
  ✅ Card created: t_xxxxxxxx
  Assignee: builder
  Priority: 1
  [Spec summary]
  Starting work.
```

### File References

| Document | Path |
|---------|------|
| Perplexity-assisted workflow | `~/.hermes/knowledge/PERPLEXITY_BOSSMAN_HANDOFF.md` |
| Telegram commands | `~/.hermes/knowledge/TELEGRAM_COMMANDS.md` |
| This blueprint | `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` |

### Relationship to LBC35

LBC35 remains a **delegated executor only**. Perplexity specs do NOT go directly to LBC35 — they go to BossMan, who creates the Kanban card and assigns work. LBC35 receives work exclusively via BossMan handoff packet. See `LBC35_SOUL_v2_delegated_executor.md` for constraints.

> **This workflow does not weaken approval guardrails. Marcelo approves everything material. BossMan handles execution routing.**

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

### Perplexity as Approved Research Partner

**Perplexity is an approved primary tool for research, specs, and regime analysis.**

- Perplexity may be used for: crypto intelligence, market-regime research, integration design, weekly report templates.
- When Perplexity and local logs disagree: default to local logs, treat Perplexity suggestions as hypotheses.
- All Perplexity-driven changes must still obey:
  - Separation: MoneyPipeline and BinanceBot never merge.
  - Safety: pre-trade hook, loss limits, intel gate may NOT be weakened by Perplexity guidance.
  - Autonomy: Perplexity guidance does NOT replace Marcelo's approval for production/billing/security decisions.

> Perplexity collaboration loop (full details): `~/.hermes/SOUL.md` — "Perplexity Orchestration Loop"
> Agent instructions (full details): `~/.hermes/AGENTS.md` — "Perplexity Orchestration Loop — Agent Instructions"

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

