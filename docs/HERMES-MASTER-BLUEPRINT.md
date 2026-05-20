# HERMES MASTER IMPLEMENTATION BLUEPRINT

**Created:** 2026-05-20
**Author:** BossMan (Hermes Agent)
**Status:** Verified — Awaiting Marcelo Approval
**Phase:** Phase 1 (Foundation)

---

## MASTER OBJECTIVE

Build Hermes/BossMan into a self-learning, self-improving autonomous manager/orchestrator that gets smarter over time through trusted memory, verified audits, measured outcomes, workflow reviews, high-quality research, and continuous system performance checks.

---

## VERIFIED ENVIRONMENT (2026-05-20)

Source of truth: Current verified reality, not historical assumptions.

### PM2 Services

| Service | Port | PM2 Name | Status | Uptime | Restarts | Notes |
|---------|------|----------|--------|--------|----------|-------|
| Bakery | 3001 | bakery | ✅ online | 2D | 1 | Clean, no errors |
| Money Pipeline | 8020 | money-pipeline | ✅ online | 3D | 1 | Stream errors (degraded) |
| SquarePayouts | 8030 | squarepayouts | ✅ online | 67m | 0 | Migration 006 ROLLBACK (harmless) |
| Binance Bot | 8104 | binance-bot | ✅ online | 36h | 6 | RSI extreme block active, no_signal |
| Cloudflare Tunnel | — | cloudflare-tunnel | ✅ online | 34h | 0 | Tunnels public URLs |
| Node | — | node | ✅ online | 3h | 0 | Unknown purpose — investigate |

### Inactive DM2 Services (Offline)

| Service | Port | PM2 Name | Status |
|---------|------|----------|--------|
| Overview Dashboard | 8100 | overview | ❌ offline |
| Health Dashboard | 8110 | health-dashboard | ❌ offline |
| Trading Control | 8130 | trading-control | ❌ offline |
| YouTube Dashboard | 8140 | youtube-dashboard | ❌ offline |
| Kraken Bot | 8106 | kraken-bot | ❌ offline |

### Unknown Ports (Needs Investigation)

| Port | Status |
|------|--------|
| 8102 | unverified |
| 8003 | unverified |
| 9119 | unverified |

### Git Repositories

All active projects in `~/Projects/`:
- **squarepayouts** — Sports squares marketplace (BIGDAWG35/Squares)
- **binance-bot** — Binance US trading bot
- **money-making-dashboard** — Money Pipeline SPA (port 8020)
- **health-dashboard** — Health monitoring dashboard
- **bakery** — BakeryOps order management
- **BossMan** — This blueprint repo
- Plus ~20 other projects (see full list in Phase 1 environment card)

### Logs

- `~/.pm2/logs/` — All PM2 service logs
- `~/logs/pm2-health.log` — Health monitor output
- Per-service: `pm2 logs <service-name>`

### PM2 Warning

Current process list NOT synchronized with saved list. `pm2 save` needed.

---

## SELF-IMPROVEMENT POLICY

### Automatic Capture Rule (Permanent)

Whenever BossMan learns something important about:
- Marcelo's preferences, corrections, or behavior patterns
- Recurring system quirks or workflow patterns
- Project context, wins, failures, or bottlenecks
- Strategic decisions (architecture, security, pricing, routing)
- Performance optimization opportunities

→ Proactively save a compact, searchable memory entry WITHOUT waiting to be asked.

### Structured Memory Tags

| Tag | Usage |
|-----|-------|
| `[DECISION]` | Strategic choices, approvals, direction changes |
| `[ARCHITECTURE]` | System design, integration decisions |
| `[SECURITY]` | Auth findings, hardening, vulnerabilities |
| `[PRICING]` | Product pricing, monetization decisions |
| `[PRODUCT]` | Product direction, feature decisions |
| `[ROUTING]` | Agent routing, task assignment patterns |
| `[WORKFLOW]` | Process improvements, automation patterns |
| `[TRADING]` | Crypto/trading insights, strategy |
| `[PERFORMANCE]` | System speed, optimization, bottlenecks |

Each tag + relevant project name (e.g., `[ARCHITECTURE] squarepayouts`).

### What NOT to Save

- Task progress, session outcomes, completed-work logs
- Temporary TODO state
- Data that will be stale within 7 days
- Speculation without evidence
- Trivial/obvious information

### Storage Hierarchy

1. **memory tool** — Compact durable facts, injected per session
2. **`~/.hermes/knowledge/`** — Durable docs, project records
3. **Obsidian CLAW-Backup** — Reference docs, blueprints
4. **GitHub BossMan** — Durable blueprints, versioned
5. **Kanban board** — Active work tracking

