# Migration: OpenClaw → Hermes / BossMan

**Start Date:** 2026-04
**Status:** Active
**Archive:** https://github.com/BIGDAWG35/Bigdawgclaw (frozen, read-only)

---

## Summary

OpenClaw has been retired and replaced by the Hermes/BossMan workflow. This document tracks
what moved, what stayed, and what was retired.

---

## What Moved

### Prompts & Automation
| OpenClaw Location        | BossMan Location           | Notes                         |
|--------------------------|----------------------------|-------------------------------|
| `prompts/daily.yml`      | `prompts/bossman-daily.md` | Converted to markdown, enhanced |
| `prompts/infra.yml`      | `prompts/lbc35-infra.md`   | Port list updated             |
| `prompts/verify.yml`     | `prompts/bossman-verification.md` | New template created |

### Documentation
| OpenClaw                  | BossMan                     | Notes                         |
|---------------------------|-----------------------------|-------------------------------|
| `docs/ARCHITECTURE.rst`   | `docs/architecture.md`      | Converted to markdown         |
| `docs/PORTS.txt`          | `docs/services-map.md`      | Updated port list             |
| `docs/RULES.md`           | `docs/operating-rules.md`  | Expanded with BossMan-first   |

---

## What Stayed

These items remain as **static reference** in the OpenClaw archive and are NOT actively maintained:

- Historical session logs (`.hermes/sessions/`)
- Vault snapshot at time of migration
- OpenClaw skill definitions (superseded by Hermes skills)
- Legacy cron job definitions (archived, not active)

---

## What Was Retired

### Services
- **Port 8000** — OpenClaw gateway (replaced by Hermes direct access)
- **Port 8080** — Legacy REST API (consolidated into port 8090)
- **Port 8888** — OpenClaw dashboard (no replacement, workflow moved to CLI)

### Workflows
- OpenClaw `daily-push` workflow — replaced by `bossman-daily.md`
- OpenClaw `deploy-check` — replaced by Hermes cronjob + health checks
- OpenClaw `logrotate` — retired, logs now managed by system

### Configuration
- `.openclaw.yaml` — superseded by `docs/architecture.md` + `.env`
- `openclaw-env.sh` — superseded by `.env.example`

---

## Verification Checklist

After any migration task, confirm:

- [ ] Hermes Agent is accessible and responding
- [ ] BossMan daily prompts load correctly
- [ ] All active ports (see `services-map.md`) respond to health checks
- [ ] GitHub integration works (repo access, token auth)
- [ ] No OpenClaw-era tokens or secrets remain in active use
- [ ] Vault queries return expected results
- [ ] Scheduled cronjobs are running via Hermes (not legacy scheduler)

See [`prompts/bossman-verification.md`](../prompts/bossman-verification.md) for the full template.

---

## OpenClaw Archive

> **⚠️ The OpenClaw repo is frozen and read-only.**
> Do not open PRs or make edits at https://github.com/BIGDAWG35/Bigdawgclaw
> All active work happens in this repo (BossMan).
