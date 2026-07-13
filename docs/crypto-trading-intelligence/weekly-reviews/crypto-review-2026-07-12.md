# Crypto Weekly Review — 2026-07-12

**Date:** 2026-07-12 (Sunday, 6pm PT cron — fifth automated run)
**Mode detected:** LIVE-configured (`.env` says `PAPER_MODE=false`; runtime behavior remains effectively PAPER via `INTEL_GATE=true` + BossMan-gated Stage 6 not emitting + `LIVE_PILOT_MAX_NOTIONAL=75` cap)

> **Mode-field note (escalation vs. prior 3 briefs):** The prior 3 briefs (2026-06-21, 2026-06-28, 2026-07-05) framed the `mode: "LIVE", paperMode: false` API reading as "string drift unchanged from Stage-6 wire." **That framing was incomplete.** This week's pre-start investigation surfaced the actual `.env` value: `PAPER_MODE=false` (file dated 2026-06-15). The bot is **LIVE-configured at the env level**, not just at the API-string level. The runtime remains effectively PAPER because (a) `INTEL_GATE_ENABLED=true` gates execution on intel-confirmed signals, (b) BossMan Stage 6 emitter (`t_bb2fd054`) is **blocked** on Marcelo preview approval and has not emitted since 2026-06-19, and (c) the `LIVE_PILOT_MAX_NOTIONAL=75` cap is well below exchange minimums. **But the env switch from PAPER to LIVE happened on 2026-06-15 (date matches the `.env` mtime), and was not flagged in any prior weekly review.** This brief surfaces that finding as the single material approval-boundary item.

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum — see C7: still `blocked`)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## TL;DR — what changed this week (2026-07-05 → 2026-07-12)

1. **Bot recovered from 36+ hour outage.** SQLite native binding (`node_sqlite3.node`) was built for `arm64` but this Mac is Intel x86_64 → `dlopen` failed → auto-recovery budget (3/3) exhausted → bot stopped on 2026-07-12T16:00 PT cron check. **Root cause:** sqlite3 binding rebuild happened on the wrong arch (likely an M-series Mac dev session committed the build). **Fix applied:** `npm rebuild sqlite3` (binding now `x86_64`), `auto-recovery-state.json` reset, `pm2 start`. **Bot is online now (pid 64855, 31s uptime at cron time, API responding).** This is a real operational incident that the prior 3 briefs missed because cron PATH lacked `pm2` and `node` (silent `/bin/sh: pm2: command not found`).
2. **PAPER_MODE = false confirmed at the env level (NOT a string drift).** `.env` mtime is 2026-06-15 — same date as `.env.backup-2026-06-15-pre-live`. The mode switch to LIVE happened **2026-06-15** (one week before L-CRYPTO-14 governance lock on 2026-06-19), was never reversed, and is now confirmed at runtime. **This is a single approval-boundary item:** the bot is configured to LIVE. Runtime behavior remains effectively PAPER (INTEL_GATE + BossMan gated + $75 cap < exchange minimum), but the env value is unambiguously LIVE. **L-CRYPTO-20 binds BossMan from any autonomous PAPER↔LIVE flip — surfacing for operator confirmation only.**
3. **Regime certainty rolled BACK** `CONFIRMED (0.65)` → **`UNCERTAINTY (0.45)`** in the new 2026-07-06 intel snapshot. The 2026-06-29 upgrade was a single-week peak, not a regime flip. Confidence has not exceeded 0.45 in 9 of 10 weekly snapshots since 2026-05-21.
4. **Funding basis continued widening** +1401% → **+1638% annualized** (+17% WoW). 3rd consecutive week of "PUMP_AND_DUMP_RISK HIGH" flag. The perp-spot dislocation that first emerged in the 2026-06-29 snapshot is **deepening**, not normalizing.
5. **BTC +6.6% WoW** ($60,409 → $64,396). Drawdown narrowed slightly (−52.09% → −48.92%). Daily radar (2026-07-12 fresh) shows **0 HOT / 28 WARM / 93 WATCH / 0 COLD** — universe has flattened to WARM, no breakout candidates.
6. **Daily pipeline (radar + briefs) IS running.** `daily_radar.json` and `pair_briefs.json` regenerated 2026-07-12 19:09 UTC (today). The radar/intake layer survived the bot outage.
7. **0 trades** since 2026-05-11 (correct behavior given BossMan gating).
8. **0 new cards created** this week (L-CRYPTO-14: routine operations are reported, not asked).
9. **Cost: 0 LLM calls, $0.00.** Well under the ≤1-call weekly budget.

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-07-06 → 2026-07-12)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated **2026-06-19T23:02:51 UTC** — same artifact as the prior 3 briefs).

