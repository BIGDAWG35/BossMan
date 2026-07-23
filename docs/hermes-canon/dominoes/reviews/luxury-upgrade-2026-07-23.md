# Dominoes Luxury/Modern Design Upgrade -- Review Brief (v1.0)

**Card:** t_dominoes_luxury_design_v1_20260723
**Date:** 2026-07-23

---

## Verdict: **PASS-WITH-FIX**

The Private Dominoes Club PWA is now visually premium. Every route renders the
new design system. 5 curated themes, app-wide background customization, and
base-logo/branding support are all live and reachable from `/profile`.

Single follow-up: Tier B/C monetization hooks are framework-ready but DB
schema field for per-tournament branding was deliberately NOT migrated in
this card (out of scope per "DO NOT IMPLEMENT PAYMENTS/STORE"). The components
are present and null-safe so a future card can plug in the schema + auth gate.

---

## What changed

### Visual system (home, profile, dashboard, play, match, login, payments)

| Pillars | Implementation |
|---|---|
| Dark rich surfaces | Warm charcoal (#0B0A0F) base, espresso (#15131C) surface, velvet (#1F1C28) deep |
| Elegant contrast | 4.5:1 body text, 7:1 tile face vs board; tile face ivory, pip ink |
| Premium materials | Glass/frosted overlay via backdrop-filter; hairline gold 1px borders |
| Polished typography | Fraunces serif (display) + Inter (body) via Google Fonts |
| Restrained accent | One accent per theme; champagne gold by default |
| Subtle motion | cubic-bezier(.2,.7,.2,1) 220ms; translateY(-1px) lift; no bounce |
| Board surface | Each theme: radial-gradient + tunable noise + tile readability floor |

### Theme system (Tier A)

- 5 curated premium themes:
  - **Black Card** (default flagship) - obsidian + champagne gold
  - **Private Club** - warm leather + bronze
  - **Marble Night** - sleek slate + cool platinum
  - **Royal Velvet** - aubergine + warm gold
  - **Modern Minimal** - editorial daylight + onyx
- All themes satisfy 4.5:1 body contrast + 7:1 tile face contrast.
- Theme picker lives in `/profile`. Persists across reloads.
- Theme re-applies immediately on selection; ARIA-pressed reflects state.

### Background customization (app-wide)

- 8 built-in premium backgrounds (Velvet Night, Walnut Library, Marble Cold,
  Gold Poker, Slate on Onyx, Editorial Paper, Midnight Velour, Champagne Silk).
- User upload (PNG/JPG/SVG, max 4MB input, auto-resized to 1920x1080 max,
  capped at 1.5MB base64). Stored only on client.
- Safety overlay: auto-applies dim (default 0.45) + blur (default 6px) +
  vignette via `app-has-custom-bg` class + `::before` fixed layer.
- Reset-to-default always present.
- Applies to every page (home, profile, dashboard, login, payments, admin,
  play/1v1, play/ai, play/group, tournaments list + detail, match room).
- Match room keeps the theme's board surface by default (no custom board
  background in v1 -- reserved for Tier B).

### Logo / branding (Tier A)

- Monogram image upload (max 12KB PNG/SVG; auto-resized to 96x96).
- Monogram text fallback (1-3 chars; "DC" by default).
- Handle text (max 32 chars; "Private Dominoes Club" by default).
- Renders in app shell header (brand mark + name).
- Persistent via localStorage.
- Clear/reset controls present.

### Tier B/C hooks (framework-ready)

- `TournamentBrand.svelte` accepts {monogramDataUrl, coverDataUrl, accent, accentSoft, tagline}.
- Renders a branded band if any of these are non-null.
- Wiring (DB schema field + host-only edit UI + auth) intentionally deferred
  to a future card (per direction: "Do NOT implement payment/store").

---

## Verification

| Check | Result |
|---|---|
| All 12 routes return HTTP 200 with body | PASS |
| All 12 routes render new design tokens (brand-mark, hero, btn-primary-cta) | PASS |
| Build passes; bundle emits Fraunces, app-has-custom-bg, primary-cta | PASS |
| 58/58 unit tests pass | PASS |
| Theme tokens compiled into CSS | PASS |
| Money/store boundaries preserved (no live payments, no packaging) | PASS |
| V3 routing/model/escalation unchanged | PASS |

### Route snapshots

Saved to `~/.hermes/logs/dominoes-luxury-upgrade/{00-11}_*.html` (12 files,
~30 KB total). Each captures the post-build, post-hydration-locked HTML so
reviewers can `less` them offline.

---

## Production-deliverable evidence

| File | Purpose |
|---|---|
| `client/src/app.css` | 13 KB luxury token system (Fraunces + Inter + 5 themes + motion + surfaces) |
| `client/src/lib/ui/themes.ts` | 5 themes, token map, `applyTheme()` runtime |
| `client/src/lib/ui/themeStore.svelte.ts` | reactive theme store + localStorage |
| `client/src/lib/ui/ThemePicker.svelte` | 5-card picker, swatches, ARIA |
| `client/src/lib/backgrounds/presets.ts` | 8 built-in premium presets with safety overlay |
| `client/src/lib/backgrounds/bgStore.svelte.ts` | preset/user/dim/blur persistence + safety floor |
| `client/src/lib/backgrounds/BackgroundPicker.svelte` | picker UI with slider controls |
| `client/src/lib/branding/brandingStore.svelte.ts` | monogram + handle + localStorage |
| `client/src/lib/branding/LogoBranding.svelte` | logo upload UI |
| `client/src/lib/branding/TournamentBrand.svelte` | Tier B/C hook (null-safe) |
| `client/src/routes/+layout.svelte` | brand-mark header + premium nav |
| `client/src/routes/+page.svelte` | landing premium |
| `client/src/routes/home/+page.svelte` | premium home with feature cards |
| `client/src/routes/profile/+page.svelte` | account + Theme picker + BG picker + Brand picker |
| `client/src/routes/tournaments/+page.svelte` | tabs + premium list rows |
| `client/src/app.html` | default `data-theme="black-card"` |
| `~/.hermes/knowledge/dominoes/LUXURY_DESIGN_SYSTEM.md` | full design rationale |
| `~/.hermes/knowledge/dominoes/BRANDING_TIER_MAP.md` | Tier A/B/C plan |
| `~/.hermes/knowledge/dominoes/LANDING_PAGE_NOTE.md` | landing intent note |
| `~/.hermes/logs/dominoes-luxury-upgrade/*.html` | 12 route snapshots |

Commits in BossMan repo: `445aaff` (this card) + previous `c6a66bd` / `7d486ed` / `8cca778`.

---

## What this product feels like now

- Premium materials, not arcade
- Generous space, generous surfaces
- Considered typography (Fraunces serif for display, Inter for body)
- Restrained palette (one accent per theme; no rainbow)
- Premium bottom-tab bar with gold active dot
- Premium action cards with accent bars
- Premium empty states and headers
- Tier B/C branding reserved (not slapped on)
- All customers see premium default; tournament branding is the upsell layer

**Status: Dominoes is now a luxury-modern premium product, baseline-branded,
ready for personal review.**
