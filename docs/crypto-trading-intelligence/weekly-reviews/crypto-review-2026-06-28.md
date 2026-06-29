# Crypto Weekly Review — 2026-06-28

**Date:** 2026-06-28 (Sunday, 6pm PT cron — third automated run)
**Mode detected:** PAPER (behavioral) — API `mode: "LIVE", paperMode: false, intelGate: true` (string drift unchanged from prior week)

> **Mode-field note (carry-forward from 2026-06-21 brief):** The `/api/status` `mode` field still reports `"LIVE"` post-Stage-6 wiring (2026-06-19). Runtime behavior is unchanged from PAPER:
> - 0 signal_journal entries since 2026-06-14
> - 0 trades since 2026-05-11
> - 0 mode_decisions rows
> - Stage 6 mutation = `NONE — advisory only`
>
> L-CRYPTO-20 binds BossMan from any autonomous PAPER↔LIVE flip. The string drift is cosmetic.

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum — see C7: now `blocked`)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-06-21 → 2026-06-28)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated **2026-06-19T23:02:51 UTC**, still the same file as last week's brief).

> **Material change vs. last week:** The 2026-06-21 brief noted Stage 6 emitter "cadence trails daily_radar by ~2 days." This week that gap is **9 days** — the emitter has not produced a new artifact since 2026-06-19. The radar refreshes daily (2026-06-28 12:03), the Stage 6 emitter does not. **This is no longer a routine cadence observation — it's a stalled pipeline.** Surfaced in F2.

| Metric | Value |
|---|---|
| Stage 6 emissions this week | 0 (last run: 2026-06-19) |
| Stage 6 emissions trailing radar | 9 days (was 2 days, last week) |
| Decisions in latest artifact | 1 snapshot (2026-06-19 23:02 UTC) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 (unchanged vs. 2026-06-19) |
| Watchlist | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change since 2026-06-19 |
| Floor audit (L-CRYPTO-14 §1) | 0 violations, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |

### A2. Coin rotation deltas (2026-06-21 → 2026-06-28)

- **Added:** none (no new artifact)
- **Removed:** none (no new artifact)
- **Watchlist:** HYPEUSDT (held; `suspicious_volume` risk_callout, `price_window=out` → DENY at TIER_2_BASE)
- **Tier transitions:** none — `TIER_2_BASE` (10 coins) and `TIER_1_CONSERVATIVE` (5 coins) stable across all per_coin entries
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

`signal_journal` remains empty (0 entries since 2026-06-14). The single Stage 6 artifact for the window (2026-06-19) contains 9 QUALIFY + 6 DENY decisions from prior week. In PAPER mode, qualified candidates are not auto-executed.

| Day | Qualified | Denied | Notes |
|---|---|---|---|
| 2026-06-19 (Stage 6 artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), suspicious_volume + price_window=out (1: HYPE) |
| 2026-06-22 → 2026-06-28 | 0 | 0 | **No new Stage 6 emissions this week** |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75 (unchanged)
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed in the current artifact.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

| Item | Gate | Status | Approval required? |
|---|---|---|---|
| PAPER mode preservation | L-CRYPTO-20 (no autonomous flip) | Preserved | No |
| $75 floor | L-CRYPTO-14 §1 | Held | No |
| Numeric band changes | L-CRYPTO-18 governance | None proposed | No |
| Strategy-class / aggression-tier vocabulary | L-CRYPTO-18/19 governance | Stable, no change | No |
| LIVE pilot | L-CRYPTO-10 two-gate | Inactive (bot still PAPER behaviorally) | No |
| Security/auth/withdrawal | HARD GATE §B | canTrade not yet re-audited; still paused per Phase 12C | No |

**No approval-boundary items this week.** BossMan's decision layer is operating within all defined boundaries (where it has run). This is the cleanest possible week from a governance perspective, but the pipeline itself is stalled (see F2).

---

## B. CSDAWGBOT proposals

> Per L-CRYPTO-14 amendment: the digest does **not** propose 3-5 new tasks in the normal loop. The five cards from the 2026-06-14 brief remain `todo`. The 2026-06-21 brief did not create new cards. **No new cards created this week.**

