---
name: kanban-orchestrator
description: Decomposition playbook + specialist-roster conventions + anti-temptation rules for an orchestrator profile routing work through Kanban. The "don't do the work yourself" rule and the basic lifecycle are auto-injected into every kanban worker's system prompt; this skill is the deeper playbook when you're specifically playing the orchestrator role.
version: 2.0.0
metadata:
  hermes:
    tags: [kanban, multi-agent, orchestration, routing]
    related_skills: [kanban-worker]
---

# Kanban Orchestrator — Decomposition Playbook

> The **core worker lifecycle** (including the `kanban_create` fan-out pattern and the "decompose, don't execute" rule) is auto-injected into every kanban process via the `KANBAN_GUIDANCE` system-prompt block. This skill is the deeper playbook when you're an orchestrator profile whose whole job is routing.

## Scope & STOPs (Permanent — 2026-06-23)

**Purpose:** Make explicit what kanban-orchestrator may auto-route vs what must escalate to operator. Tied to v3 Routing Ledger + Step-5 QA rule.

### Autonomous scope (orchestrator may auto-route without operator approval)

- **Decompose work into kanban cards** — parent + 5 children pattern via ACP
- **Fan-out to specialists** via `delegate_task` for parallel work streams
- **Route cards to existing lanes** (kanban-worker, build lane, etc.)
- **Promote/complete cards** based on routing rules
- **Add comments / status updates** to existing cards
- **Create cross-references** between related cards

### Approval gates (operator approval REQUIRED)

- **New kanban lane definitions** — workers, queues, escalation paths
- **New recurring automation** that fans out without operator review
- **Routing rule changes** — when to use which lane
- **Lane ownership / specialist roster changes**

### STOP conditions (MUST halt and escalate)

- **Work involving money movement, trading, PII** — never auto-fan-out; mandatory operator review
- **Auth/credential changes** — never auto-route; surface to operator
- **Env file / secrets editing** — never auto-route
- **SOUL.md / AGENTS.md / ROUTING-RULES.md edits** — kernel-doc; never auto-route, always explicit card with operator approval
- **Production cutover or rollback decisions** — never auto-route
- **Conflicting kanban state** (two cards claiming same work, parent-child inconsistency) — STOP and surface
- **Card invocation surfaces a carve-out category** (infra/port/security/vendor/product-direction) — STOP

### Routing Ledger (what a card invoking kanban-orchestrator looks like)

| Field | Value |
|---|---|
| work_type | orchestration |
| lead_model | bossman |
| cost_tier | medium (delegates to specialists) |
| qa_required | yes for any non-orchestration work product delivered by children |

### Step-5 QA rule

Orchestrator itself does NOT need Step-5 — its output is card creation, not implementation. But any child card that produces non-orchestration output MUST run Step-5 before completion. Orchestrator enforces this via parent-card `qa_required: yes` field.

### Canonical references

- AGENTS.md (M3 routing) — `~/.hermes/AGENTS.md`
- ROUTING-RULES v3 — `~/Projects/BossMan/docs/ROUTING-RULES.md`
- PHASEREPORT — `~/Projects/BossMan/PHASEREPORT.md`
- ACP (governance parent) — `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
- Goal Loop pattern — `~/.hermes/skills/goal-loop/SKILL.md` (forthcoming)
- Phase 2 hardening entry — `~/.hermes/knowledge/PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md` (forthcoming)

## When to use the board (vs. just doing the work)

Create Kanban tasks when any of these are true:

1. **Multiple specialists are needed.** Research + analysis + writing is three profiles.
2. **The work should survive a crash or restart.** Long-running, recurring, or important.
3. **The user might want to interject.** Human-in-the-loop at any step.
4. **Multiple subtasks can run in parallel.** Fan-out for speed.
5. **Review / iteration is expected.** A reviewer profile loops on drafter output.
6. **The audit trail matters.** Board rows persist in SQLite forever.

If *none* of those apply — it's a small one-shot reasoning task — use `delegate_task` instead or answer the user directly.

## The anti-temptation rules

Your job description says "route, don't execute." The rules that enforce that:

- **Do not execute the work yourself.** Your restricted toolset usually doesn't even include terminal/file/code/web for implementation. If you find yourself "just fixing this quickly" — stop and create a task for the right specialist.
- **For any concrete task, create a Kanban task and assign it.** Every single time.
- **If no specialist fits, ask the user which profile to create.** Do not default to doing it yourself under "close enough."
- **Decompose, route, and summarize — that's the whole job.**

## The standard specialist roster

The profiles below are the actual operational roster for this Hermes installation. Adjust if new profiles are added.

### Active Profile Roster

| Profile | Does | Typical workspace |
|---|---|---|
| `bossman` | Orchestrates, routes, approves, plans. Does not execute code or touch runtime. | Kanban board, memory |
| `builder` | Code, dashboards, scripts, repos, Git, Cursor, PM2 service definitions | `~/code/` or project dir |
| `ops` | PM2, runtime, ports, health checks, Tailscale, deployments, incidents | Local services |
| `trading` | Research-only. Market analysis, Binance/Kraken review, recommendations. Never executes. | Dashboards, APIs |
| `content` | YouTube pipeline, social content, scripts, docs, content assets | Project dir |

### Routing Rules (auto-assign by task type)

When creating a card without an explicit assignee, use:

| Task type | Assign to |
|-----------|-----------|
| Code, features, scripts, dashboards, Git, Cursor | `builder` |
| Runtime, PM2, ports, health checks, Tailscale, infra, deployments | `ops` |
| Market research, Binance/Kraken analysis, opportunities | `trading` |
| Content, scripts, docs, videos, social | `content` |
| Routing, approvals, prioritization, decisions | `bossman` |
| Unnamed human → default | `Cello` |
| Named Squares or Bakery | Set stakeholder: `client-squares` or `client-bakery` |
| Minor bug/workflow fix (no scope change) | Proceed without approval flag |
| Major scope/architecture/money change | Set `Approval needed: yes`, status → `awaiting_approval` |

## Decomposition playbook

### Step 1 — Understand the goal

Ask clarifying questions if the goal is ambiguous. Cheap to ask; expensive to spawn the wrong fleet.

### Step 2 — Sketch the task graph

Before creating anything, draft the graph out loud (in your response to the user). Example for "Analyze whether we should migrate to Postgres":

```
T1  researcher        research: Postgres cost vs current
T2  researcher        research: Postgres performance vs current
T3  analyst           synthesize migration recommendation       parents: T1, T2
T4  writer            draft decision memo                       parents: T3
```

Show this to the user. Let them correct it before you create anything.

### Step 3 — Create tasks via CLI

Use `hermes kanban create` (CLI) not the Python API:

```bash
hermes kanban create "Money pipeline dashboard rebuild" \
  --assignee bossman \
  --priority 1 \
  --body "## Meta
Project: money-pipeline
Internal owner: bossman
Human owner: Cello
Stakeholder: internal
Priority: P1
Change type: feature
Approval needed: yes
Feedback source: internal

## Description
Migrate the money pipeline CRM and opportunity dashboard away from OpenClaw into Hermes-native tooling."
```

**Card body convention:** Use YAML frontmatter in the body. Fields:
- `Project`: money-pipeline | pm-dashboard | youtube | squares | bakery | other
- `Internal owner`: bossman | builder | ops | trading | content
- `Human owner`: Cello | Cisco | Marcus | none
- `Stakeholder`: internal | client-squares | client-bakery | other
- `Priority`: P0 | P1 | P2
- `Change type`: bug | workflow | feature | content | research | infra
- `Approval needed`: yes | no
- `Feedback source`: basecamp | direct | internal | other

**Status convention:**
- `ready` = triaged, waiting to start
- `running` = work in progress
- `awaiting_approval` = needs bigdawg's explicit sign-off before proceeding
- `blocked` = waiting on something
- `done` = completed

To move a card's status directly (no tool for this — use SQLite):
```bash
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "UPDATE tasks SET status='awaiting_approval' WHERE id='<task_id>';"
```

**To set parent-child dependencies:**
```bash
hermes kanban link <parent_id> <child_id>
```

**To block/unblock:**
```bash
hermes kanban block <task_id>
hermes kanban unblock <task_id>
```

**To add a comment:**
```bash
hermes kanban comment <task_id> "Adding context from Basecamp thread: <url>"
```

### Step 4 — Complete your own task

If you were spawned as a task yourself, mark it done and summarize what you created:

```bash
hermes kanban complete <task_id>
```

Then report back in plain prose: what cards were created, who owns them, what's blocked, what needs approval.

### Step 5 — Report back to the user

Tell them what you created in plain prose:

> I've queued 4 tasks:
> - **T1** (researcher): cost comparison
> - **T2** (researcher): performance comparison, in parallel with T1
> - **T3** (analyst): synthesizes T1 + T2 into a recommendation
> - **T4** (writer): turns T3 into a CTO memo
>
> The dispatcher will pick up T1 and T2 now. T3 starts when both finish. You'll get a gateway ping when T4 completes. Use the dashboard or `hermes kanban tail <id>` to follow along.

## Common patterns

**Fan-out + fan-in (research → synthesize):** N `researcher` tasks with no parents, one `analyst` task with all of them as parents.

**Pipeline with gates:** `pm → backend-eng → reviewer`. Each stage's `parents=[previous_task]`. Reviewer blocks or completes; if reviewer blocks, the operator unblocks with feedback and respawns.

**Same-profile queue:** 50 tasks, all assigned to `translator`, no dependencies between them. Dispatcher serializes — translator processes them in priority order, accumulating experience in their own memory.

- Full pattern: `references/basecamp-monitor-pm2-crash-loop.md`
- **New reference:** `references/builder-timeout-work-complete.md` — orchestrator-side recovery from `outcome: timed_out` when the work actually landed. Decision tree, smoke-test recipe, real example from t_056268b1 (Travel OS Card A, 2026-06-04).
- **New reference:** `references/status-transitions-and-grep-pitfalls.md` — which status transitions have a CLI verb and which require direct SQLite; `awaiting_approval` has no CLI verb (orchestrator path). Also: grep substring false-alarm pitfalls (e.g. "duplicate const" that isn't real).

**New reference:** `references/service-cleanup-decision-framework.md` — Full KEEP/FIX/RETIRE decision tree for auditing PM2 + LaunchAgents + scripts. Includes inventory commands, classification criteria, cleanup execution patterns, and memory recording.

**New reference:** `references/travel-os-build-pattern.md` — Full reusable build pattern for multi-phase system creation: document hierarchy, approval gate classification, phase-gated dynamic intake, review gate hard stop, save-to-3-locations convention. Validated by Travel OS Phases 1-4 (2026-06-02).

### Binance Bot — Hard Restart Gate + Controlled Restart Window Pattern

When a critical trading service (binance-bot, port 8104) must be restarted safely, a **hard restart gate** enforces that restart only happens after specific pre-conditions are met, in a specific sequence, with monitoring.

**Card structure for a restart gate:**
- Parent card: defines the hard gate — all required conditions listed in card body
- Child card: pre-trade hook restoration — must be DONE before gate clears
- Child card: controlled restart protocol — documents exact restart sequence
- All children linked to parent via `hermes kanban link <parent> <child>`

**Hard gate example (Binance bot):**
```
Restart is FORBIDDEN until:
1. t_07c30d9a completed by builder (all 5 deliverables confirmed with test evidence)
2. safe-start.js exits 0
3. restart-health-check.js passes all 16
4. Marcelo explicit GO in controlled restart window
```

**Required Deliverables template (pre-trade hook card):**
1. pre-trade-hook.js at correct path (e.g. /Users/bigdawg/Projects/trading-review/pre-trade-hook.js)
2. Hook runs in blocking mode in server.js — no try/catch swallow
3. Hook validates: schema, SL direction, riskPct <= 5%, position size, NaN values — fails CLOSED on any error
4. Journal logging to data/trade-journal.json — non-blocking on failure
5. Test coverage: manual or automated test run — results attached to card

**Controlled restart window (documented on restart protocol card):**
1. node safe-start.js — proceed ONLY if EXIT=0
2. pm2 start binance-bot
3. node restart-health-check.js — confirm all 16 checks PASS
4. Monitor logs, balances, open orders for at least 60 min with rollback triggers ready
5. If any check fails or anomalies — STOP bot immediately, execute rollback
6. Only then mark restart as GO and update card status

**Typical card graph for a critical service restart gate:**
```
t_parent_gate (ops, P0)
├── t_child_hook (builder) — pre-trade hook restoration
├── t_child_selfhealing (ops/builder) — self-healing package implementation
└── t_child_restart_protocol (ops) — controlled restart window steps (DONE when protocol written)
```

**safe-start.js minimum checklist (8 gates):**
- module existence at correct path
- DB schema integrity (required columns present)
- hook file present + exits clean on test invocation
- riskPct <= 5%
- PAPER_MODE flag correct
- journal path writable
- no NaN in config values
- all critical env vars present and non-empty

**restart-health-check.js minimum (16 checks):**
- PM2 status = online
- bot uptime > 60s
- /api/health returns 200 within 2s
- lastTradeTimestamp updated within 10 min
- no SQLite errors in logs
- pre-trade hook loaded (no Module Not Found)
- PAPER_MODE flag correct
- riskPct from config
- open orders count matches expected
- balance matches expected
- no NaN in active order parameters
- journal file writable
- INTEL_GATE reads valid intelligence.json
- no ERROR-level log entries in last 5 min
- cron health check firing every 5 min
- Telegram health alert confirmed sent

### Multi-Card Status Update Pattern

When Marcelo asks for status on N cards simultaneously, always audit first, then update. Never assume card state.

**Sequence:**
1. `hermes kanban show <id>` for each card — captures actual status, comments, events, last summary
2. Cross-reference against prior session context or known history
3. For each card: (a) what's already implemented with evidence, (b) what remains, (c) realistic ETA to DONE
4. Post structured status comment to each card via `hermes kanban comment <id> <status>`
5. Summarize for Marcelo in short format: grid of PASS/FAIL, ETA, next action

**Status comment template per card:**
```
## STATUS UPDATE — YYYY-MM-DD

