<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — MVP Scope (Payments Locked-In)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

What's IN scope for MVP, what's NOT.

---

## IN scope (MVP)

### Gameplay
- 4 rulesets: Traditional, Block, Draw, All Fives (Fives).
- 3 AI difficulties (easy/medium/hard).
- Win-score targets: 100 / 150 / 200 / 250.
- Match screen: real dominoes table layout (table-first, mobile-first).
- Pass-on-no-legal-play, draw limits, blocked-round detection, round-end → new round.

### Multiplayer / casual
- 1v1 by username.
- Rematch (recent opponents).
- Search Players (live search).

### Tournament foundation (Flyclops-style)
- Single-elimination brackets.
- Flexible player counts with auto-byes.
- Best-of-3 match format (configurable).
- Tournament match rooms reusing the same match-room components.
- Live bracket dashboard.
- Host start, host invite, player join + check-in.

### Payments — Zelle/Venmo manual operations
- Payment modes: `free` and `paid`.
- Payment rails: Zelle, Venmo (each can be enabled per tournament).
- Host-controlled payment handle + instructions + amount + due-by.
- Player submission with free-text reference (and optional URL).
- Host approval/rejection/waive workflow.
- Co-host permission grants (opt-in per tournament).
- Bracket-lock gating with `late_no_show` exclusion.
- Append-only audit JSONB on `payments`.
- Status enum: `unpaid`, `submitted`, `approved`, `rejected`, `waived`, `cancelled`, `refunded`, `late_no_show`.

### Authentication
- Phone-OTP primary.
- Guest auth for review.
- Roles: player, cohost, host, owner.

### Money/store boundary
- NO in-app payment processing.
- NO card forms. NO Stripe / PayPal / Braintree.
- NO platform custody.
- NO real-time "payment succeeded" UI without host approval.

## OUT of scope (deferred to V1.1 or later)

- **File upload for proof** (image storage in S3). V1.1. We accept free-text reference now.
- **In-app chat for paid tournaments** — already in scope as scope=tournament but no special payment-channel integration.
- **Public tournament pages** (read-only URL for marketing). Future.
- **Multi-currency** — V2. V1 is USD/cents.
- **Refund flow UI** — host marks `refunded` manually off-platform; record-only inside the app. No UI for "issue refund".
- **Subscription / VIP tiers** — explicitly NOT MVP. Per `BRANDING_TIER_MAP.md` Tier A/B/C are **recorded as plans**, not active features.
- **App Store / Google Play packaging** — explicitly out of MVP per operator directive. Money/store boundary is preserved.
- **Webhook integrations with Zelle / Venmo** — never. Manual only.
- **Auto-detect payment arrival** — never.

## Money/store boundary (permanent)

No exceptions. Money NEVER moves inside the app. Refunds NEVER happen inside the app. The "manual payment collection" pattern is permanent.

## Theme/UX

- 5 themes (Black Card, Private Club, Marble Night, Royal Velvet, Modern Minimal). Tier A demo-quality. Tier B/C are plan-only.
- Mobile-first. Bottom-anchored hand tray. Large touch targets.
- Tournament branding: default + Tier B/C options.

---

## Status checklist at MVP cut-over

- [x] Engine handles all 4 rulesets with legal moves, pass/draw/scoring.
- [x] Bracket generator handles 2/3/4/5/6/7/8/etc. with byes.
- [x] Tournament best-of-3 wiring increments wins + advances.
- [x] Tournament match-room shell + dashboard UI.
- [ ] **Payment config UI** — host creates/updates tournament payment mode, rails, handle, instructions.
- [ ] **Player submission UI** — submit "I paid" with reference.
- [ ] **Host review queue UI** — list/filter/approve/reject/waive.
- [ ] **Bracket-lock job** — actually run the lock-time gating.
- [ ] **Co-host grants UI** — add/remove co-hosts.
- [ ] **Tournament index page** — list tournaments + create.
- [ ] **Tournament match-room UI** — reuses match-room components with best-of-3 chip.
- [ ] **Lobby Tournaments link** — to `/tournaments`.

The four "Payment" bullets above are the next execution cards after the current tournament-UI lane.
</invoke>