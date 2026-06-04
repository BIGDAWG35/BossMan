# AI Stack v2 — Hermes & Mac Studio M4 Max

**Version:** 2.0
**Date:** 2026-05-27
**Status:** Canonical

---

## Hardware Context

| Host | Role | Status |
|---|---|---|
| **Mac Studio M4 Max** (this machine) | Primary AI host — Ollama, Hermes, all production services | ✅ Active |
| Mac mini Intel (legacy) | Deprecated — reference only | 🔒 Legacy |

**Mac Studio M4 Max:** M4 Max (16-core CPU, 40-core GPU, 128GB unified memory). Ollama running locally. All revenue services online.

**Mac mini Intel** — deprecated. Some legacy docs still reference it; treat as historical only.

---

## 8-Layer AI Stack v2

| Layer | Name | Model | Cost | When to Use |
|---|---|---|---|---|
| L1 | Control | MiniMax 2.7 | 💚 Free | Orchestration, routing, coordination — default |
| L2 | Search | Perplexity Pro | 💜 Sub | Live web research, fact verification, Deep Research |
| L3 | Action | MiniMax 2.7 | 💚 Free | Terminal, file ops, browser QA, PM2, cron |
| L4 | Local | Ollama (local) | 🟢 Free | Drafts, iterations, local inference |
| L5 | General Cloud | DeepSeek / OpenAI | 🟡 Low | Reasoning backup, coding, synthesis |
| L6 | Specialist Cloud | Claude / GPT-4o | 🟠 Pay | Architecture, high-stakes review, structured planning |
| L7 | Delegated Execution | Sub-agents | Varies | Parallel verification, deep-dive sub-tasks |
| L8 | Knowledge | Local mirrors + Obsidian | 🟢 Free | Persistent context, blueprints, learned facts |

### Cost Tiers

1. **Cache** — MiniMax 2.7 hot-cache (free, fast)
2. **Local/Ollama** — Zero cost, full privacy, Mac Studio M4 Max
3. **MiniMax** — Direct API (cache miss)
4. **DeepSeek / OpenAI** — Low-cost reasoning
5. **Claude / GPT-4o** — Pay-per-use, high-stakes only
6. **Perplexity Computer** — Subscription + automation cost

### Routing Decision Tree

```
Task → Live web research? → L2 Perplexity
     → Terminal/file/browser action? → L3 MiniMax
     → Draft/local inference? → L4 Ollama
     → Reasoning/coding/analysis? → L5 DeepSeek/OpenAI
     → Architecture/high-stakes review? → L6 Claude/GPT-4o
     → Parallel deep-dive? → L7 Sub-agents
     → Everything starts at L1 MiniMax — escalate as needed
```

---

## Tool Routing

| Task | Tool |
|---|---|
| Web research, live data | Browser QA → perplexity.ai |
| Localhost web app QA | Browser QA |
| macOS System Settings, native UI | Computer Use (CuaDriver) |
| Terminal, CLI, DB, PM2, git | Terminal |
| Local model inference | Ollama via terminal |
| Space updates, document edits | File tools + local mirrors |

---

## Key Rules

- **MiniMax 2.7 BLOCKED for SquarePayouts** — use Claude/DeepSeek/OpenAI only
- **Ollama PREFERRED for drafts** — zero cost, fast, private
- **Perplexity is default research layer** — Browser QA for live facts
- **Mac Studio M4 Max is canonical host** — Mac mini Intel is legacy

---

## Space Instructions (for this Space)

When working in this Space:
- BossMan/Hermes is the orchestrator — routes all work
- Perplexity Search + local Ollama for first-pass work
- Escalate to MiniMax → DeepSeek/OpenAI → Claude following the routing tree
- Mac Studio M4 Max is the reference host (not Mac mini Intel)
- All canonical docs live in local mirrors: `~/.hermes/spaces/agent-os/`

---

## Linked Docs

- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — full architecture
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — operational procedures
- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
