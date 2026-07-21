# V3 Model Stack — Canonical Routing Map (Permanent 2026-07-20)

> **CANONICAL SOURCE OF TRUTH** for the V3 model stack + routing.
> All mirrors (Obsidian `Hermes/V3-Canon/V3 – Model Stack and Routing.md`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_V3_MODEL_STACK.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked**: 2026-07-20
**Source directive**: Marcelo — V3 Model Stack + routing + Perplexity policy update
**Status**: CANON — overrides any prior model routing description in SOUL/AGENTS/OPERATINGBLUEPRINT

This is the **single canonical reference** for which model to use for which task. BossMan and every sub-agent must read this before selecting a model. When the routing config in `config.yaml` or a profile changes, this file is the source of truth.

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

### 3. DeepSeek — `deepseek-v4-flash` (default) / `deepseek-v4-thinking` (deep)

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
- Mac Studio M4 Max available models: `qwen2.5:3b`, `qwen2.5:14b` (responsive on Metal)

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

## Routing config (lives in `config.yaml` + per-profile overrides)

**Default** (BossMan profile): `MiniMax-M3` — chatty bulk work.
**Fallback chain** (global): `deepseek-v4-flash` → `claude-sonnet-4-6` → `openai-codex gpt-5.4`.

**Per-profile overrides** (apply on top of global default):
- **builder**: default `MiniMax-M3`; for implementation tasks, override to `deepseek-v4-flash` (cheap coding); escalate to `claude-sonnet-4-6` for safety-sensitive (SquarePayouts, money paths).
- **ops**: default `MiniMax-M3`; for PM2/cron/infra debugging, override to `deepseek-v4-flash`; escalate to `claude-sonnet-4-6` for cross-system debugging.
- **trading**: default `MiniMax-M3`; for signal analysis, override to `deepseek-v4-flash`; for trade decisions touching live money, escalate to `claude-sonnet-4-6`.
- **content**: default `MiniMax-M3`; for polished prose, override to `openai-codex gpt-5.4`; escalate to `claude-sonnet-4-6` for high-stakes voice/tone.
- **qa-verification** (Step-5): default `claude-sonnet-4-6`; fallback `openai-codex gpt-5.4`; never MiniMax for safety audits.
- **research-intel**: default `openai-codex gpt-5.4`; fallback `claude-sonnet-4-6`.

**SquarePayouts hard restriction** (carried over from prior canon): M3 is permanently BLOCKED for SquarePayouts code paths. Use Claude → OpenAI → DeepSeek.

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
- "Used MiniMax on SquarePayouts" — that's the hard restriction; it's a `drift-fix`.

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

*This file replaces any prior model routing description in SOUL/AGENTS/OPERATINGBLUEPRINT. If config.yaml or a profile yaml diverges, this file wins until config catches up.*
