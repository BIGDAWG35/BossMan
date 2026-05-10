# Vault Hierarchy — Hermes vs OpenClaw Brain

**Source:** OpenClaw TOOLS.md (Wave 1 update), OPERATING_BLUEPRINT.md
**Status:** Active — Phase 3 update

---

## The Hierarchy

```
1. LOCAL (source of truth — local edits happen here first)
   ↓
2. OBSIDIAN (long-term archive — sync from local)
   ↓
3. GITHUB (version control + backup — sync from Obsidian)
   ↓
4. PERPLEXITY SPACES (live AI working layer — sync from local)
```

**Rule:** Always save to Local first. Never edit only one copy.

---

## Vault Roles

| Vault | Path | Role | Status |
|-------|------|------|--------|
| **Hermes knowledge** | `~/.hermes/knowledge/` | PRIMARY — canonical operational docs | ✅ Active |
| **OpenClaw Brain** | `~/Desktop/Openclaw Brain/Openclaw Brain/` | Secondary/archive — historical reference | ✅ Active (secondary) |
| **Obsidian (Hermes)** | `~/Obsidian/Hermes/` | Long-term archive — sync from Hermes knowledge | ✅ Active |
| **GitHub BossMan repo** | `~/Repos/BossMan/` | Version control + backup | ✅ Active |
| **Perplexity Spaces** | `app.perplexity.ai/spaces/[hermes-space]` | Live AI working layer | ✅ Active |

---

## What Goes Where

### Hermes Knowledge (PRIMARY — `~/.hermes/knowledge/`)
Everything operational — SOULs, phase reports, services map, Telegram commands, learned knowledge, blocking issues.

```
~/.hermes/knowledge/
├── OPERATING_BLUEPRINT.md          ← Canonical architecture
├── LBC35_SOUL_v2_delegated_executor.md
├── TELEGRAM_COMMANDS.md
├── SERVICES_MAP.md
├── PHASE*_REPORT.md
├── LEARNED_*.md (27 files)
└── BLOCKER_RESOLUTIONS.md
```

### OpenClaw Brain (SECONDARY/ARCHIVE — `~/Desktop/Openclaw Brain/Openclaw Brain/`)
Historical agent configs, bot lists, agent file bootstrap path. Do NOT use as primary reference — use Hermes knowledge instead.

```
OpenClaw Brain/
├── SOUL.md                          ← Updated (Phase 3) — reflects new architecture
├── AGENTS.md                        ← Updated (Phase 3) — LBC35 demoted
├── TOOLS.md                         ← Updated (Phase 3) — vault hierarchy corrected
├── archive/
│   └── phase-2-deprecated/          ← Archived stale docs (Phase 3 Wave 2)
└── ... bot-specific files
```

### When to Use Which

| Situation | Use |
|-----------|-----|
| Active operational decision | `~/.hermes/knowledge/` (OPERATING_BLUEPRINT.md) |
| LBC35 role question | `~/.hermes/knowledge/LBC35_SOUL_v2_delegated_executor.md` |
| OpenClaw agent bootstrap | OpenClaw Brain files (SOUL.md, AGENTS.md, TOOLS.md) |
| Historical reference | OpenClaw Brain `archive/` folder |
| Phase report | `~/.hermes/knowledge/PHASE*_REPORT.md` |

---

## Sync Workflow

Per SPACES_SYNC_WORKFLOW.md:

```bash
SOURCE="/Users/bigdawg/Desktop/perplexity-spaces Hermes"
OBSIDIAN="/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces"
REPO="/Users/bigdawg/Repos/BossMan"

# 1. Sync to Obsidian
rsync -a --include='*.md' --include='*/' --exclude='*' "$SOURCE/" "$OBSIDIAN/"

# 2. Sync to GitHub
rsync -a --include='*.md' --include='*/' --exclude='*' "$SOURCE/" "$REPO/docs/perplexity-spaces/"

# 3. Git commit and push
cd "$REPO"
git add docs/perplexity-spaces/
git commit -m "feat(spaces): update Hermes Perplexity Spaces"
git push
```

---

## GitHub Backup (OpenClaw Brain)

From TOOLS.md — OpenClaw Brain backs up to GitHub:

The CLAW-Backup GitHub repo (`BIGDAWG35/CLAW-Backup`) backs up:
- `SOUL.md`
- `AGENTS.md`
- `TOOLS.md`

This backup is **legacy** — the primary backup for Hermes knowledge is the BossMan repo at `~/Repos/BossMan/`.

---

## Important Note

> **For all LBC35/OpenClaw operational docs:** Use `~/.hermes/knowledge/` as primary reference. OpenClaw Brain is historical/archive.

This is the key rule from the TOOLS.md Wave 1 update. Any time there is a conflict between OpenClaw Brain docs and Hermes knowledge docs, Hermes knowledge wins.