---

## SELF-AUDIT AND PERFORMANCE POLICY

### Continuous Monitoring (Permanent)

BossMan must continuously monitor its own performance and system health. Performance degradation is a first-class issue, not an afterthought.

### What to Monitor

- PM2 status and restart patterns
- Service logs and error patterns
- Slow routes, response delays, timeouts
- Memory leaks or abnormal growth
- CPU spikes or saturation
- Unhealthy dependency behavior
- Blocked jobs, stuck queues, failed automations
- Repetitive exceptions and warning patterns
- Dashboard sluggishness
- Stale, broken, or unverified hosts/services

### Audit Frequencies

| Frequency | Scope |
|-----------|-------|
| Every 5 min | PM2 health monitor (cron, auto-fix, silent when healthy) |
| Daily | Log review (automated scan for new error patterns) |
| Weekly | Systems review (full Kanban + performance + memory review) |
| Monthly | Deep audit (dependencies, schema drift, API contracts) |

### Alert Rules

- ✅ Silent when healthy — zero messages if all OK
- ✅ Auto-fix silently — restart on failure, no alert during attempt
- ✅ Alert ONLY on: recovery success (✅ FIXED) or escalation (🚨 NEEDS ATTENTION)
- ✅ No duplicate alerts — lockfile per service/per incident

### Known Performance Issues (2026-05-20)

1. **PM2 unsynced list** — `pm2 save` not done
2. **Money Pipeline** — Stream errors, research broken (degraded since 2026-04-07)
3. **SquarePayouts** — `url.parse()` deprecation warnings (dependency-level)
4. **Unknown ports** 8102, 8003, 9119 — unverified services
5. **SquarePayouts** — Migration 006 ROLLBACK (harmless, applied, skipped)

---

## KANBAN ROADMAP — 11 TRACKS

### Board: bossman (active)

### Phase 0 — Environment Verification (COMPLETE ✅)
- Verified from current reality (2026-05-20)
- 16 PM2 services checked, 6 active confirmed
- Ports, logs, repos, performance all documented

### Phase 1 — Foundation Setup (IN PROGRESS — THIS BLUEPRINT)
- 14 sub-deliverables (all cards created)
- Awaiting Marcelo approval to proceed to Phase 2

### Tracks (Phase 2+)

| # | Track | Card | Phase | Owner |
|---|-------|------|-------|-------|
| 1 | 🏗 Hermes Foundation | t_a57158e5 | P1+continuous | bossman |
| 2 | 🧠 Memory Automation | t_9d56ef5a | P2 | bossman |
| 3 | 🔍 Self-Audit & Performance | t_14cae830 | P3 | bossman+ops |
| 4 | 📅 Weekly Review | t_38404d95 | P4 | bossman |
| 5 | 🔬 Deep Audit & Breakage | t_260136ce | P5 | bossman+ops |
| 6 | 🛠 Localhost Improvement | t_405e079a | P6 | builder |
| 7 | 🗺 Service Map Cleanup | t_9354a573 | P7 | ops |
| 8 | 📊 Money Pipeline Research | t_ec6978a2 | P8 | trading |
| 9 | ₿ Crypto Intelligence | t_9715ac57 | P9 | trading |
| 10 | 📈 Binance US Intelligence | t_e752ea85 | P10 | trading |
| 11 | ⏳ Controlled Execution | t_ec89434d | P11 | trading |

---

### Full Card List (bossman board)

| Card ID | Status | Description |
|---------|--------|-------------|
| t_b22005be | awaiting_approval | Master Blueprint — overall plan |
| t_b7ec1ff7 | ready | Phase 1 Foundation — 14 sub-cards |
| t_a57158e5 | ready | Track 1: Hermes Foundation |
| t_9d56ef5a | ready | Track 2: Memory Automation |
| t_14cae830 | ready | Track 3: Self-Audit & Performance |
| t_38404d95 | ready | Track 4: Weekly Review |
| t_260136ce | ready | Track 5: Deep Audit |
| t_405e079a | ready | Track 6: Localhost Projects |
| t_9354a573 | ready | Track 7: Service Map Cleanup |
| t_ec6978a2 | ready | Track 8: Money Pipeline |
| t_9715ac57 | ready | Track 9: Crypto Intel |
| t_e752ea85 | ready | Track 10: Binance Intel |
| t_ec89434d | ready | Track 11: Controlled Execution |

