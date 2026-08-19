# Services Map — Updated 2026-08-17 (SquarePayouts RECOVERY)

> Refreshed by BossMan autonomous health check (2026-08-17).
> Previous version: 2026-06-23 (55 days stale — fixed).
> Source of truth: `pm2 jlist`, `launchctl list`, `hermes cron list` at 2026-08-17T13:55 PT.

## Hardware Context
- **Primary host:** Mac mini (Apple Silicon, M-series)
- **Prior host:** Intel Mac mini — archived; Ollama Tier 2 workaround no longer applies

## PM2 Managed Services (8 live + 1 pending-restart)

| PM2 Name | Port | Service | Status | Notes |
|----------|------|---------|--------|-------|
| money-pipeline | 8020 | MoneyPipeline | ✅ online | Stable, revenue app |
| pmd-web | 7575 | PMD (Property Mgmt) | ✅ online | basePath `/portfolio` (Caddy reverse proxy) |
| pmd-api | 7576 | PMD API | ✅ online | Health endpoint at `/health` |
| binance-bot | 8104 | Binance Bot | ✅ online | PAPER_MODE=false, INTEL_GATE_ENABLED=true |
| health-os-v3 | 3020 | HealthOS V3 | ✅ online | SoCal health app |
| health-os-v4 | 3010 | HealthOS V4 | ✅ online | SoCal health app |
| budgeting-software | 5050 | Budgeting | ✅ online | Personal finance |
| travel-os | 3535 | Travel OS | ✅ online | SoCal travel app |
| **squarepayouts** | **8030** | **SquarePayouts** | ⏸️ **OFFLINE — restart pending Marcelo approval (V3 carve-out)** | **ACTIVE — revenue project. Was incorrectly removed from whitelist 2026-07-22 in a drift-fix; restored 2026-08-17.** See `LEARNED_SQUAREPAYOUTS_ACTIVE.md` + `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md`. |

### ⛔ CRITICAL — SquarePayouts Recovery Status

**SquarePayouts (Opp-65) is ACTIVE revenue, NOT retired.**

- Repo: `/Users/bigdawg/Projects/squarepayouts/` (canonical)
- GitHub: `https://github.com/BIGDAWG35/squarepayouts` (private)
- New ecosystem config: `~/Projects/squarepayouts/ecosystem.config.js` (replaces tombstone `ecosystem.config.js.RETIRED-2026-07-27` — kept as audit evidence)
- Cloudflare tunnel UUID: `ba7cb2bf-0193-425a-92a8-2d85544609e3` — pending restart
- Public URL pattern: `https://[new-trycloudflare-url].trycloudflare.com`
- Basecamp project: `47218024` (org 6162349)
- Active cron: `0561fcffeba1` "SquaresPayouts Daily Exporter" — KEEP

**Marcelo action required:** `pm2 start ecosystem.config.js` (V3 carve-out: new PM2 process + tunnel restart = public-internet exposure). Once approved, the canonical `squarepayouts` and `cloudflare-tunnel` PM2 entries will be live.

### Pending review — DO NOT AUTO-ARCHIVE

The 2026-07-22 PM2 drift-fix removed these services from `CRITICAL_SERVICES` based on absence alone. Per `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md`, each must pass the 7-point archive check before any retirement classification:

- ~~`bakery`~~ (3001) — code at `/Users/bigdawg/Projects/bakery` — pending review
- ~~`client-hub`~~ — pending review
- ~~`trading-control`~~ (8130) — pending review
- ~~`youtube-dashboard`~~ (8140) — pending review
- ~~`csdawg-dashboard`~~ — pending review
- ~~`dominoes-server`~~ (3000) — pending review
- ~~`boss-hub-internal`~~ (8160) — pending review
- ~~`boss-hub-external`~~ (8161) — pending review

**Default action for ALL of these:** surface to Marcelo for explicit archive/relaunch decision; do NOT auto-archive.

