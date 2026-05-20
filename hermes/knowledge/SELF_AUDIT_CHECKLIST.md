# Hermes Self-Audit Checklist — Phase 3 Implementation
**Version:** 1.0
**Date:** 2026-05-22
**Owner:** BossMan
**Status:** IMPLEMENTED — Active

---

## Purpose

Define a concrete, recurring self-audit and performance monitoring system that:
- keeps BossMan fast and reliable
- monitors key services and logs
- records `[PERFORMANCE]` findings in the memory layer
- hooks into Kanban tracks (Self-Audit, Weekly Review, Deep Audit, Localhost Projects)

---

## Audit Tiers — Cadence and Scope

| Tier | Cadence | Duration | Owner | What |
|------|---------|----------|-------|------|
| **T1 — Health Pulse** | Every 5 min | <30 sec | Hermes cron (no_agent) | PM2 service status, auto-restart, crash detection |
| **T2 — Daily Scan** | Every day (manual or cron) | 2-5 min | BossMan | Log errors, restart patterns, port anomalies |
| **T3 — Weekly Review** | Every Monday 8 AM PDT | 15-20 min | BossMan via cron | Full system health, memory quality, Kanban backlog |
| **T4 — Monthly Deep Audit** | 1st of month | 45-60 min | BossMan + sub-agents | Architecture review, unknown ports, service map |
| **T5 — Event-Driven** | On error/findings | Varies | BossMan | Crash loops, regressions, new findings |

---

## Tier 1 — Health Pulse (5-Minute Automated)

**Script:** `~/.hermes/scripts/pm2-health-monitor.sh`
**Cron:** Every 5 minutes via Hermes cron job `d4f07e0c180f`
**Mode:** no_agent (shell only, no LLM)

### Checks
```bash
# Get PM2 status for all managed services
pm2 jlist | python3 -c "
import json, sys
procs = json.load(sys.stdin)
CRITICAL = ['binance-bot', 'squarepayouts', 'money-pipeline', 'bakery', 'cloudflare-tunnel']
for p in procs:
    if p['name'] in CRITICAL:
        status = p['pm2_env']['status']
        restarts = p['pm2_env']['restart_time']
        print(f\"{p['name']}: {status} (↺{restarts})\")
"
```

### Thresholds
- `status != online` → auto-restart once
- `restarts >= 5` → crash loop → alert Marcelo immediately (🚨 CRASH LOOP)
- `status == online` after auto-restart → ✅ FIXED message to Marcelo
- `status != online` after auto-restart → 🚨 NEEDS ATTENTION alert

### Alert Behavior
- **Silent when healthy** — zero Telegram messages
- **Auto-restart on down** — no alert during fix attempt
- **Recovery alert** — one ✅ FIXED message after successful auto-restart
- **Escalation alert** — one 🚨 NEEDS ATTENTION if auto-restart fails
- **Crash loop** — 🚨 CRASH LOOP immediately at ≥5 restarts
- **Dedup** — lockfile at `/tmp/pm2-alert-[SERVICE].lock` prevents duplicate alerts

### Services Monitored
| Service | Port | Risk Level | Auto-restart |
|---------|------|-----------|--------------|
| binance-bot | 8104 | HIGH (live money) | Yes |
| squarepayouts | 8030 | HIGH (revenue) | Yes |
| money-pipeline | 8020 | MEDIUM (degraded) | Yes |
| bakery | 3001 | LOW (ops) | Yes |
| cloudflare-tunnel | — | MEDIUM (connectivity) | Yes |

---

## Tier 2 — Daily Log Scan

**Frequency:** Daily (manual or via Hermes cron)
**Duration:** 2-5 minutes
**Owner:** BossMan

