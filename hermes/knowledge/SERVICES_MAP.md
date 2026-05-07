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

| Service | Port | Purpose | Owner | Health Check / Access | Notes |
|---------|------|---------|-------|------------------------|-------|
| ASSUMED: Hermes gateway | 3001 | Hermes agent gateway / TUI support service | bossman | `curl localhost:3001/health` | VERIFY NEEDED |
| ASSUMED: OpenHue | 3100 | Philips Hue or home automation control service | ops | `curl localhost:3100/api/health` | VERIFY NEEDED |
| ASSUMED: Hermes dashboard | 5050 | Monitoring or dashboard UI | ops | `http://localhost:5050` | VERIFY NEEDED |
| ASSUMED: App service 8100 | 8100 | General Hermes app/service instance | ops | `curl localhost:8100/health` | VERIFY NEEDED |
| ASSUMED: App service 8102 | 8102 | General Hermes app/service instance | ops | `curl localhost:8102/health` | VERIFY NEEDED |
| ASSUMED: Binance monitor | 8104 | Binance bot dashboard / trading monitor | trading | `http://localhost:8104` | VERIFY NEEDED |
| ASSUMED: App service 8110 | 8110 | General Hermes app/service instance | ops | `curl localhost:8110/health` | VERIFY NEEDED |
| ASSUMED: App service 8130 | 8130 | General Hermes app/service instance | ops | `curl localhost:8130/health` | VERIFY NEEDED |
| ASSUMED: App service 8140 | 8140 | General Hermes app/service instance | ops | `curl localhost:8140/health` | VERIFY NEEDED |
| ASSUMED: Crypto tracker | 8020 | Crypto portfolio / price tracker dashboard | trading | `http://localhost:8020` | VERIFY NEEDED |
| ASSUMED: Web service | 8090 | General web service or local UI | builder | `curl localhost:8090/health` | VERIFY NEEDED |

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

| Port | Owner | Service |
|------|-------|---------|
| 3001 | bossman | ASSUMED: Hermes gateway |
| 3100 | ops | ASSUMED: OpenHue |
| 5050 | ops | ASSUMED: Hermes dashboard |
| 8020 | trading | ASSUMED: Crypto tracker |
| 8090 | builder | ASSUMED: Web service |
| 8100 | ops | ASSUMED: App service 8100 |
| 8102 | ops | ASSUMED: App service 8102 |
| 8104 | trading | ASSUMED: Binance monitor |
| 8110 | ops | ASSUMED: App service 8110 |
| 8130 | ops | ASSUMED: App service 8130 |
| 8140 | ops | ASSUMED: App service 8140 |

