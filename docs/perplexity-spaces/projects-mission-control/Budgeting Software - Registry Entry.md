**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/system-health/budgeting-software-registry-entry.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

---
date: 2026-07-22
source: ~/Projects/boss-hub/registry/services-registry.yaml
v3_canon: true
---

# BudgetingSoftware — services-registry.yaml entry (V3 mirror)

> **2026-10-02 correction:** This is a 2026-07-22 copy. The 2026-10-02 services registry snapshot lists `budgeting-software` (8145, online) under category 'Revenue App', not 'Finance'. Source of truth: `~/Projects/boss-hub/registry/services-registry.yaml` / `knowledge/SERVICES_MAP_SNAPSHOT_2026-10-02.md`.

```yaml
- category: Finance
  expose_externally: false
  external_url: null
  health_check:
    expect_status: 200
    health_path: /health
    method: GET
    timeout_ms: 5000
  launchd_label: null
  lifecycle: active
  local_url: http://localhost:8145
  name: BudgetingSoftware (Pilot IT)
  notes: Single-tenant SMB budgeting app (Pilot Co). Port 8145 (not 8130, reserved
    for trading-control). Live 2026-07-22; Phase 3 MVP. Login + budget years + line
    items + Excel import dry-run + DRAFT to IN_REVIEW to APPROVED workflow + STORIS
    mock client + audit logging. Caddy intentionally NOT enabled on this machine;
    access via http at 127.0.0.1:8145 or via Tailscale. Source at ~/Projects/budgeting/.
    Spec at ~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-07_budgeting-software/.
    14 SQLite tables (WAL); better-sqlite3-session-store; bcrypt; per-session HMAC
    CSRF; audit_log retained indefinitely per Q2.2 hard requirement.
  pm2_cwd: /Users/bigdawg/Projects/budgeting
  pm2_name: budgeting-software
  pm2_script: server/app.js
  port: 8145
  run_mode: persistent
  slug: budgeting-software
  status_hint: online
```

## Notes
- **Port**: 8145 (NOT 8130 — 8130 is reserved for trading-control per the live registry)
- **Caddy**: intentionally NOT enabled on this machine. PMD and other services are served via direct Tailscale serve (not Caddy). BudgetingSoftware currently accessible at http://127.0.0.1:8145/ locally, or via Tailscale directly.
- **Health check**: GET http://localhost:8145/health returns 200 + JSON status (verified 2026-07-22)
- **PM2 name**: budgeting-software (verified online via `pm2 list`)
- **Source of truth**: this entry in services-registry.yaml is the canonical registration for the BossMan hub.
