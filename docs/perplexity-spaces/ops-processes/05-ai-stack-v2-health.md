# AI Stack v2 — Ops & System Health Context

**Version:** 2.0
**Date:** 2026-05-27
**Status:** Canonical

---

## Hardware Context

| Host | Role | Status |
|---|---|---|
| **Mac Studio M4 Max** (this machine) | Primary AI host — Ollama, Hermes, all production services | ✅ Active |
| Mac mini Intel | Deprecated | 🔒 Legacy |

**Mac Studio M4 Max:** M4 Max, 128GB unified memory. Ollama running locally. All revenue services online.
**Mac mini Intel:** Deprecated — do not use as current reference.

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
| L7 | Delegated Execution | Sub-agents | Varies | Parallel verification, deep-dive sub-tasks |
| L8 | Knowledge | Local mirrors + Obsidian | 🟢 Free | Persistent context, blueprints |

---

## Ops-Specific Health Status (Mac Studio M4 Max)

### Services on This Host

| Service | Port | Status |
|---|---|---|
| BakeryOps | 3001 | ✅ Online |
| SquarePayouts | 3100 | ✅ Online |
| Money Pipeline | 8020 | ✅ Online |
| Binance Bot | 8104 | ✅ Online |
| Client Hub | PM2 | ✅ Online |

### Health Monitor (PM2 Cron — job d4f07e0c180f)

**Every 5 min:** `~/.hermes/scripts/pm2-health-monitor.sh`
**Monitored:** `binance-bot` | `squarepayouts` | `money-pipeline`
**Alert rules:**
- Silent when healthy
- Auto-fix on down (restart silently)
- ✅ FIXED — one message on auto-recovery
- 🚨 NEEDS ATTENTION — one message if auto-restart fails
- No duplicates (lockfile per service)

### CuaDriver / Computer Use Health

- **CuaDriver daemon:** ✅ Operational
- **Hermes Computer Use:** ✅ Operational (4-layer health monitor active)
- **Perplexity in Brave:** ✅ Working via Browser QA
- **Perplexity desktop app:** ⚠️ Zero-bounds bug — use Brave instead

### Known Issues (Historical)

| Issue | Status | Fix |
|---|---|---|
| Intel Mac mini Ollama degraded | Resolved | Mac Studio M4 Max is now primary host |
| CuaDriver restart loop | Resolved | 4-layer health monitor + auto-heal script |
| PM2 env vars not updating on restart | Resolved | `pm2 stop && pm2 start` now used (not `pm2 restart`) |
| Perplexity desktop app zero-bounds | Known | Use Brave browser via Computer Use instead |

---

## Ops Tool Stack

| Task | Tool |
|---|---|
| Service health, PM2, logs | Terminal |
| Web research | Browser QA → perplexity.ai |
| macOS native UI / settings | Computer Use (CuaDriver) |
| localhost web app QA | Browser QA |
| Local model inference | Ollama via terminal |
| Document updates | File tools + local mirrors |

---

## Linked Docs

- `~/.hermes/knowledge/SERVICES_MAP.md` — full service inventory
- `~/.hermes/spaces/ops-processes/services-map.md` — service ports and status
- `~/.hermes/spaces/shared/AI_STACK_V2_SUMMARY.md` — shared master copy
