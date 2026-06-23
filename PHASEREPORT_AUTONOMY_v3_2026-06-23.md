# PHASEREPORT — AUTONOMY-BY-DEFAULT OPERATING MODEL v3 (2026-06-23)

**Phase:** Operating-Model Formalization
**Date:** 2026-06-23
**Owner:** BossMan (autonomous) · Reviewer: Marcelo (approval gate)
**Card:** `t_0376eba5` (parent) · P1–P5 children (all done)
**Audit:** 8-dim autonomy audit PASSED 2026-06-23 (t_8458f5b5)

---

## TL;DR

Hermes is now **autonomous-by-default** for builds, refactors, troubleshooting, audits, broken logic, and bad-UX fixes. Marcelo remains the approval gate — but only for the **5 carve-out categories** below. Every non-trivial change runs through a **5-child PMD pipeline (P1–P5)** with a blocking Step-5 verifier gate. Iteration limits are NOT blockers — BossMan chains execution cycles until QA + P5 pass.

## 5 Carve-Outs (Marcelo approval required)

1. **Infrastructure install/remove/upgrade** — Homebrew, DBs, Caddy, Tailscale, PM2, OS tools, runtimes
2. **Public/VPN port or domain changes** — opening/closing/repointing anything reachable from outside the host
3. **Security-relevant behavior** — auth, retention, encryption, permissions, tokens, audit logging
4. **Vendor/API/billing** — paid API keys, SaaS subs, billing, vendor lock-in, contracts
5. **True product-direction** — pricing, target market, scope pivot, customer-facing positioning

Everything else: BossMan fixes, verifies, reports.

## 5-Child PMD Pipeline (Default Shape)

| Phase | Name | Owner | Exit criterion | Model |
|-------|------|-------|----------------|-------|
| P1 | Schema/UI | bossman | `verify_against` materialized, `accept_when` written | MiniMax-M3 |
| P2 | Decision | bossman | `decision.md` finalized (or recommended choice + gate) | MiniMax-M3 |
| P3 | Implementation | delegate or self | Source written, builds clean | DeepSeek |
| P4 | Honest Recompute | bossman | Re-run all checks, no fabricated data | MiniMax-M3 |
| P5 | Self-Verify | bossman | localhost + PM2 + DB + browser verified, `workflow-sanity-check` passed | MiniMax-M3 |

**P2 also challenges bad logic, not just broken code.** (2026-06-23 patch)
**Parent card schema:** `qa_required: yes` + `verify_against: [concrete checks]` + `accept_when: "Step-5 QA PASS + P5 self-verify PASS"`.

## New Canon Artifacts (2026-06-23)

| File | Layer | Purpose |
|------|-------|---------|
| `~/.hermes/SOUL.md` (1481 lines, 81KB) | Kernel | AUTONOMOUS REMEDIATION MODEL + AUTONOMOUS CHANGE PIPELINE + 5 carve-outs + challenge-bad-logic |
| `~/.hermes/AGENTS.md` (45KB, v3.0) | Kernel | Agent roles, model routing, verification standard |
| `~/.hermes/templates/handoff-packet.md` | Template | Canonical BossMan → sub-agent handoff structure |
| `~/.hermes/templates/acceptance-criteria.md` | Template | `accept_when` + P5 checklist template |
| `~/.hermes/templates/step5-verdict.json` | Template | Step-5 QA verdict JSON shape (verdict, category, touches_sensitive, confidence, evidence[]) |
| `~/.hermes/skills/autonomous-change-pipeline/SKILL.md` (11.7KB) | Skill | Default operating procedure for non-trivial change |
| `~/.hermes/skills/workflow-sanity-check/SKILL.md` (5.3KB) | Skill | 8-step UX/logic sanity test (catches "works but bad UX") |
| `~/.hermes/skills/troubleshooting-mode/SKILL.md` (patched) | Skill | Now cross-refs ACP + WSC |
| `~/.openclaw/agents/lbc35/SOUL.md` (v3.0, 81 lines) | Sub-agent | LBC35 must follow BossMan-owned model plan, no Perplexity Computer, no Step-5 override |

