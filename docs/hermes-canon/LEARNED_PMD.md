# LEARNED_PMD.md — PMD (Property Management Dashboard) Canon

**Source:** Project: `/Users/bigdawg/Projects/property-management-dashboard/`
**Status:** Permanent (refreshed 2026-07-22, Card t_pmd_properties_table_v1_20260722)

---

## Overview

PMD is a Next.js 16.2.6 + React 19.2.3 web app for managing a real estate property portfolio. It exposes a Tailscale-routed UI at `/pmd/*` and an API at `/pmd/api/*`. The data layer is a local SQLite DB at `/Users/bigdawg/Projects/property-management-dashboard/data/pmd.db`.

PMD is **NOT the same as**:
- **PMD-web** (port 7575, the Next.js frontend) — covered below
- **PMD-api** (port 7576, server-only Node.js modules — no HTTP listener, just a process that PM2 keeps alive)
- **PMD Watchdog** (`pmd-watchdog.sh` — every 5 min) — checks the local port and Tailnet Funnel URL
- **PMD Valuation** (separate kanban system) — see LEARNED_PMD_VALUATION_INTEGRATION.md
- **PMD Dashboards** (analytics dashboards) — see LEARNED_PMD_DASHBOARDS.md

---

## Architecture (Permanent)

### Service layout

| Process | PM2 name | Port | Stack |
|---|---|---|---|
| Web frontend | `pmd-web` | 7575 | Next.js 16.2.6 (App Router), React 19.2.3 |
| Server modules | `pmd-api` | 7576 | Node.js 22, server-only modules, no HTTP listener |

**Why two PM2 processes?** The web app reads from server-only modules that import `node:sqlite` (cannot be bundled for browser). The web process (7575) handles HTTP; the api process (7576) keeps the data layer warm. **If `pmd-web` is online, `pmd-api` is implicitly healthy.**

### basePath (Permanent — changed 2026-07-15)

The app uses Next.js `basePath: /pmd` to run behind a Tailscale subpath (`https://bigdawgs-mac--studio.tailed3212.ts.net/pmd`). The change history:
- 2026-06-15: original `basePath: /portfolio`
- 2026-07-15: changed to `basePath: /pmd` (because `/portfolio` is owned by V3 / health-os-v3 and would collide)

This means:
- All routes are accessed at `/pmd/*` (e.g., `/pmd/api/properties`)
- Root `/` returns 404 (expected — no route at root)
- `/portfolio` returns 404 (deprecated basePath)

### Production URLs (Tailscale)

| URL | Purpose | Health check |
|---|---|---|
| `http://localhost:7575/pmd` | Local dev/QA | `curl -sS -o /dev/null -w '%{http_code}' http://localhost:7575/pmd` → 200 |
| `https://bigdawgs-mac--studio.tailed3212.ts.net/pmd` | Tailnet Funnel (operator access) | `curl -k -sS -o /dev/null -w '%{http_code}' https://bigdawgs-mac--studio.tailed3212.ts.net/pmd` → 308 redirect |
| `http://localhost:7575/pmd/api/properties` | **Canonical health route** | Returns 200 with real property data (JSON array) |

---

## Build + start (Permanent)

**Source directory:** `/Users/bigdawg/Projects/property-management-dashboard/web/`
**Ecosystem config:** `/Users/bigdawg/Projects/property-management-dashboard/ecosystem.config.cjs`
**PM2 interpreter:** `/Users/bigdawg/.hermes/node/bin/node` (Hermes-arm64, native binding compat)

```bash
# Stop (via wrapper, safe for stop)
~/.hermes/scripts/pm2-hermes.sh stop pmd-web

# Clean build artifacts (D7 stale build pitfall)
cd /Users/bigdawg/Projects/property-management-dashboard/web
rm -rf .next

# Rebuild (D7-SUB pitfall: must build from web/ NOT ~ or /Users/bigdawg/)
npm run build

# Start (via wrapper, safe for start)
cd /Users/bigdawg/Projects/property-management-dashboard
~/.hermes/scripts/pm2-hermes.sh start ecosystem.config.cjs --only pmd-web

# Verify
sleep 5
curl -sS -o /dev/null -w 'LOCAL:%{http_code}\n' http://localhost:7575/pmd/api/properties
# Expected: 200
```

