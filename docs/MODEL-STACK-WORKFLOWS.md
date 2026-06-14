# MODEL-STACK-WORKFLOWS.md

**Version:** 3.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — companion to `ROUTING-RULES.md` (v3.0)

> **v3.0 (2026-06-03) — "10/10" update.** Worked examples now include
> Step 5 (QA pass with DeepSeek red-team) and the new
> `build_passes`/`rewrite_scope` fields. Added a second example showing
> when Perplexity Computer is escalated. v1.0 (5-step example without
> QA) and v2.0 entries preserved in the version history for traceback.

---

## Purpose

This document shows end-to-end worked examples of the **Default Build
Flow v3.0** with the model stack Marcelo canonized on 2026-06-03. Use
it as a template when you start a new project, feature, or serious
troubleshooting and you're not sure how the pieces fit together.

Cross-references:
- `~/.hermes/AGENTS.md` — Model Routing (parent policy)
- `~/.hermes/OPERATINGBLUEPRINT.md` — Operating procedure
- `~/.hermes/knowledge/ROUTING-RULES.md` — Default Build Flow rules (v3.0)
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — Cost tiers + Routing Ledger (v3.0)

---

## Quick reference — the six steps (v3.0)

```
STEP 1  → Perplexity Search     (research, current docs, gotchas)
STEP 2  → M3                    (architecture, Kanban cards, acceptance criteria)
STEP 3  → Primary builder       (DeepSeek | Llama | OpenAI; one per card)
STEP 4  → Llama                 (bulk cleanup, refactors, tests)
STEP 5  → QA PASS               (DeepSeek red-team — mandatory for critical cards)
STEP 6  → Claude                (long-form docs and runbooks — only after QA passes)
```

**Optional escalation:** Perplexity Computer (10k credits/month) — only
on projects with `escalate_to_computer: yes` approved by Marcelo. See
`ROUTING-RULES.md` §4.

**Fallback chain** when a paid model fails on quota or billing:
- Planning / reasoning: **M3 → Llama → DeepSeek**
- Code / debugging: **DeepSeek → Llama → OpenAI**
- Docs / specs: **Claude → OpenAI → M3**
- QA / red-team: **DeepSeek → OpenAI → M3** (new in v3.0)

---

## Worked example A — "Per-tenant rate limiter" for Money Pipeline (v3.0, with Step 5 QA)

### Background

Marcelo: *"Money Pipeline needs a per-tenant rate limiter on the public
API. Don't let one tenant starve the others. Use Redis. I want this on
staging by Friday."*

This is non-trivial (correctness + concurrency) and touches a critical
surface (public API, multi-tenant), so it gets the **full 6-step flow
with mandatory Step 5 QA**.

---

### Step 1 — Perplexity Search (research)

**Who runs this:** BossMan, with Perplexity Pro search via Browser QA.

**What to ask:**

```
"Current best practices for per-tenant API rate limiting in Node.js
Express backends using Redis. Focus on:
- Atomic counter algorithms (sliding window vs token bucket vs fixed window)
- Race conditions on concurrent requests
- Known gotchas in redis-rate-limit and rate-limiter-flexible libraries
- How to surface 'Retry-After' headers cleanly
- Production failure modes (Redis down, hot key, etc.)
"
```

**What to capture on the main project card:**

- 3–5 cited sources (vendor docs, blog posts with benchmarks, GitHub issues)
- The picked library and the algorithm (e.g. `rate-limiter-flexible` + sliding
  window in Redis with Lua atomicity)
