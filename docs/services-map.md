# LBC35 Services Map

Active services and ports on the LBC35 on-prem infrastructure.

## Active Ports

| Port  | Service          | Protocol | Health Check                  | Notes                          |
|-------|------------------|----------|-------------------------------|--------------------------------|
| 3001  | Service A        | HTTP     | `curl localhost:3001/health`  | Primary user-facing service    |
| 3100  | Service B        | HTTP     | `curl localhost:3100/status`  | Secondary API layer            |
| 5050  | Monitoring Agent | HTTP     | `curl localhost:5050/metrics` | Prometheus-compatible metrics  |
| 8090  | API Gateway      | HTTP     | `curl localhost:8090/ping`     | Routes to backend services     |
| 8100  | Worker Pool      | HTTP     | `curl localhost:8100/health`   | Async job processing           |
| 8102  | Auth Service     | HTTP     | `curl localhost:8102/ready`    | JWT issuance and validation    |
| 8104  | Queue Processor  | HTTP     | `curl localhost:8104/status`  | Message queue consumer         |
| 8110  | Cache Layer      | HTTP     | `curl localhost:8110/stats`   | Redis-compatible cache         |
| 8130  | Notification Svc | HTTP     | `curl localhost:8130/health`   | Email/push notification relay  |
| 8140  | Scheduler        | HTTP     | `curl localhost:8140/alive`   | Cron job coordinator           |
| 8020  | Backup / Archive | TCP      | `nc -z localhost 8020`        | Rsync target for backups       |

## Health Check Command

```bash
# Bulk health check all services
for port in 3001 3100 5050 8090 8100 8102 8104 8110 8130 8140 8020; do
  result=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/health 2>/dev/null)
  echo "Port $port: $result"
done
```

## Adding a New Service

1. Assign an unused port from the reserved range (2900–2999 for new services)
2. Add entry to this table
3. Update `prompts/lbc35-infra.md` if the service needs coordinated prompts
4. Document health check endpoint

## Deprecated Ports

| Port  | Former Service     | Retired | Reason                  |
|-------|---------------------|---------|-------------------------|
| 8000  | OpenClaw gateway    | 2026-04  | Replaced by Hermes/BossMan |
| 8080  | Legacy API          | 2026-04  | Migrated to port 8090   |
| 8888  | OpenClaw dashboard  | 2026-04  | Decommissioned          |
