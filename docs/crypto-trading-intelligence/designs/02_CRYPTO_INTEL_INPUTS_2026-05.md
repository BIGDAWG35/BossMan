# CRYPTO_INTEL_INPUTS_2026-05.md — Crypto Intelligence Layer Data Inputs
**Date:** 2026-05-22 | **Phase:** Phase 9 | **Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel]
**Status:** ✅ DRAFT — Phase 9 Design Only

---

## Overview

This document defines the data inputs for Hermes's Crypto Intelligence Layer (CSDAWG 2.0). It specifies which data to collect, from which sources, how often to refresh, and which downstream phases (8/10/11) each input feeds.

**Design principle:** Intelligence is research-only. No input here triggers automatic execution or trade placement.

---

## Input Categories

### Category A: Price & Market Structure (Exchange Data)

#### A1: BTC/ETH Price & Trend
- **Source:** Binance US public API (no auth required for price data)
  - `GET /api/v3/ticker/24hr?symbol=BTCUSDT`
  - `GET /api/v3/ticker/24hr?symbol=ETHUSDT`
  - `GET /api/v3/klines?symbol=BTCUSDT&interval=1d&limit=90` (daily candles for trend)
  - `GET /api/v3/klines?symbol=BTCUSDT&interval=4h&limit=90` (4H candles for momentum)
- **Refresh:** Every 15 minutes during active trading hours (08:00–22:00 PDT), hourly overnight
- **Fields captured:** close, volume, high24h, low24h, priceChange, priceChangePercent, quoteVolume
- **Downstream:** Feeds Money Pipeline (regime context for opportunities), Binance Bot (trend filter for signal execution)

#### A2: BTC Dominance & Market Breadth
- **Source:** Binance US or CoinGecko public aggregator
  - BTC Dominance: calculated from Binance total market cap endpoint or CoinGecko global
  - Breadth: count of coins with priceChangePercent > 0 vs < 0 over rolling 24h window
  - Alternative: scan top 50 coins on Binance US for % up/down count
- **Refresh:** 4x daily (8 AM, 12 PM, 5 PM, 10 PM PDT)
- **Fields captured:** btc_dominance_pct, coins_up_24h, coins_down_24h, breadth_ratio (up/(up+down))
- **Downstream:** Market regime detection (bull/bear/chop), Money Pipeline regime tags

#### A3: Volatility Regime
- **Source:** Derived from BTC 20-day rolling volatility (standard deviation of daily returns)
- **Calculation:** BTC 20d std dev of daily returns → map to regime:
  - < 2.5%: LOW (consolidation)
  - 2.5%–5%: NORMAL
  - 5%–10%: HIGH (trending)
  - > 10%: EXTREME (parabolic / breakdown)
- **Refresh:** Daily (computed from 20d dataset)
- **Fields captured:** btc_vol_20d, volatility_regime (LOW/NORMAL/HIGH/EXTREME), regime_confidence
- **Downstream:** Binance Bot — block or allow signal execution based on volatility filter (EXTREME = skip entry signals)

#### A4: Order Book Depth (optional, Phase 9B)
- **Source:** Binance US `GET /api/v3/depth?symbol=BTCUSDT&limit=20`
- **Refresh:** On-demand (for liquidity assessment before large orders)
- **Fields captured:** bid_depth_5, ask_depth_5, spread_bps, spread_pct
- **Downstream:** Binance Bot — assess if Binance US has sufficient depth before sizing

---

### Category B: Market Regime Detection

#### B1: Bull / Bear / Mid-Cycle Classification
- **Source:** Multi-factor analysis — not a single API, computed from historical data
- **Inputs:**
  - BTC 200-day SMA direction (trend following)
  - BTC 50-day vs 200-day SMA cross (death cross / golden cross)
  - BTC drawdown from ATH (% correction)
  - BTC 90-day momentum (% change over 90d)
  - Altseason index (if available via CoinGecko or alternative)
- **Classification logic:**
  - **BULL:** BTC above 200d SMA + BTC < 20% from ATH + 90d momentum > 15%
  - **BEAR:** BTC below 200d SMA + BTC > 50% from ATH + 90d momentum < -20%
  - **MID-CYCLE:** Everything else (range-bound, rotation phase)
  - **EXTREME:** BTC > 75% from ATH + volatility EXTREME — overheated, pause new entries
- **Refresh:** Daily after market close (22:00 PDT)
- **Fields captured:** regime (BULL/BEAR/MID_CYCLE/EXTREME), regime_confidence (0–1), regime_signal_date, btc_200d_sma, btc_50d_200d_cross (golden/death/none), drawdown_from_ath_pct, momentum_90d_pct
- **Downstream:** Money Pipeline — tag opportunities by regime suitability; Binance Bot — activate/deactivate signal execution based on regime rules

