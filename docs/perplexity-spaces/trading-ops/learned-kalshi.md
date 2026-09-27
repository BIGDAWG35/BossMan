# LEARNED_KALSHI.md — Kalshi Sports +EV Edge System

This is the canonical fact sheet for the Kalshi Sports +EV Daily Edge System.
Read first before touching the engine. Update only by adding new dated entries;
do not rewrite prior entries.

Source: docs.kalshi.com (verified against llms.txt 2026-09-24), CFTC Staff
Letter 26-08, KXNFLGAME live market snapshot 2026-09-24.

---

## A. CONTRACT MECHANICS (hardcoded)

- Binary event contracts. **Price in cents = implied probability** (62¢ ≈ 62%).
- A contract settles **$1.00 if YES wins, $0.00 if NO wins** (whole-cent rounding on payout).
- A contract can trade in the band **1¢–99¢**. Markets have price ranges per `price_ranges` (steps from 0.001¢ to 1¢). Snap to grid.
- Yes/No positions are complementary: **YES bid X ≡ NO ask (1 - X)**. The orderbook returns BIDS ONLY (no asks). Reconstruct both sides.

### American odds from probability P (percent)
- Favorite: `odds = -(P / (100 - P)) * 100`
- Underdog: `odds = +((100 - P) / P) * 100`
- Inverse (decimal odds): `dec = 1 / (P/100)`

---

## B. FEES (read this before any edge calculation)

- **Taker fee (quadratic):** `fee_per_contract = 0.07 × P × (1 − P)` in dollars, **rounded UP to 6 decimal places**.
  - Examples (cents per contract, single fill):
    - P = 50% → 1.75¢ (peak)
    - P = 60% → 1.68¢
    - P = 70% → 1.47¢
    - P = 80% → 1.12¢
    - P = 90% → 0.63¢
- **Maker fee ≈ 50% of taker** (when the series supports maker rebates). Always prefer resting limit orders.
- **Rounding fee** on top: balances aligned to $0.0001 (direct) or $0.01 (non-direct). The exchange charges a small rounding fee to bring the balance back to its precision grid, and refunds the overpayment via a per-order accumulator.
- **Round trip = 2 × fee** (enter taker, exit taker). Near 50¢ that is ~3.5¢ before spread. Edge must clear this BEFORE being real.
- **No fee on settlement** for binary yes/no.

---

## C. EDGE CALCULATION (Phase 2 core)

For each open market:

1. **Fair probability**: pull sharp consensus lines (Pinnacle, Circa, market-maker books). De-vig to a fair probability. This is the ground truth, not Kalshi's price.
2. **Executable price at your size**: walk the orderbook from the best bid/ask outward until you fill your desired quantity. Don't use just the top of book.
3. **All-in cost basis** = executable price + (1 if taker else 0.5) × taker fee.
4. **Spread**: best_ask − best_bid. **DISCARD** any market with spread > 3¢ or thin depth (configurable; default 50 contracts within 2¢ of inside).
5. **Net Edge** = fair_prob − cost_basis.
6. **Conservative edge**: apply a configurable safety haircut to fair_prob (default −2 pp) to account for model error, line moves, and book thinning. The lower bound is what we trade on, not the point estimate.
7. **SURFACE a bet only when conservative edge ≥ 3.0% net of fees and slippage.** Below that → NO BET. Never manufacture picks.

---

## D. SIZING (Phase 3 hard rules)

- **Quarter-Kelly**: `f* = 0.25 × (b × p − q) / b`
  - `b = (1 − P − fee) / P` is the decimal-odds equivalent net of fees (P in cents converted to dollars)
  - `p` = fair prob, `q = 1 − p`
  - Use the CONSERVATIVE `p`, not the point estimate.
- **HARD CAPS override Kelly:**
  - max **2% of bankroll per single contract**
  - max **6% of bankroll at risk in one day**
  - max **10% in simultaneous open positions**
- **No correlation**: never two bets on the same game or the same team's outcome.
- **Bankroll**: ask Marcelo before sizing in dollars. Until then show `$500 / $1,000 / $5,000` illustrations only.

---

## E. MARKET ACCESS (re-check every recommendation)

