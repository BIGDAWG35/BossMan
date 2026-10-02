**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/trading-ops/Crypto Trading Intelligence — Project Decisions — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Crypto Trading Intelligence — Project Decisions
**Version:** v3.1 (refined 2026-07-20 to reflect current Binance bot state, Risk-OS V3, and Phase 6 Track B health-monitoring changes)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
## Original title

_Project Decisions — Crypto Trading Intelligence (CSDAWG 2.0)_

## Decisions baked into the engine (from the harvested design docs)

### D-01: Regime classifier uses 4 indicators, not a single signal
- **Source:** `designs/CRYPTO_INTEL_ENGINE_SPEC.md`
- **Decision:** Regime = MID_CYCLE / BULL / BEAR / CHOP, classified by combining BTC 200d SMA position + 50d/200d cross + drawdown from ATH + momentum 90d.
- **Why:** A single indicator (e.g., death cross) produces too many false regime changes. Four indicators voting together reduce noise.
- **Confidence score:** 0.0–1.0, where < 0.5 = UNCERTAINTY (cautious posture advisory).

### D-02: INTEL_GATE is the only integration point between engine and bot
- **Source:** `designs/CRYPTO_INTEL_INTEGRATION_PLAN.md`
- **Decision:** Engine produces advisory output; bot reads only `intelligence.json` for `regime` and `regime_confidence`. Intelligence never receives execution data.
- **Why:** Clear separation: engine = analysis, bot = execution. One-way data flow prevents execution noise from corrupting intelligence history.
- **Verification:** `intelligence.json` does not contain trade data, balance data, or position data. Bot does not write back to `crypto-intel/`.

### D-03: Execution advisory is shadow-mode (non-binding)
- **Source:** `designs/CRYPTO_INTEL_INTEGRATION_PLAN.md`
- **Decision:** `execution_advisory.advisory_mode = "shadow"`, `non_binding = true`. The advisory is observational only — does not change `regime_label`, `INTEL_GATE`, or bot behavior.
- **Why:** The engine is research-quality, not production-quality for execution. Shadow mode lets us validate the advisory's value over time before wiring it.

### D-04: Predictions are graded 7 days after report date
- **Source:** `designs/CSDAWG_REVIEW_CYCLE.md` + `csdawg-prediction-grader.js`
- **Decision:** Every prediction (posture, funding_regime, btc_direction, sector_outperform) is logged with `horizon_days`. The grader runs 7 days later and scores the outcome.
- **Why:** Track record is the only way to know if any of this is useful. As of 2026-06-08, 10 predictions logged, 0 resolved (all still pending) — this is acknowledged in `learning_notes.prediction`.

### D-05: Engine outputs are advisory-only, never automatic
- **Source:** `designs/CRYPTO_INTEL_ENGINE_SPEC.md` + the live `intelligence.json` schema
- **Decision:** Every output is labeled "Advisory Only", "Observation Only", "Shadow Mode", or "Non-Binding". The engine never sends a Telegram message, never triggers a trade, never modifies bot config.
- **Why:** The engine is a research instrument, not a control system. Even when its track record improves, the contract stays one-way.

### D-06: Weekly cadence, not daily or hourly
- **Source:** `designs/CRYPTO_INTEL_WEEKLY_TEMPLATE.md`
- **Decision:** One intelligence report per week (Sunday afternoon via cron). (2026-10-02 note: still true for the CSDAWG engine; a separate daily Binance decision pipeline — Hermes cron 2141a756a0aa, 17:10 PT, free models only — now exists, see 'Binance Bot - Current State.md'.)
- **Why:** Daily reports produce noise. Hourly reports are unmaintainable. Weekly is the right cadence for "regime + sector + ranking" thinking.

### D-07: Memory tagging uses [TRADING][CRYPTO][CSDAWG] triple
- **Source:** `designs/CRYPTO_INTEL_MEMORY_RULES.md`
- **Decision:** Every memory chunk related to crypto is triple-tagged `[TRADING] [CRYPTO] [CSDAWG]` so the model router and retrieval system can find them.
- **Why:** Three orthogonal axes: domain (trading), asset class (crypto), project (CSDAWG). Single-axis tags lose context.

