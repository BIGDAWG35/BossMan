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

## Model Routing

|| Model | Use Case |
|---|---|
| MiniMax 2.7 | Default orchestrator — BLOCKED for SquarePayouts |
| DeepSeek | Low-cost research/coding — APPROVED for all projects |
| OpenAI | Structured synthesis — APPROVED for all projects |
| Claude | High-stakes review — APPROVED for all projects |

**SquarePayouts Model Restriction (permanent until Marcelo removes it):**
- SquarePayouts is restricted to **Claude, DeepSeek, and OpenAI only**.
- MiniMax 2.7 is **BLOCKED** for all SquarePayouts work: bug investigation, code fixes, Basecamp workflow automation, cron/PM2/Hermes monitor work, invite flow, pricing workflow, auth/session issues, UI/UX bug analysis, architecture review, testing review, implementation planning.
- This restriction applies to all subagents and delegated executors working on SquarePayouts.

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

### Model Pool Roles

|| Role | Models | Responsibility |
|---|---|---|
| Orchestrator | MiniMax 2.7 | Task delegation, coordination, quality gate — **BLOCKED for SquarePayouts** |
| Executor | DeepSeek, OpenAI | Implementation, research, coding |
| Reviewer | Claude | High-stakes reviews, architecture decisions |
| Specialist | Perplexity | Web research, Deep Research, process analysis, crypto research, verification |

**SquarePayouts Model Restriction (permanent until Marcelo removes it):**
- SquarePayouts is restricted to **Claude, DeepSeek, and OpenAI only**.
- MiniMax 2.7 is **BLOCKED** for all SquarePayouts work: bug investigation, code fixes, Basecamp workflow automation, cron/PM2/Hermes monitor work, invite flow, pricing workflow, auth/session issues, UI/UX bug analysis, architecture review, testing review, implementation planning.
- This restriction applies to all subagents and delegated executors working on SquarePayouts.

### Detailed Model Roles (Permanent — 2026-05-20)

|| Model | Role | Notes |
|---|---|---|---|
| **Claude** | Architecture planning, workflow design, structured kanban planning, prompt/agent design | High-stakes only |
| **DeepSeek** | Deep reasoning, technical validation, edge-case analysis, crypto logic, cycle comparison | Low-cost backup |
| **OpenAI** | Synthesis, product framing, operational writing, summarization | Clean production output |
| **MiniMax 2.7** | Alternative layouts, workflow variations, idea expansion, second-pass creative | Default orchestrator |
| **Perplexity** | Research, Deep Research, web reasoning, process analysis, crypto research, verification | Browser/Brave QA path |

**Model Rules (Permanent):**
- Do not use all models for every task
- Use the best model for the job
- When confidence is low or issue is strategic → compare multiple models and synthesize
- Use evidence-backed findings over hype
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

### Project Kickoff AI Stack Recommendation

When starting a new project, recommend this stack:
- **Orchestrator:** MiniMax 2.7 — task planning and delegation
- **Research:** Perplexity (Computer Use) — initial research, Space creation
- **Implementation:** DeepSeek or OpenAI — coding based on complexity
- **Review:** Claude — final architecture and quality review

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

**Safety compliance (all Perplexity-driven changes):**
- MoneyPipeline and BinanceBot remain strictly separated — intel flows one way (intelligence → execution).
- No Perplexity guidance may weaken safety layers (pre-trade hook, loss limits, intel gate).
- Live trading enablement (PAPER_MODE=false) requires explicit Marcelo approval, never Perplexity.

---

## Systems

| System | Port | Notes |
|---|---|---|
| Money Pipeline | 8020 | Active — see OPERATINGBLUEPRINT.md |
| Sports Squares | 8030 | Active |
| BakeryOps | 8040 | Active |
| Binance Bot | 8104 | Active |

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
