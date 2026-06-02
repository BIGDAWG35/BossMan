# Computer Use Fix — Hermes Gateway (2026-05-14)

## Problem

`computer_use` tool returned:
```
"error": "capture failed: cua-driver session not started"
```

## Root Cause

Two-part failure:

### Part 1 — Stale Backend Singleton

`CuaDriverBackend._session._started` was set to `False` because:
1. Gateway launched before `cua-driver serve` was ready
2. `_get_backend()` created a `CuaDriverBackend` and called `_session.start()`
3. `start()` invoked `_aenter()` which spawned a fresh MCP session
4. `_aenter()` completed, `_started = True`
5. Gateway continued; tool calls worked via that MCP session
6. `cua-driver serve` was later restarted (or crashed/replaced)
7. MCP session still connected to old daemon instance → became stale
8. Any subsequent `computer_use` call hit `session not started`

The session singleton (`_backend`) persisted for the gateway's lifetime (1+ day).
The daemon was replaced underneath it. No retry/reset existed.

### Part 2 — No Self-Heal (Original Code)

Original `handle_computer_use` exception handler had NO retry logic:

```python
except Exception as e:
    logger.exception("computer_use %s failed", action)
    return json.dumps({"error": f"{action} failed: {e}"})
```

A stale-session exception was fatal — no recovery attempted.

---

## Fix Applied

**File:** `tools/computer_use/tool.py` — `handle_computer_use()` exception handler (lines 255–274)

Added self-heal block that detects "session not started" on a live `_backend` singleton, resets it, and retries once:

```python
except Exception as e:
    logger.exception("computer_use %s failed", action)
    global _backend
    if "session not started" in str(e) and _backend is not None:
        logger.info("Computer Use self-heal: resetting stale backend and retrying.")
        try:
            _backend.stop()
        except Exception:
            pass
        _backend = None
        try:
            backend = _get_backend()
            return _dispatch(backend, action, args)
        except Exception as e2:
            logger.exception("computer_use retry failed")
            return json.dumps({"error": f"{action} failed: {e2}"})
    return json.dumps({"error": f"{action} failed: {e}"})
```

**Effect:** Transient daemon restarts and gateway→daemon race conditions now self-heal within a single tool call. No manual intervention required.

---

## OpenClaw Config Change

**File:** `~/.openclaw/openclaw.json`

No OpenClaw config change was needed. The cua-driver skill path issue reported by the subagent (OpenClaw skill loader blocking `~/.openclaw/skills/cua-driver` → `/Applications/CuaDriver.app/Contents/Resources/Skills/cua-driver`) was traced to a **symlink** at `~/.openclaw/skills/cua-driver` that already exists and is being used. The actual failure was the stale session issue, not a missing skill.

If OpenClaw skill loading becomes problematic in the future, the fix is:
- Option A (preferred): `ln -s /Applications/CuaDriver.app/Contents/Resources/Skills ~/.openclaw/skills/cua-driver`
- Option B: Add `"/Applications/CuaDriver.app/Contents/Resources/Skills"` to OpenClaw's allowed skill roots in `openclaw.json`

---

## Verification

Test from Python (direct import — same code path as gateway dispatch):

```python
from tools.computer_use.tool import handle_computer_use
result = handle_computer_use({'action': 'list_apps'})
# ✅ Works: returns {"apps": [...], "count": N}
```

### Gateway Restart Required

The gateway runs as a launchd service (`ai.hermes.gateway`). The code fix requires a gateway restart to take effect:

```bash
launchctl kickstart -k gui/501/ai.hermes.gateway
```

Or restart the Mac Studio M4 Max.

After restart, `computer_use` will self-heal automatically on any "session not started" error.

---

## How to Verify Computer Use Is Healthy

### Quick Check (no gateway restart needed — direct test):

```bash
cd ~/.hermes/hermes-agent
python3 -c "
from tools.computer_use.tool import handle_computer_use, _backend, _backend_lock
# Clear any stale state
with _backend_lock:
    if _backend is not None:
        try: _backend.stop()
        except: pass
import tools.computer_use.tool as t
import importlib; importlib.reload(t)
r = t.handle_computer_use({'action': 'list_apps'})
import json; p = json.loads(r)
print('list_apps:', p.get('count'), 'apps — ok:', not p.get('error'))
r2 = t.handle_computer_use({'action': 'capture', 'mode': 'ax'})
p2 = json.loads(r2)
print('capture:', p2.get('app'), p2.get('elements', []), 'elements — ok:', not p2.get('error'))
"
```

Expected: `list_apps: 16 apps — ok: True` + `capture: Perplexity 425 elements — ok: True`

### End-to-End (after gateway restart):

1. `launchctl kickstart -k gui/501/ai.hermes.gateway`
2. Wait 10s for gateway to respawn
3. Send a test message to Hermes that triggers `computer_use`
4. Check `~/.hermes/logs/agent.log` for self-heal log: `Computer Use self-heal: resetting stale backend and retrying.`

---

## Confirming Only BossMan Owns Computer Use

- `computer_use` tool is registered with toolset `computer_use` in `config.yaml`
- `config.yaml` has `toolsets: [computer_use]` scoped to BossMan's gateway profile only
- No other agent profile (LBC35, ops, builder) has `computer_use` in their `toolsets` list
- OpenClaw agents use a different tool path (their own MCP servers)
- The Computer Use backend (`cua_backend.py`) has no multi-agent locking — ownership is enforced by config, not by the code

To verify isolation:
```bash
grep -n "computer.use\|computer_use" ~/.hermes/config.yaml
# Should only show in BossMan's profile section
```