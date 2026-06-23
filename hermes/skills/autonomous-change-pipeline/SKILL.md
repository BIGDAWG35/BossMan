---
name: autonomous-change-pipeline
description: |
  Mandatory governance pattern for every non-trivial change BossMan executes
  autonomously. Proven on PMD 4-property 2026-06-22 (P1–P5) and Phase 4
  Security Watch 2026-06-23. Every non-trivial change runs on a PARENT card
  with N=5 child cards, qa_required: yes, verify_against + accept_when
  criteria, and a self-verify card as the gate before BossMan reports "done"
  to Marcelo. Use for any change touching infra, money, auth, PII, public
  APIs, multi-file refactors, or product builds > 1 child card. Trigger
  phrases: "plan the change", "set up the pipeline", "parent + 5 children",
  "non-trivial change", "autonomous pipeline", "PMD-style", "P1..P5",
  "verify_against", "accept_when", "self-verify card", "I want the full
  loop run autonomously", "stop asking me which option". NOT for: trivial
  one-liner edits, dry-runs, single-card bug fixes, or any work where
  Marcelo wants to drive step-by-step.
---

# Autonomous Change Pipeline (Permanent)

The standing governance pattern BossMan follows for every non-trivial change.
Applies to PMD, security work, infra changes, product builds, migrations,
or any work that would otherwise take >1 kanban card to deliver.

## Standing rule (Permanent — 2026-06-23)

**BossMan never reports "done" on non-trivial work without:**

1. A **Step-5 verifier PASS** (DeepSeek QA / model QA per the active canon
   Routing Ledger) on the final implementation
2. A **self-verify card checked off** that confirms localhost + Tailscale +
   DB + PM2 + (whatever else the change touches) are all live and correct

If either gate is missing, BossMan keeps working — does not report "done"
to Marcelo, does not stop midstream to ask "which option", does not hand
back partial work.

## When this skill activates

**Activate** (create a parent card + 5 children) when ANY of:

- Work touches infra (PM2, Caddy, Tailscale, network, ports, services)
- Work touches money / trading / PII / credentials / auth / public APIs
- Work is a multi-file refactor or a product build with >1 component
- Work is a multi-card sequence the operator would otherwise drive by hand
- Work matches a known pipeline pattern (PMD P1–P5, security-watch Phase N,
  migration-playbook, multi-phase-product-delivery, kickoff-blueprint-intake)

**Do NOT activate** for:

- Trivial one-liner edits or config tweaks
- Single-card bug fixes (`debug` skill or `systematic-debugging`)
- Dry-runs / verification-only work (use `phase4-final-verify` or similar)
- Pure research / read-only audits
- Anything where Marcelo explicitly says "drive it step-by-step"

## Parent card schema (mandatory)

```yaml
title: <short, action-oriented>
project: <PMD | Trading | Infra | Security | Bakery | ...>
work_type: <new_build | existing_build | troubleshooting | audit | refactor>  # routing key for v3 ledger
status: todo   # flips to running when first child starts
qa_required: yes
verify_against: |
  1. <check 1 — concrete, observable>
  2. <check 2 — concrete, observable>
  3. <check 3 — concrete, observable>
  N. <check N>
accept_when: |
  - All child cards are status=done
  - Self-verify card (P5) passes
  - Step-5 QA verifier (DeepSeek / model) reports PASS
  - PM2 + Tailscale + DB + (whatever the change touches) all green
  - No silent stubs / synthetic rows / placeholder data
```

## 5-child structure (P1 → P5)

Each child uses the same schema as the parent, with the same `qa_required: yes`
discipline. P1–P5 is the **canonical shape**; rename P1..P5 to the workstream
(e.g. S1..S5, D1..D5) when the pipeline is for a different domain, but keep
the 5-card shape.

| # | Card | Owner | Output | Model |
|---|------|-------|--------|-------|
| **P1** | Schema / UI | bossman | `decision.md` (options, evidence, recommended choice) + `schema/UI sketch` | MiniMax-M3 (writes decision.md) |
| **P2** | Decision | bossman | `decision.md` finalized with Marcelo's call OR a recommended choice with `## Marcelo approve` gate | MiniMax-M3 |

