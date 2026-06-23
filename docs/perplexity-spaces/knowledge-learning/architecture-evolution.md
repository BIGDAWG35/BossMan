# PHASE 4 — Multi-Project OS + Loop Engine

**Version:** 1.0
**Date:** 2026-06-18
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — declared on top of Routing Rules v3.0 + Model Routing Workflow v3.0
**Supersedes:** nothing — strictly additive. §1–9 of ROUTING-RULES.md and §1–9 of
MODEL_ROUTING_WORKFLOW.md remain authoritative; Phase 4 adds §10 in both.

---

## Purpose

Phase 4 formalizes two operating layers that have been implicit until now:

1. **Multi-Project OS** — every Kanban card lives under exactly one project; the
   board stops being a flat backlog and starts being a portfolio.
2. **Loop Engine** — every Tier-4/5 model call is preceded by a reuse check and
   followed by an artifact save. We stop paying for the same analysis twice.

Both layers run on top of the existing 6-step Default Build Flow. No model
role, cost tier, fallback chain, or routing-ledger field is removed or
renamed. Phase 4 *adds* two new lines to the ledger (`reuse_check:` and
`artifact_index_entry:`) and one new field to the card (`project:`).

---

## 1. Multi-Project OS

### 1.1 Project tag

Every active Kanban card MUST carry a `project:` line in its body. The value
must be one of the closed vocabulary in `PROJECT_VOCABULARY.md`. If a card's
work does not fit any existing tag, BossMan either:

- Adds a new tag to the vocabulary (with Marcelo approval), or
- Files the card under `agent-os` (meta-ops catch-all).

Cards created without a project tag are flagged at claim time and held in
`ready` until BossMan backfills the tag. BossMan may backfill unilaterally —
no approval needed for an existing card getting an existing tag.

### 1.2 One epic per project

Each project has at most one **epic** card in `planned` or `running` state.
Sub-task cards (`t_b11_04`, `t_crypto_learn_s1_03`, `t_mp6_05`, etc.) are
allowed and encouraged; they live as children of the epic via the existing
`link` mechanism. Multiple parallel epics for the same project are not
permitted; a new epic supersedes the old one with a comment.

### 1.3 Active-card cap

At any moment, a project may have at most:

- **1 card in `running`**, and
- **1 card in `ready`**

If a project exceeds this, BossMan moves excess cards to `todo` with a card
comment citing the cap and pointing at the blocking card. The cap does NOT
apply to `blocked` cards (those are paused, not active) or to sub-tasks
linked under an epic (those count toward the epic, not toward the cap
independently).

**Fast-track carve-out:** cards with label `fast-track` are exempt from the
cap. Use sparingly — only for incident response, security fixes, or
Marcelo-pinned urgent work. BossMan may add the label only with Marcelo
approval.

### 1.4 Board structure

- `bossman` board remains the default for active build cards.
- `travel-os`, `hermes-ops`, `agent-os` boards remain board-scoped (existing
  carve-outs untouched).
- A new convention: cards whose `project:` tag matches the board name stay
  on that board; mismatched cards get moved to `bossman` by BossMan.

---

## 2. Loop Engine

### 2.1 The reuse-check protocol

Before BossMan (or any delegated executor) calls a **Tier-4** model
(DeepSeek, OpenAI, Claude) or a **Tier-5** model (Perplexity Computer), the
caller MUST run:

```bash
grep -i "<1-3 keyword summary of the analysis>" \
     ~/.hermes/knowledge/ARTIFACT_INDEX.md
```

If a matching artifact exists, the caller reuses it and logs
`reuse_check: yes | reused: <path>` in the Routing Ledger. The Tier-4/5 call
does NOT happen.

If no match, the caller proceeds with the call and MUST save the output to
`~/.hermes/knowledge/` within the same work cycle, then add a line to
`ARTIFACT_INDEX.md`. Both are logged in the ledger as
`reuse_check: no | artifact_index_entry: <path>`.

### 2.2 Routing Ledger — new fields (additive)

The Routing Ledger template gains two lines, placed after `next_model_planned`:

```yaml
reuse_check: yes | no          # yes = found in ARTIFACT_INDEX.md, reused
artifact_index_entry: <path>    # path to the saved artifact (yes → reused path, no → newly saved path)
```

If `reuse_check: yes`, the Tier-4/5 call is **skipped**. The next-model
line still names the original model so the ledger is auditable.

### 2.3 Failure modes and overrides

- If ARTIFACT_INDEX.md is unreachable, the caller logs
  `reuse_check: skip | reason: index_unavailable` and proceeds. This is the
  only valid reason to skip the check.
- If Marcelo explicitly requests a fresh analysis (e.g., "regenerate the
  Binance bot SPEC from scratch"), `reuse_check: override | reason: <text>`
  is logged and BossMan proceeds without searching. This is the only valid
  override.

### 2.4 Index format

`ARTIFACT_INDEX.md` is a flat Markdown table:

```
| Date | Project | Tier | Filename | One-line summary |
```

Sorted newest-first. One row per saved artifact. The table is the only
thing the grep hits — body text of artifacts is never scanned.

---

## 3. Acceptance criteria (Phase 4 = DONE when all true)

1. ✅ Every active card on `bossman` board has a valid `project:` tag.
2. ✅ No project has more than 1 `running` + 1 `ready` card, except fast-track.
3. ✅ ARTIFACT_INDEX.md exists and is non-empty (seeded with the three
   audits in P4.9).
4. ✅ Three mirrors in sync: canonical `~/.hermes/knowledge/`,
   Obsidian, `Repos/BossMan/docs/`.
5. ✅ Routing Ledger template in MODEL_ROUTING_WORKFLOW.md §10 includes
   `reuse_check:` and `artifact_index_entry:` fields.
6. ✅ A PHASEREPORT entry dated 2026-06-18 records the declaration.

---

## 4. What Phase 4 does NOT do

- ❌ Does not change the 6-step Default Build Flow.
- ❌ Does not change model roles or cost tiers.
- ❌ Does not change the Perplexity Computer budget or
  `escalate_to_computer:` flag rules.
- ❌ Does not change Light Build Metrics.
- ❌ Does not replace §6 of MODEL_ROUTING_WORKFLOW.md (artifact reuse) —
  Phase 4 *operationalizes* it.
- ❌ Does not change LBC35's "I don't choose models" rule.
- ❌ Does not touch `travel-os`, `hermes-ops`, or `agent-os` boards.

---

*This document is the single source of truth for Phase 4 — Multi-Project OS
+ Loop Engine. Updated by BossMan when project vocabulary, active-cap
rules, or loop protocol change. All mirrors kept in sync (spaces + GitHub).*