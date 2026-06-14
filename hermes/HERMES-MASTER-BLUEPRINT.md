# Hermes Master Implementation Plan
**Version:** 1.0
**Date:** 2026-05-20
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** Phase 1 Foundation Complete — Active Implementation
**Phase:** Phase 1.11 (Blueprint Save — this document)

---

## Master Objective

Transform Hermes into the **primary control plane** for Marcelo's operations — orchestrating all work, routing to the right sub-agents, maintaining memory and audit trails, and delivering reliable autonomous operation with zero surprises for Marcelo.

> **Core principle:** BossMan routes. Sub-agents execute. Marcelo decides.

---

## Verified Host/Service Context (2026-05-20)

### Active Services
| Port | Service | PM2 Name | Status |
|------|---------|----------|--------|
| 3001 | bakery | bakery | ✅ online |
| 8020 | money-pipeline | money-pipeline | ⚠️ degraded |
| 8030 | squarepayouts | squarepayouts | ✅ online |
| 8104 | binance-bot | binance-bot | ✅ online |

### Offline/Unmanaged Services
| Port | Service | Status |
|------|---------|--------|
| 8100 | overview | offline |
| 8110 | health-dashboard | offline |
| 8130 | trading-control | offline |
| 8140 | youtube-dashboard | offline |
| 8106 | kraken-bot | offline |

### Unknown Ports (Needs Investigation)
- **8102** — unknown
- **8003** — unknown
- **9119** — unknown

### Infrastructure Notes
- PM2: 4 managed services, 6 unmanaged (PM2 list is unsynced — `pm2 save` not run recently)
- Cron: 2 active jobs (OpenClaw-era, need migration review)
- LaunchAgents: 1 active (`ai.openclaw.gateway` — disabled autonomous Telegram routing)
- Unknown ports must be identified before Phase 7

---

## Verified Performance/Log Context (2026-05-20)

### PM2 Health Monitor
- **Job ID:** `d4f07e0c180f`
- **Schedule:** Every 5 minutes (no_agent cron)
- **Script:** `~/.hermes/scripts/pm2-health-monitor.sh`
- **Monitored:** binance-bot | squarepayouts | money-pipeline | bakery

### Alert Rules (Marcelo's Policy — 2026-05-16)
1. Silent when healthy — zero messages if all services online
2. Auto-fix silently — restart down service with NO alert during fix attempt
3. Alert ONLY on:
   - `SUCCESS`: service was down + auto-recovered → ONE message: "✅ FIXED: [service] was down, auto-restarted at [time]. Now stable."
   - `ESCALATION`: service is down + auto-restart FAILED → ONE message: "🚨 NEEDS ATTENTION: [service] is down and could not be auto-recovered. Manual fix required."
4. No duplicate alerts — lockfile per service (`/tmp/pm2-alert-[service].lock`)

### Known Issues
- money-pipeline: stream errors, research broken since 2026-04-07
- binance-bot: pre-trade-hook missing at `~/Projects/trading-review/pre-trade-hook`
- PM2 unsynced: `pm2 save` not run — changes not persisted across reboot

---

## Self-Improvement Rules (Permanent — Phase 1.3)

1. **After every Kanban card:** review what worked, what didn't, what to refine
2. **On error twice:** save root cause + fix to `LEARNED_*.md` before continuing
3. **On workflow win:** save as skill so it persists across sessions
4. **On model failure:** log which model failed and why, update tool strategy
5. **Never stop on iteration limit:** checkpoint → resume → continue until done
6. **Never repeat the same investigation:** save findings, don't re-research

---

## Self-Audit/Performance Rules (Permanent — Phase 1.4)

BossMan performs a self-audit after every Kanban card completion:

| Question | Action if Uncomfortable Answer |
|----------|-------------------------------|
| Was the deliverable actually achieved? | Create follow-up card, don't close loose ends |
| Was Marcelo's time used well? | If no, write memory entry + improve routing |
| Did BossMan know enough at the start? | If no, add pre-flight check to skill/workflow |
| Should this create a follow-up? | Create card immediately — don't drift |
| Is the documentation still accurate? | If stale, update before marking done |

---

## Memory Rules (Permanent — Phase 1.5)

### Structured Tags
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

---

## Kanban Roadmap — 11 Tracks

### Phase 1 Foundation ✅ (In Final Phase)
**Owner:** bossman | **Status:** 12/14 sub-cards done | **Date:** 2026-05-20

### Track 2: Memory Automation — t_9d56ef5a
**Phase 2 | Owner:** bossman | **Depends on:** Phase 1
Automated memory capture, deduplication, and retrieval workflows.

### Track 3: Self-Audit + Performance — t_ca987fa4
**Phase 3 | Owner:** bossman | **Depends on:** Phase 1
Permanent self-audit rules, weekly review automation, performance tracking.

### Track 4: Weekly Systems Review — t_38404d95
**Phase 4 | Owner:** bossman | **Depends on:** Phase 2
Monday morning automated review: PM2, logs, Kanban, memory, ports, cron.

