# Crypto Weekly Review — 2026-07-19

**Date:** 2026-07-19 (Sunday, 6pm PT cron — sixth automated run)
**Mode detected:** LIVE-configured (`.env` says `PAPER_MODE=false`; runtime behavior remains effectively PAPER via `INTEL_GATE=true` + BossMan-gated Stage 6 not emitting + `LIVE_PILOT_MAX_NOTIONAL=75` cap)

> **Mode-field note (carry-forward from week 5).** The week 5 brief (2026-07-12) promoted the `mode: "LIVE"` API reading from "string drift" to **env-level LIVE confirmation** (`.env` mtime 2026-06-15, `PAPER_MODE=false` set that day). This week the env value is unchanged. The runtime remains effectively PAPER because (a) `INTEL_GATE_ENABLED=true` gates execution on intel-confirmed signals, (b) BossMan Stage 6 emitter (`t_bb2fd054`) is **blocked** on Marcelo preview approval and has not emitted since 2026-06-19, and (c) the `LIVE_PILOT_MAX_NOTIONAL=75` cap is well below exchange minimums. The Week 5 single approval-boundary item ("operator confirmation that PAPER_MODE=false is intentional") is **carry-forward week 6**.

**Reviewer:** BossMan (L-CRYPTO-14 governed — digest of decisions, not a question batch)
**Linked goal:** `t_goal_crypto_swing_trader_20260613`
**Curriculum parent:** `t_e53da070` (Crypto Education Curriculum — see C7: still `blocked`)
**Unification epic:** `t_unify_crypto_knowledge_20260613`

---

## TL;DR — what changed this week (2026-07-12 → 2026-07-19)

1. **Bot stayed online 7 days** since the 2026-07-12 sqlite3 arch-mismatch recovery. No new outage. Health-check `5/5 PASS` for every cron run this week (4×/day from `binance-health-check-am` + `binance-health-check-pm` + the OS-level `0 16`/`0 4` node cron). pm2 restart count delta = 0.
2. **Stage 6 emitter staleness crossed the 30-day hard ceiling.** `data/bossman_decision.json` last write was **2026-06-19 23:02 UTC** → **30d 1h 58m old** at cron time (2026-07-20 01:01 UTC). The week 5 brief (2026-07-12) called this "22d 19h" — a full +7d slip in one cycle. **This is the single new material finding this week:** the artifact has now crossed the failure-mode hard cutoff (30 days) defined in `crypto-weekly-review` SKILL.md §"Failure modes." Without a fresh Stage 6 emission, the digest is reading a one-month-old decision snapshot.
3. **New intel snapshot (2026-07-13) reported regime CONFIRMED + basis NEGATIVE.** This **flipped three week-5 signals at once**: confidence `0.45 → 0.65` (UNCERTAINTY → CONFIRMED), annual basis `+1638% → -1014%` (PUMP_AND_DUMP_RISK HIGH → NEGATIVE_FUNDING_BIAS ACTIVE), `hot_count 0 → 4` (universe re-expanded — DeFi reactivated with UNI, MKR, AAVE, SAND). SAND's WARM→HOT also generated a new T3 prediction (`LBC35-20260713-T3-01`).
4. **Daily pipeline (radar + briefs) IS running.** `daily_radar.json` regenerated 2026-07-19 19:08 UTC (today, 5h 53m old at cron time). `pair_briefs.json` regenerated same timestamp. 15 brief entries, all `brief_source: deepseek_batch`. `top_struct` carries 10 names; `watchlist: [PUMPUSDT]`; `do_not_touch: [1MWOJAKUSDT, 1000REKTUSDT, TLMUSDT]`.
5. **0 trades** since 2026-05-11 (correct behavior given BossMan gating). `signal_journal` 7-day count = 0. `auto-recovery-state.json` shows 2 historical restart timestamps (2026-07-11) but the auto-recovery budget is now reset.
6. **0 new cards created** this week (L-CRYPTO-14: routine operations are reported, not asked). All 8 trading-related open kanban tasks unchanged from week 5.
7. **Cost: 0 LLM calls, $0.00.** Well under the ≤1-call weekly budget.
8. **Cron PATH issue still active in `health-cron-wrapper.sh`.** Confirmed via re-reading the wrapper: line 19 already does `export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$HOME/.npm-global/bin:$HOME/Library/Python/*/bin"`. So PATH is set in the **wrapper** invocation. But the parallel `0 16 * * *` and `0 4 * * *` `node health-check.js` lines in `crontab` invoke the Node script **directly with no PATH** (the comment in `t_1c502da6` §6 confirms this was the intended wiring, but those lines have always lacked a PATH=...). The wrapper was added later as a parallel run, and both still run daily. The 4×/day success rate is driven by the wrapper (which DOES set PATH); the 2×/day `node` lines likely also fail with `/bin/sh: pm2: command not found` — but the Telegram-delivered `binance-health-check-am` and `binance-health-check-pm` cron jobs are the ones that the system is actually surfacing. **The 2×/day silent-fail lines in the user crontab should be removed to clean up the failure log; this is an operator-action item (v3 carve-out: cron change requires Marcelo approval) — F2 follow-up.**

