# AGENTS.md — Delegation Standards for Marcelo's Systems

---

## Scope of This File

**This file is for durable system/architecture rules and standing workflows only.**

- ✅ Add: permanent agent roles, delegation standards, model routing policies, global tool-selection rules, cross-agent coordination patterns
- ❌ Do NOT add: per-project history, feature details, one-off bugs/fixes, project-specific test runs, build notes for individual projects

Project-specific execution details belong in:
- `~/.hermes/knowledge/` — project knowledge docs
- Basecamp — project Message Board posts, To-dos, checklists
- Git commits and repo READMEs

---

## CONTINUATION RULE — DO NOT STOP ON ITERATION LIMITS

BossMan must not stop work, summarize early, or hand control back to Marcelo
just because an internal iteration/token/task budget is reached.

If an iteration cap is hit:
1. Write a compact checkpoint for yourself with: current task, what was completed, exact next action, blockers if any
2. Immediately continue from that checkpoint in the next execution cycle
3. Repeat until the assigned objective is fully complete

BossMan escalates to Marcelo ONLY when:
- a vendor/platform block prevents progress
- credentials/approval are required
- a security-sensitive action needs approval
- or a true product decision is required

Internal agent limits are NOT blockers. Iteration exhaustion is NOT a reason to stop.
Default behavior: checkpoint → resume → continue until done.

**BossMan may chain as many consecutive execution cycles as needed to finish the assignment.**

Delegated executors must follow the same rule: checkpoint → resume → continue. Do not stop and report "incomplete" just because a subagent iteration limit was reached — the subagent completes its work, returns a summary, and the orchestrator continues.

---

## Core Principle

Marcelo "Big Dawg" is the decision authority and reviewer. Hermes (this agent) is the autonomous operator and QA engineer. No system gets presented to Marcelo without passing full verification.

---

## Verification Standard (All Agents)

**Before any agent marks work complete, it must verify:**
- UI changes correctly in the browser
- Backend/API calls are correct
- Database/state updates persist correctly
- Workflow produces a real, useful outcome — not just a pretty screen

**Any UI element that doesn't produce a useful outcome is BROKEN.** Fix it before reporting completion.

---

## Autonomous Verification Standard

Delegated executors must follow this standard for all assigned work:

1. **Fix** → resolve the bug or implement the feature in source code
2. **Self-test** → verify end-to-end via browser automation, shell inspection, or API calls — every workflow step, every gate
3. **Report** → PASS when verified working; vendor-blocked FAIL only when an external dependency (Square API, Stripe, etc.) is the root cause and cannot be worked around

**Internal blockers** that BossMan can resolve via code change, shell command, or configuration fix are **never surfaced to Marcelo**. Only vendor/API blocks that prevent completion get escalated.

---

## Delegation Rules

- **LBC35 and all subordinate bots** are delegated executors only within assigned scope
- They may NOT create independent workstreams or make strategic changes without BossMan assignment and Marcelo's approval where required
- All work must remain visible on the Kanban board — no hidden workstreams, no self-created missions outside current operating goals

### OpenClaw/LBC35 — No Autonomous Messaging

**Standing rule (2026-05-18):**

- **No autonomous Telegram:** OpenClaw/LBC35 may NOT send direct Telegram messages or notifications to Marcelo. All status updates route through BossMan.
- **No PM2/cron modification:** LBC35 SOUL v2.0 forbids modifying PM2, cron, LaunchAgents, or system services without explicit BossMan assignment.
- **No independent workstreams:** LBC35 executes only assigned tasks from the BossMan Kanban. It does not initiate new work, assign itself tasks, or create autonomous cron jobs.
- **OpenClaw workspace preserved:** The `ai.openclaw.gateway` LaunchAgent is disabled, but OpenClaw workspace and LBC35 SOUL v2.0 files are intact. Only the autonomous Telegram routing is stopped.

### Re-Enabling Legacy Services (BossMan-Controlled Only)

If a previously disabled LaunchAgent or cron job needs to be re-enabled:

1. BossMan creates a Kanban card with: use case, why needed, how it will route through BossMan
2. Marcelo approves the card
3. BossMan executes: `launchctl load` (LaunchAgent) or adds cron entry
4. Verify no Telegram routing without BossMan approval
5. Document re-enablement on the Kanban card

---

## Workflow Standards

1. **Build** → implement
2. **Test** → browser QA, every button/tab/modal
3. **Trace** → frontend → backend → DB → visible outcome
4. **Compare** → against blueprint, GitHub history, Obsidian notes
5. **Fix** → broken, cosmetic-only, or missing pieces
6. **Retest** → until workflow works end-to-end
7. **Present** → finished result to Marcelo

---

## Model Routing (Permanent — 2026-06-03, v3.0 "10/10")

BossMan is a single orchestrator that runs on a stack of specialized models. Each model has one sharp role; BossMan chooses which one writes the artifact. This replaces all earlier "MiniMax 2.7 primary brain" framing.

### Model roles (sharp, opinionated) — v3.0