**Phase 1 Sub-cards (14 total):**
| ID | Deliverable |
|----|-------------|
| t_887329a8 | Verified host/service summary |
| t_4645b539 | Performance/log summary |
| t_b7e8bcca | Sub-agent roster |
| t_8ee5ba45 | Kanban roadmap |
| t_192cee51 | Self-improvement policy |
| t_ca987fa4 | Self-audit/performance policy |
| t_b144cde1 | Memory policy |
| t_deb8dabb | Weekly review template |
| t_b59c4306 | Service verification framework |
| t_52a07505 | Money Pipeline track summary |
| t_04922dfa | Binance track summary |
| t_bf521523 | AI/model strategy |
| t_f5fd598e | Blueprint save verification |
| t_8078a389 | Risks/blockers/next actions |

---

## SUB-AGENT ROSTER

| Profile | Role | Uses |
|---------|------|------|
| **bossman** | Orchestrates, routes, approves, plans | Kanban, memory, delegation |
| **builder** | Code, dashboards, scripts, Git, PM2 | Terminal, file, code editors |
| **ops** | PM2, runtime, ports, health, deployments | Terminal, pm2, cron |
| **trading** | Research-only: market analysis, crypto | Dashboards, APIs, web research |
| **content** | YouTube content, social, docs | Terminal, scripts |

### Sub-Agent Routing Rules

| Task Type | Route To |
|-----------|----------|
| Code, features, scripts, Git, Cursor | builder |
| Runtime, PM2, ports, health, infra | ops |
| Market research, crypto, trading | trading |
| Content, docs, videos, social | content |
| Routing, approvals, decisions | bossman |

---

## AI/MODEL STRATEGY

### Model Roles (Permanent)

| Model | Role |
|-------|------|
| **Claude** | Architecture, workflow design, structured planning, prompt/agent design |
| **DeepSeek** | Deep reasoning, technical validation, edge-case analysis, crypto logic |
| **OpenAI** | Synthesis, product framing, operational writing, summarization |
| **MiniMax 2.7** | Alternative layouts, workflow variations, idea expansion, creative |
| **Perplexity** | Web research, Deep Research, process analysis, crypto research, verification |

### Model Rules

1. Do not use all models for every task
2. Use the best model for the job
3. When confidence is low or strategic — compare multiple models and synthesize
4. Evidence-backed findings over hype
5. Continuously refine decisions based on outcomes

### SquarePayouts Restriction (Permanent)
MiniMax 2.7 BLOCKED for all SquarePayouts work.
Approved: Claude, DeepSeek, OpenAI, Perplexity Computer, Hermes Computer Use.

---

## CRYPTO INTELLIGENCE ROADMAP

### Phased Approach (NO Execution in Phase 1)

| Phase | Focus | Status |
|-------|-------|--------|
| P8 | Money Pipeline research track expansion | Planned |
| P9 | Crypto intelligence foundation | Planned |
| P10 | Binance US intelligence and strategy rebuild | Planned |
| P11 | Controlled execution support (requires approval) | Future |

### Required Crypto Knowledge Areas

1. Digital asset/crypto market fundamentals
2. Last 4 major market cycles (2017, 2020-2021, 2022 bear, 2024-2025)
3. Recurring historical patterns vs divergences
4. Chart reading and structure analysis
5. Signal interpretation and market regime ID
6. When NOT to trade / when TO trade
7. Strong vs weak setups
8. Binance US USDT pair analysis
9. Narrative shifts and sentiment gathering
10. Social signal research
11. Pre-listing awareness
12. Post-analysis and strategy refinement

### CRITICAL SAFETY RULES

- ❌ NO live trading execution in Phase 1
- ❌ Do not treat hype as evidence
- ❌ Never merge Money Pipeline and Binance Bot into same project/phase/workflow
- ✅ Keep research, intelligence, strategy, and execution in separate phases
- ✅ Flag compliance, data quality, and risk concerns immediately
- ✅ Paper trading before any real capital
- ✅ Marcelo explicit approval required before Phase 10 or 11 execution

---

## MONEY PIPELINE vs BINANCE BOT — CRITICAL SEPARATION

| Dimension | Money Pipeline | Binance Bot |
|-----------|---------------|-------------|
| **Purpose** | Crypto tracking, market research, intelligence, monitoring | Trading strategy, Binance US analysis, decision support |
| **Port** | 8020 | 8104 |
| **PM2** | money-pipeline | binance-bot |
| **Status** | Online, degraded | Online, no_signal, missing pre-trade hook |
| **Track** | Track 8 | Track 10 |
| **Phase** | Phase 8 | Phase 10 |
| **Owner** | trading | trading (ops for pre-trade hook fix) |
| **Approval** | No | Yes (Marcelo for execution phases) |

