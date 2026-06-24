# LEARNED_BINANCE_BOT.md — Binance bot (CSdawgbot) on port 8104

Project-specific lessons. Cross-cutting rules go to MEMORY/SOUL.

## Phase 3 incident — 2026-06-18 (sqlite3 arm64 binding)

**L-BIN-01: Pre-restart validation must require()-test top-level native deps, not just `node -c`**

`node -c server.js` validates syntax only. Native binding arch mismatch (x86_64 binding on arm64 Node, or vice versa) won't fail until `require()` actually runs in-process. Always smoke-test with `node -e "require('./server.js')"` (or `node -e "require('sqlite3')"` for individual deps) **before** any `pm2 restart` on a service with native modules.

**L-BIN-02: arm64/x86_64 binding mismatch is hidden in steady state**

The bot was running fine for 7 days on a stale x86_64 sqlite3 binding. The mismatch surfaces only on process restart. Any long-running service with native deps is at risk; the binding stays valid in memory after first load. **Add a periodic `node -e "require('sqlite3')"` health check** if the bot runs for >1 week without restart.

**L-BIN-03: auto-recovery.js has a SEPARATE hourly budget from PM2 max_restarts**

PM2 has `max_restarts: 10` (lifetime cap). The bot's `auto-recovery.js` has `MAX_RESTARTS_PER_HOUR = 3` (hourly sliding window). A crash loop can trip the hourly budget while PM2 still allows more restarts. After fixing the root cause, you must also run `node auto-recovery.js reset` to clear the hourly counter, or `pre-start.js` will refuse to start with "RESTART_LOOP_EXCEEDED".

**L-BIN-04: bot fail-closed recovery sequence**

When the bot enters a crash loop and stops:
1. Find the root cause (check `binance-bot-error.log` for the actual error — but note pre-start.js rotates this log on every attempt, so capture early or set rotation off during incident).
2. Fix the root cause.
3. `node auto-recovery.js reset` — clear hourly budget.
4. `pm2 start ecosystem.config.cjs` (not just `restart` — start from a clean state).
5. Verify: port 8104 LISTEN, `/api/status` HTTP 200, mode unchanged, first 2 cycles clean.

**L-BIN-05: env confirmation paths**

`PAPER_MODE` and `LIVE_PILOT_MAX_NOTIONAL` are read by pre-start.js from `.env` file. The `process.env` of the running bot does NOT contain them (dotenv injects them post-`process.on('exit')` boundary). Always verify via:
- `pre-start.js` log: `PAPER_MODE=... (LIVE/PAPER mode confirmed)` and `LIVE_PILOT_MAX_NOTIONAL=... (cap is active)`
- HTTP: `curl http://127.0.0.1:8104/api/status` returns `paperMode: true/false` and `minTradeNotional: N` (this is the cap divided by something — verify in server.js what minTradeNotional maps to)

**L-BIN-06: pre-start.js rotates the error log on every attempt**

If a previous bad deploy left a SyntaxError in the error log, `safe-start.js` would NO-GO forever because it inspects the error log. pre-start.js rotates (copies + empties) the error log at the start of every attempt. This is GOOD for poisoning protection, but it BURIES the actual crash error during an active incident. During incident response: stop the bot, capture the error log IMMEDIATELY before the next restart attempt rotates it.

**L-BIN-07: 5-min setInterval cycle hook is the right place for per-cycle logic**

Phase 3's `mode_cycle_hook.js` runs after `checkAndTrade()` on the 5-min interval. The `runCycleHook()` call is in `server.js` after the trade decision returns. Verify it's firing by checking the out log for cycle count increment over time, or by adding a `[cycle-hook]` log line in the hook itself.

## Project structure (2026-06-18)

```
/Users/bigdawg/Projects/binance-bot/
├── pre-start.js          # PM2 fail-closed wrapper (loads safe-start, validates, requires server.js in-process)
├── safe-start.js         # 18-check GO/NO-GO before bot starts
├── auto-recovery.js      # 1h restart budget + 30min API error budget; state in data/auto-recovery-state.json
├── server.js             # Main bot — 5-min setInterval cycle, all 15 pairs
├── mode_state.js         # [Phase 3] current mode + transition history
├── paper_reversion.js    # [Phase 3] 24h deadline + overdue surfacing
├── mode_audit.js         # [Phase 3] transition audit (DB + JSONL fallback)
├── mode_cycle_hook.js    # [Phase 3] per-cycle integration of reversion + audit
├── paper_reversion.test.js  # [Phase 3] 30 tests, 38ms, pure node:test
├── data/
│   ├── bot.db            # SQLite (via sqlite3 package)
│   ├── auto-recovery-state.json
│   └── auto-recovery-log.json
├── .env                  # PAPER_MODE, LIVE_PILOT_MAX_NOTIONAL, BINANCEUS_API_KEY, etc.
└── ecosystem.config.cjs  # PM2 config
```

## PM2 ecosystem config (critical flags)

- `script: 'pre-start.js'` (NOT server.js — pre-start is the actual entrypoint)
- `min_uptime: '60s'` — must stay up 60s to count as "started"
- `max_restarts: 10` — give up after 10 lifetime restarts
- `max_memory_restart: '500M'` — recycle at 500MB heap
- `restart_delay: 4000` — 4s between restarts (avoid tight loop)
- `watch: false` — no file-watch restart loop (would cause infinite restart on any save)

## Cross-references

- SPEC: `~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md` v1.2 SHA `cd608271...`
- Repo: `/Users/bigdawg/Projects/binance-bot` (commit `ff2e857` on Phase 3)
- Phase 3 card: `t_521cafac` on `agent-os` workspace `scratch`
- PM2 service: `binance-bot`, port 8104, fork mode
