**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/shared/Hermes Spaces Config — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Hermes Spaces Config

> **2026-10-02 correction:** `~/Desktop/V3/`, `HERMES_PERPLEXITY_V3_DOCS.md` and `MIRRORS_WIPE_AND_RESYNC_RUNBOOK.md` no longer exist. Upload folder = `~/Desktop/spaces/<folder>/` (v4, built 2026-10-01); pipeline: canon `~/.hermes/knowledge/` → `~/Desktop/spaces/<folder>/` (rebuilt by `~/.hermes/scripts/build_spaces_v4.py`) → read-only mirrors `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/`. Live Perplexity Project names: Agent OS, Shared, System Health, Ops Processes, Toolchain & Dev, Knowledge & Learning, Projects & Mission Control, Trading Ops, Finance & Money Ops. Health OS docs, LBC35 docs and the 'Hermes …' Space titles below are history.
**Version:** v3.1 (refined 2026-07-20)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
**Source of truth:** ~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md (history — superseded 2026-10-02: retired; canon ~/.hermes/knowledge/ → ~/Desktop/spaces/<folder>/ via build_spaces_v4.py)
**Locked by:** V3 audit, 2026-07-20
## Original title

_Hermes Spaces — Master Configuration_

**Last updated: 2026-07-20**

> ⚠️ **V3 source of truth (history — superseded 2026-10-02: retired; see the 2026-10-02 correction at top):** The canonical V3 catalog of Hermes Spaces + upload/retire lists
> lives at **`~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md`** (v3-catalog-2026-06-16, revised
> 2026-07-20). Each Space's docs live under **`~/Desktop/V3/<space>/`**. This file is the
> Perplexity-side mirror that gets pasted into Space SETUP.md instructions; the V3 folder is
> the authoritative source.

---

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
|--|-------|---------|
| Primary brain | **MiniMax M3** | Ollama qwen3.5:35b-a3b-nvfp4 (automatic fallback; Claude/OpenAI are paid, card-only, never automatic — corrected 2026-10-02) |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

**When Marcelo says "Hermes Space" or "Hermes docs":** Only use the Hermes folder structure
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## Spaces Overview (the 9 V3 Spaces, per HERMES_PERPLEXITY_V3_DOCS.md)

Per the V3 catalog (`~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md`, 2026-06-16 catalog / 2026-07-20
revision), Hermes maintains exactly **9 V3 Spaces** on Perplexity. Each maps to a dedicated folder
under `~/Desktop/V3/<space>/`:

| Space | Sub-Agent | Primary Decisions |
|-------|-----------|------------------|
| **agent-os** | BossMan | Routing, system services, profile management, 7-rule contract |
| **trading-ops** | Trading | Binance bot management, signals, risk rules |
| **finance-money-ops** | Trading + BossMan | Money Pipeline v2, exposure caps, SquarePayouts (M3 BLOCKED) |
| **ops-processes** | Ops | Cron jobs, PM2 health, services map, Tailscale, daily runbooks |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
| **system-health** | Ops + qa-verification | PM2 status, health monitoring, error escalation, broken-cron-jobs log |
| **knowledge-learning** | knowledge-canon | LEARNED.md index, memory policy, phase reports, per-domain LEARNED files |
| **projects-mission-control** | BossMan + builders | Active projects, dashboard, PROJ-Overview.md set, Opp-65 / Opp-350 status |
| **shared** | BossMan | Cross-Space canon: routing, memory, vault, model policy, separation rules, sync workflow |

> **Note:** the pre-v3.1 list split "Trading Ops" and "Trading Strategy & Portfolio" as separate
> Spaces; today's V3 catalog consolidates trading under **trading-ops** and strategy into
> **finance-money-ops** (portfolio + Money Pipeline). Content & YouTube, Real Estate, and
> Business & Ideas were folded into their owning Spaces (projects-mission-control,
> finance-money-ops).

---

