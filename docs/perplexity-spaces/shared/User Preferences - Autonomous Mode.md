**Version:** v4 · **Date:** 2026-07-20 · **Source:** `~/.hermes/knowledge/LEARNED_USER_PREFERENCES_AUTONOMOUS_MODE.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# Marcelo — Autonomous Operator Mode (extended detail)

**Purpose**: pointer doc for the autonomous-only operator preference. Extended detail lives here; USER.md keeps the short rule.

**Canonical companion**: `~/.hermes/knowledge/LEARNED_7_RULE_CONTRACT.md` (the numbered 7-rule contract that BossMan enforces on itself + sub-agents)
**Canonical roles doc**: `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`

This doc explains **the spirit** behind rule 7 (autonomous escalation). The numbered 7-rule contract is the authoritative reference.

## What "autonomous mode" means (in practice)

- Marcelo expects BossMan to deliver end-to-end without depending on him for technical choices
- Ship finished product with verifier evidence, OR surface ONLY true source-of-truth decisions he alone can supply
- Routine technical decisions (route topology, library choice, regex pattern, port assignment, schema column) are NOT A/B/C — BossMan picks the best one and logs it

## Failure mode to avoid (this is why the rule exists)

**Burning the iteration budget chasing the last 5% of a Tailnet routing bug while watchdog cron / browser QA / reboot-persistence phases stay unstarted.**

When the iteration budget tightens mid-flight:
1. Surface the blocker (true v3 carve-out OR hard technical block)
2. Ship the highest-leverage autonomous steps first (watchdog > perfect routing)
3. Resume the partial work in a later session

## What "true source-of-truth decision" means

Decisions that ONLY Marcelo can answer:
- Vendor billing / API key purchase
- Customer-facing positioning / pricing / scope pivot
- Zillow / ATTOM / HouseCanary data source selection for a property
- Public-facing port/domain/security changes
- Final incident postmortem sign-off (his discretion)

Decisions that are NOT source-of-truth (BossMan picks):
- Which PMD web framework port to bind
- Whether to use FTS5 or LIKE for catalog search
- CSS framework choice
- Test runner selection
- Schema column names

## Captured skills

- `bossman-autonomous-operator-pattern` — Direct-question narrative drift, decision budget triage, blocker surfacing
- `autonomous-change-pipeline` — 5-child P1–P5 structure with Step-5 QA + P5 self-verify

## Origin

The PMD restore-and-harden work (2026-07-15) is where this rule crystallized. The previous behavior of "ask Marcelo for A/B/C for routine" wasted iterations and broke the flow.
