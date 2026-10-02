**Version:** v4 · **Date:** 2026-10-01 · **Status:** Current — space-only doc: this copy is the canon (edit here)

# Binance Bot — Current State (2026-10-01)

Binance bot (binance-bot-live, Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval. Paper mode is off. Free USDT at start: $250.59.

## Binance bot — live configuration (2026-10-01)

| Rule | Value |
|---|---|
| Minimum order | $75 is the LOWEST trade, not the size. Trades are sized up to what the setup and cash allow; no trade if free cash < $75 |
| Risk per trade | 3% of equity at the stop (stop-distance sizing) → max loss about $7.50 at $250 |
| Max exposure | 100% of equity (MAX_EXPOSURE_PCT=1.0). Spot only, no leverage on Binance.US, so cash is the real ceiling |
| Profit floor | Expected net profit at the +6% target must be ≥ min($15, 4% of equity) → $10 at $250, $15 from $375 equity up |
| Open positions | Up to 4 at once (MAX_OPEN_POSITIONS), each ≥ $75, limited by cash |
| New trades per UTC day | 8 max (MAX_TRADES_PER_DAY) |
| Fees | Binance.US 0% maker / 0.02% taker (about $0.10 round trip on $250) |
| Daily loss stop | 6% → no new entries until next UTC day |
| Losing streak | consecutive-loss cooldown breaker |
| Equity kill-floor | $190 → no new entries + Telegram alert; a human clears it |
| Exits | stop at support × 0.99, trailing stops, target +6%, hard take-profit +15% |
| Entry setup | 1H uptrend + 15m pullback + RSI gate, inside the price window |

## Daily brain (all free models)
- Pipeline (Hermes cron 2141a756a0aa, 17:10 PT = just after UTC rollover): census → free news research (Google News RSS + Fear & Greed, all 15 bot pairs + radar top 10) → pair briefs → memo (MiniMax M3 → Ollama qwen3.5:35b-a3b-nvfp4 → qwen2.5:7b) → daily decision → BossMan decision artifact (stage 6).
- No paid model in the pipeline (paid DeepSeek removed from memo and briefs). Perplexity browser research is opt-in only (PERPLEXITY_BROWSERQA_ENABLED=1).
- Low market confidence no longer freezes everything: clean WARM/HOT coins with real research qualify at Tier 1 ($75) ("low_conf_pilot"); research MISSING still means watch only. Turn off with LOW_CONFIDENCE_PILOT=0.

## Learning loop
- Weekly (Sun 18:00 PT, script only, zero AI cost): scripts/weekly_learning_review.js reads closed trades (30 days) → data/learning_adjustments.json + ~/.hermes/knowledge/crypto-intel/learning/LEARNING_REVIEW_<date>.md.
- A symbol with ≥3 closed trades, win rate < 34% and net loss is blocked for 7 days (bossman_decision.js applies it). Negative expectancy over ≥6 trades raises an advisory flag; risk settings never change automatically.

## Bugs fixed 2026-10-01
- Research always empty: macOS has no `timeout`; symbol names carried ".prompt"; Intel python3 leftovers; the internal fallback wrote nothing; finalize labelled zero results as "OK".
- Qualify gate read per_coin as a map, but the artifact is a list, so every live signal would have been blocked ("per_coin_missing").
- The decision artifact went stale for about 21 hours a day (pipeline local-dated, decision built at 14:00 PT, gate requires today's UTC date).
- With a 30% exposure cap, any small loss pushed the max order below $75 and the bot could never trade again.
- MAX_TRADES_PER_DAY was defined but not used. The daily-loss alert said "-3%" (the real limit is 6%). A float-equality bug skipped orders sized exactly at the cap.
- 2026-10-01 07:xx: v2 sizing ($75 floor not cap, equity-based exposure, profit floor, up to 4 positions, 8 trades/day); internal balance now tracks cost at open/close (no more divergence pause after each trade).
- closeTrade never sold on the exchange (paper-era code); fixed with liveMarketSell + live-exit tests, orphan AVAX liquidated (per canon LEARNED_BINANCE_SIZING_V2.md).
- Tests: 182 pass / 0 fail on the Mac (memo and pipeline tests rewritten for the free chain).

## Operating notes
- Standing approval (Marcelo, 2026-10-01 07:00 PT): BossMan and sub-agents may buy, sell and restart the bot without asking, as long as no trade is under $75. The approval record has `STANDING: YES-MARCELO` and does not expire; delete it to revoke.
- Autorestart is still off in PM2 (a crash stays down until BossMan's monitor restarts it, so crash loops can't burn money).
- Backups of every changed file: ~/backups/binance-golive-20261001/before/.

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
