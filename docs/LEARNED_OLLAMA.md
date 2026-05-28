# LEARNED: Ollama on Mac Mini Intel

## Status: DEGRADED (2026-05-27)

## Issue

Ollama v0.20.2 is installed and the daemon is **running** (PID 1421, `ollama serve` active, port 11434 listening).

However, the **Ollama REST API is unresponsive** — requests to `http://localhost:11434/api/generate` hang and time out. This is an environmental issue specific to this Intel Mac mini.

## Symptoms

- `ollama serve` daemon: running ✅
- Port 11434: listening ✅
- `curl -X POST http://localhost:11434/api/generate` — hangs, no response
- `nc localhost 11434` — hangs (not a port connectivity issue, it's Ollama's API layer)
- `/usr/local/bin/ollama list` — exit code 127 (ollama CLI can't reach the daemon)

## Impact

- **Tier 2 (Local) is currently unavailable** for inference tasks
- Fallback path: use Tier 3 (MiniMax 2.7) or Tier 4 (DeepSeek/OpenAI) for tasks that would have used Ollama
- This does NOT affect: Ollama model files stored locally, `ollama pull` operations, or Ollama app UI

## Possible Causes

- Intel Mac mini CPU architecture — Ollama's GGML/llama.cpp backend may have issues with this specific Intel CPU
- Network stack on this Mac mini (Intel vs ARM)
- Ollama version 0.20.2 may have a regression for Intel

## Actions Taken

- Ollama daemon confirmed running
- Failover confirmed: MiniMax 2.7 (Tier 3) is operational as the fallback
- Router now knows: Ollama Tier 2 is DEGRADED on this machine

## Resolution

TBD — needs investigation when:
- A new Ollama version is released
- Or use `OPENAI_API_KEY` with OpenAI as the fallback for Tier 2-equivalent tasks
- Or try a different local model serving approach

## Routing Implication

Until Ollama is fixed, upgrade Tier 2 tasks directly to Tier 3 (MiniMax) or Tier 4 (DeepSeek):
- Summaries → MiniMax 2.7
- Drafts → MiniMax 2.7
- First-pass code → DeepSeek (low-cost)
- Extraction → MiniMax 2.7
