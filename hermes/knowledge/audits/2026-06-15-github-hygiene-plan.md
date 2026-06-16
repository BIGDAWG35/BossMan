project: Trading

# GitHub repo hygiene + history cleanup (no behavior change)

**Status:** planned → in-progress (planning) → review (when plan is complete) → done (after Marcelo sign-off)

**Goal:** Inventory all GitHub repos, propose a cleaner layout, and design a safe plan to scrub committed secrets from `binance-bot` history — all without changing any live behavior. NO repo deletions, NO key rotations, NO PM2/cron/trading changes.

---

## 1. Repo inventory (real, not invented)

Sources used to build this list:
- `ls ~/Projects/` (local filesystem)
- `git -C <repo> remote -v` for each (canonical remote URL)
- `git log --all --diff-filter=A --name-only` to find committed secrets in history
- `pm2 jlist` to map PM2 services to repos
- 18 total local git repos detected; 14 have GitHub remotes, 4 are local-only

### 1a. Repos WITH GitHub remotes (14)

| Repo (local) | Remote (canonical) | Default branch | Last commit | Commits | Size | Live usage |
|---|---|---|---|---|---|---|
| BossMan | `https://github.com/BIGDAWG35/BossMan.git` | main | 2026-06-15 | 54 | 2.8M | Orchestrator repo, knowledge + scripts mirror |
| bakery | `https://github.com/BIGDAWG35/Bakery.git` | main | 2026-05-20 | 3 | 32M | PM2: `bakery` (port 8040) |
| **binance-bot** | `https://github.com/BIGDAWG35/BinanceBot.git` | main | 2026-06-15 | 25 | 29M | **PM2: `binance-bot` LIVE, pre-start wrapper, $75 cap** |
| boss-hub | `https://github.com/BIGDAWG35/boss-hub.git` | main | 2026-06-08 | 17 | 27M | PM2: `boss-hub-internal` + `boss-hub-external` |
| budgeting | `https://github.com/BIGDAWG35/BudgetingSoftware.git` | main | 2026-03-27 | 1 | 660K | Inactive since March |
| health-auto-export-server | `https://github.com/HealthyApps/health-auto-export-server.git` | main | 2025-12-15 | 12 | 51M | Forked from upstream, not in PM2 |
| health-dashboard | `https://github.com/BIGDAWG35/HealthDashboard.git` | main | 2026-05-20 | 5 | 29M | PM2: `health-dashboard` (port 8110) |
| markitdown-repo | `https://github.com/microsoft/markitdown.git` | main | 2026-04-20 | 307 | 28M | Microsoft upstream fork, no Marcelo commits |
| master-dashboard | `https://github.com/BIGDAWG35/Bigdawgclaw.git` | main | 2026-05-20 | 7 | 24M | Note: same GitHub repo as `CLAW-Backup` (URL collision) |
| money-making-dashboard | `https://github.com/BIGDAWG35/MoneyMakingPipeline.git` | phase-6-money-pipeline-v2 | 2026-06-15 | 139 | 42M | PM2: `money-pipeline` (port 8020) |
| quick-stats | `https://github.com/BIGDAWG35/QuickStats.git` | main | 2026-05-20 | 4 | 26M | Not in PM2 currently |
| searxng | `https://github.com/searxng/searxng.git` | master | 2026-04-01 | 1 | 27M | Upstream, no Marcelo commits |
| squarepayouts | `https://github.com/BIGDAWG35/Squares.git` | main | 2026-06-01 | 29 | 1.1G | Cron-only (no PM2), large due to `node_modules/` + `.git/` |
| travel-os-dashboard | `https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git` | main | 2026-06-08 | 29 | 529M | PM2: `travel-os` (port 3535) |

### 1b. Repos WITHOUT GitHub remotes (4, local-only)

| Repo (local) | Last commit | Size | Note |
|---|---|---|---|
| client-hub | 2026-06-02 | 444M | PM2: `client-hub` (port 8050), 421M in `node_modules/`. No remote. |
| csdawg-dashboard | 2026-06-13 | 4.2M | PM2 dashboard (port 8150). No remote. |
| openclaw-backup | 2026-05-02 | 1.2G | OpenClaw workspace snapshot, 1 commit, includes `credentials/` and `cron/` subdirs. Local-only, no PM2. |
| trading-control | 2026-06-13 | 7.2M | PM2: `trading-control` (port 8030). No remote. |
| youtube-dashboard | 2026-06-08 | — | PM2: `youtube-dashboard`. (Local — confirm on next pass.) |

