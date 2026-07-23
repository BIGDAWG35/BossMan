# Perplexity-First Rule — Knowledge Mirror

**Status:** Permanent (in force 2026-06-26). Amendment to Governance V3.
**Origin:** Marcelo's directive, 2026-06-26 (same day as V3 launch + troubleshooting extension).
**Canon source:** `~/.hermes/SOUL.md` § "Perplexity-First Rule (2026-06-26, permanently in force — amended same day)"
**Mirrors:** `~/.hermes/AGENTS.md` § "Perplexity-First Rule", `~/.hermes/OPERATINGBLUEPRINT.md` § "Perplexity-First Rule"

---

## Single sentence

> **"BossMan is stuck" means "BossMan needs Perplexity / search tools" — NOT "BossMan needs Marcelo."**

---

## Why this amendment

Governance V3 (2026-06-26) already named Perplexity as the default external reasoning tool. The 2026-06-26 amendment makes that **mandatory**, not preferred, and re-defines the meaning of "stuck" so the agent stack never defaults to pinging Marcelo for factual/technical/external knowledge.

This complements — does NOT replace — the v3 carve-outs. Security, major infra, bot-orchestration, vendor/billing, and product-direction decisions remain Marcelo's call. Factual/technical/external knowledge lookups are the agent stack's job.

---

## Mandatory resolution order (non-negotiable)

When BossMan or any sub-agent (builder, ops, trading, content, qa-verification, research-intel) is **stuck or uncertain** on a factual, technical, scientific, vendor, library, API, DB, framework, or external-knowledge unknown:

1. **Check the project blueprint + internal docs first.**
   - `blueprint.md` (project root + `~/.hermes/knowledge/`)
   - `~/.hermes/knowledge/LEARNED_<DOMAIN>.md`
   - `MEMORY.md` and `USER.md`
   - Per-project runbook (often pinned on the kanban card `body`)
   - Kanban card `body`/`comments` (the conversation trail on the card)
2. **Use Perplexity search (or any other configured search agent).**
   - Primary path: Brave browser → `https://perplexity.ai` (Browser QA)
   - Secondary path: Hermes Computer Use → Perplexity Mac app (when CuaDriver healthy)
   - Tertiary: Deep Research, Pro search, Spaces retrieval
   - Sub-agents and BossMan call Perplexity directly — **never** ask Marcelo to relay
3. **Apply the answer autonomously in the stack.**
   - Read source, write code/config, run migrations, restart PM2, fix UI, update docs
   - Log the decision on the kanban card (decision + Perplexity source link)

---

## When to escalate to Marcelo (only)

ALL of these must be true:

- It is a **true v3 carve-out**:
  - Security change (auth, data retention, encryption, customer-visible terms, permissions, token issuance, audit logging)
  - Major infra change (PM2 install/upgrade, new cron, new port, new external service, LaunchAgent, public-internet exposure, hostname or Tailscale change)
  - Bot/orchestration change (new sub-agent role, dispatcher behavior change, escalation matrix change)
  - Vendor/billing decision (paid API key, new SaaS, contract change, pricing model)
  - Product-direction decision (pricing, target market, scope pivot, customer-facing positioning)
  - Final product review (after Step-5 PASS + P5 PASS)
  - Final incident postmortem sign-off (at Marcelo's discretion, ONLY after the agent has already written the postmortem)
- **OR** the question **cannot be answered by blueprint + Perplexity + sub-agents + existing tools** after exhausting steps 1–3 above. Examples:
  - Credentials BossMan doesn't have (and the project has no `.env.example` or runbook for obtaining them)
  - Vendor rate-limit or block BossMan cannot work around
  - Physical hardware failure requiring Marcelo's hands (cable swap, monitor replacement, on-device biometric unlock)
  - Strategic product decision not covered by any blueprint

---

## Concrete patterns this rule replaces

| Old pattern (drift) | New pattern (correct) |
|---|---|
| "BossMan, what does this stack trace mean?" | BossMan + Perplexity reads the trace and applies the fix |
| "How do I configure X in framework Y?" | BossMan + Perplexity fetches canonical docs |
| "Is library Z compatible with version W?" | BossMan + Perplexity verifies against current release notes |
| "What's the right way to handle N in language M?" | BossMan + Perplexity decides from current docs |
| "Why is DB query Q slow?" | BossMan inspects the DB + Perplexity checks known engine behavior |
| "Should I check with Perplexity first?" | No, the answer is yes by default — don't ask, just do it |
| Sub-agent asking Marcelo to interpret/look up an external fact | Sub-agent uses Perplexity directly via its tools |

---

## Concrete patterns this rule preserves

- ✅ Escalating a v3 carve-out (security/infra/vendor/product/bot-orchestration) to Marcelo
- ✅ Surfacing final product ready for review (after Step-5 PASS + P5 PASS)
- ✅ Surfacing a final incident postmortem (when Marcelo has asked for one)
- ✅ Surfacing a genuine blocker that no combination of blueprint + Perplexity + sub-agents + tools can resolve

---

## Drift symptoms added by this rule

The weekly drift-scan cron extends its pattern set to flag:

- `t_*` card `summary` or `comments` contains "ask Marcelo what this means", "ask Big Dawg about X", "Marcelo should know Y", "what does Z mean" — when Z is an external/technical fact, not a governance decision
- Sub-agent `output` text contains "need to ask Marcelo" for anything that isn't a v3 carve-out
- Kanban comment references "ask Perplexity first" as an open question rather than an action that was taken
- A `drift-fix: <gap>` card is needed when:
  - Perplexity is unreachable (network or auth issue)
  - The agent doesn't know how to call Perplexity (missing tooling)
  - The agent doesn't know which Space/thread to read (missing context)
  - The blueprint is missing the runbook entry the agent needed (documentation gap)

---

## Enforcement

| Layer | Mechanism |
|---|---|
| **Inline** | Telegram intake gate (existing) + sub-agent system prompt already inherits V3 + Perplexity-first from SOUL.md |
| **Card-level** | Weekly drift-scan cron pattern set extended with the new symptoms above |
| **Remediation** | BossMan creates a `t_*` kanban card titled `drift-fix: <gap description>`, addresses the gap (add the missing playbook entry, Space pointer, runbook step), and does not continue the current project without fixing the stack. Drift is a stack bug, not a project bug. |
| **Audit** | Doc Hygiene Goal Loop (monthly) checks that SOUL/AGENTS/OPERATINGBLUEPRINT/this file remain synchronized and the new section is intact |

---

## Companion / non-conflicting rules

- **V3 carve-outs** (security, infra, vendor, product, bot-orchestration, final review, final postmortem) remain Marcelo's call.
- **Silent-execution amendment** (2026-06-26) remains in force — no intermediate narration, no progress pings, no checkpoint messages to Marcelo.
- **CONTINUATION RULE** (don't stop on iteration limits) remains in force — checkpoint → resume → continue.
- **Single Status Surface** (BossMan is the only authorized status origin) remains in force.

---

## Change log

- **2026-06-26** — Rule established by Marcelo's directive. Codified in SOUL.md § "Perplexity-First Rule", mirrored in AGENTS.md + OPERATINGBLUEPRINT.md, knowledge doc created here. Memory updated. Kanban card created (`project: Cross-Cutting`, `assignee: bossman`).
