**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/PROJ-2026-07_budgeting-software_Phase1_Plan.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 1 Plan

**Phase:** 1 of 10
**Date:** 2026-07-21
**Owner:** BossMan + builder (MiniMax-M3 default; paid builds via route-card.sh `build-impl`, OpenAI gpt-5.5) (was: DeepSeek — history)
**Status:** closed 2026-07-21 (all 12 questions answered)
**Parent:** `PROJ-2026-07_budgeting-software/PROJ-Overview.md`

---

## Phase 1 Goal

Produce a complete plan for the four open questions Marcelo flagged, so Phase 2 (architecture + DB schema) can start without ambiguity:

1. **Requirements + workflow states** — Accounting → Department → review/approval (where does approval sit, who has which role, what are the gate conditions?)
2. **Data model + storage plan** — 7+ year history, archive, OneDrive or safe storage (what gets persisted where, how is cold data handled?)
3. **STORIS integration boundaries** — which endpoints in/out, what's manual round-trip, what's sync frequency?
4. **Excel import mapping** — for the last 3 years of Excel budget files (when Marcelo provides them) — what's the mapper shape, what edge cases need handling?

---

## 1. Requirements + Workflow States

### 1.1 Workflow state machine

The 6-step workflow from `INFO.md` translates to these explicit **states**:

| State | Owner | Trigger to enter | Trigger to exit |
|---|---|---|---|
| **DRAFT** | Editor | New budget year created | All line items entered; "Submit for Review" clicked |
| **IN_REVIEW** | Viewer (manager / Accounting) | "Submit for Review" by Editor | Reviewer clicks "Approve" or "Reject" |
| **REJECTED** | Editor | Reviewer clicks "Reject" with a note | Editor addresses notes + resubmits |
| **APPROVED** | Viewer (locked) | Reviewer clicks "Approve" | Fiscal year starts (auto-promote to **ACTIVE** on fiscal-year start date) |
| **ACTIVE** | Editor | Fiscal year starts | Year-end rollover triggered |
| **ROLLED_OVER** | (read-only) | Editor triggers rollover | Next year's **DRAFT** created |

### 1.2 Role-based transitions

```
Editor:   DRAFT → IN_REVIEW → REJECTED → DRAFT (edit + resubmit)
Viewer:   IN_REVIEW → APPROVED   OR   IN_REVIEW → REJECTED
Admin:    any transition (including force-approve)
```

**Accounting sits in the Reviewer role.** Per Marcelo's request: "Accounting → Department" means each Department submits its draft budget → Accounting reviews → Approval gates the next fiscal year. Department managers (Viewers) cannot edit, only approve/reject with a note.

### 1.3 Approval gate conditions

The `IN_REVIEW → APPROVED` transition requires:
- All required line items filled (Department cannot approve an empty draft)
- Grand total within ±10% of prior-year actual (configurable per Department)
- All contracts flagged (Yes/No on every line item)
- Reviewer note attached (mandatory, ≥10 chars)

If any condition fails, the Reviewer can still force-approve (Admin only) but the failure is logged to the audit trail.

### 1.4 Multi-Department consolidation

In the pilot (IT only), the workflow is single-department. For v2 (multi-tenant), each Department has its own draft → review → approve cycle. A Company-level **consolidator** role (Admin only) can roll up all approved Department budgets into a Company view.

### 1.5 Open questions for Marcelo (Phase 1)

- Q1.1: Is the **Reviewer** role per-Department (each Department has its own Accounting reviewer) or one Company-wide Accounting reviewer for all Departments?
- Q1.2: When the Editor edits during **REJECTED**, does the version history keep the rejected drafts, or only the latest? (Drives audit-trail storage.)
- Q1.3: For the pilot (IT only), is the IT manager Marcelo, or someone else? Affects who gets the "Approve" button in the UI.

---

## 2. Data Model + Storage Plan

### 2.1 Core tables (SQLite, schema locked in Phase 2)

