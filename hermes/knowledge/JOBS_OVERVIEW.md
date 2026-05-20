# JOBS_OVERVIEW — May 2026 (Updated: Phase 6)
**Generated:** 2026-05-22 | **Updated:** 2026-05-22 | **Phase:** Phase 5 + Phase 6 | **Tags:** [WORKFLOW] [PERFORMANCE]

---

## Hermes Cron Jobs (via Hermes cron)

| Job ID | Name | Schedule | Status | Deliver |
|--------|------|----------|--------|---------|
| d4f07e0c180f | pm2-health-monitor | every 5 min | ✅ ACTIVE | silent/auto-fix |
| 88eff3953480 | weekly-review-mon-8am | 0 8 * * 1 | ✅ ACTIVE | telegram |

---

## macOS LaunchAgents

| Label | PID | Status | Service | Purpose | Notes |
|-------|-----|--------|---------|---------|-------|
| com.local.quickstats | 47491 | ✅ online | quick-stats | Stats server port 8102 | launchd-managed |
| com.local.mission-control | — | ✅ loaded | mission-control | Port 8001 dashboard | launchd-managed |
| ai.hermes.gateway | 73036 | ✅ online | Hermes gateway | Telegram gateway | launchd-managed |
| com.local.squarepayouts | — | ⚠️ DISABLED | squarepayouts | Port 8030 | DISABLED May 15 — now PM2 |
| com.local.bakery | — | ⚠️ DISABLED | bakery | Port 3001 | DISABLED May 15 — now PM2 |
| com.local.pm2-watchdog | — | ⚠️ DISABLED | watchdog | — | DISABLED May 18 — redundant |
| com.local.teamstandup | — | ⚠️ DISABLED | team-standup-bot | Port 8003 | **DISABLED 2026-05-22** — now PM2-managed |

**Note on teamstandup:** Old launchd `com.local.teamstandup` was the process manager. On 2026-05-22, PM2 started managing `team-standup-bot` directly (renamed from mislabeled "node"). Launchd plist is disabled; PM2 is now authoritative for this service.

---

## Archived / Retired Scripts

| Path | Status | Notes |
|------|--------|-------|
| `~/Projects/ecosystem-all.js.ARCHIVED` | ✅ ARCHIVED | Was defining 8 services — none in PM2. Archived Phase 6 |
| `~/Projects/pm2-watchdog.sh.LEGACY` | ✅ RETIRED | Redundant with BossMan pm2-health-monitor. Retired Phase 6 |

---

## User Crontab Entries

| Schedule | Command | Log | Status | Notes |
|----------|---------|-----|--------|-------|
| `0 9 * * *` | `squarespayouts-status-exporter.js` | `~/Projects/money-making-dashboard/logs/exporter.log` | ✅ ACTIVE | Last entry 2026-05-19 — NOT orphaned. Exports SquarePayouts status to Obsidian + GitHub daily. |

---

## Job Dependency Graph (Current)

```
pm2 resurrect (on boot)
  ├── bakery ──────────────────────────→ PM2
  ├── money-pipeline ──────────────────→ PM2
  ├── squarepayouts ───────────────────→ PM2
  ├── binance-bot ─────────────────────→ PM2
  ├── cloudflare-tunnel ───────────────→ PM2
  └── team-standup-bot ────────────────→ PM2 (renamed from "node" 2026-05-22)

launchd (on boot)
  ├── com.local.quickstats ────────────→ quick-stats (port 8102)
  ├── com.local.mission-control ───────→ mission-control (port 8001)
  └── ai.hermes.gateway ───────────────→ Hermes Telegram gateway

Hermes cron
  ├── pm2-health-monitor (5min) ───────→ auto-fix or alert
  └── weekly-review-mon-8am (Mon 8AM) ─→ Telegram report

user crontab
  └── squarespayouts-status-exporter (9am daily) → Obsidian + GitHub

System (always on)
  ├── Docker (8080)
  ├── SyncSpaces (8395, 22000)
  ├── Tailscale (49225-26)
  └── UGREEN (49225-26)
```

---

## Cleanup Log (Phase 6 Actions)

| # | Item | Action | Date | Status |
|---|------|--------|------|--------|
| DA-C1 | `ecosystem-all.js` | Archived as `.ARCHIVED` | 2026-05-22 | ✅ DONE |
| DA-C2 | `pm2-watchdog.sh` | Retired as `.LEGACY` | 2026-05-22 | ✅ DONE |
| DA-C3 | PM2 "node" rename | Renamed to `team-standup-bot` (PM2 id 29) | 2026-05-22 | ✅ DONE |
| DA-C4 | squarespayouts cron | Confirmed ACTIVE — NOT orphaned | 2026-05-22 | ✅ DONE |
| SC-01 | OFFLINE_SERVICES.md | Created at `~/.hermes/knowledge/memory/OFFLINE_SERVICES.md` | 2026-05-22 | ✅ DONE |
| SC-02 | cloudflare-tunnel auth | ⚠️ PENDING — verify tunnel auth | 2026-05-22 | ⏳ DEFERRED |

---

## Phase 6 Cleanup Summary

**Resolved (Phase 6):**
- DA-C1 ✅ ecosystem-all.js archived
- DA-C2 ✅ pm2-watchdog.sh retired
- DA-C3 ✅ PM2 "node" → "team-standup-bot"
- DA-C4 ✅ squarespayouts cron confirmed active
- SC-01 ✅ OFFLINE_SERVICES.md created

**Deferred:**
- SC-02 cloudflare-tunnel auth verification — requires tunnel operator login

---

*Index: MEMORY_CAPTURE_LOG.md → [WORKFLOW]*
*Next review: June 2026 deep audit*
