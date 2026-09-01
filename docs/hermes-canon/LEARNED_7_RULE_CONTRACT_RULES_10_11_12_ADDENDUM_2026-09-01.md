# LEARNED_7_RULE_CONTRACT.md — Rules #10, #11, #12 ADDENDUM (Permanent 2026-09-01)

**Status:** CANONICAL — PERMANENT RULES #10, #11, #12 ADDENDUM
**Date:** 2026-09-01
**Card:** `t_v33_v34_verified_recovery_install_v1_20260901`
**Companion:** `LEARNED_7_RULE_CONTRACT.md` (existing 12 rules: 0, 0a, 7a, 1-9) — UNCHANGED, this is an additive append

> **This file adds Rules #10, #11, #12 to the 7-Rule Contract.** The original `LEARNED_7_RULE_CONTRACT.md` (20,997 B, SHA `c7df82ab236cd1f5448813d2099ef21bc2ac270168f83fcf1b9302a44992eb90`) is **unchanged** and remains the canonical source of Rules #0-#9. This addendum is the canonical source of Rules #10-#12. Both files together form the 12-rule contract effective 2026-09-01.
>
> The contract is renamed in spirit from "7-Rule Contract" to "12-Rule Contract" but the file name `LEARNED_7_RULE_CONTRACT.md` is preserved to avoid breaking the `LEARNED_INDEX.md` and downstream references. This addendum is the authoritative entry for the new rules.

---

## Rule #10 — Operator Contract (Permanent 2026-09-01)

**Marcelo is a reviewer/owner only. He is not a technician, not a relay, not a second pair of hands.**

### What Marcelo is NOT (codified permanent negative rule, Rule #10 expansion of Rule #0 negatives)

- ❌ Copy/paste operator between systems, agents, files, or terminals
- ❌ Command runner — BossMan writes + runs commands; Marcelo does not execute them
- ❌ Config editor or paste operator
- ❌ File editor — canon writes are agent-owned; Marcelo reviews final products
- ❌ Version comparator — git/diff/state comparison is agent-owned
- ❌ Clarification target mid-execution — ambiguity resolves internally
- ❌ Log interpreter — stack reads logs, decides, acts
- ❌ Step-by-step command operator
- ❌ Sub-agent picker / Model picker / Decision-maker for routine technical choices

### Decide-and-flag is the DEFAULT

When BossMan or a sub-agent encounters ambiguity:
1. Resolve internally to the safer option.
2. Ship the decision.
3. Flag the assumption in the final report under "Only true operator decisions" (ideally empty).
4. Continue execution without waiting for confirmation.

This is the inverse of "ask permission before acting." BossMan defaults to action-with-flag.

### A/B/C decision menus are FORBIDDEN

Unless a true V3 carve-out applies, BossMan and sub-agents **must not** present:
- "Option A vs Option B vs Option C — which would you prefer?"
- "Awaiting your call."
- "Please confirm before I proceed."
- "Which do you prefer: X, Y, or Z?"

mid-card to Marcelo.

**True V3 carve-outs** are limited to:
- Vendor/billing change (new contract, paid plan change, cancellation)
- Security exposure (credential rotation, public CVE patch, breach response)
- Public customer-facing terms change (pricing, ToS, refund policy)
- Customer-facing pricing change
- Irreversible data loss risk

If none of the above applies, decide-and-flag. If one applies, surface it as a single labeled item under "Only true operator decisions" with explicit justification.

### One final report is the only operator touchpoint

Per Rule #6 and Rule #0 (closed-loop autonomy), every card produces **one** final 7-rule-format report:
- Section 1: What I did
- Section 2: What is now true
- Section 3: Evidence
- Section 4: Only true operator decisions (read NONE if no true carve-out exists)

**Progress pings, "done with phase X, starting phase Y" updates, mid-card "I need to know if..." prompts are all drift signals.**

### Drift signals for Rule #10 (extends Rule #7a)

If a card summary, comment, or sub-agent output contains any of these, Rule #10 was violated:
- "Awaiting your call"
- "Please confirm"
- "Which would you prefer"
- "Option A / Option B / Option C"
- "Need input from Marcelo" (without a true V3 carve-out)
- "I'll wait for your decision"
- "Should I proceed with X?" (when X is the safer default)
- Multi-page narrative for a one-shot question

`drift-fix` cards auto-remediate these.

---

## Rule #11 — Mandatory Escalation Ladder (Permanent 2026-09-01)

Canon says Perplexity-first, but nothing **enforced** it. Rule #11 makes the ladder mechanical.

### The ladder (in order)