**P2 also challenges bad logic, not just code.** If the existing workflow
is broken or doesn't make sense as a user flow, P2 includes a "fix the
flow" recommendation, not just a "fix the code" recommendation. Use
the `workflow-sanity-check` skill to verify the candidate flow.
| **P3** | Implementation | builder (Claude / DeepSeek) | Code, config, doc, dashboard — the actual change | DeepSeek (primary builder) |
| **P4** | Honest Recompute / Verification | builder | Re-derive every number from source-of-truth; prove no stubs / no synthetic data leaked | DeepSeek (verification) |
| **P5** | Self-Verify Card | bossman | `localhost:port 200` + `tailscale status` + `pm2 list` + `db integrity` + `verify_against` checklist all green | MiniMax-M3 (synthesizes) |

If the work is data-heavy and needs a separate "Decision" card (P2), promote
it to its own card. Otherwise P1 and P2 collapse into a single "Plan" card.

## Autonomous loop (how BossMan executes without asking)

BossMan runs the full loop **without midstream prompts** to Marcelo, EXCEPT
when one of the carve-outs below applies.

```text
1. Read parent card → load this skill
2. Create P1..P5 children (or N children if smaller pipeline)
3. P1 — M3 writes decision.md with options A/B/C + recommended choice
4. P2 — M3 finalizes decision.md (or Marcelo overrides via Telegram)
5. P3 — DeepSeek (or Claude) builds the change
6. P4 — DeepSeek verifies / recomputes from source-of-truth
7. P5 — M3 runs the self-verify checklist, attaches evidence
8. If P5 PASS + Step-5 QA PASS → report to Marcelo (one short message)
9. If P5 FAIL → fix and re-run (no report until PASS)
```

### When BossMan STOPS and asks Marcelo

BossMan asks ONLY when:

1. **Vendor / platform block** — credentials needed, third-party API
   blocking, GitHub permission error, payment-required step
2. **Real product decision that canon cannot resolve** — e.g. "should we
   charge $399 or $999" when the canon has no prior pricing
