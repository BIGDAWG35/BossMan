# LEARNED_PM2_HEALTH_MONITOR.md — PM2 Health Monitor canon

**Source:** Extracted from `~/.hermes/SOUL.md` (2026-07-22, Card `t_soul_md_prune_driftfix_20260722`).
**Permanent 2026-05-28, refreshed 2026-07-22.**

A dedicated self-healing PM2 health check runs as a cron job (every 15 min, via Claude Sonnet — pinned via bossman profile).

**Cron job ID:** `01dff7ff61e4` (bossman profile) — silent when healthy, reports to Marcelo/Telegram only on actual repair.

## Skill: pm2-health-check

Located at `~/.hermes/skills/devops/pm2-health-check/SKILL.md`. Runbook covers all 8 detection rules and 5 repair playbooks.

### Detection Rules
- EADDRINUSE
- High restart count
- PM2 daemon drift
- Route-not-responding
- Orphan process
- 5xx rate
- Next.js stale build
- Unstable restart loop

### Repair Playbooks
- **R1** — PM2 drift
- **R2** — EADDRINUSE orphan
- **R3** — Next.js rebuild (stop → rm -rf .next → build → start → verify)
- **R4** — unhealthy-online restart
- **R5** — full daemon recovery

### Next.js Permanent Rule

**Never use `pm2 restart` alone for build-related crashes.** Required sequence:
```bash
pm2 stop <service>
rm -rf .next
npm run build
pm2 start <service>
# Then verify: PM2 online + curl canonical route returns 200/307 + pm2 save
```

### Critical Port Map (current, post-2026-07-22 drift-fix)

```
pmd-web: 7575  (basePath /pmd)
pmd-api: 7576
binance-bot: 8104
health-os-v3: 8121
money-pipeline: 8020
health-os-v4: 3535
budgeting-software: 8145
travel-os: 3537
```

(Historical: client-hub: 8050, squarepayouts: 8030, bakery: 8040, csdawg-dashboard: 8150, overview: 8100, quick-stats: 8102, health-dashboard: 8110, kraken-bot: 8106, hub: 8090, fresh-dashboard: 5050 — all retired 2026-05-28.)

**Note:** `ecosystem.config.cjs` has incorrect PORT labels for some services — always verify actual port with `lsof -i :<PORT> -P -n`.

### Verification After Any Repair
- PM2 online ✓
- `curl` canonical route returns 200/307 ✓
- `pm2 save` ✓

### Drift Surfaces

For non-trivial incidents, require at least **two of {Claude, DeepSeek, OpenAI}** to agree on the fix path before executing.

### Security & PM2 Watch Goal Loop (Phase S1, 2026-06-23)

Monthly meta-loop wrapping `security-watch` daily/weekly and PM2 Health Monitor. Goal card `t_e56d53cd`, loop spec at `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`.

**Scope & STOPs (do NOT auto-fix inside this loop):**
- No PM2 deletes, no port opens/closes, no service restarts
- No SOUL / AGENTS / ROUTING-RULES / MODELROUTINGWORKFLOW edits
- P1+ findings create separate fix cards; the loop surfaces drift, it does not silently change service behavior.

## Zombie PM2 Daemon Cleanup Playbook (Permanent — 2026-07-22, Card t_drift_pm2_zombie_daemons_20260722)

**Symptom:** PM2 Health Monitor reports "N god daemons detected (expected: 1)" + zombies at `~/.hermes/pro` (PM2_HOME=/Users/bigdawg/.hermes/pro).

**Root cause:** Every Hermes agent invocation that touches `pm2` CLI spawns a temporary PM2 god daemon at `~/.hermes/pro` (separate from the canonical `/Users/bigdawg/.pm2` daemon). When the agent exits, the daemon SHOULD self-terminate, but a race condition causes some to persist. PIDs are typically in the 10k-99k range.

**Detection:**
```bash
ps aux | grep "PM2.*God Daemon" | grep -v grep
# Expect: 1 line (canonical PID 133 at ~/.pm2)
# Violation: 2+ lines, with extra ones showing /Users/bigdawg/.hermes/pro
```

**Safe cleanup procedure (operator-approved, irreversible SIGTERM):**

1. **Pre-check** — verify all 8 service ports (7575, 7576, 8104, 8121, 8020, 3535, 8145, 3537) are owned by canonical daemon (PID 133) workers, NOT by zombies:
   ```bash
   for port in 7575 7576 8104 8121 8020 3535 8145 3537; do
     lsof -i :$port -P -n 2>/dev/null | grep LISTEN
   done
   # All must show canonical daemon PIDs, not zombie PIDs
   ```

2. **Identify zombies** — list ALL PM2 daemons:
   ```bash
   ps aux | grep "PM2.*God Daemon" | grep -v grep
   # Canonical: PM2_HOME=/Users/bigdawg/.pm2
   # Zombies: PM2_HOME=/Users/bigdawg/.hermes/pro
   ```

3. **SIGTERM the zombies** (graceful shutdown):
   ```bash
   kill -TERM <zombie_pid_1> <zombie_pid_2> <zombie_pid_3>
   sleep 5
   # Verify they're gone
   for pid in <zombie_pids>; do
     if ps -p $pid > /dev/null 2>&1; then
       echo "PID $pid still alive — escalate to SIGKILL"
     fi
   done
   ```

4. **Verify canonical daemon unaffected**:
   ```bash
   ps -p 133 -o pid,etime,command
   pgrep -P 133 | wc -l  # must equal 8
   ```

5. **Clean up `~/.hermes/pro/`**:
   ```bash
   mkdir -p ~/.hermes/archive/pm2-zombie-cleanup-$(date +%Y%m%d)
   cp ~/.hermes/pro/pm2.log ~/.hermes/archive/pm2-zombie-cleanup-$(date +%Y%m%d)/pro-pm2.log
   rm -rf ~/.hermes/pro/
   ```

6. **Verify final state**:
   ```bash
   ps aux | grep "PM2.*God Daemon" | grep -v grep  # must show ONLY canonical
   [ ! -d ~/.hermes/pro ] && echo "~/.hermes/pro removed"
   curl -sS -o /dev/null -w "HTTP %{http_code}\n" --max-time 5 http://localhost:7575/pmd/api/properties  # one of the 8 services
   ```

**Automated detection:** PM2 Health Monitor cron `01dff7ff61e4` checks for zombie daemons every 15 min. When detected, it auto-creates a `t_drift_pm2_zombie_daemons_<date>` kanban card with full diagnosis (PID, age, parent, owned ports). BossMan surfaces the card to Marcelo for cleanup approval.

**2026-07-22 cleanup session — PIDs killed:**
- 64323, 11161, 11155 (already self-terminated between 18:20 and 18:25 PT detection)
- 21084, 21092, 21100 (new zombies from concurrent agent spawns during cleanup, killed at 18:25 PT)

### Known Issues (logged 2026-07-22)

- pmd-web (port 7575) all-routes 404 — stale `.next/` build artifact. Not in auto-repair whitelist; needs Marcelo decision (separate card).
- Zombie daemon spawn race: concurrent PM2 CLI invocations create multiple `~/.hermes/pro` daemons. Root cause investigation deferred; for now, manual cleanup playbook above is the standard response.
