**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Property Management Dashboard — Project Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Property Management Dashboard — Project Overview

> **2026-10-02 correction:** Valuation 'in flight 2026-07-21' and 'Blocked on ATTOM dev API key' are a July snapshot — re-verify. Blueprint/data-model/phase-report links (`PROPERTYMANAGEMENTDASHBOARD*.md`) are not in current canon; current PMD canon is `knowledge/LEARNED_PMD.md`, `knowledge/PMD_RUNBOOK.md`, `knowledge/LEARNED_PMD_VALUATION_INTEGRATION.md`.
**Version:** v3.1 (refined 2026-07-20 to reflect current project state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (verified against live PM2 pmd-web:7575 / pmd-api:7576)
---
id: PROJ-2026-06_property-management-dashboard
name: Property Management Dashboard
status: active
owner: builder
created: 2026-06-08
tags: [pmd, real-estate, finance, dashboard]
---

# Property Management Dashboard

## One-line summary

Private web app dashboard for managing Marcelo's investment properties: monthly P&L, lease tracking, market value, equity, repairs, mortgages.

## Status

9 phases + 3 audit gates. All Phase 1–9 build work shipped. All 3 audit gates (A after Phase 3, B after Phase 6, C after Phase 9) done per kanban (`t_74190e65`, `t_cda8fff5`, `t_ea091ee4`). Audit-backlog cleanup progressed; BUG/GAP/POLISH cards largely addressed (e.g. market-value provider mismatch, recurring expense edit, missing inline buttons, P&L per-property mortgage line, search on mobile, reposts form errors, documents/notes page, title tag, top-bar month selector). Several follow-up cards remain (`t_5ae858d9` archived, `t_3acc7c08` P&L trend vacant-months treatment).

> **Verified 2026-07-20:** `pmd-web` online via PM2 (uptime 5D, pid 810, port 7575); `pmd-api` online via PM2 (uptime 4D, pid 62292, port 7576). API `/health` returns 200. Live URL: `http://localhost:7575/portfolio`.

## Scope

**In scope:** portfolio overview, property detail, lease tracking, market value, equity, monthly P&L, repairs, mortgages, notes.

**Out of scope:** acquisition pipeline, Airbnb underwriting, heavy automation, complex accounting, CRM-style tenant management.

## Key dates

- Kickoff: 2026-06-08
- Build complete: 2026-06-11
- Audit backlog: 2026-06-12 (in progress)

## Links

- Kanban epic: `t_9ed2a0e6`
- Blueprint: `~/.hermes/knowledge/PROPERTYMANAGEMENTDASHBOARDBLUEPRINT.md`
- Data model: `~/.hermes/knowledge/PROPERTYMANAGEMENTDASHBOARDDATAMODEL.md`
- Phase reports: `~/.hermes/knowledge/PROPERTYMANAGEMENTDASHBOARDPHASEREPORTS.md`
- Live: `http://localhost:7575/portfolio` (PMD process `pmd-web` under PM2)
- Live (Tailnet HTTPS): `https://bigdawgs-mac--studio.tailed3212.ts.net/pmd/` (via Tailscale Funnel `/pmd` → 7575; the old 'V4 proxy 3535' is history — 3535 was health-os-v4, deleted 2026-09-30)

**Operational state (2026-07-21):** PMD is **STABLE BUT PARTIALLY BLIND (valuation)**. All uptime / data-truthfulness / watchdog surfaces are healthy and verified (Step-5 verdict `step5-verdict-pmd-restore-20260716.json` PASS). MV / rent-comp cells currently render "Unavailable" because no live provider integration is wired yet.

**Valuation integration (in flight, 2026-07-21):**
- Plan: `t_pmd_valuation_integration_20260721` (done) + execution: `t_pmd_valuation_integration_execution_20260721` (running).
- Provider: ATTOM primary (Marcelo-approved 2026-07-21). Zillow dropped. HouseCanary reserved for fallback quote.
- Real ATTOM v4 client: `server/providers/attom.js` (replaces StubATTOM — see delegation summary).
- Fallback order: `provider_order = ["ATTOM"]` in settings; default in `server/providers/fallback.js` updated.
- 17th St + Midway Chase mortgages inserted (canonical terms per Marcelo approval, 2026-07-21).
- Daily refresh cron: `20d51fba150d` (6 AM PDT, deliver local, ATTOM primary).
- **Blocked on:** ATTOM dev API key (single required-input; not a BossMan action).

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Field | Before | After |
|---|---|---|
| Version | v3.0 | v3.1 (refined 2026-07-20) |
| Date | 2026-06-16 | 2026-07-20 |
| Status | Canonical — v3-aligned | Canonical — v3-aligned (verified against live PM2 pmd-web:7575 / pmd-api:7576) |
| Status claim | "8 phases + 3 audit gates. All Phase 1-9 build work shipped. Currently in audit-backlog cleanup (10/16 cards done)." | "8 phases + 3 audit gates. All Phase 1–9 build work shipped. All 3 audit gates (A, B, C) done. Audit-backlog cleanup progressed; BUG/GAP/POLISH cards largely addressed." |
| Live verification | (absent) | Added: `pmd-web` (5D uptime, pid 810, port 7575) + `pmd-api` (4D uptime, pid 62292, port 7576) online; API `/health` returns 200 |

**Refined by:** BossMan Hermes subagent (projects-mission-control v3.1 mirror sweep)
**Verification:** `pm2 show pmd-web`, `pm2 show pmd-api`, `pm2 env 4`, `pm2 env 5`, `curl :7576/health`, kanban.db sweep for PMD epic + phase cards
**Follow-ups:** `t_5ae858d9` (archived test card) and `t_3acc7c08` (P&L trend vacant-months) remain open.
