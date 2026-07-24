<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes Payments Architecture — Zelle/Venmo Manual Operations

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23
**Scope:** Lock manual Zelle/Venmo paid-tournament support into the **LIVE** Flyclops-style tournament architecture now.

---

## 0. Why this exists

The Flyclops-style foundation is real (gameplay engine + tournament engine verified live). Paid-tournament support is part of the operator's product definition: private tournaments can be paid (Zelle or Venmo collection), but **NO in-app money movement** and **NO platform custody**. This doc locks the architecture BEFORE the next UI pass so we don't bolt on payments later.

---

## 1. What the V1 payment model is

The Dominoes platform supports three payment modes at the **tournament** level (not at the user level):

| `payment_mode` | Display                                 | Money moves how? | When does the player get access? |
|----------------|------------------------------------------|-------------------|----------------------------------|
| `free`         | "Free entry"                             | Never (no charge) | Immediately on join              |
| `paid` (Zelle) | "Send via Zelle to <handle> · <amount>"  | Host collects off-platform | After host approves their `payments` row |
| `paid` (Venmo) | "Send via Venmo to <handle> · <amount>"  | Host collects off-platform | After host approves their `payments` row |
| `paid` (both)  | "Either Zelle or Venmo"                  | Player chooses; UI shows both options | After host approves |

**Hard rules:**
- **No in-app payment processing.** No card forms, no Stripe, no PayPal checkout, no ACH.
- **No platform custody.** No wallet, no escrow, no holding users' money.
- **No fake instant verification.** The system never claims "payment succeeded". Submission is "submitted", success is "approved" — and only the host/admin can move a row to approved.
- **Host approval is the source of truth.**

---

## 2. Tournament payment configuration (extending `tournaments`)

Each tournament carries its own payment config. **No global / club-level payment config in V1** — each tournament is independently configured.

| Field              | Type / enum                                          | Nullable | Default | Notes                                                                                  |
|--------------------|------------------------------------------------------|----------|---------|----------------------------------------------------------------------------------------|
| `payment_mode`     | ENUM `tournament_payment_mode` = `free` \| `paid`    | NO       | `free`  | **Already exists.**                                                                     |
| `payment_amount_cents` | INTEGER                                           | NO       | 0       | **Already exists.** Tournament creator enters the amount.                              |
| `payment_handle`   | TEXT                                                 | YES      | NULL    | **Already exists.** Single host-controlled string. UI does NOT parse; we never store 3rd-party credentials. Examples: `host@example.com`, `@zelleuser`, `(555) 555-5555`. |
| `payment_instructions` | TEXT                                            | YES      | NULL    | **NEW.** Plain-text instructions the host writes (e.g. "Send $25 via Zelle; use memo `Dominoes-<your-handle>`"). |
| `payment_rails`    | TEXT[] (or JSONB)                                    | YES      | `[]`    | **NEW.** Allowed rails for this tournament: `{zelle, venmo}`. UI shows only the listed rails. |
| `payment_due_at`   | TIMESTAMP WITH TIME ZONE                             | YES      | NULL    | **NEW.** Optional. After this time, players who haven't submitted are flagged. Does NOT lock brackets; the lock happens at `start_time + checkin_window_minutes`. |
| `approval_required`| BOOLEAN                                              | NO       | `true`  | **NEW.** When `true`, the host must approve each payment row. When `false`, auto-approval on submission (for trusted clubs / internal events). |
| `co_hosts_allowed` | BOOLEAN                                              | NO       | `false` | **NEW.** When `true`, users with role `cohost` may also review/approve payment rows.  |

**Migration:** Add the new columns `ALTER TABLE tournaments ADD COLUMN ...`. Migration file: `server/drizzle/0002_tournament_payments.sql`. Match Drizzle schema in `server/src/db/schema.ts`.

---

## 3. Player payment submission flow

### 3.1 Where the data lives

We **extend** the existing `payments` table to track each `(tournament_id, user_id)` row's lifecycle. The table already has a UNIQUE INDEX on `(tournament_id, user_id)`, so each player has exactly one payment row per tournament.

### 3.2 Status machine (canonical)

