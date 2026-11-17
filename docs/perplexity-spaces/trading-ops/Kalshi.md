**Version:** v4 · **Date:** 2026-11-16 · **Source:** `~/.hermes/knowledge/LEARNED_KALSHI.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

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

---

## Daily card format — FINAL (pplx-kalshi-015, 2026-10-01; supersedes pplx-kalshi-012 and -007)

> Moved here from `~/.hermes/memories/MEMORY.md` during MD audit Phase 2 (2026-10-01) so memory stays under cap. Skill: `~/.hermes/skills/product/kalshi-plain-card`.

- Deck = 2 pages. **Page 1:** bottom line, top 3 picks, 2 two-team combos (one biggest payout, one safer). **Page 2:** "Top 10 Today" — the 10 best SINGLE picks. Combos are NOT counted in the 10 and are built only from those top-10 picks.
- Every pick shown (watch-list included) must be ≥2X net profit after fees. If fewer than 10 qualify, page 2 says how many did.
- Every report (scheduled or on-demand) sends **page-1 PNG, page-2 PNG, then the 2-page .pptx**, each once, from the `MEDIA:` lines. Caption = the lines the script prints only; never retype, summarize, or add numbers.
- Fresh run: `cd ~/Projects/kalshi-edge && node scripts/run-cross-category-card.js` (3 odds calls; runner refuses if quota used). Re-show with no API calls: `node scripts/render-card-slide.js`.
- Odds cap 10/day — if a fresh run would exceed it, re-show the latest deck and say when it was last checked. Never send the old text card unless the slide fails (and say so).
- Target chat 8536867361 via the `send-telegram-alert.py` pattern.

### Prior memory entry (verbatim, pre-015)

[WORKFLOW] Kalshi SLIDE rule (pplx-kalshi-012, 2026-10-01, supersedes pplx-kalshi-007). Every report = PNG photo + matching .pptx document, each once. Caption = first 2 lines script prints only. Never retype/summarize/add numbers. Fresh: `cd ~/Projects/kalshi-edge && node scripts/run-cross-category-card.js` (3 odds calls, runner refuses if quota used), send newest logs/cards/kalshi-*.png as photo + matching .pptx as doc. Re-show no API: `node scripts/render-card-slide.js`, send PNG+PPTX paths from MEDIA: lines. Odds cap 10/day; if fresh would exceed, re-show latest slide and say last check. Never send old text card unless slide fails (and if so, say so). Target chat 8536867361 via send-telegram-alert.py-pattern. Skill: kalshi-plain-card.

---

## K. VENDOR RENAME + TRUTHFUL FAILURE REPORTING (2026-11-16)

### K1. Sportsbook odds vendor renamed — theoddsapi.com → bettingdataapi.com

The primary sportsbook-odds host `api.theoddsapi.com` now fails TLS
(`HTTP:000 err:60`, cert identity mismatch on `theoddsapi-api.b-cdn.net`).
The vendor renamed itself. Working replacement, SAME `ODDS_API_KEY`,
SAME `x-api-key` header, SAME `/odds/` path & query shape:

- Primary: `https://api.bettingdataapi.com/odds/?sport_key=<KEY>&markets=h2h&regions=us&oddsFormat=american`
- Catalog: `https://api.bettingdataapi.com/sports/`
- Events: `https://api.bettingdataapi.com/events/?sport_key=<KEY>`

**Do NOT rename `api.the-odds-api.com/v4`.** That is the SEPARATE hyphenated
v4 overlay path in `src/sharp-feed-v4.js` on the SEPARATE key
`THE_ODDS_API_V4_KEY`. It was unaffected and still works. A global hostname
replacement would break it.

### K2. The replacement can return HTTP 200 and still be a FAILURE