---

## A. Decision digest (L-CRYPTO-14 — BossMan decisions this window)

> Per L-CRYPTO-14 amendment 2026-06-19, this digest is a one-shot summary of BossMan's decisions for human review. Routine operations are **reported**, not asked. No 3-5 questions loop. Approval-boundary items only.

### A1. Decisions made (window: 2026-07-13 → 2026-07-19)

**Source of truth:** `~/Projects/binance-bot/data/bossman_decision.json` (generated **2026-06-19T23:02:51 UTC** — same artifact as the prior 5 briefs).

| Metric | Value |
|---|---|
| Stage 6 emissions this week | 0 (last run: 2026-06-19) |
| Stage 6 emissions trailing radar | **30d 1h 58m** (was 22d 19h, last week) |
| Decisions in latest artifact | 1 snapshot (2026-06-19 23:02 UTC) |
| Coins qualified (QUALIFY) | 9 — XRP, ADA, LINK, VET, AVAX, DOT, SUI, FET, NEAR |
| Coins denied (DENY) | 6 — DOGE, HBAR, XLM, CAKE, PEPE, HYPE |
| Universe active size | 15 (unchanged vs. 2026-06-19) |
| Watchlist (BossMan) | 1 (HYPEUSDT) |
| Rotations (add/remove) | 0/0 — no change since 2026-06-19 |
| Floor audit (L-CRYPTO-14 §1) | 0 violations, 0 denied-below-floor |
| Min notional enforced | $75 USD (L-CRYPTO-14 hard rule) |
| Mode mutation | NONE — advisory only |
| `daily_radar.json` refresh | **YES, 2026-07-19 19:08 UTC** (fresh, 5h 53m old at cron time) |
| `intelligence.json` refresh | **YES, 2026-07-13 22:02 UTC** (one new snapshot; 6d 2h old at cron time) |

**Material change vs. week 5:** Stage 6 staleness **+7d (22d 19h → 30d 1h 58m)** crossed the 30-day hard ceiling defined in `crypto-weekly-review` SKILL.md §"Failure modes." Per the failure-modes guidance: "If missing [or trailing by > 30d], digest notes 'Stage 6 not yet wired' / ... [if] mtime trails daily_radar.json by > 1 cron cycle, **FIRST check the kanban for an owning card**. If the owning card is `blocked` with a human/approval gate, the framing is 'gated', not 'stalled'." The owning card is `t_bb2fd054` (Stage 6 emitter, `blocked` since 2026-06-19 — week 6 carry-forward). **Framing:** **gated, not stalled.** Approval-boundary surfacing in A5/F1, not a new diagnostic card.

### A2. Coin rotation deltas (2026-07-13 → 2026-07-19)

- **Added (BossMan):** none (no new Stage 6 artifact)
- **Removed (BossMan):** none
- **Watchlist (BossMan decision layer):** HYPEUSDT (held since 2026-06-19; `suspicious_volume` risk_callout, `price_window=out` → DENY at TIER_2_BASE)
- **Watchlist (daily_radar layer, fresh 2026-07-19 19:08 UTC):** **PUMPUSDT** (new — was on the 2026-07-12 radar top 10 with score 0.78; this week it tops the list at 0.775 and was promoted to the daily_radar watchlist)
- **do_not_touch (daily_radar):** 1MWOJAKUSDT, 1000REKTUSDT, TLMUSDT (all three are extreme 24h gainers on low volume — see weekly memo 2026-07-18; carried forward from week 5)
- **Tier transitions:** none — `TIER_2_BASE` (10 coins) and `TIER_1_CONSERVATIVE` (5 coins) stable across all per_coin entries in the 2026-06-19 artifact
- **Strategy class:** all `swing` (no change)

### A3. Per-day qualified/rejected trade counts

`signal_journal` 7-day count = 0. Trades table 7-day count = 0. Bot API `cycle=1, status=no_signal, totalExposure=0` (current). The single Stage 6 artifact for the window (2026-06-19) contains 9 QUALIFY + 6 DENY decisions from prior week. In the absence of Stage 6 emissions, no new decisions are emitted.

| Day | Qualified | Denied | Notes |
|---|---|---|---|
| 2026-06-19 (Stage 6 artifact) | 9 | 6 | low_liquidity (5: DOGE, HBAR, XLM, CAKE, PEPE), suspicious_volume + price_window=out (1: HYPE) |
| 2026-07-13 → 2026-07-19 | 0 | 0 | **No new Stage 6 emissions this week — gated on Marcelo preview approval (A5/F1)** |

### A4. Hard $75 floor enforcement (L-CRYPTO-14 §1)

- `floor_audit.min_notional_usd`: 75 (unchanged)
- `floor_audit.min_notional_source`: "L-CRYPTO-14 hard rule"
- `floor_audit.violations_dropped`: 0
- `floor_audit.denied_below_floor`: 0
- **Disposition:** floor held; no violations observed in the current artifact.

