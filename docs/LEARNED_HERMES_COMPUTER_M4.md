# LEARNED: Hermes Computer Use — Mac Studio M4 Max Status

**Date:** 2026-05-28
**Hardware:** Mac Studio (Apple M4 Max)
**Status:** ✅ OPERATIONAL

## Components

### CuaDriver (Primary Computer Use Tool)

**Binary:** `/Users/bigdawg/.local/bin/cua-driver`
**Type:** Native macOS binary (compiled for this environment)
**Daemon:** Running via Unix domain socket

**Available tools (verified):**
- `capture` — screenshot with numbered element overlays
- `click`, `double_click`, `right_click`, `middle_click`
- `drag` — press-drag-release gesture
- `scroll` — directional scroll
- `type` / `press_key` / `hotkey`
- `screenshot` — ScreenCaptureKit screenshot
- `list_apps` — enumerate macOS apps
- `list_windows` — enumerate windows
- `get_window_state` — AX tree walk with element indices
- `page` — browser primitives (JavaScript, DOM query)
- `set_value` — set select/dropdown values
- `launch_app` — launch app without raising window
- `focus_app` — route input to app without raising
- `get_cursor_position`, `move_cursor`
- `get_recording_state`, `replay_trajectory`
- `check_permissions` — TCC permission status

**Health:** Daemon stable, no restart loop.

### Hermes Computer Use (Computer Use Tool in Hermes Agent)

The `computer_use` tool in Hermes Agent wraps CuaDriver. Configuration is at:
- Hermes config: `computer_use.*` settings
- Backend: CuaDriver Unix domain socket

**M4 Max compatibility:** ✅ Native support. Apple Silicon is the primary target for CuaDriver.

### Browser QA (Alternative)

Browser QA uses CDP (Chrome DevTools Protocol) to control a browser:
- **Brave** at `localhost:9222` — verified working (2026-05-28)
- **Perplexity** at `https://perplexity.ai` — verified accessible (2026-05-28)
- **CDP discovery:** Requires `--remote-debugging-port=9222` flag on the browser

**M4 Max compatibility:** ✅ Native support.

## TCC Permissions (Screen Recording + Accessibility)

`computer_use` requires:
- **Accessibility:** Required for `click`, `drag`, `scroll`, `type`, etc. (CGEvent posting)
- **Screen Recording:** Required for `screenshot`

On first use, macOS prompts for these. The CuaDriver `check_permissions` tool verifies current state.

If permissions are ever revoked:
1. System Settings → Privacy & Security → Accessibility → add cua-driver
2. System Settings → Privacy & Security → Screen Recording → add cua-driver

## Hermes Gateway + Computer Use

- **Hermes Gateway** (`ai.hermes.gateway`) — LaunchAgent running ✅
- **Computer Use ownership:** BossMan exclusively. No sub-agents invoke Computer Use without assignment.
- **No Intel-specific paths:** All tools are macOS-native, no x86_64-specific configurations

## Computer Use Sanity Test Checklist (Mac Studio M4 Max)

Run this checklist whenever Computer Use behavior seems wrong (stale output, actions not working, etc.).

### Step 1 — CuaDriver Health Check
```bash
bash ~/.hermes/scripts/cuadriver-health.sh check
```
Expected: `HEALTHY — all 4 layers operational`

### Step 2 — Direct CuaDriver Test
```bash
~/.local/bin/cua-driver list-apps 2>&1 | head -5
```
Expected: list of running apps

### Step 3 — Hermes Agent Computer Use (list_apps)
```python
from tools.computer_use.tool import handle_computer_use
r = handle_computer_use({'action': 'list_apps'})
```
Expected: `{"apps": [...], "count": N}` — no error

### Step 4 — Hermes Agent Computer Use (capture)
```python
r = handle_computer_use({'action': 'capture', 'mode': 'som'})
```
Expected: screenshot with numbered elements — no error

### Step 5 — type_text_chars Test
```bash
osascript -e 'tell application "TextEdit" to activate'
~/.local/bin/cua-driver type "hello world"
```
Expected: TextEdit receives "hello world" — `type_text_chars` confirmed working

### Step 6 — Browser CDP Check (if Brave/Perplexity automation needed)
```bash
curl -s http://localhost:9222/json/version
```
Expected: JSON with `"Browser": "Brave"` or similar

### If Something Fails

| Symptom | Likely Cause | Fix |
|---|---|---|
| `session not started` | Stale CuaDriver singleton | Self-heal should trigger; if repeated: `bash ~/.hermes/scripts/cuadriver-health.sh restart` |
| `type_text_chars` fails | Accessibility permission revoked | System Settings → Privacy → Accessibility → add cua-driver |
| `capture` returns empty | Screen Recording permission revoked | System Settings → Privacy → Screen Recording → add cua-driver |
| CuaDriver daemon down | Daemon crashed | `launchctl kickstart -k gui/501/ai.hermes.gateway` then retry |
| CDP port 9222 not responding | Brave not running with debug flag | Restart Brave: `open -a "Brave Browser" --args --remote-debugging-port=9222` |

## Root Cause: type_text_chars Issue (Prior Session)

**Symptom:** `type_text_chars` error preventing URL bar input and Space UI updates.

**Root cause:** CuaDriver daemon was restarted (or crashed/replaced) while the Hermes gateway's backend singleton (`_backend`) was still holding a reference to the old daemon instance. The MCP session became stale.

**Self-heal mechanism:** `tools/computer_use/tool.py` has a circuit breaker in the exception handler that detects "session not started" on a live `_backend` singleton, resets it, and retries once automatically. This resolved the issue without manual intervention.

**Permanent fix in place:** ✅ The self-heal code is active in `tool.py`. A stale daemon restart will self-heal within a single tool call.

**If self-heal doesn't trigger:** Manual fix — restart CuaDriver:
```bash
bash ~/.hermes/scripts/cuadriver-health.sh restart
```

## Known Limitations

1. **Vision model not supported:** `computer_use(action='capture', mode='vision')` reports "provider does not support image input" — MiniMax doesn't support image inputs
2. **Safari WebDriver:** Not used — Brave + CDP is the working browser automation path
3. **Chrome CDP:** Default Chrome at localhost:9222 if Brave is not running

## Verdict

✅ **Hermes Computer Use is fully operational on Mac Studio M4 Max.**
- CuaDriver native to Apple Silicon
- Brave + Perplexity bridge verified working
- No Intel-specific workarounds needed
