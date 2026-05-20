# CRYPTO_INTEL_ENGINE_SPEC.md — Crypto Intelligence Engine (CSDAWG 2.0)
**Date:** 2026-05-22 | **Phase:** Phase 9 | **Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel]
**Status:** ✅ DRAFT — Phase 9 Design Only

---

## Overview

The Crypto Intelligence Engine (CSDAWG 2.0) is Hermes's systematic analysis layer for crypto markets. It processes raw data inputs into structured intelligence: regime classification, coin rankings, and actionable signals. It does NOT place trades or modify execution logic.

**Engine role:** Transform data → Analysis → Intelligence products (reports, rankings, filters).

**Separation of concerns:**
- Engine computes WHAT market is doing
- Money Pipeline uses intelligence to score opportunities
- Binance Bot uses intelligence to filter/allow signals
- Execution (Phase 11) decides HOW to act based on filters

---

## Engine Architecture

```
INPUTS (from CRYPTO_INTEL_INPUTS)
        │
        ▼
┌─────────────────────────────────────────────────────┐
│              INTELLIGENCE ENGINE (CSDAWG 2.0)        │
│                                                      │
│  STEP 1: Regime Detection                            │
│  └── Classify: BULL / BEAR / MID_CYCLE / EXTREME    │
│                                                      │
│  STEP 2: Trend Analysis (per coin)                  │
│  └── BTC + ETH + top caps momentum, strength        │
│                                                      │
│  STEP 3: Sector Rotation                            │
│  └── Rank sectors by relative performance           │
│                                                      │
│  STEP 4: Coin Band Assignment                        │
│  └── COLD → WATCH → WARM → HOT (per coin)           │
│                                                      │
│  STEP 5: Signal Generation                          │
│  └── Conditions that move coins between bands        │
│                                                      │
│  STEP 6: Risk Flagging                              │
│  └── Overheated / choppy / regime warning flags       │
└─────────────────────────────────────────────────────┘
        │
        ▼
INTELLIGENCE PRODUCTS
├── Weekly Intelligence Report
├── Coin Rankings (COLD/WATCH/WARM/HOT)
├── Regime Signal Cards
├── Pre-Binance Scout List
└── Risk Condition Alerts
```

---

## Step 1: Market Regime Detection

### Classification Logic

**Four regimes:**

| Regime | Conditions | Binance Bot Action |
|--------|------------|-------------------|
| BULL | BTC above 200d SMA + drawdown from ATH < 20% + 90d momentum > 15% | ACTIVE — execute signals normally |
| MID_CYCLE | BTC above/below 200d SMA mixed + 90d momentum between -15% and 15% | CAUTIOUS — reduce size, tighter filters |
| BEAR | BTC below 200d SMA + drawdown from ATH > 50% + 90d momentum < -20% | INACTIVE — pause new entries, close existing |
| EXTREME | Volatility regime = EXTREME + drawdown from ATH > 75% | BLOCK ALL — no new entries regardless of signals |

**Confidence scoring (0.0 – 1.0):**
- High confidence (≥ 0.8): 3+ indicators agree
- Medium confidence (0.5–0.79): 2 indicators agree
- Low confidence (< 0.5): mixed signals — note uncertainty in report

**Inputs used:**
- BTC 200-day SMA direction
- BTC 50/200-day SMA cross (golden/death cross)
- BTC drawdown from ATH (CoinGecko or Binance)
- BTC 90-day momentum (% change over 90 days)
- BTC 20-day volatility regime

**Output fields:**
```json
{
  "regime": "BULL|MID_CYCLE|BEAR|EXTREME",
  "regime_confidence": 0.85,
  "regime_signal_date": "2026-05-22",
  "btc_200d_sma": 42150.00,
  "btc_50d_vs_200d": "golden_cross|below|death_cross",
  "drawdown_from_ath_pct": 12.4,
  "momentum_90d_pct": 28.3,
  "volatility_regime": "NORMAL",
  "indicators_agreeing": ["btc_above_200d", "low_drawdown", "positive_momentum"]
}
```

**Weekly update:** Run Monday 08:00 PDT (market close Sunday). Re-run if BTC moves > 5% in 24h.

---

## Step 2: Trend Analysis (Per Coin)

**Coins tracked:**
- Tier 1: BTC, ETH (always tracked)
- Tier 2: SOL, ADA, AVAX, MATIC, LINK, DOT, ATOM (top 50 cap, Binance US listed or watchlist)
- Tier 3: Selected based on social/narrative (dynamic watch list from Phase 9B)

**Metrics per coin:**

