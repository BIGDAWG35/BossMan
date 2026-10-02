**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/toolchain-dev/Project Template — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Project Template — v3
**Version:** v3.1 (refined 2026-07-20 to reflect today's canon)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
---
id: template-project
name: Project Template
type: template
status: permanent
owner: bossman
created: 2026-06-12
tags: [template, project]
---

# PROJ-Overview.md Template

> Copy this file when starting a new project. Required frontmatter fields marked ⭐.

---

```markdown
---
id: ⭐ PROJ-YYYY-MM_<slug>            # unique, stable, format: PROJ-YYYY-MM_<slug>
name: ⭐ <Human-readable name>
status: ⭐ active | on-hold | archived
owner: ⭐ bossman | builder | ops | trading | content | travel | qa-verification | research-intel | knowledge-canon | self-improvement | loop-engineering   # 10 lanes per AGENTS_ROSTER.md (2026-10-02)
created: ⭐ YYYY-MM-DD
tags: [tag1, tag2]                     # lowercase keywords
---

# <Project name>

## One-line summary

<One sentence: what this project is and why it exists.>

## Status

<Current state — what's done, what's in progress, what's blocked.>

## Scope

<In scope / out of scope.>

## Key dates

- Kickoff: YYYY-MM-DD
- Target: YYYY-MM-DD
- <milestone 1>: YYYY-MM-DD
- <milestone 2>: YYYY-MM-DD

## Team / owners

- BossMan: <name>
- Builder: <name>
- Marcelo: <name>

## Links

- Kanban epic: `t_…`
- Blueprint: `~/.hermes/knowledge/<doc>.md`
- Repo: `~/Projects/<repo>/`
- Live URL: <url>

## Notes

<Free-form notes.>
```

---

## Folder structure conventions

- Project lives at `40_Projects/{Active,On-Hold,Archive}/PROJ-YYYY-MM_<slug>/`.
- `PROJ-Overview.md` (required) — this file.
- `PROJ-Timeline.md` (recommended) — chronological log of events, decisions, milestones.
- `PROJ-Decisions.md` (recommended) — architectural and product decisions with rationale.
- `PROJ-Notes.md` (optional) — free-form notes, links, references.
- `PROJ-Screenshots/` (optional) — images, diagrams.
- Subfolders allowed for component-level notes (e.g. `docs/`, `tests/`, `scripts/`).

## Lifecycle

| State | Where it lives | How to move |
|---|---|---|
| Active | `40_Projects/Active/` | Default. |
| Paused | `40_Projects/On-Hold/` | BossMan moves on kanban-card approval or 60+ days of no activity. |
| Completed or killed | `40_Projects/Archive/` | BossMan moves on completion or kill. |
| > 2 years in Archive | `90_Archive/` | BossMan moves during bi-monthly review. |

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Section | Change |
|---|---|
| Frontmatter | Version v3.0 → v3.1; Date 2026-06-XX → 2026-07-20 |
| Content | Reference today's V3 folder convention (~/Desktop/V3/) for Perplexity Spaces mirror (history — superseded 2026-10-02: ~/Desktop/V3 gone; upload folder is ~/Desktop/spaces/<folder>/) |
| Companion canon | Should now cite `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`, `LEARNED_7_RULE_CONTRACT.md`, `LEARNED_V3_MODEL_STACK.md`, `LEARNED_V3_TOKEN_ECONOMICS.md` |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

*Change log appended automatically by V3 deep-dive job (2026-07-20).*
