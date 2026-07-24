# Dominoes Restart Notes

**Status:** Future-only. This file is NOT a license to start building. This file
captures what a future build SHOULD do if/when the operator decides to
intentionally restart the Dominoes project.

**Restart is the operator's decision, not BossMan's.** Do not start a rebuild
without an explicit "restart Dominoes" directive.

## When to restart

Restart this project when:
- The operator explicitly says "restart dominoes" (in chat or as a kanban card)
- The operator has bandwidth for a multi-week build focused on the visible game
- The lessons-learned doc (`docs/archive/dominoes-lessons-learned.md`) is read
  in full by the team before scoping

DO NOT restart:
- Because a kanban card mentions dominoes in passing
- Because someone asks "what about that dominoes app?"
- Without the operator's explicit go-ahead

## What to do differently from the start

### Step 1 — Spend the first 1-2 weeks on the board alone
- Build the green felt.
- Build a horizontal chain of dominoes (8-10 tiles, perpendicular doubles).
- Build the hand of 7 tiles below the board.
- Build the endpoint indicators (small pills at the actual end tiles).
- NO auth, NO payments, NO tournaments, NO AI — just a static board.
- Verify it looks like a real dominoes table.
- Get operator review on the static board BEFORE adding interactivity.

### Step 2 — Add the placement interaction
- Implement tap-tile-to-arm + tap-endpoint-to-place. This is the primary
  interaction. Make sure it works on real touch first.
- Implement drag-and-drop. Make sure it works on desktop AND mobile.
- Both paths call the same `placeAt(end, tileId)` API. Don't have two APIs.
- Test on `hasTouch: true` Playwright with iPhone 12 device emulation.

### Step 3 — Add a real chain geometry model
The previous engine's `layout: PlacedTile[]` was a single row. Real dominoes
chains bend and branch. Consider a position-based model:

```ts
interface PositionedTile {
  tileId: string;
  x: number;       // grid position
  y: number;
  orientation: 0 | 90 | 180 | 270;  // for doubles
  parentTileId?: string;            // for branch tracking
  parentEnd?: 'L' | 'R';
}
```

The layout grows as a tree/forest, not a list. Doubles can be spinners (both
ends branch). This model supports real dominoes geometry.

The engine can still produce this from `applyMove`, but the layout accumulator
needs to be a tree, not a list.

### Step 4 — Add AI
- AI uses `getLegalPlaysForPlayer` (already correct from the previous build).
- AI auto-plays on GET too (so polling clients see fresh state).
- AI difficulty selector can be a single dropdown, not a multi-screen setup.

### Step 5 — Add the second player
- 1v1 with a real human requires a matchmaking / invite system. The previous
  build had `invites` and `clubs` routes — those are reasonable starts.
- For v1, just use "create match → share link → other person joins". No clubs.
- If we want to ship faster, do 1v1 against AI only and skip human matchmaking.

### Step 6 — Add tournaments (only after 1v1 works)
- Best-of-N match rooms. Series score tracking.
- Bracket generator. The previous build had a deterministic seeder.
- DON'T add payments to tournament entries yet. Cash-app coordination is a
  v2 feature.

### Step 7 — Add payments (only if/when needed)
- The previous build's Zelle/Venmo coordination model is sound.
- But payments are NOT required for the core dominoes experience.
- Skip until the operator asks for tournaments-with-entry-fee.

## What NOT to bring forward

- The "flyclops-foundation" branding layer (5-tile mode menu, "PRIVATE CLUB" badge,
  Welcome-to-the-club copy). Operator flagged it as club-brochure feel.
- The "luxury-modern" design system with gold borders, gradient headers,
  brand mark. It was heavy and dated.
- The "Welcome back, X" hero copy. The home page should be game-first.
- The abstract L/R helper pill UI. Endpoints should be at the actual tile
  positions.
- The "brand-block first" home page layout. Home should be the lobby menu
  with mode chips at the top, not a hero with a sign-in card.

## What to bring forward

- `shared/src/game/` — the engine. Sound, well-tested. The state machine,
  applyMove, getLegalPlaysForPlayer, selectAI, scoring are all correct.
- `server/src/services/match.ts` — the match service. Auto-AI in GET is correct.
- `server/src/db/schema.ts` — the data model. Captures the entity relationships
  (users, matches, games, tournaments, tournament_players, tournament_matches,
  payments).
