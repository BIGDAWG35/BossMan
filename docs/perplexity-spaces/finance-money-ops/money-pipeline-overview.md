# Money Pipeline V2 — System Architecture
**Version:** 1.0
**Date:** 2026-06-18
**Owner:** BossMan (bossman profile)
**Task:** t_7b20a341 — MP6-01
**Status:** Canonical — governs Phase 6 execution

---

## 1. Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                         MONEY PIPELINE V2 — SYSTEM MAP                        ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Marcelo (human, decision authority)                                         ║
║      │                                                                       ║
║      │ Telegram / CLI / Browser                                              ║
║      ▼                                                                       ║
║  ┌─────────────────────────────────────────────────────────────────────┐    ║
║  │                    HERMES (bossman profile)                           │    ║
║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │    ║
║  │  │ Kanban   │  │ Cron     │  │ Memory   │  │ Model Router         │ │    ║
║  │  │ Board    │  │ Scheduler│  │ /Skills  │  │ (Perplexity/M3/DeepSeek│ │    ║
║  │  │ t_*     │  │ jobs.json │  │          │  │ /OpenAI/Claude)       │ │    ║
║  │  └────┬─────┘  └────┬─────┘  └──────────┘  └──────────────────────┘ │    ║
║  │       │             │                                                │    ║
║  │  routes to sub-agents / fires cron / reads board                      │    ║
║  └───────┼─────────────┼────────────────────────────────────────────────┘    ║
║          │             │                                                      ║
║          ▼             ▼                                                      ║
║  ┌─────────────┐  ┌────────────────┐  ┌─────────────────┐  ┌──────────────┐  ║
║  │  Dashboard  │  │  Obsidian      │  │  GitHub         │  │  Basecamp   │  ║
║  │  (port 8020)│  │  CLAW-Backup/  │  │  Repos/         │  │  (CsDawg)   │  ║
║  │             │  │  money-pipeline│  │  BossMan/       │  │             │  ║
║  │ public/     │  │  designs/      │  │  money-making-  │  │ Projects/   │  ║
║  │ server.js   │  │  learn/        │  │  dashboard/     │  │ Money Pipe- │  ║
║  │ (1828 lines)│  │  projects/     │  │                 │  │ line V2/    │  ║
║  └──────┬──────┘  └────────────────┘  └─────────────────┘  └──────┬─────┘  ║
║         │                                                           │        ║
║         │  reads/writes              reads              reads      │        ║
║         ▼                            ▲                   ▲          ▼        ║
║  ┌────────────────┐                  │                   │   ┌───────────┐ ║
║  │  money.db      │◄─────────────────┼───────────────────┘   │ LBC35      │ ║
║  │  (SQLite)      │                  │                       │ (delegated │ ║
║  │  data/         │                  │                       │  executor  │ ║
║  │  money.db      │                  │                       │ via Kanban │ ║
║  └───────┬────────┘                  │                       │ handoff)   │ ║
║          │                           │                       └───────────┘ ║
║          │ write                    │                                   ║
║          ▼                           │                                    ║
║  ┌────────────────┐                   │                                    ║
║  │ RESEARCH LAYER │◄──────────────────┘                                    ║
║  │  (ideasdawg /  │                                                     ║
║  │   Hermes cron) │                                                     ║
║  │  run_morning_  │                                                     ║
║  │  research.sh   │                                                     ║
║  └────────────────┘                                                      ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

### Research + Enrichment Sub-Flow (automated daily)

```
5 AM PDT ──► Hermes cron: money-morning-research
                   │
                   ▼
             run_morning_research.sh
                   │
                   ▼
             research_batch.js  ──►  /api/research  ──►  money.db (raw opps)
                   │
                   ▼
             research_post.js
                   │
6 AM PDT ──► Hermes cron: money-pipeline-auto-enrich
                   │
                   ▼
             auto-enrich-v2.js
                   │
                   ▼
             POST /api/enrich-v2  ──► enrichOpportunityV2()
                   │                    (Claude Sonnet 4.6 in server.js)
                   ▼
             money.db (V2 fields populated)
                   │
                   ▼
             GET /api/health/pipeline  ──► ⚠️ Systems widget / weekly review
```

