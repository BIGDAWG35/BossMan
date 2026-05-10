# Error Escalation — When to Alert Marcelo

**Source:** OPERATING_BLUEPRINT.md, Phase 1 audit, Phase 5 report
**Status:** Active

---

## Alert Levels

### Level 1 — Monitor (No alert needed)
- Single service restart (< 5 total)
- Temporary timeout on non-critical service
- Any service showing `online` with low restart count

**Action:** Log in daily notes, investigate at next available time.

---

### Level 2 — Investigate (Alert if persists > 24h)
- Service with 5-10 restarts
- Cron job failing repeatedly
- Money pipeline showing stream errors

**Action:** Note in Kanban, try to fix in next session. Alert if not resolved in 24h.

---

### Level 3 — Escalate (Alert Marcelo immediately)
- Any service with >10 restarts
- Binance bot showing `online` (should be STOPPED until Phase 6)
- Telegram gateway disconnected
- Tailscale VPN disconnected
- Service completely unresponsive (not just slow)

**Action:** Page Marcelo via Telegram immediately with details.

---

## Critical Services and Their Expected States

| Service | Expected State | Why |
|---------|---------------|-----|
| **Binance bot** | STOPPED | Missing pre-trade-hook, unsafe to trade |
| **Money pipeline** | online | Active business tool, but monitor closely |
| **Telegram gateway** | connected | BossMan's connection to Marcelo |
| **Tailscale** | connected | Remote access to Money Pipeline |

---

## Binance Bot Alert Protocol

**The Binance bot must NEVER be online until Phase 6 is complete.**

If `pm2 list` shows `binance-bot` as `online`:
1. **Immediately alert Marcelo via Telegram**
2. Include: current time, restart count, last signal time
3. Do NOT stop the bot without explicit approval (need Marcelo decision)

---

## Telegram Gateway Alert Protocol

If `hermes gateway status` shows disconnected:
1. Check if macOS sleep/hibernate interrupted the LaunchAgent
2. Try `hermes gateway restart`
3. If that fails, alert Marcelo with:
   - What was tried
   - Current `~/.hermes/gateway_state.json` contents

---

## Cron Job Alert Protocol

If a cron job has failed 3+ consecutive times:
1. Check the job's error log
2. Attempt one manual run to see the error
3. Document the error in Kanban with:
   - Job name
   - Last 5 error lines
   - What was attempted to fix
4. Alert Marcelo if Level 3 criteria met

---

## Escalation Format

When alerting Marcelo, use this format:

```
🚨 [ALERT] <Service/Job Name>
Status: <current status>
Expected: <what it should be>
Restart count: <N>
Last good: <timestamp>
Actions tried: <list>
Needs your decision on: <specific question>
```

Example:
```
🚨 [ALERT] Binance bot
Status: online
Expected: STOPPED
Restart count: 32
Last signal: 2026-05-07T23:31:15Z
Actions tried: none
Needs your decision: Approve Phase 6 Track B to restore pre-trade-hook + stop bot?
```

---

## Related Files

- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Full blocker analysis
- `~/.hermes/knowledge/SERVICES_MAP.md` — Service status reference
- `~/.hermes/knowledge/PHASE5_REPORT.md` — Phase 5 complete