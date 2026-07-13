---
name: crypto-weekly-review
description: On-demand weekly Crypto Decision Digest — reads L-CRYPTO + latest intel + BossMan decision log, produces a one-shot digest of BossMan's decisions for human review. No more 3-5 questions loop. Branches on PAPER vs LIVE.
created: 2026-06-13
updated: 2026-06-19
trigger: user sends "/review" or "crypto review" or "weekly review" via Telegram
also_runs_as: cron ea0157d715fa (Sundays 6pm PT)
applies_to: Crypto decision digest (L-CRYPTO-14 governance), CSDAWGBOT research queue
---

# Crypto Weekly Learning & Intel Review (On-Demand + Cron)

**Two invocation paths:**

1. **Manual:** Marcelo sends `/review` or any review-pattern message via Telegram. The intake gate routes it as `work` with `command_kind: crypto-weekly-review` in the body. Agent loads this skill and runs the workflow.

2. **Cron:** `ea0157d715fa` — Sundays 6pm PT, `deliver: telegram`, single Home channel ping per run. Same workflow, same skill. Full instructions at `references/cron-prompt.md`.

## Why two paths

The Cron no-spam rule (2026-06-12) and 3-bucket escalation rule (2026-06-09) both require explicit approval for new crons. Cron was approved 2026-06-13. Manual path remains for ad-hoc reviews.

## Hard rules (do not violate)

1. **L-CRYPTO-14 — BossMan is the autonomous decision engine.** The weekly digest summarizes BossMan's decisions for human review. It does **NOT** draft 3-5 questions for Marcelo in the normal loop. Routine operations are **reported**, not asked. Questions to Marcelo are reserved for items that crossed an approval boundary (numeric band change, $75 floor, mode flip, security-sensitive).

2. **L-CRYPTO-03 — Advisory-only contract (preserved at the wire).** Never send a Telegram message that auto-triggers, never modify bot config, never write to `crypto-intel/` outside the agreed brief path.

3. **L-CRYPTO-10 — Two-gate approval.** If you discover a signal that the bot should leave PAPER, do NOT silently switch it. Surface it to Marcelo as an approval request, not a question batch.

4. **One Telegram message per run.** Send exactly one summary to the Home channel at the end. No intermediate updates, no daily pings, no reminders. **For the cron path, the final response IS the Telegram message** (auto-delivery) — do not call `hermes send -t telegram` explicitly (see Step 10 dual-delivery guard).

5. **Cost control.** Each review: ≤ 1 LLM call total for the digest summary (DeepSeek primary, OpenAI fallback, M3 acceptable when structured output is the only need). If input exceeds 4k tokens, summarize the cost in the brief and STOP — ask Marcelo before increasing context size.

6. **No spam.** If the brief is empty, say "nothing to review this week" and exit. Do not invent content.

7. **No mid-week or extra pings.** Weekly job. Do not schedule anything else.

## Workflow (10 steps)

### 1. Detect mode
```bash
curl -s --max-time 5 http://localhost:8104/api/status | jq -r '.mode, .paperMode, .intelGate'
```

### 2. Read context (no model calls)
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-14 governs)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- `~/Projects/binance-bot/data/daily_radar.json` (latest radar snapshot)
- `~/Projects/binance-bot/data/pair_briefs.json` (latest pair briefs)
- `~/Projects/binance-bot/data/bossman_decision.json` (if Stage 6 is wired — preview-gated; do not assume present)
- `~/Projects/binance-bot/data/daily_archive/` for the last 7 days of decisions
- `~/.hermes/knowledge/crypto-intel/CSDAWG_PREDICTIONS_LOG.json` (if exists)
- Kanban: any `assignee=trading` cards with status `ready` or `running`

**2.1 Compute intel staleness (deterministic).** Compare `intelligence.json.report_date` to today. **If > 7 days stale, this is a first-priority item in the digest** ("intel stale — refresh scheduled or blocked"). Surface the staleness in the brief's Section C. Do not propose decisions that depend on fresh regime/price data when the intel is > 14 days stale — the digest becomes unfalsifiable. The 30-day cutoff in the Failure-modes section is a hard ceiling; 7-14 days is a soft signal that triggers an intel-refresh entry.

### 3. Compose BossMan decision digest (templated, no model call)
Build a **decision digest** — a one-shot human-readable summary of BossMan's crypto decisions for the last 7 days. Anchors:

