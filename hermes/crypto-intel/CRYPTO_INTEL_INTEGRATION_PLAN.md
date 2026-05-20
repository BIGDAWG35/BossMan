# CRYPTO_INTEL_INTEGRATION_PLAN.md — Crypto Intelligence Integration Design
**Date:** 2026-05-22 | **Phase:** Phase 9 | **Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel]
**Status:** ✅ DRAFT — Phase 9 Design Only (No Code Changes)

---

## Overview

This document specifies HOW Crypto Intelligence (CSDAWG 2.0) connects to:
1. **Money Pipeline (Phase 8)** — as context for opportunity scoring
2. **Binance Bot (Phase 10/11)** — as filters and metadata in signal execution

**Design principle:** Intelligence flows IN (inputs feed Phase 8/10) but execution NEVER flows back into intelligence. No trading signal from Binance Bot modifies the intelligence layer.

**Clear separation:**
```
INTELLIGENCE LAYER          EXECUTION LAYER
(CSDAWG 2.0)               (Binance Bot)
     │                           │
     │  feeds context ───────────►│
     │  feeds filters ──────────►│
     │                           │
     X  NEVER receives          │
       execution data            │
```

---

## Part 1: Money Pipeline Integration

### Current Money Pipeline State
- `GET /api/opportunities` returns: id, title, description, monthly_potential, revenue_type, target_market, competition_level, risk_level, type, display_status, created_at, updated_at, composite_score, confidence_band, ease_band, stage, v2_summary, recommended_stage, recommended_action, score_rationale, actual_revenue, revenue_date
- Enrichment adds: composite_score, confidence_band, ease_band, v2_summary, recommended_stage, recommended_action, score_rationale

### New Fields to Add (Design Only — Phase 9B Implementation)

**New Money Pipeline opportunity fields:**
```json
{
  "intel_regime_relevance": "BULL|BEAR|MID_CYCLE|ALL",
  "intel_band_relevance": "HOT|WARM|WATCH|COLD|ALL",
  "intel_sector_tag": "L1|DeFi|Memecoin|AI|Gaming|ALL",
  "intel_narrative_tags": ["narrative_1", "narrative_2"],
  "intel_binance_relevance": true,
  "intel_notes": "Opportunity aligns with L1 sector rotation during bull market."
}
```

**Field definitions:**

| New Field | Type | Source | Description |
|-----------|------|--------|-------------|
| intel_regime_relevance | enum | Crypto Intel regime | Which regime this opportunity is best suited for |
| intel_band_relevance | enum | Crypto Intel band | Minimum band for opportunity to be considered HOT |
| intel_sector_tag | string | Sector rotation | Primary sector this opportunity belongs to |
| intel_narrative_tags | array | Narrative tracking | Narratives active this week that this opportunity relates to |
| intel_binance_relevance | boolean | Pre-binance scout | Whether this opportunity relates to a pre-listing coin |
| intel_notes | text | Hermes analysis | Free-text notes on intelligence alignment |

**How enrichment uses intelligence:**

In `enrichOpportunityV2()`, add intelligence context to the prompt:
```
Given current crypto regime: [REGIME] (confidence: [CONFIDENCE])
Current HOT/WARM coins: [HOT_COINS]
Leading sector: [LEADING_SECTOR]
Active narratives: [NARRATIVES]

Opportunity: [OPPORTUNITY_TITLE]
...
```

This allows the enrichment model to:
- Score opportunities higher during bull regime
- Penalize opportunities in sectors that are lagging
- Flag opportunities that align with leading narratives
- Note if opportunity is relevant to pre-binance scouting

### Money Pipeline Report Output Enhancement

**Weekly intelligence attachment:**
When Money Pipeline generates its weekly report, attach Crypto Intel context:
```json
{
  "opportunities": [...],
  "intel_context": {
    "report_date": "2026-05-22",
    "regime": "BULL",
    "confidence": 0.82,
    "leading_sector": "L1",
    "hot_coins": ["SOLUSDT", "DOGEUSDT"],
    "warm_coins": ["ETHUSDT", "AVAXUSDT"],
    "active_narratives": ["L1_rotation", "memecoin_momentum"],
    "risk_flags": [],
    "pre_binance_watch": ["PEPE"]
  }
}
```

