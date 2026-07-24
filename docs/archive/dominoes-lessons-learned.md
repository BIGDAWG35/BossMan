# Dominoes Lessons Learned

**Status:** Terminated. Lessons captured for any future dominoes (or any real-time
multiplayer board game) build.

## 1. The visible product must look like a real game from day 1

The biggest failure mode in this build: the engine + schema + payments were
all solid by mid-build, but the visible game surface was still wrong at the end.

**Lesson:** When building a game, the visible board IS the product. The engine
is a means to an end. Spend the first 30% of the build making the board look
and behave like the real game. Don't add payments, tournaments, AI difficulty
selectors, or club features until the basic game is fun to play.

**Concrete rule:** before any non-gameplay feature is added, the basic
"two players can play one round of dominoes" flow must be visually and
interactively correct on a real touch device, on the first try, with no
operator review needed.

## 2. The "tap-fallback" must work before drag/drop is implemented

We added drag/drop as the primary interaction and tap-to-arm as the fallback.
But the tap-to-arm path was never tested in isolation first. As a result, when
drag/drop broke (which it did, repeatedly), the fallback also didn't work, and
the operator had no way to play at all.

**Lesson:** When designing a drag interaction, implement the tap path first.
Verify the tap path works on real touch. THEN add drag on top, and have it
delegate to the same tap path internally. If drag breaks, the game still
plays. If the tap path is broken, drag is a non-feature.

**Concrete rule:** the placement API should be `placeAt(end, tileId)`. Both
the tap path and the drag path call this same API. Don't have two parallel
APIs for tap vs drag.

## 3. Test on real touch from day 1, not Playwright pointer emulation

