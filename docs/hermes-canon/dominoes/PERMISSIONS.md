<!-- Card t_dominoes_zellvenmo_payments_architecture_v1_20260723 -->

# Dominoes — Role Permissions (Payments-Locked)

**Card:** `t_dominoes_zellvenmo_payments_architecture_v1_20260723`
**Date:** 2026-07-23

The Dominoes RBAC system has four roles: `player`, `cohost`, `host`, `owner`. The matrix below covers payment-related operations.

---

## 1. Roles

- **player** — the default role for users joining tournaments.
- **cohost** — auxiliary reviewer inside specific tournaments; **requires** `tournaments.co_hosts_allowed=true` plus a row in `tournament_co_hosts`.
- **host** — owns a tournament; can run its operations end-to-end.
- **owner** — global admin; can run any tournament's operations + all admin-only operations.

## 2. Tournament payment operations matrix

| Operation                                  | player | cohost (when allowed) | host (own tournament) | owner |
|--------------------------------------------|--------|---------------------|---------------------|--------|
| View tournament payment config              | ✓      | ✓ (in their tournament) | ✓ | ✓ |
| View own payment status                     | ✓      | ✓                   | ✓                   | ✓ |
| View any player's payment row in the queue  | ✗      | ✓ (in their tournament) | ✓ (own tournament) | ✓ |
| Submit / mark-paid                          | own row only | own row only | own row only | own row only |
| Approve payment                             | ✗      | ✓ (in their tournament) | ✓ (own tournament) | ✓ |
| Reject payment (with required note)         | ✗      | ✓ (in their tournament) | ✓ (own tournament) | ✓ |
| Waive payment                               | ✗      | ✓ (in their tournament) | ✓ (own tournament) | ✓ |
| Cancel payment (player withdrew)            | self    | own tournament | own tournament | ✓ |
| Bulk approve (when approval_required=false) | ✗      | ✓ (own tournament) | ✓ (own tournament) | ✓ |
| Edit payment config (until start_time)     | ✗      | ✗                   | ✓ (own tournament) | ✓ |
| Add/remove co-host                          | ✗      | ✗                   | ✓ (own tournament) | ✓ |
| Extend bracket lock time                    | ✗      | ✗                   | ≤30 min: ✓        | ✓ (any) |
| Delete audit entries                        | ✗      | ✗                   | ✗                  | ✗ (audit is append-only, never deleted) |

## 3. Implementation hooks (existing in the system)

The codebase already has `requireRole` middleware. We will add a new `requirePaymentPermission` middleware that checks:
1. The actor is in the tournament (host, owner, OR co-host with co_hosts_allowed=true).
2. The action is permitted (above matrix).

A co-host's `tournament_co_hosts` row must exist for the tournament in question.

## 4. Server route authorization (canonical patterns)

```
# Free read-only endpoints (anyone authenticated)
GET  /api/v1/tournaments/:id/payments/own       - own row only
GET  /api/v1/tournaments/:id/payments           - host/cohost/owner only

# Player-facing mutations
POST /api/v1/tournaments/:id/payments/submit    - player submits own row

# Host-facing mutations
POST /api/v1/payments/:id/approve               - host/cohost/owner
POST /api/v1/payments/:id/reject                - host/cohost/owner
POST /api/v1/payments/:id/waive                 - host/cohost/owner
POST /api/v1/tournaments/:id/payments/bulk-approve - host/owner (only when approval_required=false)

# Tournament config endpoints (host/owner only)
POST /api/v1/tournaments/:id/payments/config   - host/owner
POST /api/v1/tournaments/:id/co-hosts          - host/owner (co_hosts_allowed must be true)
DELETE /api/v1/tournaments/:id/co-hosts/:userId - host/owner
```

## 5. Permission invariants

- A user **cannot** review/approve their own payment row. (`actor.id !== payment.user_id` enforced in service layer.)
- A user **cannot** waive their own payment row to gain themselves entry. (Same rule.)
- Co-host permission is **scoped to a specific tournament**, not platform-wide. A co-host of tournament A cannot review payments in tournament B.
- Audit log entries are append-only. No role (including owner) can edit or delete an audit entry. This is enforced via `INSERT`-only grants on `payments.audit` (route-level).

## 6. RBAC hardening notes

- The `co_hosts_allowed=true` flag must NOT be set after the tournament has started with active players. Setting it later creates retroactive permission grants that bypass the historical audit trail. The host can disable it during the upcoming period; once status='live' it's locked.
- If a host is demoted or removed mid-tournament, payments already approved remain valid — there is no retroactive approval rollback. New submissions require owner's manual approval.
- The owner of the platform can view all payment rows and audit trails across all tournaments, but should leave operational review to hosts.
