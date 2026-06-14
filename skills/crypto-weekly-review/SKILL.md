---
name: crypto-weekly-review
description: On-demand weekly Crypto Learning & Intel Review — reads L-CRYPTO + latest intel, drafts 3-5 questions for Marcelo + 3-5 for CSDAWGBOT, creates linked kanban tasks, branches on PAPER vs LIVE.
created: 2026-06-13
trigger: user sends "/review" or "crypto review" or "weekly review" via Telegram
applies_to: Trading curriculum (Stage 1+), CSDAWGBOT research queue
---

# Crypto Weekly Learning & Intel Review (On-Demand)

**Why on-demand, not cron:** the standing **Cron no-spam rule (2026-06-12)** and **3-bucket escalation rule (2026-06-09)** both require explicit approval for any new cron + recurring Telegram pinging + paid model calls. Until Marcelo approves those, the workflow fires **manually** on `/review`.

## How Marcelo triggers it

Any of:
- `/review`
- "crypto review"
- "weekly review"
- "run the crypto review"
- "stage X review" (e.g., "stage 1 review")

**What the agent does (in order):**

### 1. Read context (deterministic, no model calls)
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (canonical rules)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (live engine)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/` (prior reviews)
- `~/.hermes/kanban/boards/bossman/kanban.db` (open trading tasks)
- `~/.hermes/knowledge/crypto-intel/CSDAWG_PREDICTIONS_LOG.json` (predictions, if any pending)
- Detect mode: `binance-bot` `:8104/api/status` → `mode` field (`PAPER` vs `LIVE`)

### 2. Compose 3-5 questions for Marcelo (M-tier, no external model)
These are templated, drawn from:
- L-CRYPTO rules (do you have new evidence for / against any?)
- Current regime (does it match what you see on the chart?)
- Stage 1 progress (which sub-task now? what blocked?)
- Recent lessons (anything not yet written down?)

### 3. Compose 3-5 questions for CSDAWGBOT (DeepSeek / OpenAI via Trading profile)
The agent calls DeepSeek (primary) + OpenAI (fallback) with:
- The L-CRYPTO context + latest intel summary
- A prompt asking for 3-5 concrete research tasks: title, why-it-matters, deliverables, effort estimate, references to read
- The model is asked to consider: (a) which gaps in the LEARNED file would most improve the engine, (b) which Stage-N+1 skills would unblock Marcelo's curriculum, (c) what to research that the engine doesn't currently cover

### 4. Branch on mode

**If `binance-bot` mode is `PAPER` (current default):**
- Questions to Marcelo focus on: learning, chart study, regime framework
- CSDAWGBOT tasks focus on: curriculum gaps, intel layer improvements, backtesting
- Risk-management questions are still asked but framed as "what would you want in LIVE mode rules"

**If `binance-bot` mode is `LIVE` (only after two-gate per L-CRYPTO-10):**
- Questions to Marcelo focus on: strategy refinement, live performance, slippage, fills
- CSDAWGBOT tasks focus on: signal quality, exposure cap calibration, position sizing review
- **Advisory-only contract still applies** (L-CRYPTO-03): no auto-trade from intel
- **Two-gate approval still applies** (L-CRYPTO-10): any strategy change goes through Marcelo

### 5. Create kanban tasks
For each CSDAWGBOT research task proposed:
- New card with `assignee=trading`, `goal_id=t_goal_crypto_swing_trader_20260613`, `parent_id=t_e53da070`
- Also linked to `t_unify_crypto_knowledge_20260613` (unification epic)
- Body includes: question that triggered it, expected deliverable, references, why-it-matters
- Status: `ready` (not auto-running; Marcelo picks which to start)

### 6. Write the review brief
- File: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-YYYY-MM-DD.md`
- Contents: questions for Marcelo, questions for CSDAWGBOT, proposed kanban tasks, mode note, references read
- Mirror to BossMan repo, commit, push

### 7. Confirm to Marcelo
Telegram message with:
- Mode detected (PAPER / LIVE)
- Top 3 questions for Marcelo (numbered, ask the user to answer)
- List of proposed CSDAWGBOT tasks created
- Path to the full brief

## What this skill does NOT do

- **Does not auto-create the cron.** Cron creation requires explicit Marcelo approval per the no-spam rule.
- **Does not call models without per-run approval.** The agent asks Marcelo to confirm model calls before invoking DeepSeek / OpenAI.
- **Does not modify the live engine or bot.** Advisory-only (L-CRYPTO-03).
- **Does not bypass PAPER mode.** Two-gate approval (L-CRYPTO-10) required to leave PAPER.
- **Does not spam Telegram.** Output is the brief file + a single confirm message per `/review` call.

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — canonical knowledge (12 rules, will grow)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — live engine output
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-review-template.md` — manual review template
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/stage-1/INDEX.md` — Stage 1 progress
- `~/.hermes/skills/curriculum-auto-advance/SKILL.md` — adjacent skill (task done → lessons → next)
- `~/.hermes/SOUL.md` § Cron no-spam rule + 3-bucket escalation
- L-CRYPTO-01 (live engine is canonical) · L-CRYPTO-03 (advisory-only) · L-CRYPTO-04 (track record) · L-CRYPTO-08 (non-destructive) · L-CRYPTO-10 (two-gate) · L-CRYPTO-11 (git required) · L-CRYPTO-12 (blocked cards)

## Cost budget (when models ARE called)

- DeepSeek: ~$0.001 per review (small model, 1-2k tokens)
- OpenAI: ~$0.01 per review (medium model, 1-2k tokens, fallback)
- 1 review/week × 52 weeks = ~$0.05 DeepSeek + ~$0.50 OpenAI per year
- Well below any meaningful budget cap; this is the right shape for the cost.

## When to upgrade to cron

If Marcelo runs `/review` consistently for 3+ weeks AND wants the automation, the cron promotion path is:
1. Agent proposes: "This review has been triggered manually N times. Promote to weekly cron? [Yes/No]"
2. Marcelo approves
3. Cron registered with `deliver: local` (writes brief, no Telegram ping by default) and a separate `deliver: telegram` ping (one summary message)
4. The no-spam + 3-bucket gate is satisfied by the approval itself
