# SPACES_SYNC_WORKFLOW
**Purpose:** Define the backup/mirror hierarchy for Hermes Perplexity Spaces documentation.
**Last updated:** 2026-05-07

---

## Save Order (Authoritative Priority)

```
1. LOCAL (source of truth)
   ↓
2. OBSIDIAN (long-term archive)
   ↓
3. GITHUB (version control + backup)
   ↓
4. PERPLEXITY SPACES (live AI working layer)
```

**Rule:** Always save to Local first. Never edit only one copy.

---

## Locations

| Target | Path |
|--------|------|
| Local source of truth | `/Users/bigdawg/Desktop/perplexity-spaces Hermes/` |
| Obsidian archive | `/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces/` |
| GitHub backup | `/Users/bigdawg/Repos/BossMan/docs/perplexity-spaces/` |
| Perplexity Spaces | `app.perplexity.ai/spaces/[hermes-space]` |

---

## Sync Commands (Copy-Paste Ready)

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

## Folder Structure (Mirror This Exactly)

```
perplexity-spaces Hermes/              (LOCAL SOURCE — HERMES ONLY)
├── HERMES_MODEL_POLICY.md             ← Model stack + escalation rules
├── HERMES_SPACES_CONFIG.md            ← Master config + Space map
├── SPACES_SYNC_WORKFLOW.md            ← This file
├── Agent OS/
│   └── SETUP.md
├── Trading Ops/
│   └── SETUP.md
├── Trading Strategy & Portfolio/
│   └── SETUP.md
├── Toolchain & Dev/
│   └── SETUP.md
├── Business & Ideas/
│   └── SETUP.md
├── Content & YouTube/
│   └── SETUP.md
├── Real Estate/
│   └── SETUP.md
└── Ops Processes/
    └── SETUP.md
```

---

## After Any Change

1. Save to local source first
2. Run sync commands
3. Tell Marcelo to upload/refresh the relevant file in the matching Perplexity Space

---

## New Space Checklist

1. Create Space folder in local source
2. Create SETUP.md with Hermes-native content
3. Add SETUP.md to Obsidian index
4. Mirror to GitHub
5. Flag Marcelo to create the Space in Perplexity and upload docs

---

## Emergency Restore

If local source is lost:
1. Clone from GitHub: `git clone https://github.com/BIGDAWG35/BossMan.git`
2. Copy from Obsidian if GitHub is behind
3. Restore local from whichever is most recent
