# Binance Bot — Decision Gap (2026-06-15)

## Current actual state (verified 2026-06-15 20:54 PDT)

| Item | Actual | Runbook expectation | Gap? |
|---|---|---|---|
| **Mode flag (.env)** | `PAPER_MODE=false` | unspecified | YES — runbooks don't say |
| **Live trading cap** | `LIVE_PILOT_MAX_NOTIONAL=75` | unspecified | YES — runbooks don't say |
| **PM2 process** | online, 4h uptime, 1 restart, 0 unstable | expected STOPPED until Phase 6 | YES — runbook stale |
| **Pre-start wrapper** | active (`pre-start.js` fails-closed on 6 checks) | not documented | YES — runbook stale |
| **PM2 hardening** | min_uptime=60s, max_restarts=10, restart_delay=4s, kill_timeout=8s | not documented | YES — runbook stale |
| **Health check (4/4)** | ✅ PASS | n/a | — |
| **/api/status** | `mode: "LIVE"`, `paperMode: false`, `balance: $128.05` | n/a | — |
| **/api/health** | `status: ok`, `dbConnected: true`, `openTrades: 0`, `balance: $128.05`, `uptime: 17521s` | n/a | — |
| **Exchange balance** | $128.05 USDT (signed) | n/a | — |
| **Hard $75 floor** | active (no live trade under $75 can execute) | not documented | YES — runbook stale |
| **EMARSI strategy** | unchanged, scanning 15 sub-$50 pairs | n/a | — |
| **Risk controls** | 3.5%/trade, 30% exposure, 6% daily loss, 1 position @ $128 balance | n/a | — |
| **First live trade** | none yet (no signal has met the $75 floor at current $128 balance) | n/a | — |

## Decision update requested

Binance bot should stay **LIVE and fully functional**, but current runbooks still mark binance-bot as expected **STOPPED** until Phase 6. Need docs + monitoring rules updated before this is treated as healthy state.

## What needs updating (decision-gap items)

1. **Phase 6 doc** (or wherever "expected STOPPED until Phase 6" comes from) — remove the STOPPED expectation. Bot is LIVE.
2. **pm2-health-check skill whitelist** — confirm `binance-bot` is in the whitelisted set (it is: `binance-bot http://localhost:8104 /api/health`). This is fine.
3. **binance-health-check-am/pm crons** — these already alert on health-check failures. Both are `deliver: telegram`. Both will fire if bot goes down. OK.
4. **binance-bot-live-monitor + auto-ticket** — both `*/5` per Marcelo's explicit policy. OK.
5. **INCIDENT.md** — has a 2026-06-15 entry about the secret-in-git-history finding. Add a follow-up note that bot is now LIVE with $75 cap and pre-start wrapper.
6. **PHASEREPORT.md** — already has the 2026-06-15 PM2/cron cleanup entry. The LIVE flip happened earlier in the session, before the audit. The audit + decision-gap work is the closing piece.
7. **CRYPTO_INTEL knowledge base** — add an L-CRYPTO entry: "Bot LIVE as of 2026-06-15 with $75 minimum notional cap, 3.5% risk/trade, 30% max exposure. Pre-start wrapper enforces safe-start.js (18 checks) + .env + DB + hook validation before any live trade can fire. First live trade expected when a signal's natural size ≥ $75 (currently no signal meets this at $128 balance)."

## Recommended next actions (your call)

- [ ] Update Phase 6 doc: remove "STOPPED until Phase 6" line, replace with "LIVE since 2026-06-15, $75 cap, pre-start fail-closed."
- [ ] Add L-CRYPTO-14 to LEARNED_CRYPTO_INTELLIGENCE.md: "LIVE go-live protocol" (covers two-gate approval, $75 floor, pre-start wrapper).
- [ ] Add Binance bot to the OpenClaw "excluded services" list (it should never be touched by LBC35, only BossMan).
- [ ] When first live trade fires, add to MEMORY_CAPTURE_LOG.md and to PHASEREPORT.

## What "healthy state" looks like

The bot is currently in a healthy LIVE state, with:

- All safety checks (safe-start.js 18/18, health-check.js 4/4) passing.
- Real balance ($128.05) matches internal ledger.
- No errors in pm2 logs, no signal has triggered an unsafe size, no divergence.
- $75 hard floor prevents any trade below that size from executing.
- 4h uptime since the LIVE flip, 0 unstable restarts.

The "decision gap" is purely documentary. The bot is **fully functional and SAFE** to keep running.
