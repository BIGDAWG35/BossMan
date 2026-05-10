# Broken Cron Jobs — Known Issues

**Source:** OpenClaw TOOLS.md (Wave 1 update), Phase 1 audit
**Updated:** 2026-05-10
**Status:** Active — must be fixed in Phase 6

---

## Broken Jobs

### ⚠️ money-morning-research — Hermes-owned, has errors

| Attribute | Value |
|-----------|-------|
| Schedule | Daily 5 AM |
| Script | `~/Projects/money-making-dashboard/scripts/run_morning_research.sh` |
| Owner | Hermes (via `hermes cronjob`) |
| Purpose | Morning money/opportunities research |
| Status | ⚠️ ERROR |
| Last known issue | Script runs against OpenClaw-era project, needs migration review |

**Phase 1 finding:** This script is OpenClaw-owned but was tagged as Hermes-owned in TOOLS.md update. Actual ownership needs verification with `hermes cronjob list` and `crontab -l`.

**Action for Phase 6:** Review and either fix or deprecate.

---

### ⚠️ morning-research-summary — Hermes-owned, has errors

| Attribute | Value |
|-----------|-------|
| Schedule | Daily 8 AM |
| Purpose | Research summary to Telegram |
| Owner | Hermes |
| Status | ⚠️ ERROR |
| Last known issue | Likely cascading failure from money-morning-research not completing |

**Action for Phase 6:** Fix money-morning-research first — this should resolve.

---

### ⚠️ daily-bot-catchup-logging — OpenClaw-owned, times out

| Attribute | Value |
|-----------|-------|
| Schedule | Daily 2 PM |
| Purpose | Bot status check and activity logging |
| Owner | OpenClaw (legacy) |
| Status | ⚠️ TIMEOUT |
| Last known issue | Job takes too long and hits cron timeout |

**Action for Phase 6:** Optimize the job script or remove if not critical.

---

## Not Broken (Stable)

| Cron | Owner | Status |
|------|-------|--------|
| `daily-improvement-report` (5:15 PM) | OpenClaw | ✅ Stable |
| `binance-health-check-evening` (9 PM) | Hermes | ✅ Stable |
| `CSDAWGBOT-Weekly-Strategy-Review` (Sat 8 PM) | OpenClaw | ✅ Stable |
| `crontab-cleanup-reminder` | OpenClaw | ✅ Done |

---

## Phase 6 Fix Plan

| Job | Issue | Recommended Fix |
|-----|-------|-----------------|
| `money-morning-research` | Error | Review script — migrate to Hermes or deprecate |
| `morning-research-summary` | Cascading | Fix money-morning-research first |
| `daily-bot-catchup-logging` | Timeout | Optimize or remove |

---

## Verification Commands

```bash
# List Hermes cron jobs
hermes cronjob list

# List all crontab entries
crontab -l

# Check specific job error logs
tail -30 ~/.pm2/logs/money-morning-research-err.log

# Check timeout logs
tail -30 ~/.pm2/logs/daily-bot-catchup-logging-err.log
```