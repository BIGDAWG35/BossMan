# CSDAWG Review Cycle Manager

**Owner:** LBC35 | **Managed for:** Marcelo
**Purpose:** Never miss a scheduled review. Never let CSDAWG operate without structured oversight.

---

## Review Cadence

| Review Type | Frequency | Trigger | Questions |
|-------------|-----------|---------|-----------|
| **Performance Review** | Weekly | Every Sunday | A1, A2 |
| **Pair Performance Ranking** | Every 2 weeks | Calendar | B2 + F (leading indicators) |
| **Regime & Pair Review** | Twice-monthly | 1st & 15th of month | B1, B3 |
| **Strategy Refinement** | Monthly | 1st of month | C1, C2, G |
| **Risk Review** | Event-driven | On trigger events | D1, D2, D3, H (if drawdown trigger) |
| **Exit Effectiveness** | Every 10 closed trades | Trade-count trigger | C2 |
| **Ad-hoc Analysis** | As-needed | LBC35 or Marcelo requests | E1, E2, E3 |

---

## Trigger Events (Event-Driven Risk Review)

Run D-series immediately when ANY of these occur:
- Daily loss limit hit (-3%)
- Circuit breaker triggered (3 consecutive losses)
- Exposure cap blocks 3+ entries in one cycle
- Balance divergence >5%
- Slippage spike detected on any pair
- Volatility spike (ATR or implied) >2x 30-day average
- 5+ consecutive losing trades on one pair
- Any unexplained large drawdown (>5% in one trade)

---

## Question Bank

### A — Weekly Performance Review (Every Sunday)
**A1: Week-in-Review**
Review the past 7 days of trading on both Binance (8104) and Kraken (8106). For each bot: total closed trades, win rate, average win/loss, biggest winner, biggest loser, total PnL, and time-in-market. Compare to the prior week. Are we improving?

**A2: Signal Quality Check**
Pull the last week's signals from both bots. For each trade: did the 1H trend, RSI range, EMA pullback, and bullish candle all agree? Were there any false signals — entries that met the technical criteria but moved against us? What's the ratio of good entries to poor entries?

---

### B — Twice-Monthly Regime & Pair Review (1st & 15th)
**B1: Market Regime Assessment**
Assess the current crypto market regime: are we in bull, bear, or chop? Support your view with BTC dominance trend, altcoin vs BTC correlation, funding rates (if available), and current EMA configuration on BTC 1H and 4H charts. How confident are you in this assessment?

**B2: Pair Health Check**
Evaluate all 5 Binance pairs (AVAX, MATIC, SUI, APT, ENA) and all 5 Kraken pairs (DOT, ATOM, LINK, VET, CRV). For each: is the pair in a clean uptrend on the 1H? Has it been choppy? Has it had more losses than wins in our DB? Should any pair be flagged for suspension or replacement? Provide specific evidence per pair.

**B3: Exposure & Risk Calibration**
Given the current regime, is our 25% max total exposure still appropriate? Should we consider reducing to 20% in chop, or could we responsibly go to 30% in a confirmed strong bull? Also assess: is the 2% per-trade risk still appropriate for the current volatility environment?

---

### C — Monthly Strategy Refinement (1st of Month)
**C1: Entry Quality Deep Dive**
Take the past month's signals and analyze: what's the average pullback depth before entry? What's the average RSI at entry? What's the win rate broken down by RSI at entry (40-50 vs 50-60)? Should we tighten or widen the RSI range based on what the data says?

**C2: Exit & Trail Effectiveness**
Analyze the trailing stop performance over the past month: how many trades hit +5% but didn't reach +10%? How many hit +10% but stopped at breakeven on the reversal? Should we adjust trail levels or add a new intermediate stage? What would the impact be on win rate and average trade PnL?

---

### D — Event-Driven Risk Review (On Trigger)
**D1: Root Cause Analysis**
A risk event just occurred [describe event]. What was the root cause — was it a bad signal, market conditions, slippage, or a bot bug? Is this an isolated incident or a systemic issue?

**D2: Immediate Risk Calibration**
Given this event, should we immediately reduce risk, pause a specific pair, or pause the entire bot? What's the minimum action needed to prevent the same issue from recurring in the next cycle?

**D3: Propagating Risk Assessment**
If one pair caused a problem, is there a risk it affects other pairs or the broader account? Check correlations, exposure concentration, and cascading effects. What's the worst-case scenario if we do nothing?

---

