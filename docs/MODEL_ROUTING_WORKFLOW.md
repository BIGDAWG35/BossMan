# MODEL_ROUTING_WORKFLOW.md
**Version:** 3.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — governs all work routing

> **v3.0 (2026-06-03) — "10/10" canon update.** Default Build Flow is now
> 6 steps (added Step 5 — QA pass with DeepSeek red-team). Perplexity
> Computer is now a rare, narrow-scope escalation tool with a 10,000
> credits/month budget and a mandatory `escalate_to_computer: yes` flag
> approved by Marcelo. Added light build metrics (`build_passes`,
> `rewrite_scope`) and a monthly review. Fallback chain extended to
> QA. v1.0 (MiniMax 2.7 primary brain), v1.1 (M2.7 → M3 migration),
> and v2.0 (5-step flow) entries are preserved in the version history
> for traceback. The companion worked examples (now v3.0) live in
> `MODEL-STACK-WORKFLOWS.md`. The canonical ruleset is in
> `~/.hermes/knowledge/ROUTING-RULES.md` v3.0.

---

## Purpose

This document is the **single source of truth for model routing, cost management, and AI stack orchestration** across all Marcelo/BossMan operations. It defines:
- Model specializations and cost tiers
- Routing rules for every work type
- Mandatory Routing Ledger for every Kanban card
- Three blueprint types
- Cost-aware escalation chains
- Model activity logging
- Artifact reuse policy for paid models

**No AI work happens without a Routing Ledger. No model touches an artifact without being named.**

---

## 1. Model Specialization Table (Permanent — 2026-06-03, v3.0)

### Cost Tier Map

| Tier | Cost | Models | Notes |
|------|------|--------|-------|
| **Tier 1** | FREE | Hermes knowledge, Obsidian, GitHub | Reuse existing artifacts |
| **Tier 2** | FREE | Ollama / Llama / Qwen (local) | Local inference, no API cost |
| **Tier 3** | INCLUDED | M3 (MiniMax M3) | Default orchestrator and planning brain |
| **Tier 4** | PAID | DeepSeek, OpenAI, Claude | Per-token/session cost — used surgically |
| **Tier 5** | PAID HIGH | Perplexity Computer | Credits, budgeted separately: **10,000 credits/month** |
| **Step 1 (always)** | PAID | Perplexity Search (Pro) | First step for any non-trivial build or troubleshooting |

### Model Roles and Specializations (v3.0)

| Model | Role | Specialization | When to Use |
|-------|------|----------------|-------------|
| **Perplexity Search (Pro)** | First-step research | Current docs, API references, best practices, gotchas | **Step 1 of every non-trivial build or troubleshooting.** Never guess when we can read. |
| **M3 (MiniMax M3)** | Primary thinking and planning brain | Architecture, Kanban card design, acceptance criteria, complex reasoning | **Step 2 of every new project or major feature.** Default for routine work. |
| **DeepSeek** | Heavy-duty coder, reasoning engine, and **red-team QA** | Complex logic, data models, debugging, edge-case analysis, **and QA pass (Step 5)** | Primary builder for complex or critical backend logic, data, or debugging. **Default Step-5 QA model** — uses red-team mindset. |
| **Llama (Ollama local)** | Cheap grinder | Bulk transforms, scaffolding, refactors, test generation, cleanup | **Step 4 harden and clean up.** High-token grinding, repetitive work. |
| **OpenAI** | Production finisher | Clean code, user-facing copy, polished style, final code finishing | Primary builder when output is user-facing or high-risk. Final polish only. |
| **Claude** | Long-form documentation writer | Runbooks, handoff docs, multi-page explanations, architecture reviews | **Step 6 only** — after code is stable AND QA passes. |
| **Perplexity Computer** | **Rare escalation tool** (NOT everyday default) | Multi-step Mac/browser workflows that span research, code, and deployment | Only on projects with `escalate_to_computer: yes` flag set by BossMan and approved by Marcelo. Budget: 10,000 credits/month. See §4 of `ROUTING-RULES.md`. |
| **OpenClaw / LBC35** | Delegated executor | Execution under BossMan direction ONLY — **does not choose models, does not trigger Perplexity Computer** | Only when explicitly assigned via Kanban handoff packet. Reads `model_plan:`, `qa_required:`, and `escalate_to_computer:` flags. |