- Svelte 5 runes patterns: `$state`, `$derived`, `$derived.by<T>`, `$props()`.
- The `useMatchRoom` composable pattern — single source of truth for match state.
- Playwright E2E with hasTouch: true.

## Tech stack recommendations (re-confirmed)

| Layer | Tech | Why |
|---|---|---|
| Frontend | SvelteKit 2.x + Svelte 5 runes | Reactive UI, fast, small bundle. |
| Frontend build | Vite | Standard for SvelteKit. |
| Backend | Fastify 5.x | Fast, low overhead, good TS support. |
| Realtime | Socket.IO | Battle-tested for game state sync. |
| DB | Postgres 16 | Drizzle ORM, enums, JSON columns. |
| Cache | Redis 7 | Session, rate limit, pub-sub. |
| ORM | Drizzle | TS-native, no codegen. |
| Auth | JWT (server-signed) | Stateless, no extra service. |
| AI | Perplexity for product research; built-in selectAI for game AI | Engine already has selectAI. |
| E2E test | Playwright (hasTouch: true for mobile) | Standard. |
| Infra | PM2 + Tailscale serve (no public exposure) | Standard. |

## Re-use the archived assets

Archived at `docs/archive/dominoes-assets/`:
- `top-level-knowledge/PHASEREPORT.md` — full phase history
- `top-level-knowledge/LEARNED_DOMINOES.md` — pre-termination knowledge
- `project-docs/BLUEPRINT_2026-07-23-FLYCLOPS_FOUNDATION.md` — original
  product spec (use only as reference, do not literally re-implement)
- `project-docs/DATA_MODEL.md` — data model (re-derive from current state)
- `project-docs/MVP_SCOPE.md` — scope decisions
- `db-schema/dominoes-schema.sql` — schema dump
- `db-schema/dominoes-full.sql` — full dump
- 56MB of screenshots showing the evolution of the gameplay surface

## Recommended first 30 days of a new build

| Week | Focus | Deliverable |
|---|---|---|
| 1 | Static board (green felt, chain, hand, endpoints) | Playwright screenshot of static board that the operator can compare against the reference Flyclops / real dominoes |
| 2 | Tap-tile-to-arm + tap-endpoint-to-place | Operator can play one round of dominoes against themselves, on mobile + desktop |
| 3 | Drag-and-drop | Both interactions work, primary = drag, fallback = tap |
| 4 | AI + position-based chain model | 2-player (AI) full round with chain branching at doubles |

DO NOT add any of these in the first 30 days:
- Auth (use a hard-coded user)
- Payments
- Tournaments
- Clubs / invites
- Chat
- Admin dashboard
- Public deployment

These are all "after the game is fun" features.

## Definition of done for the v1 restart

The v1 build is DONE when:
1. A user can play a full round of dominoes against the AI.
2. The chain physically grows with real geometry (bends, branches at doubles).
3. Drag-and-drop works on real touch + desktop.
4. Tap-tile + tap-endpoint works as fallback.
5. The board is the visual focal point (>70% of viewport on desktop).
6. Operator says: "this feels like a real dominoes game".
7. Playwright e2e covers: first move, follow-up, double, AI response,
   multi-tile chain growth, branch-at-double.

The build is NOT done when:
- The engine has 12 tables and 20 enums.
- The payments API is fully spec'd.
- The home page has a 5-tile mode menu.
- The component library has 12 unique primitives.

The product is the BOARD, not the framework.

## Open questions for the operator before restart

If/when the operator decides to restart:
1. **Visual language:** Green felt + ivory tiles (proposed) or something more
   modern (e.g. minimalist black/white)?
2. **AI difficulty:** 3 levels (easy/medium/hard) or a single "AI" with
   dynamic difficulty?
3. **Matchmaking:** 1v1 with real humans via shareable link, or 1v1 with
   AI only for v1?
4. **Tournaments:** v1 feature, or v2?
5. **Payments:** ever a feature, or always external coordination only?
6. **Mobile:** PWA (current approach) or React Native / native iOS+Android?
7. **Time horizon:** What's the target ship date for v1?

These are the questions a future restart card should answer in the
intake phase.

## Final note

This archive exists so that the work in this build is not entirely lost.
The screenshots, schema, engine logic, and patterns are all captured.

A future restart should not start by "redoing" this build. It should start
by understanding the LESSONS in `dominoes-lessons-learned.md` and then
building a new chain geometry model from scratch.

The previous build was terminated for a reason. A new build should respect
that reason and not repeat the same iteration loop.
