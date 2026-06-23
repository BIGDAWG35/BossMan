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

**Obsidian Vault Workflow Standard (2026-06-13):**
- `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` (Hermes knowledge — authoritative)
- `~/Desktop/CLAW-Backup/OBSIDIAN_VAULT_WORKFLOW.md` (Obsidian vault mirror)
- `~/Repos/BossMan/docs/OBSIDIAN_VAULT_WORKFLOW.md` (GitHub mirror)

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
| 3.1 | 2026-06-18 | **Phase 4 — Multi-Project OS + Loop Engine.** Added §10. Strict `project:` tag (closed vocabulary), 1–2 active cards per project, mandatory Tier-4/5 reuse-check via `ARTIFACT_INDEX.md`. **§1–9 unchanged.** |
| 3.2 | 2026-06-18 | **§10.6 — Per-project concurrency cap (dispatcher pick-time rule).** Cap mechanism revised: was demote-to-todo (collided with `recompute_ready()` auto-promote), now opt-in dispatcher-time skip via `kanban.max_in_progress_per_project` config key. Status mutations forbidden for cap compliance. Telemetry via `DispatchResult.skipped_per_project_capped`. §1–9 unchanged; §10.2 mechanism revision only. |

---

## Troubleshooting Mode (Incidents)

When a kanban card is an incident, bug, or system-health task, BossMan switches to Troubleshooting Mode instead of the normal 6-step build flow. The full protocol is at ~/.hermes/skills/troubleshooting-mode/SKILL.md.

Triggers (any one):
- card status: incident
- card status: blocked AND body contains incident|outage|broken|down|not working|error
- card has label: troubleshooting
- user types /troubleshoot, "incident", "outage", "broken", "down", or "system health"

Routing — same 6-step map, no global default:
- Step 1 (facts): Perplexity Search when web_research is wired; fallback is browser_navigate + read_file + terminal (PM2 / ports / cron / logs / hermes insights). Step 1 is fact-only — no guesses.
- Step 2 (design): MiniMax-M3 decomposes the incident, except for SquarePayouts (M3 BLOCKED) and trading/money projects where caution is required.
- Step 3 (fixes): Claude Sonnet-4 (production polish, careful diffs) or DeepSeek v4-flash (heavy backend code). One primary per fix.
- Step 4 (cleanup): Qwen 14B via Ollama for bulk log / test / refactor work; Qwen 3B for tiny fast helpers. Helper, never the incident owner.
- Step 5 (QA): DeepSeek v4-flash red-team. Mandatory for any fix touching money-pipeline, binance-bot, csdawg-dashboard, trading-control, or shared infrastructure (PM2 / cron / env / API keys). If DeepSeek is skipped, say so explicitly.
- Step 6 (runbook): Claude Sonnet-4 writes the final answer in the 7-section template (Incident Summary, Type, Facts, Root Cause, Fix Plan, QA, Runbook Notes, Escalation).

Escalation: Page Marcelo immediately if Binance bot is online when it should be stopped, money-pipeline has ≥ 10 restarts or is unresponsive, Telegram gateway is disconnected, Tailscale VPN is disconnected, or any critical service is completely unresponsive. Use the ALERT block from §7 of the troubleshooting-mode skill. [file:2][file:3]

Known gaps to flag in every run: Perplexity Search not wired (use browser_navigate fallback); DeepSeek v4-flash dormant (1 call/30d, expect Claude fallback); LBC-35 profile not yet created.

*This document is the single source of truth for the Default Build Flow
v3.0, multi-model routing, the QA pass, Perplexity Computer
escalation, and light build metrics. Updated by BossMan when model
specializations, escalation patterns, cost tiers, or routing rules
change. All mirrors kept in sync (spaces + GitHub).*

---

## 10. Phase 4 — Multi-Project OS + Loop Engine (2026-06-18)

**Status:** ACTIVE. Strictly additive. §1–9 above are unchanged.

Phase 4 adds two operating layers on top of the 6-step Default Build Flow
described in §3:

