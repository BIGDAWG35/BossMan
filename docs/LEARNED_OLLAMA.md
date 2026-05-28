# LEARNED: Ollama on Mac Studio (Apple M4 Max)

## Status: ✅ OPERATIONAL (2026-05-28)

## Hardware Context

**Primary host:** Mac Studio (Apple M4 Max, 16 cores, 64 GB RAM)
**Prior host:** Intel Mac mini (historical — see History note at bottom)

Ollama runs natively on Apple Silicon with **Metal GPU acceleration** — no compatibility layer needed, no GGML/AVX2 issues. This is the expected stable configuration for Tier 2 local inference.

## Current Status (2026-05-28)

| Check | Result |
|---|---|
| Daemon running | ✅ PID 1421, `/Applications/Ollama.app/Contents/Resources/ollama serve` |
| Port 11434 | ✅ Listening |
| REST API | ✅ Responsive — `curl` to `/api/generate` returns in ~1–5s |
| Models available | ✅ `qwen2.5:3b` (1.9 GB), `qwen2.5:14b` (9.0 GB) |
| Metal acceleration | ✅ Native on M4 Max |

## Installed Models

```
NAME           ID              SIZE      MODIFIED
qwen2.5:3b     357c53fb659c    1.9 GB    4 days ago
qwen2.5:14b    7cdf5a0187d5    9.0 GB    5 days ago
```

## API Usage

```bash
# Test a model (non-streaming)
curl -s -X POST http://localhost:11434/api/generate \
  -d '{"model":"qwen2.5:3b","prompt":"say hello in 3 words","stream":false}'

# Check available models
ollama list

# Pull a model
ollama pull qwen2.5:14b

# Run interactively
ollama run qwen2.5:3b "summarize this: ..."
```

## Tier 2 Routing — When to Use Ollama

Use Ollama (Tier 2) for:
- **Summaries** — zero cost, acceptable quality, data stays local
- **Drafts** — repeatability, no external exposure
- **Extraction** — JSON structuring from local data
- **Cleanup / formatting** — formatting, rephrasing, local files
- **First-pass code** — acceptable for well-defined functions
- **Private tasks** — any data that should not leave the machine

Escalate to Tier 3 (MiniMax) or Tier 4 (DeepSeek/Claude) if:
- Local model output is not acceptable quality
- Task requires live internet data
- Reasoning beyond local model capability is needed

## Historical Note (Intel Mac mini — DEPRECATED)

> ⚠️ **This section is historical only.** The following describes the environment on the prior Intel Mac mini (before 2026-05-28), where Ollama's REST API was unresponsive due to environmental/compatibility issues. This is no longer relevant.

On the Intel Mac mini, Ollama v0.20.2 daemon was running but the REST API layer hung — `curl` requests to `/api/generate` timed out, `ollama list` returned exit code 127, and `nc localhost 11434` hung. Root cause was suspected to be GGML/llama.cpp compatibility with the Intel CPU architecture. Tier 2 tasks were routed to MiniMax (Tier 3) as a workaround.

**This workaround is no longer needed on the Mac Studio.**
