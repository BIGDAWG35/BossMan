# Project Decisions — Crypto Trading Intelligence (CSDAWG 2.0)

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
- **Decision:** One intelligence report per week (Sunday afternoon via cron).
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
- Bot is in PAPER mode. INTEL_GATE is wired. Marcelo's previous go-live was 2026-05-21/22 (then bug → STOPPED). Next go-live decision pending.
- Trade-off: more data vs. more risk. Recommendation: stay PAPER until 6+ weeks of live-quality prediction grades are available (currently 0 resolved).

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

### D-12: DAILY-RADAR research path = internal derivation (locked 2026-06-19)
- **Source:** Empirical Stage 2 work on 2026-06-19 (Brave 429, CUA dead, no API by design)
- **Decision:** Stage 2 Phase B primary path is **internal derivation** from Stage 1 + Stage 3 outputs. External sources (`perplexity_browser_qa`, `brave_search_degraded`) are first-attempted and gracefully fall back. `research_quality` is honestly labelled `PARTIAL` when internal-only — never `OK` unless external fetch succeeded.
- **Why:** Spec said "Perplexity Browser QA primary". Reality: CUA daemon dead, Brave rate-limited, API forbidden by locked rule. The honest ceiling is PARTIAL until external research is viable.
- **Trust contract:** No fabrication. External dimensions marked `null` with `source: bot_internal_only` tag. DeepSeek downstream correctly reasons about partial research.

### D-13: Two-layer USDT-symbol sanitization (locked 2026-06-19)
- **Source:** Failure 4 in `STAGE_2_7_CAPTURE_2026-06-19.md`
- **Decision:** Both producer (`daily_memo.js`) and consumer (`daily_decision.js`) enforce `^[A-Z0-9]{2,15}USDT$` regex on `do_not_touch` and `watchlist`. Invalid entries dropped silently with stderr warning.
- **Why:** Defense in depth. DeepSeek can emit sentence fragments for symbol lists. Without sanitization, the bot's decision file would contain malformed data.
- **Trust contract:** Bot never reads a malformed symbol from `data/daily_radar.json`.

### D-14: Cron delivery = origin (silent on healthy) (locked 2026-06-19)
- **Source:** Marcelo's "no Telegram spam" directive (recurring)
- **Decision:** Daily pipeline cron `2141a756a0aa` uses `deliver: origin` but the prompt is structured to only emit on **real** failure or degraded-mode event. Healthy runs are silent.
- **Why:** Spec said "geen nieuwe Telegram". Silent-when-healthy is the operational equivalent of `deliver: local` without losing the audit trail.
- **Verification:** First run (2026-06-19 13:04) emitted nothing to Marcelo.