---

## 2. Role Routing Table

### 2.1 System Profiles (who owns what)

| Profile | Role | Authority |
|---------|------|-----------|
| `bossman` | Orchestrator, router, planner, sole kanban owner | PRIMARY — routes all work |
| `builder` | Code/features, dashboard, scripts, Git | Executes what bossman assigns |
| `ops` | PM2, ports, runtime, infra | Executes what bossman assigns |
| `trading` | Market research, signals (crypto) | Executes what bossman assigns |
| `content` | YouTube, scripts, docs | Executes what bossman assigns |
| `lbc35` | Legacy delegated executor only | RECEIVES via Kanban handoff ONLY |

### 2.2 Task → Profile Routing

| Task Type | Assign To | Example Card |
|-----------|-----------|-------------|
| Architecture, routing, planning, decomposition | `bossman` | MP6-01 (this card), Epic t_9f22b48f |
| Dashboard UI, server.js changes, scoring logic | `builder` | MP6-04, MP6-05, MP6-09 |
| PM2, cron, health endpoints, runtime | `ops` | (any infra work) |
| Kanban card creation, handoff packet creation | `bossman` | MP6-06 (Kanban promotion flow) |
| Scoring model design | `trading` or `bossman` | MP6-03 |
| Deep-dive workflow, pricing worksheet | `content` | MP6-07 (done), MP6-08 (done) |
| Outreach workflow design | `content` | MP6-10 |
| Basecamp automation templates | `builder` | MP6-12 |
| LBC35 verification | `bossman` | MP6-14 |
| Full workflow test | `bossman` | MP6-11 |

### 2.3 Data Layer Routing

| Operation | System | API/Method |
|-----------|--------|-----------|
| Browse & score opportunities | Dashboard (port 8020) | `GET /api/opportunities`, `GET /api/opportunity/:id` |
| Add/edit opportunity | Dashboard | `POST /api/opportunity`, `PUT /api/opportunity/:id` |
| V2 enrichment (scoring) | Dashboard | `POST /api/enrich-v2` → `enrichOpportunityV2()` (Claude Sonnet 4.6) |
| Promote to Kanban | Dashboard → Kanban | `POST /api/kanban-promote` → BossMan creates card |
| Health check | Dashboard | `GET /api/health/pipeline` |
| List Kanban cards | Kanban DB | `sqlite3 kanban.db "SELECT ..."` |
| Create Kanban card | Kanban tool | `kanban_create()` |
| Long-term memory | Obsidian | CLAW-Backup/money-pipeline/ |
| Script/code backup | GitHub | Repos/money-making-dashboard/ |

---

## 3. Data Flow Document

