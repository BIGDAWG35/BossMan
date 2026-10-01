# YouTube Automation Pipeline — Status
> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.


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

> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

---

## Related Services

| Service | Port | Purpose |
|---------|------|---------|
| YouTube dashboard | 8140 | Analytics and control |
| YTDAWGBOT | — | YouTube automation bot |
> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

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

> **RETIRED 2026-09-30, removed.** LBC35/OpenClaw is no longer part of the stack. Delegation is now done by BossMan via kanban + route-card.sh. This reference is retained as historical record only.

- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
- `~/.hermes/knowledge/SERVICES_MAP.md` — YouTube dashboard port 8140