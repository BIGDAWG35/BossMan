**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/Crypto Trading Intelligence — Project Overview — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Crypto Trading Intelligence — Project Overview

> **2026-10-02 correction:** This file is a near-duplicate of `trading-ops/Crypto Trading Intelligence - Overview.md` and the two copies disagree on live state (engine cadence, bot LIVE date, dashboard). Both 'Live state' sections are history: binance-bot-live (Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval, $250.59 free USDT at start; see Trading Ops 'Binance Bot - Current State.md'. Weekly-engine analyst view must not use paid models in cron (MiniMax-M3 / Ollama only). No matching canon file exists under knowledge/crypto-intel/ or knowledge/projects/; keep one copy (Trading Ops) as the home.
**Version:** v3.1 (refined 2026-07-20 to reflect current project state)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (verified against live PM2 + DB 2026-07-20)
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
3. **Operative systems** — Binance bot (LIVE since 2026-10-01), Kraken bot (retired), Coinbase bot (retired), pre-trade hook (library), trading-control dashboard.

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
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- New trading strategies or pair additions (handled by the Binance bot project, not here).
- Real-time trade execution (engine is advisory, execution lives in the bot).

## Architecture (one-paragraph)

Weekly cron (`crypto-intel-weekly.js`) pulls BTC + sector + funding + fear-greed data → regime classifier (4 indicator check) → coin ranker → analyst view (Claude + DeepSeek + OpenAI) (history — superseded 2026-10-02: crons + PM2 jobs use MiniMax-M3 or Ollama only; Claude/DeepSeek/OpenAI are paid, card-only via route-card.sh) → JSON written to `~/.hermes/knowledge/crypto-intel/weekly/YYYY/CRYPTO_INTEL_YYYY-MM-DD.md` + history snapshot + `weekly/latest/intelligence.json` symlink-equivalent. `csdawg-dashboard:8150` reads the same files via Express API. `binance-bot:8104` reads `intelligence.json` on each cycle; if `INTEL_GATE_ENABLED=true` and the regime is BULL or MID_CYCLE, signals are allowed; otherwise blocked. Predictions are graded 7 days later by `csdawg-prediction-grader.js`.

## Live state (as of 2026-07-20) (history — superseded 2026-10-02: binance-bot-live (Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval, $250.59 free USDT at start; see Trading Ops 'Binance Bot - Current State.md')

- **Latest report:** 2026-07-20 (regime MID_CYCLE, confidence 0.45, UNCERTAINTY; BTC $65,247; -48.2% from ATH; death_cross active)
- **Engine status:** running, weekly cron on cadence — 12 archived reports on disk (2026-05-20 → 2026-07-20), latest `weekly/latest/intelligence.json` regenerated 2026-07-20
- **Bot status:** `binance-bot` online via PM2 (uptime 8h, pid 69643, port 8104), `mode=LIVE`, `paperMode=false`, `intelGate=true`, `intelPriceWindow=true`, balance $0.18, lastCheck 2026-07-21T06:45:54Z
- **Dashboard status:** `csdawg-dashboard` on port 8150 (was online at audit time — `/api/intel` route returned 404 on 2026-07-20 spot-check; route path may have moved; verify before declaring live)

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

- `binance-bot-live` (8104; legacy PM2 name `binance-bot` retired) — live trader, INTEL_GATE consumer
- `csdawg-dashboard` (8150) — read-only intel API
- `crypto-intel-weekly.js` cron — weekly intelligence generator
- `csdawg-prediction-grader.js` — weekly prediction outcome tracker
- `crypto-weekly-review` skill (`~/.hermes/skills/crypto-weekly-review/`) — on-demand weekly Learning & Intel Review (trigger: `/review` or "crypto review" via Telegram)

## Workflow skills

- `crypto-weekly-review` (on-demand) — reads L-CRYPTO + latest intel, drafts 3-5 questions for Marcelo + 3-5 for CSDAWGBOT, creates linked kanban tasks, branches on PAPER vs LIVE
- `curriculum-auto-advance` — when a Stage sub-task is done, move to done, harvest lessons, auto-advance next sibling
- `pm2-health-check` — 5-min PM2 self-healing (separate, not crypto-specific)

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Field | Before | After |
|---|---|---|
| Version | v3.0 | v3.1 (refined 2026-07-20) |
| Date | 2026-06-16 | 2026-07-20 |
| Status | Canonical — v3-aligned | Canonical — v3-aligned (verified against live PM2 + DB 2026-07-20) |
| Live state section header | as of 2026-06-13 | as of 2026-07-20 |
| Latest report date | 2026-06-08 | 2026-07-20 |
| Latest BTC price | $63,527 (implicit) | $65,247 (-48.2% from ATH) |
| Bot status | PAPER mode, $0.01 | LIVE mode (`paperMode=false`), `intelGate=true`, `intelPriceWindow=true`, $0.18; PM2 uptime 8h |
| Cron cadence claim | "no runs in 5 days, normal cadence" | 12 archived weekly reports 2026-05-20 → 2026-07-20; on cadence |
| Dashboard claim | "live on 8150, serving real data" | port 8150 confirmed; `/api/intel` returned 404 on 2026-07-20 spot-check — route may have moved; flagged for verification |

**Refined by:** BossMan Hermes subagent (projects-mission-control v3.1 mirror sweep)
**Verification:** `pm2 jlist`, `curl :8104/api/status`, `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`, kanban.db sweep
**Follow-ups (not blocking this refinement):** verify `csdawg-dashboard:8150` route map; confirm whether `binance-bot` LIVE mode should be paused given regime `MID_CYCLE` + UNCERTAINTY.
