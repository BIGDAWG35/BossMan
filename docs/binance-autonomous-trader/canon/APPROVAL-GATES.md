# APPROVAL GATES — Trading Lane (Permanent Canon)

**Date locked:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** STANDING RULE. Applies to all BossMan-operated trading lanes.
**Supersedes:** Nothing — first canonization.
**Related:** `AUTONOMY-RULES.md`, `APPROVAL_POLICY.md` (root knowledge dir, general policy).

---

## Relationship to General Approval Policy

This document is **trading-lane-specific** and **STRICTER** than the root `APPROVAL_POLICY.md` (which is the general BossMan auto-resolve framework for routine implementation work).

| Scope | Doc | Default |
|---|---|---|
| Routine implementation (PM2, builds, refactors, QA) | `APPROVAL_POLICY.md` | Auto-resolve |
| Trading operations (entries, exits, sizing, rotations) | `AUTONOMY-RULES.md` | Auto-resolve inside approved policy |
| Trading governance (this doc, 9 gates) | `APPROVAL-GATES.md` | **HARD STOP — Marcelo must approve** |

When in doubt for trading work, this doc wins.

---

## The 9 Approval Gates

For each gate, BossMan MUST:
1. STOP execution
2. Create or update the relevant Kanban card with the proposed change
3. Present: what, why, risk, blast-radius, rollback plan
4. Wait for `approve` / `change X/Y` / `hold` from Marcelo
5. Only then proceed

### Gate 1 — Live-trading enablement changes

Any change to `PAPER_MODE`, `LIVE_PILOT_MAX_NOTIONAL`, or equivalent env flags. Any switch from paper → live or live → paper for any pair.

**Current state (verified 2026-06-15):** `PAPER_MODE=false`, `LIVE_PILOT_MAX_NOTIONAL=75`, bot is LIVE with $128.05 USDT balance.

### Gate 2 — Credentials / API keys / permissions

- Any new Binance API key, secret, or passphrase
- Any permission scope change (read → trade, IP whitelist changes)
- Secret rotation
- Any change to `.env` files containing credentials
- Testnet vs mainnet key swap

### Gate 3 — Security-sensitive actions

- Adding/removing/changing 2FA, withdrawal whitelist, anti-phishing code
- Account email or password changes
- Enabling/disabling withdrawal features
- IP allowlist changes

### Gate 4 — Risk-policy changes

- Risk-per-trade % (currently 3.5%)
- Max exposure % (currently 30%)
- Daily loss cap % (currently 6%)
- Position concurrency limits
- Stop-loss / take-profit logic changes
- **Deployable capital "safe threshold" formula** (locked at "≥3× minimum executable trade size + 2× estimated fee buffer" per Phase 1; numeric floor TODO until venue constraints verified)

### Gate 5 — Architecture redesign

- Adding/removing major components (capital engine, aggression engine, kill-switch, etc.)
- Changing the data flow between Binance bot, Crypto Intel, Money Pipeline
- Switching strategy engines (e.g. EMARSI → ML model)
- Adding new exchanges
- Changing the persistence layer (DB schema, ledger format)

### Gate 6 — Any weakening of safety controls

This gate is **non-negotiable**. Any change that LOOSENS a safety control must be rejected or escalated. Safety controls include:
- Pre-start wrapper (`pre-start.js` — currently fails-closed on 6 checks)
- Hard $75 minimum notional floor
- Kill-switch (activation, criteria, or kill_timeout)
- Pre-trade hook gating
- Fail-closed behavior on any check

**Standing rule:** No PR that weakens a safety control may be merged without explicit Marcelo approval, even if it appears to be a "cleanup" or "optimization."

### Gate 7 — Kill-switch threshold changes

- Daily-loss kill-switch activation threshold
- Consecutive-loss kill-switch activation threshold
- Drawdown kill-switch activation threshold
- Kill-switch cooldowns and recovery conditions

### Gate 8 — Exchange-selection changes

- Adding a new exchange (Kraken, Bybit, Coinbase, etc.)
- Removing an exchange
- Changing the primary exchange
- Cross-exchange routing changes

### Gate 9 — Fee-tier / security-sensitive account changes

- Binance fee tier changes (VIP level, BNB discount, referral code)
- Account-level security features (sub-accounts, API restrictions)
- Margin-mode changes (spot ↔ cross ↔ isolated)
- Product enablement (spot ↔ margin ↔ futures ↔ options)

---

## What does NOT require approval (inside `AUTONOMY-RULES.md` walls)

- Trade entries/exits that match approved strategy signal
- Position sizing inside risk-policy bands
- Coin rotation when criteria met
- Rebalancing inside approved bands
- Routine strategy parameter tweaks inside approved ranges
- Routine log/alert config (suppress noisy alerts, add new health checks)
- Bug fixes that don't change risk policy
- Code refactors that don't change behavior
- Adding new pairs to the scanner (no behavior change, just more candidates)

---

## Override

Marcelo can grant standing approval for a category (e.g. "approve all coin-rotation events for the next 30 days"). Standing approval must be in writing (Kanban comment or Telegram). Default = per-event approval.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-18 | Initial canon lock. 9 gates. |