#### B2: Sector Rotation Signals
- **Source:** Derived from relative performance of sector ETFs or coin groupings
- **Coin groupings for rotation tracking:**
  - L1 / Smart Contract Platform: BTC, ETH, SOL, ADA, AVAX, NEAR, MATIC, ATOM
  - DeFi: UNI, AAVE, CRV, MKR, LINK
  - Memecoins: DOGE, SHIB, PEPE, WIF
  - AI/Tech: AGIX, FET, OCEAN, ARB (check if listed)
  - Gaming: AXS, SAND, MANA
- **Calculation:** Weekly % return of each group vs BTC baseline → rank groups by relative strength
- **Refresh:** Weekly (Monday)
- **Fields captured:** sector_name, sector_7d_return, relative_to_btc, rotation_signal (LEADING/LAGGING/NEUTRAL)
- **Downstream:** Money Pipeline — sector momentum adds weight to opportunities; Binance Bot — sector rotation can filter which symbols to prioritize

---

### Category C: Narrative & Social Intelligence

#### C1: News & Headline Scanning
- **Source:** Crypto news RSS feeds + Perplexity daily digest (aggregated)
  - RSS: CoinDesk, Cointelegraph, The Block (free tier)
  - Perplexity: "crypto market news today" daily search
  - Optional: CryptoPanic aggregation
- **Refresh:** 2x daily (8 AM, 5 PM PDT)
- **Capture:** headline, source, timestamp, sentiment_signal (BULLISH/BEARISH/NEUTRAL), themes (DeFi/L1/memecoin/regulation/ETF/metaverse/etc.)
- **Processing:** Group headlines by theme → identify dominant narrative of the week
- **Downstream:** Weekly intelligence report — narrative cluster identification; Money Pipeline — opportunity source/context

#### C2: Social Sentiment Indicators (Design Only — No Scraping)
- **Design intent (Phase 9B implementation):**
  - Track social volume spike for coins in watch list (Twitter/X, Reddit, Telegram)
  - Track Google Trends / search volume for coin names + "buy" queries
  - Track funding rate anomalies on Binance (potential overheated signal)
- **Metrics to capture:**
  - social_volume_rank (relative to 30d average)
  - funding_rate_anomaly (if perp funding rate >> 0.1% daily = overheated long)
  - google_trends_score (0–100, relative to 90d)
- **Refresh:** Daily
- **Note:** Phase 9 is design only — no scraping infrastructure in this phase
- **Downstream:** Money Pipeline — hype band assignment (HOT = social spike); Binance Bot — pause if social spike indicates pump-and-dump risk

#### C3: Pre-Listing / Pre-Binance Scouting
- **Source:** CoinGecko API (listing tracking) + Binance US new listing announcements
  - `GET /api/v3/exchangeInfo` (Binance US — check for new symbols)
  - CoinGecko: track coins with high social volume but not yet on Binance US
- **Refresh:** Weekly
- **Fields captured:** coin_name, ticker, coin_age_days, coingecko_market_cap_rank, social_volume_7d_pct_change, listing_probability_estimate (HIGH/MEDIUM/LOW), current_exchange (Kraken/OKX/Gate.io/Bybit etc.), estimated_drop_before_listing (%), estimated_days_to_listing
- **Note:** Must respect exchange listing rules — research only, no insider information
- **Downstream:** Weekly intelligence report — pre-Binance scouting section; Money Pipeline — if a pre-listing opportunity exists, capture as special "pre-binance" type

---

### Category D: Historical Cycle Analysis

#### D1: Last 3 Bull Runs & Bear Markets Structure
- **Source:** Historical BTC price data (public, CoinGecko or Binance klines)
- **Periods to document:**
  - Bull: 2020-03 → 2021-04 (COVID pump), 2021-07 → 2021-11 (altseason), 2024-01 → 2024-03 (ETF bull)
  - Bear: 2021-05 → 2021-07 (China crackdown), 2021-11 → 2022-11 (FTX collapse), 2022-11 → 2024-01
- **Data points to capture per cycle:**
  - Duration (weeks from low to high / high to low)
  - BTC % gain/loss from cycle low/high
  - Time spent in each volatility regime (LOW/NORMAL/HIGH/EXTREME)
  - Sector rotation pattern (which coins led vs lagged)
  - BTC dominance pattern (did BTC leading indicate alt season or BTC season?)
  - Average cycle correction depth (% drawdown mid-cycle)
