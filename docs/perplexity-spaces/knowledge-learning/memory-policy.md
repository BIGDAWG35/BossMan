# Memory Policy (2026-06-04, permanent)

Defines what goes where across Hermes's three memory layers. Goal: **lean injected memory, durable detailed docs in `~/.hermes/knowledge/`, one source of truth per fact.**

---

## The three layers

### 1. `~/.hermes/memories/USER.md` — short injected memory (USER profile)

**What belongs here:**
- Durable personal preferences (Marcelo's communication style, pet peeves, working hours, security defaults)
- Short pointer to the most-used knowledge docs (1 line each, file path only)
- Concise operating defaults (e.g. "Reports = PASS/FAIL grids, not narrative")
- Things that must be in **every** turn's context to influence behavior

**What does NOT belong here:**
- Long policy explanations — point to a knowledge file
- Process details or step-by-step workflows — point to a skill
- Project-specific history, PR numbers, recent task outcomes
- Anything that won't matter across multiple sessions

**Hard size target:** **< 1,200 chars total** (the memory tool's hard ceiling is 1,375; keep headroom).

**Brevity rule:** each entry is **1–3 lines max**. Declarative facts, not instructions to self.

---

### 2. `~/.hermes/memories/MEMORY.md` — short rolling memory (memory tool)

**What belongs here:**
- Environment facts (commit SHAs of critical repos, port maps, service names — *if* those are stable)
- Cross-session conventions (e.g. "Boss Hub is the service registry, not OPERATINGBLUEPRINT.md")
- Short pointers to canonical knowledge docs / skills (1 line: name + path)
- Stable workflow notes that aren't skills yet but are durable

**What does NOT belong here:**
- Long policy explanations — point to a knowledge file
- Per-task logs, "fixed bug X", "submitted PR Y", "Phase N done"
- Anything task-specific or stale in < 7 days
- File inventories or directory listings — read the filesystem at runtime
- Full sections of `.md` files duplicated into memory

**Hard size target:** **< 1,800 chars total** (the memory tool's hard ceiling is 2,200; keep headroom).

**Brevity rule:** each entry is **1–2 lines max**, point to a file for detail. Declarative facts, not instructions.

---

### 3. `~/.hermes/knowledge/` — canonical reference docs

**What belongs here:**
- **Policy** documents (APPROVAL_POLICY.md, MEMORY_POLICY.md, ROUTING-RULES.md)
- **Process** workflows that span multiple sessions
- **Architecture** diagrams, blueprints, design decisions with rationale
- **Reference** data: service inventories, port maps, credential locations
- **Long-form** explanations that don't need to be in every turn

**File naming:**
- `APPROVAL_POLICY.md`, `MEMORY_POLICY.md`, `ROUTING-RULES.md` — stable policy/process
- `LEARNED_*.md` — domain knowledge harvested from prior projects
- `BLOCKER_RESOLUTIONS.md`, `KANBAN_ROADMAP.md` — operational references
- `<NAME>_blueprint.md` — architecture docs

**No size limit** — these are referenced on demand, not injected. Keep them organized, dated, and versioned where it matters.

---

## Core rule: memory indexes, never duplicates

If a fact lives in `~/.hermes/knowledge/X.md`, memory should say: `X rules: ~/.hermes/knowledge/X.md` — **one line**.

Memory is for **the cache of "things I would otherwise forget and that influence every turn."** Knowledge docs are for **"things I look up when I need them."**

Default test: *"Would I need this fact in 80% of turns to behave correctly?"*
- **Yes** → short fact in memory
- **No, but I might need it next session** → pointer + knowledge file
- **No, this is one-off** → not stored, recovered from session_search if needed

---

## Memory hygiene rules

1. **When updating memory:** if the new entry is > 200 chars, ask: should this be a knowledge file instead?
2. **When adding a workflow:** save as a skill (skill_manage), not as memory. Memory points to skills.
3. **Never store:** PR/issue numbers, commit SHAs as facts, "fixed X", "Phase N done", file counts, recent task outcomes, anything stale in 7 days.
4. **Trim, don't expand:** if memory is at > 90% capacity, replace an old verbose entry with a short pointer rather than adding new entries.
5. **No duplication:** if two memory entries cover the same topic, consolidate. If a fact appears in both memory and a knowledge file, delete from memory and keep the pointer.

---

## Current state and operating defaults

- **Memory hard ceilings:** USER.md 1,375 chars / MEMORY.md 2,200 chars (system limits)
- **Practical targets:** USER.md < 1,200 / MEMORY.md < 1,800 (keep headroom)
- **Entry style:** declarative facts ("X is the case"), never imperatives ("always do X")
- **Pointer style:** single backtick path, brief context, e.g. `` `kanban scope-gap: 3-option verdict pattern` ``

---

## Override

This policy is canonical. If a new use case needs a different memory layer, update this doc and adjust the affected memory file in the same change.
