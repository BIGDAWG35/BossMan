# LBC35 Infrastructure Coordination Prompts

Infrastructure coordination prompts for BossMan operations on the LBC35 on-prem host.

---

## Port Status Snapshot

**Use this when you need a quick health overview of all LBC35 services.**

```
Run a bulk health check across all active ports (3001, 3100, 5050, 8090, 8100, 8102,
8104, 8110, 8130, 8140, 8020). Report UP/DOWN per port and any that have changed
state since last check. See docs/services-map.md for expected status codes.
```

---

## Service Restart

**Use this when a specific service needs restarting on LBC35.**

```
SSH to LBC35 and restart the service on port [PORT_NUMBER].

Steps:
1. Identify the service name for port [PORT] (check services-map.md)
2. SSH to the host using the configured SSH key
3. Check current service status (systemctl/status process)
4. Restart the service
5. Verify health check returns UP
6. Report back with before/after status

Service: [SERVICE_NAME]
Port: [PORT_NUMBER]
```

---

## Log Retrieval

**Use this when you need to pull logs from LBC35 for a specific service.**

```
Retrieve the last 100 lines of logs for the service on port [PORT].
Use SSH to access the host and pull logs from the appropriate log location
(typically /var/log/[service]/ or runtime logs).
Filter for ERROR and WARN entries.
Report back the filtered results.
```

---

## Backup Verification

**Use this to verify that the backup process on port 8020 is functioning.**

```
Check the backup service on port 8020 (TCP).
Verify:
1. The rsync target is reachable (nc -z localhost 8020)
2. Last backup timestamp (check /mnt/backup or configured backup path)
3. Backup retention policy is being enforced
4. Any failed backup jobs in the log

Report: Last successful backup time, next scheduled backup, and any failures.
```

---

## Cache Invalidation (Port 8110)

**Use this when the cache layer needs flushing.**

```
Query the cache service on port 8110.
Perform a cache invalidation for key pattern [PATTERN] (or flush all if unspecified).
Verify cache stats before and after (hit/miss ratio).
Report the cache state after invalidation.
```

---

## Queue Depth Check (Port 8104)

**Use this to check for backed-up jobs in the queue processor.**

```
Query the queue processor on port 8104.
Report:
- Current queue depth (pending jobs)
- Processing rate (jobs/minute)
- Dead letter queue size
- Any stalled or retrying jobs

Flag if queue depth exceeds normal threshold.
```

---

## New Service Onboarding

**Use this when adding a new service to the LBC35 infrastructure.**

```
Add a new service to the LBC35 infrastructure with the following details:
- Service name: [NAME]
- Port: [PORT]
- Health check endpoint: [URL]
- Start command / systemd unit: [COMMAND]

Steps:
1. Update services-map.md with the new service
2. Add health check script to monitoring (port 5050)
3. Configure log rotation for the service
4. Update .env.example if new env vars are needed
5. Verify the service starts and responds to health checks
6. Update lbc35-infra.md with any new coordination prompts
```

---

## All Ports Reference

Active ports currently registered on LBC35:

| Port  | Service          |
|-------|------------------|
| 3001  | Service A        |
| 3100  | Service B        |
| 5050  | Monitoring Agent |
| 8090  | API Gateway      |
| 8100  | Worker Pool      |
| 8102  | Auth Service     |
| 8104  | Queue Processor  |
| 8110  | Cache Layer      |
| 8130  | Notification Svc |
| 8140  | Scheduler        |
| 8020  | Backup / Archive |

Full details: [`docs/services-map.md`](../docs/services-map.md)