### 3.1 Five System Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: RESEARCH INPUT                                            │
│  ────────────────────────────────────────────────────────────────── │
│  Source: ideasdawg agent / manual entry / Hermes cron               │
│  Script: research_batch.js + research_post.js                      │
│  Target: money.db opportunities table (stage=discovery)            │
│  Cron: money-morning-research (5 AM PDT, Hermes)                    │
│  Key fields: title, description, source=manual|research, lead_     │
│              source, niche, monthly_potential, competition_level     │
└────────────────────────────────────┬────────────────────────────────┘
                                     │ INSERT
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2: ENRICHMENT (V2 Scoring)                                   │
│  ────────────────────────────────────────────────────────────────── │
│  Trigger: money-pipeline-auto-enrich cron (6 AM PDT, Hermes)        │
│  Script: auto-enrich-v2.js → POST /api/enrich-v2                   │
│  Model: enrichOpportunityV2() — Claude Sonnet 4.6 (server.js)      │
│  Key V2 fields written:                                             │
│    confidence, ease_score, revenue_potential, passive_potential     │
│    composite_score, fit_score, target_companies (JSON)             │
│    pain_signal_category, pain_signal_detail                        │
│    outreach_status, response_received, interest_level               │
│    meeting_booked, pilot_status, reality_bucket                     │
│  Output: money.db (opportunities) — V2-enriched records           │
└────────────────────────────────────┬────────────────────────────────┘
                                     │ READ / WRITE
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 3: STORAGE (SQLite)                                          │
│  ────────────────────────────────────────────────────────────────── │
│  DB: ~/Projects/money-making-dashboard/data/money.db                │
│  Tables:                                                            │
│    opportunities (100+ columns, V2 schema)                         │
│  Key V2 columns:                                                    │
│    id, title, description, source, lead_source, stage,            │
│    display_status, kanban_card_id, composite_score,                │
│    confidence, ease_score, revenue_potential, passive_potential,   │
│    reality_bucket (Real|Maybe|Fantasy),                            │
│    target_companies (JSON array),                                   │
│    outreach_status, response_received, interest_level,            │
│    meeting_booked, pilot_status,                                    │
│    created_at, updated_at, stage_moved_at                           │
└────────────────────────────────────┬────────────────────────────────┘
                                     │ READ (dashboard serves to browser)
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 4: DASHBOARD (port 8020)                                      │
│  ────────────────────────────────────────────────────────────────── │
│  PM2: money-pipeline (port 8020)                                    │
│  Files: server.js (1828 lines) + public/index.html                  │
│  Views: Discovery | Scoring | Aging | Sales-Ready | Reality |       │
│         Wins | Passive | Big Bets | DNT | Targets                    │
│  Key endpoints:                                                     │
│    GET  /api/opportunities          — list with filters             │
│    GET  /api/opportunity/:id       — detail                         │
│    POST /api/opportunity           — create                         │
│    PUT  /api/opportunity/:id       — update                         │
│    POST /api/enrich-v2             — run V2 scoring                 │
│    POST /api/kanban-promote        — promote → Kanban card         │
│    GET  /api/health/pipeline       — research + enrichment health  │
│    GET  /api/stats                 — dashboard stats                │
└────────────────────────────────────┬────────────────────────────────┘
                                     │ Kanban card created on promote
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 5: KANBAN EXECUTION (Hermes Board)                           │
│  ────────────────────────────────────────────────────────────────── │
│  Board: bossman (~/hermes/kanban/boards/bossman/kanban.db)         │
│  Promotion trigger: POST /api/kanban-promote from dashboard        │
│  BossMan reads promotion request → creates Kanban card             │
│  Card flow: inbox → planned → running → client_testing → done     │
│  Linked to: Phase 6 Epic (t_9f22b48f) as parent                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Stage Lifecycle (opportunity stage field)

```
discovery ──► scoring ──► aging ──► promotion_requested
    │           │          │              │
    │           │          │         kanban_card_id
    │           │          │         written to money.db
    │           │          │              │
    │           │          │              ▼
    │           │          │         Kanban card created
    │           │          │         (bossman profile)
    │           │          │              │
    │           │          │              ▼
    │           │          │         LBC35 executes via
    │           │          │         handoff packet
    │           │          │              │
    │           │          │              ▼
    │           │          │         build → testing → pricing
    │           │          │              │         → ready-to-sell
    │           │          │              │
    └───────────┴──────────┴──────────────┘
              (all tracked in money.db stage field)
```

### 3.3 Reality Bucket Classification

```
Real bucket (do first):
  confidence >= 55  AND
  ease_score >= 11  AND
  (estimated_build_effort = 'weeks' OR revenue_potential >= 13)

Maybe bucket (evaluate later):
  everything else that passes V2 enrichment but doesn't meet Real

Fantasy bucket (deprioritize):
  records with no V2 enrichment, or confidence/ease below threshold
```

---

## 4. Handoff Packet Format for LBC35

> LBC35 is a **delegated executor only**. It receives work exclusively through Kanban handoff packets created by BossMan. No autonomous actions. No direct money.db access. No PM2/cron changes.

### 4.1 Kanban Card Handoff (standard BossMan → LBC35)

When BossMan creates a card for LBC35 to execute, the card body follows this format:

