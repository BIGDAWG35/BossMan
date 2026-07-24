# Private Dominoes Club -- Flyclops-Style Foundation Blueprint

**Card:** `t_dominoes_flyclops_foundation_v1_20260723`
**Date:** 2026-07-23
**Owner:** BossMan (autonomous)

This blueprint reframes the Dominoes product as a real, mobile-first, multiplayer
dominoes app with a Private Dominoes Club tournament layer. It deliberately
preserves everything the codebase already has (engine, schema, bracket
generator, services) and only rewires what is needed to deliver the operator's
product direction. **This is structural -- not another styling pass.**

---

## 0. Status check before planning

| Surface                         | Existing state                                   | Source |
|---------------------------------|--------------------------------------------------|--------|
| Game engine (engine.ts)         | Substantial: 4 rulesets + AI 3 difficulties. Some truth gaps closed (P0 cards 9 + 22). | shared/src/game/engine.ts |
| Bracket generator                | Single-elim + byes + byesSeed + 3rd place. Tested. | server/src/lib/bracket-generator.ts |
| Tournament schema                | `tournaments` + `tournament_players` + `matches` (with best_of_n, games_playerX_wins). Payment fields (Zelle/Venmo). | PG migrations (DB) |
| Tournament routes                | `create`, `invite`, `checkIn`, `startTournament`, `getBracket`, `advanceBracket` -- all exist as service helpers. | server/src/routes/tournaments.ts, server/src/services/tournament.ts |
| Bracket-generation tests         | 14 tests, cover N=2,3,4 players and byeCount behavior. | tests/unit/bracket-generator.test.ts |
| Engine tests                    | 44 tests covering all rulesets + requireDoubleFirst + draw limits + draw unlimited + AllFives scoring. | tests/unit/engine.test.ts |
| Live verification               | AllFives scored 127 AI pips in 7 moves; Draw completed at m8; Block completed at m8; Traditional completed at m8 (one of 5 runs); Tournament elements exist but **never tested as a full live flow**. |

Operator-approved scope: best-of-3 tournament matches (NOT best-of-N),
flexible player counts with auto-byes, premium tournaments.

---

## 1. What we are emulating from the Flyclops reference (structurally)

These are the **flyclops-style product mechanics** we are taking reference from:

| Flyclops-style mechanic           | Our implementation                                       |
|-----------------------------------|----------------------------------------------------------|
| Play-the-Computer mode select     | ✓ built (lobby renders AI mode, opens inline setup)       |
| Private match against friend      | ✓ built (`one_v_one` type with username lookup)          |
| Rematch list                      | ✓ built (recent opponents from history)                  |
| Search Players (by username)      | ✓ built (search + Challenge CTA)                         |
| Tournaments list                  | ✓ built (CRUD + invites + start)                         |
| Tournament bracket view           | partial (service exists, UI uses placeholder)            |
| Lobby / Mode-select flow          | ✓ built (current home is the lobby, mode-first)          |
| Match progress / win-target       | ✓ built (winScore column on matches + state.config.targetScore) |
| Pass-on-no-legal-play (forced)    | ✓ built + tested                                          |
| Score-target selection            | ✓ built (100 / 150 / 200 / 250 chips)                     |
| Game rules choices                | ✓ built (Traditional / Block / Draw / All Fives chips)    |
| Best-of-3 tournament match         | partial (matches table has games_playerX_wins + best_of_n; no engine plumbing yet) |
| Bracket byes automatically         | ✓ built (bracket-generator gives byeCount = N - N2)        |
| Multiple placement finals          | partial (winner_only / top_2 / top_3 enum exists; only winner_only + top_3 implemented) |
| Tournament match rooms            | partial (each match is a match row; UI to navigate to it is missing) |
| Live progress / dashboard         | partial (status enum exists; dashboard endpoint missing)  |

---

## 2. What is intentionally DIFFERENT (our differentiators)

