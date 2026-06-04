# Routing Rules — BossMan Default Build Flow

**Version:** 2.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** Canonical — governs all work routing

---

## Purpose

This is the canonical rules document for the Default Build Flow and multi-model
routing on every new project, feature, or serious troubleshooting. It supersedes
all earlier "MiniMax 2.7 primary brain" framing and is the single source of truth
that AGENTS.md, OPERATINGBLUEPRINT.md, and the knowledge base point to.

Cross-references:
- `~/.hermes/AGENTS.md` — Model Routing (parent policy)
- `~/.hermes/OPERATINGBLUEPRINT.md` — Operating procedure
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — Model cost tiers + Routing Ledger schema
- `~/.hermes/knowledge/MODEL-STACK-WORKFLOWS.md` — End-to-end worked example
- `~/Repos/BossMan/docs/ROUTING-RULES.md` — GitHub mirror

---

## 1. Model Roles (sharp, opinionated)

| Model | Role |
|---|---|
| **Perplexity Search (Pro)** | Always the first step for any non-trivial build or troubleshooting. Pulls current docs, best practices, API references, and gotchas so we never guess when we can read. |
| **M3 (MiniMax M3)** | Marcelo's thinking and planning brain. Understands the request, defines architecture, breaks work into Kanban cards, writes acceptance criteria and checklists. Default for routine work. BLOCKED for SquarePayouts. |
| **DeepSeek** | Primary heavy-duty coder and reasoning engine. Complex logic, data models, debugging. Also a final sanity pass on critical components. |
| **Llama (Ollama local)** | Cheap grinder. Bulk transforms, scaffolding, refactors, test generation, cleanup. Step 4. |
| **OpenAI** | Production finisher for code and text. Clean, user-facing, production-style output. Polishing, READMEs, user-facing copy. |
| **Claude** | Long-form spec and documentation writer. Final handoff docs, runbooks, multi-page explanations. Step 5 only. |

**SquarePayouts exception (permanent):** SquarePayouts uses Claude, DeepSeek,
and OpenAI only. M3 is BLOCKED for SquarePayouts. Perplexity Search, Llama, and
Claude remain approved for SquarePayouts research and review.

---

## 2. Default Build Flow (every new project or major feature)

### Step 1 — Research (Perplexity Search)
- Use Perplexity Search to gather external info: current docs, best practices,
  API references, and gotchas.
- **Always do this first** for any non-trivial build or troubleshooting. Do not
  guess when we can read.
- Link key sources into the main project card. Future agents should be able to
  trace every design decision back to a cited source.

### Step 2 — Design (M3)
- Use M3 to design the architecture, define the main components, and break work
  into Kanban cards with clear acceptance criteria.
- Save the design and criteria in the main project card body, not just in chat.
- The design should reference the Perplexity sources from Step 1.

### Step 3 — Build (exactly one primary builder per card)

For each build card, pick exactly one primary builder:

| Builder | When to use |
|---|---|
| **DeepSeek** | Complex or critical backend logic, data work, or debugging. |
| **Llama** | Repetitive scaffolding, refactors, or large-volume code edits. |
| **OpenAI** | Output is user-facing, high-risk, or needs polished style. |

Note the primary builder in the card body under a `model_plan:` line.
Example:
```
model_plan: DeepSeek writes initial code → Llama refactors and adds tests → OpenAI only polishes comments and README
```

### Step 4 — Harden and clean up
- Use **Llama** to handle bulk cleanup and test generation.
- Use **DeepSeek** or **OpenAI** only as a final sanity pass on critical
  components. Do not rewrite large chunks that are already acceptable.

### Step 5 — Docs and handoff (Claude)
- Use **Claude** to write long-form docs and runbooks only after the code is stable.
- Claude reads the final code, M3's design notes, and the acceptance criteria,
  then produces concise but complete docs.
- Save final docs to both the project repo (`/docs/`) and Obsidian
  (`~/Desktop/CLAW-Backup/ProjectName - Feature.md`).

---

## 3. Multi-Model Per Card — Controlled

- Do not use more than **two models actively writing** to the same card unless
  you explicitly document a handoff.
- Example of a valid 3-model plan: `DeepSeek writes initial code → Llama
  refactors and adds tests → OpenAI only polishes comments and README`.
- Avoid having multiple models make large, overlapping edits to the same code
  in the same pass. Prefer a clear sequence of ownership.
- Each model in the sequence has a single, narrow job. The next model only
  touches what its predecessor left.

---

## 4. Token and Cost Policy

- Prefer **Llama** and **M3** for high-token grinding and planning.
- Use **DeepSeek**, **OpenAI**, and **Claude** only when their strengths matter
  (complex reasoning, production polish, long docs).
- **Fallback chain** when a paid model fails on quota or billing:
  - Planning / reasoning: **M3 → Llama → DeepSeek**
  - Code / debugging: **DeepSeek → Llama → OpenAI**
  - Docs / specs: **Claude → OpenAI → M3**
- On every card that uses a paid model, log on the card:
  - Which model(s) were used
  - Rough usage (input/output tokens or wall-clock time)
  - The location of key outputs (file paths, knowledge-doc paths, commit SHAs)
- This lets us reuse prior work and avoid re-spending on the same analysis.

---

## 5. Kanban Card Conventions

Every build card in the Hermes Kanban must include:

```yaml
## Blueprint
type: KICKOFF | CONTINUATION | TRIAGE
goal: ...
deliverables: [...]
artifacts: [...]

## Routing
model_plan: <primary builder> [→ <secondary builder>] [→ <polish builder>]
fallback_chain: <which models cover if primary fails>
model_log:
  - model: <name>
    when: <ISO timestamp>
    used_for: <what it did>
    output_location: <file path or commit SHA>
```

The `model_log` is updated after each model touches the artifact. Reviewers and
later agents should be able to reconstruct the chain of custody by reading the
log.

---

## 6. LBC35 and Delegated Executors

LBC35 and other delegated executors **do not choose models**. They execute using
the `model_plan` BossMan put in the handoff packet. If a delegated executor
needs a different model than the one in the packet, it escalates to BossMan
before changing anything.

- LBC35 SOUL says: "I do not pick models. I execute the model plan in the
  handoff packet. If the plan is unclear or the model is unavailable, I
  escalate to BossMan."
- LBC35 may run on whatever model its own runtime is configured for, but the
  *artifacts it produces* must follow the model's role and quality bar from
  this document.

---

## 7. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-08 | Initial routing rules (Hermes-first) |
| 2.0 | 2026-06-03 | Canon rewrite: Default Build Flow (Perplexity → M3 → primary builder → Llama → Claude). Replaces "MiniMax 2.7 primary brain" framing. Adds fallback chain and per-card model_log convention. LBC35 explicitly disowns model choice. |

---

*This document is the single source of truth for the Default Build Flow and
multi-model routing. Updated by BossMan when model specializations, cost
tiers, or routing rules change. Mirrors kept in sync: AGENTS.md,
OPERATINGBLUEPRINT.md, knowledge/MODEL_ROUTING_WORKFLOW.md,
knowledge/MODEL-STACK-WORKFLOWS.md, Repos/BossMan/docs/ROUTING-RULES.md.*