## Space Details (the 9 V3 Spaces)

> Each Space below is sourced from `~/Desktop/V3/<space>/` (mirrorable to Perplexity UI).
> The "Path" column shows the canonical V3 source folder on disk. The "Perplexity Space" column
> shows the live Perplexity Space (where Marcelo uploads the v3 docs after the manual UI pass).

### Space 1 — `agent-os`
- **Source path:** `~/Desktop/V3/agent-os/`
- **Perplexity Space:** Hermes OS / Agent OS
- **Sub-agent:** BossMan
- **Questions belong here:** How do I route this task? What does Hermes know about X? What's
  the system architecture? What are the profile rules? What are the 7 rules?
- **Key docs (from V3 catalog):** Routing Rules — v3.md, Model Routing Workflow — v3.md,
  ROLES_AND_CHAIN_OF_COMMAND.md — v3.md, LEARNED_7_RULE_CONTRACT.md — v3.md,
  - LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
  v3.md, PHASEREPORT.md — v3.md

### Space 2 — `trading-ops`
- **Source path:** `~/Desktop/V3/trading-ops/`
- **Perplexity Space:** Hermes Trading Ops
- **Sub-agent:** Trading
- **Questions belong here:** Bot status? Trade signals? Risk limits? Daily P&L? Live vs paper?
- **Key docs:** Binance Bot Decision Gap — 2026-06-15 — v3.md, Crypto Trading Intelligence —
  Project Overview/Decisions/Learned Rules — v3.md, Automation Inventory — v3.md, Error
  Escalation — v3.md, Health Monitoring — v3 (Phase 6 Track B) — v3.md

### Space 3 — `finance-money-ops`
- **Source path:** `~/Desktop/V3/finance-money-ops/`
- **Perplexity Space:** Hermes Finance & Money Ops
- **Sub-agent:** Trading + BossMan
- **Questions belong here:** Money Pipeline? Profit targets? Exposure caps? SquarePayouts
  status? AI cost optimization?
- **Key docs:** Money Pipeline v2 — Project Overview — v3.md, Money Pipeline — Legacy Opp-65 /
  Opp-350 Archive — v3.md, Automation Inventory — v3 (Money slice) — v3.md, Error Escalation —
  v3 (Money triggers) — v3.md, Model Routing Workflow — v3 (Money section) — v3.md

### Space 4 — `ops-processes`
- **Source path:** `~/Desktop/V3/ops-processes/`
- **Perplexity Space:** Hermes Ops Processes (Services, PM2 & VPN Reference)
- **Sub-agent:** Ops
- **Questions belong here:** Service health? PM2 status? Cron jobs? Tailscale? Daily checklist?
- **Key docs:** Automation Inventory — v3.md, Routing Rules — v3 (Ops view) — v3.md, Health
  Monitoring — v3.md, Error Escalation — v3.md, Services Map — Obsidian (live mirror) — v3.md,
  Obsidian Vault Workflow (mirror) — v3.md, Blocker Resolutions — v3.md

### Space 5 — `toolchain-dev`
- **Source path:** `~/Desktop/V3/toolchain-dev/`
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- **Sub-agent:** Builder
- **Questions belong here:** Dev environment? Hermes config? Skills? Scripts? Agent file
  - LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
  Executor) — v3.md, BossMan Repo — v3 README — v3.md, Project Template — v3.md, Workflow
  Template — v3.md, Routing Rules — v3.md

### Space 6 — `system-health`
- **Source path:** `~/Desktop/V3/system-health/`
- **Perplexity Space:** Hermes System Health (Monitoring, Alerts & Escalation)
- **Sub-agent:** Ops + qa-verification
- **Questions belong here:** Is anything broken right now? PM2 status? Broken cron? Page
  Marcelo when?
