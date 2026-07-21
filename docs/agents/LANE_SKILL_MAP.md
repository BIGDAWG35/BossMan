# Agent OS — Lane ↔ Skill Mapping (v3)

**Date:** 2026-06-18
**Owner:** BossMan Hermes
**Status:** CANON — single source of truth for which skills each lane owns.
**Source of truth per Phase 4.3:** The related-skills footer on each lane MD + this map. If they ever disagree, the lane MD footer wins (it's the lane's own self-declaration).

---

## Routing Header Convention (Lane-Tagged Cards)

Every new card that is meta/system/architecture work MUST begin with this 2-line header on the card body:

```
lane: <lane-name>
why: <one-line reason this lane owns it>
```

`<lane-name>` is one of: `builder`, `content`, `ops`, `trading`, `self-improvement-curriculum`, `loop-engineering-goals`, `qa-verification`, `research-intel`, `knowledge-canon-reuse`.

When ownership is unclear, resolve it by:
1. Reading this file (lane → skill ownership).
2. Reading the lane's own MD under `~/.hermes/knowledge/agents/`.
3. Using `ROUTING_EXAMPLES.md` as advisory.
4. If still ambiguous: BossMan decides — no lane self-routes.

The header is a BossMan-side convention; the lane MDs do not change. The 9 lane-intro cards already on `agent-os` are exempt from the header (they ARE the lane intros, not work for the lane).

---

## Lane → Skill Ownership Map

(Lanes sorted by archetype: 4 v2-era REWRITEs first, then 5 NEW blueprint lanes.)

### REWRITE lanes (replaced Openclaw soul-*.md)

| Lane | Owns / primary uses | Escalates-to skills | Notes |
|---|---|---|---|
| **builder** | `systematic-debugging`, `simplify-code`, `subagent-driven-development`, `requesting-code-review`, `playwright-e2e-audit` | `troubleshooting-mode` | Builder is the v3 Default Build Flow Steps 2–6 owner. |
| **content** | (no skills yet — content shapes its own drafts) | `humanizer` (when ready) | Content's "skills" are templates + voice ref, not Hermes skills yet. |
| **ops** | `pm2-health-check`, `troubleshooting-mode`, `incident-response`, `service-drift-root-cause` | `infrastructure-resolve`, `db-driven-root-cause-diagnosis` | Ops is the runtime layer. New repair playbooks go here. |
| **trading** | `binance-bot`, `crypto-intelligence`, `polymarket` | `troubleshooting-mode` | Trading lane is research/draft only; no execution skills. |

### NEW blueprint lanes

| Lane | Owns / primary uses | Escalates-to skills | Notes |
|---|---|---|---|
| **self-improvement-curriculum** | `curriculum-auto-advance` | (none — pure workflow) | Owns the `/goal` workflow + numbered rule discipline. |
| **loop-engineering-goals** | `cron-job-output-design`, `kanban-orchestrator`, `webhook-subscriptions` | `host-governance` | Owns the system-of-loops. No skills for loops yet — this lane *authors* them. |
| **qa-verification** | `app-code-audit`, `playwright-e2e-audit`, `dogfood`, `incident-response`, `service-drift-root-cause`, `security-incident-audit`, `troubleshooting-mode` | `kanban-board-governance` | QA reports; owning lane fixes. |
| **research-intel** | `perplexity-spaces-workflow`, `arxiv`, `polymarket`, `blogwatcher`, `social-media-claim-vetting` | (none — research-only) | Perplexity Computer is BossMan-gated. |
| **knowledge-canon-reuse** | `hermes-knowledge-taxonomy`, `hermes-agent-skill-authoring`, `memory-automation`, `v3-knowledge-refresh`, `knowledge-base-audit`, `knowledge-base-unification` | `kanban-board-governance` | This lane IS the capture rule. |

## Cross-lane (any lane may pull)

- `kanban-board-governance` — every lane uses the Kanban board; lane routes to it.
- `kanban-worker` — every lane may be a Kanban worker.
- `operator-runbook` — when producing a paste-ready runbook for Marcelo.
- `host-governance` — when authoring or maintaining standing host rules.
- `destructive-admin-safety` — when a lane action is destructive (wipe, mass-delete, schema rebuild).
- `identity-ambiguity-stop` — when a recipient or owner is ambiguous.
- `phase-reconciliation` — when comparing a planning doc to current state.
- `simplify-code` (also in builder) — every lane may need code cleanup before handoff.

## Skill → lane (inverse index)

If you have a skill and don't know which lane it belongs to, look here:

| Skill | Lane |
|---|---|
| `systematic-debugging` | builder |
| `simplify-code` | builder (+ cross-lane) |
| `subagent-driven-development` | builder |
| `requesting-code-review` | builder |
| `playwright-e2e-audit` | builder (+ qa-verification) |
| `pm2-health-check` | ops |
| `incident-response` | ops (+ qa-verification) |
| `service-drift-root-cause` | ops (+ qa-verification) |
| `service-registry-audit` | ops (+ qa-verification) |
| `infrastructure-resolve` | ops |
| `db-driven-root-cause-diagnosis` | ops |
| `binance-bot` | trading |
| `crypto-intelligence` | trading |
| `polymarket` | trading (+ research-intel) |
| `curriculum-auto-advance` | self-improvement-curriculum |
| `cron-job-output-design` | loop-engineering-goals |
| `kanban-orchestrator` | loop-engineering-goals (+ cross-lane) |
| `webhook-subscriptions` | loop-engineering-goals |
| `app-code-audit` | qa-verification |
| `dogfood` | qa-verification |
| `security-incident-audit` | qa-verification |
| `perplexity-spaces-workflow` | research-intel |
| `arxiv` | research-intel |
| `blogwatcher` | research-intel |
| `social-media-claim-vetting` | research-intel |
| `hermes-knowledge-taxonomy` | knowledge-canon-reuse |
| `hermes-agent-skill-authoring` | knowledge-canon-reuse |
| `memory-automation` | knowledge-canon-reuse |
| `v3-knowledge-refresh` | knowledge-canon-reuse |
| `knowledge-base-audit` | knowledge-canon-reuse (+ cross-lane) |
| `knowledge-base-unification` | knowledge-canon-reuse (+ cross-lane) |
| `kanban-board-governance` | cross-lane |
| `kanban-worker` | cross-lane |
| `operator-runbook` | cross-lane |
| `host-governance` | cross-lane (+ loop-engineering-goals) |
| `destructive-admin-safety` | cross-lane |
| `identity-ambiguity-stop` | cross-lane |
| `phase-reconciliation` | cross-lane |
| `troubleshooting-mode` | ops + builder + trading (shared incident tool) |
| `humanizer` | content (future) |
| `v3-knowledge-refresh` | knowledge-canon-reuse |

## Version History

| Version | Date       | Change                                                                       |
|---------|------------|------------------------------------------------------------------------------|
| 1.0     | 2026-06-18 | Initial mapping — derived from lane MD §7 handoff packets + skill name scan of `~/.hermes/skills/`. |