# Health Monitoring Procedures

**Source:** SERVICES_MAP.md, Phase 1 audit
**Status:** Active

---

## Daily Monitoring Checklist

### Morning (after Telegram briefing from Hermes)
1. `pm2 list` — confirm all services online
2. Check restart counts — any >0 needs investigation
3. `curl localhost:8020` — verify money-pipeline is stable
4. `tailscale status` — confirm VPN is connected

### Evening (9 PM Binance health check)
1. Binance bot status — should remain STOPPED until Phase 6
2. `hermes gateway status` — confirm Telegram connected

---

## Service Health Matrix

| Service | Port | Check Command | Healthy | Warning | Critical |
|---------|------|--------------|---------|---------|----------|
| Bakery | 3001 | `curl -s localhost:3001` | HTML response | Timeout | No response |
| SquarePayouts | 3100 | `curl -s localhost:3100` | HTML response | Timeout | No response |
| Money Pipeline | 8020 | `curl -s localhost:8020` | HTML response | Timeout or errors | No response |
| Fresh dashboard | 5050 | `curl -s localhost:5050` | HTML response | Timeout | No response |
| OpenClaw hub | 8090 | `curl -s localhost:8090` | HTML response | Timeout | No response |
| Overview | 8100 | `curl -s localhost:8100` | HTML response | Timeout | No response |
| Binance bot | 8104 | `pm2 list \| grep binance-bot` | STOPPED | online | — |
| Health dashboard | 8110 | `curl -s localhost:8110` | HTML response | Timeout | No response |
| Trading control | 8130 | `curl -s localhost:8130` | HTML response | Timeout | No response |
| YouTube dashboard | 8140 | `curl -s localhost:8140` | HTML response | Timeout | No response |
| OpenClaw gateway | 18789 | `curl -s localhost:18789/health` | `{"ok":true}` or similar | Error | No response |

---

## Monitoring Schedule

| Time | Check | Command |
|------|-------|---------|
| Morning | PM2 list | `pm2 list` |
| Morning | Money pipeline | `curl -s localhost:8020` |
| Morning | Telegram | `hermes gateway status` |
| Evening | Binance bot (should be STOPPED) | `pm2 list \| grep binance-bot` |
| Evening | Tailscale | `tailscale status` |

---

## Alert Conditions

**Page Marcelo immediately if:**
1. Any service not responding on its port
2. Money pipeline restarts >10
3. Binance bot shows `online` (it should be STOPPED)
4. Telegram gateway disconnected
5. Tailscale VPN disconnected

---

## Hermes Gateway Health Check

```bash
# Check Telegram connection
hermes gateway status

# Check gateway state
cat ~/.hermes/gateway_state.json

# Restart gateway if needed
hermes gateway restart
```

---

## Error Log Review

```bash
# Review all error logs
pm2 logs --err --lines 50

# Check specific service
pm2 logs <service-name> --err --lines 20

# Check Binance bot specifically (should remain STOPPED)
pm2 logs binance-bot --err --lines 20
```