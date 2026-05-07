# Money Pipeline — Deep Dive (Hermes)

> Marcelo's business opportunity tracking system.
> Source: Money Pipeline service (port 8020)
> Last updated: 2026-05-07

---

## Overview

**Purpose:** Track all business opportunities — from initial idea to active revenue.

**Money Pipeline service:** PM2 managed, port 8020
**Data location:** `~/Projects/money-making-dashboard/data/money.db` (SQLite)
**Service issue:** TODO: Note if API is functional or broken (from OpenClaw: `getDb is not defined` crash loop — needs fixing)

---

## Opportunity Categories

| Type | Count |
|------|-------|
| Service | TODO (was 88) |
| Subscription | TODO (was 62) |
| SaaS | TODO (was 9) |
| Passive | TODO (was 6) |
| Product | TODO (was 2) |
| Ecommerce | TODO (was 1) |
| Digital Product | TODO (was 1) |
| Ads/Affiliate | TODO (was 1) |

**Total tracked:** TODO (was 170)

---

## Active Opportunities

> TODO: Pull current list from Money Pipeline DB
> Query: `sqlite3 ~/Projects/money-making-dashboard/data/money.db "SELECT title, monthly_potential, revenue_type FROM opportunities WHERE display_status = 'active' ORDER BY monthly_potential DESC;"`

### Tier 1: $5K–$15K/month

| # | Title | Monthly | Type | Target Market |
|---|-------|---------|------|---------------|
| 1 | TODO | TODO | TODO | TODO |
| 2 | TODO | TODO | TODO | TODO |

### Tier 2: $2K–$5K/month

| # | Title | Monthly | Type | Target Market |
|---|-------|---------|------|---------------|
| 3 | TODO | TODO | TODO | TODO |
| 4 | TODO | TODO | TODO | TODO |

### Tier 3: $1K–$2K/month

| # | Title | Monthly | Type | Target Market |
|---|-------|---------|------|---------------|
| 5 | TODO | TODO | TODO | TODO |

---

## Key Insights

**Marcelo's competitive advantage (from OpenClaw legacy data):**
- 25+ years of IT experience maps to: AI Automation Agency, Managed IT Services, Business Automation consulting
- These are warm markets — existing network can generate leads quickly
- Service-based opportunities dominate (88 of 170 in last count)

**Priority push (from legacy data):**
1. AI Automation Agency at $12K/month — Marcelo's IT background + Hermes coding = competitive advantage
2. Managed IT as a Service at $10K/month — proven model, recurring revenue
3. Voice Agent verticals (Legal, Real Estate, HVAC) — $2-3K/month each, repeatable
4. SquaresPayouts at $500/month — already built, needs marketing push

---

## How Opportunities Are Added

**Automated (via Hermes cron jobs):**
- `money-morning-research` (runs daily at 5 AM) — posts new opportunities to Money Pipeline
- Both check for duplicates before posting

**Manual:** Marcelo reviews and approves/rejects new opportunities

---

## Database Schema

Table: `opportunities`

| Column | Type |
|--------|------|
| id | INTEGER |
| title | TEXT |
| description | TEXT |
| monthly_potential | REAL |
| revenue_type | TEXT |
| target_market | TEXT |
| competition_level | TEXT |
| risk_level | TEXT |
| required_skills | TEXT |
| type | TEXT |
| display_status | TEXT (active/new) |
| created_at | timestamp |
| updated_at | timestamp |

---

## Money Pipeline Service Status

| Item | Status |
|------|--------|
| Service name | money-pipeline |
| Port | 8020 |
| PM2 status | TODO |
| Uptime | TODO |
| Restarts | TODO |
| API health | TODO (broken from OpenClaw — needs fix) |

**If API is broken:** Query DB directly with `sqlite3 ~/Projects/money-making-dashboard/data/money.db "..."`

---

## Related Files

- `business-opportunities-overview.md` — high-level overview
- `revenue-pipeline-status.md` — current vs. future revenue
- `passive-income-research.md` — income strategy
- `business-rules.md` — decision framework
