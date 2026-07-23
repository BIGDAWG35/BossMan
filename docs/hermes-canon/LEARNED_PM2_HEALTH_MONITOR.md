# PM2 Health Monitor — Permanent Operating Rule

**Source:** AGENTS.md §"PM2 Health Monitor — All Agents" (extracted 2026-07-22)
**Status:** Permanent

---

## Overview

Critical services are monitored every 5 minutes via Hermes cron job `d4f07e0c180f`.

**Script:** `~/.hermes/scripts/pm2-health-monitor.sh` (no_agent mode — pure shell, no LLM)

**Monitored services:**
| Service | Port |
|---|---|
| binance-bot | 8104 |
| squarepayouts | 8030 |
| money-pipeline | 8020 |

**Log:** `~/logs/pm2-health.log`

---

## Notification Rules (Marcelo's standing policy — 2026-05-16)

1. **Silent when healthy** — zero messages if all services are online. No "system healthy" or "all services up" messages.
2. **Auto-fix silently** — if a service is down, restart it automatically with NO alert during the fix attempt.
3. **Alert ONLY on two conditions:**
   - ✅ `SUCCESS`: service was down + auto-recovered → ONE message: "✅ FIXED: [service] was down, auto-restarted at [time]. Now stable."
   - 🚨 `ESCALATION`: service is down + auto-restart FAILED → ONE message: "🚨 NEEDS ATTENTION: [service] is down and could not be auto-recovered. Manual fix required."
4. **No duplicate alerts** — lockfile per service (`/tmp/pm2-alert-[service].lock`) prevents repeated alerts for the same incident. Lock created on alert, deleted when service recovers and is confirmed stable.
