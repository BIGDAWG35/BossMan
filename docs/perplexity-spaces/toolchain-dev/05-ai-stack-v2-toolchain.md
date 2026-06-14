# AI Stack v2 — Toolchain & Dev Context

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
| L2 | Search | Perplexity Pro | 💜 Sub | Live web research, fact verification |
| L3 | Action | MiniMax 2.7 | 💚 Free | Terminal, file ops, browser QA, PM2, cron |
| L4 | Local | Ollama (local) | 🟢 Free | Drafts, iterations, local inference |
| L5 | General Cloud | DeepSeek / OpenAI | 🟡 Low | Reasoning, coding, synthesis |
| L6 | Specialist Cloud | Claude / GPT-4o | 🟠 Pay | Architecture, high-stakes review |
| L7 | Delegated Execution | Sub-agents | Varies | Parallel verification |
| L8 | Knowledge | Local mirrors + Obsidian | 🟢 Free | Blueprints, learned facts |

---

## Dev Tool Routing

| Task | Tool |
|---|---|
| Local code/CLI/DB inspection | Terminal |
| Web research, live data | Browser QA → perplexity.ai |
| Localhost web app QA | Browser QA |
| macOS native UI / settings | Computer Use (CuaDriver) |
| Local model inference | Ollama via terminal |
| Code review, drafts | Ollama (L4) → DeepSeek (L5) |
| Architecture, high-stakes review | Claude/GPT-4o (L6) |

---

## Dev-Specific Notes

- **Local Ollama preferred for drafts** — zero cost, fast, private
- **DeepSeek/OpenAI for coding** — low-cost reasoning
- **Claude for architecture** — pay-per-use, high-stakes only
- **SquarePayouts: MiniMax BLOCKED** — use Claude/DeepSeek/OpenAI only

---

## Linked Docs

- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — full architecture
