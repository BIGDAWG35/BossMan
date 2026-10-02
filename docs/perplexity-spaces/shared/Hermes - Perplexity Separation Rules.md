**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/shared/Hermes - Perplexity Separation Rules — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Hermes ↔ Perplexity Separation Rules

> **2026-10-02 correction:** `~/Desktop/V3/` and `HERMES_PERPLEXITY_V3_DOCS.md` no longer exist. Spaces are now Perplexity Projects (Agent OS, Shared, System Health, Ops Processes, Toolchain & Dev, Knowledge & Learning, Projects & Mission Control, Trading Ops, Finance & Money Ops); pipeline: canon `~/.hermes/knowledge/` → `~/Desktop/spaces/<folder>/` (rebuilt by `~/.hermes/scripts/build_spaces_v4.py`) → read-only mirrors `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/`. Role picture is now 3 roles (Marcelo / BossMan / sub-agents) — LBC35 retired; Perplexity Computer reaches BossMan via `~/.hermes/perplexity-intake/`. Per-profile paid overrides below are history: primary is MiniMax-M3 in 7 profiles and MiniMax-M2.7 in content + qa-verification (by design), automatic fallback → Ollama `qwen3.5:35b-a3b-nvfp4`; paid models only via route-card.sh cards.
**Version:** v3.1 (refined 2026-07-20)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
**Source of truth:** ~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md
**Locked by:** V3 audit, 2026-07-20
## Original title

_Hermes Perplexity Separation Rules_

**Paste this into Hermes's Perplexity Space instructions.**

---

## Core Separation Rule

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

Per `ROLES_AND_CHAIN_OF_COMMAND.md` (canonical, locked 2026-07-20), Hermes runs as a **4-role
picture**:
1. **Marcelo** — reviewer + owner (NOT a third tech; NOT a relay; approves V3 carve-outs and
   final-product review only)
2. **BossMan** — manager + orchestrator (owns phases, sub-agent delegation, verification
   gates, the Kanban board, and the single status surface back to Marcelo)
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
   [fragment of the retired LBC35 role-3 line — current picture is 3 roles: Marcelo / BossMan / sub-agents]
4. **Sub-agents** — **workers** in 10 lanes (builder, ops, trading, content, travel,
   qa-verification, research-intel, knowledge-canon, self-improvement, loop-engineering).
   Each follows BossMan's 7-rule contract (`LEARNED_7_RULE_CONTRACT.md`) and never pulls
   Marcelo into the loop.

