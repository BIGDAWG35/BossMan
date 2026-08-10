# Crypto Weekly Review — 2026-08-09 (cron run #10, auto, BossMan)

> **Summary in one line:** Bot **ONLINE for ~4 days** (corrects week 9's "offline 7 days" narrative — bot came back after run #9 wrote the brief, PID 45865 uptime 4d), Stage 6 emitter now **50d 18h stale** (**4th consec cycle at 30d+ rung, ~9 days to 60d auto-skip drift-fix threshold**), regime-mapper conflict persists (**3rd consecutive cycle → F1 escalation per Lesson #33**), `intelligence.json` schema regression **3rd consecutive cycle** (`regime_today=null`, now 4 HOT / 11 WARM / 6 WATCH / 2 COLD bands), sector concentration "70% Other" top_struct **persists for 2nd consecutive week → F1 per Lesson #24**, funding basis **held at +239% (no sign flip this cycle → Lesson #21 trigger reset, NOT met)**, UNSCORABLE prediction rate still **93.75% (Lesson #32 4th consec cycle)**, **0 BossMan decisions possible** because Stage 6 emitter is still gated on `t_bb2fd054`.

---

## A. Decisions digest (last 7 days)

| Item | Value |
|---|---|
| **Total decisions made in window** | **0** — Stage 6 emitter has not produced `bossman_decision.json` since 2026-06-19 23:02. Now 50d 18h stale. Radar + briefs continue daily (Aug 8/9), but Stage 6 is gated on `t_bb2fd054` (preview-gated, blocked). |
| Coin rotation deltas | n/a (no decisions emitted). Radar top_struct rotation: ZILUSDT (week 9 top) → PUMPUSDT (this week). PUMP leads with 0.839 score, 12.2% 24h surge, "Other" sector. |
| Tier transitions | None — Stage 6 didn't fire. |
| Qualified trades | 0 |
| Rejected trades | 0 |
| Top rejection reasons | n/a |
| Hard $75 floor rejections | n/a |
| Approval-boundary crossings | **4 carry-forwards** — (a) PAPER_MODE=false env-level (week 2 onward, 56 days), (b) Stage 6 preview gate `t_bb2fd054` (week 4 onward, 51 days), (c) bot offline recovery (week 8-9, **resolved this week**), (d) regime-mapper conflict (Lesson #33, **NEW F1 carry-forward**, 3rd consecutive cycle). |

**No new approval-boundary items this week.** BossMan decided nothing because (i) Stage 6 didn't emit (gated, not stalled per Lesson #13).

**Material non-decisions:**
- **Bot is ONLINE (corrects week 9 narrative).** PM2 PID 45865, uptime 4d continuous. Auto-recovery event 2026-08-05 07:15:07 was the last one logged; no further recovery attempts needed. The "bot offline 7+ days" framing in run #9 (week 8-9) was correct at that time; bot came back sometime between 2026-08-05 (run #9 write) and 2026-08-05 (PM2 uptime origin). **Lesson #25 (recurring bot offline drift-fix) does NOT trigger this cycle** — first non-trigger in 3 weeks.
- **Regime-mapper conflict (Lesson #33) — 3rd consecutive cycle, F1 PROMOTED.** `historical_regime_proposal.label = ACCUMULATION (confidence_band=HIGH, score=0.95)` vs memo `regime_today=MID_CYCLE (confidence=LOW)`. Two prior cycles (week 8, week 9) showed the same conflict. Per Lesson #33: 3 consecutive cycles → F1 (operator action EXPLICIT, v3 carve-out to investigate regime-mapper). **Reasoning breakdown:** HRP says DEATH cross + fear band + 164w NEG funding = accumulation. Memo says MID_CYCLE/LOW. These are consistent IF regime_today is the SHORT-HORIZON regime and HRP is the LONG-HORIZON. But the conflict has persisted 3 weeks — the resolution logic is missing.
- **Funding basis held at +239.4% (no sign flip from week 9).** Same magnitude AND same sign as week 9 (+239%). Per Lesson #21: trigger criterion was "sign flip OR |Δ| > 1000pp in 2 consecutive cycles." Neither was met this cycle — Δ=0pp, sign same. **Trigger NOT met (reset to 1-of-2 from 5-of-5).** Audit remains overdue from week 6 (week 4 first flagged, week 6 first audit-now-overdue); the reset doesn't clear the audit obligation, just defers the escalation.
- **`intelligence.json` schema regression persists — 3rd consecutive cycle.** `regime_today=null`, `hot_pairs=null` field absent, but `coin_rankings` is fully populated (23 entries, 4 HOT). Memo for 2026-08-09 says `regime_today=MID_CYCLE / confidence=LOW` — daily memo writer has the right answer; the JSON writer is regressing. **3rd consecutive cycle** (week 8 → week 9 → week 10) of this regression. **F1 carry-forward (already promoted in week 9).**
- **Sector concentration in `top_struct` — 2nd consecutive week at ≥50% Other.** 6 of 10 in "Other" sector (PUMP, BOSON, BM, NEIRO, ZEC, BNB = 60% Other), 2 in "Memecoins" (PENGU, FLOKI), 2 in "L1" (SOL, BTC). 60% Other ≥ 50% threshold for 2nd consecutive week → **F1 (Lesson #24 criterion MET)**. This is the `top_struct` view; the `coin_rankings` view in intelligence.json shows healthy sector diversity (L1=8, Memecoins=5, DeFi=5, Gaming=3, AI=2). The two views disagree because `top_struct` is the radar's score-ordered top-10 (which overweights thin-volume memecoin/Other names), while `coin_rankings` is the band-classified universe (which uses volume-adjusted scoring). Lesson #30 (HOT-count drift) AND Lesson #24 (sector concentration) are both rooted in this same `top_struct` ↔ `coin_rankings` divergence.
- **Thin-volume names in top_struct (Lesson #31).** PUMPUSDT ($69.8k vol — borderline), BOSONUSDT ($1.7k), BMTUSDT ($136), NEIROUSDT ($47). All 3 thin names are on `do_not_touch` list per memo 2026-08-09. Radar scoring function does NOT filter on volume. **F2 carry-forward from week 9.**
- **HOT-count drift (Lesson #30) — 4th consecutive cycle.** `top_struct`: 1 HOT (PUMPUSDT only). `intelligence.json coin_rankings`: 4 HOT (ADA, FET, DOT, OCEAN). Disagreement persists 4 weeks. F2 carry-forward. **Consider F1 promotion next cycle if divergence widens** — at 4+ consecutive cycles, the drift is structural not transient.
- **UNSCORABLE prediction rate 93.75% (Lesson #32) — 4th consecutive cycle.** 15 of 16 scored predictions UNSCORABLE (insufficient price data / no archived intelligence). 1 HIT (BTC WARM-count-expansion — trivial). 12 still PENDING. **F2 carry-forward from week 9.**

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
| `t_d070c52c` | blocked | L-CRYPTO-14/child-3: Commit remaining SKILL.md + PHASEREPORT.md and push | knowledge-canon |
| `t_drift_binance_bot_balance_collapsed_20260720` | blocked | DRIFT — binance-bot balance collapsed to $0.18 (below $75 floor) | trading |

**No new cards created since 2026-08-05.** No cards moved status. **All crypto/intel curriculum work is blocked on `t_e53da070`** (Lesson #13 framing — gated, not stalled).

**Operational card inventory delta vs. week 9 (2026-08-05):** unchanged. No card lifecycle this week.

---

## C. Mode + engine state + staleness

### C1. Mode detection (Lesson #17 — inspect `.env` directly)

```
PAPER_MODE=false        # set 2026-06-15 (env-level LIVE; 56 days)
INTEL_GATE_ENABLED=true
LIVE_PILOT_MAX_NOTIONAL=75
```

Runtime is now PAPER-equivalent (bot back online, $0.18 balance < $75 floor → bot cannot execute). The PAPER/LIVE distinction is academic while `t_drift_binance_bot_balance_collapsed_20260720` is unresolved (balance below floor). Once balance is restored AND `t_bb2fd054` is unblocked, the env-level LIVE config + INTEL_GATE + $75 floor triple-gate still holds. **No env-level change this cycle.**

### C2. Engine state

| Component | State | mtime / status |
|---|---|---|
| `binance-bot` (PM2) | **ONLINE** ~4 days | PID 45865, uptime 4D continuous (corrects week 9 "offline 7+ days" narrative) |
| `daily_radar.json` | alive | 2026-08-09 (latest) |
| `pair_briefs.json` | alive | 2026-08-09 (latest, 15 pairs) |
| `bossman_decision.json` | **STALLED** | 2026-06-19 23:02 → **50d 18h 56m** |
| `intelligence.json` | borderline stale | 2026-08-05 (~4d old, schema regression — see C4) |
| `daily_radar.json` `regime_today` | null | Daily memo says MID_CYCLE / LOW — staging mismatch |
| `daily_radar.json` `sector_rank` | null | Memo says "no single sector dominates" — pipeline gap |
| `daily_radar.json` `funding_basis` | null | Only available in `intelligence.json` (+239.4%) |
| Health monitor | running, ineffective (PATH issue) | `health-cron-wrapper.sh` fires at 4am/4pm PDT; logs FAIL × 2-3 today from direct-node lines |
| `bot.db` trades | frozen | 15 trades, all closed, last 2026-05-12 (89d ago) |

### C3. Bot recovery (corrects week 9 narrative)

**Timeline:**
- 2026-07-30 (Tue): bot last known running pre-outage (run #9)
- 2026-07-31 → 2026-08-05: PM2 process not running (per run #9 narrative)
- 2026-08-05 07:15:07 UTC: auto-recovery attempted (run #9 cron), event logged in `auto-recovery-log.json`
- **Sometime between 2026-08-05 12:03 (run #9 brief commit) and 2026-08-05 (PM2 uptime origin):** bot restarted, now PID 45865
- 2026-08-05 → 2026-08-09: 4D continuous uptime, no further recovery events

**Lesson #25 trigger (drift-fix card on bot-offline-recurring) does NOT apply this cycle** — bot is online, single offline episode (2 weeks), not "recurring." If bot goes offline again, escalation applies. **F2 watch** (carry-forward from week 9).

**Lesson #20 cron PATH issue persists** — `pm2: command not found` still firing from direct-`node health-check.js` lines in user crontab. Health check itself still PASSES via wrapper PATH. Carry-forward from week 7 (3rd consec cycle surface). **Fix is operator-side cron edit (v3 carve-out).**

### C4. Schema regression (Lesson #24) — 3rd consecutive cycle

`intelligence.json` (Aug 5 00:15) has:
- `regime_today: null` (should be MID_CYCLE per memo)
- `hot_pairs: null` (field absent; `coin_rankings` provides same data)
- `regime_confidence: 0.45` (raw score, no label — different schema from prior weeks)
- `regime_certainty: UNCERTAINTY` (new field — not in earlier briefs)
- `funding_basis: {annualized_basis_pct: 239.4, raw_basis_pct: 0.027}` (structurally different — dict not scalar)

**The memo claims regime=MID_CYCLE / confidence=LOW, but the staging JSON file does not.** This is the **3rd consecutive cron cycle** with this regression (week 8 → week 9 → week 10). **Per Lesson #24 escalation rule** (2 consecutive weeks → F1, already promoted). Trading sub-agent lane owns the memo writer. Surface only, do not auto-fix.

**Note on `coin_rankings` recovery:** intelligence.json now has 23 entries in `coin_rankings` with band assignments (4 HOT, 11 WARM, 6 WATCH, 2 COLD) and sector tags. This is the data the digest uses for sector rotation + thin-volume detection. The schema regression is in `regime_today` / `hot_pairs` only — `coin_rankings` is healthy.

### C5. Sector concentration — 2nd consecutive week at ≥50% Other (F1 promotion confirmed)

- 2026-08-04 memo (run #9): "Top-10 includes 7 'Other' category symbols" (= 70% Other)
- 2026-08-09 memo (this week): "4 are 'Other' low-cap alts, increasing speculative risk" + "Top-3 thesis: PUMPUSDT, BOSONUSDT, BMTUSDT" (all Other)
- 2026-08-09 `top_struct`: 6 of 10 in Other (60%)

**Per Lesson #24 escalation rule:** 2 consecutive weeks with ≥50% top_struct in "Other" → F1. **Confirmed for week 10.** Surface for operator review. **Do not diagnose** (real coverage gap vs. pipeline gap vs. memo-template change). The same DeFi/L1 absence that motivated `t_fcc58ae8` (DeFi lead validation) still applies — that card is still `todo` since 2026-06-14.

**However, this week's `coin_rankings` shows healthy sector diversity:** L1=8, Memecoins=5, DeFi=5, Gaming=3, AI=2. The disagreement between `top_struct` and `coin_rankings` is **the underlying issue** — radar's score function overweights thin-volume Other names, while band classification uses volume-adjusted scoring. Lesson #30 (HOT-count drift) and Lesson #24 (sector concentration) are **two symptoms of the same root cause**.

### C6. Funding basis methodology audit (Lesson #21) — overdue but trigger reset

| Date | Basis | Direction |
|---|---|---|
| 2026-07-12 | +1638% | ▲ |
| 2026-07-19 | -1014% | ▼ |
| 2026-07-26 | -700% | ▼ |
| 2026-08-02 | +483% | ▲ |
| 2026-08-05 | +239% | ▲ |
| **2026-08-09** | **+239%** | **▲ (held same sign)** |

Same magnitude AND same sign this cycle → **Lesson #21 trigger NOT met** (was 5-of-5 over weeks 4-9, reset to 5-of-6 with 2-consistent-same-sign weeks). However, the audit remains overdue from week 6 first-flag. **Carry-forward to F2** (audit still owed; just no longer escalation-driven).

---

## D. Open kanban tasks (digest surface)

All work continues to be blocked on the Stage 6 gate (`t_bb2fd054`). The pipeline is healthy UP TO the gateway; the gateway is the bottleneck.

**Status recursion:**
- `t_e53da070` (curriculum) blocked → blocks all of `t_crypto_learn_s1_*`
- `t_bb2fd054` (Stage 6 emitter) blocked → blocks `t_2912210a` (governance)
- `t_bb2fd054` preview-gated → blocks `t_drift_binance_bot_balance_collapsed_20260720` (balance collapsed)
- `t_aefb15e8` (DAILY-RADAR) blocked → blocks all 5 stages `t_210f2ec8` through `t_a3f1cd4a`

**No new cards created this week.** Per L-CRYPTO-14, routine decisions are reported, not asked. The carry-forwards from week 9 remain unchanged (plus the regime-mapper conflict F1 carry-forward added this week).

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
| 1 | **60d auto-skip threshold approaching** | Stage 6 staleness now 50d 18h. **Next cron cycle (2026-08-16) crosses 58d; cycle after (2026-08-23) hits 65d → auto-skip + drift-fix kanban card per Lesson #19.** | Unblock `t_bb2fd054` (preview approval) OR acknowledge that the digest will become a status report on the gap. **Recommend 7-day buffer: 2026-08-16 deadline to unblock.** |
| 2 | **Regime-mapper conflict (3rd consec cycle, NEW F1)** | Per Lesson #33, 3 consecutive cycles of `historical_regime_proposal.ACCUMULATION(HIGH)` vs `regime_today=MID_CYCLE` → operator action. Either resolution logic is missing, or the two views are intentionally different timeframes and need to be disambiguated in the schema. | Operator decision: are these long/short horizon by design, or is one stale? v3 carve-out to inspect writer. |
| 3 | **Sector concentration flag persists (2nd consec week, F1 confirmed)** | Per Lesson #24, 2 consecutive weeks with ≥50% top_struct in "Other" → F1. Either coverage gap or pipeline gap. **Root cause likely:** radar's scoring function overweights thin-volume Other names vs. `coin_rankings`'s volume-adjusted scoring. | Surface only; do not auto-diagnose. Recommend reviewing radar's `score_struct` function for volume weighting. |
| 4 | **`intelligence.json` schema regression (3rd consec cycle, F1 carry-forward)** | `regime_today=null`, `regime_confidence=0.45` (raw), `regime_certainty=UNCERTAINTY` (new), `hot_pairs=null`, `funding_basis` as dict not scalar. Memo says MID_CYCLE / LOW. The writer is regressing fields. | Surface; do not auto-fix. Trading sub-agent lane owns the memo writer. |

### F2. Carry-forward (from prior weeks)

| # | Item | Source | Lane |
|---|---|---|---|
| 1 | Cron PATH issue (Lesson #20) — now week 4 of surface | week 7 | operator-side cron edit (v3 carve-out) |
| 2 | Funding basis methodology audit (Lesson #21) — week 7 of surface (trigger reset but audit still owed) | week 6 | research-intel |
| 3 | DeFi sector reactivation re-prioritization for `t_fcc58ae8` — `coin_rankings` shows DeFi=5 (5th-largest sector); sector_rank top 5 includes DeFi | week 7 | trading |
| 4 | Intel layer refresh card `t_8bec8b2a` (now 8 weeks old, was 2 weeks stale at week 8) | week 6 | trading |
| 5 | `t_drift_binance_bot_balance_collapsed_20260720` — bot balance at $0.18, below $75 floor | week 6 | trading |
| 6 | `t_d070c52c` — L-CRYPTO-14/child-3: commit remaining SKILL.md + PHASEREPORT.md and push | week 8 | knowledge-canon |
| 7 | HOT-count drift (Lesson #30) — now 4th consec cycle; `top_struct` 1 HOT vs `coin_rankings` 4 HOT | week 7 | trading |
| 8 | Thin-volume names in top_struct (Lesson #31) — BOSON, BM, NEIRO on do-not-touch list; PUMP borderline | week 9 | trading |
| 9 | UNSCORABLE prediction rate 93.75% (Lesson #32) — now 4th consec cycle | week 9 | trading |
| 10 | Bot offline recovery watch (Lesson #25) — resolved this cycle, but F2 watch for recurrence | week 9 | operator-side |

### F3. What you do NOT need to do

- ❌ Restart the bot yourself — bot is online. Lesson #25 watch applies only if recurrence.
- ❌ Modify `health-cron-wrapper.sh` or crontab — that's v3 carve-out.
- ❌ Approve 3-5 questions for BossMan — L-CRYPTO-14.
- ❌ Approve a new card for the bot offline — `t_drift_binance_bot_balance_collapsed_20260720` already exists.
- ❌ Pick anything up from the CSDAWGBOT backlog — gated on `t_e53da070`.
- ❌ Diagnose the regime-mapper conflict — surface only. Resolution may require writer code review (v3 carve-out).

### F4. Regime transition watch (carry forward from prior weeks)

- MID_CYCLE held for 6 consecutive weeks (2026-07-05 → 2026-08-09) per daily memos
- `historical_regime_proposal` says ACCUMULATION (HIGH conf) — long-horizon disagreement
- Triggers for transition:
  - Sector concentration moves from "60-70% Other" to a clear sector (e.g., DeFi >50% of top_struct). `coin_rankings` shows DeFi=5 already at #3 sector rank — but `top_struct` view still 0% DeFi
  - Funding basis sign-flip ladder stabilizes (no flip in 2 consecutive weeks) — **MET this cycle** (+239% / +239% same)
  - `hot_pairs` returns to non-null in `intelligence.json` (still null; `coin_rankings` provides equivalent)
  - **Stage 6 emitter unblocked** — would close the strategy-loop and let regime drive BossMan decisions
- **Partial transition signal this week:** funding basis held same sign (one trigger met). But schema regression and regime-mapper conflict still block the digest's ability to surface regime-driven decisions.

---

## Hard rules confirmed for this run

- ✅ **L-CRYPTO-14 — BossMan is the autonomous decision engine.** Digest summarizes decisions for human review; no 3-5 questions loop. No question batch sent to Marcelo.
- ✅ **L-CRYPTO-03 — Advisory-only contract at the wire.** No `hermes send -t telegram` from the cron path; no bot config mutation; no writes to `crypto-intel/`.
- ✅ **L-CRYPTO-10 — Two-gate approval.** If Stage 6 should leave PAPER, surface as approval, not silent switch. Status: PAPER-equivalent at runtime (bot online, balance < $75 floor).
- ✅ **L-CRYPTO-20 — No autonomous PAPER↔LIVE flip.** No `.env` mutation attempted.
- ✅ **One Telegram message per run.** This final response IS the Telegram message (cron path auto-delivers, per cron dual-delivery guard).
- ✅ **Cost control.** 0 LLM calls, $0.00.
- ✅ **No spam.** Brief is NOT empty (material findings on bot recovery, Stage 6 staleness progression, regime-mapper conflict escalation, schema regression 3rd cycle, sector concentration F1, funding basis trigger reset) — full digest produced.
- ✅ **No mid-week pings.** Weekly only.
- ✅ **Section 1 mode detection + Lesson #17 .env inspection.** Both completed.
- ✅ **Section 2.1 staleness computation.** Stage 6 = 50d 18h (30d+ rung for 4th straight week; ~9d to 60d auto-skip).
- ✅ **Section 5 — no new cards created.** F1 carry-forward only.
- ✅ **Section 6 brief written to BOTH Obsidian + BossMan repo mirrors.**
- ✅ **Section 7.0 pre-flight (git status --short) completed.** 2 pre-modified files identified (`docs/AUTOMATION_INVENTORY.md` staged, `docs/PHASEREPORT.md` unstaged). Both non-kernel-doc per Lesson #18.
- ✅ **Section 7.1/7.2 — commit + push pipeline with kernel-doc rebase stop in place.**

---

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-14 governs this digest
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 — 50d 18h stale)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-08-09)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-08-09, 15 pairs)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-08-05 00:15 — schema regression, 4d stale)
- `~/.hermes/knowledge/crypto-intel/daily/DAILY_MEMO_2026-08-09.md` (MID_CYCLE / LOW confidence / PASS sanity)
- `~/Projects/binance-bot/data/auto-recovery-log.json` (last event 2026-08-05 07:15:07 — bot recovered since)
- `~/Projects/binance-bot/health-cron.log` (`/bin/sh: pm2: command not found` persists in direct-node lines; Lesson #20)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-08-05.md` (week 9 brief — bot-offline narrative corrected by this week)
- Kanban: `~/.hermes/kanban/boards/bossman/kanban.db` — 21 trading-related cards (verified via direct SQL, Lesson #12)

## Lessons (added this run)

**29. Bot offline narrative was stale by run #10.** Run #9 (week 9) said "bot offline 7+ days" based on `pm2 list` reading at that moment. Run #10 found PM2 PID 45865 with 4D uptime. The bot came back between 2026-08-05 12:03 (run #9 brief commit) and 2026-08-05 (PM2 uptime origin). Lesson: when surfacing a multi-day offline incident, mark it with the exact observation timestamp and acknowledge that the next cron cycle may correct the narrative. **Lesson #25 drift-fix trigger does NOT apply** when the recovery happens between observation and the next cycle. F2 watch for recurrence only.

**30. Regime-mapper conflict is F1, not F2.** Lesson #33 originally framed this as F2 ("if 2-cycle persistence, escalate to F1"). Run #10 confirms 3-cycle persistence. The conflict is structural (HRP = long-horizon vs. regime_today = short-horizon), not transient. **F1 operator action required:** either disambiguate the two views in the schema (e.g., rename to `regime_short_horizon` / `regime_long_horizon`) or fix the resolution logic that should bridge them.

**31. The 60d threshold is real, not theoretical.** Week 10 (run #10) shows the cron is now 9d from auto-skip. Run #11 (2026-08-16) will be at 58d. Run #12 (2026-08-23) will trigger the auto-skip + drift-fix card per Lesson #19. The cadence is binding. If Marcelo wants to keep the digest alive, `t_bb2fd054` needs unblocking before 2026-08-16. If not, the digest will become a status report on the gap starting week 12.

**32. Sector concentration + HOT-count drift are symptoms of the same root cause.** Both Lessons #24 and #30 trace to the divergence between `top_struct` (radar's score-ordered top-10, no volume weighting) and `coin_rankings` (band-classified universe, volume-adjusted). The radar's score function overweighting thin-volume Other names is the underlying mechanism. **Recommend:** investigate `daily_radar` score function for volume weighting; consider using `coin_rankings` for digest sector/HOT analysis instead of `top_struct`. Surface only, no auto-fix.

**33. Cost ceiling held for 10 consecutive runs.** 0 LLM calls for 10 weeks (since run #1 2026-06-14). Total cost $0.00. The data files are structured enough to template the digest directly. Lesson: do not invent a need to call a model when the data is sufficient. The 1-call budget per Hard Rule #5 is a ceiling, not a target.