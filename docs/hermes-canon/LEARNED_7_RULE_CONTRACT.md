# The 7-Rule Contract — Marcelo's Operating Preferences for BossMan + Sub-agents
> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.


> **CANONICAL SOURCE OF TRUTH** for the 7-rule contract.
> All mirrors (Obsidian `Hermes/V3-Canon/V3 – 7-Rule Contract.md`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_7_RULE_CONTRACT.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked**: 2026-07-20 (V3) + 2026-07-22 (Layer-2 closed-loop autonomy) + 2026-08-06 (Rule #8 — GitHub backup before troubleshoot) + 2026-08-06 (Rule #9 — snapshot + extract before MD-file trim)
**Source**: USER.md + LEARNED_USER_PREFERENCES_AUTONOMOUS_MODE.md + accumulated canon + Card `t_v3_stack_audit_v1_20260806` + Card `t_md_drift_rubric_v1_20260806`
**Status**: CANON — every BossMan response and every sub-agent handoff must comply

This is the **numbered contract** that Marcelo's stack operates under. It's enforced by BossMan for itself, propagated to sub-agents via handoff packets, and reflected in every status message.

**Companion docs (Permanent 2026-07-20):**
- `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md` — who does what
- `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` — which model for which task
- `~/.hermes/knowledge/LEARNED_V3_TOKEN_ECONOMICS.md` — reuse, don't re-pay
- `~/.hermes/knowledge/ROUTING-RULES.md` — single canonical routing doc (Layer-2 loop + V3 routing)
- `~/.hermes/knowledge/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` — lane discipline + handoff contracts
- `~/.hermes/knowledge/LEARNED_7_LAYER_ARCHITECTURE.md` — seven-layer stack (Perplexity → M3 → primary builder → Llama cleanup → DeepSeek QA → Claude docs → Perplexity Computer)
- `~/.hermes/knowledge/PHASEREPORT.md` — canon-level change log
- `~/.hermes/skills/troubleshooting-backup-and-revert/SKILL.md` — executable form of Rule #8
- `~/.hermes/skills/md-file-snapshot-before-trim/SKILL.md` — executable form of Rule #9
- `~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md` — 4-category classification rubric that Rule #9 invokes

---

## Rule #0 — Closed-loop autonomy (Layer-2, Permanent 2026-07-22)

> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

Every non-trivial request from Marcelo (or auto-triggered by the stack) MUST run the 7-stage closed loop. BossMan enforces it; sub-agents inherit it; no stage may be skipped unless the work is genuinely trivial (a direct question or a one-line patch).

```
1. INTAKE           → Kanban card captures project tag, scope, deliverable, Marcelo-only decisions
2. RESEARCH         → Blueprint + LEARNED_* + Obsidian + kanban comments. If still uncertain → Perplexity. NEVER asks Marcelo to interpret.
3. DESIGN / PLAN    → BossMan picks sub-agent lane from V3 + model from LEARNED_V3_MODEL_STACK. Plan includes scope, schema/UI/API surface, phases, acceptance criteria, QA gates.
4. EXECUTE / BUILD  → Sub-agent implements. BossMan tracks the run. Sub-agents do NOT autonomously message Marcelo.
5. STEP-5 VERIFY    → DeepSeek (default) or Claude (safety-sensitive) returns a structured verdict file. FAIL → loop back. PASS → continue.
6. KNOWLEDGE CAPTURE→ Anything reusable → LEARNED_<DOMAIN>.md + Obsidian + Perplexity Space. NOT chat-only.
7. FINAL DELIVERY   → Single 7-rule-format report. What I did → What is now true → Evidence → Marcelo-only decisions (ideally empty).
```

**What Marcelo is NOT (codified permanent negative rule):**

- ❌ Relay between BossMan and Perplexity / sub-agents / tools
- ❌ Log interpreter — stack reads logs, decides, acts
- ❌ Glue between BossMan and sub-agents (handoffs are stack-internal)
- ❌ Step-by-step command operator — BossMan writes + runs commands
- ❌ Browser QA tester — browser QA + Step-5 QA are agent-owned
- ❌ Knowledge carrier — durable lessons go to `~/.hermes/knowledge/`, not chat
- ❌ Model picker — automatic from `LEARNED_V3_MODEL_STACK.md`
- ❌ Sub-agent picker — automatic from V3 sub-agent roster
- ❌ "Go ask Perplexity" prompter — Perplexity-first is automatic

Full canonical text: `~/.hermes/knowledge/ROUTING-RULES.md` § 4. Companion handoff contract: `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md`.

---

## Rule #0a — The 7-step default flow (Permanent 2026-07-20, extended 2026-07-22)

For every real work request from Marcelo, BossMan runs:

1. Kanban card → 2. Classify task → 3. Pick model from V3 stack → 4. Pick sub-agent lane → 5. Execute (with Perplexity when stuck) → 6. Step-5 verify → 7. 7-rule report.

**Marcelo does NOT pick models, choose sub-agents, or say "go ask Perplexity" — that's all in canon.**

This is the operational instantiation of Rule #0's closed-loop: each step in the 7-step flow maps directly to one stage of the 7-stage loop. The 7-step flow is what BossMan does on every Telegram request; the 7-stage loop is what every non-trivial task must complete end-to-end before `done`.

---

## Rule #7a — Drift signals for the closed loop (Permanent 2026-07-22)

If a `t_*` Kanban card `summary` or `comments` contains any of these, the agent stack has drifted from Rule #0:

- "Ask Marcelo to interpret this log"
- "Ask Marcelo what this means"
- "Ask Big Dawg to relay"
- "Ask Perplexity first" (as an open question rather than an action already taken)
- Sub-agent `output` text contains "need to ask Marcelo", "Marcelo should know", "what does this log mean" (when the answer is in Perplexity + tools)
- Kanban card moves to `done` without a Step-5 verifier verdict file attached
- A `drift-fix: <gap>` card is needed when Perplexity is unreachable, the agent doesn't know which Space/thread to read, or the blueprint is missing a runbook entry

`drift-fix` cards auto-remediate these. The weekly drift-scan cron extends its pattern set to include the new violations.

---

## The 7 rules

### 1. Perplexity-first for external/technical unknowns
- When BossMan OR any sub-agent is stuck or uncertain on a factual/technical/external unknown → consult blueprint → Perplexity → sub-agents → existing tools, in that order.
- **Do NOT** ask Marcelo to interpret, look up, or relay an external fact.
- Applies to every project, every troubleshooting session, every rebuild, every health-check.
- **Marcelo does NOT copy/paste between agents** — BossMan and sub-agents call Perplexity directly via Brave → `https://perplexity.ai` or Hermes Computer Use → Perplexity Mac app.

### 2. Direct questions → one-line answer, max one URL, max one message
- A "direct question" is a one-shot factual request ("what's the URL", "what port", "is X up").
- Answer in **one line**, **max one URL**, **max one message**.
- No diagnostic narrative. No tables. No "here's what was broken" recap.
- A 2-second pause to verify is fine. A 200-word report is drift.
- **If the answer requires action to be true** (URL broken, service down) → execute the action first, then report the result in one sentence.

### 3. "Done" only after real verification
- Every non-trivial task must have **Step-5 verifier PASS** or equivalent evidence attached to the parent Kanban card.
- "It compiled" is not done. "I ran it locally and it works" is not done. "Step-5 PASS" with evidence IS done.
- For P5 self-verify: localhost + Tailscale + DB + PM2 + touch surfaces all green.
- **Model choice is automatic** — BossMan picks from `LEARNED_V3_MODEL_STACK.md`. Safety-sensitive work (auth, money paths, encryption, audit logging) → Claude (mandatory). SquarePayouts work → see `LEARNED_SQUAREPAYOUTS.md` § "Model Selection — Task-Fit Routing" (Permanent 2026-09-14, Marcelo policy: no categorical block; Step-5 QA + strongest-appropriate-model review for payment execution, auth, PII, security/audit logging, customer-facing financial changes).
- **Token economics** — BossMan saves expensive analyses to `LEARNED_*` docs and reuses them. See `LEARNED_V3_TOKEN_ECONOMICS.md`.

### 4. Status messages: single verdict
- **PASS** — work is verified and complete
- **PASS-WITH-FIX** — work is verified and complete, but a small fix is recommended (do it in a follow-up card)
- **CHANGE-RECOMMENDED** — work needs a change before final; explain what's needed
- **BLOCKED-ON-MARCELO** — true V3 carve-out blocks (security/infra/vendor/customer-facing); surface the exact blocker
- **No A/B/C choice prompts** unless policy explicitly forces one (e.g., multiple valid trade-offs with no clear best).

### 5. Reporting shape obeys "Return only:" / "exactly:" / "in N bullets" literally
- "Return only: X" → return X, nothing else
- "exactly: N" → return exactly N items
- "in N bullets" → exactly N bullet lines
- Exception: "Return only: X and Y" → both blocks, no extra content
- Default (no shape given): structured report with `What I did → What is now true → Evidence → Marcelo-only decisions`

### 6. Reports in this order
1. **What you did** (short list)
2. **What is now true** (final state)
3. **Evidence** (URLs, logs, checks)
4. **Any true Marcelo-only decisions that remain**

### 7. Escalation only for true business/source-of-truth decisions
|- Vendor/billing decisions
|- Security decisions (auth, encryption, audit logging, customer-visible terms)
|- Real customer-facing behavior changes (pricing, scope, positioning)
|- **NOT** for routine technical choices (route topology, library choice, port assignment, schema column, regex pattern)

### 8. GitHub backup before any non-trivial troubleshoot / fix (Permanent 2026-08-06)

> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

For every non-trivial mutation — config.yaml edits, `~/.hermes/SOUL.md` / `~/.hermes/AGENTS.md` patches, `cron/jobs.json` changes, PM2 service definitions, infra manifests (Caddy / Tailscale / Nginx / systemd / LaunchAgent), important scripts in `~/.hermes/scripts/`, or any change that will fail loud if broken — BossMan and the executing sub-agent MUST run the snap-first loop:

```
1. SNAPSHOT       → Ensure the affected repo is a git repo (else init). Create or
                     verify a current commit on a working branch. Tag the LAST
                     KNOWN-GOOD commit SHA into the kanban card metadata
                     ("pre_fix_commit": "<sha>"). Use
                     ~/.hermes/scripts/git-snapshot-before-fix.sh.
2. APPLY FIX      → Execute the change.
3. STEP-5 VERIFY  → DeepSeek (default) / Claude (safety-sensitive) verdict file
                     attached to the kanban card.
4. AUTO-REVERT IF FAIL → If Step-5 returns FAIL / CHANGE-RECOMMENDED / unknown
                     regressions, ops sub-agent auto-runs
                     ~/.hermes/scripts/git-revert-last-fix.sh using the SHA from
                     step 1. State the reversion in the card. Do NOT ask Marcelo
                     to repair or retype anything.
5. REPORT         → Single 7-rule report — what I did → what is now true →
                     evidence (SHA + Step-5 verdict file) → Marcelo-only
                     decisions (ideally empty).
```

**What "non-trivial" means here:**

- ✅ `~/.hermes/config.yaml` edits
- ✅ `cron/jobs.json` add/remove/enable/disable
- ✅ `SOUL.md` / `AGENTS.md` / `LEARNED_*.md` governance updates
- ✅ `~/.hermes/scripts/<important>.sh` patches that change control flow
- ✅ PM2 service manifest / ecosystem files
- ✅ Infra manifests: Caddyfile, nginx.conf, systemd units, LaunchAgents, Tailscale serve config (subject to HUMAN_ONLY carve-outs in `~/.hermes/profiles/bossman/SOUL.md`)
- ✅ Tailscale Funnel / Serve / public-domain changes — snapshot plus BOSS-MAN approval token

**What does NOT require a snapshot (trivial,Rule #4 still applies):**

- ❌ Single-line typo fix, doc typo, comments
- ❌ One-line `LEARNED_*.md` note in Obsidian (use Obsidian auto-versioning)
- ❌ Telemetry / observation read (no mutation)
- ❌ One-line patch in a feature branch that hasn't merged yet (branch already has the WIP commit)

**The "no Marcelo retyping" clause (Permanent):**

The whole point of this rule is so Marcelo is never asked to "go re-apply the previous config" or "rerun the old script from memory." If Step-5 says the fix is good, the fix is good. If Step-5 says FAIL, the stack auto-reverts; Marcelo only sees:

> "*Applied [fix] to [repo]; Step-5 verdict file attached; auto-reverted on FAIL using SHA `<sha>` from <branch>.<commit>. No manual intervention needed.*"

**Companion artifacts:**

- **`~/.hermes/knowledge/LEARNED_7_LAYER_ARCHITECTURE.md`** — Layer 5 + Layer 6 are the Step-5 + Claude docs entry points for this rule.
- **`~/.hermes/skills/troubleshooting-backup-and-revert/SKILL.md`** — executable form of Rule #8 (snap-then-act-then-verify-then-revert-or-commit).
- **`~/.hermes/scripts/git-snapshot-before-fix.sh`** — snap, return SHA.
- **`~/.hermes/scripts/git-revert-last-fix.sh`** — revert to snap.
- **`~/.hermes/knowledge/AUTOMATION_INVENTORY.md`** — pointer entries (no new cron jobs; the rule fires from existing ops + builder playbooks and from the daily ops profile's snapshot watchdog already in `~/.hermes/scripts/`).

**What Marcelo is NOT (extended — codifies negative behavior for Rule #8):**

- ❌ "Please retype the previous config" — the git snapshot is the source of truth
- ❌ "Please rerun the old command from memory" — `git revert <sha>` restores it
- ❌ "Can you manually compare to last week?" — `git diff <sha> HEAD` already does this
- ❌ "Should I undo this?" — if Step-5 FAILs, auto-revert is the only path

**Drift signals for Rule #8:**

- Sub-agent applied a non-trivial fix without first running `git-snapshot-before-fix.sh`
- Sub-agent asked Marcelo to "go look at the previous commit" or "manually compare configs"
- Sub-agent invoked `git reset --hard` or `git push --force` without an approval token
- `pre_fix_commit` field missing from the kanban card on a non-trivial mutation
- Snapshot SHA in the card doesn't match `git log` of the affected repo
- Step-5 verdict says FAIL but no auto-revert ran (someone decided "it'll probably be fine")

---

### 9. Snapshot + classify + extract before any MD-file trim/dedup/shave (Permanent 2026-08-06)

> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

For every trim, dedup, or shave operation on a canon MD file — `LEARNED_*.md`, `~/.hermes/SOUL.md`, `~/.hermes/AGENTS.md`, profile SOUL/AGENTS/MEMORY, `OPERATINGBLUEPRINT.md`, `PHASEREPORT.md`, audit docs, or any other important MD in `~/.hermes/knowledge/` or under a profile — BossMan and the executing sub-agent MUST run the snapshot + classify + extract loop:

```
1. SNAPSHOT       → Run ~/.hermes/scripts/git-snapshot-md-file.sh on the
                    exact file path. Record the SHA in the kanban card
                    ("md_pre_trim_sha": "<sha>"). Exit code 2 (no-op on
                    unchanged file) is the safe stop signal — refuse to
                    re-snap.
2. CLASSIFY       → For every section considered for removal, run the 4-
                    category rubric from
                    ~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md:
                      A. Canonical durable rule  → keep / move to LEARNED
                      B. Historical evidence     → PHASEREPORT or archive
                      C. Procedure / workflow    → SKILL.md or workflow doc
                      D. Temp working context    → quarantine 7 days, then trim
                    No section may be deleted without a recorded
                    classification verdict.
3. EXTRACT        → Before any trim, route A/B/C content to its proper
                    destination. Rule of thumb: do NOT delete a section
                    that has no other home — extract first, trim second.
4. APPLY TRIM     → Patch the source file. Ledger entry already written
                    by step 1.
5. STEP-5 VERIFY  → DeepSeek (default) / Claude (safety-sensitive) verdict:
                    does any sub-agent still consume the removed text? If
                    yes → restore from snapshot SHA + re-classify.
6. REPORT         → Single 7-rule report — what I did → what is now true →
                    evidence (snap SHA + classification table + Step-5
                    verdict) → Marcelo-only decisions (ideally empty).
```

**What "important MD" means here (scope):**

- ✅ `~/.hermes/knowledge/LEARNED_*.md` (including new LEARNED_7_LAYER_ARCHITECTURE.md, LEARNED_MD_FILE_DRIFT_RUBRIC.md, AUTOMATION_INVENTORY.md, etc.)
- ✅ `~/.hermes/SOUL.md`, `~/.hermes/AGENTS.md`, `~/.hermes/OPERATINGBLUEPRINT.md`, `~/.hermes/PHASEREPORT.md`
- ✅ `~/.hermes/knowledge/SOUL.md` (the cross-ref mirror)
- ✅ `~/.hermes/profiles/<lane>/SOUL.md`, `MEMORY.md`, `AGENTS.md`
- ✅ Audit docs (`*_AUDIT_*.md`, `*_COMPLIANCE_*.md`, `phase-reports/*.md`)
- ✅ `~/.hermes/knowledge/V3_STACK_COMPLIANCE_AUDIT_*.md`
- ✅ `~/.hermes/knowledge/ROUTING-RULES.md`, `LEARNED_INDEX.md`, `LEARNED_7_RULE_CONTRACT.md`

**What does NOT require Rule #9 (trivial, Rule #4 still applies):**

- ❌ Adding new content (Rule #9 is about REMOVAL — additions are governed by Rule #6 reporting + Rule #8 if they touch code/config)
- ❌ Trimming within 7 days of authoring the section (Rule #9 §6 quarantine window)
- ❌ Editing draft / scratch MDs outside `~/.hermes/` (transient)

**The "extract before trim" clause (Permanent):**

The point of Rule #9 is that trimming is the LAST step, not the FIRST. Before any section is deleted:

1. It must be classified against the rubric.
2. If classified A/B/C, it must be **extracted** to its correct destination.
3. Only class D (temp working context) may be trimmed without extraction — and only after the 7-day quarantine.

This prevents the canonical failure: deleting a section because it "looks redundant" when it was actually the only preserved copy of a retired workflow.

**Companion artifacts:**

- **`~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md`** — the 4-category classification rubric that Rule #9 invokes.
- **`~/.hermes/skills/md-file-snapshot-before-trim/SKILL.md`** — executable form of Rule #9.
- **`~/.hermes/scripts/git-snapshot-md-file.sh`** — the snap helper, exit codes 0/1/2/3/4.
- **`~/.hermes/logs/md-trim-snapshots.log`** — the ledger (TSV: timestamp / SHA / file path / reason-slug).
- **`~/.hermes/knowledge/AUTOMATION_INVENTORY.md`** — pointer entry for the script (no new cron jobs).

**What Marcelo is NOT (extended — codifies negative behavior for Rule #9):**

- ❌ "Compare to last week's version" — `git diff <md_pre_trim_sha> HEAD` already does this
- ❌ "Restore the paragraph manually from memory" — `git show <md_pre_trim_sha>:<path>` restores it
- ❌ "Decide if the section is still relevant" — the rubric decides, not Marcelo
- ❌ "Hold the trim for human review" — only when classification fails or verdict is "needs human" (rare carve-out)

**Drift signals for Rule #9:**

- Sub-agent trimmed a canon MD without running `git-snapshot-md-file.sh` first
- `md_pre_trim_sha` field missing from the kanban card on a trim operation
- A section was deleted without a classification verdict recorded in the card
- A "looks redundant" section was deleted without checking if it's the only preserved copy of a retired workflow
- Trim happened within 7 days of authoring the section (quarantine violation)
- Step-5 verdict says FAIL but no restore-from-snapshot ran
- Audit/mirror files report a different file shape than the canon source (mirror went stale)
- An old PHASEREPORT block was lost without being added to `~/.hermes/archive/knowledge-history/`

---

## Who owns the contract

- **BossMan** owns this contract. BossMan enforces it on itself and on all sub-agents.
- **Sub-agents** follow it as workers under BossMan. They never pull Marcelo into the loop; they escalate via BossMan.
> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

### Default 7-step flow (Permanent 2026-07-20)

For every real work request from Marcelo, BossMan runs:
1. Kanban card → 2. Classify task → 3. Pick model from V3 stack → 4. Pick sub-agent lane → 5. Execute (with Perplexity when stuck) → 6. Step-5 verify → 7. 7-rule report.

**Marcelo does NOT pick models, choose sub-agents, or say "go ask Perplexity" — that's all in canon.**

---

## Drift signals

If a `t_*` Kanban card comment contains any of these, the agent stack has drifted:
- "Ask Marcelo what this means"
- "Marcelo should run X"
- "Need input from Marcelo" (without a V3 carve-out)
- "Pass to Marcelo for review" (without completion evidence)
- Multi-page narrative for a one-shot question

`drift-fix` cards auto-remediate these.

---

*This is the contract. Every BossMan response and every sub-agent handoff checks against these 7 rules.*