### (1) Already implemented (git commits / test runs)
- [list with ✅ or ❌ per item]

### (2) What remains
- [list remaining work]

### (3) ETA to DONE
- [realistic estimate]

### Card Dependencies
- Unblocks: [child card that this card unblocks]
- Blocked by: [parent card this card waits on]
```

**Rule:** Post status update the same day as Marcelo's request. Include ETA. Hard gate conditions unchanged unless Marcelo explicitly clears them.

### Emoji-in-Kanban-Comments Pitfall

When posting `hermes kanban comment` with emoji in the body, bash shell expansion interferes. Emoji characters (U+1F300-U+1F9FF) get interpreted as command names by bash, producing "command not found" errors in the output even though the comment posts successfully (exit code 0).

**Workaround:** Accept the shell noise — exit code 0 confirms the comment landed. Do NOT retry; doing so creates duplicate comments. The shell noise is cosmetic only.

**Comment body is a POSITIONAL arg, not a flag (`--body` / `--body-file` / `--file` do NOT exist for `hermes kanban comment`):** Mirror of the worker-skill pitfall. BossMan frequently posts long plan/validation reports as card comments. The correct pattern is command substitution:
```bash
# CORRECT — write body to file, substitute via $(cat <file>)
hermes kanban comment t_abc123 "PLAN: $(cat /tmp/card-plan.md)"

# WRONG — --body, --file, --body-file all fail with "unrecognized arguments"
hermes kanban comment t_abc123 --body "$(cat /tmp/card-plan.md)"   # exit 2
hermes kanban comment t_abc123 --file /tmp/card-plan.md            # exit 2
```

**Plan-comment race (orchestrator-only):** The kanban dispatcher can pick up a `ready` card and start a worker before the orchestrator finishes posting a long PLAN comment. Observed 2026-06-04 on `t_056268b1` (Card A): orchestrator spent ~90s drafting the plan in chat, the builder worker was already running when the plan comment landed. Fix: write the plan to a local file FIRST, then `hermes kanban comment <id> "$(cat plan.md)"` near-instantly. The dispatcher picks up on `create` or `assign`; the plan comment is informational, not blocking. Builder should re-`kanban_show` to read the latest comments before each major decision.

**Card creation — TITLE is positional (NO --title flag), --body is --body "...":**
```bash
# CORRECT — title is positional argument
hermes kanban create "Exact Card Title Here" \
  --body "## Meta\nProject: travel-os\n..." \
  --assignee builder \
  --priority 1

# WRONG — --title flag does not exist
hermes kanban create --title "Exact Card Title Here" ...   # produces: error: unrecognized arguments: --title
```

**Rule:** Title is the first positional argument. `--body` passes the body string. `--assignee` and `--priority` work as expected. If `--title` is used, the command fails with exit code 2. Always verify card creation succeeded with `hermes kanban show <new_id>` afterward.

**Other CLI pitfalls observed (verified 2026-06-04):**
- **`--tags` flag does NOT exist.** `hermes kanban create ... --tags travel,ixtapa,planning` is silently eaten — exit code 0 but the card has no tags. Omit `--tags` entirely; if you need to tag a card, edit the body to include a `## Tags` line.
- **`hermes kanban boards` subcommand is `create`, NOT `add`.** `hermes kanban boards add travel-os` returns `invalid choice: 'add'`. Correct: `hermes kanban boards create travel-os`. Confirmed 2026-06-04 on the `travel-os` board creation.
- **`hermes kanban boards switch` is persistent** — it changes the active board for subsequent commands. Verify the active board with `hermes kanban boards list` before creating a card if you've been switching between boards.
- **Card body frontmatter lines must match exactly.** The Meta block (`Project:`, `Internal owner:`, `Priority:`, etc.) is parsed by the kanban dashboard for filtering. A typo like `internal owner:` (lowercase) breaks the filter silently.
- **`hermes kanban dispatch --json` does NOT surface `respawn_guarded` (verified 2026-06-04).** When a ready task isn't spawning and the JSON output shows `Spawned: 0` with no `skipped_*` field that includes the task id, it is likely guarded by `check_respawn_guard` — and that bucket is silently dropped from the CLI's JSON output (the field exists on `DispatchResult` but is not emitted by `_cmd_dispatch`). **Diagnostic:** query the `task_events` table for `kind='respawn_guarded'` to confirm, and check the `task_runs` table for a recent `outcome='completed'` run within `_RESPAWN_GUARD_SUCCESS_WINDOW` (default 3600s).

**Never put emoji in commands that appear in kanban comment bodies** — they are decorative and not worth the confusion. Use text descriptors instead.

### BossMan Conventions (bigdawg-specific)

**Approval gating — ALWAYS check before proceeding:**
- Minor bug fixes and workflow corrections → proceed without approval
- Major scope, architecture, behavior, or money changes → set `Approval needed: yes` and status to `awaiting_approval`, do NOT proceed until bigdawg approves

**Feedback workflow:**
- Basecamp is primary feedback channel for clients and partners
- When Basecamp feedback arrives, create a Kanban card immediately — do not leave it only in Basecamp threads
- Link the Basecamp thread URL in the card body under `Links:`
- Move to `client_testing` when a build is ready for testers
- Move to `feedback_review` when new feedback needs processing

**Autonomous Basecamp card management (2026-05-22 — Standing Rule):**
Marcelo approved: BossMan handles all client-facing card replies autonomously. No prior approval needed for normal card responses. Only escalate to Marcelo for: system changes, scope changes, money changes, or fixes requiring code deployment beyond simple explanation.

For each incoming card:
1. INVESTIGATE — inspect source, reproduce if possible, identify fix or explanation
2. REPLY — post client-facing response via `basecamp comments create <card_id> --project 47218024 --body '<div>...</div>'`
3. CARD STAYS IN TRIAGE — client or Marcelo moves to Done when satisfied

Reply templates:
- Fixed bug: `<div>✅ Fixed! [One sentence]. This was resolved on [date]. Please test by [action]. Let us know if you're still seeing the issue.</div>`
- Workflow/feature: `<div>✅ Resolved! After investigation: [explanation]. [Specific guidance]. Please try [action] and let us know if you have any suggestions!</div>`

Current SquarePayouts project: Account `6162349`, Project `47218024`, Card Table `9875092873`

**Human owner defaults:**
- If no human is named → default to `Cello`
- If a human is named (Cello, Cisco, Marcus) → set that name
- To change human operator names: edit `~/.hermes/HUMAN_OWNERS.md` (create if missing) and do a bulk SQLite replace in the kanban DB

**Stakeholder auto-detection:**
- References to Squares → `Stakeholder: client-squares`
- References to Bakery → `Stakeholder: client-bakery`
- Internal projects → `Stakeholder: internal`

**Boards:**
- Active board: `bossman` (switch with `hermes kanban boards switch bossman`)
- Board DB: `~/.hermes/kanban/boards/bossman/kanban.db`

**Draft files vs disk state:** When returning a file draft in chat (SOUL, SKILL, etc.), the file is NOT on disk until the user pastes it. Do NOT assume draft content is already on disk. Check with `ls` or `read_file` before treating it as existing.

## Phase-Based New Project Execution Pattern (2026-06-02)

When kicking off a new multi-phase project that doesn't fit the migration playbook, use this pattern:

### Sequence

```
Phase 1 — Blueprint Lock
  → Write canonical blueprint document
  → Save to 3 locations: knowledge + CLAW-Backup + GitHub
  → Create master Kanban card + N phase child cards
  → Mark Phase 1 done
  → Telegram summary

Phase 2+ — Per-Phase Execution (repeat for each phase)
  → Claim the phase card
  → Execute phase work
  → Write Routing Ledger comment (mandatory before complete)
  → Save deliverables to 3 locations
  → Commit + push to GitHub
  → Complete the phase card
  → Telegram summary with phase outcome + next phase recommendation
```

### Per-Phase Lifecycle (Mandatory Steps)

Each phase follows this exact sequence. Do NOT skip steps:

**Step 1 — Claim:** `hermes kanban claim <card_id>` — marks card as running, prevents duplicate assignment.

**Step 2 — Execute:** Do the phase work. Use the appropriate model/skill per the Routing Ledger.

**Step 3 — Routing Ledger comment (REQUIRED):** Before completing the card, post a structured Routing Ledger comment using the format from `ai-model-routing` skill:
```
## Routing Ledger — [Phase Name] (YYYY-MM-DD)

work_type:           # new_build | audit | design | documentation | build
primary_artifact:    # main file or artifact produced
lead_model:          # primary model used
supporting_models:   # assisting models (or "none")
review_models:       # reviewing models (or "none")
final_integrator:    # BossMan | builder | ops | trading | content
cost_tier:           # 1 | 2 | 3 | 4 | 5
last_model_used:     # last model that touched this artifact
next_model_planned:  # next phase's expected model

## What was done
- [list of actual accomplishments, not template text]

## Outcome
One-line summary of phase result.
```

**Step 4 — Save deliverables:** Save to all 3 locations:
- Canonical: `~/.hermes/knowledge/<FILENAME>.md`
- Mirror: `~/Desktop/CLAW-Backup/projects/<FILENAME>.md`
- GitHub: `cd ~/Desktop/CLAW-Backup && git add + commit + push`

**Step 5 — Complete:** `hermes kanban complete <card_id>` — moves card to done.

**Step 6 — Report:** Telegram summary with:
- Phase name and outcome
- Key deliverables created
- GitHub hash
- Recommended next phase

### Master Card + Phase Child Cards Creation Pattern

When creating a new multi-phase project:

```bash
# 1. Create master card
hermes kanban create "PROJECT NAME — Master"

# 2. Mark master done immediately (it's the container, not work)
hermes kanban complete <master_id>

# 3. Create Phase 2-N cards
hermes kanban create "Phase 2 — Descriptive Name" --body "## Depends On\n<master_id> (Phase 1)"
```

Card titles: `Phase N — Descriptive Name` for sequential phases.

### Save-to-3-Locations Convention

Every phase deliverable must be saved to all three locations:

```bash
cp ~/.hermes/knowledge/<FILE>.md ~/Desktop/CLAW-Backup/projects/<FILE>.md
cd ~/Desktop/CLAW-Backup && git add projects/<FILE>.md
git commit -m "feat(project): Phase N — description" && git push origin main
```

Never skip the git push. If no remote exists, state "NO REMOTE" clearly.

### Telegram Summary Format (per phase)

```
**✅ Phase N — Name COMPLETE**
**Key artifacts:** File 1, File 2
**GitHub:** pushed ✅ (\`<hash>\`)
**Next: Phase N+1** (\`<card_id>\`)
```

### Routing Ledger Rules (Cross-Reference)

- Every card involving AI work MUST have a Routing Ledger comment before completion
- The ledger MUST be a card comment, not just in the card body
- cost_tier must reflect actual model usage
- Use `last_model_used` and `next_model_planned` so the model chain is visible

---

## Phase 2 (SquarePayouts) Execution Pattern — Confirmed 2026-05-15

When executing a multi-feature rebuild (T1-T6) on an existing codebase:

**Serial builder execution (not parallel):**
- One builder at a time, not parallel builds
- Order: T1 host control center, T2 setup wizard, T3 participant, T4 storefront
- T6 cleanup runs alongside verification but NOT during active builder writes
- T5 ops runs non-invasively in parallel as documentation task

**Approval gating per task:**
- T1, T2, T3, T5, T6 = approved (explicit or via Phase 2 directive)
- T4 = marked `Approval needed: yes` (buyer-facing revenue flow change)
- Never proceed on cards marked `Approval needed: yes` without Marcelo's explicit approval

**Serial builder order decision tree:**
```
Task graph exists → show graph to Marcelo before creating cards
Multiple builders available → recommend serial unless:
  - Tasks are in separate files (no shared state risk)
  - Tasks are pure API additions (no UI coupling)
  - Tasks are documentation only (ops, not builder)
Parallel is RIGHT for: research, analysis, content drafts, independent research probes
Serial is RIGHT for: feature code in same codebase (avoids merge conflicts)
```

