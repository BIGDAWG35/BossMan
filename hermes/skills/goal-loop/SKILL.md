---
name: goal-loop
description: |
  Reusable Goal Loop pattern derived from the crypto learning system. Use whenever
  Marcelo expresses a goal, project, or learning objective that has a timeframe and
  clear success criteria. The pattern enforces: goal intake (success criteria +
  timeframe), child card creation (subtasks/stages), review cadence (weekly/monthly)
  with clear STOP conditions, done criteria + lesson harvesting, and Hermes knowledge
  mirror discipline. Triggers: "I want to learn X", "new goal:", "objective:", "track
  progress on Y", "weekly review", "monthly review", "goal done", "what did we
  learn", "harvest lessons". NOT for: one-shot tasks (use ACP), single-card bug fixes,
  or work without a defined success criteria.
version: 1.0.0
author: Hermes / Marcelo
license: proprietary
metadata:
  hermes:
    tags: [goal, loop, review, learning, planning, kanban]
    related_skills: [autonomous-change-pipeline, kanban-orchestrator, curriculum-auto-advance]
---

# Goal Loop Pattern (Permanent — 2026-06-23)

The standing pattern BossMan uses for any goal, learning objective, or multi-week
project. Derived from the crypto learning system (goal card + curriculum + weekly
reviews + auto-advance). Designed to be generic enough to apply to: autonomy
operating model, doc hygiene, security, PM2 health, learning, and any other goal
with a defined success criteria + timeframe.

## Standing rule (Permanent)

Every goal BossMan tracks runs on this loop:

```
┌─────────────────────────────────────────────────────┐
│                  GOAL LOOP PATTERN                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│   1. INTAKE                                         │
│      Goal card with success criteria + timeframe    │
│                        ↓                            │
│   2. DECOMPOSE                                      │
│      Child cards (subtasks, stages)                 │
│      Parent + N children via ACP                    │
│                        ↓                            │
│   3. EXECUTE                                        │
│      Auto-advance via routing rules                 │
│      STOP conditions enforced                       │
│                        ↓                            │
│   4. REVIEW                                         │
│      Weekly / monthly cadence                       │
│      STOP if drift detected                         │
│                        ↓                            │
│   5. DONE                                           │
│      Step-5 verifier PASS required                  │
│      Lessons harvested → LEARNED_*.md               │
│      PHASEREPORT entry                              │
│      Mirror → Obsidian → GitHub                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 1. Goal intake (parent card)

When Marcelo expresses a goal (verbal, in chat, or as a request), BossMan creates
a **goal card** with the following structure:

| Field | Required | Description |
|---|---|---|
| `goal` | yes | One-line statement of the goal |
| `success_criteria` | yes | Measurable conditions for "done" |
| `timeframe` | yes | Expected duration (days/weeks/months) |
| `review_cadence` | yes | weekly / biweekly / monthly |
| `stop_conditions` | yes | List of conditions where BossMan halts and surfaces to operator |
| `carve_outs` | optional | Which ACP carve-out categories apply (infra/port/security/vendor/product-direction) |
| `work_type` | yes | new_build / existing_build / learning / refactor |
| `lead_model` | yes | bossman / claude / deepseek / MiniMax |
| `cost_tier` | yes | low / medium / high / critical |
| `qa_required` | yes | yes / no |

Example goal card body:

```markdown
## Goal: Master crypto regime detection for daily trading signals

- **success_criteria**: Can produce a regime-tagged daily watchlist (bull / bear /
  sideways) with ≥70% backtested accuracy on 2024 data; pipeline runs autonomously
  Mon-Fri 06:00 PT.
- **timeframe**: 8 weeks (2026-06-23 → 2026-08-18)
- **review_cadence**: weekly (every Monday)
- **stop_conditions**:
  - Live trading losses > $X without operator pause → STOP
  - New vendor API required → operator approval
  - Regime detection accuracy < 60% over 2 weeks → STOP and reassess
