**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/ARCHITECTURE.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 2 Architecture

> **2026-10-02 correction:** Budgeting Software runs on port 8145, not 8130 (8130 = trading-control), and Caddy is not enabled on this machine; read every 8130/Caddy reference in the diagram and tables below as history.

**Phase:** 2 of 10
**Date:** 2026-07-21
**Parent:** `PROJ-Overview.md` → `PROJ-2026-07_budgeting-software_Phase1_Plan.md`
**Status:** Architecture locked 2026-07-21 (Phase 2 closed; Phase 3 MVP live 2026-07-22; Phase 4+ paused)

---

## 1. High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Mac Studio M4 Max                         │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │        BossMan Hub (existing)            │                    │
│  │   Tailscale serve / Caddy proxy / :8161  │                    │
│  └─────────────────────────────────────────┘                    │
│           ▲                                                      │
│           │ PM2 + ecosystem.config.cjs                          │
│           │                                                      │
│  ┌────────┴─────────────────────────────────────────┐           │
│  │         budgeting-software (PM2 process)          │           │
│  │         Express + server-rendered HTML             │           │
│  │         port 8130 (Tailscale + Caddy path)         │           │
│  │                                                  │           │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │           │
│  │  │ routes/  │ │ lib/     │ │ views/ (HTML)    │ │           │
│  │  │  - auth  │ │ - db.js  │ │  - layout.ejs    │ │           │
│  │  │  - dashb │ │ - auth  │ │  - dashboard     │ │           │
│  │  │  - budget│ │ - storis │ │  - budget-year   │ │           │
│  │  │  - revw  │ │   client │ │  - import        │ │           │
│  │  │  - impt  │ │ - rclne │ │  - contracts     │ │           │
│  │  │  - cntrt │ │   mirror │ │  - settings      │ │           │
│  │  │  - setng │ │ - audit  │ │  - auth/login    │ │           │
│  │  │  - admin │ │ - exel   │ │                  │ │           │
│  │  │  - api   │ │   import │ │                  │ │           │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │           │
│  └──────────────────────────────────────────────────┘           │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌──────────────────┐    ┌────────────────────┐                  │
│  │ SQLite primary   │    │ rclone → OneDrive  │                  │
│  │ data/budgeting.  │    │ (cold archive)     │                  │
│  │  sqlite          │    │                    │                  │
│  └──────────────────┘    └────────────────────┘                  │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────┐                        │
│  │ Optional: STORIS ERP (vendor)       │                        │
│  │  lib/storis-client.js               │                        │
│  │   MockStorisClient (default)        │                        │
│  │   RealStorisClient (when sandbox)   │                        │
│  └─────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

**Single Node + Express process** (like PMD API on port 7576, but with HTML views inline — no separate Next.js for v1 to keep the stack minimal). Authentication, CRUD, import, contracts, STORIS sync, and admin all live in one Express app.

## 2. Reuse vs new

| Capability | Reuse from existing stack | New for this project |
|---|---|---|
| Process manager | PM2 (ecosystem entry in `~/Projects/budgeting/ecosystem.config.cjs`) | — |
| Reverse proxy | Caddy via BossMan hub Tailscale serve | path-strip rule (`/budgeting/*` → `:8130`) |
| Log location | `~/.hermes/logs/budgeting-{out,err}.log` (matches PMD pattern) | — |
| Health check | PM2 health-check skill (existing) | — |
| DB driver | better-sqlite3 (matches PMD) | — |
| Auth (sessions) | express-session + bcrypt (Node-native, no SaaS dep) | — |
| Cold storage | — | rclone to OneDrive (NEW dependency — Phase 9) |
| Excel parsing | — | SheetJS (`xlsx` package) + `csv-parse` |
| PDF parsing | — | AWS Textract or `pdf-parse` (deferred to Phase 5) |
| STORIS client | — | `lib/storis-client.js` interface + `MockStorisClient` |
| Frontend | — | Server-rendered EJS + vanilla JS + minimal CSS (no React/SPA) |
| Dark mode | — | CSS variables, `prefers-color-scheme` |

## 3. Module layout

