# Trading Ops — Binance Bot & Market Analysis
**Updated: 2026-05-07**

## Overview
This space covers crypto and stock trading — Binance bot strategy, portfolio holdings, trade history, market research, and financial dashboards.

**Critical:** Hermes's `trading` profile owns analysis and recommendations only. No live trades are executed without Marcelo's explicit approval.

---

## Primary Use Cases
- "What is the current Binance bot config and is it performing well?"
- "Show me my crypto portfolio breakdown"
- "What's the status of BTC and HBAR positions?"
- "Analyze today's trading signals — what pairs are in uptrend?"
- "How much of my portfolio is in stablecoins vs alts?"
- "Should I adjust RSI_HIGH based on recent performance?"
- "Check if there are any divergence alerts on my holdings"

---

## Key Data Sources

| Source | Location | Notes |
|--------|----------|-------|
| Binance bot | `localhost:8104` | Trading engine, balance, positions |
| Crypto tracker | `localhost:8020` | Portfolio tracker |
| Hermes trading profile | `~/.hermes/` | Analysis and recommendations |

---

## Claude Helper Rules (This Space)

- Manager: bossman orchestrates
- Default coder: builder (for scripts, not live trading)
- Ops/deploy: ops (for service health)
- Trading analysis: trading (this Space's owner)
- Claude: helper-only and opt-in — for strategy docs and reports ONLY
- Never use Claude for live trading logic
- For full details, see: `architect_01-claude-usage-policy.md` in this Space

---

## Files in This Space

| File | Purpose |
|------|---------|
| `SETUP.md` | This file — overview, data sources, navigation |
| `trading-rules.md` | Non-negotiable trading rules, risk parameters, pair universe |
| `trading-overview.md` | System architecture, dashboards, health checks |
| `binance-bot-status.md` | Current bot state, balance, cycle, positions |
| `architect_01-claude-usage-policy.md` | How Hermes uses Claude/AI in this Space |

---

## Non-Negotiable Rules (Quick Reference)

| Rule | Value |
|------|-------|
| Risk per trade | 3% |
| Daily loss limit | 6% |
| Max open positions | 3 |
| MIN_RR | 2:1 |
| Uptrend required | 1H EMA50 > EMA200 |

---

## Perplexity Spaces

| Space | Status | Purpose |
|-------|--------|---------|
| Agent OS | ✅ Built | Hermes profiles, routing, services |
| Business Ideas | ✅ Built | Opportunities, research, money pipeline |
| Trading Ops | ✅ Built | This space — Binance bot, signals, strategy |
| Toolchain Dev | ✅ Built | IDEs, coding tools, debugging |