### D-08: Question bank uses A-H series, time-boxed
- **Source:** `designs/CSDAWG_QUESTION_BANK.md`
- **Decision:** A = weekly, B = twice-monthly, C = monthly, D = event-driven, E = ad-hoc, F = leading indicators, G = strategy, H = risk events.
- **Why:** Time-boxed review cadence prevents analysis paralysis and makes review completion measurable.

### D-09: Audit-driven unification (2026-06-13)
- **Source:** This audit, plus Marcelo's 2026-06-13 decisions
- **Decision:** Move the 12 design docs from CLAW-Backup into this project folder; archive the rest of CLAW-Backup as cold storage; archive coinbase-bot, provider-balance-dashboard, fresh-dashboard; init git in csdawg-dashboard and trading-control; replace Obsidian stub SETUP.md files with live engine pointers; add LEARNED_CRYPTO_INTELLIGENCE.md; create parent kanban card.
- **Why:** Two parallel systems is failure-mode. One unified system with the live engine + the design canon + the operational code is the right end state. Archive is recoverable, not destructive.

## Open decisions (awaiting Marcelo or future work)

### OD-01: Phase 12 — live trading (PAPER → LIVE) revisit

- Bot transitioned to **LIVE mode (PAPER_MODE=false) on 2026-06-15** as a **Marcelo explicit carve-out**. INTEL_GATE remains wired. (Supersedes prior "stay paper until track record justifies" guidance — see L-CRYPTO-10 v3.1 for the reframed rule.)
- Trade-off (updated 2026-07-20): bot is LIVE but **balance has crashed** from $128.05 (2026-06-15) to **$0.18** as of 2026-07-13 — bot cannot fire trades (balance < $75 `MIN_TRADE_NOTIONAL` floor). See `WEEKLY_REVIEW_2026-07-13.md` §5. Marcelo-only decision remaining: fund the account or reset to PAPER. (history — superseded 2026-10-02: binance-bot-live (Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval, $250.59 free USDT at start; see Trading Ops 'Binance Bot - Current State.md')
- Recommendation: keep LIVE while the carve-out is in force; resolve the funding question before any new trades fire.

### OD-02: Coinbase bot — keep or kill?
- Archived 2026-06-13 to `~/archive/2026-06-13-projects/coinbase-bot/`. Recoverable, not deleted.
- Trade-off: redundancy across exchanges vs. operational complexity. Recommendation: keep archived; revisit if Binance.US has API issues.

### OD-03: Kraken bot — revive or archive?
- Blocked since 2026-05-20 on auth issues. The recovery notes in `designs/Trading — Kraken + CSDAWGBOT Weekly Review Recovery.md` document the fix path.
- Trade-off: more pairs for sector rotation vs. fixing what works first. Recommendation: keep blocked; revisit after Phase 12.

### OD-04: 6 blocked crypto-track cards — what to do with each?
- Regime framework, signal classification, 4-cycle analysis, pre-trade hook, curriculum, monitor rebuild.
- All under parent card `t_unify_crypto_knowledge_20260613`. Marcelo to triage.

### OD-05: Engine version (currently 1.8) — when to bump to 2.0?
- Bump criteria: 6+ weeks of resolved predictions with track record > 0% accuracy.
- Currently 0 resolved (10 pending). Bump not yet justified.

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Area | Before (v3.0, 2026-06-16) | After (v3.1, 2026-07-20) |
|------|---------------------------|--------------------------|
| Frontmatter | v3.0 / 2026-06-16 | v3.1 (refined) / 2026-07-20 |
| OD-01 | "Bot is in PAPER mode... Next go-live decision pending" | Bot **LIVE since 2026-06-15** (Marcelo carve-out, see L-CRYPTO-10 v3.1). Open question is funding the $0.18 balance, not go-live |
| PAPER framing | Bot expected to stay in PAPER until track record | Reframed: PAPER is now the **fallback**, not the default — but only Marcelo can flip back |
| Risk floors | Implicit | Cross-linked to `memory-trading-intelligence.md` for explicit numbers: 3.5%/trade, 30% exposure, 6% daily loss, **MIN_TRADE_NOTIONAL=75** (history — superseded 2026-10-02: v2 sizing 2026-10-01 = 3% risk per trade at the stop, MAX_EXPOSURE_PCT=1.0 (100% of equity), 6% daily loss stop, $75 is a floor not a cap, up to 4 positions, 8 trades/day) |
| D-01..D-09 decisions | Unchanged | **Unchanged** — design decisions are durable, not time-bound |
