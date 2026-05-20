# Weekly Systems Review Template
**Owner:** BossMan
**Schedule:** Every Monday 8 AM PDT via Hermes cron
**Last run:** 2026-05-22 (first run — template created)

---

## Section 1: PM2 Health (from pm2-health.log)

**Week of:** YYYY-MM-DD to YYYY-MM-DD

**Services that went down:**
- [service]: down at [time], recovered [time] / did not recover

**Auto-restart recovery events:**
- [service]: auto-recovered at [time] (↺[count] restarts)

**Crash loops and escalations:**
- [service]: 🚨 CRASH LOOP at [time] (↺[count]) — [action taken]

**PM2 save status:** ✅ Synced / ❌ Unsynced — [action needed]

---

## Section 2: Log Errors (from ~/.pm2/logs/)

**New error patterns this week (not seen before):**
- [service]: [error type] — [brief description]

**Recurring errors (seen multiple times):**
- [service]: [error type] — [frequency]

**Warnings to address:**
- [service]: [warning] — [priority]

---

## Section 3: Kanban Backlog

**Blocked cards and reasons:**
- [card-id]: [title] — [reason blocked]

**Stuck cards (in ready/in_progress >7 days):**
- [card-id]: [title] — [why stuck]

**Completed this week:**
- [card-id]: [title]

**New cards created:**
- [card-id]: [title]

---

## Section 4: Memory Quality Check

**Recent `[PERFORMANCE]` entries logged:**
- [date]: [project] — [finding summary]

**Stale memory flagged for cleanup:**
- [entry] — [reason stale]

**New patterns discovered:**
- [pattern] — [where found]

---

## Section 5: Project Status

### Money Pipeline
- Status: [online/degraded/offline]
- Research pipeline: [working/broken since YYYY-MM-DD]
- Notes: [observations]

### Binance Bot
- Status: [no_signal/active/error]
- Balance: $[amount]
- Notes: [observations]

### SquarePayouts
- Status: [healthy/degraded]
- Notes: [observations]

### BakeryOps
- Status: [healthy/degraded]
- Notes: [observations]

---

## Section 6: Strategic

**Phase progress against HERMES MASTER BLUEPRINT:**
- Phase [N]: [status] — [notes]

**Next week's priority cards:**
1. [card-id]: [title] — [reason priority]
2. [card-id]: [title] — [reason priority]

**Resource constraints or blockers:**
- [blocker] — [impact]

---

## Output to Marcelo

Deliver via Telegram as:
```
📊 WEEKLY REVIEW — [YYYY-MM-DD]

✅ Healthy: [services]
⚠️ Attention: [services] 
🔧 Fixed: [what auto-recovered]
🚨 Escalated: [what needed manual fix]

📋 Done: [N cards]
📋 Next: [top 3 priorities]
```