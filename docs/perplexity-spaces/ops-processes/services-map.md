# Services Map — Full Port and Service Reference

**Source:** `~/.hermes/knowledge/SERVICES_MAP.md`
**Version:** Updated 2026-05-07
**Status:** Canonical source of truth for services

---

## Service Map (Confirmed 2026-05-07)

| Service | Port | Type | PM2 Name | Owner | Health Check | Status |
|---------|------|------|----------|-------|--------------|--------|
| Bakery (home bakery business) | 3001 | Next.js web | `bakery` | Marcelo | `curl localhost:3001` | ✅ Active — 6D uptime |
| Hermes messaging gateway | — | LaunchAgent | — | BossMan | Telegram DM connected | ✅ Active — Telegram |
| SquarePayouts (sports betting pool) | 3100 | Next.js web | `squarepayouts` | Marcelo | `curl localhost:3100` | ✅ Active — 6D uptime |
| Fresh dashboard | 5050 | Node web | `fresh-dashboard` | Marcelo | `curl localhost:5050` | ✅ Active — 6D uptime |
| OpenClaw hub | 8090 | Node web | `hub` | Marcelo | `curl localhost:8090` | ✅ Active — 6D uptime |
| Overview dashboard | 8100 | Node web | `overview` | Marcelo | `curl localhost:8100` | ✅ Active — 6D uptime |
| Health dashboard | 8110 | Node web | `health-dashboard` | Marcelo | `curl localhost:8110` | ✅ Active — 6D uptime |
| Binance bot dashboard | 8104 | Node web | `binance-bot` | Marcelo | `curl localhost:8104` | 🔴 STOPPED — pre-trade-hook missing |
| Trading control | 8130 | Node web | `trading-control` | Marcelo | `curl localhost:8130` | ✅ Active — 6D uptime |
| YouTube dashboard | 8140 | Node web | `youtube-dashboard` | Marcelo | `curl localhost:8140` | ✅ Active — 6D uptime |
| Crypto tracker / Money pipeline | 8020 | Node web | `money-pipeline` | Marcelo | `curl localhost:8020` | ⚠️ Active — 8 restarts, monitor |
| OpenClaw gateway | 18789 | Node web | — | OpenClaw | `curl localhost:18789/health` | ✅ Active |

---

## Quick Port Lookup

| Port | Owner | Service | Status |
|------|-------|---------|--------|
| 18789 | OpenClaw | OpenClaw gateway | ✅ Active |
| 3001 | Marcelo | Bakery (home bakery) | ✅ Active |
| 3100 | Marcelo | SquarePayouts (sports betting pool) | ✅ Active |
| 5050 | Marcelo | Fresh dashboard | ✅ Active |
| 8090 | Marcelo | OpenClaw hub | ✅ Active |
| 8100 | Marcelo | Overview dashboard | ✅ Active |
| 8104 | Marcelo | Binance bot dashboard | 🔴 STOPPED |
| 8110 | Marcelo | Health dashboard | ✅ Active |
| 8130 | Marcelo | Trading control | ✅ Active |
| 8140 | Marcelo | YouTube dashboard | ✅ Active |
| 8020 | Marcelo | Crypto tracker / Money pipeline | ⚠️ Monitor |

---

## Hermes Gateway — Not a Web Port Service

The Hermes messaging gateway (BossMan) runs as a **macOS LaunchAgent**, NOT as a PM2 web service. It connects to Telegram and handles messaging — it does not bind a web port. Do NOT add it to the port map as a web service.

**Health check for Hermes gateway:** Check `hermes gateway status` or verify Telegram connection in `~/.hermes/gateway_state.json`.

---

## Services NOT on this Machine

| Service | Reason Not Present |
|---------|-------------------|
| OpenHue (port 3100) | Not installed — SquarePayouts is the confirmed owner of 3100 |
| Hermes web gateway (port 3001) | Hermes runs as LaunchAgent messaging gateway, not web |

---

## Update Rule

Update this file whenever:
- A new service is added or removed
- A port number changes
- A service owner changes
- A health endpoint or access path changes

Add a short note with date and initials when updating an entry.

---

## Notes

- Port 3001 and Hermes gateway: No conflict. Bakery owns 3001 as a Next.js web app. Hermes gateway is a messaging-only LaunchAgent — it does not use a web port.
- Port 3100 and OpenHue: No conflict. SquarePayouts owns 3100. OpenHue is not installed.
- Binance bot (8104): **STOPPED** 2026-05-07 — pre-trade-hook module missing, awaiting Phase 2 restoration.
- Money pipeline (8020): Monitor closely — 8 PM2 restarts as of 2026-05-07 audit.