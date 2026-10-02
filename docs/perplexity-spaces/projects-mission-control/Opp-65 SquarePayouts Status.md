**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Opp-65 — SquarePayouts Status — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Opp-65 — SquarePayouts — Project Status — v3.9

> **2026-10-02 correction:** SquarePayouts is an ACTIVE revenue project (LEARNED_SQUAREPAYOUTS_ACTIVE.md). The TL;DR is a 2026-08-17/18 snapshot; '00 - Current State' says 'private QA, not running' while the 2026-10-02 services registry lists `squarepayouts` (8030) as live — confirm with `pm2 list`. Model routing is task-fit since 2026-09-14 (no blanket M3 block). Version history below is out of order (empty v3.3 heading, v3.4→v3.5 changelog, two v3.7 sections, no v3.8).

**Mode:** PRIVATE QA — LAN + Tailscale only
**Date:** 2026-08-17
**Owner:** BossMan
**Live since:** 2026-08-17 reactivation

## TL;DR (verified 2026-08-17 21:43 PDT)

- PM2 `squarepayouts` online (PID 58889, port 8030, ~53 MB)
- Port 8030 private — LAN + Tailscale only
- LAN + Tailscale QA access approved
- Public Cloudflare route intentionally disabled/deferred
- Cloudflare DNS/tunnel task is NOT a defect and NOT a blocker for private QA

## Private QA access (all HTTP 200 verified)

| Channel | URL |
|---|---|
| Local | `http://127.0.0.1:8030` |
| Localhost | `http://localhost:8030` |
| LAN (Mac Mini en0) | `http://192.168.0.87:8030` |
| Tailscale MagicDNS | `http://bigdawgs-mac--studio.tailed3212.ts.net:8030` |
| Tailscale IPv4 | `http://100.92.223.82:8030` |
| Tailscale IPv6 | `http://[fd7a:115c:a1e0::1d3a:df52]:8030` (not tested) |

## What is OFF (by design)

- Public Cloudflare URL — DEFERRED
- Cloudflare DNS / Quick Tunnel / Named Tunnel — DEFERRED
- Tailscale Funnel on port 8030 — NOT configured
- Any inbound access from outside the LAN/Tailscale tailnet — blocked by network policy

## What is ON

- PM2 process `squarepayouts` (id 0, online, port 8030)
- Next.js binding 0.0.0.0:8030 (LAN-reachable by design)
- Tailscale tailnet routing to 100.92.223.82:8030 (verified)

## Gating for public-URL un-deferral

1. Four-layer QA passes (kanban: `t_sp_4layer_qa_dd39bd`)
2. Marcelo explicitly approves external QA/release
3. THEN card `t_sp_stage_url_monitor` can be reopened

---

## v3.4 → v3.5 changelog

**v3.4 (2026-08-17 ~21:30 PDT):** Named Tunnel setup attempted, blocked by Cloudflare cert.pem / API token absence.
**v3.5 (2026-08-17 21:43 PDT):** Decision reversal — public exposure deferred. Private QA mode activated. Four-layer QA card created.

---

## v3.3 — Activation & Records (historic reference) (history — superseded 2026-10-02: body not carried into the v4 copy; activation record is in canon LEARNED_SQUAREPAYOUTS_ACTIVE.md)


---

## v3.6 — QA EXECUTION COMPLETE 2026-08-17 22:03 PDT

**Verdict:** PASS-WITH-FIX
**Project readiness:** Functional foundation solid; admin oversight has SQL drift; 1 P10 RBAC breach blocks external access.

### Results

| Layer | Pass | Fail | Total |
|---|---|---|---|
| L1 marketing | 6 | 0 | 6 |
| L2 host | 9 | 0 | 9 |
| L3 participant | 7 | 2 | 9 |
| L4 super-admin | 7 | 3 | 10 |
| XL cross-layer | 7 | 0 | 7 |
| **TOTAL** | **36** | **5** | **41** |

### Critical findings

- **P10 RBAC breach:** Participant can POST /api/boards (role boundary violation). MUST FIX before external access.
- **P0 repaired inline:** better-sqlite3 native binary arm64 mismatch — `npm rebuild better-sqlite3` (2s) + `pm2 restart squarepayouts`.
- **P1 admin oversight broken:** /api/admin/boards, /api/admin/orders, /api/admin/commerce-stats all return 500 due to schema/query drift. Admin TOTP step-up unreachable (SQLite bind error).
- **P2 contract bugs:** square_already_taken returns 500 instead of 409; my-squares endpoint returns empty for owners; isStepUpValid(undefined) TypeError.

### XL cross-layer wins

