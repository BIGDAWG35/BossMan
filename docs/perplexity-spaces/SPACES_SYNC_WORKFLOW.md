# SPACES_SYNC_WORKFLOW
**Purpose:** Define the backup/mirror hierarchy for Marcelo's Perplexity Spaces documentation.
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
| Perplexity Spaces | `app.perplexity.ai/spaces/[user-space]` |

---

## Perplexity Spaces as the Live AI Layer

Perplexity Spaces is where Hermes works inside each Space context. Docs in Perplexity are the **live working layer** — Hermes reads and writes there during active sessions.

**Sync strategy:**
- Local → Obsidian → GitHub: pull changes BACK to local when restoring
- Local → Perplexity: push local docs UP to Perplexity when updating Spaces
- Perplexity → Local: pull Perplexity docs DOWN to local after editing in Perplexity UI

---

## How to Sync (Standard Workflow)

### After any local change:

```bash
# 1. Sync to Obsidian (mirror)
rsync -a --include='*.md' --include='*/' --exclude='*' \
  "/Users/bigdawg/Desktop/perplexity-spaces Hermes/" \
  "/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces/"

# 2. Sync to GitHub
rsync -a --include='*.md' --include='*/' --exclude='*' \
  "/Users/bigdawg/Desktop/perplexity-spaces Hermes/" \
  "/Users/bigdawg/Repos/BossMan/docs/perplexity-spaces/"

# 3. Commit to GitHub
cd /Users/bigdawg/Repos/BossMan
git add docs/perplexity-spaces/
git commit -m "feat(spaces): update Hermes Perplexity Spaces"
git push
```

### After editing in Perplexity UI:

```bash
# Pull Perplexity changes down to local (if Perplexity supports export)
# Then re-sync to Obsidian and GitHub using the commands above
```

---

## Rules for New Spaces and New Docs

### Adding a new Space:
1. Create the Space folder locally in `/Users/bigdawg/Desktop/perplexity-spaces Hermes/[NewSpace]/`
2. Add `SETUP.md` and at minimum `architect_01-claude-usage-policy.md`
3. Create an Obsidian index note at `/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces/[NewSpace]/index.md`
4. Create the folder in BossMan at `/Users/bigdawg/Repos/BossMan/docs/perplexity-spaces/[NewSpace]/`
5. Mirror to both Obsidian and GitHub
6. Upload new Space docs to Perplexity

### Adding a new doc to an existing Space:
1. Save locally first (source of truth)
2. Mirror to Obsidian and GitHub
3. Upload or update in Perplexity

### Never:
- ❌ Edit only the Perplexity copy — always pull changes back to local
- ❌ Edit only the Obsidian copy — treat local as source of truth
- ❌ Edit only the GitHub copy — local is the active working copy

---

## Obsidian Index Notes

Each Space has an `index.md` at:
```
/Users/bigdawg/Obsidian/Hermes/Perplexity Spaces/[Space]/index.md
```

These index notes link to the Space's key docs and are the Obsidian entry point for each Space.

---

## File Structure (Mirror This Exactly)

```
perplexity-spaces Hermes/               (LOCAL SOURCE)
├── QUICK-REFERENCE.md
├── MIGRATION_AUDIT.md
├── SPACES_SYNC_WORKFLOW.md
├── architect_01-claude-usage-policy.md
├── Agent OS/
│   ├── SETUP.md
│   ├── index.md
│   ├── architect_01-claude-usage-policy.md
│   ├── bot-roles.md
│   ├── routing-rules.md
│   └── workspace-map.md
├── Business Ideas/
│   ├── SETUP.md
│   ├── index.md
│   ├── architect_01-claude-usage-policy.md
│   ├── business-opportunities-overview.md
│   ├── business-rules.md
│   ├── money-pipeline-deep-dive.md
│   ├── passive-income-research.md
│   └── revenue-pipeline-status.md
├── Toolchain Dev/
│   ├── SETUP.md
│   ├── index.md
│   ├── architect_01-claude-usage-policy.md
│   ├── dev-environment.md
│   └── hermes-config.md
└── Trading Ops/
    ├── SETUP.md
    ├── index.md
    ├── architect_01-claude-usage-policy.md
    ├── binance-bot-status.md
    ├── trading-overview.md
    └── trading-rules.md
```

---

## Emergency Restore

If local source is lost:
1. Clone from GitHub: `git clone git@github.com:Bigdawg3535/BossMan.git`
2. Copy from Obsidian archive if GitHub is behind
3. Restore local from whichever is most recent

**Always keep GitHub and Obsidian in sync** — they are the two recovery paths.
