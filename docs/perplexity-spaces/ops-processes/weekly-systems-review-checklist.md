# Weekly Systems Review Checklist
**Owner:** BossMan | **Cadence:** Weekly | **Human reviewer:** Marcelo
**Last run:** 2026-05-20 (Week of)

---

## 1. Performance Review

### PM2 Health
- [ ] PM2 status: `pm2 status` — any processes online?
- [ ] PM2 logs: `pm2 logs --lines 50 --nostream` — errors/warnings?
- [ ] Health monitor log: `~/logs/pm2-health.log` — any restarts/crash loops this week?
- [ ] Note: Services run as LaunchAgents now (not PM2). PM2 health monitor (`d4f07e0c180f`) checks for `binance-bot`, `squarepayouts`, `money-pipeline` but entries don't exist in PM2. Verify if these should be migrated or monitor updated.
- [ ] **Action if crash loop found:** Check `~/logs/pm2-health.log` for timestamps, count restarts, escalate via Kanban if >5 restarts

### Hermes / Gateway
- [ ] `launchctl list | grep hermes` — is `ai.hermes.gateway` running?
- [ ] Gateway PID stable? (check current_run in `ps aux | grep hermes`)
- [ ] Any Telegram messages queued/unprocessed?

### LaunchAgents
- [ ] `launchctl list | grep -E "openclaw|binance|money-pipeline|squarepayouts|bakeryops"` — all expected services present?
- [ ] Status 0 = loaded correctly, status non-zero = problem (investigate)

### Cron Jobs
- [ ] `cronjob list` — review all scheduled jobs, confirm all are intended
- [ ] Flag: any new jobs not on the approved list?
- [ ] Flag: any disabled jobs that should be re-enabled?

### Critical Paths (ports)
- [ ] Binance bot (8104), Crypto tracker (8020), Sports Squares (8030), BakeryOps (3001) — confirm ports listening

---

## 2. Memory Quality Check

### Persistent Memory (BossMan profile)
- [ ] `/Users/bigdawg/.hermes/memory.md` — exists? Last write?
- [ ] Memory usage: is the file approaching 2,200 char limit?
- [ ] Review for stale entries (tasks done, old PR numbers, temp state) — move to session_search if referenced from past sessions
- [ ] Check for missing entries that should be durable (new conventions, tool quirks, user preferences)

### Knowledge Docs (`~/.hermes/knowledge/`)
- [ ] Any docs with stale dates or contradictory info?
- [ ] New LEARNED_*.md files added this week? Verify they belong in knowledge not memory
- [ ] OPERATING_BLUEPRINT.md — still current? Any Phase updates needed?

### SOUL / AGENTS
- [ ] `/Users/bigdawg/.hermes/SOUL.md` — review for contradictions or outdated rules
- [ ] `/Users/bigdawg/.hermes/AGENTS.md` — any stale delegation rules?

---

## 3. Workflow Effectiveness Review

### Kanban Board (bossman board)
- [ ] Count: `sqlite3 ~/.hermes/kanban/boards/bossman/kanban.db "SELECT COUNT(*) FROM tasks WHERE status='done';"`
- [ ] Running cards: any stale >7 days?
- [ ] Blocked cards: review blockers — still valid or need unblocking?
- [ ] Ready cards: any that should be running but aren't?

### Blocked Card Review
- [ ] `t_22790ed2` T4 — Storefront Pricing Restructure — still blocked?
- [ ] `t_faa6d371` Phase 6 trading monitor — still blocked?
- [ ] `t_faa6d370` Basecamp feedback triage workflow — still blocked?
- [ ] `t_b22005be` HERMES Master Blueprint — still blocked?
- [ ] `t_096f8073` [BUG] Setup wizard missing upgrade step — still blocked?

### Basecamp Monitor
- [ ] State file: `~/.hermes/basecamp-monitor/state.json` — last check timestamp
- [ ] Processed items this week — any requiring action?
- [ ] Any categories other than `bug/feature/general` flagged? (refund/legal = escalate)

---

## 4. Backlog Grooming

### Old Done Cards (>30 days)
- [ ] Query: any done cards from >30 days ago that could be archived?
- [ ] Archive command: `hermes kanban archive <id>` or manual DB cleanup

### Orphan Ready Cards
- [ ] Any `ready` cards that have been waiting >14 days without being started?
- [ ] Re-prioritize or close them

### TRACK Cards (recurring)
- [ ] Any TRACK cards that should be closed as done this week?
- [ ] Next week's TRACK card scheduled?

---

## 5. Strategic Adjustments

### Week-in-Review
- [ ] What was completed this week?
- [ ] What didn't get done? Why?
- [ ] Any new blockers that appeared?

### Next Week Priorities
- [ ] Top 3 cards that must move forward
- [ ] Any new tasks to create based on this week's findings?
- [ ] Resource conflicts or dependency issues?

### Risk Register
- [ ] Any systems showing degradation signs?
- [ ] Any third-party dependencies (Basecamp, Square, Binance APIs) showing instability?
- [ ] Any security findings from this week's work?

---

## 6. Cron-Driven Automation

### Weekly Review Cron (recommended)
```bash
# Job ID: <create-once>
# Schedule: 0 9 * * 4  (Thursday 9 AM Pacific)
# Deliver: Telegram to Marcelo
# Skills: kanban-worker
```

### Health Monitor Status (already running)
- Job ID: `d4f07e0c180f` | Schedule: `*/5 * * * *` (every 5 min, no_agent)
- Monitors: `binance-bot`, `squarepayouts`, `money-pipeline`
- Alert rules: silent healthy | auto-restart down | alert on recovery or escalation
- Log: `~/logs/pm2-health.log`
- **Note:** PM2 entries don't exist — need to verify monitor target vs actual service layout

### Money Pipeline Cron Jobs
- `money-pipeline-morning-research` (ID: `96518f888d12`) — `0 5 * * *` daily 5 AM
- `money-pipeline-health-monitor` (ID: `5cdaa136eb80`) — `*/30 * * * *` every 30 min

---

## 7. Deliverables This Run
- [x] Weekly review cron template (built this session)
- [x] Review checklist (this file)
- [x] Telegram summary to Marcelo (send_message)
