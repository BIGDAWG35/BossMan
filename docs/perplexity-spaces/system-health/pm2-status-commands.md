# PM2 Status Commands — Quick Reference

**Source:** Phase 1 audit, SERVICES_MAP.md
**Status:** Active

---

## Essential PM2 Commands

```bash
# List all processes
pm2 list

# Get detailed info on a process
pm2 show <name>

# View real-time logs
pm2 logs <name> --lines 50

# Restart a process
pm2 restart <name>

# Stop a process (use carefully!)
pm2 stop <name>

# Delete a process from PM2
pm2 delete <name>

# Flush logs (clean up)
pm2 flush

# Monitor in real time (dashboard)
pm2 monit

# Save process list (persist across reboots)
pm2 save

# Restore after reboot
pm2 resurrect
```

---

## Process Names to Use

| Display Name | PM2 Name | Port |
|--------------|----------|------|
| Bakery | `bakery` | 3001 |
| SquarePayouts | `squarepayouts` | 3100 |
| Fresh dashboard | `fresh-dashboard` | 5050 |
| OpenClaw hub | `hub` | 8090 |
| Overview | `overview` | 8100 |
| Health dashboard | `health-dashboard` | 8110 |
| Binance bot | `binance-bot` | 8104 |
| Trading control | `trading-control` | 8130 |
| YouTube dashboard | `youtube-dashboard` | 8140 |
| Money pipeline | `money-pipeline` | 8020 |

---

## Status Indicators

| Column in `pm2 list` | What it means |
|--------------------|---------------|
| `online` | Running, healthy |
| `stopped` | Stopped (Binance bot should be STOPPED) |
| `errored` | Crashed, needs attention |
| `restart` | Restart count — >0 means instability |

---

## Quick Health Check

```bash
# One-liner: show status + restarts for all services
pm2 jlist | python3 -c "import sys,json; data=json.load(sys.stdin); [print(f\"{d['name']}: {d['pm2_env']['status']} ({d['pm2_env']['restart_time']} restarts)\") for d in data]"

# Check for any non-healthy processes
pm2 list | grep -v "online\|stopped"
```

---

## Alert Rules

Alert if:
- Any process shows `errored`
- Any process has >5 restarts
- Binance bot shows `online` (should be STOPPED)
- Money pipeline has >10 restarts

---

## Restart vs Stop

| Action | Use Case | Command |
|--------|----------|---------|
| **Restart** | App is running but misbehaving | `pm2 restart <name>` |
| **Stop** | App should be down (Binance bot) | `pm2 stop <name>` |
| **Delete** | Remove from PM2 entirely | `pm2 delete <name>` |

**Note:** Binance bot should remain STOPPED until Phase 6 Track B is approved by Marcelo.