### Checks
```bash
# 1. PM2 restart counts (check for restart events since yesterday)
pm2 jlist | python3 -c "
import json, sys
procs = json.load(sys.stdin)
for p in procs:
    rt = p['pm2_env']['restart_time']
    if rt > 0:
        print(f\"{p['name']}: {rt} restarts (uptime: {p['pm2_env']['pm_uptime']})\")
"

# 2. Log errors in last 24h
grep -h "Error\|WARN\|error\|warn" ~/.pm2/logs/*-error*.log 2>/dev/null | tail -50

# 3. PM2 uptime / unsynced check
pm2 list
pm2 save 2>/dev/null && echo "PM2 synced" || echo "PM2 save failed"

# 4. Port status check
lsof -i :3001 -i :8020 -i :8030 -i :8104 -i :8102 -i :8003 -i :9119 2>/dev/null | grep LISTEN

# 5. Hermes gateway status
launchctl list | grep ai.hermes.gateway
```

### Thresholds
- Any restart on binance-bot, squarepayouts, or money-pipeline → note in log
- `EADDRINUSE` on any port → port conflict investigation
- `SQLITE_ERROR` in binance-bot logs → potential data loss → HIGH priority
- PM2 unsynced (`pm2 save` fails) → sync immediately
- Hermes gateway not running → restart gateway
- Unknown port with node process → identify or escalate

### Alert Behavior
- Log to `memory/YYYY-MM-DD.md` — no Telegram for routine daily checks
- Alert if: new error pattern discovered, service degraded, unknown port identified

---

## Tier 3 — Weekly Systems Review (Monday 8 AM PDT)

**Cron:** `0 8 * * 1` — Hermes cron job
**Duration:** 15-20 minutes
**Owner:** BossMan
**Template:** `~/.hermes/knowledge/WEEKLY_REVIEW_TEMPLATE.md`

### Sections

**1. PM2 Health (from pm2-health.log)**
- Services that went down this week
- Auto-restart recovery events
- Crash loops and escalations
- PM2 save status

**2. Log Review (from ~/.pm2/logs/)**
- Error patterns across all services
- New errors not seen before
- Warnings that should be addressed

**3. Kanban Backlog**
- Cards in `blocked` status — why?
- Cards in `ready` — any stuck?
- Overdue cards — any resource conflict?

**4. Memory Quality**
- Recent `[PERFORMANCE]` entries logged
- Any stale memory flagged for cleanup
- New patterns discovered

**5. Project Status**
- Money Pipeline: research broken since 2026-04-07 (Phase 8 addresses)
- Binance: `no_signal` state — is this normal or degraded?
- SquarePayouts: any new bug reports or feedback?
- BakeryOps: any issues from Basecamp?

**6. Strategic**
- Phase progress against blueprint
- Next week's priority cards
- Resource constraints or blockers

### Output
Deliver to Marcelo via Telegram: 5-10 bullet point weekly status.
Include: what went well, what needs attention, what's planned next week.

---

## Tier 4 — Monthly Deep Audit (1st of Month)

**Frequency:** 1st of each month (manual)
**Duration:** 45-60 minutes
**Owner:** BossMan + sub-agents
**Scope:** Comprehensive system health and architecture review

### Areas of Investigation

**1. Service Map Verification**
```bash
# Identify all listening ports and their owners
lsof -i -sTCP:LISTEN | awk '{print $1,$3,$9}' | sort -u

# Check unknown ports
lsof -i :8102  # quickstats? confirm
lsof -i :8003  # teamstandup? confirm
lsof -i :9119  # unknown — investigate

# Check for orphan processes (services that died but didn't restart)
ps aux | grep -E "node|python" | grep -v grep
```

**2. PM2 Sync Verification**
```bash
pm2 list
pm2 save  # must succeed — confirm persistence
pm2 resurrect  # dry run — confirm restore works after reboot
```

**3. Architecture Review**
- Any service not in PM2 but should be?
- Any service in PM2 but not needed?
- Any port conflicts or unused listeners?
- Cloudflare tunnel: still needed? Alternatives?

**4. Security Review**
- Any new open ports or exposed services?
- Any default credentials or hardcoded secrets in logs?
- CORS settings on all services still correct?
- Auth tokens and API keys: any expired or need rotation?

