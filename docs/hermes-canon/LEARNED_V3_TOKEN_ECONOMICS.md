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
| Mid | deepseek-v4-flash | $0.30 / $1.20 | Coding, mathy, SQL, infra |
| Mid-High | openai-codex gpt-5.4 | $2.50 / $10.00 | General reasoning, polished prose |
| High | claude-sonnet-4-6 | $3.00 / $15.00 | Architecture, safety, audits |
| Very High | claude-opus-4-7 | $15.00 / $75.00 | Hardest cases, only when Sonnet fails |

(Rates approximate; check provider pricing page for current.)

**Budget posture**: prefer cheap tier first, escalate only when needed. Default to mid (DeepSeek) for implementation work, not mid-high (OpenAI) unless UI/prose is involved.

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

## Quarterly review

Every quarter, BossMan runs a token-economics review:
- Total token spend by model tier
- Cache hit rates
- Number of `LEARNED_*` docs created vs reused
- Top 5 expensive calls that could have been reused

Surface the review on the kanban board. If reuse rate < 50%, that's a `drift-fix`.

---

*This file replaces any prior token-economics description. If a project violates these rules, create a `drift-fix: <project>` card.*