```
project: money-pipeline
## Handoff Packet

**Packet ID:** <uuid>          <!-- auto-generated -->
**Created by:** bossman        <!-- BossMan profile only -->
**Created at:** <ISO timestamp>
**Priority:** P1/P2/P3
**LBC35 role:** DELEGATED EXECUTOR

---

## Context

<!-- Why this task exists — links to parent card, parent Epic -->

## Deliverables

<!-- Numbered, specific, testable outcomes -->

## Constraints (what NOT to do)

- Do NOT modify PM2, cron, or LaunchAgents
- Do NOT access money.db directly
- Do NOT create Kanban cards
- Do NOT send Telegram messages autonomously
- Do NOT modify server.js or public/ files without BossMan approval

## Success Criteria

<!-- How BossMan will verify completion -->

## References

- Dashboard: http://localhost:8020
- Kanban board: bossman
- Relevant docs: <paths>

## Escalation

If blocked: comment on this Kanban card with the blocker detail.
Do NOT stop work and leave the card in running without comment.
```

### 4.2 LBC35 Action Checklist (what LBC35 may do when assigned)

| Action | Allowed? | Notes |
|--------|---------|-------|
| Execute a script in money-making-dashboard | YES | Only via explicit Kanban assignment |
| Update money.db via dashboard UI | YES | Via dashboard forms, not direct SQL |
| Add target companies to opportunities | YES | Via dashboard /api/targets endpoint |
| Update outreach status fields | YES | Via dashboard PATCH endpoints |
| Modify scripts/ research logic | YES | With BossMan approval in card |
| Access money.db directly (SQLite) | NO | Direct SQL = HUMAN_ONLY |
| Create new Kanban cards | NO | Must ask BossMan |
| Send Telegram messages | NO | All comms via Kanban card comments |
| Modify PM2/cron/LauchAgents | NO | HUMAN_ONLY |

### 4.3 Handoff for Deep-Dive / Pricing Worksheet (MP6-07 / MP6-08 deliverables)

When BossMan hands off a deep-dive or pricing worksheet task to LBC35:

```
## Deep-Dive Handoff Fields

**Opportunity ID (from money.db):** <id>
**Opportunity Title:** <title>
**Reality Bucket:** <Real|Maybe|Fantasy>
**Composite Score:** <score>
**Confidence / Ease / Revenue:** <values>

## Deep-Dive Requirements

1. **Market Research Brief** — validate opportunity with real market data
2. **Pricing Worksheet** — calculate build cost, time, monthly revenue estimate
3. **Competitor Analysis** — who else does this? how differentiated?
4. **Recommended Action** — specific next step (build / shelve / investigate)

## Money Pipeline V2 Scoring Context

- Confidence (0-100): market signal strength
- Ease Score (0-20): how buildable now
- Revenue Potential (1-20): realistic monthly revenue
- Passive Potential (1-20): automation level
- Reality Bucket: Real (do first) / Maybe (later) / Fantasy (deprioritize)

## Output Format

Post findings as a comment on this Kanban card with:
- Market validation evidence
- Pricing worksheet (attached or linked)
- Decision recommendation (build / shelve / investigate)
- Specific targets identified (for outreach-ready opportunities)
```

---

## 5. System Topology Reference

### 5.1 Active Services

| Port | Service | PM2 Name | Dashboard | Status |
|------|---------|----------|-----------|--------|
| 8020 | Money Pipeline V2 | money-pipeline | http://localhost:8020 | STABLE |
| 8104 | Binance Bot | binance-bot | http://localhost:8104 | STABLE |

### 5.2 Key Files