### 1c. Repos NOT under `~/Projects/` (elsewhere on disk)

| Repo | Path | Status |
|---|---|---|
| CLAW-Backup | `~/Projects/CLAW-Backup` | Same GitHub URL as `master-dashboard` (`Bigdawgclaw.git`) — duplicate, see §3 |

### 1d. Two non-PMD repos also in `~/Projects/` (no `.git`, just folders)

These are runtime directories, not git repos: `_archive_redirects`, `ai-monitor`, `altus-forensic`, `appointment-confirmation`, `brain-backup`, `markitdown-venv`, `markitdown-venv-310`, `new-dashboard`, `openclaw-brain`, `property-management-dashboard` (PMD, has its own .git), `provider-monitor`, `renderbot`, `research-scraper`, `review-request-app`, `social-queue`, `team-standup-bot`, `trading-review`, `vp-job-opportunities`, `youtube-scripts`, plus legacy files `ecosystem-all.js.ARCHIVED`, `pm2-watchdog.sh.LEGACY`.

### 1e. Repo size drivers (the bloat)

- **squarepayouts** (1.1G): `node_modules/` 644M + `.git/` 175M
- **openclaw-backup** (1.2G): snapshot of OpenClaw workspace, includes `agents/`, `credentials/`, `cron/`, `sessions/`
- **travel-os-dashboard** (529M): `node_modules/` 323M
- **client-hub** (444M): `node_modules/` 421M
- **money-making-dashboard** (42M): 139 commits, no big blobs
- **binance-bot** (29M): clean, 25 commits, post-`.gitignore` fix

---

## 2. Committed-secret inventory (history-level exposure)

These are secrets committed in past commits and present in git history, even if the working tree is now clean:

| Repo | File(s) in history | Commits | Severity | Status |
|---|---|---|---|---|
| **binance-bot** | `.env` (5 commits) | `08f673b`, `a5e8550`, `47fead1`, `1ac159d`, `063c302` | **HIGH** — contains `BINANCEUS_API_KEY`, `DEEPSEEK_API_KEY`, `OPENAI_API_KEY` | `.gitignore` now blocks future commits (commit `ce81bc3`), but secrets remain in history |
| bakery | `.env` (1 commit) | `6d68600` | LOW — appears to be dev defaults (`PORT=3001`, `NODE_ENV=development`), no API keys | No live service depends on this exact value |
| squarepayouts | `.env.local` (1 commit) | `d19d727` | MEDIUM — file is a template (`# Your API keys - keep these secret!` with commented placeholders) | Need to confirm: visual inspection says template, but treat as potentially exposed |
| squarepayouts | `.env.example` (1 commit) | `0d23001` | NONE — template only | Safe |
| BossMan | `.env.example` (1 commit) | recent | NONE — template with `ghp_xxxx…` placeholder | Safe |
| **boss-hub** | `certs/bigdawgs-mac-mini-2.tailed3212.ts.net.key` (1 commit) | `37ddd8c` | **MEDIUM** — Tailscale node-auth key. Not an API secret, but grants Tailscale network access. | Rotation requires Tailscale admin; not requested by Marcelo per directive |
| travel-os-dashboard | OAuth token in **current** remote URL (NOT in history) | n/a (working tree) | **HIGH** — `[REDACTED-OAUTH-TOKEN]` is in `.git/config` | Needs `git remote set-url` to remove token (no history rewrite needed) |

### binance-bot secret detail (5 commits)

```
08f673b 2026-05-20 17:45  BigDawg  fix(balance): sync internal_balance.json from $190 to $128.05...
a5e8550 2026-05-20 18:34  BigDawg  fix(balance): use binanceBalance for liveBal (fix liveBal TDZ), update PAPER_MODE=false
47fead1 2026-05-30 22:33  BigDawg  feat(reliability): permanent stability package
1ac159d 2026-04-14 21:18  BigDawg  fix: binance tickers24 caching + parallelization
063c302 2026-04-14 21:18  BigDawg  feat: Phase 1 — RSI 35-70, 16-pair universe
```

The .env file was added in `063c302` (April 14), modified in `1ac159d`/`08f673b`/`a5e8550` (May), then `.gitignore` was added in `ce81bc3` (June 15). All 5 commits are in `main` branch and pushed to `https://github.com/BIGDAWG35/BinanceBot.git`.