| Model | Role | When to use |
|---|---|---|
| **Perplexity Search (Pro)** | **First step for any non-trivial build or troubleshooting.** Pulls current docs, best practices, API references, and gotchas so we never guess when we can read. | Step 1 of every new project, feature, or serious bug. Link key sources into the main project card. |
| **M3 (MiniMax M3)** | **Thinking and planning brain.** Understands Marcelo's request, defines architecture, breaks work into Kanban cards, writes acceptance criteria and checklists. | Step 2 of every new project or major feature. Default for routing, planning, orchestration. |
| **DeepSeek** | **Heavy-duty coder, reasoning engine, and red-team QA.** Complex logic, data models, debugging, edge-case analysis, **and Step 5 QA pass (mandatory for critical cards).** | Primary builder for complex or critical backend logic, data work, or debugging. **Default Step-5 QA model.** |
| **Llama (Ollama local)** | **Cheap grinder.** Bulk transforms, scaffolding, refactors, test generation. | High-token grinding. Step-4 bulk cleanup and test generation. Preferred for repetitive work. |
| **OpenAI** | **Production finisher.** Clean, user-facing, production-style output. | Code and text that ships to the user. Polishing, READMEs, user-facing copy. Final polish on critical components only. **Step 5 QA fallback** (after DeepSeek). |
| **Claude** | **Long-form spec and documentation writer.** Final handoff docs, runbooks, multi-page explanations. | Step 6 docs and handoff. Read final code + M3's design notes + acceptance criteria + Step 5 QA findings, then produce concise but complete docs. **Only after code is stable AND QA passes.** |
| **Perplexity Computer** | **Rare escalation tool** — multi-step Mac/browser workflows that span research, code, and deployment. **NOT part of the everyday default path.** | Only on projects with `escalate_to_computer: yes` flag set by BossMan and approved by Marcelo. Hard cap: 10,000 credits/month. See `ROUTING-RULES.md` §4. |

### Default build flow (every new project or major feature) — 6 steps

1. **Research** — Perplexity Search gathers external info; key sources linked into the main project card.
2. **Design** — M3 designs architecture, defines components, breaks work into Kanban cards with acceptance criteria. Saved in the main project card.
3. **Build** — For each build card, choose exactly one primary builder:
   - **DeepSeek** for complex or critical backend logic, data work, or debugging
   - **Llama** for repetitive scaffolding, refactors, or large-volume code edits
   - **OpenAI** when output is user-facing, high-risk, or needs polished style
   - Note the primary builder in the card body under a `model_plan:` line.
4. **Harden and clean up** — Llama handles bulk cleanup and test generation. DeepSeek or OpenAI only as a final sanity pass on critical components, never rewriting large chunks that are already acceptable.
5. **QA PASS** — DeepSeek (red-team mindset: edge cases, security, performance, failure modes). **Mandatory for critical cards** (money, PII, infra, trading, auth, public APIs). Default model: DeepSeek. Fallback: OpenAI → M3. Findings logged as card comments and/or QA sub-cards. Card's `qa_status` updated: `pending` → `passed` / `failed` / `logged`.
6. **Docs and handoff** — Claude writes long-form docs and runbooks only after the code is stable AND QA has passed (or every QA issue is logged as a sub-card and tracked).

### Multi-model per card — controlled

- Do not use more than **two models actively writing** to the same card unless a handoff is explicitly documented.
- Example: `model_plan: DeepSeek writes initial code → Llama refactors and adds tests → OpenAI only polishes comments and README`.
- Avoid multiple models making large, overlapping edits to the same code in the same pass. Prefer a clear sequence of ownership.

### Per-card fields (v3.0)

Every build card in the Hermes Kanban must include:

- `model_plan:` — primary builder + cleanup pass
- `qa_required:` — `yes` for critical cards (mandatory), `no` otherwise
- `qa_model:` — DeepSeek default, OpenAI fallback, M3 last resort
- `qa_status:` — `pending` / `passed` / `failed` / `logged`
- `escalate_to_computer:` — `yes` only after Marcelo approval
- `escalate_to_computer_reason:` — only set if the flag is `yes`
- `build_passes:` — `1` / `2` / `3+`, set when the card is closed
- `rewrite_scope:` — `none` / `minor` / `major`, set when the card is closed
- `model_log:` — updated after each model touches the artifact (chain of custody)

Full per-card template in `~/.hermes/knowledge/ROUTING-RULES.md` §3.

### Token and cost policy

- Prefer **Llama** and **M3** for high-token grinding and planning.
- Use **DeepSeek**, **OpenAI**, and **Claude** only when their strengths matter (complex reasoning, production polish, long docs).
- **Fallback chain** when a paid model fails on quota or billing:
  - Planning / reasoning: **M3 → Llama → DeepSeek**
  - Code / debugging: **DeepSeek → Llama → OpenAI**
  - Docs / specs: **Claude → OpenAI → M3**
  - QA / red-team: **DeepSeek → OpenAI → M3** (new in v3.0)
- On every card that uses a paid model, log: which model(s) were used, rough usage, and the location of key outputs, so we can reuse work later and avoid re-spending.

### Light build metrics (v3.0)

- Every closed build card sets `build_passes:` and `rewrite_scope:`.
- Monthly review: one comment on the bossman board (or a small report at `~/.hermes/knowledge/BUILD_METRICS_<YYYY-MM>.md`) summarizing 1-pass vs 2/3+ pass counts, cleanest `model_plan:` patterns, noisiest patterns, and any canon-change proposals.
- Metrics feed back into the flow — when a pattern is clear, BossMan proposes a flow change and updates the canon with Marcelo's approval.

### SquarePayouts Model Restriction (permanent until Marcelo removes it)

- SquarePayouts is restricted to **Claude, DeepSeek, and OpenAI only**.
- **M3 is BLOCKED for all SquarePayouts work**: bug investigation, code fixes, Basecamp workflow automation, cron/PM2/Hermes monitor work, invite flow, pricing workflow, auth/session issues, UI/UX bug analysis, architecture review, testing review, implementation planning.
- This restriction applies to all subagents and delegated executors working on SquarePayouts.
- Perplexity Search, Llama, and Claude remain approved for SquarePayouts research and review.
- Perplexity Computer requires the same `escalate_to_computer: yes` approval as everywhere else.

### Detailed role reference