**5. Memory Audit**
- Clean up stale `[PERFORMANCE]` entries (anything >90 days)
- Consolidate duplicate findings across LEARNED_*.md files
- Verify MEMORY_CAPTURE_LOG.md tag counts are accurate

**6. Cron and LaunchAgent Audit**
```bash
# Active cron jobs
crontab -l

# Active LaunchAgents
launchctl list | grep -v "^-"
```

**7. Backup Verification**
- GitHub sync: confirm BossMan repo is up to date
- Obsidian sync: confirm CLAW-Backup has latest docs
- Kanban DB backup: confirm exists and is recent

### Output
- Comprehensive report saved to `memory/YYYY-MM-DD.md`
- `[PERFORMANCE]` entries for each finding
- Kanban card created for any issue requiring action
- Update SERVICES_MAP with new findings

---

## Tier 5 — Event-Driven (On Error/Findings)

**Trigger:** Crash loop, regression, new error pattern, or significant finding
**Owner:** BossMan immediately

### Immediate Actions
1. **Assess severity** — is data loss, security breach, or revenue impact possible?
2. **Stop further damage** — if live trading affected, secure the bot
3. **Document** — `[PERFORMANCE]` memory entry + Kanban card if action needed
4. **Notify Marcelo** — only if severity HIGH or involves external dependency

### Never Surface to Marcelo
- Internal blockers BossMan can resolve via code/shell/config change
- Known issues already in the fix pipeline
- Minor log warnings with no user impact

---

## [PERFORMANCE] Memory Entry Format

Every meaningful finding gets a structured entry in `memory/YYYY-MM-DD.md`:

```
[YYYY-MM-DD] [PERFORMANCE] [PROJECT:Name]
Finding: <what was discovered>
Severity: LOW / MEDIUM / HIGH
Commands/Tools: <what was run to find it>
Fix applied: <what was done, if anything>
Prevention: <what to do differently next time>
```

### Examples

**PM2 Sync Issue:**
```
[2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
Finding: PM2 unsynced — pm2 save not run recently, changes won't persist across reboot.
Severity: HIGH
Commands: pm2 list, pm2 info money-pipeline
Fix applied: Ran pm2 save. Confirmed all services have persist flag.
Prevention: Always run pm2 save after pm2 start/stop/delete.
```

**Binance Bot Errors:**
```
[2026-05-22] [PERFORMANCE] [PROJECT:BinanceBot]
Finding: binance-bot logs show SQLITE_ERROR (table trades has no column named current_sl) + ReferenceError (Cannot access 'liveBal' before initialization).
Severity: HIGH
Commands: pm2 logs --lines 20 --nostream
Fix applied: None yet — Phase 10 addresses Binance restoration.
Prevention: Check DB schema before bot restart. Document pre-trade-hook location.
```

**Money Pipeline Degraded:**
```
[2026-05-22] [PERFORMANCE] [PROJECT:MoneyPipeline]
Finding: money-pipeline has 1 restart since 3D uptime, stream errors likely in logs, research broken since 2026-04-07.
Severity: MEDIUM
Commands: pm2 list, curl http://localhost:8020/api/kpis
Fix applied: None — Phase 8 addresses research rebuild.
Prevention: Add research pipeline health check to Tier 1 health monitor.
```

**Bakery Port Conflict:**
```
[2026-05-22] [PERFORMANCE] [PROJECT:BakeryOps]
Finding: bakery error log shows EADDRINUSE on port 3001 — another process (PID 58601) already using port.
Severity: MEDIUM
Commands: lsof -i :3001, pm2 logs bakery
Current state: PID 58601 = bakery itself (2D uptime) — likely PM2 restart conflict, resolved.
Prevention: Ensure pm2 stop completes before pm2 start on same service.
```

---

## Integration with Kanban Tracks

