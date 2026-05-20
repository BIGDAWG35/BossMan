# MONEY_PIPELINE_V2_SPEC.md — Research Engine Specification
**Date:** 2026-05-22 | **Phase:** Phase 8 Prep | **Tags:** [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]
**Status:** SPEC DRAFT — Ready for Marcelo Review

---

## Overview

Money Pipeline v2 is Marcelo's research and opportunity intelligence engine. It ingests market data, scores and evaluates opportunities, and produces structured outputs for human review and agent consumption. It is a **research tool only** — it does not place trades, send orders, or take any executable action on any exchange or platform.

Money Pipeline v2 is the foundation that later phases (Phase 9: Crypto Intelligence, Phase 10: Binance US Intel) will consume and build upon.

---

## What Money Pipeline Does (When Healthy)

1. **Ingest** — collects raw opportunity and market data from external sources and internal records
2. **Enrich** — scores, categorizes, and summarizes each opportunity using AI models
3. **Track** — monitors stage progression, revenue outcomes, and momentum
4. **Output** — generates human-readable reports and agent-readable JSON/CSV
5. **Alert** — surfaces high-signal opportunities for immediate review

---

## Core Capabilities

### 1. Opportunity Ingestion

- **Sources:** OpenClaw research cron (`money-morning-research-v2`) adds opportunities via POST to `/api/opportunities`
- **Frequency:** Daily at 5 AM PDT (automated via OpenClaw cron)
- **Deduplication:** Checks existing URL/title before inserting
- **Fields captured:** title, description, source, monthly_potential, revenue_type, target_market, competition_level, risk_level, required_skills, type='opportunity', display_status='new'
- **Current state:** ✅ Working (389 records), but research cron status post-fix unknown

### 2. AI Enrichment Pipeline

- **V1 enrichment:** Basic scoring via `enrichOpportunity()` function (score_market, score_competition, etc.)
- **V2 enrichment:** Advanced scoring via `enrichOpportunityV2()` using `claude-sonnet-4-6`, adds composite_score, confidence_band, ease_band, v2_summary, recommended_stage, recommended_action, score_rationale
- **Frequency:** Currently manual per-record POST to `/api/enrich-v2` — **DEGRADED**
- **Target state:** Automated batch enrichment nightly, processing un-enriched records in queue

### 3. KPI Tracking

- **Stage funnel:** discovery → research → validation → plan → building → testing → outreach → fulfillment
- **Revenue tracking:** actual_revenue, revenue_date, revenue_notes logged per opportunity
- **Tier assignment:** Hot / Warm / Lukewarm / Cold based on composite_score
- **Confidence bands:** high / medium / low from v2 model
- **Current state:** ✅ Working (lastUpdated 2026-05-20)

### 4. Output Formats

| Output | Format | Audience |
|--------|--------|---------|
| Dashboard UI | HTML/Tailwind | Marcelo (human) |
| KPI endpoint | JSON | Hermes agents |
| Opportunity export | JSON | Phase 9/10 agents |
| Status files | Markdown | Obsidian + GitHub sync |
| Telegram summaries | Text | Marcelo (morning) |

### 5. Research QA (Broken)

- **GET** `/api/research-qa` ✅ — returns QA data
- **POST** `/api/research-qa` ❌ — "Cannot POST" — route not defined
- **Fix required:** Add POST handler for research questions

---

## Data Sources

### External (what v2 should connect to)

| Source | Type | Status |
|--------|------|--------|
| OpenClaw `money-morning-research-v2` | Opportunity discovery | ⚠️ Unknown (post-fix verification needed) |
| Binance US public API | Market data | [PHASE 10 SCOPE] |
| CoinGecko / CoinMarketCap | Crypto prices, volume | [PHASE 9 SCOPE] |
| VP Jobs / LinkedIn | Job opportunity scraping | [LEGACY — scraper.js inactive] |

### Internal (already connected)

| Source | Status |
|--------|--------|
| SQLite `money.db` / `money_pipeline.db` | ✅ Active |
| Opportunities table (389 records) | ✅ Active |
| Leads table | ✅ Active (fixed Apr 16) |
| Status exporter (daily 4 PM) | ✅ Active |
| Obsidian + GitHub sync | ✅ Active |

---

## KPIs (Money Pipeline v2 Should Track)

### Per Opportunity
- `composite_score` (0–100)
- `tier` (Hot/Warm/Lukewarm/Cold)
- `confidence_band` (high/medium/low)
- `ease_band` (hard/medium/easy)
- `stage` (discovery → fulfillment)
- `monthly_potential` ($)
- `actual_revenue` ($)
- `enrichment_version` (v1/v2)
- `hot_signal` (0/1)
- `v2_summary` (compact: confidence|ease|revenue|passive|stage)

### Aggregate
- Total opportunities by stage
- Total potential by stage
- Revenue achieved vs potential
- Enrichment coverage (v2 %)
- Hot signal count
- Stale opportunity count

