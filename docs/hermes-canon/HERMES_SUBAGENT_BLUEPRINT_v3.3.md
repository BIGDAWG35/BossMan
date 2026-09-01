# HERMES_SUBAGENT_BLUEPRINT_v3.3.md — Live Canon

**Status:** CANONICAL — ACTIVE V3.3
**Date:** 2026-08-31
**Card:** `t_v33_full_install_v1_20260831`
**Predecessor:** `hermes-sub-agent-master-blueprint.md` (pre-split, archived 2026-08-31)
**Companion:** `HERMES_SUBAGENT_BLUEPRINT_INDEX.md` (entry point) · `HERMES_SUBAGENT_BLUEPRINT_ARCHIVE_2026-08-31.md` (frozen v3.0)

> This document is the **live canon** for the Hermes sub-agent subsystem as of V3.3 (2026-08-31). Read `HERMES_SUBAGENT_BLUEPRINT_INDEX.md` first for context. The pre-split phase plan and rollout history are in the archive; do not look there for current rules.

---

## Layer 1 / Layer 2 separation rule (VERBATIM — DO NOT SUMMARIZE)

The original wording from the pre-split blueprint is preserved **VERBATIM** below. This rule is the foundation of v3 execution routing and must not be paraphrased, summarized, pointer-redirected, or "improved". Sub-agents are lane ownership only; they are never alternate orchestrators.

> **Layer 1 — v3 execution routing**: `AGENTS.md — v3` + `Routing Rules — v3` (canonical, unchanged)
>
> **Layer 2 — Sub-agent lane ownership**: this template + the 9 MDs (additive, lane-only)

> **Activation directive (2026-06-18):** Lane-tagged cards MUST start their body with `lane:` and `why:` headers. The 9 lane-intro cards on `agent-os` are exempt. See `ROUTING_EXAMPLES.md` §"Card-Body Routing Header" + `LANE_SKILL_MAP.md` §"Routing Header Convention". Future cards on any board: when the work is meta/system/architecture, the header is mandatory.

> **Authority hierarchy (must be cited in §11 of every sub-agent MD):**
> - Layer 1 — **v3 execution routing**: `AGENTS.md — v3` + `Routing Rules — v3` (canonical, unchanged)
> - Layer 2 — **Sub-agent lane ownership**: this template + the 9 MDs (additive, lane-only)

> **The Lane 1 / Lane 2 separation rule survives VERBATIM in this live file.** v3 execution routing is untouched. Sub-agents are lane ownership only. They are never alternate orchestrators. Do not summarize this rule. Do not pointer-redirect this rule.

---

## The 10-lane roster (canonical, RESOLVED 2026-08-31)

The Hermes subsystem has **10 sub-agent lanes**, established 2026-07-22 and verified 2026-08-31:

| # | Lane | Default model | Live canonical doc |
|---|------|---------------|---------------------|
| 1 | builder | DeepSeek | `~/.hermes/knowledge/builder.md` |
| 2 | content | OpenAI | `~/.hermes/knowledge/content.md` |
| 3 | ops | DeepSeek | `~/.hermes/knowledge/ops.md` |
| 4 | trading | Claude (mandatory) + DeepSeek (secondary) | `~/.hermes/knowledge/trading.md` |
| 5 | travel | MiniMax-M3 | `~/.hermes/knowledge/LEARNED_TRAVEL_OS.md` | `~/.hermes/profiles/travel/config.yaml` (activated 2026-09-01) |
| 6 | qa-verification | Claude (sensitive) / MiniMax-M3 (cosmetic) | `~/.hermes/knowledge/qa-verification.md` |
| 7 | research-intel | DeepSeek | `~/.hermes/knowledge/research-intel.md` |
| 8 | knowledge-canon | MiniMax-M3 | `~/.hermes/knowledge/knowledge-canon.md` |
| 9 | self-improvement | MiniMax-M3 | `~/.hermes/knowledge/self-improvement.md` |
| 10 | loop-engineering | MiniMax-M3 | `~/.hermes/knowledge/loop-engineering-goals.md` |

