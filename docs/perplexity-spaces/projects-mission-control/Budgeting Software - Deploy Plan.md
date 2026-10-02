**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/DEPLOY_PLAN.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 2 Deploy Plan

**Phase:** 2 of 10
**Date:** 2026-07-21
**Parent:** `ARCHITECTURE.md`
**Status:** Deploy plan locked 2026-07-21 (Phase 2 closed; Phase 3 MVP live 2026-07-22; Phase 4+ paused)

---

## 1. Process manager

**Port note (2026-07-22):** Originally specified port 8130, but 8130 is reserved for `trading-control` in the live BossMan hub `services-registry.yaml`. Substitute port **8145** is approved by Marcelo (2026-07-22). All references in this doc and the registry now use 8145.

**PM2** (already in the stack — 6 processes currently online: `binance-bot`, `health-os-v3`, `health-os-v4`, `money-pipeline`, `pmd-web`, `pmd-api`).

**New process:** `budgeting-software` on port **`8145`** (NOT 8130 — that port is reserved for `trading-control` in `services-registry.yaml`).

**Ecosystem file:** `~/Projects/budgeting/ecosystem.config.cjs` (standalone, registered with `pm2 start ecosystem.config.cjs`).

```js
// ~/Projects/budgeting/ecosystem.config.cjs
// PM2 config for BudgetingSoftware
//
// Pinned 2026-07-21:
//   - Hermes-arm64 node interpreter (matches PMD pattern)
//   - HOSTNAME=127.0.0.1 (local-only; Caddy on BossMan hub proxies external)
//   - Tailscale serve / Caddy path: /budgeting/* → :8145 (Caddy not enabled)

'use strict';

module.exports = {
  apps: [
    {
      name: 'budgeting-software',
      namespace: 'default',

      // --- startup ---
      script: 'server/app.js',
      cwd: '/Users/bigdawg/Projects/budgeting',

      // --- restart policy ---
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 1000,

      // --- env ---
      env: {
        NODE_ENV: 'production',
        HOSTNAME: '127.0.0.1',
        PORT: '8145',
        BUDGETING_DB_PATH: '/Users/bigdawg/Projects/budgeting/data/budgeting.sqlite',
        BUDGETING_UPLOAD_DIR: '/Users/bigdawg/Projects/budgeting/data/uploads',
        BUDGETING_ARCHIVE_DIR: '/Users/bigdawg/Projects/budgeting/data/archive',
        // Session secret is inlined from .env at process start (PM2 does not source .env)
        // Operator must rotate BUDGETING_SESSION_SECRET per Phase 2 setup
        // (will be moved to .env-source at process-start in Phase 3)
      },

      // --- resource guard ---
      max_memory_restart: '500M',

      // --- interpreter ---
      interpreter: '/Users/bigdawg/.hermes/node/bin/node',

      // --- logging ---
      out_file: '/Users/bigdawg/.hermes/logs/budgeting-software-out.log',
      error_file: '/Users/bigdawg/.hermes/logs/budgeting-software-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // --- PM2 self-heal ---
      watch: false,
      kill_timeout: 5000,
    },
  ],
};
```

## 2. Reverse proxy (Caddy via BossMan hub)

**Status (2026-07-22): Caddy is NOT enabled on this machine.** The `~/Projects/boss-hub/Caddyfile` does not exist (only `Caddyfile.unauthorized` exists); there is no live Caddy PM2 process. PMD and other services are served via direct Tailscale serve (e.g. `https://bigdawgs-mac--studio.tailed3212.ts.net/` proxies to `localhost:3535` via `tailscale serve` (history — 3535 is retired; Travel OS is 3537 and PMD is served at /pmd → 7575), not via Caddy). For Phase 3, BudgetingSoftware is accessible directly at `http://127.0.0.1:8145/` or via Tailscale. When Caddy is later re-enabled (separate Phase 9+ carve-out), the path-strip rule below will be added to `~/Projects/boss-hub/Caddyfile`.

The BossMan hub *would* run Caddy on port 2015 (when enabled), serving `https://bigdawgs-mac--studio.tailed3212.ts.net/*` with path-strip rules (PMD lives at `/pmd/*`).

**New rule** (added to `~/Projects/boss-hub/Caddyfile`):

```
handle /budgeting/* {
    uri strip_prefix /budgeting
    reverse_proxy 127.0.0.1:8145
}
```