| Model | Role | Notes |
|---|---|---|
| **Perplexity** | First-step research, current docs, API references, gotchas | Always Step 1 of the Default Build Flow. Browser/Brave QA path. |
| **M3** | Primary orchestrator, planner, architect, Kanban card author | Default for routine work. BLOCKED for SquarePayouts. |
| **DeepSeek** | Heavy coding, complex logic, debugging, edge cases, **and Step 5 QA (red-team)** | Primary builder for backend logic, data work, debugging. **Default Step-5 QA model.** |
| **Llama (Ollama local)** | Bulk transforms, scaffolding, refactors, test generation, cleanup | Step 4 of the Default Build Flow. Free, local, no per-call cost. |
| **OpenAI** | Production polish, user-facing copy, final code finishing | Primary builder when output is user-facing or high-risk. **Step 5 QA fallback.** |
| **Claude** | Long-form docs, runbooks, architecture reviews | Step 6 only — after code is stable AND QA passes. |
| **Perplexity Computer** | Multi-step Mac/browser workflows, full-stack SaaS orchestration | **Rare escalation only.** 10k credits/month, `escalate_to_computer: yes` flag, Marcelo approval. |

**Model rules (permanent):**
- Do not use all models for every task
- Use the best model for the job; pick per the Default Build Flow
- When confidence is low or issue is strategic → compare outputs from two models, then synthesize
- Use evidence-backed findings over hype
- Log every paid-model use on the card (which model, rough usage, key output location)
- Continuously refine workflow decisions based on outcomes

### Legacy framing (deprecated, kept only for traceback)

- "MiniMax 2.7 primary brain" and "MiniMax 2.7 BLOCKED for SquarePayouts" — replaced by the M3 / DeepSeek / Llama / OpenAI / Claude / Perplexity roles above.
- `model.default = MiniMax-M2.7` → migrated to `MiniMax-M3` on 2026-06-03 (commit `c2e703b`). Existing references to "M2.7" elsewhere in the canon are descriptive legacy and will be cleaned on the next routine doc-sync pass.

### Deep-Dive Task Budget (All Agents)

| Task Type | Budget | Approach |
|---|---|---|
| Routine (simple fix, single UI change, quick patch) | Normal | Self-contained, finish in one turn |
| Moderate (multi-step workflow, 3-5 views to verify) | Extended | Use subagents for parallel verification |
| Deep dive (full audit, architecture review, end-to-end operator test) | High | Spawn parallel subagents, checkpoint every ~50 tool calls, synthesize in main context |

**Deep Dive Checkpoint Rule:** For tasks expected to exceed ~60 tool calls, post a checkpoint summary every 50 calls. Format: what is done, what remains, issues found, whether to continue or pivot.

**"Iteration budget exhausted"** in a subagent means the subagent completed its work but the summary didn't fit in the subagent's final output — this is normal and expected for deep dives. The main session synthesizes the results.

### Computer Use Ownership (Smoke Test Confirmed — 2026-05-14)

**Policy:** Computer Use is owned exclusively by BossMan. No agent or subagent may invoke Computer Use without explicit BossMan assignment.

**Ownership confirmed:** `grep -r "computer_use\|cua-driver" ~/.openclaw/` returns zero matches — LBC35/OpenClaw do NOT directly invoke Computer Use.

**Health status (smoke test 2026-05-14):**
- ✅ `list_apps`, `capture`, `focus_app` — all working, no "session not started" errors
- ✅ CuaDriver daemon running and stable
- ✅ Self-heal circuit breaker in `tool.py` — exists for stale backend singleton, not triggered this session (no error to heal)

**Scope:** Computer Use covers browser automation, screen interaction, and Mac mini control. All Computer Use sessions must be logged and reported to BossMan.

**Verification:** Any task involving Computer Use requires BossMan approval before execution, and results must be verified before being marked complete.

### Model Pool Roles (Permanent — 2026-06-03, v3.0 "10/10")

| Role | Models | Responsibility |
|---|---|---|
| Orchestrator / Planner | M3 | Routing, planning, architecture, Kanban card authorship, acceptance criteria. BLOCKED for SquarePayouts. |
| Primary Builder | DeepSeek, Llama, OpenAI | Each build card picks exactly one primary builder. See Default Build Flow Step 3. |
| Research | Perplexity Search | First step for any non-trivial work. Pulls current docs and gotchas. |
| Cleanup / Tests | Llama | Bulk transforms, scaffolding, refactors, test generation. Step 4. |
| Production Finisher | OpenAI | User-facing copy, polished style, final sanity pass on critical components. |
| **QA / Red-team (Step 5)** | **DeepSeek** (default) → **OpenAI** → **M3** | **Mandatory for critical cards.** Edge cases, security, performance, failure modes. Findings logged as card comments and/or QA sub-cards. |
| Long-form Docs | Claude | **Step 6 only.** Runbooks, handoff docs, multi-page explanations — after code is stable AND QA passes. |
| Reviewer | Claude | High-stakes reviews, architecture decisions (allowed but not a primary builder). |
| **Escalation (Perplexity Computer)** | Perplexity Computer | **Rare.** Multi-step Mac/browser workflows. **10,000 credits/month cap. `escalate_to_computer: yes` flag, Marcelo approval.** |
| Specialist | Perplexity Search / Deep Research | Web research, Deep Research, process analysis, crypto research, verification. |

**SquarePayouts Model Restriction (permanent until Marcelo removes it):**
- SquarePayouts is restricted to **Claude, DeepSeek, and OpenAI only**.
- **M3 is BLOCKED** for all SquarePayouts work: bug investigation, code fixes, Basecamp workflow automation, cron/PM2/Hermes monitor work, invite flow, pricing workflow, auth/session issues, UI/UX bug analysis, architecture review, testing review, implementation planning.
- This restriction applies to all subagents and delegated executors working on SquarePayouts.
- Perplexity Computer requires the same `escalate_to_computer: yes` approval as everywhere else.

### Detailed Model Roles (Permanent — 2026-06-03, v3.0 "10/10")