- **carve_outs**: vendor/billing (CoinMarketData API tier upgrade), security
- **work_type**: learning
- **lead_model**: bossman
- **cost_tier**: medium
- **qa_required**: yes (mandatory Step-5 at week 4 + week 8 milestones)
```

## 2. Child cards (decompose via ACP)

Use the autonomous-change-pipeline skill to decompose the goal into child cards.
Typical structure for a multi-week goal:

- **Stage cards** — major milestones (week 1-2, week 3-4, etc.)
- **Sub-task cards** — concrete work products (build X, test Y, ship Z)
- **Review cards** — one per review cadence tick (weekly_review_N, monthly_review_N)
- **Done card** — final acceptance + lesson harvest

The parent goal card sets `qa_required: yes` and `verify_against: <success_criteria>`.
Each child sets its own `verify_against` + `accept_when`.

## 3. Execute (auto-advance with STOPs)

BossMan advances children through routing rules (todo → ready → in_progress → done).
At every step, the STOP conditions from the goal card are enforced:

- **Money-related STOPs** — never auto-advance past a money threshold without operator pause
- **Drift STOPs** — if success criteria drift (e.g., scope creep), STOP and surface
- **AI disagreement STOPs** — if 2 of {Claude, DeepSeek, OpenAI} disagree, STOP
- **Carve-out STOPs** — any of the 5 ACP carve-outs encountered, STOP and escalate

## 4. Review (cadence-bound)

Every review cadence tick (weekly/monthly), BossMan creates a **review card** as
a child of the goal. The review card must include:

| Section | Required |
|---|---|
| Status vs. success criteria | yes |
| Time elapsed vs. timeframe | yes |
| Drift / scope changes since last review | yes |
| Upcoming work (next week / next month) | yes |
| STOP-condition triggers since last review | yes |
| Operator decision needed? | yes / no |

If a review card surfaces drift, BossMan surfaces the drift to operator BEFORE
auto-advancing. Operator decides: continue / pivot / kill.

## 5. Done (Step-5 + lesson harvest)

When success criteria are met (or goal is killed), the done card includes:

1. **Step-5 verifier PASS** on the final deliverable
2. **Lessons harvested** → write `~/.hermes/knowledge/LEARNED_<topic>_<date>.md`:
   - What was tried
   - What worked
   - What didn't work
   - Patterns to reuse
   - Pitfalls to avoid next time
3. **PHASEREPORT entry** → newest-on-top, references the goal card ID
4. **Mirror discipline** → Hermes knowledge (canon) → Obsidian mirror → GitHub mirror

## Canonical references

- AGENTS.md (M3 routing) — `~/.hermes/AGENTS.md`
- ACP (governance parent) — `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
- kanban-orchestrator — `~/.hermes/skills/devops/kanban-orchestrator/SKILL.md`
- curriculum-auto-advance — `~/.hermes/skills/curriculum-auto-advance/SKILL.md`
- Phase 2 hardening entry — `~/.hermes/knowledge/PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md`

## Examples (proven applications)

| Domain | Goal | Pattern applied |
|---|---|---|
| Crypto learning | Master regime detection | goal card → 8-week curriculum → weekly reviews → done with lessons |
| Autonomy (this) | Phase 1 doc hygiene | goal card → 5 children P1-P5 → done with PHASEREPORT entry |
| Autonomy (this) | Phase 2 hardening | goal card → 5 children P1-P5 → done with PHASEREPORT entry |
| Doc hygiene | Weekly case-dup audit | recurring cron → auto-advance → STOP on detection |
| **Doc hygiene (Phase 3)** | **Monthly Goal Loop** | **goal card `t_3e4a14d4` → 3 children (D1 case-dup, D2 md5 mirror, D3 PHASEREPORT scan) → monthly REVIEW → DONE with P0 fix cards** |
| PM2 health | Service auto-repair whitelist | goal card → scope definition → done with whitelist in PHASEREPORT |

### Worked example: Doc Hygiene Monthly Loop (Phase 3, 2026-06-23)

The canonical example of the Goal Loop pattern applied to a long-lived audit goal.

**Goal card:** `t_3e4a14d4` — "Doc Hygiene — Keep Hermes canon + mirrors drift-free"

**Success criteria (measurable):**
1. No case-dup files in `~/.hermes/knowledge/` (detector returns 0 pairs)
2. All kernel docs md5-match across canon / Obsidian / GitHub mirrors
3. PHASEREPORT.md has an entry for every major doc change since last review
4. Zero unresolved P0 findings at each monthly review

**Timeframe:** ongoing, first review 2026-07-23, then monthly

**5-step loop (proven design — see `~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md` for full spec):**

1. **INTAKE** (Day 1, 00:00 PT) — gather canon + mirror state, write `intake_YYYY-MM-DD.json`
2. **DECOMPOSE** (Day 1, 00:30 PT) — spawn 3 children: D1 case-dup, D2 md5 mirror, D3 PHASEREPORT scan
3. **EXECUTE** (Day 1-3) — run detectors within Scope & STOPs (kernel docs never auto-fixed)
4. **REVIEW** (Day 4-5) — synthesize into `PHASEREPORT_DOC_HYGIENE_YYYY-MM.md` + one-line PHASEREPORT entry
5. **DONE** (Day 5-7) — close cycle; P0s promoted to fix cards; Step-5 PASS

**No-spam cron proposal (NOT registered):** `0 23 1 * *` (1st of each month, 23:00 PT) — local-only when PASS, Telegram only on P0/FAIL. See `~/.hermes/knowledge/DOC-HYGIENE-CRON-PROPOSAL_2026-06-23.md`.

**Why this is a good Goal Loop example:**
- Long-lived (recurring monthly, not one-shot)
- Measurable success criteria (no case-dups, no mirror drift, no P0)
- Cadence-bound (monthly, not ad-hoc)
- Has explicit STOPs (kernel-doc edits escalate)
- Has no-spam compliance (default silent)
- Step-5 QA enforced on P0
- Routing Ledger populated (`work_type: audit`, `qa_required: yes`)

## Pitfalls (Permanent — 2026-06-23)

- **Success criteria must be measurable.** "Learn crypto" is not measurable.
  "Produce regime-tagged watchlist with ≥70% backtested accuracy" is measurable.
- **Timeframe must be realistic.** Multi-week goals without a timeframe become
  zombies that drift indefinitely.
- **Review cadence must be honored.** Skipping reviews is how goals rot.
- **STOP conditions must be specific.** "If things go bad" is not a STOP condition.
  "Live trading losses > $X" is.
- **Lessons must be harvested BEFORE goal done.** Otherwise context is lost.
- **Mirror discipline is one-way: canon → mirror.** Never edit mirror first.
