# MODEL_ROUTING_WORKFLOW.md
**Version:** 2.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — governs all work routing

> **v2.0 (2026-06-03) — Default Build Flow canon rewrite.** This document has
> been updated to align with the new routing canon in `~/.hermes/AGENTS.md`
> and the canonical `~/.hermes/knowledge/ROUTING-RULES.md`. The "MiniMax 2.7
> primary brain" framing is replaced with the **M3 / DeepSeek / Llama / OpenAI
> / Claude / Perplexity** role split. The Default Build Flow is now:
> **Perplexity Search (Step 1) → M3 (Step 2) → primary builder (Step 3) →
> Llama cleanup (Step 4) → Claude docs (Step 5)**. The paid-model fallback
> chain is now: planning M3 → Llama → DeepSeek; coding DeepSeek → Llama →
> OpenAI; docs Claude → OpenAI → M3. v1.0 and v1.1 entries are preserved in
> the version history at the bottom for traceback. The companion worked
> example is in `MODEL-STACK-WORKFLOWS.md`.

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

## 1. Model Specialization Table (Permanent — 2026-06-03)

### Cost Tier Map

| Tier | Cost | Models | Notes |
|------|------|--------|-------|
| **Tier 1** | FREE | Hermes knowledge, Obsidian, GitHub | Reuse existing artifacts |
| **Tier 2** | FREE | Ollama / Llama / Qwen (local) | Local inference, no API cost |
| **Tier 3** | INCLUDED | M3 (MiniMax M3) | Default orchestrator and planning brain |
| **Tier 4** | PAID | DeepSeek, OpenAI, Claude | Per-token/session cost — used surgically |
| **Tier 5** | PAID HIGH | Perplexity Computer | Credits for complex multi-step workflows |
| **Step 1 (always)** | PAID | Perplexity Search (Pro) | First step for any non-trivial build or troubleshooting |

### Model Roles and Specializations

| Model | Role | Specialization | When to Use |
|-------|------|----------------|-------------|
| **Perplexity Search (Pro)** | First-step research | Current docs, API references, best practices, gotchas | **Step 1 of every non-trivial build or troubleshooting.** Never guess when we can read. |
| **M3 (MiniMax M3)** | Primary thinking and planning brain | Architecture, Kanban card design, acceptance criteria, complex reasoning | **Step 2 of every new project or major feature.** Default for routine work. |
| **DeepSeek** | Heavy-duty coder and reasoning engine | Complex logic, data models, debugging, edge-case analysis | Primary builder for complex or critical backend logic, data, or debugging. Final sanity pass. |
| **Llama (Ollama local)** | Cheap grinder | Bulk transforms, scaffolding, refactors, test generation, cleanup | **Step 4 harden and clean up.** High-token grinding, repetitive work. |
| **OpenAI** | Production finisher | Clean code, user-facing copy, polished style, final code finishing | Primary builder when output is user-facing or high-risk. Final polish only. |
| **Claude** | Long-form documentation writer | Runbooks, handoff docs, multi-page explanations, architecture reviews | **Step 5 only** — after the code is stable. |
| **OpenClaw / LBC35** | Delegated executor | Execution under BossMan direction ONLY — **does not choose models** | Only when explicitly assigned via Kanban handoff packet. |

### Paid Model Policy

**DeepSeek, OpenAI, Claude (Tier 4) and Perplexity Computer (Tier 5):**
- Use only when Tier 1/2/3 (and the Step-1 Perplexity Search) cannot deliver quality
- Treat ALL outputs as canonical artifacts — save prompts, templates, docs, code
- **Artifact reuse mandate:** If a Tier 4/5 model produced a reusable artifact (spec doc, architecture diagram, prompt template, code module), save it to `~/.hermes/knowledge/` so future tasks reuse it without paying again
- Never pay for the same analysis twice

**Perplexity Search** (Step 1, always run for non-trivial work):
- Always available for web research
- Results feed into the M3 design step (Step 2)
- Key sources linked into the main project card

### SquarePayouts Model Restriction (Permanent)

**M3 is BLOCKED for all SquarePayouts work.** Use Claude / DeepSeek / OpenAI / Perplexity / Llama for SquarePayouts. Perplexity Search, Llama, and Claude remain approved for SquarePayouts research and review.

---

## 2. Cost-Aware Routing Rules

### Default Build Flow (5 steps)

```
STEP 1  → Perplexity Search (always first for non-trivial work)
     ↓
STEP 2  → M3 designs architecture, breaks work into Kanban cards, writes acceptance criteria
     ↓
STEP 3  → Primary builder (DeepSeek | Llama | OpenAI) per card; one per card by default
     ↓
STEP 4  → Llama harden and clean up; DeepSeek/OpenAI only as final sanity pass
     ↓
STEP 5  → Claude long-form docs and runbooks (only after code is stable)
```

### Tier Escalation Chain (when a paid model fails on quota/billing)

```
Planning / reasoning:  M3 → Llama → DeepSeek
Code / debugging:      DeepSeek → Llama → OpenAI
Docs / specs:          Claude → OpenAI → M3
```

**Rules:**
- Always try Tier 1 (knowledge), Tier 2 (local), and Tier 3 (M3) first when quality allows
- Escalate to Tier 4+ only when necessary
- For Tier 4/5 calls, document the output artifact so it amortizes future costs
- **Always start with Perplexity Search** for any non-trivial work, regardless of tier

### Model Selection by Work Type

| Work Type | Primary | Secondary | Notes |
|-----------|---------|-----------|-------|
| Research, current docs, gotchas | Perplexity Search | M3 | Always Step 1 |
| Architecture, planning, Kanban card design | M3 | Llama | Step 2 — bossman brain |
| Complex or critical backend logic, data, debugging | DeepSeek | M3 | Step 3 primary builder for heavy code |
| Repetitive scaffolding, refactors, large-volume edits | Llama | — | Step 3 primary builder for bulk |
| User-facing code, high-risk output, polished style | OpenAI | DeepSeek | Step 3 primary builder for shipping copy |
| Bulk cleanup, test generation | Llama | — | Step 4 |
| Final sanity pass on critical components | DeepSeek or OpenAI | — | Step 4 — do NOT rewrite large acceptable chunks |
| Long-form docs, runbooks, handoff | Claude | OpenAI | Step 5 — after code is stable |
| Live web research, market data | Perplexity Search | Perplexity Search | Always available |
| Complex Mac/browser workflows | Perplexity Computer | Computer Use (BossMan) | Credits justified only |
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

### Routing Ledger Example (Troubleshooting card)

```yaml
## Routing Ledger
work_type: troubleshooting
primary_artifact: binance-bot/server.js
lead_model: DeepSeek
supporting_models: M3, Claude
review_models: Claude
final_integrator: BossMan
cost_tier: 4
last_model_used: M3
next_model_planned: DeepSeek

## Model Activity Log
- [2026-06-02 09:15] M3 — initial diagnosis of SIGREF error in server.js line 849
- [2026-06-02 09:20] DeepSeek — root cause analysis: liveBal variable undefined at startup
- [TODO] Claude — review proposed fix before implementation
- [TODO] BossMan — merge fix + redeploy
```

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
