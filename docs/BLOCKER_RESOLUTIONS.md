# Blockers — Decisions Required

**Date:** 2026-05-07
**Context:** Phase 1 audit found 3 critical blockers before Phase 2 can proceed

---

## BLOCKER 1 — Binance Bot: Missing Pre-Trade-Hook

### What I Found

**Root cause identified exactly:**
```javascript
// Line 972 in /Users/bigdawg/Projects/binance-bot/server.js
const { runPreTradeHook } = require('/Users/bigdawg/Projects/trading-review/pre-trade-hook');
```
The module at `/Users/bigdawg/Projects/trading-review/pre-trade-hook` **does not exist**. No `trading-review` directory exists anywhere under `/Users/bigdawg/Projects/`.

**Code context (line 972–990):**
- The `require()` is wrapped in a `try/catch`
- The catch block logs: `[review-hook] Error for SYMBOL: Cannot find module...`
- Execution continues after the error — trades are NOT blocked by the missing hook
- The hook comment says: `// ── Pre-trade review hook (log-only, non-blocking) ─`

**Current bot status:**
- Actively trading right now — last signal logged: `2026-05-07T23:31:15Z` (minutes ago)
- Running 2 days straight, 32 restarts (unstable, but not from the hook — that's a separate SQLite error)
- Dashboard accessible on port 8104
- PM2 restart policy: 0 unstable restarts, 2D uptime

**The actual risk:**
The hook is called `log-only, non-blocking` — but it was clearly meant to run pre-trade validation. Since the module doesn't exist, **pre-trade review is silently not happening at all**. The bot is placing trades without the safety checks the hook was supposed to perform.

---

### Proposed Actions — Choose One

| Option | Action | Trade Execution | Dashboard | Risk |
|--------|--------|---------------|-----------|------|
| **A — STOP** (recommended if live money) | `pm2 stop binance-bot` | ✅ Stopped immediately | ❌ Dashboard offline | Low — safe |
| **B — PAUSE** (safer for monitoring) | Edit `.env` → `BINANCE_MODE=PAUSE` + `pm2 restart binance-bot` | ⏸ New signals suppressed | ✅ Live | Medium — depends on `.env` support |
| **C — SAFE MODE via PM2** | `pm2 stop binance-bot` + keep dashboard in ecosystem | ⏸ Signals stopped | ⚠️ Separate process needed | Medium |

**Recommended: Option A — `pm2 stop binance-bot`**

Rationale: The missing hook means trades are going through without pre-trade review. Until the hook is restored or rebuilt, the safest state is stopped.

---

### Verification Steps After Stop

```bash
# Confirm bot is stopped
pm2 list | grep binance-bot

# Confirm no signals in flight (last out log)
tail -5 ~/.pm2/logs/binance-bot-out.log

# Verify dashboard shows "stopped" or "offline"
curl -s localhost:8104 | grep -i "stop\|offline\|status" | head -5
```

---

### What I Will Do After You Approve

1. `pm2 stop binance-bot` — immediate, reversible with `pm2 start binance-bot`
2. Add a Kanban comment to the migration project noting the stop
3. Do NOT touch `trading-review` or `pre-trade-hook` until Phase 2 (Phase 2 will address restoring/rebuilding the hook properly)

**Approval needed:** YES — explicit confirmation before execution

---

## BLOCKER 2 — Port 3001 Conflict

### What I Found

**Actual situation — different from initial assumption:**

| Process | Port | PM2 Name | Status |
|---------|------|----------|--------|
| Bakery server | 3001 ✅ | `bakery` | **Active, working, 6D uptime** |
| Hermes gateway | 3001 ❌ | — | **Not installed as PM2 service** |

**Hermes gateway is NOT running as a PM2 service on port 3001.** The Hermes binary exists at `/Users/bigdawg/.local/bin/hermes` and its config files exist in `~/.hermes/`, but the gateway is not started as a PM2 process.

**Port 3001 is fully owned by `bakery` (PID 2215).** The bakery server is a Next.js app running bakery business operations — Marcelo's home bakery.

**Port 3001 health check result:** Port 3001 returns HTML (bakery Next.js app) — working correctly.

---

### Proposed Actions — Choose One

| Option | Action | Result |
|--------|--------|--------|
| **A — Move bakery to new port** | Change bakery `.env` or `ecosystem.config.cjs` to `PORT=3005` (or 3007) | Bakery moves, 3001 becomes free for Hermes |
| **B — Hermes gateway uses different port** | Configure Hermes gateway in `~/.hermes/config.yaml` to bind `PORT=3007` | Hermes gets its port, bakery stays |
| **C — Leave as-is for now** | Take no action — bakery owns 3001, Hermes gateway not started | 3001 conflict doesn't exist in practice |

**Recommended: Option C — Leave as-is for now, but start Hermes gateway on port 3007**

Rationale: Bakery is actively running a business. Hermes gateway is not even started. Marcelo owns both. The cleanest path: start Hermes on a free port (3007), fix the SERVICES_MAP to reflect reality.

**Key finding to confirm:** Does Marcelo actually use the Hermes gateway as a service? Or is Hermes accessed only via the CLI/TUI? If it's CLI-only, there is no 3001 conflict at all.

---

### Verification Command

```bash
# Is Hermes actually running as a service on 3001?
lsof -i :3001
ps aux | grep "hermes" | grep -v grep
```

**Result:** No Hermes process found on 3001. The "conflict" is theoretical — bakery owns 3001, Hermes gateway is not running.

---

### What I Will Do After You Approve

If you approve Option C (leave as-is, start Hermes on 3007):
1. Identify a free port for Hermes (3007, or ask you to pick)
2. Update `~/.hermes/config.yaml` with the new port
3. Start Hermes gateway on the new port
4. Update SERVICES_MAP to reflect confirmed port assignments
5. Add Kanban comment noting resolution

**Approval needed:** YES — confirm whether Hermes gateway should run as a persistent PM2 service, and which port you want it on

---

## BLOCKER 3 — Port 3100 Conflict

### What I Found

**Actual situation — clear owner identified:**

| Process | Port | PM2 Name | Status |
|---------|------|----------|--------|
| SquarePayouts server | 3100 ✅ | `squarepayouts` | **Active, working, 6D uptime** |
| OpenHue (home automation) | 3100 ❌ | — | **Not running** |

**Port 3100 is fully owned by SquarePayouts (PID 2077).** SquarePayouts is a Next.js app for sports betting pool management — active business tool.

**OpenHue is not installed or running.** There is no OpenHue process on port 3100 or anywhere else. The `curl localhost:3100/api/health` returned 404 because SquarePayouts (not OpenHue) is what responds on that port.

**SquarePayouts PM2 error:** The PM2 logs show `ERR_UNKNOWN_FILE_EXTENSION` errors — the Next.js app has issues loading, but the server is still listening (the 404 health check is likely because OpenHue's health endpoint `/api/health` doesn't exist in SquarePayouts's Next.js app).

**Port 3100 health check:** `curl localhost:3100` would return SquarePayouts's Next.js page — the service is live.

---

### SquarePayouts GitHub Repo

- **Repo:** `BIGDAWG35/Squares` (private)
- **Description:** "SquarePayouts - Sports betting pool system"
- **Local path:** `/Users/bigdawg/Projects/squarepayouts/`
- **Purpose:** Active business tool — sports betting pool management
- **Owner:** Marcelo (one of Marcelo's revenue-generating tools)

**This is NOT a client project — it's Marcelo's own business tool.**

---

### Proposed Actions — Choose One

| Option | Action | Result |
|--------|--------|--------|
| **A — Move SquarePayouts to new port** | Change SquarePayouts `.env` PORT to 3105 | 3100 becomes free for OpenHue (if OpenHue is needed) |
| **B — Reclaim 3100 for OpenHue** | Move SquarePayouts to 3105 | OpenHue can use 3100 if it's ever set up |
| **C — Keep SquarePayouts on 3100** | No change | 3100 is fully used by an active Marcelo business tool |

**Recommended: Option C — Keep SquarePayouts on 3100**

Rationale: SquarePayouts is an active business tool with 6D uptime. OpenHue is not installed or configured — there's no active need for port 3100. If OpenHue is needed in the future, it can move to 3105.

**Additional finding:** SquarePayouts PM2 logs show `ERR_UNKNOWN_FILE_EXTENSION` — the Next.js app may have a build/deployment issue that needs attention during Phase 2 (not a critical blocker).

---

### What I Will Do After You Approve

1. Update SERVICES_MAP: remove OpenHue assumption from port 3100, confirm SquarePayouts as owner
2. Note the `ERR_UNKNOWN_FILE_EXTENSION` error as a non-critical issue to investigate in Phase 2
3. Add Kanban comment noting resolution

**Approval needed:** YES — confirm you want SquarePayouts to keep port 3100 and that OpenHue is not needed on this machine

---

## Summary Table

| Blocker | Owner | Current Status | Recommended Action |
|---------|-------|---------------|-------------------|
| Binance bot pre-trade-hook | Live trading | Active but hook missing | STOP via PM2 (await approval) |
| Port 3001 | Bakery (active) | Bakery owns it, Hermes gateway not running | Start Hermes on 3007, update map |
| Port 3100 | SquarePayouts (active) | SquarePayouts owns it, OpenHue not installed | Keep as-is, update map |

---

## Kanban Card Updates (pending your approval)

Once you approve each action, I will:
- Add a comment to the Phase 1 card (`t_6b1a49f4`) with each resolution as it completes
- Update the Phase 1 card status to done only after all 3 are resolved
- Phase 2 card (`t_c64ea8d3`) remains blocked until Phase 1 is fully resolved
