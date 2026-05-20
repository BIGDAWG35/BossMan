# CRYPTO_INTEL_WEEKLY_TEMPLATE.md — Weekly Intelligence Report Template
**Date:** 2026-05-22 | **Phase:** Phase 9 | **Tags:** [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
**Status:** ✅ TEMPLATE — Phase 9 Design Only

---

## CSDAWG 2.0 Weekly Intelligence Report

**Report Date:** `{{REPORT_DATE}}` (e.g., 2026-05-26)
**Report Period:** `{{PERIOD_START}}` → `{{PERIOD_END}}` (e.g., 2026-05-19 → 2026-05-25)
**Prepared by:** Hermes (BossMan)
**Regime Classification:** `{{REGIME}}` (confidence: `{{CONFIDENCE}}`)
**Next Update:** `{{NEXT_UPDATE_DATE}}`

---

## Section 1: Market Regime Summary

### Current Regime: `{{REGIME}}`
**Confidence:** `{{CONFIDENCE}}`/1.0

| Indicator | Value | Signal |
|-----------|-------|--------|
| BTC 200d SMA | ${{BTC_200D_SMA}} | {{BTC_200D_SMA_SIGNAL}} |
| BTC 50d vs 200d | {{50D_200D_CROSS}} | {{CROSS_SIGNAL}} |
| BTC Drawdown from ATH | {{DRAWDOWN_ATH_PCT}}% | {{DRAWDOWN_SIGNAL}} |
| BTC 90d Momentum | {{MOMENTUM_90D_PCT}}% | {{MOMENTUM_SIGNAL}} |
| BTC 20d Volatility | {{VOLATILITY_20D_PCT}}% | {{VOL_REGIME}} |
| Days Since Cycle Low | {{DAYS_SINCE_CYCLE_LOW}} | {{CYCLE_POSITION}} |

**Indicators agreeing:** `{{INDICATORS_AGREEING}}` (e.g., btc_above_200d, low_drawdown, positive_momentum)

**Regime Narrative (2–3 sentences):**
> `{{REGIME_NARRATIVE}}`
> Example: "BTC remains in a confirmed bull phase, trading 12% below ATH with strong momentum. All major trend indicators are positive. Volatility has normalized after the April consolidation."

### Regime Implications for Trading
- **Money Pipeline:** `{{MP_REGIME_NOTE}}`
  > "Opportunities in L1 and DeFi sectors are well-timed. Avoid low-confidence long-shot opportunities."
- **Binance Bot:** `{{BB_REGIME_NOTE}}`
  > "Signals are active. Execute normally with standard position sizing."

---

## Section 2: BTC & ETH Trend Overview

### BTCUSDT
| Metric | Value | vs 7d ago |
|--------|-------|-----------|
| Price | ${{BTC_PRICE}} | {{BTC_7D_PCT}}% |
| 7d Return | {{BTC_7D_PCT}}% | — |
| 30d Return | {{BTC_30D_PCT}}% | — |
| Volume 7d Avg | ${{BTC_VOL_7D_AVG}} | {{BTC_VOL_TREND}}% |
| 20d Volatility | {{BTC_VOL_20D_PCT}}% | {{VOL_TREND}} |

### ETHUSDT
| Metric | Value | vs 7d ago |
|--------|-------|-----------|
| Price | ${{ETH_PRICE}} | {{ETH_7D_PCT}}% |
| 7d Return | {{ETH_7D_PCT}}% | — |
| 30d Return | {{ETH_30D_PCT}}% | — |
| Volume 7d Avg | ${{ETH_VOL_7D_AVG}} | {{ETH_VOL_TREND}}% |

**BTC vs ETH:** `{{BTC_VS_ETH_NOTE}}`
> Example: "ETH is outperforming BTC by 4.2% this week. L2 / ETH ecosystem coins are gaining relative strength."

---

## Section 3: Coin Rankings — HOT / WARM / WATCH / COLD

### 🔥 HOT — Active Monitoring (Binance Bot: ALLOWED)
| Symbol | Price | 7d % | Band Score | Reason |
|--------|-------|------|------------|--------|
| {{HOT_SYMBOL}} | ${{HOT_PRICE}} | {{HOT_7D_PCT}}% | {{HOT_SCORE}} | {{HOT_REASON}} |

### 🟡 WARM — On Radar (Binance Bot: ALLOWED with filters)
| Symbol | Price | 7d % | Band Score | Reason |
|--------|-------|------|------------|--------|
| {{WARM_SYMBOL}} | ${{WARM_PRICE}} | {{WARM_7D_PCT}}% | {{WARM_SCORE}} | {{WARM_REASON}} |

### 🟠 WATCH — Tracking Only (Binance Bot: IGNORED)
| Symbol | Price | 7d % | Band Score | Reason |
|--------|-------|------|------------|--------|
| {{WATCH_SYMBOL}} | ${{WATCH_PRICE}} | {{WATCH_7D_PCT}}% | {{WATCH_SCORE}} | {{WATCH_REASON}} |

### ❄️ COLD — Ignored (Binance Bot: BLOCKED)
| Symbol | Price | 7d % | Band Score | Reason |
|--------|-------|------|------------|--------|
| {{COLD_SYMBOL}} | ${{COLD_PRICE}} | {{COLD_7D_PCT}}% | {{COLD_SCORE}} | {{COLD_REASON}} |

**Band Summary:** `{{HOT_COUNT}}` HOT | `{{WARM_COUNT}}` WARM | `{{WATCH_COUNT}}` WATCH | `{{COLD_COUNT}}` COLD

---

## Section 4: Sector Rotation

| Sector | 7d Return | vs BTC | Signal | Priority |
|--------|-----------|--------|--------|----------|
| L1 / Smart Contracts | {{L1_7D_PCT}}% | {{L1_VS_BTC}}% | {{L1_SIGNAL}} | {{L1_PRIORITY}} |
| DeFi | {{DEFI_7D_PCT}}% | {{DEFI_VS_BTC}}% | {{DEFI_SIGNAL}} | {{DEFI_PRIORITY}} |
| Memecoins | {{MEME_7D_PCT}}% | {{MEME_VS_BTC}}% | {{MEME_SIGNAL}} | {{MEME_PRIORITY}} |
| AI / Tech | {{AI_7D_PCT}}% | {{AI_VS_BTC}}% | {{AI_SIGNAL}} | {{AI_PRIORITY}} |
| Gaming | {{GAME_7D_PCT}}% | {{GAME_VS_BTC}}% | {{GAME_SIGNAL}} | {{GAME_PRIORITY}} |

**Leading Sector:** `{{LEADING_SECTOR}}` — `{{LEADING_NOTE}}`
**Rotation Insight:** `{{ROTATION_INSIGHT}}`
> Example: "Memecoins continued to outperform this week with DOGE and PEPE leading. L1 coins are consolidating after last week's rally."

---

## Section 5: New Narratives & Hype Clusters

### Dominant Narratives This Week
1. **{{NARRATIVE_1_NAME}}**
   - Evidence: `{{NARRATIVE_1_EVIDENCE}}`
   - Coins affected: `{{NARRATIVE_1_COINS}}`
   - Duration estimate: `{{NARRATIVE_1_DURATION}}`
   - Reliability: `{{NARRATIVE_1_RELIABILITY}}`

2. **{{NARRATIVE_2_NAME}}**
   - Evidence: `{{NARRATIVE_2_EVIDENCE}}`
   - Coins affected: `{{NARRATIVE_2_COINS}}`
   - Duration estimate: `{{NARRATIVE_2_DURATION}}`
   - Reliability: `{{NARRATIVE_2_RELIABILITY}}`

### Emerging Themes (Watch List)
| Theme | Signal Strength | coins | Note |
|-------|----------------|-------|------|
| {{EMERGING_THEME_1}} | {{THEME_1_STRENGTH}} | {{THEME_1_COINS}} | {{THEME_1_NOTE}} |

### Hype Risk Flag
`{{HYPE_FLAG}}`
> Example: ⚠️ "DOGE social volume up 340% this week. Memecoin activity is elevated — pump-and-dump risk is HIGH. Binance Bot: PAUSE memecoin signals."

---

## Section 6: Pre-Binance Scouting

### Coins Likely to List on Binance US
| Coin | Ticker | Age | CoinGecko Rank | Social Volume 7d | Current Exchange | Listing Probability | Days to Listing (Est.) |
|------|--------|-----|---------------|-------------------|-----------------|--------------------|-----------------------|
| {{PRE_BIN_COIN_1}} | {{PRE_BIN_TICKER_1}} | {{PRE_BIN_AGE_1}}d | {{PRE_BIN_RANK_1}} | {{PRE_BIN_SOCIAL_1}}% | {{PRE_BIN_EXCHANGE_1}} | {{PRE_BIN_PROB_1}} | {{PRE_BIN_DAYS_1}} |

### Scouting Notes
`{{PRE_BIN_NOTES}}`
> Example: "PEPE is showing strong social momentum with listing speculation. Currently on Gate.io and OKX. If listed on Binance US, expect 15-30% initial pop. CoinGecko rank #78, social volume up 220% in 7d."

---

## Section 7: Risk Conditions

### Active Risk Flags
| Flag | Status | Severity | Action |
|------|--------|----------|--------|
| EXTREME_VOLATILITY | {{EV_STATUS}} | {{EV_SEVERITY}} | {{EV_ACTION}} |
| MARKET_CHOPPY | {{MC_STATUS}} | {{MC_SEVERITY}} | {{MC_ACTION}} |
| PUMP_AND_DUMP_RISK | {{PAD_STATUS}} | {{PAD_SEVERITY}} | {{PAD_ACTION}} |
| LIQUIDITY_CONCERN | {{LIQ_STATUS}} | {{LIQ_SEVERITY}} | {{LIQ_ACTION}} |
| REGIME_UNCERTAINTY | {{RU_STATUS}} | {{RU_SEVERITY}} | {{RU_ACTION}} |

### Overall Risk Assessment: `{{RISK_OVERALL}}`
> Example: "Risk conditions are ELEVATED. High memecoin activity and elevated volatility require Binance Bot to operate with tighter pre-trade hook scrutiny and reduced position sizing."

---

## Section 8: Signals & Alerts

### This Week's Signals
| Signal ID | Type | Symbol | From | To | Trigger | Action |
|-----------|------|--------|------|-----|---------|--------|
| {{SIG_ID_1}} | {{SIG_TYPE_1}} | {{SIG_SYM_1}} | {{SIG_FROM_1}} | {{SIG_TO_1}} | {{SIG_TRIGGER_1}} | {{SIG_ACTION_1}} |

### Action Items for Next Week
- `{{ACTION_1}}`
- `{{ACTION_2}}`
- `{{ACTION_3}}`

---

## Machine-Readable Output (JSON)

```json
{
  "report_date": "{{REPORT_DATE}}",
  "regime": "{{REGIME}}",
  "regime_confidence": {{CONFIDENCE}},
  "volatility_regime": "{{VOL_REGIME}}",
  "btc_price": {{BTC_PRICE}},
  "btc_7d_pct": {{BTC_7D_PCT}},
  "btc_dominance_pct": {{BTC_DOM_PCT}},
  "breadth_ratio": {{BREADTH_RATIO}},
  "coin_rankings": [
    {
      "symbol": "{{HOT_SYMBOL}}",
      "band": "HOT",
      "band_score": {{HOT_SCORE}},
      "price_7d_pct": {{HOT_7D_PCT}},
      "reason": "{{HOT_REASON}}"
    }
  ],
  "sectors": [
    { "name": "L1", "7d_return": {{L1_7D_PCT}}, "vs_btc": {{L1_VS_BTC}}, "signal": "{{L1_SIGNAL}}" }
  ],
  "risk_flags": [{{RISK_FLAGS_ARRAY}}],
  "pre_binance_watch": [
    { "coin": "{{PRE_BIN_COIN_1}}", "listing_probability": "{{PRE_BIN_PROB_1}}" }
  ],
  "signals": [
    { "signal_id": "{{SIG_ID_1}}", "type": "{{SIG_TYPE_1}}", "symbol": "{{SIG_SYM_1}}", "band_from": "{{SIG_FROM_1}}", "band_to": "{{SIG_TO_1}}" }
  ]
}
```

**Output path:** `~/.hermes/knowledge/crypto-intel/weekly/{{YYYY}}/CRYPTO_INTEL_{{YYYY-MM-DD}}.json`
**Also:** Attach to Monday Telegram briefing via Hermes weekly cron.

---

## Appendix A: Methodology Notes

**Regime detection:** See CRYPTO_INTEL_ENGINE_SPEC.md Step 1.
**Band assignment:** See CRYPTO_INTEL_ENGINE_SPEC.md Step 4.
**Sector rotation:** See CRYPTO_INTEL_ENGINE_SPEC.md Step 3.

**Data freshness disclaimer:**
All price/volume data is sourced from Binance US public API. Regime and band assignments are analytical interpretations — not financial advice. Never save speculative narratives as verified facts.

---

## Appendix B: Quick Reference — Binance Bot Mode Recommendations

| Regime | Bot Mode | Band Filters | Position Sizing |
|--------|----------|-------------|-----------------|
| BULL | ACTIVE | HOT + WARM allowed | Full (1x risk) |
| MID_CYCLE | CAUTIOUS | HOT + WARM, tighter SL | Reduced (0.75x) |
| BEAR | INACTIVE | HOT only, minimal size | Minimal (0.5x) |
| EXTREME | BLOCK | ALL BLOCKED | Zero |

---

**Tags:** [TRADING] [WORKFLOW] [PROJECT:CryptoIntel] [PROJECT:BinanceBot] [PROJECT:MoneyPipeline]