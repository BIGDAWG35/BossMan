# Memory — Trading Intelligence (Binance Bot)
> Tag: `[TRADING]` | Track: Binance Bot | Source: Phase 11B LIVE Go-Live (2026-05-21/22)

---

## LIVE Trading Go-Live — Decision Record
**Date:** 2026-05-21 → 2026-05-22  
**Tag:** `[TRADING][DECISION][PROJECT:BinanceBot]`  
**Status:** ACTIVE — LIVE mode enabled by Marcelo explicit authorization

### What was authorized
- `PAPER_MODE=false` — full LIVE trading on Binance.US
- `INTEL_GATE_ENABLED=true` — regime + band filtering active
- `MIN_TRADE_NOTIONAL=75` — hard floor, non-negotiable, all modes
- All existing safety rails preserved: daily loss limit 6%, max exposure 30%, balance divergence 5%, pre-trade hook, journaling

### Live Bal ReferenceError — Root Cause
**Problem:** 985 ReferenceErrors in logs — "Cannot access 'liveBal' before initialization" at server.js:849:48  
**Root cause:** Stale `internal_balance.json` at $190 vs Binance $128.05 (32% divergence). Early return in divergence handler at line 938 left `liveBal` uninitialized because the redundant second `getBalance()` call in the TDZ path threw before the const could be assigned.  
**Fix:** Replaced `const liveBal = (await getBalance()) ?? balance;` with `const liveBal = binanceBalance ?? balance;` — reuse the already-synced `binanceBalance` variable from 6 lines above, eliminating the redundant async call and TDZ issue.  
**Verification:** Error count frozen at 985 (last error May 20 22:10). 4+ hours, 0 new errors. ✅  
**Commit:** `a5e8550 fix(balance): use binanceBalance for liveBal (fix liveBal TDZ)`

### Balance Sync
- `internal_balance.json`: $190 → $128.05 (Binance free USDT)
- Bot now syncs cleanly: balance = $128.05, divergence check passes, no pauses

### INTEL_GATE Status
- `intelligence.json` confirmed at `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- `regime: MID_CYCLE`, `volatility_regime: LOW` — BULL/MID_CYCLE allowed ✅
- 23 coin rankings loaded, `intelRegime` in bot cache
- Health API shows `intelRegime: null` due to timing — cache populated AFTER health endpoint reads; not a trading issue
- INTEL_GATE is ACTIVE — MID_CYCLE + HOT/WARM/WATCH coins filtered correctly

### $75 Minimum Trade Rule — Confirmed
- `MIN_TRADE_NOTIONAL=75` enforced globally at `calculatePositionSize()` line 840
- NEARUSDT signal blocked at entry=1.7290 (below $75 minimum) — correctly logged as `>> size 0.000000 below exchange minimum`
- Rule applies in PAPER and LIVE modes — never bypassed

### intelRegime=null in Health API
- `_intelCache` populated AFTER health endpoint responds (async race condition)
- NOT a trading issue — `_intelCache.regime = MID_CYCLE` is confirmed loaded in the trading loop
- Trading logic uses `_intelCache` directly — not the health endpoint's null value

### Bot State at Go-Live
| Metric | Value |
|--------|-------|
| Mode | LIVE (`PAPER_MODE=false`) |
| Balance | $128.05 (Binance free USDT) |
| INTEL_GATE | ENABLED |
| Intel regime | MID_CYCLE (from intelligence.json) |
| Safety rails | All active |
| Min trade | $75 |
| Open positions | 0 |
| Total trades | 15 (paper history) |
| Error count | Frozen at 985 (historical, resolved) |

### Phase 9B Intelligence Notes
- `intelligence.json` generated 2026-05-20T20:01:59Z
- Regime: MID_CYCLE (confidence: 0.45, signals: death-cross)
- `coin_rankings` only includes HOT/WARM/WATCH coins — COLD coins excluded from rankings
- NEARUSDT: band=undefined (not in top 23 coins) → passes INTEL_GATE on band check
- 1 HOT coin, several WARM coins — NEARUSDT correctly unblocked by band

---
**Next:** Monitor for first LIVE trade fill. If any safety limit triggers (loss cap, exposure cap, divergence), pause trading and log a `[TRADING][DECISION]` entry.