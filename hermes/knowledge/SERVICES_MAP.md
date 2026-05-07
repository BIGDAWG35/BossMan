# SERVICES_MAP.md
# Location: ~/.hermes/knowledge/SERVICES_MAP.md
# Purpose: Local source of truth for services, ports, owners, and health checks.
# ops and debug use this during incidents. Do not depend on GitHub during outages.

---

## How to Use This File

When a service issue comes in:

1. Identify the service name or port.
2. Find the matching row in the table below.
3. Use the owner field to route correctly.
4. Use the health check or access path to confirm status.
5. If a row is uncertain, treat it as unverified and escalate after checking PM2, open ports, or repo config.

---

## Update Rule

Update this file whenever:

- A new service is added or removed
- A port number changes
- A service owner changes
- A health endpoint or access path changes

Add a short note with date and initials when updating an entry.

---

## Service Map

| Service | Port | Purpose | Owner | Health Check / Access | Tailscale | Notes |
|---------|------|---------|-------|------------------------|-----------|-------|
| Hermes gateway | 3001 | Hermes agent gateway / TUI support service | bossman | `curl localhost:3001/health` | localhost only | redwood-broker |
| OpenHue | 3100 | Home automation control service | ops | `curl localhost:3100/api/health` | localhost only | opcon-xps |
| Hermes dashboard | 9119 | Hermes web dashboard (Host header = bound hostname enforced) | bossman | `http://localhost:9119` | **localhost only — NOT via Tailscale Serve** | mmcc |
| Web service | 8090 | General web service or local UI | builder | `curl localhost:8090/health` | **tailnet-only (serve active)** | accessible at https://bigdawgs-mac-mini.tailed3212.ts.net/ |
| XPrint server | 8100 | Print service | ops | `curl localhost:8100/health` | localhost only | xprint-server |
| App service | 8102 | General Hermes app/service instance | ops | `curl localhost:8102/health` | localhost only | - |
| Binance monitor | 8104 | Binance bot dashboard / trading monitor | trading | `http://localhost:8104` | localhost only | - |
| App service | 8110 | General Hermes app/service instance | ops | `curl localhost:8110/health` | localhost only | - |
| Indigo VRMI | 8130 | VR/hardware interface | ops | `curl localhost:8130/health` | localhost only | indigo-vrmi |
| App service | 8140 | General Hermes app/service instance | ops | `curl localhost:8140/health` | localhost only | - |
| Crypto tracker | 8020 | Crypto portfolio / price tracker dashboard | trading | `http://localhost:8020` | localhost only | intu-ec-svcdisc |

> **Last verified:** 2026-05-07. Verified via `lsof -i :PORT`. All ports confirmed LISTENING.

---

## How to Verify Unknown Entries

If a row is marked `VERIFY NEEDED`:

1. Check PM2:
   - `pm2 list`
2. Check what is listening on the port:
   - `lsof -i :PORT`
   - `netstat -an | grep PORT`
3. Check the relevant repo or config for the service definition.
4. Replace `ASSUMED` with the confirmed service name.
5. Update health path, owner, and notes if needed.

---

## Quick Port Lookup

| Port | Owner | Service | Tailscale |
|------|-------|---------|-----------|
| 3001 | bossman | Hermes gateway | localhost only |
| 3100 | ops | OpenHue | localhost only |
| 9119 | bossman | Hermes dashboard | localhost only — NOT via Tailscale Serve |
| 8020 | trading | Crypto tracker | localhost only |
| 8090 | builder | Web service | **tailnet-only (serve active)** |
| 8100 | ops | XPrint server | localhost only |
| 8102 | ops | App service 8102 | localhost only |
| 8104 | trading | Binance monitor | localhost only |
| 8110 | ops | App service 8110 | localhost only |
| 8130 | ops | Indigo VRMI | localhost only |
| 8140 | ops | App service 8140 | localhost only |

