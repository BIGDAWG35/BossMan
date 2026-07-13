# LEARNED: Brave Browser + Perplexity Bridge on Mac Studio M4 Max

**Date:** 2026-05-28
**Hardware:** Mac Studio (Apple M4 Max)
**Status:** ✅ WORKING — Homebrew-managed Brave, profile preserved

## Brave Installation — Migration Complete

**Migration (2026-05-28):**
1. Old app: `/Applications/Brave Browser.app` (Intel x86_64, original Brave install)
2. Profile data: `~/Library/Application Support/BraveSoftware/Brave-Browser/` — **preserved, not touched**
3. New app: `/Applications/Brave Browser.app` (Homebrew-managed, same x86_64 version 1.90.124.0)
4. Profile data: **verified intact** — Bookmarks, Wallet, AI Chat, Account Web Data all present

**Profile preserved:**
- `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/Bookmarks` ✅
- `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/BraveWallet/` ✅
- `~/Library/Application Support/BraveSoftware/Brave-Browser/Default/AIChat/` ✅
- Marcelo's Perplexity history (cello35 account) visible in Perplexity sidebar ✅

## Architecture

```bash
file "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
# Mach-O 64-bit executable x86_64

lipo -info "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
# Non-fat file: /Applications/Brave Browser.app/Contents/MacOS/Brave Browser is architecture: x86_64
```

**Brave distributes a single macOS build (x86_64) that runs on both Intel and Apple Silicon Macs via Rosetta 2.** There is no separate ARM64 DMG from Brave.com — the same binary works on both architectures. Homebrew's cask installs this universal x86_64 build.

Version: Brave Browser **148.1.90.124** (latest via Homebrew as of 2026-05-28).

## Perplexity Bridge — End-to-End Test (2026-05-28)

**Test performed:**
1. Launched Brave with `--remote-debugging-port=9222`
2. Navigated to `https://perplexity.ai` via Browser QA
3. Page loaded correctly — search box, sidebar, Perplexity Computer button all visible
4. CDP connection established on `localhost:9222`
5. Marcelo's Perplexity history confirmed visible in sidebar (cello35 account)
6. Perplexity Spaces, Discover, Finance links all present and clickable

```
CDP Response:
  Browser: Chrome/148.0.7778.179
  User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
  V8-Version: 14.8.178.22
  Protocol-Version: 1.3
```

**Bridge is fully functional.** Perplexity Search, Spaces, and Perplexity Computer are all accessible via Brave with Marcelo's actual profile active.

## How the Bridge Works

The Perplexity bridge is the combination of:
1. **Brave Browser** — running locally with remote debugging enabled
2. **Browser QA tool** — connects to Brave's CDP port (9222)
3. **Perplexity.ai** — web app at perplexity.ai (no extension needed)
4. **Perplexity Search** — default search engine in Brave
5. **Perplexity Computer** — accessible via the Computer button in the Perplexity UI

## Security Notes

- CDP port 9222 is localhost-only — no external access
- Automation uses `--remote-debugging-port=9222 --no-first-run`
- Marcelo's actual Brave profile (`Default/`) is active during automation — not a temp profile

## ARM64 Note

Brave does not distribute a separate ARM64 macOS build. The single x86_64 binary runs via Rosetta 2 on Apple Silicon. This is the official build from Brave.com and Homebrew — no alternative exists at time of writing.

## Current Configuration (Working)

- **Brave path:** `/Applications/Brave Browser.app` (Homebrew-managed)
- **Version:** 148.1.90.124 (x86_64 via Rosetta 2)
- **CDP port:** 9222 (localhost)
- **Perplexity URL:** `https://perplexity.ai`
- **Profile:** Marcelo's actual profile preserved and active
- **Automation method:** Browser QA tool → CDP → Brave
- **Perplexity Computer:** ✅ accessible via Perplexity UI (uses CuaDriver separately)

## Verdict

✅ **Brave + Perplexity bridge is fully working with profile preserved.**
- Brave migrated to Homebrew successfully
- Profile data (bookmarks, wallet, history) intact
- Perplexity bridge verified end-to-end with Marcelo's actual profile
- No separate ARM64 Brave build exists — current build is correct

---

## 2026-06-19 Update — Browser QA / Perplexity via CDP (live, in pipeline)

**Important:** The 2026-05-28 section above describes the **CuaDriver / Hermes Computer Use** path. That path is **dead on this host** (CuaDriver returns zero-bounds, Perplexity desktop app has the same bug — see memory entry "Perplexity = Browser QA via CDP only"). The **new working path** uses raw WebSocket CDP against a **separate, isolated Brave instance** with its own user-data-dir.