---

## Part 2: Binance Bot Integration

### Current Binance Bot Signal Flow (Phase 10A/B)
```
Signal Generated → Pre-Trade Hook → executeTrade() → Journaled
                     (blocking)        (PAPER/LIVE)
```

### Intelligence Inputs to Binance Bot

**Three types of intelligence filters:**

#### Filter Type 1: Regime Gate
- **Source:** `regime` from weekly intelligence
- **Behavior in Binance Bot:**
  - BULL → execute normally
  - MID_CYCLE → execute with caution (reduced size, tighter SL)
  - BEAR → HOT-only coins, minimal size
  - EXTREME → block ALL new entries regardless of signal
- **Implementation:** Read `~/.hermes/knowledge/crypto-intel/weekly/latest/regime.json` or equivalent
- **Check timing:** At start of each trading cycle (before signal processing loop)

#### Filter Type 2: Coin Band Filter
- **Source:** `coin_rankings[].band` from weekly intelligence
- **Behavior in Binance Bot:**
  - HOT → execute (allowed)
  - WARM → execute (allowed)
  - WATCH → skip (blocked)
  - COLD → skip (blocked)
  - UNRANKED → execute (default — not in watch list)
- **Column addition to `signal_journal`:**
  ```sql
  ALTER TABLE signal_journal ADD COLUMN intel_band TEXT;  -- HOT/WARM/WATCH/COLD
  ALTER TABLE signal_journal ADD COLUMN intel_regime TEXT; -- BULL/BEAR/MID_CYCLE/EXTREME
  ALTER TABLE signal_journal ADD COLUMN intel_sector TEXT; -- L1/DeFi/Memecoin/etc.
  ALTER TABLE signal_journal ADD COLUMN regime_confidence REAL; -- 0.0-1.0
  ```

#### Filter Type 3: Risk Flag Gate
- **Source:** `risk_flags[]` from weekly intelligence
- **Behavior in Binance Bot pre-trade hook:**
  - EXTREME_VOLATILITY present → block
  - PUMP_AND_DUMP_RISK present for symbol → block
  - REGIME_UNCERTAINTY (confidence < 0.5) → increase scrutiny, block borderline signals

### Schema Changes for signal_journal (Phase 9B Implementation)

**New columns:**
```sql
ALTER TABLE signal_journal ADD COLUMN intel_band TEXT;
ALTER TABLE signal_journal ADD COLUMN intel_regime TEXT;
ALTER TABLE signal_journal ADD COLUMN intel_sector TEXT;
ALTER TABLE signal_journal ADD COLUMN regime_confidence REAL;
ALTER TABLE signal_journal ADD COLUMN sector_leading BOOLEAN;  -- 1 if sector is LEADING this week
```

**Updated journal entry (example):**
```json
{
  "symbol": "SOLUSDT",
  "side": "BUY",
  "entry_price": 182.45,
  "stop_loss": 175.00,
  "target": 195.00,
  "risk_pct": 3.5,
  "rr_ratio": 2.0,
  "size": 10,
  "mode": "PAPER",
  "hook_result": "approved",
  "executed": true,
  "order_response": "{...}",
  "error": null,
  "intel_band": "HOT",
  "intel_regime": "BULL",
  "intel_sector": "L1",
  "regime_confidence": 0.82,
  "sector_leading": true,
  "timestamp": "2026-05-22T17:00:00-07:00"
}
```

### How Binance Bot Reads Intelligence

**Intelligence file location:** `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`

**Read at:**
1. Bot startup (module load)
2. Start of each trading cycle (before signal processing)
3. Via Hermes T1 monitor on intelligence file update (push pattern)

**Bot reads these fields:**
```javascript
const intel = require('~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json');
const REGIME = intel.regime;
const REGIME_CONFIDENCE = intel.regime_confidence;
const RISK_FLAGS = intel.risk_flags || [];
const COIN_BANDS = Object.fromEntries(intel.coin_rankings.map(c => [c.symbol, c.band]));
const LEADING_SECTORS = intel.sectors.filter(s => s.signal === 'LEADING').map(s => s.name);
```

### Signal Processing with Intelligence