1. **Multi-Project OS** — every active Kanban card lives under exactly one
   project (closed vocabulary in `PROJECT_VOCABULARY.md`); at most one
   epic per project; at most 1 card in `running` + 1 card in `ready` per
   project (the active-card cap). Cards with label `fast-track` are exempt.
2. **Loop Engine** — every Tier-4/5 model call (DeepSeek / OpenAI /
   Claude / Perplexity Computer) is preceded by a reuse-check against
   `ARTIFACT_INDEX.md` and followed by an artifact save (if newly
   produced). The reuse-check is a routing-ledger field, not a
   recommendation.

### 10.1 Project tag enforcement

Every active Kanban card on the `bossman` board carries a `project:` line
in its body. The value MUST be one of the closed tags in
`PROJECT_VOCABULARY.md`. BossMan backfills missing tags on existing cards
unilaterally (no approval needed); new cards are flagged at claim time
if missing.

### 10.2 Active-card cap (1–2 rule)

| Project state | Maximum |
|---|---|
| `running` cards | 1 |
| `ready` cards | 1 |
| `todo` cards | unlimited (backlog) |
| `blocked` cards | unlimited (paused, not active) |
| `planned` epics | 1 |

**Mechanism revision 2026-06-18 (v3.1 → v3.2):** The original cap was
implemented by BossMan demoting excess cards to `todo` with a comment.
That implementation was **superseded** because it collided with
`recompute_ready()` (which auto-promotes `todo → ready` on every
`hermes kanban list` call whenever all parents are done), creating a
regression where the cap demotion was undone on the next list call.
The cap is now enforced **at dispatcher pick time only** (see §10.6).
Status mutations are **forbidden** for cap compliance — only
`recompute_ready()` owns the `todo ↔ ready ↔ blocked` transitions.

Cards with label `fast-track` are exempt from the cap.

### 10.3 Loop protocol — Tier-4/5 reuse-check

Before any Tier-4/5 call, the caller runs:

```bash
grep -i "<1-3 keywords>" ~/.hermes/knowledge/ARTIFACT_INDEX.md
```

If a hit lands in `Filename`, the artifact is reused and the call is
skipped. Routing Ledger gains two new fields (additive; existing fields
unchanged):

```yaml
reuse_check: yes | no          # yes = found in ARTIFACT_INDEX.md, reused
artifact_index_entry: <path>    # reused path (yes) or newly saved path (no)
```

If `reuse_check: yes`, the Tier-4/5 call does NOT happen. The next-model
line still names the original model so the ledger is auditable.

Valid skip reasons: `index_unavailable`, `marcelo_override:<reason>`.

### 10.4 Out of scope

§10 does NOT change: model roles (§3), cost tiers (§3), fallback chain
(§3), Perplexity Computer budget or `escalate_to_computer:` rules (§4),
Light Build Metrics (§7), LBC35's model-choice rule (§6), or any other
section above.

### 10.5 Reference documents

- `PHASE_4_MULTI_PROJECT_OS.md` — canonical spec for Phase 4
- `PROJECT_VOCABULARY.md` — closed list of project tags
- `ARTIFACT_INDEX.md` — single lookup table for Tier-4/5 outputs
- `MODEL_ROUTING_WORKFLOW.md` §10 — loop protocol details
- `KNOWLEDGE_REUSE_PIPELINE.md` §6 — loop hook command

### 10.6 Per-project concurrency cap (dispatcher pick-time rule)

**Effective:** 2026-06-18 (Phase 4 v3.2). Section 10.2 mechanism revised.

A uniform **per-project concurrency ceiling** can be opted in by setting
`kanban.max_in_progress_per_project` in `~/.hermes/config.yaml`. When
unset (default), dispatcher behavior is bit-for-bit identical to the
pre-Phase-4 baseline.

#### Semantics

- **Per project** (matching the first `project: <name>` line in the
  task body), the dispatcher limits **already-running + newly-picked**
  `ready` tasks combined to at most `N` per dispatch tick.