**Critical:** Always `cd` to `web/` before `npm run build` (D7-SUB pitfall — building from the wrong directory produces stale prerender output that works locally but fails via Tailscale).

---

## Health expectations

| Probe | Expected | Why |
|---|---|---|
| `pm2 desc pmd-web` status | `online` | PM2 process state |
| `lsof -i :7575 -P -n` | node process LISTEN on `*:7575` | Port binding |
| `curl http://localhost:7575/pmd/api/properties` | `200` + JSON with property data | Canonical health route |
| `curl http://localhost:7575/pmd` | `200` (or `307`/`308` redirect) | BasePath landing |
| `curl http://localhost:7575/` | `404` (expected, NOT a failure) | No route at root |
| `curl http://localhost:7575/portfolio` | `404` (expected, NOT a failure) | Deprecated basePath |
| `~/.hermes/logs/pmd-web-err.log` | No new errors | Error log clean |

**`unstable_restarts: 0`** + **`uptime > 1d`** = healthy regardless of cumulative `restart_time` (dev-mode hot-reload noise, not a current issue).

---

## Files + paths

| Path | Purpose |
|---|---|
| `/Users/bigdawg/Projects/property-management-dashboard/` | Project root |
| `/Users/bigdawg/Projects/property-management-dashboard/web/` | Next.js app (build from here) |
| `/Users/bigdawg/Projects/property-management-dashboard/server/` | Server-only Node.js modules (sqlite, integrations) |
| `/Users/bigdawg/Projects/property-management-dashboard/ecosystem.config.cjs` | PM2 ecosystem config (pmd-web + pmd-api) |
| `/Users/bigdawg/Projects/property-management-dashboard/data/pmd.db` | SQLite DB (referenced by `PMD_DB_PATH` env) |
| `~/.hermes/logs/pmd-web-out.log` | PM2 stdout (info-level) |
| `~/.hermes/logs/pmd-web-err.log` | PM2 stderr (errors) |
| `~/.hermes/logs/pmd-health-watchdog.log` | Watchdog log |
| `~/.hermes/logs/pmd-restart.log` | Restart history (last 100 entries) |
| `~/.hermes/logs/pmd-telegram-failures.log` | Telegram alert history |

---

## Pages + routes (updated 2026-07-22, Card t_pmd_properties_table_filters_v1_20260722)

| Route | Page | Data source | Notes |
|---|---|---|---|
| `/pmd/` | Portfolio (dashboard home) | server-side data layer | Original landing page |
| `/pmd/properties` | Properties table (read-only v1.1) | server: `properties.listAll()` via `@/lib/data`; client: `PropertiesTable` component handles all sort/filter state | Card t_pmd_properties_table_v1_20260722 + v1.1 |
| `/pmd/p/:id` | Property detail | `properties.listAll()` | Per-property view |
| `/pmd/renewals`, `/pmd/pnl`, `/pmd/repairs`, `/pmd/mortgages`, `/pmd/market-value`, `/pmd/documents`, `/pmd/settings` | Other nav pages | various | Pre-existing |

### Properties page architecture (v1.1 — Card t_pmd_properties_table_filters_v1_20260722)

| Component | File | Role |
|---|---|---|
| Server page | `web/app/(app)/properties/page.tsx` | Fetches initial rows via `properties.listAll().map(properties.toApi)`, passes to `PropertiesTable` |
| Client component | `web/components/PropertiesTable.tsx` | `'use client'` — owns ALL UI state: sorting, filtering, refresh. No new API endpoints. |
| Filter dropdown | `web/components/PropertyFilter.tsx` | Per-property filter used on other pages (not on the properties list page) |

**Pattern:** Server fetches → client owns state. `PropertiesTable` uses `/api/properties` for client-side refresh only (not for initial render). Loading state via `loading.tsx` → `SkeletonPage`.

### Sorting (v1.1 — client-side only)