### B1. Status of 2026-06-14 cards (all `todo`, not picked up)

| Card | Title | Status | Effort | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | Refresh stale intel layer 2026-06-14 | todo | S | **Still applicable — intel now 6d stale (same as last week).** Reusable as the entry point for the fresh refresh. |
| `t_947f0fa4` | Resolve first batch of open predictions | todo | S | Resolution windows for T3-01 LINK (2026-06-18), T3-02 WARM (2026-06-19) both passed. Card remains open. |
| `t_00af7146` | Draft Stage 1.3 curriculum module | todo | M | **Cannot be picked up — curriculum parent `t_e53da070` is now `blocked` (see C7).** |
| `t_b58afdfe` | Backtest regime-change precursor signals (PAPER) | todo | L | Deferrable. |
| `t_fcc58ae8` | Sector rotation intel enrichment (DeFi lead validation) | todo | M | Single 2026-06-22 hot table still shows Gaming > DeFi (Gaming now leads — was DeFi last 6 weeks). Validation need grows. |

### B2. New CSDAWGBOT proposals this week

**None.** Per L-CRYPTO-14, the weekly digest does not create routine cards. Five open cards from 2026-06-14 remain actionable. The 2026-06-21 brief added none, and this brief adds none. Creating more would violate L-CRYPTO-14 (\"BossMan is the autonomous decision engine — do not draft 3-5 questions for Marcelo in the normal loop\") and the cost-control rule (≤1 LLM call per week; no model call was needed for this digest because the data was sufficient).

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-06-28 18:00 PT)

```
mode: "LIVE"          ← unchanged drift vs. last week
paperMode: false       ← unchanged
intelGate: true        ← unchanged
```
**Interpretation:** Identical to the 2026-06-21 brief. The runtime remains PAPER. The `mode` string is still sourced from the post-Stage-6 wire path. **No action required.** L-CRYPTO-20 holds.

### C2. Engine state — intelligence.json staleness

- **report_date:** 2026-06-22
- **Generated:** 2026-06-22 22:00:33 UTC
- **Age at cron time (2026-06-28 18:00 PT):** **6 days, ~20 hours**
- **Status:** **6 days stale — within 7-day soft-signal threshold (Step 2.1),** but the same age as last week's brief. The intel-refresh card `t_8bec8b2a` has been the first-priority item for two consecutive weeks.

Per Step 2.1: **> 7 days stale = first-priority in digest.** We are at 6d 20h — within hours of the trigger. **This brief flags the impending trigger for next week** (if no intel refresh runs, the snapshot will be **13 days old** by 2026-07-05 cron).

The 30-day hard ceiling (Failure-modes section) is still safely distant.

**Historical intel pattern (all snapshots, all `MID_CYCLE conf=0.45`):**

| Date | Regime | Confidence |
|---|---|---|
| 2026-05-21 | MID_CYCLE | 0.45 |
| 2026-05-22 | MID_CYCLE | 0.45 |
| 2026-05-25 | MID_CYCLE | 0.45 |
| 2026-06-01 | MID_CYCLE | 0.45 |
| 2026-06-08 | MID_CYCLE | 0.45 |
| 2026-06-15 | MID_CYCLE | 0.45 |
| 2026-06-22 | MID_CYCLE | 0.45 |

The engine has been reading UNCERTAINTY (confidence < 0.5) for **all 7 captured snapshots**. **This is a strong pattern.** Either (a) the regime has genuinely been unchanged, or (b) the engine is stuck reading the same label. The next intel refresh will resolve this question — and `t_8bec8b2a` is the bottleneck for resolving it.

### C3. Regime (as of 2026-06-22 intel snapshot, current best data)

