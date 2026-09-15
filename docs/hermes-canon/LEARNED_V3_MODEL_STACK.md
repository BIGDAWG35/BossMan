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

## Routine cron routing — Ollama/local by default (Permanent 2026-07-25, card t_monitoring_ollama_default_v1_20260725)

This sub-policy is **additive** to the V3 model stack above. Routine monitors,
grinders, bulk-cleanup, and PM2/cron infra checks **default to Ollama/local**
(`provider: custom`, `base_url: http://localhost:11434/v1`, model `qwen2.5:3b`
or `qwen2.5:14b`) instead of falling through to Claude / DeepSeek.

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

**Implementation (applied 2026-09-15):**
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
   `custom/qwen2.5:7b`.

**Routing ledger for cron jobs:**
- Routine cron (bulk, monitors, watchdog, scans, audits, sync, freshness):
  `custom/qwen2.5:7b` (Ollama).
- Chatty / brief jobs explicitly approved for M3: `minimax/MiniMax-M3`.
- Risk-gated jobs (money paths, security, SquarePayouts state exporters,
  Binance, MoneyPipeline): `custom/qwen2.5:7b` (Ollama) — Ollama never goes
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
**Fallback chain** (global): `deepseek-v4-flash` → `claude-sonnet-4-6` → `openai-codex gpt-5.4`.

**Per-profile overrides** (apply on top of global default):
- **builder**: default `MiniMax-M3`; for implementation tasks, override to `deepseek-v4-flash` (cheap coding); escalate to `claude-sonnet-4-6` for safety-sensitive (SquarePayouts, money paths).
- **ops**: default `MiniMax-M3`; for PM2/cron/infra debugging, override to `deepseek-v4-flash`; escalate to `claude-sonnet-4-6` for cross-system debugging.
- **trading**: default `MiniMax-M3`; for signal analysis, override to `deepseek-v4-flash`; for trade decisions touching live money, escalate to `claude-sonnet-4-6`.
- **content**: default `MiniMax-M3`; for polished prose, override to `openai-codex gpt-5.4`; escalate to `claude-sonnet-4-6` for high-stakes voice/tone.
- **qa-verification** (Step-5): default `claude-sonnet-4-6`; fallback `openai-codex gpt-5.4`; never MiniMax for safety audits.
- **research-intel**: default `openai-codex gpt-5.4`; fallback `claude-sonnet-4-6`.

**SquarePayouts model routing (Permanent 2026-09-14, Marcelo durable rule):** SquarePayouts model/tool routing is owned by BossMan. BossMan selects the best-fit tool and model per task type, risk, privacy, cost, and required quality. No blanket categorical block by AI model or by tool, EXCEPT the standing safety-sensitive and secrets carve-outs in the V3 task-type ledger: Claude is mandatory for auth, encryption, money-path, PII, and audit-logging work; production secrets, credentials, tokens, and .env content are Llama/local only and must never leave the host. Money-path/auth/PII/credentials/security/audit/public-financial work requires Step-5 red-team QA + strongest appropriate model; card does NOT move to done until verification passes. Production secrets and raw credentials remain local-only.

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

## HARD RULE — Scheduled/Background Automation (Permanent, 2026-08-24)

> **Effective:** 2026-08-24
> **Source:** Marcelo — P1 incident `t_cron_pm2_local_m3_only_enforcement_v1_20260824`
> **Applies to:** ALL non-interactive execution surfaces — cron, PM2, LaunchAgents, daemons, background workers, self-healing wrappers, health monitors

### Allowed surfaces (in order of preference)

1. **`no_agent` deterministic scripts** — preferred wherever possible
2. **Ollama / local models** — `custom/qwen2.5:3b` at `http://localhost:11434/v1`
3. **MiniMax-M3** — only when reasoning/planning is genuinely required

### Denied — deny-by-default regardless of balance

- Claude / Anthropic
- DeepSeek
- OpenAI / Codex
- Perplexity Computer
- Any paid API provider

### Why this matters

A paid API key with $0 balance is still a policy violation if the background runtime can access it. The runtime environment must be isolated from paid credentials, not just balanced-out.

### If local/Ollama is unavailable

- **Do NOT escape to a paid model**
- Fail closed
- Write a local incident artifact
- Use local-only self-heal/retry
- Create a fix card if unresolved
- Send one Telegram alert only after the persistent-failure threshold

### Enforcement layers

| Layer | Mechanism |
|-------|-----------|
| Config | `fallback_providers: [custom/qwen2.5:3b]` in ops profile |
| Skill | Skill prompts must not reference paid providers |
| Credential | Paid keys removed from ops .env |
| Scheduler | Explicit `model: MiniMax-M3, provider: minimax` on all health monitors |
| Guardian | `claude-cost-guardian.sh` detects and alerts on any Claude spend from cron/PM2 |

