# AI Stack v2 — Finance, Money Pipeline & Trading Context

**Version:** 2.0
**Date:** 2026-05-27
**Status:** Canonical

---

## Hardware Context

| Host | Role | Status |
|---|---|---|
| **Mac Studio M4 Max** (this machine) | Primary AI host — Ollama, Hermes, all production services | ✅ Active |
| Mac mini Intel | Deprecated | 🔒 Legacy |

---

## 8-Layer AI Stack v2

| Layer | Name | Model | Cost | When to Use |
|---|---|---|---|---|
| L1 | Control | MiniMax 2.7 | 💚 Free | Orchestration, routing, coordination |
| L2 | Search | Perplexity Pro | 💜 Sub | Live market research, fact verification |
| L3 | Action | MiniMax 2.7 | 💚 Free | Terminal, file ops, browser QA, PM2 |
| L4 | Local | Ollama (local) | 🟢 Free | Drafts, iterations, local inference |
| L5 | General Cloud | DeepSeek / OpenAI | 🟡 Low | Reasoning, coding, synthesis |
| L6 | Specialist Cloud | Claude / GPT-4o | 🟠 Pay | Architecture, high-stakes review |
| L7 | Delegated Execution | Sub-agents | Varies | Parallel verification |
| L8 | Knowledge | Local mirrors + Obsidian | 🟢 Free | Blueprints, learned facts |

---

## Finance & Trading Tool Routing

| Task | Tool |
|---|---|
| Live market data, research | Browser QA → Perplexity.ai |
| Service health (Money Pipeline, Binance Bot) | Terminal |
| localhost web app QA | Browser QA |
| Local model inference | Ollama via terminal |
| macOS native UI | Computer Use |

---

## Money Pipeline Status

- **Money Pipeline** (port 8020): ✅ Online
- Research pipeline broken since ~2026-04-07 — Phase 8 addresses rebuild
- Money Pipeline and Binance Bot are SEPARATE systems

## Trading Rules

- **PAPER_MODE=true** — no real capital at risk
- **INTEL_GATE** — regime filter (controls whether intelligence is processed)
- No live trading until Phase 11 with explicit Marcelo approval
- All trading strategy requires backtesting evidence

---

## Linked Docs

- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
- `~/.hermes/spaces/trading-ops/05-ai-stack-v2-trading.md` — trading-specific version
- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — trading phases
