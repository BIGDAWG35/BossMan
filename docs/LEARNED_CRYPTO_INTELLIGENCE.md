# LEARNED_CRYPTO_INTELLIGENCE.md

**Date:** 2026-06-13
**Status:** Permanent — durable rules learned from the CSDAWG 2.0 / Binance bot integration
**Source:** `CRYPTO_TRADING_KNOWLEDGE_AUDIT_2026-06-13.md` + Marcelo's unification decisions

This file encodes patterns that survive individual projects. It is referenced by `OBSIDIAN_VAULT_WORKFLOW.md` as the canonical entry on the crypto / trading domain.

---

## How to add new rules (L-CRYPTO-13+)

The weekly trading-learning review (`weekly-review-template.md` in the project folder) **must** use this file as its reference. When a new lesson is learned:

1. **Threshold test:** Would this lesson still be true in 6 months? If yes, it's a rule. If no, it's a journal entry in `trade-journal/` instead.
2. **Append here** with a new L-CRYPTO-NN number, following the existing format (rule, source, why, verification, anti-pattern where applicable).
3. **Mirror to project folder:** add the same rule to `LEARNED_CRYPTO_INTELLIGENCE.md` in `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/`.
4. **Sync to GitHub backup:** commit to `~/Repos/BossMan/docs/crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md`.
5. **Reference the goal:** tag the new rule with `goal_id: t_goal_crypto_swing_trader_20260613` if it advances the curriculum.

**Current goal:** `t_goal_crypto_swing_trader_20260613` — Become a competent crypto swing trader (12 months).
**Active curriculum stage:** Stage 1 — Chart literacy (4 sub-tasks).
- Stage 1.1 — Chart basics: `done` (2026-06-13)
- Stage 1.2 — Bull/bear structure: `running` (auto-advanced)
- Stage 1.3 — Support/resistance: `todo`
- Stage 1.4 — Moving averages: `todo`

## Current L-CRYPTO rule count

15 (L-CRYPTO-01 through L-CRYPTO-15).

## L-CRYPTO-14: BossMan is the autonomous crypto decision engine (amends L-CRYPTO-03)

**Status:** 2026-06-19 — governance lock. Phase 1 only (canon). Stage 6 + execution wire-up land in a separate, preview-gated pass.

**Rule.** BossMan is the **autonomous decision authority** for crypto within defined boundaries. Subagents and bots are intel producers; BossMan is the decision surface; the trading layer is the executor. The L-CRYPTO-03 "advisory-only" wording is **amended** as follows:

- **Intel layer (subagents + bots):** Scans Binance USDT universe, runs the daily radar / intel pipeline (Stages 1–5), and produces a structured intel package (hot/cold 24h + 7d, regime, catalysts, candidates). The intel layer is **still advisory-only at the wire**: it never mutates bot config, never sends Telegram, never triggers a trade. The L-CRYPTO-03 wire discipline survives intact.
- **BossMan decision layer (new):** Receives the structured intel package and autonomously decides — within fixed policy boundaries — the following: (1) coin rotation (add/remove from active universe and watchlist), (2) trade type / strategy class, (3) aggressiveness tier (from a fixed list of named tiers with fixed numeric bands), (4) per-trade qualification and rejection (including the $75 floor).
- **Trading layer:** Executes only decisions that pass the Policy Gate. Never executes a trade that violates hard constraints.

**Why amend L-CRYPTO-03 instead of replacing it.** The original rule's "advisory-only" wording protected the wire: the intel layer never mutated the bot, never auto-traded, never paged the operator. That wire discipline is what we want to keep. The amendment re-splits the model: intel stays advisory at the wire, but a **new BossMan decision layer** sits between intel and execution, and that layer IS the decision authority. L-CRYPTO-02 (one-way `INTEL_GATE`) is unchanged.

**Hard constraints (must be encoded explicitly):**

1. **Hard minimum trade size = $75 USD.** No trade under $75 notional, ever. Enforced at BOTH layers:
   - **Signal / intel layer (signal generator + LLM caller):** do not emit recommendations with `proposed_notional < 75`.
   - **Decision / execution layer (Policy Gate + Execution Engine):** reject any recommendation with `proposed_notional < 75` as `INVALID_FLOOR` and skip the cycle.