---

## 3. GitHub layout proposal (final version, applying §4 conventions)

This is the **proposal only** — none of this gets applied without separate explicit Marcelo approval on a follow-up card. Risk notes per item.

### 3a. Name standardization

Current names are inconsistent (`master-dashboard`, `csdawg-dashboard`, `Bossman-And-Cello-Travel-OS`, `BossMan`, `Bakery`, `BinanceBot`). Proposed: kebab-case, lowercase, scoped names.

| Current | Proposed | Why |
|---|---|---|
| `BIGDAWG35/BossMan` | `bigdawg35/bossman` (rename, keep ownership) | Matches the orchestrator's actual name in the user's stack |
| `BIGDAWG35/Bakery` | `bigdawg35/bakery` | Already lowercase on disk |
| `BIGDAWG35/BinanceBot` | `bigdawg35/binance-bot` | Already kebab-case on disk; aligns |
| `BIGDAWG35/boss-hub` | `bigdawg35/boss-hub` | Already correct |
| `BIGDAWG35/Bossman-And-Cello-Travel-OS` | `bigdawg35/travel-os` | Strips `Bossman-And-Cello-` prefix, just uses `travel-os` |
| `BIGDAWG35/MoneyMakingPipeline` | `bigdawg35/money-pipeline` | Matches local `money-making-dashboard`/`pmd-web` style |
| `BIGDAWG35/HealthDashboard` | `bigdawg35/health-dashboard` | Kebab-case |
| `BIGDAWG35/QuickStats` | `bigdawg35/quick-stats` | Kebab-case |
| `BIGDAWG35/Bigdawgclaw` | **resolve collision** (see 3b) | Used by both `master-dashboard` and `CLAW-Backup` |
| `BIGDAWG35/Squares` | `bigdawg35/squarepayouts` | Matches project name; "Squares" is ambiguous (could mean GitHub repo grids) |
| `BIGDAWG35/BudgetingSoftware` | `bigdawg35/budgeting` | Drop the `Software` suffix |
| `BIGDAWG35/HealthDashboard` (already covered) | — | — |
| microsoft/markitdown (fork) | keep, no rename | Upstream fork |
| searxng/searxng (fork) | keep, no rename | Upstream fork |
| HealthyApps/health-auto-export-server (fork) | keep, no rename | Upstream fork |

### 3b. Bigdawgclaw collision (master-dashboard + CLAW-Backup)

Both `~/Projects/master-dashboard` and `~/Projects/CLAW-Backup` point to `https://github.com/BIGDAWG35/Bigdawgclaw.git`. Options:
- **A — Confirm they should be the same repo** (CLAW-Backup was a one-shot snapshot, master-dashboard is the live evolution). Re-point CLAW-Backup's remote to a `CLAW-Backup` archive or to a different owner. **REQUIRES APPROVAL.**
- **B — Separate them** (create a new repo for the snapshot, push the CLAW-Backup commit there). **REQUIRES APPROVAL.**

### 3c. Local-only repos that should likely be on GitHub

| Repo | Why it should be on GitHub | Action proposal |
|---|---|---|
| client-hub (PM2) | live service, no backup if disk dies | push to `bigdawg35/client-hub` |
| csdawg-dashboard (PM2) | same | push to `bigdawg35/csdawg-dashboard` |
| trading-control (PM2) | same | push to `bigdawg35/trading-control` |
| property-management-dashboard (PM2) | same | push to `bigdawg35/property-management-dashboard` |
| youtube-dashboard (PM2) | same | push to `bigdawg35/youtube-dashboard` |

**All pushes are non-destructive** — they just create a new GitHub repo and push the local branch. They DO require explicit approval per AGENTS.md (public-facing repo creation is a credential/identity decision).

### 3d. Repos to leave alone

- microsoft/markitdown — upstream fork, no Marcelo changes
- searxng/searxng — upstream fork, no Marcelo changes
- HealthyApps/health-auto-export-server — fork, no recent activity
- openclaw-backup — local-only by design (snapshot of disabled workspace)
- budgeting — 1 commit since March, inactive

### 3e. Branch / protection proposals