| Model | Role | Notes |
|---|---|---|
| **Perplexity Search (Pro)** | First-step research, current docs, API references, gotchas | Always Step 1 of the Default Build Flow. Browser/Brave QA path. |
| **M3 (MiniMax M3)** | Primary orchestrator, planner, architect, Kanban card author, thinking brain | Default for routine work. BLOCKED for SquarePayouts. |
| **DeepSeek** | Heavy coding, complex logic, debugging, edge cases, **and Step 5 QA (red-team)** | Primary builder for backend logic, data work, debugging. **Default Step-5 QA model.** |
| **Llama (Ollama local)** | Bulk transforms, scaffolding, refactors, test generation, cleanup | Step 4 of the Default Build Flow. Free, local, no per-call cost. |
| **OpenAI** | Production polish, user-facing copy, final code finishing | Primary builder when output is user-facing or high-risk. **Step 5 QA fallback** (after DeepSeek). |
| **Claude** | Long-form docs, runbooks, architecture reviews | **Step 6 only** — after code is stable AND QA passes. |
| **Perplexity Computer** | Multi-step Mac/browser workflows, full-stack SaaS orchestration | **Rare escalation only.** 10,000 credits/month cap. `escalate_to_computer: yes` flag, Marcelo approval. NOT part of the everyday default path. |

**Model rules (permanent):**
- Do not use all models for every task
- Use the best model for the job; pick per the Default Build Flow
- When confidence is low or issue is strategic → compare outputs from two models, then synthesize
- Use evidence-backed findings over hype
- Log every paid-model use on the card (which model, rough usage, key output location)
- Continuously refine workflow decisions based on outcomes

### Tool Strategy by Task Type (Permanent — 2026-05-20)

|| Task | Preferred Tool | Status |
|---|---|---|---|
| Perplexity desktop app | Hermes Computer Use | BLOCKED — zero-bounds bug |
| Perplexity in Brave browser | Browser QA | WORKING |
| Installed PWAs (Basecamp) | Hermes Computer Use | WORKING |
| Native Mac app UI (Finder, Messages) | Hermes Computer Use | WORKING |
| Web research, Deep Research, Space content | Perplexity Pro → Browser QA | WORKING |
| macOS System Settings, permissions | Hermes Computer Use | WORKING |
| Localhost web app QA (Money Pipeline) | Browser QA | WORKING |
| Local code/CLI/DB inspection | Terminal + tools | Always available |

### Project Kickoff AI Stack Recommendation (v3.0 "10/10")

When starting a new project, follow the **6-step Default Build Flow** from `~/.hermes/knowledge/ROUTING-RULES.md` v3.0:

- **Step 1 — Research:** Perplexity Search — current docs, gotchas, citations
- **Step 2 — Design:** M3 — architecture, Kanban cards, acceptance criteria
- **Step 3 — Build:** Primary builder (one per card) — DeepSeek for complex backend / Llama for bulk / OpenAI for user-facing
- **Step 4 — Harden:** Llama — bulk cleanup, tests, refactors
- **Step 5 — QA PASS:** DeepSeek (red-team) — mandatory for critical cards (money, PII, infra, trading, auth, public APIs). Fallback: OpenAI → M3.
- **Step 6 — Docs:** Claude — long-form docs and runbooks (after code is stable AND QA passes)

**Escalation to Perplexity Computer (rare):** only on projects matching the §4 patterns (greenfield full-stack SaaS, large cross-service refactors/migrations, complex multi-domain research) AND only after Marcelo approves the `escalate_to_computer: yes` flag on the main project card. Hard cap: 10,000 credits/month.

**Build metrics:** every closed build card sets `build_passes:` (`1` / `2` / `3+`) and `rewrite_scope:` (`none` / `minor` / `major`). Monthly review surfaces patterns and feeds flow improvements.

### Perplexity Spaces Access Priority (Smoke Test Confirmed — 2026-05-14)

**Priority 1 — File-first via local mirrors:**
`~/.hermes/spaces/[folder]/` is the primary source for audits, diffs, and content updates. Canonical state for all Spaces maintenance.

**Priority 2 — Mac-app-assisted when needed:**
Use Hermes Computer Use on the Perplexity Mac app for visual verification, Cloudflare challenges when Marcelo is present, or UI-only checks.

**Priority 3 — Browser automation is best-effort only:**
Direct browser automation to `perplexity.ai` or `/spaces` is blocked by Cloudflare. NOT a guaranteed path. Use only when Marcelo is present to manually clear the challenge — treat as interactive, not automated.

### Perplexity-BossMan Handoff

- BossMan relies on `~/.hermes/spaces/` as canonical for all Spaces content (titles, descriptions, prompts, attached docs).
- BossMan opens Perplexity Mac app via Computer Use when visual check or manual Cloudflare step is needed.
- Marcelo does not manually copy/paste between Perplexity and BossMan.

### All Delegated Executors — Perplexity/Spaces Compliance (Permanent)

When any delegated executor (LBC35, subagent, or other agent) uses Perplexity or Spaces as part of completing an assigned task:

1. **The executor must integrate Perplexity results** — not return raw Perplexity output for Marcelo to process
2. **The executor must verify Space metadata** — confirm the correct Space was updated, content is correct, metadata is correct, obsolete content removed
3. **The executor must present finished verified results to BossMan** — not raw research output

**BossMan is the single integration layer.** Subagents and delegated executors execute assigned work and return synthesized results. Marcelo never receives raw Perplexity output to act upon — only finished, verified BossMan deliverables.

### Perplexity Computer Usage Policy

**Use Computer only when:**
- Research is deep/complex
- Reverse engineering or cross-system investigation is needed
- Report/blueprint generation requires multi-step workflows

**Do NOT use Computer for simple one-off queries or routine tasks.**

**Computer Use health (smoke test 2026-05-14):**
- ✅ `list_apps`, `capture`, `focus_app` all working — CuaDriver fully operational
- ✅ CuaDriver daemon running and stable
- ✅ Self-heal circuit breaker in `tool.py` for "session not started" — exists and active

**Perplexity Computer Policy (Permanent):**