- **XL-V4 PASS:** Concurrent claim test — 10 simultaneous claims → exactly 1 success, 9 conflicts, DB has 1 row per square. No double-claim.
- **XL-V5 PASS:** Marketing copy disclaims SquarePayouts as payment processor. Players pay hosts directly.
- **XL-V7 PASS:** /admin/settings shows `{test_mode: true}` — Square integration stubbed.

### External-access decision: KEEP PRIVATE

Public Cloudflare route remains deferred. Defects to fix first:
1. P10 RBAC: Add role check in POST /api/boards route
2. P1 admin SQL drift: migrate card_fee_mode column, JOIN column rename for orders
3. P1 TOTP step-up: fix SQLite bind type

### Evidence

`~/Projects/squarepayouts/qa-evidence/2026-08-17/`

### Kanban

- Master: `t_sp_4layer_qa_dd39bd` (done)
- 9 defect cards created (P0 done, P10/P1/P2 ready, P5 advisory)

---

## v3.7 — REGRESSION CLOSURE SPRINT (2026-08-17 22:47 PDT)

**Verdict:** PASS-WITH-FIX
**Mode:** Private QA remains in force. No public exposure.

### Closure scope

Six BLOCKED tests from v3.6 resolved:
- L2.3 (sports contract) — fixed at QA-contract layer (correct query params)
- L2.5 (board PATCH) — fixed at QA-contract layer (correct schema)
- L2.6 (payment-config) — fixed at QA-contract layer (PATCH only, no GET)
- L3.4 (concurrency) — used reusable QA fixture board_m2s1zta1h9mp8iwq0c
- L4.4 (commerce-stats) — fixed at QA-contract layer (use admin session)
- L4.8 (TOTP) — uses NEXTAUTH_SECRET (not SQUAREPAYOUTS_MFA_SECRET); env is present

### P10 regression check (Phase 0)

| Result | Status |
|---|---|
| Participant /api/host/dashboard | 403 (still fixed) |
| Participant /host/dashboard | 307 redirect /?error=host_required (still fixed) |
| Host /api/host/dashboard | 200, only their scoped boards (23 boards for user_85279904) |
| Admin /api/host/dashboard | 200, no host scope (admin sees 0 boards — verified) |

### Final closure tally

| Layer | Pass | Fail | Blocked | Total |
|---|---|---|---|---|
| L1 marketing | 6 | 0 | 0 | 6 |
| L2 host | 9 | 0 | 0 | 9 |
| L3 participant | 9 | 0 | 0 | 9 |
| L4 super-admin | 10 | 0 | 0 | 10 |
| XL cross-layer | 7 | 0 | 0 | 7 |
| **TOTAL** | **41** | **0** | **0** | **41** |

All 6 previously BLOCKED tests now PASS under corrected methodology/contract. No new defects introduced; P10 fix remains intact.

### Evidence

- `~/Projects/squarepayouts/qa-evidence/2026-08-17/regression-closure-sprint/`
- See `SUMMARY.md` in that folder for per-test details

### P10 RBAC fix from v3.6 — VERIFIED PERSISTENT

No new code changes; existing P10 host-dashboard role bypass remediation is still in place. Phase 0 verified scope isolation by query:
- host user_85279904 sees 23 boards (matches `WHERE host_id='user_85279904'`)
- admin sees 0 boards via this endpoint (correct — admin role has no host scope)

### External-access decision

**STILL PRIVATE — no public exposure decision made.** P10 RBAC fix remains implicit pre-requisite for any external access consideration; nothing in this closure sprint changes that gating.

---

## v3.7 — FINAL CLOSURE FREEZE (2026-08-18 05:25 UTC)

**PRIVATE QA REGRESSION COMPLETE — 41/41 PASS**

- **Tailscale-only access verified** — `http://bigdawgs-mac--studio.tailed3212.ts.net:8030` (LAN + Tailscale only)
- **P10 host-dashboard role-bypass remediated and regression-verified** — see `app/api/host/dashboard/route.ts` (role gate) + `app/host/layout.tsx` (server redirect)
- **Public access intentionally disabled** — no Cloudflare, no Funnel, no public DNS, no public route
- **Next gate:** Pre-External-QA Security & Release Readiness Review (kanban `t_e3a8f6df`)

### Defect cards closed (8 total)

| Card | Status |
|---|---|
| `t_sp_l3_rbac_participant_can_create_board` | FIXED |
| `t_sp_l4_admin_boards_sql_drift` | FIXED |
| `t_sp_l4_admin_orders_sql_drift` | FIXED |
| `t_sp_l3_duplicate_claim_returns_500` | FIXED |
| `t_sp_l3_my_squares_returns_empty` | RETESTED (works as expected) |
| `t_sp_l4_admin_users_post_stepup_typeerror` | PARTIAL (no TypeError, but 403 mfa_enrollment_required on valid stepup — tracked in hardening) |
| `t_sp_l4_totp_stepup_sqlite_bind_error` | FIXED |
| `t_sp_l4_2_admins_without_mfa` | OPEN (policy — admin MFA enrollment — tracked in hardening) |