```
                ┌─────────────┐
                │   unpaid    │ ◀──── automatic at row creation (if tour.payment_mode = paid, on join)
                └──────┬──────┘
                       │ player clicks "I paid" + enters reference
                       ▼
                ┌─────────────┐
                │  submitted  │ ◀──── player marked paid; awaiting host review
                └──────┬──────┘
                       │ host reviews
              ┌────────┼─────────┬──────────────┐
              ▼        ▼         ▼              ▼
       ┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
       │ approved │ │rejected│ │  waived  │ │ late_no_show │
       └──────────┘ └────────┘ └──────────┘ └──────────────┘
              │          │         │              │
              ▼          ▼         ▼              ▼
   player can      player may  player may    player is
   join bracket    resubmit    join bracket  excluded
   & participate  (back to    regardless of (recorded for
                   submitted)  payment       audit)
```

Plus two terminal-but-mutable:
- `cancelled` — player withdrew or tournament was cancelled
- `refunded` — host acknowledges refund, even though refund happens off-platform

### 3.3 Required status enum extension

The existing `payment_status` enum is `{pending, marked_paid, approved, rejected, refunded}`. We extend it to:
`{unpaid, pending, submitted, marked_paid, approved, rejected, refunded, waived, cancelled, late_no_show}`.

Actually: rename `pending` → `unpaid` (semantic clarity), keep `marked_paid` as alias (or treat as `submitted`). **Final canonical enum:**
`{unpaid, submitted, approved, rejected, waived, cancelled, refunded, late_no_show}`.

**Migration:** `ALTER TYPE payment_status ADD VALUE 'unpaid', 'submitted', 'waived', 'cancelled', 'late_no_show';` (additive; existing rows re-interpret `pending` → `unpaid`, `marked_paid` → `submitted`).

### 3.4 What the player can do

| Player action                 | Allowed when payment row is in status       | What gets persisted                                                  |
|------------------------------|---------------------------------------------|----------------------------------------------------------------------|
| View payment instructions    | always (if `tour.payment_mode='paid'`)        | read `tour.payment_handle`/`payment_instructions`/`payment_amount_cents`/`payment_rails`/`payment_due_at` |
| Click "I paid"               | `unpaid` or `rejected`                       | Set `status='submitted'`, populate `submitted_at`, `reference_text`, `payment_rail` (chosen), `submitted_amount_cents` |
| Edit submission              | `unpaid` or `rejected`                       | Same fields updated                                                  |
| Resubmit after rejection     | `rejected`                                   | Set `status='submitted'` again, prev reference overwritten         |
| View status                  | always (their own row)                       | returns the current status                                           |

The `reference_text` is a free-text field the host uses to validate (e.g. memo, last4 of recipient confirmation, screenshot ID, off-platform reference).

**Proof upload — V1 status: text-only.** The schema has `proof_file_url` but we do NOT expose file upload in V1. A player can paste a link to a screenshot in the reference field if they want, but we don't store or render uploaded files yet. Documented under "MVP-next" in §10 (the deprioritization is **V1.1**).

---

## 4. Host / admin / co-host controls

### 4.1 Role permissions

| Action                                                | player | cohost | host | owner |
|-------------------------------------------------------|--------|--------|------|-------|
| View own payment status                                | ✓      | ✓      | ✓    | ✓     |
| View payment row of any player in a tournament         | ✗      | only if `co_hosts_allowed=true` AND `tour.id` AND they're a co-host of THIS tournament (or in own tournament) | own tournament | all |
| Submit / mark-paid                                     | own row only | own row only | own row only | own row only |
| Approve payment                                        | ✗      | only if `co_hosts_allowed=true` AND tournament they co-host | own tournament | all |
| Reject payment (with required note)                    | ✗      | only if `co_hosts_allowed=true` AND tournament they co-host | own tournament | all |
| Waive payment (give free entry to specific player)     | ✗      | only if `co_hosts_allowed=true` AND tournament they co-host | own tournament | all |
| Cancel payment (player withdrew)                       | self     | own tournament       | own tournament | all |
| Bulk approve (when `approval_required=false`)          | ✗      | optional          | own tournament | all |
| Edit tournament's payment config                       | ✗      | ✗      | own tournament (until start) | all |
| Extend lock time                                       | ✗      | ✗      | own tournament | all |

