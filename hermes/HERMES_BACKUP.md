# HERMES_BACKUP.md
# Location: ~/.hermes/HERMES_BACKUP.md
# Purpose: Lightweight backup policy for Hermes configuration and knowledge.

---

## What Must Be Backed Up

Restore priority order:

1. `~/.hermes/AGENTS.md`
2. All profile SOULs: `~/.hermes/profiles/*/SOUL.md`
3. All skill files: `~/.hermes/skills/*/SKILL.md`
4. Knowledge files:
   - `~/.hermes/knowledge/LEARNED_*.md`
   - `~/.hermes/knowledge/SERVICES_MAP.md`
   - `~/.hermes/knowledge/OVERRIDES.md`
5. Memory and history files, if present:
   - `~/.hermes/memories/MEMORY.md`
   - `~/.hermes/memories/daily/`

---

## Backup Locations

Use at least two backup targets:

- Primary: private GitHub repo or private branch
- Secondary: local backup path such as `~/backup/hermes/`

Do not depend on a single backup location.

---

## Backup Cadence

Back up Hermes:

- After any major change to AGENTS, SOULs, skills, or core knowledge files
- At least once per week
- Immediately after adding a new profile, skill, or major LEARNED file

---

## Restore Order

If recovery is needed, restore in this order:

1. `AGENTS.md`
2. Profile SOULs
3. Skill files
4. Knowledge files
5. Memory and history

This order restores behavior and routing first, then restores context.

---

## Before Major Edits

- [ ] Confirm the current version is backed up
- [ ] Note what file is being changed
- [ ] Note why the change is being made
- [ ] If editing AGENTS or a SOUL, record a one-line summary of the change

---

## After Major Edits

- [ ] Save the final version
- [ ] Commit or copy the updated file to backup
- [ ] If a new file was added, include it in backup scope
- [ ] If a service or port changed, also update `SERVICES_MAP.md`
- [ ] If a routing or behavior rule changed, verify the related SOUL or AGENTS file still agrees

---

## Red Line

Never store live secrets in backup documents.

Do not include:

- API keys
- Tokens
- Passwords
- Private SSH keys
- Secret environment variable values
- Exchange credentials

If a secret is ever written into a Hermes file by mistake, remove it and rotate it.

---

## Minimal Recovery Notes

| Failure | First restore action |
|---------|----------------------|
| AGENTS lost | Restore `AGENTS.md` first |
| SOULs lost | Restore `bossman/SOUL.md` first, then the rest |
| Skills lost | Restore `debug/SKILL.md` and `ideas/SKILL.md` |
| Knowledge lost | Restore `LEARNED_*.md`, then `SERVICES_MAP.md`, then `OVERRIDES.md` |
| Memory lost | Restore only after core behavior files are back |