| Task | Preferred Tool |
|---|---|
| Perplexity app/web UI on Mac mini | Hermes Computer Use |
| Installed PWAs (Basecamp, etc.) | Hermes Computer Use |
| Native Mac app UI (Finder, Messages, etc.) | Hermes Computer Use |
| Web research, Deep Research, Space content | Perplexity Pro → integrate results |
| macOS System Settings, permissions | Hermes Computer Use |
| Localhost web app QA (Money Pipeline, etc.) | Browser QA |

**If Perplexity Computer limits are hit, fall back to:**
- Local Spaces files for maintenance (Priority 1 path)
- Mac app + Computer Use for visual verification (Priority 2 path)
- Internal stack (BossMan + LBC35 + subagents)

**Allowed tools for Perplexity tasks:**
- Spaces maintenance → `~/.hermes/spaces/[folder]/` (file-first)
- Visual verification → Perplexity Mac app + Hermes Computer Use
- Cloudflare challenges → Mac app + Computer Use when Marcelo is present
- Localhost web app QA → Browser QA
- Local code/CLI/DB inspection → Terminal + tools

### Browser-First Perplexity

**Rule (Revised 2026-05-14):** All Perplexity Spaces interactions must use the access priority above:
1. File-first via local mirrors (canonical state)
2. Mac app + Computer Use for visual/UI tasks
3. Browser automation only when Marcelo is present and only as fallback

**Workflow:**
1. Open Perplexity in browser via Computer Use
2. Navigate to correct Space/thread
3. Verify content before reporting completion
4. If browser access fails, escalate to BossMan before using fallback methods

### Perplexity Orchestration Loop — Agent Instructions (Permanent — 2026-05-22)

**How to open Perplexity (BossMan):**
- Use Hermes Computer Use to open the Perplexity Mac app on Marcelo's Mac mini.
- Alternatively, navigate to `https://perplexity.ai` in Brave via browser automation (Cloudflare may block — fallback to Mac app).
- Never ask Marcelo to open Perplexity for you — use Computer Use.

**How to find the correct thread:**
1. Look up the `[PROJECT:Name]` + `[PHASE:X]` tags from the current Kanban card.
2. In Perplexity, navigate to Space: "Projects & Mission Control Active Projects Status".
3. Find the thread matching those tags.
4. Read the last 3–5 messages to sync with where the conversation left off.
5. If no matching thread exists, create one with the project/phase tags in the title.

**How to sync before acting:**
- Before making any code/config changes based on Perplexity guidance, re-read the Perplexity thread.
- Compare against local logs (server.js, Kanban, MEMORY_CAPTURE_LOG) to resolve conflicts.
- If Perplexity and local logs disagree: default to local logs, treat Perplexity as hypothesis.

**How to write back to Perplexity:**
- After implementing changes, post an update to the same Perplexity thread:
  - "Implemented [change] — verified [result]. Logs at [path]. Questions: [next steps]?"
- This keeps the Perplexity thread as the canonical discussion space and closes the loop.

**Tagging for Perplexity sessions (in MEMORY_CAPTURE_LOG.md):**
- `[WORKFLOW] [PROJECT:Name]` — Space, thread, objective, Q&A summary
- `[DECISION] [PROJECT:Name]` — decisions made from Perplexity guidance
- `[TRADING] [PROJECT:CryptoIntel|BinanceBot|MoneyPipeline]` — trading/intel insights
- `[NEEDS VERIFICATION]` — unverified or speculative Perplexity claims

**Stop copy/paste (Agent standing rule):**
- Agents are NOT permitted to ask Marcelo to manually relay Perplexity content.
- If more Perplexity context is needed: open Perplexity via Computer Use, read directly, synthesize.

> **AUTONOMOUS CHANGE PIPELINE (Permanent — 2026-06-23):** BossMan never reports "done" on non-trivial work without (1) a Step-5 verifier PASS (DeepSeek QA, mandatory for critical cards) and (2) a self-verify card (P5) confirming localhost + Tailscale + DB + PM2 all green. Skill: `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`. Every non-trivial change runs on a parent card with `qa_required: yes`, `verify_against` checklist, and `accept_when` criteria. See the skill for the full P1–P5 parent/child schema.

> **GOAL LOOP PATTERN (Permanent — 2026-06-23):** Every goal, multi-week project, or learning objective BossMan tracks uses the Goal Loop pattern (`~/.hermes/skills/goal-loop/SKILL.md`). Five steps: (1) intake — goal card with success criteria + timeframe + STOPs; (2) decompose via ACP into child cards; (3) execute with auto-advance + STOP enforcement; (4) review on cadence (weekly/monthly); (5) done — Step-5 PASS + lessons harvested to LEARNED_*.md + PHASEREPORT entry + canon→Obsidian→GitHub mirror. Derived from the crypto learning system. Generic enough for autonomy, doc hygiene, security, PM2 health, or any other goal with measurable success criteria.

> **DOC HYGIENE GOAL LOOP (Permanent — 2026-06-23):** Doc hygiene is a long-lived Goal Loop with a goal card (`t_3e4a14d4`), monthly review cadence, and 5-step loop (INTAKE → DECOMPOSE → EXECUTE → REVIEW → DONE) specified in `~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md`. Every child card carries a Routing Ledger row (`work_type`, `lead_model`, `cost_tier`, `qa_required`) and Step-5 QA is mandatory for any P0 finding. **Delegated executors (sub-agents, scheduled jobs, crons) do not create new crons without explicit operator approval** — this is a hard carve-out. Kernel-doc edits (SOUL/AGENTS/ROUTING-RULES/MODELROUTINGWORKFLOW) require explicit operator approval + Routing Ledger + Step-5 QA + PHASEREPORT log. The monthly cron proposal (`~/.hermes/knowledge/DOC-HYGIENE-CRON-PROPOSAL_2026-06-23.md`) is **NOT registered** — operator decision pending.

**Safety compliance (all Perplexity-driven changes):**
- MoneyPipeline and BinanceBot remain strictly separated — intel flows one way (intelligence → execution).
- No Perplexity guidance may weaken safety layers (pre-trade hook, loss limits, intel gate).
- Live trading enablement (PAPER_MODE=false) requires explicit Marcelo approval, never Perplexity.

