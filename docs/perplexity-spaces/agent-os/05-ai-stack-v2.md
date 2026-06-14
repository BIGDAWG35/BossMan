# AI Stack v2 — Hermes & Mac Studio M4 Max

**Version:** 2.0
**Date:** 2026-05-27
**Source:** BossMan (Mac Studio M4 Max, Hermes primary orchestrator)
**Status:** Canonical — governs all AI routing decisions

---

## Hardware Context

| Host | Role | Status |
|---|---|---|
| **Mac Studio M4 Max** (this machine) | Primary AI host — Ollama, Hermes, all production services | ✅ Active |
| Mac mini Intel (legacy) | Deprecated — reference only | 🔒 Legacy |

**Mac Studio M4 Max specs:**
- Apple M4 Max (16-core CPU, 40-core GPU, 128GB unified memory)
- Ollama running locally — all local models fully operational
- All revenue services running: Binance bot (8104), Money Pipeline (8020), SquarePayouts (8030), BakeryOps (8040)

**Mac mini Intel** (legacy, no longer primary):
- Intel-based Mac mini — previously hosted Ollama and various services
- Now deprecated — do not use as reference for current architecture
- Some legacy docs still reference it; treat as historical only

---

## 8-Layer AI Stack v2

| Layer | Name | Model | Cost | When to Use |
|---|---|---|---|---|
| **L1** | Control | MiniMax 2.7 | 💚 Free | Orchestration, routing, coordination — default first layer |
| **L2** | Search | Perplexity Pro | 💜 Subscription | Live web research, fact verification, Deep Research |
| **L3** | Action | MiniMax 2.7 | 💚 Free | Terminal, file ops, browser QA, PM2, cron |
| **L4** | Local | Ollama (local) | 🟢 Free | Local inference, drafts, iterations, code review |
| **L5** | General Cloud | DeepSeek / OpenAI | 🟡 Low-cost | Reasoning backup, coding, synthesis |
| **L6** | Specialist Cloud | Claude / GPT-4o | 🟠 Pay-per-use | Architecture, high-stakes review, structured planning |
| **L7** | Delegated Execution | Sub-agents | Varies | Parallel verification, deep-dive sub-tasks |
| **L8** | Knowledge | Local mirrors + Obsidian | 🟢 Free | Persistent context, blueprints, learned facts |

### Model Priority for Diagnosis & Remediation

**For reasoning, diagnosis, implementation decisions, and fix planning:**
1. **Claude** — primary decision reasoner
2. **DeepSeek** — secondary reasoning / synthesis
3. **OpenAI** — tertiary / structured output

**MiniMax 2.7 BLOCKED as primary decision-maker for remediation.**
For non-trivial incidents, require **at least 2 of Claude/DeepSeek/OpenAI to agree** on fix path before executing.

### Cost Tiers (ascending)

1. **Cache** — MiniMax 2.7 with hot-cache responses (free, fast)
2. **Local / Ollama** — Zero cost, full privacy, runs on Mac Studio M4 Max
3. **MiniMax** — Direct API calls (cache miss or streaming)
4. **DeepSeek / OpenAI** — Low-cost reasoning and synthesis
5. **Claude / GPT-4o** — Pay-per-use, for high-stakes only
6. **Perplexity Computer** — Mac app or Brave via Computer Use (subscription + automation cost)

### Routing Decision Tree

```
Task arrives
    ↓
Is it live web research / fact check? → L2 Perplexity
    ↓ No
Is it a terminal / file / browser action? → L3 MiniMax
    ↓ No
Is it a draft / local inference / iteration? → L4 Ollama (local)
    ↓ No
Is it reasoning / coding / technical analysis? → L5 DeepSeek / OpenAI
    ↓ No
Is it architecture / high-stakes planning / review? → L6 Claude / GPT-4o
    ↓ No
Is it a parallel deep-dive sub-task? → L7 Sub-agents
    ↓
Everything starts at L1 MiniMax — escalate as needed
```

---

## Tool Routing (vs AI Model Routing)

| Task | Tool |
|---|---|
| Web research, live data | Browser QA → Perplexity.ai |
| Localhost web app QA | Browser QA |
| macOS System Settings, native UI | Computer Use (CuaDriver) |
| Terminal, CLI, DB, PM2, git | Terminal (direct) |
| Local model inference | Ollama via terminal |
| Space updates, document edits | File tools + local mirrors |

---

## Key Rules

**MiniMax 2.7 is BLOCKED for SquarePayouts** — use Claude/DeepSeek/OpenAI only for that product.

**Local Ollama is PREFERRED for drafts** — zero cost, fast, private. Use cloud models for final outputs or when local models can't handle the task.

**Perplexity is the default research layer** — Browser QA to `perplexity.ai` for live facts, vendor research, and Deep Research.

**Mac Studio M4 Max is the canonical host** — all production services, Ollama, and Hermes run here. Mac mini Intel is legacy.

---

## Perplexity as Default Communication Channel

**Perplexity is the default conversational interface for BossMan ↔ Marcelo.**

**Canonical Space:** "Projects & Mission Control Active Projects Status"
**Canonical Thread:** This active thread

**Communication pattern:**
```
BossMan ↔ AI Stack ↔ Perplexity Search → Marcelo
```

**Flow:**
1. BossMan detects issue or request
2. BossMan + Perplexity converge using Claude/DeepSeek/OpenAI reasoning
3. BossMan executes fix autonomously
4. BossMan verifies
5. Only then — concise report to Marcelo via Perplexity

**What goes to Marcelo via Perplexity:**
- What broke + what was done + current status
- Approval requests with specific reason (security/architecture/major-change only)

**What does NOT go to Marcelo:**
- Raw diagnostic noise, half-baked guesses, commands to run, browser workarounds

---

## Linked Reference Docs

- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — full system architecture
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — operational procedures
- `~/.hermes/spaces/ops-processes/services-map.md` — service port map
- `~/.hermes/knowledge/SERVICES_MAP.md` — service inventory