| Differentiator                                  | Strategy                                                                                   |
|--------------------------------------------------|--------------------------------------------------------------------------------------------|
| Private club identity                            | Tournaments have a `clubId` already (we will harden "default" -> real clubs); the existing UI uses a private feel via brand mark + monogram + handle. |
| Luxury-modern design                              | Already wired in `app.css` / theme system. 5 themes (Black Card, Private Club, Marble Night, Royal Velvet, Modern Minimal). All board + lobby routes updated. |
| Searchable player profiles                       | /search-players exists (search by username, results + Challenge). Profile-based search is callable from the player pill. |
| Rematch system                                    | /rematch page lists recent opponents with W/L + rematch CTA. Already wired.               |
| Private 1v1 / friend play                         | one_v_one + group match types. Wired.                                                     |
| Flexible tournament counts (with auto byes)      | Bracket generator handles arbitrary N. Need to ensure seed-by-BYE flow at runtime. |
| Match UI uses the same table-first components as 1v1/AI | The lobby + match room + tournament match room will SHARE the components built in earlier cards (TopZone, ChainBoard, BottomHandTray). |
| Tournament THEME / branding context              | TournamentBrand component ready (Tier B/C per BRANDING_TIER_MAP.md); we will thread it through the tournament match-room view. |
| Money/store boundaries preserved                  | `paymentMode: 'free' | 'paid'` + `paymentHandle` + paymentMode='free' default. No live payments. Permanent canon preserved. |
| Phone-OTP vs guest login                          | Persistent. Both work.                                              |

---

## 3. Updated blueprint summary

### 3.1 Modes (operational)

Five operational modes, matching the lobby already built:

1. **Play the Computer** (vs AI, easy/medium/hard)
2. **Private Match** (1v1 against a friend by username)
3. **Rematch** (recent opponents + re-challenge)
4. **Search Players** (search a member + challenge)
5. **Tournaments** (list/create/start bracket)

### 3.2 Rulesets

