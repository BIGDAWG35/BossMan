# CHANGES — Spaces v4 (2026-10-01)

## What changed
- Every space now starts with "00 - Current State (2026-10-01).md": the stack, models, memory, services, and the Binance bot as of today. It overrides older files.
- Files are rebuilt from canon (`~/.hermes/knowledge/`) wherever canon exists. The old copies with " — v3" suffixes are gone, and the names are plain titles.
- Removed the repeated LBC35 "RETIRED" banners. One short note at the top of each file now says LBC35/OpenClaw mentions are history.
- Models: the fallback is MiniMax M3 → Ollama qwen3.8:27b everywhere. Gemini is free-tier research only and waiting on a key. Grok is skipped. Paid models are used only through cards.
- Services Map v4 is rebuilt from the Boss Hub registry and PM2 (17 apps). It lists 5 stale registry entries.
- Trading Ops has a new "Binance Bot - Current State.md": live config, risk rules, free-model pipeline, learning loop, and the bugs fixed. The old LEARNED file is kept as history.
- Travel OS port fixed to 3537 wherever an old file said 3535 (history lines kept).

## Removed (superseded or retired)
- Model Routing Workflow (Agent OS) and Model Routing Workflow — Money section (Finance): replaced by Paid Model Routing + Model Stack. They used a DeepSeek model that does not exist.
- Hermes Model Policy (Shared): replaced by Model Stack (V3 canonical). It had a stale fallback chain.
- Travel OS Remote Access Resolved 2026-07-22 (Ops Processes): the incident is closed; port 3537 is canonical.
- Health OS docs: Health OS was deleted 2026-09-30.
- The old Services Map "Obsidian live mirror" copies: replaced by Services Map v4.


## v4.1 — 2026-10-02 (model switch)
- Local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s decode) in all 9 profiles. `qwen3.8:27b` was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only.
- MiniMax M3 stays the primary everywhere; api_max_retries = 5 so a MiniMax 529 "high load" burst retries before falling back.
- The 9 agent crons that were on qwen2.5:7b (32K, below the 64K compression minimum) now run on `qwen3.5:35b-a3b-nvfp4`.
- Binance free-LLM chain (`scripts/_llm_free.js`): MiniMax-M3 -> `qwen3.5:35b-a3b-nvfp4` -> qwen2.5:7b.
- Every "Fallback chain" row in the 00 - Current State files, Model Stack, Services Map, Paid Model Routing and Token Economics was updated, with a dated note.
