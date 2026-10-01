
> **[HISTORICAL — 2026-09-30]** Archived / incident document. LBC35/OpenClaw delegator retired per card `t_735da189`. Preserved as-is for context.

# LBC35 Telegram Spam Incident — 2026-07-20 (LEARNED)
**Version:** v3.0
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned (incident postmortem)
**Source of truth:** Kanban card `t_drift_lbc35_telegram_spam_20260720` (closed)

## Original title

_LEARNED_LBC35_TELEGRAM_INCIDENT_

---

## Incident

**2026-07-20 23:53** — Marcelo reported Telegram messages from `@LBC35_bot`:
- Daily "Research POST Complete" messages at 5:01 AM
- Source attribution: "Money Pipeline (port 8020)"
- 4 days visible in screenshot (2026-07-16 through 2026-07-20)

## Root cause

The OpenClaw gateway (`ai.openclaw.gateway`) was supposed to be DISABLED per V3 canon (AGENTS.md "OpenClaw/LBC35 — No Autonomous Messaging", 2026-05-18). Someone re-enabled it.

A second issue compounded: the `money-pipeline-auto-enrich-v2` cron (OpenClaw-managed, runs daily at 6 AM PDT) had:
- `enabled = true`
- `failureAlert.after = 3, channel = telegram`

The cron has been **failing EVERY DAY since 2026-05-31** with `FailoverError: The AI service is temporarily overloaded`. After 3+ failures, the failureAlert fired and sent Telegram messages directly to Marcelo (chat_id 8536867361) — even though the cron itself wasn't supposed to be sending anything.

The "Research POST Complete" wording was misleading — the cron never completed. It was a 3+ failure alert about a broken cron that's been broken for ~2 months.

## Detection failure

Three layers of governance were supposed to prevent this:

1. **May 18, 2026 governance**: `ai.openclaw.gateway` was disabled + moved to `disabled/` directory
2. **LBC35 SOUL v2.0/v3.0**: forbids autonomous Telegram messaging
3. **V3 canon**: AGENTS.md § "OpenClaw/LBC35 — No Autonomous Messaging"

But none of these prevented the reactivation. Likely cause: someone re-enabled the gateway outside of the canonical workflow between May 18 and July 20. The cron jobs file (`jobs.json.migrated`) was last modified 2026-07-14 — possibly when it was reactivated.

## Auto-remediation (2026-07-20 23:54)

```bash
# 1. Stop the OpenClaw gateway
launchctl bootout gui/$(id -u)/ai.openclaw.gateway

# 2. Move the live plist to disabled/
mv ~/Library/LaunchAgents/ai.openclaw.gateway.plist \
   ~/Library/LaunchAgents/disabled/ai.openclaw.gateway.plist.disabled-2026-07-20

# 3. Disable the broken cron
# edited ~/.openclaw/cron/jobs.json.migrated:
#   - auto-enrich-v2-17780117.enabled = false
#   - auto-enrich-v2-17780117.failureAlert = {after: 999, channel: none}
```

**Verified post-fix**:
- ✅ `launchctl list | grep openclaw` — no output
- ✅ `ps aux | grep openclaw` — no openclaw processes
- ✅ OpenClaw cron registry: 1 enabled, 0 with telegram delivery

## Lessons learned

### 1. Failure alerts bypassed BossMan

The `failureAlert.channel: telegram` field in OpenClaw cron jobs was a **direct Telegram bypass** that didn't route through BossMan. This violates the "BossMan is the single status surface" canon.

**Fix**: All future cron jobs (Hermes or OpenClaw) must use `deliver: local` and route through BossMan for any Telegram messaging. Failure alerts should not have direct Telegram channels.

### 2. Two months of silent failure

The auto-enrich-v2 cron was broken from 2026-05-31 to 2026-07-20 (~50 days) before anyone noticed. The cron's own "no Telegram on success" logic meant nobody got pinged for individual failures — only after 3+ consecutive failures, which only happened to fire yesterday.

**Fix**: Add a daily Hermes cron that scans OpenClaw job runs and surfaces "X consecutive failures" as a BossMan-routed Telegram alert.

### 3. The `ai.openclaw.gateway` resurrection was undetected

The May 18 disable worked, but the gateway came back between May 18 and July 14 (when the cron registry was last modified). No drift-detection caught this.

**Fix**: Add the OpenClaw gateway status to the daily `pm2-health-monitor.sh` check + `hermes-canon-drift-check.sh` should include a LaunchAgent audit.

### 4. Misleading message format

"Research POST Complete" looks like a success message but actually signaled a 3+ failure alert. The wording should have been "FAIL: auto-enrich-v2 failed for 3+ days" or similar.

**Fix**: OpenClaw cron jobs should use unambiguous alert copy. (Or remove the cron entirely since it doesn't deliver value when broken.)

## What to do next

1. **Investigate `auto-enrich-v2` root cause** — `FailoverError: The AI service is temporarily overloaded` suggests the AI provider is degraded. May need to switch providers or back off the schedule.
2. **Add Hermes-side cron job audit** — daily scan of OpenClaw `jobs.json.migrated` for enabled jobs with `channel: telegram` + consecutive failures.
3. **Update the daily health check** — include OpenClaw LaunchAgent state in `pm2-health-monitor.sh`.

## Cross-references

- `t_drift_lbc35_telegram_spam_20260720` — Kanban card (closed done)
- `~/.openclaw/cron/jobs.json.migrated` — source registry (auto-enrich-v2 disabled)
- `~/Library/LaunchAgents/disabled/ai.openclaw.gateway.plist.disabled-2026-07-20` — gateway plist
- `~/.hermes/knowledge/AGENTS.md` § "OpenClaw/LBC35 — No Autonomous Messaging"
- `~/.hermes/knowledge/LBC35_SOUL_v2_delegated_executor.md` (now v4.0 delegator/router)

*This LEARNED doc was created 2026-07-20 as part of the V3 deep-dive pass.*
