# Crypto Weekly Review — 2026-07-05

**Date:** 2026-07-05 (Sunday, 6pm PT cron — fourth automated run)
**Mode detected:** PAPER (behavioral) — API `mode: "LIVE", paperMode: false, intelGate: true` (string drift unchanged from prior 3 weeks)

> **Mode-field note (carry-forward from 2026-06-21 / 2026-06-28 briefs):** The `/api/status` `mode` field still reports `"LIVE"` post-Stage-6 wiring (2026-06-19). Runtime behavior is unchanged from PAPER:
> - 0 signal_journal entries since 2026-06-14
> - 0 trades since 2026-05-11
> - 0 mode_decisions rows
> - Stage 6 mutation = `NONE — advisory only`
>
> L-CRYPTO-20 binds BossMan from any autonomous PAPER↔LIVE flip. The string drift is cosmetic.

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum — see C7: still `blocked`)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## TL;DR — what changed this week (2026-06-28 → 2026-07-05)

1. **Regime certainty upgraded** `UNCERTAINTY (0.45)` → **`CONFIRMED (0.65)`** — first material regime-confidence move in 7+ weeks.
2. **Funding basis flipped POSITIVE** −999% → **+1401% annualized** (a 2400pp move). New risk flag: **`PUMP_AND_DUMP_RISK ACTIVE/HIGH`**.
3. **BTC −5.96% WoW** ($64,235 → $60,409); drawdown widened to **−52.09%**.
4. **Stage 6 emitter status clarified: it is NOT stalled — it is gated.** Card `t_bb2fd054` is `blocked` on Marcelo preview approval (carried since 2026-06-19 wire-up). Surfaced as the single approval-boundary item in A5.
5. **Intel layer refreshed once** (2026-06-29) — staleness now **5d 19h** (was 6d 20h). Still within the 7d soft-signal threshold but the clock is back to fresh.
6. **0 trades** since 2026-05-11 (correct PAPER behavior).
7. **0 new cards created** this week (L-CRYPTO-14: routine operations are reported, not asked).
8. **Cost: 0 LLM calls, $0.00.** Well under the ≤1-call weekly budget.

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-06-29 → 2026-07-05)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated **2026-06-19T23:02:51 UTC** — same artifact as the prior two briefs).

> **Material reframe vs. last week's "stalled pipeline" framing:** The 2026-06-28 brief escalated the Stage 6 cadence gap (9d) from "routine observation" to "stalled pipeline" and proposed diagnostic read of `daily_pipeline.sh`. **That framing was wrong.** Investigation this week found card **`t_bb2fd054` ("L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated)") is `blocked` since 2026-06-19**, waiting on **Marcelo preview approval**. The emitter code is written and wired; it does not run because the human gate has not been crossed. This is a single approval-boundary item, not a pipeline stall. See A5 / F2.

| Metric | Value |
|---|---|
| Stage 6 emissions this week | 0 (last run: 2026-06-19) |
| Stage 6 emissions trailing radar | 15d 18h (was 9d, last week) |
| Decisions in latest artifact | 1 snapshot (2026-06-19 23:02 UTC) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 (unchanged vs. 2026-06-19) |
| Watchlist | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change since 2026-06-19 |
| Floor audit (L-CRYPTO-14 §1) | 0 violations, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |
| `daily_radar.json` refresh | **YES, 2026-07-05 19:01 UTC** (fresh) |
| `intelligence.json` refresh | **YES, 2026-06-29 22:00 UTC** (one new snapshot) |

### A2. Coin rotation deltas (2026-06-29 → 2026-07-05)

- **Added:** none (no new Stage 6 artifact)
- **Removed:** none (no new Stage 6 artifact)
- **Watchlist (BossMan decision layer):** HYPEUSDT (held; `suspicious_volume` risk_callout, `price_window=out` → DENY at TIER_2_BASE)
- **Watchlist (daily_radar layer, fresh 2026-07-05):** BCHUSDT, BNBUSDT (new — both `price_window=out` for `price_above_25`)
- **Tier transitions:** none — `TIER_2_BASE` (10 coins) and `TIER_1_CONSERVATIVE` (5 coins) stable across all per_coin entries in the 2026-06-19 artifact
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