Response envelope is `{ success, source, data[] }` (NOT a bare array).
MLB returns **HTTP 200 with `success:false` and `data:null`** ("Cache is empty
for baseball_mlb" — out of season). Success MUST be decided from the BODY,
never from the HTTP status. `src/sharp-feed.js._get()` now throws unless
`success === true` AND `data` is an array.

### K3. "Failed: none." must never coexist with a `(FAILED)` marker

Legacy (NBA/NFL/MLB) `scan_error`s were recorded in `card.operational_failures`
but never pushed into `coverageFailures`, so the card printed
`Failed: none.` on one line while the SAME card said
`NBA 50 (FAILED), NFL 2 (FAILED)`. Every scan error — legacy and non-legacy —
must now reach `coverageFailures` via `collectCoverageFailures()`
(`scripts/run-cross-category-card.js`, module-level so `main()` stays inside
the 20k source window asserted by `test/end-to-end-runner.test.js`).

### K4. Never claim an alert was sent unless it was verified

The cards hardcoded "BossMan has been told about the problem." with NO alert
path anywhere. That claim was unverifiable and therefore false. Now:
`src/alert-notify.js` posts to the operator Telegram chat and returns
`{ sent: boolean, detail: string }`; `src/plain-card.js` and `src/pptx-card.js`
render the "BossMan has been told" sentence ONLY when `operator_alert.sent === true`,
otherwise they render an explicit "BossMan was NOT told" status. Alert failure
must never prevent the card from rendering.

### K5. Tests must never touch the production quota ledger

`logs/sharp_budget.json` is the real daily odds-call ledger. A mock client
constructed WITHOUT `budgetPath` writes to it and corrupts the real count.
Every test client MUST pass a temp `budgetPath` AND `preReserved`. Verify with:
`stat -f "%m" logs/sharp_budget.json` before/after a test run — the mtime must
not change. (`test/run-cross-category-card-unwrap.test.js` asserts this.)

### K6. `~/Projects/kalshi-edge` is NOT a git repository

`git status` exits 128 there. Do not assume a diff/branch exists; use file
copies and the `*.bak.<timestamp>` convention already used in that project.

### K7. Recurring delivery days (owner decision 2026-11-16)

Cron `fb3c356dbddf` = `45 8 * * 0,1,4,6` (Sun, Mon, Thu, Sat) in
`America/Los_Angeles`. Reports are NOT produced Tue/Wed/Fri.

## L. Deck headline copy (owner decision 2026-11-16)

**The headline says WHAT THE REPORT CONTAINS; the sub-line says HOW READY IT IS.**

Owner instruction (verbatim): *"this doesnt make sense on the header that says this
- no good bets today. we should change that and say - here are the bets for today"*.

A deck that lists 10 priced games, 3 watch-list picks and 2 combos must not open
with "No good bets today" — the banner contradicted its own content.

Four outcomes, in both `src/pptx-card.js` (`buildCardModel`) and `src/plain-card.js`
(`renderPlainCard`):

| Condition | headline | sub / next line |
|---|---|---|
| `scan_blocked` | `The check could not run today.` | unchanged |
| `failures.length` | `The check did not finish. Do not bet today.` | unchanged |
| `good.length > 0` | `Here are the bets for today.` | `N of them look good. Check the price again right before you buy.` |
| `good === 0 && watch > 0` | `Here are the bets for today.` | `None are ready to bet yet. The price is about fair, so keep your money for now.` |
| neither | `No bets to show today. Keep your money.` | `Nothing came close today.` |

### L1. Why the fail-closed branches were NOT reworded

"Here are the bets for today" is only true when the scan COMPLETED. A blocked or
failed scan must keep its own headline — the existing rule "a failed or blocked
scan NEVER reads 'here are the bets for today'" is now an explicit test
assertion, not just a convention.

### L2. "Here are the bets" is a pointer, not a recommendation

Every pick keeps its own status pill, its "price is about fair" reason, and the
footer "Nothing was bet for you. You decide." The banner points at the content;
the sub-line and the per-pick rows carry the verdict.

### L3. `render-card-slide.js` IS a faithful re-render (FIXED 2026-11-16, card t_4573f0f1)

**Historical bug (now fixed):** the zero-API re-render path composed a DIFFERENT
card than the runner, and had no `require.main === module` guard, so
`require()`-ing it FIRED a render that overwrote the delivered deck
`logs/cards/kalshi-daily-picks-<stamp>.pptx` (incident 2026-11-16):

| | runner (what ships) | `render-card-slide.js` (OLD) |
|---|---|---|
| candidates | `top10.slice(0,3)` | `core + aggressive` |
| research_candidates | core+aggressive+stale_research_only+**no_edge** | `stale_research_only` only |
| + noOddsResearch | present | **missing** |
| `mergeScan` scanner-row enrichment | present | **missing** |

**The fix — one composition module, two callers.** `src/card-composition.js` is
now the single source of truth (`buildCardRenderInputs()` + `composeCardInputs()`).
The runner AND the re-render both call it, so the drift is gone by construction,
not by keeping two copies in sync.

### L3.1. The receipt must carry what the card needs

The leaderboard receipt DROPS fields the card consumes (YES-side fair, market
status, source gates). The runner therefore persists a `card_render_inputs` block
(schema `card_render_inputs.v1`) into the receipt: the scanner rows, the
research-only-no-odds rows, the coverage lines, the operator-alert verdict and a
render clock derived from the receipt stamp itself. **If you add a field the card
reads, add it to `MERGE_FIELDS` in `src/card-composition.js` — otherwise the
re-render silently loses it.**

### L3.2. Re-render safety rules (standing)

- `require.main === module` guard: importing the script NEVER renders and NEVER writes.
- The re-render SELF-CHECKS its bottom line against the shipped plain-text card and
  REFUSES to write a deck that disagrees. A refusal is the correct behaviour — do
  not "fix" it by removing the check.
- Default output is `...-<stamp>-rerender.pptx`, so a delivered artifact is never
  overwritten. `--out <path>` chooses a destination; `--force` replaces a file.
  Never pass `--force` at a delivered-artifact path.
- Receipts written BEFORE 2026-11-16 have no `card_render_inputs` and cannot be
  re-rendered faithfully. The script then RE-USES the delivered artifacts for that
  stamp (and says so on stderr) instead of shipping a differently composed card.
  A legacy stamp with no delivered artifact requires a fresh scan.

### L3.3. Verified fidelity (2026-11-16, real artifacts, not fixtures)

Fresh read-only scan stamp `2026-11-16T21-43-58` → re-render from that receipt:
page1 PNG SHA256 **identical** to the runner's page1 PNG, page2 PNG SHA256
**identical**, unzipped `ppt/slides/slide1.xml` and `slide2.xml` **byte-identical**
(only `docProps/core.xml` carries a render timestamp). The runner's previously
delivered decks (`21-12-11`, `19-14-03`) stayed byte-identical throughout.

**Rule of thumb:** to change deck COPY, change the renderer and do a fresh run.
To RE-SHOW an existing report (no API calls), `node scripts/render-card-slide.js`
is now safe and faithful.
