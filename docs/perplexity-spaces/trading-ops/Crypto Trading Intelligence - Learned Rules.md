**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

**Version:** v5 (rebuild) · **Date:** 2026-10-02 · **Owner:** BossMan (edits via knowledge-canon lane; rule content from Trading lane) · **Status:** Canon — the single source for crypto trading intelligence. Space copies are built from this file; do not edit them directly.

# LEARNED_CRYPTO_INTELLIGENCE.md

Home path (Mac): `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`. Backup mirror: `~/Repos/BossMan/docs/crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md`.

**How numbers are marked**
- **[code]** checked in `binance-bot` source (copy dated 2026-10-02).
- **[data]** checked in `binance-bot/data/*` or `crypto-intel/*`.
- **[env]** a 2026-10-02 operator fact about `.env` / PM2. The `.env` file is not in the copy, so the code default is shown next to it.
- **[unverified]** claimed in docs, but no code or data proves it.

---

## 1. Purpose

This file holds the rules for how Marcelo's crypto intelligence feeds the live Binance.US spot bot. It also says who owns each part and where each part lives. Intelligence gives advice and the bot executes trades. Only gates that read files connect the two. Intelligence never sends orders.

**Current state (2026-10-02):** `binance-bot-live` has been LIVE on Binance.US SPOT since 2026-10-01 02:01 PT, with Marcelo's written approval. It started with $250.59 free USDT [unverified: from docs; balance_log shows $248.47 after the first trade, data]. It runs on port 8104 [code default] and binds 127.0.0.1 [code]. PM2 autorestart is off on purpose [code: `autorestart:false`, `max_restarts:0`]. The pipeline uses only free models: MiniMax-M3 → Ollama qwen3.5:35b-a3b-nvfp4 → qwen2.5:7b [code: `scripts/_llm_free.js`]. LBC35/OpenClaw was retired on 2026-09-30.

## 2. Pipeline (daily)

```
weekly engine (regime) ─┐
daily radar (census) ───┼─> pair briefs ─> research ─> memo ─> daily decision ─> BossMan decision artifact ─> bot gates ─> order
                        └─ learning_adjustments (weekly, from closed trades) ─────────┘
```