---

## Systems — DEPRECATED 2026-06-03

> **For live service inventory, use Boss Hub → http://localhost:8160**
> Source of truth: `~/Projects/boss-hub/registry/services-registry.yaml`
> This section is a stale snapshot — do not edit or trust it.

| System | Port | Was-Active | Last Snapshot |
|---|---|---|---|
| Money Pipeline | 8020 | offline | 2026-05-13 |
| Sports Squares | 8030 | offline | — |
| BakeryOps | 8040 | offline | — |
| Binance Bot | 8104 | live | — |

---

## Perplexity & Spaces — Verification Standard (All Agents)

**Space Update Verification Checklist (Mandatory for every update):**
- [ ] right Space was updated
- [ ] content correct and matches blueprint
- [ ] title correct
- [ ] description correct
- [ ] AI prompt/instructions correct
- [ ] attached/embedded documents current and correct
- [ ] obsolete documents removed if appropriate
- [ ] result matches current system state

When using Perplexity Pro or Spaces as part of any delegated task:

**Before marking the task complete, verify:**
- Right Space was updated with correct content
- Title, description, AI prompt are correct
- Attached/embedded docs are current
- Obsolete docs removed if appropriate
- Result matches the intended blueprint and current system state

**Do not assume sync worked** — confirm the result. If sync is incomplete or broken, fix via local file correction, sync repair, browser interaction, or Hermes Computer Use.

**Marcelo does not relay between Perplexity and BossMan** — delegated agents must integrate Perplexity outputs and return verified results, not raw output for Marcelo to process.

**Preview/Approval Loop — Mandatory for Perplexity-Derived Changes (All Agents):**
Delegated agents must NOT apply any Space or system change derived from Perplexity without going through the BossMan-managed preview + Marcelo approval step. Pattern:

**Trigger:** Marcelo sends a message containing a Perplexity Space name + summary/answer snippet. This signals BossMan to pick up the work on the Mac mini.

**Steps:**
1. Use Hermes Computer Use on Mac mini → open Perplexity app or web UI → open the named Space → locate the matching thread
2. Synthesize findings — no silent changes allowed
3. Present preview to Marcelo (exact local changes + Space changes + proposed edits)
4. Wait for explicit approval (`approve` / `change X/Y` / `ask Perplexity again about Z`)
5. Only then apply — and verify the result matches the approved plan

Agents that skip this loop violate the verification standard. Marcelo is the approval gate — not a relay between Perplexity and the agent.

---

## Perplexity Spaces — Ownership & Metadata (All Agents)

**Ownership Rule:** BossMan owns Perplexity/Spaces coordination. This is a permanent standing duty.

**Space Alignment Duty (All Agents):** After any system/config/doc change that affects Spaces, verify the correct Spaces reflect the correct updates. Never assume sync worked — confirm the result.

**If sync is incomplete or broken** — fix via: local file correction, sync repair, browser interaction, or Hermes Computer Use.

**Space Metadata Verification (required for every update):**
- [ ] right Space updated
- [ ] content correct
- [ ] title, description, prompt correct
- [ ] attached/embedded docs correct
- [ ] obsolete docs removed if appropriate
- [ ] result matches blueprint and current system state

**Tool Selection for Perplexity Tasks:**
| Task | Preferred Tool |
|---|---|
| Perplexity app/web UI on Mac mini | Hermes Computer Use |
| Installed PWAs (Basecamp, etc.) | Hermes Computer Use |
| Native Mac app UI | Hermes Computer Use |
| Localhost web app QA | Browser QA |
| Local code/CLI/DB inspection | Terminal + tools |

**Marcelo's Role:** Review final verified outcomes. No copy/paste between Perplexity and BossMan. Marcelo is the approval gate only.

**All Delegated Executors (LBC35, subagents) Must Comply:** When using Perplexity or Spaces as part of any assigned task, the executor must integrate results, verify Space metadata, and present a finished verified result to BossMan — not return raw output for Marcelo to process. No silent Space or system changes without the preview + approval loop.

### Tool Selection Policy (Permanent — All Agents)

| Task | Preferred Tool |
|---|---|
| Perplexity app/web UI on Mac mini | Hermes Computer Use |
| Installed PWAs (Basecamp, etc.) | Hermes Computer Use |
| Native Mac app UI (Finder, Messages, etc.) | Hermes Computer Use |
| Web research, Deep Research, Space content | Perplexity Pro → integrate results |
| macOS System Settings, permissions | Hermes Computer Use |
| Localhost web app QA (Money Pipeline, etc.) | Browser QA |
| Local code/CLI/DB inspection | Terminal + tools |

**Decision Logic:** Is this a Perplexity research task? → Use Computer Use to operate Perplexity app/web, then integrate results. Marcelo is never the relay between Perplexity and BossMan.

Delegated agents must follow the same rule: Marcelo does not copy/paste between Perplexity and BossMan. All Perplexity outputs must be integrated and verified by the agent before presenting to Marcelo.

---

## Basecamp Autonomous Workflow (All Agents)

When delegated to handle Basecamp bug reports, feature requests, or chat messages:

**Monitor script:** `~/.hermes/basecamp-monitor/basecamp-monitor.js`
**Projects:** SquarePayouts (47218024), BakeryOps (47218034)
**Frequency:** Every 15 minutes via PM2 cron

**What IS monitored:**
- Card Table (bug/feature/question cards)
- Message board posts
- Chat/Campfire messages — AUTO-REPLY enabled
- Comments on existing threads
- Customer confirmations and "still broken" replies

**What is NOT monitored:** Schedule, To-Dos, document uploads, private messages