2. **No Telegram spam.** Routine outputs (daily decisions, weekly intel) are written to local files and mirrors only. Telegram is reserved for: (a) security-sensitive alerts, (b) mode / config / boundary-change approvals.
3. **Mode and configuration safety.**
   - Do NOT change `PAPER_MODE` automatically.
   - Do NOT change numeric risk bands automatically.
   - Do NOT change aggression tier band values automatically.
   - Any change to those values, or to the $75 floor, requires explicit Marcelo approval.
4. **L-CRYPTO-02 still wins.** Engine produces advisory; bot reads only `regime` and `regime_confidence` at `INTEL_GATE`. The new BossMan decision layer produces decisions that flow through Policy Gate — it does not bypass `INTEL_GATE` or write to the engine.

**Authority boundaries (must be clear):**

- **BossMan MAY autonomously:**
  - Add or remove coins from the active universe and watchlist based on the intel package.
  - Choose trade type / strategy class for those coins.
  - Choose an aggressiveness tier per regime, from a fixed list of tiers (e.g. `CONSERVATIVE` / `BASELINE` / `AGGRESSIVE`) with fixed numeric bands.
  - Qualify or reject specific trades, respecting the $75 floor and the fixed bands.

- **BossMan MAY NOT without explicit Marcelo approval:**
  - Change the numeric values of the aggressiveness bands.
  - Change the $75 minimum trade floor.
  - Change `PAPER`/`LIVE` mode rules or the 24-hour decision rule.
  - Change deep risk architecture or security-sensitive settings (auth, API keys, withdrawal permissions, exchange selection, quote-asset rules).

**Implementation notes (NOT in Phase 1 scope; preview-gated for later pass):**

- BossMan decision stage = `scripts/bossman_decision.js` (placeholder path). It will read `data/daily_radar.json` + `data/pair_briefs.json` + the latest memo, produce `data/bossman_decision.json` with `coin_universe_add/remove`, `tier`, `strategy_class`, and a list of pre-qualified / rejected candidate trades, and append one audit line per decision. **All values that flow into Policy Gate still pass through L-CRYPTO-02's `INTEL_GATE` filter** — BossMan cannot bypass it.
- Decision stage runs as a new Stage 6 in the existing `daily_pipeline.sh` cron `2141a756a0aa` (12:00 PT). No new crons.
- The wire discipline (intel never mutates bot config, never sends Telegram) is preserved. The new behavior is the **decision** between intel and execution, not a new wire.

**Verification (Phase 1 — governance only, no runtime check yet):**

- This L-CRYPTO-14 rule is mirrored to `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` and `~/Repos/BossMan/docs/crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` (3-mirror parity, SHA-256 verified).
- `SPEC-BINANCE-AUTONOMOUS-TRADER.md` now contains a "Decision Policy" section that references L-CRYPTO-14 by name.
- `crypto-weekly-review` skill no longer drafts 3-5 questions for Marcelo in the normal loop. It produces a weekly digest of BossMan's decisions for human review.
- `daily-radar-pipeline` skill description names BossMan as the decision consumer of its intel package.
- `PHASEREPORT.md` has a "2026-06-19 — L-CRYPTO authority upgraded" entry.

**Anti-pattern to avoid:** Treating this rule as "BossMan can now auto-trade without operator oversight." L-CRYPTO-14 grants decision authority within fixed boundaries, not execution authority over those boundaries. The Policy Gate, `INTEL_GATE`, and the 9 Approval Gates from `APPROVAL-GATES.md` still bind BossMan. Auto-execution of trades is a separate, future-pass question and is currently bound by `L-CRYPTO-10` (two-gate approval) and HARD GATE §B (`canWithdraw=true` on the production key).

**Anti-pattern to avoid (comm-style):** Asking Marcelo 3-5 questions in the weekly digest. The weekly digest now summarizes BossMan's decisions and surfaces only the items that crossed an approval boundary. Routine operations are reported, not asked.

---



---

## Stage 1 – Chart Basics  [TRADING][CRYPTO][CSDAWG]

**Sub-task:** `t_crypto_learn_s1_01_chart_basics` — CSDAWGBOT: Stage 1.1 — Chart basics (candles, timeframes, volume)
**Completed:** 2026-06-13 (status `done`, completed_at set)
**Source material covered (per deliverable spec):**
- Investopedia / Babypips chart basics
- BTCUSDT 1D chart, 7-day observation log
- Vocabulary: OHLC, wick, body, timeframes (1m / 5m / 15m / 1H / 4H / 1D / 1W), volume, divergence