| Purpose | Path |
|---------|------|
| Dashboard server | `~/Projects/money-making-dashboard/server.js` |
| Dashboard UI | `~/Projects/money-making-dashboard/public/index.html` |
| SQLite DB | `~/Projects/money-making-dashboard/data/money.db` |
| Research scripts | `~/Projects/money-making-dashboard/scripts/research_batch.js` |
| | `~/Projects/money-making-dashboard/scripts/research_post.js` |
| | `~/Projects/money-making-dashboard/scripts/run_morning_research.sh` |
| Enrichment script | `~/Projects/money-making-dashboard/scripts/auto-enrich-v2.js` |
| Scoring logic | `~/Projects/money-making-dashboard/scripts/score_enricher.js` |
| Kanban board DB | `~/.hermes/kanban/boards/bossman/kanban.db` |
| Obsidian vault | `~/Desktop/CLAW-Backup/money-pipeline/` |
| GitHub (dashboard) | `~/Repos/money-making-dashboard/` |
| GitHub (BossMan) | `~/Repos/BossMan/` |

### 5.3 Hermes Cron Jobs (Money Pipeline)

| Job ID | Name | Schedule | Fires | Status |
|--------|------|----------|-------|--------|
| c77d492c5b6d | money-morning-research | 0 5 * * * | run_morning_research.sh | ACTIVE |
| 8fb30e332d6d | money-pipeline-auto-enrich | 0 6 * * * | auto-enrich-v2.js | ACTIVE |

### 5.4 Kanban Cards — Phase 6 Epic (t_9f22b48f)

| ID | Title | Status | Assignee |
|----|-------|--------|---------|
| t_7b20a341 | MP6-01 Architecture | running | bossman |
| t_394bcecb | MP6-02 Audit Assets | running | trading |
| t_7086e063 | MP6-03 Scoring Model | running | trading |
| t_7e595355 | MP6-04 Dashboard IA | running | builder |
| t_9d1ed7f8 | MP6-05 Intake/Scoring/Aging | running | builder |
| t_796a3cf1 | MP6-06 Kanban Promotion | running | builder |
| t_e9b073ac | MP6-07 Deep-Dive Workflow | done | bossman |
| t_0b5d26e4 | MP6-08 Build/Testing/Pricing Lifecycle | done | bossman |
| t_a179b89b | MP6-09 Sales-Ready View | running | builder |
| t_58dcf252 | MP6-10 Outreach Workflow | running | content |
| t_d521bfe0 | MP6-11 Test Full Workflow | running | bossman |
| t_661bc282 | MP6-12 Basecamp Templates | running | content |
| t_f3009e4b | MP6-13 Intake Parser | running | trading |
| t_162f7a6c | MP6-14 LBC35 Handoff Audit | running | bossman |

---

## 6. Approval Gate Locations

| Gate | Where | Who Approves | Required For |
|------|-------|-------------|-------------|
| Phase 6 Epic start | Kanban card t_9f22b48f | Marcelo | Any Phase 6 sub-card execution |
| New Kanban card | Kanban board | BossMan (auto) | LBC35 to act |
| Promotion to Kanban | POST /api/kanban-promote | BossMan | Opportunity enters execution |
| LBC35 handoff | Kanban card with handoff packet | BossMan | LBC35 executes |
| Build/test/pricing lifecycle | Kanban card MP6-08 | Marcelo | Going to "ready to sell" |
| Live trading (Binance) | SEPARATE system | Marcelo explicitly | Phase 11 only |
| Infrastructure changes | PM2/cron changes | HUMAN_ONLY | PM2, cron, LaunchAgents |

---

## 7. Document Locations

| Copy | Path |
|------|------|
| Workspace (this task) | `~/.hermes/kanban/boards/bossman/workspaces/t_7b20a341/` |
| Hermes knowledge | `~/.hermes/knowledge/money-pipeline/MP6-01-ARCHITECTURE.md` |
| Obsidian | `~/Desktop/CLAW-Backup/money-pipeline/MP6-01-ARCHITECTURE.md` |
| GitHub (BossMan docs/) | `~/Repos/BossMan/docs/money-pipeline/MP6-01-ARCHITECTURE.md` |

---

## 8. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-18 | Initial — MP6-01 architecture defined: 5-layer topology, role routing, data flow, LBC35 handoff packet format, Phase 6 card status |

---

*Maintained by BossMan. Update when Phase 6 cards complete or system topology changes.*