- **Refresh:** Quarterly (or after major regime change)
- **Purpose:** Pattern matching against current cycle to estimate position in cycle
- **Downstream:** Regime confidence scoring — if current conditions match historical mid-cycle pattern, increase confidence in regime call

#### D2: Current Cycle Position Estimation
- **Method:** Compare current market metrics against historical cycle averages
  - Days since cycle low (2022-11-10 BTC low at ~$15,500)
  - % gain from cycle low
  - Volatility regime distribution so far
  - BTC dominance trajectory
- **Output:** Estimated cycle phase (EARLY/MID/LATE/RECOVERY) + confidence score

---

## Input Refresh Schedule

| Input | Frequency | Time (PDT) | Owner |
|-------|-----------|------------|-------|
| A1 BTC/ETH price+trend | Every 15 min (active), hourly (off-hours) | Continuous | Hermes T1 monitor |
| A2 BTC dominance+breadth | 4x daily | 08:00, 12:00, 17:00, 22:00 | Hermes cron |
| A3 Volatility regime | Daily | 22:00 (market close) | Hermes cron |
| A4 Order book depth | On-demand | N/A | Binance Bot (pre-execution) |
| B1 Market regime | Daily | 22:00 (market close) | Hermes weekly review |
| B2 Sector rotation | Weekly | Monday 08:00 | Hermes weekly review |
| C1 News+headlines | 2x daily | 08:00, 17:00 | Hermes cron |
| C2 Social sentiment | Daily (design) | N/A | Phase 9B |
| C3 Pre-listing scouting | Weekly | Monday 08:00 | Hermes weekly review |
| D1 Historical cycles | Quarterly | N/A | Manual review |
| D2 Cycle position | Weekly | Monday 08:00 | Hermes weekly review |

---

## Downstream Phase Mapping

| Input Category | Feeds Phase 8 (Money Pipeline) | Feeds Phase 10 (Binance Bot) | Feeds Phase 11 (Execution) |
|---------------|-------------------------------|------------------------------|----------------------------|
| A1 Price/Trend | Regime context for KPI scoring | Trend filter (only execute in TREND) | Execution sizing |
| A2 Dominance/Breadth | Opportunity weighting | Market breadth filter | Risk management |
| A3 Volatility | Opportunity timing | BLOCK in EXTREME mode | Position size limits |
| A4 Order book | No | Liquidity check before orders | Order sizing validation |
| B1 Bull/Bear/Mid | Stage recommendations | Activate/deactivate execution | Strategy selection |
| B2 Sector rotation | Sector weight in scoring | Priority symbols by sector | Diversification rules |
| C1 Narratives | Opportunity type tagging | Narrative filter | No direct link |
| C2 Social | Hype band (HOT/WARM/WATCH/COLD) | Pause if pump detected | Risk management |
| C3 Pre-listing | Pre-Binance scout section | Watch list candidates | No execution |
| D1 Historical | Regime confidence | Historical analog patterns | Strategy backtesting |
| D2 Cycle position | Timing recommendations | Confidence filter | Position sizing |

---

## Data Architecture

```
PUBLIC DATA SOURCES (no auth required)
         │
         ▼
┌─────────────────────────────────────────────────┐
│           CRYPTO INTEL LAYER (Hermes)            │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Price/   │  │ Regime   │  │ Narrative│       │
│  │ Market   │  │ Detection│  │ Social   │       │
│  │ (A1-A4)  │  │ (B1-B2)  │  │ (C1-C3)  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │            │
│       └──────────────┼──────────────┘            │
│                      ▼                           │
│         ┌─────────────────────┐                 │
│         │  INTEL PRODUCTS      │                 │
│         │  • Weekly Report     │                 │
│         │  • Coin Rankings     │                 │
│         │  • Regime Signals     │                 │
│         │  • Pre-Binance Scout │                 │
│         └─────────────────────┘                 │
└──────────────┬─────────────────┬────────────────┘
               │                 │
               ▼                 ▼
         Phase 8           Phase 10
      Money Pipeline      Binance Bot
      (research/          (signal
       scoring)            filtering)
```

---

## Phase 9B Implementation Dependencies

Before implementation (Phase 9B), the following must be confirmed:
1. Binance US API endpoints for price/klines/orderbook are accessible and rate-limit-safe
2. CoinGecko public API (free tier) is sufficient for dominance/global data
3. RSS feed aggregation is reliable for news scanning
4. Historical data storage (SQLite file or local JSON) is approved for cycle analysis

---

**Tags:** [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel] [PROJECT:MoneyPipeline] [PROJECT:BinanceBot]