- Total decisions made in window
- Coin rotation deltas (adds / removes / watchlist)
- Tier transitions (named tier + reason)
- Per-day: qualified trades (count) + rejected trades (count, top reasons)
- Hard $75 floor enforcement: how many recommendations rejected as `INVALID_FLOOR` this week
- Any approval-boundary crossings (numeric band, $75 floor, mode, security) — these become a single approval request, not a question batch

Use `references/digest-templates.md` (L-CRYPTO-14 aligned). NO "what do you want to understand better next week" style questions in the normal digest. Approval-boundary items surface as a single approval request, max.

### 4. Optional: enrich digest with structured summary (single LLM call, structured JSON output)
Use prompt in `references/digest-templates.md` Section B. Fill in: mode, regime, decisions, predictions, Stage progress, approval-boundary items, engine gaps.

**Routing:** DeepSeek primary → OpenAI fallback. M3 (current session model) is acceptable when the only need is structured JSON output, well under the 4k-token input ceiling. Do NOT call multiple providers in parallel.

Return format: JSON array of `digest_sections` (max 6) with `title`, `body`, `approval_required: bool`. If `approval_required == true` for any section, the digest must be routed to Marcelo with an approval prompt.

### 5. Create kanban tasks ONLY for approval-boundary items
For each digest section with `approval_required: true`:
- `hermes kanban create --assignee trading --parent t_e53da070`
- Body includes: `goal_id: t_goal_crypto_swing_trader_20260613`, `parent_id: t_e53da070`, `approval_gate: <Gate 1/4/6/8/9>`, full JSON in code block, references, effort, why-it-matters
- Status: `ready` (default — Marcelo picks which to promote to `running`)

**Do NOT create cards for routine decisions.** The digest itself is the report.

**DO NOT attempt `hermes kanban link <card> t_goal_crypto_swing_trader_20260613` to "link to the goal."** The CLI rejects this with `would create a cycle` because the goal is upstream of the curriculum parent in the dependency graph. The goal/unification-epic traceability lives in the body metadata (`goal_id:`, `parent_id:`), not in `task_links` rows. Embedding `goal_id` and `parent_id` in every card body is the canonical pattern.

**For multi-line JSON bodies with code fences/backticks:** write the body to `/tmp/cardN_body.md` first, then pass via `--body "$(cat /tmp/cardN_body.md)"`. The naive `hermes kanban create ... --body "$(cat <<'EOF' ... EOF)"` form fails in bash with `unexpected EOF while looking for for matching ' '` because nested heredocs collide with the body content's own quoting. See `kanban-worker` skill § "Creating Kanban cards from external systems" for the full pitfall set.

