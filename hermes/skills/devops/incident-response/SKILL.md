---
name: incident-response
description: "BossMan Incident Response methodology — structured 8-step workflow for kanban cards flagged as incidents, bugs, or system health issues. Anchors the v3.0 6-step routing map (Perplexity Search → MiniMax-M3 → primary builder → Qwen/Ollama → DeepSeek QA → Claude docs) into incident response, with hard carve-outs (SquarePayouts BLOCKED on M3, money/trading cards require mandatory Step 5 QA, ALERT format for escalation). Use when a kanban card has status=incident or status=blocked (incident-flavored), label=troubleshooting, or the user types /troubleshoot, incident, outage, broken, down, not working, or system health. For PM2 auto-repair use pm2-health-check; for read-only drift forensics use service-drift-root-cause; for code-level debugging use debug."
triggers:
  - kanban card status incident
  - kanban card status blocked AND body has incident|outage|broken|down|not working|error
  - kanban card label troubleshooting
  - user types /troubleshoot
  - user types incident, outage, broken, down, "not working", "system health"
invocable: true
metadata:
  hermes:
    tags: [incident, troubleshooting, routing, escalation, alert, qa]
    related_skills: [ai-model-routing, debug, pm2-health-check, service-drift-root-cause, infrastructure-resolve]
---

# BossMan Incident Response

## Purpose

A structured methodology for responding to incident, bug, and system-health kanban cards. The 8-step workflow below is a strict mirror of the v3.0 6-step routing map (Perplexity Search → MiniMax-M3 → primary builder → Qwen/Ollama → DeepSeek QA → Claude docs) with the carve-outs the v3.0 spec already requires (SquarePayouts BLOCKED on M3, money/trading cards mandatory Step 5 QA, ALERT format for escalation).

**Use this skill for any kanban card flagged as incident/bug/troubleshooting. It is NOT a substitute for normal card work or for the default build flow.** The v3.0 build flow is for greenfield and feature cards; this skill is for incident response.

## Scope & STOPs (Permanent — 2026-06-23)

**Purpose:** Make explicit what incident-response may auto-execute vs what must escalate to operator. Tied to v3 Routing Ledger + Step-5 QA rule.

### Autonomous scope (incident-response may auto-execute without operator approval)

- **Triage & classify** the incident (Step 0) — type, severity, blast radius
- **Gather facts** (Step 1) — Perplexity search, logs, error reports
- **Form hypotheses** (Step 2) — list 2–4 candidate root causes with evidence
- **Run read-only diagnostics** (Step 3) — health checks, port scans, log inspection, DB queries
- **Propose a fix path** (Step 4) — without executing it; surface to operator unless explicitly in pm2-health-check auto-repair whitelist
- **Step-5 QA dispatch** (Step 5) — DeepSeek or best available reasoning model
- **Document** (Step 7) — PHASEREPORT entry + recovery notes

### Approval gates (operator approval REQUIRED)

- **Destructive fixes** — deleting data, dropping tables, killing processes, rolling back migrations
- **Security-relevant changes** — auth rotation, token revocation, encryption key rotation
- **Vendor lock-in or billing changes** triggered by incident response
- **Production cutover or rollback decisions**
- **New crons or recurring automations** proposed as remediation

### STOP conditions (MUST halt and escalate)