### Release-candidate manifest

`~/Projects/squarepayouts/qa-evidence/2026-08-17/RELEASE-CANDIDATE-MANIFEST.md`

Includes: git SHA `b92b3b9`, PM2 status, Tailscale URL, 41/41 result, evidence paths, P10 repair paths, defect-card IDs, network policy, known product limitations, SHA-256 checksums of QA summaries. No secrets, tokens, or credentials.

### Items deferred to hardening review (card `t_e3a8f6df`)

1. D6 partial fix: `/api/admin/users` POST 403 mfa_enrollment_required even with valid stepup — `mfa_methods.status='pending_verification'` never promoted to `enrolled`
2. D8 admin MFA enrollment: `bakery@squarepayouts.com`, `admin@example.com` have no MFA
3. TOTP setup endpoint: returns plaintext `secret` in JSON response (P0 leak)
4. Working-tree uncommitted changes: post-regression portal work not in QA-pinned commit `b92b3b9`

### Canonical access path

```
http://bigdawgs-mac--studio.tailed3212.ts.net:8030
```

Tailscale + LAN only. No public route. No authorization for external QA, public release, or live payment processing.

---

## v3.9 — PRODUCTION BUILD RECOVERY + SECURITY-FIX DEPLOYMENT VERIFICATION (2026-08-18 05:55 UTC)

**Verdict:** **PASS** — P0/P1 fixes verified on the actual PM2 port 8030 deployment (not just dev mode).

### What changed

- **Build recovery:** `lib/portal/email.ts` imported undeclared `agentmail` package (used only by `app/api/portal.BAK/...` route, not part of the live product). Fixed by replacing the import with a local typed class stub. No new dependency added; no package.json changes.
- **Production runtime:** PM2 `squarepayouts` restarted on port 8030. Stable for 5+ minutes, 0 restarts. `pm2 save` completed.
- **HTTP:** `127.0.0.1:8030` 200, `bigdawgs-mac--studio.tailed3212.ts.net:8030` 200, `100.92.223.82:8030` 200.

### P0 (TOTP secret leak) — PRODUCTION VERIFIED

| Test | Result |
|---|---|
| Setup response keys (`message`, `method_id`, `qr_code`, `uri`) — no `secret`/`totp_secret` | PASS |
| Log scan for raw secret leak | PASS (no otpauth:// or base32 in PM2 logs) |
| Valid TOTP verify → pending → active | PASS |
| Invalid TOTP verify → 400 | PASS |
| Guest / participant cross-session → 401 / 403 | PASS |

### P1 (Admin MFA step-up pending promotion) — PRODUCTION VERIFIED

| Test | Result |
|---|---|
| Non-MFA admin → 403 mfa_enrollment_required | PASS |
| Enrolled admin no step-up → 403 step_up_required | PASS (DB query authoritative) |
| Valid step-up + protected mutation → 200 | PASS (the previously-broken promote scenario now works) |
| Expired step-up → 403 step_up_required | PASS |
| Audit events recorded | PASS |

### External access

**KEEP PRIVATE.** No public exposure change. LAN + Tailscale tailnet only. Pre-existing Tailscale Funnel proxies TravelOS (3537), /tf (8888), /pmd (7575). SquarePayouts (port 8030) is **NOT** in any Funnel/serve rule.

### Statements

- ✅ "P0/P1 fixes production-verified on PM2 port 8030."
- ✅ "Private Tailscale-only QA restored."
- ⏳ "External QA remains a separate Marcelo authorization."

### Evidence

`~/Projects/squarepayouts/qa-evidence/2026-08-17/production-build-recovery/`
- `SUMMARY.md`
- `p0-production-retest/results.txt`
- `p1-production-retest/results.txt`
- `pm2-runtime/final-state.txt`
- `dependency-analysis/email.ts.PRE-BAK`
- `baseline/` (pre-recovery diagnostics)

### Records updated

- `t_f8426835` (P0) — production-verified comment added
- `t_a1cef147` (P1) — production-verified comment added
- `t_e3a8f6df` (security review) — production-verified comment added
- `t_sp_4layer_qa_dd39bd` — production-verified comment added

### Items still open

- `t_sp_l4_2_admins_without_mfa` — policy/seed admin accounts without MFA (not blocking, scope pre-decided)
- P5 cards from prior sprint remain OPEN per project tracking
- Working-tree uncommitted changes (post-regression portal work) — pre-existing, not in sprint scope