### Cost guardian thresholds

- Daily warning: $5 | hard-stop: $10
- 7-day warning: $20 | hard-stop: $35
- HARD-STOP: exits non-zero (cron job fails + escalates)
- WARNING: exits 0 (logged only, one Telegram alert/day)

### Credential isolation scope

```
~/.hermes/profiles/ops/.env  → MINIMAX_API_KEY ✅ | TELEGRAM_BOT_TOKEN ✅ | ANTHROPIC/DEEPSEEK/OPENAI ❌ REMOVED
~/.hermes/.env               → ANTHROPIC/DEEPSEEK/OPENAI removed (2026-08-24)
~/.hermes/secrets/          → interactive-paid-providers.env (mode 600, user-only)
```

### Cannonical files

- Incident card: `~/.hermes/knowledge/incidents/t_cron_pm2_local_m3_only_enforcement_v1_20260824.md`
- Incident card: `~/.hermes/knowledge/incidents/t_paid_model_background_regression_guard_v1_20260824.md`
- Guardian script: `~/.hermes/profiles/ops/scripts/claude-cost-guardian.sh`
- Cost ledger: `~/.hermes/logs/model-cost-ledger.jsonl`
- Alert log: `~/.hermes/logs/claude-guardian-alerts.log`
- Ops profile config: `~/.hermes/profiles/ops/config.yaml` (fallback_providers: Ollama only)
- Provider policy gate: `~/.hermes/profiles/ops/scripts/provider_policy.py`
- Regression test suite: `~/.hermes/profiles/ops/scripts/regression_test_suite.py`
- Background model guard: `~/.hermes/profiles/ops/scripts/background_model_guard.py`
- Interactive secrets: `~/.hermes/secrets/interactive-paid-providers.env` (mode 0600)


---

## H. Background Execution — Permanent Hard Rule (2026-08-24)

**Card:** `t_paid_model_background_regression_guard_v1_20260824`

### Policy

Background execution (cron, PM2, LaunchAgent, gateway-worker, self-heal, no_agent, and all non-interactive contexts) may use **ONLY**:

1. Deterministic/no_agent local scripts
2. Ollama/local models (provider: `custom/`)
3. MiniMax-M3 (provider: `minimax`) — only when reasoning/planning is actually required

**All paid providers are deny-by-default in every non-interactive runtime**, regardless of:
- API key being present or absent
- Account balance being zero or non-zero
- Future profile or config changes
- Inherited fallback chains

### Credential Architecture (2026-08-24)

| Location | Contents | Background Access |
|----------|----------|-----------------|
| `~/.hermes/secrets/interactive-paid-providers.env` | ANTHROPIC, DEEPSEEK, OPENAI, REPLICATE, ATTOM | **Blocked** — file mode 0600, not sourced by background |
| `~/.hermes/.env` | MINIMAX, TELEGRAM, chrome path | **Blocked** — no paid keys |
| `~/.hermes/profiles/ops/.env` | MINIMAX, TELEGRAM | **Blocked** — no paid keys |
| Interactive gateway processes | Loaded from secrets on demand | **Allowed** — interactive context only |

### Enforcement Stack

1. **provider_policy.py** — Provider firewall gate, called before any model/client init. Blocks paid providers in non-interactive contexts.
2. **regression_test_suite.py** — 28-test matrix covering all contexts and all paid providers.
3. **background_model_guard.py** — Drift scanner: cron jobs, PM2, LaunchAgent, env vars, scripts.
4. **key_containment_check.py** — Paid key scanner: active envs, .env files, logs, PM2 configs, LaunchAgents.
5. **claude-cost-guardian.sh** — Cost ledger monitor: HARD-STOP at $10/day, exits 2, Telegram alert.
6. **pre_change_scan.py** — Pre-change protection: blocks config changes introducing paid providers.

### Scanners Mark These as EXPECTED (not violations)

- Paid keys in `~/.hermes/secrets/interactive-paid-providers.env`
- Paid keys loaded into interactive gateway processes
- `# REMOVED:` comment lines documenting key removal

### Scanners Flag These as VIOLATIONS

- Any paid key in a cron, PM2, LaunchAgent, or background environment
- Any `fallback_providers` containing a paid provider in a non-interactive job
- Any direct SDK import (anthropic, openai, deepseek, perplexity) in background scripts
- Any background process environment variable containing a paid API key
- Any active `.env` file with a paid key that is not the secrets store

---

*This file replaces any prior model routing description in SOUL/AGENTS/OPERATINGBLUEPRINT. If config.yaml or a profile yaml diverges, this file wins until config catches up.*



