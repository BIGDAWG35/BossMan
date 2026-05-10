# YouTube Automation Pipeline — Status

**Source:** Phase 1 audit, SERVICES_MAP.md, YouTube dashboard
**Status:** ✅ Active — YouTube dashboard running

---

## Service Details

| Attribute | Value |
|-----------|-------|
| PM2 Name | `youtube-dashboard` |
| Port | 8140 |
| Health Check | `curl localhost:8140` |
| Status | ✅ Active — 6D uptime |
| Type | Node.js web dashboard |

---

## What the YouTube Dashboard Does

Based on Phase 1 audit, YouTube automation likely includes:
- Channel performance tracking
- Content strategy overview
- Upload scheduling (implied)
- Analytics dashboard

---

## Bot

**YTDAWGBOT** is the OpenClaw bot for YouTube: setup, optimization, strategy, ops.

---

## Related Services

| Service | Port | Purpose |
|---------|------|---------|
| YouTube dashboard | 8140 | Analytics and control |
| YTDAWGBOT | — | YouTube automation bot |
| YouTube Telegram bot | — | OpenClaw youtube bot (token: `8382029348:AAF...`) |

---

## Quick Status Check

```bash
# Check YouTube dashboard
pm2 list | grep youtube

# Access dashboard
curl localhost:8140
```

---

## Phase 6 Consideration

The YouTube automation pipeline should be reviewed during Phase 6 to:
1. Verify YTDAWGBOT is functioning correctly
2. Check if the YouTube dashboard needs updates
3. Review if cron jobs for YouTube automation need attention

---

## Related Files

- `~/.hermes/knowledge/PHASE1_AUDIT_REPORT.md` — OpenClaw Telegram bots (youtube bot)
- `~/.hermes/knowledge/SERVICES_MAP.md` — YouTube dashboard port 8140