- Gotchas called out (e.g. "don't use the default middleware; use the
  per-route wrapper")
- A short rationale: why this library, why this algorithm, what we
  considered and rejected

**Cost:** Perplexity Pro plan; one search session.

---

### Step 2 — M3 (design)

**Who runs this:** M3 (BossMan brain).

**What M3 produces:**

1. **Architecture diagram** in plain text — middleware chain, Redis keys
   layout, request → counter → 200/429 path.
2. **Module breakdown:**
   - `rateLimit.ts` — the core middleware factory
   - `rateLimitStore.ts` — Redis client + key namespace
   - `rateLimitPolicy.ts` — per-tenant policy lookup
   - `tests/rateLimit.spec.ts` — unit + concurrency tests
3. **Kanban cards** with clear acceptance criteria, plus the v3.0
   per-card fields. Example for the core middleware card:

   ```yaml
   ## Blueprint: KICKOFF
   goal: Per-tenant rate limiter on the public API. Sliding window via
         Redis. Per-tenant policy in code; defaults in config.
   deliverables:
     - [ ] rateLimit.ts middleware factory
     - [ ] rateLimitStore.ts Redis client
     - [ ] rateLimitPolicy.ts tenant → policy lookup
     - [ ] tests/rateLimit.spec.ts — happy path, burst, 429 headers, Redis-down fallback
     - [ ] wire into Express app on /api/* routes
     - [ ] staging deploy verified end-to-end

   artifacts:
     - money-pipeline/src/middleware/rateLimit.ts
     - money-pipeline/src/middleware/rateLimitStore.ts
     - money-pipeline/src/middleware/rateLimitPolicy.ts
     - money-pipeline/tests/rateLimit.spec.ts
     - money-pipeline/src/app.ts (wire-up)

   ## Routing
   model_plan: DeepSeek writes initial middleware + store → Llama refactors
               and adds concurrency tests → OpenAI only polishes comments
               and JSDoc
   qa_required: yes              # critical card: public API + multi-tenant
   qa_model: DeepSeek
   qa_status: pending
   escalate_to_computer: no
   escalate_to_computer_reason: n/a
   fallback_chain: code/debug — DeepSeek → Llama → OpenAI
   ```

4. **Acceptance criteria** per card, written as testable bullets. Example
   for the core middleware card (these are what Step 5 will red-team):
   - Given a tenant `t1` with policy `100 req/min`, when 100 requests are
     issued in 60s, all 200.
   - When the 101st request arrives, returns 429 with `Retry-After`.
   - When Redis is down, fails open with a WARN log (not 500).
   - When two requests race the same tenant, only one slot is consumed
     (atomicity test).
   - When the tenant policy key is missing, the default policy applies
     (default-deny vs default-allow is a security decision — see Step 5).
   - When the request has no tenant ID, behavior is explicit (reject
     with 401 vs allow with default policy — see Step 5).

**Cost:** M3 plan; this is a single long context, but the output is saved
in the card and re-used by every builder in Step 3.

---

### Step 3 — Build (one primary builder per card)

| Card | Primary builder | Why |
|---|---|---|
| `rateLimit.ts` core middleware | **DeepSeek** | Atomic Lua + Express middleware — complex, correctness-critical. |
| `rateLimitStore.ts` Redis client | **DeepSeek** | Concurrency, key namespacing, error handling. |
| `rateLimitPolicy.ts` | **Llama** | Simple lookup, repetitive pattern, low risk. |
| `tests/rateLimit.spec.ts` | **DeepSeek** (initial) → **Llama** (refactor + concurrency suite) | The hard cases need DeepSeek; the boilerplate cases can be generated by Llama. |
| Express wire-up | **OpenAI** | User-facing side effect; small but high-visibility — polished style matters. |

**Each card gets a `model_plan:` line** that names the primary builder and
the cleanup pass. The model that writes the artifact adds a card comment
when it's done, per the Routing Ledger rules in
`MODEL_ROUTING_WORKFLOW.md` §3.

---

### Step 4 — Llama harden and clean up

**Who runs this:** Llama (Ollama local).

**What Llama does:**
- Runs `eslint --fix` and the formatter over the files DeepSeek wrote
- Generates additional property-based tests for the policy lookup
- Generates a `tests/rateLimit.load.spec.ts` (k6-style) from a template
- Removes dead code, unused imports, and `console.log` lines left by
  DeepSeek
- Tightens error messages so they're uniform across the middleware

**What Llama does NOT do:**
- Rewrite the Lua script in the Redis store. That's DeepSeek's territory.
- Add a new "feature" beyond what the card asked for.

**DeepSeek or OpenAI may be used as a final sanity pass on critical
components** — for example, OpenAI reading the Lua script and the test
results and producing a one-paragraph "is this correct?" review. This is
NOT a rewrite; it is a one-shot audit. The output goes on the card as a
comment, not into the file directly.

---

### Step 5 — QA PASS (DeepSeek red-team) — **new in v3.0**

**This card is critical** (public API + multi-tenant + Redis), so
Step 5 is **mandatory** and the model is **DeepSeek**.

**What DeepSeek does with red-team mindset:**

- **Edge cases:** what happens at 0 req/min policy? At policy
  `Number.MAX_SAFE_INTEGER`? With empty string tenant? With Unicode
  in the tenant key? With a tenant key that contains `:` (which is
  the Redis namespace separator)?
- **Security:** can a tenant craft a key to consume another tenant's
  quota? Can a missing tenant ID escalate to default-deny vs
  default-allow? Can the `Retry-After` header be poisoned? Can a
  slow-loris attack exhaust the limiter?
- **Performance:** what's the p99 of a Lua call to Redis? What
  happens when the Lua script is recompiled on every deploy? What's
  the memory footprint of the Lua state for 10k tenants? Does the
  middleware add measurable latency under load?
- **Failure modes:** what happens when Redis is down (the middleware
  fails open with a WARN — but is that the right default? Should it
  be fail-closed for some routes?). What happens when Redis is slow
  (latency budget?). What happens when the policy file is corrupt
  on disk?

**Logging the QA pass:**

Each finding goes on the card as a comment using the standard
Routing Ledger format. Findings that need their own work create
**QA sub-cards** (e.g. `parent_card = t_xyz`,
`qa_finding: race on tenant counter`). The card's `qa_status` field
gets updated: `pending` → `passed` (no issues), `failed` (issues
found, must be fixed before docs), or `logged` (issues found and
filed as sub-cards, work continues).

Example QA comment:

```
[MODEL USED]: DeepSeek
[ROLE]: Step 5 QA — red-team
[ARTIFACT TOUCHED]: money-pipeline/src/middleware/rateLimit.ts
[OUTCOME]: found 3 issues, 1 critical, 2 minor
  - CRITICAL: missing-tenant-id currently defaults to global quota.
    Could allow a tenant to exhaust another's quota by sending
    requests without an ID. Recommendation: reject with 401.
    → Filed as sub-card t_xyz_qa1
  - minor: Retry-After header uses seconds (correct) but Accept-
    Encoding is not honored. Cosmetic.
  - minor: Lua script recompiled on every deploy (not cached).
    Marginal performance impact, no action needed.
[QA STATUS]: logged (1 sub-card to fix before Step 6)
[NEXT]: builder fixes t_xyz_qa1 → re-run Step 5 → then Step 6
```

---

### Step 6 — Claude docs and handoff (only after QA passes or issues logged)

**Who runs this:** Claude.

**What Claude reads first:**
1. The final `rateLimit.ts` and friends (post-Llama cleanup AND post-QA
   fixes)
2. M3's design notes from the main project card
3. The acceptance criteria from each build card
4. The QA findings from Step 5 (so the docs reflect known limitations
   and trade-offs)
5. The Routing Ledger / model_log showing which model did what

**What Claude produces (concise, complete):**
- A `docs/RATE_LIMITING.md` with: how the limiter works, the per-tenant
  policy schema, the Redis key layout, the failure modes, the
  operational runbook (how to check who's getting throttled, how to
  adjust a policy, how to disable per-tenant)
- A short README section in the project root pointing to the doc
- An Obsidian note at
  `~/Desktop/CLAW-Backup/Money Pipeline - Rate Limiting.md`
- A note about the QA findings and any known trade-offs (e.g. "fails
  open when Redis is down — see Step 5 finding for the rationale and
  the fail-closed path for sensitive routes")

**What Claude does NOT do:**
- Re-explain M3's architecture from scratch — M3's design is the source
  of truth; Claude references and tightens it
- Touch the code. Step 6 is documentation only
- Add scope. If something is missing from the docs because the code
  doesn't support it, Claude flags it and creates a follow-up card

---

### Final verification + metrics

BossMan verifies end-to-end on staging:
- `curl` 100 reqs in a loop → all 200
- 101st req → 429 with `Retry-After`
- Concurrent burst (xargs -P 50) → no double-counting
- Redis kill switch → requests still 200 with a WARN log
- Browser QA on the public endpoint → 429 page renders cleanly

Then BossMan **sets the metrics fields** on the card:

```yaml
build_passes: 2     # first pass from DeepSeek; one round of QA fixes
rewrite_scope: minor # mostly small fixes from Step 5 QA findings
qa_required: yes
qa_model: DeepSeek
qa_status: passed   # after t_xyz_qa1 was fixed and re-ran Step 5
escalate_to_computer: no
```

This data feeds the **monthly build-metrics review** in
`ROUTING-RULES.md` §5.

---

## Worked example B — Greenfield SaaS with Perplexity Computer escalation

### Background

Marcelo: *"I want to build a small SaaS that lets a user upload a
spreadsheet, runs a few analyses, and gives them a downloadable PDF
report. I want it on a public URL by next week. It's greenfield — new
repo, new DB, new deploy."*

This is a **greenfield, full-stack SaaS** that includes research, code,
and deployment in one orchestrated pass. It matches the Perplexity
Computer escalation pattern #1 in `ROUTING-RULES.md` §4.

**BossMan proposes escalation** on the main project card:

```yaml
## Escalation Proposal
escalate_to_computer: yes
escalate_to_computer_reason: |
  Greenfield full-stack SaaS (spreadsheet → PDF report). Includes
  research (PDF libraries, spreadsheet parsers, hosting options), code
  (frontend + backend + DB), and deployment. Matches the §4
  escalation pattern #1. Estimated Computer credits: ~2,500.
```

**Marcelo confirms or rejects.** No work begins until confirmed.

---

### If Marcelo approves — what changes vs the default flow

Instead of BossMan running Steps 1–5 himself with the local stack, the
project is handed to **Perplexity Computer** for the bulk of the
work. BossMan still owns the project — the kanban card, the design
review, the final QA, the docs, the handoff. Computer is a tool, not
a replacement for BossMan.

The rough shape of the Computer run:

1. **Computer does Steps 1–4 internally**, orchestrating the right
   model for each sub-task:
   - Research → Perplexity Search (built-in)
   - Architecture → strong reasoning model
   - Code → primary builder
   - Cleanup → small model
2. **Computer returns a draft to BossMan** with a list of artifacts
   and a credit-usage summary.
3. **BossMan runs Step 5 QA** himself with DeepSeek on the critical
   parts (data handling, auth, deployment config).
4. **BossMan runs Step 6 docs** himself with Claude.
5. **BossMan records** on the card: which Computer sub-tasks ran,
   roughly how many credits they used, and the total.
6. **Monthly build-metrics review** folds the credit usage into the
   10k/month cap tracking.

### If Marcelo rejects the escalation

BossMan runs the project with the **default 6-step flow** using the
local stack. No Computer credits consumed. This is the default for
everything, and works fine for projects that don't strictly need
Computer.

---

## Worked example C — Trivial card (no Step 5, no metrics, no Computer)

**A typo fix on a doc page.** Steps:

1. (No Perplexity Search — the answer is on the page itself)
2. (No M3 design — the change is one word)
3. Llama edits the file
4. (No cleanup needed for one word)
5. **No QA** — non-critical, non-build, no concurrency, no PII
6. (No Claude docs — the doc is the change)

**Metrics:** still set when the card is closed. `build_passes: 1`,
`rewrite_scope: none`. The metric data still feeds the monthly review
so we can see how many trivial cards vs critical cards we ship.

---

## Quick-reference card

```
┌──────────────────────────────────────────────────────────────┐
│ Default Build Flow v3.0 — 6 steps                            │
├──────────────────────────────────────────────────────────────┤
│ STEP 1  Perplexity Search   → research, sources, gotchas    │
│ STEP 2  M3                  → architecture + Kanban cards   │
│ STEP 3  DeepSeek | Llama | OpenAI  → one primary per card   │
│ STEP 4  Llama               → cleanup, tests, refactor      │
│ STEP 5  DeepSeek (QA)       → red-team — critical cards MAND│
│ STEP 6  Claude              → docs and runbook (post-QA)    │
├──────────────────────────────────────────────────────────────┤
│ Per-card fields (v3.0):                                      │
│   model_plan, qa_required, qa_model, qa_status,              │
│   escalate_to_computer, escalate_to_computer_reason,        │
│   build_passes (1/2/3+), rewrite_scope (none/minor/major)   │
├──────────────────────────────────────────────────────────────┤
│ Fallback: planning M3→Llama→DeepSeek, code DeepSeek→Llama→   │
│   OpenAI, docs Claude→OpenAI→M3, QA DeepSeek→OpenAI→M3      │
├──────────────────────────────────────────────────────────────┤
│ Perplexity Computer: rare escalation, 10k credits/month,    │
│   escalate_to_computer: yes flag, Marcelo approval.         │
│   LBC35 does not choose models. LBC35 does not trigger       │
│   Perplexity Computer.                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Common patterns and pitfalls

### Good patterns

- **Card body has `model_plan:`, `qa_required:`, `qa_model:` lines** —
  name the primary builder AND the QA model upfront.
- **Step 5 is on the card from the start** for any critical surface
  (money, PII, infra, trading, auth, public APIs). BossMan adds it
  automatically per Marcelo's standing rule.
- **Perplexity sources linked in the main project card** (URLs + 1-line
  summary).
- **M3's design saved in the card body** (not in chat), so anyone can
  pick up the work.
- **Each model adds a card comment** when it touches the artifact,
  including Step 5 QA findings.
- **Llama handles the bulk cleanup**; DeepSeek/OpenAI are the sanity
  pass on critical paths only.
- **Perplexity Computer is proposed, not assumed.** BossMan writes the
  reason on the card and waits for Marcelo.
- **Metrics fields are set when the card is closed**, not after the
  fact. This is what makes the monthly review trustworthy.

### Pitfalls

- **Skipping Perplexity Search** because "I know the answer." Always run
  Step 1 for non-trivial work. The cost is one Pro search; the upside
  is no surprise from a vendor deprecation or a known security CVE.
- **Using M3 for the build.** M3 designs; it does not write production
  code. Step 3 belongs to a primary builder.
- **Two models editing the same file in the same pass.** This guarantees
  merge conflicts and lost work. Sequence them.
- **Skipping Step 4.** Code from Step 3 is usually a first draft. The
  Llama cleanup pass is what makes it shippable.
- **Skipping Step 5 on a critical card.** Marcelo's standing rule:
  Step 5 is mandatory for high-impact or sensitive work. If you think
  a card is critical, set `qa_required: yes`.
- **Asking Claude to write docs before QA passes.** Step 6 is
  documentation of code that has passed QA (or with QA issues logged
  as sub-cards). If the code is still moving, the docs will be wrong.
  Wait.
- **Forgetting the model_log.** Without it, future agents can't tell
  which model produced which artifact, and you re-pay for the same
  work.
- **Treating Perplexity Computer as part of the everyday stack.** It
  is not. It is a rare escalation tool with a hard monthly cap.
- **Using Computer without `escalate_to_computer: yes` approved by
  Marcelo.** Even if the project looks like a perfect Computer
  candidate, no Computer until the flag is approved.
- **Forgetting the metrics fields.** Without `build_passes` and
  `rewrite_scope` on every closed card, the monthly review is
  meaningless. BossMan sets them at close, or delegates to the
  assigned profile.

### When to deviate

Deviate from the default flow only when:
- The work is genuinely trivial (one-line config change, one-character
  typo) — in that case, do the minimum and log it
- Marcelo explicitly asks for a different pattern
- A vendor block makes the canonical model unavailable — fall back per
  the chain above
- The project matches a Computer escalation pattern AND Marcelo has
  approved the `escalate_to_computer: yes` flag — then Computer is
  allowed for this project only

For everything else: **Default Build Flow v3.0 or it didn't happen.**

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-03 | Initial — single end-to-end worked example (Per-tenant rate limiter for Money Pipeline) showing all 5 steps and the multi-model handoff. |
| 2.0 | 2026-06-03 | Reserved (no public release; absorbed into v3.0). |
| 3.0 | 2026-06-03 | **"10/10" update.** Examples now include Step 5 (DeepSeek QA pass) and the v3.0 per-card fields. Added example B (greenfield SaaS with Perplexity Computer escalation) and example C (trivial card with no QA). Updated quick-reference card to 6 steps. Updated Common Patterns / Pitfalls / When to Deviate. |
