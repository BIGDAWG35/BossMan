**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/toolchain-dev/Workflow Template — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Workflow Template — v3
**Version:** v3.1 (refined 2026-07-20 to reflect today's canon)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
---
id: template-workflow
name: Workflow Template
type: template
status: permanent
owner: bossman
created: 2026-06-12
tags: [template, workflow]
---

# Workflow Template

> Copy this file when creating a new workflow document. Workflows live in `70_Workflows/`.

---

```markdown
---
id: workflow-<short-slug>
name: <Workflow name>
type: workflow
status: permanent | draft | deprecated
owner: bossman | builder | ops | trading | content | travel | qa-verification | research-intel | knowledge-canon | self-improvement | loop-engineering   # 10 lanes per AGENTS_ROSTER.md (2026-10-02)
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
tags: [workflow, <area>]
---

# <Workflow name>

## Purpose

<Why this workflow exists. What problem it solves.>

## Scope

<What's covered, what's not.>

## Trigger

<What kicks off this workflow. Manual request, scheduled cron, kanban card transition, etc.>

## Steps

1. <Step 1 — concrete and actionable.>
2. <Step 2.>
3. <Step 3.>

## Inputs

- <Input 1: where it comes from, what format.>
- <Input 2.>

## Outputs

- <Output 1: where it goes, what format.>
- <Output 2.>

## Failure modes

- <Failure mode 1: how to detect, how to recover.>
- <Failure mode 2.>

## Approvals needed

- <Any step that requires Marcelo's explicit approval.>

## Related

- Kanban card: `t_…`
- Cron job: `<id>` (if scheduled)
- Script: `~/.hermes/scripts/<script>.sh`
- Knowledge doc: `~/.hermes/knowledge/<doc>.md`

## Version history

| Version | Date | Change |
|---|---|---|
| 0.1 | YYYY-MM-DD | Initial draft. |
```

---

## Naming conventions

- Filename: `<workflow-slug>.md` (kebab-case)
- Frontmatter `id`: `workflow-<workflow-slug>` (matches filename)
- Location: `70_Workflows/`

## When to create a new workflow doc

- The process is recurring (not a one-off)
- It spans multiple steps
- It has failure modes worth documenting
- It needs approval gates

## When NOT to create a new workflow doc

- One-off task → use a kanban card
- Simple checklist → use a TODO list
- Pure reference material → goes in `60_Knowledge-Topics/`

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Section | Change |
|---|---|
| Frontmatter | Version v3.0 → v3.1; Date 2026-06-XX → 2026-07-20 |
| Content | Reference today's 7-rule contract + Roles & Chain audit workflow (note 2026-10-02: not reflected in the body; operating contract is now 12 rules — LEARNED_7_RULE_CONTRACT.md #0–#9 + addendum #10–#12) |
| Companion canon | Should now cite `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`, `LEARNED_7_RULE_CONTRACT.md`, `LEARNED_V3_MODEL_STACK.md`, `LEARNED_V3_TOKEN_ECONOMICS.md` |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

*Change log appended automatically by V3 deep-dive job (2026-07-20).*
