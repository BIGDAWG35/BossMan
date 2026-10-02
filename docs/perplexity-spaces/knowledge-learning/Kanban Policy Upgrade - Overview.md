**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/knowledge-learning/Kanban Policy Upgrade — Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Kanban Policy Upgrade — Overview
**Version:** v3.1
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3.1-aligned (policy LOCKED at v3 per 2026-06-12 hard rule)
---
id: PROJ-2026-06_kanban-policy-upgrade
name: Kanban Policy Upgrade
status: active   # note 2026-10-02: project is Done (2026-06-12) — policy itself is permanent/locked
owner: bossman
created: 2026-06-12
tags: [kanban, policy, automation]
---

# Kanban Policy Upgrade

## One-line summary

Codify the rule that every real Telegram request creates or updates a kanban card on the bossman board. (2026-10-02: applies equally to Discord — co-primary transport — and to Perplexity intake via `~/.hermes/perplexity-intake/`.) Audit and fix illegal statuses, project tags, and ghost runs.

## Status

✅ **Done 2026-06-12. LOCKED at v3 (Permanent 2026-06-12, restated 2026-07-20).** All deliverables complete.

**LOCKED-at-v3 (Permanent 2026-06-12 hard rule):** Kanban policy is now a permanent carve-out. Any future change to the kanban policy (status taxonomy, project-tagging rules, inline-gate behavior, ghost-run detection) requires an explicit Marcelo 3-bucket decision (architecture / runtime / source-of-truth). Drift signals surface as `t_drift_fix_kanban_policy_…` kanban cards; the loop never silently rewrites a rule.

**Why locked:** Without a board, work vanishes into chat. The 30 illegal statuses, 6 ghost task_runs, and 73 untagged active cards fixed on 2026-06-12 prove the cost of un-boarded work. Locking the policy prevents accidental regression by future sessions.

## Scope

**In scope:** inline Telegram intake gate, project tag on every card, legal status set only, multi-project 24×7 structure, off-board work detection, snapshot script.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh. (note 2026-10-02: this bullet overwrote an original scope line during the LBC35 cleanup; LBC35 was never in kanban-policy scope)

## Key dates

- Kickoff: 2026-06-12
- Done: 2026-06-12

## Links

- Kanban card: `t_kanban_policy_upgrade_20260612` (done)
- Phase report entry: [[50_Phase-Reports/PHASEREPORT]] 2026-06-12
- Canonical rules: `~/.hermes/SOUL.md § Kanban — All Work Goes On The Board`
- Scripts: `kanban-snapshot.sh`, `kanban-status-migration.py`, `kanban-project-backfill.py`, `kanban-runs-gc.py`
- Inline gate: `telegram-intake-gate.sh` (work partner project)

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Change | Notes |
|---|---|
| Frontmatter v3.0 → v3.1 | Date 2026-06-16 → 2026-07-20; status flags LOCKED-at-v3 |
| Added "LOCKED at v3" callout in Status section | Explicit statement of the 2026-06-12 hard rule; restated 2026-07-20 |
| Added "Why locked" rationale | References the 30 illegal statuses, 6 ghost runs, 73 untagged cards that triggered the policy |
| Future-edit guard | Any policy change requires explicit Marcelo 3-bucket decision; drift surfaces as `t_drift_fix_kanban_policy_…` kanban card |

**Mirror:** This file is a read-only mirror of `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_kanban-policy-upgrade/PROJ-Overview.md`. Canon state lives in `~/.hermes/SOUL.md § Kanban — All Work Goes On The Board` and `~/.hermes/knowledge/LEARNED.md` L-003 (LEARNED.md not in canon 2026-10-02 — see LEARNED_INDEX.md). Drift-check via `~/.hermes/scripts/hermes-canon-drift-check.sh` schedules for first run 2026-07-21.
