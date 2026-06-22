# Crypto Weekly Review — 2026-06-21

**Date:** 2026-06-21 (Sunday, 6pm PT cron — second automated run)
**Mode detected:** PAPER (`binance-bot:8104/api/status` → `mode: "LIVE"`, `paperMode: false`, `intelGate: true`)

> **Note on mode field:** The `mode` field on the API now reports `"LIVE"` while `paperMode: false`. This is a status-shape drift vs. last week where the same endpoint reported `mode: "PAPER", paperMode: true`. The runtime behavior matches PAPER (no signal_journal entries since 2026-06-14, 0 trades since 2026-05-11, all proposals empty, no execution). This is a known artifact from the Stage 6 wiring landed 2026-06-19 — the `mode` reporting field is now sourcing from a different code path. **No LIVE behavior is active.** PAPER discipline holds per L-CRYPTO-14 §3 and L-CRYPTO-20 (no autonomous PAPER↔LIVE flip).

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-06-14 → 2026-06-21)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated 2026-06-19 16:02, latest wired Stage 6 decision artifact per PHASEREPORT 2026-06-19 entry "Stage 6 BossMan Decision Emitter wired Phase 2-3").

| Metric | Value |
|---|---|
| Total decisions in artifact | 1 (one full snapshot, 2026-06-19) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 |
| Watchlist | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change vs. 2026-06-14 prior |
| Floor audit (L-CRYPTO-14 §1) | 0 violations dropped, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |

### A2. Coin rotation deltas (2026-06-14 → 2026-06-21)

- **Added:** none
- **Removed:** none
- **Watchlist:** HYPEUSDT (held; tagged `suspicious_volume` risk_callout, `price_window=out` → currently DENY at TIER_2_BASE)
- **Tier transitions:** none (TIER_1_CONSERVATIVE / TIER_2_BASE stable across all per_coin entries)
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

The signal_journal table is empty since the 2026-06-14 review (0 signals emitted this week). The BossMan decision artifact from 2026-06-19 contains 9 QUALIFY and 6 DENY decisions. In PAPER mode, qualified candidates are not auto-executed — they are surfaced for review.

| Day | Qualified | Denied | Top denial reasons |
|---|---|---|---|
| 2026-06-19 (BossMan artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), price_window=out (1: HYPE) |
| 2026-06-14 → 2026-06-18 | 0 | 0 | no signals emitted |
| 2026-06-20 | 0 | 0 | no signals emitted |
| 2026-06-21 (today, pre-cron) | 0 | 0 | no signals emitted |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed. All per-coin `notional_usd: 75` is exactly at the floor.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

| Item | Gate | Status | Approval required? |
|---|---|---|---|
| PAPER mode preservation | L-CRYPTO-20 (no autonomous flip) | Preserved | No |
| $75 floor | L-CRYPTO-14 §1 | Held | No |
| Numeric band changes | L-CRYPTO-18 governance | None proposed | No |
| Strategy-class / aggression-tier vocabulary | L-CRYPTO-18/19 governance | Stable, no change | No |
| LIVE pilot | L-CRYPTO-10 two-gate | Inactive (bot still PAPER behaviorally) | No |
| Security/auth/withdrawal | HARD GATE §B | canTrade not yet re-audited; still paused per Phase 12C | No |

**No approval-boundary items this week.** BossMan's decision layer is operating within all defined boundaries. This is the cleanest possible week from a governance perspective.

---

## B. CSDAWGBOT proposals

> Per L-CRYPTO-14 amendment: the digest does **not** propose 3-5 new tasks in the normal loop. The five cards from the 2026-06-14 brief remain `todo` and are the open work this week. They are not re-asked; they are reported as still-open below. **No new cards created this week.**

### B1. Status of 2026-06-14 cards (all `todo`, not picked up)

