# Mission Control Dashboard — Port 8001

**Source:** Phase 1 audit, SERVICES_MAP.md
**Status:** ✅ Active — Overview dashboard

---

## Service Details

| Attribute | Value |
|-----------|-------|
| PM2 Name | `overview` |
| Port | 8100 (NOT 8001 — note below) |
| Health Check | `curl localhost:8100` |
| Status | ✅ Active — 6D uptime |
| Type | Node.js web |

---

## Important Note

**Port 8001 is NOT Mission Control.**

The SERVICES_MAP.md shows:
- Overview dashboard: port **8100** (PM2 name: `overview`)
- Port 8001 is referenced in OpenClaw TOOLS.md but is NOT in the current SERVICES_MAP

**Actual Mission Control:** Port 8100 (`overview` dashboard)

This may be a naming inconsistency from the OpenClaw era. The `overview` dashboard at port 8100 appears to be what was referred to as "Mission Control" or "Overview" in older docs.

---

## Quick Access

```bash
# Check if overview is running
pm2 list | grep overview

# Access locally
curl localhost:8100

# Confirm port 8001 status (should be nothing)
curl localhost:8001
```

---

## Dashboard Purpose

Based on Phase 1 audit, this dashboard likely provides:
- Overview of multiple services
- System health at a glance
- PM2 process status view

---

## Cleanup Needed

The discrepancy between port 8001 (old Mission Control reference) and port 8100 (actual Overview dashboard) should be clarified in a future update to SERVICES_MAP.md.

**Action:** During Phase 6, verify what port 8001 was supposed to be and clean up the reference if it's retired.