### The CDP-driven path (current)

```bash
# 1. Launch isolated Brave on a separate CDP port (does NOT touch Marcelo's profile)
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/brave-debug \
  --no-first-run \
  --no-default-browser-check \
  --disable-features=Translate \
  about:blank > /tmp/brave-debug.log 2>&1 &

# 2. Node code connects via WebSocket and drives Perplexity
#    See: /Users/bigdawg/Projects/binance-bot/scripts/cdp_client.js
#    - openPerplexity(target)        -> creates a new tab
#    - queryPerplexity(prompt, opts) -> navigates to /search?q=<encoded>,
#                                       polls body, extracts answer
#    - poll heuristic: indexOf('sources') (NOT regex on [1] chips!)
```

### Pipeline integration

The CDP path is wired into `scripts/daily_research.js` as `--source browserqa`:

```bash
# Preferred path:
node scripts/daily_research.js --phase-b-all --source browserqa

# Fallback chain (per-symbol, automatic):
#   browserqa -> brave text search -> internal-only derivation
#   (never blocks; never fabricates external dims)
```

`scripts/daily_pipeline.sh` prefers `browserqa`; if the whole Phase B fails, the wrapper
runs `--source internal` as the last-resort degraded mode and logs a `stage_2_phase_b_source_tally`
event to `RUN_LOG` showing the source distribution for the run.

### Three traps that took real debugging to find

1. **No submit button.** Perplexity's Search mode has no visible submit button — typing
   + `form.requestSubmit()` does NOT trigger Perplexity's React submit handler. The
   reliable path is **navigate directly to** `https://www.perplexity.ai/search?q=<urlencoded>`.
   The SPA reads `?q=` and bootstraps straight into the answer view.
2. **Superscript citations, not [1] chips.** Polling must use
   `indexOf('Sources')` to detect a finished answer — the citations in the answer body
   are ¹²³ superscript characters, not bracketed `[1] [2] [3]`. Regex on `[1]` chips
   matches "d" instead.
3. **JSON.stringify doubles-escapes regex.** When a CDP `Runtime.evaluate` expression
   is wrapped in `JSON.stringify(evalResult)` and the expression contains a regex
   literal, `\\d` is double-escaped by the JSON wrapper and arrives at runtime as `\d`,
   which matches single characters like "d". Use `indexOf` instead of regex to avoid
   the escape game entirely.

### File map

| Path | Role |
|---|---|
| `/Users/bigdawg/Projects/binance-bot/scripts/cdp_client.js` | Raw WebSocket CDP client (no new deps) |
| `/Users/bigdawg/Projects/binance-bot/scripts/daily_research.js` | `--source browserqa` integration, `phaseB()` dispatch |
| `/Users/bigdawg/Projects/binance-bot/scripts/daily_pipeline.sh` | Preferred path + source-tally audit |
| `/Users/bigdawg/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md` | Stage 2/7 post-mortem (original capture) + 2026-06-19 Recovery note |
| `/Users/bigdawg/.hermes/knowledge/AUTOMATION_INVENTORY.md` | Cron + LaunchAgent inventory (header references this runbook) |

### Why an isolated profile?

Marcelo's actual Brave profile (`~/Library/Application Support/BraveSoftware/Brave-Browser/Default/`)
contains bookmarks, wallet, AI Chat history, and the `cello35` Perplexity account login.
A bot-driven tab that submits research queries should NOT share that profile state:
- logged-in sidebars pollute page text and confuse naive heuristics
- bot actions get mixed into Marcelo's browsing history
- concurrent automation can clobber open tabs

The isolated `/tmp/brave-debug` profile solves all three. Logged-in Perplexity state
is preserved in the main profile; the bot path uses a clean default-profile that the
user can also log into separately if human QA is needed.

### Verification

Smoke test (2026-06-19, BTCUSDT):
```
[browserqa] BTCUSDT OK (14228ms, 6406 chars)
Header: # Source: Perplexity Browser QA (via CDP, full synthesis)
TOKEN_LOG: source=perplexity_browser_qa, model=perplexity_search, ok=true
```

### Related decisions (D-12 / D-13 / D-14 / D-15 / D-16 / D-17)

- **D-12** Perplexity = internal derivation only when no CDP path
- **D-13** Two-layer USDT-symbol sanitization (defense in depth)
- **D-14** Cron silent-on-healthy delivery pattern
- **D-15** Source-labelling honesty in memo (3-way switch on `research.source`)
- **D-16** Perplexity has no submit button — Enter via real Input.dispatchKeyEvent OR direct URL `/search?q=...`
- **D-17** Poll with `indexOf('sources')`, not regex on citation chips