`signal_journal` remains empty (0 entries since 2026-06-14). The single Stage 6 artifact for the window (2026-06-19) contains 9 QUALIFY + 6 DENY decisions from prior week. In PAPER mode, qualified candidates are not auto-executed.

| Day | Qualified | Denied | Notes |
|---|---|---|---|
| 2026-06-19 (Stage 6 artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), suspicious_volume + price_window=out (1: HYPE) |
| 2026-06-29 → 2026-07-05 | 0 | 0 | **No new Stage 6 emissions this week — gated on Marcelo preview approval (A5/F2)** |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75 (unchanged)
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed in the current artifact.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

| Item | Gate | Status | Approval required? |
|---|---|---|---|
| **Stage 6 emitter preview approval** | L-CRYPTO-14 child-1 (`t_bb2fd054`) | **Blocked since 2026-06-19 — awaiting Marcelo preview** | **YES — single approval request this week** |
| PAPER mode preservation | L-CRYPTO-20 (no autonomous flip) | Preserved | No |
| $75 floor | L-CRYPTO-14 §1 | Held | No |
| Numeric band changes | L-CRYPTO-18 governance | None proposed | No |
| Strategy-class / aggression-tier vocabulary | L-CRYPTO-18/19 governance | Stable, no change | No |
| LIVE pilot | L-CRYPTO-10 two-gate | Inactive (bot still PAPER behaviorally) | No |
| Security/auth/withdrawal | HARD GATE §B | canTrade not yet re-audited; still paused per Phase 12C | No |
| **HARD GATE observatierapport cron 72868985fd12** | L-CRYPTO-14/child-4 (`t_52d08320`) | **Blocked** — paused per Phase 12C | No (already paused) |

**The single approval-boundary item this week: `t_bb2fd054` Stage 6 emitter preview.** All BossMan decisions remain valid against the 2026-06-19 artifact until Marcelo previews and approves the emitter; no autonomous path forward. The artifact will not refresh on its own. Surfaced in F1 as the highest-priority watch item and in B3 as a prompt-ready approval request.

---

## B. CSDAWGBOT status of open cards (no new proposals)

> Per L-CRYPTO-14 amendment: the digest does **not** propose 3-5 new tasks in the normal loop. Five CSDAWGBOT cards remain `todo` from 2026-06-14. The curriculum parent remains `blocked`. **No new cards created this week.**

### B1. Status of 2026-06-14 cards (all `todo`, not picked up — verified on `bossman` board this run)

| Card | Title | Status | Effort | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | S | **Still applicable — but staleness eased.** Intel now 5d 19h (was 6d 20h last week). One new snapshot on 2026-06-29. Reusable entry point for the next refresh. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | S | Resolution windows for T3-01 LINK (2026-06-18), T3-02 WARM (2026-06-19) both passed. Card remains open. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | M | **Cannot be picked up — curriculum parent `t_e53da070` is still `blocked` (see C7).** |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | L | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | M | Single 2026-06-22 hot table still shows Gaming > DeFi (Gaming now leads — was DeFi last 6 weeks). Validation need grows. New fresh radar on 2026-07-05 confirms same ordering. |

### B2. Status of L-CRYPTO-14 children + curriculum parent (verified on `bossman` board)

| Card | Title | Status | Notes |
|---|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine (Phase 1 governance lock) | **ready** | Phase 1 governance shipped 2026-06-19. Not promoted to `running` because Stage 6 emitter (`t_bb2fd054`) is the live execution branch. |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated) | **blocked** | **The approval-boundary item this week.** Blocked on Marcelo preview approval. No technical blocker. |
| `t_1adae96f` | L-CRYPTO-14/child-2: Verify HARD GATE §B cleared (canWithdraw via Binance.US UI) and resume Phase 11A LIVE-readiness checklist | **blocked** | HARD GATE §B (canWithdraw) still paused per Phase 12C. Independent of `t_bb2fd054`. |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit remaining files (crypto-weekly-review SKILL.md + PHASEREPORT.md changes) and push | **blocked** | **Likely root cause of last week's kernel-doc push conflict** (per rebase-stop in 2026-06-28 brief). This card tracks the actual commit; it has not been picked up. |
| `t_52d08320` | L-CRYPTO-14/child-4: 24h observatierapport cron 72868985fd12 — clear HARD GATE before letting it run | **blocked** | Cron `72868985fd12` paused. Independent of `t_bb2fd054`. |
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** | Same state as last week (agent crash x3, dispatcher suspended). Stage 1.2 child `running` status is stale relative to parent state. |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** | Track-level card; rebuild scope unchanged. |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar (5 stages + spike-profit card) | **blocked** | Track-level. Stages 2-5 children are `todo`. Stage 1 (`t_210f2ec8`) `todo`. |