- **Key docs:** Automation Inventory — v3.md, Error Escalation — v3.md, Health Monitoring —
  v3.md, Services Map — Obsidian (live mirror) — v3.md, LEARNED_HEALTH_OS_V3_REPORTING.md —
  v3.md, LEARNED_HEALTH_OS_V3_DECISIONS.md — v3.md (history — superseded 2026-10-02: Health OS deleted 2026-09-30; these docs are not uploaded)

### Space 7 — `knowledge-learning`
- **Source path:** `~/Desktop/V3/knowledge-learning/`
- **Perplexity Space:** Hermes Knowledge & Learning (LEARNED Index & Phase Reports)
- **Sub-agent:** knowledge-canon
- **Questions belong here:** What has the system learned? Memory policy? LEARNED index? Phase
  reports? Crypto intelligence?
- **Key docs:** Memory Policy — v3.md, PHASEREPORT.md — v3.md, LEARNED.md — v3 Index — v3.md,
  Crypto Intelligence — LEARNED — v3.md, Obsidian Vault Workflow Project — Overview — v3.md,
  Kanban Policy Upgrade — Overview — v3.md

### Space 8 — `projects-mission-control`
- **Source path:** `~/Desktop/V3/projects-mission-control/`
- **Perplexity Space:** Hermes Projects & Mission Control (Active Projects Status)
- **Sub-agent:** BossMan + builders (per project)
- **Questions belong here:** What's the status of project X? Mission Control dashboard? Travel
  OS? PMD? Money Pipeline? Opp-65 / Opp-350?
- **Key docs:** Hermes Mission Control — Dashboard — v3.md, Travel OS — Project Overview —
  v3.md, Property Management Dashboard — Project Overview — v3.md, Money Pipeline v2 — Project
  Overview — v3.md, Crypto Trading Intelligence — Project Overview — v3.md, Crypto Trading —
  Audit 2026-06-13 — v3.md, Crypto Trading — Project Timeline — v3.md, Money Pipeline — Legacy
  Archive — v3.md, Opp-65 — SquarePayouts Status — v3.md, Opp-350 — BakeryOps Status — v3.md

### Space 9 — `shared`
- **Source path:** `~/Desktop/V3/shared/`
- **Perplexity Space:** Hermes Shared
- **Sub-agent:** BossMan
- **Questions belong here:** Cross-Space canon — what are the meta-rules? How do Spaces stay
  in sync? What's the model policy? Separation rules? Memory policy? Vault workflow?
- **Key docs:** Routing Rules — v3 (Shared).md, Memory Policy — v3 (Shared).md, Obsidian
  Vault Workflow — v3 (Shared).md, PHASEREPORT.md — v3 (Shared).md, Automation Inventory —
  v3 (Shared).md, Hermes Model Policy — v3.md, Hermes Spaces Config — v3.md, Hermes ↔
  Perplexity Separation Rules — v3.md, Perplexity Spaces Sync Workflow — v3.md,
  LEARNED_V3_TOKEN_ECONOMICS.md — v3.md, LEARNED_USER_PREFERENCES_AUTONOMOUS_MODE.md — v3.md,
  LEARNED_V3_BASELINE.md — v3.md, Perplexity Spaces Audit — V3 — v3.md

---

## Sub-Agent → Space Mapping (10 lanes → 9 Spaces)

Per `ROLES_AND_CHAIN_OF_COMMAND.md` and `hermes-sub-agent-master-blueprint.md` (both canonical,
2026-07-20):

| Sub-Agent | Primary Space(s) |
|-----------|-----------------|
| **BossMan** | agent-os, projects-mission-control, shared |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
| **builder** | toolchain-dev (+ projects-mission-control for active project work) |
| **ops** | ops-processes, system-health |
| **trading** | trading-ops, finance-money-ops |
| **content** | projects-mission-control (Content & YouTube work lives under active projects) |
| **travel** | projects-mission-control (Travel OS project work) |
| **qa-verification** | system-health, project-adjacent on all Spaces |
| **research-intel** | per-task Spaces; uses Perplexity Search heavily |
| **knowledge-canon** | knowledge-learning, shared (doc-hygiene owner) |
| **self-improvement** | shared (skill curation); agent-os (capability work) |
| **loop-engineering** | agent-os, shared (goal-loop / pipeline engineering) |

