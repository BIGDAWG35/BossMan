# Trading Ops — Cron Job Ownership

**Source:** OpenClaw TOOLS.md (Wave 1 update), Phase 1 audit
**Status:** Active — cron ownership updated post-Phase 3

---

## Active Cron Jobs — Trading Related

| Cron | Schedule | Purpose | Owner | Status |
|------|----------|---------|-------|--------|
| `money-morning-research` | Daily 5 AM | Morning money/opportunities research | **Hermes** | ⚠️ error |
| `morning-research-summary` | Daily 8 AM | Research summary to Telegram | **Hermes** | ⚠️ error |
| `daily-bot-catchup-logging` | Daily 2 PM | Bot status check and activity logging | OpenClaw | ⚠️ timeout |
| `binance-health-check-evening` | Daily 9 PM | Binance bot evening health check | **Hermes** | ✅ |
| `CSDAWGBOT-Weekly-Strategy-Review` | Saturdays 8 PM | Weekly trading strategy review | OpenClaw | ✅ |
| `poller.js (market data)` | Every 5 min | Market data polling | OpenClaw | ⚠️ Needs migration |

---

## Cron Job Notes

### money-morning-research (5 AM) — ⚠️ Hermes-owned, has errors
Runs via `run_morning_research.sh` against `money-making-dashboard`. Phase 1 audit found this script runs against OpenClaw-era project but is now Hermes-owned. Needs review during Phase 6.

### morning-research-summary (8 AM) — ⚠️ Hermes-owned, has errors
Morning briefing to Telegram. Has errors — likely related to the money-morning-research failures.

### daily-bot-catchup-logging (2 PM) — ⚠️ OpenClaw-owned, times out
Logs bot status. Timeout indicates the job is taking too long and may need optimization or removal.

### binance-health-check-evening (9 PM) — ✅ Hermes-owned, stable
Binance bot health check. Stable and working.

### CSDAWGBOT-Weekly-Strategy-Review (Saturday 8 PM) — ✅ OpenClaw-owned, stable
Weekly strategy review for CSdawgbot (crypto/stocks). Stable.

### poller.js (every 5 min) — ⚠️ OpenClaw-owned, needs migration
Market data polling for trading monitor. OpenClaw-owned legacy cron. Phase 6 should review whether this migrates to Hermes.

---

## Migration Recommendations (Phase 6)

| Job | Current Owner | Recommended Owner | Action |
|-----|--------------|-------------------|--------|
| `money-morning-research` | Hermes | Hermes | Fix errors in Phase 6 |
| `morning-research-summary` | Hermes | Hermes | Fix errors in Phase 6 |
| `daily-bot-catchup-logging` | OpenClaw | Hermes or remove | Optimize or remove |
| `binance-health-check-evening` | Hermes | Hermes | Keep as-is |
| `CSDAWGBOT-Weekly-Strategy-Review` | OpenClaw | OpenClaw | Keep as-is |
| `poller.js` | OpenClaw | Hermes | Migrate to Hermes cron in Phase 6 |

---

## Verification Commands

```bash
# List all cron jobs
crontab -l

# Check specific job output
tail -20 ~/.pm2/logs/money-morning-research-out.log 2>/dev/null

# Check Hermes cron jobs
hermes cronjob list

# Check OpenClaw cron jobs (via LBC35)
# Send to LBC35: "list cron jobs"
```