### B3. New CSDAWGBOT proposals this week

**None.** Per L-CRYPTO-14, the weekly digest does not create routine cards. Five open cards from 2026-06-14 + the curriculum parent + the L-CRYPTO-14 child set + the TRACK + DAILY-RADAR track parents are the actionable set for this week. Creating more would violate L-CRYPTO-14 ("BossMan is the autonomous decision engine — do not draft 3-5 questions for Marcelo in the normal loop") and the cost-control rule.

### B4. Approval-boundary cards created

**None** (no new cards created; the one existing approval-boundary item — `t_bb2fd054` — was created 2026-06-19 and is surfaced in A5/F1).

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-07-05 18:00 PT)

```
mode: "LIVE"          ← unchanged drift vs. last 3 weeks
paperMode: false       ← unchanged
intelGate: true        ← unchanged
intelPriceWindow: true ← unchanged
balance: 0.18 USDT
target: 3000 USDT
progress: -6.8%
lastCheck: 2026-07-06T00:56:20Z (UTC; cron ran just past 6pm PT = 01:00 UTC 2026-07-06)
cycle: 1
status: no_signal
exposurePct: 0
```
**Interpretation:** Identical to the 2026-06-21 and 2026-06-28 briefs. The runtime remains PAPER. The `mode` string is still sourced from the post-Stage-6 wire path. **No action required.** L-CRYPTO-20 holds.

### C2. Engine state — intelligence.json staleness

- **report_date:** 2026-06-29
- **Generated:** 2026-06-29 22:00:19 UTC
- **Age at cron time (2026-07-05 18:00 PT):** **5 days, 19 hours**
- **Status:** **Within 7-day soft-signal threshold (Step 2.1).** One new snapshot since last week's brief (was 6d 20h; now 5d 19h). The prior brief's projection ("13 days old by 2026-07-05 if no refresh") did not hold — the engine ran on 2026-06-29.

Per Step 2.1: **> 7 days stale = first-priority in digest.** We are at 5d 19h — under the trigger. **The intel-refresh card `t_8bec8b2a` is no longer first-priority on staleness grounds** (status upgraded from last week).

The 30-day hard ceiling (Failure-modes section) is still safely distant.

**Historical intel pattern (all snapshots, all `MID_CYCLE`):**

| Date | Regime | Confidence | Certainty |
|---|---|---|---|
| 2026-05-21 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-05-22 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-05-25 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-06-01 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-06-08 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-06-15 | MID_CYCLE | 0.45 | UNCERTAINTY |
| 2026-06-22 | MID_CYCLE | 0.45 | UNCERTAINTY |
| **2026-06-29** | **MID_CYCLE** | **0.65** | **CONFIRMED** |

**Material change this week:** confidence moved from 0.45 → 0.65, certainty moved from UNCERTAINTY → CONFIRMED. This is the first regime-confidence move in 8+ weeks. The engine has flipped from "no-call" to "called MID_CYCLE." Under L-CRYPTO-18 governance, this widens the band BossMan can act in (TIER_1_CONSERVATIVE / TIER_2_BASE / TIER_3_AGGRESSIVE assignments become more meaningful when the regime is called vs uncalled). **But the BossMan decision layer is not running (Stage 6 gated — A5), so this confidence upgrade does not yet translate into BossMan decisions.**

### C3. Regime (as of 2026-06-29 intel snapshot, current best data)