| Step | What it does | Script / file | Model |
|---|---|---|---|
| 0. Weekly engine | BTC regime + coin bands + predictions | `~/.hermes/scripts/crypto-intel-weekly.js` → `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (+ `history/YYYY/`) | mechanical; analyst view must be free models only |
| 1. Daily radar (census) | Scores Binance.US USDT pairs. Bands: HOT ≥0.80, WARM 0.55–0.79, WATCH 0.40–0.54, COLD <0.40 | `scripts/daily_census.js` → `data/daily_radar.json`, `crypto-intel/daily/DAILY_RADAR_10_<date>.json` | none |
| 2. Pair briefs | One brief per bot pair (15) | `scripts/daily_pair_brief.js` → `data/pair_briefs.json` | free chain |
| 3. Research | Free news (Google News RSS + Fear & Greed). Perplexity browser only if `PERPLEXITY_BROWSERQA_ENABLED=1`. Quality is OK, PARTIAL or MISSING | `scripts/daily_research.js` | none / opt-in |
| 4. Memo | Daily synthesis | `scripts/daily_memo.js` → `crypto-intel/daily/DAILY_MEMO_<date>.md/.json` | free chain [code] |
| 5. Daily decision | Watchlist ≤3, do-not-touch ≤3 | `scripts/daily_decision.js` | none |
| 6. BossMan decision | Gives each coin QUALIFY / WATCH_ONLY / DENY, plus tier and class. Applies the learning blocks | `scripts/bossman_decision.js` via `bossman-cron.sh` → `data/bossman_decision.json` + dated copy | none |
| 7. Bot gates (each 5-min cycle) | Intel gate (price window + regime + band) → BossMan gate (fail-closed) → qualify gate (class×tier, regime×tier) → pre-trade hook → sizing → $75 execution floor | `server.js`, `scripts/_intel_price_window.js`, `scripts/_bossman_decision.js`, `scripts/_qualify_integration.js`, `~/Projects/trading-review/pre-trade-hook` | none |

Runner: `scripts/daily_pipeline.sh`. It dates every run in UTC [code], and stage 6 calls `bossman-cron.sh` [code]. If a stage fails, the pipeline logs it and keeps going. MISSING research means the coin is watch-only.

Low-confidence pilot: clean WARM/HOT coins with real research can still QUALIFY at Tier 1 (`low_conf_pilot:T1`). It is on by default, and `LOW_CONFIDENCE_PILOT=0` turns it off [code].

## 3. Learned rules (one current wording each)

**L-CRYPTO-01 — The live engine is the truth, not the design docs.** For questions like "what's the regime?" or "can the bot trade?", read `weekly/latest/intelligence.json` and `data/bossman_decision.json`. The CLAW-Backup design docs are frozen history from 2026-05-20.

**L-CRYPTO-02 — Intelligence reaches the bot only through read-only gates.** The bot reads `regime` and `coin_rankings[].band` from `intelligence.json` [code: `regime_confidence` is *not* read]. It also reads `data/daily_radar.json`, `data/pair_briefs.json` and `data/bossman_decision.json`. The bot never writes to `crypto-intel/`.

**L-CRYPTO-03 — Advisory-only.** Engine and pipeline output never places, sizes or changes a trade, and never edits `.env`, PM2 or bot config. A gate may only *block*. The engine's one outbound message, a once-per-report Telegram alert digest (`alert-delivery.js`), is the only exception [unverified whether still active].

**L-CRYPTO-04 — Predictions need a track record before they carry weight.** Treat engine predictions as exploratory until there are ≥10 *scorable* resolved predictions over ≥6 weeks with accuracy >0%, and `regime_confidence` >0.6 on ≥50% of reports. Status on 2026-09-28 [data]: 52 tracked, 36 scored, **3 hits, 1 miss, 32 unscorable**, 16 pending. **Not met.** The engine stays at v1.8.

**L-CRYPTO-05 — The CSDAWG engine runs weekly.** Do not make the regime engine daily or hourly. Daily work belongs in a separate engine, which today is the daily radar pipeline (section 2). Observed engine run: Mondays about 15:00 PT (22:00 UTC) [data: `history/2026/*` `generated_at`].

**L-CRYPTO-06 — Tag crypto memory with [TRADING][CRYPTO][CSDAWG].** Use all three tags, every time.

**L-CRYPTO-07 — Use the A–H question bank, not ad-hoc questions.** A weekly, B twice-monthly, C monthly, D event, E ad-hoc, F leading indicators, G strategy, H risk. Bank file: `designs/06_CSDAWG_QUESTION_BANK.md` [unverified path].

**L-CRYPTO-08 — Cold storage never destroys anything.** Archive to `~/archive/<date>-<reason>/` and leave a redirect note. Never run `rm -rf` without Marcelo's approval.

**L-CRYPTO-09 — Two parallel systems is a failure.** When two systems cover the same domain, merge them into the live one. Use the 8-step pattern: audit → pick the live one → harvest with SHA-256 checks → move → sync to GitHub → cold-storage the orphan → write LEARNED → open a parent card. *This rebuild applies L-09 to the doc copies of this file.*

**L-CRYPTO-10 — Only Marcelo changes the bot's money mode.** LIVE↔PAPER changes only on Marcelo's written directive. That means an approval record in `~/.hermes/knowledge/approvals/binance-live-approval-*.md` [code: 7-signal LIVE gate in `pre-start.js`]. No agent flips the mode on its own, in either direction (code enforcement is L-CRYPTO-20). The prediction track record (L-04) is advisory input only. Marcelo waived it for the 2026-10-01 go-live. **Current: LIVE since 2026-10-01 02:01 PT.** The standing approval (2026-10-01 07:00 PT, `STANDING: YES-MARCELO`) lets BossMan and sub-agents buy, sell and restart without asking, as long as no trade is under $75. It does not expire [code: `isStandingApproval`]. Deleting the record revokes it.
> *Conflict resolved 2026-10-02.* The trading-ops copy said "LIVE since 2026-06-15 carve-out, balance $0.18". The knowledge-learning copy said "PAPER". The evidence supports neither as current state:
> - `bot.db` has no trades between 2026-05-12 and 2026-10-01 [data].
> - `mode_transitions` is empty [data].
> - The first LIVE signal-journal row is 2026-08-23 [data].
> - `balance_log` jumps from $127.08 (2026-05-12) to $248.47 (2026-10-01) [data].
>
> So the 06-15 "LIVE" was a config flag with no funded trading. The $0.18 figure cannot be checked against bot data. Real-money trading started 2026-10-01. The wording above keeps the part both copies agreed on (Marcelo-only mode change) and drops the dated state.

**L-CRYPTO-11 — Every live PM2 service needs git.** The check is `git log --oneline -1`. The BossMan repo is the home. Current compliance for `binance-bot`, `csdawg-dashboard` and `trading-control` is [unverified].

**L-CRYPTO-12 — Blocked strategic cards are waiting for triage, not abandoned.** Bring them to Marcelo as one decision. These are the 6 crypto-track cards under `t_unify_crypto_knowledge_20260613`. *Note: `bossman_decision.js` cites "L-CRYPTO-12" for the fixed strategy-class set. That is a mis-cite. The class set belongs to L-CRYPTO-15.*

**L-CRYPTO-13 — In the curriculum, "done" starts the next task.** When a sub-task is marked done: set done, harvest lessons, mirror, start the next sibling, and confirm to Marcelo within about 30 s. Don't ask "which task?" when only one is running. Stage state after 2026-06-13 is [unverified].

**L-CRYPTO-14 — Each day starts from one BossMan decision artifact, and it never holds a sub-$75 coin.** `data/bossman_decision.json` is the only per-coin daily decision. The artifact carries `l_crypto_rule: "L-CRYPTO-14"` and `floor_audit.min_notional_usd: 75` [code + data]. *(Rebuilt from code; no earlier doc text exists.)*

**L-CRYPTO-15 — The artifact is valid or it is not written.** All of these must hold:
- universe = the 15 bot PAIRS
- watchlist ≤3 and do-not-touch ≤3, with no overlap; do-not-touch only from PAIRS
- tier ∈ {T1 conservative, T2 base, T3 aggressive}
- regime ∈ the valid set
- strategy class ∈ {scalper, swing, position, hedge}
- the schema validates

On any failure, nothing is written and the previous file stays [code].

**L-CRYPTO-16 — The bot reads the decision fail-closed.** It blocks a coin when:
- the file is missing (BOSSMAN_FILE_MISSING)
- the schema is bad (BOSSMAN_SCHEMA_INVALID)
- the date is not today in UTC, or the file is more than 24 h old (BOSSMAN_STALE)
- the coin is not in the artifact (SYMBOL_MISMATCH)
- the decision is DENY or WATCH_ONLY

It allows only QUALIFY [code].

**L-CRYPTO-17 — The $75 floor is enforced at execution too.** `executeTrade` rejects any final rounded order under $75 (EXECUTION_FLOOR_BELOW_75). It never rounds a small trade up to $75. Exits are always allowed [code].

**L-CRYPTO-18 — Strategy class × tier must be legal.** Legal pairs: scalper T1/T2; swing T1/T2/T3; position T1; hedge T1 [code: `_qualify_integration.js`].

**L-CRYPTO-19 — Regime × tier must be legal, and gates only read.** T3 is legal only in MID_CYCLE. RISK_OFF, DISTRIBUTION and UNKNOWN allow T1 only. LATE_CYCLE, EARLY_CYCLE and RECOVERY allow T1/T2 [code]. Gate modules never change the artifact.

**L-CRYPTO-20 — No autonomous PAPER↔LIVE flip, enforced in code.** This is binding only while the qualify gate is wired into `server.js`. If that gate is removed, file a new rule [code comment].

## 4. Risk limits (live, 2026-10-02)

| Limit | Value | Proof |
|---|---|---|
| Minimum trade | $75 floor, not a cap. No entry if free cash < $75 | [code] `MIN_TRADE_NOTIONAL=75`; [env] `LIVE_PILOT_MIN_NOTIONAL=75` (code default 75) |
| Risk per trade | 3% of equity at the stop (stop = support × 0.99) | [code] `MAX_RISK_PCT=0.03` |
| Max exposure | 100% of equity (free USDT + open cost) | [code] default 1.0, hard cap 1.0 |
| **Max single position** | **$200** — the external pre-trade hook rejected 124 signals on 2026-10-01 16:32–23:57 UTC ("exceeds max $200") | [data] signal_journal; hook code not in copy [unverified value today] |
| Open positions | 4 | [env] `MAX_OPEN_POSITIONS=4` (code default 4; the code's display constant still says 3) |
| Per symbol | 1 open position | [code] |
| New trades per UTC day | 8 | [env]/[code] default 8 |
| Daily loss stop | 6% of live equity → no new entries until next UTC day | [code] |
| Loss streak breaker | 3 straight losing closes → pause new entries; auto-resets after 16 h | [code] (the alert text wrongly says "24HR") |
| Equity kill-floor | $190: when free USDT + open *cost basis* < $190, no new entries and an alert; open positions are still managed | [env] `EQUITY_KILL_FLOOR_USD=190`; [code] default 0 = OFF |
| Profit floor | Expected net profit at +6% ≥ min($15, 4% of equity) | [unverified] `.env` 15 / 0.04; [code] default 0 = OFF |
| Exits | Trailing: +5% → stop to entry +0.5%; +9% → +5%; +15% → hard take-profit. Initial stop at support × 0.99 | [code]. **The +6% "target" is only used for R:R and the profit floor. It is not an exit order.** |
| Entry | 1H uptrend + 15m pullback, RSI 32–74 (hard block >80), R:R ≥1.5, price window $0.00000001–$25, BTC/ETH excluded | [code] |
| Fees | 0% maker / 0.02% taker | [code] `TAKER_FEE_PCT` |
| Intel gate | Blocks regime BEAR/EXTREME and bands WATCH/COLD. **Lets trades through when `intelligence.json` is missing (fail-open), and does not check how old it is** | [code] |
| Learning block | ≥3 closes in 30 d, win rate <34% and net loss → coin blocked 7 d. ≥6 closes with negative expectancy → advisory flag only | [code] `weekly_learning_review.js` |
| Universe | 15 PAIRS: XRP DOGE ADA LINK VET AVAX HBAR DOT XLM SUI CAKE PEPE HYPE FET NEAR (all USDT). HYPE is always blocked by the $25 window | [code] |

## 5. Who owns what

| Owner | Owns |
|---|---|
| Marcelo | LIVE/PAPER mode, approval records (standing or revoke), funding, raising or clearing the kill-floor, risk-limit changes |
| BossMan | Only orchestrator and only status surface to Marcelo. Owns the decision artifact contract (L-14..16), the restart monitor, card routing (`route-card.sh`) |
| Trading lane | Bot config and strategy content, Crypto Weekly review content. Money-path code changes go through a paid card (Claude Sonnet 4.6) only |
| Ops lane | PM2 and cron registration |
| Loop-engineering | Cadence, no-spam rules, brief format for recurring loops |
| knowledge-canon | Edits this file and rebuilds the space copies |
| qa-verification | Step-5 verdicts on T1 money-lane cards |
| Builder | Code outside the lanes above. Hosts the Crypto Weekly cron |

## 6. Files and paths (Mac)

- Bot: `/Users/bigdawg/Projects/binance-bot/`. Files: `server.js` (loop, every 5 min), `pre-start.js` (4 modes, 7-signal LIVE gate), `ecosystem.config.cjs` (only `binance-bot-live`), `.env`, `RUNBOOK.md`, `data/bot.db`, `data/*.json`, `scripts/`.
- Pre-trade hook: `/Users/bigdawg/Projects/trading-review/pre-trade-hook`.
- Intelligence: `~/.hermes/knowledge/crypto-intel/` with `weekly/`, `history/`, `daily/`, `learning/`, `alerts/` and the `*.db` files.
- Approvals: `~/.hermes/knowledge/approvals/binance-live-approval-*.md` (standing record: `...-1790863361.md`).
- Related canon: `LEARNED_BINANCE_BOT.md` (safe-start/PM2), `LEARNED_BINANCE_SIZING_V2.md` (sizing), `LEARNED_V3_MODEL_STACK.md` (models), `trading.md` (lane).
- Go-live backups: `~/backups/binance-golive-20261001/before/`.

## 7. Crons

| Job | Schedule | Proof |
|---|---|---|
| Daily pipeline, Hermes `2141a756a0aa` | 17:10 PT | [unverified]: in 2026-06-19 it was `0 12 * * *`. **No 2026-10-02 pipeline output exists. The bot logged 664 BOSSMAN_STALE blocks from 00:02 to 18:02 UTC on 10-02, so it could not trade all day** [data] |
| `bossman-cron.sh` (decision artifact) | about 14:00 PT (21:00 UTC) daily, also run by pipeline stage 6 | [data] cron log (the script comment says `0 14 * * *` = 07:00 PDT, which is wrong) |
| `daily-radar-census` `e579c271698f` (bossman profile) | `0 15 * * 1-5` | inventory; [data] radar written 2026-10-01 22:00 UTC |
| `crypto-intel-weekly.js` | Mondays about 15:00 PT | [data] history timestamps; cron ID [unverified] |
| `csdawg-prediction-grader.js` | weekly | [unverified] |
| Crypto Weekly Learning & Intel Review `ea0157d715fa` (builder) | Sun 18:00 PT, agent | inventory |
| `scripts/weekly_learning_review.js` | Sun 18:00 PT, script only | **pending registration**. Only output so far is the 2026-10-01 manual run [data] |
| Bot health `health-cron-wrapper.sh` | 09:00 / 21:00 PT | [data] 2026-10-02 09:00 PASS. IDs `fed3553cf244` / `4d4552dc85c9` [unverified] |
| PM2 Health Monitor `01dff7ff61e4` (bossman) | every 15 min | inventory. Assumed to be "BossMan's monitor" [unverified] |

## 8. History

| Date | Event |
|---|---|
| 2026-04-22 | First trades in `bot.db` |
| 2026-05-04 | Duplicate-entry race incident (`INCIDENT.md`) |
| 2026-05-20/21 | CLAW-Backup design docs frozen. First weekly engine report (MID_CYCLE 0.45) |
| 2026-05-30 | Reliability package. PAPER_MODE reset to true |
| 2026-06-13 | Merge of the live engine and the design canon. This file created with L-01..13 |
| 2026-06-15 | PAPER_MODE=false "carve-out" in docs. No funded trading followed (see L-10 note) |
| 2026-06-16 | Phase 6 Track B "24/7 online, autostart" policy (later replaced) |
| 2026-06-19 | Daily radar pipeline and Stage 5–7 gates. L-14..20 written into code, never into docs |
| 2026-07-20 | Space docs v3.1 (claimed LIVE / $0.18) |
| 2026-08-24/25 | Safe-start: `binance-bot-live` became the only PM2 app, and the legacy `binance-bot` name was retired |
| 2026-09-27/28 | B-2/B-3/B-7 patches (3% risk, $75 floor not cap, schema compat). 144 signals blocked BOSSMAN_SCHEMA_INVALID |
| 2026-09-30 | LBC35/OpenClaw retired. Health OS deleted |
| 2026-10-01 | LIVE 02:01 PT. Fixes: research, qualify list/map, UTC dating, 30% cap, trades/day, float bug, closeTrade never sold. Sizing v2. First live trade AVAX −$1.85, orphan liquidated. Standing approval 07:00 PT. Kill-floor $190 |
| 2026-10-02 | Ollama fallback moved to qwen3.5:35b-a3b-nvfp4. This canon rebuilt (v5). Rules 14–20 written down |

**Adding a rule:**
1. Check it would still be true in 6 months.
2. Append the next L-CRYPTO-NN (now 21) with rule, why, proof and anti-pattern.
3. Commit the mirror.
4. Rebuild the space copies from this file.