```
companies          (id, name, fiscal_year_start, currency, created_at)
departments        (id, company_id, name, parent_department_id NULL)
categories         (id, company_id, name, type [expense|income], active)
vendors            (id, company_id, name, contact_email, contact_phone, notes)
users              (id, company_id, email, password_hash, role, department_id NULL, created_at)
budget_years       (id, company_id, fiscal_year, status [draft|in_review|...], created_at, approved_at NULL, approved_by NULL)
line_items         (id, budget_year_id, department_id, category_id, vendor_id NULL, name, contract_flag, contract_term NULL, renewal_date NULL,
                    last_year_actual, pct_increase NULL, fixed_increase NULL, this_year_projected [computed],
                    notes, created_at, updated_at)
monthly_actuals    (line_item_id, period_1..period_12)   -- actual spend per month
review_notes       (id, budget_year_id, reviewer_id, note, decision [approve|reject], created_at)
audit_log          (id, company_id, user_id, action, entity_type, entity_id, before_json, after_json, created_at)
contracts          (id, vendor_id, contract_amount, term_months, start_date, renewal_date, uploaded_file_path, parsed_json)
import_jobs        (id, company_id, user_id, file_name, file_type [excel|csv|pdf], mapping_json, status, result_json, created_at)
```

### 2.2 Storage layout

```
~/Projects/budgeting/
  data/
    budgeting.sqlite          # primary DB
    uploads/                  # local PDF/Excel/CSV imports (temporary; archived after parsing)
      YYYY-MM-DD_<job_id>/
        original.pdf
    archive/                  # cold storage for 7+ year history (YAML/JSON snapshots per fiscal year)
      YYYY/                   # one folder per fiscal year
        budget_snapshot.json
        monthly_actuals.json
        audit_log.json
  backups/                    # daily sqlite3 .backup files (7 days rolling)
```

**OneDrive or safe storage** (per Marcelo): once a fiscal year is **ROLLED_OVER**, the corresponding `archive/YYYY/` folder is mirrored to the chosen cold storage. The local copy stays as the primary for query speed; the remote copy is the durable archive.

**Recommendation pending Marcelo's confirmation:** use the existing Mac Studio's `~/Library/Application Support/Budgeting/` (encrypted APFS volume via FileVault) as the local cold-storage path; mirror to OneDrive via `rclone` cron (existing tool in the stack). No new dependency.

### 2.3 7+ year history strategy

- **Active years (current + 5 prior):** SQLite primary DB. Fast query.
- **Archived years (year 6 and older):** JSON snapshots in `archive/YYYY/`. Lazy-loaded only when a Compare view selects an archived year.
- **Migration:** when year 7 rolls over, year 6 moves from primary DB to `archive/`. SQLite `VACUUM` keeps the primary DB small.
- **Audit trail:** every `audit_log` row is preserved indefinitely (per compliance). Year-bound entities (`budget_years`, `line_items`, `monthly_actuals`) get archived as JSON + dropped from the primary DB.

### 2.4 Open questions for Marcelo (Phase 1)

- Q2.1: Confirm OneDrive vs other (iCloud, Backblaze B2, S3, local NAS). This drives Phase 2 deploy plan + rclone script.
- Q2.2: Confirm "7+ years" is hard (compliance) or soft (UX preference). Hard → audit_log retention is non-negotiable; soft → can drop audit rows older than N years.
- Q2.3: Single-tenant or multi-tenant from day 1? Pilot is single-tenant (one Company). For sellable product, multi-tenant schema adds a `company_id` to every table — which is already in the schema above. Confirm whether v1 is single-tenant or already multi-tenant-ready.

---

## 3. STORIS Integration Boundaries

### 3.1 Read endpoints (used)

| Endpoint | Purpose | Cadence |
|---|---|---|
| `GET /api/System/Info` | Pre-flight: verify U2 backend + APIs enabled | Once at app startup |
| `GET /api/System/Settings?SettingGroupType=1` | Get `accountDelimiter`, `accountMask` | Daily + cache 24h |
| `GET /api/GeneralLedger/Budgets?FiscalYear=YYYY` | Pull STORIS budget per GL account | Weekly + on-demand |
| `GET /api/GeneralLedger/Summary?FiscalYear=YYYY` | Pre-aggregated actuals per period | Daily 6am |
| `GET /api/System/RateLimits` | Discover per-endpoint limits | Daily + cache 10 min |
| `POST /api/authenticate/user` | Get bearer token | At 90% of expiry (token cache) |

### 3.2 Write endpoints (NOT used in v1)

