# Hermes Memory Policy — Phase 2 Memory Automation
**Version:** 1.0
**Date:** 2026-05-22
**Owner:** BossMan
**Status:** IMPLEMENTED — Active

---

## Purpose

Define what, when, and how BossMan saves memory across Marcelo's Hermes operations.
This policy turns the blueprint's memory rules into a working, tested system.

---

## 4-Tier Storage Hierarchy

| Tier | Storage | Use For | Update Frequency |
|------|---------|---------|-----------------|
| **1 — Immediate** | `memory` tool (persistent, auto-injected) | User preferences, corrections, environment facts, tool quirks | On expression/discovery |
| **2 — Internal** | `~/.hermes/knowledge/` | Durable docs: learned patterns, system insights, project context | Within session |
| **3 — Obsidian** | `~/Desktop/CLAW-Backup/` | Reference blueprints, architecture docs, project records | On significant change |
| **4 — GitHub** | `BIGDAWG35/BossMan/` | Durable blueprints, skill files, critical system docs | On significant change |

**Rule:** Always save at the appropriate tier. Don't save ephemeral data to Tier 1. Don't save important decisions only to memory tool (Tier 1 only has ~2200 char limit).

---

## Structured Tags

All memory entries include ONE OR MORE tags for searchability:

| Tag | Use For |
|-----|---------|
| `[DECISION]` | Architectural choices, routing decisions, trade-offs made |
| `[ARCHITECTURE]` | System design, service topology, data flows |
| `[SECURITY]` | Patches, vulnerabilities, hardening actions, auth changes |
| `[PRICING]` | Product pricing, cost analysis, revenue decisions |
| `[PRODUCT]` | Feature planning, UX decisions, user feedback patterns |
| `[ROUTING]` | Model selection, agent assignment, tool choice decisions |
| `[WORKFLOW]` | Process improvements, automation patterns, workflow wins |
| `[TRADING]` | Binance signals, market analysis, bot config changes (intelligence only) |
| `[PERFORMANCE]` | Speed improvements, resource optimization, caching |
| `[PREFERENCE]` | Marcelo's stated likes/dislikes/tastes/preferences |
| `[PROJECT:NAME]` | Project-specific context (e.g., `[PROJECT:SquarePayouts]`) |

---

## SAVE Triggers — When to Capture Memory

### 1. User Corrections (ALWAYS)
- **Trigger:** Marcelo corrects BossMan
- **What to save:** What was wrong + correct approach
- **Where:** `memory` tool (user profile) + log to `memory/MEMORY_CAPTURE_LOG.md`
- **Timing:** Immediately, before continuing

### 2. User Preferences (ALWAYS)
- **Trigger:** Marcelo expresses a preference, habit, or taste
- **What to save:** Exact preference + context
- **Where:** `memory` tool (user profile)
- **Timing:** Immediately

### 3. Workflow Win (IMPORTANT)
- **Trigger:** BossMan discovers a better approach, tool, or pattern
- **What to save:** The pattern, why it worked, when to reuse
- **Where:** New skill file in `~/.hermes/skills/[category]/`
- **Timing:** Before next similar task

### 4. Tool Quirk or Workaround (IMPORTANT)
- **Trigger:** Tool behaves unexpectedly; BossMan finds a workaround
- **What to save:** What happened + the workaround
- **Where:** `LEARNED_*.md` in `~/.hermes/knowledge/`
- **Timing:** Within session before continuing

### 5. Repeated Failure / Root Cause (CRITICAL)
- **Trigger:** Same error occurs twice
- **What to save:** Root cause + fix applied
- **Where:** `LEARNED_*.md` + comment on relevant Kanban card
- **Timing:** Before continuing past the error

### 6. Major Decision or Architecture Change (IMPORTANT)
- **Trigger:** Nontrivial architectural, product, or strategic choice
- **What to save:** Decision + rationale + alternatives considered + consequences
- **Where:** `memory/YYYY-MM-DD.md` + update relevant blueprint doc
- **Timing:** Same day

