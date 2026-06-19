# SPEC-MARKET-REGIMES.md

**Status:** Draft v0.1 — 2026-06-19
**Layer:** Governance / spec (NOT engine constants)
**Authority chain:** L-CRYPTO-14 → L-CRYPTO-15 §6 (enum) → L-CRYPTO-19 (this spec)
**Frozen pipeline:** L-CRYPTO-14, L-CRYPTO-15, L-CRYPTO-16, L-CRYPTO-17 are NOT touched by this doc. No engine/runtime/schema/code change.

---

## §1. Purpose & non-goals

### Purpose

This spec **defines the 7 market-regime labels** that Stage 6 already emits in `data/bossman_decision.json::metadata.regime_today` per L-CRYPTO-15 §6. The doc gives each label concrete dimensions (BTC trend, ETH beta, BTC.D posture, USDT.D posture, funding-rate band, OI delta profile, alt-coin beta expectation) so BossMan can be held to a stable, reviewable vocabulary. It does NOT change the Stage 6 schema, the Stage 6 emitter behavior, or the Stage 7 reader behavior — those layers are frozen.

### Non-goals (explicit)

- This doc does NOT add new regime labels or rename the existing 7-value enum.
- This doc does NOT modify L-CRYPTO-15 §6 (the canonical enum).
- This doc does NOT introduce new intelligence sources, new signal logic, or new runtime branches.
- This doc is **governance** — it documents what each label means. Stage 6 keeps its existing emitter; future emitter changes (if any) route through a new L-CRYPTO rule.

---

## §2. Regime catalogue (7 — L-CRYPTO-15 §6 enum)

For each regime: **BTC trend (1d/1w), ETH beta, BTC.D posture, USDT.D posture, funding-rate band, OI delta profile, alt-coin beta expectation**. Numeric bands here are **typical** (governance only); the actual emitter thresholds remain Stage 6's responsibility.

### EARLY_CYCLE

- **BTC trend (1d/1w):** 1w ↑ from a base; vol rising from low.
- **ETH beta:** > 1.1.
- **BTC.D posture:** flat-to-down (rotation into alts).
- **USDT.D posture:** flat-to-down (risk appetite returning).
- **Funding-rate band:** mildly positive.
- **OI delta profile:** rising.
- **Alt-coin beta expectation:** 1.0 – 1.4.

### MID_CYCLE

- **BTC trend (1d/1w):** 1w ↑; vol moderate.
- **ETH beta:** ~1.0.
- **BTC.D posture:** ranging.
- **USDT.D posture:** ranging.
- **Funding-rate band:** positive but not extreme.
- **OI delta profile:** rising modestly.
- **Alt-coin beta expectation:** 0.9 – 1.2.

### LATE_CYCLE

- **BTC trend (1d/1w):** flat-to-up on 1w; vol elevated.
- **ETH beta:** < 1.0.
- **BTC.D posture:** rising (capital rotating back to BTC).
- **USDT.D posture:** down then flat (liquidity tightening).
- **Funding-rate band:** high positive (≥ 0.03% per 8h).
- **OI delta profile:** flat or falling on rips (longs exhausting).
- **Alt-coin beta expectation:** 0.6 – 0.9.

### DISTRIBUTION

- **BTC trend (1d/1w):** 1w ↑ with long upper wick on weekly candle; vol high.
- **ETH beta:** ~0.7.
- **BTC.D posture:** up sharply.
- **USDT.D posture:** down then up (liquidity leaving).
- **Funding-rate band:** elevated then negative on dips (shorts building).
- **OI delta profile:** falling.
- **Alt-coin beta expectation:** 0.4 – 0.7.

### RISK_OFF

- **BTC trend (1d/1w):** 1w ↓; vol high.
- **ETH beta:** < 0.7.
- **BTC.D posture:** flat-to-up (safe-haven flow).
- **USDT.D posture:** up (capital fleeing to stables).
- **Funding-rate band:** deeply negative.
- **OI delta profile:** falling (deleveraging).
- **Alt-coin beta expectation:** 0.3 – 0.6.

### RECOVERY

- **BTC trend (1d/1w):** 1w ↓ → flat; vol declining.
- **ETH beta:** rising (returning to 1.0 from below).
- **BTC.D posture:** flat.
- **USDT.D posture:** peaking then flat.
- **Funding-rate band:** normalizing to zero.
- **OI delta profile:** bottoming.
- **Alt-coin beta expectation:** 0.7 – 1.0.

### UNKNOWN