- **California**: Kalshi is available. CFTC-licensed DCM. No California cease-and-desist against Kalshi as of 2026-09. Sports-event contracts are the contested category nationally; the federal preemption question is unresolved but Kalshi is operating here.
- Re-check on every recommendation: `kalshi.com/category/sports/all-sports` sign-up screen for state, and the current 9th Circuit / federal preemption posture.
- Until Phase 14 (paper trade) passes, do not run with real money.

---

## F. AUTH + RATE LIMITS

- **Endpoints**:
  - Production: `https://api.elections.kalshi.com/trade-api/v2`
  - Demo: `https://demo-api.kalshi.co/trade-api/v2`
- **Read endpoints require NO auth** (markets, orderbook, events, series).
- **Auth headers** for write endpoints:
  - `KALSHI-ACCESS-KEY` — Key ID (UUID)
  - `KALSHI-ACCESS-TIMESTAMP` — current ms since epoch (string)
  - `KALSHI-ACCESS-SIGNATURE` — base64 of `sign(timestamp + METHOD + path)` where path is the URL path WITHOUT query string. Ed25519 signs the bytes directly; RSA uses RSA-PSS SHA-256.
- **Tokens**: every authenticated request costs **10 tokens** by default. Tiered refill:
  - Basic: 200 read / 100 write per second
  - Premier: 1000 / 1000 (this is the tier we should target for scale)
  - Burst capacity = 2× the per-second refill above Basic.
- **429**: no `Retry-After` header. Exponential backoff on 429.

---

## G. SPORTS SERIES TICKERS (watch list)

- `KXNFLGAME` — NFL game winner
- `KXNBAGAME` — NBA game winner
- `KXMLBGAME` — MLB game winner
- `KXNHLGAME` — NHL game winner
- `KXNCAAF` — College football
- `KXNCAABGAME` — College basketball game winner
- `KXMLBSERIES` — MLB series winner
- `KXNBASERIES` — NBA series winner
- `KXNFLSERIES` — NFL playoff series
- `KXUFC` — UFC
- `KXSOC` — Soccer
- `KXTENNIS` — Tennis

Game markets (KXNFLGAME, KXNBAGAME, etc.) close shortly before kickoff; price-level `linear_cent` ($0.01 tick).

---

## H. NON-NEGOTIABLES (Marcelo's standing rules)

- READ-ONLY on money. NO deposits, NO orders, NO cancels, NO trading API keys, NO enabling trading without explicit per-order confirmation (market, side, price, qty, max loss).
- An approved monitoring cron does NOT authorize a trade. Every system-affecting change is logged with a risk level and waits for approval.
- 30-day paper trade minimum before any real capital. Sample size, net P&L, drawdown, out-of-sample edge survival required.
- Cron jobs run on M3/Ollama locally. API keys never leave the local machine.
- Never say "guaranteed."

---

## I. ENDPOINTS WE'LL USE

- `GET /markets?status=open&series_ticker=KXNFLGAME&limit=N&cursor=...` — list open markets (NO auth).
- `GET /markets/{ticker}` — single market detail (NO auth).
- `GET /markets/{ticker}/orderbook` — orderbook (NO auth).
- `GET /events?status=open&series_ticker=...&limit=...` — events (NO auth).
- `GET /series/{ticker}` — series detail (NO auth).
- `GET /series` — series list (NO auth).

Auth-bearing endpoints are wired up but **NOT called** without explicit approval:
- `POST /portfolio/orders` — place order
- `DELETE /portfolio/orders/{order_id}` — cancel
- `GET /portfolio/balance` — read balance
- `GET /portfolio/positions` — read positions

---

## J. KNOWN FOOT-GUNS (encountered during Phase 1)

1. Orderbook quirk: yes bid X ≡ no ask (1 − X). If you treat best_yes_bid as the executable ask you'll systematically overpay. Always reconstruct the two-sided book first.
2. Fixed-point strings: never parse `"0.6200"` as `0.62` and then round to cents — you'll lose sub-cent precision. Treat as Decimal or as integer cents ×100.
3. Fee at 50¢ is the maximum. Avoid round-tripping near 50¢ unless edge is large.
4. Walk the book. A thin top of book with 5 contracts at 62¢ and 50 at 64¢ gives an executable of 63.6¢ for 55 contracts, not 62¢.
5. Tied game = $0.50. Don't price teams strictly.
6. Settlement is whole-cent. The last sub-cent goes to the rounding fee, not to you.
