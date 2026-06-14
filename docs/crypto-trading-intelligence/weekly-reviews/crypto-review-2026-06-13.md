# Crypto Weekly Review — 2026-06-13 (Example First Run)

**Date:** 2026-06-13
**Mode detected:** PAPER (binance-bot:8104/api/status → `mode: "PAPER"`)
**Reviewer:** BossMan (this is the template/example; real reviews are auto-generated)
**Linked goal:** t_goal_crypto_swing_trader_20260613

---

## Section A — Questions for Marcelo (5)

> These are derived from current state: Stage 1.1 (chart basics) is `running`. Regime is MID_CYCLE/UNCERTAINTY at confidence 0.45. Funding is NEGATIVE for 164 weeks. BTC at $63,527, -49.6% from ATH. Death cross active 245 weeks.

**A1. Learning reflection (always):**
- What was the single most useful thing you learned about crypto this week?
- What confused you most? (Specifically: anything in the latest intelligence report that didn't match what you see on the chart?)
- What do you want to research next?

**A2. Stage 1 progress (during Stage 1):**
- You're on Stage 1.1 (chart basics). How is it going? Done criteria include the written summary in `stage-1/01-chart-basics.md`.
- Self-test: can you read a candle chart and articulate OHLC + the volume context for each bar, without notes?

**A3. Regime & engine (always):**
- The engine says MID_CYCLE / UNCERTAINTY (confidence 0.45). Funding NEGATIVE 164 weeks. Death cross 245w.
- Does that match what you see on BTCUSDT 1D / 1W?
- Which L-CRYPTO rule (1-12) have you actually used this week?

**A4. Bot behavior (only if bot has traded):**
- Bot is PAPER. Did INTEL_GATE block or allow signals this week?
- (Skip if no signals this week — Stage 1 is about learning, not trading.)

**A5. Risk & discipline (always in PAPER):**
- Did you respect the position sizing rules (3% risk, 28% exposure cap, $75 min notional)?
- Any override of the bot? (Honest answer counts.)
- Any FOMO trades or revenge trades? (Honest answer counts.)

---

## Section B — Questions for CSDAWGBOT (3-5, derived from current gaps)

> These are framed for DeepSeek (primary) and OpenAI (fallback). The agent composes them at review time based on the current state. Below is what would likely be asked this week:

**B1. Engine gaps:**
- The regime classifier uses 4 indicators (200d SMA, 50d/200d cross, drawdown from ATH, momentum 90d). For BTC at -49.6% from ATH with a 245-week-old death cross, the classifier is calling MID_CYCLE with low confidence. Is there a better indicator combination for **extreme** regimes (deep drawdowns that have lasted this long)?

**B2. Curriculum gaps:**
- Stage 1.1 (chart basics) is running. What should Stage 1.5 be — or should we add a Stage 1.5 (volume analysis deep dive, market microstructure basics)?

**B3. Intelligence layer improvements:**
- The current intelligence has 5 history snapshots. With 0 predictions resolved, we can't measure accuracy. What is the minimum set of historical accuracy data we need to start trusting the engine's regime signal?

**B4. Risk rule review (PAPER mode):**
- Bot config: 3% risk per trade, 28% exposure cap, $75 min notional, 1H trend + 15m pullback + RSI filter. Are there well-known crypto-specific risk rules we're missing (e.g., funding-rate-aware position sizing, weekend liquidity)?

**B5. Engine version bump criterion:**
- L-CRYPTO-04 says engine version bumps from 1.x to 2.0 when: 6+ weeks resolved predictions, accuracy > 0%, regime_confidence > 0.6 on ≥50% of reports. Currently 0/10 resolved, confidence 0.45. What's the realistic timeline to hit these gates?

---

## Section C — Mode-aware notes (PAPER)

- All questions to Marcelo focus on **learning** (not PnL)
- CSDAWGBOT tasks focus on **curriculum gaps, intel improvements, backtesting** (not live strategy)
- Risk-management questions (A5) are framed as "what would you want in LIVE mode rules" — not "are the current LIVE rules working"
- **L-CRYPTO-10 two-gate** is dormant — we stay in PAPER until 6+ weeks of resolved predictions + explicit Marcelo approval

---

## Section D — Proposed kanban tasks (CSDAWGBOT outputs)

When the agent actually runs this review and DeepSeek/OpenAI respond, the proposals get created as cards. Example shell:

```
T-1: "Research: better regime classifier for extreme drawdowns (BTC -49% ATH)"
  - assignee: trading
  - goal_id: t_goal_crypto_swing_trader_20260613
  - parent_id: t_e53da070
  - status: ready
  - body: question B1 + expected deliverable + references

T-2: "Curriculum gap: should we add Stage 1.5 (volume / microstructure)?"
  - assignee: trading
  - goal_id: t_goal_crypto_swing_trader_20260613
  - parent_id: t_e53da070
  - status: ready
  - body: question B2 + rationale + effort estimate

(... etc.)
```

---

## Section E — What to do with your answers

After you answer A1-A5 (in any form, voice is fine):
- BossMan reads LEARNED_CRYPTO_INTELLIGENCE.md (canonical reference)
- Routes the answers per the question-templates reference:
  - Tactical (specific trade note) → trade-journal/<date>.md
  - Structural (rule, would still be true in 6 months) → new L-CRYPTO-NN rule in LEARNED_CRYPTO_INTELLIGENCE.md
  - Operational (bug, config issue) → kanban card with `project: Trading`
  - Strategic (long-term question) → open question on the goal card

After CSDAWGBOT answers B1-B5:
- Each proposal becomes a kanban card (status: `ready`)
- You pick which to start
- Started cards go through the same loop (done → lessons → auto-advance)

---

## Section F — Next week

The next `/review` call will:
- Read this file to see what was asked/answered
- Not re-ask the same questions
- Surface any open follow-ups from this review
- Pull the latest engine state (regime, sector, predictions)
- Draft 3-5 new questions, prioritized by what changed

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (12 rules)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (latest engine)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md` (this skill)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-review-template.md` (manual template)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/stage-1/INDEX.md` (Stage 1 status)