- **Untagged tasks are cap-exempt.** They pass through the cap block
  unconditionally. This is a deliberate forward-compat decision — new
  tags can be introduced without a code change.
- **No status mutations.** The cap defers dispatch via the new
  `DispatchResult.skipped_per_project_capped` field; it does NOT
  mutate `task.status`. `recompute_ready()` continues to own the
  `todo ↔ ready ↔ blocked` transitions. This is the load-bearing
  invariant that resolves the cap-vs-recompute conflict.

#### Config

```yaml
# ~/.hermes/config.yaml
kanban:
  # Phase 4 §10.6 — per-project concurrency cap. Opt-in, uniform.
  # Default unset = cap disabled.
  max_in_progress_per_project: 2
```

#### Telemetry

`DispatchResult.skipped_per_project_capped: list[(task_id, project, current)]`
is populated by every `dispatch_once()` call. The `hermes kanban dispatch
--json` CLI surfaces it as `skipped_per_project_capped`. Use it to
observe cap pressure without re-reading the DB.

#### Implementation surface (append-only)

- `hermes_cli/kanban_db.py`
  - `_extract_project_tag(body) -> str | None` (helper, regex-based,
    first-match-wins; returns `None` for untagged)
  - `DispatchResult.skipped_per_project_capped` field
  - Cap block inside `dispatch_once()` `for row in ready_rows:` loop,
    mirroring the existing per-profile cap pattern
- `hermes_cli/kanban.py` `_cmd_dispatch` — reads
  `kanban.max_in_progress_per_project` from config and passes to
  `dispatch_once()`
- `tests/hermes_cli/test_kanban_per_project_cap.py` — 13 tests:
  cap=1, cap=2, untagged-bypass, recompute-untouched (regression),
  idempotency, dry-run

#### Out of scope

Per-project tiered caps (different `N` per project) are deferred to a
later phase. Today's rule is a single global uniform value.

---

## 11. Security & PM2 Watch Lane (Permanent — 2026-06-23, S1-STEER LOCK)

**Status:** ACTIVE. §1–10 above are unchanged. This section is
additive: it registers the **Security & PM2 Watch Goal Loop** as a
first-class routing lane in Agent OS.

### 11.1 Mission

> "Keep PM2/crons/security posture clean for money/trading lanes,
> surface drift, never auto-fix."

### 11.2 Lane registration (Routing Ledger)

```yaml
lane: security-pm2-watch
status: active
goal_card: t_bf23cc0f       # resolved dynamically by title
spec: ~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md
script: ~/.hermes/scripts/security-pm2-monthly.sh
cron:
  id: 675fdbeba374
  schedule: "30 23 1 * *"   # monthly, 1st of month 23:30 local
  flags: --no-agent --deliver local
evidence_dir: ~/.hermes/knowledge/SECURITY_LOOP/cycles/YYYY-MM/
review_doc: docs/cycles/YYYY-MM/SECURITY_PM2_REVIEW_YYYY-MM.md
verdict_pattern: docs/verdicts/step5-verdict-s1-*.json
work_type: meta-loop (monthly audit)
qa_required: yes (Step-5 mandatory)
tier: 1
cost_per_cycle: ~$0.20
telegram_discipline: P0 + Step-5 FAIL only
```

### 11.3 Lane focus

**T1 priority lanes** (every cycle, checked first):

- `boss-hub` (internal + public)
- `bakery`
- `trading-control`
- `binance-bot` / `money-pipeline`
- `csdawg-dashboard`
- `agent-os`

**T2 supporting infra** (logged, alerted on failure):

- `cloudflared`
- `tailscale`
- `PM2 daemon`
- `Hermes gateway`
- `security-watch` (daily/weekly)
- `pm2-health-check`

### 11.4 Wake-up rules

