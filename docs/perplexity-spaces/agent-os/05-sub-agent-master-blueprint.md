# LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md — Sub-Agent Lane Discipline + Handoff Contracts

> **CANONICAL SOURCE OF TRUTH** for sub-agent lane ownership and handoff contracts.
> All mirrors (Obsidian `Hermes/20_Agents/sub-agent-v3/`, GitHub `BIGDAWG35/BossMan` → `docs/hermes-canon/LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md`) are read-only views of this content.
> **Edit this file in `~/.hermes/knowledge/` only.**

**Date locked:** 2026-07-22 (Layer-2 closed-loop autonomy formalization)
**Source directive:** Marcelo — formalize sub-agent lane discipline under the new closed-loop autonomy layer
**Status:** CANON — overrides any prior sub-agent charter in `~/.openclaw/`, `LEARNED_DEFAULT_BUILD_FLOW.md`, or any per-agent SOUL file

This doc defines what each sub-agent lane **owns**, what each lane **must NOT do**, and how handoffs between lanes (and between lanes + BossMan + Perplexity) are formatted. It is the contract that the Layer-2 closed-loop autonomy rule relies on.

---

## 1. Lane roster (V3, locked 2026-07-20)

| Lane | Owner of | May NOT do | Default model |
|---|---|---|---|
| **builder** | Code implementation, schema migration, test scaffolding, dependency updates, refactors | Run live trades, approve scope pivots, modify PM2/cron/LaunchAgent, send Telegram to Marcelo | DeepSeek |
| **ops** | PM2 / cron / LaunchAgent / Tailscale / Caddy / service health, incident response, log triage | Write user-facing code, modify trading bots, send Telegram outside BossMan | DeepSeek |
| **trading** | Binance/Kraken bot config, regime detection, position management, risk rules, PII safety | Modify PM2/cron without BossMan, disable safety hooks, enable PAPER_MODE=false without Marcelo | Claude (mandatory) + DeepSeek (secondary) |
| **content** | YouTube channel, AI/crypto content pipeline, TTS, media gen, ElevenLabs, publishing ops | Modify billing, sign contracts, change brand positioning | OpenAI |
| **travel** | Travel OS sub-routes, itinerary features, PDF/PPTX export pipeline, closeout workflow | Touch other apps' DBs, modify shared PM2 processes | MiniMax-M3 |
| **qa-verification** | Step-5 verifier verdict, cross-system regression tests, browser QA, evidence collection | Implement features, modify source code outside test files | Claude (sensitive work) / MiniMax-M3 (cosmetic) |
| **research-intel** | Perplexity-first research, vendor comparisons, best-practice discovery, market intel | Implement code, make product decisions, save facts to memory | DeepSeek |
| **knowledge-canon** | `~/.hermes/knowledge/` curation, LEARNED_* doc authoring, Obsidian mirroring, doc-hygiene cron | Implement features, send notifications to Marcelo | MiniMax-M3 |
| **self-improvement** | Skill authoring, memory hygiene, MEMORY.md pruning, weekly health checks | Modify routing rules, change model assignments | MiniMax-M3 |
| **loop-engineering** | Goal-loop pattern (`intake → decompose → execute → review → done`), cron-driven loops, recurring workflows | Define new model routing, change governance | MiniMax-M3 |

**Default model** is overridden by `LEARNED_V3_MODEL_STACK.md` per task type. Lane lane owners don't pick models — they inherit the routing.

---

## 2. LBC35 / OpenClaw — delegator/router only (locked 2026-07-20)

- **Role:** Plan + route work to the right sub-agent lane.
- **May NOT:** Implement code, run tests, modify production secrets, modify PM2/cron, send Telegram directly to Marcelo, become a worker.
- **Output:** Plans, decomposition, lane recommendations. Plans reference the 7-rule contract and `ROUTING-RULES.md`.
- **Ownership isolation:** Computer Use is BossMan-only. LBC35/OpenClaw may not operate Computer Use without explicit assignment.

`ai.openclaw.gateway` LaunchAgent is **disabled** as of 2026-05-18. Re-enabling requires a BossMan kanban card + Marcelo approval.

---

## 3. The handoff contract

