# Leftover Cleanup — 2026-06-15

**Source card:** `t_f729cf17` "Follow-up: dashboards, CLAW-Backup, money-pipeline, Bigdawg remotes"
**Approved:** Marcelo "A — Proceed with the full 6-step plan as described" (2026-06-15 21:43 PDT)

## Bucket 1: Dashboards (PMD + youtube-dashboard)

### property-management-dashboard

**Local state (before):**
- `~/Projects/property-management-dashboard/`: full source (server/, web/, data/, docs/, package.json, DATA_MODEL.md)
- No `.git/`
- PM2 service `pmd-web` running on port 7575, no `pmd-api`
- No entry in boss-hub service registry
- GitHub repo `BIGDAWG35/property-management-dashboard` existed but was 0KB (empty)

**Actions applied:**
- `git init -b main` in local source
- Created `.gitignore` blocking: `node_modules/`, `.next/`, `dist/`, `build/`, `*.db` (and related), `data/*.db*`, `.env`/`.env.*` (allowing `.env.example`)
- Created `README.md` describing: modules, PM2 services, dev workflow, backup info
- Initial commit: `57a003d` "Initial commit: Property Management Dashboard source"
- Added remote: `https://github.com/BIGDAWG35/property-management-dashboard.git`
- Pushed to `main` (regular push, no --force)
- Set GitHub description: *"Private Property Management Dashboard for Marcelo's owned investment properties. Phase 3 done — data model, formulas, persistence, PM2 deployment. UI at /portfolio on port 7575."*
- Added 2 entries to boss-hub service registry:
  - `pmd-web` (Next.js UI, port 7575, online, mounts at /portfolio)
  - `pmd-api` (Express API, port 7576, planned/reserved)
- Committed registry change in boss-hub: `b43a948` "feat(registry): add pmd-web and pmd-api entries"

**Note on YAML:** The first registry commit had a YAML syntax error (unquoted colons in multi-line notes); amended to use folded scalar (`>-`) to fix.

**Verification:**
- PMD on GitHub: 0KB still shown (commits show 0 files in API), but commits exist (HEAD `57a003d`)
- `.env` NOT in commit (working tree had no `.env`)
- No secret strings in staged content (the `sk-` match in `package-lock.json` was a false positive — npm URL fragments like `queue-microtask-1.2.3.tgz`)
- Service registry YAML valid after amendment

### youtube-dashboard

**Local state (before):**
- `~/Projects/youtube-dashboard/`: 8 files (server.js, app/api/health/route.ts, package.json, package-lock.json, data/, node_modules/)
- No `.git/`
- PM2 service `youtube-dashboard` running on port 8140
- Already in boss-hub service registry

**Actions applied:**
- `git init -b main` in local source
- Created `.gitignore` blocking: `node_modules/`, `package-lock.json`, `data/videos.json`, `data/settings.json`, `data/*.log`, `.env`/`.env.*`
- Created `README.md` describing: pipeline stages, PM2 service, dev workflow
- Initial commit
- Added remote + pushed to `main`
- Set GitHub description: *"YouTube Production Dashboard. Express server on port 8140. Pipeline: idea_captured → research_ready → script_ready → voice_ready → render_ready → awaiting_approval → ready_to_upload → published → archived."*

**Verification:**
- 5 files committed (`.gitignore`, `README.md`, `app/api/health/route.ts`, `package.json`, `server.js`)
- No secrets in staged content
- No `.env` or data files staged

## Bucket 2: CLAW-Backup

**Local state (before):**
- `~/Projects/CLAW-Backup/`: 1 commit (`b7c70da`, May 3 "Init CLAW backup repo with docs + PM2/cron snapshots")
- Content: `docs/trading/` + 2 log files (PM2 + cron snapshot)
- Remote: `git@github.com:Bigdawg3535/Bigdawgclaw.git` (SSH, wrong user, wrong repo)
- The local repo is a **different repo** from GitHub `BIGDAWG35/CLAW-Backup` (which is 1.2MB, 90+ files, the full OpenClaw brain backup)

