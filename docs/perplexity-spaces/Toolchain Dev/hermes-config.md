# Toolchain Dev — Hermes Configuration Reference

## Core Config
- `~/.hermes/config.yaml` — Gateway settings, model providers, tools
- `~/.hermes/SOUL.md` — Default persona (loaded fresh each session)
- `~/.hermes/PROFILES.md` — Profile routing table

## Profile Routing
| Task | Route |
|------|-------|
| Code | builder |
| Runtime/ops | ops |
| Research | trading |
| Writing | content |
| Ideas | ideas skill |
| Debug | debug skill |

## Profiles
| Profile | Mission | Owns | Does NOT own |
|---------|---------|------|-------------|
| bossman | Orchestrate, route | Routing, approvals | Code, runtime |
| builder | Implement | Code, repos | Runtime, trading |
| ops | Keep healthy | Services, PM2 | Code, trading |
| trading | Analyze | Market research | Live trading |
| content | Write | Scripts, docs | Code, runtime |

## Skills Directory
`~/.hermes/skills/` — Skills loaded by Hermes
- apple, autonomous-ai-agents, creative, data-science, debug, devops
- email, gaming, github, ideas, kanban, media, mcp, mlops
- note-taking, productivity, research, smart-home, social-media

## Knowledge Files
`~/.hermes/knowledge/`
- `SERVICES_MAP.md` — Ports, services, health checks
- `OVERRIDES.md` — Safe local overrides (no secrets)
- `LEARNED_*.md` — Domain knowledge (AWS, Azure, Python, etc.)

## Cron Jobs
`~/.hermes/cron/` — Scheduled jobs configured via Hermes cron

## Hermes CLI Commands
```bash
hermes config set <key> <value>  # Update config
hermes tools                      # List available tools
hermes skills                     # List available skills
```

## Key Services
| Port | Service |
|------|---------|
| 3001 | Hermes gateway |
| 9119 | Hermes dashboard |
| 8020 | Crypto tracker |
| 8090 | Web service |
| 8104 | Binance monitor |