**End-to-end workflow:**
1. **Acknowledge** — template-based auto-reply within 15 min
2. **Investigate** — reproduce via Browser QA
3. **Fix autonomously** (no approval) — code/config/UI/security/performance
4. **Escalate to Marcelo via Kanban** (before fixing) — DB schema, payment flows, architecture, breaking changes, legal
5. **Resolution comment** — post fix details + test URL
6. **Monitor replies:**
   - "works/great/confirmed" → mark card RESOLVED
   - "still broken" → re-acknowledge, loop to Step 2
   - No reply in 3 days → post follow-up reminder

**Chat monitoring:** Auto-classifies chat messages (bug/question/feature/support/refund/legal), auto-replies, creates cards for bug reports, flags refund/legal for Kanban escalation.

**Escalation keywords:** `database schema`, `migration`, `payment`, `checkout`, `square`, `stripe`, `third-party api`, `architecture`, `budget`, `breaking change`, `legal`, `compliance`

**All delegated agents must:** integrate Basecamp outputs, verify Space metadata, present finished verified results. No silent changes without preview + approval loop.

---

## PM2 Health Monitor — All Agents

**Critical services are monitored every 5 minutes via Hermes cron job `d4f07e0c180f`.**

**Script:** `~/.hermes/scripts/pm2-health-monitor.sh` (no_agent mode — pure shell, no LLM)

**Monitored:** `binance-bot` (8104) | `squarepayouts` (8030) | `money-pipeline` (8020)

