# SYSTEM SEPARATION — Trading ↔ Other Financial Systems (Permanent Canon)

**Date locked:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** STANDING RULE. Applies to ALL BossMan-operated financial systems.
**Supersedes:** Nothing — first canonization.
**Related:** `AUTONOMY-RULES.md`, `DYNAMIC-CAPITAL.md`.

---

## The Hard Rule

**Binance Bot and Money Pipeline have ZERO runtime coupling.**

Money Pipeline CANNOT read:
- Binance balances (any currency)
- Binance positions (open or closed)
- Binance PnL (realized or unrealized)
- Binance order history
- Binance trade signals or strategy state
- Any Binance-bot internal ledger

Money Pipeline CANNOT write to Binance Bot in any way.

---

## What Money Pipeline CAN do (trading-adjacent)

Money Pipeline operates on **its own** data:
- Its own curated deal pipeline (Dental SaaS, etc.)
- Its own scoring engine
- Its own capital allocation logic across its own opportunity set

Money Pipeline does NOT need Binance-bot data to function. If a future feature appears to need it, the design is wrong — escalate per `APPROVAL-GATES.md` Gate 5 (architecture redesign).

---

## Crypto Intel → Binance Bot (one-way only)

Crypto Intel MAY feed Binance Bot one-way:
- Market regime calls (risk-on, risk-off, sideways)
- Volatility/regime indicators
- News/event flags
- Macro context

Crypto Intel MUST NOT:
- Receive trade execution data from Binance Bot (no feedback loop)
- Receive position state from Binance Bot
- Receive PnL from Binance Bot
- Influence Binance Bot sizing beyond the regime flag itself
- Be queried by Binance Bot for trade decisions (Bot has its own data)

The directional arrow is: **Crypto Intel → Binance Bot, never the reverse.**

---

## What Binance Bot CAN read (externally)

- Binance public API (market data, order book, klines, ticker)
- Crypto Intel one-way feed
- Its own internal ledger
- Its own DB

What Binance Bot CANNOT read:
- Money Pipeline DB
- Square payouts DB
- Bakery DB
- Any other BossMan financial system

---

## Why this canon exists

Two reasons:
1. **Blast-radius containment.** A bug or compromise in one system cannot drain or corrupt the other. If Binance bot is breached, Money Pipeline's capital is safe. If Money Pipeline's scoring engine has a bug, Binance bot's positions are unaffected.
2. **Audit clarity.** Each system's ledger is independent. Auditing Binance bot does not require touching Money Pipeline. PnL, taxes, and reconciliation are clean.

---

## Boundary check (Phase 1 deliverable, must verify)

| Boundary | Direction | Status |
|---|---|---|
| Binance Bot → Money Pipeline | READ | FORBIDDEN (zero coupling) |
| Binance Bot → Money Pipeline | WRITE | FORBIDDEN |
| Money Pipeline → Binance Bot | READ | FORBIDDEN |
| Money Pipeline → Binance Bot | WRITE | FORBIDDEN |
| Crypto Intel → Binance Bot | READ | ALLOWED (market data, regime flags) |
| Binance Bot → Crypto Intel | WRITE/READ | FORBIDDEN (no feedback loop) |
| Binance Bot → Binance public API | READ | ALLOWED |
| Binance Bot → own DB / .env / ledger | READ/WRITE | ALLOWED (own system only) |

Phase 1 ships the canon. Phase 2 (Architecture Map) will audit any existing shared imports/configs and break them.

---

## Exception path

If a future feature genuinely needs cross-system data (e.g. "Money Pipeline wants to surface trading-portfolio context to Marcelo in one dashboard"):
- The dashboard reads from each system separately and renders client-side
- Or each system publishes a public summary endpoint that the other can read but cannot mutate
- Either way, no shared DB, no shared ledger, no shared .env, no shared runtime

Any exception proposal goes through `APPROVAL-GATES.md` Gate 5.

---

## Version History

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-18 | Initial canon lock. Boundary table included. |
