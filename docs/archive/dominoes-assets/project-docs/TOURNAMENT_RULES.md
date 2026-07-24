<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Tournament Rules

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

This is the canonical rulebook for the Dominoes tournament lifecycle. Player-facing rules live here; technical architecture lives in `architecture/PAYMENTS_ARCHITECTURE_2026-07-23.md`.

---

## 1. Tournament lifecycle

```
draft  →  upcoming  →  checkin  →  live  →  completed
                                              \→ cancelled (any point)
```

| State      | Meaning                                              | Player can join? | Bracket exists? |
|------------|------------------------------------------------------|--------------------|------------------|
| draft       | Created but not yet visible. host admin only.       | ✗                  | ✗                |
| upcoming    | Visible. Players can join, see config, submit payment. | ✓ (free: yes; paid: yes, payment row created) | ✗ |
| checkin     | Within `checkin_window_minutes` of start. Players can check in. | ✓ (just check-in window; closes at start) | ✗ |
| live        | Started. Bracket exists. Games in progress.           | ✗                  | ✓                |
| completed   | Bracket resolved. Placement set. Audit final.         | ✗                  | ✓                |
| cancelled   | Cancelled by host or admin.                          | ✗                  | ✗                |

## 2. Joining rules

| Action                                  | Free tournament              | Paid tournament                                  |
|-----------------------------------------|------------------------------|---------------------------------------------------|
| View tournament                         | ✓ anyone                     | ✓ anyone                                         |
| Join                                     | ✓                          | ✓ (creates payment row in `unpaid`)              |
| See payment config                      | n/a                          | ✓ always                                         |
| Mark "I paid" with reference            | n/a                          | ✓ (status: unpaid → submitted)                    |
| Check in                                | ✓                          | ✓ (status ≥ submitted allowed; ≥ approved/waived for the actual start) |
| See own payment status                   | n/a                          | ✓ always                                         |

## 3. Bracket generation

- Single-elimination format.
- For N players, find largest power of 2 ≤ N (N2). Top (N - N2) seeds get byes to round 2.
- Round 1 has N2 / 2 matches.
- Each subsequent round halves.
- If placement=top_3, add a 3rd-place playoff match.

## 4. Match format

- Each tournament match is best-of-3 games (configurable via `matches.best_of_n`; default 3).
- Player/team who wins 2 games advances.
- `games_player1_wins` / `games_player2_wins` increment as each game completes.
- When 2 wins reached, match is completed and `advanceBracket` is invoked.

## 5. The bracket-lock gating rule (THE rule)

The bracket locks at `start_time + checkin_window_minutes`. At that exact moment the system evaluates every `tournament_players` row and applies this single rule:

> For a **paid** tournament, a player may participate in the bracket only if their `payments.status` is `approved` or `waived`. Players with any other status are excluded and recorded as `late_no_show`.

For a **free** tournament, every player is in by default.

This rule is enforced by the `advanceBracket` + `startTournament` + bracket-lock job.

## 6. What happens at lock time per status

| Status             | Lock-time behavior                                                                                |
|--------------------|----------------------------------------------------------------------------------------------------|
| unpaid             | Excluded from bracket. Marked `late_no_show`. Their `tournament_players.row.checkin_status='dropped'`. |
| submitted          | Excluded (host didn't approve in time). Marked `late_no_show`. Host can still approve BEFORE the actual lock-start, then they're in. |
| approved           | In the bracket. ✓                                                                                  |
| rejected           | Excluded. Marked `late_no_show`. Player can resubmit, but they don't make this bracket.             |
| waived             | In the bracket regardless of payment. ✓                                                            |
| cancelled          | Excluded. Terminal.                                                                                  |
| refunded           | Excluded. Terminal.                                                                                  |
| late_no_show       | Already terminal. Excluded.                                                                          |

## 7. Host override (operational escape hatch)

The host (or owner) can override the lock-time gate by:

- `waive payment` on any unpaid/rejected player before lock. → they enter the bracket.
- extend `start_time` (push back the lock time). Subject to the rule that extensions beyond `start_time + 30 min` need owner role.
- set `tournaments.co_hosts_allowed=true` and add co-hosts who can review submissions.

## 8. Refunds

- Refunds are off-platform.
- Host marks the row `payments.status='refunded'` after they've refunded through Zelle/Venmo. The audit trail captures the timestamp.
- `refunded_at` is the only authoritative record. We do not store refund receipt images.

## 9. Cancellation

- Host (or owner) can `cancel` a tournament at any state.
- All `payments` rows for that tournament get `status='cancelled'` with `cancelled_at` timestamp.
- Players are notified via in-app mail (future).
- Hosts handle external refunds (off-platform).
- Audit log captures every action.

## 10. Audit trail (operational guarantee)

Every state transition on `payments` writes to `payments.audit` JSONB:

```json
[
  {"actor_id": "uuid", "at": "ISO8601", "from": "unpaid", "to": "submitted",
   "note": "Player-submitted via API; reference 'Memo: Dominoes-Mark'"},
  {"actor_id": "uuid", "at": "ISO8601", "from": "submitted", "to": "approved",
   "note": "Host-approved via review UI; bank notification matched"}
]
```

The audit is append-only. No role, including owner, can rewrite it.

## 11. Player experience summary

### Free tournament (10:00 PM Saturday)
1. Player clicks "Join" → checked_in_optional flow.
2. Bracket generated. Player plays.
3. Done.

### Paid tournament (10:00 PM Saturday, $25 entry)
1. Player sees the tournament card with payment config (amount, instructions, handle, due-by).
2. Player clicks "Join" → payment row created in `unpaid`.
3. Player sends $25 via Zelle (off-platform).
4. Player clicks "I paid", enters a free-text reference ("Sent $25 on 9:35 PM, memo: `Dominoes-Mark`").
5. Status: `submitted` — "Awaiting host review".
6. Host reviews in app → approves.
7. Status: `approved` — "Approved by `<host>` at `<ts>`".
8. Player checks in (allowed for `submitted` and `approved`).
9. At lock time, player is in the bracket (status ≥ approved or waived).
10. Plays. Done.

### Late submission (after lock time)
- New `submitted` rows after lock time are still recorded for audit but the player is in `late_no_show`. The host decides whether to refund or grant a free pass — but they cannot retroactively bring the player into the locked bracket.

## 12. What the host does during a paid tournament (runbook)

1. Create the tournament: name, ruleset, format, start, checkin-window, placement.
2. Set payment config: amount, handle, instructions, due-by, rails ({zelle, venmo}).
3. Decide: `approval_required=true` (review per submission) or `false` (auto-approve).
4. Optional: enable `co_hosts_allowed=true` and add trusted co-hosts.
5. (Optional) Publish to lobby.
6. Wait for submissions; review each.
7. At lock time: review queue → approve late ones OR waive OR let them be late_no_show.
8. Start tournament. Bracket advances through best-of-3 matches.
9. After completion: mark refunds off-platform if any.

This runbook is the operational reference. Hosts get a copy at first-run.
