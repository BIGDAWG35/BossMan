# HERMES_SUBAGENT_BLUEPRINT_INDEX.md — Entry Point

**Status:** CANONICAL — ACTIVE V3.3 INDEX
**Date:** 2026-08-31
**Card:** `t_v33_full_install_v1_20260831`
**Promoted from:** `hermes-sub-agent-master-blueprint.md` (frozen pre-split, archived 2026-08-31)

> **This file is the entry point.** The 2026-06 pre-split `hermes-sub-agent-master-blueprint.md` (12,483 B) has been split into three files per the proven bloat-remedy pattern. **Read this INDEX first.** Then read `HERMES_SUBAGENT_BLUEPRINT_v3.3.md` for live canon. The original pre-split file is preserved verbatim as `HERMES_SUBAGENT_BLUEPRINT_ARCHIVE_2026-08-31.md`.

---

## The real roster (10 lanes — RESOLVED 2026-08-31)

Per operator directive and live-evidence reconciliation, the **real sub-agent roster is 10 lanes**, not 9.

| # | Lane | Live canonical doc | Bytes | Status |
|---|------|--------------------|-------|--------|
| 1 | **builder** | `~/.hermes/knowledge/builder.md` | 8,943 | ACTIVE |
| 2 | **content** | `~/.hermes/knowledge/content.md` | 8,464 | ACTIVE |
| 3 | **ops** | `~/.hermes/knowledge/ops.md` | 10,245 | ACTIVE |
| 4 | **trading** | `~/.hermes/knowledge/trading.md` | 10,216 | ACTIVE (Claude mandatory) |
| 5 | **travel** | `~/.hermes/knowledge/LEARNED_TRAVEL_OS.md` | 7,621 | LIVE (activated 2026-09-01 under `t_travel_lane_profile_runtime_surface_v1_2026MMDD`) |
| 6 | **qa-verification** | `~/.hermes/knowledge/qa-verification.md` | 8,919 | ACTIVE (lane-only-by-design) |
| 7 | **research-intel** | `~/.hermes/knowledge/research-intel.md` | 8,736 | ACTIVE (lane-only-by-design) |
| 8 | **knowledge-canon** | `~/.hermes/knowledge/knowledge-canon.md` | 10,568 | ACTIVE |
| 9 | **self-improvement** | `~/.hermes/knowledge/self-improvement.md` | 8,899 | ACTIVE |
| 10 | **loop-engineering** | `~/.hermes/knowledge/loop-engineering-goals.md` | 11,681 | ACTIVE (dormant/template profile) |

**Reconciliation notes (operator-confirmed):**
- `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` (Tier 2 canon) explicitly lists 10 lanes — matches live roster.
- `AGENTS_ROSTER.md` per-lane canonical-file table lists 9 — missing `loop-engineering-markdown-goals.md`. **AGENTS_ROSTER.md is wrong; correction tracked as a future card** (`t_agents_roster_loop_engineering_row_v1_2026MMDD`).
- Phase 2 stack audit cited 10 lanes — matches live roster.
- Phase-2 stack audit also stated "blueprint says nine" — that referred to the pre-split blueprint's enumeration under the heading "Final sub-agent roster" which listed 9 (missing loop-engineering). **Pre-split blueprint is wrong; the LEARNED_ Tier 2 canon is right.**
- Physical profiles at `~/.hermes/profiles/`: `bossman`, `builder`, `content`, `loop-engineering`, `ops`, `trading`, **`travel`** (7, as of 2026-09-01; see `t_travel_lane_profile_runtime_surface_v1_2026MMDD`). The 4 lanes without physical profiles (`qa-verification`, `research-intel`, `knowledge-canon`, `self-improvement`) are intentionally **lane-only-by-design** per V3.3 Part V — invoked on-demand, no persistent session state.

## MD template count (11 sections — RESOLVED 2026-08-31)

Per operator directive, the canonical MD section count is **11**, not 12 or 13.

- Pre-split blueprint `template.md` specified 13 sections (Sections 1-13).
- All 10 lane docs use 11 sections (Sections 1-11 in the new LIVE blueprint; the original Sections 1 "Title and Status" header and Section 13 "Related Skills Footer" are covered via file-level frontmatter + cross-refs in the body).
- **Decision: 11 is canonical.** All 10 lane docs already conform. The template was over-specified; the actual practice is 11.
- The new `HERMES_SUBAGENT_BLUEPRINT_v3.3.md` documents the 11-section canonical template.

## Honest phase status (RESOLVED 2026-08-31)

The pre-split blueprint listed Phases 0-7. Here is the honest status of each:

| Phase | Pre-split name | Status as of 2026-08-31 |
|-------|----------------|------------------------|
| 0 | Freeze and protect current v3 | ✅ DONE (Rule #8/#9 codified) |
| 1 | Blueprint approval | ✅ DONE (this split) |
| 2 | Inventory current agent files | ✅ DONE (loop-engineering dormant label, qa/research lane-only-by-design confirmed, 4-lane posture card t_subagent_profile_posture_decision_package) |
| 3 | Draft all agent MD files | ✅ DONE (10 lane docs committed) |
| 4 | Wire the handoff model | ✅ DONE (handoff packet contract in LEARNED_SUB_AGENT_MASTER_BLUEPRINT §3) |
| 5 | Knowledge and reuse enforcement | ✅ DONE (knowledge-canon lane + doc-hygiene cron) |
| 6 | Soft activation | ✅ DONE (all 10 lanes activated) |
| 7 | Full adoption and cleanup | ⚠️ IN PROGRESS (V3.3 promotion complete; bounded follow-ups tracked in `V3_3_MASTER_BLUEPRINT_20260831.md` §XII) |

## Files in this split

| File | Purpose | Status |
|------|---------|--------|
| `HERMES_SUBAGENT_BLUEPRINT_INDEX.md` (this file) | Entry point; real roster; honest phase status | ACTIVE |
| `HERMES_SUBAGENT_BLUEPRINT_v3.3.md` | Live canon only — what to read | ACTIVE |
| `HERMES_SUBAGENT_BLUEPRINT_ARCHIVE_2026-08-31.md` | Frozen v3.0 phase plan and rollout history, verbatim | ARCHIVED |
| `hermes-sub-agent-master-blueprint.md` (thin pointer) | Points to INDEX | ACTIVE |

## Recovery

```bash
# Restore pre-split original (if needed):
cp ~/.hermes/profiles/ops/cron/output/t_v33_full_install_snapshot_20260831_235500/hermes-sub-agent-master-blueprint_local_canonical_20260831_235720.pre \
   ~/.hermes/knowledge/hermes-sub-agent-master-blueprint.md
```

---

*Drafted 2026-08-31 PDT under `t_v33_full_install_v1_20260831`.*
