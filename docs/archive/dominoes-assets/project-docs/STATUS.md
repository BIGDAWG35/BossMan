<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Master PRD (Status-Locked with Payments)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

This is the master Product Requirements Document for the Dominoes PWA. It is intentionally short; the detail lives in `BLUEPRINT_*.md`, `DATA_MODEL.md`, `ARCHITECTURE.md`, `PERMISSIONS.md`, `TOURNAMENT_RULES.md`, `DECISIONS.md`, `ROADMAP.md`, `MVP_SCOPE.md`.

---

## Product thesis

A Flyclops-style dominoes foundation, built on our own private-club identity. Real dominoes gameplay, mobile-first, polished — for casual play and private invite-only tournaments. **No in-app money. Host-collected Zelle/Venmo is the only paid-tournament flow.**

## Modes

1. **Play the Computer** — solo vs AI with ruleset + difficulty + win-score chips.
2. **Private Match** — 1v1 by username.
3. **Rematch** — recent opponents.
4. **Search Players** — live username search.
5. **Tournaments** — list + create + bracket dashboard + match rooms.

## Rulesets

- Traditional, Block, Draw, All Fives (Fives). All four implemented end-to-end.

## Tournament format

- Single-elimination with auto-byes for non-power-of-2 player counts.
- Best-of-3 match format (configurable).
- Live bracket dashboard.
- Private, invite-only by default.
- Bracket-lock gating (paid vs free).

## Payments

- Free tournaments: no payment row.
- Paid tournaments: `payments` row per `(tournament_id, user_id)`, host-reviewed manual collection via Zelle/Venmo.
- Host approval is the source of truth.
- Player cannot join the bracket without payment approved/waived.
- Audit trail is append-only.

## Differentiation vs Flyclops

1. **Private club identity** — not a public marketplace.
2. **Luxury-modern design** — 5 themes, premium materials.
3. **No in-app money** — safer, faster, simpler to operate.
4. **Hosted collections via Zelle/Venmo** — operationally lean, peer-to-peer.
5. **Tournament branding** — Tier A/B/C plans documented.
6. **Reusable table-first match rooms** — same UX across AI / 1v1 / tournament.

## Out of scope / permanent boundaries

- No PCI / card / ACH processing.
- No platform custody.
- No real-time "payment succeeded" UI without human approval.
- No App Store / Google Play packaging.
- No subscription / VIP monetization (plans documented, not active).

## Done bar

- Game engine behaves like a real dominoes game across all 4 rulesets.
- Tournament engine wires correctly: best-of-3 advancement + bracket lock + co-hosts.
- Payments: Zelle/Venmo collection with host approval (this architecture, implemented next).
- Mobile-first UI shell rendering with all 5 modes.
- All QB verification gates pass before claiming "MVP complete".

This PRD will not drift from the architecture/perms/data-model docs unless explicitly versioned.
