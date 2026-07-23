# Dominoes Verification Matrix (v1.0, 2026-07-23)

**Card:** `t_dominoes_verification_loop_v1_20260723`
**Source:** Loop Engineering design brief + QA verification canon
**Owner lanes:**
- Loop Engineering (loop cadence + no-spam rules + artifact destination)
- QA-Verification (break-testing + Step-5 review)
- Builder (code fixes for defects)
- Knowledge Canon (durable test matrix + known-issues doc)

**Stack:** SvelteKit (client, port 5173) + Fastify (server, port 3000) + Socket.IO + PostgreSQL + Drizzle ORM + Redis
**Status:** Phase 8.4 docs-sync complete; awaits re-spin + verification per this matrix.

---

## Status legend

| Status | Meaning |
|---|---|
| **PASS** | Tested in current verification cycle; passes reproducibly. |
| **PASS-WITH-FIX** | Passes only after a known workaround or hot-fix; re-test in next cycle after Builder fix. |
| **FAIL** | Reproducible defect; logged as kanban defect child card. |
| **NOT-TESTED** | Not yet exercised in current cycle; deferred. |
| **BLOCKED-ON-MARCELO** | Requires product-direction decision before further QA. |
| **FUTURE-BOUNDARY** | Out of scope for current loop; logged for later card. |

---

## Pass A — Smoke test (end-to-end health)

| # | Check | Pass criteria |
|---|---|---|
| A1 | Docker compose up | postgres 5432 LISTEN + redis 6379 LISTEN + pgadmin 5050 LISTEN |
| A2 | `dominoes-server` PM2 starts | uptime > 60s, no error in log, port 3000 LISTEN |
| A3 | `dominoes-client` PM2 starts | uptime > 60s, no error, port 5173 LISTEN |
| A4 | `npm run smoke` clean | smoke-test.sh: server `/health` 200, all 12 client routes 200 |
| A5 | DB migrations applied | `users`, `tournaments`, `matches`, `chats` tables exist |
| A6 | Seed script works | `scripts/seed-owner.ts` inserts Owner user (idempotent) |
| A7 | Phone-OTP login flow | dev OTP `123456` reaches `/auth/login` endpoint |

---

## Pass B — Core gameplay modes (verification matrix)

### B1. Regular versus mode (human vs human 1v1)

| # | Check |
|---|---|
| B1.1 | Two clients can join the same lobby via invite-token |
| B1.2 | Game starts when both players are ready |
| B1.3 | Turn rotation enforces order (p1 then p2 then repeat) |
| B1.4 | Each turn shows legal moves filtered by tile endpoint |
| B1.5 | Valid move + tile displayed correctly (topology aware) |
| B1.6 | Pass / draw / skip actions present and functional |
| B1.7 | Match ends on win (0 tiles in hand + legal play) |
| B1.8 | Match ends on block (no legal moves on both sides) |
| B1.9 | Scoring records winner + tile counts correctly |

### B2. Play vs computer

| # | Check |
|---|---|
| B2.1 | AI opponent joins empty seat when user starts 1v1 |
| B2.2 | AI picks a legal move within <= 3s for easy difficulty |
| B2.3 | AI picks a strategic move (>= 1 dominos-deep) for medium |
| B2.4 | AI picks tight-end-of-game for hard |
| B2.5 | AI handles being blocked (passes draw pile) |
| B2.6 | "AI will disconnect" race: user refreshes mid-turn vs AI |

### B3. Best-of-3 tournament mode

| # | Check |
|---|---|
| B3.1 | Match advances 1 to 2 to 3 of best-of series |
| B3.2 | Series ends after first player wins 2 of 3 |
| B3.3 | Winner of series shown, not just current match |
| B3.4 | ELO or skill delta recorded after series |

### B4. Tournament sizing / flow (8, 10, 13 players)

| # | Check |
|---|---|
| B4.1 | 8-player single-elim bracket generated (3 rounds: 8-4-2-1) |
| B4.2 | 10-player bracket uses TWO byes in round 1 (10=8+2) |
| B4.3 | 13-player bracket generates correctly (uses 3 byes or padding) |
| B4.4 | Odd-but-not-power-of-2 player counts generate brackets without crash |
| B4.5 | Tournament advances round-by-round (manual host-initiated) |
| B4.6 | Drop-out / forfeit mid-tournament equals other player advances |
| B4.7 | Tournament final winner screen + persistence |

### B5. Chat (1:1 + group)

| # | Check |
|---|---|
| B5.1 | 1:1 chat is PRIVATE between exactly 2 named users |
| B5.2 | Tournament chat is SCOPED to that tournament's participants |
| B5.3 | Server rejects chat access from a non-participant |
| B5.4 | Chat history survives page refresh (REST fetch) |
| B5.5 | Group chat: messages sent by self appear immediately |
| B5.6 | Chat scope separation: 1:1 messages do NOT show in group |

### B6. Failure-mode checks

| # | Check |
|---|---|
| B6.1 | Partial disconnect: lobby state remains consistent |
| B6.2 | Stale lobby state: opponent leaves; match archives and notifies other |
| B6.3 | Duplicate moves / double-submit: only first move counted |
| B6.4 | Page refresh mid-match: player rejoins from server state |
| B6.5 | Malformed room state: server surfaces error gracefully (no 500 to UI) |
| B6.6 | Two simultaneous actions (race): only one accepted, second rejected |
| B6.7 | Browser back button mid-match: does not cause duplicate state |

