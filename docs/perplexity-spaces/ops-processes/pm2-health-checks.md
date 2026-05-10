# PM2 Health Check Procedures

**Source:** SERVICES_MAP.md, Phase 1 audit
**Status:** Active

---

## Quick Health Commands

```bash
# List all PM2 processes
pm2 list

# Get detailed status for a specific process
pm2 show <process-name>

# Check restart count (healthy = 0)
pm2 list | grep restart

# View last 20 log lines
pm2 logs <process-name> --lines 20

# Monitor in real time
pm2 monit
```

---

## Active Services and Health Checks

| Service | PM2 Name | Port | Health Check | Expected |
|---------|----------|------|--------------|----------|
| Bakery | `bakery` | 3001 | `curl localhost:3001` | HTML response |
| SquarePayouts | `squarepayouts` | 3100 | `curl localhost:3100` | HTML response |
| Fresh dashboard | `fresh-dashboard` | 5050 | `curl localhost:5050` | HTML response |
| OpenClaw hub | `hub` | 8090 | `curl localhost:8090` | HTML response |
| Overview | `overview` | 8100 | `curl localhost:8100` | HTML response |
| Health dashboard | `health-dashboard` | 8110 | `curl localhost:8110` | HTML response |
| Binance bot | `binance-bot` | 8104 | `curl localhost:8104` | HTML or stopped |
| Trading control | `trading-control` | 8130 | `curl localhost:8130` | HTML response |
| YouTube dashboard | `youtube-dashboard` | 8140 | `curl localhost:8140` | HTML response |
| Money pipeline | `money-pipeline` | 8020 | `curl localhost:8020` | HTML response |

---

## Stable Services (0 restarts)

✅ `bakery`, `fresh-dashboard`, `health-dashboard`, `hub`, `trading-control`, `youtube-dashboard`, `overview`

These have 6D uptime and 0 restarts — no action needed.

---

## Unstable Services

### ⚠️ money-pipeline — 8 restarts
```
Health: Monitor closely
Last check: 2026-05-07 (Phase 1 audit)
Issue: Stream errors, IncomingMessage emit errors in logs
Action: Investigate during Phase 6 (finance data source review)
```

### 🔴 binance-bot — 32 restarts (STOPPED)
```
Health: STOPPED — do not restart until Phase 6
Issue: Missing pre-trade-hook module + SQLite errors
Action: Phase 6 Track B — pre-trade-hook restoration
```

---

## Error Patterns and What They Mean

| Error Pattern | Likely Cause | Action |
|-------------|-------------|--------|
| `SQLite_ERROR` | Database lock or corruption | Check disk space, restart process |
| `ERR_UNKNOWN_FILE_EXTENSION` | Build mismatch or missing dependency | Check node_modules, rebuild |
| `IncomingMessage` emit errors | Stream handling issue | Check API response format |
| High restart count (>10) | Fatal error loop | Stop process, investigate logs |

---

## PM2 Maintenance Commands

```bash
# Restart a specific service
pm2 restart <process-name>

# Stop a service (use carefully)
pm2 stop <process-name>

# Clear logs
pm2 flush

# Save current process list (persist across reboots)
pm2 save

# resurrect (restore after reboot)
pm2 resurrect
```

---

## Daily Health Check Routine

```bash
# 1. Quick status
pm2 list | grep -E "online|err|restart"

# 2. Check money-pipeline specifically
pm2 show money-pipeline | grep -E "restart|uptime|status"

# 3. Check if binance-bot is still stopped
pm2 list | grep binance-bot

# 4. Verify Telegram connection
hermes gateway status
```

---

## Alert Conditions

Alert Marcelo immediately if:
- Any service has >10 restarts
- Binance bot is not stopped (it should be STOPPED until Phase 6)
- Telegram gateway is not connected
- Money pipeline restarts increase beyond 10