| Metric | Source | Calculation |
|--------|--------|-------------|
| price_7d_pct | Binance US klines | (close - close_7d_ago) / close_7d_ago * 100 |
| price_30d_pct | Binance US klines | (close - close_30d_ago) / close_30d_ago * 100 |
| volume_7d_avg | Binance US klines | avg(volume over 7d) |
| volume_7d_trend | Binance US klines | (vol_7d_avg - vol_14d_avg) / vol_14d_avg * 100 |
| trend_direction | 7d + 30d price | UP if both positive, DOWN if both negative, MIXED otherwise |
| relative_to_btc | BTC 7d as baseline | coin_7d_pct - btc_7d_pct (positive = outperforming) |

**Output per coin:**
```json
{
  "symbol": "SOLUSDT",
  "price": 182.45,
  "price_7d_pct": 14.2,
  "price_30d_pct": 38.7,
  "volume_7d_avg": 850000000,
  "volume_7d_trend": 23.1,
  "trend_direction": "UP",
  "relative_to_btc_pct": 6.3,
  "tier": 2,
  "binance_listed": true
}
```

**Refresh:** Daily (computed from 7d/30d kline data).

---

## Step 3: Sector Rotation

**Sectors tracked:**
| Sector | Coins |
|--------|-------|
| L1 / Smart Contracts | BTC, ETH, SOL, ADA, AVAX, MATIC, DOT, ATOM |
| DeFi | UNI, AAVE, CRV, MKR, LINK |
| Memecoins | DOGE, SHIB, PEPE, WIF, FLOKI |
| AI / Tech | AGIX, FET, OCEAN (check listing status) |
| Gaming / Metaverse | AXS, SAND, MANA |

**Rotation logic:**
- Compare 7d return of each sector vs BTC 7d return
- **LEADING:** sector 7d return > BTC 7d return + 5%
- **LAGGING:** sector 7d return < BTC 7d return - 5%
- **NEUTRAL:** within ±5% of BTC

**Sector momentum ranking:** Sort sectors by relative performance → top sector gets priority in Binance Bot signal filtering.

**Output:**
```json
{
  "sectors": [
    { "name": "L1", "7d_return": 12.3, "vs_btc": 4.1, "signal": "LEADING" },
    { "name": "DeFi", "7d_return": 7.8, "vs_btc": -0.4, "signal": "NEUTRAL" },
    { "name": "Memecoins", "7d_return": 22.1, "vs_btc": 13.9, "signal": "LEADING" }
  ],
  "sector_momentum_rank": ["Memecoins", "L1", "Gaming", "AI", "DeFi"],
  "report_date": "2026-05-22"
}
```

**Refresh:** Weekly (Monday 08:00 PDT).

---

## Step 4: Coin Band Assignment

**Four bands:**

| Band | Definition | Action |
|------|------------|--------|
| HOT | Social volume spike + price momentum + regime BULL/EXTREME | Monitor closely, Binance Bot MAY execute |
| WARM | Price 7d > BTC 7d + sector LEADING + stable volume growth | Monitor, Binance Bot filter allows |
| WATCH | Price 7d mixed or neutral, no strong signals | Track only, no execution |
| COLD | Price 7d < 0, momentum NEGATIVE, regime BEAR | Ignore, Binance Bot blocks |

**Band transition logic:**

| Current Band | Condition Change | New Band |
|-------------|-----------------|----------|
| COLD | Price 7d turns positive + volume trend > 0 | WATCH |
| WATCH | Price 7d > BTC 7d + relative_to_btc > 0 | WARM |
| WARM | Social spike detected + regime BULL/EXTREME | HOT |
| WARM | Regime switches to BEAR | COLD (deprioritize) |
| HOT | Price 7d drops below BTC 7d | WARM |
| HOT | Regime switches to EXTREME | WARM (not COLD — still monitoring but not executing) |

**Band assignments are coin-specific, not global.** A coin can be HOT while another is COLD in the same market.

**Output:**
```json
{
  "coin_rankings": [
    { "symbol": "SOLUSDT", "band": "HOT", "band_score": 0.88, "reason": "social_spike + bull_regime + volume_growth" },
    { "symbol": "ETHUSDT", "band": "WARM", "band_score": 0.72, "reason": "outperforming_btc + sector_leading" },
    { "symbol": "DOGEUSDT", "band": "HOT", "band_score": 0.91, "reason": "memecoin_rotation + 7d_22pct" },
    { "symbol": "ADAUSDT", "band": "WATCH", "band_score": 0.45, "reason": "mixed_signals + low_momentum" },
    { "symbol": "AVAXUSDT", "band": "WARM", "band_score": 0.68, "reason": "positive_momentum + volume_growing" }
  ],
  "hot_count": 2,
  "warm_count": 3,
  "watch_count": 1,
  "cold_count": 0,
  "report_date": "2026-05-22"
}
```

