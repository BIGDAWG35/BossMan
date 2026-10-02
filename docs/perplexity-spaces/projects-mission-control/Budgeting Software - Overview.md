**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/PROJ-Overview.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

---
id: PROJ-2026-07_budgeting-software
name: BudgetingSoftware
status: active
owner: builder
created: 2026-07-21
tags: [budgeting, smb, finance, storis-integration, sellable-product]
---

> **⏸️ PAUSED — 2026-07-22** by Marcelo directive. Phase 3 MVP is complete and stable; **all Phase 4+ build work is on hold** until Marcelo delivers the 3 years of IT budget Excel files. See PHASEREPORT.md for the pause notice + resume trigger.

# BudgetingSoftware

> **2026-10-02 correction:** Phase numbering differs between this file's phase table (6 = multi-department, 7 = STORIS sync, 9 = export) and PHASEREPORT 'What's next' (4 = multi-department, 6/7 = STORIS, 9 = rclone/OneDrive); history requirement is stated as both 6-year and 7-year. Reconcile before Phase 4 resumes.

## One-line summary

Sellable SMB budgeting app: vendor-aware budget tracking with 6-year history, contract auto-populate (PDF/CSV), Excel/CSV smart-import, live variance, and optional STORIS GL integration. Pilot customer: Marcelo's IT department (8 vendors, ~$112K/yr).

## Status

**Phase 3 MVP live 2026-07-22 (port 8145); Phase 4+ paused by Marcelo until the 3 years of IT budget Excel files arrive.** (was: 'Blueprint complete, implementation not started' — history)

- Knowledge prep: ✅ complete (STORIS API learned — see `~/.hermes/knowledge/LEARNED_STORIS_API.md`)
- Spec: ✅ complete (live at `~/Projects/budgeting/INFO.md`)
- Excel format: ✅ documented (`~/Projects/budgeting/EXCEL_EXAMPLE.md`)
- Master blueprint: ✅ at `~/Projects/budgeting/INFO.md`
- Phase 1 plan: ✅ closed 2026-07-21 (Marcelo approved all 12 answers — see `PROJ-2026-07_budgeting-software_Phase1_Plan.md` "Marcelo's Answers — Locked Decisions" section)
- Phase 2 plan: ✅ closed 2026-07-21 (5 design docs: ARCHITECTURE, DB_SCHEMA, AUTH_MODEL, DEPLOY_PLAN, STORIS_INTERFACE)
- Phase 3 MVP: ✅ live 2026-07-22 — single-tenant Express + better-sqlite3 + EJS on port **8145** (not 8130; that port is reserved for trading-control). PM2 process `budgeting-software` is online. End-to-end smoke test PASSED: login → create budget year → add line item → submit → approve → audit log. **Caddy is intentionally NOT enabled on this machine**; access is direct at `http://127.0.0.1:8145/` or via Tailscale. See PHASEREPORT.md — v3 (Phase 3 entry) for the full audit trail.
- **⏸️ PAUSED — 2026-07-22:** Phase 4+ build, import mapping, historical backfill, and any non-essential implementation is on hold until Marcelo delivers the 3 years of IT budget Excel files. Runtime, DB, docs, kanban, and V3 mirrors are all preserved in stable state.
- Implementation: ⏸️ Phase 3 MVP **complete** as of 2026-07-22; Phase 4+ paused (expand to multi-department, contracts PDF, STORIS live, rclone/OneDrive, rollover, compare-yoy in subsequent phases)
- Excel import (last 3 years): ⏸️ waiting on Marcelo to provide source files

## Scope

**In scope:**
- 6-step workflow (start year → import → increase → review → track actuals → rollover)
- 4 import paths (contract PDF/CSV, Excel, CSV, manual)
- Multi-year history (6+ years, expandable)
- Variance tracking (projected vs actual, live)
- Contract tracker (term, renewal date, alerts)
- 8 screens (dashboard, year selector, department view, vendor view, import center, export, contract tracker, settings)
- 3 user roles (Admin, Editor, Viewer)
- STORIS GL integration: read-only sync of budgets + actuals + departments (Phase 2+)

**Out of scope (v1):**
- Multi-company consolidation
- Multi-currency
- Cash-flow module / Treasury
- Anaplan/Hyperion-style scenario planning
- Payroll integration
- Mobile native apps (responsive web only)

## Reference data (pilot — IT department 2026)

| Vendor | Cost / yr |
|---|---:|
| Cisco Direct | $8,165 |
| Fortinet | $11,344 |
| Freshworks | $44,636 |
| Veeam | $8,849 |
| VMware | $4,000 |
| **IT Subtotal** | **$112,814** |

**Company total 2026:** $936,869 across 13 departments. IT is the pilot.

## Stack (proposed, locked in Phase 2)

