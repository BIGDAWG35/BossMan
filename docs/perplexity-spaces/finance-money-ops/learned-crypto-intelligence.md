# Altus Forensic — Permanent Ownership Rule

**Source:** SOUL.md §"Altus Forensic — Permanent Ownership Rule" (moved 2026-07-22 per memory compaction canon)
**Status:** Permanent

## Overview

Altus Forensic is a legal document intelligence pipeline. Client: Allen & Claire.
Active project on Mac mini M4 Max — Stage 2 in progress (2026-05-23).

## Project Output Path (Permanent)

```
/Users/Shared/hermes_output/altus_forensic/
```

## Routing Rule (Permanent, 2026-05-23)

- All card completions, blockers, and questions → Perplexity Computer via Brave first
- Marcus (Telegram) receives final stage completion pings or decisions requiring Marcelo's approval only
- This rule survives session resets and applies to all projects on this Mac Mini

## Known Intel CPU Limitations

> **ARCHIVED 2026-09-16 — SUPERSEDED by `LEARNED_V3_TOKEN_ECONOMICS.md` §"Local-first fallback (Permanent 2026-09-14)".** Card `t_ollama_canon_reconcile_20260916`.
> Active Ollama primary is `qwen2.5:7b` on Apple Silicon M4 Max via arm64 Metal acceleration (NOT CPU inference). qwen2.5:7b is the live primary as of 2026-09-16. qwen2.5:3b and qwen2.5:14b are historical alt entries below; their notes remain as historical context for the original 2026-07-25 Altus forensic.

- `qwen2.5:14b` — too slow for CPU inference (historical; not in active rotation)
- `qwen2.5:3b` — prompt ceiling ~1,500 chars above which model times out (historical; not in active rotation)
- `qwen2.5:7b` — **active primary as of 2026-09-16**; arm64 Metal-accelerated on M4 Max; replaces the 3b/14b CPU-only options