## Docker Desktop
- SearXNG (search) + Valkey cache: ✅ running (per prior snapshots, unchanged)

## LaunchAgent Managed Services

| Label | Port | Service | Status | Class |
|-------|------|---------|--------|-------|
| ai.hermes.gateway-health | — | Gateway Health Monitor | ✅ running | **KEEP** |
| com.local.mission-control | — | Mission Control | ✅ running | **KEEP** |
| com.local.tailscale-funnel-travel-os | — | Tailscale Funnel | ✅ running | **KEEP** — Travel OS external |
| com.local.quickstats | 8102 | QuickStats (Ops Briefing) | ✅ running | **KEEP** |
| com.local.teamstandup | 8003 | Team Standup Bot | ✅ running | **NEEDS DECISION** — Marcelo to decide |
| ai.openclaw.gateway | — | OpenClaw Gateway | 🚫 disabled | **KEEP-DISABLED** |
| ai.hermes.gateway | — | Hermes Gateway core | exit -9 (not running) | **KEEP-DISABLED** |

## Hermes Cron Jobs (29 active)

| Job | Schedule | Last Run | Status | Class |
|-----|----------|----------|--------|-------|
| **SquaresPayouts Daily Exporter** | **`0 9 * * *`** | 2026-08-17 | **ok** | **KEEP** — definitive evidence project is ACTIVE |
| PM2 Health Monitor | `*/15 * * * *` | 2026-08-17 | ok | KEEP (silent-when-healthy) |
| Hermes Weekly Systems Review | `0 8 * * 1` | 2026-08-17 | ok | KEEP |
| CSDAWG 2.0 Weekly Intelligence | `0 15 * * 1` | 2026-08-17 | ok | KEEP |
| MoneyPipeline Morning Research | `0 5 * * *` | 2026-08-17 | ok | KEEP |
| MoneyPipeline Auto-Enrich V2 | `0 6 * * *` | 2026-08-17 | ok | KEEP |
| Travel OS External Watchdog | `*/15 * * * *` | 2026-08-17 | ok | KEEP |
| Travel OS Handoff Sync | `0 10 * * 1` | 2026-08-17 | ok | KEEP |
| CuaDriver Health Monitor | `*/10 * * * *` | 2026-08-17 | ok | KEEP |
| Client Hub Feedback Queue | `*/10 * * * *` | 2026-08-17 | ok | KEEP |
| Hermes Weekly MEMORY Health Check | `5 9 * * 1` | 2026-08-17 | ok | KEEP |
| Obsidian Vault Monthly Audit | `0 9 1 * *` | 2026-08-01 | ok | KEEP |
| Obsidian Vault Bi-Monthly Review | `0 10 1 */2 *` | (even months) | — | KEEP |
| Security & PM2 Watch | `30 23 1 * *` | 2026-08-01 | ok | KEEP |
| ... (15 more — full list via `hermes cron list`) |

## Files
- Verification script: `~/.hermes/scripts/gateway-health-check.sh`
- PM2 home: `~/.pm2/`
- Hermes scripts: `~/.hermes/scripts/`
- PHASEREPORT.md: `~/Projects/BossMan/docs/PHASEREPORT.md`

## Recovery Actions Log (2026-08-17)
- ✅ Updated `pm2-health-monitor.sh` whitelist — `squarepayouts` re-included
- ✅ Updated `pm2-health-check` skill SKILL.md — whitelist restored
- ✅ Wrote new canonical `ecosystem.config.js` (Next.js `npm run start`)
- ✅ Updated Mission Control `Opp-65 — SquarePayouts Status` to v3.2
- ✅ Wrote `LEARNED_SQUAREPAYOUTS_ACTIVE.md` and `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md`
- ✅ Created Obsidian note at `~/Documents/Obsidian Vault/SquarePayouts/`
- ⏸️ Awaiting Marcelo `pm2 start` approval