---

## Model Policy Reference

All Spaces reference **`Hermes Model Policy — v3.md`** (this Space's mirror) for model routing;
the **canonical source of truth** is **`~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md`**.
Default: **MiniMax M3**. Escalate per the task-type matrix, not preemptively.

---

## Source of truth pointers

- **V3 Spaces catalog (canonical, history — retired 2026-10-02):** `~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md` (per-Space
  upload + retire lists, 77 uploads across the 9 Spaces)
- **V3 audit & manual update checklist:** `~/Desktop/V3/shared/Perplexity Spaces Audit — V3 —
  v3.md` (current vs V3-recommended values, per-Space URL, AI prompt template)
- **V3 mirrors wipe + resync runbook:** `~/Desktop/V3/MIRRORS_WIPE_AND_RESYNC_RUNBOOK.md` (history — ~/Desktop/V3 no longer exists)
- **Source-of-truth knowledge:** `~/.hermes/knowledge/LEARNED_*.md` (model stack, roles,
  7-rule contract)

---

## Change log (v3.0 → v3.1, 2026-07-20)

- **Spaces increased from 8 → 9 V3 Spaces.** The pre-v3.1 file listed 8 Spaces (Agent OS,
  Trading Ops, Trading Strategy & Portfolio, Toolchain & Dev, Business & Ideas, Content &
  YouTube, Real Estate, Ops Processes). Today's V3 catalog
  (`~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md`, 2026-07-20 revision) defines exactly **9**:
  **agent-os, trading-ops, finance-money-ops, ops-processes, toolchain-dev, system-health,
  knowledge-learning, projects-mission-control, shared.**
- **Consolidations captured:** "Trading Strategy & Portfolio" → `finance-money-ops`;
  "Business & Ideas" → `finance-money-ops` + `projects-mission-control`; "Content & YouTube"
  + "Real Estate" → `projects-mission-control` (these are owned projects, not standalone Spaces).
- **New Spaces added in V3:** `system-health`, `knowledge-learning`, `projects-mission-control`,
  `shared` (the "shared" half of the old `shared/` folder is now its own Space).
- **V3 folder at `~/Desktop/V3/`** is now cited as today's **authoritative source of truth**
  for Hermes docs; `/Users/bigdawg/Desktop/perplexity-spaces Hermes/` is now described as a
  legacy mirror.
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
  (canonical per `LEARNED_V3_MODEL_STACK.md`).
- **Sub-agent → Space mapping updated** from 5 lanes (BossMan/Builder/Ops/Trading/Content) →
  - LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
  `ROLES_AND_CHAIN_OF_COMMAND.md`.
- **Space Details section** rewritten for all 9 V3 Spaces; each Space now lists its source
  path (`~/Desktop/V3/<space>/`), Perplexity display name, owning sub-agent, sample questions,
  and key docs (as specified in the V3 catalog).
- **Model Policy Reference** now points to `Hermes Model Policy — v3.md` and the canonical
  `LEARNED_V3_MODEL_STACK.md`; `LEARNED_V3_MODEL_STACK.md` wins on conflict.
- **Source of truth pointers** added: V3 catalog, V3 audit, mirrors wipe+resync runbook,
  knowledge canon.
- **Frontmatter updated:** version v3.0 → v3.1 (refined 2026-07-20); date 2026-06-16 → 2026-07-20;
  added **Source of truth** (`~/Desktop/V3/HERMES_PERPLEXITY_V3_DOCS.md`) and **Locked by:**
  V3 audit, 2026-07-20.
- **Drift guard:** if this file's Space roster diverges from `HERMES_PERPLEXITY_V3_DOCS.md`,
  the V3 catalog wins.
