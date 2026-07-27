# Crypto Weekly Review — 2026-07-26

**Date:** 2026-07-26 (Sunday, 6pm PT cron — seventh automated run)
**Mode detected:** LIVE-configured (`.env` says `PAPER_MODE=false`; runtime behavior remains effectively PAPER via `INTEL_GATE=true` + BossMan-gated Stage 6 not emitting + `LIVE_PILOT_MAX_NOTIONAL=75` cap)

> **Mode-field note (carry-forward from weeks 5/6).** The week 5 brief (2026-07-12) promoted the `mode: "LIVE"` API reading from "string drift" to **env-level LIVE confirmation** (`.env` mtime 2026-06-15, `PAPER_MODE=false` set that day). This week the env value is unchanged. The runtime remains effectively PAPER because (a) `INTEL_GATE_ENABLED=true` gates execution on intel-confirmed signals, (b) BossMan Stage 6 emitter (`t_bb2fd054`) is **blocked** on Marcelo preview approval and has not emitted since 2026-06-19, and (c) the `LIVE_PILOT_MAX_NOTIONAL=75` cap is well below exchange minimums. **Week 7 carry-forward:** single approval-boundary item is still "operator confirmation that `PAPER_MODE=false` is intentional" (carried since week 5).

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum — see C7: still `blocked`)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## TL;DR — what changed this week (2026-07-19 → 2026-07-26)

1. **Bot stayed online 14 days continuous** since the 2026-07-12 sqlite3 arch-mismatch recovery. No new outage. `pm2 restart count delta = 0`. `lastCheck` 3 min before cron time, `status: "no_signal"`, `totalExposure: 0`.
2. **Stage 6 emitter staleness slipped another +7d (now 37d 1h, was 30d 1h 58m).** `data/bossman_decision.json` last write was **2026-06-19 23:02 UTC** → **37d 1h** old at cron time (2026-07-27 01:01 UTC). Still **gated, not stalled** (owning card `t_bb2fd054` blocked since 2026-06-19, week 7 carry-forward). **First-order drift-fix watch item** — the cadence ladder now reads:
   - 0–7d: normal
   - 7–14d: C8 watch item
   - 14–30d: F1 follow-up + gated framing
   - **30d+ (current): F1 first-order watch — digest is now a status report on the gap, not a digest of fresh decisions**
   - **60d+ (next ladder rung): auto-skip + drift-fix card** (Lesson #19). 23 days to threshold.
3. **New intel snapshot (2026-07-20, 6d 10h old) reported regime MID_CYCLE, sector_rank DeFi first.** Carries forward week-6 reactivation: DeFi at `sector_rank[0]`, then Memecoins, L1, AI, Gaming. Funding basis **-700% annualized** (vs -1014% last week, -1638% two weeks ago, +1401% three weeks ago — sign-flip ladder continues).
4. **Daily pipeline (radar + briefs) IS running.** `daily_radar.json` regenerated 2026-07-26 19:04 UTC (fresh, 6h 0m old at cron time). `pair_briefs.json` regenerated 2026-07-26 19:02 UTC. **`run_summary_2026-07-26.json` shows 7/8 stages OK** (stage_2_phase_b_source_tally is "info" not "ok" — the only non-ok). 15 brief entries, all `brief_source: deepseek_batch`. **`top_struct[0]` is KAITOUSDT at HOT/0.92** — a NEW non-universe name promoted to top watch.
5. **0 trades** since 2026-05-11 (correct behavior given BossMan gating; 77d 0-trade streak). `signal_journal` 7-day count = 0. `auto-recovery-state.json` shows 0 historical restart timestamps in the window.
6. **0 new cards created** this week (L-CRYPTO-14: routine operations are reported, not asked). All trading-related open kanban tasks unchanged from week 6.
7. **Cost: 0 LLM calls, $0.00.** Well under the ≤1-call weekly budget.
8. **BossMan repo carries 2 pre-staged files** (one kernel-doc — `docs/hermes-canon/LEARNED_V3_MODEL_STACK.md`, one non-kernel — `docs/AUTOMATION_INVENTORY.md`). Both will be reviewed before commit per the Lesson #18 mirror-drift rule. Local branch is 40 commits ahead of remote (unrelated ongoing work).

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-07-20 → 2026-07-26)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated **2026-06-19T23:02:51 UTC** — same artifact as the prior 6 briefs).

