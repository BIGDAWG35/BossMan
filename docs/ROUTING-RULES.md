# Routing Rules — BossMan Default Build Flow (v3.0 / "10/10")

**Version:** 3.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** Canonical — governs all work routing

> **v3.0 (2026-06-03) — "10/10" canon update.** Default Build Flow is now
> 6 steps (added Step 5 — QA pass). Added Perplexity Computer as a rare,
> narrow-scope escalation tool with a 10,000 credits/month budget and a
> mandatory `escalate_to_computer: yes` flag. Added light build metrics
> (`build_passes`, `rewrite_scope`) and a monthly review to fold
> learnings back into the flow. Replaces v2.0 (5-step flow).

---

## Purpose

This is the **single source of truth** for the Default Build Flow, multi-model
routing, the QA pass, Perplexity Computer escalation, and the light build
metrics. All other canon files point here.

Mirrors (kept in sync):
- `~/.hermes/spaces/agent-os/03-routing-rules.md` (Perplexity Spaces mirror)
- `~/Repos/BossMan/docs/ROUTING-RULES.md` (GitHub mirror)
- `~/Repos/BossMan/docs/perplexity-spaces/agent-os/03-routing-rules.md` (GitHub Spaces mirror)

Cross-references:
- `~/.hermes/AGENTS.md` — Model Routing (parent policy)
- `~/.hermes/OPERATINGBLUEPRINT.md` — Operating procedure
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — Cost tiers + Routing Ledger schema
- `~/.hermes/knowledge/MODEL-STACK-WORKFLOWS.md` — End-to-end worked examples (v3.0 includes QA + optional Computer)
- `~/.hermes/knowledge/LBC35_SOUL_v2_delegated_executor.md` — LBC35 SOUL v3.0 (model choice and Computer remain BossMan's job)

---

## 1. Model Roles (sharp, opinionated)

| Model | Role |
|---|---|
| **Perplexity Search (Pro)** | Step 1 — research. Always the first step for any non-trivial build or troubleshooting. Pulls current docs, best practices, API references, and gotchas so we never guess when we can read. |
| **M3 (MiniMax M3)** | Step 2 — design. Marcelo's thinking and planning brain. Understands the request, defines architecture, breaks work into Kanban cards, writes acceptance criteria. Default for routine work. BLOCKED for SquarePayouts. |
| **DeepSeek** | Step 3 — heavy coding. Primary builder for complex or critical backend logic, data work, or debugging. Also the preferred **Step 5 — QA pass** model (red-team mindset). |
| **Llama (Ollama local)** | Step 4 — cheap grinder. Bulk transforms, scaffolding, refactors, test generation, cleanup. |
| **OpenAI** | Step 3 — production finisher. Primary builder when output is user-facing, high-risk, or needs polished style. Final polish only. |
| **Claude** | Step 6 — long-form documentation. Runbooks, handoff docs, multi-page explanations, architecture reviews. Only after the code is stable AND QA has passed (or issues are logged). |
| **Perplexity Computer** | **Rare escalation tool** — multi-step Mac/browser workflows that span research, code, and deployment. **NOT part of the everyday default path.** Used only on projects with `escalate_to_computer: yes` set by BossMan and approved by Marcelo. Budget: 10,000 credits/month. |
| **OpenClaw / LBC35** | Delegated executor — does **not** choose models, does **not** trigger Perplexity Computer. Executes the `model_plan:` and `escalate_to_computer:` flags from the handoff packet. |

**SquarePayouts exception (permanent):** SquarePayouts uses Claude, DeepSeek,
and OpenAI only. M3 is BLOCKED. Perplexity Search, Llama, and Claude remain
approved for SquarePayouts research and review. Perplexity Computer requires
the same `escalate_to_computer: yes` approval as everywhere else.

---

## 2. Default Build Flow — 6 Steps ("10/10")

For every new project, feature, or serious troubleshooting:

```
STEP 1  → Perplexity Search     research, current docs, gotchas
STEP 2  → M3                    architecture, Kanban cards, acceptance criteria
STEP 3  → Primary builder       DeepSeek | Llama | OpenAI  (one per card)
STEP 4  → Llama                 bulk cleanup, refactors, tests
STEP 5  → QA PASS               red-team the build with DeepSeek (or best coding model)
STEP 6  → Claude                long-form docs and runbooks (only after QA passes)
```

### Step 1 — Research (Perplexity Search)
- Use Perplexity Search to gather external info: current docs, best
  practices, API references, and gotchas.
- **Always do this first** for any non-trivial build or troubleshooting.
- Link key sources into the main project card.

### Step 2 — Design (M3)
- Use M3 to design the architecture, define the main components, and
  break work into Kanban cards with clear acceptance criteria.
- Save the design and criteria in the main project card body, not in chat.

### Step 3 — Build (exactly one primary builder per card)
For each build card, pick exactly one primary builder:

| Builder | When to use |
|---|---|
| **DeepSeek** | Complex or critical backend logic, data work, or debugging. |
| **Llama** | Repetitive scaffolding, refactors, or large-volume code edits. |
| **OpenAI** | Output is user-facing, high-risk, or needs polished style. |

Note the primary builder in the card body under a `model_plan:` line.

### Step 4 — Harden and clean up (Llama)
- Use **Llama** to handle bulk cleanup and test generation.
- Use **DeepSeek** or **OpenAI** only as a final sanity pass on
  critical components. Do not rewrite large chunks that are already
  acceptable.

### Step 5 — QA PASS (DeepSeek red-team) — new in v3.0

> **Always run for high-impact or sensitive work.** Marcelo's standing
> instruction: include Step 5 automatically for serious projects and
> high-impact features unless Marcelo explicitly says to skip it.

**What Step 5 does:**
- A strong coding model — **DeepSeek** (preferred) or the best available
  coding model at the time — attempts to **break** the build.
- Mindset: **red team**, not peer review. The goal is to find
  weaknesses, not to confirm the code is fine.
- Coverage: edge cases, security, performance, failure modes (network
  failures, partial reads, concurrent writes, malformed input, auth
  bypass, race conditions, memory leaks, off-by-one, integer overflow,
  timezone bugs, encoding issues, etc.).

**Mandatory for critical cards** (always include Step 5, no exceptions):
- Money / financial flows
- Personal data / PII
- Infrastructure / production runtime / PM2 processes
- Trading bots (live or paper)
- Auth / sessions / credentials / secrets handling
- Public APIs / third-party integrations
- Anything Marcelo tags as critical on the card

**Optional for non-critical cards** (recommended but skippable):
- Internal tools, dev-only tooling, doc fixes
- Trivial scaffolding
- Single-line typo fixes

**How to log Step 5:**
- QA findings go on the **card as a comment** (using the standard
  Routing Ledger format) AND/OR as **separate QA sub-cards** for any
  issue that needs its own fix work.
- A QA pass that found no issues gets logged as
  `[QA PASSED — DeepSeek] — no issues found` for the audit trail.
- QA findings that become their own work create child cards
  (e.g. `parent_card = t_xyz`, `qa_finding: race on tenant counter`).

**Why DeepSeek as the default QA model:**
- DeepSeek is already a Step-3 builder for complex code, so it knows the
  codebase shape and failure modes.
- DeepSeek's reasoning quality on edge-case analysis is the best in the
  stack for this role.
- If DeepSeek is unavailable or rate-limited, the Step-5 fallback is
  **OpenAI** (best general coding model) and then **M3** (last resort).

### Step 6 — Docs and handoff (Claude)
- Use **Claude** to write long-form docs and runbooks only after the
  code is stable **and QA has passed** (or every QA issue is logged
  as a sub-card and tracked).
- Claude reads the final code, M3's design notes, the acceptance
  criteria, and the QA findings, then produces concise but complete docs.
- Save final docs to both the project repo (`/docs/`) and Obsidian
  (`~/Desktop/CLAW-Backup/ProjectName - Feature.md`).

### Optional — Perplexity Computer (escalation only)

> See §4 for the full Perplexity Computer policy. In short: Computer
> is **not** part of the everyday 6-step flow. It is a rare escalation
> tool. The main project card has an `escalate_to_computer:` flag that
> BossMan proposes and Marcelo approves.

---

## 3. Multi-Model Per Card — Controlled

- Do not use more than **two models actively writing** to the same card
  unless you explicitly document a handoff.
- Example of a valid 3-step plan:
  `DeepSeek writes initial code → Llama refactors and adds tests → OpenAI only polishes comments and README`.
- Avoid having multiple models make large, overlapping edits to the
  same code in the same pass. Prefer a clear sequence of ownership.
- Each model in the sequence has a single, narrow job. The next model
  only touches what its predecessor left.

### Per-card fields (v3.0)

Every build card in the Hermes Kanban must include:

```yaml
## Blueprint
type: KICKOFF | CONTINUATION | TRIAGE
goal: ...
deliverables: [...]
artifacts: [...]

## Routing
model_plan: <primary builder> [→ <secondary builder>] [→ <polish builder>]
qa_required: yes | no              # new in v3.0 — defaults to yes for critical cards
qa_model: DeepSeek | OpenAI | M3   # new in v3.0 — model running the Step 5 red-team
qa_status: pending | passed | failed | logged    # new in v3.0 — updated after Step 5
escalate_to_computer: yes | no     # new in v3.0 — see §4
escalate_to_computer_reason: ...   # new in v3.0 — only set if escalate_to_computer: yes
build_passes: 1 | 2 | 3+           # new in v3.0 — set when card is closed
rewrite_scope: none | minor | major # new in v3.0 — set when card is closed
fallback_chain: <which models cover if primary fails>
model_log:
  - model: <name>
    when: <ISO timestamp>
    used_for: <what it did>
    output_location: <file path or commit SHA>
```

The `model_log` is updated after each model touches the artifact.
Reviewers and later agents should be able to reconstruct the chain of
custody by reading the log.

---

## 4. Perplexity Computer — Rare Escalation Tool

> **Status:** 10,000 credits/month budget. Not part of the everyday
> default path. Only used on projects with the `escalate_to_computer:`
> flag set and approved by Marcelo.

### When Computer is allowed (escalation patterns)

BossMan may **propose** `escalate_to_computer: yes` on the main
project card if the project clearly matches one of these patterns:

1. **Greenfield, full-stack SaaS builds** that include research, code,
   and deployment in one orchestrated pass.
2. **Large cross-service refactors or migrations** that touch multiple
   repos or services and benefit from Computer orchestrating the steps.
3. **Complex, multi-domain research** that spans law / finance / tech
   where Computer can efficiently orchestrate multiple models.

### When Computer is NOT allowed

- Small or medium cards (use the local stack — Perplexity Search + M3 +
  DeepSeek / Llama / OpenAI / Claude — per §2).
- Routine maintenance, single-feature work, doc-only updates.
- Any project where BossMan has not explicitly proposed
  `escalate_to_computer: yes` and Marcelo has not approved it.

### How the escalation works

1. **BossMan proposes** on the main project card:
   ```
   escalate_to_computer: yes
   escalate_to_computer_reason: [1-2 sentences matching one of the patterns above]
   ```
2. **Marcelo confirms or rejects.** No work begins until confirmed.
3. **BossMan executes** the project using Perplexity Computer instead
   of the standard local stack.
4. **BossMan logs** on the card which Computer sub-tasks ran and
   roughly how many credits they used.
5. **Budget tracking:** the Monthly Build-Metrics Review (see §5)
   reports Computer credit usage against the 10k/month cap.

### Budget cap (10,000 credits/month)

- Hard cap: 10,000 credits/month.
- If a project would consume more than ~3,000 credits, BossMan
  pre-warns Marcelo before starting.
- If the cap is reached mid-month, BossMan **stops** using Computer
  and falls back to the local stack for the rest of the month.
  Marcelo can override and re-enable Computer, or carry over to next
  month.

### LBC35 and Computer

- LBC35 **does not** trigger Perplexity Computer.
- LBC35 reads the `escalate_to_computer:` flag on the handoff packet.
  If the flag is `yes` and approved, LBC35 may use Computer for the
  assigned scope. If the flag is `no` (or missing), LBC35 must not
  invoke Computer, even if the work pattern looks Computer-friendly.
- If LBC35 believes Computer would help, it writes a card comment
  and waits for BossMan / Marcelo to update the flag.

---

## 5. Light Build Metrics (v3.0)

> **Goal:** steadily move toward one-pass, clean builds. Tiny per-card
> fields + a monthly review. No dashboards, no fancy charts.

### Per-card fields

On every build card, when the card is closed, the assigned profile
(or BossMan) sets:

```yaml
build_passes: 1 | 2 | 3+    # how many build attempts the card needed
rewrite_scope: none | minor | major   # how much of the original was rewritten
```

- `build_passes: 1` — the card shipped on the first complete pass
- `build_passes: 2` — the card needed one round of fixes (typically
  Step 4 Llama cleanup, or a Step 5 QA finding)
- `build_passes: 3+` — the card needed multiple rewrites or
  significant intervention

- `rewrite_scope: none` — the original build was kept as-is
- `rewrite_scope: minor` — small cleanups, renamed functions, better
  error messages, doc fixes
- `rewrite_scope: major` — significant chunks rewritten, architecture
  changes, or a near-full redo

### Monthly review

- **Cadence:** once per month, or whenever Marcelo asks
  *"review build metrics"*.
- **Output:** one comment on the bossman Kanban board (or a small
  report saved to `~/.hermes/knowledge/BUILD_METRICS_<YYYY-MM>.md`).
- **Content:**
  1. How many cards were 1-pass builds vs 2 or 3+ passes (counts
     and percentages).
  2. Which `model_plan:` patterns gave us the cleanest one-pass
     builds (e.g. "DeepSeek + Llama cleanup + DeepSeek QA = 80%
     one-pass; Llama-only = 40% one-pass").
  3. Which patterns are the noisiest (most 3+ passes, most
     major rewrites).
  4. Any obvious changes we should make to the Default Build Flow or
     model roles based on this data.

### Default Build Flow ↔ metrics feedback loop

The metrics are not a vanity dashboard. When the review surfaces a
pattern, BossMan proposes a flow change (e.g. "switch Step 4 from
Llama to DeepSeek on critical cards" or "drop Step 5 QA for trivial
docs-only cards") and updates the canon with Marcelo's approval.

---

## 6. Token and Cost Policy

- Prefer **Llama** and **M3** for high-token grinding and planning.
- Use **DeepSeek**, **OpenAI**, and **Claude** only when their strengths
  matter.
- **Fallback chain** when a paid model fails on quota or billing:
  - Planning / reasoning: **M3 → Llama → DeepSeek**
  - Code / debugging: **DeepSeek → Llama → OpenAI**
  - Docs / specs: **Claude → OpenAI → M3**
  - QA / red-team: **DeepSeek → OpenAI → M3** (new in v3.0)
- **Perplexity Computer is budgeted separately** — 10,000 credits/month.
  See §4.
- On every card that uses a paid model, log on the card:
  - Which model(s) were used
  - Rough usage (input/output tokens, or wall-clock time, or Computer
    credits for the Computer line)
  - The location of key outputs (file paths, knowledge-doc paths,
    commit SHAs)

---

## 7. Kanban Card Conventions (v3.0)

Every build card in the Hermes Kanban must include the fields shown in
§3. New in v3.0:

- `qa_required` — yes for critical cards, no otherwise (defaulting rule
  in §2 Step 5)
- `qa_model` — DeepSeek default, OpenAI fallback, M3 last resort
- `qa_status` — updated after Step 5 runs
- `escalate_to_computer` — only set to `yes` after Marcelo approval
- `escalate_to_computer_reason` — only set if flag is `yes`
- `build_passes` — set when the card is closed
- `rewrite_scope` — set when the card is closed

The full per-card template is in §3.

---

## 8. LBC35 and Delegated Executors

LBC35 and other delegated executors **do not choose models** and **do
not trigger Perplexity Computer** on their own. They execute using the
`model_plan:`, `qa_required:`, and `escalate_to_computer:` flags that
BossMan put in the handoff packet.

- LBC35 SOUL (v3.0) is the source of truth for this rule.
- LBC35 may run on whatever model its own runtime is configured for,
  but the **artifacts it produces** must follow the model's role and
  quality bar from this document.
- If a delegated executor needs a different model or Computer than the
  one in the packet, it **escalates to BossMan** before changing
  anything. BossMan either updates the packet or replies with the
  decision.

---

## 9. Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-08 | Initial routing rules (Hermes-first). |
| 2.0 | 2026-06-03 | Canon rewrite: 5-step Default Build Flow (Perplexity → M3 → primary builder → Llama → Claude). LBC35 disowns model choice. |
| 3.0 | 2026-06-03 | **"10/10" update.** 5-step flow → 6-step flow with mandatory Step 5 QA pass (DeepSeek red-team, mandatory for critical cards). Perplexity Computer as a rare escalation tool (10k credits/month, `escalate_to_computer:` flag). Light build metrics (`build_passes`, `rewrite_scope`) + monthly review. Fallback chain extended to QA. Per-card template updated with `qa_required`, `qa_model`, `qa_status`, `escalate_to_computer`, `build_passes`, `rewrite_scope`. |

---

### 8. Troubleshooting Mode & Routing Lock (2026-06-16)

- Drift discovered (2026-06-15 audit): ~/.hermes/config.yaml still had model.default: MiniMax-M3 (line 2), ~/.hermes/skills/troubleshooting-mode/SKILL.md did not exist, and ~/.hermes/knowledge/ROUTING-RULES.md had no ## Troubleshooting Mode (Incidents) appendix. The v3.0 6-step routing map was documented but not enforced — a 12–13 day gap between spec and config.
- Routing lock applied (2026-06-16): model.default is now qwen2.5:3b (cheapest free local model) with a permanent comment-block forbidding MiniMax-M3 as global default. provider: minimax and base_url are unchanged. M3 remains allowed only as the Step 2 orchestrator slot in the v3.0 routing map, never as a silent global default. [file:2]
- Troubleshooting Mode wired (2026-06-16): skill file ~/.hermes/skills/troubleshooting-mode/SKILL.md exists with the 8-step incident protocol (Classify → Fact-gather → Route via v3.0 map → Design fix → Apply → Verify → Report ALERT → Escalate). ROUTING-RULES.md now ends with the ## Troubleshooting Mode (Incidents) appendix. Auto-triggers: status: incident, status: blocked + body matches incident|outage|broken|down|not working|error, label: troubleshooting, or /troubleshoot from chat. [file:3]
- Escalation anchors: ~/.hermes/knowledge/error-escalation.md (ALERT block format, Binance bot STOPPED, money-pipeline ≥ 10 restarts, Telegram/Tailscale disconnects) and ~/.hermes/knowledge/health-monitoring.md (PM2 health rules, service drift detection) are the source of truth — both referenced from the new skill and the ROUTING-RULES appendix. [file:1][file:3]
- Verification method (drift-check): all three commands below must return “good” for the routing lock + Troubleshooting Mode to be considered live:
  - grep -n "^  default:" ~/.hermes/config.yaml
  - ls -la ~/.hermes/skills/troubleshooting-mode/SKILL.md
  - grep -n "^## Troubleshooting Mode (Incidents)" ~/.hermes/knowledge/ROUTING-RULES.md
- SquarePayouts carve-out preserved: M3 is permanently BLOCKED on SquarePayouts in the new skill; Step 2 auto-substitutes Claude Sonnet-4 in that lane. No other service has a carve-out as of this writing.

### Hermes Doctor – Routing Drift Checks (Required)

Hermes doctor MUST fail with a health warning if any of these conditions are true:

- `model.default` in `~/.hermes/config.yaml` is not `qwen2.5:3b`, or any global default is set to MiniMax-M3.
- The Troubleshooting Mode skill file `~/.hermes/skills/troubleshooting-mode/SKILL.md` is missing or unreadable.
- The routing appendix heading `## Troubleshooting Mode (Incidents)` is missing from `~/.hermes/knowledge/ROUTING-RULES.md`.

Recommended warning key:

```yaml
health:
  warnings:
    forbidden_global_default:
      ok_when:
        - model.default == "qwen2.5:3b"
        - troubleshooting_mode_skill_present == true
        - routing_rules_appendix_present == true
      message: >
        Routing configuration is drifting. Ensure model.default is qwen2.5:3b,
        troubleshooting-mode skill exists, and ROUTING-RULES has the Troubleshooting
        Mode (Incidents) appendix. Run hermes-drift-check and fix before proceeding.
```

Implementation note: `hermes doctor` should run the same checks as `hermes-drift-check` and surface this warning if any check fails, blocking routing/incident changes from being considered live.

*This document is the single source of truth for the Default Build Flow
v3.0, multi-model routing, the QA pass, Perplexity Computer
escalation, and light build metrics. Updated by BossMan when model
specializations, escalation patterns, cost tiers, or routing rules
change. All mirrors kept in sync (spaces + GitHub).*