- Per LEARNED_STORIS_API.md §10: budget endpoint appears READ-ONLY via API. **v1 of BudgetingSoftware does not write back to STORIS.** Budget edits go through STORIS desktop UI; our app is a **read mirror**.
- For v2 (out of scope of Phase 1): if STORIS confirms a write path, add a "Push to STORIS" button on each `budget_year` (would require WRITE license confirmation).

### 3.3 Integration boundary diagram

```
┌──────────────────────────┐        ┌──────────────────────────┐
│   STORIS ERP (vendor)    │        │  BudgetingSoftware (us) │
│   - GL Budgets (read)    │◄───────│  - Budgets (read mirror) │
│   - GL Summary (read)    │  HTTPS │  - Actuals (read mirror) │
│   - GL SearchHistory     │  +JWT  │  - Vendor / Dept / Cat   │
│   - System/Settings      │        │    (write — our own)     │
│   (no writes from us)    │        │  - Contracts (write — our│
└──────────────────────────┘        │    own, parsed from PDF) │
                                    └──────────────────────────┘
                                              ▲
                                              │
                                    ┌──────────────────────────┐
                                    │  Pilot Customer (IT)     │
                                    │  - Manual entry          │
                                    │  - Excel import          │
                                    │  - Contract PDF upload   │
                                    │  - Approve / Reject      │
                                    └──────────────────────────┘
```

### 3.4 Webhooks (STORIS → us)

If STORIS pushes events we care about (e.g. `Document.Published` for a contract addendum), subscribe via `POST /api/webhooks` with a `POST /api/webhooks/test` HMAC-signed payload. **Out of scope for v1** — register webhooks only when Phase 7 starts.

### 3.5 Open questions for Marcelo (Phase 1)

- Q3.1: Does the pilot customer have a STORIS tenant, or are we building the budgeting app *first* and adding STORIS sync *later*? If later, Phase 7 becomes "Phase 8: STORIS read-mirror" and the app stays STORIS-agnostic for v1.
- Q3.2: If STORIS sync is in v1, can the STORIS integrator provide sandbox credentials for Phase 2-7 testing? Without sandbox, we can't verify the unusual auth model (R1 in PROJ-Overview.md).
- Q3.3: Confirm the `accountDelimiter` for the pilot tenant. The spec examples use `"-"` but §7 says "never hardcode" — we need the real value before Phase 2 schema design.

---

## 4. Excel Import Mapping

### 4.1 Source-of-truth format (from `EXCEL_EXAMPLE.md`)

| Column | Field | Notes |
|---|---|---|
| A: Department | `departments.name` | Must match existing or creates new |
| B: Category | `categories.name` | Must match existing |
| C: Line Item | `line_items.name` | Description |
| D: Vendor | `vendors.name` | Optional, links to vendor list |
| E-P: Jan..Dec | `monthly_actuals` (forward-fill if annual total provided) | Dollar amounts |

Additional sheets: Categories (B = Type: Expense/Income, C = Active), Vendors (B = Contact, C = Email, D = Phone), Settings (A = Setting name, B = Value).

### 4.2 Import workflow

```
1. User uploads .xlsx / .csv
       │
       ▼
2. App reads first sheet name + first 5 rows + column headers
       │
       ▼
3. App suggests column mapping (remembered from last successful import per company)
       │
       ▼
4. User confirms or adjusts mapping in the UI
       │
       ▼
5. App dry-runs: parses all rows, validates Departments + Categories + Vendors exist,
   flags unknown values for the user to choose "create new" or "skip row"
       │
       ▼
6. User confirms; app writes to DB inside a single transaction
       │
       ▼
7. App writes `import_jobs` row with status='completed' + result_json (counts)
```

### 4.3 Edge cases (carried from real-world Excel habits)

