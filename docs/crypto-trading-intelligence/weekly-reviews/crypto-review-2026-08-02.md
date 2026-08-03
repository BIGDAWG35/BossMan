# Crypto Weekly Review — 2026-08-02 (cron run #8, auto, BossMan)

> **Summary in one line:** Bot OFFLINE ≥24h, Stage 6 emitter now 44d stale (2nd consec cycle at 30d+ rung, 16 days to 60d auto-skip), funding basis sign-flipped again (+483%, was -700% week 7 → triggers Lesson #21 audit-now-overdue criterion), radar+pipeline still alive, all 15 historical trades closed in May, **no new BossMan decisions possible because the emitter is gated**.

---

## A. Decisions digest (last 7 days)

| Item | Value |
|---|---|
| **Total decisions made in window** | **0** — Stage 6 emitter has not produced a `bossman_decision.json` since 2026-06-19 16:02. Radar+briefs continue daily (today 12:03/12:01), but Stage 6 is gated on `t_bb2fd054` (preview-gated, blocked). |
| Coin rotation deltas | n/a (no decisions emitted). Radar top_struct shows new face: XECUSDT at top_struct[0] (HOT 0.83, 79.6% 24h, "Other" sector). |
| Tier transitions | None — Stage 6 didn't fire. Radar bands stable vs week 7 (4 HOT / 6 WARM / 2 WATCH / 11+ COLD). |
| Qualified trades (count) | 0 |
| Rejected trades (count) | 0 |
| Top rejection reasons | n/a |
| Hard $75 floor rejections | n/a |
| Approval-boundary crossings | **2 carry-forwards** — (a) PAPER_MODE=false env-level confirmation (week 2 onward), (b) Stage 6 preview gate `t_bb2fd054` (week 4 onward). |

**No new approval-boundary items this week.** This section is "what BossMan decided" — and BossMan decided nothing because Stage 6 didn't emit.

**Material non-decisions:**
- Bot is OFFLINE (port 8104 ECONNREFUSED, not in PM2). Even if Stage 6 emitted, no live execution path exists. The 15 historical trades in `bot.db` are all closed (last 2026-05-12, 82 days ago).
- Funding basis sign-flipped AGAIN (+483% vs -700% last week, +1638% week 6, -1014% week 5). **Lesson #21 audit-now-overdue criterion met (2 consecutive cron cycles with sign flip).**

---

## B. CSDAWGBOT status of open cards

Read via direct SQL on `~/.hermes/kanban/boards/bossman/kanban.db` (Lesson #12 workaround — `hermes kanban show` is board-context-broken for known cards).

| Card ID | Status | Title |
|---|---|---|
| `t_e752ea85` | blocked | TRACK — Binance US Intelligence and Strategy Rebuild |
| `t_e53da070` | blocked | Crypto Education Curriculum — Modular Foundation |
| `t_crypto_learn_s1_02_bull_bear_structure` | running | Stage 1.2 — Bull/bear structure |
| `t_crypto_learn_s1_03_support_resistance` | todo | Stage 1.3 — Support and resistance |
| `t_crypto_learn_s1_04_moving_averages` | todo | Stage 1.4 — Moving averages + golden/death cross |
| `t_8bec8b2a` | todo | Refresh stale intel layer 2026-06-14 |
| `t_947f0fa4` | todo | Resolve first batch of open predictions |
| `t_00af7146` | todo | Stage 1.3 curriculum module draft |
| `t_b58afdfe` | todo | Backtest regime-change precursor signals (PAPER) |
| `t_fcc58ae8` | todo | Sector rotation intel enrichment (DeFi lead validation) |
| `t_aefb15e8` | blocked | DAILY-RADAR: Binance.US USDT intel radar (5 stages) |
| `t_2912210a` | ready | L-CRYPTO-14 governance — BossMan autonomous crypto decision engine |
| `t_bb2fd054` | blocked | Stage 6 — BossMan decision emitter (preview-gated) |
| `t_1adae96f` | blocked | L-CRYPTO-14/child-2: Verify HARD GATE §B (canWithdraw via Binance.US UI) |
| `t_52d08320` | blocked | L-CRYPTO-14/child-4: 24h observatierapport cron — clear HARD GATE |
| `t_d070c52c` | blocked | L-CRYPTO-14/child-3: Commit remaining files (SKILL.md + PHASEREPORT) and push |

**No new cards created since 2026-07-26.** No cards moved status. **All crypto/intel curriculum work is blocked on `t_e53da070`** (lesson #13 framing — gated, not stalled).

---

## C. Mode + engine state + staleness

### C1. Mode detection (Lesson #17 — inspect `.env` directly)

```
PAPER_MODE=false        # set 2026-06-15 (env-level LIVE; 48 days)
INTEL_GATE_ENABLED=true
LIVE_PILOT_MAX_NOTIONAL=75
```

API `mode` field drifts (Lesson #17). Runtime is PAPER (gated by Stage 6 + INTEL_GATE + $75 floor). This week adds a **third gate**: the bot itself is **OFFLINE** — there is no runtime to gate. The "PAPER / LIVE" distinction is moot until the bot is brought back up.

### C2. Engine state

| Component | State | mtime / status |
|---|---|---|
| `binance-bot` (PM2) | **OFFLINE** | Not in `pm2 list`; no `node` process; port 8104 ECONNREFUSED |
| `daily_radar.json` | alive | 2026-08-02 12:03 (~6h old) |
| `pair_briefs.json` | alive | 2026-08-02 12:01 (~6h old, 15 pairs) |
| `bossman_decision.json` | **STALLED** | 2026-06-19 16:02 → **44d 1h 57m** |
| `intelligence.json` | borderline stale | 2026-07-27 15:00 → **6d 2h** (under 7d soft threshold) |
| Health monitor | running, blocked | `health-cron-wrapper.sh` runs at 4am/4pm; pm2-recovery fails with `/bin/sh: pm2: command not found` |
| `bot.db` trades | frozen | 15 trades, all closed, last 2026-05-12 (82d ago) |

### C3. Bot offline incident (new this week)

**Symptom:** `curl http://localhost:8104/api/status` → HTTP 000 (ECONNREFUSED). `pm2 list` shows no binance-bot process. `ps aux | grep binance` → no matches. `health-state.json` = `{"lastErrorLine":1,"checkedAt":1785718809670}` (last check stalled at line 1).

**Root cause (Lesson #16/20):** Cron-shell PATH issue persists. The `health-cron-wrapper.sh` line 19 sets `PATH="/usr/local/bin:/usr/bin:/bin:..."` correctly, and `pm2` IS at `/usr/local/bin/pm2` (verified). The error `/bin/sh: pm2: command not found` therefore comes from **inside `health-check.js`**, which spawns `pm2 jlist` / `pm2 restart` without inheriting the wrapper's PATH. **Lesson #20's framing was incomplete** — the wrapper PATH is correct; the leak is one level deeper (JS subprocess spawn).

**Why it's still PAPER-safe:** Even if auto-recovery succeeded, INTEL_GATE + Stage 6 gating + $75 floor cap keep it in PAPER. But **a paper bot that's offline = no paper trades = no decision signal = no progress on the gated Stage 6 evaluation**.

### C4. Staleness summary (cadence ladder per Lesson #19)

| Artifact | Age | Rung |
|---|---|---|
| `bossman_decision.json` | **44d 1h 57m** | **30-60d first-order watch** (2nd consec cycle at this rung; 16d to 60d auto-skip) |
| `intelligence.json` | 6d 2h | 0-7d normal (borderline; refresh cycle nominally 7d) |
| `daily_radar.json` | 6h | fresh |
| `pair_briefs.json` | 6h | fresh |

### C5. Funding regime (Lesson #21)

| Cycle | Annualized basis | Δ vs prior |
|---|---|---|
| 2026-06-21 | -1100% | first flag |
| 2026-06-28 | -999% | +101pp |
| 2026-07-05 | -139% | +860pp |
| 2026-07-12 | +1401% | +1540pp (sign flip) |
| 2026-07-19 | +1638% | +237pp |
| 2026-07-26 | -700% | -2338pp (sign flip) |
| **2026-08-02** | **+483%** | **+1183pp (sign flip)** |

**Lesson #21 audit-now-overdue criterion MET (2 consecutive sign flips in last 2 cycles: -700 → +483).** Funding basis is unusable as a regime signal until methodology audit lands. Surfacing this in F1 (first-order watch), not just F2.

### C6. BTC + macro

- BTC: $64,772 (-0.7% WoW, was $62,052 week 7) — small bounce
- Drawdown from ATH: -48.6% (was -50.8% week 7; -2.2pp improvement)
- Death cross: 245 weeks active (was 244; +1)
- Fear & Greed: 27 (Fear, held)
- 50d vs 200d SMA: still DEATH cross, sma_50=$76,021, sma_200=$81,105 (gap closing but still inverted)

### C7. Radar top_struct sector concentration

Top 10 sectors this week: L1 (5), Other (3), DeFi (1), Memecoins (1).

- "Other" sector: 30% of top_struct (was 60% week 7 — **concentration EASED**, no flag carry-forward needed)
- L1 sector dominant (5/10 = 50%; ADA, AVAX, SOL, MATIC, DOT likely)
- DeFi: 1 in top_struct (AAVE), down from 4 HOT names week 7 — **DeFi reactivation from week 7 has decayed** (Lesson #22 re-prioritization for `t_fcc58ae8` no longer applies this cycle)
- Memecoins: 1 (SHIB; HOT 1.2 score)
- do_not_touch list: XECUSDT (thin volume, $4,816/24h)

### C8. Predictions ledger

`intelligence.json.prediction_review` (review_date 2026-07-27):
- Total tracked: 22
- Scored this week: 14
- Pending: 8
- Hits: 1 / Misses: 0 / Mixed: 0 / Unscorable: 13
- Hit rate: 100% (n=1; trivially true)
- **No real prediction accuracy signal exists yet** (week-7 framing held)

---

## D. Open kanban tasks (operator-visible)

Carry-forward from prior weeks:

| Card | Status | Why still open |
|---|---|---|
| `t_2912210a` L-CRYPTO-14 governance | ready | picker choice — Trading lane owns, not this digest |
| `t_bb2fd054` Stage 6 emitter | blocked | preview-gated, operator action required → F1 |
| `t_e53da070` curriculum parent | blocked | agent crashes x3 (carry-forward week 6) |
| `t_aefb15e8` DAILY-RADAR | blocked | parent-stage dependency (carry-forward week 4) |
| `t_1adae96f` HARD GATE §B | blocked | canWithdraw verification, operator action → F1 |
| `t_52d08320` HARD GATE observability cron | blocked | child of `t_1adae96f` |
| `t_d070c52c` commit SKILL.md + PHASEREPORT | blocked | unblock requires `t_bb2fd054` review |

**This week creates NO new cards.** Per L-CRYPTO-14, only approval-boundary items create cards; this digest has 2 carry-forward approval items already on the board.

---

## E. Cost + token usage

| Item | Value |
|---|---|
| LLM calls | **0** |
| Spend | **$0.00** |
| Input tokens (digest-relevant) | ~3,200 (radar + intel + briefs reads) — under 4k ceiling |
| Output tokens | 0 (no LLM enrichment needed) |

**0 LLM calls is correct this week** (Lesson #23/24 precedent — data files structured, digest templated directly). All synthesis done in this turn.

---

## F. Next week (F1 first-order watch / F2 follow-up)

### F1. First-order watch (operator action explicitly surfaced)

Per Lesson #23 (binding since week 7 — second consec cycle at 30d+ rung):

1. **Stage 6 staleness approaching 60d auto-skip.** `bossman_decision.json` is **44d 1h 57m stale**. 60d auto-skip is in **16 days** (cron cycle 2026-08-30 if next run is one week out, or sooner if cadence tightens). **The 60d threshold is binding.** If `t_bb2fd054` is not unblocked before 2026-08-30, the digest auto-skips (writes a `drift-fix: stage-6-emitter-stuck-Nd` kanban card instead). **Operator action required** to unblock `t_bb2fd054` (preview approval) OR extend the 60d ceiling.

2. **Bot offline incident.** binance-bot has been OFFLINE ≥24h with no auto-recovery. The root cause is one level deeper than Lesson #20 framed — `health-check.js` spawns `pm2` subprocess without inheriting the wrapper's PATH. **Operator action required** (cron / JS subprocess change = v3 carve-out). The bot being down means even a successful Stage 6 emission has no execution target. **Recommended:** kill the duplicate `node health-check.js` direct-crontab lines (lines 3-4 in user crontab), keep only the wrapper-invoking lines; AND patch `health-check.js` to spawn `pm2` with full PATH inherited.

3. **Funding basis methodology audit (Lesson #21 criterion now MET).** Sign-flipped in 2 consecutive cron cycles (-700% → +483%). Audit card overdue. **Operator action required** (decision-engine methodology change = v3 carve-out). Surfacing as F1 first-order watch this cycle (was F2 last week) because the trigger criterion is met.

### F2. Carry-forward

- `t_e53da070` curriculum parent blocked (agent crash history)
- `t_fcc58ae8` DeFi lead-validation: **DeFi reactivation from week 7 decayed** (1 in top_struct this week vs 4 HOT names last week). Re-prioritization signal from Lesson #22 no longer applies; the card's premise needs re-validation against current radar. Leave card in `todo`; do not promote.
- `t_aefb15e8` DAILY-RADAR blocked on parent stage
- `t_8bec8b2a` intel refresh — radar+briefs still fresh (today 12:01/12:03); intel is borderline stale (6d). Refresh needed if next cycle crosses 7d.

### F3. What we did NOT do (L-CRYPTO-14 enforcement)

- ❌ No question batch sent to Marcelo (L-CRYPTO-14 amendment 2026-06-19).
- ❌ No bot config mutation.
- ❌ No writes to `~/.hermes/knowledge/crypto-intel/` outside the agreed brief path.
- ❌ No PM2 / cron modification (v3 carve-out; surfaced to operator in F1/F2 instead).
- ❌ No multiple LLM providers in parallel.
- ❌ No multiple Telegram messages (single final response — cron auto-delivers).
- ❌ No new kanban cards for routine decisions (only approval-boundary items, of which there are none new this week).
- ❌ No `hermes kanban link` to goal/unification-epic (CLI rejects as cycle — embed `goal_id`/`parent_id` in body instead).
- ❌ No `hermes send -t telegram` (cron dual-delivery guard).

### F4. Regime transition watch

- MID_CYCLE held for **5 consecutive weeks** (2026-07-05 through 2026-08-02).
- `historical_regime_proposal` in `intelligence.json` suggests ACCUMULATION (score 0.95) — death cross + Fear + 164 weeks negative funding all consistent. **This is a label proposal, not a regime flip.** Radar + intelligence.json both still report MID_CYCLE.
- Funding basis sign-flip ladder does NOT constitute a regime transition signal (Lesson #21 — basis is methodology-broken, not regime-breaking).
- **No transition signal this week.** Carry-forward watch.

### F5. BossMan decision layer — open scope

- Stage 6 emitter (`t_bb2fd054`) is the single blocking item.
- No new scope added this week; no scope retired.
- L-CRYPTO-14 governance (`t_2912210a`) is `ready` — picker is the Trading sub-agent lane, not this digest.

---

## Hard rules confirmed for this run

- ✅ **L-CRYPTO-14 — BossMan is the autonomous decision engine.** Digest summarizes; no question batch.
- ✅ **L-CRYPTO-03 — Advisory-only contract at the wire.** No bot config mutation; no writes to `crypto-intel/` outside brief path.
- ✅ **L-CRYPTO-10 — Two-gate approval.** Stage 6 still PAPER at runtime; gate is `t_bb2fd054` (blocked).
- ✅ **One Telegram message per run.** Final response auto-delivers (cron path, dual-delivery guard).
- ✅ **Cost control.** 0 LLM calls, $0.00 (under ≤1-call weekly budget).
- ✅ **No spam.** Brief is NOT empty (Stage 6 44d stale, bot offline incident, funding basis criterion met) — full digest produced.
- ✅ **No mid-week pings.** Weekly only.
- ✅ **Section 1 mode detection + Lesson #17 .env inspection.** Both completed.
- ✅ **Section 2.1 staleness computation.** 6d 2h for intelligence.json (under 7d soft threshold).
- ✅ **Section 5 — no new cards created.** F1 carry-forward only.
- ✅ **Section 6 brief written to BOTH Obsidian + BossMan repo mirrors** (this file).
- ✅ **Section 7.0 pre-flight (git status --short) completed.** Pre-staged files identified; Lesson #18 kernel-doc rule applies.
- ✅ **Section 7.1/7.2 — commit + push pipeline with kernel-doc rebase stop in place.**

---

## References

- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-14 governs
- `~/Projects/binance-bot/data/bossman_decision.json` (2026-06-19 23:02 UTC — **44d 1h 57m old**)
- `~/Projects/binance-bot/data/daily_radar.json` (2026-08-02 12:03 UTC)
- `~/Projects/binance-bot/data/pair_briefs.json` (2026-08-02 12:01 UTC, 15 pairs)
- `~/Projects/binance-bot/data/bot.db` (15 trades, all closed, last 2026-05-12)
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (2026-07-27 15:00 UTC)
- `~/Projects/binance-bot/health-state.json` (stale at line 1)
- `~/Projects/binance-bot/health-cron-wrapper.sh` (PATH set line 19; `health-check.js` spawn leak is one level deeper)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-26.md` (week 7 brief — prior continuity)
- Kanban: `~/.hermes/kanban/boards/bossman/kanban.db` — 16 trading-related cards (verified via direct SQL, Lesson #12)

## Lessons (added this run)

**25. **Bot offline incident root cause is one level deeper than Lesson #20 framed.** The `health-cron-wrapper.sh` correctly sets PATH on line 19. `pm2` IS at `/usr/local/bin/pm2`. The `/bin/sh: pm2: command not found` error comes from `health-check.js` spawning `pm2` subprocess without inheriting the wrapper's PATH. The wrapper is correct; the leak is inside the Node script's `child_process.spawn` call. **For future diagnostics:** when wrapper-PATH looks right but pm2-still-not-found, the issue is at the JS layer (Node spawn doesn't auto-inherit shell PATH for absolute commands like `pm2` unless explicitly passed `env: process.env`). Surface as F2 follow-up; root-cause was previously mis-attributed to wrapper.

**26. **Stage 6 staleness is now in countdown mode (16 days to 60d auto-skip).** This is the second consecutive cycle at the 30d+ rung (week 7 was first). The cadence ladder's 60d threshold is binding, not aspirational. Per Lesson #23, operator action is F1. **The digest's primary value-add this week is the countdown**, not the decisions summary (which is 0). If the bot is still offline AND Stage 6 is still gated at 60d, the digest auto-skips and creates `drift-fix: stage-6-emitter-stuck-60d`. **Recommend operator action before 2026-08-23** (8-day buffer to allow rebase + push).

**27. **Zero new BossMan decisions this cycle — digest is now a status report on the gap, not a digest of fresh decisions.** This week's section A is "0 decisions" because Stage 6 hasn't emitted since 2026-06-19. The digest's primary content shifts from "what BossMan decided" (weeks 4-7) to "why the decision engine is silent" (this week). **Future framing:** if Stage 6 staleness exceeds 14 days, the digest's section A should explicitly note "no decisions emitted since YYYY-MM-DD" as the headline, not bury it in staleness metadata. Lesson #19's framing ladder is correct; this is its first operational use.

**28. **L1 dominance in top_struct (5/10 = 50%) is a new sector signal.** Week 7 had DeFi dominant (4 HOT), week 8 has L1 dominant (5 in top_struct). "Other" concentration EASED from 60% to 30%. Lesson #24's sector concentration rule still applies (track "Other" persistence) but the dominant-sector metric is now L1, which was not tracked previously. **Rule for next cycle:** if L1 dominance persists for 2 consecutive cycles, surface as a sector-concentration carry-forward in C4; do not diagnose (coverage gap vs pipeline gap vs memo-template change is the same Lesson #24 trap).

**29. **`historical_regime_proposal` ACCUMULATION score 0.95 conflicts with radar's MID_CYCLE label.** This is the first week the proposal label has appeared with HIGH confidence (0.95). The proposal cites death cross + Fear + 164w negative funding — all real, but the regime label is internally inconsistent with what radar/intelligence.json both call MID_CYCLE. **Do not act on the proposal label** (L-CRYPTO-03 advisory-only); surface in C8 as a metadata inconsistency. If proposal label persists as ACCUMULATION for 2+ consecutive cycles AND radar still says MID_CYCLE, escalate to F1 as a regime-mapper bug.

---

**brief file:** `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-08-02.md`