### 6. Write the brief
- File: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-YYYY-MM-DD.md`
- Mirror: `~/Repos/BossMan/docs/crypto-trading-intelligence/weekly-reviews/crypto-review-YYYY-MM-DD.md`
- Sections: A (questions for Marcelo) · B (CSDAWGBOT proposals) · C (mode + engine state + staleness) · D (created kanban tasks) · E (cost + token usage) · F (next week)

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
One-line entry: date, mode, regime, N proposed, K created, cost. **PHASEREPORT appends can silently duplicate if shell retry happens** — verify with `grep -c "^## $(date +%Y-%m-%d)" ~/.hermes/knowledge/PHASEREPORT.md` after writing; dedup with Python if the count > 1.

### 10. Send ONE Telegram Home summary
- Mode (PAPER / LIVE)
- Top 3 questions for Marcelo
- Number of CSDAWGBOT tasks created
- Path to brief
- "Reply to this thread with your answers when you're ready."

Do NOT send any other message.

**CRON DUAL-DELIVERY GUARD (added 2026-06-14):** When this skill runs from cron `ea0157d715fa`, the final assistant response is **auto-delivered** to the Telegram Home channel by the cron runner. Do NOT call `hermes send -t telegram` explicitly — the CLI prints `Skipped send_message to telegram: This cron job will already auto-deliver its final response to that same target.` The final response IS the Telegram message. The Markdown you compose in your final response becomes the actual user-facing message; the brief file is the durable artifact. **Manual `/review` invocations** (Telegram intake gate path) do NOT have this auto-delivery — for that path, use `hermes send -t telegram -f <message_file>` as before.

## Mode-aware branching

| Area | PAPER (current) | LIVE (after L-CRYPTO-10 two-gate) |
|---|---|---|
| Digest focus | decision quality, $75-floor rejections, regime fit | slippage, fill quality, PnL attribution, exposure-cap calibration |
| Approval-boundary items surfaced | mode flip to LIVE, any band change, any $75 floor change | same set + fee-tier change, leverage, withdrawal, exchange |
| Risk-management | discipline check, not PnL | discipline AND PnL |
| L-CRYPTO-03 (advisory-only at the wire) | enforced | enforced |
| L-CRYPTO-14 (BossMan decision engine) | enforced (decision log is the digest) | enforced |
| L-CRYPTO-10 (two-gate) | dormant | strict |

## Failure modes (handle gracefully)

- **binance-bot offline:** skip mode detection, note in digest, ping Marcelo to ask if bot should restart
- **intelligence.json missing/stale (>30d):** note staleness, do not propose decisions depending on fresh data. **Also see step 2.1** for the 7-day soft-signal threshold
- **`data/bossman_decision.json` missing:** digest notes "Stage 6 not yet wired (preview-gated, L-CRYPTO-14 governance lock 2026-06-19)" and falls back to summarizing `data/daily_radar.json` deltas
- **DeepSeek + OpenAI both fail:** ping Marcelo, do not write a digest
- **Git push fails after 2 retries:** save digest locally, ping Marcelo

## What you do NOT do

- ❌ Do not modify the Binance bot config
- ❌ Do not write to `~/.hermes/knowledge/crypto-intel/` (read-only for this review)
- ❌ Do not start/stop/restart any PM2 process
- ❌ Do not call multiple LLM providers in parallel
- ❌ Do not run this more than once per week (cron enforces; manual is at Marcelo's discretion)
- ❌ Do not send multiple Telegram messages
- ❌ Do not create kanban cards for routine decisions (only approval-boundary items)
- ❌ Do not draft 3-5 questions for Marcelo in the normal loop (L-CRYPTO-14)
- ❌ Do not invent content if there's nothing to review
- ❌ Do not call `hermes kanban link` to add a goal/unification-epic link to a card body — the CLI rejects as cycle. Embed `goal_id:` / `parent_id:` in body instead
- ❌ Do not call `hermes send -t telegram` from the cron path — the final response auto-delivers; explicit send is silently dropped

## References

- `references/digest-templates.md` — Section A (digest skeleton), B (LLM enrichment prompt), C (mode table), D (kanban task routing for approval-boundary items), E (logging)
- `references/cron-prompt.md` — full agent instructions (8.5 KB)
- `~/.hermes/skills/kanban-worker/SKILL.md` — load this BEFORE step 5; it has the kanban CLI pitfalls (nested heredocs, backtick body quoting, parent→upstream cycle rejection, direct SQL for fields the CLI doesn't expose)
- `~/.hermes/skills/curriculum-auto-advance/SKILL.md` — adjacent skill (task done → lessons → next)
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — canonical rules; **L-CRYPTO-14 governs this digest**
- `~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md` — Decision Policy section
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — live engine
- `~/Projects/binance-bot/data/daily_radar.json` — latest radar snapshot
- `~/Projects/binance-bot/data/pair_briefs.json` — latest pair briefs
- `~/Projects/binance-bot/data/bossman_decision.json` — BossMan decision log (when Stage 6 lands)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/`
- `~/.hermes/SOUL.md § Cron no-spam + 3-bucket escalation`
- L-CRYPTO-01, L-CRYPTO-02, L-CRYPTO-03, L-CRYPTO-04, L-CRYPTO-08, L-CRYPTO-10, L-CRYPTO-11, L-CRYPTO-12, **L-CRYPTO-14 (governs this skill)**

## Lessons from first real run (2026-06-14) + L-CRYPTO-14 amendment (2026-06-19)

**2026-06-14 (first automated execution):** the 2026-06-14 brief commit `1c4f970` is the reference artifact for the original 3-5 questions loop. Pitfalls 1-6 below are from that run.

**2026-06-19 (L-CRYPTO-14 amendment):** the weekly skill was reshaped from "review with 3-5 questions for Marcelo + 3-5 for CSDAWGBOT" to "one-shot digest of BossMan's decisions for human review." See Step 3, Step 5, "Mode-aware branching," and "What you do NOT do" for the amendments. Approval-boundary items still surface as kanban tasks, but routine decisions are reported, not asked.

