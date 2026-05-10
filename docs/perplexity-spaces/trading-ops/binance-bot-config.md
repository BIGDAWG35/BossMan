# Binance Bot Configuration

**Source:** SERVICES_MAP.md, BLOCKER_RESOLUTIONS.md, Phase 1 audit
**Status:** 🔴 STOPPED — pre-trade-hook missing (as of 2026-05-07)

---

## Service Details

| Attribute | Value |
|-----------|-------|
| PM2 Name | `binance-bot` |
| Port | 8104 |
| Script Path | `~/Projects/binance-bot/server.js` |
| Health Check | `curl localhost:8104` |
| Status | 🔴 STOPPED |
| Uptime (before stop) | 2 days |
| PM2 Restarts | 32 (critically unstable) |

---

## Known Issues

### 1. Missing Pre-Trade-Hook (CRITICAL)

**Root cause identified exactly:**
```javascript
// Line 972 in /Users/bigdawg/Projects/binance-bot/server.js
const { runPreTradeHook } = require('/Users/bigdawg/Projects/trading-review/pre-trade-hook');
```

The module at `/Users/bigdawg/Projects/trading-review/pre-trade-hook` **does not exist**. No `trading-review` directory exists anywhere under `/Users/bigdawg/Projects/`.

**Code context:**
- The `require()` is wrapped in a `try/catch`
- The catch block logs: `[review-hook] Error for SYMBOL: Cannot find module...`
- Execution continues after the error — trades are NOT blocked by the missing hook
- The hook comment says: `// ── Pre-trade review hook (log-only, non-blocking) ─`

**Current risk:** The hook is called `log-only, non-blocking` — but it was clearly meant to run pre-trade validation. Since the module doesn't exist, **pre-trade review is silently not happening at all**. The bot is placing trades without the safety checks the hook was supposed to perform.

**Resolution:** Phase 6 Track B (`t_faa6d371`) — Binance bot pre-trade-hook restoration. Marcelo must approve before work begins.

---

### 2. SQLite Errors

PM2 logs show `SQLite_ERROR` events contributing to the 32 restarts. This is a separate issue from the missing hook and should be investigated during Phase 6.

---

## Signals Configuration

| Parameter | Value |
|-----------|-------|
| Strategy | EMA/RSI signals |
| Trading Mode | Spot (implied — pre-trade-hook labeled "log-only") |
| Signals Log | `~/.pm2/logs/binance-bot-out.log` |
| Last Signal | `2026-05-07T23:31:15Z` |

---

## Pre-Restart Verification Commands

If Marcelo approves the Binance bot fix in Phase 6:

```bash
# Confirm bot is stopped
pm2 list | grep binance-bot

# Confirm no signals in flight (last out log)
tail -5 ~/.pm2/logs/binance-bot-out.log

# Verify dashboard shows "stopped" or "offline"
curl -s localhost:8104 | grep -i "stop\|offline\|status" | head -5

# After fix — restart
pm2 restart binance-bot

# Verify restart
pm2 list | grep binance-bot
```

---

## Trading Cron Jobs

| Schedule | Command | Owner | Status |
|----------|---------|-------|--------|
| `0 5 * * *` | Morning research script | Hermes (delegated via bossman) | ⚠️ Review during Phase 6 |
| `*/5 * * * *` | `poller.js` market data polling | OpenClaw legacy | ⚠️ Needs migration review |

The trading monitor (`poller.js`) is OpenClaw-owned and runs every 5 minutes. Phase 6 should review whether this should be Hermes-owned.

---

## Phase 6 Card

**Kanban card:** `t_faa6d371`

**Description:** Phase 6 Track B — Binance bot fix and trading monitor restoration

**Current status:** Blocked — awaiting Marcelo approval for pre-trade-hook restoration

**What it involves:**
1. Create or restore `pre-trade-hook` module at `/Users/bigdawg/Projects/trading-review/pre-trade-hook`
2. Fix SQLite errors causing restarts
3. Migrate `poller.js` cron from OpenClaw to Hermes-owned
4. Verify bot stability post-fix

---

## Related Files

- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Full blocker analysis
- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
- `~/.hermes/knowledge/PHASE5_REPORT.md` — Phase 5 complete (Telegram controls)