**Lessons (inferred from deliverable spec; Marcelo to correct/augment on next weekly review):**

- **S1-CHART-01 — Pick one pair, one timeframe, one week.** The done-criteria explicitly said "Pick ONE pair to study, watch it for 1 week, log observations." Multi-pair, multi-timeframe observation produces noise that masquerades as insight. Single-pair focus forces pattern recognition depth over breadth.
- **S1-CHART-02 — Candle vocabulary is the lock; indicators come later.** OHLC + wick + body is the irreducible vocabulary. Every indicator (MA, RSI, MACD) is a derived view of OHLC. Reading candles directly builds the substrate that makes indicator readings meaningful.
- **S1-CHART-03 — Timeframe hierarchy: 1m/5m/15m noise, 1H/4H signal, 1D/1W structure.** Same candle, different context. A bullish engulfing on 1m is different from one on 4H. The spec calls out 1D as the primary study timeframe for swing trading, with 4H as the entry-timing frame.
- **S1-CHART-04 — Volume divergence is the first falsifiable signal.** "Price up, volume down" is the simplest divergence and the first signal that separates price action from conviction. Without volume, every price move is unfalsifiable.
- **S1-CHART-05 — The self-test gate (explain to a non-trader without jargon) is a real filter, not a formality.** If you can't translate "bullish engulfing" into "buyers took control and pushed price above yesterday's high" for a non-trader, you don't understand it yet. The deliverable treats this as a done criterion for a reason.

**Open questions for weekly review:**
- Did Marcelo write the summary to `01-chart-basics.md`? (not seen in vault — flag for review)
- Did the 7-day observation log get started? (should be in `trade-journal/` or `stage-1/`)
- What was the most surprising candle pattern he saw on BTCUSDT 1D?

---

## L-CRYPTO-13: Curriculum auto-advance contract — "done" triggers the next task

When a curriculum sub-task is marked `done`, the system must:

1. Set `status='done'`, `completed_at=now`
2. Harvest key lessons to LEARNED under a stage section
3. Mirror to Obsidian project + BossMan repo, commit + push
4. Auto-advance the **next sibling** (same parent, next-by-ordinal) from `todo` → `running`
5. Confirm back to Marcelo with: task moved, lessons harvested, next task running

**Rule:** The auto-advance keeps Marcelo's learning loop tight. Finish → write down what you learned → next task ready. Latency between finish and next-task-running should be under 30 seconds (measured from "done" message to Telegram confirmation).

**Trigger phrases** (encoded in `~/.hermes/skills/curriculum-auto-advance/SKILL.md`):
- "X.Y is done" / "X.Y is complete" / "I finished X.Y"
- "<topic> is done" (where topic matches a running sub-task title)
- "stage X is done" / "I finished stage X"
- "move on to the next one" / "what's next"

**Anti-pattern to avoid:** Asking "which task are you referring to?" when there's a single running sub-task. That breaks the latency advantage. The skill resolves ambiguity by finding the single running sub-task under the curriculum parent and acting.

**Verification:** This contract was first executed 2026-06-13 with 1.1 → 1.2 transition. Subsequent sub-tasks should follow the same path.

---

## L-CRYPTO-01: The live engine is canonical, not the design docs

`~/.hermes/knowledge/crypto-intel/` is the source of truth for **what crypto intelligence Marcelo's systems are doing right now**. The 12 design docs harvested from `~/Desktop/CLAW-Backup/` describe **how the engine was designed**, but they are frozen at 2026-05-20. The engine has been running and evolving since.

**Rule:** When asked "what's the regime?", "is the bot allowed to trade?", "what did the engine say this week?" — read the live `weekly/latest/intelligence.json`, not the design docs.

**Anti-pattern:** Treating `CRYPTO_INTEL_ENGINE_SPEC.md` as the live spec. It's the *original* spec. The *current* spec is `weekly/latest/intelligence.json` + the schema documented in the audit.

## L-CRYPTO-02: INTEL_GATE is the only integration point

The engine produces advisory output. The bot reads only the **`regime`** and **`regime_confidence`** fields of `intelligence.json`. Intelligence never receives execution data.

**Rule:** Engine is research, bot is execution. One-way data flow. No feedback from bot → engine.