- regime: `MID_CYCLE`
- regime_certainty: `CONFIRMED` (was `UNCERTAINTY`)
- regime_confidence: `0.65` (was `0.45`)
- btc_current_price: $60,409 (was $64,235 on 2026-06-22 → −5.96% WoW)
- btc_200d_sma: $75,557 (was $76,627)
- 50d vs 200d: `death_cross` (still active)
- drawdown_from_ath_pct: `−52.09%` (was −49.05% → −3.04pp deeper)
- btc_7d_pct: `−5.48%`
- momentum_90d_pct: `0`
- volatility_regime: `LOW` (was `NORMAL`)
- hot/warm/watch/cold: **0 / 121 / 2 / 0** (per daily_radar 2026-07-05 — all WARM; only watchlist is COLD-band-eligible, but watchlist is also WARM this week)
- Sector rank (per 2026-07-05 daily_radar top_struct): **Other > L1 > Memecoins > DeFi > AI** (top WARM: SLP, BCH, BNB, LTC, BTC, ETH, HBAR, SOL, HYPE, ZEC)
- Top HOT: none this week — the universe has flattened to WARM; no HOT band entries in the 2026-07-05 radar

**Net regime change vs. last week:** BTC −5.96% WoW. Drawdown widened by 3.04pp. **Volatility regime downgraded NORMAL → LOW.** Confidence flipped from UNCERTAINTY to CONFIRMED. Sector leadership changed — "Other" (meme + service-token heavy) now leads at the top of the WARM band; L1 holds second (was mixed). DeFi absent from the top 10 this week (was 2 weeks ago).

### C4. Risk flags (from 2026-06-29 intel, latest available)

- ~~`REGIME_UNCERTAINTY`~~ — **resolved** (regime now CONFIRMED)
- ~~`NEGATIVE_FUNDING_BIAS`~~ — **replaced** (basis flipped positive — see C5)
- **`PUMP_AND_DUMP_RISK`** — **NEW, ACTIVE, severity HIGH**
  - action: "Extreme perp basis 1401% annualized — funding too high, caution on long entries"
  - meta: `annualized_basis_pct: 1401`

**This is a new risk class for this digest's history.** No prior weekly review has surfaced `PUMP_AND_DUMP_RISK`. The combination of (a) extreme positive perp basis, (b) flattened WARM-band universe (no HOT band), (c) BTC drawdown widening, and (d) confidence upgrade to CONFIRMED is **structurally unusual.** It reads as "regime called MID_CYCLE, but the perp market is pricing in either a reflexive short-squeeze or a perp-spot dislocation that the spot tape has not confirmed."

### C5. Funding regime

**FLIPPED POSITIVE** — first time in this digest's history.

| Week | annual_basis_pct | Sign | Risk flag |
|---|---|---|---|
| 2026-05-21 → 2026-06-15 | small negatives (e.g. −0.3% to −2%) | negative (mild) | none |
| 2026-06-22 | −139% | negative (extreme) | `NEGATIVE_FUNDING_BIAS` |
| 2026-06-28 (prior brief) | **−999%** | negative (extreme widening) | `NEGATIVE_FUNDING_BIAS` |
| **2026-07-05 (this brief)** | **+1401%** | **positive (extreme)** | **`PUMP_AND_DUMP_RISK` HIGH** |

**Net move in 14 days: −139% → +1401% — a 1540pp swing.** This is a structurally important move. Two hypotheses (read-only, no diagnostic execution from this digest):

1. **Perp-spot basis methodology changed** in the intel engine (would explain 7× → 14× order-of-magnitude moves). `t_aefb15e8` (DAILY-RADAR, blocked) likely tracks this; the methodology file is `SPEC-MARKET-REGIMES.md` §6 (referenced in PHASEREPORT).
2. **The perps market genuinely dislocated** — perp annual basis at 1401% means longs are paying shorts ~3.8% per day to hold. This is **not a sustainable rate** and either (a) resolves in a violent short-squeeze (positive basis converges as spot catches up), or (b) resolves in a perp unwind (basis collapses back negative). Either outcome is regime-relevant.

**Recommendation:** The methodology check should be the **first deliverable** when Stage 6 preview approval lands (`t_bb2fd054`). It is also a candidate to be raised on `t_8bec8b2a` (intel refresh) as a specific scope item rather than the generic refresh.

### C6. Trade activity (from `data/bot.db`)