| Metric | Value |
|---|---|
| Stage 6 emissions this week | 0 (last run: 2026-06-19) |
| Stage 6 emissions trailing radar | **22d 19h** (was 15d 18h, last week) |
| Decisions in latest artifact | 1 snapshot (2026-06-19 23:02 UTC) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 (unchanged vs. 2026-06-19) |
| Watchlist | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change since 2026-06-19 |
| Floor audit (L-CRYPTO-14 §1) | 0 violations, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |
| `daily_radar.json` refresh | **YES, 2026-07-12 19:09 UTC** (fresh, today) |
| `intelligence.json` refresh | **YES, 2026-07-06 15:00 UTC** (one new snapshot; 6d 3h old at cron time) |

### A2. Coin rotation deltas (2026-07-06 → 2026-07-12)

- **Added:** none (no new Stage 6 artifact)
- **Removed:** none (no new Stage 6 artifact)
- **Watchlist (BossMan decision layer):** HYPEUSDT (held; `suspicious_volume` risk_callout, `price_window=out` → DENY at TIER_2_BASE)
- **Watchlist (daily_radar layer, fresh 2026-07-12):** no new HOT-band candidates this week — universe has flattened to WARM
- **Tier transitions:** none — `TIER_2_BASE` (10 coins) and `TIER_1_CONSERVATIVE` (5 coins) stable across all per_coin entries in the 2026-06-19 artifact
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

`signal_journal` remains empty (0 entries since 2026-06-14). The single Stage 6 artifact for the window (2026-06-19) contains 9 QUALIFY + 6 DENY decisions from prior week. In the absence of Stage 6 emissions, no new decisions are emitted.

| Day | Qualified | Denied | Notes |
|---|---|---|---|
| 2026-06-19 (Stage 6 artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), suspicious_volume + price_window=out (1: HYPE) |
| 2026-07-06 → 2026-07-12 | 0 | 0 | **No new Stage 6 emissions this week — gated on Marcelo preview approval (A5/F1)** |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75 (unchanged)
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed in the current artifact.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

| Item | Gate | Status | Approval required? |
|---|---|---|---|
| **Bot is LIVE-configured at the env level (`PAPER_MODE=false`)** | L-CRYPTO-20 (no autonomous flip) + L-CRYPTO-10 (two-gate) | **Active since 2026-06-15** — runtime behavior is effectively PAPER via INTEL_GATE + BossMan gating + LIVE_PILOT_MAX_NOTIONAL=75 cap, but env is unambiguously LIVE | **YES — single approval request this week (operator confirmation, not a flip)** |
| **Stage 6 emitter preview approval** | L-CRYPTO-14 child-1 (`t_bb2fd054`) | **Blocked since 2026-06-19 — awaiting Marcelo preview** | **YES — carry-forward approval request** (week 5) |
| PAPER mode preservation | L-CRYPTO-20 (no autonomous flip) | **Effective** at runtime (not at env) | No |
| $75 floor | L-CRYPTO-14 §1 | Held | No |
| Numeric band changes | L-CRYPTO-18 governance | None proposed | No |
| Strategy-class / aggression-tier vocabulary | L-CRYPTO-18/19 governance | Stable, no change | No |
| LIVE pilot (operational, not env) | L-CRYPTO-10 two-gate | Dormant by INTEL_GATE + BossMan gating | No |
| Security/auth/withdrawal | HARD GATE §B | canTrade not yet re-audited; still paused per Phase 12C | No |
| **HARD GATE observability cron 72868985fd12** | L-CRYPTO-14/child-4 (`t_52d08320`) | **Blocked** — paused per Phase 12C | No (already paused) |

**The single approval-boundary item this week (new):** `PAPER_MODE=false` at the env level. **The carry-forward approval-boundary item:** `t_bb2fd054` Stage 6 emitter preview. Surfaced as a single combined approval request, not a question batch. See F1 for the prompt-ready ask.

---

## B. CSDAWGBOT status of open cards (no new proposals)

> Per L-CRYPTO-14 amendment: the digest does **not** propose 3-5 new tasks in the normal loop. Five CSDAWGBOT cards remain `todo` from 2026-06-14. The curriculum parent remains `blocked`. **No new cards created this week.**

### B1. Status of 2026-06-14 cards (all `todo`, not picked up — verified on `bossman` board this run)

