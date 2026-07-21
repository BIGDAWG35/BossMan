# SPEC — Binance Bot Autonomous Trader v1.6

**Date locked:** 2026-06-19 (v1.6 — Phase 11A execution-layer guard appended)
**Owner:** BossMan Hermes
**Status:** Phase 2-4 complete (Stage 6 + Stage 7 wired; L-CRYPTO-14/15/16/17 active; Phase 11A execution-...[truncated] если
**Project path:** PROJ-2026-06-binance-autonomous-trader
**Routing Ledger:** see "Routing Ledger" section at bottom.
**Last model:** M3 (Phase 2 architecture draft); DeepSeek review queued for Phase 5.
**Phase 2 citations:** Binance US public docs (https://docs.binance.us/, fetched 2026-06-18). Perplexity browser research blocked (CDP endpoint unreachable in this session); Phase 3 verification work will re-run Perplexity where needed.
**v1.5 deltas (2026-06-19):**
- NEW section "Stage 7 — BossMan Decision Reader (Phase 2-4, shipped 2026-06-19)" documenting the read-and-gate integration pass, fail-CLOSED contract, denial reason codes, cache discipline, and verification ledger.
- Cross-reference: Stage 6 (emitter) ↔ Stage 7 (reader) sibling-gate topology.
- L-CRYPTO-16 added to LEARNED_CRYPTO_INTELLIGENCE.md (rule count 14→15→16).
- No other section changed. v1.4 sections remain in force.

---

## Goal

Build a fully autonomous BossMan-operated Binance trading system that executes routine trades WITHOUT Marcelo in the loop, while preserving strict safety, hard system separation, dynamic capital sizing, complete auditability, and explicit approval gates for major changes only.

## Success Criteria

- ✅ BossMan autonomously executes approved trading workflows end-to-end
- ✅ Marcelo is NOT required for individual trade decisions or normal operations
- ✅ Dynamic capital sizing always uses live deployable balance
- ✅ Profit withdrawals automatically reduce deployable trade capital
- ✅ Binance Bot and Money Pipeline remain hard-separated systems (zero runtime coupling)
- ✅ Safety layers, kill-switches, and QA remain mandatory
- ✅ All artifacts are saved in canonical locations and mirrored correctly

## Current State (verified 2026-06-15, expanded for Phase 2)

The Binance bot is **already LIVE** on **Binance US**, **USDT-only pairs**. These are the non-negotiable FLOORS — future changes may only tighten by default; loosening routes through `APPROVAL-GATES.md`.

### Operator floors (locked 2026-06-15)

| Setting | Value | Source |
|---|---|---|
| Exchange | **Binance US ONLY** | per Phase 2 scope; Gate 8 controls exchange-selection changes |
| Quote asset | **USDT ONLY** | per Phase 2 scope; no BUSD/USDC pairs in v1 |
| Mode | `PAPER_MODE=false` | runtime env var (unchanged) |
| Max live notional | `LIVE_PILOT_MAX_NOTIONAL=75` (USD) | runtime env var (unchanged) |
| Hard floor per trade | $75 USD | policy (unchanged) |
| Risk per trade | 3.5% of capital | policy (unchanged) |
| Max total exposure | 30% of capital | policy (unchanged) |
| Daily loss cap | 6% of capital | policy (unchanged) |
| Position concurrency | 1 position max | policy (unchanged) |
| Current balance | $128.05 USDT | verified 2026-06-15 |
| Pre-start wrapper | FAIL-CLOSED on 6 checks (active) | unchanged |
| PM2 | online, port 8104 | unchanged |
| First live trade | none yet (no signal has met $75 floor at $128 balance) | as of 2026-06-15 |

### Venue constraints (Binance US, verified 2026-06-18 from public docs)

- **Rate-limit weight headers** — every response carries `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` showing consumed weight for the IP. Bot MUST read this header and back off before hitting `429`.
- **Order rate limits** — `ORDERS` rate limiter tracks both new orders and cancels; ORDERS limits are tighter than REQUEST_WEIGHT and separate per-symbol/account.
- **HTTP error semantics:**
  - `HTTP 429` = broke rate limit; back off.
  - `HTTP 418` = IP auto-banned for repeated 429s; do NOT retry from same IP for cooldown period.
  - `HTTP 4XX` (other) = malformed request / bad symbol / WAF block — sender bug, retry won't help.
  - `HTTP 5XX` = Binance US internal error; safe to retry with backoff.
  - `HTTP 409` = cancelReplace partial success; check both orders' state.
- **Per-symbol support gates** — `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, `TAKE_PROFIT_LIMIT` are per-symbol gated. Not every USDT pair supports stop-loss. Bot must call `/exchangeInfo` and verify `permissions` + `orderTypes` for any symbol it intends to trade with conditional orders. Source: https://docs.binance.us/ (fetched 2026-06-18, section "Filters and Error Codes").
- **OCO** — available on Binance US retail spot. Confirmed in endpoint list (`/api/v3/order/oco`).
- **Account model** — `/api/v3/account` returns `free` and `locked` per asset; `free` is the deployable-capital base. Bot MUST use `free`, NEVER just `total` (which includes locked collateral).
- **Quote-asset rule (v1)** — Bot trades USDT pairs only. USDC and BUSD pairs are excluded by policy. Gate 9 controls any change to quote-asset rules (security/account-sensitive).

### What is NOT in v1 scope

- Margin, futures, options, leveraged tokens, staking, earn products.
- Cross-exchange routing (single exchange: Binance US only).
- Algorithmic order types not in v1 scope: TWAP, VWAP, iceberg beyond what Binance US exposes.
- Sub-account management (out of scope; Gate 9 covers any future sub-account use).

---

## Target Architecture v1

### Component diagram (text-level)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CRYPTO INTEL (one-way only)                      │
│   regime flags · volatility bands · news/event flags · macro context   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ READ-ONLY (no feedback loop)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  CYCLE LOOP (every 60s default; configurable)                            │
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐   │
│  │ 1. CAPITAL ENGINE │ →  │ 2. AGGRESSION    │ →  │ 3. SIGNAL/SCAN   │   │
│  │ (DYNAMIC-CAPITAL  │    │  ENGINE (tier    │    │ (screener +      │   │
│  │ canon; per-cycle   │    │  Green/Yellow/   │    │  indicator stack │   │
│  │ deployable-cap)   │    │  Red/Black)      │    │  per Crypto Intel│   │
│  └────────┬──────────┘    └────────┬─────────┘    └────────┬─────────┘   │
│           │                         │                         │         │
│           └─────────────────────────┴─────────────────────────┘         │
│                                     ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 4. POLICY GATE (mandatory; aborts trade on any failure)         │  │
│  │    pre-trade hooks: capital OK? exposure OK? loss-limit OK?     │  │
│  │    symbol-eligible? order-type available? not paused?           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 5. EXECUTION ENGINE (Binance US only; testnet-disabled v1)     │  │
│  │    order construction · rate-limit-aware retry · partial-fill   │  │
│  │    handling · confirmation receipt                             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 6. KILL-SWITCH (always-on; evaluated every cycle)              │  │
│  │    drawdown-triggered · anomaly-triggered · manual override     │  │
│  │    HTTP 418 = KILL · 5 consecutive 429 = KILL · Black tier = KILL│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                     ▼                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 7. AUDIT LOG (append-only; immutable; never shipped to chat)    │  │
│  │    per-cycle: deployable_capital, tier, signals, policy verdict,│  │
│  │    orders placed, fills, errors, kill-switch state changes      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
                  ┌──────────────────┴──────────────────┐
                  │     BINANCE US SPOT API (public)     │
                  │  market data + trading endpoints     │
                  │  + bot's own DB (internal ledger)     │
                  └──────────────────────────────────────┘

   ⛔ NO CONNECTION TO: Money Pipeline DB, Money Pipeline runtime,
      Square payouts, Bakery, any non-Binance-US financial system.
      (See SYSTEM-SEPARATION.md canon.)
```

### Component responsibilities

| Component | Owns | Inputs | Outputs | Failure mode |
|---|---|---|---|---|
| **1. Capital Engine** | Live deployable capital per cycle | Binance US `/api/v3/account` (free + locked), own ledger (reserved, PnL unsettled), open orders, withdrawal queue | `deployable_capital`, `aggression_tier` (Green/Yellow/Red/Black) | Pause cycle + alert |
| **2. Aggression Engine** | Tier transitions based on capital state + drawdown + recent errors | `deployable_capital`, daily PnL, position state, kill-switch state | `aggression_tier`, `max_size_per_trade`, `max_position_count`, `paused: bool` | Hold current tier |
| **3. Signal/Scan** | Indicator-driven signals + per-symbol eligibility check | Binance US public market data, Crypto Intel one-way feed, internal indicator stack | ranked candidates with `eligible: bool` per pair | Return empty list (no trades) |
| **4. Policy Gate** | All pre-trade safety checks (mandatory) | candidate signal, `aggression_tier`, capital, exposure, daily PnL, kill-switch state, symbol eligibility | `approve: bool` + reason | Default `false` (fail-closed) |
| **5. Execution Engine** | Order construction + rate-limit-aware retry + fill tracking | approved signal, current market state, order-type support | order IDs, fill receipts, error log | Surface error to audit log; do NOT retry without backoff |
| **6. Kill-Switch** | Always-on safety override | drawdown, error streaks, manual flag, tier=Black | `paused: bool`, `reason` | Default `paused=true` on any uncertainty |
| **7. Audit Log** | Append-only record of every cycle + every decision | cycle start/end timestamps, all components' decisions, fills, errors, tier changes | immutable per-cycle record | Log-write failure = PAUSE cycle |

### Data flows

1. **Inbound (cycle start):** Capital Engine reads `/api/v3/account` → computes deployable capital → updates `aggression_tier`.
2. **Signal generation:** Scan reads public market data + Crypto Intel one-way feed → produces candidate list → filters to eligible-only (per Binance US `/exchangeInfo` per-symbol check).
3. **Policy gate:** Each candidate enters Policy Gate with full context (capital, tier, exposure, daily PnL, kill-switch state, symbol eligibility). Any reject = skip; first approve = proceed.
4. **Execution:** One approved signal per cycle maximum (matches `position concurrency = 1` floor). Order constructed with rate-limit-aware retry. Receipt captured.
5. **Audit:** Every cycle logs: deployable capital at start, tier transitions, signals considered, policy verdicts, orders placed, fills, errors.
6. **Outbound (cycle end):** State written to internal ledger. Position state updated. Exposure and daily PnL recomputed for next cycle.

### Mode handling (PAPER vs LIVE, pilot vs full-auto)

| Mode | Use | Env var | Behavior |
|---|---|---|---|
| `PAPER_MODE=false` (current) | Live pilot — actual orders on Binance US | unchanged | Real capital, real fills, real settlement. All Phase 2+ safety gates apply. |
| `PAPER_MODE=true` | Pre-live testing — simulated orders against live market data | only set with Gate 1 approval | No real capital. Fill simulation must be realistic (slippage model in Phase 3). Same Policy Gate, same Kill-Switch — paper mode is a SAFETY GATE, not a relaxation. |
| **Pilot** (current default) | BossMan places trades under all Phase 2+ gates; no Marcelo per-trade consult | implicit | Marcelo is informed on tier changes, kill-switch events, and daily summary ONLY. Routine trades are autonomous. |
| **Full-auto** | Same as pilot in v1 — "full-auto" means BossMan runs 24/7 without daily supervision, NOT that safety gates are disabled | implicit | Identical to pilot. Phase 7+ may add additional autonomy tier; not in v1 scope. |

Mode is **policy-determined by env var + config**, not code branches. PAPER mode and LIVE mode share 100% of code paths except the final `place_order` step. This is intentional: paper mode tests the entire system, not just the order constructor.

### PAPER/LIVE discipline with 24-hour decision rule (locked 2026-06-18)

**Default state:** LIVE is the normal operating state. PAPER_MODE is a SAFETY TOOL, not a relaxed mode. Per the Phase 2 spec, PAPER and LIVE share 100% of code paths — same Policy Gate, same Kill-Switch, same audit log. PAPER only swaps the final order-send step.

**Entry to PAPER (LIVE → PAPER transition):**
1. Audit log records: timestamp, reason (free text), operator (Marcelo/BossMan/system).
2. Compute `decision_deadline = entry_time + 24h`.
3. Create or update a Kanban card titled **"PAPER → LIVE reversion"** with the deadline as a due date.
4. The audit log entry MUST reference the reversion card id.

**Reversion logic (autonomous, NOT mode-flipping):**

The bot itself **never** flips LIVE on its own. Instead, on every cycle the bot evaluates reversion state:

- If in PAPER and `now < decision_deadline`: normal PAPER operation; no reversion action.
- If in PAPER and `now >= decision_deadline` AND no operator decision recorded:
  - Set the **epic status to BLOCKED** with reason `PAPER decision overdue`.
  - Surface this as a clear task for Marcelo/BossMan review (Kanban comment + audit log entry).
  - **Continue running PAPER mode** — do NOT silently remain; do NOT auto-flip LIVE; force a conscious decision.
- If operator decision recorded (either revert LIVE or "stay in PAPER with explicit reason"):
  - Decision recorded = decision_made timestamp + decision type + (if "stay") reason.
  - If decision = "revert LIVE": requires Gate 1 approval; bot does NOT auto-execute the revert.
  - If decision = "stay in PAPER": epic marked BLOCKED with the explicit reason; deadline cycle resets.

**Allowed decisions (must be explicit):**
- (a) Revert to LIVE with the new structure → requires Gate 1; manual flip after approval.
- (b) Stay in PAPER but mark epic BLOCKED with explicit reason → allows indefinitely, but the epic is now blocked and the new structure is flagged.

**Forbidden:** Silent, indefinite PAPER. The 24h rule prevents this by forcing a BLOCKED epic + surfaced task. The bot forces conscious decisions instead of forgetting.

**Standing rule (v1):** "If the bot enters PAPER_MODE to test a new structure, it must either (a) revert to LIVE with the new structure after tests pass, or (b) stay in PAPER but mark the epic as BLOCKED with an explicit reason. Silent, indefinite PAPER is forbidden."

**Implementation in code (Phase 3):**
- `paper_reversion.py` module: tracks entry_time, decision_deadline, decision state.
- Called once per cycle (cheap O(1) check).
- On overdue: writes audit log entry, attempts to mark epic BLOCKED via Kanban API, posts comment on reversion card. Failures to surface the block are logged as errors but do not silently swallow the overdue state.
- Unit tests: clock injection to verify exactly-24h boundary, post-deadline surfacing, decision-recording idempotency, no-auto-flip guarantee.

### Risk & safety model (v1)

| Control | Floor | Where enforced | Tightening path | Loosening path |
|---|---|---|---|---|
| Notional cap per trade | $75 (LIVE_PILOT_MAX_NOTIONAL) | Policy Gate + Execution Engine | Lower (e.g. $50) is default-tighten; no gate | Gate 1 (live-mode) — only operator can raise |
| Hard floor per trade | $75 | Policy Gate | Raise floor = tighten | Gate 4 (risk-policy) |
| Risk per trade (% of capital) | 3.5% | Aggression Engine → Policy Gate | Lower is tighten | Gate 4 |
| Max total exposure | 30% of capital | Aggression Engine | Lower is tighten | Gate 4 |
| Daily loss cap | 6% of capital | Aggression Engine → Kill-Switch | Lower is tighten | Gate 4 |
| Position concurrency | 1 | Policy Gate | Lower is tighten (e.g. 0 = pause) | Gate 4 |
| Min deployable capital | ≥ safe threshold (3× min-trade + 2× fee buffer) | Capital Engine → Aggression Engine | Raise floor = tighten | Gate 4 |
| Aggression tiers | 4 (Green/Yellow/Red/Black) | Aggression Engine | Add finer tiers = tighten | Gate 6 (no weakening) |
| Kill-switch triggers | drawdown, anomaly, manual, tier=Black | Kill-Switch | Add triggers = tighten | Gate 6 |
| Rate-limit retry | exponential backoff; max 3 attempts; on HTTP 429 pause 60s; on HTTP 418 hard-pause (kill-switch candidate) | Execution Engine | Lower retry count = tighten | Gate 6 |
| Symbol eligibility | per Binance US `/exchangeInfo` `permissions` + `orderTypes` check | Scan → Policy Gate | Add filters = tighten | Gate 6 |
| Quote asset | USDT only | Scan filter | Narrow further = tighten | Gate 9 (security-sensitive) |
| Exchange | Binance US only | Scan filter | Add exchange = tighten (Gate 8); remove = Gate 8 | Gate 8 |

### Trade decision flow (canonical path)

```
[cycle start]
  ↓
[1] Capital Engine reads /api/v3/account + own ledger
  ↓ deployable_capital
[2] Aggression Engine computes aggression_tier
  ↓ tier ∈ {Green, Yellow, Red, Black}
  ↓ if tier == Black → KILL-SWITCH triggered → [cycle end]
[3] Scan reads market data + Crypto Intel one-way feed
  ↓ ranked candidates
  ↓ filter: USDT-only, Binance US only, /exchangeInfo-eligible
[4] Policy Gate: for each candidate (in score order):
     - capital check (deployable ≥ proposed notional × safety factor)
     - exposure check (proposed + current exposure ≤ 30% cap)
     - loss-limit check (today's PnL > -6% cap)
     - symbol eligibility check (order types present)
     - kill-switch state check (not paused)
     - concurrency check (no other position)
  ↓ first approved candidate wins; rest skipped this cycle
  ↓ if no candidates approved → [cycle end] (no trade this cycle)
[5] Execution Engine:
     - construct order (MARKET for entries; LIMIT for planned exits)
     - rate-limit check (read X-MBX-USED-WEIGHT header)
     - place order with retry policy
     - on 429: back off, retry up to 3×; on 418: trigger Kill-Switch
     - record order ID + fill state
[6] Audit Log: write complete per-cycle record (append-only)
[7] [cycle end]
```

### Capital-evaluation hook (per-cycle, mandatory)

Per `DYNAMIC-CAPITAL.md` canon: every cycle MUST begin with a fresh deployable-capital read. Stale reads (older than `STALE_READ_THRESHOLD` = 60s default) trigger a pause. The read timestamp is part of the audit record.

The Capital Engine NEVER uses a cached balance longer than 60s. The Capital Engine NEVER uses a balance read with error or empty response. The Capital Engine NEVER uses a balance that diverges >10% from last good read without an anomaly check.

### Hard separation guarantees (Phase 2 audit baseline)

Per `SYSTEM-SEPARATION.md`:

- Binance Bot does NOT import any Money Pipeline module, config, or env var.
- Binance Bot does NOT write to any DB outside its own (e.g. shared SQLite, shared Postgres).
- Binance Bot does NOT read Money Pipeline balances, positions, PnL, or any deal-pipeline state.
- Money Pipeline does NOT import Binance Bot modules, read Binance balances/positions/PnL.
- Crypto Intel MAY feed Binance Bot one-way; Binance Bot does NOT send anything back.

**Phase 2 boundary audit (will run in Phase 3):** grep Binance bot codebase for `money_pipeline`, `moneypipeline`, `pipeline.db`, etc. If any cross-system import is found, it MUST be removed before Phase 4 begins. Findings logged in Phase 3 deliverable.

---

## Autonomous Execution Model

### How BossMan runs trades WITHOUT Marcelo in the loop

1. **Marcelo defines the rules once.** Canon artifacts (`AUTONOMY-RULES.md`, `APPROVAL-GATES.md`, `DYNAMIC-CAPITAL.md`, `SYSTEM-SEPARATION.md`) are written, approved, and locked. Operator floors (3.5% risk, 30% exposure, 6% daily loss, $75 floor, 1 position) are set as policy constants.

2. **BossMan runs the cycle loop 24/7** (subject to PM2 stability + kill-switch). Each cycle:
   - Reads fresh deployable capital
   - Computes aggression tier
   - Scans market
   - Runs candidates through Policy Gate
   - Executes first approved candidate (or skips cycle if none)
   - Logs full audit record

3. **Marcelo is informed, not consulted.** Per `AUTONOMY-RULES.md`:
   - Tier changes → reported (alert, not approval)
   - Kill-switch events → reported with reason + auto-pause state
   - Daily end-of-day summary → reported
   - Open question or anomaly detected → escalated per Gate list
   - Routine trade executed → SILENT

4. **Approval is required ONLY for the 9 Gates.** See `Gate Map` below. Routine trading is never an approval event.

5. **Escalation is precise.** If a trade decision needs human input (e.g. detected anomaly, fork in road, new market regime), BossMan pauses the affected cycle/position and surfaces a specific question to Marcelo with context. BossMan does NOT guess.

6. **Audit is complete and immutable.** Every cycle, every decision, every fill, every error, every tier change is logged. Marcelo (or any auditor) can reconstruct exactly what happened and why.

### What BossMan does NOT do autonomously

- Change any Gate-listed item (see Gate Map below).
- Loosen any safety control.
- Open an exchange other than Binance US.
- Trade a non-USDT pair.
- Place orders against margin/futures/options.
- Disable the kill-switch.
- Change `LIVE_PILOT_MAX_NOTIONAL` or `PAPER_MODE`.
- Withdraw funds from Binance US (operator-initiated only).
- Approve its own architecture changes.

---

## Decision Policy (added 2026-06-19, governance lock)

**Reference rule:** L-CRYPTO-14 in `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`. This section is the operational mirror of L-CRYPTO-14 inside this spec. If they ever disagree, L-CRYPTO-14 wins until the spec is re-locked.

### Three-layer model (intel → BossMan decision → trading)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. INTEL LAYER (subagents + bots — advisory-only at the wire)          │
│    • daily-radar-pipeline (Stages 1–5)                                  │
│    • crypto-intelligence weekly regime engine                          │
│    • Perplexity Browser QA + Brave search                              │
│    Outputs: data/daily_radar.json, data/pair_briefs.json, memo, intel  │
│    Discipline: L-CRYPTO-03 (advisory-only at the wire — unchanged)      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ structured intel package
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. BOSSMAN DECISION LAYER (new — autonomous within fixed boundaries)    │
│    Autonomously decides:                                                │
│      (a) coin rotation: add/remove from active universe + watchlist    │
│      (b) trade type / strategy class                                   │
│      (c) aggressiveness tier (from fixed named tiers, fixed bands)     │
│      (d) per-trade qualification / rejection (incl. $75 floor)         │
│    Cannot autonomously:                                                 │
│      - change numeric aggressiveness band values                        │
│      - change $75 floor                                                 │
│      - change PAPER/LIVE mode or 24h decision rule                      │
│      - change deep risk architecture or security-sensitive settings     │
│    Output: data/bossman_decision.json + one audit line per decision     │
│    Hard floor: BOTH layers must reject proposed_notional < 75          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ decisions (still pass through L-CRYPTO-02)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. TRADING LAYER (binance-bot)                                         │
│    Policy Gate + Execution Engine + Kill-Switch + Audit Log            │
│    Executes only decisions that pass Policy Gate                        │
│    INTEL_GATE (L-CRYPTO-02) is the only wire between intel and bot     │
└─────────────────────────────────────────────────────────────────────────┘
```

### BossMan decision stage (Stage 6, preview-gated for later pass)

- **Script path:** `scripts/bossman_decision.js` (placeholder).
- **Inputs:** `data/daily_radar.json`, `data/pair_briefs.json`, latest `DAILY_MEMO_<date>.json`, latest weekly `intelligence.json` (`regime`, `regime_confidence`).
- **Outputs:** `data/bossman_decision.json` with shape:

```json
{
  "ts": "<iso8601>",
  "regime": "<from intelligence.json>",
  "regime_confidence": 0.0,
  "tier": "BASELINE",
  "coin_universe_add":    ["DOGEUSDT"],
  "coin_universe_remove": ["CAKEUSDT"],
  "watchlist":            ["PEPEUSDT", "FETUSDT"],
  "strategy_class":       "swing_momentum",
  "qualified": [
    { "symbol": "DOGEUSDT", "proposed_notional": 75.0, "score": 0.71 }
  ],
  "rejected": [
    { "symbol": "XRPUSDT", "proposed_notional": 60.0, "reason": "INVALID_FLOOR" }
  ],
  "audit": {
    "model": "deepseek-chat",
    "cost_usd": 0.0006,
    "duration_ms": 1234,
    "version": "stage6-v1"
  }
}
```

- **Cron:** runs as Stage 6 inside existing `daily_pipeline.sh` cron `2141a756a0aa` (12:00 PT). **No new crons.**
- **Audit line:** appends to existing `TOKEN_LOG.jsonl` with `stage: "6_decision"`.

### Hard constraints (decision layer + trading layer must both enforce)

1. **Hard minimum trade size = $75 USD** (BOTH layers):
   - Intel layer: do not emit recommendations with `proposed_notional < 75`.
   - Policy Gate: reject any recommendation with `proposed_notional < 75` as `INVALID_FLOOR`.
2. **No Telegram spam from this layer.** Routine decisions → local files / mirrors only. Telegram reserved for security-sensitive alerts and mode / config / boundary-change approvals.
3. **Mode and configuration safety.** `PAPER_MODE`, numeric risk bands, aggressiveness tier band values, and the $75 floor are all operator-controlled. BossMan decision layer does not change them.
4. **L-CRYPTO-02 still binds the wire.** Engine → bot remains one-way. BossMan decision layer is between intel and trading, but its outputs still pass through the Policy Gate and `INTEL_GATE`. It does not bypass them.

### Authority boundaries (mirror of L-CRYPTO-14)

| Decision | BossMan autonomous? | Notes |
|---|---|---|
| Add/remove coin from active universe | ✅ yes | logged in `bossman_decision.json` |
| Add/remove coin from watchlist | ✅ yes | logged |
| Pick trade type / strategy class | ✅ yes | logged |
| Pick aggressiveness tier (named) | ✅ yes | from fixed tier list with fixed bands |
| Qualify/reject specific trade | ✅ yes | respects $75 floor + fixed bands |
| Change $75 floor | ❌ operator only | Gate 4 (risk-policy) |
| Change aggressiveness band VALUES | ❌ operator only | Gate 6 |
| Change `PAPER_MODE` value | ❌ operator only | Gate 1 (live-mode) |
| Change 24h decision rule | ❌ operator only | Gate 1 (live-mode) |
| Change exchange / quote-asset | ❌ operator only | Gates 8, 9 (security-sensitive) |
| Change API key perms / withdrawal | ❌ operator only | Gate 9 + HARD GATE §B (currently tripped) |

### Stage 6 wire-up is NOT in Phase 1

This section is the **governance lock** for the new decision layer. Code (Stage 6 script, Policy Gate hook, audit-log field) is a separate, preview-gated pass after Marcelo approves. The 24-hour reversion rule, the 9 Approval Gates, the Policy Gate, and the Kill-Switch all continue to bind BossMan.

---

## Stage 6 — BossMan Decision Emitter (Phase 2-3, shipped 2026-06-19)

**Reference rule:** L-CRYPTO-15 in `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md`. This section is the operational mirror of L-CRYPTO-15 inside this spec. If they ever disagree, L-CRYPTO-15 wins until the spec is re-locked.

### Purpose

Stage 6 consumes Stage 1-3 intel and emits **one** structured artifact per run: `data/bossman_decision.json` (overwrite) plus a dated archive `data/bossman_decision.<YYYY-MM-DD>.json`. Earlier stages stay "intel only" and make no decisions. Stage 6 is a pure decision emitter — it does NOT trade, gate, size, block, or alter execution. Bot integration (Stage 7) is a separate future card.

### Inputs (read-only)

- `data/daily_radar.json` — Stage 1 heat tag (per-pair band, default band).
- `data/pair_briefs.json` — Stage 2.5 per-pair briefs (score, sector, risk_callout, price_window_status).
- `~/.hermes/knowledge/crypto-intel/daily/DAILY_MEMO_<date>.json` — Stage 3 (regime_today, do_not_touch, top_3_thesis, confidence, research_quality).
- `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` — weekly regime baseline.
- `server.js` `PAIRS` — regex-parsed read-only (canonical 15 USDT pairs). Stage 6 mirrors, never rewrites.

### Output schema (`data/bossman_decision.json`)

Top-level fields (all required): `schema_version`, `generated_at`, `date`, `decision_layer`, `l_crypto_rule`, `regime_today`, `confidence`, `research_quality`, `universe`, `per_coin`, `floor_audit`, `mode`, `next_action`, `preview_id`.

- `schema_version = "1.0"` and `decision_layer = "bossman_v1"` and `l_crypto_rule = "L-CRYPTO-14"`.
- `universe.active` — array of the canonical 15 USDT pairs in PAIRS order.
- `universe.watchlist` — array of length ≤ 3, drawn from PAIRS only.
- `universe.do_not_touch` — array of length ≤ 3, drawn from PAIRS only, no overlap with watchlist.
- `universe.rotations` — `{ added: [{symbol, reason}], removed: [{symbol, reason}] }`.
- `per_coin[]` — one row per active pair, fields: `symbol`, `decision` (QUALIFY|DENY|WATCH_ONLY), `strategy_class` (scalper|swing|position|hedge), `aggression_tier` (TIER_1_CONSERVATIVE|TIER_2_BASE|TIER_3_AGGRESSIVE), `notional_usd` (≥ 75), `rationale` (≤ 200 chars), `risk_callout`, `price_window_status`.
- `floor_audit` — `{ min_notional_usd: 75, min_notional_source: "L-CRYPTO-14 hard rule", violations_dropped, denied_below_floor }`.
- `mode` — `{ PAPER_MODE: "READ_FROM_ENV", LIVE_PILOT_MAX_NOTIONAL: "READ_FROM_ENV", stage_6_mutation: "NONE — advisory only" }`.
- `next_action` ∈ { `human_review_or_approval_required`, `human_review_required`, `auto_proceed` }.

### Hard rejects (artifact NOT written if any trigger)

1. Schema validation fails (missing field, wrong type, bad enum).
2. `universe.active.length !== 15` or non-USDT or order mismatch with `server.js` PAIRS.
3. `watchlist.length > 3` or `do_not_touch.length > 3` or any non-USDT entry.
4. `do_not_touch ∩ watchlist ≠ ∅`.
5. `do_not_touch` contains a symbol not in `server.js` PAIRS (block-only).
6. Any `per_coin[*].notional_usd < 75`.
7. Any `per_coin[*].aggression_tier` outside the fixed T1/T2/T3 set.
8. `regime_today` outside the valid enum set.

### Tier set (named, fixed — BossMan selects, never redefines)

| Tier | Name | Default notional |
|---|---|---|
| `TIER_1_CONSERVATIVE` | T1 | 75 USD |
| `TIER_2_BASE` | T2 | 75 USD |
| `TIER_3_AGGRESSIVE` | T3 | 113 USD (1.5×) |

Numeric band definitions remain unchanged from `LIVE_PILOT_MAX_NOTIONAL`. Stage 6 does NOT read or write `LIVE_PILOT_MAX_NOTIONAL`.

### Soft warnings (artifact written, `next_action` may downgrade)

- `confidence = LOW` or `research_quality ∈ {PARTIAL, MISSING}` → `next_action = "human_review_required"`; `per_coin[*].decision` may downgrade QUALIFY → WATCH_ONLY.
- Mismatch between memo and Stage 6 confidence: log, keep memo's value.

### Three-layer $75 contract (L-CRYPTO-14 + L-CRYPTO-16 + L-CRYPTO-17) — supersedes dual-layer

| Layer | Rule | Card | Where it runs | Blocks |
|---|---|---|---|---|
| Signal / sizing | L-CRYPTO-14 | Stage 6 / Phase 2-3 | `scripts/bossman_decision.js` — drops sub-75 rows from per_coin[] | Sub-75 decisions emitted |
| BossMan gate | L-CRYPTO-16 | Stage 7 / Phase 2-4 | `server.js` — `checkBossmanDecision()` BEFORE executeTrade | Sub-75 trades qualified (BOSSMAN_* codes) |
| Execution layer | L-CRYPTO-17 | Phase 11A | `server.js` — first line of `executeTrade()` | Sub-75 trades executed (`EXECUTION_FLOOR_BELOW_75`) |

**Contract:** Each layer is additive. If upstream sizing drifts, if a race passes a sub-75 quantity, if a manual trigger injects a small order — the next layer catches it last. All three layers must be cleared (or their blocking reason logged) before any trade journal entry with `executed=1` is written.

**Observability:** read-only CLI summary at `scripts/_summary_gates.sh`. Counts per layer over any date range; JSON or text output; zero writes. The older dual-layer table below is kept for historical reference only and is no longer the active contract.

### Dual-layer $75 floor (L-CRYPTO-14 contract, historical — superseded 2026-06-19)

| Layer | Where | What it does |
|---|---|---|
| **Signal** | `scripts/bossman_decision.js` (this spec) | Drops sub-75 rows. Counts in `floor_audit.denied_below_floor`. Does NOT execute. |
| **Execution** | Bot (separate, future card) | Rejects sub-75 trades as `INVALID_FLOOR`. Out of scope for Phase 2-3. |

### Wire discipline (mirrors L-CRYPTO-03 + L-CRYPTO-14)

Stage 6 NEVER writes to `.env`, `server.js`, `pre-trade-hook.js`, `ecosystem.config.cjs`, cron jobs, or PM2 config. Stage 6 reads `PAIRS` from `server.js` via regex (read-only) and falls back to a hard-coded canonical copy. Stage 6 NEVER sends Telegram / email / push / SMS / ntfy. Stage 6 NEVER flips PAPER↔LIVE. Stage 6 NEVER changes numeric risk/aggression bands or `LIVE_PILOT_MAX_NOTIONAL`.

### CLI

```
node scripts/bossman_decision.js                    # today's decision (writes artifact)
node scripts/bossman_decision.js --date YYYY-MM-DD   # backfill
node scripts/bossman_decision.js --dry-run           # console only, no write
node scripts/bossman_decision.js --schema            # print JSON-schema spec, exit
node scripts/bossman_decision.js --help              # usage
```

### Verification (Phase 2-3 — emitter live, no runtime integration)

- `--dry-run` prints candidate artifact; no file write.
- `--schema` prints inline JSON-schema spec; no file write.
- Real run writes `data/bossman_decision.json` and `data/bossman_decision.<date>.json`. SHA-256 verified stable across re-reads.
- Inline validator: 128/128 checks pass (top-level fields, schema constants, universe parity with PAIRS, per_coin coverage, tier/strategy/decision enums, $75 floor, mode block).
- `pm2 jlist`: `binance-bot` PID 4696 unchanged before/after Stage 6 writes — no restart.
- Bot's `checkIntelGate()` still reads `data/daily_radar.json` unchanged. Stage 6 is a sibling artifact, not a replacement.

### Phase 11A — Execution-layer $75 hard floor (L-CRYPTO-17, SHIPPED 2026-06-19)

Third independent safety net. Lives inside `executeTrade()` at `server.js` line ~358 — the FIRST line of the execution path, AFTER sizing logic, intel gate, and BossMan gate all clear.

**Why:** If upstream sizing math ever drifts, if a race condition ever passes a sub-75 quantity into `executeTrade()`, or if a manual trigger injects a small order, the upstream `size === 0 → return` early-exit at line ~277 does not catch it (quantity is non-zero). The LOT_SIZE pre-check at line ~408 only checks Binance's `minNotional` (~$10), NOT our $75 floor. The execution layer is the genuine last line of defense.

**Pure guard module:** `scripts/_execution_floor_guard.js` (~74 lines, testable in isolation).

**Test fixtures:** `scripts/_test_execution_floor.js` — 18/18 pass. Covers the (a) 50 USD → REJECT and (b) 75+ USD → PROCEED requirement from Marcelo, plus NaN, zero, negative, decimal quantity, missing entry, custom minNotional, and undefined signalContext edge cases.

**Reason code:** `EXECUTION_FLOOR_BELOW_75` (constant in the guard module).

**Strict-interpretation decisions (surfaced, not auto-final):**

- PAPER sub-75 blocked: **YES** (stricter). If you want PAPER-only to pass for simulation runs, add a one-line `EXECUTION_FLOOR_BYPASS_PAPER=true` env flag.
- Counter exposed via PM2 logs only: **YES** (no dashboard mutation, scope guardrail). One additive field on `/state` if you want it.

**Files:**

- `scripts/_execution_floor_guard.js` (NEW)
- `scripts/_test_execution_floor.js` (NEW)
- `server.js` (+39/-0, additive only)

### What's NOT in Phase 11A (deferred to separate cards)

- Per-trade qualify integration (separate card).
- Telegram daily decision digest (separate card, after Marcelo opts in).


---

## Stage 7 — BossMan Decision Reader (Phase 2-4, shipped 2026-06-19)

### Purpose

Stage 7 is the **read-and-gate integration pass** that wires `server.js` to the Stage 6 decision artifact (`data/bossman_decision.json`). The bot now consults BossMan's per-coin decision output BEFORE pushing any signal to the existing execution / sizing / pre-trade-hook path. Stage 7 is a sibling gate to `checkIntelGate()` — it does NOT replace the intel gate, does NOT change sizing math, does NOT alter execution logic, and does NOT modify `.env`, `ecosystem.config.cjs`, cron jobs, or PM2 config.

### Scope (locked)

- Read `data/bossman_decision.json` (sibling to `daily_radar.json`).
- Gate signals per `per_coin[sym].decision`.
- Sibling to intel gate; both must allow.
- **ZERO mutation to the artifact.** Stage 6 is the sole writer (L-CRYPTO-15).
- ZERO numeric aggression/risk-band changes. ZERO sizing/execution changes.
- ZERO PAPER↔LIVE mutation. ZERO Telegram emission.
- `strategy_class` and `aggression_tier` from the artifact are **ignored** on the gate path — reserved for a separate future sizing/execution card.

### Topology (gate ordering)

```
checkIntelGate(sym)         ← reads data/daily_radar.json       (existing)
   ↓ pass
checkBossmanDecision(sym)   ← reads data/bossman_decision.json  (NEW, Stage 7)
   ↓ pass
inFlight.add(sym)           (existing)
   ↓
existing execution path     (unchanged)
```

If either gate blocks, the existing rejected-signal journaling pattern runs (`hookResult: 'rejected'`, `error: '<gate>:<reason_code>'`). No new journal columns.

### Fail-CLOSED contract (L-CRYPTO-16)

| Condition | Reason code | Action |
|---|---|---|
| File missing or unreadable | `BOSSMAN_FILE_MISSING` | block |
| JSON parse fail / schema_version mismatch / decision_layer mismatch / l_crypto_rule mismatch / universe.length ≠ 15 / per_coin.length ≠ 15 | `BOSSMAN_SCHEMA_INVALID` | block |
| `metadata.date` ≠ today UTC OR file mtime > 24h | `BOSSMAN_STALE` | block |
| Symbol absent from per_coin/universe index (case-sensitive, no normalization) | `BOSSMAN_SYMBOL_MISMATCH` | block |
| `per_coin[sym].decision == "DENY"` | `BOSSMAN_DENY` | block |
| `per_coin[sym].decision == "WATCH_ONLY"` | `BOSSMAN_WATCH_ONLY` | block |
| `per_coin[sym].decision == "QUALIFY"` | `bossman_qualify` | allow (audit log) |
| `BOSSMAN_DECISION_GATE_ENABLED=false` | `bossman_gate_disabled` | allow (emergency disable) |

### Module contract (`scripts/_bossman_decision.js`)

- Export: `checkBossmanDecision(symbol) → { allowed, reason, detail }`
- Export: `getBossmanDecisionState() → { enabled, present, ageMs, decision_layer, error }` (dashboard)
- Path: `<bot>/data/bossman_decision.json`. Override via `BOSSMAN_DECISION_PATH` env (tests).
- Cache: in-memory, TTL = 5 minutes, invalidated on file mtime change.
- Env flag: `BOSSMAN_DECISION_GATE_ENABLED` (default `"true"`; set `"false"` for emergency pass-through).
- No external API calls. No disk writes. No npm install.

### Server.js integration

- **Insertion point:** between `checkIntelGate()` pass (line ~1201) and `inFlight.add(sig.symbol)` (line ~1213).
- **Use existing rejected-signal journaling pattern** (same `journalSignal(...)` shape as the intel gate block).
- **Console log shape:** `[<ts>] ⛔ BLOCKED by bossman decision gate: <SYM> — <reason_code>` (mirrors the intel gate log shape).
- **Dashboard counter:** additive `bossmanDecisionGate: BOSSMAN_DECISION_GATE_ENABLED` boolean on both `/health` and `/state` payloads. No other dashboard field changes.
- **Config line:** `[binance-bot] Config: ... BOSSMAN_DECISION_GATE_ENABLED=...` appended (read-only flag, no behavior on boot).

### What is NOT in Stage 7 (reserved for separate cards)

- Reading `strategy_class` or `aggression_tier` for sizing.
- Reading `notional_usd` from the artifact for sizing.
- Per-coin execution-side $75 floor enforcement.
- Telegram daily decision digest.
- Multiple-decision resolutions (e.g. confidence + decision mixing).
- Symbol normalization (lowercase folding, separator rewriting).

### Verification (Phase 2-4 — shipped)

- `node scripts/_test_bossman_decision.js` → **21/21 fixtures pass** (all six deny codes, QUALIFY happy-path, disabled flag, per_coin override, symbol case-mismatch, state introspection).
- `node -c server.js` and `node -c scripts/_bossman_decision.js` syntax-clean.
- `pm2 jlist`: `binance-bot` PID 4696 unchanged before/after wire-up — **no restart**.
- `md5sum .env ecosystem.config.cjs pre-trade-hook.js package.json` unchanged — **no .env / PM2 / cron / execution mutation**.
- `git diff --stat HEAD -- server.js` → **+28 / -1** (additive only).
- `git check-ignore -v data/bossman_decision.json` → artifact stays out of git.
- `data/bossman_decision.json` SHA-256 stable across reads.
- Lint passes; no new PM2 metrics beyond additive `bossmanDecisionGate` flag.

### Rollback

If the gate misfires in production:

1. Set `BOSSMAN_DECISION_GATE_ENABLED=false` in `.env` and `pm2 restart binance-bot`. Gate becomes pass-through.
2. Investigate: `pm2 logs binance-bot | grep "bossman decision gate"`.
3. If artifact is stale: rerun `node scripts/bossman_decision.js` to refresh.
4. Re-enable: remove env flag, `pm2 restart binance-bot`.

Rollback does NOT require touching `server.js` or the artifact.

### Wire discipline (mirrors L-CRYPTO-03, L-CRYPTO-15, L-CRYPTO-16)

Stage 7 NEVER writes `.env`, `server.js` (config portions), `pre-trade-hook.js`, `ecosystem.config.cjs`, cron jobs, or PM2 config. Stage 7 reads `data/bossman_decision.json` and `BOSSMAN_DECISION_GATE_ENABLED`. The bot's `checkIntelGate()` continues to read `data/daily_radar.json` unchanged. Stage 7 NEVER sends Telegram / email / push / SMS / ntfy. Stage 7 NEVER flips PAPER↔LIVE. Stage 7 NEVER changes numeric risk/aggression bands or `LIVE_PILOT_MAX_NOTIONAL`.

---

## Gate Map — which Gate fires when

This section ties every architecture element to the relevant `APPROVAL-GATES.md` Gate. Every change in v1 MUST be traceable to a Gate.

| Architecture element / change | Fires Gate | Notes |
|---|---|---|
| Change `PAPER_MODE` value | **Gate 1** (live-mode enablement) | even paper → live transition is Gate 1 |
| Change `LIVE_PILOT_MAX_NOTIONAL` | **Gate 1** | whether raising or lowering |
| Raise any safety floor (e.g. raise daily loss cap to 8%) | **Gate 4** (risk-policy changes) | "tighten" needs no approval; "loosen" needs Gate 4 |
| Lower any safety floor (e.g. drop daily loss cap to 4%) | **Gate 4** | tightening is allowed by default |
| Change kill-switch threshold (e.g. drawdown trigger from 10% to 15%) | **Gate 7** | whether raising or lowering — kill-switch changes always Gate 7 |
| Add a new kill-switch trigger (e.g. exchange-news-based) | none (default-tighten) | adding safety = no gate; just log in audit |
| Disable or weaken kill-switch | **Gate 6** (safety-control weakening) | never allowed silently |
| Change aggression tier math (e.g. add a 5th tier) | **Gate 4** OR **Gate 6** | depends on whether tighter or weaker |
| Change quote asset rule (USDT → allow USDC) | **Gate 9** (security-sensitive account) | account-level change |
| Add a new exchange (e.g. Kraken) | **Gate 8** (exchange-selection) | any exchange change is Gate 8 |
| Remove Binance US | **Gate 8** | covered by Gate 8 |
| Change API key permissions | **Gate 2** (credentials/API keys/permissions) | any cred change |
| Rotate API key | **Gate 2** | covered |
| Change architecture components | **Gate 5** (architecture redesign) | any new/removed component |
| Change rate-limit retry policy | **Gate 6** if loosening; **no gate** if tightening | tighter = no gate |
| Change position concurrency floor (e.g. 1 → 2) | **Gate 4** | any change is risk-policy |
| Change Crypto Intel one-way feed protocol | none (default) if same boundary; **Gate 5** if data shape changes | depends on impact |
| Add new data feed source (e.g. Twitter sentiment) | **Gate 5** | new dependency |
| Change fee tier (Binance VIP level) | **Gate 9** | account-tier change |
| Modify pre-trade hook order or skip logic | **Gate 6** if loosening | safety-critical order |
| Add new pre-trade hook | none (default-tighten) | adding safety = no gate |
| Modify audit log schema (add fields) | none (default) | additive = no gate |
| Modify audit log to drop fields | **Gate 6** | removing audit = safety weakening |
| Change deployable-capital formula | **Gate 5** OR **Gate 4** | architecture if structure; risk-policy if numeric |
| Change aggression-tier thresholds | **Gate 4** | risk-policy |
| Change stale-read threshold (60s default) | none if lowering (tighter); **Gate 6** if raising (looser) | depends on direction |
| Bot profit-take auto-withdrawal proposal | **Gate 4** | auto-action = risk-policy |

**Default rule:** if a change is not on this map and the change direction is **tighter**, no Gate fires (just log + implement). If the change direction is **looser** or **structural**, the appropriate Gate above fires.

---

## Canon Artifacts (Phase 1 deliverables)

| Artifact | Purpose |
|---|---|
| [`canon/AUTONOMY-RULES.md`](./canon/AUTONOMY-RULES.md) | Standing rule: BossMan handles routine trades autonomously inside approved rules |
| [`canon/APPROVAL-GATES.md`](./canon/APPROVAL-GATES.md) | 9 approval gates requiring Marcelo sign-off |
| [`canon/SYSTEM-SEPARATION.md`](./canon/SYSTEM-SEPARATION.md) | Zero-coupling rule between Binance Bot and Money Pipeline |
| [`canon/DYNAMIC-CAPITAL.md`](./canon/DYNAMIC-CAPITAL.md) | Live deployable-capital policy, withdrawal-aware sizing, aggression tiers |

---

## Phase Plan

### Phase 1 — Governance Lock ✅ COMPLETE

**Deliverables (all shipped 2026-06-18):**
- ✅ `canon/AUTONOMY-RULES.md`
- ✅ `canon/APPROVAL-GATES.md`
- ✅ `canon/SYSTEM-SEPARATION.md`
- ✅ `canon/DYNAMIC-CAPITAL.md`
- ✅ Main Kanban epic + 6 child phase cards
- ✅ Routing Ledger set on epic

**What did NOT happen (per Phase 1 mandate):**
- ❌ No Binance API keys touched
- ❌ No `.env` changes
- ❌ No `PAPER_MODE` / `LIVE_PILOT_MAX_NOTIONAL` changes
- ❌ No PM2 / port / ecosystem config changes
- ❌ No runtime behavior changes
- ❌ No safety gate weakened
- ❌ No Money Pipeline runtime coupling

### Phase 2 — Architecture and Safety Spec (✅ COMPLETE 2026-06-18)

**Status:** Spec only — zero code, zero config, zero runtime change. All Phase 2 content appended above (Current State expanded; Target Architecture v1 with component diagram + responsibilities + data flows; Mode handling; Risk/safety model; Trade decision flow; Capital-evaluation hook; Hard separation guarantees; Autonomous Execution Model; Gate Map).

**Outputs delivered:**
- ✅ Component breakdown (7 components: Capital Engine, Aggression Engine, Signal/Scan, Policy Gate, Execution Engine, Kill-Switch, Audit Log)
- ✅ Capital engine design (per-cycle deployable capital, stale-read detection, anomaly check, 60s freshness rule)
- ✅ Aggression engine design (4 tiers: Green/Yellow/Red/Black; tier transitions tied to capital state + drawdown)
- ✅ Execution engine design (rate-limit-aware retry, 429/418 handling, partial-fill tracking)
- ✅ Kill-switch design (drawdown-triggered, anomaly-triggered, manual override, tier=Black trigger)
- ✅ Crypto Intel integration spec (one-way feed only, READ-ONLY, no feedback loop)
- ✅ Mode handling (PAPER/LIVE share code paths except final place_order step; pilot == full-auto in v1)
- ✅ Trade decision flow (canonical 7-step path)
- ✅ Risk & safety model (14-row control matrix)
- ✅ Gate Map (28-row architecture-change → gate map tying every element to APPROVAL-GATES.md)
- ✅ Hard separation guarantees (Phase 2 baseline)
- ⏳ Architecture boundary audit (boundary guarantees defined; actual grep audit runs in Phase 3, before any code changes)

**Citations:**
- https://docs.binance.us/ — public docs fetched 2026-06-18 (rate-limit headers, error codes, OCO, per-symbol order-type support gates, account model)
- Perplexity browser research BLOCKED this session (CDP unreachable). Phase 3+ will re-run Perplexity where needed.

**Approval gates that may trigger:** None from Phase 2 itself (spec only). Gate 5 (architecture redesign) will fire when Phase 3 implements components materially different from the current bot's existing module structure.

### Phase 3 — Paper-Mode Build (IN PROGRESS 2026-06-18)

**Scope (per Marcelo 2026-06-18):**
- Implement PAPER/LIVE behavior per spec: shared logic path; PAPER only swaps the final order-send step.
- Implement audit + reversion machinery for LIVE → PAPER → (LIVE or BLOCKED) with the **24-hour decision rule** (see "PAPER/LIVE discipline with 24h rule" below).
- Code-only. NO env-var change. NO mode flip. NO deploy or restart. Mode flips stay under Gate 1.

**Outputs:**
- Live deployable-capital calculator implemented and unit-tested
- Withdrawal-aware sizing rules implemented
- Exposure and concurrency policy enforced in code
- Paper-mode toggle test path verified (with 24h-deadline logic)
- Backtest harness against historical data (sanity check on aggression tiers)
- Audit log + reversion card-creation hooks (24h rule)

**Approval gates that may trigger:** Gate 1 if paper → live transition is requested at end of Phase 3. None triggered by Phase 3 implementation itself.

### Phase 4 — Harden and Test (PENDING)

**Outputs:**
- Coin rotation logic tested against historical scenarios
- Regime-based aggression modes tested across regime-change boundaries
- Entry/exit and rebalance policy tested with paper capital
- Failure-mode tests: API timeout, stale read, withdrawal during open position, fee spike, partial fill
- Kill-switch test harness (each trigger evaluated in isolation)

**Approval gates that may trigger:** None expected unless a safety gap is found that requires tightening.

### Phase 5 — DeepSeek QA Red-Team (PENDING)

**Outputs:**
- DeepSeek QA pass (mandatory per `qarequired: yes`, `qamodel: DeepSeek` per blueprint)
- Failure-mode coverage matrix
- Kill-switch criteria verified against red-team attack scenarios
- QA findings log with severity + fix-cost matrix

**Approval gates that may trigger:** Any finding that proposes a Gate 6 (safety-control) change.

### Phase 6 — Docs, Handoff, and Live-Readiness Review (PENDING)

**Outputs:**
- Canonical spec finalized at `~/.hermes/knowledge/`
- Obsidian vault mirror
- GitHub repo mirror
- Perplexity Space mirror (verified)
- Runbook `RUNBOOK-BINANCE-AUTONOMOUS-TRADER.md` at `~/.hermes/knowledge/`
- Phase report entry in `PHASEREPORT.md`
- Live-readiness review (final check before any scaling or major changes)

---

## Constraints (Standing — apply to all phases)

- BossMan handles routine trade execution autonomously inside approved rules.
- Marcelo approval required for: live-mode enablement, credentials/API keys, security-sensitive actions, risk-policy changes, architecture redesign, any safety-control weakening, kill-switch threshold changes, exchange-selection changes, fee-tier/security-sensitive account changes.
- Binance Bot and Money Pipeline: zero runtime coupling.
- Crypto Intel → Binance Bot: one-way only.
- Minimum trade: $75 USD (current floor).
- No change may weaken pre-trade hooks, loss limits, or safety gating.
- All work visible on BossMan Kanban board.

---

## Save Order (locked 2026-06-18)

1. `~/.hermes/knowledge/` (canon) — wins on conflict
2. `~/Obsidian/Hermes/40 Projects/Active/PROJ-2026-06-binance-autonomous-trader/` (mirror)
3. `~/Repos/BossMan/docs/binance-autonomous-trader/` (mirror)
4. Perplexity Space mirror (Agent OS or project-appropriate Space)

SHA-256 parity verified across all 4 mirrors after each phase.

---

## Routing Ledger

```
worktype:           newbuild
primaryartifact:    ~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md
leadmodel:          M3
supportingmodels:   Perplexity Search (blocked this session — re-run in Phase 3+), DeepSeek, Llama, Claude
reviewmodels:       BossMan
finalintegrator:    BossMan
costtier:           3
lastmodelused:      M3
nextmodelplanned:   DeepSeek  (Phase 5 QA red-team)
qarequired:         yes
qamodel:            DeepSeek
qastatus:           pending   (Phase 5 will run QA)
escalatetocomputer: no
escalatetocomputerreason: na
buildpasses:        1
rewritescope:       none
phase2status:       complete 2026-06-18
phase2citations:    https://docs.binance.us/ (fetched 2026-06-18)
phase3status:       in_progress 2026-06-18
phase3lead:         DeepSeek  (per Marcelo routing override — critical trading code)
phase3support:      M3 (design clarifications), Llama (cleanup/tests), Claude (later docs)
phase3scope:        code-only — no env change, no mode flip, no deploy, no restart
```

---

## Open Questions / TODO

| # | Item | Owner | Phase | Status |
|---|---|---|---|---|
| 1 | Exact minimum executable trade size (currently $75; Gate 1 controls changes) | verify in Phase 2 | 2 | OPEN — Phase 2 confirmed $75 floor (KICKOFF locked); Binance US LOT_SIZE/MIN_NOTIONAL filter values are per-symbol and will be enforced in Policy Gate (Phase 3 code) |
| 2 | Exact fee buffer formula (depends on Binance VIP tier; Gate 9 controls changes) | verify in Phase 2 | 2 | OPEN — Binance US fee tier depends on 30-day volume; Phase 3 will read from `/api/v3/account` + `/api/v3/tradeFee` (or equivalent) at runtime; spec uses 2× buffer placeholder |
| 3 | Whether 3×/2× safe-threshold multiplier is venue-agnostic | verify before Phase 3 | 2-3 | OPEN — Phase 2 spec uses DYNAMIC-CAPITAL canon defaults; Phase 3 will validate against Binance US observed fee + min-trade behavior in paper mode before going live |
| 4 | Crypto Intel one-way feed protocol (current implementation if any, design for Phase 2+) | BossMan | 2 | OPEN — Phase 2 defined boundary (one-way read-only); concrete protocol design deferred to Phase 3 (any Crypto Intel integration is architecture change → Gate 5) |
| 5 | Existing bot has any Money Pipeline coupling? (audit) | BossMan | 2 | OPEN — Phase 2 set baseline rules; actual grep audit runs in Phase 3, before any code changes |
| 6 | Open question to Marcelo: any lane MD want stricter gates beyond the 9? | Marcelo | now | ✅ RESOLVED 2026-06-18 — "No extra gates beyond the current 9 for v1. Revisit only if real behavior shows we need more." |
| 7 | Per-symbol support gate logic for STOP_LOSS / TAKE_PROFIT — Phase 3 implementation must use Binance US `/exchangeInfo` filter check | BossMan | 3 | NEW — surfaced from public-docs review (2026-06-18) |
| 8 | `STALE_READ_THRESHOLD` = 60s default — confirm acceptable vs Binance US polling best practices | Marcelo | 3 | ✅ RESOLVED 2026-06-18 — "STALE_READ_THRESHOLD = 60s is the v1 default. Lowering is always allowed (tighten). Raising above 60s triggers Gate 6." |
| 9 | Whether the bot should auto-detect a new safe-floor regime when Binance VIP tier changes mid-month | Marcelo | 3-4 | ✅ RESOLVED 2026-06-18 — "No automatic adjustment of safe-capital floors from Binance US VIP tier changes in v1. VIP/fee changes are intel only; capital floors stay manual under existing gates." |
| 10 | Aggression tier thresholds — exact numerical cutoffs (Green/Yellow/Red/Black) | BossMan | 3 | NEW — Phase 2 defines tier names + role; numeric thresholds deferred to Phase 3 with DeepSeek QA in Phase 5 |
| 11 | PAPER_MODE 24-hour decision rule (LIVE → PAPER transition + reversion discipline) | BossMan | 3 | ✅ RESOLVED 2026-06-18 — see "PAPER/LIVE discipline with 24h rule" section below |

---

## Version History

| Version | Date | Phase | Change |
|---|---|---|---|
| 1.0 | 2026-06-18 | 1 | Initial spec + 4 canon artifacts + Routing Ledger |
| 1.1 | 2026-06-18 | 2 | Phase 2 architecture: expanded Current State (Binance US + USDT-only floors; venue constraints from public docs); added Target Architecture v1 (component diagram, 7 components, data flows); Mode handling (PAPER/LIVE/pilot/full-auto); Risk & safety model (14 controls); Trade decision flow (7-step); Capital-evaluation hook per cycle; Hard separation guarantees; Autonomous Execution Model (6 rules + explicit NOT-do list); Gate Map (28-row change→gate table); updated Phase 2 status to complete; expanded Open Questions to 10 items with statuses; Routing Ledger updated (phase2status, phase2citations, nextmodelplanned → Phase 5 QA) |
| 1.2 | 2026-06-18 | 3 | Phase 3 in_progress: resolved OQ-6 (no extra gates), OQ-8 (60s STALE_READ_THRESHOLD locked), OQ-9 (no auto VIP-tier adjustment); added PAPER/LIVE discipline with 24-hour decision rule (LIVE → PAPER entry, decision_deadline = entry_time + 24h, BLOCKED epic on overdue, no auto-flip); Phase 3 routing override (DeepSeek lead per Marcelo); Phase 3 scope locked (code-only, no env/mode flip/deploy/restart); Open Questions expanded to 11 items |
| 1.3 | 2026-06-19 | 1.5 (governance) | **L-CRYPTO-14 governance lock.** Added Decision Policy section: 3-layer model (intel → BossMan decision → trading); BossMan is autonomous decision authority within fixed boundaries (coin rotation, trade type/strategy class, aggressiveness tier from fixed named list, per-trade qualify/reject); hard $75 floor enforced at BOTH signal AND execution layers; no Telegram spam; L-CRYPTO-03 wire discipline preserved (intel still advisory at the wire); L-CRYPTO-02 (one-way `INTEL_GATE`) still binds. Phase 1 only — canon + rules. Stage 6 code wire-up is a separate, preview-gated pass. No `.env`, no `pm2`, no new crons. References L-CRYPTO-14 in LEARNED_CRYPTO_INTELLIGENCE.md. |
| 1.4 | 2026-06-19 | 2-3 (Stage 6 wire-up) | **Stage 6 BossMan decision emitter shipped** (preview-gated, approved by Marcelo). Added Stage 6 section: `scripts/bossman_decision.js` reads Stage 1-3 intel (radar + briefs + memo + weekly) and `server.js` PAIRS (regex-parse, read-only) and emits `data/bossman_decision.json` (+ dated archive). L-CRYPTO-15 schema: 15-pair universe block, per_coin decision/strategy_class/aggression_tier/notional_usd, floor_audit, mode = READ_FROM_ENV. Inline schema validator enforces 8 hard rejects (no sub-75 notional, no non-15 universe, watchlist ≤ 3, do_not_touch ≤ 3, no overlap, dnt only from PAIRS, valid tier enum, valid regime enum). On any hard reject: artifact NOT written. Wire discipline re-stated: zero touch to `.env`, `server.js`, `pre-trade-hook.js`, `ecosystem.config.cjs`, cron jobs, PM2. Bot's `checkIntelGate()` still reads `data/daily_radar.json` unchanged — Stage 6 is a sibling artifact, not a replacement. Verification battery: 128/128 checks pass; SHA-256 stable; PM2 binance-bot PID 4696 unchanged (no restart). `.gitignore` adds `data/bossman_decision*.json`. |

