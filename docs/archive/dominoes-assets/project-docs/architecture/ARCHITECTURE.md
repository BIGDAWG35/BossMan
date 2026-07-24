<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Architecture (Payments-Locked)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

High-level system architecture for the Dominoes PWA. The full payment architecture is in `architecture/PAYMENTS_ARCHITECTURE_2026-07-23.md` — this doc cross-references that.

---

## 1. Stack

| Layer        | Tech                                                   |
|--------------|--------------------------------------------------------|
| Frontend     | SvelteKit (TypeScript), Svelte 5 runes mode           |
| Backend      | Fastify (TypeScript) + Drizzle ORM                    |
| Database     | PostgreSQL 16 (Docker)                                 |
| Cache        | Redis (Docker)                                         |
| Tests        | Vitest (engine + bracket-generator unit tests)         |
| Live QA      | Playwright (headless screenshots)                      |

## 2. Layer diagram

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                            │
│  SvelteKit client (port 4173 preview / 5173 dev)        │
│  - /home (lobby)                                        │
│  - /match/[id]   (table-first component shell)          │
│  - /tournaments/[id]  (live bracket dashboard)          │
│  - /tournaments/[id]/payments/{config, review}          │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS (Tailscale IPs)
┌──────────────────────────▼──────────────────────────────┐
│                  Fastify Server (3000)                  │
│  - JWT-authed routes                                  │
│  - payment.service.ts   (claim, approve, reject, waive)│
│  - tournament.service.ts                                │
│  - bracket-generator  (pure function)                   │
│  - audit  (append-only log)                            │
│  - matchmaking & websocket for in-game                  │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL via Drizzle
┌──────────────────────────▼──────────────────────────────┐
│      PostgreSQL 16 (Docker container "dominoes-postgres")│
│  - users, tournaments, tournament_players, matches, games│
│  - payments  (extends: enum + 9 cols + audit JSONB)      │
│  - tournament_co_hosts  (NEW: per-tournament review grants)│
│  - audit_log                                            │
└─────────────────────────────────────────────────────────┘
```

## 3. Payment architecture components

The **payment** flow lives entirely in the canonical **host-approval** model (D-2026-07-23-001, D-2026-07-23-002):

```
                tournament.payment_mode = 'paid'
                          │
                          ▼
            player.join()
                          │
                          ▼
            create payments row  (status='unpaid')
                          │
                          ▼
            player sees config (handle + amount + instructions)
                          │
                          ▼
            player.submit(reference_text, payment_rail, submitted_amount_cents)
                          │
                          ▼
            payments.status = 'submitted'   + audit entry
                          │
                          ▼
            host OR cohost OR owner reviews:
                approve  → status='approved'  + approved_by + audit
                reject   → status='rejected'  + rejected_reason + audit
                waive    → status='waived'    + waived_by + audit
                          │
                          ▼
            At start_time + checkin_window_minutes:
                bracket-lock job runs
                          │
                          ▼
            Players with payment.status IN ('approved','waived') → bracket
            All others → late_no_show (recorded) + bracket exclusion
```

### 3.1 Critical invariants (enforced in service layer)

- A user never reviews their own payment. (`actor.id !== payment.user_id`)
- Co-hosts only review tournaments they have a `tournament_co_hosts` row for, AND only when `tournaments.co_hosts_allowed=true`.
- Refunds are off-platform. The `refunded` status is recorded for audit only.
- `payments.audit` is append-only.

## 4. Tournament architecture components

(Flyclops-style foundation, verified live 2026-07-23)

```
tournaments ──┬─ bracket_data (JSONB)
              │  ├─ matches  (round, position, player_seeds)
              │  └─ bye topology (top (N - N2) seeds get byes)
              ├─ tournament_players  (join table; seeds; checkin; placement)
              ├─ tournament_co_hosts  (NEW: co-host permission grants)
              └─ payment_rails / payment_handle / etc.  (locked-in now)

matches ──┬─ tournament_id (NULL when casual)
          ├─ best_of_n  (defaults to 3)
          ├─ games_player1_wins / _player2_wins  (incremented per game end)
          └─ state_json  (per-round play state)

games (per round within a match)
  - state_json  (EngineState -- 4 rulesets)
```

When 2 wins reached, `match.ts.applyMove` triggers `tournament.service.advanceBracket(matchId, winnerId)`. `advanceBracket` fills the next round's player slot AND creates the round-2+ `matches` row when both slots are filled.

## 5. Authentication & Security

- Phone-OTP primary (sms). Guest auth for review sessions (`is_guest=true`).
- JWT with `accessToken` field; `role` claim.
- Tailscale-only network exposure in MVP.
- `audit_log` captures every privileged action (RBAC, payment, tournament, match).
- No PCI surface — payment data never touches the app. The host's Zelle/Venmo handle is opaque text.

## 6. Money flow

```
Player bank
    │
    │  external Zelle / Venmo transfer
    ▼
Host bank (Zelle / Venmo account)
    │
    │  host reconciles against in-app `payments.submitted` rows
    ▼
Host clicks "Approve" in app
    │
    │  status='approved' + audit
    ▼
Player enters bracket
```

The platform **NEVER** touches money. Refund flow:

```
Host refunds player off-platform (Zelle / Venmo "send back")
    │
    │  host clicks "Mark refunded" in app
    ▼
payments.status='refunded' + refunded_at + audit
```

## 7. Operational guardrails

- Tournament `co_hosts_allowed=true` cannot be flipped after status='live'.
- `payment_rails` are whitelist-locked at tournament creation. Adding Zelle mid-tournament is allowed, removing a rail is not.
- `approval_required=true` is the default; flipping to `false` mid-tournament is allowed only by owner role.
- Audit JSONB is append-only at the route layer. No UPDATE on `payments.audit` is permitted by any role.

## 8. What lives where

| Component                        | File path                                                    |
|----------------------------------|--------------------------------------------------------------|
| Game engine (pure function)      | `shared/src/game/engine.ts`                                  |
| Bracket generator (pure function)| `server/src/lib/bracket-generator.ts`                        |
| Match service                    | `server/src/services/match.ts`                               |
| Tournament service               | `server/src/services/tournament.ts`                          |
| Payment service                  | `server/src/services/payment.ts`                             |
| Drizzle schema                   | `server/src/db/schema.ts`                                    |
| Migration: payments V1           | `server/drizzle/0002_payments_v1.sql`                        |
| Auth middleware                  | `server/src/middleware/auth.ts`                              |
| Tournament routes                | `server/src/routes/tournaments.ts`                           |
| Payment routes                   | `server/src/routes/payments.ts`                              |
| Tournament match-room UI         | `client/src/routes/tournament/match/[id]/+page.svelte`       |
| Tournament dashboard UI          | `client/src/lib/tournament/BracketView.svelte`               |
| Payment review queue UI          | `client/src/routes/tournaments/[id]/payments/+page.svelte`   |
| Payment config UI                | `client/src/routes/tournaments/[id]/payments/config/+page.svelte` |

## 9. Boundaries / off-limits

- No PCI / card / ACH processing.
- No money custody.
- No real-time verification.
- No system-asserted "payment succeeded" without human `approved_by`.
- No cross-tournament co-host grants (per-tournament only).

(End of architecture doc.)
