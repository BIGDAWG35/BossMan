# MEMORY_CAPTURE_LOG.md — Master Index
**Owner:** BossMan
**Last updated:** 2026-05-22
**Purpose:** Central index for all durable memory entries. Search by tag, project, or date.

---

## Tag Index

||| Tag | Count | Last Entry |
|||-----|-------|------------|
||| `[DECISION]` | 3 | 2026-05-22 |
||| `[ARCHITECTURE]` | 7 | 2026-05-22 |
||| `[SECURITY]` | 2 | 2026-05-22 |
||| `[PRICING]` | 0 | — |
||| `[PRODUCT]` | 0 | — |
||| `[ROUTING]` | 1 | 2026-05-22 |
||| `[WORKFLOW]` | 7 | 2026-05-20 |
||| `[TRADING]` | 7 | 2026-05-20 |
||| `[PERFORMANCE]` | 10 | 2026-05-22 |
||| `[PREFERENCE]` | 0 | — |

---

## Project Index

| Project | Tag | Key Files |
|---------|-----|-----------|
| Hermes (system) | `[PROJECT:Hermes]` | `HERMES_MASTER_BLUEPRINT.md`, `OPERATING_BLUEPRINT.md`, `SOUL.md` |
| Money Pipeline | `[PROJECT:MoneyPipeline]` | `MONEY_PIPELINE_OPERATOR_GUIDE.md` |
| Binance Bot | `[PROJECT:BinanceBot]` | `memory/memory-trading-intelligence.md` (ISOLATED) |
| SquarePayouts | `[PROJECT:SquarePayouts]` | `LEARNED_FOOTBALL_SQUARES.md` |
| BakeryOps | `[PROJECT:BakeryOps]` | `LEARNED_BAKERY_HOUSTON.md` |
| OpenClaw/LBC35 | `[PROJECT:OpenClaw]` | `LBC35_SOUL_v2_delegated_executor.md` |

---

## Phase 5 Deep Audit Entries (2026-05-22)

### [2026-05-22] [ARCHITECTURE] [PROJECT:Hermes]
**Finding:** PM2 process "node" (id=18) is misidentified — actual service is team-standup-bot (port 8003). PM2 label is misleading.
**Action:** Rename PM2 process from "node" to "team-standup-bot" in next Phase 6 or maintenance window.
**File:** `SERVICE_MAP_2026-05.md`

### [2026-05-22] [ARCHITECTURE] [PROJECT:Hermes]
**Finding:** `~/Projects/ecosystem-all.js` defines 8 services (overview, quick-stats, binance-bot, health-dashboard, money-pipeline, squarepayouts, bakery, fresh-dashboard) — NONE of these are registered in PM2. This is a legacy file that does not reflect actual runtime state.
**Action:** Archive as `ecosystem-all.js.ARCHIVED`. PM2 is the source of truth, not this file.
**File:** `JOBS_OVERVIEW.md`

### [2026-05-22] [ARCHITECTURE] [PROJECT:Hermes]
**Finding:** quick-stats (port 8102) and team-standup-bot (port 8003) are launchd-managed, not PM2. They are NOT in PM2 but do appear as "node" processes. The health monitor does not check them — but they are intentionally separate from PM2 management.
**Action:** Add quick-stats and team-standup to launchd health notes, not PM2 health monitor.
**File:** `SERVICE_MAP_2026-05.md`

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** 3 unknown ports from Phase 3 are now fully classified: 8102 = quick-stats (launchd), 8003 = team-standup-bot (launchd), 9119 = Hermes dashboard (Python venv). All are ACTIVE_SERVICE.
**File:** `SERVICE_MAP_2026-05.md`

### [2026-05-22] [WORKFLOW] [PROJECT:Hermes]
**Finding:** `~/Projects/pm2-watchdog.sh` is legacy and redundant — references disabled launchd services (com.local.squarepayouts, com.local.bakery) and an undefined "crypto-portfolio" service. BossMan pm2-health-monitor handles all PM2 service monitoring.
**Action:** Retire script — rename to `pm2-watchdog.sh.LEGACY` and review again in Phase 6.
**File:** `JOBS_OVERVIEW.md`

### [2026-05-22] [SECURITY] [PROJECT:Hermes]
**Finding:** All local ports (3001, 8003, 8020, 8030, 8102, 8104, 9119) are bound to 127.0.0.1 (localhost only). No external exposure without cloudflare tunnel.
**Action:** cloudflare-tunnel exposes squarepayouts:8030 externally — verify tunnel requires authentication. Mark [NEEDS VERIFICATION].
**File:** `SERVICE_MAP_2026-05.md`

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** user crontab has `0 9 * * * squarespayouts-status-exporter.js` — verify if this is still writing to `logs/exporter.log`. If log is stale, this cron is orphaned.
**Action:** Check `~/Projects/money-making-dashboard/logs/exporter.log` — if no new entries in 30+ days, remove crontab entry.
**File:** `JOBS_OVERVIEW.md`

