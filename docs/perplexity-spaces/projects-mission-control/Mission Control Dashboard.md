**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Hermes Mission Control — Dashboard — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Hermes Mission Control — Dashboard

> **2026-10-02 correction:** This page is the Obsidian vault landing page as of 2026-06-12/07-20, not a live Mission Control status. Its project list is stale (no Budgeting Software, SquarePayouts or BakeryOps; Binance went LIVE 2026-10-01 as `binance-bot-live`). Mission Control LaunchAgent `com.local.mission-control` was disabled 2026-10-02 (crash loop, exit 78); PM2 app `overview` (port 8000) is online. Current state: '00 - Current State (2026-10-01).md'.
**Version:** v3.1 (refined 2026-07-20 to reflect current project state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (project list refreshed for 2026-07-20)
---
id: dashboard-main
name: Dashboard
type: dashboard
status: permanent
owner: bossman
created: 2026-06-12
last_updated: 2026-07-20
tags: [dashboard, navigation]
---

# Hermes Dashboard

> Single landing page for the Hermes Obsidian vault. If you're looking for something, this is where to start.

## Quick links

- **Operating Blueprint** → [[10_Operating-Blueprint/operating-blueprint]]
- **Latest Phase Report** → [[50_Phase-Reports/PHASEREPORT]] (2026-06-12 — Obsidian vault structure formalized)
- **Services Map** → [[30_Services-Maps/SERVICES_MAP]]
- **Agents** → [[20_Agents/AGENTS]]
- **Obsidian Vault Workflow** → [[70_Workflows/Obsidian Vault Workflow]]

## Active projects

- [[40_Projects/Active/PROJ-2026-06_property-management-dashboard/PROJ-Overview]] — Property Management Dashboard (PMD), Phases 1–9 build complete + 3 audit gates done; in audit-backlog cleanup (PMD was 10/16 done as of 2026-06-12; live via PM2 `pmd-web`:7575 + `pmd-api`:7576, verified 2026-07-20)
- [[40_Projects/Active/PROJ-2026-06_money-pipeline-v2/PROJ-Overview]] — Money Pipeline v2 (MP6 design; epic `t_9f22b48f` is now `done`; live via PM2 `money-pipeline`:8020, verified 2026-07-20)
- [[40_Projects/Active/PROJ-2026-05_travel-os/PROJ-Overview]] — Travel OS (v1 complete 2026-06-03; handoff repo synced 2026-06-05; ongoing polish + Tailscale Funnel decision done; live via PM2 `travel-os`:3537, verified 2026-07-20)
- [[40_Projects/Active/PROJ-2026-06_kanban-policy-upgrade/PROJ-Overview]] — Kanban policy upgrade (done 2026-06-12)
- [[40_Projects/Active/PROJ-2026-06_obsidian-vault-workflow/PROJ-Overview]] — Obsidian vault workflow (this work)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` — Crypto Trading Intelligence (CSDAWG 2.0) — added per the 2026-06-13 audit; 12 weekly reports archived (latest 2026-07-20), `binance-bot` is LIVE (`mode=LIVE`, `intelGate=true`), verified 2026-07-20. (history — superseded 2026-10-02: binance-bot-live (Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval, $250.59 free USDT at start; see Trading Ops 'Binance Bot - Current State.md')

## Main workflows

- [[70_Workflows/Obsidian Vault Workflow]] — permanent standard for the vault itself
- [Kanban inline gate + cron no-spam policy] — `~/.hermes/scripts/telegram-intake-gate.sh`
- [Memory hygiene] — `~/.hermes/scripts/memory-health-check.py` (weekly Monday 9:05 AM)

## Knowledge topics

- [[60_Knowledge-Topics/perplexity-spaces/]] — Perplexity Spaces local mirror (synced via `sync_perplexity_spaces.sh`) (history — superseded 2026-10-02: v3 `sync_perplexity_spaces.sh` + `spaces_file_mapping.json` are retired; Projects are rebuilt from `~/.hermes/knowledge/` into `~/Desktop/spaces/` by `~/.hermes/scripts/build_spaces_v4.py`, with read-only mirrors incl. `~/Obsidian/Hermes/Perplexity Spaces/`)

## Recent changes

- **2026-06-12** — Obsidian vault structure formalized (11 folders + `_Templates/`). See [[50_Phase-Reports/PHASEREPORT]].
- **2026-06-12** — Kanban policy upgrade. All 30 illegal statuses migrated; 73 active cards tagged with project:; 6 ghost runs terminated.
- **2026-06-12** — Inline Telegram-intake gate + cron no-spam policy.
- **2026-06-12** — Memory hygiene codified; 5 profile + active MEMORY.md files reset to clean scaffold.

## Open inbox

- `00_INBOX/` — anything older than 14 days gets flagged by the monthly audit.

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Field | Before | After |
|---|---|---|
| Version | v3.0 | v3.1 (refined 2026-07-20) |
| Date | 2026-06-16 | 2026-07-20 |
| Status | Canonical — v3-aligned | Canonical — v3-aligned (project list refreshed for 2026-07-20) |
| PMD line | "8 phases, ongoing" | "Phases 1–9 build complete + 3 audit gates done; in audit-backlog cleanup; live via PM2 `pmd-web`:7575 + `pmd-api`:7576" |
| Money Pipeline line | "Money Pipeline v2 (MP6 design)" | "MP6 design; epic `t_9f22b48f` is now `done`; live via PM2 `money-pipeline`:8020" |
| Travel OS line | "v1 complete, ongoing polish" | "v1 complete 2026-06-03; handoff repo synced 2026-06-05; ongoing polish + Tailscale Funnel decision done; live via PM2 `travel-os`:3537" |
| Crypto project | (not listed) | Added: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` (CSDAWG 2.0), added per 2026-06-13 audit |

**Refined by:** BossMan Hermes subagent (projects-mission-control v3.1 mirror sweep)
**Verification:** `pm2 jlist`, kanban.db sweep
**Follow-ups:** verify the Obsidian vault folder path is the canonical `40_Projects/Active/` location (current state matches the 2026-06-13 audit recommendation).