| Severity | What counts | Surface |
|---|---|---|
| **P0** | Security / money / auth broken or stuck | **Telegram + Step-5 QA** |
| **P1** | Touches T1 lane or public port | **Dedicated A/B card, no auto-fix** |
| **P1** | Does NOT touch T1 lane | Log only, no card |
| **P2** | Anything not in P0/P1 | Monthly `SECURITY_PM2_REVIEW_YYYY-MM.md`, no Telegram |
| **P3** | Cosmetic / informational | Monthly report only |

### 11.5 Hard guard — loop is read-only + write-to-evidence only

The script's `S1_GUARD_ACTIVE` block enforces:

- **BLOCKED** from S1: `pm2 restart|delete|start|reload|stop`,
  `hermes cron create|remove|update`, `crontab -e|-r`,
  `launchctl unload|load|bootout`, `kill[-9]`, `lsof -i :PORT -k`,
  writes to `SOUL.md` / `hermes/AGENTS.md` / Obsidian mirror /
  `PHASEREPORT.md`, T1 service env / secrets / auth / `NEXTAUTH_*`.
- **ALLOWED**: `pm2 list|jlist|show|logs`, hermes kanban
  read + create (review card) + comment + complete (cycle card
  only), `lsof -iTCP -sTCP:LISTEN`, evidence writes.

Any P1 finding that requires a blocked action surfaces as an A/B
card and waits for `approve A` / `approve B` / `hold`. **Service
behavior is unchanged until the operator approves.**

### 11.6 P1 card format (mandatory)

Title + context + A/B options + one-paragraph risk/benefit + a
recommended option (A or B) with reasoning + what does NOT change
without approval + `accept_when` (operator approval language).

### 11.7 Governance

- Step-5 QA mandatory for every S1 cycle and any future scope change.
- No edits to `SOUL.md` / `hermes/AGENTS.md` /
  `MODEL_ROUTING_WORKFLOW.md` from inside this lane.
- This section is **kernel-doc**, so any change to it requires
  Routing Ledger + Step-5 + PHASEREPORT.
- Future Agent OS work treats Security & PM2 Watch as the **default
  security sub-agent** for PM2 / cron / port questions. Do not invent
  new security crons; reuse this lane.

### 11.8 State-loss rule

Goal card is resolved by **title** (e.g. "Security & PM2 Watch"),
not by hard-coded ID. Scripts use `kanban find "Security & PM2 Watch"`
or equivalent title-match. ID drift across state-loss events is
expected and not a bug.

### 11.9 No future steering prompt

Unless the operator explicitly changes T1/T2 lanes, wake-up
severity, or P1 A/B format, no future steering prompt is needed for
this lane. The S1-STEER LOCK spec and this section are the
authoritative scope.

---

## 12. Doc Hygiene Lane (Permanent — 2026-06-23, Phase 3)

### 12.1 Mission (canonical)

> Keep Hermes/BossMan canon, mirrors, and key docs clean, consistent,
> and lean, using the 5-step Goal Loop pattern. Fix drift, don't
> invent new structure.

### 12.2 Lane registration

```yaml
lane: doc-hygiene
status: active
phase: 3
goal_card: t_f42ecbe1  # rehydrated from lost t_3e4a14d4 (state-loss event)
                       # resolve dynamically by TITLE ("Doc Hygiene")
phase3_parent: t_811e342d  # rehydrated from lost t_81e30070
spec: ~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md  # 266 lines
work_type: meta-loop (monthly doc cleanup)
qa_required: yes (Step-5 mandatory for kernel-doc edits)
tier: 1
cost_per_cycle: varies (manual first review; cron when approved)
telegram_discipline: only for P0 doc issues (kernel-doc corruption);
                     otherwise local-only
cadence: monthly, 1st of month 23:00 PT
first_review: 2026-07-23 (manual)
```

### 12.3 Focus

- **Canon files**: `~/.hermes/knowledge/` — long-lived spec + decision docs
- **Core BossMan docs**: SOUL.md, AGENTS.md, ROUTING-RULES.md, PHASEREPORT.md,
  key skills under `~/.hermes/skills/` and `~/Projects/BossMan/skills/`
