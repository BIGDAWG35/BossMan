# Dominoes Engine Audit -- 2026-07-23

**Card:** t_dominoes_engine_truth_v1_20260723

Operator diagnosis: the product looks like a dominoes table but does not
behave like a real dominoes game. This audit reads every relevant
file in the engine and server stack to find which behaviors are real,
which are partial, and which are silently faked.

---

## A. Engine module

File: `shared/src/game/engine.ts` (755 lines)

### Real / correct
- `createEngine(ruleset)` returns the right ruleset class.
- `BaseEngine` correctly rejects illegal moves for seats, tile ids, ends.
- `applyFirstPlay` correctly places the first tile (any tile from hand).
- `placeTileOnLayout` correctly mirrors open end pip on the right side.
- `getLegalPlaysForPlayer` correctly enumerates L and R legal plays
  per open pip (including the double-pip edge case).
- `resolveRoundEnd` correctly scores the opponent's pips + boneyard pips
  and awards them to the round winner.
- `resolveBlockedRound` correctly awards pips to the lower-pip-count
  player when both pass and boneyard is empty.
- Per-play scoring for `All Fives`: adds exposedSum when sum % 5 === 0.
- `canDraw` and `canPass` reflect ruleset-level config (Block has
  no draw, Draw has unlimited draw, Traditional/AllFives 1 draw).
- `applyScoring` only scores AllFives per play; other rulesets
  score only at round end.
- `newRound` re-deals hands; ideal for re-dealing after a round ends.

### Faked / incomplete / hardcoded
- **EngineConfig.targetScore is hardcoded per ruleset class** (line
  ~650: Traditional/Block/Draw = 100, AllFives = 200). The engine
  builds its config internally and `newGame` ignores any externally
  provided target. The match route can persist `winScore=150/200/250`
  but **the engine never reads it back**; the engine uses the hardcoded
  default. This is the biggest divergence between the operator's
  request (target score flexibility) and what is currently wired.
- `config` field is stored on `EngineState` but **not used** by any
  subsequent method in the engine. Pure metadata.
- `state.config` is kept in memory but **lost when the state is
  reloaded from the DB** because it was set on EngineState at newGame
  time but `applyMove` doesn't serialize config back into round
  transitions through `newRound`. Actually on inspection newRound
  spreads `...state` which DOES preserve `config` -- but the engine
  still uses its *internal* class-level config for scoring/decisions,
  so the winScore choice from the route is irrelevant at the engine
  layer. The targetScore at line 635 etc. is the source of truth.
- The 'Traditional' engine with `requireDoubleFirst: true` and an
  Empty board will refuse a non-double first move IF
  `getLegalPlaysForPlayer` enforces it. **But
  `getLegalPlaysForPlayer` on an empty board returns every tile
  from hand**, even when the player holds a double and is required
  to play a double first. **The requireDoubleFirst config is
  declared but never enforced.**
- `applyMove`'s `move` for draw does not flip currentSeat after a
  draw. The same player can draw again on the same turn by sending
  another draw (except for Traditional/AllFives whose `applyMove`
  has no enforcement of `maxDrawPerTurn` -- the code on line 451-453
  is empty comments only). For Draw ruleset this is desired
  (player draws until they can play), but **the engine has no
  auto-pass after boneyard is empty**.
- `moveNumber` increments on every move type including draws/passes,
  which is fine, but is missing from the `moves` table write in the
  service (uses `state.layout.length + 1` instead).
- `resolveBlockedRound` is called only when both `passCount >= 2`
  AND `boneyard.length === 0`. **In Draw ruleset with unlimited
  draw, the player should only be forced to pass when the boneyard
  is empty AND they cannot play.** The draw engine is correct on
  this except it doesn't auto-transition: the user must explicitly
  pass. That's a feature, but the UI should reflect "you must pass"
  when `canPass` returns true and `canDraw` returns false and no
  legal plays exist.
- `canDraw` is misleading: `canDraw` returns false on Block but the
  body says `if (this.ruleset === 'block') return false;`. That's
  after `this.config.allowDraw` which is also false for Block. So
  Block is double-protected. OK.

## B. Server match service

File: `server/src/services/match.ts` (234 lines)

### Real / correct
- `createMatch` persists the match row, creates the first game row
  with state, returns matchId+state.
- `getMatchForPlayer` loads the most recent game row, returns
  `yourTurn` correctly.
- `applyMove` is server-authoritative (verifies seat, calls engine).
- `aiMove` calls `selectAI(engine, state, difficulty)` and forwards
  through `applyMove`.

### Faked / incomplete / hardcoded
- **`createMatch` never wires `opts.winScore` into the engine**. The
  engine's config is hardcoded. The match row persists winScore but
  the *scoring decisions* use the engine default. So the user picks
  "Match Target 250" but the engine still uses 100 (or 200 for
  AllFives). This is the P0 truth gap.
- **`getMatchForPlayer` returns `opponentId ?? AI_USER_ID`** (line
  ~118): silently maps any null opponentId to AI_USER_ID. If
  `match.player2Id` is null (AI placeholder) it's fine; but if it's
  null for a different reason, it leaks. Not critical.
- **`applyMove`'s `moveNumber` writes the wrong value**. Should be
  `result.nextState.moveNumber`, not `state.layout.length + 1`.
  Cosmetic for now.
