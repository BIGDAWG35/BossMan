# AGENTS.md — Delegation Standards for Marcelo's Systems (Thin Pointer)

**Status:** Permanent (kernel-doc). 2026-08-06 refreshed (Card `t_agents_split_v1_20260806`).
**Parent policy:** `~/.hermes/knowledge/ROUTING-RULES.md` is the canonical routing/delegate document.

This file used to be 433 lines. On 2026-08-06 it was split into 4 sibling files for clarity. **Read `AGENTS_INDEX.md` first** to see the section map.

## The 4 files

| File | Purpose |
|---|---|
| `~/.hermes/AGENTS.md` | **This file** — thin pointer (you are here) |
| `~/.hermes/AGENTS_INDEX.md` | Section map — "where does X live?" |
| `~/.hermes/AGENTS_ROSTER.md` | **Live roster** — § Roles & Chain of Command + delegation rules (verbatim) |
| `~/.hermes/AGENTS_ARCHIVE_2026-08-06.md` | Frozen verbatim original — safety net for recovery |

## Quick links

- **§ Roles & Chain of Command** → `AGENTS_ROSTER.md` (preserved verbatim)
- **Governance V3 / Soul / Core Principle** → `~/.hermes/SOUL.md`
- **7-Rule Contract + Layer-2 loop** → `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md`
- **Model routing / Token economics** → `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` + `LEARNED_V3_TOKEN_ECONOMICS.md`
- **Sub-agent lane roster + handoff contracts** → `~/.hermes/knowledge/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md`
- **Perplexity workflow** → `~/.hermes/knowledge/LEARNED_PERPLEXITY_SPACES_WORKFLOW.md`
- **Memory automation** → `~/.hermes/skills/memory-automation/SKILL.md`

## Card reference

- **Original 433-line split:** `~/.hermes/cron/output/t_agents_split_v1_20260806.md`
- **Classification rationale:** `~/.hermes/cron/output/t_agents_services_classify_v1_20260806.md`

## Reversibility

To restore the pre-split 433-line original:
```bash
cp ~/.hermes/AGENTS_ARCHIVE_2026-08-06.md ~/.hermes/AGENTS.md
```
The archive is byte-equal to the pre-split file (SHA-256 `683015cd5b774bdfdf24afbc7fe6452ef3b4013ab2237498a7b8b50ffde7eeca`, 26,170 bytes / 433 lines raw; verbatim embedded at offset 1632 inside the archive wrapper).