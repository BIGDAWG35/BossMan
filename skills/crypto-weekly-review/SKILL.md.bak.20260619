---
name: crypto-weekly-review
description: On-demand weekly Crypto Learning & Intel Review — reads L-CRYPTO + latest intel, drafts 3-5 questions for Marcelo + 3-5 for CSDAWGBOT, creates linked kanban tasks, branches on PAPER vs LIVE.
created: 2026-06-13
trigger: user sends "/review" or "crypto review" or "weekly review" via Telegram
also_runs_as: cron ea0157d715fa (Sundays 6pm PT)
applies_to: Trading curriculum (Stage 1+), CSDAWGBOT research queue
---

# Crypto Weekly Learning & Intel Review (On-Demand + Cron)

**Two invocation paths:**

1. **Manual:** Marcelo sends `/review` or any review-pattern message via Telegram. The intake gate routes it as `work` with `command_kind: crypto-weekly-review` in the body. Agent loads this skill and runs the workflow.

2. **Cron:** `ea0157d715fa` — Sundays 6pm PT, `deliver: telegram`, single Home channel ping per run. Same workflow, same skill. Full instructions at `references/cron-prompt.md`.

## Why two paths

The Cron no-spam rule (2026-06-12) and 3-bucket escalation rule (2026-06-09) both require explicit approval for new crons. Cron was approved 2026-06-13. Manual path remains for ad-hoc reviews.

## Hard rules (do not violate)

1. **L-CRYPTO-03 — Advisory-only contract.** Never send a Telegram message that auto-triggers, never modify bot config, never write to `crypto-intel/` outside the agreed brief path.

2. **L-CRYPTO-10 — Two-gate approval.** If you discover a signal that the bot should leave PAPER, do NOT silently switch it. Surface it to Marcelo as a question.

3. **One Telegram message per run.** Send exactly one summary to the Home channel at the end. No intermediate updates, no daily pings, no reminders.

4. **Cost control.** Each review: ≤ 1 DeepSeek call + ≤ 1 OpenAI call (fallback). If either exceeds 4k tokens input, summarize the cost in the brief and STOP — ask Marcelo before increasing context size.

5. **No spam.** If the brief is empty, say "nothing to review this week" and exit. Do not invent content.

6. **No mid-week or extra pings.** Weekly job. Do not schedule anything else.

## Workflow (10 steps)

### 1. Detect mode
```bash
curl -s --max-time 5 http://localhost:8104/api/status | jq -r '.mode, .paperMode, .intelGate'
```

### 2. Read context (no model calls)
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- `~/.hermes/knowledge/crypto-intel/CSDAWG_PREDICTIONS_LOG.json` (if exists)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-*.md` (most recent to avoid duplicate questions)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/stage-1/INDEX.md`
- Kanban: any `assignee=trading` cards with status `ready` or `running`

### 3. Compose 3-5 questions for Marcelo (templated, no model call)
Use `references/question-templates.md` Section A. Anchor questions from Marcelo:
1. What chart setups felt unclear this week?
2. Which signals did I ignore or misinterpret?
3. What do I want to understand better next week?
4. Did I follow my rules from LEARNED_CRYPTO_INTELLIGENCE?

Add 1 more from Section A if it fits the current state.

### 4. Compose 3-5 questions for CSDAWGBOT (DeepSeek + OpenAI)
Use prompt in `references/question-templates.md` Section B. Fill in: mode, regime, sector, predictions, Stage progress, open Marcelo questions, engine gaps.

**Call DeepSeek first** (primary). Fallback to OpenAI if DeepSeek fails or returns malformed JSON.

Return format: JSON array of 3-5 tasks with `title`, `why`, `deliverable`, `references`, `effort` (S/M/L).

### 5. Create kanban tasks
For each CSDAWGBOT proposal:
- `hermes kanban create --assignee trading --project Trading`
- Body includes: `goal_id: t_goal_crypto_swing_trader_20260613`, `parent_id: t_e53da070`, `stage: <N>`, `curriculum: crypto-trading`, full JSON in code block, references, effort, why-it-matters
- Status: `ready`
- After creation, link to `/goal` and to `t_unify_crypto_knowledge_20260613` via `task_links`