### Track 5: Deep Audit + Breakage Detection — t_260136ce
**Phase 5 | Owner:** ops | **Depends on:** Phase 1
Comprehensive health dashboard, unknown port identification, cron validation.

### Track 6: Localhost Project Improvement — t_405e079a
**Phase 6 | Owner:** builder | **Depends on:** Phase 4
Audit and improvement of all localhost services.

### Track 7: Service Map Verification — t_9354a573
**Phase 7 | Owner:** ops | **Depends on:** Phase 5
Full port map, PM2 sync, unknown service identification.

### Track 8: Money Pipeline Research — t_ec6978a2
**Phase 8 | Owner:** builder | **Depends on:** Phase 7
Research pipeline rebuild (currently broken since 2026-04-07).

### Track 9: Crypto Intelligence Foundation — t_9715ac57
**Phase 9 | Owner:** trading | **Depends on:** Phase 8
Market research, cycle analysis, signal framework.

### Track 10: Binance US Intelligence — t_e752ea85
**Phase 10 | Owner:** trading | **Depends on:** Phase 9
Pre-trade hook restoration, RSI/signal logic, strategy framework.
⚠️ Blocker: pre-trade-hook missing at `~/Projects/trading-review/pre-trade-hook`

### Track 11: Controlled Execution Support — t_ec89434d
**Phase 11 | Owner:** trading | **Depends on:** Phase 10
Paper trading, backtesting evidence, Marcelo approval required for live execution.

---

## All Phases (0–11)

| Phase | Title | Status | Card |
|-------|-------|--------|------|
| Phase 0 | Save blueprint and freeze architecture | ✅ Done | t_a6cec443 |
| Phase 1 | Audit OpenClaw assets, PM2, cron, bots, dashboards, ports | ✅ Done | t_6b1a49f4 |
| Phase 2 | Define Hermes as primary control plane | ✅ Done | t_c64ea8d3 |
| Phase 3 | Demote LBC35 to delegated execution coordinator | ✅ Done | t_8bde67d0 |
| Phase 4 | Implement Kanban schema + Hermes↔OpenClaw handoff model | ✅ Done | t_ba9edec2 |
| Phase 5 | Add Telegram mobile controls for Kanban through BossMan | ✅ Done | t_43dec590 |
| Phase 6 | Pilot the new workflow using the money pipeline rebuild | 🔜 Active | t_71fdab1a |
| Phase 7 | Retire old PM dashboard and rebuild Perplexity Spaces | 🔜 Next | t_c4766e61 |
| Phase 8 | Source-required intake gate (highest-leverage data quality fix) | 🔜 Next | — |

---

## Sub-Agent Roles

| Profile | Role | Authority | Status |
|---------|------|----------|--------|
| `bossman` | Orchestrator, router, planner, approver | PRIMARY — routes all work | ✅ Active |
| `builder` | Code, dashboards, scripts, repos | Executes what bossman assigns | ✅ Active |
| `ops` | PM2, runtime, ports, infra | Executes what bossman assigns | ✅ Active |
| `trading` | Market research, signals | Executes what bossman assigns | ✅ Active |
| `content` | YouTube, scripts, docs | Executes what bossman assigns | ✅ Active |
| `lbc35` | Legacy executor | DEMOTED — delegated work only | ⚠️ Constrained |

**LBC35 Constraint Checklist (Non-Negotiable):**
- Must NOT self-assign tasks — wait for BossMan handoff packet
- Must NOT create new Kanban cards without BossMan approval
- Must NOT modify PM2, cron, LaunchAgents, or system services
- Must NOT access or modify Perplexity Spaces
- Must NOT change routing rules or agent profiles
- Receives work **exclusively** via BossMan handoff packet

---

## AI/Model Strategy (Permanent — Phase 1.10)

| Model | Role | Use Case |
|-------|------|----------|
| **MiniMax 2.7** | Primary brain | Everything, all day — BLOCKED for SquarePayouts |
| **DeepSeek** | Analysis backup | Deep reasoning, technical validation, edge-case analysis |
| **OpenAI** | Synthesis backup | Product framing, operational writing, summarization |
| **Claude** | Architecture backup | Workflow design, prompt/agent design, structured planning |
| **Perplexity** | Research | Live web research, Deep Research, Space content |

### SquarePayouts Model Restriction (Permanent — 2026-05-20)
MiniMax 2.7 is **BLOCKED** for all SquarePayouts work. Use Claude/DeepSeek/OpenAI/Perplexity/Hermes Computer Use only.

### Tool Strategy
| Task | Tool |
|------|------|
| Perplexity desktop app | Hermes Computer Use (BLOCKED — zero-bounds bug) |
| Perplexity in Brave browser | Browser QA (WORKING) |
| Installed PWAs (Basecamp) | Hermes Computer Use |
| Native Mac app UI | Hermes Computer Use |
| Web research, Deep Research | Perplexity Pro → Browser QA |
| Localhost web app QA | Browser QA |
| Local code/CLI/DB | Terminal + tools |

---

## Audit Rules (Permanent)