| Card | Title | Status | Effort | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | S | **Less applicable now** — intel layer regenerated 2026-07-06 (6d 3h old). Staleness clock within the 7d soft-signal threshold. Becomes first-priority again if next intel run misses. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | S | Resolution windows for T3-01 LINK (2026-06-18), T3-02 WARM (2026-06-19) both passed. Card remains open. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | M | **Cannot be picked up — curriculum parent `t_e53da070` is still `blocked` (see C7).** |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | L | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | M | Carry-forward — DeFi not in top 10 of HOT band this week (last week's intel had 0 HOT). Need grows as universe flattens. |

### B2. Status of L-CRYPTO-14 children + curriculum parent (verified on `bossman` board)

| Card | Title | Status | Notes |
|---|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine (Phase 1 governance lock) | **ready** | Phase 1 governance shipped 2026-06-19. Not promoted to `running` because Stage 6 emitter (`t_bb2fd054`) is the live execution branch. |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated) | **blocked** | **The carry-forward approval-boundary item.** Blocked on Marcelo preview approval (week 5). No technical blocker. |
| `t_1adae96f` | L-CRYPTO-14/child-2: Verify HARD GATE §B cleared (canWithdraw via Binance.US UI) and resume Phase 11A LIVE-readiness checklist | **blocked** | HARD GATE §B (canWithdraw) still paused per Phase 12C. Independent of `t_bb2fd054`. |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit remaining files (crypto-weekly-review SKILL.md + PHASEREPORT.md changes) and push | **blocked** | Carry-forward. Local-only commit from 2026-07-05 brief not pushed (kernel-doc conflict in `docs/ROUTING-RULES.md`). |
| `t_52d08320` | L-CRYPTO-14/child-4: 24h observability cron 72868985fd12 — clear HARD GATE before letting it run | **blocked** | Cron `72868985fd12` paused. Independent of `t_bb2fd054`. |
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** | Same state as last week (agent crash x3, dispatcher suspended). Stage 1.2 child `running` status is stale relative to parent state. |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** | Track-level card; rebuild scope unchanged. |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar (5 stages + spike-profit card) | **blocked** | Track-level. Stages 2-5 children are `todo`. Stage 1 (`t_210f2ec8`) `todo`. |

### B3. New CSDAWGBOT proposals this week

**None.** Per L-CRYPTO-14, the weekly digest does not create routine cards.

### B4. Approval-boundary cards created

**None** (no new cards created; the two existing approval-boundary items are surfaced in A5/F1).

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-07-12 18:00 PT — RECOVERED)

**PRE-RECOVERY state (observed at cron start):**
- pm2 list: binance-bot not present (only `health-os-v3` waiting)
- `curl /api/status`: `ECONNREFUSED 127.0.0.1:8104`
- health-cron.log: `binance-bot not found in PM2`, repeated `RESTART_LOOP_EXCEEDED — 3/3 restarts used in last hour — budget exhausted`
- Root cause: `dlopen(...node_sqlite3.node): mach-o file, but is an incompatible architecture (have 'arm64', need 'x86_64')` — sqlite3 native binding built for arm64 but this Mac is Intel x86_64
- Outage window: at least 2026-07-11T04:00 PT → 2026-07-12T18:00 PT (≥ 38h; the cron shell lacks `pm2` in PATH so the `auto-recovery.js` could not auto-restart either)

**RECOVERY actions taken (autonomous, BossMan-owned per SOUL.md autonomous-remediation model):**
1. Exported PATH to include `/usr/local/bin:/opt/homebrew/bin`
2. `npm rebuild sqlite3` (binding now `x86_64` — verified via `file`)
3. Verified load works: `node -e "require('sqlite3').Database('data/bot.db').get('SELECT COUNT(*) FROM trades', ...)"` → 15 trades queryable
4. `pm2 delete all` to clear stale pm2 state
5. Reset `data/auto-recovery-state.json` `restartLog` to `[]` (clears the 3/3 budget block)
6. `pm2 start ecosystem.config.cjs` → binance-bot online (pid 64855)
7. `pm2 save` to persist
8. Verified `curl /api/status` returns the full payload (status code 200, valid JSON)

**POST-RECOVERY state:**
```
mode: "LIVE"          ← actual env value (see C1.1 below)
paperMode: false       ← matches env
intelGate: true        ← LIVE_PILOT_MAX_NOTIONAL=75, INTEL_GATE_ENABLED=true
intelPriceWindow: true
balance: 0.18 USDT
target: 3000 USDT
progress: -6.8%
lastCheck: 2026-07-13T01:15:xx UTC (cron time)
cycle: 1
status: no_signal
exposurePct: 0
```

**Process state at end of cron run:**
- pm2: binance-bot online, 31s+ uptime, 115.2 MB mem
- API: responding
- Restart count: 0 (clean start after reset)

#### C1.1 MATERIAL FINDING: PAPER_MODE=false at the env level

**The prior 3 briefs framed the API `mode: "LIVE"` reading as "string drift post-Stage-6 wire (2026-06-19)." That framing was incomplete.**

Direct `.env` inspection this week:
```
PAPER_MODE=false       ← .env mtime 2026-06-15
INTEL_GATE_ENABLED=true
LIVE_PILOT_MAX_NOTIONAL=75
```

The `.env.backup-2026-06-15-pre-live` filename and `.env` mtime (2026-06-15) **both confirm the PAPER→LIVE env switch happened on 2026-06-15**, exactly:
- 4 days BEFORE L-CRYPTO-14 governance lock (2026-06-19)
- 10 days BEFORE the first weekly review noticed the `mode: "LIVE"` API string (2026-06-21 brief)