### 4.2 Operational screens (locked into roadmap)

These are spec'd here; each becomes a UI execution card:

| Screen                                     | Route                                      | Who can view                                |
|--------------------------------------------|--------------------------------------------|---------------------------------------------|
| **Tournament payment config**              | `/tournaments/[id]/payments/config`        | host / cohost                              |
| **Tournament payment review queue**         | `/tournaments/[id]/payments`                | host / cohost                              |
| **Player submission view** (one tournament)| entry of the review queue, expanding row    | host / cohost                              |
| **Public-facing tournament pricing card**  | `/tournaments/[id]` (live bracket dashboard, top card)| anyone (joined or not-joined)               |
| **My payment status block**                 | `/tournaments/[id]` (only if joined)        | self                                       |

---

## 5. Tournament gating logic (THE critical rule)

The bracket locks at `start_time + checkin_window_minutes`. Exactly at lock time the system evaluates every `tournament_players` row. We use this single gating rule:

### 5.1 The rule

> **For a paid tournament, a player may participate in the bracket only if their `payments.status` is `approved` or `waived`. All other players are excluded from the bracket at lock time and recorded as `late_no_show`.**

### 5.2 The rule, for free tournaments

> **For a free tournament, every player is effectively `waived`. No gating.**

### 5.3 Edge cases & operator overrides

| Situation                                              | Default behavior                                                                              | Host override                                                                                |
|--------------------------------------------------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| Player joined, hasn't submitted, hasn't paid by lock    | Excluded from bracket. `payments.status='late_no_show'`. Player row in `tournament_players` set to `dropped`. | `payments.status='waived'` (host grants free entry).                                          |
| Player submitted, host hasn't approved by lock           | Excluded.                                                                                      | `payments.status='approved'` (admin grants instant approval even before bank cleared).        |
| Player waived                                           | Always in.                                                                                      | cannot be un-waived (use `late_no_show` if you change your mind before start).             |
| Player rejected                                         | Excluded. They can resubmit but won't make the bracket.                                       | `payments.status='approved'` override.                                                        |
| Host wants to extend lock time                          | Lock fires at original time.                                                                  | `update tournaments.start_time` / `checkin_window_minutes` to push back. **Permanent doc note:** never extend past `start_time + 30 min` without owner. |
| Tournament cancelled                                   | All payment rows `cancelled`. Host marks refunds off-platform manually.                       | n/a                                                                                           |
| Player post-approval tries to double-charge             | Prevent at app layer — `submit` UI only allows `unpaid` or `rejected` rows to be mutated.    | host can `force-edit` payment via admin tool (out of MVP scope).                             |

### 5.4 Pre-lock behavior

Between `start_time` and `start_time + checkin_window_minutes`:

| Player status                                                | What happens in UI                                                                            |
|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| Free tournament                                              | Player can join + check-in immediately.                                                         |
| Paid, unpaid                                                 | Player can join (creates payment row in `unpaid`). Cannot check in until `submitted`.         |
| Paid, submitted                                              | Player can check-in (host will see pending review).                                              |
| Paid, approved                                               | Player can check-in.                                                                            |
| Paid, waived                                                 | Player can check-in regardless.                                                                 |

The host check-in API is the **only** blocker — players who haven't submitted / been approved are blocked at check-in, **not** at join. This is operationally cleaner (player has time to submit).

---

## 6. UX rules

6.1 The UI must say **"Manual payment collection"** rather than "Payment". This is a private-club operations workflow, not a checkout.

6.2 The UI must NEVER say "Payment succeeded" or "Payment verified" without explicit host approval. Approved status text is "**Approved by <host display name>**" with timestamp.

6.3 Currency display is per-payment-amount-cents field. We default to USD/cents. Multi-currency is future.

6.4 The host's `payment_handle` is rendered plain-text on the player's screen. We do NOT pre-fill handle (that makes payment easier to misuse), the player copies it.

6.5 Visible status tokens (canonical; never rename in UI):

