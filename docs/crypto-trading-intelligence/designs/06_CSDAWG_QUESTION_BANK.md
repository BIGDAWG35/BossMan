# CSDAWG Question Bank

See `CSDAWG_REVIEW_CYCLE.md` for the full management framework. This file is the source-of-truth question bank.

---

## A — Weekly (Every Sunday)
**A1: Week-in-Review**
Review the past 7 days of trading on both Binance (8104) and Kraken (8106). For each bot: total closed trades, win rate, average win/loss, biggest winner, biggest loser, total PnL, and time-in-market. Compare to the prior week. Are we improving?

**A2: Signal Quality Check**
Pull the last week's signals from both bots. For each trade: did the 1H trend, RSI range, EMA pullback, and bullish candle all agree? Were there any false signals — entries that met the technical criteria but moved against us? What's the ratio of good entries to poor entries?

---

## B — Twice-Monthly (1st & 15th)
**B1: Market Regime Assessment**
Assess the current crypto market regime: are we in bull, bear, or chop? Support your view with BTC dominance trend, altcoin vs BTC correlation, funding rates, and current EMA configuration on BTC 1H and 4H charts. How confident are you in this assessment?

**B2: Pair Health Check**
Evaluate all 5 Binance pairs (AVAX, MATIC, SUI, APT, ENA) and all 5 Kraken pairs (DOT, ATOM, LINK, VET, CRV). For each: is the pair in a clean uptrend on the 1H? Has it been choppy? Has it had more losses than wins in our DB? Should any pair be flagged for suspension or replacement? Provide specific evidence per pair.

**B3: Exposure & Risk Calibration**
Given the current regime, is our 25% max total exposure still appropriate? Should we consider reducing to 20% in chop, or could we responsibly go to 30% in a confirmed strong bull? Also assess: is the 2% per-trade risk still appropriate for the current volatility environment?

---

## C — Monthly (1st of Month)
**C1: Entry Quality Deep Dive**
Take the past month's signals and analyze: what's the average pullback depth before entry? What's the average RSI at entry? What's the win rate broken down by RSI at entry (40-50 vs 50-60)? Should we tighten or widen the RSI range based on what the data says?

**C2: Exit & Trail Effectiveness**
Analyze the trailing stop performance over the past month: how many trades hit +5% but didn't reach +10%? How many hit +10% but stopped at breakeven on the reversal? Should we adjust trail levels or add a new intermediate stage? What would the impact be on win rate and average trade PnL?

---

## D — Event-Driven (On Trigger)
**D1: Root Cause Analysis**
A risk event just occurred [describe event]. What was the root cause — was it a bad signal, market conditions, slippage, or a bot bug? Is this an isolated incident or a systemic issue?

**D2: Immediate Risk Calibration**
Given this event, should we immediately reduce risk, pause a specific pair, or pause the entire bot? What's the minimum action needed to prevent the same issue from recurring in the next cycle?

**D3: Propagating Risk Assessment**
If one pair caused a problem, is there a risk it affects other pairs or the broader account? Check correlations, exposure concentration, and cascading effects. What's the worst-case scenario if we do nothing?

---

## E — Ad-Hoc (As Requested)
**E1: Specific Pair Analysis**
Deep-dive into [pair name]. Look at 1H, 4H, and 1D charts. Is it in an uptrend? What's the typical pullback depth? How does it behave during market-wide selloffs? Should we keep, replace, or adjust our approach to this pair?

**E2: Strategy Comparison**
Compare our current strategy framework to what a pure trend-following system would do in the same market conditions. Are we leaving money on the table by requiring pullbacks? Or are we correctly avoiding false breakouts?

**E3: New Opportunity Scan**
Based on current market conditions, are there any other pairs on Binance.US or Kraken that deserve consideration for our universe? Evaluate liquidity, correlation to our current pairs, volatility profile, and fit with our strategy framework. Recommend with evidence or decline with reasoning.

---

## F — Leading Indicator Health Check *(new — 2026-Q2)*
Assess forward-looking signals that may indicate regime shifts before price confirms them:
- Funding rates on perps for our pairs (altcoins with high perp activity: AVAX, MATIC, LINK, etc.)
- Open interest changes — rising OI with price rise = healthy; falling OI with price rise = divergence
- Spot vs perpetual divergence — is the spot market confirming what perps are pricing?
- BTC.D trend direction — does it support or threaten altcoin strength?

**When to run:** Every 2 weeks alongside B-series, or immediately on any D-trigger event.

---

## G — Sector Rotation / Thematic Momentum *(new — 2026-Q2)*
Identify which crypto sub-sector is leading the current market:
- Are we in a DeFi narrative, infrastructure/L1 narrative, or broad risk-on?
- Our 5 Binance pairs span L1 (AVAX, SUI), L2 (MATIC), and utility tokens (APT, ENA) — are they moving in sync or diverging?
- Which sub-sector is outperforming BTC this week?
- Should we weight entry signals differently based on sector leadership?

**When to run:** Monthly (1st of month), or when BTC enters a new regime.

---

## H — Drawdown Recovery Readiness *(new — 2026-Q2)*
If we hit a 15%+ drawdown from cycle peak, what's the recovery plan?
- At what balance threshold do we pause, reduce, or reset risk sizing?
- Should max positions reduce from 4 to 2 during recovery mode?
- What's the minimum viable balance before we reassess the cycle entirely?

**When to run:** Triggered when drawdown from cycle peak exceeds 10%, or on new cycle launch.