Every handoff between BossMan ↔ sub-agent ↔ Perplexity follows this exact format. Sub-agents must format their return summaries to BossMan in this shape; BossMan formats the final report to Marcelo in the same shape (per Rule #6).

```
┌──────────────────────────────────────────────────────────────┐
│ HANDOFF PACKET (sub-agent → BossMan)                          │
├──────────────────────────────────────────────────────────────┤
│ Lane:                    <builder|ops|trading|...>            │
│ Parent card:             <t_xxx>                              │
│ Status:                  PASS | PASS-WITH-FIX | FAIL | BLOCKED│
│ What I did:              <3-5 bullets, factual>              │
│ What is now true:        <observable state changes>          │
│ Evidence:                <URLs, file paths, command outputs>  │
│ Reusable patterns found: <list → knowledge-canon lane>        │
│ Remaining Marcelo-only:  <list, ideally empty>               │
│ Step-5 verdict file:     <path if QA ran>                     │
│ Time spent:              <optional, for budget tracking>      │
└──────────────────────────────────────────────────────────────┘
```

The handoff packet is the **only** output sub-agents return. BossMan synthesizes it into the final report. Sub-agents do not autonomously message Marcelo with the same content.

---

## 4. What sub-agents MUST do

- **Stay in lane.** If the work crosses lanes (e.g., building a feature needs a new cron), the sub-agent opens a sibling kanban card for the right lane and links it. They don't reach across lanes.
- **Use Perplexity-first for unknowns.** Perplexity via Brave → `https://perplexity.ai` (primary) or Hermes Computer Use → Perplexity Mac app (when healthy). Never ask Marcelo to relay.
- **Pick model from LEARNED_V3_MODEL_STACK.md** based on task type. Not from intuition.
- **Verify before returning PASS.** Self-test (browser QA, curl, sqlite3, log inspection) before handing off. "Looks right" is not verification.
- **Capture reusable insights.** If something is a quirk, fix pattern, vendor behavior, or recurring failure mode, save it to `~/.hermes/knowledge/LEARNED_<DOMAIN>.md` (or open a skill via `skill_manage`). Not in chat-only reasoning.
- **Emit a Step-5 verdict.** Even for "small" changes. If the work is genuinely trivial (one-line patch, single direct question), skip Step-5 and mark the card accordingly.
- **Report drift.** If a pattern in the work suggests a stack gap (missing skill, missing tool, missing playbook entry, missing Space pointer), open a `drift-fix: <gap>` kanban card. Drift is a stack bug, not a project bug.

## 5. What sub-agents MUST NOT do

- ❌ Send Telegram / Slack / email / push notifications to Marcelo. All status flows through BossMan.
- ❌ Create independent workstreams outside the assigned kanban card.
- ❌ Treat LBC35/OpenClaw as a worker. LBC35 is a delegator/router; you execute its plans, you don't serve it.
- ❌ Skip Step-5 verification because "it's a small change" or "it's a hot-fix."
- ❌ Skip kanban. Even 5-minute tasks live on a card.
- ❌ Modify `SOUL.md`, `AGENTS.md`, `ROUTING-RULES.md`, `LEARNED_V3_MODEL_STACK.md`, `LEARNED_7_RULE_CONTRACT.md`, `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` without explicit BossMan assignment + Marcelo approval.
- ❌ Enable PAPER_MODE=false on trading bots without Marcelo sign-off.
- ❌ Modify production secrets, billing, vendor contracts, or customer-visible terms without Marcelo sign-off.
- ❌ Ask Marcelo to interpret logs, copy-paste Perplexity output, decide routine technical choices, or run commands.

## 6. Lane handoff examples (canonical patterns)

### Example 1: Builder needs a new cron → handoff to ops
1. builder is implementing a feature that requires a nightly export.
2. builder finishes the feature + opens a sibling kanban card `t_cron_nightly_export_<date>` tagged `project:<AppName>` and assigned to `ops`. Body links the parent card.
3. ops picks up the sibling card, registers the cron, verifies it ran, marks done.
4. builder sees the sibling card move to `done` and unblocks the parent.

### Example 2: Ops detects a new recurring error → handoff to knowledge-canon
1. ops triages an incident and finds a recurring error pattern (e.g., PM2 EADDRINUSE every 6h due to orphan Next.js processes).
2. ops applies the immediate fix.
3. ops opens a sibling card `t_learned_pm2_nextjs_orphan_eaddrinuse` assigned to `knowledge-canon` with the postmortem body.
4. knowledge-canon authors `~/.hermes/knowledge/LEARNED_PM2_NEXTJS_ORPHAN.md` and mirrors it to Obsidian + the matching Perplexity Space. Marks done.
5. ops's parent postmortem links to the LEARNED doc.

### Example 3: Research-intel needs a deep vendor comparison → handoff to qa-verification for cross-check
1. research-intel produces a vendor comparison report.
2. research-intel opens a sibling card for qa-verification to cross-check the data + verify the recommendation matches Marcelo's actual usage.
3. qa-verification reads Perplexity results, double-checks against the local registry, writes a verdict.
4. research-intel updates the recommendation with the cross-check and closes the parent card.

### Example 4: Knowledge-canon writes a new LEARNED doc → handoff to self-improvement for skill extraction
1. knowledge-canon authors `LEARNED_<DOMAIN>.md`.
2. knowledge-canon opens a sibling card for self-improvement asking "is there a reusable skill here, or is this just a fact?"
3. self-improvement either authors a skill via `skill_manage create` or returns "no skill needed" with rationale.
4. knowledge-canon mirrors the final form to Obsidian + Perplexity Space.

## 7. The closed-loop audit

A monthly cron (`loop-enforcement-monthly-review`, in `~/.hermes/scripts/`) reviews:

- % of non-trivial kanban cards that ran the full 7-stage loop end-to-end
- Number of `drift-fix` cards opened + time-to-resolution
- Sub-agent lane purity (no cross-lane work, no out-of-lane notifications to Marcelo)
- Knowledge capture rate (% of new insights that landed in canon)

Output: `~/.hermes/logs/loop-enforcement-review-YYYY-MM.md`, mirrored to `~/Obsidian/Hermes/50_Phase-Reports/`.

---

*This is the sub-agent contract. Lane owners read this before every assignment. Handoff packets respect this shape. Drift cards extend it.*