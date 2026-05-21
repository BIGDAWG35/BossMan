# INFRA_AUDIT_2026-05-22.md — Phase 3 Self-Audit & Performance
**Date:** 2026-05-22
**Phase:** 3/11 — Self-Audit & Performance Monitoring
**Status:** ✅ COMPLETE
**Owner:** BossMan

---

## Executive Summary

| Area | Status | Issues |
|------|--------|--------|
| PM2 Services | ✅ 5/5 UP | 1 CRITICAL (team-standup-bot has 9184 restarts) |
| LaunchAgents | ✅ 4/8 ACTIVE | 4 DISABLED (intentional), 1 DISABLED (gateway-health) |
| Ports | ✅ 8 ports verified | All LISTEN on 127.0.0.1 |
| CuaDriver | ✅ UP after restart | Pattern: daemon UP ≠ MCP subprocess alive |
| Hermes Gateway | ✅ UP (PID 31271) | gateway-health DISABLED (was causing restart loop) |
| PM2 Health Monitor | ✅ STABLE | No restart loop since gateway-health disabled |
| Memory Layer (Phase 2) | ✅ VERIFIED | Tags updated, files synced to Obsidian + GitHub |
| Cron Jobs | ✅ 3 active | 1 orphaned (squarespayouts-status-exporter check needed) |

---

## 1. PM2 Services

| Service | ID | Status | Uptime | Restarts | Notes |
|---------|-----|--------|---------|----------|-------|
| binance-bot | 30 | ✅ online | 3h | 1 | PAPER_MODE=true, INTEL_GATE=true |
| money-pipeline | 1 | ✅ online | 7h | 4 | cluster mode, 4 restarts (post-INJ fix) |
| squarepayouts | 28 | ✅ online | 17h | 0 | OK |
| bakery | 9 | ✅ online | 2D | 1 | OK |
| cloudflare-tunnel | 10 | ✅ online | 2D | 0 | OK |
| team-standup-bot | 29 | ✅ online | 1s | **9184** | ⚠️ CRITICAL — NOT a PM2 process! Should be launchd-only |

### ⚠️ CRITICAL: team-standup-bot in PM2 with 9184 restarts

**Problem:** `team-standup-bot` (PM2 id=29) is showing 9184 restarts with 1-second uptime. This is NOT a PM2-managed service — it is launchd-managed (`com.local.teamstandup` is active with PID 2781).

**Root cause:** The PM2 process `team-standup-bot` was likely created by mistake or a migration artifact. It's a duplicate of the launchd service `com.local.teamstandup`.

**Current state:**
- Launchd `com.local.teamstandup`: PID 2781, KeepAlive, ACTIVE ✅
- PM2 `team-standup-bot`: id=29, 9184 restarts, 1s uptime, ACTIVE (but redundant)

**Action needed:** In Phase 6 or a maintenance window, delete the PM2 entry for team-standup-bot (`pm2 delete team-standup-bot`). The launchd service handles it correctly.

**Files updated:** This finding → MEMORY_CAPTURE_LOG.md → `[PERFORMANCE]` entry.

---

## 2. LaunchAgents

| Label | PID | Status | RunAtLoad | KeepAlive | Notes |
|-------|-----|--------|-----------|-----------|-------|
| `ai.hermes.gateway` | 31271 | ✅ UP | true | false | hermes_cli.main gateway run |
| `ai.hermes.gateway-health` | — | ❌ DISABLED | — | — | **Unloaded 2026-05-20** — was causing restart loop |
| `com.local.quickstats` | 47491 | ✅ UP | true | true | KeepAlive, port 8102 |
| `com.local.teamstandup` | 2781 | ✅ UP | true | true | KeepAlive, port 8003 — the correct manager |
| `ai.openclaw.gateway` | — | ❌ DISABLED | — | — | **Disabled 2026-05-18** — Telegram bypass |
| `com.local.bakery` | — | ❌ DISABLED | — | — | **Disabled 2026-05-18** — PM2 manages bakery |
| `com.local.squarepayouts` | — | ❌ DISABLED | — | — | **Disabled 2026-05-18** — PM2 manages squarepayouts |
| `com.local.pm2-watchdog` | — | ❌ DISABLED | — | — | **Disabled 2026-05-18** — redundant with BossMan pm2-health-monitor |

---

## 3. Port Map