```
~/Projects/budgeting/
├── server/
│   ├── app.js                  # Express app entry (called by PM2)
│   ├── config.js               # env var loading, paths
│   ├── db.js                   # better-sqlite3 instance + withTx helper
│   ├── migrate.js              # Apply schema.sql to a fresh DB
│   ├── schema.sql              # The locked Phase 2 schema (DB_SCHEMA.md)
│   ├── seed.js                 # Seed Company + Department + Categories + sample user
│   ├── auth.js                 # bcrypt + session middleware + role gates
│   ├── audit.js                # audit_log writer (every mutation)
│   ├── routes/
│   │   ├── auth.js             # POST /login, POST /logout
│   │   ├── dashboard.js        # GET /dashboard
│   │   ├── budget-years.js     # GET/POST /budget-years, /:id
│   │   ├── line-items.js       # GET/POST/PUT/DELETE
│   │   ├── review.js           # POST /review/:budget_year_id/approve|reject
│   │   ├── import.js           # POST /import (upload), POST /import/:job_id/commit
│   │   ├── contracts.js        # GET/POST /contracts
│   │   ├── settings.js         # GET/POST /settings
│   │   ├── admin.js            # Admin-only: users, departments, categories
│   │   ├── api.js              # JSON API endpoints for Excel import batch + scripts
│   │   └── health.js           # GET /health (PM2 health-check)
│   ├── lib/
│   │   ├── storis-client.js    # Interface (StorisClient) — exports `getStorisClient()`
│   │   ├── mock-storis.js      # Returns fixture data
│   │   ├── real-storis.js      # Real STORIS HTTP client (Phase 7)
│   │   ├── excel-import.js     # SheetJS wrapper + column-mapping engine
│   │   ├── audit.js            # logAction({user_id, action, entity_type, entity_id, before, after})
│   │   ├── archive.js          # Year-end rollover: dump to JSON, push to OneDrive
│   │   ├── rclone.js           # Wrapper: rclone copy / rclone ls / rclone sync
│   │   └── period-utils.js     # Fiscal year start, period1..period12 helpers
│   └── views/
│       ├── layout.ejs          # header/footer + dark-mode toggle
│       ├── login.ejs
│       ├── dashboard.ejs       # Grand total, variance %, contracts expiring
│       ├── budget-year.ejs     # Year detail + line items grid
│       ├── budget-year-list.ejs
│       ├── line-item-form.ejs  # Add/edit line item
│       ├── review.ejs          # Approve/reject UI for Reviewers
│       ├── import-upload.ejs   # Upload + dry-run preview
│       ├── import-mapping.ejs  # Column-mapping UI
│       ├── import-commit.ejs   # Confirmation + result
│       ├── contracts.ejs       # Contract list + alerts
│       ├── settings.ejs        # Departments, categories, users, roles
│       └── partials/           # Small reusable EJS partials
├── data/
│   ├── budgeting.sqlite        # Primary DB
│   ├── uploads/                # Temporary PDF/Excel/CSV (post-parse, archive)
│   ├── archive/                # Local mirror of OneDrive
│   │   └── YYYY/               # One folder per fiscal year
│   └── backups/                # sqlite3 .backup rolling 7 days
├── logs/                       # Local fallback log mirror (rotated weekly)
├── scripts/
│   ├── rollover-year.js        # Cron-triggered: archive + rclone push
│   ├── storis-daily-sync.js    # Cron-triggered: pull Budgets + Summary
│   ├── db-backup.sh            # sqlite3 .backup cron
│   └── one-time-seed.js        # Idempotent first-run seeding
├── test/
│   ├── fixtures/
│   │   ├── user_budget.xlsx    # copy of ~/Projects/budgeting/user_budget.xlsx
│   │   └── mock-storis.json    # Fixture STORIS responses
│   ├── auth.test.js
│   ├── budget-year.test.js
│   ├── excel-import.test.js    # Maps EXCEL_EXAMPLE.md → known line items
│   ├── storis-mock.test.js
│   └── review-workflow.test.js
├── ecosystem.config.cjs        # PM2 config (registered in BossMan hub later)
├── package.json
├── .env.example                # Documents all env vars (STORIS_*, ONEDRIVE_*, BUDGETING_*)
├── .gitignore                  # excludes data/, uploads/, .env, *.sqlite
└── README.md                   # Quickstart + dev commands
```

## 4. Process model

