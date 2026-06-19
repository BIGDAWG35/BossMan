# SPEC-STRATEGY-CLASSES-AGGRESSION-TIERS.md

**Status:** Draft v0.1 — 2026-06-19
**Layer:** Governance / spec (NOT engine constants)
**Authority chain:** L-CRYPTO-14 → L-CRYPTO-15 (schema) → L-CRYPTO-18 (this spec)
**Frozen pipeline:** L-CRYPTO-14, L-CRYPTO-15, L-CRYPTO-16, L-CRYPTO-17 are NOT touched by this doc. No engine/runtime/schema/code change.

---

## §1. Purpose & non-goals

### Purpose

This spec **defines the vocabulary** BossMan uses when filling two fields in `data/bossman_decision.json`:

- `per_coin[sym].strategy_class` — one of {`scalper`, `swing`, `position`, `hedge`}
- `per_coin[sym].aggression_tier` — one of {`TIER_1_CONSERVATIVE`, `TIER_2_BASE`, `TIER_3_AGGRESSIVE`}

The doc gives each label concrete dimensions (hold-time, R:R, sizing, drawdown) so BossMan can be held to a stable, reviewable vocabulary. It does NOT change how Stage 6 emits or how Stage 7 reads the artifact — those layers are frozen (L-CRYPTO-15, L-CRYPTO-16).

### Non-goals (explicit)

- This doc does NOT introduce new sizing math, new numeric risk bands, or new pipeline rules.
- This doc does NOT widen or tighten the $75 floor (L-CRYPTO-14, L-CRYPTO-17).
- This doc does NOT modify `SPEC-BINANCE-AUTONOMOUS-TRADER.md` operator floors (PAPER_MODE, LIVE_PILOT_MAX_NOTIONAL).
- This doc is **governance** — the numbers in §3 are **guardrails and typical ranges**, not engine constants. Implementation-level constants in the trading SPEC and code may be narrower; they must NOT exceed these ceilings without a new L-CRYPTO rule.

---

## §2. Strategy classes (4 — L-CRYPTO-12 set, L-CRYPTO-15 §5)

Each class is defined on five dimensions: **hold-time band, expected R:R band, signal-decay profile, typical trigger patterns, current Binance-bot fit**.

### scalper

- **Hold-time:** 1 minute – 15 minutes per trade.
- **Expected R:R:** ~1.0 – 1.5 (high win-rate, small payoff).
- **Signal-decay profile:** minutes. A signal older than ~15m is dead; the system re-evaluates from scratch.
- **Typical triggers:** order-book imbalance, micro-breakout on 1m–5m, funding-rate flips, liquidation-cluster proximity.
- **Current Binance-bot fit:** **NOT first-pass.** No order-book or 1m signal source is currently in the bot stack. Future card required if/when added.

### swing

- **Hold-time:** 4 hours – 5 days per trade.
- **Expected R:R:** ~2.0 – 3.5.
- **Signal-decay profile:** hours-to-days. 4h candle invalidation is the typical lifecycle boundary.
- **Typical triggers:** 4h/1d structure break, EMA crosses, OI confirmation, regime-aligned setup.
- **Current Binance-bot fit:** **PRIMARY FIT TODAY.** Matches the swing-trader learning goal (`t_goal_crypto_swing_trader_20260613`) and the existing signal sources (4h candles, OI, funding).

### position

- **Hold-time:** 1 week – 8 weeks per trade.
- **Expected R:R:** ~3.0 – 6.0.
- **Signal-decay profile:** weeks. Weekly-candle invalidation is the boundary.
- **Typical triggers:** weekly structure, on-chain flow shifts, macro overlays (DXY, rates, liquidity proxies).
- **Current Binance-bot fit:** **DEFERRED.** No weekly or macro signal source is in the bot today. Future card required.

### hedge

- **Hold-time:** varies — typically tied to the primary leg's exposure window.
- **Expected R:R:** ~0.5 – 1.5 on the hedge leg alone (the protection has option-like payoff).
- **Signal-decay profile:** hours. Basis and correlation drift quickly.
- **Typical triggers:** perp–spot basis, correlated-pair divergence, spot-vs-perp OI imbalance.
- **Current Binance-bot fit:** **DEFERRED.** No hedge-pair or basis-spread signal source is in the bot today. Future card required.

---

## §3. Aggression tiers (3 — fixed names per L-CRYPTO-15 §4)

Each tier is defined on five dimensions: **notional cap (relative to LIVE_PILOT_MAX_NOTIONAL), max concurrent positions, max % equity at risk per trade, max rolling drawdown tolerance, when the tier is legal**.

> **Reading the numbers:** these are **governance guardrails and typical ranges** for a small LIVE-pilot account. Implementation-level constants in `SPEC-BINANCE-AUTONOMOUS-TRADER.md` and the bot code may be **narrower** (more conservative) than the ceilings below; they must NOT exceed these ceilings without a new L-CRYPTO rule.

