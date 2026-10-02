**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/finance-money-ops/Money Pipeline v2 — Project Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Money Pipeline v2 — Project Overview
**Version:** v3.1 (refined 2026-07-20 to reflect SquarePayouts M3-block rule, Opp-65/Opp-350 legacy archive, Money Pipeline v2 state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
---
id: PROJ-2026-06_money-pipeline-v2
name: Money Pipeline v2
status: active
owner: bossman
created: 2026-05-08
tags: [money-pipeline, mp, opportunities, ai]
---

# Money Pipeline v2

## One-line summary

Opportunity discovery + scoring pipeline. MP6 design phase (12 todo, 14 ready); deep-dive builder for the top opportunities.

## Status

Phase 6 (MP6) design in progress. 14 ready cards, mostly legacy [MP] deep-dive test entries. Targeting one real end-to-end test before Phase 7. (history — superseded 2026-10-02: Mission Control dashboard (2026-07-20) records epic `t_9f22b48f` as `done` and the 2026-06-30 target has passed; re-verify phase status)

## Scope

**In scope:** opportunity intake, scoring, aging, drill-down, dashboard → kanban promotion, sales-ready inventory view, outreach workflow.

**Out of scope:** full acquisition pipeline beyond Money Pipeline scope.

## Key dates

- Phase 6 kickoff: 2026-05-08
- Target end-to-end test: 2026-06-30

## Links

- Kanban epic: `t_9f22b48f` (and the 14 MP6-01..14 cards)
- Phase 6 plan: `~/.hermes/knowledge/PHASE2_PLANNING.md` (partial) and `MP6-01..14` card bodies
- Cron jobs: `c77d492c5b6d` (morning research), `8fb30e332d6d` (auto-enrich V2)
- PM2 state (2026-07-20): `money-pipeline` (id 2, online), `pmd-api` (id 5, online), `pmd-web` (id 4, online) — Money Pipeline v2 dashboard listens on port 8020 (PM2 `money-pipeline`); `pmd-web` is the PMD app on 7575
- Canonical SquarePayouts M3-block carve-out: `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` line 164 — M3 (MiniMax M3) is permanently BLOCKED for SquarePayouts code paths. Use Claude → OpenAI → DeepSeek. (history — superseded 2026-10-02: since 2026-09-14 SquarePayouts routing is task-fit, not a blanket M3 block; risk-gated money/auth/PII work goes through route-card.sh `money-path` (Claude Sonnet 4.6, paid, card-only) — see LEARNED_V3_MODEL_STACK.md 'SquarePayouts model routing (Permanent 2026-09-14)')
- Legacy archive: `Money Pipeline — Legacy Opp-65 — Opp-350 Archive — v3.md` (Opp-65 SquaresPayouts + Opp-350 BakeryOps, archived 2026-06-13) (history — superseded 2026-10-02: SquarePayouts is ACTIVE (LEARNED_SQUAREPAYOUTS_ACTIVE.md, 2026-08-17); live status in Projects & Mission Control 'Opp-65 SquarePayouts Status.md')

---

## Change log (v3.0 → v3.1, 2026-07-20)

| # | Patch | Section | What changed |
|---|---|---|---|
| A | Frontmatter | Top of file | Bumped **Version**: v3.0 → **v3.1 (refined 2026-07-20 to reflect SquarePayouts M3-block rule, Opp-65/Opp-350 legacy archive, Money Pipeline v2 state)**; **Date**: 2026-06-16 → **2026-07-20**. |
| B | PM2 state | Links | Added live PM2 state for `money-pipeline` / `pmd-api` / `pmd-web` (all online, 2026-07-20). |
| C | SquarePayouts M3-block | Links | Added pointer to `LEARNED_V3_MODEL_STACK.md` line 164 — permanent M3-block carve-out for SquarePayouts code paths. |
| D | Legacy archive | Links | Added pointer to `Money Pipeline — Legacy Opp-65 — Opp-350 Archive — v3.md` (archived 2026-06-13). |
| E | Change log | This section | The table above. |