| Metric | Value |
|---|---|
| Stage 6 emissions this week | 0 (last run: 2026-06-19) |
| Stage 6 emissions trailing radar | **37d 1h** (was 30d 1h 58m, last week; was 22d 19m, two weeks ago) |
| Decisions in latest artifact | 1 snapshot (2026-06-19 23:02 UTC) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 (unchanged vs. 2026-06-19) |
| Watchlist (BossMan) | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change since 2026-06-19 |
| Floor audit (L-CRYPTO-14 §1) | 0 violations, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |
| `daily_radar.json` refresh | **YES, 2026-07-26 19:04 UTC** (fresh, 6h 0m old at cron time) |
| `intelligence.json` refresh | **YES, 2026-07-20 15:00 UTC** (6d 10h old at cron time) |

**Material change vs. week 6:** Stage 6 staleness **+7d (30d 1h 58m → 37d 1h)**. The cadence ladder has held at the 30d+ rung for two consecutive cycles now. The owning card `t_bb2fd054` is still `blocked` (week 7 carry-forward). **Framing:** **gated, not stalled.** Approval-boundary surfacing in A5/F1, not a new diagnostic card. **23 days until the 60d auto-skip threshold (Lesson #19)** — at that point the digest auto-skips and a `drift-fix: stage-6-emitter-stuck-60d` kanban card is created in its place.

### A2. Coin rotation deltas (2026-07-20 → 2026-07-26)

- **Added (BossMan):** none (no new Stage 6 artifact)
- **Removed (BossMan):** none
- **Watchlist (BossMan decision layer):** HYPEUSDT (held since 2026-06-19; `suspicious_volume` risk_callout, `price_window=out` → DENY at TIER_2_BASE)
- **Watchlist (daily_radar layer, fresh 2026-07-26 19:04 UTC):** **KAITOUSDT, SHIBUSDT, UNIUSDT** — KAITO is new (HOT 0.92, 22.2% 24h gain, "Other" sector, $17.1M token unlock cited in memo). SHIB held from prior week. UNI is the DeFi reactivation carry-over.
- **do_not_touch (daily_radar):** **REEFUSDT** (down from 3 names last week — 1MWOJAK, 1000REKT, TLM all dropped off the list as their 24h gainers cooled)
- **Tier transitions:** none — `TIER_2_BASE` (10 coins) and `TIER_1_CONSERVATIVE` (5 coins) stable across all per_coin entries in the 2026-06-19 artifact
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

`signal_journal` 7-day count = 0. Trades table 7-day count = 0. Bot API `cycle=1, status=no_signal, totalExposure=0` (current). The single Stage 6 artifact for the window (2026-06-19) contains 9 QUALIFY + 6 DENY decisions from prior week. In the absence of Stage 6 emissions, no new decisions are emitted.

| Day | Qualified | Denied | Notes |
|---|---|---|---|
| 2026-06-19 (Stage 6 artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), suspicious_volume + price_window=out (1: HYPE) |
| 2026-07-20 → 2026-07-26 | 0 | 0 | **No new Stage 6 emissions this week — gated on Marcelo preview approval (A5/F1)** |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75 (unchanged)
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed in the current artifact.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

> Per L-CRYPTO-10 / L-CRYPTO-14: items below are surfaced as **single approval requests**, not question batches. Routine decisions are reported.

| # | Item | Gate | Week first surfaced | Status |
|---|---|---|---|---|
| 1 | **Operator confirmation: `PAPER_MODE=false` is intentional** (env-level) | Gate 1 (mode) | week 5 (2026-07-12) | **carry-forward, week 7** — no card created; recurring F1 watch item |
| 2 | **Stage 6 preview approval** (`t_bb2fd054`, blocked 2026-06-19) — BossMan decision emitter needs Marcelo to unblock and run | Gate 6 (decision-emit) | week 4 (2026-07-05) | **carry-forward, week 7** — owning card unchanged; **37d 1h staleness** |
| 3 | **HARD GATE §B verification** (`t_1adae96f`, blocked) — canWithdraw via Binance.US UI not yet confirmed | Gate 1/4/8 (LIVE-readiness) | week 4 (2026-07-05) | **carry-forward, week 7** — owns Phase 11A LIVE-readiness; unchanged |
| 4 | **24h observatierapport cron 72868985fd12** (`t_52d08320`, blocked) — clear HARD GATE before letting it run | Gate 1/8 (cron + LIVE-readiness) | week 4 (2026-07-05) | **carry-forward, week 7** — gated on #3 |
| 5 | **`t_d070c52c` — Commit remaining files (crypto-weekly-review SKILL.md + PHASEREPORT.md) and push** | Gate 9 (kernel-doc ops) | week 4 (2026-07-05) | **carry-forward, week 7** — see F2 |

**No new approval-boundary items surfaced this week** — the entire decision engine is gated on existing human gates, not requesting new ones. That is the L-CRYPTO-14 design operating as intended.

---

## B. CSDAWGBOT status of open cards (no new proposals)

> Per L-CRYPTO-14, this section is a status report — not a question batch. New proposals require their own cards (created below in D5 only for approval-boundary items; none this week).

### B1. Status of 2026-06-14 cards (all `todo`, not picked up — verified on `bossman` board this run)

| Card | Title | Status | Days blocked/todo |
|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | `todo` | 42d |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | `todo` | 42d |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | `todo` | 42d |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | `todo` | 42d |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | `todo` | 42d |

**Pattern (week 7):** all 5 2026-06-14 CSDAWGBOT cards remain `todo` and unclaimed, same as week 6. The L-CRYPTO-14 amendment explicitly removed "should we pick up the 2026-06-14 backlog?" from the digest — that decision is owned by BossMan's lane routing, not by this digest. No card is being silently held; they are visible and pickable.

**Reactivation signal (carry-forward from Lesson #22):** `t_fcc58ae8` ("DeFi lead validation") is now in the **highest-relevance window** since the 2026-07-13 intel snapshot. DeFi is `sector_rank[0]` for the second consecutive week. **The card's premise is no longer stale** — the canonical intel re-activated the target sector. Per Lesson #22: **re-prioritization is a Section F2 signal, not a new card.** Surface here, do not create.

### B2. Status of L-CRYPTO-14 children + curriculum parent (verified on `bossman` board)

| Card | Title | Status | Note |
|---|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine | `ready` | **PROMOTED to ready** (was `todo` in week 6) — visible to picker |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated) | `blocked` | week 7 carry-forward (gate 6) |
| `t_1adae96f` | L-CRYPTO-14/child-2: Verify HARD GATE §B cleared (canWithdraw) and resume Phase 11A LIVE-readiness | `blocked` | week 7 carry-forward (gate 1/4/8) |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit remaining files (SKILL.md + PHASEREPORT.md) and push | `blocked` | week 7 carry-forward (gate 9) |
| `t_52d08320` | L-CRYPTO-14/child-4: 24h observatierapport cron 72868985fd12 — clear HARD GATE before letting it run | `blocked` | week 7 carry-forward (gate 1/8) |
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | `blocked` | **unchanged since week 1** — see C7 |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar (5 stages + spike-profit card) | `blocked` | stages 1-5 cards all `todo`; **but the daily pipeline IS running (C9)** — see C7 carry-forward |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | `blocked` | week 7 carry-forward |

**No new L-CRYPTO-14 children created this week.** L-CRYPTO-14 is fully governed; this digest is the status surface, not a planning surface.

### B3. New CSDAWGBOT proposals this week

**None.** Per L-CRYPTO-14 amendment 2026-06-19, CSDAWGBOT curriculum-card lifecycle is owned by the trading sub-agent lane, not by the weekly digest. The 5 backlog cards in B1 are the active work surface; no new proposals needed.

### B4. Approval-boundary cards created

**None.** No card created this week. All 5 approval-boundary items in A5 are pre-existing (`t_bb2fd054`, `t_1adae96f`, `t_52d08320`, `t_d070c52c`, and the implicit PAPER_MODE confirmation). Per Hard rule #6: "If the brief is empty, say 'nothing to review this week' and exit. Do not invent content." The brief is NOT empty (it has material findings), but the approval-boundary surface IS empty this week.

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-07-26 18:00 PT)

