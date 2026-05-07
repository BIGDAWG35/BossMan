# Toolchain Dev — Development Environment & Tools
**Updated: 2026-05-07**

## Overview
This space covers the development environment, local services, Hermes configuration, app deployment, code architecture, and automation tooling.

---

## Primary Use Cases
- "How do I set up a new Hermes skill?"
- "What services are running and on which ports?"
- "How do I deploy a new app?"
- "What's the current Hermes config?"
- "How do I debug a failing cron job?"
- "How do I add a new tool to Hermes?"
- "How do I write a PowerShell automation script for a client?"

---

## LEARNED Layer — Domain Knowledge (Raw Reference)

For scripting and automation work, these files in `~/.hermes/knowledge/` are the authoritative reference:

| LEARNED File | Topic | Relevant For |
|-------------|-------|-------------|
| `LEARNED_POWERSHELL.md` | PowerShell scripting, modules, automation | IT automation for clients, Windows automation |
| `LEARNED_PYTHON.md` | Python scripting, libraries, frameworks | General automation, data processing |
| `LEARNED_AWS.md` | AWS services, architecture, Lambda | Cloud automation, serverless |
| `LEARNED_AZURE.md` | Azure services, automation | Microsoft cloud automation |
| `LEARNED_TSQL.md` | T-SQL, SQL Server management | Database automation, reporting |
| `LEARNED_CORE_ARCHITECTURE.md` | Internal collaboration hub patterns | Building enterprise KB/dashboards |

**Rule:** When Marcelo asks for automation work, check the relevant LEARNED file first. It contains patterns, best practices, and code examples built from past sessions.

---

## Key Locations

| Location | Purpose |
|----------|---------|
| `~/.hermes/` | Hermes brain — config, profiles, skills, knowledge |
| `~/.hermes/skills/*/SKILL.md` | Hermes skill definitions |
| `~/.hermes/knowledge/LEARNED_*.md` | Domain knowledge (24 files) |
| `~/.hermes/config.yaml` | Gateway configuration |
| `~/Projects/` | User projects |
| `~/Desktop/perplexity-spaces Hermes/` | Perplexity Spaces documents |

---

## Files in This Space

| File | Purpose |
|------|---------|
| `SETUP.md` | This file — overview, LEARNED layer, navigation |
| `dev-environment.md` | Development environment overview (machine, tools, Hermes architecture) |
| `hermes-config.md` | Hermes configuration reference (profiles, services, routes) |
| `skill-authoring.md` | How to create new Hermes skills |
| `architect_01-claude-usage-policy.md` | How Hermes uses Claude/AI in this Space |

---

## Hermes CLI Commands

```bash
hermes                          # Start TUI
hermes config set <key> <val>   # Set config
hermes skills                   # List skills
hermes tools                    # List tools
hermes status                   # Gateway status
```

---

## Perplexity Spaces

| Space | Status | Purpose |
|-------|--------|---------|
| Agent OS | ✅ Built | Hermes profiles, routing, services |
| Business Ideas | ✅ Built | Opportunities, research, money pipeline |
| Trading Ops | ✅ Built | Binance bot, signals, strategy |
| Toolchain Dev | ✅ Built | This space — IDEs, coding tools, debugging |