- **PM2 process name:** `budgeting-software`
- **Port:** `8145` (was 8130 — reserved for trading-control; changed 2026-07-22). Caddy is NOT enabled; access is http://127.0.0.1:8145 or Tailscale
- **Interpreter:** `/Users/bigdawg/.hermes/node/bin/node` (matches PMD pattern)
- **Restart policy:** autorestart, max_restarts=10, min_uptime=10s, restart_delay=1000
- **Memory guard:** max_memory_restart=500M
- **Working directory:** `/Users/bigdawg/Projects/budgeting`

## 5. Routing

```
GET  /                          → redirect to /dashboard (or /login if not authed)
GET  /login                     → login form
POST /login                     → authenticate, set session
POST /logout                    → destroy session

GET  /dashboard                 → grand total, variance %, contracts expiring, health
GET  /budget-years              → list all years (DRAFT/IN_REVIEW/APPROVED/ACTIVE/ROLLED)
GET  /budget-years/new          → form: create new budget year
POST /budget-years              → create new year (Editor+)
GET  /budget-years/:id          → year detail + line items grid (Editor can edit if DRAFT)
POST /budget-years/:id/submit   → DRAFT → IN_REVIEW (Editor)
POST /budget-years/:id/approve  → IN_REVIEW → APPROVED (Reviewer/Admin)
POST /budget-years/:id/reject   → IN_REVIEW → REJECTED + note (Reviewer/Admin)
POST /budget-years/:id/activate → APPROVED → ACTIVE (system, on fiscal-year-start date)
POST /budget-years/:id/rollover → ACTIVE → ROLLED_OVER (Editor, triggers archive)

GET  /budget-years/:id/items/new   → add line item form
POST /budget-years/:id/items       → create line item (Editor+, only if DRAFT/REJECTED)
GET  /items/:id/edit               → edit form
PUT  /items/:id                    → update (Editor+, only if parent year is DRAFT/REJECTED)
DELETE /items/:id                  → soft-delete (sets deleted_at)

GET  /import                       → upload form
POST /import                       → upload file, create import_job, redirect to mapping
GET  /import/:job_id               → mapping UI (preview first 5 rows, suggest mapping)
POST /import/:job_id/commit        → commit (or dry-run preview then commit)

GET  /contracts                    → list contracts + renewal alerts
GET  /contracts/new                → upload form (PDF or CSV)
POST /contracts                    → upload + parse

GET  /settings                     → admin: departments, categories, users, roles
POST /settings/departments         → CRUD
POST /settings/categories          → CRUD
POST /settings/users               → CRUD (Admin only)

GET  /health                       → {ok: true, version, db_ok, rclone_ok, storis_mode}
GET  /api/budget-years             → JSON (for scripts + future mobile)
GET  /api/items/:id                → JSON
POST /api/items/:id/actuals        → bulk update monthly actuals (Excel round-trip)
```

## 6. Data flow examples

### 6.1 Importing an Excel file

```
1. User clicks Import → POST /import (multipart, xlsx)
2. server: 
   - generate import_job_id (uuid)
   - save file to data/uploads/<job_id>/original.xlsx
   - read sheet names + first row of each (sheetjs)
   - INSERT import_jobs row (status='pending')
   - redirect to GET /import/<job_id>
3. UI: shows all sheets + headers; user maps "Budget Data" → line_items, etc.
4. User clicks "Dry run" → POST /import/<job_id>/dryrun
5. server:
   - applies saved mapping (or new mapping)
   - validates every row (Department/Category must exist)
   - returns preview with [OK] / [WARN: vendor missing] / [FAIL: unknown dept]
6. User confirms → POST /import/<job_id>/commit
7. server:
   - in one transaction:
     - INSERT line_items for each row
     - UPDATE import_jobs status='completed', result_json
     - audit_log: action='import_commit', entity_type='import_job', entity_id=<job_id>
   - redirect to /budget-years/<year_id>
```

### 6.2 Year-end rollover