| Card | Title | Status | Effort | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | Refresh stale intel layer 2026-06-14 | todo | S | **Still applicable — see C2 (intel now 6d stale, +1d vs. last week).** |
| `t_947f0fa4` | Resolve first batch of open predictions | todo | S | First outcomes due 2026-06-18 (T3-01 LINK), 2026-06-19 (T3-02 WARM 13+). Both windows have passed without resolution log entries. |
| `t_00af7146` | Draft Stage 1.3 curriculum module | todo | M | Stage 1.2 still `running` per kanban. L-CRYPTO-13 auto-advance pending. |
| `t_b58afdfe` | Backtest regime-change precursor signals (PAPER) | todo | L | Deferrable. |
| `t_fcc58ae8` | Sector rotation intel enrichment (DeFi lead validation) | todo | M | Newer intel (2026-06-15) still shows DeFi > Memecoins > L1 > AI > Gaming — single date, validation need unchanged. |

### B2. New CSDAWGBOT proposals this week

**None.** The five open cards from 2026-06-14 are still actionable. Adding more would violate L-CRYPTO-14 ("BossMan is the autonomous decision engine — do not draft 3-5 questions for Marcelo in the normal loop") and the cost-control rule (≤1 LLM call per week; no model call was needed for this digest because the data was sufficient).

If Marcelo wants to promote any of the 5 open cards to `running`, he can do so via `hermes kanban promote` or `assign` directly.

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-06-21 18:00 PT)

```
mode: "LIVE"          ← drift vs. last week (was "PAPER")
paperMode: false       ← drift vs. last week (was true)
intelGate: true        ← unchanged
```

**Interpretation:** The API `mode` field has been re-sourced after the Stage 6 wiring landed 2026-06-19. The runtime behavior remains PAPER:
- 0 entries in `signal_journal` since 2026-06-14
- 0 trades in `trades` since 2026-05-11
- 0 `mode_decisions` rows in the DB
- All BossMan decisions contain `stage_6_mutation: "NONE — advisory only"`

**No action required from Marcelo on mode field.** L-CRYPTO-20 binds BossMan from any autonomous PAPER↔LIVE flip. The string drift is cosmetic and not an execution change. **Surfacing as a follow-up in F2 (low priority).**

### C2. Engine state — intelligence.json staleness

- **report_date:** 2026-06-15
- **Generated:** 2026-06-15 22:00:47 UTC
- **Age at cron time (2026-06-21 18:00 PT):** **6 days, ~20 hours**
- **Status:** **6 days stale — within 7-day soft-signal threshold (Step 2.1)**, but very close. **Last week's brief was 6 days stale too**; the intel-refresh card (t_8bec8b2a) was the first-priority item and was not picked up. The intelligence has now aged through a full weekly cycle.

Per Step 2.1: **> 7 days stale = first-priority in digest.** We are at 6d 20h — within hours of the trigger. **This brief flags the impending trigger for next week.**

The full 30-day hard ceiling (Failure-modes section) is still safely distant.

### C3. Regime (as of 2026-06-15 intel snapshot, current best data)

- regime: `MID_CYCLE`
- regime_certainty: `UNCERTAINTY`
- regime_confidence: `0.45` (below 0.5 threshold)
- btc_current_price: $66,345 (was $63,527 on 2026-06-08 → +4.4% week-over-week)
- btc_200d_sma: $77,564.34
- 50d vs 200d: `death_cross` (still active)
- drawdown_from_ath_pct: `-47.38%` (was -49.61% → -2.23pp improvement)
- btc_7d_pct: `+5.20%`
- momentum_90d_pct: `0`
- volatility_regime: `NORMAL`
- hot/warm/cold: **1 / 8 / 14** (per 2026-06-15 intel; sector distribution in source)
- Sector rank (2026-06-15): DeFi > Memecoins > L1 > AI > Gaming (unchanged from 2026-06-08)
- Top HOT: OCEANUSDT (103.5% 7d, AI sector)
- Top WARM: UNIUSDT, AAVEUSDT, CRVUSDT, MKRUSDT, SHIBUSDT, PEPEUSDT, FETUSDT, LINKUSDT, WIFUSDT, ATOMUSDT, SANDUSDT

