# Dominoes Postmortem

**Status:** Terminated by operator decision, 2026-07-24.
**Card:** `t_dominoes_termination_dismantle_v1_20260724`
**Operator:** Marcelo (decision); BossMan (execution)

## TL;DR

The Dominoes PWA was an 8-month development arc (rough estimate based on the kanban
volume, code churn, and number of pivot cards) that aimed to ship a Flyclops-style
luxury-modern dominoes app. It never converged. The final card was an operator-issued
hard stop: the gameplay layout was still wrong, drag/place was not trustworthy, and
the visible product did not feel like a real dominoes game.

**Termination rationale (verbatim from operator):**

> "After repeated reviews and live checks, the Dominoes game still does not look or
> behave like a real dominoes game. The layout is still wrong, the gameplay surface
> is not trustworthy, and we have spent too much time circling without reaching a
> usable result."

## What was attempted

### Phase 1 — Foundation (accepted 2026-07-23)
- **Engine** (`shared/src/game/`): Pure-TS dominoes engine. `newGame`, `applyMove`,
  `getLegalPlaysForPlayer`, `placeTileOnLayout`, `recomputeOpenEnds`, `selectAI`,
  `applyScoring`, `resolveRoundEnd`. Drizzle-Postgres schema with 12 tables and 20
  enums (users, matches, games, tournaments, tournament_players, tournament_matches,
  payments, payment_methods, clubs, club_members, invites, chat_messages, etc.).
- **Backend** (`server/src/`): Fastify + Socket.IO. Routes: `auth`, `games`, `tournaments`,
  `payments`, `clubs`, `invites`, `chat`, `dashboard`, `admin`, `users`, `health`.
  Services: `match.ts`, `tournament.ts`, `payment.ts`, `chat.ts`, `sms-provider.ts`,
  `phone-crypto.ts`, `otp.ts`.
- **Client** (`client/src/`): SvelteKit (port 4173) + Svelte 5 runes. Routes:
  `/home`, `/play`, `/play/ai`, `/play/1v1`, `/play/group`, `/match/[id]`,
  `/match/tournament/[id]`, `/tournaments`, `/tournaments/[id]`, `/rematch`,
  `/search-players`, `/admin`, `/profile`, `/login`, `/invite/[token]`, `/payments`.
- **Infra**: PM2 (dominoes-server, dominoes-client), Postgres, Redis, pgAdmin,
  Tailscale serve on port 4173 (client) + 3000 (server).

The engine + payments lane was accepted by operator on 2026-07-24.

### Phase 2 — Visible UX correction (2026-07-24, 1 card)
Card `t_dominoes_visible_ux_correction_v1_20260724`.
- Replaced brand-first home with a 5-tile mode menu.
- Built `/match/tournament/[id]` with a best-of-3 chip.
- **Result:** accepted but had known issues — the visible product was a "club brochure"
  not a "real game app".

### Phase 3 — Drag/drop UX pass (2026-07-24, 2 cards)
Cards `t_dominoes_dragdrop_match_ux_v1_20260724`, `t_dominoes_visible_ux_correction_v1_20260724` (continued).
- New `ChainBoard.svelte` (504 lines) with L/R endpoint pills, drag/drop, tap-fallback.
- New `BottomHandTray.svelte` with HTML5 drag + touch pointer events.
- `TopZone.svelte` for sleek opponent strip.
- **Result:** accepted. Drag/drop "looked right" in a screenshot.

### Phase 4 — Unify across contexts (2026-07-24, 1 card)
Card `t_dominoes_unify_match_ux_standard_v1_20260724`.
- Extracted `lib/match/MatchRoom.svelte` + `lib/match/useMatchRoom.svelte.ts` to share
  rendering across AI / private / tournament matches.
- **Result:** accepted. Tournament match used the same drag/drop as AI match.

### Phase 5 — Real board geometry (2026-07-24, 1 card)
Card `t_dominoes_real_board_geometry_v1_20260724`.
- Re-implemented the chain as a real layout (`layout: PlacedTile[]` from engine).
- Doubles rendered perpendicular to the chain.
- Auto-AI in GET `/api/v1/games/:id` (was only in POST /play — bugfix).
- **Result:** "accepted" with a proof.mp4. The chain visually grew with perpendicular
  doubles. But operator flagged: drag still didn't work in practice, and the chain
  didn't feel real.

### Phase 6 — Gameplay reset (2026-07-24, 1 card)
Card `t_dominoes_gameplay_reset_v1_20260724`.
- Deleted ChainBoard (504 lines), BottomHandTray (470 lines), TopZone.
- Wrote new minimal `Board.svelte` (~250 lines) + `Hand.svelte` (~150 lines) + `Tile.svelte`.
- Found and fixed root cause: `onArm` was being called from BOTH `onclick` AND
  `onpointerdown` on hand tile buttons, so pointerdown armed then click toggled off.
  This is why drag/place "didn't work" — the state was being reset on every tap.
- **Result:** the chain with 6 tiles + 2 doubles perpendicular was demonstrably
  correct in the final E2E test.

### Phase 7 — Operator hard stop
Card `t_dominoes_termination_dismantle_v1_20260724` (this card).
- Operator reviewed the live build and said: still not a real dominoes game.
- Issued termination order. Dismantle the entire implementation.

## What failed

### 1. The product never felt like a real game
- 4 separate "drastic" gameplay rebuilds (Phase 3, 5, 6, plus resets) all
  self-reported "works now" but operator review kept finding the same issue.
