# BossMan — Hermes Agent Operations Command Center

## Overview

**BossMan** is the primary operations and automation hub for the Hermes Agent ecosystem. It serves as the
front-door interface for coordinating multi-agent workflows, infrastructure queries, vault operations,
and daily automation routines.

---

## Role & Responsibilities

BossMan owns:
- **Front-door triage** — first contact for health checks, status queries, and task routing
- **Daily automation** — scheduled health checks, vault queries, GitHub reviews, and log analysis
- **Infrastructure coordination** — port/service monitoring, LBC35 on-prem liaison, and port映射
- **Migration orchestration** — managing the OpenClaw → Hermes transition end-to-end
- **Knowledge management** — maintaining runbooks, operating rules, and process documentation

---

## Migration: OpenClaw → Hermes/BossMan

> **⚠️ OpenClaw is frozen.** Reference materials and historical context are archived at:
> [https://github.com/BIGDAWG35/Bigdawgclaw](https://github.com/BIGDAWG35/Bigdawgclaw)
>
> That repo is a **read-only archive**. All active operations, new prompts, and living documentation live here.

### What Moved
- Active automation prompts → `prompts/`
- Operational runbooks and rules → `docs/`
- Daily workflow templates → `prompts/bossman-daily.md`
- Infrastructure coordination → `prompts/lbc35-infra.md`

### What Stayed
- Vault reference data (static) → Archived at Bigdawgclaw
- OpenClaw session logs → Archived at Bigdawgclaw
- Historical decisions/ context → Archived at Bigdawgclaw

### What Was Retired
- OpenClaw-native workflows (replaced by Hermes-native equivalents)
- Legacy scheduling system (replaced by Hermes cronjobs)
- OpenClaw dashboard configs (superseded by BossMan service maps)

---

## Repo Structure

```
BossMan/
├── README.md              ← You are here
├── docs/
│   ├── architecture.md       Hermes setup, BossMan config, LBC35 coordination
│   ├── services-map.md       Active ports and service registry
│   ├── migration-from-openclaw.md  Transition log and delta
│   └── operating-rules.md    BossMan-first workflow and daily routines
└── prompts/
    ├── bossman-daily.md      Daily health check and automation prompts
    ├── bossman-verification.md  Post-migration verification template
    └── lbc35-infra.md       Infrastructure coordination prompts
```

---

## Active Ports (LBC35 On-Prem)

| Port  | Service              | Status |
|-------|----------------------|--------|
| 3001  | Local service A      | Active |
| 3100  | Local service B      | Active |
| 5050  | Monitoring agent     | Active |
| 8090  | API gateway          | Active |
| 8100  | Worker pool          | Active |
| 8102  | Auth service         | Active |
| 8104  | Queue processor      | Active |
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
