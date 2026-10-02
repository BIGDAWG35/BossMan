**Version:** v4 · **Date:** 2026-10-01 · **Status:** Current — space-only doc: this copy is the canon (edit here) — this file wins over any older file in this space.

# 00 — Current State (2026-10-01)

## System
- Host: Mac Studio M4 Max, 64 GB, arm64-native (Intel leftovers removed 2026-09-30/10-01; Ollama is a universal arm64 binary).
- Hermes Agent v0.21.5. 9 profiles: default, bossman, builder, content, loop-engineering, ops, qa-verification, trading, travel.
- BossMan is the only orchestrator and the only status surface. Authority: Marcelo → BossMan → sub-agents; reports go back up the same way.
- LBC35 / OpenClaw: RETIRED and removed 2026-09-30. Delegation = BossMan via kanban + `~/.hermes/bin/route-card.sh`. Any LBC35 mention elsewhere is history.
- Control surfaces: Telegram (Macs) and Discord (iPhone/iPad), both via the default gateway (multiplex). Perplexity → BossMan via `~/.hermes/perplexity-intake/` (outbox → inbox).

## Models
| Use | Model |
|---|---|
| Default | MiniMax-M3 (7 profiles; content + qa-verification use M2.7) |
| Content / QA | MiniMax M2.7 |
| Fallback chain (every profile) | M3 lanes: MiniMax-M3 → Ollama qwen3.5:35b-a3b-nvfp4; M2.7 lanes (content, qa-verification): M2.7 → M3 → Ollama qwen3.5:35b-a3b-nvfp4 (~113 tok/s decode, 128K context; since 2026-10-02) |
| Bulk / cheap local | Ollama qwen2.5:7b / qwen2.5:3b — light pinned no-agent jobs only, never the automatic fallback |
| Crons + PM2 jobs | M3 or Ollama only — never paid |
| Build (paid, card only) | OpenAI gpt-5.5 (Codex OAuth again after 2026-10-16) |
| Architecture + money paths (paid, card only) | Claude Sonnet 4.6 |
| QA / review / troubleshooting escalation (paid, card only) | DeepSeek v4-pro |
| Free public research (card lane `research-public`) | Gemini 3.1 Flash-Lite, free tier, 400/day guard — waiting on Marcelo's no-billing key |
| Grok | Skipped |

Paid rules: paid models only through route-card.sh cards; reuse pre-flight first (LEARNED_* docs, BUILD_LIBRARY.md, past cards); every paid card ends with a LEARNED:/ARTIFACT: line; if a paid provider runs out, work drops to M3 then Ollama and keeps going.

## Memory
- memory_char_limit = 3000 in every profile; all MEMORY.md files under cap (QA 2026-10-01). Backups: `~/backups/md-audit-20261001/before/`.

## Services
- 17 PM2 apps online. Travel OS = port 3537 (leave alone). PMD web = 7575 on all interfaces. SquarePayouts (8030) is an ACTIVE revenue project (LEARNED_SQUAREPAYOUTS_ACTIVE.md); the app is in private QA and the process is not running right now. Health OS deleted 2026-09-30. Full table: "Services Map.md" (System Health / Ops Processes / Toolchain).
- Crons: 37 enabled / 44 unique (re-verified 2026-09-30) + new weekly Binance learning review (pending registration, see Trading Ops).

## Binance bot (summary)
Binance bot (binance-bot-live, Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval. Paper mode is off. Free USDT at start: $250.59.

## This space
Binance bot + crypto intelligence + Kalshi. (Go-live summary: see "Binance bot (summary)" above.)

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
- Tests: 182 pass / 0 fail on the Mac (memo and pipeline tests rewritten for the free chain).

## Operating notes
- Standing approval (Marcelo, 2026-10-01 07:00 PT): BossMan and sub-agents may buy, sell and restart the bot without asking, as long as no trade is under $75. The approval record has `STANDING: YES-MARCELO` and does not expire; delete it to revoke.
- Autorestart is still off in PM2 (a crash stays down until BossMan's monitor restarts it, so crash loops can't burn money).
- Backups of every changed file: ~/backups/binance-golive-20261001/before/.

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
