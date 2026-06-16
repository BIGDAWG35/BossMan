# Critical-Repo Safeguards Applied (2026-06-15)

**Source card:** `t_abbceb77` "Follow-up: bakery port fix + branch protection decision"
**Approved:** Marcelo "A — Approved, close card + apply intermediate safeguards" (2026-06-15 21:23 PDT)

## Safeguard 1: pre-push hook on binance-bot

- File: `~/Projects/binance-bot/.githooks/pre-push` (78 lines)
- Activated via per-repo: `git config core.hooksPath .githooks`
- Committed: `ff84d7d` (pushed to GitHub)
- Blocks force-push to main and deletion of main
- Synthetic force-push test: REJECTED ✓
- New-commit pushes: still allowed ✓
- Bypass: `git push --no-verify`

## Safeguard 2: weekly bare-clone backup cron

- Script: `~/.hermes/scripts/critical-repos-weekly-backup.sh` (2,690 bytes)
- Cron ID: `f81d9ffa3aed`
- Schedule: `0 3 * * 0` (Sunday 3am PT)
- Mode: `no_agent=true`, `deliver=local`
- Repos: binance-bot, boss-hub, money-pipeline
- Backup dir: `~/backups/critical-repos-weekly/YYYY-MM-DD/`
- Retention: 4 most recent (monthly)

## Live state at apply
- PM2: 12/12 online, 0 unstable
- binance-bot: LIVE, $128.05, $75 floor, 6h uptime
- Cron registry: 25 active (was 24, +1)

## Skills saved
- `~/.hermes/skills/devops/git-history-hygiene/SKILL.md` (L-HYGIENE-01..07)
- `~/.hermes/skills/devops/critical-repo-safeguards/SKILL.md` (NEW)
