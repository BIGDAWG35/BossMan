# Dominoes Known Issues / Blocker Log

**Card:** `t_dominoes_verification_loop_v1_20260723`
**Source:** QA Verification, populated by each loop run.

This log captures defects surfaced by the Dominoes verification loop.
Each entry links to a kanban child card owned by Builder.

## Severity legend
- **P0 (Blocker):** Cannot run a core mode.
- **P1 (Major):** Core mode runs but defective in scoring/winner/chat/AI.
- **P2 (Minor):** UX or edge case; does not block gameplay.
- **P3 (Cosmetic):** Polish-only.

## Status legend
- **OPEN:** Defect logged; Builder working on it.
- **IN-FIX:** Builder has pushed branch / fix in progress.
- **FIXED + RETEST-Q:** Builder closed; QA re-test pending.
- **RESOLVED:** QA re-test passed; defect closed.
- **WONTFIX:** Product-decision not to fix (logged with reason).

## Active defects

(populated by each loop run)

## Cycle 1 (2026-07-23) -- initial smoke-test

| # | Severity | Component | Description | Status | Card |
|---|---|---|---|---|---|
| D1.1 | P0 | dominoes-server (tsx) + dominoes-client (vite) | Apple Silicon arm64 native-modules. RESOLVED via auto-rebuild (PM2 detected fresh arm64 modules, restart succeeded). | RESOLVED | `t_dominoes_defect_p0_arm64_native_modules_20260723` (closed) |
| D1.2 | (planned) | (smoke-test) | QA re-test after fix. Verifies all 12 client routes + server `/health` 200. | OPEN | `t_dominoes_retest_smoke_after_arm64_fix_20260723` |

### Cycle 1 summary
- Pass A.1 (docker compose up): PASS
- Pass A.2 (dominoes-server PM2): FAIL (tsx/esbuild arch mismatch)
- Pass A.3 (dominoes-client PM2): FAIL (vite/rollup arch mismatch)
- Pass A.4 (smoke): NOT-RUN (server not running)
- Pass A.5-A.7: NOT-TESTED
- Verdict: BLOCKED -- Pass A failed; must fix P0 before re-testing Pass B matrix.

## Resolved defects (history)

(populated as defects close)


## Cycle 2 (2026-07-23 22:30 PT) -- post-P0-fix verification

| # | Severity | Component | Description | Status | Card |
|---|---|---|---|---|---|
| D2.1 | P1 | dominoes-server (games.ts GET) | GET /games/<bad-uuid> returns HTTP 500 + raw 22P02 instead of friendly 400 INVALID_UUID | OPEN | `t_dominoes_defect_p1_uuid_validation_20260723` |
| D2.2 | (planned) | (qa-verification) | Re-test after UUID validation fix | OPEN | `t_dominoes_retest_uuid_validation_20260723` |
| D2.3 | P2 | dominoes-server (tournaments.ts invite) | POST /tournaments/:id/invite with bad username returns 500 + raw 23502 instead of 404 NOT_FOUND | OPEN | `t_dominoes_defect_p2_invite_validation_20260723` |
| D2.4 | (planned) | (qa-verification) | Re-test after invite validation fix | OPEN | `t_dominoes_retest_invite_validation_20260723` |
| D2.5 | P3 | dominoes-server (chat.ts) | GET /chat/tournament/<nonexistent> returns 200+empty (defensible as no-messages) | OPEN | `t_dominoes_defect_p3_chat_404_nonexistent_tournament_20260723` |

### Cycle 2 results
- Pass A (all 7 rows): ALL PASS
- Pass B1 (1v1 regular): PASS-WITH-FIX (opponent validation works; full 1v1 needs 2nd player)
- Pass B2 (AI mode): PASS (full end-to-end -- match creation, AI auto-reply, layout rendering)
- Pass B3 (best-of-3): bestOfN=3 accepted; needs 2 wins to close
- Pass B4 (tournament): creation works (host role enforced); 14/14 bracket unit tests pass
- Pass B5 (chat): POST works; scope separation OK; P3 cosmetic note
- Pass B6 (failure modes): P1 (UUID) + P2 (invite) defects logged; turn-enforcement PASS, refresh PASS
- Pass B7 (UI): all 12 routes return 200 with body; payments read-only (no platform custody)

### Cycle 2 verdict
PASS-WITH-FIX (auto-rebuild resolved P0; 2 P1+P2 defects logged for Builder; product is reachable + functional + verifiable; needs Builder fixes to reach full review-ready state)

## Resolved defects (history)

- D1.1 RESOLVED 2026-07-23 (auto-rebuild + PM2 restart)
