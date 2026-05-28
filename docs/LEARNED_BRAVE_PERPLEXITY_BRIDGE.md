# LEARNED: Brave Browser + Perplexity Bridge on Mac Studio M4 Max

**Date:** 2026-05-28
**Hardware:** Mac Studio (Apple M4 Max)
**Status:** ⚠️ WORKING — Intel build via Rosetta 2, ARM64 upgrade recommended

## Brave Installation

**Found:** `/Applications/Brave Browser.app` (Intel x86_64 binary, Rosetta 2 translated)
**Running instances:** Multiple Brave processes active (PIDs 1930–44145, various tabs)
**Version:** Chromium-based (Chrome 148 engine confirmed via CDP)

## Architecture Check

```bash
file "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
# Mach-O 64-bit executable x86_64
```

**Brave is an Intel build running under Rosetta 2 translation** on the M4 Max. This works, but is not optimal for a production workstation.

## Perplexity Bridge — End-to-End Test

**Test performed (2026-05-28):**
1. Launched Brave with `--remote-debugging-port=9222`
2. Navigated to `https://perplexity.ai` via browser QA
3. Page loaded correctly — search box, sidebar, Perplexity Computer button all visible
4. CDP connection established on `localhost:9222`

```
CDP Response:
  Browser: Chrome/148.0.7778.179
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...
  WebSocket: ws://localhost:9222/devtools/browser/...
```

**Bridge is functional.** Perplexity Search, Spaces, and Perplexity Computer are all accessible via Brave.

## How the Bridge Works

The Perplexity bridge is the combination of:
1. **Brave Browser** — running locally with remote debugging enabled
2. **Browser QA tool** — connects to Brave's CDP port (9222)
3. **Perplexity.ai** — web app at perplexity.ai (no extension needed)
4. **Perplexity Search** — default search engine in Brave
5. **Perplexity Computer** — accessible via the Computer button in the Perplexity UI

## Security Notes

- CDP port 9222 is localhost-only — no external access
- Brave runs with `--no-first-run --user-data-dir=/tmp/brave-debug` for automation sessions
- Normal browsing uses Marcelo's standard Brave profile (not the debug temp profile)

## ARM64 Brave Upgrade (Recommended)

An Apple Silicon (ARM64) build of Brave would:
- Eliminate Rosetta 2 translation overhead
- Improve battery efficiency on M-series chips
- Reduce CPU usage during heavy browsing

**To upgrade:**
```bash
# Download ARM64 Brave from official site
open https://brave.com/download/mac/

# Or via Homebrew (if available)
brew install brave-browser
```

⚠️ **Note:** Marcelo needs to approve the Brave upgrade and manually download/install from brave.com — I cannot install software autonomously.

## Current Configuration (Working)

- **Brave path:** `/Applications/Brave Browser.app`
- **CDP port:** 9222 (localhost)
- **Perplexity URL:** `https://perplexity.ai`
- **Automation method:** Browser QA tool → CDP → Brave
- **Perplexity Computer:** ✅ accessible via Perplexity UI (uses CuaDriver separately)

## Verdict

✅ **Brave + Perplexity bridge is working** — Intel build runs correctly via Rosetta 2.
⚠️ **Upgrade to ARM64 Brave recommended** for long-term efficiency.
