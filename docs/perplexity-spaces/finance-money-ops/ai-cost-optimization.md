# AI Cost Optimization — Model Layering Strategy

**Source:** OPERATING_BLUEPRINT.md (model stack policy), Phase 2 planning
**Status:** Active

---

## Model Stack (Primary to Fallback)

| Model | Role | When to Use | Cost Consideration |
|-------|------|------------|-------------------|
| **MiniMax 2.7** | Primary brain | Everything, all day | Lowest cost per token |
| **DeepSeek** | Analysis backup | MiniMax hits ceiling on complexity | Medium cost |
| **OpenAI** | Production text backup | Need clean production code/docs | Higher cost |
| **Claude** | Long-form reasoning backup | All models conflict or stall | Highest cost |

---

## Cost Optimization Rules

### Use MiniMax 2.7 for:
- Daily operations and routing decisions
- Routine task execution
- Telegram command interpretation
- Standard code generation
- Document drafting and review

### Escalate to DeepSeek for:
- Complex multi-step analysis
- System architecture decisions
- Phase planning with many dependencies

### Use OpenAI for:
- Production code (clean, well-documented)
- Final production docs
- When output needs to be immediately usable without editing

### Use Claude only for:
- All models conflicting or stalling
- Long-form reasoning that DeepSeek can't resolve
- Complex debugging where multiple hypotheses need evaluation

---

## Current Cost Issues (Phase 1 Findings)

### Broken jobs wasting tokens
- `money-morning-research` (5 AM) — has errors, likely wasting tokens on failed runs
- `morning-research-summary` (8 AM) — cascading failure from money-morning-research
- `daily-bot-catchup-logging` (2 PM) — timeout, wasting cron time

These broken jobs should be fixed or removed in Phase 6 to stop wasting AI credits.

---

## Cost Monitoring

```bash
# Check MiniMax usage (if available)
# Check DeepSeek usage (if available)
# Review cron job logs for failed runs

# Key metric: failed cron job = wasted tokens
# Fixing broken cron jobs = immediate cost savings
```

---

## Phase 6 Cost Actions

| Action | Expected Savings |
|--------|-----------------|
| Fix/remove `money-morning-research` | Stop wasted tokens on failed runs |
| Fix `morning-research-summary` | Stop cascading failure |
| Optimize/remove `daily-bot-catchup-logging` | Stop timeout waste |
| Migrate `poller.js` to efficient schedule | Reduce polling overhead |

---

## Model Selection by Task Type

| Task | Model | Why |
|------|-------|-----|
| Telegram routing | MiniMax 2.7 | Fast, low-cost, sufficient |
| Kanban card creation | MiniMax 2.7 | Simple task, no need for expensive model |
| Complex phase planning | DeepSeek | Multi-step analysis |
| Production code | OpenAI | Clean output quality |
| Debugging stall | Claude | Long-form reasoning |
| Daily cron briefings | MiniMax 2.7 | Routine, sufficient |

---

## Key Principle

> **Don't use expensive models for tasks cheap models can handle.**

MiniMax 2.7 is the workhorse. DeepSeek, OpenAI, and Claude are for when MiniMax isn't enough — not for every task.

---

## Related Files

- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — Model stack policy (v1.2, line 63-70)
- `~/.hermes/knowledge/PHASE2_PLANNING.md` — Phase 2 planning with cost considerations