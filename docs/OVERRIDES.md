# OVERRIDES.md
# Location: ~/.hermes/knowledge/OVERRIDES.md
# Purpose: Safe local overrides and environment-specific reference notes.

> WARNING:
> This file must never contain secrets.
> Do not store API keys, tokens, passwords, private SSH keys, private URLs with embedded credentials, or `.env` contents here.

---

## Allowed vs Forbidden

### Allowed
- Device nicknames
- Machine names
- SSH alias names only
- Friendly names for cameras and locations
- Preferred TTS voices
- Preferred model routing notes
- Naming conventions
- Local path shortcuts
- Non-secret tool preferences

### Forbidden
- API keys
- Tokens
- Passwords
- Exchange credentials
- Cloud secrets
- Private SSH keys
- Session cookies
- `.env` values
- Full secret connection strings

---

## Device Nicknames

| Label | Actual Device | Role | Notes |
|-------|---------------|------|-------|
| Mac Studio | Mac Studio M4 Max (16c/64GB) | Primary execution host | Current primary |
| Mac mini | Intel Mac mini (legacy) | Historical only | No longer primary |

---

## SSH Alias Names

| Alias | Target | Purpose | Notes |
|-------|--------|---------|-------|
| [FILL IN SSH ALIAS] | [FILL IN HOST LABEL] | [FILL IN PURPOSE] | Alias name only, no credentials |

---

## Local Machine Names

| Machine | Hostname | Purpose |
|---------|----------|---------|
| Mac Studio | studio.local (or Mac-Studio.local) | Primary execution host — AI Stack v2 |
| Mac mini | mini.local | Legacy — historical only |

---

## TTS Preferences

| Setting | Value |
|---------|-------|
| Preferred voice | [FILL IN VOICE] |
| Fallback voice | [FILL IN FALLBACK VOICE] |
| Preferred speed | [FILL IN SPEED] |
| Notes | [FILL IN NOTES] |

---

## Model Routing Preferences

| Task Type | Preferred Model | Fallback Model | Notes |
|-----------|-----------------|----------------|-------|
| Code / build | [FILL IN MODEL] | [FILL IN MODEL] | [FILL IN NOTES] |
| Research / analysis | [FILL IN MODEL] | [FILL IN MODEL] | [FILL IN NOTES] |
| Content / creative | [FILL IN MODEL] | [FILL IN MODEL] | [FILL IN NOTES] |
| Fast lookup | [FILL IN MODEL] | [FILL IN MODEL] | [FILL IN NOTES] |

---

## Camera / Location Names

| Label | Location | Notes |
|-------|----------|-------|
| [FILL IN CAMERA OR LOCATION NAME] | [FILL IN LOCATION] | [FILL IN NOTES] |

---

## Naming Conventions

- Project prefix: `[FILL IN PREFIX RULE]`
- Service naming rule: `[FILL IN RULE]`
- Port naming rule: `[FILL IN RULE]`
- Dashboard naming rule: `[FILL IN RULE]`

---

## Path Shortcuts

| Shortcut | Full Path | Purpose |
|----------|-----------|---------|
| [FILL IN SHORTCUT] | [FILL IN FULL PATH] | [FILL IN PURPOSE] |

---

## Port Conventions

| Item | Value | Notes |
|------|-------|-------|
| App range | [FILL IN RANGE] | [FILL IN NOTES] |
| Dashboard range | [FILL IN RANGE] | [FILL IN NOTES] |
| Trading monitor | [FILL IN PORT] | [FILL IN NOTES] |

---

## Update Rule

Update this file when:

- Device names change
- New aliases are added
- TTS preferences change
- Model routing preferences change
- Naming conventions change
- Safe local reference info changes

If a value is sensitive, do not put it here.

---

## Operational Access Patterns

> Updated 2026-05-28: Intel Mac mini replaced by Mac Studio M4 Max as primary host. Remote access URLs and hostnames below reflect current Mac Studio configuration.

### Hermes Dashboard
- **Port:** 9119
- **Access:** Local only (`http://localhost:9119`)
- **Remote access:** Not available via Tailscale Serve — Host header validation blocks it
- **Remote workaround:** SSH into Mac Studio, use `hermes chat`, or use `/kanban` commands

### User-Facing Dashboards (Tailscale Serve)
- **Web service (8090):** Accessible at `https://bigdawgs-mac-studio.tailed3212.ts.net/` — tailnet-only
- **Access model:** Clients/testers (Cello, Cisco, Marcus) use Tailscale to reach this URL
- **Hermes chat:** Available remotely via `hermes chat` over SSH

### Remote Access Stack
| Tool | Use |
|------|-----|
| SSH + hermes chat | Remote command and control |
| `/kanban` commands | Remote task management |
| Tailscale Serve | User-facing dashboards only (not Hermes dashboard) |
| VNC / Screen Sharing | View Mac Studio desktop remotely if needed |

### Legacy Context — Intel Mac mini
> The Intel Mac mini (hostname: `mini.local`) was Marcelo's previous primary host. It is now **legacy/historical only**. Its current role and any active services on it should be verified before assuming anything is still running there. Do NOT use the Mac mini as a reference for current system configuration.