## Standing Rules (Effective 2026-06-23)

### "Challenge bad logic, not just broken code"
> When BossMan encounters a workflow that "works" technically but the user-flow or reasoning is bad, BossMan FIXES the workflow and verifies the corrected flow. Examples: button that opens an empty modal; form that 500s on submit; page that loads with no data and no error; route that 200s but returns the wrong shape. The fix is in scope. Verify with `workflow-sanity-check` skill.

### "BossMan never reports 'done' on non-trivial work without Step-5 verifier PASS + P5 self-verify card checked."
> This is the kernel rule. It applies retroactively and prospectively to every non-trivial change.

### "BossMan may chain as many execution cycles as needed to finish the assignment."
> Iteration exhaustion is NOT a reason to stop. Checkpoint → resume → continue until done.

### "BossMan is the only authorized status surface for Marcelo."
> No agent may send direct Telegram messages. OpenClaw gateway disabled. All status routes through BossMan.

## Operating Model Diagram

```
        ┌─────────────────────────────────────────────┐
        │   Marcelo (approval gate — 5 carve-outs)   │
        └────────────────────┬────────────────────────┘
                             │ (only on carve-out)
                             ▼
        ┌─────────────────────────────────────────────┐
        │   BossMan (orchestrator + QA + verifier)    │
        │   MiniMax-M3 default · DeepSeek impl ·      │
        │   Claude high-stakes review                 │
        └────┬──────────────────────┬─────────────────┘
             │                      │
             ▼                      ▼
   ┌─────────────────┐    ┌──────────────────────┐
   │ 5-Child Pipeline│    │   LBC35 / sub-agents │
   │ P1→P5 w/ Step-5 │    │  (delegated executors)│
   └─────────────────┘    └──────────────────────┘
             │                      │
             └──────────┬───────────┘
                        ▼
            ┌───────────────────────┐
            │ Artifacts (templates, │
            │ skills, memory, kanban)│
            └───────────────────────┘
```

## Verification Recipe (for every non-trivial change)

1. **Pre-flight**: Create parent kanban card with `qa_required: yes`, `verify_against: [...]`, `accept_when: "Step-5 PASS + P5 PASS"`.
2. **P1 Schema/UI**: Define inputs, outputs, edge cases. Materialize `verify_against` as concrete checks.
3. **P2 Decision**: Write `decision.md`. If multiple options, recommend one + escalate. Challenge bad logic.
4. **P3 Implementation**: Build. If code, DeepSeek. If config, self. If research, Perplexity.
5. **P4 Honest Recompute**: Re-run all P1 checks. No fabricated data. No "test numbers" stubs.
6. **P5 Self-Verify**: localhost curl + PM2 status + DB query + browser snapshot. All must pass. `workflow-sanity-check` if UI involved.
7. **Commit + Sync**: Update Hermes canon, mirror to Obsidian + GitHub, push.
8. **Report**: ONE concise message to Marcelo. Only on QA+P5 PASS.

## What This Audit Did (today)

| Step | Artifact | Status |
|------|----------|--------|
| 1 | Herme canon: SOUL.md §73-79 patched (challenge bad logic + 2 carve-outs) | ✅ |
| 2 | Hermes canon: AGENTS.md verified v3.0 | ✅ |
| 3 | Templates created: handoff-packet, acceptance-criteria, step5-verdict.json | ✅ |
| 4 | Skills created/updated: autonomous-change-pipeline, workflow-sanity-check, troubleshooting-mode | ✅ |
| 5 | LBC35 SOUL updated to v3.0 (no model pick, no Perplexity Computer, no Step-5 override) | ✅ |
| 6 | Memory updated (8-dim audit PASS line) | ✅ |
| 7 | 8-dim autonomy audit (separate card t_8458f5b5) PASSED | ✅ |
| 8 | This doc-sync pass to Obsidian + GitHub (t_0376eba5) | ✅ |

## Next Review Trigger

Re-run this audit when:
- A new carve-out category emerges
- A new template is added to the canon
- A failure mode appears where BossMan acted outside the 5 carve-outs without approval
- Quarterly review (every 90 days)