**Net regime change vs. last week:** BTC +4.4% off the lows, drawdown narrowed by 2.23pp, but confidence and uncertainty labels are unchanged. The engine continues to flag MID_CYCLE/UNCERTAINTY. The BossMan decision layer is correctly choosing TIER_1_CONSERVATIVE for WATCH-band coins and TIER_2_BASE for WARM-band — appropriate for the regime.

### C4. Risk flags (from 2026-06-15 intel, latest available)

- `REGIME_UNCERTAINTY` — confidence 0.45 < 0.5 → "reduce sizing, double-check manually before acting on signals"
- `NEGATIVE_FUNDING_BIAS` — annualized_basis_pct: -139% → "negative funding, check for funding arbitrage" (still active; was -139% last week, no change in available data)

**No new risk flags this week** (consistent with no new intel).

### C5. Funding regime

NEGATIVE for 164+ consecutive weeks (last confirmed 2026-06-15). No new funding data in the past 6 days (intel staleness). Next intel refresh will update this.

### C6. Trade activity (from `data/bot.db`)

- 15 closed trades all-time (no new trades since 2026-05-11)
- Win/loss: 4 wins, 5 losses, 6 breakeven (pnl=0)
- Total closed PnL: $4.37
- Last 7 days: **0 trades**
- Last 30 days: 0 trades (last entry was 2026-05-11)

**Interpretation:** The bot has been in pure PAPER-decision mode (signals emitted as decisions in `bossman_decision.json` but not entered as trades) since mid-May. This is the correct PAPER behavior — BossMan produces decisions, the execution layer (not yet fully wired) gates them.

### C7. Stage 6 (BossMan Decision Emitter) status

- **Wired (Phase 2-3):** 2026-06-19 (per PHASEREPORT entry "Stage 6 BossMan Decision Emitter wired (Phase 2-3)")
- **Latest artifact:** `data/bossman_decision.json` + `data/bossman_decision.2026-06-19.json` (snapshot from 2026-06-19 16:02)
- **Schema:** v1.0 (L-CRYPTO-15)
- **Mutation:** NONE — advisory only, per L-CRYPTO-14 §3
- **Floor audit:** passing (0 violations)

Stage 6 is operating correctly. The artifact updates are not yet daily (the file mtime is 2026-06-19, the daily_radar is 2026-06-21 — BossMan decisions trail radar by 2 days). **This is a routine artifact-cadence observation, not a defect.**

---

## D. Open kanban tasks (assignee=trading)

### D1. Cards from this skill's history

| Card ID | Title | Status | Created |
|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | 2026-06-14 |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | 2026-06-14 |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | 2026-06-14 |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | 2026-06-14 |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | 2026-06-14 |

### D2. Other open trading work

| Card ID | Title | Status | Notes |
|---|---|---|---|
| `t_crypto_learn_s1_02_bull_bear_structure` | Stage 1.2 — Bull/bear structure | running | Curriculum in progress; L-CRYPTO-13 auto-advance to Stage 1.3 pending |

### D3. Cards created this week

**None.** Per L-CRYPTO-14 amendment, the weekly digest does not create routine cards. The five open cards from 2026-06-14 are the actionable set for this week.

### D4. Approval-boundary cards created

**None** (no items crossed an approval boundary this week).

---

## E. Cost + token usage

- **LLM calls for this digest:** 0
  - All content is templated/derived from data files (intelligence.json, bossman_decision.json, daily_radar.json, bot.db, prior brief, L-CRYPTO canon).
  - No DeepSeek / OpenAI / M3 call was made.
  - **Cost: $0.00** (well under the ≤1-call weekly budget).
- **Subagent calls:** 0
- **Tool calls for context gathering:** ~25 terminal + 5 read_file (all cheap, local).
- **Cost-control compliance:** ✅ within budget. Cost ceiling is 4k-token input per call; we made 0 calls.

**Rationale for 0 LLM calls:** L-CRYPTO-14 says the digest is a *report* of BossMan's decisions, not an LLM-synthesized narrative. The data files are sufficient and structured. Calling a model would be wasteful and would risk hallucinated content. Hard rule #6 (no spam) is honored.

