# Ops Processes — SETUP
**Hermes Space — MiniMax 2.7 primary**
**Sub-agent:** Ops Manager
**Last updated:** 2026-05-07

---

## Overview
Service health, PM2 management, daily runbooks, and operational checklists.

## Decisions This Space Owns
- Service health: which services are up or down
- PM2: process management, restarts, logs
- Daily checks: ports, bot status, disk space, alerts
- Runbooks: step-by-step for common operational tasks

## Sub-Agent
**Ops Manager** — Primary operator of this Space.

## MODEL_STACK
- **Primary:** MiniMax 2.7 (use first — this is Hermes's brain)
- **Backup 1:** DeepSeek — for deeper analytical reasoning when MiniMax isn't enough
- **Backup 2:** OpenAI — for high-stakes production text, code, configs
- **Backup 3:** Claude — for complex long-form reasoning when all else conflicts or stalls



## HERMES_NOT_OPENCLAW
> ⚠️ This Space is for Hermes only.
> Do not reuse OpenClaw prompts or instructions unless they have been rewritten for Hermes.
> OpenClaw is a separate system. Never mix the two.
> Docs: `/Users/bigdawg/Desktop/perplexity-spaces Hermes/`
> Model policy: `HERMES_MODEL_POLICY.md`

## Policy Reference
See `HERMES_MODEL_POLICY.md` for full model escalation rules.

## Key Files in This Space
- `SETUP.md` — This file
- _(Additional docs added as needed)_