The HTML5 drag API in Chromium (and Svelte's onpointerdown ordering) is fragile
on touch. Our Playwright tests used `mouse.down/move/up` which Chromium emulates
as pointer events, but the behavior diverges from real iOS Safari.

**Lesson:** Real touch testing is non-negotiable for board games. Either:
- Use a Playwright `hasTouch: true` context with iPhone device profile
- Or use BrowserStack / real device
- Or use a low-level test that dispatches real TouchEvent (not PointerEvent)

**Concrete rule:** every drag/drop PR must include a test that uses
`hasTouch: true` and passes on iPhone 12 device emulation. Mouse-only tests
are insufficient.

## 4. The onArm + onpointerdown event-ordering trap

In Svelte 5 (and Svelte 4, and React), if a button has both `onclick` and
`onpointerdown` handlers, both fire on a tap. The order is:
1. `onpointerdown` — fires immediately on touch
2. `onpointerup` — fires when finger lifts
3. `onclick` — fires after a successful click (pointerdown + pointerup without drag)

If `onArm` is called in BOTH `onpointerdown` and `onclick`, then:
- pointerdown arms the tile (armTileId = tileId)
- click toggles (armTileId = armTileId === tileId ? null : tileId) → null

Result: arming never persists past the first tap. Drag never "sticks".

**Lesson:** The pointer handlers should NOT change model state. They should
only track the visual ghost. The click handler is the only path that arms
the tile.

**Concrete rule:** in a drag-aware button, the pointer* handlers only update
`pointerX`, `pointerY`, `pointerActive`. They never call `onArm` or any other
state-setter. The `onclick` handler is the single source of truth for "this
tile was tapped".

## 5. Don't "fix" the board by stacking abstraction layers

Phase 3 added a "L/R helper pill" abstraction. Phase 5 replaced it with
"endpoints attached to the actual tile". Phase 6 went to "minimal correct
endpoints". Each layer was a partial fix that hid the underlying issue:
the engine's `layout: PlacedTile[]` is a single-row model, not a real
chain model.

**Lesson:** When the model is wrong, more abstraction doesn't help. The fix
is a model change, not a layer of indirection. We never asked "is a
single-row layout sufficient to model a real dominoes chain?" until Phase 6.

**Concrete rule:** if the same problem keeps showing up in 3+ successive
"this fixes it" attempts, the model is wrong. Stop patching. Refactor the
data model.

## 6. Auto-AI in GET vs POST is a subtle correctness issue

The server had auto-AI in POST /play (after the user's move) but not in GET /games/:id.
This meant:
- If the user played, AI played immediately. ✓
- If the user just refreshed, AI never moved (until the user played). ✗
- Tests that did `GET` between moves got stale state.

We patched this in Phase 5. But it should have been the default from the start:
**polling endpoints should always reflect the current state**, which means
auto-AI must fire on GET too.

**Lesson:** A polling API should be self-healing. Every GET should return
the most up-to-date state, including "while you weren't looking, the AI
played". This is a contract, not an optimization.

**Concrete rule:** if a state mutation can be derived from the current state
in a single step (auto-AI when it's the AI's turn), the read endpoint should
do that mutation. Polling clients should not need to know about side effects
of the read path.

## 7. Operator-in-the-loop review can become a drag — batch the asks

Multiple times the operator reviewed the live build and found a real issue.
But the issues were getting smaller each iteration, not bigger — which is
actually a sign of progress, but it was exhausting. The "this is broken"
verdict from the operator wasn't always about the gameplay; sometimes it
was about layout chrome (brochure feel), sometimes about responsiveness,
sometimes about a specific tile.

**Lesson:** When the operator's review turns into a cycle of "almost there",
the operator is giving diminishing-returns feedback. BATCH the asks: ask
"what would make this feel like a real dominoes game?" once, build it, and
let the operator do a holistic review at the end. Don't ask "is this
endpoint pill right?" → "is this drag right?" → "is this tile right?" as
a sequence of small checkpoints.

**Concrete rule:** for product-defining features (the gameplay surface),
define one Operator-Review milestone, not iterative checkpoints. The
operator reviews once and the build responds holistically.

## 8. "Real game feel" is mostly about chain geometry + endpoint targeting

The single most-impactful visual change in this build was Phase 5/Phase 6's
chain renderer: tiles in left-to-right order, doubles perpendicular, small
endpoint pills attached to the actual open ends. The single most-impactful
interaction change was: tap a tile to arm, tap an endpoint to place. Both
of these are simple. They just have to be done.

**Lesson:** Real dominoes feel is 80% chain geometry + endpoint placement,
20% everything else (visuals, animations, sound, social features). The 80%
must be correct before the 20% matters.

**Concrete rule:** when building a board game, the order of operations is:
1. Get the chain model right (real chain growth, real doubles)
2. Get the placement interaction right (real drag or real tap)
3. THEN add visual polish

We did (3) before (1) and (2) were fully solved. That's why the polish kept
getting re-done.

## 9. The "engine is real" trap

Throughout the build, we kept saying "the engine is real, the foundation is
real". The operator explicitly called this out in Phase 6: "Do NOT report back
with 'engine is real' or 'foundation is real'. The real question is: does
the game now feel like a real dominoes app?"

**Lesson:** A real engine is necessary but not sufficient. A real foundation
is necessary but not sufficient. The operator's review is about the
visible product, not the underlying code. Don't claim "real" until the
operator has said "this feels real".

**Concrete rule:** "the engine works" is a development milestone. "The
game feels like a real game" is a product milestone. Only the second one
is a finish line.

## 10. The cost of a "termination + dismantle" cycle

The total cost of this build (rough estimate):
- ~80-100 kanban cards (one of which is the "real" termination)
- ~12,000 lines of TS/Svelte code that got deleted
- 3 major rebuilds of the same component (ChainBoard, BottomHandTray, MatchRoom)
- 6+ PM2 restarts per day during peak
- 4+ docker-compose rebuilds
- Multiple Postgres migrations
- Operator review time on 7+ separate occasions

The cost of the dismantle cycle is also non-zero:
- ~10-15 min of work
- An archive of 56MB
- A postmortem + lessons-learned + restart-notes set

**Lesson:** Termination + dismantle is the right move when the iteration
loop has become a drag. The cost of archiving is much less than the cost
of a 6th "almost there" patch. If the operator is issuing hard stops on
product-failure cards more than twice, it's time to terminate.

**Concrete rule:** if a product-surface card has been re-issued 3+ times
with a "still wrong" verdict, create a termination card and propose a
full dismantle + archive + restart-from-scratch plan. Don't keep patching
the same problem.

## 11. What's reusable from this build

If a future build reuses parts of this archive, here's what to bring forward:

**Reusable:**
- `shared/src/game/` — engine logic. The state machine, AI selection, scoring
  are all clean and well-tested. The chain model (single-row `PlacedTile[]`)
  may need a position field for real chain geometry, but the engine core
  (applyMove, getLegalPlays, recomputeOpenEnds) is sound.
- `server/src/services/match.ts` — the match service layer. The auto-AI
  pattern in GET is correct.
- `server/src/services/payment.ts` — Zelle/Venmo coordination model. The
  status enum and bracket-lock pattern are reusable.
- Svelte 5 runes patterns for a stateful board game.
- Playwright E2E harness with hasTouch emulation.

**NOT reusable:**
- `client/src/lib/board/ChainBoard.svelte` (the final Phase 6 version) — the
  chain model is single-row only, which doesn't support real dominoes geometry.
  This needs a position-based model.
- `client/src/routes/match/...` — too tightly coupled to the wrong
  chain model. A future build should start with a different page structure.
- The Flyclops-style luxury-modern visual treatment — operator said it
  felt "club brochure" not "real game". A future build should use a more
  game-first visual language, possibly a "dominoes table" metaphor (green
  felt, no chrome, only the table and the tiles).

**Definitely NOT reusable:**
- The "flyclops-foundation" branding layer
- The 5-tile mode menu on home (operator said it was brand-first)
- The "Welcome to the club" copy

## 12. The real test is: would someone on the bus know they're playing dominoes?

The final state of this build, even at Phase 6, didn't pass this test. A
person glancing at the screen for 2 seconds should immediately recognize
"this is a dominoes game" from:
- The green felt
- The chain of tiles on the table
- The player's hand of tiles
- The endpoint indicators

The architecture was right but the visual hierarchy was wrong. The chrome
(layout, brand bar, mode menu, opponent strip, top zone) was given
compositional weight equal to or greater than the actual board. A future
build should make the board the only thing the eye lands on first.

**Concrete rule:** for a board game, the board should occupy >70% of the
viewport on a desktop browser and >50% on a phone. Everything else
(opponent strip, hand, status, brand) should be peripheral.
