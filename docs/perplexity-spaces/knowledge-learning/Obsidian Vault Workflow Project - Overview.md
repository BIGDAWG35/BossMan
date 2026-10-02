**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/knowledge-learning/Obsidian Vault Workflow Project — Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Obsidian Vault Workflow Project — Overview
**Version:** v3.1
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3.1-aligned (v3 vault refactor COMPLETE; mirrors V3-Canon + GitHub hermes-canon)
---
id: PROJ-2026-06_obsidian-vault-workflow
name: Obsidian Vault Workflow
status: active   # note 2026-10-02: project is Done (2026-06-12); v3 refactor COMPLETE 2026-07-20
owner: bossman
created: 2026-06-12
tags: [obsidian, workflow, knowledge-management, documentation]
---

# Obsidian Vault Workflow

## One-line summary

Codify the permanent layout, save order, and audit cadence for the Hermes Obsidian vault at `~/Obsidian/Hermes/`, mirrored from Hermes knowledge.

## Status

✅ **Done 2026-06-12. v3 vault refactor COMPLETE (Permanent 2026-07-20).** All deliverables shipped; v3.1 mirror pattern in place.

**v3 vault refactor COMPLETE (Permanent 2026-07-20):** The 4 locked V3 canon files now mirror through 3 layers:
1. **Hermes canon** (`~/.hermes/knowledge/`) — single source of truth, edit-only-here
2. **Obsidian `Hermes/V3-Canon/`** — human-readable mirror (Obsidian vault at `~/Obsidian/Hermes/`)
3. **GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/`** — version-controlled backup stream

Drift detection via `~/.hermes/scripts/hermes-canon-drift-check.sh` schedules for first run 2026-07-21. Mirror metadata normalizer at `~/.hermes/scripts/lib/strip_mirror_metadata.awk` strips YAML frontmatter + mirror/canon blockquotes + leading `---` separators before md5 hash comparison.

Monthly vault audit (1st, 09:00 PT) + bi-monthly review (every other 1st, 10:00 PT) remain in effect for the broader vault.

## Scope

**In scope:** 11-folder layout, project structure, save order, monthly audit, bi-monthly review, conflict resolution rules, change management.

**Out of scope:** Spaces sync workflow (separate doc), kanban workflow (separate), memory hygiene (separate).

## Perplexity Spaces and Slash Commands (v3.2 — 2026-06-23; note: file header says v3.1 dated 2026-07-20 — version labels are out of order)

Perplexity Spaces live at the **end of the save order**, not the start. The canonical direction for every project doc is `~/.hermes/knowledge/` → `~/Obsidian/Hermes/` → `~/Repos/BossMan/docs/` (commit) → Spaces. Spaces content is a downstream consumer of canon, not a source.

**Slash commands (`/goal`, `/task`, `/phase`, `/learn`, `/memory`, `/review`, `/verify`, `/evidence`, `/sync`)** are optional control-plane markers. They live primarily in Spaces as intent hints — Spaces is where human-authored drafts, weekly research summaries, and ad-hoc reasoning accumulate, so it is the natural place to mark "this should become a goal / a task / a phase entry / a LEARNED rule / a memory candidate / a review / a Step-5 verification / an evidence reference / a sync action". The full 9-slash table lives in **PHASEREPORT.md v3.2 §"Slash Commands for Phase Logs"** — this paragraph only documents the resolution flow. They never bypass the 5-carve-out approval gate (infra install / public port / security / vendor-billing / product-direction) and they never substitute for a real artifact on the kanban board or in `~/.hermes/knowledge/`.

**How Spaces content and slash markers are resolved (v3.2):**
1. Hermes parses prose first; slash markers are hints.
2. `bash ~/.hermes/scripts/sync_perplexity_spaces.sh` runs on its weekly cadence (or on-demand) and re-reads Spaces content into the local mirror. (history — superseded 2026-10-02: script retired; Spaces are one-way downstream: canon `~/.hermes/knowledge/` → `~/Desktop/spaces/<folder>/` (rebuilt by `~/.hermes/scripts/build_spaces_v4.py`) → read-only mirrors `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/`)
3. Any slash marker that maps to a real artifact is acted on per the marker rules in PHASEREPORT.md v3.2, LEARNED.md v3 L-006, and Memory Policy v3.2:
   - `/goal`, `/task` → create or update a `t_<id>` on the kanban board; `/task` defaults to `todo`.
   - `/phase` → append a `## YYYY-MM-DD — <title>` to PHASEREPORT.md (or drive the kanban card that produces one).
   - `/learn` → queue candidate rule for the next LEARNED promotion review; merge into `~/.hermes/knowledge/` first.
   - `/memory` → queue candidate fact for the next memory-health-check cycle (per Memory Policy v3.2).
   - `/review` → run the appropriate skill (`crypto-weekly-review`, `obsidian-vault-review`, etc.) and return a brief.
   - `/verify` → require a `step5-verdict-*.json` artifact under `~/Projects/BossMan/docs/verdicts/` (verify path — elsewhere the repo is `~/Repos/BossMan/`) before any `done` report is accepted.
   - `/evidence` → pin absolute paths on the card.
   - `/sync` → run the save-order pipeline `~/.hermes/knowledge/` → Obsidian → BossMan repo → Spaces.
4. Slash markers without a target artifact are logged as "slash-without-target" on the closest active kanban card and dropped.
5. **`~/.hermes/knowledge/` remains canonical at all times.** Spaces content and slash markers are interpreted and merged back via the sync script; they never redefine what is canonical. If a Space-only finding contradicts `~/.hermes/knowledge/`, the canonical doc wins and the Space finding is re-staged on the next kanban card.
6. **A Perplexity Space never writes directly into `~/.hermes/knowledge/`.** All canon writes flow through the resolution chain above (PHASEREPORT.md v3.2 → LEARNED.md v3 L-006 → Memory Policy v3.2 → this section). Direct Space → canon writes are forbidden.

## Key dates

- Kickoff: 2026-06-12
- Done: 2026-06-12
- First monthly audit: 2026-07-01
- First bi-monthly review: 2026-07-01

## Links

- Kanban card: `t_a08658cc`
- Canonical doc: `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` (not present in canon copy 2026-10-02 — verify; space copy: Shared/Obsidian Vault Workflow.md)
- Mirror: [[Obsidian Vault Workflow]]
- Dashboard: [[Dashboard]]
- Phase report entry: [[50_Phase-Reports/PHASEREPORT]]

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Change | Notes |
|---|---|
| Frontmatter v3.0 → v3.1 | Date 2026-06-16 → 2026-07-20; status flags vault refactor COMPLETE |
| Added "v3 vault refactor COMPLETE" callout | 3-mirror pattern documented: Hermes canon → Obsidian V3-Canon → GitHub hermes-canon |
| Added drift-detection references | `hermes-canon-drift-check.sh` (first run 2026-07-21) + `strip_mirror_metadata.awk` normalizer |
| Status section updated | v3.1 mirror pattern noted; monthly audit + bi-monthly review cadence preserved |

**Mirror:** This file is a read-only mirror of `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_obsidian-vault-workflow/PROJ-Overview.md`. Canon state lives in `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md`. Drift-check via `~/.hermes/scripts/hermes-canon-drift-check.sh` schedules for first run 2026-07-21.