- regime: `MID_CYCLE`
- regime_certainty: `UNCERTAINTY`
- regime_confidence: `0.45` (below 0.5 threshold)
- btc_current_price: $64,235 (was $66,345 on 2026-06-15 → −3.2% week-over-week)
- btc_200d_sma: $76,627
- 50d vs 200d: `death_cross` (still active)
- drawdown_from_ath_pct: `−49.05%` (was −47.38% → −1.67pp deeper)
- btc_7d_pct: `−2.99%`
- momentum_90d_pct: `0`
- volatility_regime: `NORMAL`
- hot/warm/watch/cold: **5 / 9 / 1 / 8**
- Sector rank: **Gaming > DeFi > Memecoins > L1 > AI** (Gaming now leads; DeFi held the lead 2026-05-21 → 2026-06-15)
- Top HOT: SANDUSDT (15.3% 7d, Gaming), AXSUSDT (13.3%, Gaming), UNIUSDT (11.9%, DeFi)
- Top WARM: CRVUSDT (12 COLD), MANAUSDT, FETCH, MATIC, MKR, ADA, AVAX, SHIB, LINK, AAVE, ATOM, PEPE, DOGE, WIF, DOT, FLOKI, OCEAN, BTC, ETH

**Net regime change vs. last week:** BTC −3.2%, drawdown widened by 1.67pp. Gaming now leads sectors (was DeFi). The engine's UNCERTAINTY label is unchanged. BossMan decision layer would likely re-pick its TIER_1_CONSERVATIVE / TIER_2_BASE assignments on a fresh Stage 6 emit, but no new emission has occurred.

### C4. Risk flags (from 2026-06-22 intel, latest available)

- `REGIME_UNCERTAINTY` — confidence 0.45 < 0.5 → "reduce sizing, double-check manually before acting on signals"
- `NEGATIVE_FUNDING_BIAS` — annualized_basis_pct: −999% (was −139% last week — **massive widening**) → "negative funding, check for funding arbitrage"

**Funding basis shift is material.** The annualized basis went from −139% (last week) to **−999%** this week, a 7× deeper move. This is an extreme negative-funding signal — short-sellers paying long-holders at a rate that suggests a structural perps discount. Either (a) the data scaled representation changed, or (b) the funding regime is becoming more disorderly. **The intel-refresh card `t_8bec8b2a` is now also first-priority for risk-disclosure reasons** (in addition to L-CRYPTO staleness).

### C5. Funding regime

NEGATIVE for 164+ consecutive weeks (last confirmed 2026-06-22). The −999% reading is a meaningful departure from last week's −139% baseline. **Either the basis calculation changed or the perps market is becoming structurally more disordered.** Recommend the next intel refresh include a basis-historical-table comparison to confirm the methodology is consistent.

### C6. Trade activity (from `data/bot.db`)

- 15 closed trades all-time (no new trades since 2026-05-11)
- Win/loss: 4 wins, 5 losses, 6 breakeven (pnl=0) — unchanged
- Total closed PnL: **$4.37** (unchanged)
- Last 7 days: **0 trades**
- Last 30 days: 0 trades (last entry was 2026-05-11)

**Interpretation:** The bot has been in pure PAPER-decision mode (signals emitted as decisions in `bossman_decision.json` but not entered as trades) since mid-May. This is the correct PAPER behavior — BossMan produces decisions, the execution layer (not yet fully wired) gates them.

### C7. **NEW: Curriculum parent `t_e53da070` is `blocked` (agent crash x3)**

```
Diagnostics (1):
  !! [error] Agent crash x3: pid 53163 exited with code 1
     data: consecutive_failures=3 | most_recent_outcome=crashed 
          | last_error=pid 53163 exited with code 1 
          | failure_threshold=2 | failure_limit=2
```

This is a **new state vs. last week.** Last week's brief noted "Stage 1.2 still `running` per kanban." This week, the curriculum parent itself is `blocked` — Stage 1.2 has crashed 3 times (failure threshold 2) and the dispatcher has suspended it. Stage 1.3 (`t_crypto_learn_s1_03_support_resistance`) and Stage 1.4 (`t_crypto_learn_s1_04_moving_averages`) remain `todo` and cannot be picked up until the parent is unblocked.

