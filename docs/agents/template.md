# Sub-Agent MD Template — v3 (Hermes Agent OS)

**Status:** Canonical template — used by all 9 sub-agent MDs
**Date:** 2026-06-18
**Owner:** BossMan Hermes
**Source of truth:** `~/.hermes/knowledge/agents/template.md`
**Mirrors (in sync order):**
1. `~/.hermes/knowledge/agents/template.md` (primary)
2. `~/Obsidian/Hermes/20_Agents/sub-agent-v3/template.md` (vault)
3. `~/Repos/BossMan/docs/agents/template.md` (GitHub)
4. `~/.hermes/spaces/agent-os/agents/template.md` (Spaces)

**Authority hierarchy (must be cited in §11 of every sub-agent MD):**
- Layer 1 — **v3 execution routing**: `AGENTS.md — v3` + `Routing Rules — v3` (canonical, unchanged)
- Layer 2 — **Sub-agent lane ownership**: this template + the 9 MDs (additive, lane-only)

**Activation directive (2026-06-18):** Lane-tagged cards MUST start their body with `lane:` and `why:` headers. The 9 lane-intro cards on `agent-os` are exempt. See `ROUTING_EXAMPLES.md` §"Card-Body Routing Header" + `LANE_SKILL_MAP.md` §"Routing Header Convention". Future cards on any board: when the work is meta/system/architecture, the header is mandatory.

---

## How to use this template

Copy this file → rename to `<lane-name>.md` → fill every section. Do not skip sections, do not invent new sections, do not reorder sections. Uniform structure is the whole point.

The 9 required filenames (final roster per `hermes-sub-agent-master-blueprint.md`):

1. `builder.md`
2. `content.md`
3. `ops.md`
4. `trading.md`
5. `self-improvement-curriculum.md`
6. `loop-engineering-goals.md`
7. `qa-verification.md`
8. `research-intel.md`
9. `knowledge-canon-reuse.md`

---

## Section 1 — Title and Status

```
# <Lane Name> — Hermes Sub-Agent (v3)

**Lane:** <one of the 9 above>
**Status:** ACTIVE | DRAFT | DEPRECATED
**Version:** 1.0
**Date:** 2026-06-18
**Owner:** BossMan Hermes
**Replaces:** <list legacy files, or "no predecessor — new lane">
**Mirrors:** primary | vault | GitHub | Spaces
```

---

## Section 2 — Mission

One paragraph. State the lane's purpose in concrete terms. Reference the blueprint section it derives from. Keep under 100 words.

---

## Section 3 — In-Scope Responsibilities

Bulleted list. Each bullet is a specific action the lane owns. Use action verbs. Include "owns" or "responsible for" so scope is unambiguous.

---

## Section 4 — Out-of-Scope Responsibilities

Bulleted list. Each bullet must name the lane that DOES own it. Format: `→ <lane>` or `→ BossMan`. No "TBD" — if a handoff target is unclear, escalate to BossMan.

---

## Section 5 — Relationship to BossMan

State explicitly:
- BossMan is the only orchestrator, planner, approval surface, and final status surface.
- This lane is owned by BossMan; BossMan delegates tasks to this lane.
- This lane NEVER routes work to another lane — only BossMan does.
- This lane reports completion to BossMan via Kanban card (status + summary + artifact paths).

---

## Section 6 — Relationship to LBC35 and Delegated Executors

State explicitly:
- LBC35 and other delegated executors may execute assigned tasks inside this lane's domain.
- Delegated executors do NOT make routing, scope, or strategic decisions inside this lane.
- This lane specifies the handoff packet shape (see §7); LBC35 fills the packet; BossMan decides whether to dispatch.
- This lane does NOT invoke Computer Use, does NOT route to models, does NOT bypass BossMan.

---

## Section 7 — Required Handoff Packet Fields

List the exact fields every handoff packet to/from this lane must contain. Format:

```
HANDOFF PACKET (lane: <this-lane>)
- card_id:
- title:
- goal:
- in_scope_items: []
- out_of_scope_items: []
- inputs: [paths / artifacts]
- expected_outputs: [paths / artifacts]
- verification_standard: [link to §8]
- knowledge_capture_required: [yes/no → §9 destinations]
- escalation_triggers: [link to §10]
- canon_to_obey_first: [link to §11]
- approval_required_for: [list]
- model_route: [leave blank — BossMan fills per Routing Rules v3]
- computer_use: [leave blank — BossMan fills per AGENTS v3]
```

---

## Section 8 — Verification Standard