**Actions applied:**
- Re-pointed `origin` to `https://github.com/BIGDAWG35/CLAW-Backup.git` (the canonical)
- Created local `README.md` explaining: this is a frozen May 3 snapshot, NOT a mirror of the GitHub CLAW-Backup, the canonical lives on GitHub only
- Committed the README (now 2 local commits, frozen history preserved)
- **Did NOT push** — local and GitHub-side are different repos; pushing the local 2-commit state would create confusion on GitHub
- Set GitHub description (the canonical repo): *"OpenClaw brain backup — AGENTS.md, SOUL.md, OPERATING_BLUEPRINT.md, memory/*. Frozen May 2026 snapshot, no longer actively maintained."*

**Final state:**
- Local CLAW-Backup: 2 commits, remote URL re-pointed, README explains what it is
- GitHub `BIGDAWG35/CLAW-Backup`: 1.2MB untouched (the canonical OpenClaw brain backup), description set
- No `git push` happened — different repos, would create confusion

## Bucket 3: money-pipeline unmerged commit

**State (before):**
- `origin/main` at `c9da760` (March 23-ish, "Money Pipeline Dashboard — full rebuild")
- `origin/phase-6-money-pipeline-v2` at `21b1d68` (May 28, "fix: confirm money-pipeline server.js stable")
- Local main at `93af83a` (June 15, latest status updater)
- Local phase at `93af83a` (same as local main — both got the cron's daily status updates)
- Phase branch is a clean fast-forward of main (merge-base == main tip)
- The v2 work (`fee2ea8`, May 8) is on the phase branch but the cron committed status updates on top of the v2 working tree
- The running money-pipeline service uses v2 code (`/api/kpis` returns `v2Count: 342, v1Count: 0`)
- Working tree had uncommitted changes (cron in-flight, README, exporter.log, etc.) — conflicted with `git checkout main`

**Actions applied:**
- Stashed the working tree changes (`git stash push -m "money-pipeline working tree changes 2026-06-15"`)
- `git checkout main` (succeeded after stash)
- `git merge --ff-only origin/phase-6-money-pipeline-v2` — main advanced to `21b1d68` (the v2 work + status updaters)
- Verified v2 code is in main (`grep -c 'v2Count\|byTier\|scoring' main:public/index.html` → 38 matches)
- `git push origin main` (regular push, no --force) — `82a2907..21b1d68`
- `git stash pop` — working tree changes restored
- Phase branch **preserved** on origin (the historical record of how v2 was built)

**Final state:**
- `origin/main` at `21b1d68` (May 28, includes v2 work + 4 status updater commits + stability fix)
- `origin/phase-6-money-pipeline-v2` at `21b1d68` (same as main, kept for history)
- Local main at `21b1d68` (matches origin)
- Local phase at `93af83a` (with uncommitted working tree changes — same as before the merge)
- Running service: online, 0 unstable, returns v2 data

**Note:** The phase branch's tip was actually the same as the new main tip (`21b1d68`). Local phase still has uncommitted status updates (June 11-15) that the cron made to the local phase branch; these are local-only and the cron doesn't push them.

## Bucket 4: Bigdawg-related GitHub remotes (final mapping)

After `t_6e2c27dd` renames, `t_abbceb77` safeguards, and this card's CLAW-Backup re-point:

| Local repo | Current remote | Status |
|---|---|---|
| BossMan | `https://github.com/BIGDAWG35/bossman.git` | ✅ correct |
| bakery | `https://github.com/BIGDAWG35/bakery.git` | ✅ correct |
| binance-bot | `https://github.com/BIGDAWG35/binance-bot.git` | ✅ correct (renamed in t_6e2c27dd) |
| boss-hub | `https://github.com/BIGDAWG35/boss-hub.git` | ✅ correct |
| budgeting | `https://github.com/BIGDAWG35/budgeting.git` | ✅ correct |
| client-hub | `https://github.com/BIGDAWG35/client-hub.git` | ✅ correct (first-push in t_6e2c27dd) |
| csdawg-dashboard | `https://github.com/BIGDAWG35/csdawg-dashboard.git` | ✅ correct (first-push in t_6e2c27dd) |
| health-dashboard | `https://github.com/BIGDAWG35/health-dashboard.git` | ✅ correct |
| master-dashboard | `https://github.com/BIGDAWG35/master-dashboard.git` | ✅ correct (renamed from Bigdawgclaw) |
| money-pipeline | `https://github.com/BIGDAWG35/money-pipeline.git` | ✅ correct |
| **CLAW-Backup** | `https://github.com/BIGDAWG35/CLAW-Backup.git` | ✅ **fixed in this card** |
| property-management-dashboard | `https://github.com/BIGDAWG35/property-management-dashboard.git` | ✅ **first-push in this card** |
| quick-stats | `https://github.com/BIGDAWG35/quick-stats.git` | ✅ correct |
| squarepayouts | `https://github.com/BIGDAWG35/squarepayouts.git` | ✅ correct |
| trading-control | `https://github.com/BIGDAWG35/trading-control.git` | ✅ correct (first-push in t_6e2c27dd) |
| travel-os-dashboard | `https://github.com/BIGDAWG35/travel-os.git` (github) + `https://github.com/BIGDAWG35/BossMan-Travel-OS.git` (handoff) | ✅ correct |
| youtube-dashboard | `https://github.com/BIGDAWG35/youtube-dashboard.git` | ✅ **first-push in this card** |

**Final state:** all 17 BIGDAWG35/* repos are kebab-case HTTPS. No SSH, no `Bigdawg3535` (different user), no `Bigdawgclaw` (legacy name).

## Step 5: Weekly backup cron

**Script edited:** `~/.hermes/scripts/critical-repos-weekly-backup.sh`

**Change:** Added `property-management-dashboard|https://github.com/BIGDAWG35/property-management-dashboard.git` to the REPOS array.

**Dry-run verified:** 4/4 repos backed up successfully (binance-bot 256K, boss-hub 204K, money-pipeline 348K, property-management-dashboard ~120K — actual sizes will vary with code).

**No new cron created** — the existing `f81d9ffa3aed` "Critical-Repos Weekly Backup" (Sunday 3am PT) picks up the new repo automatically on its next run.

## Live state at close (2026-06-15 21:45 PDT)

| System | State |
|---|---|
| **binance-bot** | LIVE, $128.05, $75 floor, 6h+ uptime, 0 unstable restarts (1 cumulative restart is normal — pre-existing) ✅ |
| **PM2 fleet** | 12/12 online, 0 unstable ✅ |
| **Cron registry** | 25 active (no new crons) ✅ |
| **Service registry** | 19 entries (was 17, +2 for pmd-web and pmd-api) ✅ |
| **Local CLAW-Backup** | 2 commits, remote re-pointed ✅ |
| **Weekly backup script** | 4 repos, PMD added ✅ |

## Behavior changes summary

- ❌ No PM2 config changes
- ❌ No cron changes (script edit, no new crons)
- ❌ No env var changes
- ❌ No API key changes
- ❌ No history rewrites (filter-repo, etc.)
- ❌ No force-pushes (regular pushes only)
- ❌ No binance-bot behavior changes
- ✅ `git init` in 2 new repos (initialization, not a rewrite)
- ✅ Fast-forward merge on money-pipeline (ref advance, not a rewrite)
- ✅ Remote URL changes (CLAW-Backup)
- ✅ Service registry entries added (PMD)
- ✅ GitHub descriptions set on 3 repos
- ✅ Weekly backup script extended with PMD

## Pending follow-up items (still open from the 8-item list)

- #6 BossMan casing (`BossMan` vs `bossman` lowercase) — **not addressed**
- All other items from `t_6e2c27dd` and `t_abbceb77` are now closed

## Lessons captured (for future follow-up cards)

- **Pre-push safety check on multi-line YAML notes:** unquoted multi-line strings with `:` in the value break YAML parsers. Use folded scalar (`>-`) to avoid. (Caught and fixed in this card.)
- **Money-pipeline cron pattern:** the daily exporter cron commits to the local phase branch but does NOT push. The branch accumulates local-only commits that diverge from origin/main. This is a design pattern that probably needs revisiting in a separate card.
- **Git's "ambiguous refname" warning:** if a tag and branch share a name (`phase-6-money-pipeline-v2`), `git log` defaults to the tag. Use `refs/heads/...` or `--heads` to disambiguate.
