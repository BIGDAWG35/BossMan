# Project Timeline — Crypto Trading Intelligence (CSDAWG 2.0)

## 2026-04 (foundation phase — CSDAWG 1.0 era)

- **2026-04-04** — `CSdawgbot.md` written: role definition for CSdawgbot as crypto markets specialist, locked in.
- **2026-04-25** — `CSDAWG_QUESTION_BANK.md` and `CSDAWG_REVIEW_CYCLE.md` written: review cadence + A-H question series.
- **2026-04-25** — `learn/CRYPTO_TRADING_GUIDE.md`, `CRYPTO_QUICK_REFERENCE.md`, `CRYPTO_TRADING_JOURNAL.md` written (early learning material; not part of the 12-doc harvest).
- **2026-04-26** — First weekly strategy review notes drafted.
- **2026-04-29** — Performance cleanup notes written.

## 2026-05 (design → implementation)

- **2026-05-20** — `CRYPTO_INTEL_ENGINE_SPEC.md`, `CRYPTO_INTEL_INPUTS_2026-05.md`, `CRYPTO_INTEL_INTEGRATION_PLAN.md`, `CRYPTO_INTEL_MEMORY_RULES.md`, `CRYPTO_INTEL_WEEKLY_TEMPLATE.md` written. CSDAWG 2.0 design phase complete.
- **2026-05-20** — `Trading - CSDAWGBOT Weekly Strategy Review.md` workflow spec written.
- **2026-05-20** — `Trading — Kraken + CSDAWGBOT Weekly Review Recovery.md` — Kraken auth recovery notes.
- **2026-05-20** — `BINANCE_BOT_AUDIT_2026-05.md` — 480-line deep audit of the binance bot.
- **2026-05-20** — First intelligence report `CRYPTO_INTEL_2026-05-20.md` published (3.2 KB, now historical baseline).
- **2026-05-21** — Phase 9B: CSDAWG 2.0 cron goes live. `csdawg-history-analyzer.js` and `csdawg-prediction-grader.js` written. First cron-generated `intelligence.json` (2026-05-21) shipped to `history/2026/`.
- **2026-05-21/22** — **Phase 11B LIVE go-live.** `binance-bot` switched to `PAPER_MODE=false`, `INTEL_GATE_ENABLED=true`. `INTEL_GATE` wired to read `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`. The 985-ReferenceError TDZ bug fixed (commit `a5e8550`). Balance synced $190 → $128.05.
- **2026-05-25** — Second weekly cron run. Report archived.
- **2026-05-30** — Permanent reliability package shipped (RELIABILITY_REPORT.md, safe-start.js, restart-health-check.js, RUNBOOK.md).

## 2026-06 (live + audit)

- **2026-06-01** — Third weekly cron run. Report archived.
- **2026-06-08** — Fourth weekly cron run. Latest report: regime `MID_CYCLE`, confidence `0.45`, funding `NEGATIVE` (164 weeks), death cross active 245w. BTC at $63,527, -49.6% from ATH. Fear & Greed 27.
- **2026-06-08** — `csdawg-dashboard` API serving all 4 prior history snapshots + current.
- **2026-06-13** — **AUDIT.** Two parallel crypto systems identified. Decision: unify. 12 design docs harvested from CLAW-Backup, archived projects moved to `~/archive/2026-06-13-projects/`, git initialized in `csdawg-dashboard` and `trading-control`, `LEARNED_CRYPTO_INTELLIGENCE.md` added to `~/.hermes/knowledge/`, parent kanban card `t_unify_crypto_knowledge_20260613` created with 6 blocked cards linked as children.
- **2026-06-13 (future, after this audit)** — All 3 storage layers in sync. Engine continues running. 6 blocked cards triaged by Marcelo.

## Open timeline events

- **TBD** — 6 blocked crypto-track cards reopened and triaged: regime framework, signal classification, 4-cycle analysis, pre-trade hook, curriculum, monitor rebuild.
- **TBD** — Phase 12: live trading review (currently PAPER mode, pending Marcelo's next go-live decision).
- **TBD** — Coinbase bot retirement (already archived 2026-06-13).
- **TBD** — Kraken bot integration (paused since 2026-05-20, blocked on auth issues — see `Trading — Kraken + CSDAWGBOT Weekly Review Recovery.md`).

- **2026-06-19 (DAILY-RADAR)** — Stage 2 (Perplexity enrichment) + Stage 7 (cron + logging) shipped:
  - 13:00 — `daily_research.js` extended with internal-derivation fallback (Brave 429, CUA dead)
  - 13:01 — `daily_memo.js` source labelling fixed (DeepSeek was being lied to)
  - 13:02 — `daily_decision.js` strict USDT-symbol regex replaces lenient `cleanSym`
  - 13:03 — `daily_pipeline.sh` wrapper created with JSONL run log
  - 13:04 — Full end-to-end run: 8/8 stages ok (1 degraded fallback), 13.0s total
  - 13:05 — Cron `2141a756a0aa` registered at `0 12 * * *`, next run `2026-06-20T12:00:00-07:00`
  - 13:06 — Knowledge capture (`~/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md`)

**Critical incident during QA:** DeepSeek emitted `"MEMECOINS WITH LOW VOLUME AND HIGH VOLATILITY (E.G., SPXUSDT, 1000MOGUSDT)USDT"` as a single string in `do_not_touch`. Caught by BossMan. Fixed with two-layer sanitizer (memo producer + decision consumer).