- 15 closed trades all-time (no new trades since 2026-05-11)
- Win/loss: 4 wins, 5 losses, 6 breakeven (pnl=0) — unchanged
- Total closed PnL: **$4.37** (unchanged)
- Last 7 days: **0 trades**
- Last 30 days: 0 trades (last entry was 2026-05-11)

**Interpretation:** The bot has been in pure PAPER-decision mode (signals emitted as decisions in `bossman_decision.json` but not entered as trades) since mid-May. This is the correct PAPER behavior — BossMan produces decisions, the execution layer (not yet fully wired) gates them.

### C7. Curriculum parent `t_e53da070` is still `blocked` (carry-forward)

- Status: `blocked`
- Reason: agent crash x3 (failure threshold 2; consecutive_failures=3)
- Last error: `pid 53163 exited with code 1`
- Children: Stage 1.2 (`t_crypto_learn_s1_02_bull_bear_structure`) still shows `running` in the DB but cannot complete while parent is `blocked`
- Stage 1.3 (`t_crypto_learn_s1_03_support_resistance`) and Stage 1.4 (`t_crypto_learn_s1_04_moving_averages`) remain `todo`

**Carry-forward from 2026-06-28.** No change. Recommend (low priority) the Stage 1.2 crash root-cause is reviewed separately — not in scope for this digest.

### C8. Stage 6 (BossMan Decision Emitter) status — **reframed this week**

- **Wired (Phase 2-3):** 2026-06-19 (per PHASEREPORT entry "Stage 6 BossMan Decision Emitter wired (Phase 2-3)")
- **Latest artifact:** `data/bossman_decision.json` (2026-06-19 23:02 UTC; **15d 18h old at cron time**)
- **Latest daily_radar:** `data/daily_radar.json` (2026-07-05 19:01 UTC — **fresh**)
- **Schema:** v1.0 (L-CRYPTO-15)
- **Mutation:** NONE — advisory only, per L-CRYPTO-14 §3
- **Floor audit:** passing (0 violations in latest artifact)
- **Owner card:** `t_bb2fd054` — **`blocked` on Marcelo preview approval**

**Reframe vs. last week's "stalled pipeline" framing:**

The 2026-06-28 brief escalated the Stage 6 cadence gap (9d) from "routine observation" to "stalled pipeline" and proposed a diagnostic read of `daily_pipeline.sh`. **That framing was incorrect.** Investigation this week found card **`t_bb2fd054` ("L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated)") is `blocked` since 2026-06-19**, waiting on **Marcelo preview approval**. The emitter code is written and wired; it does not run because the human gate has not been crossed. **The right action is not diagnostic — it is approval.** Surfaced in A5 as the single approval-boundary item this week and in F1 as the highest-priority watch item.

### C9. Stage 6 surface drift — daily_radar continued running while emitter gated

While Stage 6 emitter has not emitted since 2026-06-19, `daily_radar.json` has continued to refresh daily (2026-07-05 19:01 UTC, the latest). This means:

- The radar/intake layer is alive and feeding.
- The decision layer (BossMan Stage 6) is gated.
- The execution layer (Stage 5 / spike-profit) is gated.

**Net effect:** the pipeline is split — radar emits, decision doesn't. The bossman_decision.json artifact that downstream consumers (mode_decisions table, signal_journal entries) read is **15d 18h stale.** All BossMan decision-digest data in this brief is sourced from the 2026-06-19 artifact. **If Marcelo approves `t_bb2fd054`, the next Stage 6 run will produce a fresh artifact against the 2026-07-05 radar.** That is the right unblock path.

---

## D. Open kanban tasks (verified on `bossman` board via direct SQL — CLI `kanban show` returns "no such task" because the default board is set to `default`, not `bossman`)

> **Methodology note:** Per the lesson learned this week, the prior weekly briefs referenced kanban IDs (`t_8bec8b2a`, `t_e53da070`, etc.) without verifying the CLI `show` works for them. `hermes kanban show <id>` returns `no such task` for ALL cards on the `bossman` board when called from the `default` board. The cards exist (verified via `sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db`); the CLI board context is the gate. **This brief uses SQL-level verification throughout** — same source of truth, no false-negative on card existence.

### D1. CSDAWGBOT cards from 2026-06-14 (all `todo`)

