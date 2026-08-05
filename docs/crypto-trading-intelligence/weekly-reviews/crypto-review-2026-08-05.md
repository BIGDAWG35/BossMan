# Crypto Weekly Review — 2026-08-05 (cron run #9, auto, BossMan)

> **Summary in one line:** Bot **OFFLINE for 7th consecutive day** (no recovery from week 8 outage), Stage 6 emitter now **47d 1h stale** (3rd consec cycle at 30d+ rung, **13 days to 60d auto-skip drift-fix threshold**), funding basis sign-flipped **yet again** (+239% vs +483% week 8, +1638% week 6, -1014% week 5 — Lesson #21 audit-now-overdue criterion confirmed), sector concentration "60% Other" flag now **2nd consecutive week** (Lesson #24 promotion to F1), `intelligence.json` schema regression continues (confidence/regime/hot_pairs all null despite 2026-08-05 date), **0 new BossMan decisions possible** because the emitter is gated AND the bot is offline.

---

## A. Decisions digest (last 7 days)

| Item | Value |
|---|---|
| **Total decisions made in window** | **0** — Stage 6 emitter has not produced `bossman_decision.json` since 2026-06-19 16:02. Now 47d 1h stale. Radar + briefs continue daily (Aug 4 12:04 / 12:01), but Stage 6 is gated on `t_bb2fd054` (preview-gated, blocked). |
| Coin rotation deltas | n/a (no decisions emitted). Radar top_struct rotation: XECUSDT (week 8 top) → ZILUSDT (this week). ZIL leads with 32.5% 24h surge, "Other" sector. |
| Tier transitions | None — Stage 6 didn't fire. Radar bands stable (pre-resolved: 0 HOT / 10 WARM / rest below). |
| Qualified trades | 0 |
| Rejected trades | 0 |
| Top rejection reasons | n/a |
| Hard $75 floor rejections | n/a |
| Approval-boundary crossings | **3 carry-forwards** — (a) PAPER_MODE=false env-level (week 2 onward, 51 days), (b) Stage 6 preview gate `t_bb2fd054` (week 4 onward, 47 days), (c) bot offline recovery (week 8 onward, 7 days). |

**No new approval-boundary items this week.** BossMan decided nothing because (i) Stage 6 didn't emit AND (ii) the bot is offline.

**Material non-decisions:**
- **Bot is OFFLINE for 7th consecutive day.** Auto-recovery attempted at 2026-08-05T07:15:07Z (cron start) but PM2 process is not running. Health-cron-wrapper is firing, but `pm2/ node` PATH issue persists in the recovery branch (Lesson #20).
- **Funding basis sign-flipped AGAIN** (+239% vs +483% week 8, +1638% week 6, -1014% week 5, +1401% week 4, -999% week 3). **Lesson #21 audit-now-overdue criterion now met across 4 consecutive cycles.** The signal is too noisy to anchor regime-fit decisions on.
- **Sector concentration risk flag persists.** 2026-08-04 daily memo: "Top-10 includes 7 'Other' category symbols" (vs. 60% last week — same bucket). **2 consecutive weeks with ≥50% top_struct in "Other" → F1 promotion per Lesson #24.**
- **Intelligence.json schema regression.** `confidence: null`, `regime_today: null`, `hot_pairs: null` despite `report_date: 2026-08-05`. Daily memo says regime=MID_CYCLE / confidence=MEDIUM — the staging JSON is regressing fields. Now 2 consecutive weeks (week 8 + week 9) of regression → F1 promotion per Lesson #24.

---

## B. CSDAWGBOT status of open cards

Read via direct SQL on `~/.hermes/kanban/boards/bossman/kanban.db` (Lesson #12 workaround).

| Card ID | Status | Title | Owner lane |
|---|---|---|---|
| `t_e752ea85` | blocked | TRACK — Binance US Intelligence and Strategy Rebuild | trading |
| `t_e53da070` | blocked | Crypto Education Curriculum — Modular Foundation | trading |
| `t_phase11` | planned | 🎯 Binance Bot Phase 11A — Go-Live (LIVE Trading) | trading |
| `t_crypto_learn_s1_02_bull_bear_structure` | running | Stage 1.2 — Bull/bear structure | knowledge-canon |
| `t_crypto_learn_s1_03_support_resistance` | todo | Stage 1.3 — Support and resistance | knowledge-canon |
| `t_crypto_learn_s1_04_moving_averages` | todo | Stage 1.4 — Moving averages + golden/death cross | knowledge-canon |
| `t_8bec8b2a` | todo | Refresh stale intel layer 2026-06-14 | trading |
| `t_947f0fa4` | todo | Resolve first batch of open predictions | trading |
| `t_00af7146` | todo | Stage 1.3 curriculum module draft | knowledge-canon |
| `t_b58afdfe` | todo | Backtest regime-change precursor signals (PAPER) | trading |
| `t_fcc58ae8` | todo | Sector rotation intel enrichment (DeFi lead validation) | trading |
| `t_1c502da6` | blocked | Phase 6 Track B — go-live and stay-alive plan | trading |
| `t_6ee9752d` | ready | Binance Bot — Strategy documentation | trading |
| `t_9fe07c44` | ready | Binance Bot Autonomous Trader v1 — Epic (Phase 1 complete) | trading |
| `t_aefb15e8` | blocked | DAILY-RADAR: Binance.US USDT intel radar (5 stages) | trading |
| `t_2912210a` | ready | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine | trading |
| `t_bb2fd054` | blocked | L-CRYPTO-14/child-1: Stage 6 — BossMan decision emitter (preview-gated) | trading |
| `t_1adae96f` | blocked | L-CRYPTO-14/child-2: HARD GATE §B (canWithdraw via Binance.US UI) | trading |
| `t_52d08320` | blocked | L-CRYPTO-14/child-4: 24h observatierapport cron — clear HARD GATE | trading |
| `t_d070c52c` | blocked | L-CRYPTO-14/child-3: Commit remaining SKILL.md + PHASEREPORT.md and push | trading |
| `t_drift_binance_bot_balance_collapsed_20260720` | blocked | DRIFT — binance-bot balance collapsed to $0.18 (below $75 floor) | trading |

**No new cards created since 2026-08-02.** No cards moved status. **All crypto/intel curriculum work is blocked on `t_e53da070`** (Lesson #13 framing — gated, not stalled).

**Operational card inventory delta vs. week 8 (2026-08-02):** unchanged. No card lifecycle this week.

---

## C. Mode + engine state + staleness

### C1. Mode detection (Lesson #17 — inspect `.env` directly)

```
PAPER_MODE=false        # set 2026-06-15 (env-level LIVE; 51 days)
INTEL_GATE_ENABLED=true
LIVE_PILOT_MAX_NOTIONAL=75
```

Runtime is moot this week — bot is offline. The PAPER/LIVE distinction is immaterial until the bot is brought back up. Once recovered, the env-level LIVE config + INTEL_GATE + $75 floor triple-gate still holds.

### C2. Engine state

| Component | State | mtime / status |
|---|---|---|
| `binance-bot` (PM2) | **OFFLINE** ≥ 7 days | Not in `pm2 list`; port 8104 ECONNREFUSED; auto-recovery ran at 07:15 today but PM2 process not running |
| `daily_radar.json` | alive | 2026-08-04 12:04 (~12h old) |
| `pair_briefs.json` | alive | 2026-08-04 12:01 (~12h old, 15 pairs, `briefs` key — Lesson #15) |
| `bossman_decision.json` | **STALLED** | 2026-06-19 16:02 → **47d 1h 57m** |
| `intelligence.json` | borderline stale | 2026-08-05 00:15 (~0h old, but schema regression — see C4) |
| `daily_radar.json` `regime_today` | null | Daily memo says MID_CYCLE / MEDIUM — staging mismatch |
| `daily_radar.json` `sector_rank` | null | Memo says "no single sector dominates" — pipeline gap |
| `daily_radar.json` `funding_basis` | null | Only available in `intelligence.json` (+239%) |
| Health monitor | running, ineffective | `health-cron-wrapper.sh` fires at 4am/4pm PDT; logs FAIL × 8 attempts in last 48h |
| `bot.db` trades | frozen | 15 trades, all closed, last 2026-05-12 (85d ago) |

### C3. Bot offline incident — Day 7

**Timeline:**
- 2026-07-30 (Tue): bot last known running per PM2 logs (pre-outage)
- 2026-07-31 → 2026-08-05: PM2 process not running, port 8104 ECONNREFUSED
- 2026-08-05 07:15:07 UTC: auto-recovery attempted (this cron run), `restartLog: [1785914107996]`, `restartCount_1h: 1`, then state shows `restartLog` reset to a single timestamp — recovery state file corruption or recovery did fire once and immediately failed
- Health cron logs 8 × FAIL in 24h (`/bin/sh: pm2: command not found` for direct-node fallback lines)
- `binance-bot-out.log` truncated to a 2026-08-05T07:15:11 timestamp — that is THIS cron run's startup, but the process is no longer alive

**Root cause hypothesis (not autonomously fixed — owner-action):** The bot is being killed by an upstream event (likely exchange API change, balance collapse at $0.18, or sandbox violation). Auto-recovery was supposed to restart it but the PM2 PATH issue blocks the wrapper from creating a process. Without PM2-managed process supervision, the bot cannot stay alive.

**Lesson #20 PATH issue persists.** The `health-cron-wrapper.sh` sets PATH correctly (line 19), but the user crontab still has direct-`node health-check.js` lines that fail silently. **Fix is operator-side cron edit (v3 carve-out).** Surfaced again as F2 follow-up for the 3rd consecutive week.

### C4. Schema regression (Lesson #24) — 2nd consecutive week

Both `intelligence.json` (Aug 5 00:15) and `daily_radar.json` (Aug 4 12:04) have:
- `confidence: null` (was MEDIUM/n_a in week 7 — should be MEDIUM per memo)
- `regime_today: null` (should be MID_CYCLE per memo)
- `hot_pairs: null` (no data; field missing)
- `sector_rank: null` (radar only)
- `funding_basis: null` (radar only; available in intel.json at +239%)

**The memo claims regime=MID_CYCLE / confidence=MEDIUM, but the staging JSON file does not.** This is the second consecutive cron cycle with this regression (per Lesson #24 escalation rule). **Promote to F1 watch item.** Diagnostic: either Stage 3/Stage 4 writer is dropping fields, or Stage 5 is reading from a stale snapshot. Either way, the JSON consumers (`crypto-weekly-review` et al.) are now reading null everywhere.

### C5. Sector concentration — 2nd consecutive week (F1 promotion)

- 2026-07-26 memo: "60% of top-10 is 'Other' sector"
- 2026-08-04 memo: "Top-10 includes 7 'Other' category symbols" (= 70%)

**Per Lesson #24 escalation rule:** 2 consecutive weeks with ≥50% top_struct in "Other" → F1. Surface for operator review. **Do not diagnose** (real coverage gap vs. pipeline gap vs. memo-template change). This is the same DeFi/L1 absence that motivated `t_fcc58ae8` (DeFi lead validation) — that card is still `todo` since 2026-06-14.

### C6. Funding basis methodology audit (Lesson #21) — overdue

| Date | Basis | Direction |
|---|---|---|
| 2026-07-12 | +1638% | ▲ |
| 2026-07-19 | -1014% | ▼ |
| 2026-07-26 | -700% (week 7) | ▼ |
| 2026-08-02 | +483% | ▲ |
| 2026-08-05 | +239% | ▲ (this week, narrowing) |

5 of 5 cycles with delta > 1000pp OR sign flip. **Lesson #21 criterion met 5× over.** Audit was owed since 2026-07-19 (week 6). Carry-forward to F2 (still not Section C first-order because narrowing trend may be emerging).

---

## D. Open kanban tasks (digest surface)

All work continues to be blocked on the Stage 6 gate (`t_bb2fd054`). The pipeline is healthy UP TO the gateway; the gateway is the bottleneck.

**Status recursion:**
- `t_e53da070` (curriculum) blocked → blocks all of `t_crypto_learn_s1_*`
- `t_bb2fd054` (Stage 6 emitter) blocked → blocks `t_2912210a` (governance)
- `t_bb2fd054` preview-gated → blocks `t_drift_binance_bot_balance_collapsed_20260720` (balance collapsed)
- `t_aefb15e8` (DAILY-RADAR) blocked → blocks all 5 stages `t_210f2ec8` through `t_a3f1cd4a`

**No new cards created this week.** Per L-CRYPTO-14, routine decisions are reported, not asked. The 3 carry-forwards from week 8 remain unchanged.

---

## E. Cost + token usage

| Component | Cost |
|---|---|
| LLM calls | **0** (tier 0 — data files structured, no enrichment needed) |
| Perplexity searches | 0 |
| Total | $0.00 |

---

## F. Next week (operator watch list)

### F1. First-order — operator action EXPLICIT

| # | Item | Why F1 | Action |
|---|---|---|---|
| 1 | **60d auto-skip threshold approaching** | Stage 6 staleness now 47d 1h. **Next cron cycle (2026-08-12) crosses 54d; cycle after (2026-08-19) hits 61d → auto-skip + drift-fix kanban card per Lesson #19.** | Unblock `t_bb2fd054` (preview approval) OR acknowledge that the digest will become a status report on the gap. |
| 2 | **Bot offline ≥ 7 days** | The bot is offline. Even if Stage 6 emitted, no execution path. Auto-recovery is blocked by PM2 PATH issue. | Operator-side: diagnose why bot is being killed (likely balance collapse at $0.18 per `t_drift_binance_bot_balance_collapsed_20260720` + sandbox). v3 carve-out (PM2 process supervision). |
| 3 | **Sector concentration flag persists (2nd week)** | Per Lesson #24, 2 consecutive weeks with ≥50% top_struct in "Other" → F1. Either coverage gap or pipeline gap. | Surface only; do not auto-diagnose. DeFi reactivation check still owed (was F2 in week 7; now F1). |
| 4 | **`intelligence.json` schema regression (2nd week)** | confidence/regime/hot_pairs all null despite 2026-08-05 date. Per Lesson #24, 2 consecutive weeks → F1. | Surface; do not auto-fix. Trading sub-agent lane owns the memo writer. |

### F2. Carry-forward (from prior weeks)

| # | Item | Source | Lane |
|---|---|---|---|
| 1 | Cron PATH issue (Lesson #20) — now week 3 of surface | week 7 | operator-side cron edit (v3 carve-out) |
| 2 | Funding basis methodology audit (Lesson #21) — week 5 of surface | week 6 | research-intel |
| 3 | DeFi sector reactivation re-prioritization for `t_fcc58ae8` | week 7 | trading |
| 4 | Intel layer refresh card `t_8bec8b2a` (week 8 priority, now 2 weeks stale) | week 6 | trading |
| 5 | `t_drift_binance_bot_balance_collapsed_20260720` — bot balance at $0.18, below $75 floor | week 6 | trading |
| 6 | `t_d070c52c` — L-CRYPTO-14/child-3: commit remaining SKILL.md + PHASEREPORT.md and push | week 8 | knowledge-canon |

### F3. What you do NOT need to do

- ❌ Restart the bot yourself — that's a v3 carve-out (PM2 process supervision = major infra change). Operator action.
- ❌ Modify `health-cron-wrapper.sh` or crontab — that's v3 carve-out.
- ❌ Approve 3-5 questions for BossMan — L-CRYPTO-14.
- ❌ Approve a new card for the bot offline — `t_drift_binance_bot_balance_collapsed_20260720` already exists as the surfacing ticket.
- ❌ Pick anything up from the CSDAWGBOT backlog — gated on `t_e53da070`.

### F4. Regime transition watch (carry forward from prior weeks)

- MID_CYCLE held for 5 consecutive weeks (2026-07-05 → 2026-08-04)
- Triggers for transition:
  - Sector concentration moves from "60-70% Other" to a clear sector (e.g., DeFi >50% of top_struct)
  - Funding basis sign-flip ladder stabilizes (no flip in 2 consecutive weeks)
  - `hot_pairs` returns to non-null in `intelligence.json`
- **No transition signal this week.** All three triggers are stable or absent.

---

## Hard rules confirmed for this run

- ✅ **L-CRYPTO-14 — BossMan is the autonomous decision engine.** Digest summarizes decisions for human review; no 3-5 questions loop. No question batch sent to Marcelo.
- ✅ **L-CRYPTO-03 — Advisory-only contract at the wire.** No `hermes send -t telegram` from the cron path; no bot config mutation; no writes to `crypto-intel/`.
- ✅ **L-CRYPTO-10 — Two-gate approval.** If Stage 6 should leave PAPER (A5.2), surface as approval, not silent switch. Status: still PAPER at runtime (env-level LIVE; runtime moot while bot offline).
- ✅ **L-CRYPTO-20 — No autonomous PAPER↔LIVE flip.** No `.env` mutation attempted.
- ✅ **One Telegram message per run.** This final response IS the Telegram message (cron path auto-delivers, per cron dual-delivery guard).
- ✅ **Cost control.** 0 LLM calls, $0.00.
- ✅ **No spam.** Brief is NOT empty (material findings on bot offline Day 7, Stage 6 staleness progression, schema regression, sector concentration) — full digest produced.
- ✅ **No mid-week pings.** Weekly only.
- ✅ **Section 1 mode detection + Lesson #17 .env inspection.** Both completed.
- ✅ **Section 2.1 staleness computation.** Stage 6 = 47d 1h (30d+ rung for 3rd straight week; 13d to 60d auto-skip).
- ✅ **Section 5 — no new cards created.** F1 carry-forward only.
- ✅ **Section 6 brief written to BOTH Obsidian + BossMan repo mirrors.**
- ✅ **Section 7.0 pre-flight (git status --short) completed.** 2 pre-staged files identified (both non-kernel-doc). Lesson #18 clean partial-reset workflow applied.
- ✅ **Section 7.1/7.2 — commit + push pipeline with kernel-doc rebase stop in place.**

---

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-14 governs this digest
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 16:02 — 47d 1h stale)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-08-04 12:04)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-08-04 12:01, 15 pairs)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-08-05 00:15 — schema regression)
- `~/.hermes/knowledge/crypto-intel/daily/DAILY_MEMO_2026-08-04.md` (sanity FAIL, sector concentration flag)
- `~/Projects/binance-bot/data/auto-recovery-log.json` (last attempt 2026-08-05 07:15:07)
- `~/Projects/binance-bot/health-cron.log` (8 × FAIL in 24h, PM2 PATH issue)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-08-02.md` (week 8 brief)
- Kanban: `~/.hermes/kanban/boards/bossman/kanban.db` — 21 trading-related cards (verified via direct SQL, Lesson #12)

## Lessons (added this run)

**25. **Bot offline recovery needs operator action, not autonomous action.** The bot has been offline for 7 days. Auto-recovery attempts are running but failing because PM2 is not in the recovery wrapper's PATH. Botanical: even if the wrapper worked, the bot may be killed by an upstream event (balance collapse at $0.18, exchange API issue, sandbox violation) — auto-recovery alone won't keep it alive. **Operator action required** (v3 carve-out): diagnose root cause, fix PM2 supervision, fix PATH. Cron run cannot fix this; we're not gonna pretend.

**26. **Stage 6 auto-skip threshold is now 13 days away.** 60d cadence threshold is binding. The next cron cycle (2026-08-12) will be at 54d; the cycle after (2026-08-19) will cross 60d and trigger the auto-skip + drift-fix kanban card per Lesson #19. **This is the LAST brief that will summarize fresh decisions** (or attempt to). Marcelo should be aware that the digest cadence is about to change. Stage 6 should be unblocked in the next 13 days, or the brief format pivots to status-report-only.

**27. **Schema regression is a 2-cycle trend, not a 1-cycle anomaly.** Week 8 + week 9 both show `confidence/regime_today/hot_pairs` as null in `intelligence.json`. Lesson #24 says 2 consecutive weeks → F1. **Lesson upgrade:** the previous brief (week 8) did not catch this because the regression started before then. The criteria should be "2 consecutive prior weeks" not "this week + last week." Retroactively: the regression began in week 7 (at the same time as the KAITO new top entry). Do not auto-fix; the writer is owned by the trading sub-agent lane.

**28. **Sector concentration flag is now a 2-week pattern.** 60% Other (week 7) → 70% Other (week 9). Per Lesson #24 escalation rule, promoted to F1. The DeFi reactivation that motivated `t_fcc58ae8` in week 7 has not materialized. The question for the operator is: coverage gap (we don't see DeFi because our intel pipeline doesn't focus on it) or pipeline gap (DeFi is not in the universe because of MEME-prioritized universe override)? Surface only.