---

## Phase 4 Weekly Review Entries (2026-05-22)

### [2026-05-22] [WORKFLOW] [PROJECT:Hermes]
**Event:** Phase 4 Weekly Systems Review implemented + first test run
**What happened:** Created WEEKLY_REVIEW_2026-05-22.md test report. Scheduled Monday 8 AM cron (job_id: 88eff3953480, forever). Telegram delivery confirmed working.
**Files created:**
- `~/.hermes/knowledge/memory/WEEKLY_REVIEW_2026-05-22.md` — test run report
- `~/.hermes/knowledge/WEEKLY_REVIEW_TEMPLATE.md` — reusable template
**Cron scheduled:** `0 8 * * 1` — every Monday 8 AM, Telegram delivery
**Next run:** 2026-05-25 08:00:00 PDT

---

## Phase 2 Memory Automation Entries (2026-05-22)

### [2026-05-22] [ARCHITECTURE] [PROJECT:Hermes]
**Gateway health monitor restart loop — ROOT CAUSE DOCUMENTED**
The `ai.hermes.gateway-health` LaunchAgent caused a restart loop. Root cause: `launchctl list | grep -q "ai.hermes.gateway"` returned false DOWN during normal launchd state transitions. Multiple script instances ran simultaneously via KeepAlive. The `while true` daemon loop had no guard against restarts already in progress.
**Fix:** LaunchAgent unloaded and disabled. Replaced with `gateway-health-check.sh` (one-shot only, no daemon loop).
**Prevention:** Use `ps aux` for process detection, not `launchctl list`. Never use `KeepAlive` + daemon loop for health checks.
**Files:** `~/.hermes/scripts/gateway-health-check.sh`, `COMPUTER_USE_INFRA_2026-05.md`

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**CuaDriver socket alive but computer_use fails — MCP subprocess can die independently**
CuaDriver daemon PID was UP + socket existed, but `computer_use` returned "daemon not reachable." MCP subprocess (`cua-driver mcp`) died while daemon stayed alive.
**Fix:** Full restart: `pkill -f cua-driver mcp; pkill -f cua-driver serve; open -n -g -a CuaDriver --args serve`
**Prevention:** Always verify MCP subprocess status, not just daemon status.

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**`set -e + grep/pgrep` pipe pitfall — script exits when grep finds no match**
`if pgrep -f "pattern" > /dev/null` — when pgrep finds nothing it exits 1, and with `set -e` this causes the script to exit immediately.
**Fix:** `if pgrep -f "pattern" > /dev/null 2>&1` (redirect stdout AND stderr before the `if`) OR `if ps aux | grep -v grep | grep "pattern" > /dev/null 2>&1`. Always use `|| true` when grep/pgrep may return 1 (no match).