**Reload Caddy:** `cd ~/Projects/boss-hub && pm2 restart caddy`.

**External URL (planned, pending Caddy re-enable):** `https://bigdawgs-mac--studio.tailed3212.ts.net/budgeting/` (Tailscale-only; no public exposure in v1). **Current access:** `http://127.0.0.1:8145/` directly (local PM2 process).

## 3. Cold storage — OneDrive via rclone

**Status:** **`rclone` is NOT installed on this Mac** (`which rclone` returns nothing). This is a Phase 9 dependency, surfaced here as a Marcelo approval gate.

**Phase 9 deliverable (not Phase 2):** install rclone and create the OneDrive remote.

**Step-by-step (Phase 9, not Phase 2):**

1. `brew install rclone` — installs to `/opt/homebrew/bin/rclone`
2. `rclone config` — interactive:
   - name: `onedrive-budgeting`
   - type: `onedrive`
   - OAuth: walk through browser login to Marcelo's Microsoft account
   - region: `global` (default)
   - drive: pick the appropriate OneDrive (personal / business)
3. Test: `rclone ls onedrive-budgeting:` — should list root
4. Add to Phase 2 cron (below)

**Phase 2 deliverable (now):** document the dependency + add `brew install rclone` to the Phase 9 carve-out list.

## 4. PM2 health-check

The `pm2-health-check` skill (`~/.hermes/skills/pm2-health-check/`) already monitors the existing 6 PM2 processes every 5 minutes. Adding `budgeting-software` to the monitored set is **automatic** — any process under PM2 is included.

**Verification:** `pm2 list | grep budgeting-software` should show `status: online` within 30 seconds of `pm2 start`.

## 5. Backups

**Daily DB backup** via `scripts/db-backup.sh`:

```bash
#!/bin/bash
# scripts/db-backup.sh — sqlite3 .backup cron
# Runs daily at 03:00 PT (cron below)

set -euo pipefail

DB_PATH="${BUDGETING_DB_PATH:-/Users/bigdawg/Projects/budgeting/data/budgeting.sqlite}"
BACKUP_DIR="/Users/bigdawg/Projects/budgeting/data/backups"
TS=$(date +%Y%m%d_%H%M%S)
KEEP_DAYS=7

mkdir -p "$BACKUP_DIR"

# sqlite3 .backup is the safe online backup (no race with writers)
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/budgeting_${TS}.sqlite'"

# gzip the backup
gzip "$BACKUP_DIR/budgeting_${TS}.sqlite"

# prune anything older than KEEP_DAYS
find "$BACKUP_DIR" -name "budgeting_*.sqlite.gz" -mtime +$KEEP_DAYS -delete

echo "Backup complete: budgeting_${TS}.sqlite.gz"
```

**Cron registration (Hermes cron, not Unix cron):**

```
hermes cron create \
  --name "BudgetingSoftware DB Backup" \
  --schedule "0 3 * * *" \
  --script scripts/db-backup.sh \
  --deliver local
```

**Phase 2 deliverable:** write the script; cron registration happens in Phase 3 (after first run works).

## 6. rclone mirror cron (Phase 9)

```
hermes cron create \
  --name "BudgetingSoftware → OneDrive archive mirror" \
  --schedule "30 23 * * *" \
  --script scripts/rclone-mirror.sh \
  --deliver local
```

`scripts/rclone-mirror.sh` (placeholder, defined in Phase 9):

```bash
#!/bin/bash
# Push this week's archive/YYYY folders to OneDrive
# Triggered after Year-end rollover + on weekly safety-net schedule
rclone copy /Users/bigdawg/Projects/budgeting/data/archive/ \
  onedrive-budgeting:BudgetingSoftware/archive/ \
  --log-file=/Users/bigdawg/.hermes/logs/budgeting-rclone.log
```

## 7. STORIS daily sync cron (Phase 7)

```
hermes cron create \
  --name "BudgetingSoftware STORIS daily sync" \
  --schedule "0 6 * * *" \
  --script scripts/storis-daily-sync.js \
  --deliver local
```

Uses `MockStorisClient` by default; swaps to `RealStorisClient` when sandbox creds arrive.

## 8. Log rotation

PM2 handles rotation internally (`pm2 install pm2-logrotate` if not already; check with `pm2 list | grep pm2-logrotate`).

Current log location: `~/.hermes/logs/budgeting-software-{out,err}.log` — matches PMD pattern.