**Modified signal loop (pseudocode):**
```
for (sig of signals) {
  // 1. Regime gate
  if (REGIME === 'EXTREME') { skip; journal(reason='extreme_regime_block'); continue; }

  // 2. Band filter
  const band = COIN_BANDS[sig.symbol] || 'UNRANKED';
  if (['WATCH', 'COLD'].includes(band)) { skip; journal(reason=`band_${band}_block`); continue; }

  // 3. Risk flag gate (pre-trade hook already does this)

  // 4. Normal signal processing (pre-trade hook, executeTrade, journal)
  const signalContext = {
    ...sig,
    intel_band: band,
    intel_regime: REGIME,
    intel_sector: getSector(sig.symbol),
    regime_confidence: REGIME_CONFIDENCE,
    sector_leading: LEADING_SECTORS.includes(getSector(sig.symbol))
  };

  await executeTrade(sig.symbol, 'BUY', sig.size, signalContext);
}
```

---

## Part 3: Intelligence File Specification

**File:** `intelligence.json`
**Location:** `~/.hermes/knowledge/crypto-intel/weekly/latest/`
**Updated:** Every Monday 08:00 PDT (or on-demand on regime change)

**Full schema:**
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
  "coin_rankings": [
    {
      "symbol": "SOLUSDT",
      "band": "HOT",
      "band_score": 0.88,
      "price": 182.45,
      "price_7d_pct": 14.2,
      "reason": "social_spike + bull_regime + volume_growth",
      "sector": "L1"
    }
  ],
  "sectors": [
    { "name": "L1", "7d_return": 12.3, "vs_btc": 4.1, "signal": "LEADING" }
  ],
  "risk_flags": [],
  "pre_binance_watch": [
    { "coin": "PEPE", "ticker": "PEPE", "listing_probability": "HIGH" }
  ],
  "signals": [],
  "regime_details": {
    "btc_200d_sma": 42150.00,
    "50d_200d_cross": "golden_cross",
    "drawdown_from_ath_pct": 12.4,
    "momentum_90d_pct": 28.3,
    "indicators_agreeing": ["btc_above_200d", "low_drawdown", "positive_momentum"]
  },
  "generated_at": "2026-05-22T08:00:00-07:00",
  "next_update": "2026-05-26T08:00:00-07:00"
}
```

---

## Part 4: Clear Separation — Intel vs Execution

**What intelligence NEVER does:**
- Never reads Binance Bot trade data
- Never reads signal_journal entries
- Never modifies its own outputs based on trading results
- Never suggests specific trade sizes or entry prices
- Never recommends specific coins (only analyzes market conditions)

**What execution NEVER does:**
- Never writes to intelligence files
- Never modifies regime classification
- Never overrides intelligence filters (only respects or ignores them)
- Never feeds P&L data back into intelligence

**Feedback loop (one-way):**
- Binance Bot journals signal → human reviews weekly report
- Human decides if intelligence is accurate → adjusts thresholds (memory update)
- Thresholds updated → next week's intelligence is better calibrated

**No automatic feedback.** If the engine was wrong about a regime call, that is noted in memory but does not auto-correct the engine. Human review required to change threshold logic.

---

## Part 5: Phase 9B Implementation Checklist

**Money Pipeline changes (Phase 8B or 9B):**
- [ ] Add 6 new intel_* columns to opportunities schema (design done above)
- [ ] Update enrichOpportunityV2() prompt to include regime/sector/band context
- [ ] Add intelligence JSON attachment to weekly report endpoint
- [ ] Add intel_regime_relevance dropdown to opportunity creation form

**Binance Bot changes (Phase 10B or 9B):**
- [ ] Read intelligence.json at bot startup and cycle start
- [ ] Add 5 new columns to signal_journal (design done above)
- [ ] Add regime gate before signal processing loop
- [ ] Add band filter in signal processing loop
- [ ] Wire risk_flags into pre-trade hook
- [ ] Test: confirm paper trades still work with intelligence filters applied

**Intelligence cron (Phase 9B):**
- [ ] Build crypto-intel weekly cron job
- [ ] Generate intelligence.json on schedule
- [ ] Generate human-readable weekly report
- [ ] Push to Telegram for Marcelo review
- [ ] Sync to Obsidian + GitHub

---

**Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel] [PROJECT:MoneyPipeline] [PROJECT:BinanceBot]