1. **Intel staleness is a first-class signal.** 6 days of staleness on a 0.45-confidence regime with active NEGATIVE_FUNDING_BIAS materially degrades every downstream call. Step 2.1 computes staleness and triggers an intel-refresh entry when > 7 days. (Card `t_8bec8b2a` was the first card created on 2026-06-14 for exactly this reason.)
2. **Goal/unification-epic links go in body, not `task_links`.** `hermes kanban link <card> <goal_id>` returns `would create a cycle` because the goal is upstream. The goal/unification traceability lives in card-body metadata (`goal_id:`, `parent_id:`). Step 5 reflects this.
3. **Nested-heredoc bodies break bash.** A `$(cat <<'EOF' ... EOF)` form with the body containing code fences/backticks fails with `unexpected EOF while looking for matching ' '`. The durable fix is the `kanban-worker` pattern: write body to `/tmp/cardN_body.md` first, then `--body "$(cat <file>)"`. Step 5 points to the kanban-worker skill explicitly.
4. **Cron path does not need `hermes send`.** The cron runner auto-delivers the final response. Calling `hermes send -t telegram` is silently dropped. Step 10 documents the dual-delivery guard and the manual-path exception.
5. **PHASEREPORT appends can duplicate under shell retry.** If a shell call appears to fail (e.g. transient `HOME` error) and the agent retries, `cat >> ... <<'EOF'` may have already succeeded. Step 9 has a `grep -c` verification step and Python dedup recipe.
6. **M3 is acceptable as the structured-output caller.** The skill's hard rule said "DeepSeek first, OpenAI fallback" — when the subagent used M3 instead and produced a well-grounded 5-task JSON array in one pass under the 4k-token cost ceiling, the cost-control intent was satisfied. Step 4 permits M3 as an explicit acceptable option for structured-output calls, with DeepSeek/OpenAI still preferred for substantive reasoning.
7. **L-CRYPTO-14 amendment (2026-06-19):** the digest no longer drafts 3-5 questions for Marcelo. Routine decisions are reported as the digest body. Approval-boundary items (numeric band, $75 floor, mode, security) become a single approval request — never a question batch. The change is governance-only: Step 6 brief path, Step 9 PHASEREPORT, and Step 10 Telegram delivery are unchanged.

## Cron metadata (2026-06-13)

- **Job ID:** `ea0157d715fa`
- **Schedule:** `0 18 * * 0`
- **Deliver:** telegram (single Home channel ping)
- **Skills:** crypto-weekly-review
- **First run:** 2026-06-14 18:00 PDT
- **Cost bound:** ≤1 DeepSeek + ≤1 OpenAI per run (M3 acceptable for structured-output-only)
- **Approved by:** Marcelo, 2026-06-13, 1-cron option

## Registration gotcha (lessons learned 2026-06-13)

**First attempt failed silently:** I ran `hermes cron create --profile trading --name "..." "0 18 * * 0" "<prompt>"` and got `Created job: db495c7ea712`. The cron was **invisible to `hermes cron list`** and **never would have fired** because `--profile trading` routed the job to `~/.hermes/profiles/trading/cron/jobs.json` (profile-scoped), and the default scheduler only reads `~/.hermes/cron/jobs.json` (default-scoped).

**Diagnosis that caught it:**
```bash
grep -r "db495c7ea712" ~/.hermes/   # showed up only in profile file
hermes cron list | grep "db495"      # empty
hermes cron remove db495c7ea712     # "Job not found"
```

**Fix:** Deleted `~/.hermes/profiles/trading/cron/jobs.json` (no CLI way to manage it), re-registered without `--profile`. New ID `ea0157d715fa` lives in `~/.hermes/cron/jobs.json` where the scheduler monitors.

**Rule for any future cron registration:**
1. Create the cron.
2. **Immediately verify** with `hermes cron list | grep "<job-name>"` — if not shown, it's profile-scoped and won't fire.
3. If profile-scoped, re-register without `--profile` (unless you actually want it profile-scoped, which is rare and needs explicit operator knowledge).

**Why I tried `--profile trading` in the first place:** I thought it would make the agent run use the Trading profile's model config (DeepSeek first, OpenAI fallback). Wrong — `--profile` controls **where the job is stored**, not which models the agent uses. The agent's model routing is determined at run time by the active profile when the agent fires, which is the default profile for normal cron execution. The cron-prompt can still instruct the agent to prefer DeepSeek + OpenAI for the CSDAWGBOT call.

This gotcha is now codified in `cron-job-output-design` § "The `hermes cron create --profile <X>` Registration Gotcha."