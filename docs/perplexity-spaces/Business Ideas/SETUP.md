# Business Ideas — Opportunities & Money Pipeline
**Updated: 2026-05-07**

## Overview
This space covers money-making opportunities, passive income research, real estate targets, and the opportunity pipeline.

Marcelo's core strategy: build multiple income streams using IT expertise + automation + bots. The Money Pipeline tracks 170+ opportunities across categories.

---

## Primary Use Cases
- "What opportunities are in the pipeline?"
- "What's the status of revenue streams?"
- "What passive income research do we have?"
- "Which opportunities should I prioritize?"
- "What's the current revenue pipeline?"

---

## Key Data Sources
| Source | Location | Notes |
|--------|----------|-------|
| Money Pipeline | `localhost:8020` | Opportunities tracker (170+ entries) |
| Money Pipeline DB | `~/Projects/money-making-dashboard/data/money.db` | SQLite — direct query if API broken |
| Daily research | Hermes cron jobs | 5 AM daily opportunity research |

---

## LEARNED Layer — Domain Knowledge (Raw Reference)

These files in `~/.hermes/knowledge/` contain deep domain research. When working on a topic, check these first:

| LEARNED File | Topic | Relevant For |
|-------------|-------|-------------|
| `LEARNED_RESOURCES.md` | Dashboard design, PM tools, chart best practices | Building dashboards, presentation materials |
| `LEARNED_BAKERY_SYSTEM.md` | Home bakery business: booking, pricing, tools | Bakery side project (if active) |
| `LEARNED_AIRBNB.md` | Airbnb/short-term rental: regulations, pricing, tools | Real estate strategy, DR/Mexico/El Salvador |
| `LEARNED_POWERSHELL.md` | PowerShell scripting, modules, automation | IT automation for clients |
| `LEARNED_AWS.md` | AWS services, architecture, best practices | Cloud infrastructure for clients |
| `LEARNED_SAP_BUSOBJECTS.md` | SAP BusinessObjects reporting | Enterprise reporting projects |

**Rule:** Check LEARNED files before using external search. If LEARNED has the answer, use it and save tokens.

---

## Files in This Space

| File | Purpose |
|------|---------|
| `SETUP.md` | This file — overview, LEARNED layer, navigation |
| `business-opportunities-overview.md` | Core vision, money pipeline, top opportunities |
| `money-pipeline-deep-dive.md` | Full opportunity list, DB schema, how to add entries |
| `passive-income-research.md` | Passive income categories and research findings |
| `revenue-pipeline-status.md` | Current vs. future revenue streams |
| `business-rules.md` | Decision framework — cash flow, risk, what NOT to do |
| `architect_01-claude-usage-policy.md` | How Hermes uses Claude/AI in this Space |

---

## Core Business Vision

Marcelo is building multiple income streams:
- **Tech/Automation business** — AI + automation as leverage with two colleagues
- **Crypto trading** — rules-based bot (not gambling)
- **Real estate** — rentals/Airbnb in Mexico, DR, El Salvador, Costa Rica, FL
- **Content** — YouTube channel (crypto/AI topics)
- **Process automation** — fixing broken business processes

**Initial target:** ~$50,000/month combined with colleagues
**Long-term goal:** $250,000–$500,000/year per person

---

## Decision Flow

```
New opportunity?
│
├─ Is it >$1K/month potential? → Add to Money Pipeline
├─ Does it match Marcelo's skills? → IT network = warm market
├─ Can Hermes/bots automate it? → Validate before hiring
└─ Does it pass business-rules.md? → Cash flow > speculation

Priority order:
1. VP consulting (highest $/hr)
2. Automation for SMBs (network exists)
3. Crypto bot (already running)
4. YouTube (long game)
5. Real estate (capital required)
```

---

## Perplexity Spaces

| Space | Status | Purpose |
|-------|--------|---------|
| Agent OS | ✅ Built | Hermes profiles, routing, services |
| Business Ideas | ✅ Built | This space — opportunities, research |
| Trading Ops | ✅ Built | Binance bot, signals, strategy |
| Toolchain Dev | ✅ Built | IDEs, coding tools, debugging |