Per the **canonical separation rule**: Hermes is Hermes (M3 primary brain, Marcelo as reviewer,
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## When to Use Hermes Docs / Spaces

✅ Use Hermes docs when Marcelo says:
- "Check the Hermes Space for X"
- "What does Hermes know about X?"
- "Use the Hermes docs"
- Any question about Hermes's own system, services, trading, business, or operations

✅ Use Hermes Spaces (Perplexity) when working inside the **9 V3 Spaces** (per
`HERMES_PERPLEXITY_V3_DOCS.md`, v3 catalog source of truth (history — superseded 2026-10-02: catalog retired; upload folder is ~/Desktop/spaces/<folder>/)):
- agent-os
- trading-ops
- finance-money-ops
- ops-processes
- toolchain-dev
- system-health
- knowledge-learning
- projects-mission-control
- shared

---

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## The M3-First Rule (updated 2026-07-20)

Inside Hermes Spaces:
- **Always use MiniMax M3 first** (current default, per `LEARNED_V3_MODEL_STACK.md`)
- M3 is Hermes's primary brain — chatty, bulk, cheap
- DeepSeek, OpenAI, and Claude are **paid, card-only tier escalations** (local Ollama qwen3.5:35b-a3b-nvfp4 is the automatic fallback, not an escalation — corrected 2026-10-02) — escalate only when
  the task-type matrix points to a higher tier, OR when M3 hits a real limit on a non-trivial
  task
- Per-profile overrides (qa-verification → Claude mandatory; research-intel → GPT-5.4;
  builder/ops/trading → DeepSeek) are defined in the canonical routing file (history — superseded 2026-10-02: primary is MiniMax-M3 in 7 profiles and MiniMax-M2.7 in content + qa-verification (by design), fallback → Ollama qwen3.5:35b-a3b-nvfp4; paid models only per card via route-card.sh)
- SquarePayouts work is **permanently M3-blocked** — Claude → OpenAI → DeepSeek only (note 2026-10-02: money paths incl. SquarePayouts use Claude Sonnet 4.6 via route-card.sh cards; no automatic paid chain; SquarePayouts is ACTIVE)
- **Never preemptively use a backup model.** Use M3 first, then escalate per the task-type
  matrix.

---

## Never Do This

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
❌ Never let a sub-agent message Marcelo directly — single status surface rule (BossMan owns it)
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## Migration Rule

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
2. Rewrite it using Hermes-native language (M3 primary brain, 4-role picture, 10 sub-agent
   lanes), the V3 model stack, and Hermes-native sub-agent names
3. Place it in the correct Hermes Space folder under `~/Desktop/V3/<space>/` (the V3 folder is
   today's authoritative source of truth for Hermes docs) (history — superseded 2026-10-02: ~/Desktop/V3 no longer exists; write canon to ~/.hermes/knowledge/ and rebuild ~/Desktop/spaces/ with build_spaces_v4.py)
4. Flag Marcelo to upload the migrated doc to the matching Perplexity Space (see the upload
   list in `HERMES_PERPLEXITY_V3_DOCS.md`) (history — superseded 2026-10-02: catalog retired; upload set = ~/Desktop/spaces/<folder>/; agents do the prep, no homework for Marcelo)
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## Source of truth pointers

- **Roles + chain of command:** `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md` (canonical,
  2026-07-20)
- **Model stack + routing:** `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` (canonical,
  2026-07-20)
- **7-rule contract:** `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md` (canonical, 2026-07-20)
- **V3 Spaces catalog:** `~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md` (the 9-Space manifest +
  upload/retire lists) (history — superseded 2026-10-02: retired; see ~/Desktop/spaces/ built by ~/.hermes/scripts/build_spaces_v4.py)

---

## Change log (v3.0 → v3.1, 2026-07-20)

- **4-role picture added:** the file now references today's authoritative roles per
  `ROLES_AND_CHAIN_OF_COMMAND.md` — **Marcelo (reviewer/owner) / BossMan (manager/orchestrator) /
  - LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
  "sub-agents" without the explicit delegator/router distinction.
- **M3 substituted for M2.7** in the M3-First Rule (was previously "MiniMax 2.7 first").
  Per `LEARNED_V3_MODEL_STACK.md` (canonical, locked 2026-07-20), the current primary brain is
  **MiniMax M3**, not MiniMax 2.7.
- **Spaces list refreshed** — the 9 V3 Spaces per `HERMES_PERPLEXITY_V3_DOCS.md`:
  agent-os, trading-ops, finance-money-ops, ops-processes, toolchain-dev, system-health,
  knowledge-learning, projects-mission-control, shared.
- **V3 folder at `~/Desktop/V3/`** is now cited as today's authoritative source-of-truth folder
  for Hermes docs (replaces the old `perplexity-spaces Hermes/` reference for migrations).
- **SquarePayouts M3-block** restated explicitly in the M3-First Rule.
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- **Frontmatter updated:** version v3.0 → v3.1 (refined 2026-07-20); date 2026-06-16 → 2026-07-20;
  added **Source of truth** (`~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`) and
  **Locked by:** V3 audit, 2026-07-20.
- **Migration Rule** now points to `~/Desktop/V3/<space>/` as the canonical destination and to
  `HERMES_PERPLEXITY_V3_DOCS.md` as the upload-flag target.
- **Drift guard:** if this file's role picture diverges from `ROLES_AND_CHAIN_OF_COMMAND.md`,
  the canonical file wins.
