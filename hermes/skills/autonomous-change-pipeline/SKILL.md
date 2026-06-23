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
  NOT for: trivial one-liner edits, dry-runs, single-card bug fixes, or any work where
  Marcelo wants to drive step-by-step. Doc-sync variant: see `references/doc-sync-as-acp.md`.
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
| **P1** | Schema / UI (or **Map** for audits) | bossman | `decision.md` (options, evidence, recommended choice) + `schema/UI sketch`; **for audits: full enumeration of every target file with sizes/mtimes** | MiniMax-M3 (writes decision.md) |
| **P2** | Decision (or **Methodology** for audits) | bossman | `decision.md` finalized with Marcelo's call OR a recommended choice with `## Marcelo approve` gate; **for audits: 6 finding classes + priority scoring rules** | MiniMax-M3 |

**P2 also challenges bad logic, not just code.** If the existing workflow
is broken or doesn't make sense as a user flow, P2 includes a "fix the
flow" recommendation, not just a "fix the code" recommendation. Use
the `workflow-sanity-check` skill to verify the candidate flow.
| **P3** | Implementation (or **Execute Audit** for audits) | builder (Claude / DeepSeek) | Code, config, doc, dashboard — the actual change; **for audits: read every target, classify into 6 finding classes, log raw findings to kanban** | DeepSeek (primary builder) |
| **P4** | Honest Recompute / Verification | builder | Re-derive every number from source-of-truth; prove no stubs / no synthetic data leaked; **for audits: re-verify every P0-severity finding independently, withdraw false positives explicitly** | DeepSeek (verification) |
| **P5** | Self-Verify Card | bossman | `localhost:port 200` + `tailscale status` + `pm2 list` + `db integrity` + `verify_against` checklist all green; **for audits: operator-ready report grouped by finding class + P0/P1/P2 cleanup plan + cron recommendation** | MiniMax-M3 (synthesizes) |

## Audit work_type (work_type: audit)

When the kanban card's `work_type: audit`, the pipeline still uses P1-P5 but each phase has audit-specific output. Proven 2026-06-23 (Documentation Integrity Audit, parent `t_722c291d`, 9 findings / 4 P0 / 4 P1 / 1 P2).

**Phase mapping for audits:**

| Phase | Build-class output | Audit-class output |
|---|---|---|
| P1 | decision.md | **Audit universe map** — every target file with size/mtime |
| P2 | decision.md finalized | **6 finding classes + priority scoring** (see below) |
| P3 | code/config/docs | **Read every target, classify, log raw findings** |
| P4 | recompute numbers | **Re-verify P0 findings independently; withdraw false positives explicitly** |
| P5 | self-verify checklist | **Operator-ready report + cleanup plan + cron recommendation** |

**The 6 finding classes** (use this exact taxonomy when reporting):

1. **clean/no-action** — verified good, no work needed
2. **needs-wording-cleanup** — content drift, fix in place
3. **wrong-location** — file is canon but lives at wrong path
4. **stale-mirror** — mirror (Obsidian/GitHub) is out of sync with canon
5. **duplicate/merge** — content exists twice, collapse or repoint
6. **missing-phasereport-or-xref** — gap in audit log or in cross-refs

**Priority scoring:**

- **P0** — kernel canon inconsistent with itself, or P0-class safety/correctness drift (fix before next non-trivial work)
- **P1** — stale mirror, missing PHASEREPORT, missing STOP conditions on workflow skills (within the week)
- **P2** — cosmetic / on-demand / next-quarter

**P4 false-positive discipline** (critical for honest audits): every audit MUST include a P4 pass that re-verifies P0-severity findings from raw evidence. When a P3 finding turns out to be wrong on re-verify, withdraw it explicitly in the report — do NOT silently drop. Example: the 2026-06-23 doc-integrity audit initially flagged "templates handoff-packet.md and acceptance-criteria.md missing from `~/.hermes/templates/`" — P4 re-verify confirmed both files existed (2,633b and 2,950b); both findings withdrawn.