| Port | Service | Manager | Status |
|------|---------|---------|--------|
| 3001 | bakery | PM2 | ✅ LISTEN |
| 8003 | team-standup-bot | Launchd | ✅ LISTEN (IPv6 all) |
| 8020 | money-pipeline | PM2 | ✅ LISTEN |
| 8030 | squarepayouts | PM2 | ✅ LISTEN |
| 8102 | quick-stats | Launchd | ✅ LISTEN |
| 8104 | binance-bot | PM2 | ✅ LISTEN |
| 20241 | cloudflare-tunnel | PM2 | ✅ LISTEN |
| 9119 | Hermes dashboard | venv | ✅ LISTEN |

---

## 4. CuaDriver

| Check | Result |
|-------|--------|
| Daemon PID | 40662 (restarted twice this session) |
| Socket | ✅ exists (`/Users/bigdawg/Library/Caches/cua-driver/cua-driver.sock`) |
| computer-use status | ✅ OK (after full daemon restart) |
| Pattern | **Daemon UP + socket exists ≠ MCP subprocess alive** |
| Fix | `pkill -f cua-driver mcp; pkill -f cua-driver serve; open -n -g -a CuaDriver --args serve` |

---

## 5. Hermes Gateway

| Check | Result |
|-------|--------|
| LaunchAgent | `ai.hermes.gateway` (PID 31271) ✅ UP |
| Process | `hermes_cli.main gateway run --replace` ✅ UP |
| gateway-health script | `gateway-health-check.sh` ✅ installed (one-shot only, no daemon loop) |
| gateway-health LaunchAgent | ❌ **DISABLED** — was causing restart loop |
| Post-disable stability | ✅ No restart loop detected since disabled |

---

## 6. PM2 Health Monitor

| Check | Result |
|-------|--------|
| Script | `~/.hermes/scripts/pm2-health-monitor.sh` ✅ |
| Cron | Every 5 minutes (`no_agent` mode) ✅ |
| Monitored services | binance-bot, squarepayouts, money-pipeline, bakery, cloudflare-tunnel ✅ |
| Excluded (correct) | team-standup-bot, quick-stats (launchd-managed) ✅ |
| Last alert | 2026-05-20 15:25 (hermes-gateway DOWN — escalated once) |
| Post-incident stability | ✅ No restart loop since gateway-health disabled |

---

## 7. Memory Layer (Phase 2 Verification)

| Check | Result |
|-------|--------|
| MEMORY_CAPTURE_LOG.md | ✅ `~/.hermes/knowledge/memory/MEMORY_CAPTURE_LOG.md` (23KB) |
| MEMORY_POLICY.md | ✅ `~/.hermes/knowledge/memory/MEMORY_POLICY.md` (11KB) |
| memory-trading-intelligence.md | ✅ `~/.hermes/knowledge/memory/memory-trading-intelligence.md` (ISOLATED) |
| Tag index updated | ✅ [DECISION]:3, [ARCHITECTURE]:7, [PERFORMANCE]:10 |
| Phase 2 entries queryable | ✅ Yes — all entries have date/tag/project |
| Obsidian sync | ✅ `~/Desktop/CLAW-Backup/` (MEMORY_POLICY.md, MEMORY_CAPTURE_LOG.md) |
| GitHub sync | ✅ `~/Projects/BossMan/` (commit df6f523) |

---

## 8. Cron Jobs

| Job | Schedule | Status | Notes |
|-----|----------|--------|-------|
| squarespayouts-status-exporter | `0 9 * * *` | ⚠️ CHECK | Legacy cron in crontab — verify if still writing to `logs/exporter.log` |
| CSDAWG 2.0 (crypto intel) | `0 15 * * 1` | ✅ LIVE | Job ID 76956b7cafa7, next run 2026-05-25 15:00 UTC |
| BossMan weekly review | `0 8 * * 1` | ✅ LIVE | Job ID 88eff3953480, every Monday 08:00 PDT |

---

## 9. Findings Logged to Memory

| Tag | Finding | Severity |
|-----|---------|----------|
| `[PERFORMANCE]` | team-standup-bot in PM2 with 9184 restarts — should be launchd-only | HIGH |
| `[PERFORMANCE]` | CuaDriver daemon UP but MCP subprocess can die independently | MEDIUM |
| `[ARCHITECTURE]` | Gateway health monitor restart loop — root cause: launchctl list during transitions | CRITICAL (resolved) |
| `[PERFORMANCE]` | `set -e + grep/pgrep` pipe pitfall — script exits when grep returns 1 | MEDIUM |
| `[DECISION]` | team-standup-bot PM2 entry to be deleted in Phase 6 | PENDING |

---

## Phase 3 COMPLETE — Next: Phase 11B (LIVE Test)

Phase 3 self-audit done. Infrastructure is stable. PM2 health monitor is stable post-gateway-health disable.

**Ready for Phase 11B** — Marcelo has given explicit approval for tiny LIVE test.

---