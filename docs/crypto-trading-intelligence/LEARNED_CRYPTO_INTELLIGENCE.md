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
**Active curriculum stage:** Stage 1 — Chart literacy (4 sub-tasks, all `ready`).

## Current L-CRYPTO rule count

12 (L-CRYPTO-01 through L-CRYPTO-12).

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