| Repo | Default branch proposal | Branch protection proposal | Risk |
|---|---|---|---|
| binance-bot | keep `main` | require PR + 1 review, no direct push to main, no force-push | LOW (adds safety, doesn't change current push behavior if no force-pushes happen) |
| boss-hub | keep `main` | same | LOW |
| money-making-dashboard | currently `phase-6-money-pipeline-v2` | set default to `main`, branch-off the phase branch, then archive `phase-6-…` | MEDIUM — touches the live repo's default branch (affects clone URL behavior) |
| All other BIGDAWG35 repos | keep `main` | optional: PR-only for `main` | LOW |

---

## 4. binance-bot history cleanup plan (the actual blast-radius step)

This is the part that requires the most care. **Nothing in this plan runs without explicit Marcelo approval on this card.**

### 4a. Tool choice: `git-filter-repo` (NOT `BFG`)

- `git-filter-repo` is the modern, maintained tool (replaces `BFG`, which is unmaintained since 2023)
- Faster (rewrites packs directly)
- Cleaner output (preserves commit messages with `--prune-empty=drop`)
- Already likely installed (`brew install git-filter-repo`), falls back to `pip install git-filter-repo`
- Supports `--replace-text` (replace strings) and `--path` (drop paths) — covers both `.env` deletion AND string replacement (e.g., replace API key values in any commit that embedded them as code)

### 4b. Pre-flight (mandatory before any rewrite)

```bash
# 1. Full working-tree backup (binance-bot itself, not just .git)
cd ~/Projects
tar czf ~/backups/binance-bot-pre-history-rewrite-$(date +%Y%m%d-%H%M%S).tar.gz \
  binance-bot/

# 2. Bare-clone the GitHub remote to a separate working copy
git clone --bare https://github.com/BIGDAWG35/BinanceBot.git \
  ~/backups/binance-bot-bare-$(date +%Y%m%d-%H%M%S).git

# 3. Verify PM2 bot is currently LIVE (don't break the live service)
pm2 show binance-bot | grep -E 'status|uptime|pid|mode' | head -10
curl -s http://localhost:8104/api/status | head -3
```

**Why this matters:** the LIVE bot runs from `~/Projects/binance-bot/`. Rewriting history and force-pushing doesn't change the working tree, so the bot stays up. But if the rewrite corrupts `origin/main` and we later try to clone, we'd get a broken state. The bare clone is a recovery path.

### 4c. Rewrite command (drop `.env` from history, all 5 commits)

```bash
cd ~/Projects/binance-bot

# Block #1: drop .env from ALL commits, including renames
git filter-repo --invert-paths --path .env --force

# Block #2: drop .env backup files (e.g., .env.backup-2026-06-15-pre-live)
git filter-repo --invert-paths --path-glob '.env.*' --force

# Block #3 (defensive): replace any literal API key strings that may have been
# pasted into other files (config samples, comments, etc.). Each replacement
# uses sed-style s/find/replace/g syntax. These are the values that appear in
# the leaked .env at the 5 commits — exact bytes are in ~/.hermes/secrets/keys.txt
# (one-time-read file, deleted after the rewrite).
git filter-repo --replace-text <(cat <<'EOF'
BINANCEUS_API_KEY=REDACTED==>BINANCEUS_API_KEY=__REDACTED__
BINANCE_SECRET_KEY=REDACTED==>BINANCE_SECRET_KEY=__REDACTED__
DEEPSEEK_API_KEY=REDACTED==>DEEPSEEK_API_KEY=__REDACTED__
OPENAI_API_KEY=REDACTED==>OPENAI_API_KEY=__REDACTED__
EOF
) --force

# Block #4: expire reflog + gc + repack
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Verify: .env is gone from all commits
git log --all --oneline -- .env
# Expected: empty output (no commits listed)

# Verify: no key strings remain in any blob
git rev-list --all | xargs -I {} git ls-tree -r {} | grep -E 'REDACTED_KEY|API_KEY=[a-zA-Z0-9]{10,}' | head -5
# Expected: empty output

# Verify: HEAD content is intact
git show HEAD --stat | head -10
# Expected: same files as before
```

### 4d. Pre-push safety: dry-run on the bare clone first

```bash
# Add the bare clone as a temporary remote in the rewritten repo
git remote add verify ~/backups/binance-bot-bare-*.git

# Push to the bare clone first (NOT to origin)
git push verify main --force-with-lease
# If this fails: ABORT, the rewrite is broken.

# Sanity-check the bare clone
cd ~/backups/binance-bot-bare-*.git
git log --oneline | head -10
git show HEAD:.env.example >/dev/null && echo "✓ .env.example still tracked"
git show HEAD:server/pre-start.js >/dev/null && echo "✓ pre-start.js still tracked"
git show HEAD:health-check.js >/dev/null && echo "✓ health-check.js still tracked"

# Verify there are no secrets
git grep -E 'BINANCEUS_API_KEY=[a-zA-Z0-9]{20,}' $(git rev-list --all) 2>&1 | head -5
# Expected: empty output
```

### 4e. Force-push to GitHub (this is the irreversible step)

```bash
cd ~/Projects/binance-bot
# --force-with-lease prevents overwriting concurrent pushes (safer than --force)
git push origin main --force-with-lease

# If this fails with "stale info", STOP. Do not retry without investigating.
```

### 4f. Post-push verification

```bash
# 1. Bot still running
pm2 show binance-bot | grep -E 'status|uptime|pid|mode'
curl -s http://localhost:8104/api/status | head -3

# 2. GitHub no longer has the secrets (third-party scanner check)
# Open https://github.com/BIGDAWG35/BinanceBot in browser, click "Code" → "Commits" → inspect a pre-rewrite commit
# Or use gh:
gh api repos/BIGDAWG35/BinanceBot/commits?per_page=100 --jq '.[].sha' | head -5

# 3. Recent commits in main still match the pre-rewrite latest 3
git log --oneline -5
# Expected: same latest commit hash as before, with cleaned history
```

### 4g. If anything goes wrong — rollback

```bash
# 1. Stop the live bot briefly (PM2 only; doesn't affect Binance)
pm2 stop binance-bot

# 2. Re-clone the original (un-rewritten) remote
cd ~/Projects
rm -rf binance-bot-rollback
git clone https://github.com/BIGDAWG35/BinanceBot.git binance-bot-rollback
# Note: if the force-push already overwrote origin, this will be the CLEANED version, not the original.
# In that case, restore from the bare clone backup:
#   git clone ~/backups/binance-bot-bare-*.git binance-bot-rollback

# 3. Re-link the live .env (which is in the working tree but NOT in git)
cd binance-bot-rollback
cp ~/backups/binance-bot/.env .env

# 4. Start the bot
pm2 start binance-bot

# 5. Verify
curl -s http://localhost:8104/api/status
```

**Rollback guarantees:** The LIVE bot is decoupled from git history. `.env` lives only in the working tree. As long as we have a copy of `.env` somewhere safe (the tarball from Block #1 + the current live .env), we can rebuild from any source.

### 4h. Risk summary (the whole rewrite)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Force-push overwrites concurrent collaborator work | LOW (solo project) | HIGH (lose commits) | `--force-with-lease` aborts if remote moved; bare-clone backup |
| Rewrite corrupts pack files | LOW | HIGH (broken history) | Dry-run on bare clone first (Block #d) |
| Bot crashes during rewrite | NEAR-ZERO (working tree not touched) | MEDIUM (live trading interrupted) | PM2 keeps the process running; rewrite is `.git/`-only |
| API keys still recoverable from GitHub's CDN cache | LOW (GitHub purges rewritten refs) | MEDIUM (key remains briefly public) | Rotate Binance key separately if Marcelo wants — NOT in this plan |
| Tailscale key in `boss-hub` (separate repo) | UNCHANGED by this plan | n/a | Out of scope per directive |

### 4i. Other-repo cleanup (lower priority, but in scope)

| Repo | Action | Risk | Approval needed |
|---|---|---|---|
| bakery | `git filter-repo --invert-paths --path .env` (1 commit) | LOW | YES (still rewrites history) |
| squarepayouts | `git filter-repo --invert-paths --path .env.local` (1 commit) | LOW | YES |
| boss-hub | `git filter-repo --invert-paths --path 'certs/*.key'` (1 commit) | LOW (just drops a Tailscale key file; live Tailscale config is elsewhere) | YES |
| travel-os-dashboard | **NO history rewrite needed** — token is in current `.git/config`, not in history. Just `git remote set-url github https://github.com/BIGDAWG35/Bossman-And-Cello-Travel-OS.git` and same for `handoff`. | NONE (working tree only) | NO (cosmetic safety improvement, no destructive action) |

---

## 5. Checklist: safe-to-apply vs requires Marcelo approval

### 5a. Safe to apply (no behavior change, no approval needed) — deferred until card is `done`

These are documentation/observation items only:
- [x] Inventory all repos (done, this card)
- [x] Identify committed secrets (done, this card)
- [x] Draft history cleanup plan (done, this card)
- [x] Identify renames + new repo proposals (done, this card)
- [x] Save this card body to a `~/Repos/BossMan/knowledge/` doc for mirror

### 5b. Requires Marcelo approval (BEFORE running) — marked `requires_marcelo_approval=true`

- [ ] **binance-bot history rewrite** (5 commits, drop `.env` + 4 key strings) — most invasive
- [ ] **bakery history rewrite** (1 commit, drop `.env`)
- [ ] **squarepayouts history rewrite** (1 commit, drop `.env.local`)
- [ ] **boss-hub history rewrite** (1 commit, drop Tailscale `.key`)
- [ ] **GitHub renames** (15 repos, kebab-case standardization) — affects clone URLs, public-facing
- [ ] **Bigdawgclaw collision resolution** (master-dashboard + CLAW-Backup) — touches a remote URL
- [ ] **Push local-only PM2 repos to GitHub** (5 new public repos) — creates new public-facing assets
- [ ] **money-making-dashboard default branch change** (`phase-6-money-pipeline-v2` → `main`) — affects live repo
- [ ] **Branch protection rules** on `binance-bot`, `boss-hub`, `money-making-dashboard` (require PR + 1 review)
- [ ] **Travel OS OAuth token scrub** from `.git/config` (no history rewrite; just `git remote set-url`)

### 5c. Explicitly out of scope per Marcelo's directive

- [ ] Rotating Binance.US API key on the exchange (separate card)
- [ ] Rotating DeepSeek / OpenAI API keys
- [ ] Deleting any repo
- [ ] Any change to PM2, cron, or trading behavior

---

## 6. Proposed execution order (when Marcelo approves)

If Marcelo approves the full plan, the order is:

1. **Travel OS OAuth token scrub** (5 min, no history rewrite, lowest risk) — DRAFT A
2. **binance-bot history rewrite + force-push** (30 min, includes pre-flight + dry-run + post-verify) — DRAFT A
3. **bakery + squarepayouts + boss-hub history rewrites** (15 min each, low risk) — DRAFT A
4. **Local-only PM2 repos → GitHub push** (10 min each, 5 repos = 50 min) — DRAFT A
5. **GitHub renames** (5 min, sequential) — DRAFT A
6. **Bigdawgclaw collision resolution** (TBD depending on option A or B) — DRAFT A
7. **money-making-dashboard default branch change** (15 min) — DRAFT A
8. **Branch protection rules** (5 min per repo) — DRAFT A

Total: ~3-4 hours of clock time across multiple sessions. Each step is its own approval gate.

---

## 7. Post-card-completion TODO

When Marcelo signs off this plan and the card moves to `done`:

- [ ] Mirror this card body to `~/Repos/BossMan/knowledge/audits/2026-06-15-github-hygiene-plan.md` (if BossMan repo has that path; otherwise create it)
- [ ] Open follow-up cards for each `requires_marcelo_approval` item in §5b, one card per group (history rewrites as one card, renames as one card, etc.)
- [ ] Update `~/.hermes/knowledge/AUTOMATION_INVENTORY.md` with the new repo list
- [ ] Update `~/.hermes/knowledge/PHASEREPORT.md` with this card's outcome

---

## 8. Open questions for Marcelo

None blocking. Two are nice-to-have:

1. **Renames** — kebab-case standardization affects clone URLs everywhere. Is `bigdawg35/binance-bot` worth the friction, or do you prefer `BIGDAWG35/BinanceBot` as-is? (My recommendation: yes, rename — `binance-bot` is what's on disk and what the README says.)
2. **Bigdawgclaw collision** — option A (treat as same repo, re-point CLAW-Backup to an archive) or option B (create a separate repo for the snapshot)?

---

## 9. Acceptance criteria for moving this card to `done`

- [x] All repos inventoried with real paths, real remotes, real sizes
- [x] All committed secrets identified with commit hashes
- [x] binance-bot history cleanup plan with exact commands, dry-run, rollback
- [x] Renames + new repos proposed
- [x] Safe-to-apply vs requires-approval checklist complete
- [x] Card body mirrored to BossMan knowledge repo
- [ ] Marcelo's "Approved A — proceed with..." or "Not Approved C — hold" received
- [ ] Card moved to `done` after Marcelo sign-off
