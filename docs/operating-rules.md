# BossMan Operating Rules

## Core Principle: BossMan First

BossMan is the **default entry point** for all operations. When in doubt, start here.

```
Any task or question
        │
        ▼
  ┌─────────────┐
  │  BossMan    │  ← Always start here
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Know it?  Don't know?
    │         │
    ▼         ▼
  Execute   Delegate to
  directly  Terminal / Web / Research
```

---

## Decision Matrix

| Situation                                    | Action                                              |
|----------------------------------------------|-----------------------------------------------------|
| Daily health check                           | Run `prompts/bossman-daily.md`                      |
| Vault lookup                                 | Use `terminal` + `Obsidian vault` at `$OBSIDIAN_VAULT_PATH` |
| GitHub review / PR check                     | Use `gh` CLI or `github-code-review` skill          |
| Infrastructure / port status                 | Check `docs/services-map.md`, then `lbc35-infra.md` prompts |
| New automation to build                      | Design in BossMan prompts, build in terminal       |
| Complex code task                            | Delegate to `claude-code` or `codex` subagent       |
| Multi-step research                          | Delegate to `web` search + `delegate_task`          |
| Scheduled recurring task                     | Create Hermes `cronjob`                             |
| Cross-session persistent memory              | Use `memory` tool                                  |
| Session-to-session reference                 | Use Obsidian vault                                 |
| New skill or technique discovered            | Save as Hermes skill via `skill_manage`            |

---

## Daily Routine (BossMan Daily)

Run every morning (recommended 08:00 local):

1. **Health check** — probe all active ports on LBC35
2. **Vault query** — check for overnight notes, flagged items
3. **GitHub review** — scan open PRs, recent commits on active repos
4. **Log analysis** — check Hermes logs for errors or anomalies
5. **Cronjob status** — verify scheduled jobs ran overnight

See [`prompts/bossman-daily.md`](../prompts/bossman-daily.md) for the full prompt template.

---

## When to Use Terminal Directly

Use `terminal` tool when:
- You know the exact command and it has no branching logic
- Quick file edits via `patch` or `write_file`
- `git` operations (commit, push, pull, branch)
- Package manager operations (`pip`, `npm`, etc.)
- `curl` or `wget` for simple HTTP requests

**Delegate to subagent** (`delegate_task`) when:
- Task requires >3 tool calls with conditional logic between them
- Reasoning-heavy debugging across multiple files
- Multi-step code changes that need a fresh context

---

## Workflow Rules

### Before Opening a New Issue or PR
1. Check if the topic is covered in `docs/`
2. Check if a prompt template exists in `prompts/`
3. Search the vault for prior context

### Before Writing a New Prompt Template
1. Check if an existing prompt in `prompts/` covers the scenario
2. If it's a recurring pattern, add to the appropriate existing file
3. If it's net new, create a new file and update this doc

### Before Creating a New Cronjob
1. Confirm it's not already covered by an existing cronjob
2. Write the prompt to be self-contained (no cross-session依赖)
3. Set a sensible schedule and delivery target

### Before Saving a New Skill
1. Confirm the technique is not already in an existing skill
2. Write it for reusability, not just the current task
3. Include trigger conditions, exact commands, pitfalls, and verification steps

---

## Communication Rules

- **Telegram** — use for real-time alerts and quick status updates
- **GitHub issues** — use for tracked tasks and bugs
- **Obsidian vault** — use for persistent knowledge and cross-session notes
- **Hermes memory** — use for user preferences and environment facts

---

## Safety Rules

1. **Never commit real secrets** — tokens, keys, passwords go in `.env` only
2. **Never commit runtime state** — no `logs/`, `runtime/`, `state/`, `*.db`
3. **Always verify before push** — check `git status` and review diffs
4. **Archive don't delete** — move deprecated docs to OpenClaw archive, don't remove
5. **BossMan owns the entry point** — don't skip BossMan when routing tasks

---

## File Ownership

| File / Folder      | Owner      | Review Frequency |
|--------------------|------------|-------------------|
| `prompts/*`        | BossMan    | Weekly            |
| `docs/*`           | BossMan    | Bi-weekly         |
| `.env.example`     | BossMan    | Monthly           |
| `.gitignore`       | BossMan    | Monthly           |
| GitHub repo config | BossMan    | As needed        |

---

## Basecamp Client Project Standard

Applies to: BakeryOps, SquaresPayouts, and any future client-facing Basecamp projects.

### Standard Project Layout

| Component | Standard | Notes |
|-----------|----------|-------|
| Message Board | ONE pinned `[ProjectName] — How to Test (Pinned Guide)` | No duplicate guides |
| Card Table | Single board, Triage column only | Real bugs/suggestions only — no demo cards |
| To-dos | Only lists with active client purpose | Archive placeholder lists |

### Pinned Guide Format

Title: `[ProjectName] — How to Test (Pinned Guide)`

Required sections:
1. What is [ProjectName]?
2. Test URL
3. How to Report Issues
4. Routing Rule
5. What We're Looking For

### How to Report Issues (standard format)

All issues go into **Card Table → Triage**. Use this format. Every card is reviewed daily.

**BUG report format:**
- Title: `[BUG] short description`
- Assign card: blank
- Due on: blank
- Describe your card here: full details (what broke, steps to reproduce, expected vs actual)
- Add screenshots using the paper clip if possible

**Required examples (standard):**
- `[BUG] Login link does nothing`
- `[BUG] my company name is missing`
- `[SUGGESTION] Make dashboard text easier to read on mobile`

**SUGGESTION report format:**
- Title: `[SUGGESTION] short description`
- Describe your card here: what to change and why

### Routing Rule

- Real bug or improvement request → **Card Table**
- Task, checklist item, or decision pending → **To-dos**
- General discussion or update → **Message Board**

### Automation Policy

- New client bug cards: auto-acknowledged
- Internal work items: auto-created/updated
- Status/progress replies: auto-posted when appropriate
- Daily digest to Marcelo
- **Escalate to Marcelo for:** system-affecting changes, approval-required decisions, questions the system cannot answer confidently

### Chat / Schedule Handling

- Client messages auto-handled when answer is supported by project context + docs
- If uncertain: escalate to Marcelo before replying
- Scheduling/reminders/follow-ups via Hermes workflow

---

_Updated: 2026-05-11 — standardized across all client projects_