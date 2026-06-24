# DYNAMIC CAPITAL POLICY — Trading Lane (Permanent Canon)

**Date locked:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** STANDING RULE. Applies to all BossMan-operated trading lanes.
**Supersedes:** Nothing — first canonization.
**Related:** `AUTONOMY-RULES.md`, `APPROVAL-GATES.md`, `SYSTEM-SEPARATION.md`.

---

## The Rule

**The bot reads LIVE DEPLOYABLE CAPITAL before EVERY TRADE CYCLE.**

The bot NEVER sizes from a stale fixed bankroll. The bot NEVER assumes yesterday's balance is today's balance. The bot NEVER assumes an opening-of-day balance is current.

A "trade cycle" = each evaluation loop where the bot considers entry/exit/rebalance/rotation. If the bot evaluates every 60s, it reads deployable capital every 60s.

---

## Deployable Capital — Definition

Deployable capital = the USD-equivalent value the bot is allowed to RISK on new positions, computed fresh on every cycle.

```
deployable_capital = available_balance
                   + realized_pnl_unsettled_credits
                   - reserved_balance
                   - estimated_unfilled_order_collateral
                   - pending_withdrawal_amount
                   - fee_buffer
```

Components:

| Component | Source | Notes |
|---|---|---|
| `available_balance` | Binance `/api/v3/account` (free + locked - borrowed) | Free USDT/USDC/BUSD spot balance. Subtract borrowed if margin enabled. |
| `realized_pnl_unsettled_credits` | Bot ledger | Realized PnL not yet reflected in `available_balance` due to settlement timing |
| `reserved_balance` | Bot config or runtime reserve | Funds the bot refuses to touch (e.g. 10% emergency reserve) |
| `estimated_unfilled_order_collateral` | Open orders + working orders | Worst-case notional if all open orders fill at limit price |
| `pending_withdrawal_amount` | Withdrawal queue / recent withdrawal history | Funds already requested for withdrawal, not yet cleared |
| `fee_buffer` | Computed | Estimated round-trip fees for the worst-case scenario the bot might enter this cycle |

The exact formula is finalized in Phase 3 (Capital Engine). Phase 1 locks the rule and the component list. Numeric thresholds in Phase 1 are TODOs pending venue constraint verification (see below).

---

## Safe Threshold — The Pause Condition

**The bot must DOWNGRADE AGGRESSION or PAUSE entirely when deployable capital falls below the safe threshold.**

Phase 1 locked definition:

> **Safe threshold = `≥ 3× minimum executable trade size + 2× estimated fee buffer`**

In plain terms: the bot must have enough capital to enter at least 3 round-trip trades (worst case) plus enough buffer to cover fees twice over, before it may trade at full aggression.

### Aggression downgrades (when below safe threshold)

| Tier | Deployable capital vs safe threshold | Bot behavior |
|---|---|---|
| **Green — Full aggression** | ≥ 2× safe threshold | All approved strategies active. Max position count, max size per trade. |
| **Yellow — Reduced aggression** | 1× – 2× safe threshold | Half position count. Half size per trade. New entries paused if existing position uses >50% of capital. |
| **Red — Pause** | < 1× safe threshold | NO new entries. Existing positions managed to exit only. Daily PnL still calculated for reporting. |
| **Black — Kill-switch candidate** | < 0.5× safe threshold or other red-line trigger | Kill-switch criteria (Phase 5) evaluated. May auto-pause + alert Marcelo. |

### Why this threshold

- **3× minimum trade size** = enough headroom that one losing streak doesn't make a single new trade impossible.
- **2× fee buffer** = enough to cover round-trip fees on the largest position twice, so a margin call from fees is impossible.
- Below this floor, the bot is operating on fumes — scaling down protects against cascade failures (e.g. fee spike + missed exit + thin liquidity compounding).

### TODO (Phase 2 / Phase 3 will resolve)

- Exact minimum executable trade size (currently $75 per `LIVE_PILOT_MAX_NOTIONAL=75`; subject to Gate 1 changes)
- Exact fee buffer formula (depends on Binance fee tier — VIP level, BNB discount; subject to Gate 9)
- Whether the 3×/2× multiplier is venue-agnostic or per-exchange (currently assumed venue-agnostic; revisit when exchange-selection is expanded per Gate 8)

Until these are nailed down, the canon stays as a FORMULA, not a numeric floor. Numeric floors in code are a Phase 3 deliverable and must reference this canon doc.

---

## Withdrawal-Aware Sizing

**Profit withdrawals IMMEDIATELY reduce tradable capital.**

When the bot (or operator) initiates a withdrawal from the trading balance:
1. The withdrawal amount is subtracted from `deployable_capital` on the next cycle (or sooner if the withdrawal is confirmed pending).
2. The bot's aggression tier is re-evaluated against the new deployable capital.
3. If the withdrawal drops capital below safe threshold → bot downgrades to Red or Black tier as appropriate.
4. Position sizing on subsequent cycles uses the post-withdrawal deployable capital.

Withdrawals do NOT need an approval gate (they're operator-initiated, not bot-initiated). However, if the bot ever auto-suggests a withdrawal (e.g. profit-take rule), that suggestion goes through `APPROVAL-GATES.md` Gate 4 (risk-policy changes) before being auto-implemented.

---

## Stale-Read Detection

The bot must NOT trade on a stale deployable-capital read. Stale = any of:

- Read timestamp > 60s old (configurable; 60s default for 60s evaluation loop)
- Read returned an error or empty balance
- Read returned a balance that diverges from the last good read by > 10% (anomaly check)
- Connection to Binance timed out during the read

On stale read: bot uses LAST KNOWN GOOD deployable capital AND logs a warning. If last known good is also > 5 min old → pause all new entries until a fresh read succeeds.

---

## Reporting

BossMan reports deployable capital state to Marcelo:
- On every tier change (Green ↔ Yellow ↔ Red ↔ Black)
- On every withdrawal that changes deployable capital by ≥ 5%
- In daily end-of-day summary
- On any stale-read incident that triggers pause

Routine cycle-by-cycle deployable capital values: silent.

---

## Why this canon exists

Two failure modes it prevents:
1. **Over-leverage after withdrawal.** Bot assumes $1000 capital, operator withdraws $400, bot enters a $300 trade that should never have happened.
2. **Over-leverage after fee spike / settlement lag.** Bot assumes balance X, fees eat into it, bot's position is now 80% of true capital instead of the planned 30%.

Both are silent failures: nothing throws, nothing alerts, just a slow drift toward ruin. The dynamic-capital policy makes the read mandatory, the threshold mandatory, and the downgrade behavior mandatory.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-18 | Initial canon lock. Formula locked, numeric thresholds TODO. |