**Recommendation:** This is a governance-observation item (not approval-boundary). Surfacing in F2 as a low-priority follow-up. BossMan is not running diagnostic / repair on this autonomously — the parent is for a CSDAWGBOT agent that is not part of this digest's scope.

### C8. Stage 6 (BossMan Decision Emitter) status

- **Wired (Phase 2-3):** 2026-06-19 (per PHASEREPORT entry "Stage 6 BossMan Decision Emitter wired (Phase 2-3)")
- **Latest artifact:** `data/bossman_decision.json` (2026-06-19 23:02 UTC; **9 days old at cron time**)
- **Latest daily_radar:** `data/daily_radar.json` (2026-06-28 12:03 UTC)
- **Schema:** v1.0 (L-CRYPTO-15)
- **Mutation:** NONE — advisory only, per L-CRYPTO-14 §3
- **Floor audit:** passing (0 violations in latest artifact)

**The Stage 6 emitter is no longer running daily.** The 2026-06-21 brief noted "BossMan decisions trail radar by 2 days — a routine cadence observation." This week, the trail is **9 days**, and radar updates daily. The bossman_decision.js script is wired (per commit `ad4bb94`) but appears not to have executed since 2026-06-19.

**Hypotheses (read-only, no diagnostic execution from this digest):**
- The Stage 6 cron entry on `daily_pipeline.sh` (`2141a756a0aa`, 12:00 PT) may have failed silently or been paused
- The daily pipeline may now be keyed to a different schedule (e.g. the `Crypto Daily Radar Pipeline (Stage 7)` cron visible in `hermes cron list` — which would emit Stage 7 outputs, not Stage 6)
- The emitter may be hitting one of the 8 hard-reject conditions in its inline JSON-schema validator, silently aborting write (per L-CRYPTO-15 spec, the artifact is NOT written on validator failure)

**Recommendation:** This is a governance-observation item (not approval-boundary). Surfacing in F2 as a medium-priority follow-up. Without a fresh Stage 6 emission, all BossMan decision-digest data becomes stale by the next weekly review.

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
| `t_crypto_learn_s1_02_bull_bear_structure` | Stage 1.2 — Bull/bear structure | running | **Parent `t_e53da070` is now `blocked` (C7)** — child running status is stale relative to parent state |
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** | **NEW: agent crash x3; child Stage 1.2 cannot complete** |

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
- **Tool calls for context gathering:** ~30 terminal + ~6 read_file (all cheap, local).
- **Cost-control compliance:** ✅ within budget. Cost ceiling is 4k-token input per call; we made 0 calls.

**Rationale for 0 LLM calls:** L-CRYPTO-14 says the digest is a *report* of BossMan's decisions, not an LLM-synthesized narrative. The data files are sufficient and structured. Calling a model would be wasteful and would risk hallucinated content. Hard rule #6 (no spam) is honored.

---

## F. Next week (2026-07-05)

### F1. First-order watch items

1. **Intel staleness clock.** This brief was 6d 20h stale; same as last week. By 2026-07-05 cron (Sunday), if no intel refresh runs, the snapshot will be **13 days old** — well past the 7-day soft-signal threshold (Step 2.1). **The intel-refresh card `t_8bec8b2a` is now first-priority for two stacked reasons:**
   - **Staleness:** intel has not refreshed in 7+ days (next week)
   - **Risk disclosure:** the annualized basis moved from −139% to −999% in a single week — a 7× swing that demands methodology verification against historical context
2. **Stage 1.2 status (parent blocked).** The curriculum parent `t_e53da070` was `blocked` at cron time. **This is more material than in prior weeks** because the parent was not blocked last week. Without remediation, L-CRYPTO-13 auto-advance to Stage 1.3 (`t_00af7146`) cannot fire.
3. **Stage 6 emitter cadence.** `bossman_decision.json` is 9 days old. By next week, it will be 16 days old if no fresh emission runs. BossMan decision-digest data quality degrades linearly with this gap.
4. **Prediction resolution backlog.** T3-01 LINK (window 2026-06-18), T3-02 WARM (2026-06-19), and likely additional predictions have passed their resolution windows without entries in the grader log. Card `t_947f0fa4` remains the resolution protocol deliverable.