- **Obsidian mirror**: `~/Obsidian/Hermes/20_Agents/AGENTS.md` (and any
  other mirrors to be added)
- **GitHub mirror**: `~/Projects/BossMan/docs/ROUTING-RULES.md` and other
  files in the BossMan repo

### 12.4 Autonomous scope (loop may run without operator approval)

- Read-only detection: case-dup, md5 mirror, mtime, scan for
  `TODO|FIXME|STUB|PLACEHOLDER`
- Report generation: `PHASEREPORT_DOC_HYGIENE_YYYY-MM.md` + 1-line
  entry in top-level `PHASEREPORT.md`
- Mechanical mirror-only fixes: `cp` from canon to mirror when canon is
  newer AND the file is NOT kernel-doc
- Case-dup deletion: when `stat -f%i upper == stat -f%i lower` (true
  duplicate on case-insensitive fs), delete the lowercase twin
- Goal card updates: bump `last_reviewed`, append `## YYYY-MM-DD` log entry
- Review card creation: spawn one `monthly_review_YYYY-MM` child card

### 12.5 Approval gates (operator approval REQUIRED)

- Cron registration (proposal in `DOC-HYGIENE-CRON-PROPOSAL_*.md`)
- Kernel-doc edits: SOUL.md, AGENTS.md, ROUTING-RULES.md,
  MODELROUTINGWORKFLOW.md, PHASEREPORT.md body, all `skills/*/SKILL.md`
  kernel sections
- Mirror topology changes: adding/removing a mirror location, changing
  sync direction, rewriting the 3-mirror model
- Case-dup deletions in `docs/PHASEREPORT.md` or any `docs/` files
  (these are reference docs in the BossMan GitHub repo, never auto-delete)
- Any change introducing a new blast-radius class (PII, customer data,
  auth tokens through mirrors)

### 12.6 STOP conditions (loop MUST halt and escalate)

- **Conflicting canon** — 2 canon docs disagree (e.g., SOUL says A to B,
  AGENTS says A↔B)
- **Ambiguous case-dup deletion** — inode check passes but md5 of
  upper ≠ md5 of lower (real drift, not a true duplicate)
- **2-of-3 model disagreement** on P0 vs P1
- **Large structural change** — >500 lines moved, mirror topology
  rewritten, new skill added under `~/.hermes/skills/`
- **Mirror miss in kernel doc** — md5 mismatch on SOUL/AGENTS/ROUTING-RULES/
  MODELROUTINGWORKFLOW → STOP, never auto-sync kernel docs from mirror
- **Operator pre-empt** — `STOP doc-hygiene` via Telegram halts
  immediately

### 12.7 Governance (permanent)

- **Step-5 QA mandatory** for any kernel-doc changes
- **No changes to SOUL/AGENTS/MODEL_ROUTING_WORKFLOW from inside routine
  hygiene loops** without explicit operator approval
- **State-loss rule**: resolve goal card by title, not hard-coded ID
  (same rule as Security & PM2 Watch lane)
- **Scope discipline**: doc hygiene focuses on canon/mirror correctness
  and lean structure; **behavior changes (code/config) belong to other
  lanes**
- **Hard guard**: this section is **kernel-doc** (ROUTING-RULES.md), so
  any change to it requires Routing Ledger + Step-5 + PHASEREPORT
- **No daily spam**: monthly review only; ad-hoc doc fixes still go
  through ACP

### 12.8 Future Agent OS work rule

Doc Hygiene is the **default doc-cleanup sub-agent** for Agent OS.
Future Agent OS work that touches canon/mirror drift, doc consistency,
or doc lean-ness routes to this lane rather than inventing new
one-off scripts or crons. Do not create new doc-hygiene crons or
duplicate doc audits.

### 12.9 No future steering prompt

Unless the operator explicitly changes the lane scope, approval
gates, STOP conditions, or cadence, no future steering prompt is
needed for this lane. The Doc Hygiene spec (`GOAL-LOOP-DOC-HYGIENE.md`)
and this section are the authoritative scope.