### 7. Delegation Success or Failure (STANDARD)
- **Trigger:** Sub-agent outperforms or underperforms expectations
- **What to save:** What happened + routing pattern implication
- **Where:** `memory/MEMORY_CAPTURE_LOG.md`
- **Timing:** End of delegation session

### 8. Performance/Self-Audit Finding (IMPORTANT)
- **Trigger:** BossMan discovers a system performance issue, bug, or optimization
- **What to save:** Finding + severity + proposed fix
- **Where:** `LEARNED_CORE_ARCHITECTURE.md` + Kanban card if needed
- **Timing:** Before next work session

### 9. Trading/Strategy Intelligence (SENSITIVE — INTELLIGENCE ONLY)
- **Trigger:** Market analysis insight, Binance signal observation, bot config note
- **What to save:** Observation + analytical context + source (never execution logic)
- **Where:** `memory/memory-trading-intelligence.md` (isolated from execution)
- **Tag:** `[TRADING]`
- **Timing:** After verification, before next trading session
- **CRITICAL:** Never save execution parameters, position sizes, or live capital allocations

---

## DO NOT SAVE Triggers — When NOT to Capture

### 1. Ephemeral Task Progress
- Current task state, mid-session progress, temporary findings not yet verified
- **Why not:** Will be stale after task completion; clutters memory

### 2. Speculation and Unverified Guesses
- Theories not tested, assumptions not validated
- **Why not:** Unverified information is noise; mark as `[NEEDS VERIFICATION]` instead

### 3. Data That Will Be Stale Within 7 Days
- Temporary results, one-off calculations, session-specific outputs
- **Why not:** Memory tool is auto-injected every session; stale entries waste context
- **Rule:** If it won't matter in 2 weeks, save to session notes only

### 4. Raw Data Dumps
- Raw API responses, log extracts, unverifiable claims
- **Why not:** Memory is for insights, not data; summarize the meaning

### 5. Code/File Details That Exist Elsewhere
- Exact file paths (use session_search), package versions (use `package.json`), etc.
- **Why not:** Redundant; the file IS the source of truth

---

## Project-Specific Memory Isolation

| Track | Memory Location | Tag Prefix |
|-------|----------------|------------|
| Money Pipeline | `memory/MEMORY_CAPTURE_LOG.md` section + `[PROJECT:MoneyPipeline]` | `[PROJECT:MoneyPipeline]` |
| Binance Bot | `memory/memory-trading-intelligence.md` (isolated) | `[PROJECT:BinanceBot]` + `[TRADING]` |
| SquarePayouts | `LEARNED_FOOTBALL_SQUARES.md` + `SQUAREPAYOUTS_BLUEPRINT.md` | `[PROJECT:SquarePayouts]` |
| BakeryOps | `LEARNED_BAKERY_HOUSTON.md` + `LEARNED_BAKERY_SYSTEM.md` | `[PROJECT:BakeryOps]` |

---

## Memory File Structure

```
~/.hermes/knowledge/memory/
├── YYYY-MM-DD.md              # Daily decision log — active working memory
├── MEMORY_CAPTURE_LOG.md      # Master index of all memory entries by tag
└── memory-trading-intelligence.md  # Isolated trading observations (NEVER execution logic)
```

### Daily Decision Log Format (`memory/YYYY-MM-DD.md`)
```markdown
# Memory — YYYY-MM-DD

## Decisions
- [DATE] [TAG] What was decided + rationale

## Preferences Captured
- [DATE] [PREFERENCE] What Marcelo said + what it means

## Lessons Learned
- [DATE] [WORKFLOW] What happened + what to do differently next time

## System Insights
- [DATE] [ARCHITECTURE] What was discovered + why it matters
```

---

## Integration with Kanban