- **Round-end mid-match logic is incomplete**. When a round ends
  and the match is **NOT** over (p1Score, p2Score < targetScore),
  the engine doesn't trigger `newRound`. UI shows "You won." but
  the engine state is `matchOver=true, winner=...` so no further
  play is possible. **This means Best-of-N style with target score
  is the ONLY path that reaches a clean match end. A pure target
  score (100/150/200/250) match cannot be played through more
  than one round.**
  - Worth noting: `EngineState.config` was supposed to drive this.
    It currently does not.
- **`getMatchHistory` returns `opponentDisplayName: 'AI'`** which
  is fine but the format string is inconsistent with other parts
  of the UI that use lowercase "Computer".

## C. Game service endpoints

File: `server/src/routes/games.ts` (179 lines)

### Faked / incomplete
- The route `POST /api/v1/games/:id/play` calls `applyMove` but
  doesn't chain an AI move afterwards. The inline AI reply is in
  the OLD match/[id]/+page.svelte's loadState + 3s polling -- it
  re-reads the state after a delay. **A faster implementation
  should call `aiMove()` from the route after the player's turn
  ends.** This is in scope for the engine-truth pass.
- `/games/:id` returns the same data as `getMatchForPlayer`.
- `getMatchHistory` returns raw match rows; no opponentDisplayName
  unless it's AI. For human-vs-human matches the UI may show nulls.

## D. AI module

File: `shared/src/game/ai.ts` (219 lines)

### Real / correct
- `selectAI` switches on difficulty; all three difficulty branches
  return legal moves only.
- `pickEasy`: returns first legal play; falls back to draw/pass.
- `pickMedium`: scores plays by exposed-pip gain + pip-value;
  sorts and picks the best.
- `pickHard`: 2-ply min-max with evaluation including hand-pip
  differential + score differential + emptied-hand bonus.

### Faked / incomplete
- `simulatePlay` calls `applyMove(state, move)` and returns the
  next state. **Note**: it does not call aiMove recursively; the
  AI does a pure 2-ply of "me move" then "opponent picks best
  move" assuming the opponent is the AI too. For a 2-player game
  this is correct.
- `pickHard` does not handle the empty-legal-plays / must-draw /
  must-pass branches explicitly. If `plays.length === 0` it draws
  or passes; that's handled. OK.

## E. Tests

File: `tests/unit/engine.test.ts` (we saw the names earlier; 58/58 pass)

### Gaps in coverage
- No engine test asserts that Traditional first play REFUSES a
  non-double when the player has a double in hand. (`requireDoubleFirst`
  is set true but never enforced.)
- No test asserts that target score > 100 actually drives a multi-round
  match end. Engine constructs a fresh `targetScore` per ruleset
  internally; tests don't override it.
- No test asserts Draw ruleset auto-passes after boneyard empty.
- No test on All Fives multi-round scoring.
- Round-end -> newRound -> continue-is-the-engine-correct path
  is NOT tested (because it doesn't exist).

## F. Frontend / match page

File: `client/src/routes/match/[id]/+page.svelte`

### Faked / incomplete
- Page uses 3-second `setInterval` polling to refresh state. State
  changes from the AI happen only on the next poll. That is a UX
  delay but functionally correct. **No fake state.**
- `selectedTile` is local-only; the server returns the legal
  state. UI is a pass-through of server state.

## G. Summary: top 5 gaps to close for "real playable game" truth

1. **targetScore from match route never reaches engine scoring.**
   Fix: make `createEngine(ruleset, targetScore)` accept an override.
   Stop using class-level hardcoded target. Or: when loading a match
   into engine for `applyMove`, read `match.winScore` and pass it in.

2. **`requireDoubleFirst` is declared but not enforced.**
   Fix: in `applyMove`'s play branch on empty board, verify that
   either (a) the player has no doubles (allow any tile), or
   (b) the played tile IS a double. Reject otherwise for
   Traditional/AllFives.

3. **Round end -> new round -> continue is not implemented.**
   Fix: when `matchOver` would be true from `result.nextState` but
   both scores are below targetScore, instead call `engine.newRound(...)`
   on the `nextState` and continue. Actually check: per current
   `resolveRoundEnd`, `matchOver = (p1Score >= targetScore || p2Score
   >= targetScore)`. If neither has reached target, matchOver is
   false. The returned `nextState` would NOT have matchOver=true and
   the round ends but the match continues. But the engine's
   `resolveRoundEnd` returns `{ok:true, nextState}` with `matchOver:false`
   if neither score reached target. After that, the game still has
   `layout=[], openLeft=null, openRight=null` -- the empty board but
   the round state is preserved. **The engine does NOT clear the
   board, reset boneyard, or re-deal hands. The game state at this
   point is "round is over but everything looks identical to mid-round".**
   This is a bigger gap: `resolveRoundEnd` needs to call
   `newRound(next)` when matchOver would be false, OR return a
   special "round ended but match continues" flag so the server can
   re-deal.

4. **`winScore` from match is not enforced by applyMove.**
   Server should override `targetScore` on the engine it
   constructs in `applyMove` to match `match.winScore`.

5. **No path for human-vs-human match's AI/null confusion.**
   Minor: ensure `getMatchForPlayer` returns null (or a clean
   "human opponent") rather than AI_USER_ID when opponent is null.

## Items that ARE correct (verified against tests + reading)
- All 4 ruleset engines have distinct correct configs.
- AI difficulty branches return only legal moves.
- BlockEngine refuses draw correctly.
- draw engine draws from boneyard on demand.
- engine.applyMove rejects with proper reason codes.
- server routes return HTTP 400 with the engine reason code.
- end-pip / open-left / open-right math is correct in placeTileOnLayout.

## Acceptance for this audit
The fix card will close #1, #2, #3, #4, #5 above and re-test live.
