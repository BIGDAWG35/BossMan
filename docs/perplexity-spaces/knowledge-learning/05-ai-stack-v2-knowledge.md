# AI Stack v2 — Knowledge & Learning Systems

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

## Knowledge Storage Hierarchy

| Tier | Storage | Use For |
|---|---|---|
| T1 | `memory` tool | Marcelo's preferences, corrections, env facts (~2200 char limit) |
| T2 | `~/.hermes/knowledge/` | Durable docs, project context, LEARNED_*.md |
| T3 | `~/Desktop/CLAW-Backup/` | Obsidian vault reference blueprints |
| T4 | `BIGDAWG35/BossMan/` | GitHub durable blueprints |

---

## Knowledge Workflow

1. **Learn** — session_search for past context, file tools for docs
2. **Save** — memory tool (prefs), skills (workflows), knowledge files (durable facts)
3. **Retrieve** — session_search, memory, file tools
4. **Verify** — read back before citing as fact

### Memory Tag System

| Tag | Use For |
|---|---|
| `[DECISION]` | Architectural choices, routing decisions |
| `[ARCHITECTURE]` | System design, service topology |
| `[SECURITY]` | Auth, vulnerabilities, hardening |
| `[WORKFLOW]` | Process improvements, automation |
| `[TRADING]` | Binance signals, market analysis |
| `[PERFORMANCE]` | Speed, optimization |
| `[PREFERENCE]` | Marcelo's likes/dislikes |

---

## Knowledge Reuse Pipeline

When researching or learning something new:
1. Check `session_search` for prior context
2. Check relevant `LEARNED_*.md` files
3. Use Perplexity (Browser QA) for live web research
4. Use Ollama for local draft iterations
5. Save findings to the correct tier immediately
6. Verify write before moving on

---

## Linked Docs

- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — memory system rules
- `~/.hermes/spaces/knowledge-learning/learned-index.md` — learned docs index
- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
