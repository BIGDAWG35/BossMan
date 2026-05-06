# BossMan Architecture

## System Overview

BossMan operates as the **operations command layer** on top of the Hermes Agent framework.
It does not replace Hermes — it directs and coordinates it.

```
User / Scheduler
        │
        ▼
  ┌─────────────┐
  │  BossMan    │  ← Front-door triage & routing
  └──────┬──────┘
         │ coordinates / delegates
    ┌────┴────┐
    │ Hermes  │  ← Execution engine (you are here)
    └────┬────┘
         │ calls
    ┌────┴────┐
    │  Tools  │  terminal, browser, file, delegation, cronjob...
    └─────────┘
```

## Components

### BossMan (This Repo)
- Prompt templates for daily ops routines
- Service maps and port registries
- Operating rules and workflow documentation
- Migration tracking from OpenClaw

### Hermes Agent (Execution Layer)
- LLM-powered agent loop
- Tool orchestration
- Cron scheduling and background jobs
- Multi-session memory

### LBC35 On-Prem Infrastructure
- Physical/VPS host with active services
- Port registry (see `services-map.md`)
- Local vault storage
- Backup and archival systems

## BossMan Configuration

### Environment Variables

```env
# Vault & Knowledge
OBSIDIAN_VAULT_PATH=/path/to/vault    # Local Obsidian vault root
KNOWLEDGE_BASE=./knowledge             # Structured reference docs

# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxx         # PAT with repo scope
GITHUB_OWNER=BIGDAWG35                # GitHub org/owner
DEFAULT_BRANCH=main

# LBC35 Infrastructure
LBC35_HOST=192.168.x.x                # On-prem host (local only)
LBC35_SSH_KEY=~/.ssh/lbc35_ed25519    # SSH key for on-prem access
LBC35_PORTS=3001,3100,5050,8090,8100,8102,8104,8110,8130,8140,8020

# Hermes Settings
HERMES_CONFIG_PATH=~/.hermes/config.yaml
HERMES_LOG_LEVEL=info
HERMES_MAX_CONCURRENT_JOBS=4

# Notifications
NOTIFY_TELEGRAM=true
TELEGRAM_BOT_TOKEN=                   # Set locally, never commit
```

## LBC35 Coordination

BossMan coordinates with LBC35 via:
1. **SSH** — direct host access for service restarts and log tailing
2. **Port health checks** — HTTP/TCP probes against registered ports
3. **Vault queries** — read/write to Obsidian vault via local filesystem
4. **Cron triggers** — scheduled BossMan tasks via Hermes scheduler

## Session Memory Model

| Session Type    | Scope              | Tool Used          |
|-----------------|--------------------|--------------------|
| Short-term      | Current turn       | Native context     |
| Medium-term     | Current session    | Hermes session     |
| Long-term       | Cross-session      | Obsidian vault     |
| Durable facts   | Persistent         | Hermes memory tool |

## Key Files

- `prompts/bossman-daily.md` — Daily health check routine
- `prompts/lbc35-infra.md` — Infrastructure coordination prompts
- `prompts/bossman-verification.md` — Post-migration verification
- `docs/operating-rules.md` — BossMan-first workflow rules
- `docs/services-map.md` — Active port and service registry