### F2. Follow-ups tracked (low priority unless escalated)

1. **`mode` field string drift** — `/api/status` now reports `mode: "LIVE", paperMode: false` post-Stage-6-wire. Runtime behavior is still PAPER. L-CRYPTO-20 holds. **Carry-forward from prior briefs** — if this becomes noisy in other consumers, a small clarifying note in the wire is reasonable, not approval-boundary.
2. **Stage 6 emitter cadence.** `bossman_decision.json` mtime is 2026-06-19; radar is 2026-06-28. The gap is **9 days** (was 2 days last week, when it was first flagged as a routine observation). **No longer routine** — escalating to medium priority. The script is wired per commit `ad4bb94` but not emitting. Recommend reading the daily_pipeline.sh cron and the bossman_decision.js inline-validator state before next week's brief.
3. **Curriculum parent `t_e53da070` blocked.** New this week. Not an approval-boundary item, but a curriculum blocker. Recommend a separate review of the Stage 1.2 agent crash (3 consecutive failures; canTrade-related? secrets-related? skill-routing-related?).

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

The 2026-06-14 and 2026-06-21 briefs did not draft 3-5 questions for Marcelo. Under L-CRYPTO-14, routine operations are **reported**, not asked. **No new questions are surfaced this week.** If Marcelo wants to promote any of the 5 open cards to `running`, he can do so via `hermes kanban promote` or `assign` directly.

### F4. Regime transition watch (carry forward from prior weeks)

- If funding flips positive → first-priority next week. (Last week's −139% → this week's −999% is **further negative**, not a flip toward positive. Worth a methodology audit on the basis calculation before assuming the move is real.)
- If BTC breaks the 200d SMA (currently $76,627) → regime-confirmation event.
- Neither has happened. Continue watching.

### F5. BossMan decision layer — open scope

Stage 6 was wired Phase 2-3 on 2026-06-19, but is not emitting daily (see C8). The next preview-gated pass is **execution wire-up** — connecting the Stage 6 artifact to the Policy Gate. **No movement on that this week; the stalled emission is now the most material signal.** This is a roadmap item, not a digest item.

---

## Hard rules confirmed for this run

- [x] L-CRYPTO-03: Engine is read-only; no telegram-from-engine, no bot-config writes, no crypto-intel/ writes.
- [x] L-CRYPTO-10: PAPER mode preserved behaviorally; no LIVE-switch signal acted on.
- [x] L-CRYPTO-14: This digest is a report of BossMan's decisions, not a question batch. No 3-5 questions for Marcelo. Approval-boundary items reported (none this week).
- [x] L-CRYPTO-20: No autonomous PAPER↔LIVE flip. The API `mode` string drift is reported, not acted on.
- [x] One Telegram Home message will be sent at the end of this run (auto-delivery, no explicit `hermes send`).
- [x] Cost: 0 LLM calls, $0.00 spent. Well under the ≤1-call weekly budget.
- [x] No spam: content is meaningful (full BossMan decision digest + status of 5 open cards + new findings: curriculum parent blocked, Stage 6 emitter stalled, funding basis 7× widening).
- [x] No new cards created for routine operations; no question batch drafted.
- [x] Weekly only: no other schedules or pings created.

## References

- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-01 through L-CRYPTO-20, 20 rules + governance pointers)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-06-22, 6d 20h stale)
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC, 9 days old — see C8)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-06-28 12:03 UTC)
- `~/Projects/binance-bot/data/bot.db` (15 closed trades, 0 since 2026-05-11; 4 wins / 5 losses / 6 breakeven; total PnL $4.37)
- `~/.hermes/kanban/boards/bossman/kanban.db` (5 open trading cards + curriculum parent blocked)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-21.md` (prior brief)
- `~/.hermes/knowledge/crypto-intel/history/2026/*.json` (7 historical snapshots, all `MID_CYCLE conf=0.45`)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md`
- Cron job: `ea0157d715fa` (Sundays 6pm PT, telegram-deliver)
