# Money Pipeline Overview

**Source:** Phase 1 audit, SERVICES_MAP.md, PHASE5_REPORT.md
**Status:** ⚠️ Active but unstable — 8 restarts

---

## Service Details

| Attribute | Value |
|-----------|-------|
| PM2 Name | `money-pipeline` |
| Port | 8020 |
| Alternate Port | 8120 |
| Script Path | `~/Projects/money-making-dashboard/server.js` |
| Health Check | `curl localhost:8020` |
| Status | ⚠️ Active — 8 restarts, monitor |
| Owner | Marcelo |
| Uptime (as of Phase 1) | 6 days |
| PM2 Restarts | 8 |

---

## Known Issues

### Stream Errors and IncomingMessage Emit Errors

Phase 1 audit found stream errors and IncomingMessage emit errors in the logs:
- `Stream` errors — likely related to data processing
- `IncomingMessage` emit errors — API response handling issues

These errors contributed to the 8 restarts. The service is functional but unstable.

---

## Phase 6 Gate

This service is the target of Phase 6 Track A (`t_71fdab1a`):

> **"Phase 6 pilot — Money Pipeline rebuild"**
> **Blocker:** Finance data source not confirmed
> **Status:** Blocked — awaiting Marcelo decision

Phase 6 will rebuild the Money Pipeline with:
1. Clean Next.js architecture
2. Hermes cron ownership (migrate from OpenClaw)
3. Finance data source definition
4. New Basecamp project
5. Testing checklist

---

## Access

### Local Access
```bash
curl localhost:8020
```

### Remote Access (via Tailscale)
With Tailscale VPN connected, access from any device on the tailnet:
```
http://<tailscale-ip>:8020
```

---

## Current Functionality (as of Phase 1)

Based on Phase 1 audit, Money Pipeline handles:
- Crypto tracking
- Market data processing
- Morning research automation (via `run_morning_research.sh`)
- Research summary to Telegram (via `morning-research-summary`)

---

## What Needs to Change (Phase 6)

| Issue | Current State | Phase 6 Target |
|-------|--------------|----------------|
| Architecture | Node.js server.js | Clean Next.js |
| Cron owner | OpenClaw (money-morning-research) | Hermes |
| Finance data | Unknown — needs definition | Defined and sourced |
| Basecamp | None | Project with testing checklist |
| Stability | 8 restarts | Stable after rebuild |

---

## Related Files

- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Phase 1 blockers
- `~/.hermes/knowledge/PHASE5_REPORT.md` — Phase 5 complete
- `~/Projects/money-making-dashboard/` — Project directory