# SERVICE_MAP — May 2026 (Updated: 2026-05-22 Phase 6)
**Generated:** 2026-05-22 | **Updated:** 2026-05-22 | **Track:** Deep Audit Phase 5 + Phase 6 | **Tags:** [ARCHITECTURE] [PERFORMANCE]

---

## PM2-Managed Services

| # | Service | Port | PID | Path | Status | Uptime | Restarts | Notes |
|---|---------|------|-----|------|--------|--------|----------|-------|
| 1 | bakery | 3001 | 58601 | `~/Projects/bakery/server/index.js` | ✅ ONLINE | 2D+ | 1 | EADDRINUSE fix May 15 |
| 2 | money-pipeline | 8020 | 81083 | `~/Projects/money-making-dashboard/server.js` | ⚠️ DEGRADED | ~42m | 2 | Research broken ~2026-04-07 |
| 3 | squarepayouts | 8030 | 41862 | `~/Projects/squarepayouts/server.js` | ✅ ONLINE | 9h+ | 0 | Crash loop fixed May 15 |
| 4 | binance-bot | 8104 | 37973 | `~/Projects/binance-bot/server.js` | 🚨 NO_SIGNAL | 44h+ | 6 | SQLITE_ERROR + SyntaxError + RefError |
| 5 | cloudflare-tunnel | — | 78125 | `/usr/local/bin/cloudflared tunnel --url http://localhost:8030` | ✅ ONLINE | 42h+ | 0 | Tunnel to squarepayouts:8030 |
| 6 | team-standup-bot | 8003 | 2781 | `~/Projects/team-standup-bot/server.js` | ✅ ONLINE | <1m | 0 | **Renamed from "node" 2026-05-22** |

---

## Non-PM2 Listening Services

| # | Service | Port | PID | Type | Status | Notes |
|---|---------|------|-----|------|--------|-------|
| 7 | quick-stats | 8102 | 47491 | Node (launchd: `com.local.quickstats`) | ✅ ONLINE | launchd-managed |
| 8 | Hermes dashboard | 9119 | 38075 | Python (hermes-agent venv) | ✅ ONLINE | `hermes dashboard` |
| 9 | SyncSpaces | 8395 | 1656 | syncspace | ✅ ONLINE | macOS sync service |
| 10 | SyncSpaces (TCP) | 22000 | 1656 | syncspace | ✅ ONLINE | SyncSpaces TCP |
| 11 | Docker | 8080 | 1767 | com.docker.docker | ✅ ONLINE | Docker Desktop |
| 12 | UGREEN device | 49225–26 | 1360 | UGREEN | ✅ ONLINE | Local USB device |
| 13 | Tailscale | 49226 | 1362 | application.io.tailscale | ✅ ONLINE | VPN service |

---

## Services Intentionally Offline

| # | Service | Expected Port | Reason | Bring Back? |
|---|---------|---------------|--------|-------------|
| A | overview | 8100 | Never deployed — DEPRECATED | NO |
| B | health (auto-export) | 8110 | Replaced by Hermes self-audit — DEPRECATED | NO |
| C | trading-control | 8130 | Phase 11 scope only | Phase 11 only |
| D | YouTube | 8140 | DEPRECATED — use `youtube-content` skill | NO |
| E | Kraken | 8106 | Phase 10 scope only | Phase 10 only |

Full registry: `OFFLINE_SERVICES.md`

---

## Legacy/Archived Files

| File | Status | Action |
|------|--------|--------|
| `~/Projects/ecosystem-all.js` | ✅ ARCHIVED | `ecosystem-all.js.ARCHIVED` — defined 8 services, none in PM2 |
| `~/Projects/pm2-watchdog.sh` | ✅ RETIRED | `pm2-watchdog.sh.LEGACY` — redundant with BossMan health monitor |

---

## User Crontab — CONFIRMED ACTIVE

| Schedule | Command | Log | Status |
|----------|---------|-----|--------|
| `0 9 * * *` | `squarespayouts-status-exporter.js` | `~/Projects/money-making-dashboard/logs/exporter.log` | ✅ ACTIVE — last entry 2026-05-19 |

This cron exports SquarePayouts opportunity status to Obsidian + GitHub daily. **Not orphaned** — keep.

---

## Unknown Ports — FULLY RESOLVED (Phase 5)

| Port | Was | Now |
|------|-----|-----|
| 8003 | UNKNOWN | ✅ team-standup-bot (PM2 + launchd) |
| 8102 | UNKNOWN | ✅ quick-stats (launchd) |
| 9119 | UNKNOWN | ✅ Hermes dashboard (Python venv) |

---

## PM2 Ecosystem Snapshot

**File:** `~/.pm2/dump.pm2` (last saved: 2026-05-22 post-Phase 6 rename)
**Source of truth:** PM2 is authoritative — `ecosystem-all.js` is archived

**Resurrect restores:** bakery, money-pipeline, squarepayouts, binance-bot, cloudflare-tunnel, team-standup-bot

**Would NOT auto-start via resurrect:**
- quick-stats (launchd `com.local.quickstats`)
- Hermes dashboard (manual)
- SyncSpaces, Docker, Tailscale (OS-level)

---

## Architecture Issues — PHASE 6 RESOLVED

| # | Issue | Status | Action |
|---|-------|--------|--------|
| 1 | PM2 "node" misnamed | ✅ FIXED 2026-05-22 | Renamed to `team-standup-bot` (PM2 id 29) |
| 2 | `ecosystem-all.js` misleading | ✅ FIXED 2026-05-22 | Archived as `.ARCHIVED` |
| 3 | health/trading-control/YouTube/Kraken offline | ✅ DOCUMENTED | Added to OFFLINE_SERVICES.md |
| 4 | `pm2-watchdog.sh` redundant | ✅ FIXED 2026-05-22 | Retired as `.LEGACY` |

---

## Security Surface Notes

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1 | All ports bound to 127.0.0.1 (localhost only) | ✅ SECURE | |
| 2 | cloudflare-tunnel exposes :8030 externally | ⚠️ [NEEDS VERIFICATION] | Verify tunnel requires auth — SC-02 |
| 3 | No hardcoded secrets in PM2 env | ✅ CLEAR | |
| 4 | Docker (8080) bound to 127.0.0.1 | ✅ SECURE | |
| 5 | Tailscale (49225-26) bound to 127.0.0.1 | ✅ SECURE | |

---

## Phase 8 / Phase 10 Readiness

**Money Pipeline (Phase 8):**
- Service: money-pipeline (PM2 id=1) on port 8020
- Current state: API responds, research enrichment pipeline broken since ~2026-04-07
- Phase 8 target: restore research automation, KPI scoring, opportunity pipeline
- PM2 resurrect: will restore on boot ✅

**Binance Bot (Phase 10):**
- Service: binance-bot (PM2 id=3) on port 8104
- Current state: SQLITE_ERROR (current_sl column) + ReferenceError (liveBal TDZ at line 849)
- Phase 10 target: fix DB schema (add current_sl column), fix pre-trade validation hook, restore signal generation
- PM2 resurrect: will restore on boot ✅

---

*Next review: June 2026 deep audit*
*Index: MEMORY_CAPTURE_LOG.md → [ARCHITECTURE]*
*Files: SERVICE_MAP, JOBS_OVERVIEW, OFFLINE_SERVICES (same dir)*