**Band score formula:**
```
band_score = (
  price_momentum_weight * price_7d_normalized +
  volume_trend_weight * volume_7d_trend_normalized +
  regime_multiplier *
  sector_position_weight * sector_rank_normalized
)
```
Where:
- `price_momentum_weight = 0.4`, `volume_trend_weight = 0.2`, `regime_multiplier ∈ [0.5, 1.5]`, `sector_position_weight = 0.2`
- Normalized means 0–1 scale relative to all tracked coins
- Regime multiplier: EXTREME → 0.5 (block), BEAR → 0.7, MID_CYCLE → 1.0, BULL → 1.2, (market near cycle bottom → 1.5)

**Refresh:** Daily (after price/volume data update).

---

## Step 5: Signal Generation

**Signal types:**

| Signal | Trigger | Band Change | Priority |
|--------|---------|-------------|----------|
| REGIME_CHANGE | Regime switches (BULL→BEAR, etc.) | ALL coins affected | HIGH |
| BAND_PROMOTION | Coin moves to HOT/WARM | Specific coin | MEDIUM |
| BAND_DEMOTION | Coin drops band | Specific coin | MEDIUM |
| VOLATILITY_ALERT | Volatility → EXTREME | All coins | HIGH |
| SECTOR_ROTATION | Sector changes LEADING/LAGGING | Sector coins | LOW |
| PRE_BINANCE_ALERT | Coin hits social spike + not on Binance | Specific coin | MEDIUM |

**Signal format:**
```json
{
  "signal_id": "SIG-2026-05-22-001",
  "signal_type": "BAND_PROMOTION",
  "symbol": "SOLUSDT",
  "from_band": "WARM",
  "to_band": "HOT",
  "trigger": "social_volume_spike + bull_regime",
  "priority": "MEDIUM",
  "timestamp": "2026-05-22T17:00:00-07:00",
  "action_recommendation": "Monitor for entry on next signal. Binance Bot: allowed if regime BULL.",
  "notes": "SOL has outperformed BTC 7d by 8.3%. Sector L1 is LEADING."
}
```

**Signal storage:** SQLite table `intel_signals` (Phase 9B implementation).

---

## Step 6: Risk Flags

**Risk conditions and actions:**

| Risk Flag | Detection | Binance Bot Action |
|-----------|-----------|-------------------|
| EXTREME_VOLATILITY | Volatility regime = EXTREME | BLOCK all new entries |
| MARKET_CHOPPY | BTC 7d range > 8% but close-to-close change < 2% (high range, low movement) | Increase SL distance, reduce size |
| ALTSEASON_BOTTOM | BTC dominance rising + altcoins bleeding | Pause altcoin signals |
| PUMP_AND_DUMP_RISK | Social volume spike > 300% in 24h + funding rate anomaly | Pause coin, move to WATCH |
| LIQUIDITY_CONCERN | Order book spread > 50 bps on Binance US | Reduce size or skip |
| REGIME_UNCERTAINTY | Regime confidence < 0.5 | Increase pre-trade hook scrutiny |

**Risk flags are additive.** Multiple flags = more caution. Binance Bot pre-trade hook reads risk flags as additional filter.

---

## Engine Outputs

### Weekly Intelligence Report (see CRYPTO_INTEL_WEEKLY_TEMPLATE.md)

### Machine-Readable JSON (for Money Pipeline + Binance Bot integration):
```json
{
  "report_date": "2026-05-22",
  "regime": "BULL",
  "regime_confidence": 0.82,
  "volatility_regime": "NORMAL",
  "btc_price": 108250.00,
  "btc_7d_pct": 8.1,
  "btc_dominance_pct": 58.3,
  "breadth_ratio": 0.67,
  "coin_rankings": [...],
  "sectors": [...],
  "risk_flags": ["none"],
  "pre_binance_watch": [...],
  "signals": [...]
}
```

---

## Phase 9B Implementation Notes

**Engine computation order (Phase 9B cron job):**
1. Fetch BTC/ETH price + klines (A1)
2. Compute volatility regime (A3)
3. Determine market regime (B1)
4. Compute sector rotation (B2) — weekly only
5. Compute coin trends (Step 2)
6. Assign coin bands (Step 4)
7. Check risk flags (Step 6)
8. Generate signals (Step 5)
9. Write weekly report
10. Write machine-readable JSON
11. Sync to Obsidian + GitHub

**Dependency order:** Steps 1–3 must complete before Steps 4–6.

**Approximate compute time:** 30–60 seconds (mostly API polling, minimal computation).

---

**Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel] [PROJECT:MoneyPipeline] [PROJECT:BinanceBot]

**Perplexity Collaboration:** Perplexity is the default partner for regime/band design, narrative mapping, and weekly report templates. BossMan must sync with Perplexity before altering CryptoIntel logic. See `~/.hermes/SOUL.md` — "Perplexity Orchestration Loop" for the full workflow.

---