- **Draw** (max draw per turn: unlimited; round blocked when boneyard empty AND both can't play)
- **Block** (no drawing; round blocked when both can't play)
- **Fives** (All Fives: per-play scoring when sum divisible by 5; one draw per turn)
- **Traditional** (best-of-N or first-to-target)

### 3.3 Win-Score Targets

- 100 / 150 / 200 / 250 chips
- Default 100 for Draw/Block/Traditional; 200 for All Fives
- Overridable via UI

### 3.4 Tournament system architecture

#### 3.4.1 Schema (already exists)

- `tournaments` (id, name, ruleset, format=single_elim, placement, payment_mode,
  start_time, checkin_window_minutes, status, created_by, bracket_data JSONB)
- `tournament_players` (tournament_id, user_id, seed, checkin_status, invited_at, placement)
- `matches` (id, type, ruleset, tournament_id, parent_match_id (NULL for tournament matches),
  best_of_n=3, status, player1_id, player2_id, winner_id, current_game_number,
  games_player1_wins, games_player2_wins, win_score)
- `games` (id, match_id, game_number, state_json -- the per-round play state)

#### 3.4.2 Tournament match format -- best of 3

- **One tournament "match" = up to 3 rounds (games)**
- `best_of_n=3` is hardcoded in DB default and in the `matches` row
- `games_player1_wins` / `games_player2_wins` increment as each round completes
  (currently NOT automatic -- engine updates `state.p1Score/p2Score` but does NOT
  bump `games_player1_wins`. **Gaps**.)
- Winner is the first player/team to win 2 rounds
- When 2 wins are reached: `tournament_advanceBracket` fires, the winning user
  is propagated into the next bracket position, and the next match row's players
  are filled with both sides

#### 3.4.3 Best-of-3 wiring -- required engine updates

Currently the engine increments `p1Score/p2Score` per round-end. It does NOT
update `matches.games_player1_wins/games_player2_wins` per round-end. We need:

**A. Within `advanceBracket` / match creation flow:**
- After each `games` row reaches `gameOver: true, winner!==null`,
  increment the corresponding `matches.games_playerX_wins`.
- If `matches.games_player1_wins + games_player2_wins >= 2`,
  declare the match winner and trigger `advanceBracket`.

This requires:
- A `tournament-complete-game` route (or a hook in `games` row state)
- An id mapping from `games.id` -> `matches.player1_id/player2_id`
  (already in the schema: `games.match_id`)

**B. When the tournament match is two-round-won:**
- Mark `matches.status='completed'`, `winner_id` set
- Update `tournament_players.placement` (1=winner, 2=runner-up, 3=third if top_3)
- Update `tournaments.status='completed'` if no more next-matches

#### 3.4.4 Flexible player counts + auto-byes

The `bracket-generator` already handles arbitrary N:
- For N players, `N2 = 2^floor(log2(N))`.
- `byeCount = N - N2`. Top seeds get byes.
- For N=5, N2=4: 1 bye, 4 seeded 1..4; round 1 = 2 matches; round 2 = 1 final.
- For N=3, N2=2: 1 bye, 2 play; round 1 = 1 match.

We need to:
- Confirm `startTournament` plumbs the bracket -> `tournaments.bracketData`
- Wire up a route that, after a tournament match's two-round-wins, fires `advanceBracket` to propagate

#### 3.4.5 Tournament match rooms (UI)

For each tournament `match`, the UI must route to `/tournament/match/[id]` -- a
match room that:
- Inherits the AI / opponent from the players seeded at the bracket spot
- Sets `winScore` to the tournament's chosen value
- Lets either player resign
- Shows the W/L score per game inside the bracket (e.g. "Player A: 2 wins, Player B: 1 win")

#### 3.4.6 Tournament dashboard / live status

A `GET /api/v1/tournaments/:id/status` returning:
- number of players checked in
- current round number
- per-match result (winner + score)
- next-matches with their player slots
- tournament-level status (upcoming / checkin / live / completed)

### 3.5 Auth + payments boundaries

- Auth: phone-OTP primary; guest auth for review/testing.
- Payments: `paymentMode: 'free' | 'paid'`. If paid, the route persists `payment_handle`
  but **NEVER** charges the card -- the host manually collects via Zelle/Venmo/host platform
  in the real product. Permanent canon: NO live payments.

---

## 4. Implementation roadmap (ordered)

| # | Task                                                                                  | Owner       | Status |
|---|--------------------------------------------------------------------------------------|-------------|--------|
| 1 | PRODUCT TRUTH AUDIT (engine + services) -- report first 1.5 of this document        | BossMan     | DONE   |
| 2 | Update `LEARNED_DOMINOES.md` to summarize the reframe + new V3 priorities.            | knowledge-canon | pending |
| 3 | Update `DOMINOES_VERIFICATION_MATRIX` to include tournament flow.                     | knowledge-canon | pending |
| 4 | Server: add `gameCompletedCheck` hook that, after each tournament `games.gameOver=true`,
     increments `matches.games_playerX_wins` and triggers `advanceBracket` when 2-win total hit. | builder | pending |
| 5 | Server: `GET /tournaments/:id/status` route returning live dashboard state.           | builder | pending |
| 6 | Server: `POST /tournaments/:id/matches/:matchId/round-result` to ingest a per-round
     result (called by /play route when in tournament context + best_of_n=3).                | builder | pending |
| 7 | Server: route `GET /tournament/match/[id]` returning the match's bracket context
     (opponent name, current best-of-3 wins, next-game number).                              | builder | pending |
| 8 | Client: `/tournaments/[id]/+page.svelte` -- live dashboard view consuming the dashboard API. | builder | pending |
| 9 | Client: `/tournament/match/[id]/+page.svelte` -- match-room reusing TopZone + ChainBoard +
     BottomHandTray, but with a tournament HUD card (wins/losses chip group above the action bar). | builder | pending |
| 10| Client: lobby `Tournaments` link routes to /tournaments (the index). Confirm link.    | builder | pending |
| 11| Engine: add a unit-test covering the best-of-3 win-of-2 round advancement (server-side). | qa-verification | pending |
| 12| Engine: add integration test that creates a 5-player tournament and walks the bracket to
     completion (verifying byes work end-to-end).                                              | qa-verification | pending |
| 13| Engine: re-run all 4 rulesets E2E with `/play` to confirm matchOver still fires correctly
     in each.                                                                                | qa-verification | pending |
| 14| Browser QA: full lobby flow (mode -> ruleset -> target -> AI -> start).                | qa-verification | pending |
| 15| PHASEREPORT entry: reframe summary + acceptance bar + final review brief.              | knowledge-canon | pending |
| 16| Mirror ALL files to ~\.hermes/knowledge/dominoes/ + ~\.hermes/spaces/projects-mission-control/dominos/. | knowledge-canon | pending |
| 17| Git commit on BossMan repo.                                                              | BossMan     | pending |

---

## 5. Acceptance bar

- Engine: every ruleset plays to `matchOver=true` in E2E.
- Engine: tournament match flow auto-advances on 2 wins.
- Tournament: flexible player counts (3, 5, 7) reach a winner via the auto-byes path.
- UI: lobby flow is mode-first with ruleset + target chips.
- UI: match table is the same table across AI / 1v1 / tournament contexts.
- Tournaments: live dashboard + per-match rooms. Match-results persist to `games_playerX_wins`.
- V3 compliance: no operator prompts, no relay tasks.
- Money/store: NO live payments, `paymentMode=paid` still driver-of-host Zelle/Venmo.

## 6. Blockers

None blocking. Existing schema + bracket + services cover the structural
foundation. The gaps are wiring + UI for the live tournament experience.