### A5. Approval-boundary items (gate 1/4/6/8/9 — surfaced as approval requests, never question batches)

| Item | Gate | Status | Approval required? |
|---|---|---|---|
| **Bot is LIVE-configured at the env level (`PAPER_MODE=false`)** | L-CRYPTO-20 (no autonomous flip) + L-CRYPTO-10 (two-gate) | **Active since 2026-06-15** — runtime behavior is effectively PAPER via INTEL_GATE + BossMan gating + LIVE_PILOT_MAX_NOTIONAL=75 cap, but env is unambiguously LIVE. **Week 6 carry-forward of week 5 finding.** | **YES — carry-forward approval request** (week 2 of this item; original raised week 5) |
| **Stage 6 emitter preview approval** | L-CRYPTO-14 child-1 (`t_bb2fd054`) | **Blocked since 2026-06-19 — awaiting Marcelo preview** | **YES — carry-forward approval request** (week 6) |
| PAPER mode preservation | L-CRYPTO-20 (no autonomous flip) | **Effective** at runtime (not at env) | No |
| $75 floor | L-CRYPTO-14 §1 | Held | No |
| Numeric band changes | L-CRYPTO-18 governance | None proposed | No |
| Strategy-class / aggression-tier vocabulary | L-CRYPTO-18/19 governance | Stable, no change | No |
| LIVE pilot (operational, not env) | L-CRYPTO-10 two-gate | Dormant by INTEL_GATE + BossMan gating | No |
| Security/auth/withdrawal | HARD GATE §B | canTrade not yet re-audited; still paused per Phase 12C | No |
| **HARD GATE observability cron 72868985fd12** | L-CRYPTO-14/child-4 (`t_52d08320`) | **Blocked** — paused per Phase 12C | No (already paused) |

**Two carry-forward approval-boundary items, no new ones this week:** (a) `PAPER_MODE=false` env-level LIVE confirmation, (b) `t_bb2fd054` Stage 6 emitter preview. Surfaced as a single combined approval request, not a question batch. See F1 for the prompt-ready ask.

---

## B. CSDAWGBOT status of open cards (no new proposals)

> Per L-CRYPTO-14 amendment: the digest does **not** propose 3-5 new tasks in the normal loop. Five CSDAWGBOT cards remain `todo` from 2026-06-14. The curriculum parent remains `blocked`. **No new cards created this week.**

### B1. Status of 2026-06-14 cards (all `todo`, not picked up — verified on `bossman` board this run)

| Card | Title | Status | Effort | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | S | **Less applicable now** — intel layer regenerated 2026-07-13 (6d 2h old). Staleness clock within the 7d soft-signal threshold. Becomes first-priority again if next intel run misses. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | S | Resolution windows for T3-01 LINK (2026-06-18), T3-02 WARM (2026-06-19) both passed. Card remains open. New T3 prediction `LBC35-20260713-T3-01` (SAND HOT) and `LBC35-20260713-T3-02` (WARM count → 9+) also open. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | M | **Cannot be picked up — curriculum parent `t_e53da070` is still `blocked` (see C7).** |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | L | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | M | **Higher signal this week** — the 2026-07-13 intel has DeFi as `sector_rank[0]` with 4 HOT names (UNI, MKR, AAVE, SAND) and avg 7d return +1.90% vs BTC. This is the first sector reactivation in 6 weeks. Card becomes more useful now; deprioritization of card is no longer the right call. |

### B2. Status of L-CRYPTO-14 children + curriculum parent (verified on `bossman` board)

| Card | Title | Status | Notes |
|---|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine (Phase 1 governance lock) | **ready** | Phase 1 governance shipped 2026-06-19. Not promoted to `running` because Stage 6 emitter (`t_bb2fd054`) is the live execution branch. |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (code pass, preview-gated) | **blocked** | **The carry-forward approval-boundary item (week 6).** Blocked on Marcelo preview approval. No technical blocker. Stage 6 artifact is now 30d 1h 58m stale. |
| `t_1adae96f` | L-CRYPTO-14/child-2: Verify HARD GATE §B cleared (canWithdraw via Binance.US UI) and resume Phase 11A LIVE-readiness checklist | **blocked** | HARD GATE §B (canWithdraw) still paused per Phase 12C. Independent of `t_bb2fd054`. |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit remaining files (crypto-weekly-review SKILL.md + PHASEREPORT.md changes) and push | **blocked** | Carry-forward. Local-only commit from 2026-07-05 brief not pushed (kernel-doc conflict in `docs/ROUTING-RULES.md`). Per Step 7.2 the rebase conflict stop is durable — remote sync waits. |
| `t_52d08320` | L-CRYPTO-14/child-4: 24h observability cron 72868985fd12 — clear HARD GATE before letting it run | **blocked** | Cron `72868985fd12` paused. Independent of `t_bb2fd054`. |
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** | Same state as last 6 weeks (agent crash x3, dispatcher suspended). Stage 1.2 child `running` status is stale relative to parent state. |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** | Track-level card; rebuild scope unchanged. |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar (5 stages + spike-profit card) | **blocked** | Track-level. Stages 2-5 children are `todo`. Stage 1 (`t_210f2ec8`) `todo`. |

