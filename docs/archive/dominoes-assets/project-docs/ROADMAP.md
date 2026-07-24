<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Roadmap (Payments-Locked)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

Living roadmap. The Flyclops foundation is DONE 2026-07-23.

---

## ✅ Recently completed

| Date        | Card                                                | Verdict                           |
|-------------|-----------------------------------------------------|------------------------------------|
| 2026-07-23  | `t_dominoes_engine_truth_v1_20260723`                | Engine is real (engine hardening) |
| 2026-07-23  | `t_dominoes_flyclops_foundation_v1_20260723`        | Foundation real; tournament engine real |
| 2026-07-23  | `t_dominoes_zellvenmo_payments_architecture_v1_20260723` | **Payments architecture locked-in (this card)** |

## Now: tournament UI execution lane

| Card                                                  | Status        |
|--------------------------------------------------------|---------------|
| `t_dominoes_tournament_ui_v1_20260723` (next-card-name) | in-flight (build UI, NOT bumping) |

Logical sub-tasks within that lane:
- `/tournaments` index page (list + create form).
- `/tournaments/[id]/+page.svelte` live dashboard wiring (BracketView already exists).
- `/tournament/match/[id]/+page.svelte` reuses TopZone + ChainBoard + BottomHandTray with a best-of-3 chip.
- Lobby's Tournaments link fix.
- Live status pill SSR.

## Right-after: payments implementation lane (separate cards)

| Card | Purpose | Model |
|------|---------|-------|
| `t_dominoes_payments_db_v1_20260723` | DB migration (`0002_payments_v1.sql`) + Drizzle schema | builder + DeepSeek |
| `t_dominoes_payments_api_v1_20260723` | Server routes: config, submit, approve, reject, waive, bulk-approve, co-hosts | builder + DeepSeek |
| `t_dominoes_payments_ui_v1_20260723` | UI: payment config form, player submission form, host review queue, status pills, public pricing card | builder + DeepSeek |
| `t_dominoes_payments_bracket_lock_v1_20260723` | Bracket-lock cron: at start_time + checkin_window_minutes, run the gating rule | builder + ops |
| `t_dominoes_payments_qa_v1_20260723` | Step-5 QA + P5 self-verify | qa-verification + Claude (safety: money) |

Each card has its own kanban card.

## V1.1 (post-launch, second iteration)

- **File upload for proof** (S3 or compatible). Inline preview in host review queue.
- **Bulk payment-notification mailer** — send custom PDF to all approved players before lock time.
- **Tournament branding** (Tier B/C) wired through UI (currently blueprint only).
- **Co-host pool** at the club level.

## V2

- Multi-currency.
- Tournament scheduling assistance (auto-balance byes, schedule optimal match times).
- Public tournament pages with SEO.
- Tournament series (multi-event within a championship).

## Permanent boundary (out of scope FOREVER)

- **In-app payment processing.** No Stripe/PayPal/Braintree. No card forms.
- **App Store / Google Play packaging.** Per operator directive. Money/store boundary preserved.
- **Auto-detection of Zelle / Venmo payments.** No 3rd-party webhooks. Host reviews manually.
- **Live "payment succeeded" claim** without human approval. Wording is "Approved by host".
- **Subscription / VIP monetization.** Tier B/C are plans, not active features.

---

## Acceptance bar for "MVP complete"

- Game engine behaves like a real dominoes game across all 4 rulesets.
- Tournament best-of-3 with flexible counts + byes + advancement works.
- Paid tournaments support Zelle/Venmo collection with host approval flow.
- UI shell renders the same match-room across AI / 1v1 / tournament.
- Money/store boundary intact. No in-app money movement.
- All criteria verified by Step-5 QA + P5 self-verify.

The payments lane is the final missing piece.
