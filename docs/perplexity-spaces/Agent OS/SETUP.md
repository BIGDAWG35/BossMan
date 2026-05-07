# Agent OS — Hermes System Services Map
**Updated: 2026-05-07**

## Hermes Gateway
**Location:** `~/.hermes/` (config), Hermes app on Mac mini

**Profiles:** bossman, builder, ops, trading, content
**Skills:** apple, autonomous-ai-agents, creative, data-science, debug, devops, email, gaming, github, ideas, kanban, media, mcp, mlops, note-taking, productivity, research, smart-home, social-media, software-development

**Key Files:**
| File | Purpose |
|------|---------|
| `SOUL.md` | Default agent persona |
| `PROFILES.md` | Profile routing cheat sheet |
| `AGENTS.md` | Agent roles and policies |
| `knowledge/SERVICES_MAP.md` | Services, ports, health checks |
| `knowledge/OVERRIDES.md` | Safe local overrides (no secrets) |
| `knowledge/LEARNED_*.md` | Domain knowledge files (24 files) |
| `skills/*/SKILL.md` | Reusable skill definitions |
| `memories/` | Session memory and history |
| `cron/` | Scheduled job configs |

---

## Services Status

| Service | Port | Owner | Health Check |
|---------|------|-------|--------------|
| Hermes gateway | 3001 | bossman | `curl localhost:3001/health` |
| OpenHue (home automation) | 3100 | ops | `curl localhost:3100/api/health` |
| Hermes dashboard | 9119 | bossman | `http://localhost:9119` |
| Web service | 8090 | builder | `curl localhost:8090/health` |
| XPrint server | 8100 | ops | `curl localhost:8100/health` |
| App service | 8102 | ops | `curl localhost:8102/health` |
| Binance monitor | 8104 | trading | `http://localhost:8104` |
| App service | 8110 | ops | `curl localhost:8110/health` |
| Indigo VRMI | 8130 | ops | `curl localhost:8130/health` |
| App service | 8140 | ops | `curl localhost:8140/health` |
| Crypto tracker | 8020 | trading | `http://localhost:8020` |

> **Last verified:** 2026-05-07

---

## Profile Routing

| Task Type | Route To |
|-----------|----------|
| New project / idea | ideas skill → bossman |
| Code, app, web dev | builder |
| PM2, Hub, Tailscale, deploy | ops |
| Crypto / stocks / trading | trading |
| Content, docs, scripts | content |
| Debugging, issue-finding | debug skill |
| Apple apps (iMessage, Notes) | apple skill |
| GitHub PRs, issues, repos | github skill |
| Scheduling, reminders | apple-reminders skill |
| Email (IMAP/SMTP) | himalaya skill |
| Spotify control | spotify skill |
| Research, papers, arxiv | arxiv skill |
| Maps, geocoding | maps skill |
| Web app QA | dogfood skill |

---

## Hermes Profiles

### bossman
- Mission: Orchestrate work, route tasks, enforce lane discipline, run weekly review
- Owns: Routing, prioritization, approvals, LEARNED-first enforcement, memory hygiene
- Handoffs: To builder for code, ops for runtime, trading for research, content for writing

### builder
- Mission: Implement features, fixes, code changes
- Owns: Code, repos, scripts, implementation plans, Cursor execution, tests
- Handoffs: Receives from bossman, hands to ops for runtime issues

### ops
- Mission: Keep services healthy and stable
- Owns: PM2, service health, ports, logs, incident response, deploy/runtime
- Handoffs: Receives from bossman or debug, hands to builder for code issues

### trading
- Mission: Analyze markets and bot performance (no live money behavior)
- Owns: Market research, Binance/Kraken reviews, trading reports, performance analysis
- Handoffs: Reports to bossman, proposes changes for builder

### content
- Mission: Turn ideas and outputs into publishable content and documentation
- Owns: Scripts, outlines, docs, posts, summaries, copy, written output
- Handoffs: Receives from bossman/trading/builder, returns drafts for approval

---

## Claude Helper Rules (This Space)

- Manager: bossman orchestrates
- Default coder: builder
- Ops/deploy: ops
- Trading analysis: trading
- Content: content
- Claude: helper-only and opt-in
- Only used when Marcelo explicitly asks to use Claude
- If Claude is unavailable, builder continues unless Marcelo said "stop if Claude can't be used"
- For full details, see: `architect_01-claude-usage-policy.md` in this Space

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

## LEARNED Layer — Domain Knowledge (Raw Reference)

`~/.hermes/knowledge/LEARNED_*.md` contains 24 domain research files. Key ones:

| LEARNED File | Topic |
|-------------|-------|
| `LEARNED_POWERSHELL.md` | PowerShell scripting, automation |
| `LEARNED_AWS.md` | AWS architecture, Lambda, cloud |
| `LEARNED_PYTHON.md` | Python scripting, libraries |
| `LEARNED_RESOURCES.md` | Dashboard design, PM tools |
| `LEARNED_BAKERY_SYSTEM.md` | Bakery business, pricing, booking |
| `LEARNED_AIRBNB.md` | Airbnb/short-term rental strategy |

**Rule:** Check LEARNED first before external search.

---

## Files in This Space

| File | Purpose |
|------|---------|
| `SETUP.md` | This file — services, profiles, routing |
| `bot-roles.md` | Profile lanes and ownership |
| `routing-rules.md` | Full routing table + access rules |
| `workspace-map.md` | Hermes workspace structure |
| `architect_01-claude-usage-policy.md` | How Hermes uses Claude/AI in this Space |

---

## Perplexity Spaces

| Space | Status | Purpose |
|-------|--------|---------|
| Agent OS | ✅ Built | This space — Hermes profiles, routing, services |
| Business Ideas | ✅ Built | Opportunities, research, money pipeline |
| Trading Ops | ✅ Built | Binance bot, signals, strategy |
| Toolchain Dev | ✅ Built | IDEs, coding tools, debugging |
