# Agent OS — Hermes Workspace Map

## Hermes Brain Workspace
`~/.hermes/`

### Core Files
| File | Purpose |
|------|---------|
| `SOUL.md` | Default agent persona and tone |
| `PROFILES.md` | Profile routing cheat sheet |
| `AGENTS.md` | Agent roles, policies, lane rules |
| `PROFILES.md` | Profile configs: bossman, builder, ops, trading, content |
| `knowledge/SERVICES_MAP.md` | Services, ports, owners, health checks |
| `knowledge/OVERRIDES.md` | Safe local overrides (no secrets) |
| `knowledge/LEARNED_*.md` | Domain knowledge files (LEARNED_RESOURCES, LEARNED_AWS, etc.) |
| `skills/*/SKILL.md` | Reusable skill definitions |
| `memories/` | Session memory and daily logs |
| `cron/` | Scheduled job configs |

### Profile Folders
| Path | Purpose |
|------|---------|
| `~/.hermes/profiles/bossman/` | Bossman profile (orchestration) |
| `~/.hermes/profiles/builder/` | Builder profile (implementation) |
| `~/.hermes/profiles/ops/` | Ops profile (runtime/health) |
| `~/.hermes/profiles/trading/` | Trading profile (market analysis) |
| `~/.hermes/profiles/content/` | Content profile (writing) |

### Skills
`~/.hermes/skills/` — 30+ skills including:
apple, autonomous-ai-agents, creative, data-science, debug, devops, email, gaming, github, ideas, kanban, media, mcp, mlops, note-taking, productivity, research, smart-home, social-media, software-development

---

## Projects Folder
`~/Projects/`

| Project | Port | Purpose |
|---------|------|---------|
| (user projects) | varies | Apps, dashboards, scripts |

---

## Hermes Key Concepts

### Profiles vs Skills
- **Profiles:** Long-lived agents with assigned missions (bossman, builder, ops, trading, content)
- **Skills:** Reusable task templates loaded when relevant (debug, github, ideas, etc.)

### Memory System
- `memories/MEMORY.md` — Long-term decisions and project state
- `memories/daily/` — Daily session logs (YYYY-MM-DD.md)
- `knowledge/LEARNED_*.md` — Domain-specific captured knowledge

### Skills Directory
- `~/.hermes/skills/` — Core skills
- Community/optional skills available

---

## Perplexity Spaces
| Space | Status | Files |
|-------|--------|-------|
| Agent OS | ✅ Built | Services, routes, profiles, skills |
| Business Ideas | 🔨 Next | Opportunities, research, money pipeline |
| Trading Ops | 🔨 Next | Binance bot, signals, strategy |
| Toolchain Dev | 🔨 Next | IDEs, coding tools, debugging |
