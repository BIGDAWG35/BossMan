# Dominoes Board-Layout Correction Pass -- Review Brief (v1.0)

**Card:** t_dominoes_board_layout_v1_20260723
**Date:** 2026-07-23

---

## VERDICT: PASS

The match screen is now a real dominoes table, not a card stack.

The structural correction is complete:
- Opponent band pinned to the top
- Center zone is a felt surface with a growing domino chain
- Player hand docked at the bottom in a tray
- End cues (left and right) show open pip values
- Boneyard and board count float subtly above the chain
- Mobile-first: tray docks at the bottom and is always reachable
- Tournament match screen can inherit the same components

End-to-end gameplay verified in Playwright:
player plays tile, server applies, AI replies inline, chain grew
from 0 to 3 tiles, boneyard stayed at 14 tiles, score cluster updates,
selection clears.

---

## Architecture: a real three-zone table

```
match-table-screen (fullscreen flex column)
  to TopZone         (opponent band, sticky)
  to CenterZone      (felt + chain anchor + end-cues)
  to BottomHandTray  (dock + L/R picker + Pass/Draw/Resign)
```

### TopZone (the opponent band)

- Opponent mark (gold-accent avatar with 2-letter initials from display name)
- AI badge if applicable
- Opponent display name + match-type / ruleset / target score meta
- Face-down tile-count dots (7 dots total, filled according to opponentHandSize)
- Score cluster on the right: Opp / You with tabular numerics
- Menu row: Chat / Resign (handlers present; resign wired to confirm)
- --accent is used for the accent ring on the opponent mark + AI badge

### CenterZone (felt + chain)

- Full-width felt surface (--felt-mid to --felt-edge radial gradient)
- Floating boneyard/board stats in a glass pill at the bottom-center
- End-cue circles on left/right with the open pip values (gold accent when your turn)
- Chain anchor: 18px gold dot + "Start the chain" hint when board is empty
- Tiles stack horizontally from anchor; flow-wrap on mobile
- Single chain-inner div so a growing match stays visually anchored
- Whole felt gets a gold inset when it's your turn (focus indicator)

### BottomHandTray (the docked player hand)

- Status strip ("Your move" with gold turn-dot, or "Waiting for opponent...")
- Hand row: tiles dock horizontally, scrollable on mobile, snap-aligned center
- Not-playable tiles dim/grayscale so the legal-play set is visually obvious
- Action bar:
  - Left: Pass / Draw (Disabled when not in turn; Draw only if boneyard has tiles)
  - Center: when a tile is selected, "Place on" pickers appear, pill of champagne gold, drop shadow, lift on hover
  - Right: Resign
- Container border-top turns gold when it's your turn

## Mobile-first behavior

- Bottom tray always pinned to viewport bottom (fullscreen fixed inset:0)
- Hand row scrolls horizontally on narrow viewports
- Action bar grid-template-columns: 1fr 1fr / auto auto on under 720px
- Opponent tile-dots hidden on mobile to save space
- Top-zone wraps cleanly to a second row when narrow

## Files and artifacts

| Path | Purpose |
|---|---|
| client/src/lib/board/Tile.svelte | Real domino tile (ivory face, brass line, pip rendering, vertical/horizontal orientation, gold ring on selected) |
| client/src/lib/board/ChainBoard.svelte | Felt surface + chain anchor + growing chain + end-cues + floating board stats |
| client/src/lib/board/TopZone.svelte | Opponent band with mark, name, AI badge, tile-dots, score cluster, menu |
| client/src/lib/board/BottomHandTray.svelte | Player hand docked at bottom + status strip + end picker + Pass/Draw/Resign bar |
| client/src/routes/match/[id]/+page.svelte | Table-first container; not a card stack |
| client/src/lib/ui/themes.ts | All 5 themes got --felt-mid, --felt-edge, --felt-vignette tokens (green felt for dark themes, paper-board tan for modern-minimal) |
| ~/.hermes/logs/dominoes-board-layout/ | Playwright QA: 6 PNG screenshots + 4 HTML snapshots for desktop + mobile + tile-select + after-play |

## Verification (Playwright headless Chromium)

### Count of rendered structural elements on /match/<id> (1280x900)

```
matchTableScreen    1       (top-level fullscreen container)
topZone             1       (opponent band)
opponentMark        1       (avatar)
oppTiles            7       (face-down tile count dots)
centerZone          1
chainBoard          1       (felt + chain)
feltArea            1
endCues             2       (left and right open-pip cues)
endPips             2       (showing real pip values)
boardStats          1       (Boneyard, Board, Status)
bottomTray          1       (docked hand tray)
handRow             1
tileCells           7       (initial hand)
tiles               7       (each Tile component rendered)
actionBar           1       (Pass/Draw/Resign)
passBtn             2       (Pass + Draw)
scoreCluster        1
scores              2       (You + Opponent)
```

### After playing tile 1-4 to Left

- chain tiles (in order): [0-1, 1-4, 4-4] -- 3 tiles on the board
- boneyard: 14 tiles remaining
- board count: 3
- end-pip values: [0, 4] (real open ends)
- selection cleared: 0 selected tiles
- your score 0; opponent 0 (best-of-3 game, no point yet)

Visual evidence: board grew visibly between 01_match_desktop.png and 04_match_after_play.png.

## Money and store boundaries

- NO live payments introduced. /payments route unchanged (read-only).
- NO App Store or Google Play packaging.
- Tournament-specific deep branding hooks (Tier B/C) remain framework-ready (TournamentBrand component).
- /match/[id] inherits no payment responsibilities.

## V3 / canon preservation

- V3 routing / model / escalation rules unchanged.
- Auth bypass (guest) still works. Test user QAVisitor_<ts> created and match played via JWT.
- Phone-OTP route unchanged.
- All 5 themes updated with board tokens; theme picker and applyTheme() unchanged.
- 58/58 unit tests still pass (untouched by this card).

## Open follow-ups (logged, not blocked)

- Chat drawer in TopZone menu: button present, action deferred to a follow-up card.
- Live opponent tile count update: current 3s polling is sufficient for live 1v1; the polling interval could be merged with the AI match to be event-driven once Socket.IO is wired.
- Tournament match screen: the same 3 components can be dropped in to /tournament/match/[id] if/when that route exists. Not in current scope.

## Kanban state

| Card | Status |
|---|---|
| t_dominoes_board_layout_v1_20260723 (parent) | done |

32 cards closed since session start.

## Live URL (for your review)

1. Sign in via / (any display name, no SMS) to land in /home.
2. Tap Play the Computer, then Start vs easy AI to land in /match/<id>.
3. Look for:
   - Top zone with opponent mark + score cluster
   - Center: green felt with growing chain + left/right pip circles
   - Bottom: your hand in a docked tray; tile dims to grayscale if not legal
   - Tap a tile, "Place on Left/Right" pills appear; play one, AI replies
   - Move counter, boneyard, and board count all appear in the floating pill

Status: PASS. The match screen is now a real dominoes table. No MEMOs unless blocker or you come back with a new concern.
