# Computer Use Infrastructure — Architecture & Health Guide
**Updated: 2026-05-20**

---

## Architecture: Three Separate Layers

| Layer | Process | Manager | What it does |
|---|---|---|---|
| **CuaDriver daemon** | `cua-driver serve` (PID 28870) | `launchd` via CuaDriver app itself | Unix domain socket at `~/Library/Caches/cua-driver/cua-driver.sock`. Long-lived, stable. |
| **CuaDriver MCP subprocess** | `cua-driver mcp` (PID 28975) | Spawned by hermes-gateway | stdio MCP server that the gateway talks to for `computer_use` tool calls. Dies when gateway session resets. |
| **hermes-gateway** | `hermes_cli gateway run` (PID 26355) | `ai.hermes.gateway` LaunchAgent | HTTP/WebSocket server for Telegram/CLI. Owns the `_CuaDriverSession` per connection. |

**Key insight:** The socket daemon can be UP while the MCP subprocess is DEAD.
When the MCP subprocess dies, the gateway sees `ClosedResourceError` from `anyio.streams.memory`
and fires its shutdown handler, killing the current task.

---

## Status States

| Status | Meaning | Action |
|---|---|---|
| **OK** | All 3 layers healthy | Nothing |
| **DRIVER_DOWN** | CuaDriver socket daemon dead | Restart daemon → then restart gateway |
| **SESSION_STALE** | Daemon alive, MCP subprocess dead | Controlled restart of gateway only |
| **UNHEALTHY** | Multiple restart attempts failed | Stop auto-restart, alert Marcelo, manual review |

---

## Restart Sequence (SESSION_STALE / DRIVER_DOWN)

### SESSION_STALE (MCP dead, daemon alive)
1. Kill any stranded MCP subprocess
2. `launchctl bootout gui/<uid>/ai.hermes.gateway`
3. `launchctl load` the gateway plist (creates fresh `_CuaDriverSession` + new MCP subprocess)
4. Verify MCP session alive via `hermes computer-use status`
5. If still dead after 3 attempts → mark `UNHEALTHY`

### DRIVER_DOWN (daemon dead)
1. `cua-driver stop`
2. `fuser -k` any process holding the socket
3. `open -n -g -a CuaDriver --args serve` (or `nohup cua-driver serve &`)
4. Wait for socket to appear
5. Then run SESSION_STALE sequence above

---

## Gateway Health Monitor

**Script (SAFE — ONE-SHOT only):** `~/.hermes/scripts/gateway-health-check.sh`
**LaunchAgent:** `ai.hermes.gateway-health` — **DISABLED** 2026-05-20

> ⚠️ **INCIDENT 2026-05-20 — Why the old daemon design was unsafe:**
>
> The original `gateway-health-monitor.sh` ran in daemon mode with `KeepAlive` via `ai.hermes.gateway-health` LaunchAgent. The `check_gateway_launchagent()` function used `launchctl list | grep -q "ai.hermes.gateway"`, which returned a false DOWN during normal launchd state transitions. This triggered a restart loop:
>
> 1. `launchctl list` shows gateway as DOWN (transition state)
> 2. Monitor runs `bootout` → `load` cycle
> 3. During the restart, `launchctl list` still shows DOWN
> 4. Monitor fires another restart before the previous one completes
> 5. Multiple instances of the script ran simultaneously, compounding the problem
>
> **Root cause:** `launchctl list` is unreliable during launchd transitions. The grep-based check had no guard against a restart already in progress.
>
> **Fix (2026-05-20):**
> - Replaced daemon + KeepAlive with **one-shot cron mode only**
> - Switched to `ps aux | grep "hermes_cli.main gateway"` for gateway process detection (reliable at all times)
> - **No auto-restart in the check loop** — script reports status only
> - One explicit `restart` mode available for BossMan cron use
> - Max 1 restart attempt, then stops and waits for manual intervention
> - `ai.hermes.gateway-health` LaunchAgent **unloaded and disabled**

### New Safe Design Rules
1. **Report-first:** Always tell BossMan what's happening, never auto-restart blindly
2. **One restart max:** After 1 restart attempt, stop and wait for human decision
3. **No daemon/KeepAlive:** Run via BossMan cron only (one-shot `check` mode)
4. **No infinite loops:** Script exits after every check — no `while true` in production
5. **Reliable detection:** Use `ps aux` for process checks, not `launchctl list`
6. **Human in the loop:** Gateway state changes require BossMan decision, not automated logic

---

## Separation from PM2 Health Monitor

The PM2 Health Monitor (`~/.hermes/scripts/pm2-health-monitor.sh`) monitors ONLY PM2 processes:
`binance-bot | squarepayouts | money-pipeline | bakery | cloudflare-tunnel`

It does NOT touch:
- `hermes-gateway` (LaunchAgent)
- `ai.hermes.gateway-health` (LaunchAgent)
- `cua-driver` daemon

This prevents false-positive shutdown signals from PM2 misinterpreting LaunchAgent failures.

---

## Quick Commands

```bash
# Check status (ONE-SHOT, no auto-restart)
bash gateway-health-check.sh status   # full 3-layer report
gateway-health-check.sh check         # check + write state only

# One controlled restart (BossMan cron only — not automatic)
gateway-health-check.sh restart

# Manual restart sequence (full manual control)
cua-driver stop && sleep 2
open -n -g -a CuaDriver --args serve
sleep 3
launchctl bootout gui/$(id -u)/ai.hermes.gateway
launchctl load ~/Library/LaunchAgents/ai.hermes.gateway.plist
sleep 4

# Verify
bash gateway-health-check.sh status
cd hermes-agent && venv/bin/hermes computer-use status
```