### B7. UI completeness check (Production-readiness gating)

> **Rule:** Any UI that looks complete but does not produce a useful outcome is **BROKEN** and must be logged as defect.

| # | Check |
|---|---|
| B7.1 | Every visible button has observable effect |
| B7.2 | Every visible form submits and persists |
| B7.3 | Every visible link routes to a 200 page |
| B7.4 | No "fake win" / "AI confusion" UI (UI claims victory on incomplete state) |
| B7.5 | Loading states transition to real results (no infinite spinners) |

---

## Pass C — Defect log (severity tiers)

| Severity | Definition | Action |
|---|---|---|
| **P0 (Blocker)** | Cannot run a core mode (regular / tournament / chat). | Immediate child card to Builder. QA blocks. |
| **P1 (Major)** | Core mode runs but a defect in scoring, winner determination, chat scope, or AI decision logic. | Child card within 48h. Builder + QA re-test. |
| **P2 (Minor)** | UX / edge case / cosmetic that does not block gameplay. | Child card batched. Builder + QA re-test. |
| **P3 (Cosmetic)** | Polish-only (icon, padding, copy). | Logged once a week. |

### Active defects (live log; populated by QA)

(populated in subsequent loop runs)

---

## Pass D — Routing (lane ownership)

| Defect severity | Owner | Lane |
|---|---|---|
| P0 | Builder | builder |
| P1 | Builder | builder |
| P2 | Builder + QA re-test | builder + qa-verification |
| P3 | Builder | builder |

Knowledge-Canon captures **durable** patterns (e.g., "13-player bracket needs 3 byes") into `LEARNED_DOMINOES.md`.

---

## Pass E — Re-test (after Builder fix)

| # | Re-test protocol |
|---|---|
| E1 | QA runs the *specific* failing check(s) in isolation |
| E2 | QA runs smoke + the related section (e.g., B4 if B4.3 failed) |
| E3 | PASS = defect marked RESOLVED on the child card |
| E4 | FAIL = defect reopened, Builder notified, loop back to Pass D |

---

## Pass F — Review brief (delivered to Marcelo)

The brief is a one-page summary stating:

1. **Verdict** (PASS / PASS-WITH-FIX / CHANGE-RECOMMENDED / BLOCKED-ON-MARCELO)
2. **What now works** (the bullets directly verified this cycle)
3. **What is still broken** (open defects by severity)
4. **What is blocked** (anything awaiting Marcelo's product direction)

---

## Future-boundary items (NOT in scope for current loop)

| # | Item | Why out of scope |
|---|---|---|
| F1 | App Store / Google Play packaging | Future-commercialization; logs blockers but no packaging. |
| F2 | Live platform payments | Permanent boundary: NO platform custody/payout. |
| F3 | Zelle / Venmo integration | Money stays EXTERNAL; app may support coordination UX LATER. |
| F4 | Production database migration from `dominoes/dominoes` dev creds | Pre-launch; not current cycle. |

---

## Money / store boundaries (Permanent)

**Current product:**
- NO live payments
- NO App Store / Google Play packaging
- NO platform custody/payout
- Host-managed contributions (Zelle/Venmo) STAY EXTERNAL -- host handles money, app may add coordination UX later.

Future design constraints (logged only, not built):
- Host handles money externally (Zelle/Venmo link in app is OPTIONAL future UX)
- No owner-side custody or platform payout
- App may offer `record payment` form as plain text log (no money handled)

---

## Verification cadence (Loop Engineering)

- **Daily readiness probe:** Every loop run starts with Pass A (smoke health) -- must be PASS or escalate.
- **Active hardening cadence:** TWICE per week (Tue 18:00 PT + Sat 10:00 PT) for first 4 weeks; revert to weekly if defect velocity < 1/week.
- **On-demand rerun:** After each Builder-fix card closes, QA triggers a focused re-test on the affected Pass B sections.
- **Silent healthy runs.** Telegram escalation only when: P0 defect found, OR verification cannot start (Pass A fails).

State file: `~/.hermes/state/dominoes-verification.state` (lock window, last_run_at).

---

## Artifact outputs (Loop Engineering design)

| Path | Format | Cadence |
|---|---|---|
| `~/.hermes/logs/dominoes-verification-YYYY-MM-DD.md` | Markdown brief | each loop run |
| `~/.hermes/logs/dominoes-defects-YYYY-MM-DD.md` | Markdown defect log (appended to existing) | each cycle that surfaces defects |
| `~/.hermes/state/dominoes-verification.state` | JSON state file | each run |
| `~/.hermes/logs/dominoes-verification-ESCALATE.md` | escalation marker (when blockers) | only on blockers |

---

## Knowledge Canon captures (Lane: knowledge-canon)

After each loop run, KC captures:
- New defect patterns to `LEARNED_DOMINOES.md` "Known gotchas" section
- Any 6-month-durable pattern (e.g., "13-player bracket = 8 seeds + 5 byes") to `LEARNED_DOMINOES.md` "Architecture" section
- Loop-recurring info to `loop-engineering-goals.md` Existing-loops table

---

**This matrix lives at `~/.hermes/knowledge/DOMINOES_VERIFICATION_MATRIX.md` and mirrors to `~/Obsidian/Hermes/Dominoes/` + `~/Repos/BossMan/docs/hermes-canon/DOMINOES_VERIFICATION_MATRIX.md`.**
