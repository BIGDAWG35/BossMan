# Dominoes -- Permanent Reference Card

**Status:** Permanent (added 2026-07-23, Card t_dominoes_verification_loop_v1_20260723)
**Owner lanes:** Loop Engineering + QA Verification + Builder + Knowledge Canon
**Verification matrix:** `~/.hermes/knowledge/DOMINOES_VERIFICATION_MATRIX.md`
**Known issues:** `~/.hermes/knowledge/DOMINOES_KNOWN_ISSUES.md`
**Loop design brief:** `~/.hermes/logs/dominoes-loop-design-20260723.md`

---

## What this product is

A private, invite-only Dominoes PWA. SvelteKit client (port 5173) + Fastify server (port 3000) + Socket.IO + PostgreSQL + Drizzle ORM + Redis.

- 4 rulesets: Traditional / Block / Draw / All Fives
- 3 AI difficulties
- Tournaments with single-elim brackets
- Chat (1:1 + tournament/group)
- Phone-OTP auth with role-based access control
- Manual Zelle/Venmo payment recording (NO platform custody; host handles money)

**Status pre-loop:** Phase 8.4 docs-sync complete; feature-complete but DORMANT (no live PM2 service). The verification loop runs Pass A each cycle to spin it up + smoke + verify.

---

## Architecture (Permanent reference)

| Component | Tech | Port | PM2 process | Notes |
|---|---|---|---|---|
| Client | SvelteKit (vite preview) | 5173 | `dominoes-client` | Static routes + REST polling for live state |
| Server | Fastify + Socket.IO | 3000 | `dominoes-server` | 12 tables, 20 enums, 30/30 engine tests pass |
| DB | PostgreSQL 16 + Drizzle | 5432 | docker compose `dominoes-postgres` | dev user/pass `dominoes/dominoes` |
| Cache | Redis 7 | 6379 | docker compose `dominoes-redis` | health-check via redis-cli ping |
| Admin | pgadmin4 | 5050 | docker compose `dominoes-pgadmin` | dev creds admin/admin |
| Auth | phone-OTP + JWT | -- | in server | dev OTP `123456` |
| Encryption | AES for phone encryption | -- | in server | 32-byte keys inlined in PM2 ecosystem |

**Source:** `~/Projects/dominoes-pwa/`
**Tests:** `~/Projects/dominoes-pwa/tests/unit/` (30 engine tests + 14 bracket tests)
**Smoke script:** `scripts/smoke-test.sh`

---

## Money / store boundaries (Permanent)

- NO live payments
- NO App Store / Google Play packaging
- NO platform custody/payout
- Host-managed contributions (Zelle/Venmo) STAY EXTERNAL -- host handles money, app may add coordination UX later.

Future design constraints (logged only, not built):
- Host handles money externally (Zelle/Venmo link in app is OPTIONAL future UX)
- No owner-side custody or platform payout
- App may offer `record payment` form as plain text log (no money handled)

---

## Verification loop (Permanent reference)

| Cron id | Name | Cadence | Lane design | Owner runtime | Phase |
|---|---|---|---|---|---|
| `70b9215bed25` | Dominoes Verification Loop -- Hardening (Tue) | Tue 18:00 PT | Loop Engineering | Loop Engineering + QA + Builder | hardening (2x/week) |
| `93f03c63496f` | Dominoes Verification Loop -- Hardening (Sat) | Sat 10:00 PT | Loop Engineering | Loop Engineering + QA + Builder | hardening (2x/week) |

After 4 weeks of hardening (or defect velocity < 1/week), Loop Engineering reverts cadence to weekly (single slot, Sun 18:00 PT).

**Each run:** Pass A spin-up -> Pass B matrix -> Pass C defect log -> Pass D route fixes -> Pass E re-test -> Pass F review brief.

**On-demand re-run:** When a Builder-fix card closes, qa-verification auto-creates a focused re-test on the affected Pass B section (skipping A unless A is suspected affected by the fix).

---

## Known gotchas (Permanent)

### G1. Apple Silicon arm64 native-modules (logged 2026-07-23, Card D1.1)

**Symptom:** `tsx` (server) and `vite` (client) crash on start with `Cannot find module '@rollup/rollup-darwin-arm64'`. Only `rollup-darwin-x64` is present in node_modules.

**Cause:** `node_modules/@rollup/rollup-darwin-x64` was last installed on x64 architecture. Current Mac is arm64 (Apple Silicon). Node 22 arm64 cannot load x64-specific native modules.

**Fix:**
1. `cd /Users/bigdawg/Projects/dominoes-pwa && npm rebuild` (rebuilds native modules for current arch)
2. Alternative: `cd /Users/bigdawg/Projects/dominoes-pwa && rm -rf node_modules package-lock.json && npm install` (full clean)
3. After rebuild, `pm2 restart dominoes-server dominoes-client`
4. Verify: `npm run smoke` -> all 12 routes return 200

**Permanent:** Loop A.2-A.3 in every cycle catches this regression.

### G2. Phase 8.4 sign-off was docs-only

Commit `59a2e4d` says "Phase 8.4 docs sync -- sign-off launch checklist 45/47, decisions D-012/D-013, status-log complete, ecosystem.client added". The 45/47 is DOC sign-off; the 2 missing items were never verified as code WORKING. The verification loop's purpose is to fill that gap.

---

## Verification matrix pass status (live)

| Pass | Status | Note |
|---|---|---|
| A.1 docker compose | PASS | postgres+redis+pgadmin all LISTEN |
| A.2 dominoes-server PM2 | FAIL | arm64 native-modules (D1.1) |
| A.3 dominoes-client PM2 | FAIL | arm64 native-modules (D1.1) |
| A.4 smoke | NOT-RUN | server down |
| A.5 DB migrations | NOT-TESTED | server down |
| A.6 seed script | NOT-TESTED | server down |
| A.7 phone-OTP login | NOT-TESTED | server down |
| B1.x regular vs mode | NOT-TESTED | server down |
| B2.x play vs computer | NOT-TESTED | server down |
| B3.x best-of-3 | NOT-TESTED | server down |
| B4.x tournament 8/10/13 | NOT-TESTED | server down |
| B5.x chat | NOT-TESTED | server down |
| B6.x failure-mode checks | NOT-TESTED | server down |
| B7.x UI completeness | NOT-TESTED | server down |

**Cycle 1 verdict:** BLOCKED -- Pass A failed; P0 fix required.

---

## Future work (logged, not built)

1. **Pass B matrix execution** -- starts after P0 fix.
2. **AI difficulty balance audit** -- verify B2.2 (easy <= 3s), B2.3 (medium >= 1-domino-deep), B2.4 (hard = tight end-of-game).
3. **13-player bracket edge case** -- B4.3 (3 byes or padding). Historical doc says "30/30 engine + 14 bracket tests" but those are unit tests, not UI end-to-end.
4. **Race condition deep-dive** -- B6.6 (simultaneous actions). Suggest a future card to use a load-test runner (e.g., k6 + 100 concurrent simulated players).
5. **Store-readiness blockers (FUTURE)** -- App Store / Google Play, live payments: each gets its own dedicated future card.

---

## Mirror locations

- Canonical: `~/.hermes/knowledge/LEARNED_DOMINOES.md`
- Obsidian: `~/Obsidian/Hermes/Dominoes/LEARNED_DOMINOES.md`
- BossMan repo: `~/Repos/BossMan/docs/hermes-canon/dominoes/LEARNED_DOMINOES.md`