- `unpaid` → "Unpaid"
- `submitted` → "Awaiting host review"  (never "processing")
- `approved` → "Approved by <host>"  (never "verified" or "succeeded")
- `rejected` → "Needs resubmission"  (with reason shown to player)
- `waived` → "Waived by host"
- `late_no_show` → "Did not complete payment by deadline"
- `cancelled` → "Cancelled"
- `refunded` → "Refunded (off-platform)"

---

## 7. Data model (locked-in now)

### 7.1 New columns on `tournaments`

```sql
ALTER TABLE tournaments
  ADD COLUMN payment_instructions TEXT,
  ADD COLUMN payment_rails JSONB NOT NULL DEFAULT '[]'::jsonb,  -- e.g. {"zelle": true, "venmo": false}
  ADD COLUMN payment_due_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN approval_required BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN co_hosts_allowed BOOLEAN NOT NULL DEFAULT FALSE;
```

### 7.2 New columns on `payments`

```sql
ALTER TABLE payments
  ADD COLUMN submitted_amount_cents INTEGER,
  ADD COLUMN payment_rail TEXT,                          -- 'zelle' | 'venmo' (which rail the player used)
  ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN refunded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN waived_by UUID REFERENCES users(id),
  ADD COLUMN waived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN late_no_show_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN audit JSONB NOT NULL DEFAULT '[]'::jsonb;   -- every status change: {actor, at, from, to, note}
```

### 7.3 Extended `payment_status` enum

```sql
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'unpaid';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'waived';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'late_no_show';
```

### 7.4 New `tournament_co_hosts` table (for the co-host permission model)

```sql
CREATE TABLE tournament_co_hosts (
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  granted_by    UUID NOT NULL REFERENCES users(id),
  granted_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tournament_id, user_id)
);
```

### 7.5 Migration ordering

`server/drizzle/0002_payments_v1.sql` will run ALTER statements in this order:
1. Extend `payment_status` enum (must run before any column references a new value).
2. Add columns to `tournaments`.
3. Add columns to `payments`.
4. Create `tournament_co_hosts` table.

---

## 8. Permissions model (locked-in now)

| Role | Function                                                                                      |
|------|-----------------------------------------------------------------------------------------------|
| player | Join tournament, see payment config, submit own payment, see own status.                       |
| cohost | Same as host for tournaments where they're listed in `tournament_co_hosts` AND `co_hosts_allowed=true`. |
| host  | All tournament operations, including payment config and approval.                              |
| owner | Same as host across all tournaments + admin only operations.                                  |

The permissions table above is canonical for the implementation. This pattern matches the existing RBAC hook (`requireRole`) in `server/src/middleware/auth.ts`.

---

## 9. Decisions log

### D-2026-07-23-001: NO in-app payment processing in V1.

**Rationale:** The product is a private-club private-tournament product. We do not want (a) PCI-DSS scope, (b) chargeback risk, (c) regulatory obligations as a money transmitter. Players send money externally (Zelle/Venmo), the host collects, and the app is just an audit-grade record of who claims to have paid.

**Implications:** No Plaid / Stripe / Braintree integration in V1. **No card-form anywhere in the app.** All money flow is out of scope for the platform.

### D-2026-07-23-002: Host approval is the SOURCE OF TRUTH.

**Rationale:** When a row says `approved`, it means a human (role host/cohost/owner) clicked Approve. The system never auto-approves based on Zelle notifications or any 3rd-party signal. **No system asserting money has moved.**

### D-2026-07-23-003: `approval_required` defaults to `true`.

**Rationale:** Most private clubs want review-on-claim. Trusted internal clubs can flip to `false` to auto-approve on submission.

### D-2026-07-23-004: Proof upload (image file) deferred to V1.1.

**Rationale:** File storage is a non-trivial infrastructure commitment (S3 or equivalent). V1 captures the off-platform reference text (memo, last4, note), which is sufficient for audit. V1.1 adds stored file upload if the user explicitly needs it.

### D-2026-07-23-005: Currency is USD only in V1.

**Rationale:** Multi-currency adds significant complexity (FX handling, display formatting, Zelle international limits). Single-currency launch is cleaner.

