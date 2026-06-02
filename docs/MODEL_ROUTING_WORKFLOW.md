# MODEL_ROUTING_WORKFLOW.md
**Version:** 1.0
**Date:** 2026-06-02
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — governs all work routing

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

## 1. Model Specialization Table

### Cost Tier Map

| Tier | Cost | Models | Notes |
|------|------|--------|-------|
| **Tier 1** | FREE | Hermes knowledge, Obsidian, GitHub | Reuse existing artifacts |
| **Tier 2** | FREE | Ollama / Llama / Qwen (local) | Local inference, no API cost |
| **Tier 3** | MINIMAX MAX | MiniMax 2.7 | Included in plan, no per-call cost |
| **Tier 4** | PAID | DeepSeek, OpenAI, Claude | Per-token/session cost |
| **Tier 5** | PAID HIGH | Perplexity Computer | Credits for complex multi-step workflows |

### Model Roles and Specializations

| Model | Role | Specialization | When to Use |
|-------|------|----------------|-------------|
| **MiniMax 2.7** | Primary orchestrator | High-volume workhorse: code, refactors, scripts, automation, reasoning | Routine coding, system commands, general reasoning — DEFAULT |
| **Ollama / Llama / Qwen** | Local drafts | Summarization, preprocessing, text/code drafts, offline tasks, repetitive patterns | Drafting, local-only/private tasks, pattern repetition — use Tier 1/2 before escalating |
| **Perplexity Search** | Live web research | Market scans, up-to-date info, citations, fact verification | Any task needing current data, vendor info, competitor research |
| **Perplexity Computer** | Multi-step Mac workflows | Complex cross-app/browser workflows, file manipulation, GUI automation | Only when task complexity justifies credit cost — browser + Mac Studio control |
| **DeepSeek** | Analytical specialist | Deep reasoning, edge-case analysis, debugging, cost-efficient advanced logic | When MiniMax hits ceiling; deep analysis; complex debugging — Tier 4 workhorse |
| **OpenAI** | Structured output | JSON specs, documentation, production formatting, clean synthesis | Structured outputs, API specs, production docs — use instead of paid when possible |
| **Claude** | Long-form reasoning | Architecture, system design, high-stakes planning, complex UX flows | Architecture, UX flows, strategy docs, high-stakes decisions — use sparingly |
| **OpenClaw / LBC35** | Delegated executor | Execution under BossMan direction ONLY | Only when explicitly assigned via Kanban handoff packet |

### Paid Model Policy

**DeepSeek, OpenAI, Claude (Tier 4) and Perplexity Computer (Tier 5):**
- Use only when Tier 1/2/3 cannot deliver quality
- Treat ALL outputs as canonical artifacts — save prompts, templates, docs, code
- **Artifact reuse mandate:** If a Tier 4/5 model produced a reusable artifact (spec doc, architecture diagram, prompt template, code module), save it to `~/.hermes/knowledge/` so future tasks reuse it without paying again
- Never pay for the same analysis twice

**Perplexity Search** (Tier 4):
- Always available for web research
- Results feed into research synthesis workflows
- Key findings saved to `~/.hermes/knowledge/` tagged with `[RESEARCH]`

### SquarePayouts Model Restriction (Permanent)

MiniMax 2.7 is **BLOCKED** for all SquarePayouts work. Use Claude/DeepSeek/OpenAI/Perplexity/Computer Use only.

---

## 2. Cost-Aware Routing Rules

### Tier Escalation Chain

```
TIER 1  → Check existing artifacts (Hermes knowledge, Obsidian, GitHub)
     ↓ (if nothing relevant found)
TIER 2  → Ollama / Llama / Qwen local
     ↓ (if local insufficient)
TIER 3  → MiniMax 2.7
     ↓ (if MiniMax hits ceiling)
TIER 4  → DeepSeek / OpenAI / Claude
     ↓ (if task requires multi-step GUI/browser cross-app)
TIER 5  → Perplexity Computer
```

**Rules:**
- Always try Tier 1 and Tier 2 first when quality allows
- Escalate to Tier 3+ only when necessary
- For Tier 4/5 calls, document the output artifact so it amortizes future costs

### Model Selection by Work Type

| Work Type | Primary | Secondary | Notes |
|-----------|---------|-----------|-------|
| Routine code, refactors, scripts | MiniMax 2.7 | Ollama (draft) | Default path |
| Architecture, system design | Claude | DeepSeek | High-stakes; use sparingly |
| Deep analysis, debugging | DeepSeek | MiniMax 2.7 | Primary analytical |
| Structured output, JSON, specs | OpenAI | Claude | Production-ready |
| Live web research, market data | Perplexity Search | Perplexity Search | Always available |
| Complex Mac/browser workflows | Perplexity Computer | Computer Use (BossMan) | Credits justified only |
| Text drafting, summarization (local/private) | Ollama | MiniMax 2.7 | No API cost |
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
lead_model:          # primary model for this card (MiniMax|DeepSeek|Claude|OpenAI|Perplexity|Local)
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
supporting_models: MiniMax 2.7, Claude
review_models: Claude
final_integrator: BossMan
cost_tier: 4
last_model_used: MiniMax 2.7
next_model_planned: DeepSeek

## Model Activity Log
- [2026-06-02 09:15] MiniMax 2.7 — initial diagnosis of SIGREF error in server.js line 849
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
| **Hermes knowledge (canonical)** | `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` |
| **Obsidian** | `/Users/bigdawg/Desktop/CLAW-Backup/MODEL_ROUTING_WORKFLOW.md` |
| **GitHub** | `BIGDAWG35/BossMan/docs/MODEL_ROUTING_WORKFLOW.md` |

**Cross-references (must be updated together):**
- `HERMES_MASTER_BLUEPRINT.md` — routing ledger schema + model table
- `OPERATING_BLUEPRINT.md` — routing rules + cost tiers
- `SOUL.md` — model policy embedded in orchestration layer
- `KNOWLEDGE_REUSE_PIPELINE.md` — paid model artifact reuse section

---

## 10. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-02 | Initial — assembled from AGENTS.md model routing, OPERATING_BLUEPRINT model stack, Marcelo's requirements |

---

*This document is the single source of truth for AI stack model routing. Updated by BossMan when model specializations, cost tiers, or routing rules change.*