### Weekly Systems Review (Permanent)
**Schedule:** Every Monday 8:00 AM PDT
**Owner:** BossMan (automated via cron)

Sections: PM2 health → Log review → Kanban backlog → Memory quality → Project status → Strategic

Deliver to Marcelo via Telegram: brief weekly status (5–10 bullet points).

### Sub-Agent Performance Tracking
BossMan tracks per sub-agent: completion rate, quality of handoffs, Marcelo's satisfaction, routing patterns. Findings update SOUL.md and this blueprint.

---

## Weekly Review Framework

**Cron Job:** `0 8 * * 1` (every Monday 8:00 AM PDT)
**Command:** `hermes chat -q "work kanban task t_deb8dabb"`
**Template:** `~/.hermes/knowledge/WEEKLY_REVIEW_TEMPLATE.md`

Review covers: PM2 health log → Kanban backlog → Cron jobs → Service ports → Memory files → Security schedule

---

## Money Pipeline Track Summary (Separate — t_52a07505)

**Definition:** Opportunity research automation — finding, scoring, and routing deals.
**Status:** Research broken since 2026-04-07 — Phase 8 addresses rebuild.
**Key Rule:** Money Pipeline and Binance Bot are SEPARATE systems — never merge.

---

## Binance Track Summary (Separate — t_04922dfa)

**Definition:** Binance US USDT pair analysis, trading decision support, signal generation.
**Status:** Dashboard online (port 8104), pre-trade-hook missing.
**Safety Rules:** NO live execution in Phase 1. Paper trading before real capital. All strategy requires backtesting evidence.
**Phase 10 blocker:** Pre-trade-hook must be restored before Phase 10.

---

## Crypto Intelligence Roadmap

1. Phase 9: Crypto Intelligence Foundation — market research, cycle analysis
2. Phase 10: Binance US Intelligence — strategy framework, RSI logic
3. Phase 11: Controlled Execution Support — paper trading, Marcelo approval for live

**Critical:** NO live trading execution until Phase 11 with explicit Marcelo approval.

---

## Risks/Blockers

| Risk | Severity | Mitigation |
|------|----------|------------|
| PM2 unsynced | HIGH | `pm2 save` — persist current process list |
| money-pipeline degraded | HIGH | Phase 8 rebuild — research automation broken since 2026-04-07 |
| Unknown ports 8102, 8003, 9119 | MEDIUM | Phase 7 — identify before service map is finalized |
| Binance pre-trade-hook missing | HIGH | Phase 10 — must restore before Binance intelligence goes live |
| Phase 1 planning only | INFO | No live execution of trading or system changes until Phase 2+ |

---

## Fallback and Recovery Notes

| Failure | First Restore Action |
|---------|----------------------|
| AGENTS.md lost | Restore from GitHub: `BIGDAWG35/BossMan` |
| SOUL.md lost | Restore `~/.hermes/profiles/bossman/SOUL.md` from GitHub |
| Skills lost | Restore `~/.hermes/skills/` from GitHub |
| Knowledge lost | Restore `LEARNED_*.md` from Obsidian backup |
| Kanban DB lost | Restore from backup — `~/.hermes/kanban/boards/bossman/` |
| PM2 processes lost | `pm2 resurrect` or restore from `pm2-list-backup-20260414.txt` |

**Backup Locations (Minimum 2 required):**
- Primary: GitHub private repo `BIGDAWG35/BossMan`
- Secondary: `~/Desktop/CLAW-Backup/`

---

## Definition of Done Per Phase

| Phase | Definition of Done |
|-------|--------------------|
| Phase 0 | Blueprint saved to Obsidian + GitHub |
| Phase 1 | All 14 sub-cards complete, all 11 tracks defined |
| Phase 2 | BossMan SOUL.md updated, routing rules in AGENTS.md |
| Phase 3 | LBC35 demoted to delegated-only in all docs |
| Phase 4 | Kanban schema active, handoff packet format verified |
| Phase 5 | Telegram commands working for Marcelo |
| Phase 6 | Money Pipeline pilot running end-to-end |
| Phase 7 | Old PM2 dashboard retired, Perplexity Spaces rebuilt |
| Phase 8 | Research automation restored and verified |
| Phase 9 | Crypto intelligence framework operational |
| Phase 10 | Binance strategy framework with backtesting evidence |
| Phase 11 | Paper trading running, Marcelo approval for live execution |

---

## Document Locations

| Copy | Path |
|------|------|
| Obsidian | `/Users/bigdawg/Desktop/CLAW-Backup/HERMES-MASTER-BLUEPRINT.md` |
| GitHub | `BIGDAWG35/BossMan/hermes/HERMES-MASTER-BLUEPRINT.md` |
| Hermes knowledge | `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` (this file) |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-20 | Phase 1.11 — Initial master blueprint assembled from all Phase 1 sub-cards |

---

*This document is the single source of truth for Hermes Phase 1–11 implementation. All 11 tracks, phases, sub-agents, models, audit rules, and risk registers are consolidated here. Updated by BossMan at the end of each Phase 1 sub-card.*
