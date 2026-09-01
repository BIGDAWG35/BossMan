# QA Auto-Invocation Specification (Permanent 2026-09-01)

**Status:** CANONICAL — QA ENFORCEMENT
**Date:** 2026-09-01
**Card:** `t_v33_v34_verified_recovery_install_v1_20260901`
**Companion:** `LEARNED_7_RULE_CONTRACT.md` Rule #9 (Step-5 verification), Rule #10 (operator contract)

> **Step-5 QA is mandatory for cards touching money, trading, auth, infrastructure, PII, customer-facing surfaces, or public APIs.** This file is the canonical specification of when QA is auto-required, what blocks closure, and how failures route.

---

## 1. qa_required triggers (auto)

A card automatically requires QA if it touches **any** of:

| Domain | Examples | Severity |
|---|---|---|
| Money paths | Stripe, Square, Coinbase, bank APIs, balance reads, payout flows | CRITICAL |
| Trading | Bot config, position sizing, PAPER_MODE toggle, exchange orders, strategy changes | CRITICAL |
| Auth | OAuth flows, token rotation, session handling, login walls, 2FA changes | CRITICAL |
| Infrastructure | PM2, cron, gateway, port mapping, service restart, deploy, secret rotation | HIGH |
| PII | Customer data reads/writes, KYC fields, free-text customer notes | HIGH |
| Customer-facing interfaces | Pricing pages, ToS, refund policy, public dashboards, support forms | HIGH |
| Public APIs | Any outbound HTTP to a third-party service that requires authentication or has rate limits | MEDIUM |

If any trigger matches, `qa_required: yes` is set on the kanban card **before** work begins.

## 2. qa_status states

| State | Set by | Means |
|---|---|---|
| `not_required` | BossMan at intake | No qa_required trigger matched |
| `pending` | BossMan at intake | qa_required matched; QA has not yet run |
| `running` | qa-verification lane | QA in progress |
| `pass` | qa-verification lane | Verdict file emitted with PASS |
| `pass-with-fix` | qa-verification lane | Verdict PASS with follow-up card created |
| `fail` | qa-verification lane | Verdict FAIL; auto-routes to internal remediation card |
| `blocked` | qa-verification lane | QA could not run (vendor block); escalate per V3 |

## 3. Closure rule

A card closes (`status: done`) **only** when:
- `qa_required: no`, OR
- `qa_required: yes` AND `qa_status ∈ {pass, pass-with-fix}`

`qa_required: yes` AND `qa_status ∈ {pending, running}` **blocks closure**. This is a Rule #10/Rule #12 anti-recursion guarantee — the card cannot silently bypass QA.

## 4. Model selection

QA model selection follows `LEARNED_V3_MODEL_STACK.md`:
- **DeepSeek** (default) — runtime/infra checks, log inspection, sqlite3 verification, smoke tests
- **Claude** (safety-sensitive) — money paths, auth, PII, customer-facing terms, anything that touches production state
- **MiniMax-M3** (cosmetic) — UI/UX checks, layout verification, visual smoke

QA lane does **not** change model selection. The rule above is read from the same canon as Rule #11 rung 2.

## 5. Failure path

A `qa_status: fail` does not close the card. It auto-creates `drift-fix: qa-fail-<short-desc>` and reopens the parent card with the failure evidence attached. The parent card's only path to `done` is a re-run producing `pass` or `pass-with-fix`.

## 6. Drift signals

- Card closes with `qa_required: yes` AND `qa_status: pending` (Rule #10/Rule #12 violation)
- Verdict file missing on a `pass`/`fail` status
- QA was performed but the verdict file is older than the latest card change (stale QA)
- `pass-with-fix` was emitted but no follow-up card was created

---

*Drafted 2026-09-01 PDT under card `t_v33_v34_verified_recovery_install_v1_20260901`. Effective on commit.*