**Default model is overridden by `LEARNED_V3_MODEL_STACK.md` per task type.** Lane owners do not pick models — they inherit the routing.

**Lane routing vs model routing (Permanent 2026-07-23):** These are two independent axes. Conflating them is a common drift mode. The new LIVE blueprint absorbs the `AGENTS_ROSTER.md` §"Lane routing vs model routing" rule verbatim.

---

## Standard sub-agent MD structure (11 sections — RESOLVED 2026-08-31)

The canonical lane-doc structure is **11 sections**. All 10 lane docs conform. The pre-split blueprint's `template.md` specified 13 sections (including a "Title and Status" header and a "Related Skills Footer"); the actual practice converged on 11 because the title/status is captured in frontmatter and the related-skills list is captured as inline cross-references in Section 7.

The 11 canonical sections:

1. **Title and Status** — frontmatter (filename + title + lane + status + version + date + owner + replaces + mirrors)
2. **Mission** — one paragraph; under 100 words; concrete purpose
3. **In-Scope Responsibilities** — bulleted action verbs; explicit "owns" / "responsible for"
4. **Out-of-Scope Responsibilities** — bullets name the receiving lane; format `→ <lane>` or `→ BossMan`
5. **Relationship to BossMan** — BossMan is the only orchestrator, planner, approval surface, final status surface; lane reports via Kanban card
6. **Relationship to LBC35 and Delegated Executors** — LBC35 is delegator/router only; lane receives handoffs via BossMan
7. **Required Handoff Packet Fields** — lane, parent card, status, what I did, what is now true, evidence, reusable patterns, remaining Marcelo-only, Step-5 verdict, time spent
8. **Verification Standard** — Step-5 PASS verdict file required before status flips to `done`
9. **Knowledge Capture and Artifact Rules** — durable insights → `LEARNED_<DOMAIN>.md` via knowledge-canon lane; not chat-only
10. **Escalation Triggers** — only true V3 carve-outs reach Marcelo
11. **Canon Files This Agent Must Obey First** — Layer 1 + Layer 2 stack + V3 model stack + 7-rule contract

**The structure is the whole point.** Uniform structure across all 10 lanes enables handoff packet validation, doc-hygiene cron automation, and Step-5 consistency.

---

## The handoff packet contract (Permanent)