Every Kanban card in these tracks should have memory entries attached:
- **TRACK — Memory Automation** (t_9d56ef5a) → This policy doc
- **TRACK — Self-Audit and Performance Monitoring** (t_ca987fa4) → Self-audit findings
- **TRACK — Weekly Systems Review** (t_38404d95) → Weekly review insights
- **TRACK — Deep Audit and Breakage Detection** (t_260136ce) → Architecture findings
- **TRACK — Localhost Project Improvement Engine** (t_405e079a) → Performance findings

Memory retrieval during Kanban work:
1. Before starting a card, search `memory/MEMORY_CAPTURE_LOG.md` for relevant tag + project
2. Check `memory/YYYY-MM-DD.md` for recent decisions affecting the same project
3. Check `LEARNED_CORE_ARCHITECTURE.md` for system-level patterns

---

## Searchability Rules

Every memory entry must be:
1. **Tagged** — at least one `[TAG]`
2. **Dated** — `YYYY-MM-DD` at start of entry
3. **Project-scoped** — include `[PROJECT:NAME]` where applicable
4. **Compact** — max 3-5 sentences; never a raw dump
5. **Actionable** — include what to DO with the information

---

## Staleness Policy

| Data Type | Example | Where to Save |
|-----------|---------|---------------|
| Stale in <7 days | Session output, temporary finding | Session notes only |
| Stale in 7-30 days | Project status update | `memory/YYYY-MM-DD.md` |
| Stale in 1-3 months | Preference, workflow pattern | `memory` tool (Tier 1) |
| Stale in 3+ months | Architecture decision, security patch | `LEARNED_*.md` (Tier 2) + blueprint |

**Uncertain?** Save to Tier 2 (knowledge docs), not Tier 1 (memory tool).

---

## Example Memory Entries

### System Decision
```
[2026-05-22] [ARCHITECTURE] [PROJECT:Hermes]
Decision: Hermes is the single status surface — no other system (LBC35, cron, LaunchAgent) may send direct Telegram messages to Marcelo.
Rationale: Prevents conflicting/duplicate alerts; Marcelo has one source of truth.
Alternative considered: LBC35 could route through Hermes. Chosen because Hermes owns all Kanban work already.
```

### Trading Intelligence
```
[2026-05-22] [TRADING] [PROJECT:BinanceBot]
Observation: BTC/USDT pair showing 3 consecutive 4H RSI closes above 70 — historically precedes 5-10% correction within 48H.
Source: Binance API + personal analysis.
What to do: Alert Marcelo via Telegram. Do NOT auto-execute. Paper trading only until Phase 11.
What NOT to save: Position sizes, entry prices, stop-loss levels, capital allocations.
```

### Performance Finding
```
[2026-05-22] [PERFORMANCE] [PROJECT:Hermes]
Finding: PM2 unsynced — `pm2 save` not run after recent changes. Services won't resurrect after reboot.
Severity: HIGH
Fix applied: Ran `pm2 save`. Documented in SOUL.md PM2 section.
Prevention: Always run `pm2 save` after `pm2 start/stop/delete`.
```

### Workflow Improvement
```
[2026-05-22] [WORKFLOW] [PROJECT:Hermes]
Discovery: Perplexity desktop app has zero-bounds bug — macOS accessibility API sees window but reports all bounds as (0,0,0,0).
Workaround: Use Brave browser at perplexity.ai for all Perplexity work.
Pattern: When Computer Use fails on a native app, check accessibility API bounds first.
```

---

## Verification

This policy is VERIFIED when:
- [ ] `memory/` directory exists and contains `MEMORY_CAPTURE_LOG.md`
- [ ] Memory tool captures preferences and corrections immediately
- [ ] Kanban cards reference relevant memory entries via comments
- [ ] Phase 3 (Self-Audit) can query memory and find relevant past decisions
- [ ] Trading intelligence is isolated from execution logic

**Last verified:** 2026-05-22
