**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Travel OS — Project Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Travel OS — Project Overview

> **2026-10-02 correction:** Travel OS port is 3537 (3535 is old). Per canon LEARNED_TRAVEL_OS.md the move from 3535 to 3537 happened 2026-07-22, so the 'Verified 2026-07-20 … port 3537' line is mis-dated. Blueprint/schema/handoff links (`TRAVEL_OS_*.md`) are not in current canon; canon is `knowledge/LEARNED_TRAVEL_OS.md`.
**Version:** v3.1 (refined 2026-07-20 to reflect current project state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (verified against kanban 2026-07-20)
---
id: PROJ-2026-05_travel-os
name: Travel OS
status: active
owner: builder
created: 2026-05-08
tags: [travel, dashboard, handoff, booking]
---

# Travel OS

## One-line summary

Personal travel operating system: dashboard, booking intelligence, reminders, discovery, risk/compliance, output system, and the canonical handoff repo for Marcelo's second Mac.

## Status

v1 complete 2026-06-03. Handoff repo synced 2026-06-05. Phase 10 (Travel OS Dashboard MVP + Marcelo Review Gate) done (`t_6f835938`). Polished ("Soft Luxury Travel Dashboard" Option A) via `t_travelos_polish_01`. Module persistence (itinerary/expenses/bookings/compliance) done (`t_87258b2c`). Tailscale Funnel exposure decision done (`t_tailscale_funnel_travel_os_1780977389`). Default Itinerary Export (PDF + PPTX) done (`t_travelos_export_policy_01`). GitHub handoff repo prepared for BossLady/Cello Mac mini (`t_travelos_github_handoff_01`). FU1 (closeout metadata + legacy mirror) and FU2 (PM2 restart + `.next` cache hardening) done (`t_777a14c6`, `t_91793334`). Ongoing: trip reminders (Playa del Carmen 2026-05-28 → 2026-06-04, 8 travelers; `t_2dbf13b6`).

> **Verified 2026-07-20:** `travel-os` live via PM2 on port 3537 (curl returns 302). Handoff repo: `https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git`. PM2 `travel-os` (port 3537).

## Scope

**In scope:** dashboard, booking intelligence, reminders (T-14, T-7, T-3, T-1, post-trip), discovery engine, risk/compliance, output system, handoff repo.

**Out of scope:** third-party integrations beyond the 6 trip-reminder crons.

## Key dates

- Kickoff: 2026-05-08
- v1 complete: 2026-06-03
- Handoff repo synced: 2026-06-05

## Links

- Kanban cards: `t_tailscale_*` (blocked), Travel OS handoff sync (history — superseded 2026-10-02: Tailscale Funnel decision `t_tailscale_funnel_travel_os_1780977389` is done (see Status); public URL https://bigdawgs-mac--studio.tailed3212.ts.net/travel-os)
- Blueprint: `~/.hermes/knowledge/TRAVEL_OS_BLUEPRINT.md`
- Schema: `~/.hermes/knowledge/TRAVEL_OS_SCHEMA.md`
- Handoff repo: `https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git`
- Identity note: see `~/.hermes/knowledge/TRAVEL_OS_HANDOFF_REPO.md` — "Cello" / "BossLady" is Marcelo's own second Mac mini, not a separate person
- Live: `http://localhost:3537` (PM2 `travel-os` on 3537)

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Field | Before | After |
|---|---|---|
| Version | v3.0 | v3.1 (refined 2026-07-20) |
| Date | 2026-06-16 | 2026-07-20 |
| Status | Canonical — v3-aligned | Canonical — v3-aligned (verified against kanban 2026-07-20) |
| Status claim | "v1 complete 2026-06-03. Ongoing: minor polish, handoff-repo sync, trip reminders. PM2 `travel-os` on port 3537." | Full list of completed Travel OS cards added: Phase 10 (`t_6f835938`), polish (`t_travelos_polish_01`), module persistence (`t_87258b2c`), Tailscale Funnel decision (`t_tailscale_funnel_travel_os_1780977389`), Itinerary Export PDF+PPTX (`t_travelos_export_policy_01`), GitHub handoff (`t_travelos_github_handoff_01`), FU1 (`t_777a14c6`), FU2 (`t_91793334`), Playa del Carmen research (`t_2dbf13b6`) |

**Refined by:** BossMan Hermes subagent (projects-mission-control v3.1 mirror sweep)
**Verification:** kanban.db sweep for all Travel OS cards; `curl :3537/` (302 redirect confirms service up); handoff repo URL
**Follow-ups:** none required for this project; ongoing trip reminders only.