### Paid Model Policy

**DeepSeek, OpenAI, Claude (Tier 4):**
- Use only when Tier 1/2/3 (and the Step-1 Perplexity Search) cannot deliver quality
- Treat ALL outputs as canonical artifacts — save prompts, templates, docs, code
- **Artifact reuse mandate:** If a Tier 4 model produced a reusable artifact (spec doc, architecture diagram, prompt template, code module), save it to `~/.hermes/knowledge/` so future tasks reuse it without paying again
- Never pay for the same analysis twice

**Perplexity Search** (Step 1, always run for non-trivial work):
- Always available for web research
- Results feed into the M3 design step (Step 2)
- Key sources linked into the main project card

**Perplexity Computer** (Step 5+ escalation, 10k credits/month budget):
- NOT part of the everyday default path
- Allowed only on projects matching one of the escalation patterns in
  `ROUTING-RULES.md` §4 (greenfield full-stack SaaS, large cross-service
  refactors, complex multi-domain research)
- Requires `escalate_to_computer: yes` flag on the main project card,
  approved by Marcelo
- BossMan pre-warns Marcelo before any project that would consume more
  than ~3,000 credits
- When the monthly cap is reached, BossMan **stops** using Computer
  and falls back to the local stack (or waits for Marcelo's override)

### SquarePayouts Model Restriction (Permanent)

**M3 is BLOCKED for all SquarePayouts work.** Use Claude / DeepSeek / OpenAI / Perplexity / Llama for SquarePayouts. Perplexity Search, Llama, and Claude remain approved for SquarePayouts research and review. Perplexity Computer requires the same `escalate_to_computer: yes` approval as everywhere else.

---

## 2. Cost-Aware Routing Rules

### Default Build Flow — 6 Steps ("10/10")

```
STEP 1  → Perplexity Search     research, current docs, gotchas
STEP 2  → M3                    architecture, Kanban cards, acceptance criteria
STEP 3  → Primary builder       DeepSeek | Llama | OpenAI  (one per card)
STEP 4  → Llama                 bulk cleanup, refactors, tests
STEP 5  → QA PASS               red-team with DeepSeek (mandatory for critical cards)
STEP 6  → Claude                long-form docs and runbooks (only after QA passes)
```

**Step 5 is mandatory for critical cards:** money, PII, infra, trading,
auth, public APIs. Default QA model is DeepSeek (red-team mindset:
edge cases, security, performance, failure modes). Fallback: OpenAI →
M3.

**Full policy in `~/.hermes/knowledge/ROUTING-RULES.md` v3.0.**

### Tier Escalation Chain (when a paid model fails on quota/billing)

```
Planning / reasoning:  M3 → Llama → DeepSeek
Code / debugging:      DeepSeek → Llama → OpenAI
Docs / specs:          Claude → OpenAI → M3
QA / red-team:         DeepSeek → OpenAI → M3    (new in v3.0)
```

**Rules:**
- Always try Tier 1 (knowledge), Tier 2 (local), and Tier 3 (M3) first when quality allows
- Escalate to Tier 4+ only when necessary
- For Tier 4/5 calls, document the output artifact so it amortizes future costs
- **Always start with Perplexity Search** for any non-trivial work, regardless of tier
- **Perplexity Computer is a separate budget (10k credits/month) and
  requires the `escalate_to_computer: yes` flag.** Do not treat it as
  part of the everyday default path.

### Model Selection by Work Type (v3.0)

| Work Type | Primary | Secondary | Notes |
|-----------|---------|-----------|-------|
| Research, current docs, gotchas | Perplexity Search | M3 | Always Step 1 |
| Architecture, planning, Kanban card design | M3 | Llama | Step 2 — bossman brain |
| Complex or critical backend logic, data, debugging | DeepSeek | M3 | Step 3 primary builder for heavy code |
| Repetitive scaffolding, refactors, large-volume edits | Llama | — | Step 3 primary builder for bulk |
| User-facing code, high-risk output, polished style | OpenAI | DeepSeek | Step 3 primary builder for shipping copy |
| Bulk cleanup, test generation | Llama | — | Step 4 |
| Final sanity pass on critical components | DeepSeek or OpenAI | — | Step 4 — do NOT rewrite large acceptable chunks |
| **QA / red-team pass (Step 5)** | **DeepSeek** | **OpenAI → M3** | **Mandatory for critical cards. Edge cases, security, performance, failure modes.** |
| Long-form docs, runbooks, handoff | Claude | OpenAI | Step 6 — after code is stable AND QA passes |
| Live web research, market data | Perplexity Search | Perplexity Search | Always available |
| Complex Mac/browser workflows (escalation only) | Perplexity Computer | Local stack | Requires `escalate_to_computer: yes` flag, 10k credits/month |
| Text drafting, summarization (local/private) | Ollama / Llama | M3 | No API cost |
| Complex cross-repo research | DeepSeek | Perplexity Search | Analytical + web |
| High-stakes review, UX critique | Claude | OpenAI | Structured + thorough |

---

## 3. Routing Ledger (Mandatory — Every AI Kanban Card)

**Every Kanban card involving AI work MUST include a Routing Ledger section in the card body.**

### Required Fields

```yaml
## Routing Ledger
work_type:           # new_build | existing_build | troubleshooting | audit | refactor
primary_artifact:     # main repo/app/dashboard/prompt/service/doc being changed
lead_model:          # primary model for this card (M3|DeepSeek|Llama|OpenAI|Claude|Perplexity|Local)
supporting_models:   # models/tools allowed to assist (can be multiple, comma-separated)
review_models:       # models allowed to review/critique but NOT overwrite (can be multiple)
final_integrator:    # BossMan|builder|ops|trading|content — who merges changes into canonical artifact
cost_tier:           # 1|2|3|4|5
last_model_used:     # [model] — last model that actually touched this artifact
next_model_planned:  # [model] — next model expected to act (or "none")
```

### Routing Ledger Rules

1. **One owner per artifact per phase** — only `lead_model` can modify the artifact during execution; reviewers may NOT overwrite
2. **Reviewers comment only** — `review_models` may propose changes via card comments; they do not write directly to the artifact
3. **Cost tier must be set before execution** — Tier 1/2 preferred; Tier 4/5 requires justification
4. **All model activity logged** — every time a model works, BossMan adds a card comment:
   ```
   [MODEL USED]: [model name]
   [REASON]: [e.g. "DeepSeek for deep analysis of DB schema"]
   [ARTIFACT TOUCHED]: [file/repo/dashboard name]
   [OUTCOME]: [brief summary of result]
   [NEXT]: [handoff note if any]
   ```
5. **Final integrator merges** — only BossMan or the designated `final_integrator` accepts changes into the canonical artifact
6. **No ad-hoc model use** — no model or profile runs ad-hoc on a card without being named in the Routing Ledger

### Routing Ledger Example (Critical card with QA + escalation)

```yaml
## Routing Ledger
work_type: new_build
primary_artifact: binance-bot/server.js
lead_model: DeepSeek
supporting_models: M3, Claude, Llama
review_models: Claude
final_integrator: BossMan
cost_tier: 4
last_model_used: DeepSeek
next_model_planned: DeepSeek (Step 5 QA)

## Build Metrics (v3.0)
build_passes: 1
rewrite_scope: none
qa_required: yes
qa_model: DeepSeek
qa_status: pending
escalate_to_computer: no
escalate_to_computer_reason: n/a

## Model Activity Log
- [2026-06-03 10:00] Perplexity Search — research on binance-bot order throttle best practices
- [2026-06-03 10:15] M3 — architecture + Kanban card breakdown + acceptance criteria
- [2026-06-03 10:30] DeepSeek — initial code (rateLimiter.ts, store.ts, policy.ts)
- [2026-06-03 11:00] Llama — bulk cleanup + concurrency test generation
- [TODO] DeepSeek — Step 5 QA pass: edge cases, security, performance, failure modes
- [TODO] Claude — Step 6 long-form docs and runbook (only after QA passes)
- [TODO] BossMan — merge + redeploy + set build_passes/rewrite_scope
```

---

## 3.5 Build Metrics and Perplexity Computer (v3.0)

### Build Metrics

Every build card, when closed, must have these two fields set by the
assigned profile (or BossMan):

| Field | Values | Meaning |
|---|---|---|
| `build_passes` | `1` / `2` / `3+` | How many build attempts the card needed |
| `rewrite_scope` | `none` / `minor` / `major` | How much of the original was rewritten |

- `build_passes: 1` — shipped on the first complete pass
- `build_passes: 2` — one round of fixes (typically Step 4 Llama cleanup
  or a Step 5 QA finding)
- `build_passes: 3+` — multiple rewrites or significant intervention

- `rewrite_scope: none` — original build kept as-is
- `rewrite_scope: minor` — small cleanups, renamed functions, better
  error messages, doc fixes
- `rewrite_scope: major` — significant chunks rewritten, architecture
  changes, or near-full redo

**Monthly review:** once per month, or when Marcelo asks
*"review build metrics"*. Output: one comment on the bossman Kanban
board (or a small report saved to
`~/.hermes/knowledge/BUILD_METRICS_<YYYY-MM>.md`). Content:

1. How many cards were 1-pass builds vs 2 or 3+ passes
2. Which `model_plan:` patterns gave the cleanest one-pass builds
3. Which patterns were the noisiest (most 3+ passes, most major rewrites)
4. Any obvious changes we should make to the Default Build Flow or
   model roles based on this

The metrics feed back into the flow — when a pattern is clear, BossMan
proposes a flow change and updates the canon with Marcelo's approval.

### Perplexity Computer — escalation policy

**Perplexity Computer is NOT part of the everyday default path.** It is
a rare escalation tool with a hard **10,000 credits/month** budget.

**Allowed only on projects with the `escalate_to_computer: yes` flag
on the main project card, approved by Marcelo.** The flag is set by
BossMan only when the project clearly matches one of these patterns:

1. Greenfield, full-stack SaaS builds that include research, code, and
   deployment
2. Large cross-service refactors or migrations
3. Complex, multi-domain research spanning law / finance / tech

For everything else, use the local stack (Perplexity Search + M3 +
DeepSeek / Llama / OpenAI / Claude) per the Default Build Flow.

**Budget cap:** if a project would consume more than ~3,000 credits,
BossMan pre-warns Marcelo before starting. If the monthly cap is
reached, BossMan **stops** using Computer and falls back to the local
stack (or waits for Marcelo's override).

**LBC35 and Computer:** LBC35 **does not** trigger Perplexity Computer.
It reads the `escalate_to_computer:` flag on the handoff packet. If
the flag is `yes` (and approved), LBC35 may use Computer for the
assigned scope. If the flag is `no` (or missing), LBC35 must not
invoke Computer.

---

## 4. Three Blueprint Types

Every card must have one of these types prepended to the card body.

### Blueprint 1: Kickoff Blueprint (NEW projects / major builds)

```yaml
## Blueprint: KICKOFF
goal:                   # what success looks like
deliverables:           # list of concrete outputs
artifacts:              # files/repos/dashboards being created/modified
model_ownership_matrix:  # lead + supporting + reviewer per artifact
approval_gates:         # points requiring Marcelo explicit approval
final_integrator:       # BossMan profile who owns final delivery
```

**Use for:** any new app, dashboard, or major feature

### Blueprint 2: Continuation Blueprint (EXISTING projects / builds)

```yaml
## Blueprint: CONTINUATION
what_exists:            # current state summary
what_is_changing:       # scope of this phase
previous_owners:        # who owned the artifacts previously
new_owners:             # who is taking ownership this phase
handoff_rules:          # rules for transitions between profiles
```

**Use for:** continuing an existing project or adding features to something already running

### Blueprint 3: Triage Blueprint (TROUBLESHOOTING / debugging)

```yaml
## Blueprint: TRIAGE
bug_description:       # what is broken, how to reproduce
affected_artifacts:    # files/repos/services impacted
primary_troubleshooter:# model assigned to root-cause analysis
supporting_models:      # additional models allowed to assist
final_integrator:      # who merges the fix
```

**Use for:** any troubleshooting, bug fix, or investigation

---

## 5. Enforcement Rules

### Required Before Execution

For every card (new, existing, troubleshooting):
1. Create or update the appropriate **Blueprint Type** in the card body
2. Fill in the **Routing Ledger** before assigning execution
3. Assign `lead_model` based on specialization and cost tier
4. Log `last_model_used` as of card creation

### During Execution

| Rule | Enforcement |
|------|-------------|
| One owner per artifact | Only `lead_model` writes; `review_models` comment only |
| No ad-hoc model use | Any model touching this artifact must be in Ledger |
| Cost tier respected | Tier 1/2/3 used first; Tier 4/5 escalation must be justified |
| Activity logged | BossMan adds comment after each model touch |

### After Execution

- `last_model_used` updated on card by BossMan
- `next_model_planned` set or set to "none"
- Artifact saved to `~/.hermes/knowledge/` if Tier 4/5 output is reusable

---

## 6. Paid Model Artifact Reuse Policy

**When a Tier 4/5 model produces a reusable artifact:**

1. **Save the artifact** — save prompts, templates, specs, code modules, docs to `~/.hermes/knowledge/`
2. **Tag it clearly** — filename should reflect what it is (e.g., `SPEC-BINANCE-PRETRADE-HOOK.md`)
3. **Update the Routing Ledger** — note the artifact path in `last_model_used` description
4. **Never pay again** for the same analysis — check `~/.hermes/knowledge/` before re-running Tier 4/5 analysis

**Reuse trigger:** Before any Tier 4/5 call, BossMan checks `~/.hermes/knowledge/` for the same or similar artifact. If found, reuse it and update `last_model_used` instead of re-paying.

---

## 7. SOP for Existing Work

When Marcelo asks to continue or troubleshoot an existing project:

1. **Find the existing Kanban card** — search by project name or ask BossMan to show cards
2. **Set `work_type`** — `existing_build` or `troubleshooting`
3. **Create/Update Blueprint** — use Continuation or Triage type
4. **Fill Routing Ledger** — include `last_model_used` and `next_model_planned`
5. **Only then assign** — assign to builder/ops/trading/content or LBC35 per routing rules
6. **BossMan oversees handoff** — LBC35 receives work exclusively via Kanban handoff packet

---

## 8. Model Activity Log Reference

**Template for card comments after model work:**

```
[MODEL USED]: [model name]
[REASON]: [why this model was chosen — e.g., "deep analysis of SIGREF error", "architecture design"]
[ARTIFACT TOUCHED]: [file path or repo name]
[OUTCOME]: [what was produced or diagnosed]
[NEXT]: [any handoff needed — who continues, what depends on this]
```

**Log format rules:**
- One entry per model activation
- Entries are chronological (newest last)
- BossMan consolidates before archiving card
- Unresolved items → carried forward to `next_model_planned`

---

## 9. Document Locations

| Copy | Path |
|------|------|
| **Hermes knowledge — canonical** | `~/.hermes/knowledge/ROUTING-RULES.md` |
| **Hermes knowledge (this file)** | `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` |
| **Companion worked example** | `~/.hermes/knowledge/MODEL-STACK-WORKFLOWS.md` |
| **AGENTS.md (parent policy)** | `~/.hermes/AGENTS.md` — Model Routing section |
| **OPERATINGBLUEPRINT.md (procedure)** | `~/.hermes/OPERATINGBLUEPRINT.md` — Model Routing block |
| **Obsidian** | `/Users/bigdawg/Desktop/CLAW-Backup/MODEL_ROUTING_WORKFLOW.md` |
| **GitHub** | `BIGDAWG35/BossMan/docs/MODEL_ROUTING_WORKFLOW.md` and `Repos/BossMan/docs/ROUTING-RULES.md` |

**Cross-references (must be updated together):**
- `AGENTS.md` — Model Routing section (parent policy)
- `OPERATINGBLUEPRINT.md` — Model Routing block
- `ROUTING-RULES.md` — Default Build Flow rules
- `MODEL-STACK-WORKFLOWS.md` — End-to-end worked example
- `KNOWLEDGE_REUSE_PIPELINE.md` — paid model artifact reuse section

---

## 10. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-02 | Initial — assembled from AGENTS.md model routing, OPERATING_BLUEPRINT model stack, Marcelo's requirements |
| 1.1 | 2026-06-03 | Migration Notes: MiniMax M2.7 → M3 — see §11 |
| 2.0 | 2026-06-03 | Canon rewrite — Default Build Flow (Perplexity → M3 → primary builder → Llama cleanup → Claude docs). Replaces "MiniMax 2.7 primary brain" framing. New fallback chain, multi-model per-card rules, model_log convention. See §1, §2, §3. |
| 3.0 | 2026-06-03 | **"10/10" canon update.** 5-step flow → 6-step flow with mandatory Step 5 QA pass (DeepSeek red-team, mandatory for critical cards). Perplexity Computer as a rare escalation tool (10k credits/month, `escalate_to_computer: yes` flag). Light build metrics (`build_passes`, `rewrite_scope`) + monthly review. Fallback chain extended to QA. Per-card template updated with `qa_required`, `qa_model`, `qa_status`, `escalate_to_computer`, `build_passes`, `rewrite_scope`. New §3.5. |

---

## 11. Migration Notes — MiniMax M2.7 → M3 (2026-06-03)

### Scope
Direct MiniMax API swap on `https://api.minimax.io/anthropic`. No OpenRouter, no custom proxy, no provider change.

### Changes applied (3 fields, 2 files)

| File | Field | Old | New |
|------|-------|-----|-----|
| `~/.hermes/config.yaml` | `model.default` | `MiniMax-M2.7` | `MiniMax-M3` |
| `~/.hermes/cron/jobs.json` (job `5f3569ba2813`) | `model` | `MiniMax-M2.7` | `MiniMax-M3` |
| `~/.hermes/cron/jobs.json` (job `84896b15c68b`) | `model` | `MiniMax-M2.7` | `MiniMax-M3` |

Commit: `c2e703b` — `chore(hermes): migrate MiniMax from M2.7 to M3 (direct API)`

### Unchanged
- `model.provider`, `model.base_url`, all `fallback_providers`
- Cron `schedule`, `repeat`, `deliver`, `enabled`, `enabled_toolsets`, `workdir`, `origin` for both jobs
- All other 4 cron jobs in `jobs.json`
- SquarePayouts MiniMax block (still in effect)
- PM2 processes, LaunchAgents, skills, router rules

### Behavioral differences (dry-run observed)

| Behavior | M2.7 | M3 |
|----------|------|-----|
| Output style | Tends to narrate the user request before responding | Skips narration; produces output directly |
| Thinking blocks | Not observed in responses | **Emits `type: thinking` blocks** in content array — extraction must skip them |
| Telegram format compliance | Often adds preamble | First line conforms to requested format |

### Known caveat — `invalid_request_error` on multi-line structured prompts

**Symptom:** `{"type":"error","error":{"type":"invalid_request_error","message":"invalid params"}}` returned before processing.

**Trigger pattern:** Multi-line user content with inline emoji-labelled field templates (e.g. `📍 Field: [value]\n📅 Field: [value]`).

**Mitigations:**
- Keep emoji in format specifications (system-side), not in user content
- Reduce nested `\n` in user message body
- Ensure `max_tokens` ≥ 50

**Current cron job safety:**

| Job ID | Type | Safe? |
|--------|------|-------|
| `5f3569ba2813` Morning Pipeline Brief | Single-block instruction; emoji only in format spec, not user content | ✅ Safe |
| `84896b15c68b` CuaDriver Health Monitor | `no_agent: true`; runs shell script — no LLM call | ✅ N/A |

### Rollback (if M3 misbehaves in production)

```bash
# Revert config
hermes config set model.default MiniMax-M2.7

# Revert cron jobs
hermes cron update 5f3569ba2813 --model MiniMax-M2.7
hermes cron update 84896b15c68b --model MiniMax-M2.7

# Verify
hermes config show | head -5
```

**Monitoring:** Watch the next 3 runs of `5f3569ba2813` (8 AM Pacific, weekdays). If briefings show truncated output, missing emoji headers, or `invalid_request_error` in job logs, execute the rollback above.

### Files to update on next cross-doc sync
- `AGENTS.md` — line 40 still says "MiniMax 2.7" (descriptive, not config)
- `OPERATINGBLUEPRINT.md` — model stack table still references M2.7
- `SOUL.md` — model policy references M2.7

These are descriptive references, not config. They do not affect runtime behavior. Update on next routine doc-sync pass; not part of this migration.

---

*This document is the single source of truth for AI stack model routing. Updated by BossMan when model specializations, cost tiers, or routing rules change.*