For the full audit recipe, see `references/doc-integrity-audit.md` (Documentation Integrity Audit playbook — proven 2026-06-23).

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
- **Doc-Sync Persistence Pass 2026-06-23** (parent `t_0376eba5`, commit
  `4ba2aa6`) — autonomy-by-default operating model v3 mirrored to Hermes
  canon + Obsidian + GitHub. Doc-sync variant documented in
  `references/doc-sync-as-acp.md`.
- **Documentation Integrity Audit 2026-06-23** (parent `t_722c291d`, 9
  findings / 4 P0 / 4 P1 / 1 P2) — first audit-class run. P4 false-positive
  discipline caught 2 phantom template-missing findings. Audit recipe in
  `references/doc-integrity-audit.md`.

## Pitfalls (observed 2026-06-22/23)

- **"All P1–P5 done" ≠ "deliverable done"** — track the actual artifact, not
  just card status
- **Self-verify must be its own card (P5)** — not a comment on P4
- **Step-5 QA must be a structured verdict file**, not a chat reply
- **Parent card must have `accept_when`** — without it, "done" is subjective
- **`verify_against` is a list of observable checks** — not a paragraph
- **Don't skip P4 honest recompute** — P3 + P5 with no P4 hides stub pollution
- **`hermes kanban comment` heredoc-embedded `$(...)` fails with "Could not
  determine home directory"** — the shell expands `$(...)` before the comment
  payload reaches the kanban CLI. Fix: write the comment to `/tmp/foo.md`
  first, then `hermes kanban comment <id> "$(cat /tmp/foo.md)"`. Discovered
  on doc-integrity audit 2026-06-23.
- **Audit-class: false positives must be WITHDRAWN, not silently dropped** —
  P4 honest recompute re-verifies every P0-severity finding. If a P3
  finding fails re-verify, log it as "WITHDRAWN as false positive" in the
  P4 report. Future audits must not re-flag what was already disproven.
- **`hermes kanban complete` returns "unknown id or terminal state" when the
  card is still `todo`** — must `promote --force` first. Error message is
  misleading (it says "unknown id" but the ID is fine; the state isn't).
  Sequence: `promote --force` → `complete`. Hit twice in 2026-06-23 audit.
- **macOS case-insensitive filesystem produces silent duplicate files when
  Obsidian sync writes lowercase names** — symptom: `~/.hermes/knowledge/`
  accumulates case-different pairs (e.g., `APPROVAL_POLICY.md` +
  `approval_policy.md`) that are byte-identical. Detection:
  `scripts/detect-case-dup-pairs.sh` (bundled). Always dedup at P4 of any
  doc-integrity audit.
- **Patched 2026-06-23: detect-case-dup-pairs.sh false-positive bug** — on
  macOS HFS+/APFS, `[ -f "$lower" ]` returns true even when the lowercase name
  resolves to the SAME inode as the uppercase (case-insensitive lookup). The
  script then counts a "pair" for a single physical file. **Fix in place:**
  the script now compares inodes (`stat -f%i upper == stat -f%i lower`)
  before counting a pair. Same inode → skip. **Implication:** always re-run
  the patched script after a cleanup pass and trust inode-based stats, not
  name-based `[ -f ]` checks.
- **macOS case-insensitive deletion trap (critical, 2026-06-23)** — `rm
  lowercase` on HFS+ SILENTLY DELETES the uppercase twin (same inode). This
  is how 3 critical canon files (SERVICES_MAP.md, BLOCKER_RESOLUTIONS.md,
  PHASEREPORT_DOC_FIXES_2026-06-23.md) were accidentally lost during the
  Phase 1 cleanup pass — recovered from BossMan/docs/ mirror. **Safety rule
  for future case-dup deletions:** (1) ALWAYS commit to git FIRST so the
  twin is in version control; (2) verify with `stat -f%i` that the two
  names actually have DIFFERENT inodes before deleting; (3) if in doubt,
  `mv lowercase tempfile && rm tempfile && mv uppercase lowercase` to
  atomically rename; (4) re-check md5 of every "deleted" file's canonical
  twin immediately after the rm batch; (5) never delete more than 10 files
  in a batch without an `ls` + md5 round-trip in between.
