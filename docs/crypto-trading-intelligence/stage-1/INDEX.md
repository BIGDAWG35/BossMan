---
id: PROJ-2026-06-crypto-trading-intelligence-stage-1
name: Stage 1 — Chart Literacy
status: running
owner: Marcelo
created: 2026-06-13
linked_goal: t_goal_crypto_swing_trader_20260613
parent_card: t_e53da070
tags: [trading, crypto, stage-1, chart-basics, structure, support-resistance, moving-averages]
---

# Stage 1 — Chart Literacy

**Goal:** Get the chart-reading vocabulary locked in before strategy. Every later stage depends on being able to look at a chart and articulate what it shows.

**Why this stage exists:** The engine's regime classifier (CSDAWG 2.0) is built on chart structure. The bot's entry triggers (1H trend + 15m pullback) are chart events. The market's reality is what you see on the chart, not what an indicator says. Without Stage 1, every later concept is downstream noise.

**Reference doc (canonical):** `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — read this before starting any Stage 1 task.

**Parent card:** `t_e53da070` (Crypto Education Curriculum — Modular Foundation, status=running)
**Goal card:** `t_goal_crypto_swing_trader_20260613` (Become a competent crypto swing trader)

---

## Tasks (4 sub-tasks, all linked to the goal)

| # | Card | Status | Topic |
|---|---|---|---|
| 1.1 | `t_crypto_learn_s1_01_chart_basics` | ready | Candles, timeframes, volume |
| 1.2 | `t_crypto_learn_s1_02_bull_bear_structure` | ready | HH/HL, LH/LL, trend strength |
| 1.3 | `t_crypto_learn_s1_03_support_resistance` | ready | Horizontal, diagonal, key levels |
| 1.4 | `t_crypto_learn_s1_04_moving_averages` | ready | 50/200 MA, golden cross, death cross |

Each task has its own card with: deliverable, source material, done criteria, self-test, and reference back to LEARNED_CRYPTO_INTELLIGENCE.md.

---

## Done criteria for Stage 1 (as a whole)

- [ ] All 4 sub-tasks complete
- [ ] Can read a chart cold and articulate: structure (bull/bear/range), key levels, MA regime
- [ ] Self-test: given 5 random BTCUSDT screenshots, can correctly identify regime on 4/5
- [ ] At least one new L-CRYPTO rule written to `LEARNED_CRYPTO_INTELLIGENCE.md` based on something learned in Stage 1
- [ ] Stage 1 INDEX updated with summary of what was learned

---

## Reference

- **Canonical knowledge:** `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (12 durable rules)
- **Live engine output:** `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- **CSDAWG review cycle:** `designs/07_CSDAWG_REVIEW_CYCLE.md` (when to apply these skills)
- **Question bank:** `designs/06_CSDAWG_QUESTION_BANK.md` (A1-A8 weekly questions)
- **Binance bot strategy doc:** `~/Projects/binance-bot/RUNBOOK.md` (current Phase 3.1 config)

## When Stage 1 is done

Move on to **Stage 2 — Crypto-specific mechanics** (funding rates, open interest, BTC dominance, on-chain basics). The Stage 2 tasks are not yet created — they will be added when Stage 1 closes.
