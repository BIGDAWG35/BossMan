# Toolchain & Dev — SETUP
**Hermes Space — MiniMax 2.7 primary**
**Sub-agent:** Builder
**Last updated:** 2026-05-07

---

## Overview
Development environment, Hermes config, skills, scripts, and automation tooling.

## Decisions This Space Owns
- Dev environment: which tools, languages, and versions are active
- Hermes config: profiles, services, routing table updates
- Skills: which skills are available and when to use them
- Scripts: automation, runbooks, deployment

## Sub-Agent
**Builder** — Primary operator of this Space.

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
