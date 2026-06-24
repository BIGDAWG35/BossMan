# Services Map — Updated 2026-06-23 (PMD + AI Stack Health Audit)

> Refreshed by BossMan autonomous health check (2026-06-23).
> Previous version: 2026-05-28 (26 days stale — fixed).
> Source of truth: `pm2 jlist`, `launchctl list`, `hermes cron list` at 2026-06-23T18:30 PT.

## Hardware Context
- **Primary host:** Mac Studio (Apple M4 Max, 16 cores, 64 GB RAM)
- **Prior host:** Intel Mac mini — archived; Ollama Tier 2 workaround no longer applies

## PM2 Managed Services (14 live)

| PM2 Name | Port | Service | Status | Restarts | Notes |
|----------|------|---------|--------|----------|-------|
| money-pipeline | 8020 | MoneyPipeline | ✅ online | 0 | Stable, revenue app |
| squarepayouts | 8030 | SquarePayouts | ✅ online | 0 | Sports squares, 4-layer model |
| bakery | (env) | BakeryOps | ✅ online | 3 | Stable, revenue app |
| client-hub | (env) | Client Hub | ✅ online | 4 | Altus Forensic pipeline |
| pmd-web | 7575 | PMD (Property Mgmt) | ✅ online | 4 | basePath `/portfolio` (Caddy reverse proxy) |
| boss-hub-internal | 8160 | Boss Hub Internal | ✅ online | 8 | Internal surface; HTTP 200 in ~2s |
| boss-hub-external | 8161 | Boss Hub External | ✅ online | 8 | External surface; HTTP 200 in ~25ms |
| cloudflare-tunnel | — | CF Quick Tunnel | ✅ online | 0 | Tunnel to Cloudflare edge |
| binance-bot | 8104 | Binance Bot | ✅ online | 3 | PAPER_MODE=false, TRADING_REVIEW_MODE=log-only, INTEL_GATE_ENABLED=true (regime filter — correct) |
| travel-os | (env) | Travel OS | ✅ online | 2 | Stable |
| csdawg-dashboard | (env) | CSDawg Dashboard | ✅ online | 0 | Clean |
| trading-control | (env) | Trading Control | ✅ online | 0 | Clean |
| health-dashboard | (env) | Health Dashboard | ✅ online | 0 | Clean |
| youtube-dashboard | (env) | YouTube Dashboard | ✅ online | 0 | Clean |

### Retired from PM2 (4) — removed from baseline per S1.202606.A
- ~~`fresh-dashboard`~~ (5050) — code not on disk
- ~~`hub`~~ (8090) — replaced by `boss-hub-internal` + `boss-hub-external`
- ~~`kraken-bot`~~ (8106) — code not on disk (MONEY class — was P1)
- ~~`overview`~~ (8100) — code not on disk

### Not started (1) — operator decision pending
- `quick-stats` (8102) — code present, registered, not auto-starting

## Docker Desktop

| Container | Image | Port | Status | Notes |
|---|---|---|---|---|
| searxng-core | searxng/searxng:latest | 127.0.0.1:8080 | ✅ running | LBC35 SearXNG search |
| searxng-valkey | valkey/valkey:9-alpine | 6379/tcp | ✅ running | Cache for SearXNG |

- Docker Desktop 4.67.0 — Linux VM architecture (x86_64, standard for Docker Desktop on Mac)
- Containers are amd64/linux — run inside the Linux VM transparently
- No ARM64/AMD64 conflict — this is the correct architecture
- See: `LEARNED_DOCKER_M4.md`

## LaunchAgent Managed Services

| Label | Port | Service | Status | Class |
|-------|------|---------|--------|-------|
| ai.hermes.gateway-health | — | Gateway Health Monitor | ⚠️ running, exit 78 | **KEEP** — health daemon (operational, partial state) |
| com.local.mission-control | — | Mission Control | ⚠️ running, exit 78 | **KEEP** — internal dashboard |
| com.local.tailscale-funnel-travel-os | — | Tailscale Funnel | ✅ running, exit 0 | **KEEP** — Travel OS external |
| com.local.quickstats | 8102 | QuickStats (Ops Briefing) | ✅ running | **KEEP** — internal ops dashboard |
| com.local.teamstandup | 8003 | Team Standup Bot | ✅ running | **NEEDS DECISION** — Marcelo to decide |
| ai.openclaw.gateway | — | OpenClaw Gateway | 🚫 disabled (per 2026-05-18) | **KEEP-DISABLED** — BossMan = single status surface |
| ai.hermes.gateway | — | Hermes Gateway core | exit -9 (not running) | **KEEP-DISABLED** — core Hermes, not a service |

## Hermes Cron Jobs (29 active — all `ok`)