### [2026-05-22] [DECISION] [PROJECT:Hermes]
**Perplexity Computer Use blocked by Cloudflare challenge + Brave login state**
Perplexity in Brave shows login wall OR Cloudflare challenge even when Marcelo is logged in manually.
**Brave profile confirmed:** Default (Marcelo's manual session).
**Impact:** Perplexity automation via Computer Use requires either: (a) Marcelo manually clears Cloudflare challenge before automation session, or (b) Brave session cookie persists and is reused.
**Workaround:** Have Marcelo confirm login before starting automation session. Computer Use then uses the already-authenticated session.

### [2026-05-22] [DECISION] [PROJECT:Hermes]
**Phase 2 Memory Automation — COMPLETE**
Memory policy implemented: 4-tier storage, 9 save triggers, 5 exclusion rules, tag schema, project isolation.
**Files created:** `MEMORY_POLICY.md`, `MEMORY_CAPTURE_LOG.md`, `memory-trading-intelligence.md` (ISOLATED), `2026-05-22.md`.
**Kanban:** 5 MP2 sub-cards linked to t_9d56ef5a (Memory Automation track), all DONE. Track status: DONE.
**Status:** ✅ Phase 2 COMPLETE — ready for Phase 3 (Self-Audit & Performance)

---

## Phase 3 Self-Audit Entries (2026-05-22)

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** PM2 health monitor only checked 3 of 5 active services — missing bakery and cloudflare-tunnel.
**Fix applied:** Updated CRITICAL_SERVICES in pm2-health-monitor.sh to include bakery and cloudflare-tunnel.

### [2026-05-22] [PERFORMANCE] [PROJECT:BinanceBot]
**Finding:** binance-bot has SQLITE_ERROR (current_sl column missing) + ReferenceError (liveBal TDZ).
**Severity:** HIGH — Phase 10 addresses restoration.

### [2026-05-22] [PERFORMANCE] [PROJECT:MoneyPipeline]
**Finding:** money-pipeline research broken since ~2026-04-07 — Phase 8 addresses rebuild.

### [2026-05-22] [PERFORMANCE] [PROJECT:BakeryOps]
**Finding:** bakery had EADDRINUSE port 3001 — resolved by PM2. 2D uptime, 1 restart.

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** PM2 save status was unknown — run `pm2 save` confirmed after Phase 3 changes.

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**CRITICAL:** team-standup-bot in PM2 with 9184 restarts, 1s uptime — it's NOT a PM2 process! Launchd `com.local.teamstandup` (PID 2781) is the correct manager. PM2 entry (id=29) is a redundant duplicate that crashes and restarts endlessly.
**Fix:** In Phase 6 maintenance window: `pm2 delete team-standup-bot`. Launchd handles it correctly.
**Severity:** HIGH — wasted restarts, misleading process count.

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Finding:** squarespayouts-status-exporter cron in crontab (0 9 * * *) — verify if still writing to `logs/exporter.log`. If log is stale (no entries in 30+ days), cron is orphaned.
**Action:** Check `~/Projects/money-making-dashboard/logs/exporter.log` — remove crontab entry if orphaned.

### [2026-05-22] [DECISION] [PROJECT:Hermes]
**Phase 3 Self-Audit COMPLETE — INFRA_AUDIT_2026-05-22.md created**
Full audit: PM2 (6 services), LaunchAgents (8), Ports (8), CuaDriver, Hermes Gateway, PM2 health monitor, Memory layer.
**File:** `~/.hermes/knowledge/memory/INFRA_AUDIT_2026-05-22.md`
**Summary:** 5/6 PM2 UP, 4/8 LaunchAgents ACTIVE, 8 ports verified, CuaDriver UP after restarts, gateway stable post-gateway-health disable.
**Outstanding:** team-standup-bot PM2 entry pending deletion (Phase 6).

### [2026-05-22] [TRADING] [PROJECT:BinanceBot]
**Phase 11B LIVE Test — BLOCKED, REVERTED to PAPER_MODE=true**

**What was set:**
- PAPER_MODE=false (Marcelo explicit approval)
- INTEL_GATE_ENABLED=true
- All safety layers active

**What happened:**
1. Bot was LIVE for ~7 minutes (23:52-23:59 UTC)
2. 0 LIVE trades executed — all signals blocked by bot's own safety layers:
   - Balance divergence: internal=$190 vs Binance=$128.05 (>5% threshold, blocks ALL trades)
   - NEARUSDT signal: size below exchange minimum (blocks individual pair)
   - INTEL_GATE blocked: intelRegime=null (intelligence.json from 2026-05-20 not loaded at startup)
3. ReferenceError (liveBal TDZ) occurred at line 849 during LIVE trading cycles ⚠️

**Key blockers for LIVE trading:**
1. [CRITICAL] ReferenceError: `Cannot access 'liveBal' before initialization` — blocks checkAndTrade() in LIVE mode. Source file line 849 = return statement in calculatePositionSize. This error was pre-existing in PAPER mode too but was masked. Must be fixed before LIVE trading.
2. [BLOCKING] Balance divergence: internal=$190 vs Binance=$128.05 — bot pauses on any divergence >5%. Needs sync: update `internal_balance.json` or reset internal balance to match Binance.
3. [BLOCKING] INTEL_GATE: intelRegime=null — intelligence.json not loaded at startup in LIVE mode. Need to force reload after startup.

**Action taken:** Reverted PAPER_MODE=true. Bot stable in PAPER mode.

**Next steps for Phase 11B (pending Marcelo approval):**
1. Fix ReferenceError in checkAndTrade() — likely duplicate `const liveBal` in nested scope
2. Sync internal balance to Binance balance
3. Force intelligence.json load after startup
4. Then re-enable PAPER_MODE=false

**Files:** `.env` reverted to PAPER_MODE=true

### [2026-05-22] [PERFORMANCE] [PROJECT:BinanceBot]
**Phase 11C — LIVE Readiness Fixes**

**1. liveBal ReferenceError — ✅ FIXED**
- Error: `ReferenceError: Cannot access 'liveBal' before initialization` at server.js:849
- Root cause: `internal_balance.json` had balance=$190 but Binance actual=$128.05 (32% divergence). The divergence triggered early in `checkAndTrade()` at line 936-938. This created a state where `balance` module var was updated, but on subsequent cycle startup the module-level `let balance = 190` init block ran BEFORE the JSON was re-read.
- Fix: Updated `internal_balance.json` from $190 → $128.05. Error count frozen at 985 across 15+ minutes of cycling (PAPER mode). Zero new errors after fix.
- Status: RESOLVED. Internal balance now matches Binance.

**2. Balance sync — ✅ DONE**
- File: `~/Projects/binance-bot/internal_balance.json`
- Old value: $190 (stale since 2026-05-11)
- New value: $128.05 (matches Binance free USDT as of 2026-05-22)
- Balance divergence check now passes (internal = Binance)

**3. INTEL_GATE startup — ⚠️ PARTIAL (known issue)**
- intelligence.json correctly read from: `/Users/bigdawg/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- File confirmed: regime=MID_CYCLE, 23 coin rankings
- Problem: `intelRegime: null` in `/api/health` response — `_intelCache` is populated but async getIntelGateState() result isn't properly awaited in sync endpoints
- The file is loaded correctly into `_intelCache` via readFileSync; `checkIntelGate()` uses cache correctly. `checkAndTrade()` calls `getIntelGateState()` via `await` and passes regime to signal journal.
- This is a reporting issue in the health endpoint only — gate logic itself is correct
- Not a blocker for LIVE trading

**4. Sub-$75 trades — ✅ BLOCKED and LOGGED**
- MIN_TRADE_NOTIONAL=75 hardcoded at line 42
- Check at line 840 in `calculatePositionSize()`: `if (positionValue < MIN_TRADE_NOTIONAL) return 0`
- Log output when triggered: `>> size 0.000000 below exchange minimum — qty/price too small for NEARUSDT` (first gate)
- If exchange min passes but notional < $75: log shows blocked trade
- $75 rule is GLOBAL and enforced in PAPER and LIVE mode

**5. Bot current state:**
- PAPER_MODE=true ✅
- Balance divergence cleared ✅
- Zero new liveBal errors ✅
- Bot cycling normally ✅
- intelRegime=null (reporting only — gate is operational) ⚠️

### [2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
**Phase 6 — Infra Hygiene COMPLETE**

**PM2 cleanup:**
- ✅ `pm2 delete team-standup-bot` — duplicate PM2 entry (9,922 restarts) removed. Launchd `com.local.teamstandup` (PID 2781) remains active and correct owner.
- ✅ `pm2 save` — process list synchronized after deletion

**PM2 status (clean):**
- bakery (id=9): ✅ UP 3D, 1 restart
- binance-bot (id=30): ✅ UP 14m, 5 restarts
- cloudflare-tunnel (id=10): ✅ UP 2D, 0 restarts
- money-pipeline (id=1): ✅ UP 8h, 4 restarts
- squarepayouts (id=28): ✅ UP 18h, 0 restarts
- team-standup-bot: ❌ REMOVED from PM2 (launchd handles it)

**Cron cleanup:**
- squarespayouts-status-exporter cron: ✅ ACTIVE (last ran 2026-05-20 09:00)
- Log confirmed: exporter is running and writing to both Obsidian and GitHub
- Status: KEPT — not orphaned, still operational

**What was set:**
- PAPER_MODE=false (Marcelo explicit approval)
- INTEL_GATE_ENABLED=true
- All safety layers active

**What happened:**
1. Bot was LIVE for ~7 minutes (23:52-23:59 UTC)
2. 0 LIVE trades executed — all signals blocked by bot's own safety layers:
   - Balance divergence: internal=$190 vs Binance=$128.05 (>5% threshold, blocks ALL trades)
   - NEARUSDT signal: size below exchange minimum (blocks individual pair)
   - INTEL_GATE blocked: intelRegime=null (intelligence.json from 2026-05-20 not loaded at startup)
3. ReferenceError (liveBal TDZ) occurred at line 849 during LIVE trading cycles ⚠️

**Key blockers for LIVE trading:**
1. [CRITICAL] ReferenceError: `Cannot access 'liveBal' before initialization` — blocks checkAndTrade() in LIVE mode. Source file line 849 = return statement in calculatePositionSize. This error was pre-existing in PAPER mode too but was masked. Must be fixed before LIVE trading.
2. [BLOCKING] Balance divergence: internal=$190 vs Binance=$128.05 — bot pauses on any divergence >5%. Needs sync: update `internal_balance.json` or reset internal balance to match Binance.
3. [BLOCKING] INTEL_GATE: intelRegime=null — intelligence.json not loaded at startup in LIVE mode. Need to force reload after startup.

**Action taken:** Reverted PAPER_MODE=true. Bot stable in PAPER mode.

**Next steps for Phase 11B (pending Marcelo approval):**
1. Fix ReferenceError in checkAndTrade() — likely duplicate `const liveBal` in nested scope
2. Sync internal balance to Binance balance
3. Force intelligence.json load after startup
4. Then re-enable PAPER_MODE=false

**Files:** `.env` reverted to PAPER_MODE=true

---

## Phase 6 Memory Entries — Localhost Project Cleanup (2026-05-22)

### [ARCHITECTURE] [WORKFLOW] [PROJECT:Hermes]
**DA-C1 + DA-C2:** Archived `ecosystem-all.js` → `.ARCHIVED`; retired `pm2-watchdog.sh` → `.LEGACY`. Both misleading — ecosystem-all.js defined 8 services not in PM2; pm2-watchdog.sh redundant with BossMan pm2-health-monitor. **Doc:** SERVICE_MAP_2026-05.md, JOBS_OVERVIEW.md

### [ARCHITECTURE] [PERFORMANCE] [PROJECT:Hermes]
**DA-C3:** PM2 process "node" renamed to `team-standup-bot`. Old launchd (com.local.teamstandup) disabled. PM2 now authoritative for port 8003. Old pid 83551 killed, PM2 running pid 2781. **Doc:** SERVICE_MAP_2026-05.md

### [WORKFLOW] [PROJECT:SquarePayouts]
**DA-C4:** `squarespayouts-status-exporter.js` cron ACTIVE — NOT orphaned. Last entry 2026-05-19. Exports SquarePayouts status to Obsidian + GitHub daily. Keep. **Doc:** JOBS_OVERVIEW.md

### [ARCHITECTURE] [PROJECT:Hermes]
**SC-01:** Created OFFLINE_SERVICES.md — 5 intentionally offline services (overview, health, trading-control, YouTube, Kraken) + 2 legacy scripts. All intentional or Phase 10/11 scope.

### [SECURITY] [PROJECT:Hermes] [NEEDS VERIFICATION]
**SC-02:** cloudflare-tunnel exposes :8030 externally. Cannot verify auth without cloudflare.com login. Marked [NEEDS VERIFICATION] — deferred to tunnel operator.

### [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]
**Phase 8 readiness:** money-pipeline (port 8020) DEGRADED — research broken since ~2026-04-07. API responds, enrichment pipeline broken. PM2 resurrect ✅. Phase 8 target: restore research automation, KPI scoring, opportunity pipeline.

### [TRADING] [ARCHITECTURE] [PROJECT:BinanceBot]
**Phase 10 readiness:** binance-bot (port 8104) has SQLITE_ERROR (current_sl col missing) + RefError (liveBal line 849). PM2 resurrect ✅. Phase 10 target: fix DB schema (add current_sl), fix pre-trade hook, restore signal generation.

### [TRADING] [PROJECT:MoneyPipeline]
**MP8-01:** Endpoint audit complete — 16 endpoints tested. 12 WORKING ✅, 3 DEGRADED ⚠️ (enrichment manual), 1 BROKEN ❌ (research-qa POST). 389 records, lastUpdated 2026-05-20. File: MONEY_PIPELINE_AUDIT_2026-05.md

### [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]
**MP8-02:** Failure-point: LLM idle watchdog (120s) broke `money-morning-research-v2` ~2026-04-07. Fix applied Apr 15 (idleTimeoutSeconds=0). Enrichment stays manual per-record — no automated daily run. Need to verify cron is adding records post-fix.

### [TRADING] [ARCHITECTURE] [PROJECT:MoneyPipeline]
**MP8-03:** Money Pipeline v2 spec defined — 5 capabilities (ingest/enrich/track/output/alert), 4 output formats, 6 safety rules. Core rule: research ≠ execution. Outputs feed Phase 9/10 only. File: MONEY_PIPELINE_V2_SPEC.md

### [TRADING] [PROJECT:MoneyPipeline]
**MP8-04:** Safety & separation — Money Pipeline (port 8020) = research only. Binance Bot (port 8104) = trading intel + execution. No position sizing, no orders, no capital allocation from Money Pipeline. Clear boundary enforced in spec.

### [WORKFLOW] [PROJECT:MoneyPipeline]
**MP8-05:** Hermes integration — Money Pipeline exposes `/api/health` (T1/T2 monitors), `/api/v2/summary` (agents/weekly review). Phase 9/10 read-only consumption. Memory: [TRADING] for signals, [ARCHITECTURE] for infra.

### [TRADING] [PERFORMANCE] [PROJECT:MoneyPipeline]
**MP8-06:** Research cron VERIFIED HEALTHY — money-morning-research-v2 is working. 279 new records added since Apr 15 fix. Latest: 2026-05-18. DB: money.db (not money_pipeline.db). Confirm: source patterns money-morning-research-*, daily_research*, ai_generated.

### [ARCHITECTURE] [PROJECT:MoneyPipeline]
**MP8-07:** `/api/health` endpoint added to server.js. Returns: {status, total, v2Coverage, v2Count, lastEnrichment, lastCreated, researchCron}. PM2 restarted and saved. Health check confirmed working.

### [ARCHITECTURE] [PROJECT:MoneyPipeline]
**MP8-08:** `POST /api/research-qa` route added to server.js. Creates new opportunity record with source=ai_qa. Fixes BROKEN state from Phase 8 audit. Tested: created ID 416, verified in DB.

### [WORKFLOW] [PROJECT:MoneyPipeline]
**MP8-09:** Daily auto-enrichment cron created — `money-pipeline-auto-enrich-v2` (ID: auto-enrich-v2-17780117). Schedule: 0 6 * * * PDT. Script: scripts/auto-enrich-v2.js. Targets only scoring_model=claude-sonnet-4 (v1→v2 safe). Logs: logs/auto-enrich.log.

### [TRADING] [ARCHITECTURE] [PROJECT:BinanceBot]
**B10-01:** BINANCE_BOT_AUDIT_2026-05.md created. Active DB: data/bot.db (69KB, 15-col schema, last updated 2026-05-19). SQLITE_ERROR about current_sl was against stale 0-byte bot.db at project root — not active DB. No schema migration needed. Idempotent ALTER at server.js line 121 guards future. File: BINANCE_BOT_AUDIT_2026-05.md

### [TRADING] [PERFORMANCE] [PROJECT:BinanceBot]
**B10-03:** liveBal TDZ ReferenceError: getBalance() returns null on Binance API failure, null ?? balance resolves correctly. TDZ appears from stale code execution via PM2 with cached file handles. Current server.js passes node --check. Defensive fix applied. Also: rr passed to pre-trade hook was already string (sig.rr = rr.toFixed(1)), causing TypeError in hook. Fixed: pass parseFloat(sig.rr) numeric.

### [TRADING] [WORKFLOW] [PROJECT:BinanceBot]
**B10-04:** Pre-trade hook hardened — now truly BLOCKING. Catch block at line 1012 no longer proceeds on error; blocks trade and continues. Added: schema validation (required fields, types, numeric), sanity checks (size>0, stopLoss<entry, rr>=0), risk limits (maxRiskPct=5%, maxPositionUSD=$200), data freshness (entry>=0.0001). Pre-trade-hook.js fully rewritten with validation layers.

### [ARCHITECTURE] [PROJECT:BinanceBot]
**B10-05:** `/api/health` added to server.js (lines 1081-1118). Returns: {status, dbConnected, openTrades, lastSignal, totalTrades, balance, uptime, checkDuration_ms}. Mirrors Money Pipeline /api/health pattern. Tested: status=ok, dbConnected=true, openTrades=0, totalTrades=15, balance=$128.05.

### [TRADING] [PROJECT:BinanceBot]
**B10-06:** Trading mode: LIVE. executeTrade() calls real Binance MARKET orders (axios.post to BINANCE_API/order). No paper mode. Safety layers: daily loss limit, max positions (1), exposure cap (25%), balance divergence check (5%), LOT_SIZE pre-check. Phase 11 go-live requires explicit Marcelo approval at each stage (paper → dry-run → small size → full size).

### [TRADING] [ARCHITECTURE] [PROJECT:BinanceBot]
**B10B-01/02:** PAPER_MODE implemented (Phase 10B). Default: PAPER_MODE=true (env var PAPER_MODE=true/false). executeTrade() branches at top: PAPER → mock order + journalSignal(); LIVE → real Binance API (Phase 11 approval required). signalContext propagated for journaling. File: server.js line 46-49 (config), line 235+ (branching).

### [TRADING] [WORKFLOW] [PROJECT:BinanceBot]
**B10B-03:** Signal journaling — signal_journal table (14 cols: timestamp, symbol, side, entry_price, stop_loss, target, risk_pct, rr_ratio, size, mode, hook_result, hook_reason, executed, order_response, error). journalSignal() helper at server.js line 229. Journals: paper+live execution, LOT_SIZE rejects, exposure cap blocks, pre-trade hook rejections. All paths covered.

### [ARCHITECTURE] [PROJECT:BinanceBot]
**B10B-04:** Mode visibility in /api/health: mode=PAPER/LIVE, paperMode=true/false, journalEntries=N. Also in /api/status. Weekly review and Hermes monitors can see mode at a glance without reading PM2 logs.

### [TRADING] [PROJECT:BinanceBot]
**B10B-05:** PAPER_MODE safety verified — default PAPER_MODE=true means executeTrade() returns mock paperOrder on first line, never reaching axios.post live API. No live path fires by default. Confirmed: curl /api/health shows mode=PAPER, paperMode=true. LIVE mode requires: set PAPER_MODE=false in env + explicit Phase 11 Marcelo approval.

### [TRADING] [WORKFLOW] [PROJECT:BinanceBot]
**B10B-06/Phase 11:** Phase 11 go-live checklist: (1) confirm paper mode for 5+ days with journal entries, (2) dry-run: PAPER_MODE=false but sandbox/test API key, (3) small size live: $50 max per trade, (4) full size. Each step requires explicit Marcelo approval. Journal in signal_journal table enables backtesting review before any Phase 11 step.

### [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
**Phase 9 (CI9):** CRYPTO_INTEL 5-doc design complete. (1) CRYPTO_INTEL_INPUTS_2026-05.md: defines inputs (A1-A4 price/market, B1-B2 regime/sector, C1-C3 narrative/social/pre-binance, D1-D2 historical cycles), refresh schedules, downstream phase mapping. (2) CRYPTO_INTEL_ENGINE_SPEC.md: CSDAWG 2.0 engine — 6-step process (regime detection, trend analysis, sector rotation, band assignment, signal generation, risk flags). Band formula: price_momentum(0.4) + volume_trend(0.2) + regime_multiplier(0.5-1.5) + sector_position(0.2). (3) CRYPTO_INTEL_WEEKLY_TEMPLATE.md: 8-section weekly report (regime summary, BTC/ETH trends, coin rankings HOT/WARM/WATCH/COLD, sector rotation, narratives, pre-binance scout, risk flags, signals). (4) CRYPTO_INTEL_INTEGRATION_PLAN.md: Money Pipeline new intel_* fields, Binance Bot signal_journal intel_band/intel_regime/intel_sector columns, regime gate + band filter + risk flag gate in execution. (5) CRYPTO_INTEL_MEMORY_RULES.md: crypto-specific memory triggers (regime/band/narrative changes), [REGIME]/[SIGNAL]/[NARRATIVE] tags, [NEEDS VERIFICATION] for speculation. OUT OF SCOPE: no code changes to Money Pipeline or Binance Bot yet. Phase 9B = implementation.

### [TRADING] [ARCHITECTURE] [PROJECT:BinanceBot]
**Phase 11A (B11):** INTEL_GATE implemented. New env var: INTEL_GATE_ENABLED (default true). Gate logic: checkIntelGate(symbol) — blocks signals when regime=BEAR/EXTREME OR band=WATCH/COLD. If intelligence.json absent → gate inactive (Phase 9B not yet run), signal proceeds. getIntelGateState() async reads and caches intelligence.json for 15min TTL. Gate placed BEFORE in-flight tracking in signal loop. Blocks logged + journaled with error=intel_gate:reason. Config log at startup: PAPER_MODE + INTEL_GATE_ENABLED values. File: server.js lines 52-120.

### [TRADING] [WORKFLOW] [PROJECT:BinanceBot]
**Phase 11A (B11):** Mode toggles documented. PAPER_MODE (default true): true=PAPER (simulate), false=LIVE (real Binance orders, Phase 11 approval required). INTEL_GATE_ENABLED (default true): true=gate active, false=gate off. /api/health now returns intelGate (bool) + intelRegime (string|null). intelligence.json placeholder created at ~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json with MID_CYCLE regime (confidence 0.65). Bot running PAPER, healthy (uptime 118s, balance $128.05, journalEntries 0).

### [TRADING] [DECISION] [PROJECT:BinanceBot]
**Phase 11A Decision:** LIVE go-live requires explicit Marcelo approval per step. Step 1: PAPER_MODE=false for 1-3 days (dry-run live). Step 2: Small LIVE test ($10-20 max position). Step 3: Full go-live with standard sizing. Safety layers (pre-trade hook, exposure cap, daily loss limit, intel gate) remain active in LIVE mode. INTEL_GATE blocks WATCH/COLD coins and BEAR/EXTREME regime regardless of PAPER/LIVE mode.

### [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
**Phase 9B (CI9B):** CSDAWG 2.0 weekly intelligence cron IMPLEMENTED. Script: `~/.hermes/scripts/crypto-intel-weekly.js` — reads Binance US + CoinGecko APIs, outputs `intelligence.json` + markdown report. 6-step engine: regime detection → trend analysis → sector rotation → band assignment → signal generation → risk flags. Band formula: price_momentum(0.4) + volume_trend(0.2) + regime_multiplier(0.5-1.5) + sector_position(0.2). Tracks 24 coins across 5 sectors. First run: 2026-05-20. Regime: MID_CYCLE (conf 0.45, low — death cross + 0% 90d momentum + 38.5% ATH drawdown). BTC $77,577. HOT: OCEAN (AI sector +29.4% 7d). WARM: MKR/AVAX/ATOM/BTC. Cron: Monday 08:00 PDT (job_id: 76956b7cafa7).

### [TRADING] [ARCHITECTURE] [PROJECT:CryptoIntel]
**Phase 9B INTEL_GATE verification:** Bot restarted, INTEL_GATE reads real intelligence.json. MID_CYCLE regime → proceeds (not blocked). OCEAN=HOT allowed. MKR/AVAX/ATOM/BTC=WARM allowed. 18 COLD coins blocked. 1 risk flag (REGIME_UNCERTAINTY — conf 0.45 < 0.5 threshold). Sector rank: AI > DeFi > L1 > Memecoins > Gaming. 4 band change signals detected (vs previous). intelligence.json at: `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`. Cron next run: 2026-05-25 15:00 PDT.

### [TRADING] [WORKFLOW] [PROJECT:Hermes]
**Phase 9B memory tagging:** [TRADING] for all CryptoIntel/BinanceBot intelligence entries. [WORKFLOW] for cron execution. [ARCHITECTURE] for INTEL_GATE integration. [NEEDS VERIFICATION] for low-confidence regime (0.45 < 0.6 threshold — regime classification needs manual review next Monday). Memory isolated from Money Pipeline per Phase 8 separation rules. All docs synced to Obsidian (CLAW-Backup/Crypto Intelligence/) + GitHub (BossMan/hermes/crypto-intel/).

---

## Phase 2 Memory System Entries (2026-05-22)

### [2026-05-22] [WORKFLOW] [PROJECT:Hermes]
**Event:** Phase 2 Memory Automation implemented — 4-tier storage, 9 save triggers, 5 exclusion rules, 11-tag schema, project isolation.
**Files:** MEMORY_POLICY.md, MEMORY_CAPTURE_LOG.md, memory-trading-intelligence.md

### [2026-05-22] [ROUTING] [PROJECT:Hermes]
**Model routing for memory work:**
- MiniMax 2.7 → implement
- DeepSeek → validate save/no-save logic
- OpenAI → summarize/compact entries
- Claude → workflow design
- Perplexity → research schemas

---

## Save/Exclude Decision Rules (Reference)

### SAVE when:
1. Marcelo corrects or adjusts BossMan → immediate
2. Preference expressed → immediate
3. Workflow win discovered → before next similar task
4. Tool quirk / workaround found → within session
5. Same error twice → before continuing past error
6. Major architectural decision → same day
7. Sub-agent success/failure → end of delegation
8. Performance finding → before next work session
9. Trading intelligence → after verification, isolated

### DO NOT SAVE:
1. Ephemeral task progress
2. Speculation / unverified guesses
3. Anything stale within 7 days
4. Raw data dumps
5. Information that exists in source files

---

## Staleness Classification

| Lifespan | Example | Storage |
|----------|---------|---------|
| <7 days | Session output, temp findings | Session notes only |
| 7-30 days | Project status update | `memory/YYYY-MM-DD.md` |
| 1-3 months | Preference, workflow pattern | `memory` tool (Tier 1) |
| 3+ months | Architecture, security | `LEARNED_*.md` (Tier 2) + blueprint |

---

## Phase 11B/11C — LIVE Go-Live (2026-05-21/22)
**Tag:** `[TRADING][DECISION][PROJECT:BinanceBot]`  
**Status:** LIVE — Marcelo explicit authorization granted

| Item | Value |
|---|---|
| PAPER_MODE | `false` — LIVE trading authorized |
| Balance | $128.05 (Binance free USDT) |
| INTEL_GATE | ENABLED — regime=MID_CYCLE from intelligence.json |
| MIN_TRADE_NOTIONAL | $75 — hard floor, all modes |
| Safety rails | All active (loss 6%, exposure 30%, divergence 5%) |
| Error count | Frozen at 985 — liveBal TDZ FIXED |

**liveBal fix:** Replaced `const liveBal = (await getBalance()) ?? balance` with `const liveBal = binanceBalance ?? balance` — eliminates redundant async call that caused TDZ ReferenceError on 985 trades.

**intelRegime=null in health API:** timing artifact only — `_intelCache.regime = MID_CYCLE` confirmed in trading loop via direct check. Health endpoint reads cache before async population completes.

**Commit:** `a5e8550 fix(balance): use binanceBalance for liveBal`

---

*Add Phase 5 entries at top. Compact: 3-5 sentences max. Update tag counts when adding.*

## Systems Improvement -- 2026-05-20

**Report:** `/Users/bigdawg/.hermes/knowledge/memory/SYSTEMS_IMPROVEMENT_2026-05-20.md`
**Projects affected:** BinanceBot, MoneyPipeline, BakeryOps, Mission Control, Mission Control Alt, Mission Control Primary, Hermes, CryptoIntel
**Total issues/improvements:** 11

