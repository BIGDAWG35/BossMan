**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# V3 Model Stack — Canonical Routing Map (Permanent 2026-07-20)

> **CANONICAL SOURCE OF TRUTH** for the V3 model stack + routing.
> All mirrors (Obsidian `Hermes/V3-Canon/V3 – Model Stack and Routing.md`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_V3_MODEL_STACK.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked**: 2026-07-20
**Source directive**: Marcelo — V3 Model Stack + routing + Perplexity policy update
**Status**: CANON — overrides any prior model routing description in SOUL/AGENTS/OPERATINGBLUEPRINT

This is the **single canonical reference** for which model to use for which task. BossMan and every sub-agent must read this before selecting a model. When the routing config in `config.yaml` or a profile changes, this file is the source of truth.

---

## MiniMax family lane map (Marcelo directive 2026-09-30)

**Roles (locked, current as of 2026-10-01):** BossMan / Hermes = manager + orchestrator + sole status surface. LBC35 / OpenClaw = RETIRED 2026-09-30 (backups delete 2026-10-30); there is no delegator layer. BossMan routes work directly via kanban + `~/.hermes/bin/route-card.sh`. Sub-agents = workers.

**MiniMax-M3 is the default everywhere.** How Hermes actually enforces models: each lane is a profile with its own `model.default` + `fallback_providers`; BossMan picks the model by picking the lane. (The old per-task routing table that sat under `terminal:` in config.yaml was never read by Hermes and was removed 2026-09-30; the policy lives here.)

| Lane | Model | Why (MiniMax official docs / Artificial Analysis) |
|---|---|---|
| default / BossMan (orchestrator) | MiniMax-M3 | Highest MiniMax intelligence (AA index 29 vs 23 for M2.7/M2.5), best agentic tool use (MCP Atlas 74.2%), 1M context, ~108 tok/s, same price as M2.7 ($0.30 in / $1.20 out per M tokens) |
| builder | MiniMax-M3 | Frontier coding: SWE-Bench Pro 59.0%, Terminal-Bench 2.1 66.0% |
| ops, loop-engineering | MiniMax-M3 | Terminal + multi-step agentic work, long logs fit in 1M context |
| trading | MiniMax-M3 | Strongest reasoning in the family; numeric work stays on-provider (no DeepSeek spend) |
| travel | MiniMax-M3 | Search-heavy + native image input for listing screenshots |
| content | MiniMax-M2.7 | Best MiniMax model for professional office delivery (Word/PPT/Excel, GDPval-AA ELO 1495) and character-rich writing |
| qa-verification | MiniMax-M2.7 | Independent QA: a different model from the builder avoids shared blind spots; M2.7 is strong at log analysis, bug hunting and code security |
| LBC35 / OpenClaw (delegator) *[RETIRED 2026-09-30]* | MiniMax-M2.7 | Historical note: MiniMax reported M2.7 markedly better than M2.5 inside OpenClaw, with 97% skill adherence across 40 complex skills. This lane no longer exists; the delegator role is retired and there is no automatic replacement. |
| Automatic fallback | M3 lanes -> Ollama qwen3.5:35b-a3b-nvfp4; M2.7 lanes -> M3 -> Ollama qwen3.5:35b-a3b-nvfp4 | DeepSeek and Claude are NOT automatic fallbacks (cost control). qwen2.5:7b/3b are reserved for light app jobs only (not the silent fallback). |
| **All crons + PM2 automated runs** | **MiniMax-M3 or Ollama only** | Marcelo directive 2026-09-30. `cron.model: MiniMax-M3` is set in every profile; per-job pins may be M3, Ollama qwen3.5:35b-a3b-nvfp4 (standard fallback), or Ollama qwen2.5:7b/3b (light app jobs). PM2 apps that call Claude/OpenAI/DeepSeek on a schedule must be moved to M3 (MiniMax exposes an Anthropic-compatible API at https://api.minimax.io/anthropic) |

**Not used:** MiniMax-M2.5 and M2.1 are listed as Legacy by MiniMax; neither beats M3 at anything we run and the price is the same. `-highspeed` variants cost 2x and are slower than M3. Revisit when MiniMax-M3.1 leaves preview.

**Task-based model choice still applies to project work (build / review / troubleshoot):** BossMan classifies every card and writes a `model_plan:` using the per-model sections below, and sub-agents use the model named there. Claude = architecture, safety-sensitive, money paths, code audits. OpenAI gpt-5.4 (ChatGPT sign-in) = general reasoning, UI copy. DeepSeek = heavy math / numeric / trading-signal analysis. Llama/Ollama = privacy-sensitive + bulk pre-summaries. MiniMax-M3 = default, Telegram/Discord chat, orchestration, everything else. These premium models are chosen on purpose per task; they are never silent fallbacks and never run from crons or PM2.

Sources: https://platform.minimax.io/docs/guides/text-generation · https://platform.minimax.io/docs/guides/pricing-paygo · https://www.minimax.io/blog/minimax-m3 · https://www.minimax.io/models/text/m27 · https://artificialanalysis.ai/providers/minimax

---

## Models in the stack (5)

### 1. Claude (Anthropic) — `claude-sonnet-4-6` (default) / `claude-opus-4-7` (deep)

**When to use:**
- Deep architectural reasoning (system design, protocol choice, large refactors)
- Complex troubleshooting (cross-system bugs, race conditions, distributed-state issues)
- Safety-sensitive work (auth flows, encryption, audit logging, data retention, PII handling)
- Code audits (Step-5 QA on non-trivial work, especially if it touches SquarePayouts money paths)
- Long-form structured reasoning (planning docs, blueprint reviews, postmortems)
- Final diagnosis after bulk log summarization

**Avoid for:**
- Tiny formatting fixes, chatty one-line answers (overkill — use MiniMax)
- Bulk log pre-summarization (waste of reasoning budget — use Llama/local)
- TTS, image gen, or simple transformations (no tool support)
- Real-time market decisions under <5s (use pre-computed signals + MiniMax)

### 2. OpenAI — `gpt-5.4` (default)

**When to use:**
- General reasoning (broad-scope tasks, ambiguous requests)
- UI copy, marketing copy, polished prose
- Code generation that aligns well with our Next.js/React/TypeScript stack
- Structured synthesis where OpenAI's tool surface shines
- Multi-modal tasks (image + text reasoning)
- Cross-domain reasoning (when the task spans finance + UI + data)

**Avoid for:**
- Deep math/numeric analysis (use DeepSeek)
- Long-context bulk log scans (use Llama/local)
- Privacy-sensitive code that must NEVER leave the host (use Llama/local)
- Hard reasoning chains where Claude or DeepSeek outperform

### 3. DeepSeek — `deepseek-flash` (default) / `deepseek-v4-pro` (deep)

> 2026-09-30 live check: the DeepSeek API now lists only `deepseek-flash` and `deepseek-v4-pro`. `deepseek-v4-flash` / `deepseek-v4-thinking` are NOT available; read every older `deepseek-v4-flash` mention in this file as `deepseek-flash`.

**When to use:**
- Mathy / numeric analysis (statistics, projections, crypto P&L)
- Low-level analysis (SQL query plans, regex debugging, byte-level issues)
- Structured reasoning with strong cost-per-token
- Code that requires precise logic (algorithm implementation, data transforms)
- Trading signal analysis + backtest logic
- Server-side operations work (PM2, cron, infra debugging)

**Avoid for:**
- UI/UX polish and copy (Claude or OpenAI write better)
- Conversational/chatty tone (MiniMax is fine, DeepSeek is terse)
- Image understanding (use OpenAI or vision-capable Claude)

### 4. MiniMax-M3 (current default) — chatty / bulk / cheap

**When to use:**
- Cheap bulk tasks (formatting, tiny edits, doc-wrangling)
- Chatty conversational flows (Telegram routing, dispatcher replies)
- Simple transformations (markdown → HTML, JSON shape)
- TTS scripts and prompt templates
- Bulk pre-summarization before deep analysis (with haiku-class models for cheap)
- Default for any "I don't know what model — pick something reasonable" case

**Avoid for:**
- Hard architectural decisions (use Claude or OpenAI)
- Mathy/numeric reasoning (use DeepSeek)
- Code that handles real money / credentials (use Claude for safety)
- Long-form docs that need polish (use OpenAI for tone)

### 5. Llama / local (Ollama on `localhost:11434`)

**When to use:**
- Privacy-sensitive tasks (anything touching credentials, .env, raw tokens)
- Offline tasks (Perplexity unreachable, no internet)
- Cheap experiments / background helpers (bulk pre-summaries, pattern scans)
- Pre-summary step before sending logs to Claude/DeepSeek for final diagnosis
- Mac Studio M4 Max available models (stack-013, 2026-09-30; activated as standard fallback 2026-10-01, card spaces-001): `qwen2.5:3b`, `qwen2.5:7b`, **`qwen3.5:35b-a3b-nvfp4`** (NVFP4 MoE, ~24 GB, num_ctx 131072; replaced qwen3.8:27b as the standard fallback on 2026-10-02).
- Ollama server tunings (stack-013, 2026-09-30, via `launchctl setenv` + Ollama.app env): `OLLAMA_MAX_LOADED_MODELS=1`, `OLLAMA_NUM_PARALLEL=1`, `OLLAMA_KEEP_ALIVE=10m`, `OLLAMA_FLASH_ATTENTION=1`, `OLLAMA_KV_CACHE_TYPE=q8_0`.
- Light app jobs (binance-bot daily_memo.js, altus-forensic, some cron prompts) keep `qwen2.5:7b` / `qwen2.5:3b`; bulk/deep jobs use `qwen3.5:35b-a3b-nvfp4`.

**Avoid for:**
- Anything requiring precision (small models hallucinate more)
- Long-form structured output (small models lose structure)
- Customer-facing copy (tone is off)
- Multi-step complex reasoning (use Claude/OpenAI/DeepSeek)

---

## Troubleshooting model policy

**Tier 1 — Bulk pre-summary (cheap, fast)**
Use **Llama/local** for the first pass:
- Read raw logs and produce a structured summary (key errors, timestamps, stack-trace fingerprints)
- Pattern-scan for known error strings (regex match across thousands of lines)
- Strip noise, surface the suspect 10–20 lines

**Tier 2 — Mid-depth analysis**
Use **DeepSeek** for second pass:
- Read the pre-summary + remaining context
- Propose candidate root causes ranked by likelihood
- Draft fix candidates with code snippets
- Cross-reference with internal `LEARNED_*` docs for known patterns

**Tier 3 — Final diagnosis**
Use **Claude** (preferred) or **OpenAI** for the final read:
- Evaluate DeepSeek's candidates, pick the best one
- Draft the actual fix + migration plan
- Write the postmortem
- Run Step-5 QA on the fix
- For safety-sensitive fixes (auth, encryption, money), Claude is mandatory

**Tier 0 — External research**
If the issue requires external knowledge (new error pattern, vendor API change), use **Perplexity Search** at any tier — cheapest, fastest, most current.

**Reading logs / stack traces:** start with Llama pre-summary, escalate by tier.
**Proposing fixes / migration plans:** DeepSeek drafts, Claude finalizes.
**Bulk summarizing noisy logs:** Llama/local only.

---

## Task-type → preferred model matrix

| Task type | Primary | Fallback chain | Helper (cheap pre-step) |
|---|---|---|---|
| **Build / implementation** | DeepSeek → Claude | DeepSeek → OpenAI → Claude | Llama for context extraction |
| **Architecture / system design** | Claude | OpenAI → DeepSeek | Perplexity for best practices |
| **Code review / audit (Step-5)** | Claude | OpenAI → DeepSeek | — |
| **Refactor / large code move** | Claude | OpenAI | Llama for AST pre-scan |
| **Safety-sensitive (auth / money / PII)** | **Claude (mandatory)** | OpenAI | — |
| **UI copy / polished prose** | OpenAI | Claude | MiniMax draft → OpenAI polish |
| **Mathy / numeric / SQL** | DeepSeek | Claude | — |
| **Trading signal / backtest** | DeepSeek | Claude | Llama pre-summary |
| **Markdown / JSON transform** | MiniMax | Llama | — |
| **Telegram / dispatcher chat** | MiniMax | Llama | — |
| **TTS scripts / prompt templates** | MiniMax | OpenAI | — |
| **Privacy-sensitive / offline** | **Llama/local** | MiniMax | — |
| **External research** | **Perplexity Search** | Perplexity Computer | — |
| **Quick clarification (chatty)** | MiniMax | Llama | — |
| **Incident postmortem** | Claude (final) | OpenAI | DeepSeek candidate list, Llama log pre-summary |

---

## Routine cron routing — Ollama/local by default (Permanent 2026-07-25, card t_monitoring_ollama_default_v1_20260725; updated 2026-10-01, card spaces-001)

This sub-policy is **additive** to the V3 model stack above. Routine monitors,
grinders, bulk-cleanup, and PM2/cron infra checks **default to Ollama/local**
(`provider: custom`, `base_url: http://localhost:11434/v1`, model `qwen3.5:35b-a3b-nvfp4`
for the standard fallback, `qwen2.5:7b` / `qwen2.5:3b` reserved for light app
jobs only) instead of falling through to Claude / DeepSeek.

### Drift Closure 2026-09-15 (BossMan run, card `t_drift_closure_runtime_routing_v1_20260915`)

**Standing policy (Permanent 2026-09-15, Marcelo directive):** Unattended cron
and PM2 execution routes to **M3 or Ollama only**. DeepSeek is helper-only and
must NEVER be an automatic primary or fallback provider for cron/PM2. MiniMax
must NEVER be an automatic fallback provider for cron/PM2 (M3 may be the
explicit primary when chosen by BossMan, but the *fallback* chain for cron/PM2
runtime is Ollama-local only). Claude and OpenAI are interactive planning /
architecture / quality / risk-gated review models — they are NOT unattended
runtime defaults. Payment, auth, PII, security, audit-logging, and
customer-facing financial work retain mandatory risk-based QA gates and must
fail loudly or escalate if the approved route is unavailable.

**Implementation (applied 2026-09-15; updated 2026-10-01):**
1. Every job in `~/.hermes/cron/jobs.json` has an **explicit** `provider` +
   `model`. No job may inherit the global `fallback_providers` chain.
2. Every job's `fallback_chain` is `[]`. Unapproved / unavailable routes fail
   LOUD (RuntimeError or fail-streak alert) instead of silently consuming
   paid tokens.
3. `reasoning_effort` is `false` in every profile that dispatches cron/PM2
   jobs (core + ops profile). Prevents Ollama HTTP 400 ("model does not
   support thinking") → silent paid fallback.
4. Legacy non-approved pins are removed: the `pmd-watchdog` job was pinned to
   `minimax/haiku` (haiku is not in the approved M3/Ollama set) and is now
   `custom/qwen3.5:35b-a3b-nvfp4`.

**Routing ledger for cron jobs:**
- Routine cron (bulk, monitors, watchdog, scans, audits, sync, freshness):
  `custom/qwen3.5:35b-a3b-nvfp4` (Ollama) — standard fallback, M3 primary.
- Light app jobs (compact summaries, tiny transformations, no long context):
  `custom/qwen2.5:7b` (Ollama) — only when qwen3.5:35b-a3b-nvfp4 would be overkill.
- Chatty / brief jobs explicitly approved for M3: `minimax/MiniMax-M3`.
- Risk-gated jobs (money paths, security, SquarePayouts state exporters,
  Binance, MoneyPipeline): `custom/qwen3.5:35b-a3b-nvfp4` (Ollama) — Ollama never goes
  down, so failure means true infrastructure failure, not silent paid
  fallback. BossMan surfaces the failure via kanban alert.

**Interactive session fallback (UNCHANGED):** The global `fallback_providers`
chain in `~/.hermes/profiles/ops/config.yaml` (Ollama → DeepSeek → Claude →
OpenAI) remains in place for **interactive** sessions where BossMan is
actively orchestrating. Cron/PM2 jobs MUST NOT reach this chain because
they have explicit per-job routes.

### What "routine" means here

A cron job is **routine** if it satisfies ALL of:

- Cadence is fixed-time (`*/N`, `0 H * * *`, weekly) and not event-driven.
- It is non-strategic — i.e., failure does NOT directly move money / expose
  credentials / delete user data.
- The job's output is "silent when healthy" or "produce a small status row",
  not a long-form artifact.
- It is observable by a human (status row visible in cron output / Telegram)
  rather than a blind autonomous feedback loop.

Examples: PM2 Health Monitor, Brave CDP watchdog, CuaDriver health checks,
backfill scans, canon drift checks, weekly ledger scans.

### What stays on Claude / DeepSeek (NOT routine)

- money/trading signals and bot state (binance-*, pmd-*, money-pipeline-*)
- safety-sensitive paths (auth, PII, payments, SquarePayouts code paths)
- jobs whose card explicitly pins Claude or DeepSeek per a v3 carve-out
  (e.g., a kanban card writing "use Claude for the production rollout")

### Per-card override

If a kanban card's spec explicitly names a model, the cron job's per-job
`provider` / `model` / `base_url` fields MUST be set to that model (overrides
the cron-routing default). The PM2 Health Monitor's per-job `model` /
`provider` / `base_url` always wins over the global fallback chain.

### Config interaction

`config.yaml` exposes two knobs:

- `model.context_length: 65536` — keeps Hermes' 64K-context floor happy when
  working with local Ollama tags that report <64K via /v1/models (qwen2.5:14b
  reports 32k; the override fakes it to 65k for agent-init validation only).
- `model.ollama_num_ctx: 65536` — what Ollama actually requests from the
  daemon on each call. Sized to fit 14b-class Metal inference within
  M4 Max unified memory budget.

Cron jobs may also pin their own `ollama_num_ctx` in jobs.json if a tighter
window is desired. Defaults are conservative for M-series hardware.

### Fallback chain (updated 2026-07-25)

Global `fallback_providers` in `config.yaml` has been trimmed to a
single local entry: `custom` provider (Ollama). Routine cron jobs that
fail Ollama inference now fail LOUD instead of silently burning Claude
or DeepSeek tokens. Strategic cards that pin Claude/DeepSeek bypass
this fallback chain via the per-job `provider` / `model` / `base_url`
override (the cron scheduler prefers job-level settings over the
global chain).

---

## Routing config (lives in `config.yaml` + per-profile overrides)

**Default** (BossMan profile): `MiniMax-M3` — chatty bulk work.
**Fallback chain** (SUPERSEDED 2026-09-30 — see MiniMax lane map at top: M3 lanes → Ollama qwen3.5:35b-a3b-nvfp4 (updated 2026-10-01); M2.7 lanes → M3 → Ollama. No DeepSeek/Claude/OpenAI silent fallback.)

**Per-profile overrides** (apply on top of global default):
(Rewritten 2026-10-01 — paid models are reachable ONLY through `~/.hermes/bin/route-card.sh` cards; there are no per-profile paid overrides. `deepseek-v4-flash` does not exist on the DeepSeek API.)
- **builder**: default `MiniMax-M3`; real builds → `route-card.sh build-impl` (OpenAI `gpt-5.5`); safety-sensitive (SquarePayouts, auth, money paths) → `build-arch` / `money-path` (Claude `claude-sonnet-4-6`).
- **ops**: default `MiniMax-M3` (all PM2/cron/infra debugging); stuck → `route-card.sh troubleshoot-escalate` (DeepSeek `deepseek-v4-pro`).
- **trading**: default `MiniMax-M3`; local bulk → Ollama `qwen3.5:35b-a3b-nvfp4`; changes touching live money → `route-card.sh money-path` (Claude `claude-sonnet-4-6`, mandatory review).
- **content**: default `MiniMax-M2.7`; drafts on M3; public research → `research-public` (Gemini free tier).
- **qa-verification** (Step-5): default `MiniMax-M2.7`; paid review → `route-card.sh qa-review` (DeepSeek `deepseek-v4-pro`); money/auth audits → `money-path` (Claude).
- **research-intel**: default `MiniMax-M3` + Perplexity; public-source digests → `research-public` (Gemini free tier).

**SquarePayouts model routing (Permanent 2026-09-14, Marcelo policy — durable rule):** SquarePayouts model/tool routing is owned by BossMan. For every card, BossMan selects the best-fit tool and model using the V3 task-type routing ledger, current task risk, privacy constraints, and required quality. Money-path, auth, PII, credentials, security, audit, and public financial behavior remain critical work: use the strongest appropriate model, require Step-5 red-team QA, and do not mark Done until verification passes. Production secrets and raw credentials remain local-only. **No blanket categorical block by AI model or by tool, EXCEPT the standing safety-sensitive and secrets carve-outs in the V3 task-type ledger: Claude is mandatory for auth, encryption, money-path, PII, and audit-logging work; production secrets, credentials, tokens, and .env content are Llama/local only and must never leave the host. BossMan picks per task.** See `~/.hermes/knowledge/LEARNED_SQUAREPAYOUTS.md` § "Model Selection — Task-Fit Routing" + `~/.hermes/knowledge/ROUTING-RULES.md`.

---

## Fallback behavior (mandatory)

When the preferred model is unavailable (down, rate-limited, 5xx, timeout > 30s), automatically fall back to the next model in the chain. **Do NOT fail the task on a single model error.**

Fallback chain (top → bottom):
1. Try the preferred model for the task type
2. On 429 / 503 / 5xx / timeout → next model in chain
3. If ALL models fail → use **Llama/local** as last resort (it never goes down)
4. If Llama also fails → mark the task `BLOCKED-ON-MARCELO` only if the model choice is a V3 carve-out (vendor/billing/security). Otherwise log the failure on the kanban card and retry next cycle.

**No silent failure.** Every fallback decision is logged on the kanban card.

---

## Drift signals

If a `t_*` kanban card comment contains any of these, the agent stack has drifted:
- "Which model should I use?" — model choice is in this doc; consult before asking.
- "Marcelo should decide which model" — Marcelo does NOT pick models for routine work.
- "MiniMax failed, asking Marcelo" — fall back automatically per chain, don't escalate.
- "Used MiniMax on SquarePayouts" — not a `drift-fix` since 2026-09-14: routing is task-fit, not categorical-block; check whether the work was risk-gated (payment/auth/PII/security/audit-logging/customer-facing-financial) — if not, M3 is fine; if yes, escalate per V3 stack.

`drift-fix` cards auto-remediate these.

---

## Drift Guards (Permanent 2026-07-20)

This file is the **canonical source of truth** for V3 model stack + routing. To prevent drift:

1. **config.yaml, profiles, Obsidian/GitHub mirrors MUST NOT introduce conflicting defaults** — e.g., changing the primary model for a task type without updating this file, hardcoding a different fallback chain in a profile yaml, redefining SquarePayouts M3-block in a sub-doc.
2. **Any future change to default models, routing, or fallback chains MUST follow this order:**
   1. Update the canonical `LEARNED_*` doc first (`~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md`).
   2. Then update `config.yaml` (via `hermes config edit` — operator-assisted) to match.
   3. Then update per-profile `MEMORY.md` and profile `config.yaml` to match.
   4. Then let the Obsidian + GitHub mirrors sync (one-way: Hermes → mirror).
3. **Drift detection** — the doc-hygiene goal loop periodically verifies:
   - Obsidian `Hermes/V3-Canon/V3 – Model Stack and Routing.md` matches this file (md5 check)
   - GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_V3_MODEL_STACK.md` matches this file (md5 check)
   - If drift is detected, a `t_drift_fix_v3_stack_…` kanban card is created. **The loop never silently rewrites a mirror.**
4. **SquarePayouts M3-block is a permanent carve-out** — any future change to this restriction must surface as a Marcelo A/B/C decision and update this file FIRST.

**Drift symptoms** (auto-remediated via `drift-fix` cards):
- A profile yaml declares a primary model that conflicts with the routing map
- A sub-agent uses M3 on a SquarePayouts code path
- A `config.yaml` `fallback_providers` chain omits a model that this file says must be in the chain
- An Obsidian mirror has a stale copy older than the canonical file (mtime check)

---

### 6. Google Gemini (native, free tier only) — `gemini-3.1-flash-lite-preview` (default) (added 2026-09-30, stack-013)

**When to use:**
- Public, non-sensitive bulk research: news/YouTube transcripts, daily/weekly market-news digests for trading research, long public documents, public image/screenshot read.
- Anything that hits the body-pattern guard (`API_KEY=`, `sk-`, `password`, `secret`, `token=`) routes to a paid lane instead.
- Approved by Marcelo 2026-09-30 23:50 ("Gemini ... of course, you would have to use a free tier. I don't wanna pay for anything else").

**Avoid for:**
- ANY data marked confidential, internal, or client-related.
- Secrets, .env, logs with keys, personal/financial account data, SquarePayouts data, client data.
- Anything in LEARNED canon or with PII.

**Caps & routing:**
- `route-card.sh research-public` → provider `gemini`, model `gemini-3.1-flash-lite-preview`, fallback MiniMax-M3.
- Budget gate: $0 USD (free tier), 400 requests/day per `PROVIDER_REQUEST_CAPS["gemini"]`. Above 400 → downgrade to M3.
- env: `GEMINI_API_KEY` (no-billing Google AI Studio project; **NOT YET SET** by Marcelo).
- Free tier limits (Google): Flash ~20 RPD, Flash-Lite ~500 RPD. We cap at 400.

**Why free** (replaces gap-analysis #4 Grok REJECTED): Grok rejected by Marcelo ("let's go ahead and skip grok"); Gemini picked because free tier covers public research work that MiniMax-M3 cannot, and is free.

---

## §X. Pre-troubleshoot mandatory backup (Permanent 2026-08-06)

Every non-trivial configuration mutation — config.yaml edits, `cron/jobs.json` changes, PM2 service definitions, infra manifests (Caddy / Tailscale / systemd / LaunchAgent), important scripts in `~/.hermes/scripts/`, governance canon (this file and `LEARNED_*`) — **MUST** be backed by a current git snapshot before the mutation. The reason is so the agent stack can revert automatically without ever asking Marcelo to retype a config or rerun a command from memory.

- **Rule:** `LEARNED_7_RULE_CONTRACT.md` Rule #8.
- **Executable form:** `~/.hermes/skills/troubleshooting-backup-and-revert/SKILL.md`.
- **Helpers:** `~/.hermes/scripts/git-snapshot-before-fix.sh` (returns SHA), `~/.hermes/scripts/git-revert-last-fix.sh` (auto-revert on Step-5 FAIL).
- **Inventory:** `~/.hermes/knowledge/AUTOMATION_INVENTORY.md` §A.
- **Drift signal:** Sub-agent applies a non-trivial fix without first running the snap helper → `t_drift_snap_rule_violation_<date>` card.

This applies to model-routing fixes in this doc itself: if you intend to amend the routing map or the M3-block on SquarePayouts, snap first, write the new version, run Step-5 verifier (Claude for safety-sensitive), and auto-revert on FAIL. Models don't get rerun. They snap → mutate → verify → land or auto-revert.

### Pre-MD-trim mandatory classification (Permanent 2026-08-06)

Every canon-MD trim, dedup, or shave — including this file, `LEARNED_7_LAYER_ARCHITECTURE.md`, `LEARNED_7_RULE_CONTRACT.md`, profile `SOUL.md` / `AGENTS.md`, `PHASEREPORT.md`, audit docs, and any `LEARNED_*.md` — **MUST** pass the 6-step Rule #9 loop: snapshot → classify → extract → trim → verify → report.

- **Rule:** `LEARNED_7_RULE_CONTRACT.md` Rule #9.
- **Rubric:** `~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md` (4-category classification: A=canonical rule, B=historical evidence, C=procedure, D=temp working context).
- **Executable form:** `~/.hermes/skills/md-file-snapshot-before-trim/SKILL.md`.
- **Helper:** `~/.hermes/scripts/git-snapshot-md-file.sh` (returns SHA, writes ledger to `~/.hermes/logs/md-trim-snapshots.log`).
- **Drift signal:** Sub-agent trims a canon MD without first running `git-snapshot-md-file.sh` → `t_drift_md_trim_classification_<date>` card.

**No section may be deleted without classification.** Class A/B/C content must be extracted to its proper destination before any trim. Class D requires a 7-day quarantine.

---

## 2026-10-02 — Local fallback switch + 529 resilience (supersedes any qwen3.8:27b / 32K fallback text above)

**Layout (all 9 configs: default + 8 profiles)**
1. **Primary:** MiniMax-M3 (`api.minimax.io/anthropic`, 262K). Unchanged.
2. **Retry before falling back:** `agent.api_max_retries: 5` (was 3) plus the built-in `auto_recovery_cycles: 5`. A short MiniMax 529 burst is retried instead of dropping the whole turn to local.
3. **Local fallback:** `custom / qwen3.5:35b-a3b-nvfp4` (MoE, 3B active, MLX build) on `localhost:11434`, `context_length: 131072`, `ollama_num_ctx: 131072`. This is above the Hermes 64K floor.
4. **Next turn:** Hermes goes back to M3 automatically (`_restore_primary_runtime`).
5. **Compression:** `auxiliary.compression: auto` uses the session's main model. Every agent path is now ≥128K, so the 64K `ValueError` cannot recur. The 9 agent crons that were pinned to `qwen2.5:7b` (32K) were moved to the new model. no_agent crons were left alone.

**Benchmark (Mac Studio M4 Max 64GB, 56K-token prompt, 2026-10-02, /tmp/llm-bench/)**
| Model | Prefill | Cold 56K | Warm | Decode | Tool call | RAM |
|---|---|---|---|---|---|---|
| qwen3.5:35b-a3b-nvfp4 | 1,110 tok/s | 55 s | 1.9 s | 113 tok/s | OK | 24 GB, 56% free |
| qwen3.8:27b (old) | 182 tok/s | 325 s | 8 s | 12.5 tok/s | OK | 19 GB |

The old 27B was more accurate on the doc-reading question. The 35B-A3B is 6–9x faster, which is what an outage fallback needs.

**Live proof:** cron `binance-health-check-pm` (it failed on 10/01 with the compression `ValueError`) ran at 10:12 on qwen3.5:35b-a3b-nvfp4. Status ok, per-call latency 1–20 s.

**Why M3 returned 529:** MiniMax server-side cluster overload, error `(2064)` "server cluster is currently under high load". Their docs call it retryable. It is not a quota or plan limit; those come back as 1002 (rate limit) or 2056 (usage limit). Bursts were logged on 08-30/31 and 10-01 19:00–22:30 PT.

**Still on disk, on purpose:** `qwen2.5:7b` / `qwen2.5:3b`, which binance-bot `daily_memo.js` and altus-forensic call directly. `qwen3.8:27b` stays until binance-bot `_llm_free.js` (PIPELINE_OLLAMA_PRIMARY) is repointed. That change needs a bot restart, which needs Marcelo's yes.

Backups: `~/Backups/model-switch-20261002/`. Card t_de03a430.

---

*This file replaces any prior model routing description in SOUL/AGENTS/OPERATINGBLUEPRINT. If config.yaml or a profile yaml diverges, this file wins until config catches up.*

**Update 2026-10-02 (later, sweep 20261002-105903):** binance-bot `scripts/_llm_free.js` now uses `qwen3.5:35b-a3b-nvfp4` after MiniMax-M3 (then qwen2.5:7b). No bot restart was needed: the daily pipeline runs as cron child processes, not inside PM2 `binance-bot-live`. `qwen3.8:27b` was removed with `ollama rm` (frees ~17 GB). All current-state docs, Desktop/spaces and the 9 Perplexity Projects were updated the same day.