- **Money/trading incidents** without Step-5 PASS + explicit operator approval before any fix
- **Auth breach without escalation path** — STOP, alert operator immediately, do not attempt fix
- **Env file / secrets.json edits** — never auto-fix during incident
- **SOUL.md / AGENTS.md / ROUTING-RULES.md / MODELROUTINGWORKFLOW.md edits** — kernel-doc; never in incident response scope
- **Production data deletion** without backup verification
- **Incident span > 1 service with cross-system effects** — STOP and surface (single-service fix is in scope; multi-service incident needs operator)
- **AI model disagreement on root cause** — STOP and surface disagreement (don't pick a side)
- **Insufficient facts to form 2 hypotheses** — STOP and request more data from operator or extend triage

### Routing Ledger (what a card invoking incident-response looks like)

| Field | Value |
|---|---|
| work_type | troubleshooting |
| lead_model | MiniMax (orchestrator) → claude/deepseek (reasoning) |
| cost_tier | high (incident response, time-sensitive, may escalate) |
| qa_required | yes (mandatory Step-5; non-negotiable for money/trading incidents) |

### Step-5 QA rule (Permanent)

Step-5 verifier (DeepSeek or best available reasoning model) is MANDATORY for every incident-response card that proposes a fix touching infra, money, auth, env files, or kernel docs. ALERT format escalation when Step-5 disagrees with proposed fix.

### Canonical references

- AGENTS.md (M3 routing) — `~/.hermes/AGENTS.md`
- ROUTING-RULES v3 — `~/Projects/BossMan/docs/ROUTING-RULES.md`
- MODELROUTINGWORKFLOW v3 — see `~/.hermes/AGENTS.md` (embedded) or `~/Projects/BossMan/docs/ROUTING-RULES.md` (canonical)
- PHASEREPORT — `~/Projects/BossMan/PHASEREPORT.md`
- ACP (governance parent) — `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
- Related: `pm2-health-check`, `service-drift-root-cause`, `infrastructure-resolve`
- Phase 2 hardening entry — `~/.hermes/knowledge/PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md` (forthcoming)

## 0. Is this really an incident?

Before running the protocol, classify the card. **Type** must be one of:
`service health` · `cron` · `AI routing` · `trading` · `port` · `log noise` · `other`.

If the card is not about system behavior, **do not run Incident Response.** Treat it as normal work and exit this skill.

## 1. Step 1 — Gather facts (Perplexity + local tools)

Goal: build a fact-only picture. No guesses, no hypotheses yet. 3–6 bullets max.

**Routing for Step 1:**
- **Primary:** Perplexity Search (`web_research` tool, when wired) for external docs, API changes, known issues, vendor status pages.
- **Fallback (current reality — `web_research` is paper-only until the follow-up card lands):** `browser_navigate` + `read_file` for vendor docs; `terminal` for PM2/cron/port/log inspection; `hermes insights` for usage stats; `ddgs` Python package as a free search backend per the existing ai-model-routing "Perplexity Search Setup Verification" recipe.

**Always check for system-health incidents:**
- `pm2 list` — all processes online, restart counts, unstable restarts.
- `curl -sI http://localhost:<PORT>/` — every port in the routing table.
- `hermes cron list` — last-run status of any cron involved.
- `pm2 logs <service> --err --lines 50` and `pm2 logs --err --lines 50` for cross-service noise.
- `~/.hermes/state.db` queries for tool/skill usage if AI-routing incident.
- Service-specific logs (boss-hub, binance-bot, money-pipeline, etc.).

**Output of Step 1:** 3–6 bullets of facts only. No interpretation. **Cite the file:line or command for every fact** — drift forensics requires evidence-first, just like `service-drift-root-cause`.

## 2. Step 2 — Design / decompose (MiniMax-M3)

Goal: form a hypothesis tree and break the incident into sub-problems only when decomposition helps.

**Routing for Step 2:**
- **Primary:** MiniMax-M3 (Step 2 design brain per v3.0).
- **Fallback:** Claude Sonnet-4 if M3 is unavailable.
- **HARD CARVE-OUT:** If the incident touches **SquarePayouts** (project: SquarePayouts), do NOT use M3. Auto-substitute Claude Sonnet-4. M3 is permanently BLOCKED on SquarePayouts.
- **Other carve-outs:** any project tagged `trading` or `money` (binance-bot, money-pipeline, csdawg-dashboard). M3 may be used for design here, but Step 5 QA is mandatory (see §5).

**Output of Step 2:** A short root-cause hypothesis in plain language, plus a list of sub-problems if decomposition is needed. Cite the Step 1 evidence that supports each hypothesis.

## 3. Step 3 — Propose fixes (Claude / DeepSeek)

Goal: concrete, minimal-change fixes. Prefer reversible, scoped, safe.

**Routing for Step 3:**
- **Primary:** Claude Sonnet-4 (production-quality, polish, careful config diffs).
- **Heavy-backend carve-out:** if the fix is heavy backend logic or complex code, DeepSeek v4-flash may be the primary builder; Claude reviews.
- **SquarePayouts:** use Claude / DeepSeek / OpenAI only. M3 forbidden.

**Fix-proposal rules:**
- Minimal change first. Avoid big refactors in incident mode.
- Always include exact commands / file diffs.
- Label anything risky: "HIGH RISK — touches money-pipeline", "REVERSIBLE", "REQUIRES REBOOT".
- For each fix, list one quick verification step.

**Output of Step 3:** Ordered list of fixes, each with: action, file/command, risk label, verification.

## 4. Step 4 — Cleanup / local grunt (Qwen via Ollama)

Goal: free up the primary brain by offloading repetitive, local tasks.

**Routing for Step 4:**
- **qwen2.5:14b (Step 4 primary):** bulk log cleanup, repetitive snippet refactor, batch test-case generation, multi-file rewrites of similar code.
- **qwen2.5:3b (ultra-fast helper):** "is this log line an error or warning?", "extract the id from this JSON", "classify this PM2 status string".
- **Concurrency rule:** never run 14B heavy work concurrently with 3B heavy work. If 14B is `running` (Ollama lock), 3B tasks either wait or fall back to a tiny Python helper.
- Qwen is a **helper**, never the primary incident designer. M3 / Claude still own the diagnosis and the fix.

**Output of Step 4:** N/A unless Step 3 produced bulk-cleanup work. If used, cite the Qwen model + prompt.

## 5. Step 5 — QA / red-team (DeepSeek, MANDATORY for money/trading)

Goal: stress-test the proposed fix. Find what could go wrong before applying it.

**Routing for Step 5:**
- **Primary:** DeepSeek v4-flash (red-team mindset per v3.0).
- **Fallback:** Claude Sonnet-4 if DeepSeek is unavailable. If Claude is the fallback, **explicitly note "DeepSeek was skipped"** in the output.

**Mandatory for:**
- Any fix touching money/financial flows: money-pipeline, binance-bot, csdawg-dashboard, trading-control.
- Any fix that modifies PM2 config, cron jobs, env vars, or API keys.
- Any fix that affects more than one service.

**Recommended for:**
- Any fix touching boss-hub (the registry is shared by all services).
- Any fix that involves force-push, history rewrite, or force-restart.

**DeepSeek's red-team questions:**
- "What could this break in money-pipeline, trading, or cron jobs?"
- "Is there a partial-failure mode (e.g., service starts but health check fails)?"
- "What happens during failover? Does the fallback chain still work?"
- "Does this introduce a race condition or a state inconsistency?"
- "Is the rollback path clear and tested?"

**Output of Step 5:** Pass / Fail / Conditional. If Fail, go back to Step 3 with the new constraints. If Conditional, list the conditions under which the fix is safe.

## 6. Step 6 — Final docs / runbook (Claude)

Goal: write the answer so future-you can read it 6 months from now and know exactly what happened, why, and how to reproduce.

**Routing for Step 6:** Claude Sonnet-4 (long-form, polished writing).

**Required sections in the runbook** (matches the answer template in §8):
1. **Incident Summary** — 2–3 sentences: what's broken, where, impact.
2. **Type** — one of the 8 type codes from §0.
3. **Facts Collected (Step 1)** — bullets only, no guesses. File:line or command per fact.
4. **Root Cause (Step 2–3)** — short, plain language.
5. **Fix Plan (Step 3–4)** — ordered list of actions (commands / diffs).
6. **QA / Risk Review (Step 5)** — what DeepSeek / Claude thinks could go wrong.
7. **Runbook Notes** — 3–5 bullets for future reference: similar symptoms, files touched, lessons.
8. **Escalation** — ALERT block, or "No escalation needed."

**Style rules:**
- Tight, operational, no filler.
- Use code blocks for commands and diffs.
- Use bullet lists, not paragraphs.
- **Telegram-readable** (Markdown is auto-rendered by the Hermes gateway).

## 7. Escalation rules

Page Marcelo **immediately** if any of these are true (ALERT format below):

| # | Trigger | Why |
|---|---|---|
| 1 | Binance bot is `online` when it should be `STOPPED` | Trading bot must be off until Phase 6 is approved. |
| 2 | Money-pipeline has ≥ 10 restarts OR is unresponsive | Money flows are the highest-stakes surface. |
| 3 | Telegram gateway disconnected | No user notifications get through. |
| 4 | Tailscale VPN disconnected | BossMan loses access to BossLady/Cello Mac minis and Tailscale-routed services. |
| 5 | Any critical service completely unresponsive (not just slow) | `pm2 status` says `errored` / `stopped`; no HTTP response on the canonical port. |

**ALERT format (use this exact template):**

```
ALERT <Service/Job Name>
Status: <current>
Expected: <should be>
Restart count: <N>
Last good timestamp: <ISO>
Actions tried: <short bullet list>
Needs your decision on: <specific question, one line>
```

If the issue is **not** in the escalation table but is high-stakes (e.g., a fix that requires touching live trading config), still surface it for approval, but format as "Proposed action — needs A/B/C" rather than a hard ALERT.

## 8. Answer template

Use this exact structure for the final reply. Every incident reply must include all 7 sections (use "No escalation needed" if §7 doesn't fire).

```
### Incident Summary
<2–3 sentences: what's broken, where, impact.>

### Type
<service health | cron | AI routing | trading | port | log noise | other>

### Facts Collected (Step 1)
- <bullet 1, with file:line or command>
- <bullet 2, with file:line or command>
- <bullet 3, with file:line or command>

### Root Cause Hypothesis (Step 2–3)
<short, plain language, citing the Step 1 evidence>

### Fix Plan (Step 3–4)
1. <action> — <risk label> — <verification>
2. <action> — <risk label> — <verification>
3. <action> — <risk label> — <verification>

### QA / Risk Review (Step 5)
<DeepSeek (or Claude-as-fallback) review. PASS / FAIL / CONDITIONAL + conditions.>

### Runbook Notes (Step 6)
- <bullet for future reference>

### Escalation
<ALERT block, or "No escalation needed.">
```

## Companion skills (load in addition, not instead)

- **`debug`** — runtime incidents where a service is observably broken; this skill is the methodology wrapper around the actions `debug` would take.
- **`pm2-health-check`** — auto-repair for PM2 drift. After this skill identifies the fix, hand off to `pm2-health-check` for the actual repair sequence (Layer 1.5 pre-start, stop→rm .next→build→start, etc.).
- **`service-drift-root-cause`** — read-only forensic audit of silent drift. If the incident is "services keep silently stopping," prefer `service-drift-root-cause` (it has the cross-domain evidence pack and 5-layer worker lockdown).
- **`infrastructure-resolve`** — DNS / tunnel / network troubleshooting.
- **`ai-model-routing`** — the canonical v3.0 routing map that this skill's 8 steps mirror. **Load `ai-model-routing` first to confirm the routing table hasn't changed since the last update.**

## Known gaps in this protocol (flag until fixed)

These are real, not theoretical. Until the follow-up cards land, the protocol must work around them:

- **Perplexity Search not wired** — Step 1 falls back to `browser_navigate` + `read_file` + `ddgs` Python. External research is slower; vendor status pages may be missed.
- **DeepSeek v4-flash dormant** — Step 5 has 1 call/30d. Until Step 5 routing is wired, expect Claude to be the de facto QA model. Always note "DeepSeek was skipped" when Claude is used as fallback.
- **LBC-35 profile not yet created** — does not affect Incident Response (LBC-35 is for delegated project work, not incident response).
- **`web_research` tool not registered** — see Perplexity Search gap above.
- **`health.warnings.forbidden_global_default` block not yet added to `~/.hermes/config.yaml`** — relies on operator discipline until the routing lock is fully applied.

## Pitfalls

- **Don't skip Step 1 evidence collection.** Even if the cause "feels obvious" (e.g., "the YAML is invalid"), cite the file:line and the log line that proves it. Drift forensics requires evidence-first.
- **Don't auto-fix without an explicit risk label.** Every fix in Step 3 must be labeled `REVERSIBLE` / `HIGH RISK — money` / `NEEDS APPROVAL` etc. — even the obvious ones.
- **Don't skip Step 5 on money/trading incidents.** Mandatory. If DeepSeek is unavailable, use Claude but say so explicitly.
- **Don't recommend large refactors in incident mode.** The fix should be minimal-change. Bigger improvements go in a follow-up card.
- **Don't apply the fix without verifying the rollout path.** Every fix in Step 3 must include a verification step (PM2 restart, log tail, port probe, etc.).
- **Don't write a runbook that says "I think" or "maybe."** Either cite evidence or omit. The runbook is for future-you reading 6 months from now — it must stand on facts.
- **Don't mix incident response with feature work.** If the card is also requesting a feature improvement, split: fix the incident on the incident card, file a feature card for the improvement.
- **Don't use M3 on SquarePayouts incidents.** Carve-out is hard, not soft. Auto-substitute Claude.

## Drift detection (companion to `BOSSMAN_DRIFT_CHECK.md`)

The bi-weekly drift check (see `scripts/bossman_drift_check.sh`) is the proactive companion to this reactive skill. **Run `BOSSMAN_DRIFT_CHECK.md` every 14 days** so that incident-response is needed less often. When this skill fires, the drift check should also run as a follow-up to find the structural cause of the incident.

## Routing map reference

`references/v3-routing-incident-flow.md` — exact mapping between the v3.0 6-step routing map (Perplexity → M3 → builder → Qwen → DeepSeek QA → Claude docs) and the 8 incident-response steps. Includes the hard carve-outs (SquarePayouts BLOCKED on M3, money/trading mandatory Step 5 QA), known gaps (Perplexity Search paper-only, DeepSeek dormant), and the "when to reload `ai-model-routing`" trigger list. **Read this first** when the routing table or carve-outs have changed.
