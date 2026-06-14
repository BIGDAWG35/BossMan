# Weekly Trading-Learning Review — Template

**Owner:** Marcelo
**Cadence:** Weekly (Sunday evening)
**Reference (canonical):** `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`
**Output:** This file is updated, and any new lessons are written into LEARNED_CRYPTO_INTELLIGENCE.md

---

## How this review works

1. Open `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` first — read all 12 L-CRYPTO rules.
2. Open `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — read the latest regime, sector pulse, and predictions.
3. Open your Stage 1 / Stage 2 task cards on the kanban — see what's running.
4. Walk through the questions below.
5. **For any new lesson, write it as a new L-CRYPTO-NN rule in LEARNED_CRYPTO_INTELLIGENCE.md.** Don't keep lessons only in this file. They belong in the canonical doc.

---

## Section A — Engine check (5 min)

1. Did the engine produce a new report this week? Check `~/.hermes/knowledge/crypto-intel/weekly/2026/`.
2. What regime is the engine calling? (BULL / BEAR / MID_CYCLE / CHOP / UNCERTAINTY)
3. Confidence score? (above 0.6 = high signal, below 0.5 = cautious)
4. Did INTEL_GATE allow or block Binance bot signals this week?
5. Any new predictions logged? Are any pending 7-day grading about to resolve?

## Section B — Chart study (15 min)

Pick ONE pair. Default: BTCUSDT 1D. This week, optionally: ETHUSDT 4H or SOLUSDT 1D for variety.

1. What's the current structure? (bull HH/HL, bear LH/LL, range?)
2. Where are the obvious S/R levels?
3. Where is price relative to the 50d and 200d MAs?
4. Is there a cross in progress (last 30 days)?
5. Did the live engine's regime match what you see on the chart? If not, why?

## Section C — Curriculum progress (10 min)

1. Which Stage 1 sub-tasks did I work on this week?
2. Which are now `done`? Which are still `running` or `ready`?
3. Any self-tests failed? Where do I need more practice?
4. Do I understand the L-CRYPTO rule(s) that the task references, or do I need to re-read them?

## Section D — Live systems check (5 min)

1. Is `binance-bot` (8104) online? `curl http://localhost:8104/api/status`
2. Is `csdawg-dashboard` (8150) online? `curl http://localhost:8150/api/intel`
3. Did the bot trade this week? (If PAPER, it can trade. If LIVE, it should respect INTEL_GATE.)
4. Any errors in `pm2 logs binance-bot --lines 50`?
5. Any new failed `task_runs` on the kanban for trading cards?

## Section E — Lessons learned (10 min)

For each new lesson this week, ask:

1. **Is it tactical** (a specific trade) → write to `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/trade-journal/<date>.md`
2. **Is it structural** (a pattern, a regime rule, a market behavior) → write as new L-CRYPTO-NN rule in `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`
3. **Is it operational** (a bug, a config issue, a tool problem) → write a kanban card in `project: Trading`
4. **Is it strategic** (a long-term question) → add to the goal card `t_goal_crypto_swing_trader_20260613` as an open question

The threshold for adding to LEARNED_CRYPTO_INTELLIGENCE.md is: would this lesson still be true in 6 months? If yes, it's a rule. If no, it's a journal entry.

## Section F — Next week's plan (5 min)

1. Which Stage 1 sub-task gets the most time next week?
2. Any specific charts to study?
3. Any specific questions to research (Perplexity, papers, books)?
4. Will the bot stay in PAPER mode, or is there a reason to revisit LIVE?

---

## When the review is done

1. Update this file with the answers (rename to `weekly-review-YYYY-MM-DD.md` in the project folder).
2. **If new L-CRYPTO rules were learned:** append them to `LEARNED_CRYPTO_INTELLIGENCE.md` AND mirror to the project folder.
3. **If new trade journal entries:** add to `trade-journal/`.
4. **If new kanban cards:** create them with the project tag.
5. **Bump the engine version** if predictions resolved with high accuracy (L-CRYPTO-04 criterion).

---

## Cross-references

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — **canonical reference**
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/stage-1/INDEX.md` — Stage 1 task status
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/PROJ-Decisions.md` — design decisions baked into the engine
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/designs/06_CSDAWG_QUESTION_BANK.md` — A-H question series
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/designs/07_CSDAWG_REVIEW_CYCLE.md` — review cadence
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — live engine output
