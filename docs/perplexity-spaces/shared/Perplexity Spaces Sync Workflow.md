**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/LEARNED_DOC_PIPELINE.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_DOC_PIPELINE.md — Where Every Doc Lives, and Which Copy Wins

**Status:** CANON (created 2026-10-02, Hermes MD audit Phase 4, Perplexity Computer + BossMan; Marcelo-approved).
**Replaces:** the v3 Spaces flow (`sync_perplexity_spaces.sh` + `~/.hermes/config/spaces_file_mapping.json` + the weekly "Hermes → Perplexity Spaces Refresh" agent job). Those used OpenClaw-era sources that no longer exist, and they kept rebuilding stale v3 copies.

## One rule
**Edit the canon copy only. Every other copy is generated from it and gets overwritten.**

## Layers (top wins)
| Layer | Path | Edited by | Notes |
|---|---|---|---|
| Kernel (loaded every session) | `~/.hermes/SOUL.md` (≤20K chars), `~/.hermes/AGENTS.md` (thin pointer), `~/.hermes/memories/` | BossMan with Marcelo's OK | Root `~/.hermes/MEMORY.md` / `USER.md` are pointer stubs. Hermes loads `memories/`. |
| Canon knowledge | `~/.hermes/knowledge/*.md` | BossMan / sub-agents | Map: `LEARNED_INDEX.md` (domains) + `LEARNED_INDEX_CATALOG.md` (all 149+ root docs, one winning file per topic). |
| Canon mirrors (read-only) | `~/Obsidian/Hermes/V3-Canon/`, `~/Obsidian/Hermes/{SOUL,AGENTS,LEARNED_SOUL_DETAILS}.md`, `~/Repos/BossMan/docs/hermes-canon/` | **nobody**. `canon_mirror_sync.py` copies them | Pair list: `~/.hermes/config/canon_mirrors.json`. `hermes-canon-drift-check.sh` double-checks them weekly. |
| Perplexity Projects upload folder | `~/Desktop/spaces/<project>/` (9 folders) | canon-bound files: `build_spaces_v4.py`; space-only files: edit here | Map: `~/.hermes/config/spaces_v4_map.json`. The header line of each file says `auto-built from canon` or `space-only doc: this copy is the canon`. |
| Spaces mirrors (read-only) | `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/` | **nobody**. `build_spaces_v4.py` rsyncs them from `~/Desktop/spaces/` | Old v3 content is archived at `~/.hermes/archive/spaces-v3-20261002/` and `~/Obsidian/Hermes/_Archive/Perplexity Spaces v3 (2026-10-02)/`. |

## The 9 Perplexity Projects ↔ folders
Agent OS = `agent-os` · Shared = `shared` · System Health = `system-health` · Ops Processes = `ops-processes` · Toolchain & Dev = `toolchain-dev` · Knowledge & Learning = `knowledge-learning` · Projects & Mission Control = `projects-mission-control` · Trading Ops = `trading-ops` · Finance & Money Ops = `finance-money-ops`.
Each folder starts with `00 - Current State (2026-10-01).md`, which wins over older files in that project.

## Automation
| Job | Schedule | What it does | Output |
|---|---|---|---|
| `spaces-v4-build` (cron id 7203f2330d92, no-agent) | daily 06:00 | `build_spaces_v4.py`: rebuild canon-bound files in `~/Desktop/spaces`, rsync the 3 mirrors, commit + push the BossMan repo | Silent unless files changed. If they did, it lists which projects need a re-upload and appends them to `~/Desktop/spaces/PENDING_UPLOADS.md`. |
| `canon-mirror-sync` (no-agent) | daily 06:10 | `canon_mirror_sync.py`: copy canon → Obsidian + repo mirrors | Silent unless a mirror was refreshed. |
| `hermes-canon-drift-check-weekly` (no-agent) | Sun 08:00 | `hermes-canon-drift-check.sh` | Silent when clean; opens a kanban card on drift. |
| Weekly v3 "Hermes → Perplexity Spaces Refresh" (ff0b6860cba5) | — | **paused 2026-10-02** (v3 sources) | — |

## How to change a doc
1. Is it canon (`~/.hermes/knowledge/` or kernel)? Edit it there, back it up first, never delete text (add a dated note), and the mirrors and Desktop copies follow at 06:00/06:10.
2. Is it a space-only doc (header says space-only)? Edit it in `~/Desktop/spaces/<project>/`. The mirrors follow at 06:00.
3. New canon doc that should go to a Perplexity Project: add a row to `spaces_v4_map.json` (`"kind": "canon"`, `"source": "knowledge/X.md"`).
4. New mirrored canon doc: add a pair to `canon_mirrors.json`.
5. Uploading to Perplexity is still manual (there is no API for Project files). Use `PENDING_UPLOADS.md` as the to-do list. Upload `00 - Current State` first.

## Retired (history only)
`sync_perplexity_spaces.sh` (v3), `spaces_file_mapping.json` (v3), `weekly-spaces-refresh.sh`, `build-weekly-bundle.py` / `emit-telegram-weekly-bundle.py` payload bundles, `~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md` (gone), `~/Desktop/Openclaw Brain/` (moved to `~/Desktop/Archive 2026-10-02/`).
