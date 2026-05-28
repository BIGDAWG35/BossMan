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

## Known Limitations

1. **Vision model not supported:** `computer_use(action='capture', mode='vision')` reports "provider does not support image input" — MiniMax doesn't support image inputs
2. **Safari WebDriver:** Not used — Brave + CDP is the working browser automation path
3. **Chrome CDP:** Default Chrome at localhost:9222 if Brave is not running

## Verdict

✅ **Hermes Computer Use is fully operational on Mac Studio M4 Max.**
- CuaDriver native to Apple Silicon
- Brave + Perplexity bridge verified working
- No Intel-specific workarounds needed
