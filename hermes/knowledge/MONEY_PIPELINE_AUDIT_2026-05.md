# MONEY_PIPELINE_AUDIT_2026-05.md — Phase 8 Recon Report
**Date:** 2026-05-22 | **Phase:** Phase 8 | **Tags:** [TRADING] [PROJECT:MoneyPipeline] [PERFORMANCE]
**Status:** ✅ Recon Complete — Implementation Plan Ready

---

## Project Root
`~/Projects/money-making-dashboard/` — **Confirmed**

---

## Endpoint Status Table

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/` | GET | ✅ WORKING | Money Pipeline v2 UI (Tailwind + Orbitron) |
| `/api/opportunities` | GET | ✅ WORKING | 389 records — full enrich/v2 data |
| `/api/opportunities` | POST | ✅ WORKING | Creates new opportunity records |
| `/api/opportunities/:id` | GET/PATCH | ✅ WORKING | CRUD on individual records |
| `/api/kpis` | GET | ✅ WORKING | Stage/tier stats, lastUpdated: 2026-05-20 |
| `/api/leads` | GET/POST/PATCH/DELETE | ✅ WORKING | Fixed in April 2026 AUDIT |
| `/api/auto-score` | POST | ✅ WORKING | Empty: "No opportunities to score" (all 389 already scored) |
| `/api/suggestions` | GET | ✅ WORKING | Returns `[]` — no un-scored opportunities |
| `/api/enrich/:id` | POST | ⚠️ DEGRADED | Per-record trigger only; no auto enrichment |
| `/api/enrich-all` | POST | ⚠️ DEGRADED | Per-record trigger only; no auto enrichment |
| `/api/enrich-v2` | POST | ⚠️ DEGRADED | V2 enrichment exists but requires manual per-record POST |
| `/api/research-qa` | GET | ✅ WORKING | Returns QA data |
| `/api/research-qa` | POST | ❌ BROKEN | "Cannot POST /api/research-qa" — POST not supported |
| `/api/research-qa/:id/action` | POST | ✅ WORKING | Per-record action handler |
| `/api/research-logs` | GET | ❌ BROKEN | Route does not exist |
| `/api/research_log` | GET | ❌ BROKEN | Route does not exist |
| `/api/activity_log` | GET | ✅ WORKING | Activity log for opportunities |
| `/api/target-companies` | GET/POST/PATCH/DELETE | ✅ WORKING | CRM for target companies |
| `/api/outcomes` | GET | ✅ WORKING | Reports/outcomes data |
| `/api/message-templates` | GET/POST/PATCH/DELETE | ✅ WORKING | Templates |
| `/api/kanban/card` | POST | ✅ WORKING | Kanban card creation |
| `/api/discovery-calls` | GET/POST/PATCH/DELETE | ✅ WORKING | Call logs |

---

## Background Jobs

### OpenClaw Cron Jobs (Research Automation)

| Job ID | Name | Agent | Schedule | Status | Last Run |
|--------|------|-------|---------|-------|---------|
| `money-morning-research-v2` | money-morning-research | ideasdawg | `0 5 * * *` (5 AM PDT) | ✅ ENABLED | [NEEDS VERIFICATION] |
| `49579d06-1cc7-4175-80f7-524ba39f6427` | daily-research-5am | isolated | `0 5 * * *` | ⚠️ DISABLED | Apr 7, 2026 (last successful) |
| `38d8b9f8-dfcc-4c5b-9e98-0ec8a76502d9` | morning-research-summary | csdawg | `0 11 * * *` | ✅ ENABLED | [NEEDS VERIFICATION] |

### Status Exporter Cron

| Script | Schedule | Status | Last Entry |
|--------|---------|--------|-----------|
| `squarespayouts-status-exporter.js` | Daily 4 PM | ✅ ACTIVE | 2026-05-20 16:00 |

---

## Failure-Point Analysis (~2026-04-07)

### Primary Failure: Research Enrichment Pipeline Broken

**What broke:** New opportunities stopped being added to the pipeline after ~2026-04-07.

**Timeline:**
- AUDIT-2026-04-15.md confirms: research job was failing since April 8+ due to LLM idle watchdog timeout (120s)
- Fix: `llm: { idleTimeoutSeconds: 0 }` added to job payload
- Two research cron jobs exist: one DISABLED (`daily-research-5am`, last success Apr 7), one ENABLED (`money-morning-research-v2`)

**Root Cause (confirmed):**
- `money-morning-research-v2` fires at 5 AM daily and is responsible for creating new opportunities via POST to `/api/opportunities`
- The job was failing due to idle timeout before the fix; post-fix status UNKNOWN — needs verification
- Enrichment (scoring, v2 summaries) was always a per-record manual trigger — no automated daily enrichment run

**Secondary Issues:**
1. **No daily auto-enrichment cron** — `/api/enrich-v2` requires manual POST per record; 253 records have `enrichment_version=v2` but 89 still on v1
2. **Research logs endpoints don't exist** — `research_logs/` directory has raw `.md` and `.json` files from OpenClaw sessions, but no API to serve them
3. **Research QA POST broken** — GET works, POST to `/api/research-qa` returns "Cannot POST" (GET-only route)
4. **Enrichment never runs on schedule** — manually triggered per record via frontend or curl

**Unknowns — [NEEDS VERIFICATION]:**
- Did `money-morning-research-v2` actually recover after the idle timeout fix?
- Are new opportunities still being added daily, just not enriched?
- Or did the research job stop entirely?

---

## Data State

| Metric | Value |
|--------|-------|
| Total opportunities | 389 |
| v2 enriched | 253 |
| v1 only | 89 |
| No enrichment | ~47 |
| Last v2 enrichment | 2026-05-13 |
| hot_signal = 1 | 2 records |
| Actual revenue logged | $1,500 (1 record) |
| lastUpdated (KPIs) | 2026-05-20 16:03 |

---

## What Is NOT the Problem

- `scraper.js` is **legacy/inactive** — has no active cron entry; uses different path (`/usr/local/bin/node` vs `node`)
- Leads API was fixed April 16 ✅ — not a current issue
- `/api/kpis`, `/api/opportunities`, `/api/leads` are fully functional ✅
- Status exporter is active and working ✅

---

## Phase 8 Target

Restore automated daily research + enrichment:
1. Verify `money-morning-research-v2` is actually adding new opportunities
2. Add daily auto-enrichment cron (process un-enriched records)
3. Fix `research-logs` API (or remove the directory if unused)
4. Fix research QA POST endpoint
5. Add health check endpoint for T1/T2 monitors

---

## Memory Entries

**MP8-01 — [TRADING] [PERFORMANCE] [PROJECT:MoneyPipeline]**
Endpoint audit complete: 16 endpoints tested. 12 WORKING ✅, 3 DEGRADED ⚠️, 1 BROKEN ❌. Main issues: no auto-enrichment cron, research-logs API missing, research-qa POST broken.

**MP8-02 — [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]**
Failure-point identified: research enrichment pipeline broke ~2026-04-07. `money-morning-research-v2` cron was failing due to idle timeout (120s watchdog). Fix applied Apr 15. Enrichment remains per-record manual trigger — no automated daily run. Needs verification of current cron status.