Every handoff between BossMan ↔ sub-agent ↔ Perplexity follows this exact format. Sub-agents must format their return summaries to BossMan in this shape; BossMan formats the final report to Marcelo in the same shape (per Rule #6).

```
┌──────────────────────────────────────────────────────────────┐
│ HANDOFF PACKET (sub-agent → BossMan)                          │
├──────────────────────────────────────────────────────────────┤
│ Lane:                    <builder|ops|trading|...>            │
│ Parent card:             <t_xxx>                              │
│ Status:                  PASS | PASS-WITH-FIX | FAIL | BLOCKED│
│ What I did:              <3-5 bullets, factual>              │
│ What is now true:        <observable state changes>          │
│ Evidence:                <URLs, file paths, command outputs>  │
│ Reusable patterns found: <list → knowledge-canon lane>        │
│ Remaining Marcelo-only:  <list, ideally empty>               │
│ Step-5 verdict file:     <path if QA ran>                     │
│ Time spent:              <optional, for budget tracking>      │
└──────────────────────────────────────────────────────────────┘
```

The handoff packet is the **only** output sub-agents return. BossMan synthesizes it into the final report. Sub-agents do not autonomously message Marcelo with the same content.

---

## What sub-agents MUST do (Permanent)

- Stay in lane. Cross-lane work opens a sibling kanban card; never reach across lanes.
- Use Perplexity-first for unknowns. Perplexity via Brave → `https://perplexity.ai` (primary). Never ask Marcelo to relay.
- Pick model from `LEARNED_V3_MODEL_STACK.md` based on task type. Not from intuition.
- Verify before returning PASS. Self-test (browser QA, curl, sqlite3, log inspection) before handing off. "Looks right" is not verification.
- Capture reusable insights. Quirks, fix patterns, vendor behaviors, recurring failures → `LEARNED_<DOMAIN>.md` via knowledge-canon. Not chat-only.
- Emit a Step-5 verdict. Even for "small" changes. Trivial work skips Step-5 explicitly.
- Report drift. Stack-gap pattern → `drift-fix: <gap>` kanban card. Drift is a stack bug.

## What sub-agents MUST NOT do (Permanent)

- ❌ Send Telegram / Slack / email / push notifications to Marcelo. All status flows through BossMan.
- ❌ Create independent workstreams outside the assigned kanban card.
- ❌ Treat LBC35/OpenClaw as a worker. LBC35 is delegator/router; you execute its plans, you don't serve it.
- ❌ Skip Step-5 verification because "it's a small change" or "it's a hot-fix."
- ❌ Skip kanban. Even 5-minute tasks live on a card.
- ❌ Modify Tier 1-3 canon without explicit BossMan assignment + Marcelo approval.
- ❌ Enable PAPER_MODE=false on trading bots without Marcelo sign-off.
- ❌ Modify production secrets, billing, vendor contracts, or customer-visible terms without Marcelo sign-off.
- ❌ Ask Marcelo to interpret logs, copy-paste Perplexity output, decide routine technical choices, or run commands.

---

## Rule #8 — Pre-troubleshoot mandatory snapshot (Permanent 2026-08-06)

Every non-trivial mutation in this subsystem's scope (config.yaml, cron/jobs.json, PM2 manifests, infra manifests, important scripts, governance canon) MUST be backed by a current git snapshot before the mutation. The reason is so the agent stack can revert automatically without ever asking Marcelo to retype a config or rerun a command from memory.

- **Rule:** `LEARNED_7_RULE_CONTRACT.md` Rule #8
- **Executable form:** `~/.hermes/skills/troubleshooting-backup-and-revert/SKILL.md`
- **Helpers:** `~/.hermes/scripts/git-snapshot-before-fix.sh`, `~/.hermes/scripts/git-revert-last-fix.sh`
- **Drift signal:** Sub-agent applies a non-trivial fix without the snap helper → `t_drift_snap_rule_violation_<date>` card

**This rule is universal across all 10 lanes.** No lane is exempt.

## Rule #9 — Pre-MD-trim mandatory classification (Permanent 2026-08-06)

Every canon-MD trim, dedup, or shave — including any `LEARNED_*.md`, profile `SOUL.md` / `AGENTS.md`, `PHASEREPORT.md`, audit docs — MUST pass the 6-step Rule #9 loop: **snapshot → classify → extract → trim → verify → report**.

- **Rule:** `LEARNED_7_RULE_CONTRACT.md` Rule #9
- **Rubric:** `~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md` (4-category classification: A=canonical rule, B=historical evidence, C=procedure, D=temp working context; + Generated Artifacts added 2026-08-31)
- **Executable form:** `~/.hermes/skills/md-file-snapshot-before-trim/SKILL.md`
- **Helper:** `~/.hermes/scripts/git-snapshot-md-file.sh` (returns SHA, writes ledger to `~/.hermes/logs/md-trim-snapshots.log`)
- **Drift signal:** Sub-agent trims a canon MD without `git-snapshot-md-file.sh` → `t_drift_md_trim_classification_<date>` card

**No section may be deleted without classification.** Class A/B/C content must be extracted to its proper destination before any trim. Class D requires a 7-day quarantine. Generated artifacts (the 5th rubric category, added 2026-08-31) are out-of-canon by source.

## The A/B/C/D file classification rubric (Permanent 2026-08-06; + Generated 2026-08-31)

Every MD file under `~/.hermes/knowledge/` (and every other canon-MD) belongs to one of these 5 categories:

| Category | Meaning | Disposition rule |
|---|---|---|
| **A** | Canonical rule | Active canon; never deleted; extracted to proper home before trim |
| **B** | Historical evidence | Frozen + archived; not active |
| **C** | Procedure | Operational; mirrors maintained; not promoted to canon |
| **D** | Temp working context | 7-day quarantine before deletion |
| **Generated** | Auto-generated artifact | Operational telemetry; never canon; tracked separately |

## The 5-category file structure (Permanent)

The Hermes canon-MD inventory is organized into 5 categories by purpose:

1. **Durable truths** — Tier 1-3 canon that must survive. A-class files. Cited by every other category.
2. **Append-only history** — phase reports, change logs. B-class. Frozen on every modification.
3. **Procedures** — runbooks, scripts, recipes. C-class. Mirrors maintained.
4. **Point-in-time audits** — frozen snapshots of system state at a moment. B-class. Immutable.
5. **Frozen history** — pre-split originals, legacy migration sources. Archived; never edited.

## The split + freeze + canonicalize pattern (Permanent 2026-08-31)

Two proven drift remedies emerge from the v3.0 → v3.3 work:

**Split pattern** — remedy for BLOAT drift in a single canonical MD:
1. Snapshot the bloated file (Rule #8 + Rule #9)
2. Classify the content (A/B/C/D/Generated)
3. Extract canonical content → INDEX + LIVE
4. Extract historical content → ARCHIVE
5. Replace the original file with a thin pointer to INDEX
6. Verify zero byte loss (SHA-compare against snapshot)
7. Append to `~/.hermes/logs/md-trim-snapshots.log`

**Freeze + canonicalize pattern** — remedy for STALENESS drift in active canon:
1. Snapshot the stale file (Rule #8 + Rule #9)
2. Freeze the existing content with explicit date stamp
3. Rewrite the live version from authoritative sources (Tier 1-3 + execution evidence)
4. Cross-reference the freeze + the live version in INDEX
5. Verify single canonical home per durable rule
6. Append to `~/.hermes/logs/md-trim-snapshots.log`

Both patterns preserve zero byte loss and produce a documented recovery path.

---

## Cost-control rule (Permanent)

The 9 active sub-agents (lanes 1-9 above; loop-engineering is dormant/template) share a monthly cost ceiling. When monthly cost exceeds the ceiling, BossMan pauses the lowest-priority sub-agent and re-routes its work to a cheaper lane or to MiniMax-M3.

The ceiling is set in `config.yaml` under `cost.ceiling_monthly_usd`. Adjustments require Marcelo A/B/C approval.

This lane is critical for preventing cost drift. Knowledge-canon owns canon hygiene, mirrors, reusable skills, LEARNED rules, project knowledge docs, templates — and is the primary cost-control lever.

---

## Safe implementation rule (Permanent)

Any change to the sub-agent subsystem MUST follow Rule #8 (snapshot first) and Rule #9 (classify before trim). The proven split + freeze patterns above are the standard remedies for drift.

Lane-doc rewrites MUST preserve the 11-section structure (§standard structure above) and the Layer 1 / Layer 2 separation rule (§top of this file, verbatim).

---

## Next steps (bounded, not blocking V3.3 promotion)

These follow-ups are tracked in `V3_3_MASTER_BLUEPRINT_20260831.md` §XII and do not block V3.3:

- Update `AGENTS_ROSTER.md` per-lane canonical-file table to include loop-engineering row (currently missing)
- AGENTS_INDEX.md general update to reference this new INDEX
- Final-verification Step-5 cross-check for this blueprint

---

*Drafted 2026-08-31 PDT under `t_v33_full_install_v1_20260831`.*
*Split from `hermes-sub-agent-master-blueprint.md` (pre-split, archived 2026-08-31).*
