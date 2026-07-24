<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Decisions Log

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

Append-only log of architectural decisions for the Dominoes project. Each entry is a closed call that the rest of the system builds around.

---

## D-2026-07-23-001: NO in-app payment processing in V1.

- **Decision:** The Dominoes platform does NOT process payments. Players send money to a host-controlled Zelle/Venmo handle off-platform. The app records claims and host approvals.
- **Rationale:** Avoids PCI-DSS scope, chargeback risk, regulatory obligations as a money transmitter. Aligns with the private-club tournament ethos.
- **Implications:** No Stripe/PayPal/Braintree. No card forms in the app. Refunds happen off-platform (host manually refunds and marks the row `refunded` for audit).

## D-2026-07-23-002: Host approval is the SOURCE OF TRUTH.

- **Decision:** A `payments.status` row reaches `approved` only when a human with role `host`, `cohost`, or `owner` invokes `approvePayment`. No 3rd-party signal ever moves a row to `approved`.
- **Rationale:** Zelle/Venmo notifications are not cryptographically tied to the player. Without explicit host verification, the audit trail loses meaning.
- **Implications:** The system NEVER says "Payment succeeded." Wording is "Approved by `<host displayName>` at `<timestamp>`".

## D-2026-07-23-003: `approval_required` defaults to `true`.

- **Decision:** New paid tournaments default to `approval_required=true` (host reviews each).
- **Rationale:** Most private clubs want manual review. Trusted internal clubs can flip to `false` to auto-approve on submission.
- **Implications:** The `bulk-approve` route is gated by `approval_required=false`.

## D-2026-07-23-004: Proof upload (image file storage) deferred to V1.1.

- **Decision:** V1 accepts a free-text reference (memo, last4, off-platform handle) and an optional pasted URL. V1.1 (post-launch) adds S3-compatible file upload with inline preview.
- **Rationale:** File storage is a non-trivial infrastructure commitment. Free-text reference is sufficient for audit.
- **Implications:** `payments.proof_file_url` schema field is reserved but optional. The V1 review UI shows `reference_text` only.

## D-2026-07-23-005: Currency is USD only in V1.

- **Decision:** All amounts use `payment_amount_cents` integer (USD cents).
- **Rationale:** Multi-currency adds significant complexity (FX, display formatting, Zelle international limits). Single-currency launch is cleaner.
- **Implications:** No FX handling. Future work: add `currency_code` column.

## D-2026-07-23-006: Refunds are off-platform; recorded only.

- **Decision:** `payments.status='refunded'` is a record-keeping state. Refunds happen between host and player outside the app.
- **Rationale:** No money moves in-app, so refunds must be off-platform by definition.
- **Implications:** Host can mark a row `refunded` after they've refunded through Zelle/Venmo. Audit captures the timestamp.

## D-2026-07-23-007: Bracket-lock gating uses ONLY `approved` or `waived`.

- **Decision:** A player may join a paid tournament's bracket at lock time only if their payment row is `approved` or `waived`. All other statuses result in `late_no_show` and exclusion from the bracket.
- **Rationale:** A paid tournament's integrity depends on everyone who paid. Hosts cannot admit players without payment unless they explicitly waive them.
- **Implications:** Hosts must approve OR waive before lock. Otherwise the player is dropped. Players with status `submitted` at lock time are dropped.

## D-2026-07-23-008: Audit log is append-only.

- **Decision:** `payments.audit` JSONB is append-only. No role (including owner) can edit or delete entries.
- **Rationale:** Dispute resolution requires an immutable record of who-did-what-when.
- **Implications:** Enforced via route-level "never UPDATE audit field" guards. Any backfill must be a separate audit entry pointing to the original.

## D-2026-07-23-009: A user cannot review their own payment.

- **Decision:** `actor.id !== payment.user_id` is enforced at the service layer for `approve`, `reject`, `waive`. Hosts can NEVER approve their own entry.
- **Rationale:** Self-approval defeats the audit trail.
- **Implications:** If a host invites themselves to their own tournament, the owner must approve.

## D-2026-07-23-010: Tournament co-hosts are scoped per tournament.

- **Decision:** `tournament_co_hosts` grants permission per tournament. A co-host of tournament A cannot review payments in tournament B.
- **Rationale:** Tournaments are independent operational units. Trust shouldn't bleed across tournaments.
- **Implications:** `co_hosts_allowed` is per-tournament, not per-club-level. (Future: club-level co-host pool.)

---

## Earlier (pre-payments) decisions kept for context

These are from the previous Flyclops foundation card. They are reproduced here for traceability.

### DF-2026-07-23-001: Bracket generator handles flexible player counts with auto-byes.

- For N players, find largest power of 2 ≤ N (call it N2). Top (N - N2) seeds get byes. Round 1 has N2 / 2 matches; round 2 has N2 / 4; halving.

### DF-2026-07-23-002: Best-of-3 (configurable via `matches.best_of_n`) is the universal tournament match format.

- Server increments `matches.games_player1_wins` / `_player2_wins` per completed game. When 2 reached, match declared completed and `advanceBracket` triggered.

### DF-2026-07-23-003: Table-first match layout (TopZone + ChainBoard + BottomHandTray) is reused across AI / 1v1 / tournament contexts.

- Tournament match rooms use the same components the player sees in casual play.

### DF-2026-07-23-004: `games_playerX_wins` increments per game (not overwrites).

- Original code was an overwrite; replaced with increment so multi-game best-of-N works correctly.

### DF-2026-07-23-005: Money/store boundary: NO live payments in MVP.

- This is now backed by the explicit Zelle/Venmo payments architecture (D-2026-07-23-001).
</parameter>
</invoke>