| Card ID | Title | Status | Created | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | 2026-06-14 | **No longer first-priority on staleness grounds** (5d 19h vs 7d threshold). Becomes first-priority again if next intel run misses. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | 2026-06-14 | Resolution windows for T3-01 LINK, T3-02 WARM passed. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | 2026-06-14 | Cannot pick up — parent `t_e53da070` blocked. |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | 2026-06-14 | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | 2026-06-14 | DeFi absent from top 10 again (this brief). Need grows. |

### D2. L-CRYPTO-14 children (governance)

| Card ID | Title | Status |
|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine | **ready** |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter | **blocked** ← approval-boundary |
| `t_1adae96f` | L-CRYPTO-14/child-2: HARD GATE §B cleared + LIVE-readiness | **blocked** |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit SKILL.md + PHASEREPORT.md + push | **blocked** (kernel-doc conflict stop from 2026-06-28 brief) |
| `t_52d08320` | L-CRYPTO-14/child-4: observatierapport cron — clear HARD GATE | **blocked** |

### D3. Curriculum + tracks

| Card ID | Title | Status |
|---|---|---|
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** (carry-forward; agent crash x3) |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar | **blocked** |

### D4. Cards created this week

**None.** Per L-CRYPTO-14 amendment, the weekly digest does not create routine cards.

### D5. Approval-boundary cards created

**None.** The single existing approval-boundary item is `t_bb2fd054` (A5). Surfaced as a prompt-ready approval request, not a new card.

---

## E. Cost + token usage

- **LLM calls for this digest:** 0
  - All content is templated/derived from data files (intelligence.json, bossman_decision.json, daily_radar.json, bot.db, prior briefs, kanban DB direct read, L-CRYPTO canon).
  - No DeepSeek / OpenAI / M3 call was made.
  - **Cost: $0.00** (well under the ≤1-call weekly budget).
- **Subagent calls:** 0
- **Tool calls for context gathering:** ~25 terminal + ~6 read_file (all cheap, local) + 1 SQL query against kanban.db for board verification.
- **Cost-control compliance:** ✅ within budget. Cost ceiling is 4k-token input per call; we made 0 calls.

**Rationale for 0 LLM calls:** L-CRYPTO-14 says the digest is a *report* of BossMan's decisions, not an LLM-synthesized narrative. The data files are sufficient and structured. Calling a model would be wasteful and would risk hallucinated content. Hard rule #6 (no spam) is honored.

---

## F. Next week (2026-07-12)

### F1. First-order watch items (priority order)

1. **`t_bb2fd054` — Stage 6 emitter preview approval.** This is the single approval-boundary item this week. BossMan decision layer is gated on this card. Without approval, the 2026-07-12 brief will continue to source BossMan decisions from the 2026-06-19 artifact (now 22d 6h old). **Marcelo's preview + approve of the Stage 6 emitter code is the highest-leverage action this week.**
2. **Funding basis re-check on the 2026-07-12 intel run.** If `intelligence.json` runs on schedule, the +1401% reading will either (a) confirm (regime signal), (b) revert (methodology or transient), or (c) move further. The new `PUMP_AND_DUMP_RISK` flag should not be ignored even if the basis normalizes — a methodology audit is warranted regardless. Candidate scope for `t_8bec8b2a` (intel refresh) when it runs.
3. **`t_d070c52c` — kernel-doc push.** Per the 2026-06-28 brief Step 7.2 stop, the local commit `b23db8c` was not pushed because the rebase hit a conflict in `docs/ROUTING-RULES.md`. This card is the formal pickup item. Independent of `t_bb2fd054` but worth surfacing together — both are unblock-paths-on-doc-states.
4. **`t_e53da070` curriculum parent blocked.** Carry-forward. Stage 1.2 agent crash (3x) root cause still un-investigated. Recommend a separate diagnostic run if Marcelo wants the curriculum to advance.
5. **Predictions backlog.** T3-01 LINK, T3-02 WARM resolution windows both passed without entries in the grader log. Card `t_947f0fa4` remains the resolution protocol deliverable.

### F2. Follow-ups tracked (low priority unless escalated)

