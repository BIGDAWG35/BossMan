# Dominoes PWA -- Luxury/Modern Design System (v1.0)

**Card:** `t_dominoes_luxury_design_v1_20260723`
**Date:** 2026-07-23
**Owner:** Loop Engineering (design) + Builder (implementation) + QA Verification (browser QA)

---

## North star

> The Private Dominoes Club PWA must feel like a premium private club / boutique gaming product, not a casual browser app.
> Strong materials feel, restrained palette, generous spacing, considered typography, subtle motion.

---

## Art direction

| Pillar | Implementation |
|---|---|
| **Dark rich surfaces** | Deep espresso/charcoal base (`#0F0E14` / `#15131C`), never pure black. Subtle warmth reads premium, not arcade. |
| **Elegant contrast** | High text contrast for body (>=7:1), lower contrast for secondary text (>=4.5:1). |
| **Premium materials feel** | Subtle inner-glow on cards (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.04)`); gold/bronze hairline borders; depth via gradients. |
| **Clean spacing** | 8/16/24 grid (use existing tokens). Generous vertical rhythm on hero/landing. |
| **Polished typography** | Display: "Fraunces" (serif, with optical sizing) for headings + brand. Body: "Inter" tightened. Numerals tabular for scores. Fall back to high-quality system serifs/sans. |
| **Restrained accent colors** | One accent per theme (champagne gold, onyx, etc.). No rainbow. |
| **Subtle motion** | 200-280ms `cubic-bezier(.2,.7,.2,1)`. Hover/press = small lift + brightness shift only. No bounce. No parallax. |
| **Premium table/board presentation** | Board has a velvety surface (radial-gradient + film-grain SVG) with subtle gold hairline frame. Tiles float slightly above (drop-shadow). |
| **Strong tile readability** | Tile face stays ivory/cream contrast against any theme; pip area is dark, not surface color. Sublinminance at all customizations. |

---

## Color philosophy

| Domain | Rule |
|---|---|
| Background base | `#0F0E14` warm charcoal (or theme equivalent). NEVER pure black `#000`. |
| Surface 1 | `#15131C` slightly above base (cards on base) |
| Surface 2 | `#1F1C28` cards-on-surface-1 (nested card depth) |
| Hairline border | `rgba(212, 175, 109, 0.10)` champagne gold (or accent equivalent) at 1px |
| Body text | `#E8E6EF` warm ivory |
| Muted text | `rgba(232, 230, 239, 0.55)` |
| Theme accent | Theme-defined (see each theme below). ONLY used for interactive emphasis (active tab, primary CTA, current turn). |
| Tile face | Theme-defined; **always** ivory/cream (contrast-safe vs board) |
| Tile pip | `#1B1914` warm black (NOT pure black; reads as ink, not void) |

---

## Typography

| Role | Font | Tracking | Weight |
|---|---|---|---|
| Brand / Hero h1 | Fraunces (or Playfair Display fallback) | -0.02em | 600 |
| h2 | Fraunces | -0.015em | 500 |
| h3 | Inter | -0.005em | 600 |
| Body | Inter | 0 | 400 |
| Button | Inter | 0.01em | 600 (UPPERCASE only on primary CTA) |
| Numerics (scores, tile counts) | "Inter" with `font-feature-settings: 'tnum'` | 0 | 500 |
| Slogan / marketing | Fraunces Italic 400 | 0 | -- |

Use Google Fonts. Bundle via `link rel="preconnect"` on manifest-loaded fonts. No FLIP/CLS jolt: load woff2 with `display=swap`.

---

## Theme system

### Black Card (default flagship)

