# Cron Job Ownership — All Jobs

**Source:** OpenClaw TOOLS.md (Wave 1 update), Phase 1 audit
**Updated:** 2026-05-10 (post-Phase 3 doc update)

---

## Ownership Legend

| Owner | Meaning |
|-------|---------|
| **Hermes** | Managed by Hermes agent / `hermes cronjob` tool |
| **OpenClaw** | Managed by OpenClaw/LBC35 legacy cron (needs migration review) |

---

## Active Cron Jobs (7 enabled)

| Cron | Schedule | What it does | Owner | Status |
|------|----------|--------------|-------|--------|
| `money-morning-research` | Daily 5 AM | Morning money/opportunities research | **Hermes** | ⚠️ error |
| `morning-research-summary` | Daily 8 AM | Research summary to Telegram | **Hermes** | ⚠️ error |
| `daily-bot-catchup-logging` | Daily 2 PM | Bot status check and activity logging | OpenClaw | ⚠️ timeout |
| `daily-improvement-report` | Daily 5:15 PM | System learnings + improvement suggestions | OpenClaw | ✅ |
| `binance-health-check-evening` | Daily 9 PM | Binance bot evening health check | **Hermes** | ✅ |
| `CSDAWGBOT-Weekly-Strategy-Review` | Saturdays 8 PM | Weekly trading strategy review | OpenClaw | ✅ |
| `crontab-cleanup-reminder` | May 6, 2026 | One-time reminder | OpenClaw | ✅ Done |

---

## Broken Jobs — Must Fix in Phase 6

### ⚠️ money-morning-research (5 AM) — Hermes-owned, has errors
**Script:** `~/Projects/money-making-dashboard/scripts/run_morning_research.sh`
**Issue:** Phase 1 audit flagged this as OpenClaw-owned script running against money-making-dashboard (an OpenClaw-era project). After Phase 2, this script should be reviewed and possibly migrated.
**Action:** Review during Phase 6 — decide whether to fix under Hermes or deprecate.

### ⚠️ morning-research-summary (8 AM) — Hermes-owned, has errors
**Issue:** Likely failing because it depends on `money-morning-research` completing successfully.
**Action:** Fix `money-morning-research` first — this should resolve.

### ⚠️ daily-bot-catchup-logging (2 PM) — OpenClaw-owned, times out
**Issue:** Job runs too long and hits timeout.
**Action:** Phase 6 — optimize job or remove if not critical.

---

## Stable Jobs

### ✅ daily-improvement-report (5:15 PM) — OpenClaw-owned
System learnings and improvement suggestions. Stable, no action needed.

### ✅ binance-health-check-evening (9 PM) — Hermes-owned
Binance bot health check. Stable and working.

### ✅ CSDAWGBOT-Weekly-Strategy-Review (Saturday 8 PM) — OpenClaw-owned
Weekly trading strategy review for CSdawgbot. Stable, no action needed.

### ✅ crontab-cleanup-reminder — Done
One-time job, already completed. Can be removed from crontab.

---

## Phase 6 Cron Migration Plan

| Job | Current Owner | Recommended Action |
|-----|--------------|-------------------|
| `money-morning-research` | Hermes | Fix errors or deprecate |
| `morning-research-summary` | Hermes | Fix after money-morning-research resolved |
| `daily-bot-catchup-logging` | OpenClaw | Optimize or remove |
| `daily-improvement-report` | OpenClaw | Keep as-is |
| `binance-health-check-evening` | Hermes | Keep as-is |
| `CSDAWGBOT-Weekly-Strategy-Review` | OpenClaw | Keep as-is |
| `poller.js (market data)` | OpenClaw | Migrate to Hermes during Phase 6 |

---

## Verification Commands

```bash
# List all cron jobs
crontab -l

# Check Hermes cron jobs
hermes cronjob list

# Check specific job error logs
tail -30 ~/.pm2/logs/money-morning-research-err.log 2>/dev/null

# Add a new Hermes cron job
hermes cronjob create --name "test-job" --schedule "0 10 * * *" --prompt "Your task"
```

---

## Note

All jobs use MiniMax M2.1 model. Obsidian jobs (morning briefing, daily summary, memory consolidation) disabled due to model/timeouts.