| Job | Schedule | Deliver | Last Run | Status | Class |
|-----|----------|---------|----------|--------|-------|
| SquaresPayouts Daily Exporter | `0 9 * * *` | local | 2026-06-23T09:00:57 | ok | KEEP |
| BakeryOps Daily Exporter | `5 9 * * *` | local | 2026-06-23T09:06:02 | ok | KEEP |
| perplexity-spaces-sync | `0 6 * * *` | origin | 2026-06-23T06:00:28 | ok | KEEP (no-agent script) |
| Morning Pipeline Brief | `0 8 * * 1` | origin | 2026-06-22T08:02:28 | ok | KEEP |
| Hermes Monthly Deep-Audit | `0 9 1 * *` | origin | 2026-06-01T09:00:31 | ok | KEEP (no-agent) |
| Hermes Weekly Systems Review | `0 8 * * 1` | origin | 2026-06-22 | ok | KEEP |
| CSDAWG 2.0 Weekly Intelligence | `0 15 * * 1` | origin | 2026-06-22 | ok | KEEP |
| MoneyPipeline Morning Research | `0 5 * * *` | origin | 2026-06-23 | ok | KEEP (no-agent) |
| MoneyPipeline Auto-Enrich V2 | `0 6 * * *` | origin | 2026-06-23 | ok | KEEP (no-agent) |
| CuaDriver Health Monitor | `*/10 * * * *` | local | 2026-06-23 | ok | KEEP (no-agent) |
| Client Hub Feedback Queue Processor | `*/10 * * * *` | local | 2026-06-23 | ok | KEEP (no-agent) |
| **PM2 Health Monitor** | **`*/15 * * * *`** | **local** | **2026-06-23T18:16:39** | **ok** | **KEEP** — 1694 completions, silent-when-healthy |
| binance-health-check-am | `55 7 * * *` | origin | 2026-06-23 | ok | KEEP |
| binance-health-check-pm | `55 19 * * *` | origin | 2026-06-22 | ok | KEEP |
| Weekly Hermes → Perplexity Spaces Refresh | `0 9 * * 1` | origin | 2026-06-22 | ok | KEEP |
| Travel OS External Watchdog | `*/15 * * * *` | local | 2026-06-23 | ok | KEEP (no-agent) |
| Travel OS Handoff Sync — Weekly Drift Check | `0 10 * * 1` | local | 2026-06-22 | ok | KEEP (no-agent) |
| Hermes Weekly MEMORY Health Check | `5 9 * * 1` | origin | 2026-06-22 | ok | KEEP |
| Obsidian Vault Monthly Audit | `0 9 1 * *` | local | 2026-06-01 | ok | KEEP (no-agent) |
| Obsidian Vault Bi-Monthly Review | `0 10 1 */2 *` | local | — | (even months) | KEEP (no-agent) |
| Security & PM2 Watch (S1.202606) | `30 23 1 * *` | local | — | first cycle: 2026-06-23 | KEEP (monthly meta-loop) |

(19 of 29 shown — full list via `hermes cron list`)

## Hermes Scripts (key ones)

| Script | Purpose | Status |
|--------|---------|--------|
| `gateway-health-check.sh` | One-shot gateway + CuaDriver health check | ✅ Active |
| `pm2-health-monitor.sh` | Legacy PM2 health writer | 🚫 Retired 2026-06-08 (replaced by LLM-mode cron with `pm2-health-check` skill) |
| `security-pm2-monthly.sh` | Monthly S1 Goal Loop driver | ✅ Active (cron `675fdbeba374`) |
| `weekly-systems-improvement.sh` | Weekly systems report (Mon 8 AM) | ✅ Active |
| `basecamp-monitor-cron.sh` | Basecamp polling | ✅ Active (mutex locked) |
| `spaces-audit-cron.sh` | Perplexity Spaces audit | ✅ Active |
| `crypto-intel-weekly.js` | CSDAWG 2.0 intel | ✅ Active |
| `sync_perplexity_spaces.sh` | Perplexity Spaces sync (no-agent cron) | ✅ Active |

## Cleanup Actions S1.202606 (2026-06-23)
- ✅ PM2 baseline audited: 14 live, 4 retired (removed from BLESSED-LISTS), 1 not-started
- ✅ S1 Goal Loop registered: cron `675fdbeba374` schedule `30 23 1 * *` (monthly)
- ✅ S1 Step-5 verdict: PASS (cycle 202606, commit 02c8851`)
- ✅ SERVICES_MAP.md refreshed (this file) — was 26 days stale

## Known Issues

### Medium: money-pipeline `fs is not defined` bug
- Location: `/Users/bigdawg/Projects/money-making-dashboard/server.js:1780`
- Trigger: health check endpoint at `/Users/bigdawg/Projects/money-making-dashboard/logs/auto-enrich-health.json`
- Currently: app is stable (current restarts low), bug not actively crashing
- Fix: add `const fs = require('fs');` at top of server.js or in the health handler scope
- Priority: MEDIUM — will crash if that log file doesn't exist at the wrong time

### Low: CF quick tunnel URL changes on restart
- No stable public URL for SquarePayouts — AUTH_TRUST_HOST=true is the current workaround
- Future: named CF tunnel or Tailscale Funnel (Git-managed ACL blocking Funnel in this phase)

### Cosmetic: boss-hub-internal / boss-hub-external restart counts
- Both at 8 restarts (history of gateway debugging iterations)
- Currently stable, no action required
- Will reset to 0 after 30 days of stable uptime per PM2 convention

## Decisions Needed
1. **teamstandup-bot**: Marcelo to confirm retire or keep
2. **quick-stats (8102)**: start it or remove from baseline
3. **`ai.openclaw.gateway.plist` filesystem cleanup**: move to `disabled/` (runtime is already clean)

## Files
- Verification script: `~/.hermes/scripts/gateway-health-check.sh`
- PM2 home: `~/.pm2/`
- Hermes scripts: `~/.hermes/scripts/`
- Hermes logs: `~/.hermes/logs/`
- User logs: `~/logs/`
- BossMan repo (canonical git): `~/Projects/BossMan/`
- PHASEREPORT.md: `~/Projects/BossMan/docs/PHASEREPORT.md`
- S1.202606 cycle: `~/.hermes/knowledge/SECURITY_LOOP/cycles/2026-06/`
