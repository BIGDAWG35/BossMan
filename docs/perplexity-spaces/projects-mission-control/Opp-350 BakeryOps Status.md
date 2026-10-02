**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Opp-350 — BakeryOps Status — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Opp-350 — BakeryOps Status

> **2026-10-02 correction:** Basecamp is retired as a workflow surface; the card-table counts and Basecamp links below are a 2026-07-20 snapshot (history). Kanban is the live tracker. Bakery runs as PM2 `bakery` on port 3002 (services registry 2026-10-02), not 8040.
**Version:** v3.1 (refined 2026-07-20 to reflect current project state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (latest kanban sweep 2026-07-20)
## BakeryOps — 2026-07-20 Status
*Exported: 07/20 22:55 | Source: kanban sweep + Basecamp [MPP-350](https://3.basecamp.com/6162349/projects/47218034)*

> **Model routing reminder (LEARNED_7_RULE_CONTRACT.md, Rule 3):** BakeryOps work is **M3-allowed** (SquarePayouts is the M3-BLOCKED one) (history — superseded 2026-10-02: since 2026-09-14 SquarePayouts routing is task-fit, not a blanket M3 block; risk-gated money/auth/PII work goes through route-card.sh `money-path` (Claude Sonnet 4.6, paid, card-only) — see LEARNED_V3_MODEL_STACK.md 'SquarePayouts model routing (Permanent 2026-09-14)'). Per `LEARNED_V3_MODEL_STACK.md`, BossMan picks the model automatically.

### Kanban state (kanban.db bossman board, 2026-07-20)

- `t_13_02` — "13-02 — Resolve BakeryOps issue (port 8040 not responding)" → **done** (BakeryOps port 8040 issue resolved) (history — superseded 2026-10-02: Bakery now runs as PM2 `bakery` on port 3002 per services registry)
- `t_p12_issue_bakeryops` — "[PROJECT:BakeryOps][WARNING] BakeryOps — port 8040 not responding" → **done**
- `t_cfb58542` — "BakeryOps Query Param Sanitization + Secure Cookie Flag (B-1 B-2 B-3 B-4)" → **done**
- `t_638d184e` — "BakeryOps — Order Workflow + Print Slip Generation" → **blocked**

### Card Table — Counts by Column (Basecamp, 2026-07-20 snapshot) (history — superseded 2026-10-02: Basecamp retired as a workflow surface; kanban is the live tracker)

| Column | Count |
|---|---|
| Triage | 5 |
| Not now | 0 |
| Figuring it out | 0 |
| In progress | 0 |
| Done | 0 |

### Cards Detail

**Triage**
- 📋 Intake — MVP Scope *(updated 2026-05-12)*
- 📋 Intake — Pricing & Packages *(updated 2026-05-12)*
- 📋 Intake — Client Communication *(updated 2026-05-12)*
- 📋 Intake — Breadth & Depth *(updated 2026-05-12)*
- 🥐 BakeryOps — MPP-350 Overview *(updated 2026-05-12)*

### Automatic Check-ins

*No check-in questions configured yet. (Automatic Check-ins tool may still be off — enable via Basecamp UI when Francisco is added.) (history — superseded 2026-10-02: Basecamp retired as a workflow surface — do not enable new Basecamp tools)*

### Quick Links

- [Card Table](https://3.basecamp.com/6162349/buckets/47218034/card_tables/9875097201)
- [Automatic Check-ins](https://3.basecamp.com/6162349/buckets/47218034/questionnaires/9875097199)
- [Project Home](https://3.basecamp.com/6162349/projects/47218034)

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Field | Before | After |
|---|---|---|
| Version | v3.0 | v3.1 (refined 2026-07-20) |
| Date | 2026-06-16 | 2026-07-20 |
| Status | Canonical — v3-aligned | Canonical — v3-aligned (latest kanban sweep 2026-07-20) |
| Status section header | "BakeryOps — 2026-06-16 Status" | "BakeryOps — 2026-07-20 Status" |
| Export timestamp | 06/16 09:06 | 07/20 22:55 |
| Model routing note | (absent) | Added: BakeryOps is **M3-allowed**; SquarePayouts is M3-BLOCKED (different project) |
| Kanban state section | (absent) | Added: 4 cards — `t_13_02` done (port 8040), `t_p12_issue_bakeryops` done, `t_cfb58542` done (sanitization), `t_638d184e` blocked (order workflow) |

**Refined by:** BossMan Hermes subagent (projects-mission-control v3.1 mirror sweep)
**Verification:** kanban.db sweep for all BakeryOps cards
**Follow-ups:** Basecamp card table (Triage count = 5) is unchanged since 2026-06-16; one kanban card (`t_638d184e`) remains blocked and could use a follow-up intake card.
