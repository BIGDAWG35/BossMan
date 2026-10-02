**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/toolchain-dev/BossMan Repo — v3 README — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BossMan Repo — v3 README

> **2026-10-02 correction:** The port table below is placeholder text ("Local service A/B", generic roles) and does not match `Services Map.md` (e.g. 8104 = `binance-bot-live`, 3537 = Travel OS, 7575 = PMD web). Several lines were overwritten by the 2026-09-30 LBC35 cleanup (stray '# RETIRED … service removed' lines in the tree). Use `Services Map.md` for ports.
**Version:** v3.1 (refined 2026-07-20 to reflect today's canon)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
## Original title

_BossMan — Hermes Agent Operations Command Center_

## Overview

**BossMan** is the primary operations and automation hub for the Hermes Agent ecosystem. It serves as the
front-door interface for coordinating multi-agent workflows, infrastructure queries, vault operations,
and daily automation routines.

---

## Role & Responsibilities

BossMan owns:
- **Front-door triage** — first contact for health checks, status queries, and task routing
- **Daily automation** — scheduled health checks, vault queries, GitHub reviews, and log analysis
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- **Knowledge management** — maintaining runbooks, operating rules, and process documentation

---

> Legacy OpenClaw-era repo (intro line restored 2026-10-02; the bulk LBC35 cleanup had overwritten it):
> [https://github.com/BIGDAWG35/Bigdawgclaw](https://github.com/BIGDAWG35/Bigdawgclaw)
>
> That repo is a **read-only archive**. All active operations, new prompts, and living documentation live here.

### What Moved
- Active automation prompts → `prompts/`
- Operational runbooks and rules → `docs/`
- Daily workflow templates → `prompts/bossman-daily.md`
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

### What Stayed
- Vault reference data (static) → Archived at Bigdawgclaw
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- Historical decisions/ context → Archived at Bigdawgclaw

### What Was Retired
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- Legacy scheduling system (replaced by Hermes cronjobs)
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## Repo Structure

```
BossMan/
├── README.md              ← You are here
├── docs/
│   ├── (entry overwritten by the 2026-09-30 LBC35 cleanup)
│   ├── services-map.md       Active ports and service registry
│   ├── (entry overwritten by the 2026-09-30 LBC35 cleanup)
│   └── operating-rules.md    BossMan-first workflow and daily routines
└── prompts/
    ├── bossman-daily.md      Daily health check and automation prompts
    ├── bossman-verification.md  Post-migration verification template
    └── (entry overwritten by the 2026-09-30 LBC35 cleanup)
```

---

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

| Port  | Service              | Status |
|-------|----------------------|--------|
| 3001  | Local service A      | Active |
| 3100  | Local service B      | Active |
| 5050  | Monitoring agent     | Active |
| 8090  | API gateway          | Active |
| 8100  | Worker pool          | Active |
| 8102  | Auth service         | Active |
| 8104  | Queue processor      | Active | (corrected 2026-10-02: 8104 = binance-bot-live, Binance.US SPOT — see Services Map.md)
| 8110  | Cache layer          | Active |
| 8130  | Notification svc     | Active |
| 8140  | Scheduler            | Active |
| 8020  | Backup / archival    | Active |

> Full details: [`docs/services-map.md`](docs/services-map.md)

---

## Getting Started

1. Clone this repo
2. Copy `.env.example` to `.env` and fill in your local values
3. Review [`docs/operating-rules.md`](docs/operating-rules.md) for BossMan-first workflow
4. Run daily checks via [`prompts/bossman-daily.md`](prompts/bossman-daily.md)

---

## Safety Rules

- **No secrets in this repo** — Use `.env` locally, never commit real tokens
- **No runtime dumps** — Keep logs and state out of version control
- **Operational content only** — This repo is a living workspace, not an archive

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Section | Change |
|---|---|
| Frontmatter | Version v3.0 → v3.1; Date 2026-06-XX → 2026-07-20 |
| Content | Reference today's docs/hermes-canon/ mirror + V3 audit workflow |
| Companion canon | Should now cite `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`, `LEARNED_7_RULE_CONTRACT.md`, `LEARNED_V3_MODEL_STACK.md`, `LEARNED_V3_TOKEN_ECONOMICS.md` |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

*Change log appended automatically by V3 deep-dive job (2026-07-20).*