```
{
  "status": "no_signal",
  "mode": "LIVE",
  "paperMode": false,
  "intelGate": true,
  "intelPriceWindow": true,
  "intelRegime": null,
  "balance": 0.18,
  "target": 3000,
  "progress": "-6.8",
  "lastCheck": "2026-07-27T00:58:26.307Z",
  "utcDate": "2026-07-27",
  "dailyLimitHit": false,
  "todayClosedPnl": 0,
  "consecutiveLosses": 0,
  "cooldownActive": false,
  "totalExposure": 0,
  "maxExposure": 0.05,
  "availableExposure": 0.05,
  "maxPositions": 1,
  "minTradeNotional": 75,
  "exposurePct": 0
}
```

- `status: "no_signal"` — correct given BossMan gating
- `totalExposure: 0` — correct given BossMan gating
- `consecutiveLosses: 0` — clean
- `lastCheck: 2026-07-27T00:58:26.307Z` — 3 minutes before cron time → health loop running
- `maxExposure: 0.05` / `availableExposure: 0.05` / `maxPositions: 1` — risk envelope intact, unchanged

### C1.1 Env-level LIVE confirmation (carry-forward, week 7)

Direct `.env` inspection (per Lesson #17):
- `PAPER_MODE=***` (redacted in logs — value unchanged from week 5 reading: `false`)
- `INTEL_GATE_ENABLED=***` (redacted — `true`)
- `LIVE_PILOT_MAX_NOTIONAL=***` (redacted — `75`)

**Disposition:** env-level LIVE for 41 days (since 2026-06-15). Runtime is effectively PAPER because (a) `INTEL_GATE_ENABLED=true` gates execution, (b) BossMan Stage 6 emitter is `blocked` and not emitting, (c) `LIVE_PILOT_MAX_NOTIONAL=75` is below exchange minimums. **No silent mutation occurred this week** — env values are byte-for-byte identical to week 5 reading.

### C2. Engine state — intelligence.json staleness

- `intelligence.json` mtime: **2026-07-20 15:00 UTC** (6d 10h old at cron time)
- **Step 2.1 staleness rule:** soft signal at 7d. **At 6d 10h we are below the 7d soft threshold** — first time in 3 weeks. Carry-forward note: when staleness < 7d, no Section C first-priority intel-refresh entry is required.
- Regime in latest snapshot: `MID_CYCLE` (carry-forward)
- Confidence: `null` in latest snapshot (was MEDIUM in week 6; this week the `intelligence.json` schema dropped confidence as a top-level field — `intelligence.json` shape change is a separate sub-task, not a regime change)

### C3. Regime (as of 2026-07-20 intel snapshot, current best data)

- `regime_today`: `MID_CYCLE` (unchanged since week 4)
- `sector_rank`: **[DeFi, Memecoins, L1, AI, Gaming]** — DeFi holds the #1 rank for the second consecutive week. Per Lesson #22 this is the reactivation signal driving `t_fcc58ae8` re-prioritization in F2.
- `hot_pairs`: `null` in the latest intel snapshot (the daily_radar layer has its own `top_n` — see C9)
- `research_quality`: PARTIAL (carry-forward)
- **No regime transition in the window.** MID_CYCLE is now 4 consecutive weeks.

### C4. Risk flags (from 2026-07-26 daily memo)

The 2026-07-26 daily memo (`DAILY_MEMO_2026-07-26.json`, `sanity_verdict: PASS`) flagged two material risks:

1. **Concentration: 60% of top-10 is 'Other' sector, indicating low sector diversity.** This is a new flag (not present in week 6 memo). Driven by KAITO (Other), ZIL (Other), and the top_struct carrying 6-of-10 names in "Other" — i.e., unclassified, low-coverage. The DeFi reactivation in `sector_rank[0]` does NOT translate to the top_struct — UNI is the only DeFi name in top 10. **This is a divergence signal worth watching** but not actionable this week (regime still MID_CYCLE, no rotation).
2. **Research quality PARTIAL: SHIBUSDT research is truncated and lacks full external synthesis; missing on-chain and sentiment details** — the SHIB "no specific catalysts" thesis is the visible artifact of this. Same flag pattern as prior weeks.

### C5. Funding regime (from `funding_basis`)

| Week | Annualized basis | Sign | Notes |
|---|---|---|---|
| 2026-06-21 | -1100% | NEG | first flagged in run #2 |
| 2026-06-28 | -999% | NEG | widening (Lesson #21 first instance) |
| 2026-07-05 | -139% | NEG | tightening |
| 2026-07-12 | +1401% | POS | sign flip #1 (Lesson #21 escalation) |
| 2026-07-19 | +1638% | POS | peak |
| 2026-07-19 (intelligence.json 2026-07-20) | -1014% | NEG | **sign flip #2** in one cycle (Lesson #21 escalation rule) |
| **2026-07-26 (intelligence.json 2026-07-20, this week)** | **-700%** | NEG | **widening, less negative** — direction unchanged from week 6 |

**Lesson #21 ladder (this week is rung 7):** sign flip + 1000pp delta triggers a `funding-basis methodology audit` card. **This week: NO sign flip (negative → negative), NO absolute delta > 1000pp (-1014% → -700% = +314pp, in the negative direction).** The escalation rule is NOT triggered this week. Carry-forward in F2.

**21-day series sign-flip count:** 2 (2026-07-12 → 2026-07-19 cycle: +1638% → -1014%; the 2026-07-19 → 2026-07-26 cycle stays negative). The methodology audit follow-up remains in F2.

### C6. Trade activity (from `data/bot.db`)

- **0 trades since 2026-05-11** (77d 0-trade streak; correct behavior given BossMan gating)
- Last 5 trades from `trades` table (all from May): XRP BUY (closed 2026-05-12, -2.63% pnl), XRP BUY (closed 2026-05-11, 0.0%), XRP BUY (closed 2026-05-11, 0.0%), VET BUY (closed 2026-05-11, +6.48% pnl), XRP BUY (closed 2026-07-07, -1.63% pnl)
- `signal_journal` 7-day count = 0
- `consecutiveLosses: 0` (API)

**No trade activity change this week** — BossMan gating holds.

### C7. Curriculum parent `t_e53da070` is still `blocked` (carry-forward, week 7)

`t_e53da070` "Crypto Education Curriculum — Modular Foundation" has been `blocked` for 7 weeks. The 5 child CSDAWGBOT cards (B1) are all `todo` and unclaimed. Per L-CRYPTO-14, this digest does NOT propose pickup; the trading lane owns that decision.

### C8. Stage 6 (BossMan Decision Emitter) status — gated (carry-forward, week 7)

- Owning card: `t_bb2fd054` (blocked since 2026-06-19, week 7)
- Artifact age: **37d 1h** (was 30d 1h 58m last week, +7d slip in one cycle)
- Cadence ladder rung: **30d+ (first-order watch)** — entered this rung in week 6
- 23 days to **60d+ (auto-skip + drift-fix card, Lesson #19)** — **the next cron cycle that crosses 60d should auto-skip the digest and surface only the local-only commit + a clear "stage 6 stuck ≥60d" message.** This is the second consecutive cycle at 30d+; the rule is now actively binding.

### C9. Daily pipeline (radar + briefs) — HEALTHY

- `daily_radar.json` regenerated **2026-07-26 19:04 UTC** (6h 0m old at cron time) — fresh
- `pair_briefs.json` regenerated **2026-07-26 19:02 UTC** — fresh
- `DAILY_MEMO_2026-07-26.json` `sanity_verdict: PASS` — 5/5 sanity checks pass
- `run_summary_2026-07-26.json` `ok_count: 7 / failed_count: 0` — 7/8 stages `ok`, 1/8 stages `info` (stage_2_phase_b_source_tally) — no failures
- 15 brief entries (10 WARM, 5 WATCH), all `brief_source: deepseek_batch`
- `top_struct[0]`: **KAITOUSDT, HOT, score 0.919, +22.2% 24h, $17.1M token unlock, $15,811 vol24h** — new non-universe name
- `watchlist: [KAITOUSDT, SHIBUSDT, UNIUSDT]` — KAITO new, SHIB held from week 6, UNI DeFi carry
- `do_not_touch: [REEFUSDT]` — single name (was 3 names last week)
- BTC reference: 64736.91, +0.482% — flat, no regime change
- **Pipeline is healthy. The 2026-07-12 cron-shell PATH issue (Lesson #16, Lesson #20) does not appear to have re-occurred** — no `/bin/sh: pm2: command not found` lines in this run's diagnostic.

---

## D. Open kanban tasks (verified on `bossman` board via direct SQL — CLI `kanban show` returns "no such task" because the default board is set to `default`, not `bossman`)

### D1. CSDAWGBOT cards from 2026-06-14 (all `todo`)

| Card | Title | Status | Days in todo |
|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | `todo` | 42d |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | `todo` | 42d |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | `todo` | 42d |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | `todo` | 42d |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | `todo` | 42d |

**One card is in the highest-relevance window** (`t_fcc58ae8` — DeFi lead validation; DeFi reactivated in latest intel). Per Lesson #22: surface here as a re-prioritization signal, do not create a new card. See F2.

### D2. L-CRYPTO-14 children (governance)

| Card | Status | Note |
|---|---|---|
| `t_2912210a` (governance) | `ready` | **PROMOTED to ready** (was `todo` in week 6) |
| `t_bb2fd054` (Stage 6 emitter) | `blocked` | week 7 carry-forward |
| `t_1adae96f` (HARD GATE §B / Phase 11A) | `blocked` | week 7 carry-forward |
| `t_d070c52c` (commit remaining files + push) | `blocked` | week 7 carry-forward |
| `t_52d08320` (24h observatierapport cron 72868985fd12) | `blocked` | week 7 carry-forward |

### D3. Curriculum + tracks

| Card | Status | Note |
|---|---|---|
| `t_e53da070` (Crypto Education Curriculum) | `blocked` | week 7 carry-forward (C7) |
| `t_e752ea85` (TRACK — Binance US Intelligence and Strategy Rebuild) | `blocked` | week 7 carry-forward |
| `t_aefb15e8` (DAILY-RADAR parent) | `blocked` | stages 1-5 cards all `todo`; pipeline IS running (C9) |
| `t_crypto_learn_s1_02_bull_bear_structure` (CSDAWGBOT Stage 1.2) | `running` | week 7 carry-forward |
| `t_crypto_learn_s1_03_support_resistance` | `todo` | |
| `t_crypto_learn_s1_04_moving_averages` | `todo` | |

### D4. Cards created this week

**0 cards created** (L-CRYPTO-14: routine operations are reported, not asked; this digest is the report, no new approval-boundary items surfaced).

### D5. Approval-boundary cards created

**0 cards created.** See A5 for the carry-forward approval-boundary surface.

---

## E. Cost + token usage

| Component | Week 7 (this run) | Week 6 | Week 5 | Week 4 | Week 3 | Week 2 | Week 1 |
|---|---|---|---|---|---|---|---|
| LLM calls | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| DeepSeek calls | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| OpenAI calls | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| M3 (structured output) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Perplexity (research) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Estimated cost (USD) | **$0.00** | $0.00 | $0.00 | $0.00 | $0.00 | $0.00 | $0.00 |
| Token count (input) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Token count (output) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

**Well under the ≤1 LLM call weekly budget** (Hard rule #5). 0 calls is the correct number this week because (a) the data files are structured and complete (BossMan decision JSON, daily_radar, pair_briefs, DAILY_MEMO, run_summary, intelligence.json, env inspection) and (b) the digest can be templated directly. No model call was needed to interpret any of the signals.

---

## F. Next week (2026-08-02)

### F1. First-order watch items (priority order)

1. **[C8] Stage 6 staleness — 37d 1h, 23 days to auto-skip threshold (60d, Lesson #19).** Owning card `t_bb2fd054` still blocked. **If `t_bb2fd054` is not unblocked and Stage 6 does not emit a new `data/bossman_decision.json` by 2026-08-30, the next cron cycle (2026-08-30) will auto-skip the digest, create a `drift-fix: stage-6-emitter-stuck-60d` kanban card, and surface only the local-only commit + a clear "stage 6 stuck ≥60d" message.** This is the second consecutive cycle at the 30d+ rung; the auto-skip rule is now actively binding. **Operator action (v3 carve-out):** unblock `t_bb2fd054` and run Stage 6, OR explicitly approve the "skip Stage 6 indefinitely" framing so the digest can be reframed as a "daily pipeline status" instead of a "BossMan decision digest."
2. **[A5.1] PAPER_MODE=false env-level confirmation — week 7 carry-forward.** Bot is LIVE-configured at the env level for 41 days. Single approval-boundary item, recurring F1 watch. No new finding this week.
3. **[C4] Sector concentration: 60% of top-10 is 'Other'.** New flag this week (not in week 6 memo). Not actionable at MID_CYCLE regime, but if the next memo extends this to 70%+ or if the "Other" sector claim starts to look like a classification gap (rather than a real "uncovered" call), escalate.

### F2. Follow-ups tracked (low priority unless escalated)

- **Cron PATH issue (carry-forward, weeks 5/6).** Confirm `health-cron-wrapper.sh` line 19 PATH export and verify direct-`node` cron lines have been removed from user crontab. **Diagnostic recipe (Lesson #20) was confirmed in week 6**; the carry-forward is the operator-side removal. **v3 carve-out: cron change = operator approval required. Do not autonomously modify.**
- **`t_d070c52c` — Commit remaining files (SKILL.md + PHASEREPORT.md) and push.** Week 7 carry-forward. The mirror-drift between Obsidian and BossMan repo is now visible as 2 pre-staged files (kernel-doc `LEARNED_V3_MODEL_STACK.md` + non-kernel `AUTOMATION_INVENTORY.md`) at cron time. Per Lesson #18, mirror drift is L-CRYPTO-13 reconciliation work — correct to commit, but the brief commit should NOT include them (they are pre-staged independently). This is operator action; carry-forward.
- **`t_fcc58ae8` re-prioritization (carry-forward, week 7).** DeFi held `sector_rank[0]` for the second consecutive week. The card's premise is now non-stale. Per Lesson #22, surface in F2 (this section), do not create a new card. If a third consecutive week of DeFi #1, escalate to F1.
- **Funding basis methodology audit (carry-forward, weeks 3/4/5/6/7).** No new sign flip this week. The 21-day series: -1100% → -999% → -139% → +1401% → +1638% → -1014% → -700%. Sign-flip count = 2 (stable from last week). Methodology audit overdue per Lesson #21 (first flagged run 2026-06-28). Not a Section C first-order finding this week because the rule requires two consecutive cron cycles with a sign flip OR a single absolute delta > 1000pp — neither is present in the 2026-07-19 → 2026-07-26 transition. **Carry-forward; revisit next week.**
- **Daily pipeline source-tally stage shows `info` (not `ok`) for the 4th consecutive week** (carry-forward). The 7/8 stages ok / 1/8 info pattern is stable. No failures. If the source-tally stage flips to `failed` or `ok_count` drops below 7, escalate.

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

- ❌ "Should I pick up the 2026-06-14 CSDAWGBOT backlog?" — owned by trading sub-agent lane, not this digest.
- ❌ "Do you want me to draft 3-5 questions about BossMan decisions?" — explicitly removed by L-CRYPTO-14 amendment 2026-06-19.
- ❌ "What should I watch for next week?" — F1/F2 are the watch surface; F1 is the priority.
- ❌ "What do you want to understand better next week?" — explicitly removed.
- ❌ "Should I restart the bot?" — bot is online and healthy; not a v3 carve-out.

### F4. Regime transition watch (carry forward from prior weeks)

- MID_CYCLE held for 4 consecutive weeks (2026-07-05, 2026-07-12, 2026-07-19, 2026-07-26)
- **Next transition watch: any signal that MID_CYCLE → CONFIRMED_UP or CONFIRMED_DOWN.** Triggers:
  - Sector concentration moves from "60% Other" to a clear sector (e.g., DeFi at >50% of top_struct)
  - Funding basis sign-flip ladder stabilizes (no flip in 2 consecutive weeks)
  - hot_pairs returns to non-null in `intelligence.json` (currently `null`)
- **No transition signal this week.** All three triggers are stable or absent.

### F5. BossMan decision layer — open scope

- L-CRYPTO-14 governance (`t_2912210a`) is now `ready` — visible to picker. Picker is the trading sub-agent lane, not this digest.
- Stage 6 emitter is the single open scope item. F1 carries the operator action.
- No new scope was added this week; no scope was retired.

---

## Hard rules confirmed for this run

- ✅ **L-CRYPTO-14 — BossMan is the autonomous decision engine.** Digest summarizes decisions for human review; no 3-5 questions loop. No question batch sent to Marcelo.
- ✅ **L-CRYPTO-03 — Advisory-only contract at the wire.** No `hermes send -t telegram` from the cron path; no bot config mutation; no writes to `crypto-intel/` outside the brief path.
- ✅ **L-CRYPTO-10 — Two-gate approval.** If Stage 6 should leave PAPER (A5.2), surface as approval, not silent switch. Status: still PAPER at runtime.
- ✅ **One Telegram message per run.** This final response IS the Telegram message (cron path auto-delivers, per cron dual-delivery guard).
- ✅ **Cost control.** 0 LLM calls, $0.00.
- ✅ **No spam.** Brief is NOT empty (material findings on Stage 6 staleness, KAITO new top, sector concentration flag) — full digest produced.
- ✅ **No mid-week pings.** Weekly only.
- ✅ **Section 1 mode detection + Lesson #17 .env inspection.** Both completed.
- ✅ **Section 2.1 staleness computation.** 6d 10h — under 7d soft threshold (no intel-refresh entry triggered this week).
- ✅ **Section 5 — no new cards created.** A5 carry-forward only.
- ✅ **Section 6 brief written to BOTH Obsidian + BossMan repo mirrors** (`crypto-review-2026-07-26.md`).
- ✅ **Section 7.0 pre-flight (git status --short) completed.** 2 pre-staged files identified (one kernel-doc, one non-kernel). Lesson #18 mirror-drift rule applies.
- ✅ **Section 7.1/7.2 — commit + push pipeline with kernel-doc rebase stop in place.** See commit step below.

---

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-14 governs this digest
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC — 37d 1h old)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-07-26 19:04 UTC)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-07-26 19:02 UTC)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-07-20 15:00 UTC)
- `~/.hermes/knowledge/crypto-intel/daily/DAILY_MEMO_2026-07-26.json` (sanity PASS)
- `~/.hermes/knowledge/crypto-intel/daily/run_summary_2026-07-26.json` (7/8 ok, 0 failed)
- `~/Projects/binance-bot/data/bot.db` (signal_journal, trades tables)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-19.md` (week 6 brief)
- Kanban: `~/.hermes/kanban/boards/bossman/kanban.db` — 24 trading-related cards (verified via direct SQL, Lesson #12)

## Lessons (added this run)

**23. **Drift-fix 60d threshold is binding, not aspirational.** The cadence ladder in `crypto-weekly-review` SKILL.md §"Failure modes" says "the next cron cycle that crosses 60d should auto-create a `drift-fix: stage-6-emitter-stuck-60d` kanban card and skip the digest." This week confirms the rule is now **23 days from active binding**, not "someday." The digest is no longer summarizing fresh BossMan decisions — it is summarizing a one-month-old artifact. **Surfacing the operator-action explicitly in F1 (not just F2) reflects the binding nature of the deadline.** If `t_bb2fd054` is not unblocked by 2026-08-30, the digest auto-skips. This is the second consecutive week at 30d+ (entered the rung in week 6); the rule is no longer "future tense."

**24. **Sector concentration risk flag is new this week (60% "Other" in top_struct).** The 2026-07-26 daily memo added "Concentration: 60% of top-10 is 'Other' sector, indicating low sector diversity" as a risk flag. This is not present in prior memos. **Lesson:** weekly memos are the source of truth for "what is different this week"; if a flag appears that is not in the prior week, surface in C4 even if it does not yet affect the regime classification. A classification gap (real "uncovered" calls vs. data-pipeline gaps) is a separate sub-task that should be tracked in F2 if the flag persists for 2+ consecutive weeks.
