# OFFLINE_SERVICES.md — Intentionally Offline Services
**Owner:** BossMan
**Generated:** 2026-05-22 (Phase 6 cleanup)
**Purpose:** Document services that are intentionally not running — why they're offline, and when/whether to bring them back.
**Tags:** [ARCHITECTURE] [PROJECT:Hermes]

---

## Offline Services Registry

| Service | Port | Project | Status | Reason Offline | Bring Back? |
|---------|------|---------|--------|----------------|-------------|
| overview | 8100 | master-dashboard | OFFLINE-BY-DESIGN | Never deployed — overview dashboard was planned but not started | DEPRECATED — do not deploy |
| health-dashboard | 8110 | health-dashboard | OFFLINE-BY-DESIGN | health-auto-export-server not running; replaced by Hermes self-audit | DEPRECATED — replaced by BossMan |
| trading-control | 8130 | trading-control | OFFLINE-BY-DESIGN | Planned Phase 11 — not started yet | Phase 11 only |
| YouTube dashboard | 8140 | youtube-dashboard | OFFLINE-BY-DESIGN | Not started; YouTube workflow is manual via `youtube-content` skill | DEPRECATED — use skill instead |
| Kraken bot | 8106 | kraken-bot-new | OFFLINE-BY-DESIGN | Phase 10 scope — Binance is primary; Kraken secondary | Phase 10 only |

---

## Legacy Services (Archived/Retired)

| Service | Port | Project | Status | Notes |
|---------|------|---------|--------|-------|
| ecosystem-all.js | — | ecosystem | LEGACY | `~/Projects/ecosystem-all.js.ARCHIVED` — misleading, defines services not in PM2 |
| pm2-watchdog.sh | — | watchdog | LEGACY | `~/Projects/pm2-watchdog.sh.LEGACY` — redundant with BossMan health monitor |
| crypto-portfolio | 8105 | crypto-portfolio | LEGACY | Was in PM2 historically; not in current ecosystem; no active service |

---

## How to Use This File

**When doing a deep audit (Phase 5/Phase 7):**
1. Check each offline service's port against `lsof` output
2. If a service has a listener but isn't in PM2 or launchd → investigate (might be unplanned)
3. If a service is marked DEPRECATED but has a listener → stop it

**When starting Phase 11 (Trading Execution):**
1. Review trading-control (8130) entry — this is the only planned offline service for Phase 11
2. All other offline services are either deprecated or Phase 10-specific

**When reviewing the Localhost Projects track:**
- All offline services above should appear as OFFLINE-BY-DESIGN or LEGACY
- No mystery services should exist — if something is running and not in SERVICE_MAP, investigate

---

## Quick Reference: Ports

| Port | Status | Service | Source |
|------|--------|---------|--------|
| 3001 | ACTIVE | bakery | PM2 |
| 8003 | ACTIVE | team-standup-bot | PM2 (renamed from "node" 2026-05-22) |
| 8020 | ACTIVE | money-pipeline | PM2 (degraded — research broken) |
| 8030 | ACTIVE | squarepayouts | PM2 |
| 8102 | ACTIVE | quick-stats | launchd |
| 8104 | ACTIVE | binance-bot | PM2 (no_signal) |
| 9119 | ACTIVE | Hermes dashboard | manual |
| 8100 | OFFLINE | overview | DEPRECATED |
| 8110 | OFFLINE | health-dashboard | DEPRECATED |
| 8130 | OFFLINE | trading-control | Phase 11 only |
| 8140 | OFFLINE | YouTube dashboard | DEPRECATED |
| 8106 | OFFLINE | Kraken | Phase 10 only |

---

*Next review: June 2026 deep audit*
*Replaces: implicit offline knowledge — now explicit*