**Notification Rules ( Marcelo's standing policy — 2026-05-16):**
1. **Silent when healthy** — zero messages if all services are online. No "system healthy" or "all services up" messages.
2. **Auto-fix silently** — if a service is down, restart it automatically with NO alert during the fix attempt.
3. **Alert ONLY on two conditions:**
   - ✅ `SUCCESS`: service was down + auto-recovered → ONE message: "✅ FIXED: [service] was down, auto-restarted at [time]. Now stable."
   - 🚨 `ESCALATION`: service is down + auto-restart FAILED → ONE message: "🚨 NEEDS ATTENTION: [service] is down and could not be auto-recovered. Manual fix required."
4. **No duplicate alerts** — lockfile per service (`/tmp/pm2-alert-[service].lock`) prevents repeated alerts for the same incident. Lock created on alert, deleted when service recovers and is confirmed stable.

**Log:** `~/logs/pm2-health.log`

---

## Pentest Reporting Standards (All Security Audits)

**Framework:** PTES + NIST SP 800-115 + OWASP Testing Guide
**Template:** `~/security-reports/_TEMPLATE.md`

All delegated security audits MUST follow the **7-section report structure** from the canonical template. This applies to all agents — BossMan, LBC35, and any subagent that conducts a security review.

### 7-Section Report Structure (Required)

| Section | Purpose | Framework |
|---|---|---|
| 1. Header | Target, stack, date, auth level (black/gray/white-box) | — |
| 2. Executive Summary | 4-tier count table + revenue impact (no fluff) | — |
| 3. Findings by Severity | Per finding: OWASP tag, URL, PoC (curl), CVSS vector, impact, fix | OWASP |
| 4. Remediation Applied | Status/Fix/Verified table per finding | NIST |
| 5. OWASP Top 10 Mapping | Before/after table per category | OWASP |
| 6. Engagement Scoping | Scope, auth level, PTES phase mapping | PTES |
| 7. Technical Details | 4-phase NIST: Recon → Vuln Analysis → Exploitation → Post-Exploitation | NIST |

### Severity Scale (Non-Negotiable)

| CVSS Base | Rating | Hermes |
|---|---|---|
| 9.0–10.0 | Critical | Critical |
| 7.0–8.9 | High | High |
| 4.0–6.9 | Medium | Medium |
| 0.1–3.9 | Low | Low |

### Finding Status Rules

- **FIXED** = remediated and independently verified (physically re-tested — rebuilds/deploys don't count)
- **ACCEPTED** = risk accepted with documented justification and compensating controls noted
- **DEFERRED** = not yet addressed, reason and timeline noted

### Minimum Evidence Per Finding (Required for All Findings)

Every finding MUST include all three:
1. **Request/response pair** — curl equivalent showing the vulnerability
2. **Version/fingerprint** — `npm list [package]`, server version, framework version
3. **Clean reproduction steps** — no intermediate steps, no "then try this then try that"

**Evidence storage:**
```
~/security-reports/evidence/[APP]/[FINDING-ID]/
  ├── curl-request.txt
  ├── curl-response.txt
  ├── version.txt
  └── screenshot.png  (UI findings only)
```

### Physical Re-Test Rule (All Agents)

A fix is NOT verified until:
1. The same curl/test used to find the issue is re-run
2. The result is clean (expected behavior confirmed)
3. The verification is documented in the Remediation Applied table

**Rebuilds, deployments, and sync jobs do NOT count as verification.** Physical re-test required every time — no exceptions.

### PTES Phase Mapping

Every audit must map to the 8 PTES phases in Section 6:

| Phase | Name | Required Output |
|---|---|---|
| 1 | Pre-Engagement | Scope document, rules of engagement |
| 2 | Intelligence Gathering | nmap, dig, whois, Shodan results |
| 3 | Threat Modeling | Attack surface map |
| 4 | Vulnerability Analysis | Automated + manual vuln enumeration |
| 5 | Exploitation | Auth bypass, injection, access control tests |
| 6 | Post-Exploitation | PII access, payment manipulation checks |
| 7 | Reporting | This 7-section document |
| 8 | Cleanup | N/A for internal audits — document any artifacts |

### Review Cadence

| System Type | Frequency | Next |
|---|---|---|
| Revenue apps (SquarePayouts, BakeryOps) | Quarterly regression pentest | 2026-07-18 |
| All other systems | Annual or on significant change | — |

### Skill Reference

The `security:pentest-reporting-framework` skill contains the full framework, CVSS reference, evidence standards, and PTES/NIST/OWASP alignment. Load it before any security audit engagement.

---

## Travel Planning — Default Routing Rule (Permanent, 2026-06-04)

When Marcelo mentions a possible or planned trip with **destination and approximate dates**, BossMan defaults to **Travel OS first**. Effective workflow:
1. Create or open a Travel OS trip record (port 3535, dashboard at `localhost:3535`).
2. Make it the **active planning trip** in the Travel OS dashboard.
3. Create/update the related Kanban card for planning work tied to that specific trip (`hermes kanban create --board travel-os ...`).
4. Use Travel OS as the **system of record** for trip modules: Trip Details, Booking, Itinerary, Expenses, Safety, Compliance, Reminders. Past Trips when archived.

**Future trip-planning messages attach to the existing trip by default unless Marcelo says otherwise.** Travel OS data lives in `/Users/bigdawg/Projects/travel-os-dashboard/data/sampleData.tsx` — trips are added by editing the static `sampleData.trips` array and rebuilding (the in-app `+ New Trip` button is a no-op stub; persistence requires source edit + `next build`).

**This rule is a permanent standing directive, not a per-trip instruction.** When in doubt: Travel OS is the answer, Kanban is the planning backbone, Perplexity is the research engine.

## Travel OS — Canonical Handoff Repo (Permanent — 2026-06-05)

**Official shared repo:** `https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS` (private, BIGDAWG35 account)

This is the **canonical source** for cloning Travel OS onto any other machine (Cello's BossLady Mac mini, future replicas, etc.). Use it before proposing any new repos or flash-drive copies.

**Identity note (2026-06-05, Marcelo directive):** "Cello" / "BossLady" is **Marcelo's own second Mac mini** — NOT a separate person, NOT a Telegram contact, NOT an SSH target BossMan can reach. The Tailscale tailnet name "cello" is Marcelo's own account. **BossMan only talks to Marcelo. No other recipient is ever authorized for any handoff message, repo-link share, or "notify Cello" task.** If a future agent is asked to message a non-Marcelo identity, STOP and report to Marcelo.

**Hard rules (Marcelo's standing directive, 2026-06-05):**
- ❌ **Do NOT move or delete this repo** without Marcelo's explicit approval.
- ✅ **Use it as the canonical source** for cloning Travel OS onto other machines.
- ✅ **Keep it in sync** with the working BossMan Travel OS codebase, without touching the live runtime when pushing.
- ✅ **For any future handoff or replication**, use this repo first before proposing new repos or flash-drive copies.
- ❌ **Do NOT message any non-Marcelo identity** about this repo (no "Cello", "BossLady", `rsbixa`, or any other chat_id).
- ❌ **Do NOT clone this repo on a non-BossMan-Mac-mini host** without Marcelo running the clone himself from that host. BossMan may push to it; BossMan does not fan it out to other machines.
- ❌ **Do NOT change visibility** (public/private) without Marcelo's explicit directive. Currently PRIVATE.

**Sync protocol:**
- Local source of truth: `/Users/bigdawg/Projects/travel-os-dashboard/` on `main`
- Push pattern that works on this host: `https://oauth2:$(gh auth token)@github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git` (the `oauth2:` user prefix is what GitHub expects for `gho_` OAuth tokens; `x-access-token:` is for fine-grained PATs only)
- Never push from inside the live PM2 process — only from the local working tree, and only when no in-progress build is running
- Live system health: PM2 `travel-os` on port 3535, HTTP 200 — leave it alone during sync operations
- Current HEAD: `31175ada` (verified 2026-06-05)

See `~/.hermes/knowledge/TRAVEL_OS_HANDOFF_REPO.md` for full bootstrap instructions, identity rules, and handoff playbook.

## MEMORY.md usage (Hard rule — 2026-06-12)

`MEMORY.md` is the **small, curated index** of durable cross-session rules and facts that gets injected into every session's system prompt. It is **not** a journal, log, or status board.

### Allowed
- Cross-session rules (routing, escalation, sharp pitfalls).
- Stable operational facts (where Boss Hub lives, critical repos, port map pointers).
- Pointers to canonical docs (`~/.hermes/knowledge/ROUTING-RULES.md`, `TAILSCALE_PITFALLS.md`, etc.).

### Not allowed
- Incident write-ups (kanban + knowledge doc is the durable record).
- Raw logs / transcripts / multi-paragraph essays (those go to `~/.hermes/cron/output/`).
- Project status (use `~/.hermes/knowledge/PROJECTS_ACTIVE.md` / `PROJECTS_PAUSED.md` or the kanban).
- Anything already fully captured in a kanban card or knowledge doc.

### Size discipline
- **Hard cap:** 2,200 chars (enforced by the memory tool).
- **Soft target:** keep the MEMORY snapshot under 1,500 chars (~70%).
- **Prune trigger:** if the snapshot ever exceeds **1,800 chars**, open a kanban card `"MEMORY.md near cap — needs pruning"` and propose trim/move targets.

### Default routing
- Heavy content → kanban + `~/.hermes/knowledge/`.
- MEMORY.md gets at most a 1–2 line summary, **only if it changes how future sessions behave globally**.

The full rule (with format spec and failure modes) lives in **SOUL.md § MEMORY.md usage (Hard rule — 2026-06-12)**. This file mirrors it for delegated executors and subagents.

**Enforcement:** weekly cron `memory-health-check` (Mondays 9:05 AM) opens a kanban card and pings Marcelo if MEMORY >1,800 chars or USER >1,350 chars.


---

## Autonomous-By-Default Operating Model (2026-06-23)

For non-trivial changes, see **`autonomous-change-pipeline` skill** and **`workflow-sanity-check` skill**. Five carve-out categories still require Marcelo approval: (1) infrastructure install/remove/upgrade, (2) public/VPN port changes, (3) security-relevant behavior, (4) vendor/API/billing, (5) true product-direction. Mirror: `~/Obsidian/Hermes/10_Operating-Blueprint/AUTONOMY_OPERATING_MODEL_v3.md`.
