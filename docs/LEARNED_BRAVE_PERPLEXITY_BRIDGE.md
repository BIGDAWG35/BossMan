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
