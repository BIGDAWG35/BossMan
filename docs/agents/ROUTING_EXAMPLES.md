# Agent OS — Light Routing Examples (v3)

**Date:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** ADDITIVE — illustrative only. **NOT** a change to v3 routing rules.
**Authority:** This document is advisory. v3 routing in `~/Desktop/V3/agent-os/Routing Rules — v3.md` is the source of truth.

---

## Purpose

When a kanban card arrives on `agent-os` or `bossman`, and a lane is the natural home, which lane should pick it up? These examples are non-binding — BossMan may still route differently based on context, but they encode the default mental model so lane pickup doesn't require a fresh decision every time.

**Hard rule (unchanged):** all routing still flows through BossMan. Lanes do NOT self-route. These examples guide **BossMan's** dispatch decision.

---

## Routing Examples

### Example 1 — "Add a new dashboard widget to money-pipeline"
- **Lane:** `builder` (code change, test cycle).
- **Cross-lane pull:** `qa-verification` for Step 5 verification (it's user-visible, not money-touching, so QA is light).
- **BossMan overlay:** none — within builder scope.
- **What `trading` should NOT do:** pick this up. It's not a market or bot change.

### Example 2 — "Binance bot threw an error, balance looks wrong"
- **Lane:** `trading` (audit, balance review).
- **Cross-lane pull:** `ops` runs the PM2 restart / log pull; `qa-verification` does post-mortem if a fix shipped.
- **BossMan overlay:** **execution only**. Trading lane audits; BossMan / Marcelo decides whether to restart, refund, or roll back.
- **What `builder` should NOT do:** pick this up and start "fixing" without BossMan approval — trading has its own audit skill.

### Example 3 — "Cron job 5f3569ba2813 is spamming the wrong channel"
- **Lane:** `loop-engineering-goals` (loop shape, output design).
- **Cross-lane pull:** `ops` for the immediate silencing; `kanban-board-governance` for the standing rules.
- **BossMan overlay:** none for the design fix; `ops` can pause the cron autonomously (PM2 restart scope).
- **What `builder` should NOT do:** rewrite the cron script without involving loop-engineering.

### Example 4 — "I read about a new indicator and want to learn it"
- **Lane:** `self-improvement-curriculum` (curriculum design, stage breakdown).
- **Cross-lane pull:** `research-intel` for source-vetting the indicator's provenance; `trading` if the indicator is trade-relevant (review template only, not execution).
- **BossMan overlay:** approves the curriculum shape; the lane does the breakdown.
- **What `ops` should NOT do:** start a cron for "track the indicator" — that's premature automation.

### Example 5 — "Skill `xyz` is getting bloated — should we split it?"
- **Lane:** `knowledge-canon-reuse` (taxonomy, consolidation).
- **Cross-lane pull:** the lane that owns `xyz` (per `LANE_SKILL_MAP.md`) for context on use cases.
- **BossMan overlay:** none — within knowledge-canon scope.
- **What `builder` should NOT do:** rewrite the skill unilaterally.

### Example 6 — "Service is up but response is 5xx 30% of the time"
- **Lane:** `ops` (incident response).
- **Cross-lane pull:** `qa-verification` after fix ships (post-incident review).
- **BossMan overlay:** none for the autonomous fix per June 9 rules; notifies Marcelo only if fix is non-routine.
- **What `trading` should NOT do:** pick this up just because the service is `binance-bot` — ops owns infra.

### Example 7 — "Verify the new Altus Forensic v2 schema doesn't break Stage 2"
- **Lane:** `qa-verification` (mandatory v3 Step 5 — schema migration, data integrity).
- **Cross-lane pull:** `ops` if migration touches live DB (`destructive-admin-safety` skill is required); `research-intel` for any external vendor/format questions.
- **BossMan overlay:** must approve any destructive DB op (not in devops autonomous scope).

---

## Routing Anti-Patterns

These are common misroutes to avoid:

| Symptom | Wrong Lane | Right Lane | Why |
|---|---|---|---|
| Adding a log line to debug an outage | `builder` (premature code change) | `ops` first (`troubleshooting-mode`) | Investigate before editing. |
| Writing a "how to trade X" doc | `content` (it's content) | `trading` (domain accuracy) + `content` for voice | Domain accuracy > prose. |
| Splitting a bloated skill | `builder` (code editing) | `knowledge-canon-reuse` (taxonomy) | Skill body is canon, not just code. |
| Refreshing v3 `AGENTS.md` | `knowledge-canon-reuse` alone | BossMan approval gate, then `knowledge-canon-reuse` | v3 canon is above lane scope. |

---

## When Routing is Ambiguous

Default order (per v3):
1. **Money / auth / infra / trading / public API** → `qa-verification` mandatory Step 5.
2. **Domain expertise required** → that domain lane first; `builder` later if code change follows.
3. **Knowledge canonization** → `knowledge-canon-reuse` (never inline-edit a canon doc).
4. **Loop design** → `loop-engineering-goals` (then `ops` for execution).
5. **Pure code change** → `builder` (with QA per #1 if scope warrants).
6. **Pure copy / design** → `content`.
7. **Genuinely unclear** → BossMan decides. No lane self-routes.

---

## Card-Body Routing Header (per Activation directive, 2026-06-18)

Every new lane-tagged card's body MUST start with this exact 2-line block, no prose before it:

```
lane: <one-of-9>
why: <one-line reason this lane owns it>
```

Valid `<one-of-9>` values: `builder`, `content`, `ops`, `trading`, `self-improvement-curriculum`, `loop-engineering-goals`, `qa-verification`, `research-intel`, `knowledge-canon-reuse`.

- The 9 lane-intro cards on `agent-os` are exempt (they ARE the lanes, not work for the lanes).
- When the card has cross-lane pull (e.g. `trading` audits + `ops` restarts), put the primary lane on `lane:` and the cross-lane work in the body.
- `why:` must answer "why this lane, not another?" — not just "what lane". Example:
  - ❌ `why: handles trading` (describes the lane)
  - ✅ `why: needs domain accuracy + per-bot balance audit before restart` (explains the pick)

This header is enforced by BossMan at card-creation time. Lanes do not enforce it.

---

## Cost-Capture Rule (knowledge-canon-reuse)

Per `knowledge-canon-reuse` lane canon: **no reusable paid-model result stays chat-only.**

If a card uses paid models AND produces output reusable beyond the card itself, the artifact MUST be captured to one of:
- `~/.hermes/knowledge/` doc
- Numbered rule in `LEARNED_<domain>.md`
- New or updated skill
- Repo doc / README / commit SHA
- Or a clearly logged artifact path on the card body itself

Lazy capture (chat-only) is a routing violation — escalate to `knowledge-canon-reuse` lane for review.

---

## Maintenance

- Add examples when a real routing decision surfaces a useful pattern.
- Do NOT promote any example to a hard rule without writing it into v3 `Routing Rules — v3.md` first.
- This file lives at `~/.hermes/knowledge/agents/ROUTING_EXAMPLES.md` and mirrors to vault / GitHub / Spaces.