### 6. Write the brief
- File: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-YYYY-MM-DD.md`
- Mirror: `~/Repos/BossMan/docs/crypto-trading-intelligence/weekly-reviews/crypto-review-YYYY-MM-DD.md`
- Sections: A (questions for Marcelo) · B (CSDAWGBOT proposals) · C (mode + engine state) · D (created kanban tasks) · E (cost + token usage) · F (next week)

### 7. Commit + push
```bash
cd ~/Repos/BossMan
git add docs/crypto-trading-intelligence/weekly-reviews/
git commit -m "docs(crypto-intel): weekly review brief YYYY-MM-DD (mode: PAPER)"
git push origin main
```
If push fails, `git pull --rebase` and retry. Never force-push.

### 8. Update LEARNED_CRYPTO_INTELLIGENCE.md
Only if CSDAWGBOT surfaced a durable rule. Per curriculum-auto-advance: number L-CRYPTO-NN if durable (6-month test), stage-section bullet if one-off. Mirror to project folder + BossMan.

### 9. Update PHASEREPORT
One-line entry: date, mode, regime, N proposed, K created, cost.

### 10. Send ONE Telegram Home summary
- Mode (PAPER / LIVE)
- Top 3 questions for Marcelo
- Number of CSDAWGBOT tasks created
- Path to brief
- "Reply to this thread with your answers when you're ready."

Do NOT send any other message.

## Mode-aware branching

| Area | PAPER (current) | LIVE (after L-CRYPTO-10 two-gate) |
|---|---|---|
| Questions to Marcelo | learning, chart study, regime | strategy refinement, live performance, slippage |
| CSDAWGBOT tasks | curriculum gaps, intel improvements, backtesting | signal quality, exposure cap calibration, position sizing |
| Risk-management | discipline check, not PnL | discipline AND PnL |
| L-CRYPTO-03 (advisory-only) | enforced | enforced |
| L-CRYPTO-10 (two-gate) | dormant | strict |

## Failure modes (handle gracefully)

- **binance-bot offline:** skip mode detection, note in brief, ping Marcelo to ask if bot should restart
- **intelligence.json missing/stale (>30d):** note staleness, don't propose tasks depending on fresh data
- **DeepSeek + OpenAI both fail:** ping Marcelo, do not write a brief
- **Git push fails after 2 retries:** save brief locally, ping Marcelo

## What you do NOT do

- ❌ Do not modify the Binance bot config
- ❌ Do not write to `~/.hermes/knowledge/crypto-intel/` (read-only for this review)
- ❌ Do not start/stop/restart any PM2 process
- ❌ Do not call multiple LLM providers in parallel
- ❌ Do not run this more than once per week (cron enforces; manual is at Marcelo's discretion)
- ❌ Do not send multiple Telegram messages
- ❌ Do not create kanban cards for tasks Marcelo didn't approve
- ❌ Do not invent content if there's nothing to review

## References

- `references/question-templates.md` — Section A (Marcelo), B (CSDAWGBOT), C (mode table), D (kanban task routing), E (logging)
- `references/cron-prompt.md` — full agent instructions (8.5 KB)
- `~/.hermes/skills/curriculum-auto-advance/SKILL.md` — adjacent skill (task done → lessons → next)
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — canonical rules
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — live engine
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` — project folder
- `~/.hermes/SOUL.md § Cron no-spam + 3-bucket escalation`
- L-CRYPTO-01, L-CRYPTO-03, L-CRYPTO-04, L-CRYPTO-08, L-CRYPTO-10, L-CRYPTO-11, L-CRYPTO-12

## Cron metadata (2026-06-13)

- **Job ID:** `ea0157d715fa`
- **Schedule:** `0 18 * * 0`
- **Deliver:** telegram (single Home channel ping)
- **Skills:** crypto-weekly-review
- **First run:** 2026-06-14 18:00 PDT
- **Cost bound:** ≤1 DeepSeek + ≤1 OpenAI per run
- **Approved by:** Marcelo, 2026-06-13, 1-cron option
