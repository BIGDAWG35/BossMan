# Knowledge Reuse Pipeline

> **AI Stack v2 — Phase 4 (2026-05-27)**
> Rule: "If it changes *how we operate* → canonical (Hermes knowledge). If it explains *how we did* something → Obsidian. If it is *executable* → GitHub."

---

## Where Knowledge Lives

| Content Type | Storage | Canonical? |
|---|---|---|
| Routing rules, model tiers, stack architecture | `HERMES_MASTER_BLUEPRINT.md` | ✅ YES |
| Agent roles, delegation rules, coordination patterns | `AGENTS.md` | ✅ YES |
| Tool quirks, CLI workarounds, system patterns | `LEARNED_*.md` | ✅ YES |
| SOPs, troubleshooting guides, project post-mortems | `~/Desktop/CLAW-Backup/Obsidian/` | ✅ YES |
| Code, templates, scripts, workflow files | GitHub repos (`BIGDAWG35/*`) | ✅ YES |
| Kanban cards (current work, blockers, decisions) | `~/.hermes/kanban/boards/bossman/kanban.db` | ✅ YES |
| Session history, past events, error patterns | `session_search` (FTS5) | Searchable |
| Marcelo's stated preferences | `memory` (user profile) | ✅ YES |
| Reusable workflow patterns | `~/.hermes/skills/*.md` | ✅ YES |

---

## Save Pipeline — On Every Major Project

### Step 1: During Execution — Log Model Choices

In the Kanban card notes, log which model/plane was used at each step:
```
[Model Log]
- Step 1: Tier 1 (session_search) — found prior session with same bug
- Step 2: Tier 2 (Ollama/Llama) — first-pass code for auth cleanup
- Step 3: Tier 3 (MiniMax 2.7) — orchestration and routing
- Step 4: Tier 4 (DeepSeek) — edge-case analysis for session token logic
- Step 5: Tier 5 (Perplexity Computer) — NOT USED (Browser QA sufficient)
```

### Step 2: On Completion — Extract Lessons

Ask: "What changed because of this project?"

| Question | Answer Type | Destination |
|---|---|---|
| Did we learn how to route better? | Operating rule | `AGENTS.md` or `HERMES_MASTER_BLUEPRINT.md` |
| Did we find a new tool pattern? | CLI/quirk | `LEARNED_*.md` |
| Did we create reusable code? | Executable | GitHub repo |
| Did we create a reusable template? | Template | GitHub repo |
| Did we document a process? | SOP | `~/Desktop/CLAW-Backup/Obsidian/` |
| Did we learn a project-specific lesson? | Post-mortem | `~/Desktop/CLAW-Backup/Obsidian/` |
| Did Marcelo state a new preference? | Preference | `memory` (user profile) |
| Did a skill/workflow improve? | Skill | `~/.hermes/skills/*.md` |

### Step 3: Save to Correct Destination

**→ Hermes knowledge (`~/.hermes/knowledge/`):**
- Update AGENTS.md for routing/delegation changes
- Update HERMES_MASTER_BLUEPRINT.md for architecture changes
- Update or create LEARNED_*.md for tool/system patterns
- Update memory for new preferences

**→ Obsidian (`~/Desktop/CLAW-Backup/Obsidian/`):**
- Create/update SOP note: `PROJECT_NAME_SOP.md`
- Create post-mortem: `PROJECT_NAME_YYYY-MM-DD.md`
- Update troubleshooting guide if new fix pattern found

**→ GitHub (`BIGDAWG35/*`):**
- Commit code with meaningful message: `feat(project): what changed`
- Commit templates/scripts
- Add project lessons to repo README if relevant

### Step 4: Verify

After saving:
- [ ] Read back the saved content to confirm it was written
- [ ] Confirm it's in the right location (check the table above)
- [ ] For Hermes knowledge: confirm it will be picked up in next session

---

## Prompt & Routing Pattern Save

When a model routing decision works well — save the pattern:

**Save format:** `~/.hermes/knowledge/ROUTING_PATTERNS.md`

```
## [Pattern Name]
Date: YYYY-MM-DD
Task type: [what kind of task]
Chosen route: [Tier → Model]
Why it worked: [brief]
When to use again: [condition]
```

Example:
```
## DeepSeek for Edge-Case Auth Analysis
Date: 2026-05-27
Task type: Session token edge case in NextAuth
Chosen route: Tier 4 → DeepSeek (low-cost reasoning)
Why it worked: Auth logic requires understanding token refresh edge cases; DeepSeek produced correct analysis at 1/10th Claude cost
When to use again: Any NextAuth session/auth edge-case analysis
```

---

## Major Project Checklist

Use this checklist on every project that takes more than 3 tool calls:

**During:**
- [ ] Log model choices in Kanban card notes

**On completion:**
- [ ] Extract operating lessons → Hermes knowledge (AGENTS.md, LEARNED_*.md)
- [ ] Extract SOP/troubleshooting → Obsidian
- [ ] Extract code/templates → GitHub
- [ ] Extract preferences → memory
- [ ] Improve skill if workflow improved → `~/.hermes/skills/`
- [ ] Read back all saved content to verify

**Failover logging:**
- [ ] Log any provider failures/reroutes in Kanban card notes
- [ ] If reroute wasn't covered by existing policy → update routing tier doc

---

## Obsolete Content Retirement

When a knowledge file becomes stale:
1. Move to `~/.hermes/knowledge/ARCHIVED/` with date
2. Add note: `ARCHIVED YYYY-MM-DD — superset replaced by [new file]`
3. Never delete — archived content may be needed for audit

---

## Knowledge Quality Rules

- **Canonical files are minimal** — don't blob, use pointers
- **One topic per LEARNED_*.md** — `LEARNED_BINANCE.md`, `LEARNED_BAKERY.md`, etc.
- **Obsidian notes are detailed** — these are the SOPs and post-mortems
- **GitHub commits are atomic** — one logical change per commit
- **Memory is lean** — preferences and corrections only, <2,000 chars
