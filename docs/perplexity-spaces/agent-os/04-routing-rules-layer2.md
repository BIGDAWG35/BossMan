# ROUTING-RULES.md — Hermes Routing Authority (V3 + Layer-2 closed-loop autonomy)

> **CANONICAL SOURCE OF TRUTH** for Hermes routing.
> All mirrors (Obsidian `Hermes/V3-Canon/V3 – Model Stack and Routing.md`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/ROUTING-RULES.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked:** 2026-07-22 (Layer-2 closed-loop autonomy formalization)
**Source directive:** Marcelo — formalize the missing closed-loop autonomy layer; non-breaking canon update
**Status:** CANON — overrides any prior routing description in SOUL/AGENTS/OPERATINGBLUEPRINT where the topic overlaps

This is the **single canonical reference** for routing in Hermes. BossMan, every sub-agent, LBC35/OpenClaw, and every cron-driven workflow must read this before acting. V3 model roles + Perplexity Computer approval rules are unchanged; the new Layer-2 loop-enforcement sits on top of them.

---

## 1. Authority & ownership

| Layer | Owner | Does |
|---|---|---|
| Routing authority | **BossMan / Hermes** | ONLY orchestration authority. Routes work. Picks sub-agent lane. Picks model from V3 stack. |
| Delegator / router | **LBC35 / OpenClaw** | Designs plans, routes work — does NOT implement, test, or touch production secrets. |
| Lane owners | **builder, ops, trading, content, travel, qa-verification, research-intel, knowledge-canon, self-improvement, loop-engineering** | Execute tasks assigned by BossMan. Stay in their lane. Follow the 7-rule contract. Never pull Marcelo into the loop directly. |
| External intelligence | **Perplexity Search + Perplexity Computer** | Live web research, current facts, citations, multi-step browser workflows. Routed via `escalate_to_computer: yes` for Computer (10k credits/mo budget). |
| Single status surface | **BossMan only** | All operational updates, research summaries, opportunity alerts flow through BossMan to Marcelo. No other agent, cron, or LaunchAgent messages Marcelo directly. |

**Rule:** if anyone in the stack is about to ping Marcelo directly, route through BossMan first. If BossMan is the one pinging Marcelo, it must be a true V3 carve-out OR a verified final product ready for review.

---

## 2. V3 model roles (UNCHANGED — preserved verbatim)

| Model | When to use (canonical) |
|---|---|
| **Claude** (Anthropic, default + deep) | Deep architectural reasoning, complex cross-system troubleshooting, safety-sensitive work (auth / encryption / audit logging / PII), Step-5 QA on non-trivial changes touching money paths. **Mandatory for live-trade enablement and auth flows.** |
| **OpenAI** (GPT) | General reasoning, UI/marketing copy, polished prose, multi-modal tasks, Next.js/React/TypeScript code generation. |
| **DeepSeek** | Low-cost deep reasoning, technical validation, edge-case analysis, coding assistance, math/SQL, second opinion on architecture. **Mandatory for money paths and PII as secondary.** |
| **MiniMax-M3** | Default orchestrator + planner + router. Cheap bulk orchestration. **BLOCKED for SquarePayouts code.** |
| **Llama / local (Ollama)** | Privacy-sensitive tasks, repeatable bulk work, summaries, first-pass code. Native Metal GPU acceleration on M4 Max. |

Detailed policy lives in `LEARNED_V3_MODEL_STACK.md`. This doc references it.

---

## 3. Perplexity usage rules (UNCHANGED — preserved verbatim)

| Tier | Tool | When | Cost discipline |
|---|---|---|---|
| Tier 1 — Cache & Reuse | `session_search`, `~/.hermes/knowledge/`, Obsidian, GitHub | Always check first. Reuse existing artifacts before any new model call. | Zero |
| Tier 2 — Local | Ollama + Llama | Summaries, drafts, extraction, cleanup, formatting, first-pass code | Zero |
| Tier 3 — General cloud | MiniMax-M3 | Orchestration, routing, routine ops | MiniMax budget |
| Tier 4 — Specialist cloud | DeepSeek / OpenAI / Claude | When Tier 2/3 won't do (specialty work) | Pay-per-call |
| Tier 5 — Perplexity Computer | Computer Use / MCP | Multi-step browser workflows that genuinely justify credits. Requires `escalate_to_computer: yes` flag + 10k credits/mo budget. | Credits — track per use in kanban |

**Perplexity-first rule (permanent 2026-06-26):** "BossMan is stuck" means "BossMan needs Perplexity / search tools" — NOT "BossMan needs Marcelo." Apply to **every** agent in the stack.

---

## 4. The Layer-2 closed-loop autonomy rule (NEW — Permanent 2026-07-22)

This rule is **additive**. It does not change V3 model roles, Perplexity Computer approval, or LBC35's delegator-only role. It formalizes the closed-loop pattern that V3 already implies, so future agents don't drift back to "ask Marcelo to interpret" or "ask Marcelo to relay."

### 4.1 The enforced 7-stage loop

Every non-trivial request from Marcelo (or auto-triggered by the stack) MUST run through these stages. BossMan enforces them; sub-agents inherit them; no stage may be skipped unless the work is genuinely trivial (a direct question or a one-line patch).

```
1. INTAKE          → BossMan creates/updates a Kanban card. Captures: project tag, scope, deliverable, Marcelo-only decisions (none, ideally).
2. RESEARCH        → BossMan (or the assigned sub-agent) checks blueprint + LEARNED_* docs + Obsidian + kanban comments. If still uncertain, calls Perplexity via Brave / Computer Use. NEVER asks Marcelo to interpret external facts.
3. DESIGN / PLAN   → BossMan picks sub-agent lane from the V3 stack, picks model from LEARNED_V3_MODEL_STACK, produces a plan with: scope, schema/UI/API surface, phase breakdown, acceptance criteria, QA gates.
4. EXECUTE / BUILD → Sub-agent implements. BossMan tracks the run via the kanban dispatcher. Sub-agents do not autonomously message Marcelo.
5. STEP-5 VERIFY   → DeepSeek (default) or Claude (safety-sensitive) runs the Step-5 verifier on the implementation. Verdict file attached to the kanban card. FAIL → loop back to stage 4. PASS → continue.
6. KNOWLEDGE CAPTURE → Anything reusable (library quirk, vendor behavior, recurring fix pattern, Marcelo preference) gets saved to `~/.hermes/knowledge/LEARNED_*.md`, Obsidian, and the matching Perplexity Space. NOT left in chat-only reasoning.
7. FINAL DELIVERY  → Single 7-rule-format report to Marcelo. What I did → What is now true → Evidence → Marcelo-only decisions (ideally empty). No raw sub-agent output. No relay. No "should I verify this?" questions.
```

### 4.2 What Marcelo is NOT

Codified as a permanent negative rule — agents must never put Marcelo in any of these roles:

- ❌ **Relay** between BossMan and Perplexity / sub-agents / tools
- ❌ **Log interpreter** — stack reads logs, decides, acts
- ❌ **Glue** between BossMan and sub-agents (handoffs are stack-internal)
- ❌ **Step-by-step command operator** — BossMan writes + runs commands
- ❌ **Browser QA tester** — browser QA + Step-5 QA are agent-owned
- ❌ **Knowledge carrier** — durable lessons go to `~/.hermes/knowledge/`, not chat
- ❌ **Model picker** — model selection is automatic from `LEARNED_V3_MODEL_STACK.md`
- ❌ **Sub-agent picker** — lane selection is automatic from V3 sub-agent roster
- ❌ **"Go ask Perplexity" prompter** — Perplexity-first is automatic

### 4.3 The 8 implementation details that make the loop automatic

Every agent in the stack must encode these as automatic behavior (not options):

1. **Final outputs only.** Marcelo sees finished, verified products. No raw sub-agent output. No intermediate state.
2. **Perplexity-first for unknowns.** External, factual, technical, vendor, library, API, DB, framework, scientific unknowns → Perplexity via Brave / Computer Use. Never Marcelo.
3. **Real verification before DONE.** Step-5 PASS verdict + P5 self-verify checklist (`localhost + Tailscale + DB + PM2 + touch surfaces`) must be attached to the kanban card before status flips to `done`.
4. **Knowledge capture is mandatory.** Reusable insights go to `~/.hermes/knowledge/LEARNED_<DOMAIN>.md` (or a dedicated skill) on the same session they're discovered. Skills for procedures; memory for facts; not chat-only.
5. **Single-verdict reports.** PASS / PASS-WITH-FIX / CHANGE-RECOMMENDED / BLOCKED-ON-MARCELO. No A/B/C choice prompts unless policy explicitly forces one.
6. **Report order is canonical:** what I did → what is now true → evidence → Marcelo-only decisions.
7. **Escalation only for true business/source-of-truth decisions.** Vendor/billing, security, real product-direction, infra-port/HTTPS changes, bot-orchestration changes. Everything else: agent stack.
8. **Loop is enforced by kanban dispatcher.** Every non-trivial change runs on a parent card with `qa_required: yes`, `verify_against`, `accept_when`. Drift symptoms (`ask Marcelo to interpret`, `ask Marcelo what this means`) trigger `drift-fix` cards.

### 4.4 Sub-agent lane discipline (lock-in)

Sub-agents **must** stay in their assigned lane and report back via BossMan. They must NOT:

- Skip Step-5 verification because "it's small"
- Push findings directly to Marcelo (use the kanban card)
- Recreate or replace any layer of the loop (research, plan, build, verify, capture, deliver)
- Treat LBC35/OpenClaw as a worker (it's a delegator/router)
- Send Telegram messages outside the BossMan routing layer

If a sub-agent discovers a gap in the loop (missing skill, missing tool, missing playbook entry), it opens a `drift-fix: <gap>` kanban card. BossMan addresses the gap. The work continues.

### 4.5 Drift signals (extend the weekly drift-scan pattern set)

The weekly drift-scan cron extends its pattern set to include the new Layer-2 violations:

- `t_*` card `summary`/`comments` contains "ask Marcelo to interpret", "ask Marcelo what this means", "ask Big Dawg to relay", "ask Perplexity first" (as an open question rather than an action already taken)
- Sub-agent `output` text contains "need to ask Marcelo", "Marcelo should know", "what does this log mean" (when the answer is in Perplexity + tools)
- Kanban card moves to `done` without a Step-5 verifier verdict file attached
- A `drift-fix: <gap>` card is needed when Perplexity is unreachable, the agent doesn't know which Space/thread to read, or the blueprint is missing a runbook entry

`drift-fix` cards are auto-created by the drift-scan; the weekly cron logs to `~/.hermes/logs/drift-scan.log`.

---

## 5. V3 carve-outs (UNCHANGED)

These remain the ONLY legitimate reasons to interrupt Marcelo mid-execution:

- **Security change** — auth flow, data retention, encryption, customer-visible terms, permissions, token issuance, audit logging
- **Major infra change** — new PM2 process, new port, new external service, new cron, new LaunchAgent, public-internet exposure, hostname or Tailscale change
- **Bot / orchestration change** — new sub-agent role, dispatcher behavior change, escalation matrix change
- **Vendor / billing decision** — paid plan upgrade, new SaaS, contract change
- **Product-direction decision** — pricing, target market, scope pivot, customer-facing positioning
- **Final product review** — when the system is fully built, QA'd, and ready to ship
- **Final incident postmortem sign-off** — at Marcelo's discretion, ONLY after the agent has already written the postmortem

Everything else is agent-owned.

---

## 6. Loop-enforcement verification

A monthly loop-enforcement review (the "closed-loop audit") runs to confirm:

- BossMan owns every status surface that touches Marcelo
- Sub-agent lanes don't leak into each other
- The 7-stage loop runs end-to-end on every non-trivial kanban card (sample 10 random cards per month)
- Knowledge capture rate: % of new insights that landed in `~/.hermes/knowledge/` vs chat
- Drift-fix cards: time-to-resolution stays under 1 session

Review output lands in `~/.hermes/logs/loop-enforcement-review-YYYY-MM.md` and is mirrored to `50_Phase-Reports/` in Obsidian.

**Build-metrics integration (Permanent 2026-07-22, Card B):** The closed-loop health data above is also surfaced as a per-month "Loop Health" section in `~/.hermes/knowledge/BUILDMETRICSYYYY-MM.md`, derived by parsing the `routing_ledger` block in kanban card bodies. Four additive keys (`loop_complete`, `missing_stages`, `perplexity_first`, `knowledge_capture`) are documented in PHASEREPORT and parsed by `~/.hermes/scripts/build-metrics-monthly.sh`. Existing cards without these keys remain valid (parsers report "unknown", not failure).

---

## 7. Companion docs

- `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md` — who does what
- `~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md` — which model for which task
- `~/.hermes/knowledge/LEARNED_V3_TOKEN_ECONOMICS.md` — reuse, don't re-pay
- `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md` — the 7-rule contract that this doc extends
- `~/.hermes/knowledge/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` — per-lane discipline + handoff contracts
- `~/.hermes/knowledge/PHASEREPORT.md` — aggregated phase-report log for canon-level changes

---

*This is the routing rule. Every BossMan decision and every sub-agent handoff checks against it.*