- **Definition:** insufficient data or conflicting signals.
- **Default posture:** defensive — treated as T1-equivalent by the regime → tier gate (§3 below). BossMan should bias toward WATCH_ONLY decisions when regime is UNKNOWN.

---

## §3. Regime → tier gate matrix

This table **overrides** the default tier allowances in `SPEC-STRATEGY-CLASSES-AGGRESSION-TIERS.md` §3 when a regime is in force.

| Regime | Allowed tiers | Allowed classes | Max concurrent |
|---|---|---|---|
| EARLY_CYCLE | T1, T2, T3 (T3 only at confidence ≥ MEDIUM) | scalper, swing, position, hedge (per class × tier matrix) | per tier ceiling |
| MID_CYCLE | T1, T2, T3 (T3 only at confidence ≥ MEDIUM) | scalper, swing, position, hedge (per class × tier matrix) | per tier ceiling |
| LATE_CYCLE | T1, T2 only | scalper, swing (no position/hedge at higher tiers; position/hedge still allowed at T1) | per tier ceiling |
| DISTRIBUTION | T1, T2 only | swing-only (no scalper/position/hedge) | per tier ceiling |
| RISK_OFF | T1 only | swing-only (no scalper/position/hedge) | 2 |
| RECOVERY | T1, T2, T3 (T3 only at confidence ≥ MEDIUM) | scalper, swing, position, hedge (per class × tier matrix) | per tier ceiling |
| UNKNOWN | T1 only | swing-only | 1 |

**Conflict resolution:** if this matrix is stricter than the class × tier matrix in File 1 §4, this matrix wins. If it's looser, File 1 §4 wins. The matrix is intersected, not unioned.

---

## §4. Regime × strategy class interaction

When a regime forces T1-only (RISK_OFF, UNKNOWN), the T1 row of the class × tier matrix (File 1 §4) further restricts the allowed set. Concretely:

- **RISK_OFF or UNKNOWN:** only `swing × TIER_1_CONSERVATIVE` is legal. scalper/position/hedge are doubly forbidden (regime → T1, and class × tier → hedge/scalper forbidden at T1 only at higher tiers OR forbidden altogether for hedge).
- **DISTRIBUTION:** `swing × T1` or `swing × T2`. No scalper, no position, no hedge.

---

## §5. Learning-goal linkage

The active crypto goal is `t_goal_crypto_swing_trader_20260613` (12-month horizon, swing-focused). Two implications:

- **Curriculum time should land where swing trades actually work.** The regimes most supportive of swing observation are `EARLY_CYCLE`, `MID_CYCLE`, and `RECOVERY`. Most journaling and case-study time should land here.
- **`RISK_OFF` and `LATE_CYCLE` are regime case studies, not action regimes.** They are high-information periods where the right action is OBSERVE + journal, not trade. Curriculum sub-tasks covering "what does RISK_OFF look like" and "how does LATE_CYCLE unwind" belong here.

Cross-reference: `t_ec23a194` (Market Regime Identification Framework card).

---

## §6. Evidence base (pointer only — no rewriting)

Existing memo corpus that already labels regimes (do not rewrite; pointer only):

- `~/.hermes/knowledge/crypto-intel/weekly/2026/` — weekly memo JSON + MD.
- `~/.hermes/knowledge/crypto-intel/history/2026/` — per-day intelligence JSON.
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — most recent artifact.

When new evidence arrives, future passes may label new memos using the regime names in §2 directly.

---

## §7. Legacy alias note

**Aliases for older memo labels** (legacy usage in some early-memo drafts). New emissions and new memos must use the canonical 7-value enum from L-CRYPTO-15 §6:

| Legacy label | Canonical regime |
|---|---|
| `CAPITULATION` | `RISK_OFF` |
| `EUPHORIA` | `LATE_CYCLE` |

If older memos are referenced, treat the legacy label as the canonical regime equivalent. No schema rename — the canonical enum is locked.

---

## §8. Wire discipline (mirrors L-CRYPTO-03 + L-CRYPTO-14 + L-CRYPTO-15)

This doc is **pure governance**. It does NOT:

- Modify the Stage 6 enum or the Stage 6 emitter behavior.
- Modify Stage 7 reader behavior (L-CRYPTO-16).
- Modify the execution-layer $75 floor (L-CRYPTO-17).
- Introduce new intelligence sources, signal logic, or runtime branches.
- Rename the canonical enum.

It DOES document what each existing label means and how regime interacts with the strategy/tier matrix in File 1.

---

**End of SPEC-MARKET-REGIMES.md v0.1**