| Edge case | Handling |
|---|---|
| Annual total in column E, not monthly spread | Detect via "if total only in one column, spread equally across 12 months" prompt |
| Department name doesn't match exactly | Fuzzy match + user picks from suggestions |
| Vendor missing for a line item | Allow (line_items.vendor_id can be NULL) but flag in the import summary |
| Negative numbers (credits / refunds) | Allowed; flag as "income" if category type allows |
| Multiple sheets in one Excel | Process sheets in order; require sheet 1 = "Budget Data" |
| Currency symbols / commas in numbers | Strip `$`, `,`, parse as float |
| Empty rows in the middle | Skip; don't fail the import |
| Same line item appears in multiple departments | Allowed (it's per-Department budget), but flag if same vendor appears 3+ times |
| Last 3 years of Excel files (Marcelo will provide) | Each file is a separate import_job; link to the prior fiscal_year for "last year actual" auto-fill |

### 4.4 Mapping persistence

The `import_jobs.mapping_json` field stores the column-mapping choice per job. When a new import starts for the same `company_id`, the app offers the **last successful mapping** as a default. User can override per import.

### 4.5 Validation rules (pre-write)

- Every row must have non-empty Department + Category + Line Item
- Monthly columns must parse as floats (allow blank for "no spend that month")
- Department must exist OR user must choose "create new"
- Category must exist OR user must choose "create new"
- If vendor provided, must exist OR user must choose "create new"
- Grand total per Department should be within ±50% of prior year (warning, not blocker)

### 4.6 Test plan for the last 3 years of Excel files

When Marcelo provides the 3 years of IT department Excel files:

1. Import Year-3 (oldest) → verify against `INFO.md` reference data where possible
2. Import Year-2 → verify "last year actual" auto-populates from Year-3 import
3. Import Year-1 → verify "last year actual" auto-populates from Year-2 import
4. Total row count + grand total should match the source Excel within rounding
5. Edge-case sweep: scan for any rows the mapper skipped, decide each one

### 4.7 Open questions for Marcelo (Phase 1)

- Q4.1: When can you provide the last 3 years of IT Excel files? (Drives Phase 3 acceptance criteria.)
- Q4.2: Is the Excel layout consistent across the 3 years, or do they differ? (Different layout = more mapper config; consistent = simpler.)
- Q4.3: Are there sheets beyond "Budget Data" / "Categories" / "Vendors" / "Settings" in your real files? If yes, list them so we can plan the mapper.
- Q4.4: For annual-total-only columns (E=Total, F..P blank), confirm: spread equally across 12 months? Or split per a known pattern (e.g. 1/12 each)? Or prompt the user each time?

---

## Phase 1 deliverables checklist

- [x] This Phase 1 plan doc
- [x] Workflow states (DRAFT → IN_REVIEW → APPROVED → ACTIVE → ROLLED_OVER) with role-based transitions
- [x] Data model sketch (10 tables, full schema in Phase 2)
- [x] Storage layout (local DB + OneDrive mirror via rclone)
- [x] 7+ year history archive strategy (active vs cold)
- [x] STORIS integration boundaries (6 read endpoints, 0 writes in v1)
- [x] Excel import workflow + edge cases + test plan
- [x] Open questions list (12 questions, 4 sections) for Marcelo's review
- [x] **Marcelo's 12 answers applied (2026-07-21)** — see "Locked Decisions" section below
- [x] **Phase 1 closed → Phase 2 unlocked** (architecture + DB schema)

---

## Marcelo's Answers — Locked Decisions (2026-07-21)

**Status:** All 12 open questions resolved. Phase 1 closes; Phase 2 begins.

### Workflow (Q1)

- **Q1.1 — Reviewer model:** Per-Department reviewer (each Department has its own designated Reviewer). Accounting/Admin have **company-wide final visibility** across all Departments + the power to **company-wide final approval** when a Department Reviewer cannot be assigned or escalates. *(This means: Department Reviewer is the primary gate; Accounting/Admin is the override + cross-department auditor.)*
- **Q1.2 — Rejected drafts:** **Keep all rejected drafts and revision history** in the audit log + `review_notes` table. Every `IN_REVIEW → REJECTED → IN_REVIEW` cycle creates a new `review_notes` row with the rejection reason + a snapshot of the draft at that point. No silent overwrites.
- **Q1.3 — IT pilot reviewer:** **Marcelo is the Reviewer** for the IT Department pilot. Easy to swap later when another name is provided — the Reviewer field is per-Department and editable by Admin.

### Data model (Q2)

- **Q2.1 — Cold storage:** **OneDrive** is the archive target. Approved yearly snapshots (the `archive/YYYY/budget_snapshot.json` + `monthly_actuals.json` + `audit_log.json` bundles from `PROJ-Overview.md` §2.2) get synced via `rclone` after each Year-end rollover. Local copy stays as the queryable primary; OneDrive copy is the durable archive.
- **Q2.2 — History retention:** **Hard requirement = at least 7 years**, **designed to retain more** if compliance or business needs expand. Active years = current + 6 prior in SQLite primary; year 7+ moves to `archive/YYYY/` (cold). Audit log rows are **retained indefinitely** (no archival). Schema is designed without a hard N-year cap so 10- or 20-year history is just a config change in the rollover job.
- **Q2.3 — Tenant model:** **Single-tenant v1.** The pilot is one Company (Marcelo's IT). Multi-tenant `company_id` column is kept in every table for future-proofing, but v1 hardcodes the Company row. No cross-Company queries in v1.

### STORIS integration (Q3)

- **Q3.1 — STORIS architecture:** **Build v1 with STORIS-aware architecture**, but **don't block Phase 2** if the pilot starts partially STORIS-agnostic. Concretely: define the `StorisClient` interface in Phase 2; ship a working stub (`MockStorisClient` returning fixture data) in Phase 3 so dev + pilot can run without live STORIS; swap to `RealStorisClient` when sandbox creds arrive. Phase 7 plan stays "STORIS read-mirror" but its start is decoupled from the MVP.
- **Q3.2 — Sandbox creds:** **Proceed with interface/contracts now.** The `lib/storis-client.js` interface + the 6 read endpoints are defined against the LEARNED_STORIS_API.md contract. Sandbox creds become a config swap (`STORIS_API_BASE_URL`, `STORIS_API_USER`, `STORIS_API_SECRET`) when they arrive; no code change. No Phase 2/3 work blocked on this.
- **Q3.3 — `accountDelimiter`:** Use the **learned STORIS docs as source of truth** (`LEARNED_STORIS_API.md` §7 — "The delimiter and the account mask come from `GET /api/System/Settings?SettingGroupType=1`. Never hardcode `"-"` or `"NNNN"`"). Phase 2 schema includes a `storis_settings` table that caches these values; runtime code reads them, never hardcodes. **Flag only if unresolved** after Phase 7 first-read (i.e. if STORIS returns no settings or returns an unexpected shape — that's a blocker, surface to Marcelo).

### Excel import (Q4)

- **Q4.1 — Source files:** **Marcelo will provide when ready** (not blocking Phase 2-3; Phase 3 acceptance criteria depend on getting at least one real file). Phase 3 mapper ships with the documented `EXCEL_EXAMPLE.md` fixture as the test baseline; real files become additional acceptance test cases.
- **Q4.2 — Layout consistency:** **Mostly consistent, but mapper must handle small differences across years.** Concretely: the mapper supports a saved-mapping-per-company (already in the Q4 design) so a different column layout in Year-2 just means "save a new mapping". The dry-run preview (Q4.5) shows the differences before commit.
- **Q4.3 — Extra sheets:** **Assume more sheets may exist.** Phase 2 import module includes a "Discover sheets" step that lists every sheet name + first row, lets the user map sheet-to-table for each one, and **flags unmapped sheets** rather than silently ignoring them. If a sheet is named `Budget Data` + 3 more like `Q1 Forecast` / `Capex` / `Headcount`, the UI shows all 4 and the user picks which map to which table.
- **Q4.4 — Annual-total-only column:** **Default to equal 1/12 spread** unless a sheet includes explicit monthly values OR the file has an override rule (e.g. an `Assumptions` sheet with `Line Item X = Q4-heavy 0/0/0/0/0/0/0/0/0/0/0/12000`). The import preview shows the spread before commit so the user can override per row.

---

## Phase 1 acceptance criteria — ALL MET

- ✅ Marcelo reviewed the 12 open questions
- ✅ All 12 answered (or explicitly deferred with a rationale — Q4.1 deferred until files provided)
- ✅ Phase 2 can start without further input

## Phase 1 closure

- **Date closed:** 2026-07-21
- **Closed by:** BossMan (post-Marcelo approval of this plan)
- **Kanban card transition:** `review` → `done`
- **Next card:** `t_budgeting_software_phase2_arch_schema_20260721` (status `running`)

## After Marcelo answers

Phase 1 closes → Phase 2 starts:
- Lock the DB schema (10 tables, types, indexes, FKs)
- Pick the rclone target (OneDrive vs alternative)
- Decide single-tenant vs multi-tenant
- Confirm auth model (local accounts vs SSO)
- Pick the deploy story (PM2 under BossMan hub? standalone? Docker?)

Phase 2 target: end of week 2026-07-28.