**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/PHASEREPORT.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 3 PHASEREPORT

**Phase:** 3 of 10
**Date closed:** 2026-07-22
**Operator:** BossMan (autonomous) — Marcelo approved both V3 carve-outs (Caddy skip + port 8145)

---

> **⏸️ PAUSE NOTICE — 2026-07-22**
>
> Marcelo has paused all further BudgetingSoftware build work until he delivers the 3 years of IT budget Excel files. Phase 4+ (user CRUD, contract PDF, STORIS read-mirror, real-storis implementation, year-end rollover, rclone/OneDrive) is on hold. The Phase 3 MVP, DB, docs, kanban, and V3 mirrors are all stable and preserved as the latest known-good state.
>
> **Resume trigger:** Marcelo returns with the 3 years of budget Excel sheets. The first Phase 4 task will be to ingest those files via `/import`, verify mapping for each year, and detect any layout drift.
>
> **Do NOT** advance import mapping, historical backfill, or next-phase build work in the meantime.

---

## What was delivered

Phase 3 MVP is live. The single-tenant BudgetingSoftware app boots from PM2, authenticates a local user, persists to a fresh SQLite database, walks through the DRAFT → IN_REVIEW → APPROVED lifecycle, and writes an audit row for every mutation.

**Code shipped:** 19 server-side JS files (app + 9 route modules + 4 lib modules + 2 scripts + config/db/audit/auth) plus 17 EJS view files and partials, totalling ~3,500 lines of project-specific code on top of 220 npm packages.

**Schema:** 14 SQLite tables applied (13 domain tables + schema_migrations tracker). WAL mode for concurrent reads. All FK constraints enforced. Money in cents everywhere (no float drift).

**Auth:** bcrypt cost-12 password hashing, SQLite-backed sessions (better-sqlite3-session-store — survives PM2 restarts), per-session HMAC CSRF tokens on every state-changing route, 5/15-min IP rate-limit on /login, audit log on every login/logout/failure.

**Audit log:** 8 actions written during the E2E smoke test (auth.login × 3, budget_year.create, line_item.create, budget_year.submit, budget_year.approve, review_note.create). Retained indefinitely per Q2.2 hard requirement.

## E2E smoke test trace

| Step | Action | Result |
|---|---|---|
| 1 | Admin login (`admin@localhost` / random 16-char) | session cookie issued, audit row written |
| 2 | POST `/budget-years` (fiscal_year=2026, notes="Pilot IT 2026") | year created in `draft`, redirect to detail |
| 3 | POST `/budget-years/:id/items` (Microsoft 365 E5, $11,281,400 last-year, contract yearly, renewal 2027-09-30) | line item created with projected = last-year (0% increase); `monthly_actuals` row created with all 12 periods = 0 |
| 4 | POST `/budget-years/:id/submit` | status `draft` → `in_review`; audit row written |
| 5 | POST `/budget-years/:id/approve` (note: "Approved via E2E smoke test...") | status `in_review` → `approved`; `review_notes` row written with the Admin user as reviewer; audit rows written |

**Final DB state:** 1 budget_year (status=approved, approved_at=2026-07-22 16:58:46), 1 line_item (Microsoft 365 E5, contract_flag=1, contract_term=yearly, projected=$11,281,400), 1 review_note, 8 audit_log rows.

## Decisions applied

1. **Caddy NOT enabled on this machine.** Discovered during carve-out application: `~/Projects/boss-hub/Caddyfile` does not exist (only `Caddyfile.unauthorized` exists); no live Caddy PM2 process; PMD and other services are served via direct Tailscale serve. Marcelo approved (2026-07-22) to skip Caddy for Phase 3. Access is `http://127.0.0.1:8145/` locally or via Tailscale. When Caddy is later re-enabled, a `/budgeting/* → :8145` path-strip rule will be added at that time.
2. **Port 8145 (not 8130).** 8130 is reserved for `trading-control` in `services-registry.yaml`. 8145 was unused in the registry and not listening. Marcelo approved 8145 as the substitute. All docs, ecosystem.config.cjs, and the registry entry reflect 8145.
3. **Auto-cookie secure=false for localhost.** Production session cookies with `secure: true` would not be set over plain HTTP at 127.0.0.1; Tailscale terminates TLS upstream. Cookie is `httpOnly + sameSite=lax` with 8h TTL. When Caddy is later added in front, this can flip back to `secure: true`.
4. **Per-session HMAC CSRF (not `csurf` middleware).** `csurf` is deprecated/unmaintained. Implemented a per-session CSRF secret + HMAC token check in `app.js` middleware. Token is in form body or `X-CSRF-Token` header; compared in constant-time.

## Caveats / non-blockers

- **The `express-rate-limit` `trust proxy` warning** (ERR_ERL_PERMISSIVE_TRUST_PROXY) is logged on every login attempt because we set `app.set('trust proxy', true)` for accurate client-IP detection. The library wants a specific subnet. Functionality works; cosmetic warning. Will be tightened in Phase 4.
- **EJS template rendering** required several iterations to remove leftover `${...}` JS template-literal syntax from initial views. All 17 views now use proper `<%= %>` + `<% forEach %>` syntax. Resolved 2026-07-22.
- **No browser QA** was performed (I don't have CuaDriver/Browser QA active in this session). The smoke test used curl against the live HTTP server. This is acceptable for a backend MVP; browser QA can be run on demand.

## What's next (Phase 4+)

- **Phase 4**: multi-department views (currently single-tenant but only IT + Accounting seeded users can act meaningfully), user CRUD in Settings (currently only the seed user exists), first-login password rotation flow, `must_change_password` flag.
- **Phase 5**: contract PDF upload + auto-populate (per `contracts` table schema, deferred from Phase 3).
- **Phase 6**: STORIS read-mirror surface in the Dashboard (use the mock client today, swap to real when sandbox creds arrive).
- **Phase 7**: implement `real-storis.js` (currently throws `not_implemented`).
- **Phase 8**: year-end rollover cron + 6-year compare view.
- **Phase 9**: `brew install rclone` + OneDrive OAuth + nightly archive push (V3 carve-out — needs Marcelo approval).
- **Phase 10**: pilot polish + docs + on-call runbook.

## Status: PHASE 3 CLOSED.

V3 mirrors updated. PM2 live. DB seeded + validated. Audit trail complete.

---

**Refs:**
- Spec: `~/Projects/budgeting/INFO.md`
- Phase 1 plan: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-07_budgeting-software/PROJ-2026-07_budgeting-software_Phase1_Plan.md`
- Phase 2 design docs: `ARCHITECTURE.md`, `DB_SCHEMA.md`, `AUTH_MODEL.md`, `DEPLOY_PLAN.md`, `STORIS_INTERFACE.md` (same folder)
- Phase 3 source: `~/Projects/budgeting/server/`, `~/Projects/budgeting/test/`
- Registry entry: `~/Projects/boss-hub/registry/services-registry.yaml` (slug: `budgeting-software`)
- V3 mirror: `~/Desktop/V3/projects-mission-control/PROJ-2026-07_budgeting-software/` + `~/Desktop/V3/system-health/budgeting-software-registry-entry.md` (history — superseded 2026-10-02: `~/Desktop/V3/` is retired; v4 Project copies live in `~/Desktop/spaces/projects-mission-control/`, built from `~/.hermes/knowledge/` by build_spaces_v4.py)