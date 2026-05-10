# GitHub Backup Workflow

**Source:** OpenClaw TOOLS.md (lines 107-126), SPACES_SYNC_WORKFLOW.md
**Status:** Active — two separate backup streams

---

## Two GitHub Backup Streams

### 1. OpenClaw Backup (CLAW-Backup repo)
Legacy backup for OpenClaw Brain core files. Backs up SOUL.md, AGENTS.md, TOOLS.md to `BIGDAWG35/CLAW-Backup`.

### 2. Hermes Backup (BossMan repo)
Primary backup for Hermes knowledge. Backs up `~/.hermes/knowledge/` to `~/Repos/BossMan/` (docs folder).

---

## OpenClaw GitHub Backup (Legacy)

**Repo:** `BIGDAWG35/CLAW-Backup`
**Backed up files:**
- `SOUL.md`
- `AGENTS.md`
- `TOOLS.md`

**Sync:** rsync to local clone, then git push

```bash
# Example (from TOOLS.md)
CLAW-REPO="/Users/bigdawg/Repos/CLAW-Backup"
SOURCE="/Users/bigdawg/Desktop/Openclaw Brain/Openclaw Brain"

# Sync SOUL, AGENTS, TOOLS to CLAW-Backup
rsync -av "$SOURCE/SOUL.md" "$SOURCE/AGENTS.md" "$SOURCE/TOOLS.md" "$CLAW-REPO/"

# Commit and push
cd "$CLAW-REPO"
git add .
git commit -m "docs: sync OpenClaw core files $(date +%Y-%m-%d)"
git push
```

---

## Hermes GitHub Backup (Primary)

**Repo:** `BIGDAWG35/BossMan` (local: `~/Repos/BossMan/`)
**Backed up:** `~/.hermes/knowledge/` → `docs/`

```bash
REPO="/Users/bigdawg/Repos/BossMan"
KNOWLEDGE="/Users/bigdawg/.hermes/knowledge"

# Sync knowledge to GitHub
rsync -av --include='*.md' --exclude='*' "$KNOWLEDGE/" "$REPO/docs/"

# Commit and push
cd "$REPO"
git add docs/
git commit -m "docs: sync Hermes knowledge $(date +%Y-%m-%d)"
git push
```

---

## Perplexity Spaces GitHub Backup

**Path:** `~/Repos/BossMan/docs/perplexity-spaces/`

Per SPACES_SYNC_WORKFLOW.md, Perplexity Spaces content syncs to GitHub via rsync.

```bash
SOURCE="/Users/bigdawg/Desktop/perplexity-spaces Hermes"
REPO="/Users/bigdawg/Repos/BossMan"

rsync -a --include='*.md' --include='*/' --exclude='*' "$SOURCE/" "$REPO/docs/perplexity-spaces/"

cd "$REPO"
git add docs/perplexity-spaces/
git commit -m "feat(spaces): update Hermes Perplexity Spaces"
git push
```

---

## Backup Priority

| Backup | Frequency | Trigger | Status |
|--------|-----------|---------|--------|
| OpenClaw GitHub (CLAW-Backup) | Manual or periodic | After SOUL/AGENTS/TOOLS changes | Legacy |
| Hermes GitHub (BossMan) | Per sync workflow | After knowledge changes | Primary |
| Perplexity Spaces GitHub | Per SPACES_SYNC_WORKFLOW | After Space content changes | Active |

---

## Verification

```bash
# Check BossMan repo status
cd ~/Repos/BossMan && git status

# Check last sync
cd ~/Repos/BossMan && git log --oneline -3

# Check Perplexity Spaces backup
ls ~/Repos/BossMan/docs/perplexity-spaces/
```