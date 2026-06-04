# MODEL-STACK-WORKFLOWS.md

**Version:** 1.0
**Date:** 2026-06-03
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — companion to `ROUTING-RULES.md`

---

## Purpose

This document shows one end-to-end worked example of the **Default Build
Flow** with the model stack Marcelo canonized on 2026-06-03. Use it as a
template when you start a new project, feature, or serious troubleshooting
and you're not sure how the pieces fit together.

Cross-references:
- `~/.hermes/AGENTS.md` — Model Routing (parent policy)
- `~/.hermes/OPERATINGBLUEPRINT.md` — Operating procedure
- `~/.hermes/knowledge/ROUTING-RULES.md` — Default Build Flow rules
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — Cost tiers + Routing Ledger

---

## Quick reference — the five steps

```
STEP 1  → Perplexity Search     (research, current docs, gotchas)
STEP 2  → M3                    (architecture, Kanban cards, acceptance criteria)
STEP 3  → Primary builder       (DeepSeek | Llama | OpenAI; one per card)
STEP 4  → Llama                 (bulk cleanup, tests, refactors)
STEP 5  → Claude                (long-form docs and runbooks — code-stable only)
```

Fallback chain when a paid model fails on quota or billing:
- Planning / reasoning: **M3 → Llama → DeepSeek**
- Code / debugging: **DeepSeek → Llama → OpenAI**
- Docs / specs: **Claude → OpenAI → M3**

---

## Worked example — "Per-tenant rate limiter" for Money Pipeline

### Background

Marcelo: *"Money Pipeline needs a per-tenant rate limiter on the public API.
Don't let one tenant starve the others. Use Redis. I want this on staging by
Friday."*

This is non-trivial (correctness + concurrency), so it gets the full 5-step
flow.

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
3. **Kanban cards** with clear acceptance criteria. Example:

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

   model_plan: DeepSeek writes initial middleware + store → Llama refactors
               and adds concurrency tests → OpenAI only polishes comments
               and JSDoc
   fallback_chain: code/debug — DeepSeek → Llama → OpenAI
   ```

4. **Acceptance criteria** per card, written as testable bullets. Example for
   the core middleware card:
   - Given a tenant `t1` with policy `100 req/min`, when 100 requests are
     issued in 60s, all 200.
   - When the 101st request arrives, returns 429 with `Retry-After`.
   - When Redis is down, fails open with a WARN log (not 500).
   - When two requests race the same tenant, only one slot is consumed
     (atomicity test).

**Cost:** M3 plan; this is a single long context, but the output is saved
in the card and re-used by every builder in Step 3.

---

### Step 3 — Build (one primary builder per card)

**Per the `model_plan` line in the card body:**

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

**Multi-model handoff example (allowed):**
```
model_plan: DeepSeek writes initial code → Llama refactors and adds tests → OpenAI only polishes comments and README
```

**Not allowed:**
- DeepSeek and OpenAI both writing the same file in the same pass
- More than two models actively writing to one card without an explicit
  handoff documented in `model_plan:`

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
- Add a new "feature" beyond what the card asked for. If a need surfaces,
  Llama creates a follow-up card and stops.

**DeepSeek or OpenAI may be used as a final sanity pass on critical
components** — for example, OpenAI reading the Lua script and the test
results and producing a one-paragraph "is this correct?" review. This is
NOT a rewrite; it is a one-shot audit. The output goes on the card as a
comment, not into the file directly.

---

### Step 5 — Claude docs and handoff

**Who runs this:** Claude.

**What Claude reads first:**
1. The final `rateLimit.ts` and friends (post-Llama cleanup)
2. M3's design notes from the main project card
3. The acceptance criteria from each build card
4. The Routing Ledger / model_log showing which model did what

**What Claude produces (concise, complete):**
- A `docs/RATE_LIMITING.md` with: how the limiter works, the per-tenant
  policy schema, the Redis key layout, the failure modes, the
  operational runbook (how to check who's getting throttled, how to
  adjust a policy, how to disable per-tenant)
- A short README section in the project root pointing to the doc
- An Obsidian note at
  `~/Desktop/CLAW-Backup/Money Pipeline - Rate Limiting.md`

**What Claude does NOT do:**
- Re-explain M3's architecture from scratch — M3's design is the source of
  truth; Claude references and tightens it
- Touch the code. Step 5 is documentation only
- Add scope. If something is missing from the docs because the code
  doesn't support it, Claude flags it and creates a follow-up card

---

### Final verification

BossMan verifies end-to-end on staging:
- `curl` 100 reqs in a loop → all 200
- 101st req → 429 with `Retry-After`
- Concurrent burst (xargs -P 50) → no double-counting
- Redis kill switch → requests still 200 with a WARN log
- Browser QA on the public endpoint → 429 page renders cleanly

Then BossMan marks the cards done and pings Marcelo.

---

## Worked example — quick-reference card

```
┌──────────────────────────────────────────────────────────────┐
│ Default Build Flow (5 steps)                                 │
├──────────────────────────────────────────────────────────────┤
│ STEP 1  Perplexity Search   → research, sources, gotchas    │
│ STEP 2  M3                  → architecture + Kanban cards   │
│ STEP 3  DeepSeek | Llama | OpenAI  → one primary per card   │
│ STEP 4  Llama               → cleanup, tests, refactor      │
│ STEP 5  Claude              → docs and runbook              │
├──────────────────────────────────────────────────────────────┤
│ Fallback: planning M3→Llama→DeepSeek, code DeepSeek→Llama→   │
│           OpenAI, docs Claude→OpenAI→M3                      │
├──────────────────────────────────────────────────────────────┤
│ LBC35 does not choose models. LBC35 executes the model_plan  │
│ BossMan put in the handoff packet.                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Common patterns and pitfalls

### Good patterns

- **Card body has `model_plan:` line** that names the primary builder.
- **Perplexity sources linked in the main project card** (URLs + 1-line summary).
- **M3's design saved in the card body** (not in chat), so anyone can
  pick up the work.
- **Each model adds a card comment** when it touches the artifact.
- **Llama handles the bulk cleanup**; DeepSeek/OpenAI are the sanity pass
  on critical paths only.

### Pitfalls

- **Skipping Perplexity Search** because "I know the answer." Always run
  Step 1. The cost is one Pro search; the upside is no surprise from a
  vendor deprecation or a known security CVE.
- **Using M3 for the build.** M3 designs; it does not write production
  code. Step 3 belongs to a primary builder.
- **Two models editing the same file in the same pass.** This guarantees
  merge conflicts and lost work. Sequence them.
- **Skipping Step 4.** Code from Step 3 is usually a first draft. The
  Llama cleanup pass is what makes it shippable.
- **Asking Claude to write docs before code is stable.** Step 5 is
  documentation of stable code. If the code is still moving, the docs
  will be wrong. Wait.
- **Forgetting the model_log.** Without it, future agents can't tell
  which model produced which artifact, and you re-pay for the same work.

### When to deviate

Deviate from the default flow only when:
- The work is genuinely trivial (one-line config change, one-character
  typo) — in that case, do the minimum and log it
- Marcelo explicitly asks for a different pattern
- A vendor block makes the canonical model unavailable — fall back per
  the chain above

For everything else: **Default Build Flow or it didn't happen.**

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-06-03 | Initial — single end-to-end worked example (Per-tenant rate limiter for Money Pipeline) showing all 5 steps and the multi-model handoff. |
