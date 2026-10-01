
> **[HISTORICAL — 2026-09-30]** Archived / incident document. LBC35/OpenClaw delegator retired per card `t_735da189`. Preserved as-is for context.
# Implementation Card: Delegation Standards v1.0

**Card ID:** `t_delegation_standards_parallel_ops_v1`
**Date:** 2026-08-19
**Agent:** ops
**Status:** ACTIVE ✅

---

## Purpose

Formalize two standard practices using Hermes v0.20.4's verified delegation capacity, without altering the v3 architecture. This card is the governing reference for all delegation patterns in the ops lane.

---

## Architecture Constraints (Permanent)

| Rule | Detail |
|---|---|
| **Orchestrator** | BossMan is the sole orchestrator, integrator, and status surface to Marcelo. All delegation originates from BossMan. |
| **Executor scope** | Child agents are scoped executors only — they receive a goal, execute, and return. |
| **No recursive delegation** | Children must not call `delegate_task`. Violations: stop + escalate to BossMan. |
| **No workstream creation** | Children must not create cron jobs, kanban cards, or new job definitions. |
| **No infra modification** | Children must not modify PM2, cron, LaunchAgents, or environment config. |
| **No Marcelo contact** | Children must not send messages, emails, or notifications to Marcelo or external parties. |
| **No routing changes** | Children must not alter Telegram routing, model routing, or platform configuration. |
| **No new components** | No vendors, webhooks, plugins, channels, or OpenClaw gateway activation via delegation. |

---

## Practice 1: Parallel Verification Bundles

**Trigger:** Any meaningful change — config edits, script deployments, service restarts, cron changes, skill updates, or cross-service releases.

**Pattern:** BossMan spawns N read-only health-check children in parallel, each scoped to one surface, waits for all results, aggregates, and reports.

**Concurrency rules:**
- Normal operations: **2–4 concurrent children**
- Exceptions (documented in the trigger card):
  - **Audit/outage:** up to 8
  - **Cross-service release:** up to 8
  - **Rationale must be written on the trigger card before spawning**

**Standard bundle (read-only, no infra changes):**

| # | Child Scope | Toolset | Expected output |
|---|---|---|---|
| 1 | Gateway health + Telegram routing | terminal, file | `state=running`, Telegram polling confirmed |
| 2 | Cron status (job count + next run) | terminal | `N active jobs`, no new failures |
| 3 | PM2 process health (all 5 services) | terminal | `5/5 online`, no restart loops |
| 4 | Doctor (config + runtime) | terminal | `Config version up to date`, 0 config issues |
| 5 | Delegation smoke test | delegate_task (parent only) | Child lifecycle confirmed |
| 6 | Disk/memory系统性健康 | terminal | No OOM, disk not near capacity |

**Verification bundle protocol:**
1. BossMan writes trigger card (what changed, why, expected impact)
2. BossMan spawns bundle with explicit concurrency count in context
3. Each child returns structured output: `CHECK_NAME: PASS/FAIL | detail`
4. BossMan aggregates results; any FAIL triggers escalation path
5. Evidence logged on trigger card
6. Bundle result: `PASS` (all green) or `FAIL-with-FIX` (any red)

---

## Practice 2: Scoped Parallel Incident Triage

**Trigger:** Service down, cron failure alert, PM2 restart loop, or degraded health check.

**Pattern:** BossMan spawns 2–4 scoped diagnostic children in parallel, each investigating one failure surface independently. BossMan owns the integrate-and-decide step.

**Concurrency:** Up to 4 for active incident (no concurrency cap during declared outage per card `t_outage_YYYYMMDD`).

**Scoped diagnostic bundle:**

| # | Child Scope | Toolset | Scope limit |
|---|---|---|---|
| 1 | PM2 logs + process state | terminal, file | Read-only; no restart commands |
| 2 | Cron job logs (failing job only) | terminal, file | Read-only; no job modification |
| 3 | Service health endpoint | terminal, web | Read-only HTTP check only |
| 4 | Gateway logs (error patterns) | terminal, file | Read-only; no gateway restart |

**Triage protocol:**
1. BossMan declares incident card `t_outage_YYYYMMDD` (one line)
2. BossMan sets concurrency context: `OUTAGE_MODE=true` (removes 4-child cap)
3. Each child: investigate scope → return structured `DIAGNOSTIC: surface | finding | recommendation`
4. BossMan integrates findings, decides fix/rollback/escalate
5. Fix applied by BossMan or scoped ops action — NOT by child agents
6. Post-fix verification via Practice 1 bundle
7. Incident card closed with root cause + resolution logged

---

## Delegation Concurrency Reference

| Context | Max concurrent children |
|---|---|
| Normal operations | **4** (soft cap) |
| Parallel verification bundle | **4** (standard) |
| Scoped incident triage | **4** (up to 6 with documented reason) |
| Declared outage/audit | **8** (with card) |
| Cross-service release | **8** (with card) |
| Recursive delegation | **0** — forbidden |

---

## Safe Read-Only Health Bundle (Test)

Executed: 2026-08-19 10:18 (post-gateway-restart PID 96887, v37 config)
Concurrency: 4 (standard verification bundle — within 4-child normal-ops cap)
Purpose: Validate delegation standards + confirm post-upgrade system health
Children completed in: 4.5s–9.7s (all within single tick window)

| Child | Scope | Result | Duration |
|---|---|---|---|
| Child 1 | Gateway + Telegram routing | ✅ `state=active`, Telegram polling, last activity 10:17 | 7.84s |
| Child 2 | Cron status | ✅ 37 active jobs | 4.85s |
| Child 3 | PM2 all services | ✅ 5/5 online | 4.47s |
| Child 4 | Hermes doctor | ✅ `Config version up to date (v37)` (3 cosmetic non-config issues) | 9.73s |

**Bundle verdict: ✅ ALL PASS**

Evidence (structured child output):
- `GATEWAY: PASS | running (state=active), Telegram connected/polling (last activity 10:17), no errors in errors.log`
- `CRON: PASS | 37 active jobs`
- `PM2: PASS | 5/5 online`
- `DOCTOR: PASS | Config version up to date (v37)` (3 non-config cosmetic issues: npm advisories + optional API keys — not config/schema issues)

**Delegation standards validated:**
- 4 children in parallel ✅
- All scoped to read-only ✅
- All returned structured output ✅
- No child modified infra, created workstreams, or recursively delegated ✅
- Concurrency within normal-ops cap (≤4) ✅

---

## Change Log

| Date | Version | Change |
|---|---|---|
| 2026-08-19 | v1.0 | Initial — parallel verification bundles + scoped incident triage |
