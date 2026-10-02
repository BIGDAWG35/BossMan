**Version:** v4 · **Date:** 2026-10-01 · **Status:** Current — space-only doc: this copy is the canon (edit here) — this file wins over any older file in this space.

# 00 — Current State (2026-10-01)

## System
- Host: Mac Studio M4 Max, 64 GB, arm64-native (Intel leftovers removed 2026-09-30/10-01; Ollama is a universal arm64 binary).
- Hermes Agent v0.21.5. 9 profiles: default, bossman, builder, content, loop-engineering, ops, qa-verification, trading, travel.
- BossMan is the only orchestrator and the only status surface. Authority: Marcelo → BossMan → sub-agents; reports go back up the same way.
- LBC35 / OpenClaw: RETIRED and removed 2026-09-30. Delegation = BossMan via kanban + `~/.hermes/bin/route-card.sh`. Any LBC35 mention elsewhere is history.
- Control surfaces: Telegram (Macs) and Discord (iPhone/iPad), both via the default gateway (multiplex). Perplexity → BossMan via `~/.hermes/perplexity-intake/` (outbox → inbox).

## Models
| Use | Model |
|---|---|
| Default | MiniMax-M3 (7 profiles; content + qa-verification use M2.7) |
| Content / QA | MiniMax M2.7 |
| Fallback chain (every profile) | M3 lanes: MiniMax-M3 → Ollama qwen3.5:35b-a3b-nvfp4; M2.7 lanes (content, qa-verification): M2.7 → M3 → Ollama qwen3.5:35b-a3b-nvfp4 (~113 tok/s decode, 128K context; since 2026-10-02) |
| Bulk / cheap local | Ollama qwen2.5:7b / qwen2.5:3b — light pinned no-agent jobs only, never the automatic fallback |
| Crons + PM2 jobs | M3 or Ollama only — never paid |
| Build (paid, card only) | OpenAI gpt-5.5 (Codex OAuth again after 2026-10-16) |
| Architecture + money paths (paid, card only) | Claude Sonnet 4.6 |
| QA / review / troubleshooting escalation (paid, card only) | DeepSeek v4-pro |
| Free public research (card lane `research-public`) | Gemini 3.1 Flash-Lite, free tier, 400/day guard — waiting on Marcelo's no-billing key |
| Grok | Skipped |

Paid rules: paid models only through route-card.sh cards; reuse pre-flight first (LEARNED_* docs, BUILD_LIBRARY.md, past cards); every paid card ends with a LEARNED:/ARTIFACT: line; if a paid provider runs out, work drops to M3 then Ollama and keeps going.

## Memory
- memory_char_limit = 3000 in every profile; all MEMORY.md files under cap (QA 2026-10-01). Backups: `~/backups/md-audit-20261001/before/`.

## Services
- 17 PM2 apps online. Travel OS = port 3537 (leave alone). PMD web = 7575 on all interfaces. SquarePayouts (8030) is an ACTIVE revenue project (LEARNED_SQUAREPAYOUTS_ACTIVE.md); the app is in private QA and the process is not running right now. Health OS deleted 2026-09-30. Full table: "Services Map.md" (System Health / Ops Processes / Toolchain).
- Crons: 37 enabled / 44 unique (re-verified 2026-09-30) + new weekly Binance learning review (pending registration, see Trading Ops).

## Binance bot (summary)
Binance bot (binance-bot-live, Binance.US SPOT, port 8104) went LIVE 2026-10-01 02:01 PT with Marcelo's written approval. Paper mode is off. Free USDT at start: $250.59.

## This space
Cross-space policies (routing, models, memory, automation inventory, separation rules). Same canon as Agent OS.

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
