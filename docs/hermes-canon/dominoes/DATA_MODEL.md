<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Data Model (Payments-Locked)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23
**Scope:** Effective entity model INCLUDING payment entities (locked-in now so the schema is source-of-truth for the next execution lane).

The canonical implementation lives in `server/src/db/schema.ts` (Drizzle ORM). This doc mirrors the on-disk schema.

---

## 1. Existing entities (unchanged)

- `users` — user_id, role (player/cohost/host/owner), display_name, publicUsername, is_guest, etc.
- `tournaments` — tournament record (see column extensions below).
- `tournament_players` — join table: which users joined a tournament, seed, checkin_status, placement.
- `matches` — match record. Carries `best_of_n`, `games_player1_wins`, `games_player2_wins` for tournament best-of-N.
- `games` — per-round play state, JSON state_json blob.
- `moves` — record of each move in a game (audit-grade history).
- `chats` / `chat_messages` — in-tournament chat scope.
- `invites` — invitation flow.
- `audit_log` — system-wide audit trail.

## 2. Pre-existing columns on `tournaments` (we keep these)

```
payment_mode           ENUM (free | paid)         NOT NULL DEFAULT 'free'
payment_amount_cents   INTEGER                     NOT NULL DEFAULT 0
payment_handle         TEXT                        NULL
```

## 3. NEW columns on `tournaments` (this card)

```
payment_instructions   TEXT                        NULL
                                                       -- host-written plain-text instructions
                                                       -- (e.g. "Send $25 via Zelle; use memo `Dominoes-<handle>`")

payment_rails          JSONB                       NOT NULL DEFAULT '[]'
                                                       -- structured rail whitelist: {zelle: true, venmo: false, ...}
                                                       -- the UI shows only the listed rails

payment_due_at         TIMESTAMP WITH TIME ZONE    NULL
                                                       -- optional; players must submit by this time
                                                       -- (separate from bracket lock)

approval_required      BOOLEAN                     NOT NULL DEFAULT TRUE
                                                       -- when true, host must review each submission
                                                       -- when false, submission auto-approves

co_hosts_allowed       BOOLEAN                     NOT NULL DEFAULT FALSE
                                                       -- when true, tournament_co_hosts row holders
                                                       -- can also review/approve/waive payments
```

## 4. NEW columns on `payments` (this card, additive to existing)

Existing columns we keep:

```
id                    UUID                        PRIMARY KEY
tournament_id         UUID                        FK tournaments
user_id               UUID                        FK users
amount_cents          INTEGER                     NOT NULL
method                ENUM (zelle | venmo | cashapp | cash | other)  NOT NULL
status                ENUM (see §6)               NOT NULL DEFAULT 'unpaid'
reference_text        TEXT                        NULL
proof_file_url        TEXT                        NULL  (V1: optional URL; V1.1: file storage)
approved_by           UUID                        FK users (set null on delete)
approved_at           TIMESTAMP WITH TIME ZONE    NULL
rejected_reason       TEXT                        NULL
created_at, updated_at TIMESTAMP WITH TIME ZONE   NOT NULL
```

NEW columns:

```
submitted_amount_cents  INTEGER                   NULL
                                                       -- amount the player claims they sent

payment_rail           TEXT                       NULL
                                                       -- 'zelle' | 'venmo' | ... chosen by player at submission

rejected_at            TIMESTAMP WITH TIME ZONE   NULL
cancelled_at           TIMESTAMP WITH TIME ZONE   NULL
refunded_at            TIMESTAMP WITH TIME ZONE   NULL
                                                       -- audit timestamps per status transition

waived_by              UUID                       FK users (set null on delete)
waived_at              TIMESTAMP WITH TIME ZONE   NULL
                                                       -- who waived and when

late_no_show_at        TIMESTAMP WITH TIME ZONE   NULL
                                                       -- set by the bracket-lock job

audit                  JSONB                      NOT NULL DEFAULT '[]'::jsonb
                                                       -- ledger of every status change
                                                       -- each entry: {actor_id, at, from, to, note}
                                                       -- never deleted; append-only
```

## 5. NEW table `tournament_co_hosts` (this card)

```
tournament_id   UUID                          NOT NULL FK tournaments (cascade)
user_id         UUID                          NOT NULL FK users (cascade)
granted_by      UUID                          NOT NULL FK users
granted_at      TIMESTAMP WITH TIME ZONE      NOT NULL DEFAULT NOW()
PRIMARY KEY (tournament_id, user_id)
```

Service operations:
- `addCoHost(tournamentId, userId, grantedBy)` — for hosts/owners only.
- `removeCoHost(tournamentId, userId)` — symmetric remove.
- `listCoHosts(tournamentId)` — for the host dashboard.

## 6. Extended `payment_status` enum

OLD:
```
{pending, marked_paid, approved, rejected, refunded}
```

NEW (additive):
```
{unpaid, submitted, approved, rejected, refunded,
 waived, cancelled, late_no_show}
```

Migration plan:
- ADD VALUE 'unpaid', 'submitted', 'waived', 'cancelled', 'late_no_show' (additive ALTER TYPE).
- Existing rows remap: `pending` becomes `unpaid`, `marked_paid` becomes `submitted` (semantic rename in code).
- `approved`, `rejected`, `refunded` unchanged.

## 7. Index strategy

```
-- existing
INDEX (tournament_id, user_id)   UNIQUE  -- already exists
INDEX (status)                            -- already exists

-- additions
INDEX (tournament_id, status)              -- "review queue for this tournament"
INDEX (payment_rail)                       -- analytics
```

## 8. Migration file

Lives at `server/drizzle/0002_payments_v1.sql`:

```sql
-- 1. extend enum
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'unpaid';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'submitted';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'waived';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'late_no_show';

-- 2. tournaments extensions
ALTER TABLE tournaments
  ADD COLUMN payment_instructions TEXT,
  ADD COLUMN payment_rails JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN payment_due_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN approval_required BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN co_hosts_allowed BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. payments extensions
ALTER TABLE payments
  ADD COLUMN submitted_amount_cents INTEGER,
  ADD COLUMN payment_rail TEXT,
  ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN refunded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN waived_by UUID REFERENCES users(id),
  ADD COLUMN waived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN late_no_show_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN audit JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 4. indexes
CREATE INDEX payments_tournament_status_idx ON payments(tournament_id, status);

-- 5. tournament_co_hosts
CREATE TABLE tournament_co_hosts (
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  granted_by    UUID NOT NULL REFERENCES users(id),
  granted_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tournament_id, user_id)
);
```

This migration is run as part of `t_dominoes_payments_db_v1_20260723` (next execution card).
