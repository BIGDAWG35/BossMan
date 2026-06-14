---
id: PROJ-2026-06-crypto-trading-intelligence
name: Crypto Trading Intelligence (CSDAWG 2.0)
status: active
owner: Marcelo
created: 2026-06-13
tags: [trading, crypto, CSDAWG, intel, integration, knowledge-base]
---

# Crypto Trading Intelligence (CSDAWG 2.0)

## What this project is

A unified crypto / trading knowledge base for Marcelo that consolidates:

1. **Live intelligence engine** at `~/.hermes/knowledge/crypto-intel/` — producing weekly regime + sector + coin-ranking + prediction reports, consumed by the live `binance-bot` (8104) via `INTEL_GATE`, served read-only by the `csdawg-dashboard` (8150).
2. **Design canon** harvested from the orphaned `~/Desktop/CLAW-Backup/` vault — the original CSDAWG 2.0 design docs that the live engine was built from, plus audit and recovery notes.
3. **Operative systems** — Binance bot, Kraken bot (in flight), Coinbase bot (archived), pre-trade hook (library), trading-control dashboard.

## Why it exists

Two parallel systems existed before 2026-06-13:

- The **live engine** was producing weekly reports and being read by the bot, but its design history was scattered across an orphaned desktop folder.
- The **orphaned vault** had 12 design docs with the rationale, the integration plan, the question bank, and the review cycle — but nothing read them.

This project **unifies** them: the live engine stays where it is, the design canon moves here, and the operational systems get a single home.

## What's in scope

- The 12 CSDAWG / CRYPTO_INTEL design docs harvested from CLAW-Backup (see `PROJ-Decisions.md` for the full list).
- The 6 blocked trading-track kanban cards (regime, signals, curriculum, 4-cycle, pre-trade hook, monitor rebuild) — see parent card `t_unify_crypto_knowledge_20260613`.
- The 5-week operating history of the live engine (history/2026/) — referenced for context, not duplicated.
- `INTEL_GATE` integration contract between the engine and the Binance bot.
- The weekly review cadence (CSDAWG_REVIEW_CYCLE.md).
- The question bank (CSDAWG_QUESTION_BANK.md) for periodic reviews.

## What's explicitly out of scope

- Coinbase bot (archived 2026-06-13 — see `~/archive/2026-06-13-projects/coinbase-bot/`).
- OpenClaw legacy crypto work (frozen since April 2026, superseded).
- New trading strategies or pair additions (handled by the Binance bot project, not here).
- Real-time trade execution (engine is advisory, execution lives in the bot).

## Architecture (one-paragraph)

Weekly cron (`crypto-intel-weekly.js`) pulls BTC + sector + funding + fear-greed data → regime classifier (4 indicator check) → coin ranker → analyst view (Claude + DeepSeek + OpenAI) → JSON written to `~/.hermes/knowledge/crypto-intel/weekly/YYYY/CRYPTO_INTEL_YYYY-MM-DD.md` + history snapshot + `weekly/latest/intelligence.json` symlink-equivalent. `csdawg-dashboard:8150` reads the same files via Express API. `binance-bot:8104` reads `intelligence.json` on each cycle; if `INTEL_GATE_ENABLED=true` and the regime is BULL or MID_CYCLE, signals are allowed; otherwise blocked. Predictions are graded 7 days later by `csdawg-prediction-grader.js`.

## Live state (as of 2026-06-13)

- **Latest report:** 2026-06-08 (regime MID_CYCLE, confidence 0.45, UNCERTAINTY)
- **Engine status:** running, last cron ran 2026-06-08 (no runs in 5 days, normal cadence)
- **Bot status:** paper mode, INTEL_GATE on, balance $0.01 (paper test), last check 2026-06-14T01:43Z
- **Dashboard status:** live on 8150, serving real data

## Key files in this project folder

- `PROJ-Overview.md` (this file)
- `PROJ-Timeline.md` — when each design doc was created, when the engine went live, when each phase shipped
- `PROJ-Decisions.md` — the design decisions baked into the engine (regime thresholds, INTEL_GATE contract, prediction grading)
- `PROJ-Audit-2026-06-13.md` — the audit that triggered this unification
- `designs/` — the 12 harvested design docs
- `recovered/` — the 3 archived projects + CLAW-Backup cold-storage index

## Related cards

- Parent: `t_unify_crypto_knowledge_20260613` — "Unify crypto knowledge (live engine + CLAW-Backup design docs)"
- Phase 11: `t_phase11` — Binance Bot Phase 11A — Go-Live (LIVE Trading)
- Phase 11B: `t_15_p1_binancebot_tdz` — P15 – BinanceBot – Deploy Phase 11C TDZ Fix

## Related live systems

- `binance-bot` (8104) — live trader, INTEL_GATE consumer
- `csdawg-dashboard` (8150) — read-only intel API
- `crypto-intel-weekly.js` cron — weekly intelligence generator
- `csdawg-prediction-grader.js` — weekly prediction outcome tracker