| Track | Card | Integration |
|-------|------|------------|
| Self-Audit & Performance | t_ca987fa4 | Parent track — owns this checklist |
| Weekly Systems Review | t_38404d95 | T3 output → weekly review input |
| Deep Audit | t_260136ce | T4 output → deep audit input |
| Localhost Projects | t_405e079a | T2/T3 output → project-specific findings |
| Money Pipeline | t_ec6978a2 | `[PROJECT:MoneyPipeline]` entries available |
| Binance US Intel | t_e752ea85 | `[PROJECT:BinanceBot]` entries isolated |

---

## Service Status Reference (2026-05-22)

| Service | Port | PM2 Status | Uptime | Restarts | Notes |
|---------|------|-----------|--------|---------|-------|
| bakery | 3001 | online | 2D | 1 | EADDRINUSE error resolved |
| money-pipeline | 8020 | online | 3D | 1 | Degraded — research broken since 2026-04-07 |
| squarepayouts | 8030 | online | 8h | 0 | Healthy |
| binance-bot | 8104 | online | 43h | 6 | Errors in log — SQLITE_ERROR + ReferenceError |
| cloudflare-tunnel | — | online | 41h | 0 | Healthy |
| node (unknown) | 8003 | online | 10h | 0 | Unknown — likely teamstandup |
| node (unknown) | 8102 | online | ? | 0 | Unknown — likely quickstats |

**Offline:** overview (8100), health-dashboard (8110), trading-control (8130), youtube-dashboard (8140), kraken (8106)

---

## Unknown Ports to Investigate (Tier 4)

- **8102**: node process on localhost — likely quickstats (investigated 2026-05-18, result: ?)
- **8003**: node process on *:intu-ec-svcdisc — likely teamstandup
- **9119**: unknown — needs investigation in Tier 4

---

## PM2 Health Monitor Script Location

**Script:** `~/.hermes/scripts/pm2-health-monitor.sh`
**Cron Job ID:** `d4f07e0c180f`
**Schedule:** Every 5 minutes (no_agent)
**Log:** `~/logs/pm2-health.log`
**Lockfiles:** `/tmp/pm2-alert-[SERVICE].lock`

**Alert Behavior:**
- Silent when healthy
- Auto-restart on down (no alert during fix attempt)
- ✅ FIXED: after successful auto-restart
- 🚨 NEEDS ATTENTION: after failed auto-restart
- 🚨 CRASH LOOP: at ≥5 restarts (immediate)

---

## Log Locations Per Service

| Service | Error Log | Out Log |
|---------|-----------|---------|
| binance-bot | `~/.pm2/logs/binance-bot-error-*.log` | `~/.pm2/logs/binance-bot-out.log` |
| money-pipeline | `~/.pm2/logs/money-pipeline-error-*.log` | `~/.pm2/logs/money-pipeline-out.log` |
| squarepayouts | `~/.pm2/logs/squarepayouts-error-*.log` | `~/.pm2/logs/squarepayouts-out.log` |
| bakery | `~/.pm2/logs/bakery-error.log` | `~/.pm2/logs/bakery-out.log` |
| cloudflare-tunnel | N/A (system service) | N/A |

---

## Alert Triage Guide

| Condition | Action | Destination |
|-----------|--------|-------------|
| Service down + auto-restart succeeds | ✅ FIXED message | Telegram |
| Service down + auto-restart fails | 🚨 NEEDS ATTENTION | Telegram |
| ≥5 restarts (crash loop) | 🚨 CRASH LOOP immediately | Telegram |
| New error pattern in logs | Document + `[PERFORMANCE]` | memory/YYYY-MM-DD.md |
| Unknown port identified | Document + escalate | memory/YYYY-MM-DD.md + Kanban |
| Memory tool near full | Clean up stale entries | memory tool |
| PM2 unsynced | Fix immediately + log | memory/YYYY-MM-DD.md |

---

**Last verified:** 2026-05-22
**Next review:** After first T3 (weekly) run — adjust based on false positives/negatives