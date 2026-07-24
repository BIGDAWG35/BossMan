# Dominoes Branding Tier Map (Permanent)

| Tier | Surface | Card |
|---|---|---|
| **A — Base premium** | App shell (default), Theme picker, Background picker, Logo/Brand panel in `/profile`, Monogram in match handle badge. Every signed-in user. | This card |
| **B — Premium branded** | Tournament header (logo + cover), Branded check-in/lobby/waiting, Branded bracket header (host can supply). | `t_dominoes_tournament_brand_v1_*` (future card) |
| **C — White-label** | Custom event colors within safe extraction palette, Cover image, Premium waiting/lobby screens, Host/sponsor presentation, Limited edition tournament kits. | Future card after product launch |

Feature model in this delivery:
- Per-user brand (Tier A) lives in `localStorage`.
- Per-tournament brand (Tier B) is a JSON field on `tournaments.branding` (NULL in v1 schema).
- Per-event kit (Tier C) requires safe-color extraction from user logo; deferred to a follow-up card.

**No monetization built.** This is the packaging map that future pricing tiers can plug into.