**4-layer model enforcement:**
Every feature card must name which layer it affects:
- Buyer (purchaser becomes host after checkout)
- Host (creates and manages boards)
- Participant (selects squares, views status, sees winners)
- Super Admin (MFA enrollment, pricing control, analytics)

Cards that drift to 3-role framing (customer/host/admin) must be corrected to 4-layer.

## Pitfalls

**Reassignment vs. new task.** If a reviewer blocks with "needs changes," create a NEW task linked from the reviewer's task -- don't re-run the same task with a stern look. The new task is assigned to the original implementer profile.

### "done" Means Verified, Not Reported (Standing Rule — 2026-06-03)

A subagent marking a card `done` is a *claim*, not a fact. The kanban board is silent about whether the claimed work was actually done. **The orchestrator (or any reviewer with the right tools) MUST re-validate** before treating the work as a real completion, especially for cards that touch shared state, infra, or behavior that downstream cards depend on.

**When this bites — observed patterns (BossMan, 2026-06-03):**

- A `builder` subagent marked `t_72cca604` "Per-service /health endpoints + strict Boss Hub checker" as `done` in 354s. The checker code WAS written. The health_path registry fields WERE added. But the `/api/health` routes the design required were NEVER added to travel-os or client-hub. The card's "Verification" checklist in the body was not ticked. Downstream consequence: Boss Hub immediately showed `warning: 404` for 3 services until BossMan caught it and reverted the health_path fields. The same agent's run also triggered the unauthorized Caddy install (separate incident — see `security-incident-audit`).
- A `builder` subagent marked `t_beb37c74` "Money Pipeline — bring it back online" as `done` while the live app was running under the **wrong PM2 daemon** (`~/.hermes/profiles/builder/home/.pm2` instead of the main `~/.pm2`). `pm2 save` had no effect on the main daemon; the process survived `pm2 kill` only because PM2 didn't know about it. Real recovery was 30% complete.

**Standing validation pattern (apply to every `done` claim):**

1. **Read the card body Verification checklist.** If any item is unchecked, the work is not done regardless of the status field.
2. **Cross-reference the card's "Out of scope" and "Required v3.0 fields" against the actual work.** If claimed-deliverables reference items in scope that don't exist on disk, the work is partial.
3. **For infra/runtime cards (work_type: runtime_hardening or feature touching PM2/cron/LaunchAgents), run the canonical smoke test:**
   - `pm2 list | grep <name>` — is it in the right PM2 home (`~/.pm2` not a profile home)?
   - `cat ~/.pm2/dump.pm2 | python3 -c "import json,sys; print([p['name'] for p in json.load(sys.stdin)])"` — is it persisted to the dump?
   - `pm2 kill && pm2 resurrect` — does the process come back?
   - `lsof -i :<port>` — is the expected port listening?
4. **For code/feature cards, `git diff` against the claimed file list.** If the card body says "I changed foo.ts" but `git diff --stat` shows it untouched, the work is hallucinated. Document the verified-clean result in a card comment and update the card body to match reality.
5. **For cards touching shared registries/services (Boss Hub, dashboards, cron, LaunchAgents), check that dependent systems still work.** Example: a card that updates the Boss Hub health_path fields MUST re-probe all 4 exposed services and confirm the status badges are correct before claiming done.
6. **If validation fails, do NOT just close the card.** Post a comment on the card with the verification result, list what's actually missing, and either: (a) reopen the card by setting `status='running'` via SQLite, (b) split the work into clearly-named follow-up cards (4a/4b/4c pattern), or (c) escalate to the orchestrator with a structured re-assignment.

**One-line re-validation rule:** *A subagent's "done" is a starting point for verification, not an ending point for it.*

**Card-body pattern for partial work that gets split:**

When splitting a "done" card that turned out to be partial, use the `<orig> → <suffix>a/b/c` naming so the audit trail is obvious:

```
Original: t_72cca604  (Per-service /health endpoints + strict Boss Hub checker)
Split:
  4a. t_NEW_A  Add /api/health to travel-os + client-hub (builder, ~1 hour)
  4b. t_NEW_B  Commit strict checker + templates (ops, ~10 min)
  4c. t_NEW_C  Re-verify Boss Hub badges from a real browser (qa, ~30 min)
```

Post a comment on the original card that explains the split + links to the new IDs, then `UPDATE tasks SET status='running'` on the original until 4a/4b/4c all complete. (See also the **`subagent-handoff-verification`** workflow in `kanban-worker` for the worker-side perspective.)

### Subagent-Handoff Verification (Worker-Side Companion)

When YOU are the worker subagent marking a card `done`, do this BEFORE flipping the status — the orchestrator will re-validate regardless, and doing it first saves a round-trip:

1. Re-read the card body's Verification checklist and tick every box (or document why it can't be ticked).
2. For infra/runtime work, run the canonical smoke test (see the validation pattern above) and paste the output into a card comment.
3. If the work is partial, set the card body to reflect the **actual** state — list what's done with evidence and what's still pending. Do NOT mark `done` if the body is honest about the gap.
4. If a verification item failed, post the failure as a card comment and requeue rather than marking done with a known defect.

**Self-check question before `kanban complete`:** "If BossMan re-ran the canonical smoke test on this work, would he find any of my claims to be false?" If yes, fix it first.

**Approval bypass.** Never proceed on a card marked `Approval needed: yes` without explicit approval from bigdawg. Even if it seems obvious. Ask.

**Draft-not-on-disk assumption.** When returning file content in chat, note clearly that it must be pasted. Files returned in chat are not automatically written to disk.

**GitHub SSH vs HTTPS.** `git@github.com` (SSH) may fail with "Permission denied (publickey)" on some machines. Fall back to `https://github.com/USER/REPO.git` (HTTPS). SSH keys for GitHub are stored at `~/.ssh/`.

**Auto-archive is disabled** on this board. Archive only manually via `hermes kanban archive <task_id>`.

