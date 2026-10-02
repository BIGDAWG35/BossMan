**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/LEARNED_V3_TOKEN_ECONOMICS.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# V3 Token Economics — Reuse, Don't Re-Pay (Permanent 2026-07-20)

> **CANONICAL SOURCE OF TRUTH** for V3 token economics.
> All mirrors (Obsidian `Hermes/V3-Canon/V3 – Token Economics.md`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_V3_TOKEN_ECONOMICS.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked**: 2026-07-20
**Source directive**: Marcelo — V3 Model Stack + routing + Perplexity policy update
**Status**: CANON — applies to every BossMan + sub-agent + model call

Token spend is the largest variable cost in this stack. The goal of this doc is simple: **never pay twice for work we already did.** Every expensive analysis, spec, troubleshooting write-up, or model comparison must end up reusable, not throwaway.

---

## The 4 rules

### Rule 1 — Expensive work gets saved as `LEARNED_*` docs

After any of the following, the output MUST be saved into `~/.hermes/knowledge/LEARNED_<DOMAIN>.md` or the relevant project repo:
- Deep multi-model analysis
- Architecture review or decision
- Troubleshooting write-up
- Spec / blueprint for a feature
- Model comparison (Claude vs DeepSeek vs OpenAI for a task type)
- Vendor evaluation
- Postmortem from an incident

**Save location rules:**
- Cross-project / cross-stack knowledge → `~/.hermes/knowledge/LEARNED_<DOMAIN>.md`
- Project-specific knowledge → in the project's repo (e.g., `~/Projects/pmd-web/docs/`)
- Incident postmortems → kanban card body + project repo `docs/postmortems/`

The save step is part of the task. It's not optional cleanup.

### Rule 2 — Check `LEARNED_*` BEFORE doing heavy work

Before any heavy multi-model or deep-analysis call, the agent MUST check for existing artifacts:

1. `~/.hermes/knowledge/LEARNED_<DOMAIN>.md` (global canon)
2. `~/.hermes/knowledge/` (other project knowledge)
3. Project blueprint + runbook
4. Kanban card `body` and `comments` on the active card (and prior cards with the same tag)
5. `session_search` for past transcripts

If a valid prior artifact exists → reuse it. Only redo the work if the requirements changed.

### Rule 3 — Prefer cached / saved work over recomputing

When the same prompt would be sent to a model twice:
- If the prompt + context is identical → the model's prompt cache should hit (cheaper than re-paying)
- If the answer exists in a `LEARNED_*` doc → read the doc, don't call the model

**Don't recompute the same analysis "to be sure"** unless something changed. Trust the saved work; verify it if needed; update it if outdated.

### Rule 4 — Confirm Hermes prompt-cache + context compression are enabled

These settings minimize token re-spend automatically:

**Prompt caching** (provider-side):
- `MiniMax-M3` — Anthropic-compatible prompt caching: ON by default for repeated prefixes
- `claude-sonnet-4-6` — Anthropic prompt caching: ON by default
- `openai-codex gpt-5.4` — OpenAI automatic caching: ON by default
- `deepseek-v4-flash` — DeepSeek has cache hits on repeated prefixes: ON by default

BossMan and all sub-agents benefit from these automatically. **Don't break the cache** by:
- Mutating past conversation context mid-loop
- Swapping toolsets mid-conversation
- Rebuilding the system prompt mid-conversation
- Injecting synthetic user messages mid-loop (rare exception: context compression)

**Context compression** (Hermes-side):
- Enabled in `config.yaml` via `context_compression.enabled: true` (default)
- When the conversation gets long, Hermes compresses older turns into a summary block
- The summary still counts toward token cost, but at a much lower rate than raw history

**Verify both are on** at the start of every new session.

---

## Cost tiers (rough, for planning)

| Tier | Model | Cost per 1M tokens (input/output) | When to use |
|---|---|---|---|
| Cheap | MiniMax-M3 / Llama-3B | $0.05–0.50 / $0.20–1.50 | Bulk, formatting, chatty |
| Mid | deepseek-v4-pro | $0.30 / $1.20 | Coding, mathy, SQL, infra (qa, troubleshoot) |
| Mid-High | openai gpt-5.5 | $2.50 / $10.00 | BUILD: implementation, refactors |
| High | claude-sonnet-4-6 | $3.00 / $15.00 | Architecture, safety, money-path, audits |

(Rates approximate; check provider pricing page for current.)

**Budget posture**: prefer cheap tier first, escalate only when needed. Default to mid (DeepSeek) for implementation work, not mid-high (OpenAI) unless UI/prose is involved.

**Build lane model (Permanent 2026-10-01):** `OpenAI gpt-5.5` is the current default for `build-impl` cards (Codex OAuth plan quota exhausted until ~2026-10-16 — switched to OpenAI API key from `profiles/builder/.env`). gpt-5.5-codex is not a real model name (Codex OAuth plan label only — returns 404). Restore `openai-codex/gpt-5.4` after 2026-10-16. `deepseek-v4-flash` has been retired from the build lane; it was the cheap-mid option in the V3 first cut and is no longer routable. **The `claude-opus-4-7` tier was deleted entirely on 2026-09-30** — `claude-sonnet-4-6` is the only Claude tier the stack pays for, and only when a card is tagged `deep` by Marcelo.

## Enforcement (2026-09-30, stack-008 PART B)

The 4 rules above are doc-only; the discipline is enforced by the stack:

- **B1 REUSE PRE-FLIGHT in `~/.hermes/bin/route-card.sh`** — before any paid card create, pull 5-8 keywords from title+body, score `LEARNED_*.md` / `BUILD_LIBRARY.md` / `~/Repos/BossMan/docs` / project docs / done kanban cards / `state.db` sessions, and prepend a `REUSE CANDIDATES (check first; cite REUSED <path> or NEW-WORK <why>):` block to the body file. Free lanes skip this.
- **B2 `~/.hermes/scripts/build-library.py`** regenerates `~/knowledge/BUILD_LIBRARY.md` nightly at 03:00 (cron id pattern `12-hex`; current job `a6a47cee60cb`). The library enumerates every done card whose `model_override` is in `claude-*` / `deepseek-*` / `gpt-*` / `openai-*` or whose body references a paid task type, and emits a markdown table the next worker can cite.
- **B3 SAVE GATE in `~/.hermes/scripts/paid-model-guard.py`** alerts `SAVE-MISSING <card_id> <title>` on the daily Telegram rollup for any paid card that completes without a comment starting with `LEARNED:` or `ARTIFACT:`. Before marking a paid card done, post a comment line `LEARNED: <path>` or `ARTIFACT: <path>` referencing the saved work.
- **B4 `~/.hermes/logs/model-cost-ledger.jsonl` is now auto-appended** by `paid-model-guard.py` after every daily rollup — one row per paid session in the last 24h that isn't already in the ledger. Fields: `ts`, `card_id`, `session_id`, `provider`, `model`, `cost_usd`, `project_tag`, `date_utc`. Manual append is no longer required.
- **B5 Monthly reuse-rate line on the 1st** of each month — `paid-model-guard.py` appends `REUSE-RATE (last month): <cited>/<total> paid cards cited REUSED (<pct>%)` to the Telegram rollup. Cards with `REUSED <path>` in body or comments count as cited.

See also: `~/.hermes/profiles/{builder,qa-verification,bossman,loop-engineering,travel}/SOUL.md` for the per-lane enforcement reminders.

---

## Token-saving patterns (proven)

1. **Pre-summarize with Llama before sending to Claude.** Don't send 50K tokens of raw logs to Claude. Llama pre-summarizes to ~2K tokens; Claude gets the digest.
2. **Reuse `LEARNED_*` docs across projects.** The first time we documented "Next.js 15 basePath routing with Tailscale Funnel" that knowledge goes into `LEARNED_V3_BASE_PATH_ROUTING.md`. Next time any project hits the same issue, we read the doc, not call a model.
3. **Cache the system prompt.** Every BossMan session starts with the same SOUL/AGENTS/OPERATINGBLUEPRINT prefix. Provider prompt caching makes that prefix free after the first call.
4. **Compress aggressively.** Hermes context compression kicks in around 60% of context budget. Let it run.
5. **Sub-agents return summaries, not raw transcripts.** Sub-agent returns a structured summary; raw transcript stays in the sub-agent's session memory, not in BossMan's main context.
6. **Don't re-call for "just to verify."** Trust the saved work. If verification is needed, run a small targeted check, not a full re-analysis.

---

## Anti-patterns (drift signals)

If a `t_*` kanban card comment or sub-agent output shows:
- "Let me re-run the same analysis to make sure" — wrong, reuse the saved `LEARNED_*` doc
- "Marcelo, which model should I use here?" — wrong, model choice is in the stack doc
- "I forgot to save the postmortem" — wrong, save is part of the task
- "We paid for this analysis last week, let's do it again" — wrong, read the prior `LEARNED_*` doc

`drift-fix` cards auto-remediate.

---

## Cost control instrumentation (Permanent 2026-09-14)

**Card:** `t_ai_stack_cost_guardian_and_m3_squarepayouts_unblock_v1_20260914`

Every model dispatch that can incur a paid cost appends one structured row to the active cost ledger at `~/.hermes/logs/model-cost-ledger.jsonl`. Use `~/.hermes/profiles/ops/scripts/append_cost_row.sh` (canonical). Schema fields: `timestamp, card, attended, profile, lane, provider, model, task_class, tokens_in, tokens_out, tokens_cached, tokens_total, cost_usd, fallback_reason, outcome`. Local Ollama calls log `cost_usd: 0.0` for routing visibility.

The watchdog is `~/.hermes/profiles/ops/scripts/claude-cost-guardian.sh` — provider-neutral (was Claude-only; renamed in spirit, script path preserved for cron compatibility). Aggregates spend across `anthropic`, `deepseek`, `openai-codex`, `minimax`, `custom`/`ollama`, `system`, and any other paid provider. Thresholds: daily WARN \$5 / HARD-STOP \$10; weekly WARN \$20 / HARD-STOP \$35. **TELEMETRY-STALE** fires when ledger mtime > 24h — treated as unhealthy, not OK. Cron job `6625a253` (every 4h) runs the guardian.

Per-job cost policy lives in `~/.hermes/profiles/ops/cron/jobs.json` fields: `model`, `fallback_chain`, `fallback_chain_bounded_retries`, `daily_cost_cap_usd`, `per_run_token_cap`, `cost_policy_intent`. Dispatcher wrapper: `~/.hermes/profiles/ops/scripts/dispatch_with_guard.sh`.

**Local-first fallback (Permanent 2026-09-14; updated 2026-10-01, card spaces-001):** the active ops profile `~/.hermes/profiles/ops/config.yaml` `fallback_providers` chain begins with `custom/qwen3.5:35b-a3b-nvfp4` (Ollama local, 32K ctx, keep_alive 10m) before any paid model. The 2026-10-01 swap replaced `qwen2.5:7b` with `qwen3.5:35b-a3b-nvfp4` as the standard fallback across all 8 active profiles (bossman, builder, content, loop-engineering, ops, qa-verification, trading, travel); qwen2.5:7b + qwen2.5:3b are preserved only for explicit light-app jobs (binance-bot daily_memo.js, altus-forensic, crons). The core `~/.hermes/config.yaml` role-specific routing sets Ollama primary for `bulk_formatting`, `chatty`, and `privacy_local`. Paid models remain available for work that exceeds local capability.

**Runtime cron/PM2 closure (Permanent 2026-09-15, card `t_drift_closure_runtime_routing_v1_20260915`):** Unattended cron and PM2 jobs MUST NOT reach the global `fallback_providers` chain. Each job in `~/.hermes/cron/jobs.json` carries an explicit `provider` + `model` (Ollama or M3 only) and `fallback_chain: []`. Unapproved or unavailable routes fail LOUD with a kanban alert; no silent paid fallback. Risk-gated jobs (money paths, security, SquarePayouts state, Binance, MoneyPipeline, pmd-watchdog) are pinned to Ollama because Ollama never goes down — failure there means true infrastructure failure, not token spend. `reasoning_effort` is `false` in every dispatching profile (core + ops) to prevent Ollama HTTP 400 ("model does not support thinking") from triggering silent paid fallback.

---


## Quarterly review

Every quarter, BossMan runs a token-economics review:
- Total token spend by model tier
- Cache hit rates
- Number of `LEARNED_*` docs created vs reused
- Top 5 expensive calls that could have been reused

Surface the review on the kanban board. If reuse rate < 50%, that's a `drift-fix`.

---

*This file replaces any prior token-economics description. If a project violates these rules, create a `drift-fix: <project>` card.*

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