3. **Security-relevant change** (Approval Trigger #1 in SOUL) — install /
   remove / upgrade of system-level tools, public-port or domain changes,
   auth / data retention / encryption changes

Everything else, BossMan executes autonomously:
- "Which option?" — pick the recommended one from decision.md, log it
- "Is this a stub?" — verify against source-of-truth, log the answer
- "Did the verify pass?" — run it, attach the evidence, report PASS/FAIL
- "What if X breaks?" — write the rollback, log it, move on

## Step-5 QA verifier

Step-5 is **mandatory** on every pipeline. The verifier:

1. Reads the final implementation
2. Re-derives every claim from the source of truth (DB, config, doc)
3. Returns a structured verdict:
   - `verdict`: `pass` | `fail` | `needs_more_info`
   - `touches_sensitive`: `true` | `false`
   - `category`: `infra` | `auth` | `money` | `pii` | `secrets` | `public_api` | `data` | `ui` | `none`
   - `reasoning`: 1-3 sentences
4. On `fail` → BossMan fixes and re-runs Step-5
5. On `needs_more_info` → BossMan harvests more evidence, re-runs Step-5
6. On `pass` → BossMan reports "done" to Marcelo

**Step-5 model policy:**
- Money / trading / PII → DeepSeek (mandatory) or Claude (secondary)
- Infra / config / kanban → DeepSeek (primary) or Claude (secondary)
- UI / docs / cosmetic → MiniMax-M3 acceptable
- See `ai-model-routing` skill for the full routing map

## Self-verify card (P5) checklist

The P5 self-verify card MUST touch every surface the change affects.
The default checklist:

```bash
# 1. Service is up
curl -fsS -o /dev/null -w "%{http_code}\n" https://localhost:PORT/

# 2. PM2 process is online
pm2 list | grep <service>

# 3. Tailscale routing is alive (if exposed)
tailscale status | grep <hostname>

# 4. DB state matches expectation
sqlite3 <db> "SELECT count(*) FROM <table> WHERE <condition>"

# 5. No stubs / synthetic data
grep -r "TODO\|FIXME\|stub\|mock\|synthetic" src/ | head

# 6. Step-5 QA verdict = pass
cat <qa-verdict-file>.json | jq '.verdict'
```

If any of these fail, P5 fails. P5 failure blocks the "done" report.

## Self-audit rule (Permanent)

After every pipeline completes, BossMan self-audits:

1. **Was the deliverable actually achieved?** Not just "P1–P5 all done" —
   did the thing get done?
2. **Was Marcelo's time used well?** Could this have been faster, cheaper,
   or avoided entirely?
3. **Did BossMan know enough at the start?** If not, what should have been
   looked up first?
4. **Should this create a follow-up?** Is there residual risk, undone edge
   case, or adjacent problem?

If any answer is uncomfortable, write a memory entry and create a follow-up
kanban card rather than letting it drift.

## Companion skills

- `ai-model-routing` — Step-5 verifier model choice, Routing Ledger format
- `kanban-board-governance` — parent + child card structure, project tag rules
- `multi-phase-product-delivery` — n-phase delivery arc definition
- `kickoff-blueprint-intake` — Phase 1 governance lock for major projects
- `pm2-app-100pct-uptime` — PM2 + Tailscale + health-check + watchdog recipe
- `destructive-admin-safety` — irreversible / destructive operations
- `workflow-sanity-check` — P2 "challenge bad logic" + P5 "verify the flow makes sense" (not just that it runs)

## Canonical artifacts (where the templates live)

- `~/.hermes/templates/handoff-packet.md` — BossMan → sub-agent handoff structure
- `~/.hermes/templates/acceptance-criteria.md` — observable-check template
- `~/.hermes/templates/step5-verdict.json` — Step-5 verdict JSON shape
- `references/8-dim-autonomy-audit.md` — the 8-dimension audit checklist
  BossMan runs after any major governance change OR when a "is this still
  autonomous?" question surfaces

## When this skill applies (broad trigger list)

Use this skill for **any** non-trivial work item, including but not
limited to: new builds, existing builds, feature additions, refactors,
troubleshooting, audits, broken workflows, logic flaws, "works but bad
UX" corrections. The skill is the DEFAULT — it does not need an
explicit trigger from Marcelo. BossMan routes to this skill as soon as
a non-trivial item enters the queue.

**5-carve-out approval gate** (only reasons to escalate to Marcelo):
infrastructure install/upgrade, public-port or domain changes,
security-relevant behavior, vendor/API/billing, true product-direction
decisions unresolvable from existing canon. See SOUL § "AUTONOMOUS
REMEDIATION MODEL" for the full table.

**Chaining rule (Permanent — 2026-06-23):** BossMan may chain as many
consecutive execution cycles as needed to finish the assignment.
Iteration limits are NOT blockers. If a cycle cap is hit, write a
compact checkpoint + resume in the next cycle. Escalation is reserved
for the 5 carve-outs above, not for internal budget exhaustion.

## Proven on

- **PMD 4-property 2026-06-22** — schema/UI, decision, implementation, honest
  recompute, self-verify. All P1–P5 done. Step-5 PASS. Self-verify PASS.
- **Security Watch Phase 4 2026-06-23** — extended silent-by-default watch
  with DeepSeek QA + selective Telegram alert. Used modified 5-child shape
  (build → dry-runs → docs → verification).

## Pitfalls (observed 2026-06-22/23)

- **"All P1–P5 done" ≠ "deliverable done"** — track the actual artifact, not
  just card status
- **Self-verify must be its own card (P5)** — not a comment on P4
- **Step-5 QA must be a structured verdict file**, not a chat reply
- **Parent card must have `accept_when`** — without it, "done" is subjective
- **`verify_against` is a list of observable checks** — not a paragraph
- **Don't skip P4 honest recompute** — P3 + P5 with no P4 hides stub pollution