### TIER_1_CONSERVATIVE

| Dimension | Guardrail ceiling |
|---|---|
| Notional cap | ≤ 33% of `LIVE_PILOT_MAX_NOTIONAL` per position |
| Max concurrent positions | 2 |
| Max % equity at risk per trade | 0.5% |
| Max rolling drawdown tolerance | 4% |
| Legal in regimes | any (including UNKNOWN) |

### TIER_2_BASE

| Dimension | Guardrail ceiling |
|---|---|
| Notional cap | ≤ 66% of `LIVE_PILOT_MAX_NOTIONAL` per position |
| Max concurrent positions | 4 |
| Max % equity at risk per trade | 1.0% |
| Max rolling drawdown tolerance | 6% |
| Legal in regimes | any EXCEPT `RISK_OFF`, `UNKNOWN`, and any regime with confidence `< LOW` |

### TIER_3_AGGRESSIVE

| Dimension | Guardrail ceiling |
|---|---|
| Notional cap | ≤ 100% of `LIVE_PILOT_MAX_NOTIONAL` per position |
| Max concurrent positions | 6 |
| Max % equity at risk per trade | 2.0% |
| Max rolling drawdown tolerance | 10% |
| Legal in regimes | `EARLY_CYCLE`, `MID_CYCLE`, `RECOVERY` ONLY, with confidence `≥ MEDIUM` |

**Note on LIVE_PILOT_MAX_NOTIONAL itself:** the spec is currently a single env-flag shared across all tiers. Whether that should itself become tier-stratified is an **open question** (§6) — safer default today is "shared single cap".

---

## §4. Class × tier matrix (which combos are legal)

| Class \ Tier | TIER_1_CONSERVATIVE | TIER_2_BASE | TIER_3_AGGRESSIVE |
|---|---|---|---|
| scalper | ✅ | ✅ | ❌ (T3 forbidden — short hold × max size = slippage tail risk) |
| swing | ✅ | ✅ | ✅ (with regime gate per §3) |
| position | ✅ | ✅ | ❌ (T3 forbidden — long hold × max size = tail risk) |
| hedge | ✅ | ❌ (T2/T3 forbidden — hedge sizing math not yet specified) | ❌ |

**Reading:** the matrix is intersected with the regime → tier gate in `SPEC-MARKET-REGIMES.md` §3. If the regime forces T1-only, the actual allowed set may be a strict subset of the table above.

---

## §5. Cross-references

- **L-CRYPTO-12** — original enumeration of the four strategy classes.
- **L-CRYPTO-15 §4** — fixed aggression tier names (this spec gives them concrete dimensions).
- **L-CRYPTO-15 §5** — fixed strategy-class set (this spec defines each class).
- **Stage 6 schema** — `per_coin[sym].strategy_class` and `per_coin[sym].aggression_tier` are the two consumer fields.
- **`data/bossman_decision.json`** — the consumer artifact. Stage 7 reads it read-only per L-CRYPTO-16.
- **SPEC-MARKET-REGIMES.md** — sibling governance spec; defines regime → tier gate.

---

## §6. Open questions (surfaced, NOT decided)

- **Position sizing math for tiers** — currently undefined beyond the notional cap. The cap is a ceiling, not a sizing formula. Future card required if tiers become actively used.
- **Whether `LIVE_PILOT_MAX_NOTIONAL` itself should be tier-stratified** — single shared cap today (safer). Tier-stratification is a future-pass question.
- **Hedge sizing math** — T2/T3 forbidden for hedge today because there is no published sizing math for hedge legs. Future card required if hedge class becomes active.
- **Whether "max % equity at risk per trade" applies before or after the $75 floor (L-CRYPTO-14/17)** — current pipeline order: signal/sizing computes a quantity → BossMan gate checks the artifact → execution floor enforces $75. The % equity dimension is upstream of the floor and is **a separate ceiling**, not a replacement.

---

## §7. Wire discipline (mirrors L-CRYPTO-03 + L-CRYPTO-14)

This doc is **pure governance**. It does NOT:

- Modify `SPEC-BINANCE-AUTONOMOUS-TRADER.md` operator floors.
- Modify the L-CRYPTO-14 / 15 / 16 / 17 frozen pipeline.
- Introduce new sizing math, numeric bands, or runtime constants into the bot code.
- Change PM2, `.env`, cron, Telegram, or PAIRS.

It DOES cross-reference the frozen pipeline and assumes future code, if any, must be ≤ the ceilings here (and never exceed them without a new L-CRYPTO rule).

---

**End of SPEC-STRATEGY-CLASSES-AGGRESSION-TIERS.md v0.1**