```
1. Editor clicks "Rollover" on ACTIVE year
2. POST /budget-years/:id/rollover
3. server (in one transaction):
   - SELECT all line_items + monthly_actuals for this year
   - dump to data/archive/YYYY/budget_snapshot.json + monthly_actuals.json + audit_log.json
   - UPDATE budget_years SET status='ROLLED_OVER', archived_at=now()
   - keep in SQLite primary (still queryable) — archival to cold is separate
4. server (post-transaction):
   - archive.exec('rclone copy data/archive/YYYY/ onedrive-budgeting:archive/YYYY/')
   - on success, audit_log action='rollover_archived'
   - on failure, log error but don't fail the rollover (manual recovery OK)
5. server:
   - INSERT new budget_year (status='DRAFT', fiscal_year=YYYY+1)
   - auto-populate line_items from YYYY's actuals as next-year's "last_year_actual"
```

### 6.3 STORIS daily sync

```
1. Cron 06:00 daily triggers scripts/storis-daily-sync.js
2. script:
   - const sc = require('./lib/storis-client').getStorisClient()  // MockStorisClient or RealStorisClient
   - const budgets = await sc.getBudgets(fiscalYear=current)
   - const summary = await sc.getSummary(fiscalYear=current)
   - upsert into storis_cache table
3. UI reads storis_cache for the "STORIS comparison" view (Phase 7)
```

## 7. Configuration

`.env` (gitignored; documented in `.env.example`):
```
NODE_ENV=production
PORT=8145
HOSTNAME=127.0.0.1
BUDGETING_DB_PATH=/Users/bigdawg/Projects/budgeting/data/budgeting.sqlite
BUDGETING_UPLOAD_DIR=/Users/bigdawg/Projects/budgeting/data/uploads
BUDGETING_ARCHIVE_DIR=/Users/bigdawg/Projects/budgeting/data/archive
BUDGETING_SESSION_SECRET=<random 32 bytes>

# STORIS (optional in v1 — MockStorisClient works without these)
STORIS_MODE=mock                  # mock | real
STORIS_API_BASE_URL=              # https://api.storis.com (when real)
STORIS_API_USER=                  # API user (from integrator)
STORIS_API_SECRET=                # secret
STORIS_TOKEN_CACHE_PATH=/Users/bigdawg/Projects/budgeting/data/.storis-token.json

# OneDrive / rclone (Phase 9 — surface as Marcelo approval gate at Phase 9)
ONEDRIVE_REMOTE=                  # rclone remote name (e.g. "onedrive-budgeting")
ONEDRIVE_ARCHIVE_PATH=            # path within OneDrive (e.g. "BudgetingSoftware/archive")
```

## 8. Dependencies (npm)

Production:
- `express` — HTTP server
- `better-sqlite3` — synchronous SQLite (matches PMD)
- `bcrypt` — password hashing
- `express-session` — sessions
- `cookie-parser` — cookie parsing
- `ejs` — view templates
- `xlsx` (SheetJS) — Excel parsing
- `csv-parse` — CSV parsing
- `multer` — multipart upload
- `uuid` — IDs
- `dotenv` — `.env` loading
- `node-fetch` (or use Node 18+ native fetch) — HTTP for STORIS

Dev:
- `nodemon` — dev reload
- `vitest` or `node:test` — testing
- `eslint` — linting (matching PMD config if any)

## 9. Security baseline

- Sessions: `httpOnly`, `sameSite=lax`, `secure` in production (Tailscale only — no public exposure in v1)
- Passwords: bcrypt with cost factor 12
- CSRF: `csurf` middleware on all POST routes
- SQL: parameterized queries via better-sqlite3 (no string concat)
- File uploads: size limit 25 MB, MIME-type whitelist (xlsx, csv, pdf), scanned name (no path traversal)
- Audit: every mutation logged; log retention = indefinite
- STORIS token: written to `data/.storis-token.json` with mode 0600

## 10. Open issues for Phase 3 to address

- `package.json` `start` script: `node server/app.js`
- Decide between `vitest` vs `node:test` (recommend `node:test` for zero-deps)
- Multer destination: use `multer.memoryStorage()` (parse in-memory, write to disk post-validation) vs disk storage (write immediately, parse later). Memory is safer for path-traversal; disk is faster for large files. Recommend memory for v1 (Excel files are <10 MB).
- Choose EJS vs Handlebars vs Pug: **EJS** (simplest, closest to HTML, matches PMD convention if any)

---

**Status:** Architecture locked. Ready for `DB_SCHEMA.md` next.