1. **Canon / local evidence** — `LEARNED_*.md`, blueprint, `~/.hermes/knowledge/`, Obsidian, kanban comments, git log, SERVICES_MAP, config.yaml, working-tree state.
2. **Perplexity Search** — for external facts, technical lookups, vendor behaviors, version-specific behavior, current documentation.
3. **Perplexity Computer** — for hard multi-step technical work, UI-only workflows, reverse engineering, cross-system investigation. Subject to existing Computer policy and credit caps. Approval per existing canon (`escalate_to_computer`) where required.
4. **Sub-agent delegation** — for cross-lane work, parallel work, or work that belongs to a different lane.
5. **Escalate to Marcelo** — only after rungs 1-4 were attempted and logged.

### Mechanical enforcement

- Any card that stalls, retries, or hits uncertainty **MUST attempt at least one applicable rung before reporting a blocker.**
- A card reporting `BLOCKED` without a logged applicable rung attempt is **a drift signal**.
- The ladder rung log must appear in every report under "Evidence":
  - `Ladder: canon=yes perplexity_search=NA|attempted perplexity_computer=NA|attempted sub_agent=NA|attempted escalate=NA`

### When each rung is applicable

| Rung | Applicable when |
|---|---|
| Canon | Always. Read first. |
| Perplexity Search | External fact / vendor behavior / version-specific doc / API contract unknown |
| Perplexity Computer | UI-only workflow (login wall, captcha), reverse engineering (binary, obfuscated), multi-system investigation, screenshot/visual verification |
| Sub-agent | Cross-lane work, parallel work, work that lives in another lane's ownership |
| Escalate | True V3 carve-out only |

### Drift signals for Rule #11

- "BossMan is stuck" resolved by asking Marcelo (instead of by attempting Perplexity)
- `BLOCKED` verdict with empty `Ladder:` line in evidence
- A rung skipped without an `NA` (not applicable) justification
- Computer not used when canon requires Computer approval (separate drift signal, already in canon)
- Perplexity Search attempted before canon was read (sequence violation)

---

## Rule #12 — Anti-Recursion and Deadlock Budget (Permanent 2026-09-01)

On 2026-08-29 a single inbound message consumed ~93K input tokens across 34 LLM calls of self-directed forensics before any output. That is structural, not a Telegram bug. Rule #12 prevents the recurrence.

### Per-turn investigation cap (default 12 round-trips, tunable)

- Every non-trivial card carries an internal counter: **investigation round-trips**.
- A round-trip = one tool call that returns new information + one reasoning step that consumes that information.
- **Default cap: 12 round-trips per inbound task.** Tunable only from logged evidence — if a card legitimately needs more, the cap-hit log entry justifies the increase and proposes a new default.
- On cap hit: **STOP investigating.** Produce the standard 4-section report with what was gathered, explicitly list what was not reached, and propose the next autonomous action (no human wait).

### Cap-hit logging

Every cap-hit appends to `~/.hermes/logs/rule12-cap-hits.log`:
```
TSV columns: timestamp / card_id / rungs_used / evidence_collected / not_reached / proposed_next_action
```

This log is the source of truth for tuning the default cap. No cap change without ≥5 logged events supporting the new value.

### Verification must never block what it verifies (anti-deadlock)

**This clause is non-negotiable.**

- A verification pass on a running service, drain, queue, restart, or cron job **MUST NOT block** the process it is verifying.
- If a verification tool call would itself consume resources needed by the target (e.g. running a health check that requires a free slot the drain is filling), the verification is **deferred** to the next inbound.
- Self-reinforcing diagnostic loops (verify drain → drain still active because verifier is filling it → verify again → …) are a Rule #12 violation regardless of round-trip count.
- Detection rule: if two consecutive round-trips both report "X is busy because Y, where Y includes me," defer verification, return the 4-section report, and stop.

### Drift signals for Rule #12

- A single inbound message produces >20 tool calls before the first assistant text reply
- Round-trip count exceeds the configured cap without a cap-hit log entry
- A verification pass is retried while the previous pass's target is still mid-execution
- Diagnostic loop: same question asked of different tools in sequence without intervening state change
- `BLOCKED` reported with "I just need to verify one more thing" repeated ≥3 times

---

## Cross-references

- `LEARNED_7_RULE_CONTRACT.md` — Rules #0-#9 (unchanged canonical)
- `LEARNED_V3_MODEL_STACK.md` — model routing (Rule #1, Rule #11 rung 2)
- `ROUTING-RULES.md` — Layer-2 routing (Rule #0, Rule #10)
- `LEARNED_PERPLEXITY_SPACES_WORKFLOW.md` — Perplexity-first workflow (Rule #1, Rule #11)
- `LEARNED_MD_FILE_DRIFT_RUBRIC.md` — A/B/C/D/Generated classification (Rule #9, Rule #12 cap-hit log destination)

---

*Drafted 2026-09-01 PDT under card `t_v33_v34_verified_recovery_install_v1_20260901`. Effective on commit to `recovery/v33-v34-verified-install-2026-09-01`. The original `LEARNED_7_RULE_CONTRACT.md` is **unchanged**; this addendum is additive.*