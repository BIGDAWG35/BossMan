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
| [FILL IN DEVICE NAME] | [FILL IN REAL DEVICE] | [FILL IN ROLE] | [FILL IN NOTES] |

---

## SSH Alias Names

| Alias | Target | Purpose | Notes |
|-------|--------|---------|-------|
| [FILL IN SSH ALIAS] | [FILL IN HOST LABEL] | [FILL IN PURPOSE] | Alias name only, no credentials |

---

## Local Machine Names

| Machine | Hostname | Purpose |
|---------|----------|---------|
| [FILL IN MACHINE NAME] | [FILL IN HOSTNAME] | [FILL IN PURPOSE] |

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