### E — Ad-Hoc / On-Request (No Schedule)
**E1: Specific Pair Analysis**
[On request] Deep-dive into [pair name]. Look at 1H, 4H, and 1D charts. Is it in an uptrend? What's the typical pullback depth? How does it behave during market-wide selloffs? Should we keep, replace, or adjust our approach to this pair?

**E2: Strategy Comparison**
[On request] Compare our current strategy framework to what a pure trend-following system would do in the same market conditions. Are we leaving money on the table by requiring pullbacks? Or are we correctly avoiding false breakouts?

**E3: New Opportunity Scan**
[On request] Based on current market conditions, are there any other pairs on Binance.US or Kraken that deserve consideration for our universe? Evaluate liquidity, correlation to our current pairs, volatility profile, and fit with our strategy framework. Recommend with evidence or decline with reasoning.

---

## Rotating Schedule Tracker

Last updated: 2026-04-04

| Review | Last Run | Next Due | Status |
|--------|----------|----------|--------|
| A1 (Week-in-Review) | — | 2026-04-06 (Sun) | Pending |
| A2 (Signal Quality) | — | 2026-04-06 (Sun) | Pending |
| F (Leading Indicators) | — | 2026-04-06 (Sun) | Pending — first run with A |
| B2 (Pair Health + Ranking) | — | 2026-04-06 (Sun) | Pending — first run with A |
| B1 (Regime Assessment) | — | 2026-04-15 | Pending |
| B3 (Exposure Calibration) | — | 2026-04-15 | Pending |
| G (Sector Rotation) | — | 2026-05-01 | Pending |
| C1 (Entry Quality) | — | 2026-05-01 | Pending |
| C2 (Exit & Trail) | — | After 10 trades | Pending |
| H (Drawdown Recovery) | — | Trigger: >10% drawdown | Awaiting trigger |
| D1/D2/D3 | — | Trigger: risk event | Awaiting trigger |

---

## How LBC35 Runs This

1. **Every Sunday morning:** Run A1 + A2 + F (leading indicators) + B2 (pair ranking), surface findings to Marcelo
2. **1st and 15th of month:** Run B1 (regime) + B3 (exposure calibration), surface findings to Marcelo
3. **1st of month:** Run C1 + C2 + G (sector rotation) alongside B-series
4. **After every 10 closed trades:** Run C2 (exit effectiveness) — trade-count trigger, not time-based
5. **On any D-trigger event:** Run D1/D2/D3 immediately, escalate same day
6. **On drawdown >10% from cycle peak:** Run H (drawdown recovery readiness) alongside D-series
7. **On Marcelo request:** Run E-series, deliver within same session

**LBC35 always:**
- Chooses the most relevant prompt based on timing + conditions
- Collects CSDAWG output
- Delivers summary: key findings + recommended changes + risk warnings + approval required Y/N
- Gets Marcelo approval before any production change

---

## Guardrails

- CSDAWG runs the analysis — LBC35 coordinates and surfaces
- LBC35 never lets CSDAWG touch production code or risk parameters directly
- Material changes (pairs, risk rules, strategy) always require Marcelo's explicit approval
- Event-driven reviews happen immediately — no waiting for the calendar

---

### F — Leading Indicator Health Check (Added post-meta-review)
Assess forward-looking signals that may indicate regime shifts before price confirms them:
- Funding rates on perps for our pairs (altcoins with high perp activity: AVAX, MATIC, LINK, etc.)
- Open interest changes — rising OI with price rise = healthy; falling OI with price rise = divergence
- Spot vs perpetual divergence — is the spot market confirming what perps are pricing?
- BTC.D trend direction — does it support or threaten altcoin strength?

**When to run:** Every 2 weeks alongside B-series, or immediately on any D-trigger event.

---

### G — Sector Rotation / Thematic Momentum (Added post-meta-review)
Identify which crypto sub-sector is leading the current market:
- Are we in a DeFi narrative, infrastructure/L1 narrative, or broad risk-on?
- Our 5 Binance pairs span L1 (AVAX, SUI), L2 (MATIC), and utility tokens (APT, ENA) — are they moving in sync or diverging?
- Which sub-sector is outperforming BTC this week?
- Should we weight entry signals differently based on sector leadership?

**When to run:** Monthly (1st of month), or when BTC enters a new regime.

---

### H — Drawdown Recovery Readiness (Added post-meta-review)
If we hit a 15%+ drawdown from cycle peak, what's the recovery plan?
- At what balance threshold do we pause, reduce, or reset risk sizing?
- Should max positions reduce from 4 to 2 during recovery mode?
- What's the minimum viable balance before we reassess the cycle entirely?

**When to run:** Triggered when drawdown from cycle peak exceeds 10%, or on new cycle launch.
