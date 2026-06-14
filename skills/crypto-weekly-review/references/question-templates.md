# Crypto Weekly Review — Question Templates

**Source:** `~/.hermes/skills/crypto-weekly-review/SKILL.md`
**Used by:** `/review` command (on-demand) or future weekly cron

---

## Section A — Questions for Marcelo (3-5 per review)

These are templated but **personalized** based on the current state. The agent reads your prior answers (`weekly-reviews/`) to avoid asking the same question twice.

### A1 — Learning reflection (always asked)
- What was the single most useful thing you learned about crypto this week?
- What confused you most?
- What do you want to research next?

### A2 — Stage 1 progress (asked during Stage 1)
- Which Stage 1 sub-task are you on?
- Are you blocked? If so, on what?
- Self-test: can you [skill from current sub-task] without notes?

### A3 — Regime & engine (always asked)
- Did the engine's regime match what you saw on the chart this week?
- Which L-CRYPTO rule did you actually use?
- Which L-CRYPTO rule felt wrong, or missing?

### A4 — Bot behavior (asked when bot has traded)
- Did the bot trade this week? How many signals? What was the win/loss?
- Did INTEL_GATE block anything that should have been allowed (or vice versa)?
- Any near-miss or false signal you noticed?

### A5 — Risk & discipline (asked in PAPER, and ALWAYS in LIVE)
- Did you respect the position sizing rules?
- Did you override the bot (e.g., close early, skip a signal)? Why?
- Any FOMO trades or revenge trades? (Honest answer counts.)

### A6 — Strategic (asked quarterly or on request)
- Are we closer to "competent" on any axis? (See `/goal` definition)
- Should the curriculum pace change (faster/slower)?
- What to deprioritize?

---

## Section B — Questions for CSDAWGBOT (3-5 per review)

The agent calls **DeepSeek (primary)** and **OpenAI (fallback)** with a prompt that includes:
- Current L-CRYPTO rules
- Latest intelligence summary (regime, sector pulse, predictions)
- Open questions from prior reviews
- Current Stage-N progress
- Mode (PAPER vs LIVE)

**The prompt template:**

```
You are CSDAWGBOT, Marcelo's crypto research specialist. Your job: propose 3-5 concrete research/learning tasks that would improve the CSDAWG 2.0 intelligence engine or advance Marcelo's curriculum toward becoming a competent crypto swing trader.

## Context
- Mode: {PAPER|LIVE}
- Current regime: {regime}, confidence: {confidence}
- Stage: {N} of 4
- Recent L-CRYPTO rules: {list}
- Open Marcelo questions: {list}
- Engine gaps observed: {list}

## Constraints
- Tasks must be concrete (deliverable in 1-4 weeks)
- Each task: title, why-it-matters, expected deliverable, references to read, effort estimate (S/M/L)
- Prefer tasks that advance curriculum OR improve intel quality, not both
- If mode is LIVE, lean toward strategy refinement + risk-rule review
- If mode is PAPER, lean toward learning tasks + intel layer improvements
- Do NOT propose tasks that auto-execute trades or modify live bot config

## Output format
JSON array of tasks. Example:
[
  {
    "title": "...",
    "why": "...",
    "deliverable": "...",
    "references": ["...", "..."],
    "effort": "S|M|L"
  }
]
```

The agent then **creates kanban cards** for each task, with the JSON payload embedded in the body for traceability.

---

## Section C — Mode-aware branching (concrete differences)

| Area | PAPER (current) | LIVE (after two-gate) |
|---|---|---|
| A1 — Learning reflection | always | always |
| A2 — Stage 1 progress | every review | weekly check-in |
| A3 — Regime & engine | always | always |
| A4 — Bot behavior | if bot has traded | every review (more weight) |
| A5 — Risk & discipline | check discipline, not PnL | check discipline AND PnL |
| A6 — Strategic | quarterly | monthly |
| B — CSDAWGBOT | curriculum gaps, intel improvements, backtesting | signal quality, exposure cap calibration, position sizing |
| L-CRYPTO-03 (advisory-only) | enforced | enforced |
| L-CRYPTO-10 (two-gate) | n/a (PAPER is default) | strict — every change to risk rules requires explicit approval |

---

## Section D — How answers become kanban tasks

For each answer from Marcelo or CSDAWGBOT that surfaces a concrete piece of work:

1. **Marcelo answers that are "things to do":** create a card with `assignee=bossman` (BossMan does the work) or `assignee=trading` (CSDAWGBOT does the research).
2. **CSDAWGBOT answers:** create a card with `assignee=trading`, `goal_id=t_goal_crypto_swing_trader_20260613`, `parent_id=t_e53da070`.
3. **Answers that are "things to learn":** create a Stage N+1 sub-task under the curriculum card.
4. **Answers that are "rules to write":** append to `LEARNED_CRYPTO_INTELLIGENCE.md` per the curriculum-auto-advance skill.

All tasks are linked to the goal, the curriculum card, and the unification epic. Status starts at `ready` (not `running` — Marcelo picks which to start).

---

## Section E — What gets logged

After every review, the brief file is the audit log. Plus:
- Each kanban task has a body that includes the question that triggered it
- The brief file is committed to BossMan repo
- LEARNED_CRYPTO_INTELLIGENCE.md gets any new L-CRYPTO rules (per curriculum-auto-advance)
- The weekly review template's Section E ("Lessons learned") is filled in
