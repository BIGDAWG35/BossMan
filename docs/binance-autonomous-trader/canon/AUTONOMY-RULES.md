# AUTONOMY RULES — BossMan Trading Lane (Permanent Canon)

**Date locked:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** STANDING RULE. Survives session resets. Applies to ALL BossMan-operated trading lanes (Binance bot v1, future Kraken/Bybit lanes, etc.).
**Supersedes:** Nothing — first canonization.
**Related:** `APPROVAL-GATES.md`, `SYSTEM-SEPARATION.md`, `DYNAMIC-CAPITAL.md`, `APPROVAL_POLICY.md` (root knowledge dir).

---

## The Standing Rule

**BossMan handles routine trade execution autonomously inside approved rules.**

Marcelo is NOT consulted for:
- Individual trade entries, exits, or rotations
- Position sizing inside approved risk policy
- Capital allocation inside approved dynamic-capital policy
- Coin rotation when criteria are met
- Stop-loss / take-profit execution
- Rebalancing inside approved bands

BossMan DOES escalate to Marcelo for anything listed in `APPROVAL-GATES.md`.

---

## Operating Bounds (the 4 walls of the lane)

| Wall | Rule | Where it lives |
|---|---|---|
| **Approved rules** | Trade execution must conform to risk policy, capital policy, strategy spec. Deviations → escalate. | `DYNAMIC-CAPITAL.md`, trading-lane spec |
| **Approval gates** | Anything in the 9-gate list → STOP, ask Marcelo, await `approve`. | `APPROVAL-GATES.md` |
| **Hard system separation** | Trading lane may NOT mutate Money Pipeline, Square, Bakery, or any other financial system. May READ public market data only. | `SYSTEM-SEPARATION.md` |
| **Mandatory pre-trade hooks** | Pre-start wrapper, kill-switch, risk guards MUST pass before any trade fires. Bot must fail-closed on any pre-flight failure. | `binance-bot/pre-start.js`, kill-switch spec (Phase 2) |

Cross any wall → escalation. Fail-closed means "do not trade" not "log and continue."

---

## Override Rule

Marcelo can ALWAYS re-engage by saying "hold for my approval" on:
- A specific card
- A specific category (e.g. "hold every coin rotation for me for the next week")
- All trading work ("freeze the trading lane until I say go")

Default is auto-execute inside the walls. Freeze-on-demand is the override.

---

## Incident Reporting

BossMan reports to Marcelo (Telegram + Kanban card comment) on:
- Any trade that breached a wall (kill-switch should have caught it; if it didn't, that's a finding)
- Any kill-switch activation
- Any approval-gate hit
- Any change to deployable capital ≥ 5%
- Daily end-of-day summary (PnL, positions, capital state) via existing `binance-bot-live-monitor` cron

Routine successful trades: silent. No chat spam.

---

## Why this canon

v3 model routing makes BossMan the only orchestration authority. Trading lanes are the highest-cost, highest-risk category. Without an explicit standing rule, every trade could become a "should I ask?" question. The standing rule says: don't ask, act inside the walls, escalate at the gates. This keeps Marcelo out of the trade-execution loop and focused on governance.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-18 | Initial canon lock. Approved per Binance Bot Autonomous Trader v1 KICKOFF, Phase 1. |