## 9. Health check endpoint

`GET /health` returns:

```json
{
  "ok": true,
  "version": "0.1.0",
  "db_ok": true,
  "rclone_ok": true,
  "rclone_configured": true,
  "storis_mode": "mock",
  "session_count": 3,
  "uptime_seconds": 86400
}
```

PM2 health-check skill probes this every 5 minutes; failure → Telegram alert to Marcelo.

## 10. First-run checklist

```bash
# 1. Apply DB schema
cd ~/Projects/budgeting
node server/migrate.js

# 2. Seed Company + Departments + Categories + Admin user
node scripts/one-time-seed.js
# → prints Admin email + random password (rotate after first login)

# 3. Start PM2 process
pm2 start ecosystem.config.cjs
pm2 save

# 4. Add Caddy path-strip rule
# → edit ~/Projects/boss-hub/Caddyfile (see §2)
pm2 restart caddy

# 5. Verify health
curl -fsS http://127.0.0.1:8145/health | jq

# 6. Open in browser (Tailscale)
open "https://bigdawgs-mac--studio.tailed3212.ts.net/budgeting/login"

# 7. Log in as Admin → rotate password → start using
```

## 11. Environment variables (canonical list)

All in `.env.example` (gitignored copy at `.env`):

| Var | Required | Default | Notes |
|---|:-:|---|---|
| `NODE_ENV` | yes | `production` | |
| `HOSTNAME` | yes | `127.0.0.1` | local-only |
| `PORT` | yes | `8145` | |
| `BUDGETING_DB_PATH` | yes | `data/budgeting.sqlite` | absolute or relative to cwd |
| `BUDGETING_UPLOAD_DIR` | yes | `data/uploads` | |
| `BUDGETING_ARCHIVE_DIR` | yes | `data/archive` | |
| `BUDGETING_SESSION_SECRET` | yes | — | 32-byte random; rotate on compromise |
| `BUDGETING_SESSION_TTL_MS` | no | `28800000` | 8 hours |
| `SEED_ADMIN_EMAIL` | no | `admin@localhost` | first-run only |
| `STORIS_MODE` | no | `mock` | `mock` \| `real` |
| `STORIS_API_BASE_URL` | when real | — | from integrator |
| `STORIS_API_USER` | when real | — | from integrator |
| `STORIS_API_SECRET` | when real | — | from integrator |
| `STORIS_TOKEN_CACHE_PATH` | yes | `data/.storis-token.json` | mode 0600 |
| `ONEDRIVE_REMOTE` | Phase 9 | — | rclone remote name |
| `ONEDRIVE_ARCHIVE_PATH` | Phase 9 | `BudgetingSoftware/archive` | path within remote |

## 12. Monitoring & alerts

- **PM2 health-check** — every 5 min (existing skill, auto-includes new process)
- **Disk space check** — `data/` should not exceed 5 GB (1 GB SQLite + 4 GB uploads) — alert at 80%
- **rclone failures** — log to `budgeting-rclone.log`; alert if 3 consecutive failures
- **Login failures** — alert if >10/hour from single IP

## 13. Approval gates

| Gate | Trigger | Approval from |
|---|---|---|
| `brew install rclone` | new system dependency (Phase 9) | Marcelo (v3 carve-out — infra install) |
| OneDrive OAuth | external service integration (Phase 9) | Marcelo (v3 carve-out — vendor / billing / auth) |
| Caddy path-strip | new public route (Phase 3) | Marcelo (v3 carve-out — public-port / domain) |
| STORIS sandbox creds | when they arrive (Phase 7) | BossMan config swap (no approval needed) |
| First PM2 registration | new process (Phase 3) | Marcelo (v3 carve-out — PM2 / cron) |

## 14. Open issues for Phase 3

- `BUDGETING_SESSION_SECRET` is hardcoded in `ecosystem.config.cjs` initially (PM2 doesn't source .env). Phase 3 should move it to a startup-loader pattern (read .env at app boot).
- Decide whether `npm install` should run inside `~/Projects/budgeting` or a vendored location. Recommend project-local.
- `.gitignore` excludes `data/`, `data/uploads/`, `data/archive/`, `data/backups/`, `.env`, `*.sqlite`, `node_modules/`. Verify nothing else is leaked.

---

**Status:** Deploy plan locked. Phase 3 can apply.