**Why:** Two-way data flow corrupts intelligence history (execution noise = polluted predictions). One-way is auditable and reversible.

**Verification:** `intelligence.json` schema has no trade/balance/position fields. `binance-bot` writes nothing to `crypto-intel/`.

## L-CRYPTO-03: Advisory-only contract is durable

Every output of the engine is labeled "Advisory Only", "Observation Only", "Shadow Mode", or "Non-Binding". The engine never sends a Telegram message, never triggers a trade, never modifies bot config.

**Rule:** Engine output is research, not control. Even after the prediction track record improves, the contract stays one-way.

**Why:** The engine is a research instrument, not a control system. Auto-trading from intelligence would skip the human review step that's the whole point.

**Exception:** The only place where the engine *can* influence behavior is `INTEL_GATE` (the bot's own filter), which is the operator's explicit choice to wire them together.

## L-CRYPTO-04: Predictions need a track record before they're load-bearing

The engine logs predictions with `horizon_days`. The grader (`csdawg-prediction-grader.js`) runs 7 days later and scores the outcome. As of 2026-06-08: **10 predictions logged, 0 resolved.**

**Rule:** Don't weight engine output by prediction accuracy until you have at least 6 weeks of resolved predictions (10+) with non-zero accuracy. Below that threshold, treat all output as exploratory.

**Bump criterion for engine version 2.0:** 6+ weeks of resolved predictions, accuracy > 0%, AND `regime_confidence` > 0.6 on at least 50% of reports.

## L-CRYPTO-05: Weekly cadence, not daily or hourly

The engine runs once a week. Daily produces noise. Hourly is unmaintainable. Weekly is the right cadence for "regime + sector + ranking" thinking.

**Rule:** Don't add daily intelligence. Don't add hourly. The weekly cadence is part of the contract. If a sub-cadence is needed, it's a separate engine (e.g. an hourly volatility tracker, separate from CSDAWG 2.0).

## L-CRYPTO-06: Memory tagging uses [TRADING][CRYPTO][CSDAWG] triple

Every memory chunk related to crypto is triple-tagged. Three orthogonal axes: domain (trading), asset class (crypto), project (CSDAWG).

**Rule:** Single-axis tags lose context. Always use all three when writing memory.

**Example:** The 2026-05-21 LIVE go-live decision: tag `[TRADING][DECISION][PROJECT:BinanceBot]` AND `[CRYPTO]` AND `[CSDAWG]` (where applicable).

## L-CRYPTO-07: Question bank is A-H time-boxed, not ad-hoc

A = weekly, B = twice-monthly, C = monthly, D = event-driven, E = ad-hoc, F = leading indicators, G = strategy, H = risk events. See `designs/06_CSDAWG_QUESTION_BANK.md`.

**Rule:** Don't ask crypto questions ad-hoc. Check the bank first. If your question is A1 but it's Tuesday, defer to Sunday. If it's C1 but the 1st of the month just passed, wait for next month.

**Why:** Time-boxing prevents analysis paralysis and makes review completion measurable.

## L-CRYPTO-08: Cold storage is non-destructive

When a vault or project is no longer active:
1. Move it to `~/archive/<date>-<reason>/<original-path>/`
2. Leave a redirect note at the original location
3. If filesystem blocks the move (APFS clones, etc.), keep the original in place and add an index explaining the situation
4. **Never `rm -rf` without explicit Marcelo approval** (destructive admin)

**Rule:** Recovery is more important than tidiness. A 7.8 MB cold-storage folder on the desktop is fine. A deleted folder that was needed is not.

**Workaround for APFS `Resource deadlock avoided`:** Use `cat file > dest` from a Python script that doesn't trigger SEEK_HOLE. Or accept that the cold storage stays in place.

## L-CRYPTO-09: Two parallel systems is a failure mode

Before 2026-06-13, there were two crypto knowledge systems: the **live engine** and the **orphaned CLAW-Backup vault**. Both contained crypto content. Neither referenced the other. New work was ambiguous about which to update.

**Rule:** When you discover two parallel systems for the same domain, unify. Don't keep them in parallel "just in case". The cognitive cost of choosing between two systems exceeds the storage cost of consolidation.

**Unification pattern (8 steps):**
1. **Audit** — list both systems, identify the unique content of each
2. **Pick the live one** — the one actually being read by other systems
3. **Harvest the unique content** — copy, verify byte-for-byte (SHA-256)
4. **Move into the live system's project folder** — per `OBSIDIAN_VAULT_WORKFLOW.md`
5. **Sync to the GitHub backup stream** — `~/Repos/BossMan/docs/<project>/`
6. **Cold-storage the orphan** — original location keeps the original, with a redirect note
7. **Add a `LEARNED_<domain>.md`** — encode the patterns that survive
8. **Add a parent kanban card** — for the next-phase triage (e.g., 6 blocked cards under "Unify crypto knowledge")

## L-CRYPTO-10: Two-gate approval for security-sensitive operations

The binance bot is currently in PAPER mode with INTEL_GATE on. The last LIVE go-live (2026-05-21/22) required explicit Marcelo authorization and was followed by a bug → STOP. The next go-live requires:

**Gate 1:** 6+ weeks of resolved predictions with track record (L-CRYPTO-04)
**Gate 2:** Explicit Marcelo directive

**Rule:** Don't auto-restart the bot to LIVE mode. The PAPER mode is the safety default.

**Why:** The 985-ReferenceError TDZ bug post-go-live shows that even with INTEL_GATE on, the live code path has failure modes that paper mode masks. Stay paper until the prediction track record justifies the risk.

## L-CRYPTO-11: Git is required for live operational services

`csdawg-dashboard/` and `trading-control/` were running PM2-managed Node services with **no git history** until 2026-06-13. This is a violation of the BossMan backup rule.

**Rule:** Any service in PM2 that is `online` and serving requests must have a git repo with at least one commit. The BossMan repo is the canonical home; a sub-path is acceptable.

**Verification:** Run `cd <project> && git log --oneline -1` — if it errors with "not a git repository", the project is in violation.

## L-CRYPTO-12: The 6 blocked cards are the "stalled crypto learning system"

Before 2026-06-13, the actual strategic work for the crypto learning system was scattered across 6 `blocked` kanban cards:
- Regime Identification Framework
- Signal Classification System
- 4-Cycle Historical Analysis
- Crypto Education Curriculum
- Pre-Trade Hook Restoration
- trading-monitor rebuild

**Rule:** When you find strategic work in `blocked` state, it's not abandoned — it's awaiting triage. Surface it to Marcelo as a single decision (e.g., parent card "Unify crypto knowledge").

## Related files

- `~/.hermes/knowledge/crypto-intel/` — the live engine (canonical, integrated)
- `~/.hermes/knowledge/CRYPTO_TRADING_KNOWLEDGE_AUDIT_2026-06-13.md` — the audit that triggered this
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` — the project folder
- `~/Repos/BossMan/docs/crypto-trading-intelligence/` — the GitHub backup
- `~/archive/2026-06-13/` — cold storage (CLAW-Backup + 3 archived projects)
- `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` — vault layout standard

## Cardinal rule

**The loop is closed:** engine produces → engine archives → dashboard serves → bot reads → predictions logged → predictions graded → back to engine. Anything that breaks the loop needs explicit operator intervention.

## L-CRYPTO-15: Stage 6 BossMan Decision Artifact (L-CRYPTO-14 enforcement contract)

**Status:** 2026-06-19 — Phase 2-3 wired (preview-gated, approved by Marcelo). Schema + emitter live, no runtime/.env/PM2/cron touched.

**Scope:** Defines the schema and validation rules for `data/bossman_decision.json`, the single artifact Stage 6 emits. Each Stage 6 run writes ONE such artifact (overwrite) plus a dated archive. Stage 6 is a pure decision emitter — it does NOT trade, gate, size, or alter any execution. That contract is shared with L-CRYPTO-03 (advisory-only) and L-CRYPTO-14 (BossMan autonomy within fixed boundaries).

**Hard rules — enforced by `scripts/bossman_decision.js` BEFORE any file write:**

1. **Schema validation must pass.** Top-level required fields: `schema_version`, `generated_at`, `date`, `decision_layer`, `l_crypto_rule`, `regime_today`, `confidence`, `research_quality`, `universe`, `per_coin`, `floor_audit`, `mode`, `next_action`, `preview_id`. On any failure: artifact NOT written.
2. **Universe is locked.** `universe.active` must be exactly the canonical 15 USDT pairs in the same order as `server.js` `PAIRS`. `watchlist` ≤ 3. `do_not_touch` ≤ 3. No overlap. `do_not_touch` entries must come from the canonical PAIRS list (block-only). Watchlist entries are conservatively restricted to PAIRS as well.
3. **Hard $75 minimum notional (signal layer).** Every `per_coin[*].notional_usd` must be ≥ 75. Sub-75 rows are dropped, not emitted. Counted in `floor_audit.denied_below_floor` and `floor_audit.violations_dropped`. This is the signal-layer guard; the execution-layer guard (in `pre-trade-hook.js` or equivalent) is a separate, future-pass question.
4. **Tiers are named and fixed.** `aggression_tier` ∈ {`TIER_1_CONSERVATIVE`, `TIER_2_BASE`, `TIER_3_AGGRESSIVE`}. Numeric band definitions remain unchanged from `LIVE_PILOT_MAX_NOTIONAL`. BossMan selects per-coin; never redefines the tier set.
5. **Strategy classes are fixed.** `strategy_class` ∈ {`scalper`, `swing`, `position`, `hedge`} (L-CRYPTO-12 set). BossMan selects per-coin; never redefines the class set.
6. **Regime enum.** `regime_today` ∈ {`EARLY_CYCLE`, `MID_CYCLE`, `LATE_CYCLE`, `DISTRIBUTION`, `RISK_OFF`, `RECOVERY`, `UNKNOWN`}.
7. **Mode block is READ_FROM_ENV only.** `mode.PAPER_MODE = "READ_FROM_ENV"`, `mode.LIVE_PILOT_MAX_NOTIONAL = "READ_FROM_ENV"`, `mode.stage_6_mutation = "NONE — advisory only"`. Stage 6 NEVER writes to `.env`, `server.js`, `pre-trade-hook.js`, or any bot config.
8. **`l_crypto_rule` field is mandatory.** Every artifact must declare `"l_crypto_rule": "L-CRYPTO-14"`. Schema and decision_layer fields lock the artifact's authority chain.

**Verification (Phase 2-3 — emitter live, no runtime integration yet):**

- `node scripts/bossman_decision.js --dry-run` prints the candidate artifact; no file write.
- `node scripts/bossman_decision.js --schema` prints the inline JSON-schema spec; no file write.
- `node scripts/bossman_decision.js` writes `data/bossman_decision.json` and `data/bossman_decision.<date>.json`. SHA-256 verified stable across re-reads.
- Inline validator returns `{ ok: true }` on the 128/128-check verification battery (top-level fields, schema constants, universe parity with PAIRS, per_coin coverage, tier/strategy/decision enums, $75 floor, mode block).
- `pm2 jlist` shows `binance-bot` PID unchanged before/after Stage 6 writes (PID 4696, no restart).
- `data/bossman_decision*.json` is added to `.gitignore` (artifact contains live daily decisions, not source-of-truth).

**Anti-pattern to avoid (Stage 6 misuse):**

- Treating `bossman_decision.json` as an execution signal — Stage 6 is advisory; bot integration is a separate future card (Stage 7 wire-up, separate approval).
- Writing sub-75 notional rows to "log them anyway" — sub-75 rows are dropped at the signal layer and never emitted.
- Loosening the universe check to allow new pairs without an `server.js` `PAIRS` change — Stage 6 mirrors, never adds.
- Reading `LIVE_PILOT_MAX_NOTIONAL` from env to "scale" notional — the spec locks notional to 75 (T2/T1) or 113 (T3, hardcoded 1.5×), independent of env.
- Sending Telegram from Stage 6 — Telegram emissions are reserved for security-sensitive alerts and explicit operator approval under L-CRYPTO-03 / no-spam contract.

**Wire discipline (mirrors L-CRYPTO-03 + L-CRYPTO-14):**

Stage 6 NEVER writes `.env`, `server.js`, `pre-trade-hook.js`, `ecosystem.config.cjs`, cron jobs, or PM2 config. Stage 6 reads `PAIRS` from `server.js` via regex parse (read-only) and falls back to a hard-coded canonical copy. The bot's `checkIntelGate()` continues to read `data/daily_radar.json` unchanged — Stage 6 is a sibling artifact, not a replacement.

**Mirrors:**

- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md`
- `~/Repos/BossMan/docs/LEARNED_CRYPTO_INTELLIGENCE.md`
