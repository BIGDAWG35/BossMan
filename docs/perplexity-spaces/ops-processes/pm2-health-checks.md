# LEARNED_PM2_HEALTH_MONITOR.md — PM2 Health Monitor canon
**Permanent 2026-05-28, refreshed 2026-07-22. Cron:** `01dff7ff61e4` (bossman, every 15 min) — silent healthy; alerts only on repair.

## Skill: pm2-health-check
Runbook: `~/.hermes/skills/devops/pm2-health-check/SKILL.md`.

**Detection:** EADDRINUSE · High restart count · PM2 daemon drift · Route-not-responding · Orphan process · 5xx rate · Next.js stale build · Unstable restart loop

**Repair:** R1=PM2 drift · R2=EADDRINUSE orphan · R3=Next.js rebuild (stop→rm -rf .next→build→start→verify) · R4=unhealthy-online restart · R5=full daemon recovery

### Next.js Permanent Rule
**Never `pm2 restart` alone for build crashes.** Required:
```bash
pm2 stop <svc> && rm -rf .next && npm run build && pm2 start <svc>
# Verify: PM2 online + curl canonical route 200/307 + pm2 save
```

### Port Map (post-2026-07-22)
`pmd-web:7575(basePath=/pmd)` · `pmd-api:7576` · `binance-bot:8104` · `health-os-v3:8121` · `money-pipeline:8020` · `health-os-v4:3535` · `budgeting-software:8145` · `travel-os:3537`

### Verification After Any Repair
PM2 online ✓ · curl canonical route 200/307 ✓ · pm2 save ✓

### Drift Surfaces + Security Watch
Non-trivial incidents require **2 of {Claude, DeepSeek, OpenAI}** to agree before executing. Goal loop card `t_e56d53cd` (`GOAL-LOOP-SECURITY_PM2.md`). **STOPs:** No PM2 deletes, port changes, service restarts, SOUL/AGENTS/ROUTING-RULES edits. P1+ → separate fix card.

---

## Zombie PM2 Daemon Cleanup (Permanent — 2026-07-22)

**Symptom:** "N god daemons (expected 1)" + zombies at `~/.hermes/pro`.

**Root cause:** Short-lived/concurrent PM2 CLI with non-canonical PM2_HOME leaves orphaned daemons (PIDs 10k–99k).

**Detection:** `ps aux | grep "PM2.*God Daemon" | grep -v grep` — expect 1 line (canonical PID 133).

**Cleanup:**
1. Pre-check ports owned by canonical daemon: `for port in 7575 7576 8104 8121 8020 3535 8145 3537; do lsof -i :$port -P -n 2>/dev/null | grep LISTEN; done`
2. Identify zombies (extra lines at `~/.hermes/pro`)
3. `kill -TERM <zombie_pid>` → wait 5s → verify gone; SIGKILL if survive
4. Verify canonical: `ps -p 133 && pgrep -P 133 | wc -l` (expect 8)
5. Archive: `mkdir -p ~/.hermes/archive/pm2-zombie-cleanup-$(date +%Y%m%d) && cp ~/.hermes/pro/pm2.log ~/.hermes/archive/... && rm -rf ~/.hermes/pro/`
6. Final: `ps aux | grep "PM2.*God Daemon" | grep -v grep` (canonical only) + `curl -sS -o /dev/null -w "HTTP %{http_code}\n" --max-time 5 http://localhost:7575/pmd/api/properties`

**Automated:** Cron `01dff7ff61e4` checks every 15 min; on detection creates `t_drift_pm2_zombie_daemons_<date>` card.

---

## PM2 CLI Usage Policy (Permanent — 2026-07-22)

**All PM2 CLI calls → `~/.hermes/scripts/pm2-hermes.sh`** (isolation + kill-by-PID). Never `pm2 kill` (kills canonical daemon). Never call `pm2` directly.

**Wrapper:** (1) `PM2_HOME=$(mktemp -d -t pm2-hermes-XXXXXX)` daemon in tmpdir; (2) `pm2 <subcommand>`; (3) find PID via `lsof $PM2_TMP/rpc.sock`, `kill -TERM <pid>` (never `pm2 kill`), wait 1s → SIGKILL → `rm -rf $PM2_TMP`.

**Migration:** `pm2 <subcommand>` (any) → `~/.hermes/scripts/pm2-hermes.sh <subcommand>` · All active hermes scripts migrated (8 scripts + 4 cron prompts).

**Forbidden (all create zombies or kill canonical):**
```bash
PM2_HOME=~/.hermes/pro pm2 list        # zombie at ~/.hermes/pro
PM2_HOME=$(mktemp -d) pm2 kill       # kills canonical daemon
PM2_HOME=$(mktemp -d) pm2 list       # zombie in tmpdir
pm2 list / pm2 restart (direct)      # zombie daemon
```

---

## pmd-web Auto-Repair Rule (Permanent — 2026-07-22)

**Canonical route:** `/pmd/api/properties` (200, real data). Root `/` + `/portfolio` = 404 (correct, not errors).

**Triggers (ALL must hold):**
1. `/pmd/api/properties` 5xx/non-200 for 3 consecutive probes
2. PM2 jlist: `status: online`
3. Last repair (`/tmp/pmd-web-auto-repair.state`) > 30 min ago
4. Lock `/tmp/pmd-web-auto-repair.lock` absent

**Repair script:** `~/.hermes/scripts/pmd-web-auto-repair.sh`
```bash
~/.hermes/scripts/pm2-hermes.sh stop pmd-web
cd /Users/bigdawg/Projects/property-management-dashboard/web && rm -rf .next && npm run build
~/.hermes/scripts/pm2-hermes.sh start ecosystem.config.cjs --only pmd-web
# Wait up to 30s for /pmd/api/properties → 200
```

**Guardrails:** Rate limit 1/30min (`/tmp/pmd-web-auto-repair.state`; override: `PMD_REPAIR_RATE_LIMIT_MIN=0`) · mandatory lock (`/tmp/pmd-web-auto-repair.lock`) · exit 1 + ESCALATE if still down after 30s (no retry).

**Escalation:** 3 probe failures + last repair <30 min ago · post-repair still failing 30s+ · PM2 status `errored`/`stopped`.

---

## Drift-Check Write-Protection (Permanent — 2026-07-22)
Script: `pm2-canon-drift-check.sh` (cron `c464124c759e`, ops), every 6h. Monitors full-file md5 + 3 section hashes. Baseline md5: `4abdb88570317c01dce2fd237eeb5567`. **Mirrors (all must match):** `~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md` · `~/Obsidian/Hermes/V3-Canon/` · `~/Repos/BossMan/docs/hermes-canon/`