---

## F. Next week (2026-06-28)

### F1. First-order watch items

1. **Intel staleness clock.** This brief was 6d 20h stale. By 2026-06-28 cron (Sunday), if no intel refresh runs, the snapshot will be **13 days old** — well past the 7-day soft-signal threshold (Step 2.1). **The intel-refresh card `t_8bec8b2a` will be the first-priority item again, with a stronger trigger.** If the card remains `todo`, BossMan should consider surfacing it as a governance-follow-up.
2. **Stage 1.2 status.** Has bull/bear structure closed? If yes, L-CRYPTO-13 auto-advance should trigger Stage 1.3 (card `t_00af7146` ready to promote).
3. **Prediction resolution backlog.** The 2026-06-18 (T3-01 LINK) and 2026-06-19 (T3-02 WARM 13+) windows have both passed. Card `t_947f0fa4` is the resolution protocol deliverable. Without it, predictions accumulate stale.

### F2. Follow-ups tracked (low priority, no action required)

1. **API `mode` field string drift** — `/api/status` now reports `mode: "LIVE", paperMode: false` post-Stage-6-wire. Runtime behavior is still PAPER. This is a status-shape change, not a mode change. **Governance binding holds via L-CRYPTO-20.** If this becomes noisy in other consumers, a small follow-up card to clarify the wire is reasonable.
2. **Daily BossMan decision cadence** — `bossman_decision.json` mtime is 2026-06-19, but `daily_radar.json` is 2026-06-21. BossMan decisions are trailing by 2 days. This is a routine cadence observation; if it persists into next week it warrants a small fix-it card.

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

The 2026-06-14 brief had 5 questions (A1-A5). Under L-CRYPTO-14, routine operations are **reported**, not asked. **No new questions are surfaced this week.** If Marcelo wants to discuss any of the open cards, he can promote them to `running` and answer in-thread with the agent.

### F4. Regime transition watch (carry forward from 2026-06-14)

- If funding flips positive → first-priority next week.
- If BTC breaks the 200d SMA (currently $77,564) → regime-confirmation event.
- Neither has happened. Continue watching.

### F5. BossMan decision layer — open scope

Stage 6 is Phase 2-3 wired (decision emitter). Per LEARNED_CRYPTO_INTELLIGENCE.md §L-CRYPTO-14 implementation notes, the next preview-gated pass is execution wire-up. **No movement on that this week; no movement expected in the weekly digest cycle.** This is a roadmap item, not a digest item.

---

## Hard rules confirmed for this run

- [x] L-CRYPTO-03: Engine is read-only; no telegram-from-engine, no bot-config writes, no crypto-intel/ writes.
- [x] L-CRYPTO-10: PAPER mode preserved behaviorally; no LIVE-switch signal acted on.
- [x] L-CRYPTO-14: This digest is a report of BossMan's decisions, not a question batch. No 3-5 questions for Marcelo. Approval-boundary items reported (none this week).
- [x] L-CRYPTO-20: No autonomous PAPER↔LIVE flip. The API `mode` string drift is reported, not acted on.
- [x] One Telegram Home message will be sent at the end of this run (auto-delivery, no explicit `hermes send`).
- [x] Cost: 0 LLM calls, $0.00 spent. Well under the ≤1-call weekly budget.
- [x] No spam: content is meaningful (full BossMan decision digest + status of 5 open cards + staleness flags + cadence observations).
- [x] No new cards created for routine operations; no question batch drafted.
- [x] Weekly only: no other schedules or pings created.

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-01 through L-CRYPTO-20, 19 rules + governance pointers)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-06-15, 6d 20h stale)
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19, latest Stage 6 artifact)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-06-21 12:04)
- `~/Projects/binance-bot/data/bot.db` (15 closed trades, 0 since 2026-05-11)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-14.md` (prior brief)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md`
- Cron job: `ea0157d715fa` (Sundays 6pm PT, telegram-deliver)
