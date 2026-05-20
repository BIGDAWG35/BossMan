# Performance Findings — Phase 3/5 Audit
**Owner:** BossMan
**Last updated:** 2026-05-22 (Phase 5 deep audit)
**Purpose:** Record [PERFORMANCE] findings from ongoing self-audit

---

## Findings — Phase 5 Deep Audit Update (2026-05-22)

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** Unknown ports 8102, 8003, 9119 fully resolved — all classified as ACTIVE_SERVICE.
- 8102 → quick-stats (launchd `com.local.quickstats`)
- 8003 → team-standup-bot (launchd `com.local.teamstandup`, also PM2 as mislabeled "node")
- 9119 → Hermes dashboard Python process (hermes-agent venv)
**Resolution:** Removed from "unknown" status — no longer noise in future audits.
**File:** `SERVICE_MAP_2026-05.md`

---

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** `ecosystem-all.js` at `~/Projects/ecosystem-all.js` defines 8 services — NONE are registered in PM2. This is a misleading legacy file.
**Severity:** MEDIUM
**Action:** Archive as `ecosystem-all.js.ARCHIVED`.
**File:** `JOBS_OVERVIEW.md`

---

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** `pm2-watchdog.sh` at `~/Projects/pm2-watchdog.sh` references disabled launchd services and a non-existent "crypto-portfolio" service. BossMan health monitor handles all PM2 monitoring.
**Severity:** MEDIUM
**Action:** Retire to `pm2-watchdog.sh.LEGACY`.
**File:** `JOBS_OVERVIEW.md`

---

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** user crontab has `0 9 * * *` squarespayouts-status-exporter.js — may be orphaned.
**Severity:** LOW
**Action:** Check `~/Projects/money-making-dashboard/logs/exporter.log` — if no new entries in 30+ days, remove crontab entry.
**File:** `JOBS_OVERVIEW.md`

---

## Findings — Phase 3 Original Audit (2026-05-22)

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** PM2 health monitor only checked 3 of 5 active services — missing bakery and cloudflare-tunnel.
**Severity:** MEDIUM
**Fix applied:** Updated CRITICAL_SERVICES in pm2-health-monitor.sh to include bakery and cloudflare-tunnel.

---

### [2026-05-22] [PERFORMANCE] [PROJECT:BinanceBot]
**Finding:** binance-bot has two active errors:
1. `SQLITE_ERROR: table trades has no column named current_sl` — trailing stop not persisted
2. `ReferenceError: Cannot access 'liveBal' before initialization` — TDZ error
**Severity:** HIGH
**Status:** Phase 10 (Binance Bot Restoration) — not Phase 5 scope.
**File:** `SERVICE_MAP_2026-05.md`

---

### [2026-05-22] [PERFORMANCE] [PROJECT:MoneyPipeline]
**Finding:** money-pipeline research broken since ~2026-04-07 — API responds, enrichment pipeline degraded.
**Severity:** MEDIUM
**Status:** Phase 8 (Money Pipeline Rebuild) — not Phase 5 scope.

---

### [2026-05-22] [PERFORMANCE] [PROJECT:BakeryOps]
**Finding:** bakery had EADDRINUSE port 3001 — resolved by PM2. 2D uptime, 1 restart.
**Severity:** LOW
**Status:** Resolved.

---

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** PM2 save status was unknown — confirmed saved post-Phase 3 changes.
**Severity:** HIGH (persistence risk, now resolved)

---

## Service Status Dashboard

| Service | Port | Manager | Uptime | Restarts | Status |
|---------|------|---------|--------|----------|--------|
| bakery | 3001 | PM2 | 2D | 1 | ✅ ONLINE |
| money-pipeline | 8020 | PM2 | 3D | 2 | ⚠️ DEGRADED |
| squarepayouts | 8030 | PM2 | 8h | 0 | ✅ ONLINE |
| binance-bot | 8104 | PM2 | 43h | 6 | 🚨 NO_SIGNAL |
| cloudflare-tunnel | — | PM2 | 41h | 0 | ✅ ONLINE |
| quick-stats | 8102 | launchd | ? | 0 | ✅ ONLINE |
| team-standup-bot | 8003 | PM2+launchd | 10h | 0 | ✅ ONLINE |
| Hermes dashboard | 9119 | manual | ? | 0 | ✅ ONLINE |

**Offline by design:** overview(8100), health(8110), trading-control(8130), YouTube(8140), Kraken(8106)

---

*Findings older than 90 days with no reoccurrence should be archived at next deep audit.*
*Next update: Phase 8 or Phase 10 findings, whichever comes first.*