- **Runtime:** Node.js + Express (matches the rest of the stack — BossMan hub, PMD, bakery)
- **DB:** SQLite (single-file, queryable, ~$0 ops; upgrade path to Postgres when SaaS-ready)
- **UI:** Server-rendered HTML + a sprinkle of vanilla JS for live variance; CSS with dark-mode support. No React/SPA — that's overkill for an internal pilot and adds a build pipeline.
- **Auth:** Local accounts (email + bcrypt) for v1; SSO/saas auth deferred
- **Storage:** Project at `~/Projects/budgeting/` (already initialized, GitHub remote set)
- **File uploads:** Local disk for v1 (under `data/uploads/`); OneDrive or S3-compatible storage as the durable archive path (per Marcelo's 7-year requirement)

## Key dates

- Kickoff (project activation): 2026-07-21
- STORIS API knowledge complete: 2026-06-24
- Phase 1 planning: 2026-07-21 (in progress)
- Phase 2 (architecture + DB schema): target 2026-07-28
- Phase 3 (MVP — manual entry + single department): target 2026-08-04

## Links

### Source of truth
- **Spec / master blueprint:** `~/Projects/budgeting/INFO.md` (also mirrored below)
- **Excel format spec:** `~/Projects/budgeting/EXCEL_EXAMPLE.md`
- **Sample Excel:** `~/Projects/budgeting/user_budget.xlsx`
- **GitHub repo:** `https://github.com/BIGDAWG35/budgeting.git` (local: `~/Projects/budgeting/`)
- **Interview questions:** `~/Projects/budgeting/interviews/Budgeting_Interview_Questions.md`

### Hermes knowledge
- **STORIS API learned:** `~/.hermes/knowledge/LEARNED_STORIS_API.md`
- **STORIS reference:** `~/.hermes/knowledge/STORIS_API_REFERENCE.md`
- **STORIS budget data map:** `~/.hermes/knowledge/STORIS_BUDGET_PROJECT_DATA_MAP.md`
- **STORIS integration strategy:** `~/.hermes/knowledge/STORIS_API_INTEGRATION_STRATEGY.md`
- **Master budgeting background:** `~/Repos/BossMan/hermes/knowledge/LEARNED_MASTER_BUDGETING.md` (enterprise-vendor context only — not project-specific)

### This project's plans
- **Phase 1 plan (this folder):** `PROJ-2026-07_budgeting-software_Phase1_Plan.md`

### Kanban
- **Parent epic:** `t_budgeting_software_activation_20260721`
- **Phase 1 plan card:** `t_budgeting_software_phase1_plan_20260721`

## Phase plan (high-level)

| Phase | Title | Status |
|---|---|---|
| **0** | STORIS API knowledge | ✅ done |
| **1** | Requirements + workflow + data model + STORIS boundaries + Excel import mapping | ✅ done (closed 2026-07-21) |
| **2** | Architecture + DB schema + auth + deploy plan | ✅ done (closed 2026-07-21) |
| **3** | MVP: manual entry + single department + Excel import | ✅ done 2026-07-22 (MVP live; Phase 4+ paused) |
| **4** | Variance tracking + monthly actuals + dashboard | todo |
| **5** | Contract upload (PDF + CSV) + renewal alerts | todo |
| **6** | Multi-department + user roles + departments/categories admin | todo |
| **7** | STORIS GL read-only sync (Budgets + Summary endpoints) | todo |
| **8** | Year-end rollover + 6-year history | todo |
| **9** | Export + reporting + audit trail | todo |
| **10** | Pilot with IT department + iteration | todo |

## Open questions (carry into Phase 1)

1. **Storage:** "OneDrive or safe storage" — confirm: OneDrive personal? Family? Business? Or local NAS with offsite backup? Affects Phase 2 deploy plan.
2. **7-year history archive:** Is "7+ years" hard requirement (compliance / audit) or soft (compare-with-3-years-back)? Drives DB partition + cold-storage strategy.
3. **Excel source files:** When can Marcelo provide the last 3 years of IT-department Excel budgets? Drives Phase 3 import-mapper test cases.
4. **Auth for sellable-product:** Self-host only for v1, or SaaS from day one? Affects Phase 2 (single-tenant vs multi-tenant schema).
5. **Contract PDF parsing:** Is the parsing off-the-shelf (e.g. AWS Textract, Google Document AI) acceptable cost-wise, or do we need a self-hosted parser?
6. **STORIS write access:** Per LEARNED_STORIS_API.md §10, the budget endpoint appears read-only via API. Confirm with STORIS integrator: can the app push budget edits back, or is it a "STORIS desktop round-trip"?

## Risks

- **R1 — STORIS auth model is unusual** (Basic auth in `model` header, expires_in in days, bearer-token header unspecified). Must be confirmed with a live API call before Phase 7. Owner: BossMan + Perplexity.
- **R2 — Contract PDF parsing accuracy** is unknown. Off-the-shelf services handle 70-90% of invoices; the remaining edge cases will need manual review. Plan a fallback.
- **R3 — 7-year history archive storage cost** could grow if the app logs every variance snapshot monthly. Define the snapshot-vs-summary strategy in Phase 2.
- **R4 — Sellable product** means feature requests will expand scope. Lock v1 to pilot-only (IT department), defer everything else to v2+.

## Status: ACTIVE — PAUSED after Phase 3 MVP (2026-07-22) (was: Phase 1 in progress — history)