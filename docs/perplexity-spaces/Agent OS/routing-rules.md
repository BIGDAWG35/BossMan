# Agent OS — Hermes Routing & Access Rules

## Profile Routing Table

| Task Type | Owner | Notes |
|-----------|-------|-------|
| New idea / brainstorming | ideas skill → bossman | ideas skill captures and routes |
| Code / app / web dev | builder | All implementation work |
| PM2 / services / deploy | ops | Runtime and infrastructure |
| Crypto / stocks / trading | trading | Research and analysis only |
| Content / docs / scripts | content | Written output only |
| Debugging / security | debug skill | Investigation, not fixes |
| Apple apps / iMessage | apple skill | macOS/iOS integrations |
| GitHub / repos | github skill | PRs, issues, repos |
| Scheduling | apple-reminders | Reminders, calendar |
| Email | himalaya | IMAP/SMTP terminal email |
| Music | spotify | Spotify control |
| Research / papers | arxiv | Academic paper search |
| Maps | maps | Geocoding, routes |
| Web QA | dogfood | Browser testing |

---

## Services Access

| Service | Port | Access |
|---------|------|--------|
| Hermes gateway | 3001 | localhost |
| Hermes dashboard | 9119 | localhost only (NOT Tailscale) |
| OpenHue | 3100 | localhost |
| Web service | 8090 | Tailscale + local |
| Binance monitor | 8104 | localhost |
| Crypto tracker | 8020 | localhost |
| XPrint server | 8100 | localhost |
| App services | 8102, 8110, 8140 | localhost |

---

## Lane Discipline

**bossman routes everything.** If a task lands in the wrong lane, bossman re-routes.

**Profiles stay in their lanes:**
- builder → code only
- ops → runtime only
- trading → analysis only
- content → writing only

**Skills are invoked for domain-specific tasks** — check skills list first.

---

## Hermes Source of Truth

| Domain | File |
|--------|------|
| Services / ports | `~/.hermes/knowledge/SERVICES_MAP.md` |
| Local overrides | `~/.hermes/knowledge/OVERRIDES.md` |
| Domain knowledge | `~/.hermes/knowledge/LEARNED_*.md` |
| Profiles | `~/.hermes/PROFILES.md` |
| Agent persona | `~/.hermes/SOUL.md` |
| Memory | `~/.hermes/memories/` |

---

## LEARNED-First Rule

Before using external tools or AI:
1. Check `~/.hermes/knowledge/LEARNED_*.md` for existing domain knowledge
2. Apply learned patterns
3. Only then use external search/APIs if needed

This saves tokens and uses existing knowledge.