State how work in this lane is verified before being reported complete. Must reference:
- The v3 Default Build Flow (Step 1 Research → Step 6 Docs/Handoff) where applicable.
- v3 Step 5 QA — mandatory for any work touching money, PII, infra, trading, auth, or public APIs.
- The skill(s) this lane uses for verification (e.g., `troubleshooting-mode`, `playwright-e2e-audit`).

---

## Section 9 — Knowledge Capture and Artifact Rules

State explicitly:
- Every reusable output from this lane must be captured (per Knowledge / Canon / Reuse lane + the cost-control rule in the blueprint).
- Specify the canonical capture destinations this lane uses:
  - `~/.hermes/knowledge/LEARNED_<DOMAIN>.md` for durable rules
  - `~/.hermes/knowledge/<doc>.md` for project knowledge
  - Reusable skill in `~/.hermes/skills/<name>/` for procedures
  - Kanban card artifact path / commit SHA for build outputs
  - Obsidian or repo mirror for durable docs
- No reusable paid-model output stays chat-only.

---

## Section 10 — Escalation Triggers

List the exact conditions that require escalation to BossMan. Format:

```
ESCALATE TO BOSSMAN WHEN:
- [trigger 1]
- [trigger 2]
- ...

ESCALATE TO <other-lane> WHEN:
- [trigger 1]
- ...
```

---

## Section 11 — Canon Files This Agent Must Obey First

Always cite, in this order:

1. **`AGENTS.md — v3`** — Delegation standards, model roles, Computer Use ownership. UNCHANGED.
2. **`Routing Rules — v3`** — Default Build Flow (6 steps), multi-model per card, Perplexity Computer escalation, light build metrics. UNCHANGED.
3. **`hermes-sub-agent-master-blueprint.md`** — The lane-ownership layer. Additive. This MD is an instance of it.
4. **`SUB_AGENT_INVARIANTS.md`** (cross-lane) — All 9 lanes share: no orchestration, no model override, no Computer Use override, no scope drift.

Optional references (lane-specific):
- Lane-specific LEARNED_<DOMAIN>.md files
- Lane-specific skills in `~/.hermes/skills/`
- Project knowledge docs in `~/.hermes/knowledge/`

---

## Section 12 — Version History

```
| Version | Date       | Change                                       | Author        |
|---------|------------|----------------------------------------------|---------------|
| 1.0     | 2026-06-18 | Initial draft from blueprint + legacy SOULs  | BossMan       |
|         |            |                                              |               |
```

---

## Notes for authors

- Do NOT add sections. The 12 are mandatory and fixed.
- Do NOT remove the "v3 unchanged" statements in §11. They are the safety belt.
- Do NOT add project history. Project history goes in `~/.hermes/knowledge/PROJECTS_*.md` or kanban cards.
- Every file must pass `shasum -a 256` parity across all 4 mirrors before being marked ACTIVE.
- Old SOUL files (Openclaw `soul-*.md`, `profiles/<x>/SOUL.md`) move to `_archive/` after this MD goes ACTIVE.

---

## Section 13 — Related Skills Footer (REQUIRED FOR ALL 9 LANE MDs)

Every lane MD must close with a "Related Skills" section that points to the canonical mapping file at `~/.hermes/knowledge/agents/LANE_SKILL_MAP.md`. This keeps skills skill-shaped and lanes lane-shaped — skills are NOT rewritten to declare lane ownership; the lane MD declares which skills it owns.

**Footer template (copy into each lane MD, after the Version History table):**

```markdown
---

## Related Skills

Source of truth: `~/.hermes/knowledge/agents/LANE_SKILL_MAP.md`.

**<Lane Name> owns / primary-uses:**
- `<skill-name>` — <one-line purpose>.
- `<skill-name>` — <one-line purpose>.

**<Lane Name> may also pull (cross-lane):**
- `<skill-name>`, `<skill-name>`.

If a skill is needed that is NOT in this list, escalate to BossMan — do NOT assume lane ownership.
```

**Maintainer rule:** when you add a skill to a lane, update `LANE_SKILL_MAP.md` first, then copy the new mapping into the lane MD's Related Skills section. The map is canonical; the lane MD is a curated pointer.

---

## Version History

| Version | Date       | Change                                                                       | Author      |
|---------|------------|------------------------------------------------------------------------------|-------------|
| 1.0     | 2026-06-18 | Initial 12-section template                                                  | BossMan     |
| 1.1     | 2026-06-18 | Added §13 Related Skills footer pointer — per Phase 4.3 lane→skill mapping  | BossMan     |