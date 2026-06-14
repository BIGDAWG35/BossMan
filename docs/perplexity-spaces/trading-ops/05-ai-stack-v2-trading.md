# AI Stack v2 — Trading & Money Pipeline Context

**Version:** 2.0
**Date:** 2026-05-27
**Status:** Canonical

---

## Hardware Context

| Host | Role | Status |
|---|---|---|
| **Mac Studio M4 Max** (this machine) | Primary AI host — Ollama, Hermes, all production services | ✅ Active |
| Mac mini Intel | Deprecated | 🔒 Legacy |

**Mac Studio M4 Max:** M4 Max (16-core CPU, 40-core GPU, 128GB unified memory). All trading services run here.

---

## 8-Layer AI Stack v2

| Layer | Name | Model | Cost | When to Use |
|---|---|---|---|---|
| L1 | Control | MiniMax 2.7 | 💚 Free | Orchestration, routing, coordination |
| L2 | Search | Perplexity Pro | 💜 Sub | Live market research, live data, fact verification |
| L3 | Action | MiniMax 2.7 | 💚 Free | Terminal, file ops, browser QA, PM2 |
| L4 | Local | Ollama (local) | 🟢 Free | Drafts, local model inference |
| L5 | General Cloud | DeepSeek / OpenAI | 🟡 Low | Reasoning, coding, synthesis |
| L6 | Specialist Cloud | Claude / GPT-4o | 🟠 Pay | Architecture, high-stakes review |
| L7 | Delegated Execution | Sub-agents | Varies | Parallel verification |
| L8 | Knowledge | Local mirrors + Obsidian | 🟢 Free | Blueprints, learned facts |

---

## Trading-Specific Notes

### INTEL_GATE Clarification

**INTEL_GATE is a regime filter, NOT a hardware flag.** It controls whether trading intelligence is acted on:
- `INTEL_GATE=true` — regime conditions met, intelligence flows through
- `INTEL_GATE=false` — regime conditions not met, no trading signals processed

Do not confuse with hardware context. INTEL_GATE lives in `intelligence.json`.

### Primary Host

**Mac Studio M4 Max** is the primary host for all trading operations.
Mac mini Intel is legacy — do not use as reference for current trading architecture.

### Services

| Service | Port | Status |
|---|---|---|
| Binance Bot (CSdawgbot) | 8104 | ✅ Online |
| Money Pipeline | 8020 | ✅ Online |
| Crypto Tracker | 8020 | ✅ Online |

### Binance Bot Rules

- **PAPER_MODE=true** — no real capital at risk
- **INTEL_GATE** — regime filter, must be `true` before signals process
- Pre-trade hook required before live execution
- No live trading until Phase 11 with explicit Marcelo approval

---

## Money Pipeline Notes

- Research pipeline broken since ~2026-04-07
- Phase 8 addresses rebuild
- Money Pipeline and Binance Bot are SEPARATE systems — never merge

---

## Linked Docs

- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — trading phases
- `~/.hermes/spaces/ops-processes/services-map.md` — service ports
- `~/.hermes/spaces/trading-ops/binance-bot-config.md` — bot config
- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
