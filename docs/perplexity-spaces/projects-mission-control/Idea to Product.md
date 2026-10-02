**Version:** v4 · **Date:** 2026-09-30 · **Source:** `~/.hermes/knowledge/LEARNED_IDEA_TO_PRODUCT.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_IDEA_TO_PRODUCT.md — Idea-to-Product Engine v2 (Permanent 2026-09-15)


> **[RETIRED 2026-09-30]** LBC35/OpenClaw delegator + OpenClaw gateway retired per card `t_735da189`. Delegation is now BossMan via Kanban + `~/.hermes/bin/route-card.sh`. Historical references preserved for context.

> **CANONICAL SOURCE OF TRUTH** for the Idea-to-Product engine.
> Date locked: 2026-09-15 (BossMan v2 upgrade; replaces IDEASDAWGBOT v1 intake-only half).
> Source directive: Marcelo — Idea-to-Product Engine recall + v2 upgrade.
> Status: CANON — governs IDEA-0 through IDEA-6.

## Origin story (why this exists, what came before)

- **v1 — IDEASDAWGBOT (2026-04-16 → 2026-05-30):** Workspace at `/Users/bjdawg/.openclaw/workspace-ideasdawg/`. SOUL/AGENTS/MEMORY/HEARTBEAT/IDENTITY/USER still on disk. Agent dir at `/Users/bjdawg/.openclaw/agents/ideasdawg/agent/` had only models/providers/auth (no instruction set beyond the workspace MD files). Captured raw ideas, ran 5-7 AM research, added records to money.db via `research_batch.js` + `research_post.js`. Telegram summaries via `money-morning-research` cron. Last successful Telegram 2026-04-21 (155 new opportunities). Last attempted session 2026-05-13 (Telegram FAILED — invalid bot token). Last research log entry 2026-05-30. **Died when the OpenClaw gateway was disabled on 2026-05-18 (Phase 13 instruction).**
- **DWDAWGBOT (the downstream implementer):** Agent dir at `/Users/bjdawg/.openclaw/agents/dwdawg/` — only `sessions/` dir, **no workspace, no SOUL, never built, never executed.** The "implement" half was never wired.
- **Intake skill (`~/.hermes/skills/ideas/SKILL.md`, May 6 2026, 3812 bytes):** Created as a generic capture+route skill for any profile. Not wired to a specific trigger phrase. Stayed an intake skill, not an engine.
- **Money Pipeline V2 spec (`MONEY_PIPELINE_V2_SPEC.md`, 2026-05-22):** Research + scoring architecture only; explicitly stops at "kanban-promote → LBC35 executes." Did not define the build + monetize half.
- **MP6-01 architecture (`MP6-01-ARCHITECTURE.md`, 2026-06-18):** Same boundary — discovery → scoring → kanban → LBC35 handoff. LBC35 was supposed to be the implementer but LBC35's role under Hermes V3 is delegator/router, not worker.

**Verdict on v1:** intake + proposal half existed (and worked, briefly). Build + monetize half was **never built** — DWDAWGBOT was a placeholder, and the LBC35 → DWDAWGBOT path in IDEASDAWGBOT's AGENTS.md was aspirational only. The "I have an idea" trigger was **never wired** to anything. **DEAD in net effect; preserved as historical artifacts.**

---

## IDEA-TO-PRODUCT ENGINE v2 (this document)

**Scope:** software, AI tools, automations, digital products, content, services, offers. Not software-only.

**Principle:** the engine must kill weak ideas early, not build everything.

**Authority chain:** BossMan is sole routing authority. Sub-agents (research-intel, builder, ops, content, qa-verification) execute IDEA stages. Marcelo is the single decision point — and only one question per stage.

**Conformance with V3 routing canon:**
- Unattended cron/PM2 routes to M3 or Ollama only (LEARNED_V3_MODEL_STACK.md §Drift Closure 2026-09-15). The engine's scheduled tasks (IDEA-6 weekly self-check, dry-run crons) use this rule.
- DeepSeek is helper-only, never automatic primary or fallback for cron/PM2.
- SquarePayouts paths: permanent M3-block respected (LEARNED_SQUAREPAYOUTS.md). If an idea touches SquarePayouts, the build sub-card is pinned to Claude + Step-5 red-team QA mandatory.
- All build work follows the 7-rule contract (LEARNED_7_RULE_CONTRACT.md).

### IDEA-0 — TRIGGER (auto-arm)

**Trigger phrases** (any one, anywhere, any channel):
- "I have an idea"
- "idea:"
- "business idea"
- "what about…"

**What fires:** BossMan auto-arms the engine. No setup command. No Marcelo action beyond saying the phrase.

**What the trigger does:**
1. Creates a kanban card on `bossman` board with `tag:idea-to-product`, `parent: PROJ-2026-06_money-pipeline-v2` (or new project entity if first idea).
3. Posts a one-line Telegram reply to the originating chat: "Idea engine armed. Expecting ≤7 questions in 3 batches. Answer with letters (A/B/C/D)."
2. Loads the **ideas skill** (`~/.hermes/skills/ideas/SKILL.md`) for intake structure.

**What the trigger does NOT do:**
- No research yet.
- No kanban promotion yet.
- No model calls beyond a fast Ollama intent-classification (local, free).

### IDEA-1 — INTERROGATION (BossMan asks, Marcelo doesn't write specs)

**Max 7 questions total, batched 3 at a time.** Each question has 4 multiple-choice options (A/B/C/D) so Marcelo can answer from his phone in seconds.

**Fixed 7-question template (in this order):**
1. **Who pays?** A) End-user SMB owner · B) Mid-market department head · C) Enterprise procurement · D) Other (1 line)
2. **What pain, in their words?** A) Time waste · B) Money leak · C) Compliance/risk · D) Other (1 line)
3. **How do they find it?** A) Cold outbound · B) Inbound content/SEO · C) Referrals/network · D) Marketplace listing
4. **What does "done" look like?** A) Working product/SaaS URL · B) Signed contract + first deliverable · C) Recurring revenue stream · D) Other (1 line)
5. **Build vs sell vs both?** A) Build only (you build it) · B) Sell only (you sell someone else's) · C) Build + sell (agency) · D) Other
6. **Your real constraint?** A) Time (<5 hrs/wk) · B) Capital (<$5K to start) · C) Legal/regulatory · D) None — full speed
7. **Kill criteria?** A) Can't get first paying client in 90 days · B) Can't get to $5K MRR in 6 months · C) CAC > 50% of LTV · D) I'll know it when I see it

**BossMan's defaults if Marcelo says "you decide":**
- Pain inference from the trigger phrase.
- ICP and wedge inferred from context + the highest-scoring opportunity already in money.db.
- Constraint = time (the conservative default).
- Kill criterion = #B (MRR gate).

**BossMan states every assumption out loud.** No silent guessing.

### IDEA-2 — RECON (parallel sub-agents + Perplexity)

BossMan dispatches 5 parallel recon threads (sub-agents under research-intel lane + Perplexity). No research dead-end bounces back to Marcelo.

1. **Incumbents:** top 5 competitors. Names, funding, pricing, services, geographic focus.
2. **Niche verdict:** OPEN / SOFT-TAPPED / SATURATED / **CAN'T-WIN-AND-WHY**. If CAN'T-WIN, propose nearest adjacent winnable niche.
3. **Feasibility:** MVP shape, required tools, monthly fixed costs, time-to-first-deliverable, time-to-first-paying-client.
4. **Legal/ToS:** licensing requirements, AI Act / GDPR / state privacy laws, OpenAI/Anthropic resale ToS, IP ownership, contractor classification.
5. **Money mechanics:** TAM sanity, pricing bands, unit economics, CAC/LTV, time-to-first-dollar.

**Perplexity-first rule (Permanent 2026-06-26):** every recon sub-agent uses Perplexity via web_search before declaring NO DATA.

**Output:** structured recon report attached as a comment on the IDEA card. BossMan reads + synthesizes.

### IDEA-3 — PROPOSAL (one-page PDF in Telegram)

**Format:** single PDF (1 page, structured). Generated via `reportlab-pdf-decks` skill. Delivered to the originating Telegram chat.

**Sections (in this exact order):**
1. Problem
2. Wedge (the specific angle that beats incumbents)
3. Niche verdict (from IDEA-2)
4. Build scope (what gets built)
5. Build time in agent-hours (estimate from feasibility recon)
6. Cost to build (one-time)
7. Price point (per unit, per month, per client)
8. Three-scenario revenue model (conservative / base / aggressive)
9. Top 3 risks
10. **Score /100 across 5 axes:** Demand · Moat · Build Cost · Time-to-Revenue · Strategic Fit
11. **GO / NO-GO / PIVOT** verdict (single line)

**Then exactly one question:**
> "Build it? YES / NO / PIVOT."

**BossMan scores the 5 axes as:**
- Demand (0-20): does the pain exist and is it acute?
- Moat (0-20): can this be copied easily?
- Build Cost (0-20, inverted): is the cost-to-build low?
- Time-to-Revenue (0-20, inverted): is the time-to-first-dollar short?
- Strategic Fit (0-20): does it play to Marcelo's strengths (IT background, AI fluency, sales, ops)?

**Thresholds:**
- ≥ 80 = GO (proceed to IDEA-4)
- 60-79 = GO with conditions (state them in the PDF)
- 40-59 = PIVOT (suggest the adjacent winnable niche from IDEA-2)
- < 40 = NO-GO (archive the card, capture lessons to money.db)

### IDEA-4 — AUTONOMOUS BUILD (Marcelo says YES, BossMan owns end-to-end)

**Trigger:** Marcelo's "YES" to IDEA-3. That is **full authorization.** BossMan owns everything from here. Marcelo is read-only.

**Scope of BossMan's authority:**
- Phased blueprint (writes to the IDEA card).
- Delegation to builder / ops / content sub-agents + LBC35 (under BossMan's authority) via standard handoff packets.
- Code, infra, host, browser-test, fix own bugs, back up.
- Audit against blueprint before reporting DONE.
- Tenant isolation, role-based auth, mobile UX, low-friction client access are **day-one** requirements, not Phase 2.

**Constraints (permanent):**
- Unattended cron/PM2 = M3 or Ollama only. DeepSeek helper-only. Claude/OpenAI never auto-default for cron/PM2.
- SquarePayouts paths: Claude mandatory + Step-5 red-team QA before DONE.
- Tenant isolation per client.
- Role-based auth (admin / user / guest minimum).
- Mobile-responsive UI.
- Low-friction client access (one-click login or magic link if possible).

**Reporting cadence:** BossMan posts step-by-step progress to the IDEA card including **mistakes and fixes.** Not just the wins. Marcelo sees the card but is not asked to debug, interpret logs, or paste values.

**Escalate to Marcelo ONLY for:**
- Security changes (auth, encryption, permissions, audit logging).
- Real spend (paid SaaS, infra > $200/mo, contractor hire).
- Irreversible actions (DB drops, force-pushes, account deletions, public-internet exposure changes).
- Major scope change (new feature class added mid-build).

### IDEA-5 — DELIVERY (ping Marcelo only at READY-FOR-OPERATIONS or READY-FOR-SALE)

**Two delivery gates, both as Telegram PDF:**
1. **READY FOR OPERATIONS** — when the product works end-to-end and BossMan has tested it.
2. **READY FOR SALE** — when monetization is wired and the first-10-customers plan is ready.

**Each delivery contains:**
- Live URL
- Credentials (if Marcelo needs them; otherwise "admin login at <url> with the credentials you set during the blueprint")
- What it does (1 paragraph)
- What broke and how BossMan fixed it (honest log)
- Monetization pack (when READY FOR SALE):
  - Final pricing tiers
  - Margin per unit
  - Break-even math
  - First-10-customers plan
  - Sales-ready inventory card (written to money.db via `/api/opportunity` POST)

### IDEA-6 — ANTI-DRIFT (weekly self-check)

**Trigger:** scheduled weekly cron (Sunday 6 AM PT, before the weekly Hermes MEMORY health check at 9:05 AM). Pinned to `custom/qwen2.5:7b` (Ollama, no fallback). Reads:

1. Search for trigger phrases in the last 7 days of Telegram + Discord + CLI history.
2. Count IDEA cards created in the last 30 days, count GO vs NO-GO vs PIVOT outcomes.
3. Verify IDEASDAWGBOT historical artifacts are still preserved (read-only; never edit).
4. Verify this `LEARNED_IDEA_TO_PRODUCT.md` still matches the kanban card `tag:idea-to-product` workflow.

**If drift detected:** open a kanban card `drift-fix: idea-to-product engine wiring` on `hermes-ops` board, assign to `bossman`. The user (Marcelo) should **never have to ask** if the engine is still wired — this card catches drift before they notice.

---

## Reuse contracts

- **Money Pipeline V2 crons** (`c77d492c5b6d`, `8fb30e332d6d`): reused as-is for daily opportunity enrichment. No new cron.
- **`pmd-api` / `pmd-web`:** reused as reference stack for SaaS build patterns. The engine does not stand up new infrastructure for the IDEA build itself; it asks ops to provision only what the blueprint requires.
- **IDEASDAWGBOT artifacts:** preserved as historical reference. The new engine is documented here, not in `workspace-ideasdawg/` (which is OpenClaw-backup storage and stays frozen).

## Anti-patterns (drift signals)

If a `t_*` kanban card comment shows any of these, the engine has drifted:
- "BossMan asked Marcelo a 20-question intake" — IDEA-1 was capped at 7.
- "BossMan wrote a 30-page proposal" — IDEA-3 is a one-page PDF.
- "BossMan asked Marcelo to research incumbents" — IDEA-2 is agent-owned.
- "Marcelo debugged a build error" — IDEA-4 keeps Marcelo read-only.
- "The trigger phrase didn't fire" — IDEA-6 weekly cron catches this; re-check wiring.
- "Engine built a SaaS in 3 days without a blueprint" — IDEA-4 mandates phased blueprint.

`drift-fix` cards auto-remediate.

---

*This is the idea-to-product engine. BossMan picks the lane, picks the model, picks the sub-agents. Marcelo says the trigger phrase + answers ≤7 questions + says YES/NO/PIVOT. Everything else is engine-owned.*


---

## Appendix A — Decision log (Permanent, starting 2026-09-15)

| Decision date | Decision | Source card | Resulting IDEA-3 PDF |
|---|---|---|---|
| 2026-09-15 | PIVOT from generalist AI Implementation Agency (id=154) → property-mgmt / real-estate-operations vertical | `t_ee7b02ed` (user message: "Decision: C) PIVOT") | `~/.hermes/profiles/ops/closures/2026-09-15_IDEA-3_AI-Implementation-Agency-SMBs_id-154.pdf` superseded; new PDF under `2026-09-15_IDEA-3_PropertyOps-AI_property-mgmt-vertical.pdf` |

**Rationale captured for the appendix:**
- User verbatim direction: "Build and sell a productized AI Implementation Agency focused specifically on property-management and real-estate-operations SMBs."
- Wedge refinement: repeatable operational pain (lead intake, leasing inquiries, tenant communication, maintenance-request triage, owner reporting, CRM/workflow automation, internal knowledge-base automation), not generic AI consulting.
- Package ladder locked: Starter (intake + lead/leasing follow-up) → Operations (maintenance triage, tenant comms, knowledge base, reporting) → Managed (monthly optimization + monitoring + support).
- Initial vertical lock: property-management and real-estate-operations SMBs only. NO broad generic SaaS.
- Reuses `pmd-api` / `pmd-web` directly (the existing PMD stack is the production reference). All V3 carve-outs preserved (cron/PM2 = M3/Ollama only; DeepSeek helper-only; SquarePayouts paths = Claude mandatory).