| Column | Sort key | Default direction | Toggle behavior |
|---|---|---|---|
| Name | `nickname` | Ascending (A→Z) | Click to sort; repeats toggle asc/desc |
| City | `city` | Ascending (A→Z) | Click to sort; repeats toggle asc/desc |
| Next Due Date | `updatedAt` | Descending (newest first) | Click to sort; repeats toggle asc/desc |

Active sort column shows `↑` (ascending) or `↓` (descending) indicator. Inactive columns show `↕`.

### Filtering (v1.1 — client-side only, combined with AND logic)

| Control | Behavior |
|---|---|
| Search | Substring match on `nickname + address`, case-insensitive |
| City dropdown | Populated from dataset at render time; `__all__` = no city filter |
| Active only | Checkbox — when checked, excludes `isActive === false` rows |
| Reset button | Clears all filters and restores default sort (disabled when no filters active) |

**Responsibilities:**
- **Server (page.tsx):** Fetch initial rows from `@/lib/data`. Zero UI state.
- **Client (PropertiesTable):** Sorting, filtering, refresh, error handling. Pure derivation via `useMemo` — no `useEffect` needed for filter/sort.
- **API (`/api/properties`):** Used only for client-side refresh (Refresh button). Not used for initial render.

### Table columns + status (Card t_pmd_properties_table_v1_20260722)

|| Column | Source | Notes |
||---|---|---|
|| Name | `property.nickname` (link to `/pmd/p/{id}`) | — |
|| Address | `property.address` | Direct |
|| City | `property.city`, `property.state` | "City, ST" |
|| Status | `isActive` + `lease` | Active lease → Occupied (success); active prop, no lease → Vacant (warning); isActive=false → Inactive (neutral) |
|| Rent | `lease.monthlyRent` via `leases.getActiveForProperty()` | "—" if no active lease |
|| Next Due Date | `lease.end_date` + `daysUntil()` | "—" if no active lease; shows (Nd) countdown when ≤90d |

---

## Tools + automation

| Tool | Cadence | Reference |
|---|---|---|
| `pmd-watchdog.sh` | every 5 min | `~/.hermes/scripts/pmd-watchdog.sh` (migrated to `pm2-hermes.sh` wrapper in Card D) |
| `pmd-health-watchdog.sh` | (cron) | `~/.hermes/scripts/pmd-health-watchdog.sh` (migrated to `pm2-hermes.sh` wrapper) |
| `pmd-web-auto-repair.sh` | on-demand (rate-limited) | `~/.hermes/scripts/pmd-web-auto-repair.sh` (new, Card E) |
| `LEARNED_PM2_HEALTH_MONITOR.md` §"pmd-web Auto-Repair Rule" | reference | Auto-repair policy + guardrails |
| `LEARNED_PMD_VALUATION_INTEGRATION.md` | reference | PMD Valuation system integration |
| `LEARNED_PMD_DASHBOARDS.md` | reference | PMD Dashboards (analytics) |

---

## Common issues (logged)

- **2026-07-22:** Probe-path false positive — "all-routes 404" alert was caused by probing root `/` and deprecated `/portfolio`. Both 404s are expected. Fixed by switching canonical probe to `/pmd/api/properties`. See `LEARNED_PM2_HEALTH_MONITOR.md` §"pmd-web Auto-Repair Rule".
- **2026-07-15:** basePath changed from `/portfolio` → `/pmd` (V3 collision). All operator-facing links updated.
- **2026-06-23:** QA-FORENSIC-RECONSTRUCTION incident (see `QA-FORENSIC-RECONSTRUCTION-2026-06-23.md` in project root).

---

---

## PHASEREPORT

- **2026-07-22** — PMD Properties table v1.1 (sorting + filtering) implemented. `PropertiesTable` client component wired to `page.tsx`. Sorting (Nickname/City/UpdatedAt with ↑/↓ indicators) + filtering (text search, city dropdown, active-only toggle, reset) all client-side. Server/client split preserved. `/pmd/properties` returns 200.

**Status:** Permanent (refreshed 2026-07-22, Card t_pmd_web_next_build_and_whitelist_20260722).