- The visible board looked like a stylized UI, not a dominoes table.

### 2. Drag/place never actually worked in operator's hand
- The HTML5 drag API in Svelte 5 is finicky with touch + onpointerdown event
  ordering. Phase 6 finally diagnosed the root cause (onclick + onpointerdown
  both firing onArm), but by then the operator had lost confidence.

### 3. AI auto-move was a hidden bug
- The server's POST /play auto-triggered AI, but GET /games/:id did NOT.
- Polling clients saw a stale state. We had to fix the GET route in Phase 5.
- This means a lot of test runs were using stale data.

### 4. Touch-action: none was missing on the hand buttons
- Phase 6's fix added `touch-action: none` to the hand tile buttons. Without it,
  pointer events were eaten by the browser's scroll handler. The previous version
  didn't have this CSS, so on real touch devices, drag/place never actually
  worked. Only mouse-emulated tests passed.

### 5. L/R abstract endpoint boxes were a wrong abstraction
- Operator flagged in Phase 2 / Phase 3 that "abstract L/R helper boxes floating
  away from the chain" did not feel real. We replaced with small pills attached
  to the actual end tile in Phase 5, then full open-end pips in Phase 6. Each
  iteration was right-on-paper but didn't feel real to the operator.

### 6. Doubles were not the actual "spinner" model
- The engine treats a double as a regular tile in the layout (just `leftPip === rightPip`).
  Real dominoes rules for doubles (spinner = perpendicular, both sides playable, chain
  branches) are an interpretation the UI has to enforce, not the engine. We never
  properly modeled the spinner's perpendicular+branching behavior in the chain renderer.
  Phase 5's perpendicular rendering was cosmetic; the chain shape was still a single
  line.

### 7. Too many "this fixes it" cards without first-principles rebuild
- The execution loop became: "review finds issue → patch → re-verify → review finds
  similar issue → another patch". After 4-5 iterations, the codebase had multiple
  overlapping board renderers, multiple drag handlers, multiple state machines.
  Phase 6 finally did the right thing (delete + rebuild from scratch), but the
  operator had already lost patience.

### 8. We never validated the underlying game model
- The engine's `placeTileOnLayout` produces a single-row `layout: PlacedTile[]`
  in left-to-right order. The UI is responsible for visual interpretation.
  We never asked: "is a single-row PlacedTile[] actually sufficient to model
  real dominoes?" Real dominoes have chain bends and branch points at doubles.
  A proper model would track position (x, y, orientation) per tile. Without
  that, no UI can show real dominoes geometry.

## What was technically correct (and is archived)

- **Engine** (`shared/src/game/`) — pure-TS, fully unit-tested logic. Models:
  Block, Draw, Traditional, All Fives. Doubles-first rule for Traditional/All Fives.
  AI selectAI uses getLegalPlays for any ruleset.
- **Postgres schema** — 12 tables, 20 enums, migrations. Captures the data model.
- **Auth** — guest token issuance, role-based middleware, OTP phone-crypto flow.
- **Payments** — Zelle/Venmo coordination only, no in-app processing. Host approval
  is source of truth. payment_status enum and bracket lock model.
- **Tournament bracket generator** — deterministic seeding, best-of-N match rooms.
- **Svelte 5 runes** — `$state`, `$derived`, `$props`, `$derived.by` patterns.
- **Playwright e2e harness** — for AI matches, tournament matches, payments flow.

These are NOT part of the active product. They are archived at
`docs/archive/dominoes-assets/` for future reference IF a future build decides
to reuse any of them.

## Final disposition

| Path | Action |
|---|---|
| `/Users/bigdawg/Projects/dominoes-pwa/` | DELETED |
| `/Users/bigdawg/logs/dominoes-*` | DELETED (snapshots archived) |
| `~/.pm2/logs/dominoes-*` | DELETED |
| PM2 processes `dominoes-server`, `dominoes-client` | DELETED + saved |
| Docker containers `dominoes-postgres`, `dominoes-redis`, `dominoes-pgadmin` | STOPPED + REMOVED |
| Docker volumes `dominoes-pwa_*` | REMOVED |
| Docker network `dominoes-pwa_default` | REMOVED |
| `~/.hermes/knowledge/dominoes/` (BLUEPRINT, DATA_MODEL, etc.) | DELETED (archived) |
| `~/.hermes/knowledge/LEARNED_DOMINOES.md`, etc. | DELETED (archived) |

## What is archived (kept outside the active product)

- `docs/archive/dominoes-postmortem.md` (this file)
- `docs/archive/dominoes-lessons-learned.md`
- `docs/archive/dominoes-restart-notes.md`
- `docs/archive/dominoes-assets/` — 56MB of:
  - `01-host-config.png` ... `12-host-dashboard-full.png` — payments E2E
  - `ux-baseline/`, `ux-corrected/`, `dragdrop-v1/`, `unify-v1/`, `board-v1/`,
    `board-final/`, `reset-v1/` — gameplay evolution screenshots
  - `proof.mp4`, `v2-proof.mp4` — drag/drop end-to-end recordings
  - `top-level-knowledge/` — LEARNED_DOMINOES.md, PHASEREPORT entries, etc.
  - `project-docs/` — BLUEPRINT, DATA_MODEL, MVP_SCOPE, etc.
  - `db-schema/dominoes-schema.sql`, `dominoes-full.sql` — Postgres dump
  - `logs/dominoes-server.{out,err}.log` — last server log snapshot