| Token | Value | Description |
|---|---|---|
| `--bg-base` | `#0B0A0F` | obsidian |
| `--bg-surface` | `#15131C` | espresso |
| `--bg-surface-2` | `#1F1C28` | velvet |
| `--accent` | `#D4AF6D` | champagne gold |
| `--accent-soft` | `rgba(212, 175, 109, 0.16)` | gold wash |
| `--accent-text` | `#1B1914` (text on gold) | dark ink |
| `--tile-face` | `#F5EBD9` | warm ivory |
| `--tile-edge` | `#1B1914` | ink |
| `--tile-pip` | `#1B1914` | ink |
| `--board-surface` | radial-gradient(ellipse at center, #1A1823 0%, #0B0A0F 90%) | obsidian radial |
| `--noise` | url("data:image/svg+xml;utf8,<svg ...>") 0.04 opacity | film grain |
| `--hairline` | `rgba(212, 175, 109, 0.12)` | gold hairline |

**Mood:** private high-stakes card room. Conveys exclusivity.

### Private Club

| Token | Value | Description |
|---|---|---|
| `--bg-base` | `#1F1A14` | walnut |
| `--bg-surface` | `#2A231A` | warm leather |
| `--bg-surface-2` | `#3A2F22` | saddle |
| `--accent` | `#C8956A` | bronze |
| `--accent-soft` | `rgba(200, 149, 106, 0.18)` | bronze wash |
| `--accent-text` | `#1B1206` | ink |
| `--tile-face` | `#F2E8D5` | ivory |
| `--tile-edge` | `#1B1206` | ink |
| `--board-surface` | radial-gradient(ellipse at center, #3A2F22 0%, #1F1A14 90%) | leather board |
| `--noise` | url(leather-grain) | texture |
| `--hairline` | `rgba(200, 149, 106, 0.15)` | bronze hairline |

**Mood:** warm, smoked-wood, leather.

### Marble Night

| Token | Value | Description |
|---|---|---|
| `--bg-base` | `#0E1116` | marble |
| `--bg-surface` | `#181C24` | veined slate |
| `--bg-surface-2` | `#22272F` | moonstone |
| `--accent` | `#9FB3C8` | cool platinum |
| `--accent-soft` | `rgba(159, 179, 200, 0.18)` | platinum wash |
| `--accent-text` | `#0E1116` | ink |
| `--tile-face` | `#F1EFEA` | bone |
| `--tile-edge` | `#1A2230` | ink |
| `--board-surface` | radial-gradient(ellipse at center, #22272F 0%, #0E1116 90%) | marble |
| `--noise` | url(marble-grain) | texture |
| `--hairline` | `rgba(159, 179, 200, 0.15)` | platinum hairline |

**Mood:** sleek, monolithic, modern.

### Royal Velvet

| Token | Value | Description |
|---|---|---|
| `--bg-base` | `#0F0A14` | aubergine |
| `--bg-surface` | `#1A1124` | velvet |
| `--bg-surface-2` | `#2A1A3A` | royal purple |
| `--accent` | `#C9A85F` | warm gold |
| `--accent-soft` | `rgba(201, 168, 95, 0.20)` | gold wash |
| `--accent-text` | `#0F0A14` | ink |
| `--tile-face` | `#F4ECD6` | cream |
| `--tile-edge` | `#1A1124` | ink (matches bg) |
| `--board-surface` | radial-gradient(ellipse at center, #2A1A3A 0%, #0F0A14 90%) | velvet |
| `--noise` | url(velvet-grain) | texture |
| `--hairline` | `rgba(201, 168, 95, 0.18)` | gold hairline |

**Mood:** royal ballroom, theatrical, plush.

### Modern Minimal

| Token | Value | Description |
|---|---|---|
| `--bg-base` | `#F7F5F0` | bone |
| `--bg-surface` | `#FFFFFF` | white |
| `--bg-surface-2` | `#EFEBE0` | subtle grey |
| `--accent` | `#111111` | true black |
| `--accent-soft` | `rgba(17, 17, 17, 0.06)` | onyx wash |
| `--accent-text` | `#FFFFFF` (text on accent) | white |
| `--tile-face` | `#F5EBD9` (still ivory, contrasted vs white) | warm ivory |
| `--tile-edge` | `#1B1914` | ink |
| `--board-surface` | radial-gradient(ellipse at center, #EFEBE0 0%, #F7F5F0 90%) | pale |
| `--noise` | url(paper-grain) | subtle texture |
| `--hairline` | `rgba(17, 17, 17, 0.10)` | soft ink hairline |

**Mood:** editorial, daylight, gallery. Inverse of flagship.

All themes MUST satisfy: body text >= 4.5:1 vs surfaces; tile face >= 7:1 vs board; hairline border visible but not loud.

---

## Background customization (app-wide)

### Behavior

| Capability | Implementation |
|---|---|
| Built-in gallery (8-12 backgrounds) | Ship textures/CSS-gradient pack: velvet, leather, marble, walnut, slate, glass, fog, paper. Plus 2-4 SVG abstract patterns. |
| User upload (Tier A on) | `<input type="file" accept="image/*">`; client-side resize to 1920x1080 max via `createImageBitmap` + canvas; store as base64 in `localStorage` (max 1.5 MB after resize). |
| Crop/fit | `background-size: cover` for hero/dashboard; `background-attachment: fixed`. Custom crop UI optional (P1). |
| Readability safeguard | ALWAYS compose: `image, blur(0-12px), dim-dark-overlay`. Default `blur(6px) + dim rgba(0,0,0,0.45)`. Settings per-page with sensible defaults. |
| Vignette | `radial-gradient(transparent 40%, rgba(0,0,0,0.35) 100%)` always on with custom bgs. |
| Reset | "Reset to default" button always reachable in `/profile`. |
| Quality floor | If uploaded asset dim/contrast fails threshold, prompt user or auto-reject with explanation. |
| Per-page | App-wide by default; per-room stays consistent; tournament lobby may override per-event (Tier C). |

### Storage / routing

- `localStorage["dominoes.bg.kind"]` = `"default" | "preset" | "user"`
- `localStorage["dominoes.bg.preset"]` = preset id
- `localStorage["dominoes.bg.user"]` = base64 (1.5MB cap)
- No server upload in v1; self-hosted, server-light.

### Defaults (per page surface)

| Page | Default | Override |
|---|---|---|
| Landing `/` | `--bg-base` radial | None |
| Home `/home` | preset `velvet-night` | yes (user) |
| Dashboard `/tournaments` | preset `marble-night` | yes (user) |
| Match `/match/[id]` | preset `--board-surface` radial | YES (Tier B for tournament rooms) |
| Profile | preset `--bg-surface-2` | yes (user) |

The match room ALWAYS uses `--board-surface` regardless of outer background unless the user explicitly opts in via a toggle ("Use custom board skin" -- P1 v2).

---

## Logo / branding support

### Base (Tier A) -- every account gets this

- A small monogram / club mark in the upper-left near the brand name (`<brand-name>`).
- Configurable in `/profile` for the user's own club handle.
- Single SVG upload (max 80x80, 5KB), or stylized text monogram fallback.
- Stored in `localStorage` ONLY; rendered via `<img>` inside the layout.

### Room/lobby branding (Tier A)

- Each user-uploaded logo also appears in:
  - User's own profile card
  - Match-side handle area (small badge under user name)

### Tournament branding (Tier B) -- gated by host role

- Tournament page allows host to upload:
  - Logo (max 240x240, 80KB)
  - Cover image (1920x540, 250KB after resize)
  - Accent color (within safe-zone palette)
- Stored in the `tournaments` table (DB schema migration in card if needed; for v1 store in local storage + server field `branding` JSONB)
- Render:
  - Branded header on tournament detail page
  - Branded check-in/lobby/waiting screens
  - Branded bracket header

### White-label (Tier C) -- future

- Event-specific color palette (constrained to safe extraction from logo/cover)
- Custom welcome screen
- Tournament announcement banners
- See `tournaments.branding` JSON column for now.

### Logo placement rules (hard)

| Page | Allowed | Max | Position |
|---|---|---|---|
| Top nav (Brand area) | monogram only | 36px tall, left of name | top-left |
| Profile header | monogram + horizontal logo | 96px tall | centered |
| Match handle badge | monogram only | 22px tall | under name |
| Tournament header | monogram + horizontal logo + cover | 240x240 + 1920x540 | top-of-card |
| Tournament bracket | monogram | 32px tall | next to title |
| Chat scroll header | brand chip only | 16px tall | right-side floating chip |

NEVER: corner overlays larger than 8% of viewport; mid-content bands; tile overlay.

---

## Safe-zone rules (HARD CONSTRAINTS)

| Constraint | Min | Why |
|---|---|---|
| Body-text contrast vs surfaces | 4.5:1 | WCAG AA normal |
| Tile-face vs board-surface | 7:1 | gameplay critical |
| Brand-text contrast vs hero background | 4.5:1 | legibility |
| Custom-background dim overlay | >= rgba(0,0,0,0.30) under gameplay UI | readability |
| Custom-background blur | >= 4px under gameplay UI | readability |
| Logo height on match room | <= 22px (no overlap with board) | gameplay priority |
| Accent-color saturation | <= 70% | avoid gaudy |
| Accent-area on screen | <= 30% of viewport | dominance control |
| Auto-fallback if uploaded asset <200px OR >4MB | force fallback | quality floor |
| Custom bg gradient fallback when SVG textures fail | present | graceful degrade |

## Motion rules

- All transitions: 200-300ms with `cubic-bezier(.2,.7,.2,1)`.
- Hover lift: `translateY(-1px)` + brightness +5%. Never `scale(1.05)`.
- Press: `translateY(0)` + brightness -5%.
- Tile select: `outline: 2px solid var(--accent)` + 4px offset.
- Board mount: 280ms fade-in.
- New round: 320ms cross-fade.
- No bounce, no parallax, no flash.

---

## Acceptance criteria

A. Every route renders without overflow / raw errors at 360px and 1280px viewports.
B. Each of the 5 themes passes automatic contrast audit (4.5:1 body, 7:1 tile).
C. Tile face + pip readable with the strongest custom background overlay applied.
D. User-uploaded backgrounds do NOT exceed 1.5 MB after resize.
E. Theme picker persists across reloads.
F. Background picker persists across reloads.
G. Theme + background apply to: home, profile, dashboard, login, payments, admin, play/1v1, play/ai, play/group, tournaments (list + detail), match room.
H. Tournament header shows branding when set; otherwise falls back to theme accents.
I. Logo badges only appear in their allowed placements; never inside gameplay board area.
J. All hero h1s use Fraunces (or serif fallback); no h1 uses default sans.
K. Mobile bottom-tab bar remains premium (gold active dot, soft text).
L. Browser QA screenshots saved: theme switcher, background picker with sample custom, match room in 2 themes, tournament detail with branding ON + OFF.

