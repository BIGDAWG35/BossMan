# PHASEREPORT.md — Hermes Canon-Level Phase Report Log

> **CANONICAL SOURCE OF TRUTH** for canon-level phase transitions.
> Per-project phase reports live in the project folder (`PROJ-.../PHASEREPORT.md`). Per-incident postmortems live in `~/.hermes/logs/<incident-slug>.md` or the kanban card body.
> This file logs **canon-level** changes only — when the rules that govern the system itself evolve.
> All mirrors (Obsidian `Hermes/50_Phase-Reports/`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/PHASEREPORT.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date started:** 2026-07-22
**Status:** CANON — chronological log of canon-level changes

This file is appended to (never rewritten). Each entry follows the same shape:

```
## YYYY-MM-DD — <scope>
**Operator:** BossMan (autonomous) | Marcelo-approved | sub-agent-executed
**Scope:** one sentence
**What changed:** bullet list (files added / sections added / behavior changes)
**Where mirrored:** list of mirror paths + verification command
**Kanban reference:** card id (if any)
**Effect:** what is now true because of this change
**Status:** PHASED-IN | ROLLED-BACK | SUPERSEDED
```

---

## 2026-07-22 — Layer-2 closed-loop autonomy formalization

**Operator:** BossMan (autonomous) — Marcelo directed via Telegram
**Scope:** Add a permanent loop-enforcement rule that Marcelo only sees final verified product or true Marcelo-only decisions; never raw sub-agent output, never relay work, never "ask Marcelo to interpret logs / ask Perplexity / move info between agents."

**What changed:**

- **NEW FILE:** `~/.hermes/knowledge/ROUTING-RULES.md` — the single canonical routing doc. Combines V3 model roles, Perplexity tiers, the new 7-stage closed-loop, what Marcelo is NOT, the 8 implementation details, drift signals, monthly audit. BossMan is the only orchestration authority; sub-agents stay in their lanes; LBC35 remains delegator/router only.
- **NEW FILE:** `~/.hermes/knowledge/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` — lane roster + handoff contract + lane handoff examples + closed-loop audit. Codifies what each lane owns, what each lane MUST NOT do, and the handoff packet format that BossMan ↔ sub-agents ↔ Perplexity use.
- **NEW FILE:** `~/.hermes/knowledge/PHASEREPORT.md` — this file. Canon-level change log.
- **UPDATED:** `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md` — added Rule #0 (the closed-loop), Rule #0a (harness the loop in the 7-step default flow), and Rule #7a (drift signals for the new loop).
- **UPDATED:** `~/.hermes/AGENTS.md` — added Layer-2 closed-loop rule section at the top (additive to V3); references `ROUTING-RULES.md` and `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md`.
- **UNCHANGED:** V3 model roles, Perplexity Computer approval rules, LBC35 delegator-only role, all V3 carve-out triggers. The Layer-2 loop is additive.

**Where mirrored:**

| Mirror | Path | Verified by |
|---|---|---|
| Obsidian | `~/Obsidian/Hermes/V3-Canon/V3 – Routing Rules.md` (NEW) | `diff` against canonical |
| Obsidian | `~/Obsidian/Hermes/V3-Canon/V3 – Sub-Agent Blueprint.md` (NEW) | `diff` against canonical |
| Obsidian | `~/Obsidian/Hermes/V3-Canon/V3 – PHASEREPORT.md` (NEW) | `diff` against canonical |
| Obsidian | `~/Obsidian/Hermes/V3-Canon/V3 – 7-Rule Contract.md` (UPDATED) | `diff` against canonical |
| Obsidian | `~/Obsidian/Hermes/V3-Canon/V3 – Model Stack and Routing.md` (UNCHANGED) | `diff` against canonical |
| GitHub | `~/Repos/BossMan/docs/hermes-canon/ROUTING-RULES.md` (NEW) | `bash ~/.hermes/scripts/hermes-canon-sync.sh` |
| GitHub | `~/Repos/BossMan/docs/hermes-canon/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` (NEW) | same |
| GitHub | `~/Repos/BossMan/docs/hermes-canon/PHASEREPORT.md` (NEW) | same |
| GitHub | `~/Repos/BossMan/docs/hermes-canon/LEARNED_7_RULE_CONTRACT.md` (UPDATED) | same |
| Perplexity Spaces | (alignment verified separately, after file mirrors confirmed) | `spaces-intake` + mirror check |

**Sync script update:** `~/.hermes/scripts/hermes-canon-sync.sh` extended from 4 → 7 files (added ROUTING-RULES, LEARNED_SUB_AGENT_MASTER_BLUEPRINT, PHASEREPORT).

**Kanban reference:** `t_canon_layer2_loop_enforcement_20260722` (parent + child cards; full Status = done after mirror verification)

**Effect:**

- Marcelo sees final verified product or true V3 carve-out escalations only.
- Every non-trivial task runs the 7-stage loop end-to-end (intake → research → plan → execute → verify → capture → deliver).
- Perplexity-first is automatic for any agent in the stack.
- Sub-agent lanes are codified with handoff contracts; cross-lane work requires sibling kanban cards.
- Drift signals are codified; weekly cron auto-creates `drift-fix` cards when the pattern is violated.
- Monthly closed-loop audit (sample 10 random kanban cards) verifies the loop actually ran end-to-end.

**Status:** PHASED-IN

**Constraints preserved:**

- V3 model roles: unchanged
- Perplexity Computer approval rules: unchanged
- LBC35 delegator-only role: unchanged
- V3 carve-out triggers: unchanged
- No hidden workstreams created
- No existing routing broken

---

*(Add new entries above this line. Never rewrite history.)*