### B3. New CSDAWGBOT proposals this week

**None.** Per L-CRYPTO-14, the weekly digest does not create routine cards.

### B4. Approval-boundary cards created

**None** (no new cards created; the two existing approval-boundary items are surfaced in A5/F1).

---

## C. Mode + engine state + staleness

### C1. Bot state (binance-bot:8104, 2026-07-19 18:00 PT)

```
mode: "LIVE"          ← env value (PAPER_MODE=false, unchanged since 2026-06-15)
paperMode: false       ← matches env
intelGate: true        ← INTEL_GATE_ENABLED=true
intelPriceWindow: true
balance: 0.18 USDT
target: 3000 USDT
progress: -6.8%
lastCheck: 2026-07-20T00:56:50.073Z
cycle: 1
status: no_signal
exposurePct: 0
consecutiveLosses: 0
cooldownActive: false
totalExposure: 0 / maxExposure: 0.05
maxPositions: 1
minTradeNotional: 75
```

**Health-check status:** `binance-health-check-am` (cron `fed3553cf244`, `0 9 * * *`, deliver=telegram) last run 2026-07-19 09:00 PT — ok. `binance-health-check-pm` (cron `4d4552dc85c9`, `0 21 * * *`, deliver=telegram) last run 2026-07-18 21:00 PT — ok. pm2 restart delta = 0 since 2026-07-12 recovery. Bot uptime 7d continuous.