**Thou shalt not merge these two.** They may inform each other only in later phases, after each is independently mature.

---

## PHASE ROADMAP

| Phase | Name | Start After | Duration (est.) |
|-------|------|------------|-----------------|
| ✅ 0 | Environment Verification | Immediate | 1 session |
| 🔲 1 | Foundation Setup | Phase 0 done | 1-2 sessions |
| 🔲 2 | Memory Automation | Phase 1 approved | 2-3 sessions |
| 🔲 3 | Self-Audit & Performance | Phase 2 complete | 2-3 sessions |
| 🔲 4 | Weekly Systems Review | Phase 3 complete | 1-2 sessions |
| 🔲 5 | Deep Audit & Breakage | Phase 4 complete | 2-3 sessions |
| 🔲 6 | Localhost Improvement | Phase 5 complete | 5-10 sessions |
| 🔲 7 | Service Map Cleanup | Phase 6 started | 2-3 sessions |
| 🔲 8 | Money Pipeline Research | Phase 6-7 complete | 3-5 sessions |
| 🔲 9 | Crypto Intelligence | Phase 8 started | 5-10 sessions |
| 🔲 10 | Binance US Intelligence | Phase 9 substantial | requires Marcelo approval |
| 🔲 11 | Controlled Execution | Phase 10 complete | requires Marcelo approval |

---

## DEFINITION OF DONE (per Phase)

| Phase | Done When |
|-------|-----------|
| 0 | Environment verified from current reality, not assumptions |
| 1 | Blueprint saved, Kanban created, environment verified, awaiting approval |
| 2 | Memory automation running, captures auto-triggered without prompting |
| 3 | Self-audit cron running, performance baseline documented |
| 4 | Weekly review cron delivering summaries to Marcelo |
| 5 | Monthly deep-audit framework operational |
| 6 | All active projects have improvement roadmaps, builder assignments |
| 7 | Services map is canonical, stale services retired, `pm2 save` done |
| 8 | Money Pipeline research engine expanded, stream errors fixed |
| 9 | Crypto education curriculum started, cycle study documented |
| 10 | Binance bot pre-trade hook restored, strategy documented |
| 11 | Paper trading system built, execution parameters defined |

---

## RISKS AND BLOCKERS

| Risk | Phase | Status |
|------|-------|--------|
| PM2 unsynced list | P1 | Low — needs pm2 save |
| Money Pipeline degraded (stream errors) | P6/P8 | Medium — research automation broken |
| Binance Bot pre-trade hook missing | P10 | High — blocks strategy work |
| Unknown ports 8102, 8003, 9119 | P7 | Low — investigate on demand |
| SquarePayouts migration 006 ROLLBACK | P6 | Low — harmless, already applied |
| Phase 10/11 require Marcelo approval | P10/P11 | Gate — cannot proceed without approval |

---

## FALLBACK AND RECOVERY

1. **Cron job fails** → PM2 health monitor auto-restarts; check pm2-health.log
2. **Service crash loop** → Auto-restart 3x, then escalation to Marcelo
3. **Kanban stuck card** → BossMan reopens or reassigns → escalate if stuck > 3 days
4. **Memory corruption** → Restore from ~/.hermes/knowledge/ backups
5. **PM2 crash** → `pm2 resurrect` or `pm2 start` from saved list
6. **Migration failure** → ROLLBACK (harmless if additive columns)
7. **Live trading failure** → KILL SWITCH (no execution without Phase 11 approval)

---

## BLUEPRINT STORAGE

| Location | Path | Status |
|----------|------|--------|
| Obsidian (CLAW-Backup) | `~/Desktop/CLAW-Backup/HERMES-MASTER-BLUEPRINT.md` | ✅ Saved |
| GitHub (BossMan repo) | `~/Projects/BossMan/docs/` | ✅ Saved |Pending commit+push|
| Kanban (bossman board) | All 15+ cards | ✅ Created |
| Knowledge | `~/.hermes/knowledge/` | Next Phase |

---

## APPROVAL

**This blueprint has been verified from current reality (2026-05-20).**
**Phase 1 is planned, documented, and on the board.**
**Awaiting Marcelo approval before Phase 2 execution begins.**

## RECOMMENDED NEXT COMMAND

When Marcelo approves, run:
```
hermes kanban start --on-phase 1 "Execute Phase 2: Memory Automation. First actions:
1. pm2 save (ops)
2. Structured memory tags documented
3. Memory capture triggers tested
4. Investivate unknown ports 8102, 8003, 9119 (ops)
5. Pre-trade hook investigation (ops, binance-bot)"
```