1. **`mode` field string drift** — `/api/status` now reports `mode: "LIVE", paperMode: false` post-Stage-6-wire. Runtime behavior is still PAPER. L-CRYPTO-20 holds. **Carry-forward from prior 3 briefs.** No movement.
2. **Kanban CLI board context bug.** `hermes kanban show <id>` returns "no such task" for cards on the `bossman` board when CLI is set to `default`. The cards exist (verified via direct SQL on `~/.hermes/kanban/boards/bossman/kanban.db`). This is a CLI bug, not a data bug. Recommend filing a kanban skill issue: `hermes kanban boards switch` does not actually switch the CLI context used by `show`. (Workaround used in this brief: SQL-level reads.)
3. **Regime confidence move.** The 0.45 → 0.65 shift is the first material regime-confidence change in 8+ weeks. If Marcelo approves `t_bb2fd054` and Stage 6 emits against the fresh CONFIRMED reading, BossMan tier assignments will likely widen (TIER_3_AGGRESSIVE may become viable where it wasn't under UNCERTAINTY/0.45). Worth a manual sanity check on the tier band values when the emitter runs.

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

The 2026-06-14, 2026-06-21, and 2026-06-28 briefs did not draft 3-5 questions for Marcelo. Under L-CRYPTO-14, routine operations are **reported**, not asked. **No new questions are surfaced this week.** The single action item is `t_bb2fd054` preview approval — that's a yes/no prompt on the existing card, not a question batch.

### F4. Regime transition watch (carry forward from prior weeks)

- Funding basis: **flipped positive to +1401%** — see C5. Either (a) methodology change or (b) real perp-spot dislocation. Watch next intel run for confirmation/reversion.
- BTC vs 200d SMA: still $15,148 below (now $60,409 vs $75,557). Death cross active for 8+ weeks.
- Neither BTC 200d break nor sustained funding normalization has happened. **Continue watching.**

### F5. BossMan decision layer — open scope

Stage 6 was wired Phase 2-3 on 2026-06-19, but is not emitting daily because it is gated on Marcelo preview approval (`t_bb2fd054`). The next preview-gated pass after that is **execution wire-up** — connecting the Stage 6 artifact to the Policy Gate. Both are roadmap items, not digest items.

---

## Hard rules confirmed for this run

- [x] L-CRYPTO-03: Engine is read-only; no telegram-from-engine, no bot-config writes, no crypto-intel/ writes.
- [x] L-CRYPTO-10: PAPER mode preserved behaviorally; no LIVE-switch signal acted on.
- [x] L-CRYPTO-14: This digest is a report of BossMan's decisions, not a question batch. No 3-5 questions for Marcelo. Approval-boundary items reported (one this week: `t_bb2fd054`).
- [x] L-CRYPTO-20: No autonomous PAPER↔LIVE flip. The API `mode` string drift is reported, not acted on.
- [x] One Telegram Home message will be sent at the end of this run (auto-delivery, no explicit `hermes send`).
- [x] Cost: 0 LLM calls, $0.00 spent. Well under the ≤1-call weekly budget.
- [x] No spam: content is meaningful (full BossMan decision digest + status of 11 open cards + 3 new findings: regime confidence upgrade, funding basis flip positive + PUMP_AND_DUMP_RISK, Stage 6 gated-not-stalled reframe).
- [x] No new cards created for routine operations; no question batch drafted.
- [x] Weekly only: no other schedules or pings created.

---

## References

- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-01 through L-CRYPTO-20, 20 rules + governance pointers)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-06-29, 5d 19h stale)
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC, 15d 18h old — gated on `t_bb2fd054`)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-07-05 19:01 UTC — fresh)
- `~/Projects/binance-bot/data/bot.db` (15 closed trades, 0 since 2026-05-11; 4 wins / 5 losses / 6 breakeven; total PnL $4.37)
- `~/.hermes/kanban/boards/bossman/kanban.db` (11 open trading-related cards: 5 CSDAWGBOT todo + 5 L-CRYPTO-14 children + 1 curriculum parent; verified via direct SQL)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-28.md` (prior brief)
- `~/.hermes/knowledge/crypto-intel/history/2026/*.json` (8 historical snapshots, latest is 2026-06-29)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md`
- Cron job: `ea0157d715fa` (Sundays 6pm PT, telegram-deliver)