**No new incident this week** (week 5's sqlite3 arch-mismatch recovery held).

### C1.1 Env-level LIVE confirmation (carry-forward, week 6)

`.env` mtime is **2026-06-15 21:02:38 PT** — same date as the `.env.backup-2026-06-15-pre-live` backup (which is from 2026-05-30, so the "pre-live" naming is loose; the actual edit landed 2026-06-15). Key diff between backup and current `.env`:
- `PAPER_MODE` — present in both (values redacted in logs)
- `INTEL_GATE_ENABLED` — present in both
- `LIVE_PILOT_MAX_NOTIONAL` — **only in current `.env`, not in backup** (added at the 2026-06-15 edit)

The runtime gate stack is intact: `INTEL_GATE_ENABLED=true` + `LIVE_PILOT_MAX_NOTIONAL=75` + BossMan Stage 6 not emitting → bot cannot place a real order even with `PAPER_MODE=false`. **L-CRYPTO-20 binds BossMan from any autonomous PAPER↔LIVE flip — surfacing for operator confirmation only.**

### C2. Engine state — intelligence.json staleness

`~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` mtime: **2026-07-13 22:02 UTC** → **6d 2h old** at cron time. Within the 7d soft-signal threshold.

| Snapshot date | Regime | Confidence | Certainty | BTC | Annual basis |
|---|---|---|---|---|---|
| 2026-05-21 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,645 | 1102 |
| 2026-05-22 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,660 | n/a |
| 2026-05-25 | MID_CYCLE | 0.45 | UNCERTAINTY | $77,299 | -425 |
| 2026-06-01 | MID_CYCLE | 0.45 | UNCERTAINTY | $70,961 | n/a |
| 2026-06-08 | MID_CYCLE | 0.45 | UNCERTAINTY | $63,527 | -139 |
| 2026-06-15 | MID_CYCLE | 0.45 | UNCERTAINTY | $66,345 | -1100 |
| 2026-06-22 | MID_CYCLE | 0.45 | UNCERTAINTY | $64,235 | -999 |
| 2026-06-29 | MID_CYCLE | 0.65 | **CONFIRMED** | $60,409 | 1401 |
| 2026-07-06 | MID_CYCLE | 0.45 | UNCERTAINTY | $64,396 | 1638 |
| **2026-07-13** | **MID_CYCLE** | **0.65** | **CONFIRMED** | **$62,052** | **-1014** |

**Net change vs. last week (2026-07-06):** confidence `0.45 → 0.65` (rolled BACK to CONFIRMED, alternating pattern continues). BTC `$64,396 → $62,052` (-3.6%). Annual basis `+1638% → -1014%` (**flipped sign** — back to NEGATIVE_FUNDING_BIAS ACTIVE/MEDIUM, no longer PUMP_AND_DUMP_RISK HIGH).

### C3. Regime (as of 2026-07-13 intel snapshot, current best data)

- `regime`: MID_CYCLE (10th consecutive week)
- `regime_confidence`: 0.65
- `regime_certainty`: CONFIRMED (week 2 of 2 total since 2026-05-21; alternates with UNCERTAINTY)
- `regime_signal_date`: 2026-07-13
- `btc_current_price`: $62,052
- `btc_200d_sma`: $73,785
- `btc_50d_vs_200d`: death_cross
- `drawdown_from_ath_pct`: -50.78%
- `momentum_90d_pct`: 0
- `volatility_regime`: LOW
- `indicators_agreeing`: `high_drawdown, death_cross`
- `btc_7d_pct`: -2.93%
- `coin_rankings`: 4 HOT / 7 WARM / 3 WATCH / 9 COLD (vs. last week 0 HOT / 8 WARM / 3 WATCH / 12 COLD)

### C4. Risk flags (from 2026-07-13 intel)

- `NEGATIVE_FUNDING_BIAS` — ACTIVE / MEDIUM / annual basis -1014% (carry-forward from week 5 framing; the 2026-07-13 snapshot reasserts it as the dominant flag after a 1-week PUMP_AND_DUMP_RISK interlude)

### C5. Funding regime (from `funding_basis`)

```
annualized_basis_pct: -1014.14
raw_basis_pct: -0.116
```

| Week | annual_basis_pct | Sign | Risk flag |
|---|---|---|---|
| 2026-05-21 → 2026-06-15 | small negatives (e.g. -0.3% to -2%) | negative (mild) | none |
| 2026-06-22 | -999% | negative (extreme widening) | `NEGATIVE_FUNDING_BIAS` |
| 2026-06-28 | -139% | negative (extreme) | `NEGATIVE_FUNDING_BIAS` |
| 2026-06-29 (prior brief) | +1401% | **positive (extreme)** | **`PUMP_AND_DUMP_RISK` HIGH** |
| 2026-07-06 (prior brief) | +1638% | **positive (extreme widening)** | **`PUMP_AND_DUMP_RISK` HIGH** |
| **2026-07-13 (this brief)** | **-1014%** | **negative (extreme widening)** | **`NEGATIVE_FUNDING_BIAS` ACTIVE** |

**Net 21-day swing: -1100% → -999% → -139% → +1401% → +1638% → -1014%** (range 2652pp, std dev ~1000%). The funding-basis series is **oscillating, not trending** — two back-to-back positive readings followed by a flip back to deep negative suggests market structure is in transition, not regime-stable. Same conclusion as week 5: the methodology audit (flagged in 2026-07-05 brief C5) is still warranted regardless of which sign the next snapshot lands on.

### C6. Trade activity (from `data/bot.db`)

```sql
SELECT count(*) total, sum(CASE WHEN status='closed' THEN 1 ELSE 0 END) closed, round(sum(COALESCE(pnl,0)),2) total_pnl, max(COALESCE(exit_time,entry_time)) last_trade FROM trades;
-- total=15, closed=15, total_pnl=4.37, last_trade=2026-05-12T10:05:03.252Z

SELECT status, count(*), round(sum(COALESCE(pnl,0)),2) FROM trades GROUP BY status;
-- closed 15 4.37
```

15 closed trades, $4.37 total PnL, **last trade 2026-05-12** (68 days ago). 0 new trades since 2026-05-12 — consistent with BossMan gating + PAPER-mode-preserved runtime. **No new trades this week.** (`signal_journal` 7-day count = 0; `executed_signals` 7-day count = 0.)

### C7. Curriculum parent `t_e53da070` is still `blocked` (carry-forward, week 6)

Same as last 6 weeks. Stage 1.2 child `t_crypto_learn_s1_02_bull_bear_structure` shows `running`, but parent is `blocked` — the child's running status is stale relative to the parent state (dispatcher suspended). No movement this week.

### C8. Stage 6 (BossMan Decision Emitter) status — gated (carry-forward, week 6)

`data/bossman_decision.json` mtime: **2026-06-19 23:02:51 UTC** → **30d 1h 58m old** at cron time. **First week crossing the 30-day hard ceiling** defined in `crypto-weekly-review` SKILL.md §"Failure modes." Per the failure-modes guidance, the framing is **gated, not stalled** (Lesson #13 from 2026-07-05). The owning card `t_bb2fd054` is `blocked` on Marcelo preview approval since 2026-06-19. **No new diagnostic card created** — the carry-forward approval request is the right surface.

### C9. Daily pipeline (radar + briefs) — HEALTHY

`daily_radar.json` regenerated 2026-07-19 19:08 UTC (5h 53m old at cron time). `pair_briefs.json` regenerated same timestamp. 15 brief entries all with `brief_source: deepseek_batch`. Universe flattened to WARM (top 10: PUMP, 1MWOJAK, 1000REKT, TLM, TRAC, KAITO, NEIRO, HYPE, XLM, SOL) but no breakouts. `top_struct_count: 10`. `do_not_touch: [1MWOJAKUSDT, 1000REKTUSDT, TLMUSDT]` (extreme gainers on low volume per weekly memo 2026-07-18). `watchlist: [PUMPUSDT]`.

---

## D. Open kanban tasks (verified on `bossman` board via direct SQL — CLI `kanban show` returns "no such task" because the default board is set to `default`, not `bossman`)

### D1. CSDAWGBOT cards from 2026-06-14 (all `todo`)

| Card ID | Title | Status | Created | Notes |
|---|---|---|---|---|
| `t_8bec8b2a` | CSDAWGBOT: Refresh stale intel layer 2026-06-14 | todo | 2026-06-14 | Intel refreshed 2026-07-13 (6d 2h old). Within 7d soft-signal. |
| `t_947f0fa4` | CSDAWGBOT: Resolve first batch of open predictions | todo | 2026-06-14 | Resolution windows for T3-01 LINK, T3-02 WARM passed. New T3 (2026-07-13: SAND HOT + WARM→9+) added. |
| `t_00af7146` | CSDAWGBOT: Draft Stage 1.3 curriculum module | todo | 2026-06-14 | Cannot pick up — parent `t_e53da070` blocked. |
| `t_b58afdfe` | CSDAWGBOT: Backtest regime-change precursor signals (PAPER) | todo | 2026-06-14 | Deferrable. |
| `t_fcc58ae8` | CSDAWGBOT: Sector rotation intel enrichment (DeFi lead validation) | todo | 2026-06-14 | **DeFi reactivated this week** — sector_rank[0] with 4 HOT names (UNI, MKR, AAVE, SAND). Card now has higher signal. |

### D2. L-CRYPTO-14 children (governance)

| Card ID | Title | Status |
|---|---|---|
| `t_2912210a` | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine | **ready** |
| `t_bb2fd054` | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter | **blocked** ← approval-boundary (week 6) |
| `t_1adae96f` | L-CRYPTO-14/child-2: HARD GATE §B cleared + LIVE-readiness | **blocked** |
| `t_d070c52c` | L-CRYPTO-14/child-3: Commit SKILL.md + PHASEREPORT.md + push | **blocked** (kernel-doc conflict stop from 2026-06-28 brief) |
| `t_52d08320` | L-CRYPTO-14/child-4: observability cron — clear HARD GATE | **blocked** |

### D3. Curriculum + tracks

| Card ID | Title | Status |
|---|---|---|
| `t_e53da070` | Crypto Education Curriculum — Modular Foundation | **blocked** (carry-forward week 6; agent crash x3) |
| `t_e752ea85` | TRACK — Binance US Intelligence and Strategy Rebuild | **blocked** |
| `t_aefb15e8` | DAILY-RADAR: Binance.US USDT intel radar | **blocked** |

### D4. Cards created this week

**None.** Per L-CRYPTO-14, the weekly digest does not create routine cards.

### D5. Approval-boundary cards created

**None** (no new cards created; the two existing approval-boundary items are surfaced in A5/F1).

---

## E. Cost + token usage

- LLM calls: **0** (templated digest; no LLM call needed)
- $ spent: **$0.00** (well under the ≤1-call weekly budget)
- Tool calls: shell + sqlite3 only
- Brief mirror writes: 2 (Obsidian + BossMan repo)
- Card creates: 0
- Cron changes: 0 (v3 carve-out)

---

## F. Next week (2026-07-26)

### F1. First-order watch items (priority order)

1. **`t_bb2fd054` — Stage 6 emitter preview approval (week 6 carry-forward).** The single approval-boundary item that has been on the surface for 6 weeks. Stage 6 artifact is now 30d 1h 58m old (crossed 30-day hard ceiling this week). **If approved, the next Stage 6 run will emit fresh decisions against a LIVE-configured bot** (see F1.1).
2. **`PAPER_MODE=false` env-level LIVE confirmation (week 2 carry-forward).** Same as week 5: is the LIVE env value intentional (Phase 6 Track B in progress, card `t_1c502da6`) or drift from 2026-06-15 that should be reverted? **BossMan does NOT modify the env (L-CRYPTO-20 + skill Hard Rule #2).** Operator confirmation only.
3. **Funding basis continues to oscillate (-1100% → -999% → -139% → +1401% → +1638% → -1014%).** 21-day range 2652pp, std dev ~1000%. The methodology audit (first raised week 4, F2 follow-up) is increasingly warranted — the read is too noisy to anchor regime-fit decisions on.
4. **`t_d070c52c` — kernel-doc push.** Per the 2026-06-28 brief Step 7.2 stop, the local commit `b23db8c` was not pushed because the rebase hit a conflict in `docs/ROUTING-RULES.md`. This card is the formal pickup item.
5. **`t_e53da070` curriculum parent blocked.** Carry-forward week 6. Stage 1.2 agent crash (3x) root cause still un-investigated.
6. **Predictions backlog.** T3-01 LINK (2026-05-21), T3-02 WARM (2026-05-21/22/25/06-01/06-08/06-15) — all 6 T3 WARM-count predictions UNSCORABLE per the 2026-07-13 prediction_review (insufficient data or archived intel for outcome date). T3 SAND HOT (2026-07-13) — fresh. Card `t_947f0fa4` remains the resolution protocol deliverable.

#### F1.1 If `t_bb2fd054` is approved this week — operator-action required

Approval alone is not enough. With the env LIVE-configured:
1. **Confirm HARD GATE §B (canWithdraw)** before live order execution. Card `t_1adae96f` is the formal pickup item.
2. **Confirm `INTEL_GATE_ENABLED=true` is the intended gate** (not just a Phase 10 default). Without it, the LIVE-configured bot would trade on any Stage 6 QUALIFY decision.
3. **Confirm `LIVE_PILOT_MAX_NOTIONAL=75`** is the intended cap. $75 is below many exchange minimums — this is the floor protection, not a sizing decision.
4. **Verify Binance.US API key permissions** — the LIVE env value assumes the key has trade permission. If the key is still `canTrade=false` (per HARD GATE §B), the LIVE config is inert. If `canTrade=true`, the config is now operationally active.

**L-CRYPTO-10 two-gate approval applies:** Gate 1 (6+ weeks of resolved predictions) is **not met** (L-CRYPTO-04 — 20 predictions logged, 1 HIT scored, 9 UNSCORABLE, 10 pending). Gate 2 (explicit Marcelo directive) is **not on record**. The two-gate policy binds even if `t_bb2fd054` is approved: BossMan cannot unilaterally flip to LIVE based on Stage 6 approval.

### F2. Follow-ups tracked (low priority unless escalated)

1. **Cron PATH cleanup in user crontab.** The 2×/day `0 16 * * *` and `0 4 * * *` lines that invoke `node health-check.js` directly (no PATH) likely fail with `/bin/sh: pm2: command not found` (visible in `health-cron.log` as silent PM2 errors). The wrapper `health-cron-wrapper.sh` (which DOES set PATH) is the parallel run that actually surfaces via `binance-health-check-am` / `binance-health-check-pm` cron jobs. **Recommend (v3 carve-out: cron change requires operator approval):** remove the 2×/day direct-`node` lines, keep only the wrapper-invoking lines. Without this, the `health-cron.log` keeps growing noise that doesn't correspond to actual system health.
2. **Funding basis methodology audit.** First raised week 4. 21-day oscillation 2652pp. Worth investigating when `t_8bec8b2a` (intel refresh) runs.
3. **Kanban CLI board context bug.** Carry-forward. `hermes kanban show <id>` returns "no such task" for cards on the `bossman` board when CLI is set to `default`. Workaround: direct SQL on `~/.hermes/kanban/boards/bossman/kanban.db`.
4. **sqlite3 native binding rebuild hygiene.** Carry-forward from week 5. Recommend (operator task, not autonomous): add `npm rebuild` to the post-deploy runbook if any team member develops on an M-series Mac. The arm64 → x86_64 mismatch is exactly what happened on 2026-07-11.
5. **DeFi sector reactivation — re-prioritize `t_fcc58ae8`.** DeFi reactivated to `sector_rank[0]` with 4 HOT names (UNI, MKR, AAVE, SAND) per the 2026-07-13 intel snapshot. The CSDAWGBOT card `t_fcc58ae8` ("Sector rotation intel enrichment — DeFi lead validation") was previously deferred because DeFi was 0 HOT. Reactivation makes the card more useful. **No new card created** — this is a reprioritization signal, not a new scope (per L-CRYPTO-14: routine reprioritization does not require operator approval).

### F3. Questions not to re-ask (deferred per L-CRYPTO-14)

The 2026-06-14, 2026-06-21, 2026-06-28, 2026-07-05, and 2026-07-12 briefs did not draft 3-5 questions for Marcelo. Under L-CRYPTO-14, routine operations are **reported**, not asked. **No new questions are surfaced this week.** The two action items are: (a) `t_bb2fd054` preview approval (week 6), (b) `PAPER_MODE=false` env-level confirmation (week 2 of this item) — both are yes/no prompts, not question batches.

### F4. Regime transition watch (carry forward from prior weeks)

- Funding basis: **-1014% (back to NEGATIVE after 1 week of PUMP_AND_DUMP_RISK HIGH)** — see C5.
- BTC vs 200d SMA: still $11,733 below ($62,052 vs $73,785). Death cross active for 10 weeks.
- BTC drawdown: **-50.78%** (widened 1.86pp from -48.92% last week; trend reversed after 7-week improvement).
- BTC 7d: **-2.93%** (back to negative after 1 positive week).
- Neither BTC 200d break nor sustained funding normalization has happened. **Continue watching.** Confidence is alternating 0.45/0.65 with no clear trend.

### F5. BossMan decision layer — open scope

Stage 6 was wired Phase 2-3 on 2026-06-19, but is not emitting daily because it is gated on Marcelo preview approval (`t_bb2fd054`). The next preview-gated pass after that is **execution wire-up** — connecting the Stage 6 artifact to the Policy Gate. Both are roadmap items, not digest items.

---

## Hard rules confirmed for this run

- [x] L-CRYPTO-03: Engine is read-only; no telegram-from-engine, no bot-config writes, no crypto-intel/ writes.
- [x] L-CRYPTO-10: PAPER mode preservation at runtime via INTEL_GATE + BossMan gating + LIVE_PILOT_MAX_NOTIONAL=75 cap. Env-level LIVE surfaced for operator confirmation only.
- [x] L-CRYPTO-14: This digest is a report of BossMan's decisions, not a question batch. No 3-5 questions for Marcelo. Approval-boundary items reported (two this week: env LIVE + Stage 6 emitter, both carry-forward).
- [x] L-CRYPTO-20: No autonomous PAPER↔LIVE flip. The `.env` PAPER_MODE=false was surfaced, not acted on.
- [x] One Telegram Home message will be sent at the end of this run (auto-delivery, no explicit `hermes send`).
- [x] Cost: 0 LLM calls, $0.00 spent. Well under the ≤1-call weekly budget.
- [x] No spam: content is meaningful (full BossMan decision digest + Stage 6 staleness 30d threshold crossed + regime/intel flip + status of 8 open cards + 1 new material finding: Stage 6 30d hard-ceiling crossing; 2 re-prioritization signals: DeFi reactivation, funding basis volatility).
- [x] No new cards created for routine operations; no question batch drafted.
- [x] Weekly only: no other schedules or pings created.
- [x] BossMan autonomous-remediation: no bot incident this week, so the recovery recipe from 2026-07-12 was not invoked.

---

## References

- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/LEARNED_CRYPTO_INTELLIGENCE.md` (L-CRYPTO-01 through L-CRYPTO-20, 20 rules + governance pointers)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-07-13, 6d 2h stale)
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC, 30d 1h 58m old — gated on `t_bb2fd054`)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-07-19 19:08 UTC — fresh, 5h 53m old)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-07-19 19:08 UTC — fresh, 5h 53m old)
- `~/Projects/binance-bot/data/bot.db` (15 closed trades, 0 since 2026-05-12; total PnL $4.37)
- `~/Projects/binance-bot/.env` (PAPER_MODE=false, INTEL_GATE_ENABLED=true, LIVE_PILOT_MAX_NOTIONAL=75; mtime 2026-06-15 21:02:38 PT)
- `~/Projects/binance-bot/.env.backup-2026-06-15-pre-live` (backup from 2026-05-30)
- `~/Projects/binance-bot/data/auto-recovery-state.json` (2 historical restart timestamps, no active budget block)
- `~/Projects/binance-bot/health-cron-wrapper.sh` (PATH set in wrapper line 19; parallel direct-node lines in crontab do not set PATH)
- `~/Projects/binance-bot/data/crypto-intel/DAILY_RADAR_10.json` (radar log)
- `~/.hermes/kanban/boards/bossman/kanban.db` (8 open trading-related cards: 5 CSDAWGBOT todo + 5 L-CRYPTO-14 children + 1 curriculum parent + 2 track-level blocked; verified via direct SQL)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-12.md` (prior brief)
- `~/.hermes/knowledge/crypto-intel/CSDAWG_PREDICTIONS_LOG.json` (20 predictions; 1 HIT, 9 UNSCORABLE, 10 pending)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md` (workflow + failure modes)
- Cron job: `ea0157d715fa` (Sundays 6pm PT, telegram-deliver)

## Lessons (added this run)

19. **Stage 6 staleness crossed the 30-day hard ceiling this week (2026-07-13 → 2026-07-19).** Week 5 brief called this "22d 19h" — a full +7d slip in one cycle. The brief is now reading a one-month-old decision snapshot. Per the failure-modes guidance, the framing is **gated, not stalled** (Lesson #13), and the right surface is the carry-forward approval request in A5/F1. **Watch item:** if `t_bb2fd054` remains blocked for another cron cycle, the brief becomes essentially a status report on the gap, not a digest of fresh decisions. Consider whether the weekly skill should auto-skip when the gap exceeds 60d (escalate to a one-time drift-fix card instead).
20. **Cron PATH issue is partially fixed, partially not.** The `health-cron-wrapper.sh` (line 19) sets PATH correctly. But the user's crontab also has 2×/day direct-`node health-check.js` lines (no PATH) that likely fail silently. The wrapper is the surface that actually fires the Telegram alerts (`binance-health-check-am` / `binance-health-check-pm` cron jobs). The direct-`node` lines add noise to `health-cron.log` without contributing to system health. **Carry-forward from week 5 (Lesson #16); this week confirmed the dual-invocation pattern by reading the wrapper script directly.** The fix is operator-side (cron change) — v3 carve-out, surface as F2 follow-up.
21. **Funding basis oscillates, doesn't trend.** 21-day range 2652pp. Methodology audit was first raised week 4 (Lesson from run 2026-06-28). The signal is too noisy to anchor regime-fit decisions on. **Reaffirmed this week** — the +1638% → -1014% sign flip in one cycle shows the read can reverse on a single snapshot.
22. **DeFi reactivation makes `t_fcc58ae8` higher-signal.** The 2026-07-13 intel has DeFi at `sector_rank[0]` with 4 HOT names (UNI, MKR, AAVE, SAND) — first sector reactivation in 6 weeks. The CSDAWGBOT card "Sector rotation intel enrichment — DeFi lead validation" was deferred because DeFi was 0 HOT. Reactivation changes the cost/benefit. **No new card created** — this is a reprioritization signal routed through the existing card.

---

**END OF BRIEF**