### Market Context (for v2)
- Cycle phase (bull/bear/transition)
- Sector momentum (crypto/SaaS/local services)
- Volatility signals (for Binance Phase 10)
- Volume anomalies (for Phase 9 intelligence)

---

## Output Specification

### For Humans (Dashboard + Telegram)
- Morning summary: "Research complete — Found X opportunities. Top picks: [list with earnings]"
- Weekly review: stage funnel, revenue achieved, hot signals, stale opportunities
- Dashboard: sortable/filterable opportunity list with stage, score, tier

### For Agents (JSON/CSV)
```json
{
  "date": "2026-05-22",
  "opportunities": [...],
  "summary": {
    "total": 389,
    "v2_enriched": 253,
    "hot_count": 2,
    "total_potential": 3112773,
    "actual_revenue": 1500
  },
  "cycle_context": "bull_mid",
  "top_signals": [...]
}
```

### For Future Phases (Binance/Crypto)
- Clean JSON export of hot/warm opportunities with confidence, stage, revenue potential
- No execution logic, no position sizing, no capital allocation
- Structured so Phase 9 (Crypto Intelligence) can ingest and add market context
- Structured so Phase 10 (Binance Intel) can consume and generate trading signals

---

## Safety & Separation Rules

### Rule 1: Research ≠ Execution
Money Pipeline produces intelligence. It flags opportunities, computes scores, tracks revenue. It does NOT place trades, send orders, modify positions, or take any action that changes actual financial state.

### Rule 2: Outputs Feed Later Phases, Not Directly
Phase 9 (Crypto Intelligence) and Phase 10 (Binance US Intel) are the ONLY consumers of Money Pipeline outputs. Money Pipeline does not connect to any exchange API, brokerage, or trading system directly.

### Rule 3: Trading Logic Lives in Phase 10+
Any signal that looks like "buy/sell/hold" is Phase 10 territory. Money Pipeline v2 outputs "opportunity flag" not "trade recommendation." The distinction must be preserved in code comments and documentation.

### Rule 4: No Position Sizing or Capital Allocation
Money Pipeline never computes: position size, entry price, stop loss %, allocation %, risk per trade. Those are Phase 10 Binance Bot functions. Money Pipeline's role is "here is what is interesting" — not "here is what to do."

### Rule 5: Binance Bot Is Separate
Binance Bot (port 8104) is NOT part of Money Pipeline. It has its own DB schema, PM2 process, and Phase 10 scope. They share data formats but not code. They may share outputs (Money Pipeline → Binance Bot) but only as read-only intelligence.

### Rule 6: Memory Tagging for Trading Intelligence
All Money Pipeline entries about market signals, opportunity scores, and cycle context use: `[TRADING] [PROJECT:MoneyPipeline]`. Entries about internal architecture (DB schema, endpoints, enrichment) use `[ARCHITECTURE] [PROJECT:MoneyPipeline]`. This separation allows future agents to query trading context without pulling infrastructure docs.

---

## Hermes + Memory Integration

### Memory Integration Points

| Trigger | Tag | Storage |
|---------|-----|---------|
| New hot_signal=1 opportunity found | `[TRADING] [PROJECT:MoneyPipeline]` | Hermes memory tool |
| Weekly summary generated | `[WORKFLOW] [PROJECT:MoneyPipeline]` | MEMORY_CAPTURE_LOG.md |
| New stage progression with revenue | `[DECISION] [PROJECT:MoneyPipeline]` | MEMORY_CAPTURE_LOG.md |
| Enrichment failure or pipeline error | `[PERFORMANCE] [PROJECT:MoneyPipeline]` | MEMORY_CAPTURE_LOG.md |
| Cycle context change (bull→bear) | `[TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]` | MEMORY_CAPTURE_LOG.md |
| Phase 9/10 readiness update | `[ROUTING] [PROJECT:MoneyPipeline]` | MEMORY_CAPTURE_LOG.md |

### Integration with T3 (Weekly Review)
- Money Pipeline v2 should expose a `/api/v2/summary` JSON endpoint consumable by the weekly review cron
- Weekly review reads this endpoint and incorporates: stage funnel, revenue total, hot signals, stale count

### Integration with T4 (Deep Audit)
- Deep audit queries MEMORY_CAPTURE_LOG.md for [TRADING] [PROJECT:MoneyPipeline] entries
- Checks for pattern: repeated failure on certain enrichment types, stale pipeline, revenue vs potential drift

### Integration with Phase 9 (Crypto Intelligence)
- Phase 9 reads Money Pipeline output as one input among: Binance US data, on-chain data, social signals
- Money Pipeline provides: which opportunities are flagged hot, current revenue tracking, stage funnel health

### Integration with Phase 10 (Binance Bot)
- Phase 10 reads Money Pipeline output as market context + opportunity flags
- Binance Bot does NOT write back to Money Pipeline — one-way read-only

### Health Check Endpoint
- Money Pipeline v2 should expose: `GET /api/health`
- Returns: `{ status: "ok|degraded|broken", lastEnrichment: "ISO date", opportunities: N, v2Coverage: "X%" }`
- T1/T2 monitors use this instead of scraping logs