### D-2026-07-23-006: Refunds are off-platform.

**Rationale:** Since no money moves inside the app, refunds are entirely the host's responsibility. The `refunded` status is recorded for audit only.

---

## 10. Proof upload — MVP-now or MVP-next

**MVP-now (V1):**
- Player enters a **free-text reference** (e.g. "Sent $25 via Zelle on June 30 at 9:14 PM, memo: `Dominoes-Mark`").
- Player optionally pastes a URL to a screenshot. Host opens the link manually if they want to look at it.
- No image storage in the app. The schema has `proof_file_url` as a nullable text field for V1.

**MVP-next (V1.1):**
- Add a file upload endpoint that stores proof in S3 (or compatible).
- Show inline image preview in the host review queue.
- Add download link in the audit log.
- Out of scope for the current execution card.

---

## 11. Ops setup for private launch (recommended)

We assume the operator (or a club "host") is a private individual running paid tournaments.

**Host's setup, before running the first paid tournament:**
1. Decide one payout address per rail (e.g. `$their-zelle-handle`, `$their-venmo-handle`).
2. Lock these into the host's personal bank-grade Zelle/Venmo account.
3. Write the tournament's `payment_instructions` clearly (memo guidance, who to send to, deadline, what happens if not paid).
4. **Recommended memos:** include a stable handle per player so the host can reconcile (e.g. `Dominoes-<publicUsername>`). Avoid memo = "Tournament 1". Avoid including the dollar amount in the memo (Zelle ignores it; Venmo limits).
5. Tell players the off-platform wait: "send via the chosen rail then come back to the app and click 'I paid'". The host approves in-app manually as bank notifications come in.

**Risk and postmortem avoidance:**
- **Never** say "payment succeeded" inside the app.
- **Always** read approval status from the app, not from Zelle notifications alone (the player can mark paid; the host approves).
- Players can lie about paying; the host catches that on reconciliation. If the bank notification never matches, `payments.status` stays `submitted`, the player is `late_no_show`, and the host is whole.
- When in doubt about status changes or disputes, the app's `audit` JSONB trail is the canonical ledger.
- **For disputes with the player's bank (e.g. disputed Zelle transfer), the host must handle off-platform.** The app records `refunded` if the host decides to refund; this is for record-keeping, not for money movement.

**For clubs / org hosts with co-host support:**
- Grant `cohost` role to the people who can review payments for your tournament.
- Enable `tournaments.co_hosts_allowed=true` per tournament.
- The audit log records every action with the actor.

---

## 12. Acceptance

This card's deliverable is **architecture lock-in only**: the design, gating logic, entity model, and ops plan above. Implementation is broken into execution cards:

- `t_dominoes_payments_db_v1_20260723` — DB migration + Drizzle schema
- `t_dominoes_payments_api_v1_20260723` — Server routes (config, submission, approval, review queue, waive)
- `t_dominoes_payments_ui_v1_20260723` — UI: review queue + player submission form + config form + status pills
- `t_dominoes_payments_qa_v1_20260723` — Step-5 QA + P5 self-verify on the full payment lifecycle

These will be next up after the current tournament UI lane ships.

---

## Appendix A — status inventory (canonical, must match code & UI)

| Status          | Meaning                                                            | Where used                          |
|-----------------|--------------------------------------------------------------------|--------------------------------------|
| `unpaid`        | Player has joined but not yet submitted a payment claim            | Tournaments UI, payments review      |
| `submitted`     | Player claims they have paid; awaiting host review                 | Tournaments UI, payments review      |
| `approved`      | Host has manually verified the payment arrived                     | Gate passes; player can join bracket  |
| `rejected`      | Host says the claim is wrong; player must resubmit                 | Player blocked; UI prompts resubmit  |
| `waived`        | Host grants free entry to a specific player                        | Gate passes regardless of payment    |
| `cancelled`     | Player withdrew or tournament was cancelled                        | Terminal                             |
| `refunded`      | Host acknowledged refund; refund happens off-platform               | Terminal; audit only                 |
| `late_no_show`  | Bracket lock fired; player had not completed payment in time       | Terminal; player excluded from bracket |

End of architecture doc.
