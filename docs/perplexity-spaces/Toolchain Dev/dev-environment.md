# Toolchain Dev — Development Environment

## Machine
- Mac mini (Darwin 24.6.0)
- Node v25.6.1
- Hermes Agent running on port 3001

## Key Tools
- **Hermes Agent** — Multi-profile AI agent system
- **PM2** — Service management
- **Tailscale** — Remote access
- **Cursor** — Code editor
- **GitHub** — Code storage (BIGDAWG35 org)
- **Homebrew** — Package manager

## Hermes Architecture
```
~/.hermes/
├── SOUL.md              # Default persona
├── PROFILES.md          # Profile routing
├── AGENTS.md            # Agent roles/policies
├── config.yaml          # Hermes config
├── profiles/            # bossman, builder, ops, trading, content
├── skills/              # 30+ skill definitions
├── knowledge/           # LEARNED_*.md, SERVICES_MAP, OVERRIDES
├── memories/            # Session memory
└── cron/               # Scheduled jobs
```

## Hermes CLI
```bash
hermes                    # Start TUI
hermes config set KEY VAL # Set config
hermes skills             # List skills
hermes tools              # List tools
```

## Adding a New Skill
1. Create `~/.hermes/skills/<skill-name>/SKILL.md`
2. Define frontmatter (name, description, triggers)
3. Write steps, pitfalls, examples
4. Hermes loads it automatically on next session

## Key Config Files
| File | Purpose |
|------|---------|
| `~/.hermes/config.yaml` | Hermes gateway config |
| `~/.hermes/SOUL.md` | Default agent persona |
| `~/.hermes/PROFILES.md` | Profile definitions |
| `~/.hermes/knowledge/SERVICES_MAP.md` | Services/ports |

## LEARNED-First Workflow
Before using external tools:
1. Check `~/.hermes/knowledge/LEARNED_*.md`
2. Apply existing patterns
3. Only then use external search/APIs