**PM2 vs Hermes cron — use the right tool for the job:**
- PM2 → long-lived daemons (servers, watchers, bots that stay running)
- Hermes cron → time-based scripts (run briefly, exit, wait for next tick)
- Never put a cron-driven script under PM2 with `autorestart: false` — causes instant-restart crash loops
- Full pattern: `references/basecamp-monitor-pm2-crash-loop.md`
- **New reference:** `references/builder-timeout-work-complete.md` — orchestrator-side recovery from `outcome: timed_out` when the work actually landed. Decision tree, smoke-test recipe, real example from t_056268b1 (Travel OS Card A, 2026-06-04).
- **New reference:** `references/status-transitions-and-grep-pitfalls.md` — which status transitions have a CLI verb and which require direct SQLite; `awaiting_approval` has no CLI verb (orchestrator path). Also: grep substring false-alarm pitfalls (e.g. "duplicate const" that isn't real).

**New reference:** `references/service-cleanup-decision-framework.md` — Full KEEP/FIX/RETIRE decision tree for auditing PM2 + LaunchAgents + scripts. Includes inventory commands, classification criteria, cleanup execution patterns, and memory recording.

**New reference:** `references/travel-os-build-pattern.md` — Full reusable build pattern for multi-phase system creation: document hierarchy, approval gate classification, phase-gated dynamic intake, review gate hard stop, save-to-3-locations convention. Validated by Travel OS Phases 1-4 (2026-06-02).

### Binance Bot — Hard Restart Gate + Controlled Restart Window Pattern

When a critical trading service (binance-bot, port 8104) must be restarted safely, a **hard restart gate** enforces that restart only happens after specific pre-conditions are met, in a specific sequence, with monitoring.

**Card structure for a restart gate:**
- Parent card: defines the hard gate — all required conditions listed in card body
- Child card: pre-trade hook restoration — must be DONE before gate clears
- Child card: controlled restart protocol — documents exact restart sequence
- All children linked to parent via `hermes kanban link <parent> <child>`

**Hard gate example (Binance bot):**
```
Restart is FORBIDDEN until:
1. t_07c30d9a completed by builder (all 5 deliverables confirmed with test evidence)
2. safe-start.js exits 0
3. restart-health-check.js passes all 16
4. Marcelo explicit GO in controlled restart window
```

**Required Deliverables template (pre-trade hook card):**
1. pre-trade-hook.js at correct path (e.g. /Users/bigdawg/Projects/trading-review/pre-trade-hook.js)
2. Hook runs in blocking mode in server.js — no try/catch swallow
3. Hook validates: schema, SL direction, riskPct <= 5%, position size, NaN values — fails CLOSED on any error
4. Journal logging to data/trade-journal.json — non-blocking on failure
5. Test coverage: manual or automated test run — results attached to card

**Controlled restart window (documented on restart protocol card):**
1. node safe-start.js — proceed ONLY if EXIT=0
2. pm2 start binance-bot
3. node restart-health-check.js — confirm all 16 checks PASS
4. Monitor logs, balances, open orders for at least 60 min with rollback triggers ready
5. If any check fails or anomalies — STOP bot immediately, execute rollback
6. Only then mark restart as GO and update card status

**Typical card graph for a critical service restart gate:**
```
t_parent_gate (ops, P0)
├── t_child_hook (builder) — pre-trade hook restoration
├── t_child_selfhealing (ops/builder) — self-healing package implementation
└── t_child_restart_protocol (ops) — controlled restart window steps (DONE when protocol written)
```

**safe-start.js minimum checklist (8 gates):**
- module existence at correct path
- DB schema integrity (required columns present)
- hook file present + exits clean on test invocation
- riskPct <= 5%
- PAPER_MODE flag correct
- journal path writable
- no NaN in config values
- all critical env vars present and non-empty

**restart-health-check.js minimum (16 checks):**
- PM2 status = online
- bot uptime > 60s
- /api/health returns 200 within 2s
- lastTradeTimestamp updated within 10 min
- no SQLite errors in logs
- pre-trade hook loaded (no Module Not Found)
- PAPER_MODE flag correct
- riskPct from config
- open orders count matches expected
- balance matches expected
- no NaN in active order parameters
- journal file writable
- INTEL_GATE reads valid intelligence.json
- no ERROR-level log entries in last 5 min
- cron health check firing every 5 min
- Telegram health alert confirmed sent

### Multi-Card Status Update Pattern

When Marcelo asks for status on N cards simultaneously, always audit first, then update. Never assume card state.

**Sequence:**
1. `hermes kanban show <id>` for each card — captures actual status, comments, events, last summary
2. Cross-reference against prior session context or known history
3. For each card: (a) what's already implemented with evidence, (b) what remains, (c) realistic ETA to DONE
4. Post structured status comment to each card via `hermes kanban comment <id> <status>`
5. Summarize for Marcelo in short format: grid of PASS/FAIL, ETA, next action

**Status comment template per card:**
```
## STATUS UPDATE — YYYY-MM-DD

### (1) Already implemented (git commits / test runs)
- [list with ✅ or ❌ per item]

### (2) What remains
- [list remaining work]

### (3) ETA to DONE
- [realistic estimate]

### Card Dependencies
- Unblocks: [child card that this card unblocks]
- Blocked by: [parent card this card waits on]
```

**Rule:** Post status update the same day as Marcelo's request. Include ETA. Hard gate conditions unchanged unless Marcelo explicitly clears them.

### Emoji-in-Kanban-Comments Pitfall

When posting `hermes kanban comment` with emoji in the body, bash shell expansion interferes. Emoji characters (U+1F300-U+1F9FF) get interpreted as command names by bash, producing "command not found" errors in the output even though the comment posts successfully (exit code 0).

**Workaround:** Accept the shell noise — exit code 0 confirms the comment landed. Do NOT retry; doing so creates duplicate comments. The shell noise is cosmetic only.

**Comment body is a POSITIONAL arg, not a flag (`--body` / `--body-file` / `--file` do NOT exist for `hermes kanban comment`):** Mirror of the worker-skill pitfall. BossMan frequently posts long plan/validation reports as card comments. The correct pattern is command substitution:
```bash
# CORRECT — write body to file, substitute via $(cat <file>)
hermes kanban comment t_abc123 "PLAN: $(cat /tmp/card-plan.md)"

# WRONG — --body, --file, --body-file all fail with "unrecognized arguments"
hermes kanban comment t_abc123 --body "$(cat /tmp/card-plan.md)"   # exit 2
hermes kanban comment t_abc123 --file /tmp/card-plan.md            # exit 2
```

**Plan-comment race (orchestrator-only):** The kanban dispatcher can pick up a `ready` card and start a worker before the orchestrator finishes posting a long PLAN comment. Observed 2026-06-04 on `t_056268b1` (Card A): orchestrator spent ~90s drafting the plan in chat, the builder worker was already running when the plan comment landed. Fix: write the plan to a local file FIRST, then `hermes kanban comment <id> "$(cat plan.md)"` near-instantly. The dispatcher picks up on `create` or `assign`; the plan comment is informational, not blocking. Builder should re-`kanban_show` to read the latest comments before each major decision.

**Card creation — TITLE is positional (NO --title flag), --body is --body "...":**
```bash
# CORRECT — title is positional argument
hermes kanban create "Exact Card Title Here" \
  --body "## Meta\nProject: travel-os\n..." \
  --assignee builder \
  --priority 1

# WRONG — --title flag does not exist
hermes kanban create --title "Exact Card Title Here" ...   # produces: error: unrecognized arguments: --title
```

**Rule:** Title is the first positional argument. `--body` passes the body string. `--assignee` and `--priority` work as expected. If `--title` is used, the command fails with exit code 2. Always verify card creation succeeded with `hermes kanban show <new_id>` afterward.

**Other CLI pitfalls observed (verified 2026-06-04):**
- **`--tags` flag does NOT exist.** `hermes kanban create ... --tags travel,ixtapa,planning` is silently eaten — exit code 0 but the card has no tags. Omit `--tags` entirely; if you need to tag a card, edit the body to include a `## Tags` line.
- **`hermes kanban boards` subcommand is `create`, NOT `add`.** `hermes kanban boards add travel-os` returns `invalid choice: 'add'`. Correct: `hermes kanban boards create travel-os`. Confirmed 2026-06-04 on the `travel-os` board creation.
- **`hermes kanban boards switch` is persistent** — it changes the active board for subsequent commands. Verify the active board with `hermes kanban boards list` before creating a card if you've been switching between boards.
- **Card body frontmatter lines must match exactly.** The Meta block (`Project:`, `Internal owner:`, `Priority:`, etc.) is parsed by the kanban dashboard for filtering. A typo like `internal owner:` (lowercase) breaks the filter silently.
- **`hermes kanban dispatch --json` does NOT surface `respawn_guarded` (verified 2026-06-04).** When a ready task isn't spawning and the JSON output shows `Spawned: 0` with no `skipped_*` field that includes the task id, it is likely guarded by `check_respawn_guard` — and that bucket is silently dropped from the CLI's JSON output (the field exists on `DispatchResult` but is not emitted by `_cmd_dispatch`). **Diagnostic:** query the `task_events` table for `kind='respawn_guarded'` to confirm, and check the `task_runs` table for a recent `outcome='completed'` run within `_RESPAWN_GUARD_SUCCESS_WINDOW` (default 3600s).

**Never put emoji in commands that appear in kanban comment bodies** — they are decorative and not worth the confusion. Use text descriptors instead.

### BossMan Conventions (bigdawg-specific)

**Board:** `bossman`
**DB:** `~/.hermes/kanban/boards/bossman/kanban.db`
**Switch:** `hermes kanban boards switch bossman`

#### Key Tables

**`tasks`** — core card table. Schema:
```
id, title, body, assignee, status, priority, created_by, created_at,
started_at, completed_at, workspace_kind, workspace_path, tenant,
result, claim_lock, claim_expires, consecutive_failures,
last_failure_error, worker_pid, max_runtime_seconds, last_heartbeat_at,
current_run_id, workflow_template_id, current_step_key, skills, max_retries
```
**NOTE:** `tasks` has NO `parent_id` column. Parent-child linking is via `task_links`.

**`task_links`** — parent-child relationships. Schema:
```
parent_id (TEXT), child_id (TEXT)  -- PK is (parent_id, child_id)
```
To link a sub-card to a parent: INSERT into `task_links` directly.

**`task_comments`** — card comments. Schema:
```
id, task_id, author, body, created_at
```

#### Card Creation via SQLite (for complex needs)

When `hermes kanban create` doesn't expose needed fields, use raw SQLite:

```bash
NOW=$(date +%s)
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "INSERT INTO tasks (id, title, status, created_at, workspace_kind, workspace_path, tenant)
   VALUES ('<id>', '<title>', '<status>', $NOW, 'scratch', '\~/.hermes/kanban/boards/bossman', 'hermes')"

# Link sub-card to parent
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "INSERT INTO task_links (parent_id, child_id) VALUES ('<parent_id>', '<child_id>')"
```

**Card ID format:** any string — `t_sa3_01`, `t_mycard`, etc. are all valid.

**To update card status:**
```bash
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "UPDATE tasks SET status='done', completed_at=$(date +%s) WHERE id='<task_id>';"
```

**To add a comment:**
```bash
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "INSERT INTO task_comments (task_id, author, body, created_at)
   VALUES ('<task_id>', 'bossman', '<body>', $(date +%s));"
```

| Status | Meaning |
|--------|---------|
| `inbox` | Raw incoming task, not yet triaged |
| `planned` | Triage done, queued for work |
| `running` | Work in progress |
| `client_testing` | Build ready, testers/clients accessing via Tailscale |
| `feedback_review` | New feedback to process (Basecamp or direct) |
| `blocked` | Waiting on something — diagnose or escalate |
| `awaiting_approval` | Needs bigdawg's explicit sign-off before proceeding |
| `done` | Completed |

#### Card Body Frontmatter (YAML)

Every card body starts with:

```yaml
## Meta
Project: money-pipeline | pm-dashboard | youtube | squares | bakery | other
Internal owner: bossman | builder | ops | trading | content
Human owner: Cello | Cisco | Marcus | none
Stakeholder: internal | client-squares | client-bakery | other
Priority: P0 | P1 | P2
Change type: bug | workflow | feature | content | research | infra
Approval needed: yes | no
Feedback source: basecamp | direct | internal | other

## Links
- Basecamp: <url>
- Dashboard: <url>
- GitHub: <url>

## Description
<one-line summary>

## Notes
<context, history, decisions made>
```

#### Routing Rules (auto-assign by task type)

| Task type | Assign to |
|-----------|-----------|
| Code, features, scripts, dashboards, Git, Cursor | `builder` |
| Runtime, PM2, ports, health checks, Tailscale, infra, deployments | `ops` |
| Market research, Binance/Kraken analysis, opportunities | `trading` |
| Content, scripts, docs, videos, social | `content` |
| Routing, approvals, prioritization, decisions | `bossman` |
| Unnamed human → default | `Cello` |
| Named Squares or Bakery | Set stakeholder: `client-squares` or `client-bakery` |
| Minor bug/workflow fix (no scope change) | Proceed without approval flag |
| Major scope/architecture/money change | Set `Approval needed: yes`, status → `awaiting_approval` |

#### Who Can Create / Move What

| Actor | Can create | Can move |
|-------|-----------|----------|
| bossman | Any column | Any column |
| builder/ops/trading/content | `inbox` or `planned` only | Own cards through stages |
| debug skill | `inbox` only | `inbox` → `planned` |
| bigdawg | Any | Any |

Anything with `Approval needed: yes` must sit in `awaiting_approval` until bigdawg approves. Never bypass this.

#### Kanban CLI Quick Reference

```bash
# Switch board (PERSISTENT — one-time, affects subsequent commands)
hermes kanban boards switch bossman

# Create card — TITLE is positional (NO --title flag), --body is --body "..."
hermes kanban create "Exact Card Title Here" \
  --body "## Meta
Project: travel-os
Internal owner: bossman
Human owner: Cello
Stakeholder: internal
Priority: P1
Change type: feature
Approval needed: no

## Description
One-line summary here." \
  --assignee bossman \
  --priority 1

# Create child card with parent link
hermes kanban create "Phase 2 — Marcelo Setup" \
  --body "Goal: Confirm environment and preferences.

## Tasks
- [ ] Confirm Chrome and accounts
- [ ] Record standing preferences

## Depends On
t_f1ad9b1b (Phase 1 - Blueprint Lock)" \
  --parent t_f1ad9b1b

# List cards on a specific board — --board flag BEFORE the subcommand
hermes kanban --board bossman list
hermes kanban --board bossman ls

# Show card details
hermes kanban show <task_id>

# Move status directly (no built-in CLI — use SQLite)
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "UPDATE tasks SET status='awaiting_approval' WHERE id='<id>';"

# Block / unblock
hermes kanban block <task_id>
hermes kanban unblock <task_id>

# Add comment
hermes kanban comment <task_id> "Context from Basecamp: <url>"

# Complete a card
hermes kanban complete <task_id>

# Archive (manual only — no auto-archive)
hermes kanban archive <task_id>
```

#### Human Operator Names (editable)

Edit `~/.hermes/HUMAN_OWNERS.md`:

```markdown
# Human Operator Names
ALLOWED_HUMAN_OWNERS:
  - Cello       # default
  - Cisco
  - Marcus
  - none
DEFAULT_HUMAN_OWNER: Cello
```

To rename across all cards after editing HUMAN_OWNERS.md:
```bash
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "UPDATE tasks SET body = replace(body, 'Human owner: OLD', 'Human owner: NEW');"
```

### Perplexity Spaces (reference)

**Current Hermes Spaces (MiniMax 2.7 primary, rebuilt 2026-05-07):**

| Space | Owner | Board |
|-------|-------|-------|
| Agent OS | bossman | `bossman` |
| Trading Ops | trading | `trading-ops` |
| Trading Strategy & Portfolio | trading | `trading-strategy` |
| Toolchain & Dev | builder | `dev` |
| Business & Ideas | bossman | `ideas` |
| Content & YouTube | content | `content` |
| Real Estate | bossman | `real-estate` |
| Ops Processes | ops | `ops` |

Source of truth: `/Users/bigdawg/Desktop/perplexity-spaces Hermes/`
Mirror: Obsidian `/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces/`
Mirror: GitHub `BIGDAWG35/BossMan/docs/perplexity-spaces/`

> **Phase 7A clarification (2026-05-10):** "Phase 7A" does NOT exist in any record, blueprint, or session memory. The operating blueprint defines only Phases 0–7. Do not reference "Phase 7A" — it is a ghost term. Phase 7 consists of two sub-parts: Perplexity Spaces (✅ complete as of 2026-05-07) and PM dashboard retirement (port 5000 offline, effectively done, no formal record).

**Current Perplexity context (2026-05-22 — active):**
- Space: "Projects & Mission Control Active Projects Status"
- Completed: Phases 2 (Memory), 3 (Self-Audit), 4 (Weekly Review), 5 (Deep Audit), 6 (Service Map), 8 (Money Pipeline), 9 (CryptoIntel design), 10A/10B (Binance Bot restoration), 11A (Intel Gate + LIVE infrastructure)
- Pending: Phase 9B (CSDAWG 2.0 weekly cron), Phase 11B (tiny LIVE test, requires Marcelo approval)
- State: Binance Bot PAPER_MODE=true, INTEL_GATE_ENABLED=true, intelligence.json=MID_CYCLE placeholder

**Perplexity task-routing pattern (2026-05-22):**
When Marcelo says "continue this in Perplexity under [PROJECT:X][PHASE:Y]":
1. BossMan opens Perplexity via Computer Use → finds thread in "Projects & Mission Control Active Projects Status"
2. Reads last 3-5 messages → syncs context
3. Creates Kanban sub-cards tagged [PROJECT:X] [PHASE:Y]
4. Executes phase autonomously (no copy/paste relay)
5. Writes results back to Perplexity thread
6. Notifies Marcelo only for major approvals

**Client Review Portal + Helpdesk Ticket System — Phase 1 Blueprint (2026-05-24):**
- Permanent blueprint: `CLIENT_REVIEW_PORTAL_HELPDESK_BLUEPRINT.md`
- Phase 1 ✅ complete; Phase 2+ pending
- Pilot: SquarePayouts — verify state before Phase 3
- Trigger phrase: "BossMan, use Perplexity for [PROJECT:X][PHASE:Y] — continue from the last Mission Control thread and run autonomously until done or you need my approval."

**Brain-Layer Policy (permanent — reuse in all project blueprints):**
```
Perplexity Search (web/app) = default external intelligence layer
BossMan/Hermes = execution/orchestration layer
Claude/OpenAI/DeepSeek = structured reasoning + review layer
Computer Use (CuaDriver) = UI interaction only, when CuaDriver healthy
Marcelo = approval layer only — NOT a copy/paste relay
```

**Phase 9B → Phase 11B sequencing (critical):**
- Phase 9B implements CSDAWG 2.0 weekly cron → populates `intelligence.json` with real regime/band data
- Phase 11B LIVE test should NOT run until Phase 9B is complete
- Reason: placeholder intelligence.json makes INTEL_GATE inactive → bot trades without regime filtering
- Full Perplexity workflow: `~/.hermes/SOUL.md` — "Perplexity Orchestration Loop"

---

### Phase-Based Travel OS Execution Pattern (2026-06-02 — Confirmed; Updated 2026-06-03)

When running a multi-phase project with Marcelo's explicit approval gates and review stops, use this full orchestration sequence. This pattern was validated across Travel OS Phases 14–20 (completed 2026-06-03, commit `9627388`).

**Travel OS v1 delivered (Phases 14–20):**
- `~/Projects/travel-os-dashboard/` — source
- `~/Desktop/CLAW-Backup/2026-06-03 Travel OS Phase XX.md` — phase notes
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — Travel OS section (v1.2)
- `~/.hermes/spaces/agent-os/04-phase-history.md` — Phase 14–20 table

**Phase 19 scope lock (critical for future work):**
Phase 19 (Financial Closeout, card `t_305deb2e`) scope was explicitly locked:
- In scope: shared expense capture, per-person settlement, final per-trip/person totals, post-trip notes, repeat/skip tags, archive to Past Trips
- Explicitly out of scope: tax logic, receipt parsing, accounting exports
- Goal: "friends-paid-me-back" level — not bookkeeping

**Phase 20 verifier pattern:**
Before declaring a phase complete, verify file changes with `git diff`. If a review comment flags a file as changed but `git diff` shows zero modifications, document the verified-clean result in a card comment. Do not patch files that don't need patching.

**Per-Phase Execution Sequence (repeat for each phase):**

```
STEP 1 — Claim the phase card
  hermes kanban claim <card_id>          ← marks card running, sets workspace

STEP 2 — Execute
  Do the phase work. Use appropriate model/skill per Routing Ledger.

STEP 3 — Routing Ledger (MANDATORY before completing)
  Post structured comment via hermes kanban comment <card_id> "## Routing Ledger...":
  - work_type, primary_artifact, lead_model, supporting_models, review_models
  - final_integrator, cost_tier, last_model_used, next_model_planned
  - What was done, outcome
  - routing ledger goes on CARD AS COMMENT, not body — card body is set-at-creation only

STEP 4 — Save deliverables to all 3 locations
  Canonical: cp <file> ~/.hermes/knowledge/<FILENAME>.md
  Mirror: cp <file> ~/Desktop/CLAW-Backup/projects/<FILENAME>.md
  GitHub: cd ~/Desktop/CLAW-Backup && git add projects/<FILENAME>.md && git commit -m "feat(project): Phase N — description" && git push origin main

STEP 5 — Complete the card
  hermes kanban complete <card_id>       ← moves to done

STEP 6 — Telegram summary
  Send Marcelo: phase name, outcome, key artifacts, GitHub hash, next phase recommendation
```

**Formal Review Gate Pattern (Hard Stop):**

When Marcelo explicitly requires approval before a phase proceeds further, embed a formal review gate in the phase card:

**Card body format for a review gate phase:**
```markdown
## Formal Review Gate (Hard Stop)
This card contains a hard review gate. You MUST stop and report for Marcelo approval BEFORE proceeding.

Review gate checklist:
- [ ] [Deliverable 1] complete + verified
- [ ] Marcelo reviews [specific thing]
- [ ] Marcelo approves OR requests changes
- [ ] Only after Marcelo explicit approval does work continue

---

## MVP Shell Requirements
- [ ] Port 3535 ...
...
```

**Routing Ledger for a review-gate phase:**
```yaml
work_type: feature_build_with_review_gate
lead_model: MiniMax 2.7 (BossMan)
cost_tier: 2            # MVP shell with review gate
artifacts:
  - dashboard MVP at port 3535
  - sample trip data
  - review gate documented
review_gate: MANDATORY — stop at MVP completion, await Marcelo approval
```

**Key rules:**
- The HARD STOP is in the card body AND the Routing Ledger
- BossMan MUST NOT proceed past the gate without Marcelo's explicit approval
- After Marcelo approves: document what was approved + any changes requested in card comment, then proceed
- The review gate card stays `running` after the MVP is built until Marcelo approves

**Travel OS Phase sequence (example):**
```
t_f1ad9b1b (master, done) — "Travel OS — Master"
  ├── t_4794f69f (done) — Phase 2 Marcelo Setup
  ├── t_f740c2e3 (done) — Phase 3 Data Model + Dashboard Schema
  ├── t_35a7bff1 — Phase 4 Discovery Engine
  ├── t_abfc6baa — Phase 5 Booking Intelligence
  ├── t_6b63b993 — Phase 6 Day Trip Mode
  ├── t_cc189b0d — Phase 7 Output System
  ├── t_52a4e6a9 — Phase 8 Active Trip Mode
  ├── t_e923bf3e — Phase 9 Post-Trip Close + Learning
  └── t_6f835938 (running) — Phase 10 Dashboard MVP + Marcelo Review Gate
```

**Save-to-3-Locations (exact sequence):**
```bash
cp ~/.hermes/knowledge/<FILE>.md ~/Desktop/CLAW-Backup/projects/<FILE>.md
cd ~/Desktop/CLAW-Backup
git add projects/<FILE>.md
git commit -m "feat(project): Phase N — description"
git push origin main
```

Never skip the git push. If no remote exists, state "NO REMOTE" clearly in the report.

**Reference:** Full Travel OS schema + blueprint in `~.hermes/knowledge/TRAVEL_OS_*.md` (blueprint/schema/preferences/dashboard plan)

### System Documentation Hierarchy (2026-06-02)

When building a new system from scratch (not a code-heavy feature but a new operational system), create documents in this order. Each document builds on the previous one without redefining what's already settled.

**Document creation order:**

```
1. BLUEPRINT        — System overview, phases, governance, account stack, approval rules
2. SCHEMA           — Data model: entity definitions, field types, status models, storage approach
3. WORKFLOW/ENGINE  — Operational logic: modes, triggers, scoring, logging rules, safety integration
4. IMPLEMENTATION   — Build direction: port reservation, design standard, module specs, UI behavior
5. BUILD            — Actual code/dashboard/service creation
6. REVIEW GATE      — Hard stop for Marcelo before deeper investment
```

**Each document's purpose:**

| Document | Answers | Contributes To |
|----------|---------|----------------|
| Blueprint | What are we building? Why? What are the phases and rules? | Guiding governance doc |
| Schema | What data do we track? Fields, statuses, types? | All downstream docs reference this |
| Workflow | How does the system actually work? Modes, decision trees, scoring? | Schemas explain WHAT; workflows explain HOW |
| Implementation | What port? What design style? Dynamic or static? Phase-gated or form-first? | Defines the build parameters |
| Build | Code, config, deployment | Running system |
| Review Gate | Stop, review, approve before deeper spend | Avoids over-building the wrong thing |

**This pattern was validated by the Travel OS build sequence:**
- TRAVEL_OS_BLUEPRINT.md (Phase 1-2) — System overview, phases, governance, account stack
- TRAVEL_OS_SCHEMA.md (Phase 3) — Trip entity, status model, research/expense/trip-packet schemas
- TRAVEL_OS_DISCOVERY_ENGINE.md (Phase 4) — Inspiration mode, Due Diligence mode, scoring model
- TRAVEL_OS_DASHBOARD_PLAN.md (Phase 3 addendum) — Port reservation, design standard, 10 modules, dynamic UI rules
- TRAVEL_PREFERENCES.md (Phase 2) — Learned preferences over time, no upfront defaults

**Phase-gated delivery:** Each document is produced in its own Kanban phase. No phase moves forward until the previous phase's document is complete, saved to 3 locations, and committed to GitHub.

### Approval-Gate Classification (2026-06-02)

A simple binary "Approval needed: yes/no" is insufficient for Marcelo's systems. Use this classification system:

| Gate Type | What Triggers It | Behavior |
|-----------|-----------------|----------|
| money | Budget decisions, spending limits, cost comparisons that affect actual spending | Hard gate — explicit Marcelo approval before ANY action that costs money or commits to a spend range |
| account | Login, credential use, API access tied to personal accounts (Orbitz, Marriott, banking, brokerages) | Hard gate — explicit Marcelo approval before accessing or logging into any personal account |
| safety | Level 3+ travel advisories, Do Not Travel zones, active cartel/civil unrest areas, high-crime neighborhoods | Hard gate — explicit Marcelo approval before deeper planning or booking in affected areas |
| ops / info | Dates, travelers, trip vibe, departure airport, preferences (non-money/non-account/non-safety) | No gate — BossMan asks freely as needed. Answers are remembered and not re-asked |

**How to log gates on a card:**
- In card body: Approval needed: yes for any money/account/safety gate
- In TRIPS_INDEX.json (for Travel OS): approval_needed: ["money"] or approval_needed: ["money", "account"]
- As a card comment when gate fires: "Gate: money — Marcelo must approve budget before comparing flights"

### In-flight worker introduces build break — recovery playbook

When a dispatched worker (builder/ops) is mid-flight and breaks `npm run build` (TypeScript prop mismatches, missing exports, etc.), the orchestrator must take over and revert before the broken code accumulates. Canonical sequence: block card (single-quoted reason) → `git checkout HEAD -- <broken_files>` → rebuild via hardening script → verify port+HTTP+PM2 → post incident report. Full playbook: `references/in-flight-build-break-recovery.md`. Pattern observed 2026-06-04 on Travel OS Card B (t_87258b2c) — builder added `onUpdateTrip` prop to modules that didn't accept it, build failed, BossMan reverted in 90 seconds.

### Respawn guard override — when legitimate re-spawn is blocked

The dispatcher has a 1-hour `_RESPAWN_GUARD_SUCCESS_WINDOW` that defers re-spawn when a `task_runs` row with `outcome='completed'` exists within the window. Intent: prevent thrashing on tasks that just succeeded. Failure mode: when a `ready` task's prior run was a partial fix and Marcelo explicitly authorizes re-spawn, the guard blocks the operator's intent for up to 1 hour.

**Symptom (verified 2026-06-04 on t_91793334):**
- `hermes kanban show <id>` → status=`ready`, assignee=`ops`
- `hermes kanban dispatch` → `Spawned: 0`, no `skipped_*` entry for this task, no `spawned` entry either
- `task_events` table has `kind='respawn_guarded'` with `reason: 'recent_success'`

**Operator override (BossMan only — never ask Marcelo to run this):**
```bash
# 1. Confirm guard is the cause
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \
  "SELECT id, kind, payload FROM task_events
   WHERE task_id='<task_id>' AND kind='respawn_guarded'
   ORDER BY id DESC LIMIT 5"

# 2. Backdate the prior completed run by 2 hours
sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db <<SQL
UPDATE task_runs SET ended_at = ended_at - 7200
 WHERE task_id='<task_id>' AND outcome='completed';
INSERT INTO task_events (task_id, kind, payload, created_at) VALUES (
  '<task_id>', 'respawn_guard_override',
  json_object('reason', '<Marcelo directive text + prior-run-was-partial rationale>',
              'actor', 'bossman'),
  strftime('%s', 'now')
);
SQL

# 3. Dispatch — should spawn immediately
hermes kanban dispatch
```

**Hard rules:**
- The override is ONLY for cases where (a) the prior run was a known partial fix, (b) Marcelo has explicitly authorized re-spawn, and (c) waiting 1 hour would block Marcelo's intent.
- Always log an `respawn_guard_override` event with the rationale. The audit trail must show why the guard was bypassed, not just that it was.
- Never override for "the user is impatient" or "the task is overdue" — those are not sufficient reasons. The prior run must demonstrably be a partial fix.
- Alternative: just wait 1 hour. The guard is there for a reason. Override only when waiting would create real friction.
- Gate status: pending (waiting), approved (Marcelo said go), rejected (Marcelo said no, alternative needed)

**Never skip an approval gate.** Even if the decision seems obvious. Marcelo has been explicit: money, account, and safety decisions are his alone.

### Phase-Gated Dynamic Intake Design (2026-06-02)

When designing a new system that collects user preferences, use **phase-gated dynamic intake** rather than upfront static forms.

**Static form (bad — do not build):**
Tell me ALL your preferences now:
  Home airport: ___
  Vibe: ___
  Budget: ___
  Stay type: ___
Problems: blocks work until fully answered, answers may not be relevant yet, overwhelming.

**Phase-gated dynamic intake (good — build this):**
Phase exploration:
  Asked: What vibe are you looking for? Beach, city, adventure?
  NOT asked: stay preference, budget, account access — these are Phase 5+ territory

Phase comparison:
  Asked: Stay preference? Hotel, Airbnb, resort?
  NOT asked: booking details (Phase 9 territory)
  Budget: assumed with flag on card

**Rules for dynamic intake design:**

1. Only ask what's missing for the current phase — if it's not relevant to what you're doing right now, skip it
2. Remember answered information — pre-fill in later phases, never re-ask
3. Surface assumptions clearly — if you must make an assumption (budget band, stay type), state it with a flag and a card comment so Marcelo can correct
4. Approval gates are visible but locked — badge means "this exists but Marcelo must approve before it affects decisions"
5. Learned preferences grow over time — after a trip completes, what Marcelo chose becomes a learned preference for next time. No forced setup questionnaire.

**Implementation pattern:**
- Map each question to a phase (exploration/comparison/booking/active-trip/post-trip)
- Tag each answer: learned (to TRAVEL_PREFERENCES.md) or per-trip (trip card only)
- Tag each gate: money, account, safety, or none
- Store in intake_log.json per trip so the dashboard can show what was asked, answered, or assumed

**This pattern was validated by Marcelo's explicit correction:** He rejected the upfront-global-defaults approach and confirmed he wants only what's needed per phase, with approval gates on money/account/safety.

---

## Phase 6 Current Status (2026-05-10)

**Phase 6 is BLOCKED on two independent gates — both require Marcelo to unblock:**

| Gate | Card | Blocker | Who resolves |
|------|------|---------|---------------|
| Gate 1 — Finance data | `t_71fdab1a` | No confirmed data source for Money Pipeline rebuild | Marcelo decides what finance data feeds the pipeline |
| Gate 2 — Binance bot | `t_faa6d371` | Pre-trade-hook missing, 32 restarts, `trading-monitor` dir gone | Marcelo approves Binance bot restoration work |

**Money Pipeline v2 (port 8020):** Running in degraded state — stream errors unfixed, research automation broken (no new opps since 2026-04-07), OpenClaw-owned cron. No Basecamp project. Phase 6 is the only path to a proper rebuild.

**Phase 6 unblock sequence:** Gate 1 must clear first (finance data decision), then Gate 2 (Binance bot). After both clear → Phase 6 begins with Kanban card creation + Basecamp project setup for Money Pipeline.

- Full Phase 6/7 verified status: `references/phase-6-1-results.md` (note: this file covers Phase 6.1/6.2 implementation from the v1 blueprint era — current status above takes precedence)
- Phase status reference: `migration-playbook/references/phase-status-2026-05-10.md`

- Full Space definitions and escalation rules per Space: `references/perplexity-spaces.md`
- Actual Kanban DB schema (tasks table, task_comments, hex IDs, SQL ops): `references/kanban-schema.md`
- Detailed Phase 0-2 audit findings, actual PM2/cron/port data, blocker resolutions: `references/migration-phase0-1.md`
## Phase 8 Implementation Pattern (Money Pipeline — Confirmed 2026-05-22)

For "prep + plan, then implement" phases:

### Phase 8 Prep Pattern (what was done)
1. **Source audit first** — confirm project root, enumerate endpoints, classify WORKING/DEGRADED/BROKEN
2. **Failure-point analysis** — identify exact failure point (not just "degraded" as a label)
3. **Spec document** — define desired capabilities, data sources, KPIs, outputs, safety rules
4. **Kanban sub-cards** — MP8-01 through MP8-05, all status=done, linked to parent
5. **Memory entries** — [TRADING], [ARCHITECTURE], [WORKFLOW] tagged per finding

### Phase 8 Implementation Pattern (what was done)
Low-risk first, each step tested before moving to next:

**Step 1 — Verify research cron health:**
```bash
# CORRECT DB path is money.db NOT money_pipeline.db
sqlite3 ~/Projects/money-making-dashboard/data/money.db \
  "SELECT COUNT(*) FROM opportunities WHERE created_at >= '2026-04-15' AND source LIKE '%money-morning%'"
# count > 0 = healthy; count = 0 = broken
```

**Step 2 — Add /api/health endpoint:**
- Lightweight, returns {status, total, v2Coverage, lastEnrichment, lastCreated, researchCron}
- No external side effects — reads local DB only
- Tested via `curl localhost:PORT/api/health | python3 -m json.tool`

**Step 3 — Fix research-qa POST:**
- GET route existed but POST was missing → 404
- Added POST handler that creates new opportunity record
- Tested: created test record, verified in DB, cleaned up

**Step 4 — Add daily auto-enrichment cron:**
- Script: `scripts/auto-enrich-v2.js`
- OpenClaw cron with schedule `0 6 * * *` (6 AM PDT)
- Safe targeting: only `scoring_model='claude-sonnet-4'` (v1 records)
- Health check before enrich — skip if server offline
- Logs to `logs/auto-enrich.log`

### Kanban card naming for implementation phases
```
MP8-01 → MP8-05  = Prep phase cards (done)
MP8-06 → MP8-10  = Implementation phase cards (done)
```
Same parent card, sequential IDs, clear separation of planning vs execution.

### Safety boundary for trading research phases
Money Pipeline (port 8020) = research only. Binance Bot (port 8104) = trading intel + execution.
- No position sizing, no orders, no capital allocation from Money Pipeline
- Clear boundary enforced in spec + memory entries
- Phase 9/10 consume read-only outputs from Money Pipeline

---

## Phase 6 — Localhost Project Improvement Engine (2026-05-22)

> This section covers Phase 6 execution (localhost cleanup, NOT the 2026-05-08 Money Pipeline Phase 6). For Money Pipeline rebuild, see Phase 8.

**Source:** Phase 5 outputs: SERVICE_MAP_2026-05.md, JOBS_OVERVIEW.md, DEEP_AUDIT_2026-05.md, MEMORY_CAPTURE_LOG.md

### Cleanup Playbook (Phase 6 DA-C* tasks)

For each legacy/archive task:

```bash
# 1. Verify no active references before archiving
grep -r "" ~/Projects/ ~/.hermes/ ~/Library/LaunchAgents/ 2>/dev/null | grep -v ".ARCHIVED\|.LEGACY"

# 2. Move to archived/legacy name (never delete)
mv ~/Projects/ ~/Projects/.ARCHIVED   # for old configs/scripts
mv ~/Projects/ ~/Projects/.LEGACY     # for redundant scripts

# 3. Update SERVICE_MAP_2026-05.md — mark file status
# 4. Update JOBS_OVERVIEW.md — update scripts table
# 5. Add memory entry tagged [ARCHITECTURE] [WORKFLOW] [PROJECT:Hermes]
# 6. Sync to Obsidian + GitHub
```

### PM2 Rename Pattern (DA-C3)

When a PM2 process is misnamed:

```bash
# 1. Get current PM2 id
pm2 list  # find the id (e.g., 18 for "node")

# 2. Stop + start with correct name (don't just rename in place — PM2 doesn't support rename)
pm2 stop <id>
pm2 start /path/to/server.js --name <correct-name>
pm2 delete <id>
pm2 save

# 3. Kill any old processes on the same port (old pid may still be running)
lsof -i :<PORT>  # find old pid
kill <old-pid>

# 4. Verify new process is listening
lsof -i :<PORT>

# 5. If launchd also managed this service, disable the launchd plist:
launchctl unload ~/Library/LaunchAgents/<service-name>.plist
# Mark launchd as DISABLED in JOBS_OVERVIEW.md
```

**Never use `pm2 restart <id> --name <new>`** — this does not change the stored process name. Must stop + start + delete + save.

### SC-02 Cloudflare-Tunnel Auth Verification (Deferred)

Cannot verify tunnel auth from inside the machine without cloudflare.com credentials. Pattern:

```bash
# Test tunnel exposure (confirm what's accessible externally)
curl -s --max-time 5 "http://127.0.0.1:<PORT>"  # confirm service responds locally

# Check tunnel process
ps aux | grep cloudflared
lsof -i :<TUNNEL_PORT> 2>/dev/null || echo "No direct listener — tunnel routes externally"

# Mark in SERVICE_MAP as: [SECURITY] [NEEDS VERIFICATION]
# Cannot resolve without: tunnel operator login at cloudflare.com
```

### Cron Validation Pattern (DA-C4)

For verifying user crontab entries:

```bash
# Check cron log — last entry date tells you if active or orphaned
cat ~/Projects/<project>/logs/exporter.log | tail -5

# Verify cron is still in crontab
crontab -l | grep <command>

# Decision: last entry within 7 days → ACTIVE, keep
# Decision: last entry >30 days ago → orphaned, remove crontab entry
# Decision: never ran or empty log → investigate or remove
```

### Cron Debugging — Active vs Legacy Scripts (Phase 8 lesson, 2026-05-22)

When a research/opportunity pipeline appears broken:

**Step 1 — Identify all cron-related entries:** OpenClaw cron jobs (`~/.openclaw/cron/jobs.json`), user crontab (`crontab -l`), PM2 cron, any scripts in `research_logs/` or `logs/` directories.

**Step 2 — Determine which job is ACTIVE vs LEGACY:** An entry is ACTIVE only if: (a) the cron schedule is enabled=true AND (b) the agent/script being called is currently deployed. A script with logs but no active cron entry is LEGACY.

**Step 3 — The `scraper.js` pattern:** Legacy scripts often show error logs (e.g., `/bin/sh: node: command not found`) because they were written with hardcoded paths. These errors are STALE — they indicate the script was abandoned, not that it's currently failing. **Do not fix legacy scripts** unless they are the active cron job.

**Step 4 — Separate OpenClaw cron from legacy cron:** OpenClaw owns `money-morning-research-v2` (5 AM PDT). Legacy scripts like `scraper.js` use system cron and are NOT active. When diagnosing "no new opportunities since X date," check OpenClaw jobs.json first, not the legacy scraper.

**Step 5 — Check the FIXED job vs the ACTIVE job:** If fixing a broken cron, verify the fix was applied to the job that is actually running — not a disabled duplicate. In Phase 8: `daily-research-5am` (DISABLED) got the idle timeout fix, but `money-morning-research-v2` (ENABLED) is the actual active job. Verify both.

**Verification check for research cron:**
```bash
sqlite3 ~/Projects/money-making-dashboard/data/money_pipeline.db \
  "SELECT COUNT(*) FROM opportunities WHERE created_at >= '2026-04-15' AND source='daily_research'"
# count > 0 = cron is working; count = 0 = cron still broken
```

### Background Python Processes — TTY Protocol (2026-05-23)

**Problem:** Python scripts run as background processes (`background=true`) without TTY attachment can fail silently with `tcsetattr: Inappropriate ioctl for device`. The process starts but produces no output, no log file, and exits with code 0 or 143 (SIGTERM) after completing only a few files.

**Root cause:** When a background process loses its terminal attachment (e.g., Ollama API calls inside the script trigger terminal-reset behavior), `tcsetattr()` calls fail. Python's stdout/stderr may also get closed, making all output invisible.

**Protocol for long-running Python batch jobs:**

1. **Run as foreground process** with explicit log redirection:
   ```bash
   python3 altus_classifier_v2.py >> ~/altus_output/classifier.log 2>&1
   ```
   The shell handles TTY; Python never tries to configure it.

2. **OR use nohup** for detached runs (still redirect output):
   ```bash
   nohup python3 altus_classifier_v2.py > ~/altus_output/classifier.log 2>&1 &
   tail -f ~/altus_output/classifier.log
   ```

3. **Never use bare `background=true`** for Python scripts that make external API calls (Ollama, HTTP, etc.) — the TTY issue surfaces unpredictably.

4. **If a background process stalls** — kill it, switch to foreground-with-redirect, re-run. Do not keep retrying a broken run.

**Signs a background process has stalled:**
- Log file not created after 60+ seconds
- `ps aux` shows process alive but CPU% = 0
- `process` tool shows zero output after initial startup
- `tcsetattr: Inappropriate ioctl for device` in output

### Skip Detection Bug Pattern (2026-05-23)

**Bug:** Classifier function returned `("skip", None)` for already-done files, but the main loop checked `elif status == "error": errors += 1` — skip was falling into errors, not skipped count.

**Correct pattern:**
```python
def classify_file(ingest_path):
    # ...
    if os.path.exists(out_path):
        return "skip", None   # ← already done
    # ...
    return "done", result

# Main loop — use elif for skip, else for true errors:
for fname in files:
    status, _ = classify_file(os.path.join(INGEST_DIR, fname))
    if status == "done":
        done += 1
    elif status == "skip":
        skipped += 1
    else:
        errors += 1  # catches any unexpected status
```

**Key insight:** A function returning `("skip", None)` and a main loop checking `status == "error"` will silently count skips as errors. Always match the return value to the condition check.

### File Count Reconciliation — `comm` vs Python Set Difference (2026-05-23)

**Bug:** Used `comm -23 <(ls ingest/*.json | sed 's/.json$//') <(ls classify/*.json | sed 's/.classification.json//')` to count remaining files. Both sides returned 180, but Python set operations showed 46 already done, 134 remaining. The `comm` comparison returned 180 remaining because the two lists had different sort orders or suffixes — one had `\n`, one didn't, or the sed stripping was applied differently.

**Correct pattern for "what's left to process":**
```python
import os

ingest = set(os.listdir(INGEST_DIR))
classify = set(os.listdir(CLASSIFY_DIR))

already_done = set()
for f in classify:
    if f.endswith('.classification.json'):
        already_done.add(f.replace('.classification.json', '') + '.json')

remaining = ingest - already_done
print(f"Total: {len(ingest)}, Done: {len(already_done)}, Remaining: {len(remaining)}")
```

**Why `comm` fails here:** `comm -23` compares sorted lines. If the two inputs aren't sorted identically (e.g., one list has trailing newlines stripped differently, or the sort order differs), the output is meaningless. Python set subtraction is the reliable tool for file-set operations.

**Always use Python for file-set difference operations.** `comm` is for line-oriented diffs where inputs are known to be identically sorted. Do not use `comm` to compare file lists from different directories.

### Phase 6 Card Creation Pattern

When creating Phase 6 cleanup sub-cards:

```sql
-- tasks table has NO updated_at or parent_id column
-- Use task_links for parent-child relationships

INSERT INTO tasks (id, title, body, status, created_at, workspace_kind)
VALUES ('<id>', '<title>', '<body>', '<status>', <NOW>, 'scratch');

INSERT INTO task_links (parent_id, child_id) VALUES ('<parent_id>', '<child_id>');
```

### Phase 6 Follow-Up Tasks (from 2026-05-22)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| DA-C1 | `ecosystem-all.js` → `.ARCHIVED` | ✅ DONE | |
| DA-C2 | `pm2-watchdog.sh` → `.LEGACY` | ✅ DONE | Redundant with BossMan health monitor |
| DA-C3 | PM2 "node" → "team-standup-bot" | ✅ DONE | |
| DA-C4 | squarespayouts-status-exporter cron | ✅ ACTIVE | Keep — not orphaned |
| SC-01 | OFFLINE_SERVICES.md created | ✅ DONE | |
| SC-02 | cloudflare-tunnel auth | ⏳ DEFERRED | Needs tunnel operator login |

### Phase 8/10 Readiness (Planning Notes — No Execution)

**Money Pipeline (Phase 8):** Port 8020, research broken since ~2026-04-07. PM2 resurrect ✅. Phase 8 target: restore research automation.

**Binance Bot (Phase 10):** Port 8104, SQLITE_ERROR (current_sl col missing) + RefError (liveBal line 849). PM2 resurrect ✅. Phase 10 target: fix DB schema, pre-trade hook.

---

## Phase 11A Implementation Pattern — INTEL_GATE (2026-05-22)

> Source: Phase 11A session — `references/phase-11a-session.md`

### Multi-location patch pattern

When implementing a feature that spans config + logic + endpoints (3 separate locations):

```
STEP 1 — Patch config section first
STEP 2 — node --check (exit 0 = syntax clean)
STEP 3 — Patch logic section
STEP 4 — node --check again
STEP 5 — Patch endpoint section
STEP 6 — node --check third time
STEP 7 — pm2 delete <name>  ← kills process, closes log file handles
STEP 8 — pm2 start <path> --name <name>
STEP 9 — pm2 save
```

Never `pm2 restart` when debugging — it appends to existing error.log, leaving stale crash errors visible even when the new process is healthy.

### Stale PM2 error.log — debugging pattern

**Symptom:** `pm2 logs <name> --err` shows SyntaxError/ReferenceError, but health check returns `status: ok` with uptime counting from 0.

**Root cause:** `pm2 restart` appends to existing `error.log`. Errors from the PREVIOUS crashed process remain visible even after a successful restart.

**Correct diagnosis:**
```bash
curl -s http://127.0.0.1:<PORT>/api/health | python3 -m json.tool
# Check "uptime" — if < 60s and status=ok → current process is healthy
# Errors in error.log are from the OLD crashed process
```

**Correct restart when debugging:**
```bash
pm2 delete binance-bot       # kills process AND closes log file handles
pm2 start ~/Projects/binance-bot/server.js --name binance-bot
pm2 save
# error.log is now fresh
```

### Phase 11B go-live pattern (Binance Bot)

Each step requires explicit Marcelo approval. INTEL_GATE must be implemented before LIVE mode.

```
Step 1 → Confirm PAPER_MODE=true + journal growing
Step 2 → PAPER_MODE=false for 1-3 days (dry-run live)
Step 3 → Small LIVE test ($10-20 max position)
Step 4 → Full go-live
```

Safety layers (pre-trade hook, exposure cap, daily loss limit, intel gate) remain ACTIVE in LIVE mode.

### execute_code Python syntax gotchas

**f-string comprehension must use parentheses:**
```python
# SyntaxError — missing parens around comprehension target:
task_links = [('t_parent', 't_child'), ('t_parent', t[0]) for t in tasks]

# Correct:
task_links = [('t_parent', 't_child')] + [('t_parent', t[0]) for t in tasks]
```

**Backslash-newline in execute_code SQL strings causes issues:**
```python
# Problematic (backslash is escape in Python strings):
command = "sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \\\n  \"UPDATE tasks SET...\""

# Safer — single-line string:
command = "sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db \"UPDATE tasks SET...\""
```

### INTEL_GATE — Binance Bot intelligence filter

INTEL_GATE is the Binance Bot side of the Crypto Intelligence regime gate. Config in `server.js`:
- `INTEL_GATE_ENABLED` env var (default `true`)
- Reads `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- Caches for 15 minutes (TTL)
- **Blocks when:** regime=BEAR/EXTREME OR band=WATCH/COLD
- **Inactive when:** no intel file (Phase 9B not run) — signals proceed without blocking
- Active in BOTH PAPER and LIVE modes — intelligence filter, not a mode toggle

**Phase 9B must run before Phase 11B LIVE** — placeholder intel.json makes gate inactive.

---

## Phase 6 — Money Pipeline v2 (as-built, 2026-05-08 — LEGACY)

> **Source:** `~/Desktop/hermes-docs/PHASE6_IMPLEMENTATION_PLAN.md`, `MP6-01_ARCHITECTURE.md`, `MP6-02_ASSET_AUDIT.md`, `MP6-03_SCORING_MODEL.md`, `MP6-04_DASHBOARD_IA.md`, `MP6-07_DEEP_DIVE_WORKFLOW.md`, `MP6-08_LIFECYCLE.md`

### Architecture (confirmed)

```
Dashboard (port 8020) ──Discovery/Scoring/Aging/Drill-Down/Sales-Ready views──
     │                  hash routing: #/discovery #/scoring #/aging
     │                  #/opportunity/:id #/sales-ready
     ├── Promote ──────→ Type A Deep-Dive Kanban card (bossman owner)
     ├── Park ─────────→ stage → parked (no card)
     ├── Archive ──────→ stage → archived (no card)
     ├── Build Request ─→ Type B Build card → builder → Marcelo approval gate
     └── Launch Outreach → Type C outreach card → content → Marcelo approval gate

Hermes Kanban (bossman board) ← SOURCE OF TRUTH
Basecamp ← external testing portal ONLY
LBC35 ← execution only via handoff packets (never self-assigns, never touches Basecamp)
```

### Scoring Model (MP6-03)

**5 core dimensions** (each 0-20, composite = sum, max 100):
- `score_market` — TAM, target market size
- `score_competition` — competition level (lower competition = higher score)
- `score_feasibility` — build feasibility with available tools
- `score_revenue` — monthly potential, revenue type
- `score_speed` — speed to market, setup speed

**Tier thresholds:**
- Hot: 80-100 — immediate deep-dive
- Warm: 60-79 — standard workflow
- Lukewarm: 40-59 — discovery only, evaluate later
- Cold: <40 — park immediately, auto-archive

**Aging decay** (age > 14 days): `effective_score = max(0, composite - floor((age_days - 14) / 16) * 5)`

**Additional intake dimensions** (for interview transcript, 0-20 each):
- `score_urgency`, `score_budget_clarity`, `score_problem_clarity`, `score_technical_fit`, `score_strategic_value`

### Dashboard v2 (built MP6-05, confirmed working 2026-05-08)

**Location:** `http://localhost:8020` (PM2: `money-pipeline`)
**SPA:** `~/Projects/money-making-dashboard/public/index.html` (~42KB)
**Server:** `~/Projects/money-making-dashboard/server.js` (~17KB, rebuilt)

**Routes (hash-based):**
| Route | View | Key features |
|-------|------|-------------|
| `#/discovery` | Discovery/Inbox | All ops, sortable, filter by tier, row action buttons |
| `#/scoring` | Scoring | Validation-stage ops, 10-dim score input, auto-composite + tier |
| `#/aging` | Aging | Fresh/aging/stale/critical groups, color-coded, decay effective score |
| `#/opportunity/:id` | Drill-Down | Full detail: scores, financials, activity log, action buttons |
| `#/sales-ready` | Sales-Ready | Ready-to-sell + outreach pipeline, pitch summaries, Launch button |

**KPI row** at top: 6 stage buckets (discovery/validation/building/testing/ready-to-sell/outreach) with counts + dollar totals.

**Kanban proxy endpoint:** `POST /api/kanban/card` in server.js → calls `hermes kanban create` via child_process.

### Button → Kanban Automation (as implemented)

| Button | DB (PATCH) | Kanban card | Approval |
|--------|-----------|-------------|---------|
| **Promote** | `stage → validation` | Type A deep-dive `[MP] <title> — Deep-Dive` | NO |
| **Park** | `stage → parked` | None | NO |
| **Archive** | `stage → archived` | None | NO |
| **Build Request** | `stage → building` (after approval) | Type B build `[MP] <title> — Build` | **YES — Marcelo** |
| **Launch Outreach** | `stage → outreach` | Type C outreach `[MP] <title> — Outreach` | **YES — Marcelo** |

### KPI Bug — RESOLVED (2026-05-08)

**Problem:** `server.js` had 3 orphaned `app.get('/api/kpis')` definitions referencing `global.leads` (non-existent). Endpoint returned HTTP 500.

**Fix:** Removed all orphaned duplicates, kept single DB-based `/api/kpis` endpoint.
**Verification:** `curl http://localhost:8020/api/kpis` returns `{discovery:2181300, validation:501573, totalCount:323, totalPotential:2757373}` ✅

**Also fixed:** DB schema extended with 12 missing columns (`composite_score`, 10 `score_*` dimensions, `tier`, `kanban_card_id`) + `stage_history` table.

### DB Snapshot (2026-05-08)

```
Total: 323 opportunities
By stage: discovery=192, validation=103, research=20, interested=3, plan=2, stale=1, fulfillment=1, archived=1
Pilot opp: ID 339 (Dental Practice Management SaaS, $22K/mo, stage=discovery, unscored)
```

### Phase 6.1 Results (6 tasks, all complete)

```
MP6-01 t_7b20a341 → ~/Desktop/hermes-docs/MP6-01_ARCHITECTURE.md (14KB)
MP6-02 t_394bcecb → ~/Desktop/hermes-docs/MP6-02_ASSET_AUDIT.md (12KB)
MP6-03 t_7086e063 → ~/Desktop/hermes-docs/MP6-03_SCORING_MODEL.md (17KB)
MP6-04 t_7e595355 → ~/Desktop/hermes-docs/MP6-04_DASHBOARD_IA.md (39KB)
MP6-12 t_661bc282 → ~/Desktop/hermes-docs/MP6-12_BASECAMP_AUTOMATION.md + 7 template files (15KB + 18KB)
MP6-13 t_f3009e4b → ~/Desktop/hermes-docs/MP6-13_TRANSCRIPT_INTAKE.md (27KB)
```

### Phase 6.2 Results (4 tasks, all complete)

```
MP6-05 t_9d1ed7f8 → ~/Projects/money-making-dashboard/server.js (rebuilt, KPI bug fixed)
MP6-06 t_796a3cf1 → ~/Projects/money-making-dashboard/public/index.html (5-view SPA, 42KB)
MP6-07 t_e9b073ac → ~/Desktop/hermes-docs/MP6-07_DEEP_DIVE_WORKFLOW.md (22KB)
MP6-08 t_0b5d26e4 → ~/Desktop/hermes-docs/MP6-08_LIFECYCLE.md (27KB) + PHASE6_IMPLEMENTATION_PLAN.md updated
```

### Ngrok → Tailscale Funnel Migration (PLANNED, not executed)

**Current webhook:** `https://detergent-wise-abnormal.ngrok-free.dev/webhook/basecamp`
**Target URL:** `https://bigdawgs-mac-mini.tailed3212.ts.net/webhook/basecamp`

**Cutover checklist before flipping production:**
- [ ] Tailscale Funnel publicly reachable
- [ ] HMAC-SHA256 signature verification confirmed on Funnel endpoint
- [ ] Basecamp webhooks registered for new URL
- [ ] Hub webhook handler confirms events from new URL
- [ ] No regressions in Phase A-D webhook behavior (10 webhooks, 4 polling jobs)

**Do NOT cut over until checklist passes. This is a Phase 6.3+ task.**

### Board Strategy (confirmed)

**ONE global bossman board.** No dedicated MP board.

**Prefix convention:**
```
[MP] <Title> — Deep-Dive    → Type A cards
[MP] <Title> — Build        → Type B cards
[MP] <Title> — LBC35 Handoff → Type E cards
[BC] <Title> — Testing       → Basecamp testing cards
```

Filter with `hermes kanban list | grep "MP:"` or `| grep "\[MP\]"`.

### Pilot (MP6-11 completed 2026-05-08 — FULL RESULTS)

**Opportunity ID 339:** Dental Practice Management SaaS, $22K/mo, score=60, tier=Warm

**End-to-end test results (all passed ✅):**
1. Stage transition: discovery → validation ✅
2. Kanban card `t_ec1ca609` created in bossman board with full 10-dimension scoring table ✅
3. `kanban_card_id` stored in DB ✅
4. KPI row updated (validation +1, discovery -1) ✅
5. No side effects on other opportunities ✅

**Bugs found and fixed during pilot:**
- `hermes kanban create --tags <tag>` — `--tags` flag does NOT exist. Omit it.
- `hermes kanban create --priority P1` — "P1" fails, Hermes expects integer: `--priority 1`
- SPA tier filter: DB stores `'Warm'` but JS was filtering `o.tier === 'warm'` (lowercase) → 0 matches. Fixed all tier comparisons to use capitalized values.
- Kanban proxy was using mock card IDs (`KB-<timestamp>`) instead of real Hermes CLI. Replaced mock with `execSync` call to `hermes kanban create` → now produces real `t_` card IDs.
- Double-nested `if (type === 'TypeA')` in server.js caused syntax error. Fixed.

**Correct `hermes kanban create` call (verified working):**
```bash
hermes kanban create "[MP] Dental SaaS — Deep-Dive" \
  --body "[MP] Type TypeA — Opportunity ID 339

**Scoring**
| Dimension | Score |
|---|---|
| Market | 14/20 |
...

**Composite Score:** 60/100 | **Tier:** Warm" \
  --priority 1 \
  --workspace dir:~/.hermes/kanban/bossman
```

Output parses with: `output.match(/t_[a-z0-9]+/i)?.[0]`

### Basecamp Reuse (Phase A-D infrastructure)

**Existing setup (DON'T REBUILD):**
- Basecamp CLI v0.7.2, auth healthy (account 6162349, RWS project 47020053)
- 10 webhooks registered (all event types)
- 4 polling jobs (15/15/30/60 min intervals)
- HMAC-SHA256 validation, client visibility safeguards
- AUTO-ACK templates 01-04 (Phase C ready but not yet activated)
- Hub webhook handler at `/openclaw-microapps/hub/server.js`

**Phase 6 adaptation:** BossMan handles ALL Basecamp writes. LBC35 never touches Basecamp directly. Testing projects created from template files in `~/Desktop/hermes-docs/BASE_TEMPLATES/TESTING_PROJECTS/`.
- **Phase 6 source file guardrail + Basecamp reuse guide:** `references/phase-6-canonical-sources.md` (critical: 4 files don't exist, use `operating-blueprint.md` + `PHASE6_IMPLEMENTATION_PLAN.md` only)
- **Phase 6.1 results + design docs:** `references/phase-6-1-results.md` (all 6 tasks complete, critical bug in server.js, Phase 6.2 ready)

### Hermes Primary Control Migration — COMPLETED (2026-05-18)

**Status:** ALL PHASES COMPLETE ✅

The Hermes-primary architecture is now fully enforced. All 8 migration phases were executed across 2026-05-07 through 2026-05-18.

**Key execution dates:**
- Phase 0-1: 2026-05-07 (blueprint distributed, ecosystem audited)
- Phase 2-5: 2026-05-08 through 2026-05-16 (policies enforced, standing files updated)
- Phase 6 cleanup + Phase 7 final enforcement: 2026-05-18 (OpenClaw gateway disabled, routing rules codified)

**What was enforced at completion:**
- `ai.openclaw.gateway` LaunchAgent STOPPED — was sending autonomous Telegram messages bypassing BossMan
- Legacy cron `run_morning_research.sh` REMOVED (was unauthorized autonomous research job)
- `com.local.pm2-watchdog`, `com.local.squarepayouts`, `com.local.bakery` LaunchAgents DISABLED
- BossMan PM2 health monitor (`d4f07e0c180f`) is the single service monitor
- Single Status Surface rule codified in SOUL.md + OPERATINGBLUEPRINT.md + AGENTS.md
- LBC35 SOUL v2.0 workspace preserved; only Telegram routing stopped
- 3 unknown LaunchAgents (quickstats, teamstandup, mission-control) under investigation

**Standing files updated (2026-05-18):**
- `OPERATINGBLUEPRINT.md` → "Hermes-Primary Architecture — OpenClaw/LBC35 Delegation Rules (Standing)"
- `SOUL.md` → "Single Status Surface — BossMan as Only Authorized Status Origin"
- `AGENTS.md` → "OpenClaw/LBC35 — No Autonomous Messaging" + "Re-Enabling Legacy Services"

**Source of truth:** `/Users/bigdawg/Desktop/hermes-docs/operating-blueprint.md`
**Board:** `bossman`

**Migration Phases (8 total — ALL COMPLETE):**

| Phase | Card | Key Action | Status |
|-------|------|-----------|--------|
| Phase 0 | t_a6cec443 | Save blueprint to all 4 locations | ✅ DONE |
| Phase 1 | t_6b1a49f4 | Full ecosystem audit (PM2, cron, ports, repos, OpenClaw) | ✅ DONE |
| Phase 2 | t_c64ea8d3 | Define Hermes as primary control plane | ✅ DONE |
| Phase 3 | t_8bde67d0 | Demote LBC35 to delegated executor | ✅ DONE |
| Phase 4 | t_ba9edec2 | Implement Kanban schema + Hermes↔OpenClaw handoff | ✅ DONE |
| Phase 5 | t_43dec590 | Add Telegram mobile controls via BossMan | ✅ DONE |
| Phase 6 | t_71fdab1a | Pilot with money pipeline rebuild | ✅ DONE |
| Phase 7 | t_c4766e61 | Retire old PM dashboard, rebuild Perplexity Spaces | ✅ DONE |

**Migration playbook — Phase 0:**
1. Create project in Kanban with all 8 phase cards
2. Write `operating-blueprint.md` to local source
3. Copy to all 4 locations (local, Obsidian, GitHub, Hermes knowledge)
4. `git add + commit + push` GitHub copy
5. Comment blueprint paths on Phase 0 card

**Migration playbook — Phase 1 audit (full discovery, no changes):**
```
STEP 1 — Port conflict investigation:
  lsof -i :<PORT>                     → PID + process
  ps -p <PID> -o args=               → exact command
  pm2 list                            → match PID to PM2 name
  hermes gateway status               → check if Hermes is LaunchAgent vs PM2

  If Hermes gateway not in pm2 list → it's a LaunchAgent, check: launchctl list | grep hermes

STEP 2 — Determine if actual conflict exists:
  - Both services PM2 and both trying to bind same port → REAL conflict
  - One PM2, one LaunchAgent → different mechanisms, check if LaunchAgent binds a port (most don't)
  - Service not in pm2 list but port in use → find what process owns it via ps -p PID
  - Service healthy, other not started → not a conflict, update SERVICES_MAP only

STEP 3 — Live-money safety check:
  grep -n "require.*pre-trade\|runPreTrade\|preTrade" <bot-source>.js
  - If require() wrapped in try/catch AND comment says "non-blocking" → silent safety gap, STOP THE BOT
  - If the require is NOT wrapped → crash on missing module, fix the module first

STEP 4 — Document findings:
  BLOCKER_RESOLUTIONS.md → save to all 4 locations, git commit+push
  Kanban comment on Phase 1 card with findings summary
  Update SERVICES_MAP with confirmed findings
```

**Phase 2 playbook (Marcelo rule: planning/docs only — no live changes):**
- Draft LBC35 demotion SOUL — propose new text, do NOT apply yet
- Update SERVICES_MAP with all confirmed findings (ports, services, owners)
- Draft Kanban schema and handoff packet formats as reusable templates
- Draft cron migration plan (identify what moves, where, when — no execution)
- Identify any remaining unknowns and classify them
- Present all drafts to Marcelo for approval before Phase 3 execution

**Phase 2 deliverables:**
- `PHASE2_PLANNING.md` → all 4 locations, git commit+push
- Proposed LBC35 SOUL.md text (draft, not applied)
- Final Kanban handoff packet formats
- Updated SERVICES_MAP with all confirmed port assignments
- Cron migration plan (draft, not executed)
- Kanban card marked done with summary comment

**Phase 1 audit — actual findings (2026-05-07):**

| Category | Finding |
|----------|---------|
| PM2 stable (6) | overview, health-dashboard, fresh-dashboard, trading-control, youtube-dashboard, hub |
| PM2 warning (2) | money-pipeline (8 restarts, stream errors), squarepayouts (port 3100 conflict but actually healthy) |
| PM2 critical (1) | binance-bot (32 restarts, SQLite error + missing pre-trade-hook) |
| Cron (2) | money-making-dashboard morning research, trading-monitor 5min poller |
| OpenClaw agents | lbc35 (primary, needs demotion), dwdawg, csdawg, debugdawg, ideasdawg |
| Ports | 3001=bakery(healthy), 3100=SquarePayouts(healthy), 8104=Binance(STOPPED) |
| Hermes gateway | NOT PM2 — runs as macOS LaunchAgent (PID 76170), connects Telegram only, no web port |
| OpenClaw workspace | ~/Desktop/Openclaw Brain/Openclaw Brain/ — has Hermes/Systems/ subdir with SERVICES_MAP and PROFILES |

**Phase 1 blocker resolutions — pattern:**

| Blocker type | Investigation steps | Resolution pattern |
|-------------|---------------------|--------------------|
| Port conflict | lsof -i :PORT → PID → ps -p PID -o args= → pm2 list | If one service healthy + other not started → no conflict, update map |
| Bot safety gap | find /Users/bigdawg/Projects -name "<module>" → grep require in source | Try/catch means silent failure not crash → STOP is safest |
| Service not PM2 | hermes gateway status → launchctl list | macOS LaunchAgent != PM2 — different tool, no conflict |

**Key learning — port 3001 (bakery vs Hermes):**
- Hermes gateway is a macOS LaunchAgent (hermes gateway status shows launchd plist)
- It does NOT bind a web port — it connects Telegram only
- bakery owns 3001 as a Next.js web app — healthy, 6D uptime
- No port conflict exists — update SERVICES_MAP to reflect LaunchAgent nature

**Key learning — port 3100 (SquarePayouts vs OpenHue):**
- lsof showed PID 2077 on 3100 — pm2 list showed squarepayouts at that PID
- OpenHue is NOT installed on this machine
- SquarePayouts is Marcelo's own business tool (BIGDAWG35/Squares repo)
- No ghost conflict — update SERVICES_MAP to remove OpenHue assumption

**Phase 1 ambiguities requiring targeted follow-up (ask LBC35 only specific gaps, not broad query):**
- What is the trading-review project and where is pre-trade-hook?
- What is on ports 8102, 8003, 9119?
- Is kraken-bot retired?

**Migration rule — never do these until Marcelo approves:**
- Shut down PM2, cron, dashboards, or bots
- Rewrite LBC35's role
- Delete any Perplexity Spaces
- Push secrets or credentials anywhere

**Blocker resolution playbook (Phase 1.5 pattern):**

When Phase 1 reveals a blocking issue, follow this investigation sequence before proposing fixes:

```
STEP 1 — Port conflict investigation:
  lsof -i :<PORT>                     → PID + process
  ps -p <PID> -o args=               → exact command
  pm2 list                            → match PID to PM2 name
  hermes gateway status               → check if Hermes is LaunchAgent vs PM2
  
  If Hermes gateway not in pm2 list → it's a LaunchAgent, check: launchctl list | grep hermes

STEP 2 — Determine if actual conflict exists:
  - Both services PM2 and both trying to bind same port → REAL conflict
  - One PM2, one LaunchAgent → different mechanisms, check if LaunchAgent binds a port (most don't)
  - Service not in pm2 list but port in use → find what process owns it via ps -p PID
  - Service healthy, other not started → not a conflict, update SERVICES_MAP only

STEP 3 — Live-money safety check:
  grep -n "require.*pre-trade\|runPreTrade\|preTrade" <bot-source>.js
  - If require() wrapped in try/catch AND comment says "non-blocking" → silent safety gap, STOP THE BOT
  - If the require is NOT wrapped → crash on missing module, fix the module first
  
STEP 4 — Document findings:
  BLOCKER_RESOLUTIONS.md → save to all 4 locations, git commit+push
  Kanban comment on Phase 1 card with findings summary
  Update SERVICES_MAP with confirmed findings
```

## Recovering stuck workers

When a worker profile keeps crashing, hallucinating, or getting blocked by its own mistakes (usually: wrong model, missing skill, broken credential), the kanban dashboard flags the task with a ⚠ badge and opens a **Recovery** section in the drawer. Three primary actions:

1. **Reclaim** (or `hermes kanban reclaim <task_id>`) — abort the running worker immediately and reset the task to `ready`. The existing claim TTL is ~15 min; this is the fast path out.
2. **Reassign** (or `hermes kanban reassign <task_id> <new-profile> --reclaim`) — switch the task to a different profile and let the dispatcher pick it up with a fresh worker.
3. **Change profile model** — the dashboard prints a copy-paste hint for `hermes -p <profile> model` since profile config lives on disk; edit it in a terminal, then Reclaim to retry with the new model.

Hallucination warnings appear on tasks where a worker's `kanban_complete(created_cards=[...])` claim included card ids that don't exist or weren't created by the worker's profile (the gate blocks the completion), or where the free-form summary references `t_<hex>` ids that don't resolve (advisory prose scan, non-blocking). Both produce audit events that persist even after recovery actions — the trail stays for debugging.