---

## Phase 8 Implementation Plan

### Low-Risk Steps (Implement First)

**Step 1:** Verify `money-morning-research-v2` cron is adding new opportunities
- Check DB for records with created_at >= 2026-04-15
- If no new records since Apr 15 → cron is still broken
- If records exist → cron is working, pipeline is healthy

**Step 2:** Add `/api/health` endpoint
- Returns status, lastEnrichment date, total opportunities, v2Coverage %
- No external dependencies — reads local DB
- Low risk: read-only, no state changes

**Step 3:** Fix `/api/research-qa` POST — add POST handler to server.js
- Copy GET handler logic, add POST support
- Low risk: new route addition, no existing behavior changed

**Step 4:** Add daily auto-enrichment cron
- New OpenClaw cron or PM2 script that POSTs to `/api/enrich-all`
- Targets records where enrichment_version IS NULL or != 'v2'
- Runs at 6 AM PDT (after research cron at 5 AM)
- Low risk: additive, no existing cron removed

### Medium-Risk Steps (Implement After Low-Risk Is Stable)

**Step 5:** Fix research-logs API
- Either create route handler to serve `research_logs/` directory, OR
- Deprecate research_logs entirely (clean up directory if not used)

**Step 6:** Add `/api/v2/summary` endpoint
- Returns clean JSON for agent consumption: `{ date, summary, top_signals, cycle_context }`
- Powers T3 weekly review + Phase 9/10 integration
- Medium risk: new endpoint, needs testing

**Step 7:** Add cycle context tracking
- New table or field: `cycle_phase` (bull/bear/transition/mid_cycle)
- Updated by Phase 9 crypto intelligence once that phase is running
- Medium risk: new field, needs migration

### High-Risk Steps (Phase 8B — Marcelo Approval Required)

**Step 8:** Binance US market data ingestion
- Connect to Binance US public API for price/volume data
- Requires API key verification, rate limit handling, error handling
- Phase 10 territory — do not implement in Phase 8

**Step 9:** Signal generation engine
- Engine that takes Money Pipeline outputs + market data and outputs "buy/hold/sell" signals
- This is Phase 10 Binance Bot — not Phase 8 Money Pipeline

---

## Separation from Binance Bot

| Aspect | Money Pipeline (Phase 8) | Binance Bot (Phase 10) |
|--------|--------------------------|--------------------------|
| Purpose | Research + opportunity scoring | Trading intelligence + execution |
| Output | "This looks interesting" | "Buy X at Y with Z stop" |
| Connects to exchanges | NO | YES (Binance US) |
| Places trades | NO | NO (Phase 11) |
| Scope | Port 8020 | Port 8104 |
| DB | money_pipeline.db | binance.db |
| Tags | [TRADING] [PROJECT:MoneyPipeline] | [TRADING] [PROJECT:BinanceBot] |

---

## Files Updated by Phase 8

- `~/.hermes/knowledge/memory/MONEY_PIPELINE_AUDIT_2026-05.md` ✅ (this phase)
- `~/.hermes/knowledge/memory/MONEY_PIPELINE_V2_SPEC.md` ✅ (this phase)
- `~/.hermes/knowledge/memory/SERVICE_MAP_2026-05.md` — updated with Money Pipeline health
- `~/.hermes/knowledge/memory/MEMORY_CAPTURE_LOG.md` — new [TRADING] entries
- `~/.hermes/knowledge/memory/OFFLINE_SERVICES.md` — if any services are retired during cleanup

---

## Memory Entries (Phase 8)

**MP8-03 — [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]**
Money Pipeline v2 spec defined. Core capabilities: ingestion (daily 5 AM), enrichment (v2 per-record), KPI tracking, multi-format outputs. Safety rule: research ≠ execution. Outputs feed Phase 9/10 only — no direct exchange connection.

**MP8-04 — [TRADING] [PROJECT:MoneyPipeline]**
Safety & separation: Money Pipeline (port 8020) = research/intelligence only. Binance Bot (port 8104) = trading intelligence + execution. No position sizing, no capital allocation, no order placement from Money Pipeline. Clear boundary enforced in spec.

**MP8-05 — [WORKFLOW] [PROJECT:MoneyPipeline]**
Hermes integration: Money Pipeline exposes `/api/health` (T1/T2), `/api/v2/summary` (agents). Weekly review reads summary. Deep audit queries [TRADING] entries. Phase 9/10 consume read-only outputs. Cycle context tracked via new field. Memory tagging: [TRADING] for signals, [ARCHITECTURE] for infrastructure.

**Perplexity Collaboration:** Perplexity is the default research assistant for evaluating new opportunity types, prioritizing research targets, and suggesting layout changes. See `~/.hermes/SOUL.md` — "Perplexity Orchestration Loop".

---

**Next:** Marcelo reviews spec → approves implementation steps → Phase 8 implementation begins (Step 1: verify research cron)