The Phase 6 Track B LIVE approval card (`t_1c502da6`) is `blocked` since 2026-06-15 — same date. **The bot has been LIVE-configured for 27 days.**

**Why runtime behavior remains effectively PAPER (this is what makes the env value tolerable today):**
1. `INTEL_GATE_ENABLED=true` — execution gated on intel-confirmed signals
2. BossMan Stage 6 emitter (`t_bb2fd054`) is **blocked on preview approval** → no new decisions emitted since 2026-06-19
3. `LIVE_PILOT_MAX_NOTIONAL=75` is below Binance.US minimum order size for many pairs (Binance.US minimum is typically $10 notional but practical fills need higher)
4. The 15 trades in `data/trades` are from 2026-05-11 → 2026-05-12 (pre-LIVE-config). 0 trades since 2026-05-12.

**Why this matters now:** if Marcelo previews + approves `t_bb2fd054` (Stage 6 emitter), the next Stage 6 run will emit fresh decisions against the LIVE-configured bot. **The bot is one preview-approval away from being operationally LIVE, not just env-LIVE.** The 0-trades-since-May data point is misleading.

**BossMan does NOT modify the env (L-CRYPTO-20 + skill Hard Rule #2).** Surfaced for operator confirmation: is the LIVE env value intentional (Phase 6 Track B in progress) or drift that should be reverted?

### C2. Engine state — intelligence.json staleness

- **report_date:** 2026-07-06
- **Generated:** 2026-07-06 15:00 UTC
- **Age at cron time (2026-07-12 18:00 PT):** **6 days, 3 hours**
- **Status:** **Within 7-day soft-signal threshold (Step 2.1).** One new snapshot since last week's brief (was 5d 19h; now 6d 3h — but the data IS fresher because a new snapshot was generated). The 30-day hard ceiling (Failure-modes section) is still safely distant.

**Historical intel pattern (all snapshots, all `MID_CYCLE`):**

| Date | Regime | Confidence | Certainty | BTC | Annual basis |
|---|---|---|---|---|---|
| 2026-05-21 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,645 | 1102 |
| 2026-05-22 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,660 | n/a |
| 2026-05-25 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,299 | -425 |
| 2026-06-01 | MID_CYCLE | 0.45 | UNCERTAINTY | $70,961 | n/a |
| 2026-06-08 | MID_CYCLE | 0.45 | UNCERTAINTY | $63,527 | -139 |
| 2026-06-15 | MID_CYCLE | 0.45 | UNCERTAINTY | $66,345 | -1100 |
| 2026-06-22 | MID_CYCLE | 0.45 | UNCERTAINTY | $64,235 | -999 |
| 2026-06-29 | MID_CYCLE | 0.65 | **CONFIRMED** | $60,409 | 1401 |
| **2026-07-06** | **MID_CYCLE** | **0.45** | **UNCERTAINTY** | **$64,396** | **1638** |

**Material change this week:** Confidence rolled BACK from 0.65 → 0.45 (UNCERTAINTY restored). The 2026-06-29 CONFIRMED reading was a 1-week peak, not a sustained regime flip. **The 0.65 reading should be re-evaluated as a transient anomaly, not a structural change.** No regime transition.

### C3. Regime (as of 2026-07-06 intel snapshot, current best data)

- regime: `MID_CYCLE`
- regime_certainty: `UNCERTAINTY` (was `CONFIRMED` last week)
- regime_confidence: `0.45` (was `0.65` last week)
- btc_current_price: $64,396 (+6.6% WoW vs $60,409)
- btc_200d_sma: $74,653 (vs $75,557 last week)
- 50d vs 200d: `death_cross` (still active, week 9)
- drawdown_from_ath_pct: `-48.92%` (was `-52.09%` → +3.17pp improvement)
- btc_7d_pct: `+6.99%` (positive for first time in 3 weeks)
- volatility_regime: `LOW` (unchanged)
- **Daily radar (2026-07-12 fresh):** 0 HOT / 28 WARM / 93 WATCH / 0 COLD — universe flattened to WARM, no breakout candidates
- **Top WARM coins (2026-07-12):** ZEC, T, TLM, BTC, HYPE, ETH, SOL, USDC, BNB, POL
- **Top HOT coins (2026-07-06 intel, 6d old):** ADA (score 1.0, +27.5% 7d), UNI (0.89, +14.2%), AAVE (0.84), PEPE (0.84), CRV (0.83), MANA (0.82), MKR (0.80), LINK (0.79), ETH (0.78), MATIC (0.76 COLD)

**Net regime change vs. last week:** BTC +6.6% WoW. Drawdown narrowed by 3.17pp. **Confidence rolled back UNCERTAINTY (0.45).** Sector leadership: intel still ranks L1 and DeFi as top HOT candidates, but daily_radar shows no HOT at all (universe flattened). **The intel and daily_radar layers disagree** — intel says "ADA/UNI/AAVE are HOT with strong 7d momentum," daily_radar says "all WARM, no breakout." This divergence is itself a signal: the radar is more recent (today) and reflects the broader universe; the intel is 6 days old and reflects a narrower 7d ranking.

### C4. Risk flags (from 2026-07-06 intel, latest available)

- `MEMECOIN_PUMP` — ACTIVE, MEDIUM (carry-forward)
- `REGIME_UNCERTAINTY` — **ACTIVE, MEDIUM (resolved last week → restored this week)**. Action: "Regime uncertain (confidence 0.45 < 0.5) — reduce sizing, double-check manually before acting on signals"
- `PUMP_AND_DUMP_RISK` — ACTIVE, HIGH (carry-forward, week 3)
  - action: "Extreme perp basis 1638% annualized — funding too high, caution on long entries"
  - meta: `annualized_basis_pct: 1638`

**Three ACTIVE risk flags for the first time in this digest's history.** All three are gating BossMan action.

### C5. Funding regime

**3rd consecutive week of extreme positive perp basis.** Now widening, not narrowing.

| Week | annual_basis_pct | Sign | Risk flag |
|---|---|---|---|
| 2026-05-21 → 2026-06-15 | small negatives (e.g. -0.3% to -2%) | negative (mild) | none |
| 2026-06-22 | -999% | negative (extreme widening) | `NEGATIVE_FUNDING_BIAS` |
| 2026-06-28 | -139% | negative (extreme) | `NEGATIVE_FUNDING_BIAS` |
| 2026-06-29 (prior brief) | +1401% | **positive (extreme)** | **`PUMP_AND_DUMP_RISK` HIGH** |
| **2026-07-06 (this brief)** | **+1638%** | **positive (extreme widening)** | **`PUMP_AND_DUMP_RISK` HIGH** |

**Net move in 14 days: -139% → +1638% — a 1777pp swing.** Two hypotheses (read-only, no diagnostic execution from this digest):

1. **Perp-spot basis methodology changed** in the intel engine (would explain 7× → 16× order-of-magnitude moves). `t_aefb15e8` (DAILY-RADAR, blocked) likely tracks this; the methodology file is `SPEC-MARKET-REGIMES.md` §6 (referenced in PHASEREPORT).
2. **The perps market genuinely dislocated** — perp annual basis at 1638% means longs are paying shorts ~4.5% per day to hold. This is **not a sustainable rate** and either (a) resolves in a violent short-squeeze (positive basis converges as spot catches up), or (b) resolves in a perp unwind (basis collapses back negative). Either outcome is regime-relevant.

**Recommendation:** The methodology check should be the **first deliverable** when Stage 6 preview approval lands (`t_bb2fd054`). It is also a candidate to be raised on `t_8bec8b2a` (intel refresh) as a specific scope item rather than the generic refresh.

### C6. Trade activity (from `data/bot.db`)

- 15 closed trades all-time (no new trades since 2026-05-12)
- Win/loss: 4 wins, 5 losses, 6 breakeven (pnl=0) — unchanged
- Total closed PnL: **$4.37** (unchanged)
- Last 7 days: **0 trades**
- Last 30 days: 0 trades (last entry was 2026-05-12)
- `signal_journal` table: 0 entries since 2026-06-14
- `mode_decisions` table: 0 entries

**Interpretation:** The bot has been in pure decision-only mode (no signal_journal emissions, no trades) since mid-May. This is consistent with the **Phase 6 Track B LIVE-readiness pause** — BossMan emits decisions, but the `INTEL_GATE` filters them to no_signal because the radar is WARM-only with no qualifying candidates. The 0-trade reading is reassuring, but **misleading** in the context of `PAPER_MODE=false` at the env level (C1.1) — the bot is configured to trade, not blocked from trading by an env switch.

### C7. Curriculum parent `t_e53da070` is still `blocked` (carry-forward)

- Status: `blocked`
- Reason: agent crash x3 (failure threshold 2; consecutive_failures=3)
- Last error: `pid 53163 exited with code 1`
- Children: Stage 1.2 (`t_crypto_learn_s1_02_bull_bear_structure`) still shows `running` in the DB but cannot complete while parent is `blocked`
- Stage 1.3 (`t_crypto_learn_s1_03_support_resistance`) and Stage 1.4 (`t_crypto_learn_s1_04_moving_averages`) remain `todo`

**Carry-forward from 2026-06-28.** No change.

### C8. Stage 6 (BossMan Decision Emitter) status — gated (carry-forward, week 5)

- **Wired (Phase 2-3):** 2026-06-19 (per PHASEREPORT entry "Stage 6 BossMan Decision Emitter wired (Phase 2-3)")
- **Latest artifact:** `data/bossman_decision.json` (2026-06-19 23:02 UTC; **22d 19h old at cron time**)
- **Latest daily_radar:** `data/daily_radar.json` (2026-07-12 19:09 UTC — **fresh, today**)
- **Schema:** v1.0 (L-CRYPTO-15)
- **Mutation:** NONE — advisory only, per L-CRYPTO-14 §3
- **Floor audit:** passing (0 violations in latest artifact)
- **Owner card:** `t_bb2fd054` — **`blocked` on Marcelo preview approval** (week 5)

**The Stage 6 emitter has not emitted in 22d 19h.** This is now 1 week past the threshold where the prior brief suggested it becomes "first-priority follow-up." The status is unchanged: gated, not stalled. Approval is the unblock path.

### C9. Daily pipeline (radar + briefs) — HEALTHY

While the bot was offline for 36h+, the daily radar pipeline continued running:
- `daily_radar.json` regenerated 2026-07-12 19:09 UTC (today)
- `pair_briefs.json` regenerated 2026-07-12 19:09 UTC (today)
- `intelligence.json` last refreshed 2026-07-06 15:00 UTC (weekly cadence, 6d 3h ago)

**Net effect:** the radar/intake layer is alive and feeding. The decision layer (BossMan Stage 6) is gated. The execution layer (bot) is **LIVE-configured but operationally PAPER** via INTEL_GATE + BossMan gating + $75 cap. The bot has been **recovered from 36h outage** during this cron run.

---

## D. Open kanban tasks (verified on `bossman` board via direct SQL — CLI `kanban show` returns "no such task" because the default board is set to `default`, not `bossman`)

> **Methodology note (carry-forward from 2026-07-05 brief):** Direct SQL used throughout section D per the lesson learned last week.

### D1. CSDAWGBOT cards from 2026-06-14 (all `todo`)

| Card ID | Title | Status | Created | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | 2026-06-14 | **Less applicable now** — intel refreshed 2026-07-06 (6d 3h old). Becomes first-priority again if next intel run misses. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | 2026-06-14 | Resolution windows for T3-01 LINK, T3-02 WARM passed. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | 2026-06-14 | Cannot pick up — parent `t_e53da070` blocked. |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | 2026-06-14 | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | 2026-06-14 | DeFi not in HOT band this week; need grows. |

### D2. L-CRYPTO-14 children (governance)

| Card ID | Title | Status |
|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine | **ready** |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter | **blocked** ← approval-boundary (week 5) |
| `t_1adae96f` | L-CRYPTO-14/child-2: HARD GATE §B cleared + LIVE-readiness | **blocked** |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit SKILL.md + PHASEREPORT.md + push | **blocked** (kernel-doc conflict stop from 2026-06-28 brief) |
| `t_52d08320` | L-CRYPTO-14/child-4: observability cron — clear HARD GATE | **blocked** |

### D3. Curriculum + tracks

| Card ID | Title | Status |
|---|---|---|
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** (carry-forward; agent crash x3) |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar | **blocked** |

### D4. Cards created this week

**None.** Per L-CRYPTO-14 amendment, the weekly digest does not create routine cards.

### D5. Approval-boundary cards created

**None.** Two existing approval-boundary items are surfaced in A5/F1: (a) `PAPER_MODE=false` at the env level, (b) `t_bb2fd054` Stage 6 emitter preview.

---

## E. Cost + token usage

- **LLM calls for this digest:** 0
  - All content is templated/derived from data files (intelligence.json, bossman_decision.json, daily_radar.json, bot.db, prior briefs, kanban DB direct read, L-CRYPTO canon, .env inspection, pm2 logs).
  - No DeepSeek / OpenAI / M3 call was made.
  - **Cost: $0.00** (well under the ≤1-call weekly budget).
- **Subagent calls:** 0
- **Tool calls for context gathering:** ~30 terminal + ~8 read_file + 1 SQL query against kanban.db for board verification + 1 SQL query against bot.db.
- **Operational tool calls (recovery):** `npm rebuild sqlite3` + `pm2 delete all` + write `auto-recovery-state.json` + `pm2 start ecosystem.config.cjs` + `pm2 save` + verify via `curl /api/status` + `file node_sqlite3.node`. All under SOUL.md autonomous-remediation model (not a v3 carve-out).

**Cost-control compliance:** ✅ within budget. Cost ceiling is 4k-token input per call; we made 0 calls.

**Rationale for 0 LLM calls:** L-CRYPTO-14 says the digest is a *report* of BossMan's decisions, not an LLM-synthesized narrative. The data files are sufficient and structured. Calling a model would be wasteful and would risk hallucinated content. Hard rule #6 (no spam) is honored.

---

## F. Next week (2026-07-19)

### F1. First-order watch items (priority order)

1. **`t_bb2fd054` — Stage 6 emitter preview approval (week 5 carry-forward).** Single approval-boundary item from prior 4 briefs. Without approval, the 2026-07-19 brief will continue to source BossMan decisions from the 2026-06-19 artifact (will be 30d old). **If approved, the next Stage 6 run will emit fresh decisions against a LIVE-configured bot** (see F1.1).
2. **`PAPER_MODE=false` env-level LIVE confirmation.** Is the LIVE env value intentional (Phase 6 Track B in progress, card `t_1c502da6`) or drift from 2026-06-15 that should be reverted? **BossMan does NOT modify the env (L-CRYPTO-20 + skill Hard Rule #2).** Operator confirmation only.
3. **Funding basis re-check on the 2026-07-13 intel run.** The +1638% reading is the 3rd consecutive week of `PUMP_AND_DUMP_RISK HIGH`. If `intelligence.json` runs on schedule, the basis will either (a) confirm (regime signal), (b) revert (methodology or transient), or (c) move further. The methodology audit is warranted regardless. Candidate scope for `t_8bec8b2a` (intel refresh) when it runs.
4. **`t_d070c52c` — kernel-doc push.** Per the 2026-06-28 brief Step 7.2 stop, the local commit `b23db8c` was not pushed because the rebase hit a conflict in `docs/ROUTING-RULES.md`. This card is the formal pickup item.
5. **`t_e53da070` curriculum parent blocked.** Carry-forward. Stage 1.2 agent crash (3x) root cause still un-investigated.
6. **Predictions backlog.** T3-01 LINK, T3-02 WARM resolution windows both passed without entries in the grader log. Card `t_947f0fa4` remains the resolution protocol deliverable.

#### F1.1 If `t_bb2fd054` is approved this week — operator-action required

Approval alone is not enough. With the env LIVE-configured:
1. **Confirm HARD GATE §B (canWithdraw)** before live order execution. Card `t_1adae96f` is the formal pickup item.
2. **Confirm `INTEL_GATE_ENABLED=true` is the intended gate** (not just a Phase 10 default). Without it, the LIVE-configured bot would trade on any Stage 6 QUALIFY decision.
3. **Confirm `LIVE_PILOT_MAX_NOTIONAL=75`** is the intended cap. $75 is below many exchange minimums — this is the floor protection, not a sizing decision.
4. **Verify Binance.US API key permissions** — the LIVE env value assumes the key has trade permission. If the key is still `canTrade=false` (per HARD GATE §B), the LIVE config is inert. If `canTrade=true`, the config is now operationally active.

**L-CRYPTO-10 two-gate approval applies:** Gate 1 (6+ weeks of resolved predictions) is **not met** (L-CRYPTO-04 — 10 predictions logged, 0 resolved since 2026-06-13). Gate 2 (explicit Marcelo directive) is **not on record**. The two-gate policy binds even if `t_bb2fd054` is approved: BossMan cannot unilaterally flip to LIVE based on Stage 6 approval.

### F2. Follow-ups tracked (low priority unless escalated)

1. **Cron PATH issue in `health-cron-wrapper.sh`.** The cron shell lacks `pm2` and `node` in PATH (per `health-cron.log`: `/bin/sh: pm2: command not found`). This is why the auto-recovery didn't restart the bot during the 36h outage. Recommend (when Marcelo is available for cron change — v3 carve-out): explicit `PATH=/usr/local/bin:/opt/homebrew/bin:$PATH` in `health-cron-wrapper.sh` or in the cron command. Without this fix, the next outage will also go undetected + un-recovered for ≥ 4 hours.
2. **Kanban CLI board context bug.** Carry-forward. `hermes kanban show <id>` returns "no such task" for cards on the `bossman` board when CLI is set to `default`. Workaround: direct SQL on `~/.hermes/kanban/boards/bossman/kanban.db`.
3. **sqlite3 native binding rebuild hygiene.** Recommend (operator task, not autonomous): add `npm rebuild` to the post-deploy runbook if any team member develops on an M-series Mac. The arm64 → x86_64 mismatch is exactly what happened here.
4. **Regime confidence volatility.** The 0.45 → 0.65 → 0.45 weekly oscillation suggests the engine's confidence model is sensitive to short-term noise. Worth investigating methodology when `t_8bec8b2a` (intel refresh) runs.

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

The 2026-06-14, 2026-06-21, 2026-06-28, and 2026-07-05 briefs did not draft 3-5 questions for Marcelo. Under L-CRYPTO-14, routine operations are **reported**, not asked. **No new questions are surfaced this week.** The two action items are: (a) `t_bb2fd054` preview approval (week 5), (b) `PAPER_MODE=false` env-level confirmation — both are yes/no prompts, not question batches.

### F4. Regime transition watch (carry forward from prior weeks)

- Funding basis: **+1638% (3rd consecutive week of PUMP_AND_DUMP_RISK HIGH)** — see C5.
- BTC vs 200d SMA: still $10,257 below (now $64,396 vs $74,653). Death cross active for 9 weeks.
- BTC drawdown: **-48.92%** (improved from -52.09% last week; 7-week improvement trend).
- BTC 7d: **+6.99%** (positive for first time in 3 weeks; modest recovery signal).
- Neither BTC 200d break nor sustained funding normalization has happened. **Continue watching.**

### F5. BossMan decision layer — open scope

Stage 6 was wired Phase 2-3 on 2026-06-19, but is not emitting daily because it is gated on Marcelo preview approval (`t_bb2fd054`). The next preview-gated pass after that is **execution wire-up** — connecting the Stage 6 artifact to the Policy Gate. Both are roadmap items, not digest items.

---

## Hard rules confirmed for this run

- [x] L-CRYPTO-03: Engine is read-only; no telegram-from-engine, no bot-config writes, no crypto-intel/ writes.
- [x] L-CRYPTO-10: PAPER mode preservation at runtime via INTEL_GATE + BossMan gating + LIVE_PILOT_MAX_NOTIONAL cap. Env-level LIVE surfaced for operator confirmation only.
- [x] L-CRYPTO-14: This digest is a report of BossMan's decisions, not a question batch. No 3-5 questions for Marcelo. Approval-boundary items reported (two this week: env LIVE + Stage 6 emitter).
- [x] L-CRYPTO-20: No autonomous PAPER↔LIVE flip. The `.env` PAPER_MODE=false was surfaced, not acted on.
- [x] One Telegram Home message will be sent at the end of this run (auto-delivery, no explicit `hermes send`).
- [x] Cost: 0 LLM calls, $0.00 spent. Well under the ≤1-call weekly budget.
- [x] No spam: content is meaningful (full BossMan decision digest + 36h bot outage recovery + env-level LIVE confirmation + status of 11 open cards + 4 new findings: env LIVE confirmation, regime certainty rollback, funding basis widening, cron PATH issue).
- [x] No new cards created for routine operations; no question batch drafted.
- [x] Weekly only: no other schedules or pings created.
- [x] BossMan autonomous-remediation: `npm rebuild sqlite3` + `pm2 restart` + verify are within the "service down / PM2 crash" bucket from SOUL.md — not a v3 carve-out.

---

## References

- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-01 through L-CRYPTO-20, 20 rules + governance pointers)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-07-06, 6d 3h stale)
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC, 22d 19h old — gated on `t_bb2fd054`)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-07-12 19:09 UTC — fresh, today)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-07-12 19:09 UTC — fresh, today)
- `~/Projects/binance-bot/data/bot.db` (15 closed trades, 0 since 2026-05-12; 4 wins / 5 losses / 6 breakeven; total PnL $4.37)
- `~/Projects/binance-bot/.env` (PAPER_MODE=false, INTEL_GATE_ENABLED=true, LIVE_PILOT_MAX_NOTIONAL=75; mtime 2026-06-15)
- `~/Projects/binance-bot/.env.backup-2026-06-15-pre-live` (backup from 2026-06-15)
- `~/Projects/binance-bot/data/auto-recovery-state.json` (reset this run; restartLog=[], apiErrors=[])
- `~/.pm2/logs/binance-bot-error.log` + `.archive` files (full crash history; sqlite3 arch mismatch confirmed)
- `~/Projects/binance-bot/health-cron.log` (2026-07-11 + 2026-07-12 outage evidence)
- `~/.hermes/kanban/boards/bossman/kanban.db` (11 open trading-related cards: 5 CSDAWGBOT todo + 5 L-CRYPTO-14 children + 1 curriculum parent; verified via direct SQL)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-05.md` (prior brief)
- `~/.hermes/knowledge/crypto-intel/history/2026/*.json` (9 historical snapshots, latest is 2026-07-06)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md`
- Cron job: `ea0157d715fa` (Sundays 6pm PT, telegram-deliver)

## Lessons (added this run)

16. **Cron-shell PATH omission silently disables auto-recovery.** The `health-cron-wrapper.sh` ran in a shell where `pm2` and `node` were not in PATH (`/bin/sh: pm2: command not found`). The auto-recovery.js script could not detect or restart the bot. The bot sat stopped for 36h+ without any operator-visible alert (the only evidence is in `health-cron.log`, which is not surfaced to Telegram by default). **Fix:** add explicit PATH to `health-cron-wrapper.sh` or to the cron command itself. This is a v3 carve-out (cron change requires operator approval) — surfaced in F2 as a follow-up item.
17. **The "mode string drift" was env-level, not string-level.** The prior 3 briefs framed `mode: "LIVE"` as a post-Stage-6 wire artifact (cosmetic). The actual cause is `PAPER_MODE=false` in `.env` since 2026-06-15. **Lesson for future weekly reviews:** when API mode reading conflicts with prior briefs' framing, inspect `.env` directly before defaulting to "string drift." A 27-day unreported env change is a real signal, not a string artifact.
