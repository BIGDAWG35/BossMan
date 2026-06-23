---
name: pm2-health-check
description: PM2 health monitoring and auto-repair for all services. Detects drift, crash loops, EADDRINUSE, Next.js build issues. Self-heals without Marcelo intervention.
trigger: pm2 list shows issues, logs show errors, ports unreachable, restart spike, "Boss Hub says X is down", "services keep drifting", "auto-resurrect on reboot isn't working", "build an in-app service-level health monitor", "system health audit", "full stack audit", or any request for the recurring 7-section service health report
---

# PM2 Health Check & Auto-Repair

## PURPOSE
Durable self-healing PM2 monitoring for Marcelo's entire portfolio. Detect runtime drift before Marcelo notices. Repair without asking Marcelo to run commands.

## Scope & STOPs (Permanent — 2026-06-23)

**Purpose:** Make explicit what pm2-health-check may auto-repair vs what must escalate. Tied to v3 Routing Ledger + Step-5 QA rule.

### Autonomous scope (pm2-health-check may auto-repair without operator approval)

- **Restart whitelisted PM2 services** listed in the AUTO-REPAIR WHITELIST below
- **Next.js rebuild sequence** for build-related crashes: `stop → rm -rf .next → build → start → verify`
- **Orphan process cleanup** when detected (PID exists but no PM2 entry)
- **PM2 daemon drift recovery** when daemon state diverges from process list
- **Health-check loop runs** (silent when healthy, alert on auto-repair or escalation)

### Approval gates (operator approval REQUIRED)

- **Any service NOT on the AUTO-REPAIR WHITELIST** — flag for Marcelo, do not touch
- **New service additions** to the whitelist — explicit approval + whitelisting change in PHASEREPORT
- **Changes to port mapping** (opening/closing/exposing) — explicit approval
- **New cron schedule / cadence changes** — explicit approval

### STOP conditions (MUST halt and escalate)

- **Money pipelines / trading bots** — never auto-restart without operator approval; financial systems can leak capital during restart
- **Auth-bearing services** (NextAuth, OAuth callbacks) without explicit operator approval
- **Env file changes** (`.env`, `.env.local`, secrets.json) — never auto-edit
- **SOUL.md / AGENTS.md / ROUTING-RULES.md / MODELROUTINGWORKFLOW.md edits** — kernel-doc; never in scope of health check
- **Production cutover without rollback plan** — STOP and surface
- **AI model disagreement** — if 2 of {Claude, DeepSeek, OpenAI} do not agree on the fix, STOP

### Routing Ledger (what a card invoking pm2-health-check looks like)

| Field | Value |
|---|---|
| work_type | troubleshooting |
| lead_model | bossman (script-driven) + claude/deepseek reasoning for non-trivial incidents |
| cost_tier | low (auto-loop) — high (multi-service incident) |
| qa_required | no for script-driven repairs, yes for non-trivial incident diagnosis |

### Step-5 QA rule

Step-5 verifier (DeepSeek or best available reasoning model) required for non-trivial PM2 incidents. Script-driven silent repairs don't need Step-5; incident-response with multiple services affected does.

### Canonical references

- AGENTS.md (M3 routing) — `~/.hermes/AGENTS.md`
- ROUTING-RULES v3 — `~/Projects/BossMan/docs/ROUTING-RULES.md`
- PHASEREPORT — `~/Projects/BossMan/PHASEREPORT.md`
- ACP (governance parent) — `~/.hermes/skills/autonomous-change-pipeline/SKILL.md`
- Phase 2 hardening entry — `~/.hermes/knowledge/PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md` (forthcoming)

## REFERENCE FILES
- `references/pm2-infinite-restart-loop-diagnostic.md` — when a PM2 process is in `status: waiting restart` with a high `restart_time` count, the cause is almost always a missing config file at the path PM2 was launched from, not a process bug. 4-step diagnostic recipe. **Read this before assuming a process is broken.**

## MODEL POLICY
- **Reasoning:** Claude, DeepSeek, OpenAI only. MiniMax may orchestrate but NOT decide.
- **Repair threshold:** Two AI models must agree on fix path before BossMan executes.
- **Marcelo escalation:** Only for destructive ops, security changes, or architecture changes.

## ALLOWED SERVICES — AUTO-REPAIR WHITELIST
**Auto-repair may ONLY restart services in this list. Anything else found in PM2 = flag for Marcelo review.**

**Active (post-2026-06-08 incident remediation, verified live):**
```
client-hub           http://localhost:8050  /login          (Next.js) ✅ LIVE
squarepayouts        http://localhost:8030  /login          (Next.js) ✅ LIVE (canonical, post-2026-06-22 PHASE 3.2)
bakery               http://localhost:3001  /               ✅ LIVE (post-D9b fix)
money-pipeline       http://localhost:8020  /api/health     ✅ LIVE
binance-bot          http://localhost:8104  /api/health     ✅ LIVE (PAPER_MODE, capital-starved)
travel-os            http://localhost:3535  /               ✅ LIVE
boss-hub-internal    http://localhost:8160  /               ✅ LIVE (meta)
boss-hub-external    http://localhost:8161  /               ✅ LIVE (meta)
health-dashboard     http://localhost:8110  /               ✅ LIVE
trading-control      http://localhost:8130  /     ✅ LIVE (probes 12 services, ~2s warning)
youtube-dashboard    http://localhost:8140  /               ✅ LIVE
csdawg-dashboard     http://localhost:8150  /               ✅ LIVE (intel dep verified)


<!-- 2026-06-15 audit: trading-control health route changed /api/health -> /. Marcelo directive. Note: /api/health DOES return HTTP 200 + 2223 bytes JSON; / returns HTTP 200 + 8956 bytes HTML. Both work; / is faster (~1ms vs ~3.2s) but /api/health contains 12-service probe data. Per directive, switch to /. -->

<!-- 2026-06-15: caddy was removed from PM2 audit cleanup. Do NOT auto-repair caddy or try to re-add it. If Caddy is ever needed, follow ~/.hermes/knowledge/infrastructure/CADDY_REMOVED_2026-06-15.md. -->
UNREGISTERED but listening (NOT in canonical PM2 daemon, do NOT auto-repair):
fresh-dashboard      http://localhost:5050  /               (orphan process, app config card open)
```

## pmd-web (added 2026-06-15) — NOT in auto-repair whitelist yet
- Project: `/Users/bigdawg/Projects/property-management-dashboard/web`
- Port: 7575
- Health route: **`/portfolio`** (root `/` returns 404; the dashboard mounts at `/portfolio`)
- Status: online, prod mode (`next start -p 7575`), 3D stable, `unstable_restarts: 0`. Cumulative `restart_time: 37` is dev-mode hot-reload noise, not a current issue.
- To add to the whitelist: append `pmd-web   http://localhost:7575  /portfolio` to the ALLOWED table above. NOT auto-added; awaiting Marcelo decision.

## Compact Runbook: Detection + Cleanup (added 2026-06-15)
**Orphan PM2 daemons** (companion to D10 above): `ps aux | grep "PM2 v5" | grep -v grep` — if 2+ lines, count orphans. Canonical = `/Users/bigdawg/.pm2`. Orphans = `~/.hermes/pro/` or `~/.hermes/profiles/<X>/home/.pm2/`. Cleanup: `kill -TERM <orphan_pid>`, verify canonical still owns 12+ services, THEN `rm -rf <orphan_home>`. Never `kill -9`; never `rm` before kill. Always 3-bucket approval before action.

**Cumulative vs unstable restart diagnostic**: `restart_time` is cumulative since first registration. `unstable_restarts` is current-boot context. Healthy service can show `restart_time: 37, unstable_restarts: 0, uptime: 3d` (37 was dev-mode hot-reload churn). Rule: `unstable_restarts: 0` AND `uptime > 1d` = healthy regardless of `restart_time`. Naive reading of high `restart_time` as "crash loop" is a class of false positive. Always pull both fields before alerting.

**`hermes cron` subcommand corrections**: real CLI is `hermes cron <sub>`, NOT `hermes cronjob <sub>`. Subcommands: `create` (positional `[schedule] [prompt]`, NOT `--schedule`/`--prompt` flags), `edit` (canonical, also accepts `update` alias), `remove` (canonical, also `rm`/`delete` aliases), `list`, `pause`/`resume`, `run`, `status`, `tick`. Common directive mistakes: `hermes cronjob delete` → `hermes cron remove`; `hermes cronjob update --schedule "..."` → `hermes cron edit --schedule "..."`; `hermes cron create --schedule "..." --prompt "..."` → `hermes cron create "..." "..." --name "..."` (positional args). When in doubt, `hermes cron <sub> --help`.

**Note on stale entries in this section:** earlier versions of this skill listed bakery at port 8040 and youtube-dashboard at 8140, squarepayouts at 8030. Those were a symptom of D9/D9b env leaks and stale code. The 2026-06-08 incident remediation (see `~/Projects/boss-hub/docs/INCIDENT-localhost-drift-root-cause-2026-06-08.md`) fixed the underlying PM2 daemon and module_conf.json override. The corrected ports are reflected above.

## PERMANENTLY BLACKLISTED — NEVER RESTART
**If any of these appear in PM2, DELETE the entry. Do not restart. Do not ask Marcelo.**

```
kraken-bot          — DEAD (deleted 2026-05-28, folder nuked)
kraken-bot-new      — DEAD (zombie folder, deleted 2026-05-28)
team-standup-bot    — LAUNCHD-managed (com.local.teamstandup), NOT PM2's job
quick-stats         — LAUNCHD-managed (com.local.quickstats), NOT PM2's job
```

## SCOPE — ALL PM2 SERVICES (verified 2026-05-28)

**Rule:** If a service not in ALLOWED appears in PM2 → flag for Marcelo review.
**Rule:** If a BLACKLISTED service appears in PM2 → delete it immediately, never restart.
**Rule:** If a launchd-managed service (quick-stats, team-standup-bot) appears in PM2 → delete PM2 entry only, do NOT touch the launchd service.

## DETECTION RULES

### D1: EADDRINUSE / Port Already in Use
```
Trigger: pm2 logs show "EADDRINUSE" or lsof confirms port bound by orphaned process
Fix: Identify orphan → pm2 delete stale entry → kill orphan if needed → pm2 start
```

### D2: High Restart Count / Crash Loop
```
Trigger: restart_time > 5 within 1hr, or status = "errored" / "stopped"
Fix: Inspect logs → determine root cause → safe repair (see below)
```

### D3: PM2 Daemon Drift
```
Trigger: "Current process list not synchronized with saved list" warning
Fix: pm2 save to sync, or rebuild state if process missing from daemon
```

### D4: Process Online but Route Not Responding
```
Trigger: PM2 says "online" but curl returns non-2xx or timeout
Fix: Verify with curl on canonical route → repair or restart depending on cause
```

### D5: Process Missing from Daemon but Port Bound
```
Trigger: lsof shows port bound but pm2 list shows nothing
Fix: Kill orphaned process → pm2 start ecosystem.config.js → save
```

### D6: High 5xx Response Rate
```
Trigger: curl health route returns 500 repeatedly
Fix: Inspect error logs → determine rebuild vs restart fix
```

### D7: Next.js Stale Build Artifacts
```
Trigger: Next.js process crashes repeatedly with module/import errors, OR
         route returns HTTP 200 but with wrong/missing content (e.g., 404 page
         embedded in RSC payload for a route that should exist), OR
         portal route works locally but returns 404 via external URL when
         previously working
Fix: stop → rm -rf .next → npm run build → pm2 start
```

#### D7-SUB: Wrong Working Directory During Build
```
Trigger: npm run build completes without errors but .next cache was populated
         from wrong directory — Next.js prerenders routes with incorrect module
         resolution context, producing stale/missing content for some routes
Root cause: Build was run from ~ or /Users/bigdawg/ instead of the project
           directory (/Users/bigdawg/Projects/client-hub). Next.js build itself
           succeeds but the .next/prerender cache contains wrong-context output.
         Tailscale Funnel URL returns 404 for routes that work via localhost.
         PM2 process is online and healthy; the bug is in the built artifact.
Pattern observed: Client Hub (port 8050) — build run from wrong root produced
         a .next cache where /portal/squares prerendered as 404. After rebuild
         from correct project directory, all portal routes resolve correctly.
Fix: Same as D7: stop → rm -rf .next → cd /path/to/project && npm run build → start
```

### D8: Unstable Restart Loop
```
Trigger: status = "waiting restart" or multiple "online" appearances in logs
Fix: pm2 delete → pm2 start fresh → save
```

### D9: PM2 Daemon Env Leak — child process binds the wrong port (2026-06-09)

**Pattern observed:** The PM2 god daemon was started in a shell that had `PORT=8040` in its environment (a Hermes cron session: `HERMES_SESSION_ID=cron_01dff7ff61e4_20260608_211042`). The PM2 daemon's process environment bakes that var in. When `pm2 start <script> --name X` forks a child, the child inherits the daemon's env by default. Result: the child reads `process.env.PORT || 3001`, gets `8040`, binds 8040 — not the `3001` the operator intended. The `register-service` / `update-service` calls appear to succeed (`pm2 start` exits 0, the entry shows up in `pm2 list` as online), but the port is wrong. The user's `curl http://localhost:3001/` returns connection-refused while `lsof -nP -iTCP` shows the process on `*:8040`.

**Symptoms (all must be present to suspect D9):**
- `pm2 list` shows the service online, 0 restarts
- `lsof -i :<expected-port>` returns nothing
- `lsof -iTCP -P -n -sTCP:LISTEN` shows the process on a DIFFERENT port
- The service's `pm2_env.env` contains an env var (e.g. `PORT`) that you did NOT set in the `pm2 start` command
- The pm2 logs show the bind on the unexpected port (`Server listening on 8040` not 3001)

**Root-cause diagnostic — the env is on the DAEMON, not on the child:**
```bash
# 1. What port is the child actually binding?
lsof -nP -iTCP -sTCP:LISTEN | grep <pid-of-pm2-managed-process>

# 2. What does the child's env say?
pm2 jlist | python3 -c "
import json, sys
for p in json.load(sys.stdin):
    if p['name'] == '<service_name>':
        print('pm_exec:', p['pm2_env'].get('pm_exec_path'))
        print('env    :', p['pm2_env'].get('env'))
        print('args   :', p['pm2_env'].get('args'))
"

# 3. Is the unexpected var coming from the daemon, not the child?
ps -p $(cat ~/.pm2/pm2.pid) -o args= | tr ' ' '\n' | head -20
# Look for env:VAR=value in the daemon's command line
# Or: cat /proc/<daemon-pid>/environ 2>/dev/null | tr '\0' '\n' | grep -E "PORT=|HOST="
# (macOS doesn't have /proc; use ps eww or `lsof -p <pid> -a | grep -E 'stat|environ'`)

# 4. Was the daemon started by a session that had the env?
# macOS: ps -A -o command | grep "PM2 v5.*God Daemon"
# The PM2 daemon's process args show its PM2_HOME and SILENT mode but NOT its env.
# To read the daemon's env on macOS: ps eww <daemon-pid> | tr ' ' '\n' | grep -E "^PORT=|^HOST="
```

**Three workarounds tried (2026-06-09, all FAILED):**

| # | Attempt | Why it failed |
|---|---|---|
| 1 | `pm2 start script.js --name X --env /tmp/envfile.json` (with `PORT: 3001`) | The `--env` flag sets a "default env block" loaded by the PM2 start action. It does NOT override env vars already in the daemon's process env. The daemon's `PORT=8040` wins. |
| 2 | `PORT=3001 pm2 start script.js --name X` (inline shell env) | The `PORT=3001` is set in the **shell that runs `pm2 start`**, not in the daemon. The forked child inherits the daemon's env, not the shell's. |
| 3 | `pm2 start script.js --name X --update-env --node-args ""` + inline `{"PORT":"3001","HOST":"127.0.0.1"}` | `--update-env` only updates the env block stored in the dump file, which is consulted at next `pm2 start`. The daemon's in-process env still wins for the just-forked child. |

**The only clean fix: restart the PM2 daemon with a clean env.**

```bash
# Step 1: Pause the auto-repair cron (mandatory — see "MANDATORY SEQUENCE: PAUSE AUTO-REPAIR")
cronjob action=pause job_id=01dff7ff61e4

# Step 2: Note the current PM2 process list for verification later
pm2 jlist > /tmp/pm2-jlist-before.json 2>&1

# Step 3: Save the dump
pm2 save

# Step 4: Kill the daemon (this stops all PM2-managed services for ~5-10s)
pm2 kill
sleep 3

# Step 5: Start the daemon in a CLEAN env
# CRITICAL: prefix with `env -i` or use a wrapper that explicitly clears
env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=$HOME PM2_HOME=/Users/bigdawg/.pm2 \
  pm2 resurrect

# Step 6: Verify the env is clean — no PORT, no surprise HOST
pm2 jlist | python3 -c "
import json, sys
for p in json.load(sys.stdin):
    e = p['pm2_env'].get('env', {})
    unexpected = {k:v for k,v in e.items() if k not in ('NODE_ENV','HOST','PORT_<service>')}
    if unexpected:
        print(f'  ⚠️  {p[\"name\"]} env: {unexpected}')
"

# Step 7: Resume the auto-repair cron
cronjob action=resume job_id=01dff7ff61e4

# Step 8: Verify the previously-broken service now binds the right port
pm2 delete <service> 2>/dev/null
pm2 start /path/to/script.js --name <service> --cwd /path/to/cwd
sleep 3
lsof -i :<expected-port> -P -n -sTCP:LISTEN  # must show the process now
curl -sS -o /dev/null -w 'HTTP:%{http_code}\n' http://localhost:<expected-port>/
```

**Why `env -i` and not just "kill and restart":** Killing the daemon with `pm2 kill` and immediately running `pm2 resurrect` from a normal shell would re-inherit the bad env from the *new* shell. `env -i` gives the new daemon a clean slate with only the variables you explicitly pass (`PATH`, `HOME`, `PM2_HOME`). The cron session that started the original daemon is the source of the leak — make sure you do NOT restart the daemon from that same env, or the leak reappears.

**Why this is a hard constraint (no "just unset PORT in the child"):** PM2 does not let you set `env: null` on a per-process basis to bypass the daemon's env. The child always sees what the daemon was started with, plus any `--env` overrides that are non-conflicting. The only path to a clean child env is a clean daemon env.

**This is exactly why the "no bulk changes to healthy services" rule was honored in the 2026-06-09 incident** — the env leak fix required briefly taking down 7 healthy services. The operator approved the audit but the fix was deferred, the affected service (bakery) was rolled back to `tracked_only`, and a new kanban card (`t_pm2_daemon_env_leak_*`) was opened to track the deferred fix. When the operator approves, the fix above is the exact sequence to run.

**Workaround for ops: write a small wrapper that does the env clearing once:**
```bash
# Save as /usr/local/bin/pm2-clean
cat > /usr/local/bin/pm2-clean <<'EOF'
#!/bin/bash
# Start the PM2 daemon with a clean env. Use after `pm2 kill` or as a startup replacement.
env -i PATH=/usr/local/bin:/usr/bin:/bin HOME=$HOME PM2_HOME=/Users/bigdawg/.pm2 \
  /usr/local/lib/node_modules/pm2/bin/pm2 "$@"
EOF
chmod +x /usr/local/bin/pm2-clean

# Then in any session:
pm2-clean start ecosystem.config.js
pm2-clean save
# The daemon now has no PORT/HOST leakage.
```

**Diagnostic recipe (for the next operator who hits this):**
```bash
# Quick "is this D9?" check
service_name=<X>
expected_port=<N>
pm2_pid=$(pm2 jlist | python3 -c "import json,sys; print(next(p['pid'] for p in json.load(sys.stdin) if p['name']=='$service_name'))")
actual_port=$(lsof -nP -iTCP -sTCP:LISTEN -p $pm2_pid 2>/dev/null | awk '$9 ~ /:/ {gsub(/.*:/,"",$9); print $9}' | head -1)
if [ "$actual_port" != "$expected_port" ]; then
  echo "  D9 confirmed: $service_name bound $actual_port, expected $expected_port"
  # Run the daemon env diagnostic from the "Root-cause diagnostic" block above
fi
```

**IMPORTANT — if D9 fix doesn't work, check D9b next.** During the 2026-06-08 bakery restoration, a clean `pm2 kill + env -i pm2 resurrect` did NOT fix the port (still 8040). The D9 daemon-env leak had been removed, but the service STILL bound the wrong port because of a separate persistence layer — `~/.pm2/module_conf.json` had `{"bakery": {"PORT": "8040"}}` from a previous operator. Full D9b detection + fix at `references/d9b-module-conf-override-2026-06-08.md`. Always scan the 5-pillar env-var persistence triad (L1 daemon env / L2 dump.pm2 / L3 module_conf.json / L4 ecosystem / L5 .env) before declaring a port-mismatch unfixable.

## AUTO-REPAIR PLAYBOOK

### R1: PM2 State Drift
```bash
# Step 0: Check for blacklisted services FIRST — delete if found
for svc in kraken-bot kraken-bot-new team-standup-bot quick-stats; do
  pm2 delete $svc 2>/dev/null && echo "Deleted blacklisted: $svc" || true
done

# Step 1: Sync daemon with saved state
pm2 save 2>/dev/null

# Step 2: If still drift, check what's actually running vs saved
pm2 list
cat ~/.pm2/dump.pm2 | python3 -c "import sys,json; [print(p['name'],p['status']) for p in json.load(sys.stdin)]"

# Step 3: Reconcile — start missing, delete stale
pm2 start ecosystem.config.js  # for each missing
pm2 delete <stale> 2>/dev/null

# Step 4: Save clean state
pm2 save
```

### R2: EADDRINUSE (Orphaned Process)
```bash
# Step 1: Find what's on the port
lsof -i :<PORT> -P -n

# Step 2: Identify orphan (not managed by pm2 daemon)
ps aux | grep <PID>

# Step 3: Kill the orphan
kill -9 <PID>

# Step 4: Restart the service
pm2 delete <service> 2>/dev/null
pm2 start /path/to/ecosystem.config.js

# Step 5: Verify
curl -s -o /dev/null -w 'HTTP:%{http_code}' http://localhost:<PORT>/
```

### R3: Next.js Crash Loop (Stale Build)
```bash
SERVICE=$1
PORT=$2
PROJECT_DIR=$3  # e.g. /Users/bigdawg/Projects/client-hub

# Step 1: Stop
pm2 stop $SERVICE 2>/dev/null

# Step 2: Clean build artifacts
cd $PROJECT_DIR
rm -rf .next

# Step 3: Verify cwd before build
pwd  # confirm correct project dir, NOT ~ or /Users/bigdawg/

# Step 4: Rebuild
npm run build 2>&1 | tail -20

# Step 5: Start fresh
pm2 delete $SERVICE 2>/dev/null
pm2 start ecosystem.config.js

# Step 6: Verify both localhost AND external URL
curl -s -o /dev/null -w 'LOCAL:%{http_code}' http://localhost:$PORT/
curl -s -o /dev/null -w 'EXTERNAL:%{http_code}' http://bigdawgs-mac-mini-2.tailed3212.ts.net:$PORT/
# Both should return 200/307. If LOCAL=200 but EXTERNAL=404 → D7-SUB (wrong cwd during build)
```

### R4: Process Online but Unhealthy
```bash
# Just restart (not full rebuild)
pm2 stop <service>
pm2 start ecosystem.config.js
curl -s -o /dev/null -w 'HTTP:%{http_code}' http://localhost:<PORT>/login
```

### R5: Full Daemon Recovery
```bash
# Nuclear option — rebuild entire PM2 state
pm2 kill
sleep 2
pm2 resurrect  # if backup exists
# OR rebuild manually from ecosystem configs
```

## VERIFICATION CHECKLIST (after every repair)
- [ ] PM2 process status = online
- [ ] curl canonical route = HTTP 200 or 307 (auth redirect expected)
- [ ] login/health page loads
- [ ] restart loop stopped (restart_time stable)
- [ ] port binding correct (lsof check)
- [ ] pm2 save executed
- [ ] no new errors in pm2 logs
- [ ] **EXTERNAL URL check (Tailscale):** `curl https://bigdawgs-mac-mini-2.tailed3212.ts.net:<PORT>/` returns same status as localhost — especially for Next.js portal routes (D7-SUB: wrong cwd during build produces stale prerender that causes external 404 for routes working via localhost). For full Tailscale remote-access diagnosis (engine state, Serve vs Funnel port restrictions, the loopback-200 trap), see `references/tailscale-remote-access-verification.md`. **If `InEngine: False` but tunnel appears to work, see `references/tailscale-engine-stale-display-tiebreaker.md` before declaring engine stuck — the field can be stale and a `tailscale ping` tiebreaker may prove the engine is actually up.**

## HEALTH CHECK COMMAND REFERENCE

```bash
# Quick status check
pm2 jlist 2>/dev/null | python3 -c "
import sys,json
procs = json.load(sys.stdin)
for p in procs:
  print(p['name'], p['status'], p.get('restart_time',0), p.get('pm_uptime',0))
"

# Port binding check
lsof -i :<PORT> -P -n

# Recent errors
tail -50 ~/.pm2/logs/<service>-error.log

# PM2 drift check
pm2 list 2>&1 | grep -i "not synchronized" && echo "DRIFT DETECTED"

# HTTP health
curl -s -o /dev/null -w 'HTTP:%{http_code}' http://localhost:<PORT>/login

# Restart spike check
pm2 jlist | python3 -c "
import sys,json
for p in json.load(sys.stdin):
  if p.get('restart_time',0) > 5:
    print(f'HIGH RESTART: {p[\"name\"]} → {p[\"restart_time\"]} restarts')
"
```

## PER-SERVICE CANONICAL ROUTES (verified 2026-06-03, audit-driven)

**Audit method:** Probed every port 5000-8999 with `lsof -iTCP -P -n -sTCP:LISTEN`, then HTTP-probed each, then cross-checked against `pm2 jlist` and `launchctl print user/501`. See `service-registry-audit` skill for the full method.

**Reality right now (5 user-space HTTP services live):**

| Port | Service | Title | Manager | Status |
|---|---|---|---|---|
| 3535 | Travel OS | "Travel OS — Command Center" | PM2 `travel-os` | ✅ live, HTTP 200, direct-node pattern |
| 8050 | Client Hub | "Client Hub" (307 → /login) | PM2 `client-hub` | ✅ live, HTTP 307 |
| 8102 | Quick Stats | "⚡ Quick Stats - Ops Briefing" | launchd `com.local.quickstats.plist` | ✅ live, HTTP 200 |
| 8104 | Binance Bot | "🤖 CSdawgbot — Phase 4 Dashboard" | PM2 `binance-bot` | ✅ live, HTTP 200 |
| 8003 | Team Standup Bot | "Team Standup Bot" | launchd `com.local.teamstandup.plist` | ✅ live, HTTP 200 |

**System ports (not user services — filter out of any "live services" list):**
- 5000 / 7000 — macOS `ControlCe` (AirPlay/Handoff receiver, HTTP 403)

**Documented but NOT actually live (2026-06-03 audit):**
| Port | Service | Doc claim | Reality |
|---|---|---|---|
| 8020 | Money Pipeline | "Active" per `OPERATINGBLUEPRINT.md` | No listener, no launchd, no PM2 |
| 8030 | SquarePayouts | "Active" | No listener, no launchd, no PM2 (was on disabled plist) |
| 8040 | BakeryOps | "Active" | No listener, no launchd, no PM2 (was on disabled plist) |
| 5050 | Fresh Dashboard | Doc | No listener, no launchd, no PM2 |
| 8100 | Overview / Mission Control | Doc | No listener on 8100. Plist on 8001 enabled but app didn't start. |
| 8110 | Health Dashboard | Doc | No listener, no launchd, no PM2 |
| 8130 | Trading Control | Doc | No listener, no launchd, no PM2 |
| 8140 | YouTube Dashboard | Doc | No listener, no launchd, no PM2 |
| 8150 | CSDawg Dashboard | Doc | No listener, no launchd, no PM2 |
| 8090 | OpenClaw Hub | Doc | No listener, no launchd, no PM2 (gateway disabled) |
| 8106 | Kraken Bot | Doc | No listener, no launchd, no PM2 (deleted in 2026-05-28 cleanup) |

**Implication:** `~/.hermes/OPERATINGBLUEPRINT.md` "Systems Inventory" (line 280-287) and `~/.hermes/knowledge/SERVICES_MAP.md` (dated 2026-05-21) are both outdated. **Do not trust those lists for current state — re-audit with the `service-registry-audit` skill.**

**OLLAMA (port 11434):**
- ✅ qwen2.5:3b   — 3.1B, Q4_K_M
- ✅ qwen2.5:14b  — 14.8B, Q4_K_M

## PITFALL: HARDENING SCRIPT WORKS — OPERATIONAL PATH DOESN'T (2026-06-04)

**Pattern observed (Travel OS fu2, t_91793334):** A standalone hardening script (`scripts/start-travel-os.sh`) was written to rebuild Next.js before starting. The script was correct — `bash scripts/start-travel-os.sh` came up in 17 seconds, all green. But the documented operator-facing path is `pm2 stop travel-os && pm2 start travel-os`, and that path does NOT invoke the script. PM2 uses the `pm_exec_path` registered in its config (the original `/usr/local/bin/node` + next start args), bypassing the script entirely.

**Symptom:**
- `bash scripts/start-travel-os.sh` works perfectly (server up in 17s)
- `pm2 stop X && pm2 start X` → 60s later, server still not responding (HTTP 000, port bound by zombie)
- The fix is correct but doesn't take effect via the path the operator actually uses
- Card marked `done` based on script-direct verification, not operational verification

**Why the script doesn't run from `pm2 start`:**
- `pm2 start <name>` re-runs the entrypoint PM2 was originally configured with, not a fresh script
- The hardening script needs to be the `pm_exec_path` in PM2's config — OR invoked from a launchd plist on restart — OR run manually every time
- If it's just `~/Projects/foo/scripts/start.sh` but PM2's `pm_exec_path` is `/usr/local/bin/node`, the script is never called

**Fix (three options, in order of preference):**

1. **Make the script the PM2 entrypoint** — change `pm_exec_path` to point at the script. Requires `pm2 delete X` then re-register with the script as the entry.
   ```bash
   pm2 delete travel-os
   pm2 start /Users/bigdawg/Projects/travel-os-dashboard/scripts/start-travel-os.sh \
     --name travel-os \
     --interpreter none
   # Now pm2 stop && pm2 start will invoke the script (which rebuilds before starting)
   ```

2. **Wrap in launchd plist** — make the script run on every reboot/login, separate from PM2. PM2 still uses the original entrypoint, but the script runs first to ensure `.next/` is fresh.

3. **Document the canonical restart command** — `scripts/restart-clean.sh` becomes the operator's procedure; the worker writes it AND a CHECKLIST that says "to restart Travel OS, run `bash scripts/restart-clean.sh`, not `pm2 restart`."

**Verification before marking a hardening card `done`:**

```bash
# Step 1: Confirm the script is the actual entrypoint
pm2 describe <name> | grep "pm_exec_path\|script"
# Must show the script, OR the operator has a documented restart procedure

# Step 2: Exercise the operator's path, not the worker's
pm2 stop <name>
pm2 start <name>
sleep 30
curl -s -o /dev/null -w 'HTTP:%{http_code}\n' http://localhost:<PORT>/

# Step 3: If HTTP 000, the fix is incomplete — re-do with option 1 or 2 above
```

**Self-check before `kanban_complete`:**
- [ ] Is the script the `pm_exec_path`? OR is there a launchd plist that runs it? OR is there a documented `scripts/restart-clean.sh` that the operator uses?
- [ ] Did I exercise the operator's restart path, not call the script directly?
- [ ] Did I confirm localhost:<PORT> returns 200 within 60s of the operator's path?

**Discovered 2026-06-04:** Ops worker verified the script worked (called it directly) and marked card done. BossMan tested the operator's path (`pm2 stop && pm2 start`) and it failed. Card reopened.

**Verified working fix (Travel OS fu2, 2026-06-04 — second-pass):** Make the script the actual `pm_exec_path` AND set `interpreter: 'bash'`. PM2 then forks bash which runs the script and `exec`s the Node server in place. Two coordinated changes:

1. `ecosystem.travel-os.js`: `interpreter: 'none'` → `interpreter: 'bash'`
2. `scripts/start-travel-os.sh`: `rm -rf .next` → `npm run build` → `exec next start` (no recursive `pm2 stop` call)
3. `~/.pm2/dump.pm2` direct edit: `pm_exec_path` → script path, `exec_interpreter` → `bash`, `args` → `[]`

After the fix, `pm2 stop travel-os` → `pm2 start travel-os` → 200 in 16s. No `pm2 describe` mismatch. Card auto-resolved to `done` under the 2026-06-04 approval auto-resolve policy.

**The lesson:** the harden-script-into-pm_exec_path fix is correct, but ONLY if you also update both the ecosystem config AND the dump.pm2 file. PM2 reads from dump.pm2 at `pm2 start`, not from ecosystem.config. The two must agree.

## PITFALL: IN-FLIGHT WORKER BUILD BREAK — REVERT BEFORE REBUILD (2026-06-04)

**Pattern observed (Card B, t_87258b2c):** A builder is mid-flight, PATCHing multiple files, and the in-progress code breaks `npm run build`. The PM2 process is still serving the previous good build (loaded into memory at startup), so curl shows 200. But any restart will fail.

**Critical diagnostic — distinguish from D7:**
- D7: PM2 restart triggers 500 because of stale `.next/`. PM2 is online, but routes are broken.
- In-flight worker break: PM2 is online, routes serve 200, BUT a `pm2 restart` would fail because the disk `.next/` doesn't match the in-memory build.

**How to detect:**
```bash
# 1. Is a worker running on this project?
sqlite3 ~/.hermes/kanban/boards/<board>/kanban.db \
  "SELECT id, status, assignee FROM tasks WHERE status='running' AND assignee='builder'"

# 2. What is the on-disk build state?
cd <project_dir>
npm run build 2>&1 | tail -30
# Look for "Failed to compile" or "Type error"

# 3. Is the running process serving the OLD build?
pm2 list | grep <service>
# online + uptime > worker start = OLD build in memory, will fail on next restart
```

**Why D7's fix sequence is wrong here:** Running `pm2 stop → rm -rf .next → npm run build` will FAIL because the build itself is broken. You must FIRST revert the worker's changes (`git checkout HEAD -- <files>`) and THEN rebuild.

**Correct recovery (BossMan mandate per SOUL.md):**
1. `hermes kanban block <task_id>` with reason
2. `git checkout HEAD -- <broken_files>` to revert just the bad changes
3. `pm2 stop <service>` — required to drop the in-memory OLD build
4. `rm -rf .next` — now safe to delete (process is stopped)
5. `npm run build` — will succeed because the worker's broken code is gone
6. `pm2 start <service>` and verify HTTP 200
7. Post incident report on the card
8. Re-spawn with an improved plan that puts interface changes BEFORE call-site changes

**Do NOT:** try to "fix the worker's code in place" — the worker is still running and will overwrite your fixes within seconds. The revert is the only way to recover cleanly.

**Do NOT:** `pm2 restart` — that loads the OLD build into memory but on next restart (e.g., health cron) the build will fail.

**When this is OK to let the worker continue:** the build is broken but the worker is finishing a single-file edit and has already acknowledged the type errors in a comment. In that case, just monitor and let the next iteration fix it. The revert path is for when the worker is editing 4+ files simultaneously and the break is structural, not a typo.

## PITFALL: PM2 STATUS CAN LIE — ALWAYS VERIFY PORTS

**Pattern observed 2026-05-28:** PM2 list shows "stopped/disabled" but the process is actually running and responding on its port. Root cause: orphaned prior instances or PM2 daemon state corruption.

**Symptoms:**
- `pm2 list` shows status = "stopped" with pid = N/A or 0
- `curl localhost:<PORT>` returns HTTP 200
- `pm2 logs <service>` shows no recent output (stale log file reference)
- `pm2 jlist` may show different state than `pm2 list`

**When this fires:** Do NOT trust PM2 status alone. ALWAYS cross-check with:
```bash
# Port must be LISTEN before declaring a service dead
lsof -i :<PORT> -P -n | grep LISTEN

# HTTP health probe — anything other than timeout/connection-refused means alive
curl -s --max-time 3 -o /dev/null -w 'HTTP:%{http_code}' http://localhost:<PORT>/

# PM2 JSON list — more authoritative than table display
pm2 jlist 2>/dev/null | python3 -c "import sys,json; [print(p['name'], p['status'], p.get('pid','?'), p.get('pm_uptime','?')) for p in json.load(sys.stdin)]"
```

**Action:** If port is LISTEN and HTTP responds, the service is ALIVE — PM2 display is stale. Reconcile with `pm2 save`. Do NOT attempt to restart a service that is actually running.

**Dead service confirmation:** Port shows NO LISTEN and HTTP times out — THEN it's safe to delete from PM2.

## PITFALL: PM2 "disabled" = AUTORESTART OFF, NOT DEAD
**Pattern observed 2026-05-28:** `pm2 list` showed `hub` as "stopped/disabled" but the process was online and responding.

**What `disabled` means:** The PM2 `disabled` flag means **autorestart is turned off** — the process will NOT restart automatically after a crash or reboot. It does NOT mean the process is dead or stopped.

**Symptoms of a misread:**
- `pm2 list` shows status = "stopped" and `disabled` flag
- `lsof -i :8090 -P -n | grep LISTEN` shows something listening
- `curl localhost:8090` returns 200

**When this fires:** If a process shows "stopped/disabled" but the port is LISTEN and HTTP responds → the service is ALIVE, PM2 just isn't tracking its autorestart. `pm2 describe <name>` shows `autorestart: false`.

**Services intentionally run without autorestart:** `fresh-dashboard` (port 5050), `hub` (port 8090) — these are likely behind a proxy or managed externally.

**Action:** Never assume a "disabled" process is dead. Always verify port + HTTP before declaring it gone or attempting to restart.

## PITFALL: ERROR LOG STALENESS — LOG DATE VS PROCESS UPTIME

**Critical diagnostic pattern (learned 2026-05-28):** When an error is reported, the FIRST check must be whether the error log is current or historical. A log file can contain errors from a prior code version that were never written to after a restart/upgrade.

**Pattern:** `ReferenceError: actual_revenue is not defined` in `money-pipeline-error.log` — the log was last written May 13, but the process had been restarted in late May with fixed code. The errors were ALL historical, not current.

**Diagnostic sequence for any error report:**
```bash
SERVICE=money-pipeline  # replace with service name

# Step 1: Get process uptime
pm2 pid $SERVICE && ps -p $(pm2 pid $SERVICE) -o etime= 2>/dev/null

# Step 2: Get error log last-write time
stat -f "%Sm" ~/.pm2/logs/$SERVICE-error.log

# Step 3: Get error log size and line count
wc -c ~/.pm2/logs/$SERVICE-error.log
wc -l ~/.pm2/logs/$SERVICE-error.log

# Step 4: If log last-write is BEFORE process start time → ALL errors are historical
# Compare: stat output (last modified) vs ps etime (process age)
# If log_modified < process_start → no new errors since restart

# Step 5: Count current errors only (errors written since restart)
# After restart: tail -5 ~/.pm2/logs/$SERVICE-error.log
# Any new errors after the restart timestamp = live bug
```

**Decision tree:**
- `log_last_write > process_start_time` → live bug, fix now
- `log_last_write < process_start_time` → ALL errors historical, service is fine, no action needed
- `log_last_write ≈ process_start_time` → check if new errors still appearing after restart

**Never declare a bug "open" based on error log content alone.** Always verify: Is this error from the currently running version?

## PITFALL: DATA LAYER HEALTHY ≠ API HEALTHY (2026-06-04)

**Critical diagnostic pattern (learned 2026-06-04 on Card C verification):** When verifying a card that "looks good" by reading the on-disk state of a JSON store, the API served by Next.js can STILL be returning HTTP 500 — even when the data file is valid, present, and parseable.

**Symptom:**
- `cat data/travel-os-trips.json | python3 -m json.tool` → valid JSON
- Trip phase is correct on disk
- BUT `curl http://localhost:3535/api/travel-os/trips` returns HTTP 500 with `Content-Type: text/html`, body `Internal Server Error`
- Home page (`/`) returns 200 — only the API route is broken

**Root cause:** Next.js `.next/` build cache race after `pm2 restart`. The process is serving a stale module graph that was built from a different `.next/` state than the one currently on disk. Common after a build is regenerated while the process was running, or after a restart that the build cache didn't survive.

**What "the data is correct" actually proves:** Only that the file is valid JSON. It does NOT prove the API can read it. A Next.js server returning 500 is a runtime / build-cache problem, not a data problem.

**Verification sequence for any Next.js+JSON-store card:**

```bash
# 1. On-disk data check (cheap, but insufficient)
cat data/trips.json | python3 -m json.tool

# 2. API check via curl (MANDATORY — proves the runtime can serve it)
curl -s -o /dev/null -w 'API:%{http_code}\n' http://localhost:3535/api/.../...
curl -s -o /dev/null -w 'HOME:%{http_code}\n' http://localhost:3535/

# 3. If API is 500 but HOME is 200 → it's a Next.js build/route problem, NOT data
#    Apply D7-ALT (full rebuild: stop → rm -rf .next → build → start)
```

**Lesson:** Builder verification that reads `cat data/file.json` and calls the result "verified" is incomplete. Always curl the API and read the response body. A `null` or 500 response from the API is the source of truth for "is the system working?" — the on-disk file is just one of several pieces.

**When this fires during a card verification pass:**
- Don't trust on-disk data alone
- Run the full R3 sequence (stop → rm .next → build → start) before declaring verification done
- Document the rebuild in the card comment so future sessions know the build was reset
- If the rebuild doesn't fix it, escalate as a true blocker — something is wrong with the route definition itself, not the build cache

## PITFALL: DOCS DRIFT FROM REALITY WITHIN WEEKS

**Pattern observed 2026-06-03:** `~/.hermes/OPERATINGBLUEPRINT.md` line 280-287 said "Money Pipeline / Sports Squares / BakeryOps / Binance Bot are Active" — a registry written weeks before. The audit found 3 of those 4 are NOT actually live (no listener, no PM2, no launchd). The fourth (Binance) is live.

**The smell:** When the user asks "what services are actually live right now?" — or any phrasing that implies they don't trust the docs — re-audit from runtime. The canonical method is the `service-registry-audit` skill; the runnable script is `scripts/audit-services.sh` in this skill directory.

**When to suspect doc drift:**
- Doc last-modified > 2 weeks old
- Doc lists a service in "Active" but you can't reach it on its documented port
- Doc lists a service but no PM2/launchd entry references it
- Doc says "Active" and you have direct evidence the service was retired (e.g. folder deleted, plist moved to disabled)

**Fix:** Re-audit, then update the doc. **Do not** auto-revive services the docs claim are "active" without first checking the audit — most "active" claims in stale docs are aspirational, not current.

## CRITICAL NOTE: ecosystem.config.cjs PORT MISLABELS
The master-dashboard/ecosystem.config.cjs has incorrect PORT values for some services:
- csdawg-dashboard: listed as PORT 8025, actual PORT 8150
- overview: listed as PORT 8000, actual PORT 8100
- squarepayouts: listed as PORT 3100, actual PORT 8030
- bakery: listed as PORT 3101, actual PORT 8040
- money-pipeline: listed as PORT 8120, actual PORT 8020

When repairing via ecosystem.config.cjs, the services default to their hardcoded ports in server.js.
Always verify actual port with `lsof -i :<PORT> -P -n` after start, not the ecosystem PORT env.

### D10: PM2 Ghost Entry (pid=0, restart silently fails)
```
Trigger: pm2 list shows status=stopped, pid=0 for a service that should be running
Fix: pm2 restart <name> returns ✓ but process stays stopped with pid=0
Root cause: PM2 daemon has a ghost entry — no actual process exists to restart
```

### D11: Multiple PM2 God Daemons (Fragmented State)
```
Trigger: ps shows multiple "PM2 v5.4.2: God Daemon" processes with different PM2_HOME paths
Example: PID 35000 (.pm2), PID 15285 (.hermes/pro), PID 29702 (.hermes/pro)
Root cause: Previous hermes-agent sessions set PM2_HOME to different paths, spawning isolated daemons.
Each daemon owns its own process list. Orphans can be children of the WRONG daemon.
Danger: Killing an orphan directly may not free its port if respawned by parent daemon.
```
**Diagnosis:**
```bash
# Find all PM2 god daemons and their PM2_HOME
ps aux | grep "PM2 v5" | grep -v grep

# For each daemon, find its children
ps -wwp <PID> -o pid,ppid,args=  # get children of specific daemon

# Check which daemon owns a specific orphan process
ps -o ppid= -p <orphanPID>

# Cross-reference: which daemon has this process in its list
for daemon_pid in $(pgrep -f "PM2 v5.*God Daemon"); do
  echo "Daemon PID $daemon_pid children:"
  ps --ppid $daemon_pid -o pid,args=
done
```
**Correct fix — do NOT kill orphan directly (daemon will respawn it):**
```bash
# Step 1: Identify the service and its parent daemon
orphan_pid=<PID>
parent_daemon=$(ps -o ppid= -p $orphan_pid)
echo "Orphan PID: $orphan_pid, Parent daemon PID: $parent_daemon"

# Step 2: Stop the service via PM2 (if PM2 still knows about it)
pm2 stop <service_name> 2>/dev/null

# Step 3: Delete from PM2 registry
pm2 delete <service_name> 2>/dev/null

# Step 4: Kill the parent daemon (this stops respawn loop)
kill -TERM $parent_daemon
sleep 2

# Step 5: Verify orphan is dead AND port is free
kill -0 $orphan_pid 2>/dev/null && echo "STILL alive" || echo "Orphan killed"
lsof -i :<PORT> -P -n || echo "Port $PORT is free"

# Step 6: If main daemon is gone, restart it
pm2 ping 2>/dev/null || (pm2 resurrect 2>/dev/null || pm2 start)

# Step 7: Save clean state
pm2 save
```
**Key insight:** `kill <orphan_pid>` alone is useless if the parent god daemon respawns it. Always trace to the parent and address both the service registration AND the respawning daemon.

### D12: Hermes Profile PM2_HOME Fragmentation
```
Trigger: ps shows PM2 daemon with PM2_HOME=/Users/bigdawg/.hermes/pro
         but `ls ~/.hermes/pro` shows the directory doesn't exist as a persistent path
Root cause: hermes-agent spawns PM2 with a PM2_HOME override that creates a transient daemon.
These daemons accumulate over sessions and fragment the PM2 process landscape.
The .hermes/pro path is NOT a persistent profile — it was a one-session override.
```
**Diagnostic:**
```bash
# Check what PM2_HOME each daemon was spawned with
ps aux | grep "PM2 v5" | grep -v grep
# Daemon args look like: PM2 v5.4.2: God Daemon (/Users/bigdawg/.hermes/pro SILENT=true
#                              ↑ this is the PM2_HOME for this daemon

# Verify main daemon is the one managing ~/.pm2/dump.pm2
cat ~/.pm2/dump.pm2 | python3 -c "import sys,json; d=json.load(sys.stdin); print('Processes in main dump:', len(d))"

# Check if ~/.hermes/pro exists and what it contains
ls -la ~/.hermes/pro/ 2>/dev/null
```
**Resolution:**
- Orphan processes owned by a `.hermes/pro` daemon → kill the parent daemon (D11 above)
- After killing, the `.hermes/pro` directory is abandoned — safe to leave or manually rm
- Main daemon (PID 35000, `.pm2`) continues unaffected

### D13: Persistent Profile PM2_HOME Override (env-var drift, not daemon fragmentation)
```
Trigger: ops-profile Hermes commands (pm2 list, pm2 save, pm2 resurrect) see a
         different process set than the live PM2 daemon. The launchd plist
         resurrects from ~/.pm2 but ops profile shells default to a stale
         ~/.hermes/profiles/<profile>/home/.pm2.
Root cause: profile .env (e.g. ~/.hermes/profiles/ops/home/.env) does NOT
         pin PM2_HOME. Without the pin, the profile shell defaults to its
         own per-profile .pm2 directory, which holds an orphan dump file
         from a prior era. ops commands and the live daemon diverge silently.
Differs from D11/D12: D11/D12 are *transient* daemon fragmentation (one-shot
         hermes-agent spawn). D13 is *persistent* env-var drift in a profile.
         The fix is one line in the profile .env, not killing daemons.
```
**Diagnostic:**
```bash
# What does the ops profile say PM2_HOME should be?
grep PM2_HOME ~/.hermes/profiles/ops/home/.env 2>/dev/null

# What does the launchd plist use?
grep PM2_HOME ~/Library/LaunchAgents/pm2.*.plist

# What is the live daemon actually using?
cat ~/.pm2/pm2.pid && ps -p $(cat ~/.pm2/pm2.pid) -o args=

# If the three disagree, you have D13
```
**Resolution — one line fix:**
```bash
# Add to ~/.hermes/profiles/<profile>/home/.env (the profile that runs ops commands)
echo 'PM2_HOME=/Users/bigdawg/.pm2' >> ~/.hermes/profiles/ops/home/.env

# Verify
grep PM2_HOME ~/.hermes/profiles/ops/home/.env
# Now ops-profile `pm2 list` and the live daemon see the same processes
```
**Cleanup (optional, after D13 fix is confirmed working):**
```bash
# The orphaned per-profile .pm2 dir can be deleted, but only AFTER the
# profile has the PM2_HOME pin in its .env. Deleting before the pin
# can leave the profile without a PM2 home on next start.
rm -rf ~/.hermes/profiles/ops/home/.pm2
```
Pattern observed 2026-06-03 on card `t_a535309b` (Travel OS boot persistence):
ops profile's `pm2 list` was empty while the live daemon had 3 processes,
because the profile defaulted to an orphaned `~/.hermes/profiles/ops/home/.pm2/`
dump from 2026-05-31. The launchd plist and live daemon agreed on `~/.pm2`.

### D14: Kanban Profile Spawns Worker in Wrong PM2_HOME (2026-06-03, Money Pipeline recovery)

**Same root cause as D11/D12/D13, but the specific instance: a kanban worker (builder/ops profile) runs `pm2 start` from its own profile environment, and the worker is spawned in `PM2_HOME=/Users/bigdawg/.hermes/profiles/<worker_profile>/home/.pm2` instead of the main `~/.pm2`. The worker is alive on its port, but invisible to the main PM2 daemon, so `pm2 save` from a different session has no effect.**

**Trigger (diagnostic):**
```bash
# Worker is alive and listening:
lsof -i :<PORT> -P -n -sTCP:LISTEN
# node <pid> ... server.js   (worker IS running)

# But main PM2 doesn't see it:
pm2 jlist | python3 -c "import json,sys; [print(p['name']) for p in json.load(sys.stdin)]"
# (empty, or the service name is missing)

# And the pid's parent daemon is the wrong-home one:
ps -p <pid> -o ppid,command
# PPID  <some_pid>  PM2 v5.4.2: God Daemon (/Users/bigdawg/.hermes/profiles/builder/home/.pm2
#                            ↑ THIS is the home the worker daemon was spawned in
```

**Why this happens:**
The kanban worker's `~/.hermes/profiles/<profile>/home/.env` does NOT pin `PM2_HOME`. Without the pin, the worker's `pm2 start` command defaults to a per-profile `~/.pm2` directory. If the worker has been running long enough, a separate PM2 god daemon is alive in that wrong home, owning the worker process. Even `pm2 save` from the main session cannot affect a worker owned by a different daemon.

**Fix (in order):**

1. **Identify the wrong-home daemon and its children:**
   ```bash
   # All PM2 god daemons
   ps aux | grep "PM2 v5" | grep -v grep

   # For each non-main daemon, find the children
   for d in $(pgrep -f "PM2 v5.*God Daemon"); do
     echo "Daemon PID $d children:"
     ps --ppid $d -o pid,args=
   done
   ```

2. **Kill the wrong-home daemon** (this terminates its child workers, freeing their ports):
   ```bash
   kill <wrong_home_daemon_pid>
   sleep 2
   lsof -i :<PORT> -P -n -sTCP:LISTEN  # should now be empty
   ```

3. **Start the service in the main PM2 daemon** (direct-node, correct env):
   ```bash
   # Read the service's env from the existing ecosystem config (if any)
   # Or set it explicitly via --env flags
   MINIMAX_KEY="..."  # or read from ecosystem
   pm2 start /usr/local/bin/node \
     --name <service_name> \
     --cwd <project_dir> \
     --interpreter none \
     --max-memory-restart 500M \
     --env NODE_ENV=production \
     --env MINIMAX_API_KEY="$MINIMAX_KEY" \
     -- server.js

   # Verify it's in the main daemon
   pm2 jlist | python3 -c "import json,sys; d=json.load(sys.stdin); print([p['name'] for p in d])"
   ```

4. **Save so future resurrects include it:**
   ```bash
   pm2 save
   ```

5. **Boot-persistence test (mandatory):**
   ```bash
   pm2 kill && sleep 2 && pm2 resurrect && sleep 5
   # Service should be back on its port, in main PM2, with HTTP 200
   curl -o /dev/null -w "HTTP %{http_code}\n" http://localhost:<PORT>/
   ```

6. **Pin PM2_HOME in the kanban profile's .env** (prevent recurrence):
   ```bash
   echo 'PM2_HOME=/Users/bigdawg/.pm2' >> ~/.hermes/profiles/<worker_profile>/home/.env
   ```

**Why this matters:** A card can be marked `done` while the service is alive but invisible to the main daemon. The next session (e.g. BossMan), running `pm2 list` against the main daemon, sees the service as "offline" — and may start a duplicate worker thinking nothing is running. **Always verify with both `pm2 jlist` AND `lsof` AND a fresh `pm2 kill && pm2 resurrect` cycle before marking a PM2 card done.**

### D15: Native-Binding Architecture Mismatch (added 2026-06-22, money-pipeline root cause)

**Pattern:** A Node service using a native module (sqlite3, better-sqlite3, bcrypt, sharp, canvas, fsevents) was built under one Node arch (x86_64) but the running Node binary is a different arch (arm64). The running process loaded the binding successfully at startup (days/weeks ago when Node matched) and is serving 200 OK. PM2 keeps trying to restart it; every restart attempt fails DLOPEN; the OLD pre-restart process is still alive and bound to the port. **Service APPEARS healthy, but is one bad restart away from being killed with no replacement.**

**Trigger (all must be true):**
- `status = online`
- port LISTEN, curl returns 2xx
- `restart_time > 10` (cumulative)
- `tail <service>-error.log` shows recurring: `dlopen(...): incompatible architecture` or `NODE_MODULE_VERSION` mismatch

**Smoking-gun diagnostic:**
```bash
file node_modules/<pkg>/build/Release/<binary>.node   # arm64
node -e "console.log(process.arch)"                   # x86_64 (mismatch)
pm2 jlist | python3 -c "import json,sys; [print(p['name'],p['status'],p.get('restart_time')) for p in json.load(sys.stdin)]"
```

**Why the monitor MUST NOT auto-fix D15:** `npm rebuild <native_module>` is an infrastructure upgrade (SOUL.md 3-bucket trigger #1), never autonomous. A blind `pm2 restart` would fail DLOPEN, PM2 would auto-restart N more times, the old pre-restart process would eventually die, and the service goes down. The monitor must detect, file a kanban card with full diagnosis, and STOP.

**Full detection + repair spec:** `references/d15-d16-d17-detection-rules.md` §D15.

### D16: Service Declared in Ecosystem but Missing from PM2 (added 2026-06-22, squarepayouts root cause)

**Pattern:** A project has `ecosystem.config.js` listing service(s) (e.g. `squarepayouts`, `cloudflare-tunnel`), but the running PM2 daemon does NOT have those apps registered. The service was killed (deliberately or by a `pm2 kill`) and never re-added. PM2's `dump.pm2` does not include them. Routes return connection-refused.

**Trigger:**
- `pm2 jlist` does NOT include a service that is in `ecosystem.config.js` (or `ecosystem.config.cjs`) for the project
- `lsof -i :<canonical-port>` returns nothing
- Project was likely registered historically (search `~/.pm2/dump.pm2.bak`, log history)

**Why the monitor MUST NOT auto-fix D16 unconditionally:** `pm2 start ecosystem.config.js` for a Next.js service may pin ports that differ from operator intent (see D9, port-conflict), and any service with secrets in inline `env` is a security exposure if it ever gets the wrong env (see D9b). The monitor must detect, file a kanban card with: project dir, ecosystem path, list of missing services, and STOP. The repair is a `pm2 start <ecosystem>` (safe) or a port rewrite (operator approval) — both need BossMan orchestration.

**Exception:** if all conditions hold — service in ecosystem, NO inline NEXTAUTH_SECRET or API key in env, port 3001/3100/8104/8020/8050 etc. (canonical list), AND the service was online within the last 24h per `~/.pm2/logs/` — the monitor MAY file a low-priority card and BossMan can `pm2 start` autonomously. Otherwise, escalate.

**Full detection + repair spec:** `references/d15-d16-d17-detection-rules.md` §D16.

### D17: Cumulative restart_time with Current Uptime (added 2026-06-22, false-alarm class)

**Pattern:** A PM2 process shows `restart_time = 169` and `pm_uptime = 3D` simultaneously. The high restart count is historical, not current — the running process is from a previous incarnation (e.g. the old arm64 Node started it; the new x86_64 PM2 daemon tries to restart it on every "drift" and fails, but the OLD process survives on the port). The "crash loop" framing is misleading because the SERVICE is actually serving 200 OK.

**Trigger (diagnostic):**
- `restart_time > 10` AND `pm_uptime > 1h` AND `status = online` AND curl 200
- The error log shows the SAME recurring failure (e.g. DLOPEN) over the full uptime window
- The PID's parent daemon is alive but cannot produce a working replacement

**The fix is to disambiguate "service is crashing" from "service has crashed historically and the OLD process is still serving".** Do not auto-repair on a D17 false alarm; the root cause is D15 (arch mismatch) or D13 (env-var drift), not a current crash loop.

**Full detection + repair spec:** `references/d15-d16-d17-detection-rules.md` §D17.

## PITFALL: PM2 LOGS COMMAND HANGS ON TIMEOUT

**Pattern (learned 2026-05-31):** `pm2 logs --err --lines 50` hangs indefinitely and times out at 180s when PM2 daemon state is fragmented or the target process has a stale log file reference.

**Workaround — always read log files directly:**
```bash
# Direct file reads — never hang on pm2 logs
tail -50 ~/.pm2/logs/<service>-error.log
tail -50 ~/.pm2/logs/<service>-out.log

# Or use tail with explicit file
tail -30 /Users/bigdawg/.pm2/logs/client-hub-error.log 2>/dev/null
```

**When to use direct reads vs pm2 logs:**
- `pm2 logs <name> --err --lines N` → hangs when daemon state is fragmented — use direct reads
- `pm2 jlist` → reliable even when display is stale
- Direct `tail -f ~/.pm2/logs/<name>-error.log` → always works

## PITFALL: ANTI-SPAM PATTERN FOR CRON-WATCHDOG ALERT FILES (2026-06-10)

**Pattern observed:** When a background monitor writes a status file to `~/.hermes/cron/output/` (the path Hermes cron delivery auto-pushes to Telegram), the naive "rewrite the file every check cycle" approach **spams Telegram** — every mtime change triggers a re-delivery. A 3-min outage produces ~3 alert messages instead of 1.

**Fix — content-equality check before write:**

```python
def _write_alert_file(content: str, path: Path) -> bool:
    """Returns True if file was written, False if skipped (content unchanged)."""
    if path.exists():
        try:
            if path.read_text() == content:
                return False  # No change → don't touch mtime → no Telegram re-fire
        except Exception:
            pass
    path.write_text(content)
    return True
```

**Behavior on `~/.hermes/cron/output/<alert>.md`:**
- First failure → file written → Telegram fires once
- Subsequent checks with identical content → file untouched → no Telegram re-fire
- Content changes (new service down, recovered, detail updated) → file rewritten → Telegram fires once
- All-clear → file deleted → Telegram stops delivering

**Apply this to any**: health monitor, watchdog script, drift detector, or scheduled check that writes a single status file to `~/.hermes/cron/output/`. The pattern is class-level — not specific to Boss Hub.

**Full implementation:** `references/boss-hub-health-monitor-2026-06-10.md` — the Boss Hub in-app health monitor that uses this pattern, plus the 5-file stack (monitor module + Flask wiring + API endpoint + UI banner + CSS).

## PITFALL: BROKEN LAUNCHD PLIST (KeepAlive + LaunchOnlyOnce) — UNLOADABLE (2026-06-10)

**Pattern observed:** A pre-existing `~/Library/LaunchAgents/pm2.bigdawg.plist` had `Label=com.PM2` with `KeepAlive=true` AND `LaunchOnlyOnce=true`. After firing once on `launchctl load -w`, it entered a zombie state:

| Command | Result |
|---|---|
| `launchctl print gui/$UID/com.PM2` | "Could not find service" (one-time fired) |
| `launchctl print-disabled gui/$UID \| grep pm2` | "enabled" (still registered) |
| `launchctl load -w ~/Library/LaunchAgents/pm2.bigdawg.plist` | "Input/output error" |
| `launchctl bootout gui/$UID/com.PM2` | "No such process" |
| Second `launchctl load -w` | Corrupts launchd's view of the plist |

**Root cause:** `KeepAlive=true` + `LaunchOnlyOnce=true` is contradictory on modern macOS launchd. `KeepAlive` wants to re-run on every daemon death; `LaunchOnlyOnce` says "run once per login session." The conflict puts the agent in an unloadable state.

**Correct LaunchAgent pattern for PM2 (or any "fire once, manage the rest yourself" daemon):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>Label</key>           <string>com.bigdawg.pm2-resurrect</string>
    <key>UserName</key>        <string>bigdawg</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/sh</string>
        <string>-c</string>
        <string>/usr/local/lib/node_modules/pm2/bin/pm2 resurrect</string>
    </array>
    <key>RunAtLoad</key>       <true/>
    <key>KeepAlive</key>       <false/>
    <key>LaunchOnlyOnce</key>  <false/>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>    <string>/usr/local/bin:/usr/bin:/bin</string>
        <key>PM2_HOME</key> <string>/Users/bigdawg/.pm2</string>
        <key>HOME</key>    <string>/Users/bigdawg</string>
    </dict>
    <key>StandardErrorPath</key> <string>/tmp/com.bigdawg.pm2-resurrect.err.log</string>
    <key>StandardOutPath</key>   <string>/tmp/com.bigdawg.pm2-resurrect.out.log</string>
</dict>
</plist>
```

**Verification (in order):**
1. `plutil -lint <plist>` — XML syntax check
2. `launchctl load -w <plist>` — load it
3. `launchctl list | grep <label>` — should show the agent with PID + status
4. `launchctl print gui/$UID/<label>` — full state (NOT "could not find service")
5. Check the agent's stdout log to confirm the program actually ran

**When the broken plist is unrecoverable:** delete it (`rm -f <plist>`) and write a new one with the correct pattern above. The old registration in launchd's database is harmless once the file is gone; the agent will not fire without the plist file present.

**Reference:** The `runtime-launcher` skill's "LAUNCHD PLIST BOOTSTRAP FOR PM2" section has the related `pm2-bigdawg`-style bootstrap pattern (without the KeepAlive trap). This pitfall extends it with the failure mode.

## PITFALL: PM2 OUTPUT CAPTURE FRAGILITY — JLIST IS THE RELIABLE PATH (2026-06-10)

**Pattern (learned 2026-05-31):** When pm2 list output is captured (via backticks, $() or pipe), the terminal tool may return blank or truncated output even when the command succeeds.

**Workaround — always use `pm2 jlist` for machine-readable output:**
```bash
# jlist returns JSON — always parseable, never pager-formatted
pm2 jlist 2>/dev/null | python3 -c "
import sys, json
data = json.load(sys.stdin)
for d in data:
  print(d['name'], d['status'])
"
```
**Rule:** If a pm2 list capture returns empty in a tool call, re-run with `pm2 jlist` + python parse. Never retry the same broken capture.

## PITFALL: PM2 god-daemon process ID can be CONFUSED with the worker (2026-06-03)

**Pattern observed (2026-06-03, Money Pipeline recovery):** When investigating a port that should be held by a PM2-managed service, `lsof -i :<PORT> -P -n` returned the **PM2 god daemon's PID**, not the worker PID. The next obvious step (`kill <that_pid>`) would have killed the wrong-home PM2 daemon itself, terminating its child workers — which is what was needed, but only by accident.

**Why `lsof` shows the daemon:** The PM2 god daemon (the `PM2 v5.4.2: God Daemon` process) sometimes registers the port on behalf of its child worker for IPC / log streaming / shared socket. In some cases, the port is actually held by the worker (a child of the daemon) but `lsof` resolves to the daemon's PID via shared file descriptors. In other cases, the worker hasn't bound the port yet and only the daemon's child-tracking socket is on it.

**Diagnostic sequence — always find the actual worker before killing:**

```bash
# Step 1: What PID does lsof report on the port?
pid_on_port=$(lsof -i :<PORT> -P -n -sTCP:LISTEN | tail -1 | awk '{print $2}')

# Step 2: What process is that, and who is its parent?
ps -p $pid_on_port -o pid,ppid,command

# Step 3: If the process IS the god daemon (PM2 v5.*), find the actual worker
#    as a CHILD of that daemon
ps --ppid $pid_on_port -o pid,args=

# Step 4: The worker is the child. Killing the parent (daemon) frees the
#    port AND terminates the worker. Killing the worker directly also works,
#    but the parent daemon may respawn it.
```

**Three possible configurations — pick the right kill:**

| Configuration | What `lsof` shows | Right action |
|---|---|---|
| Worker (child of main daemon) holds port | `node <pid> server.js` | `kill <pid>` (worker); main daemon respawns if service is in PM2 list |
| Worker (child of wrong-home daemon) holds port | `node <pid> server.js` (ppid is wrong-home daemon) | `kill <wrong_home_daemon>` to free port AND prevent respawn |
| God daemon itself has the port (rare) | `PM2 v5.4.2: God Daemon (...)` | Find child worker first; if no child, the daemon is misconfigured — restart the daemon |

**When in doubt, do not kill the PID from lsof directly.** Trace parent + children, then act. Killing the wrong PID can leave orphan workers or zombie daemons that take minutes to clean up.

## PITFALL: WORKER PROFILE STARTING PM2 IN WRONG HOME — CARD "DONE" LIES (2026-06-03)

**Pattern:** A kanban worker (builder, ops, etc.) runs `pm2 start` in a session where the profile's `.env` does not pin `PM2_HOME`. The worker starts successfully, the port is listening, the worker even calls `pm2 save` — but the saved dump is in the profile's per-profile `.pm2` directory, not the main `~/.pm2`. The main PM2 daemon never sees the entry. A different session (e.g. BossMan) running `pm2 list` reports the service as offline. The card shows `done` but the service is invisible to the rest of the system.

**Detection — quick checklist before marking a PM2 card done:**

```bash
# 1. Where is the dump?
cat ~/.pm2/dump.pm2 | python3 -c "import json,sys; d=json.load(sys.stdin); print('Main dump has:', [p['name'] for p in d])"
cat ~/.hermes/profiles/<worker_profile>/home/.pm2/dump.pm2 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); print('Worker dump has:', [p['name'] for p in d])"

# 2. Where is the worker really managed?
ps -o pid,ppid,command -p $(lsof -i :<PORT> -P -n -sTCP:LISTEN 2>/dev/null | tail -1 | awk '{print $2}')

# 3. The ppid should be the MAIN pm2 god daemon. If it's a per-profile
#    daemon, the worker is in the wrong home.
```

**Fix at the profile level (permanent):**
```bash
echo 'PM2_HOME=/Users/bigdawg/.pm2' >> ~/.hermes/profiles/<worker_profile>/home/.env
# Now any future pm2 commands from that profile land in the main daemon.
```

**Per-card discipline:** Every PM2 card completion must include the boot-persistence test (`pm2 kill && pm2 resurrect`). If the service does not come back, the card is NOT done regardless of what `pm2 list` showed at completion time.

## PITFALL: Next.js on Mac Studio M4 Max — ecosystem.config.cjs Produces Ghost Entry (2026-06-01)

**Pattern observed (2026-06-01):** On Mac Studio M4 Max, starting Next.js client-hub via `pm2 start ecosystem.config.cjs` produces a ghost entry: pid=0, status=errored, restart_time=30, uptime=0. The process never actually starts despite PM2 claiming success.

**Root cause:** The next binary's argument parsing when invoked through PM2 ecosystem config differs from direct shell invocation. The `--` separator and argument passing behave differently on Apple Silicon vs Intel Mac Mini.

**Symptoms:**
- `pm2 start ecosystem.config.cjs` → status=errored, pid=0, restarts=30
- `pm2 describe client-hub` shows `status: errored`, `pm_uptime: 0`
- `pm2 logs client-hub` shows empty output (no process to read logs from)
- Direct `node .../next start -p 8050` works fine
- Same ecosystem.config.cjs approach works on Intel Mac Mini

**Verified working startup for client-hub on Mac Studio M4 Max:**
```bash
# Direct node invocation (NOT via ecosystem.config.cjs)
cd /Users/bigdawg/Projects/client-hub
node node_modules/next/dist/bin/next start -p 8050

# With env vars (required for Tailscale URL access):
export NEXTAUTH_URL=https://bigdawgs-mac-mini-2.tailed3212.ts.net
export AUTH_TRUST_HOST=true
export NODE_ENV=production
node node_modules/next/dist/bin/next start -p 8050

# Wrapper script approach:
cat > /tmp/start-client-hub.sh << 'EOF'
#!/bin/bash
export NEXTAUTH_URL=https://bigdawgs-mac-mini-2.tailed3212.ts.net
export AUTH_TRUST_HOST=true
export NODE_ENV=production
cd /Users/bigdawg/Projects/client-hub
node node_modules/next/dist/bin/next start -p 8050
EOF
chmod +x /tmp/start-client-hub.sh
pm2 start /tmp/start-client-hub.sh --name client-hub
```

### D12: Hermes Profile PM2_HOME Fragmentation
```bash
# Confirm ghost entry
pm2 list | grep client-hub  # → pid=0, status=errored, restarts=30

# Confirm direct invocation works
cd /Users/bigdawg/Projects/client-hub
node node_modules/next/dist/bin/next start -p 8050 &
sleep 5; lsof -i :8050 -n | grep LISTEN  # → should show node listening

# PM2 ghost cleanup
pm2 delete client-hub  # delete the ghost
# Then use direct invocation or wrapper script
```

**Decision tree:**
- pm2 list shows pid=0 + restarts=30 for Next.js → ghost entry, switch to direct node/wrapper
- Direct node works but ecosystem.config fails → use wrapper script
- NEXTAUTH_URL mismatch suspected → check `pm2 env <id> | grep NEXTAUTH`

## D10: PM2 Ghost Entry (pid=0, restart silently fails)
```
Trigger: Service in BLACKLIST appears in PM2 list
Fix: pm2 delete <name> immediately. Never restart. Log deletion. No Marcelo notification needed.
```

When Marcelo says "we did a cleanup, clean this up" — verify against past cleanup docs:
1. Read `~/Desktop/CLAW-Backup/2026-04-29-performance-cleanup.md` (quick-stats retirement)
2. Read `~/Desktop/CLAW-Backup/INFRA_AUDIT_2026-05-22.md` (team-standup-bot flagged for deletion)
3. GitHub: `cd ~/Desktop/CLAW-Backup && git log --oneline --grep="clean\|retire\|remove\|delete"` — past cleanup commits

**Standard removal sequence (dead service confirmed):**
```bash
# Step 1: Stop + delete from PM2
pm2 stop <name> && pm2 delete <name>

# Step 2: Remove project folder if fully dead
rm -rf ~/Projects/<name>

# Step 3: Check for orphan folders (name + name-new patterns)
ls ~/Projects/ | grep <name>

# Step 4: Save PM2 state
pm2 save

# Step 5: Verify gone
pm2 list | grep <name>  # should return nothing
```

**Known dead services (2026-05-28):**
- `kraken-bot` — fully deleted (PM2 + project folder)

**Known legacy project folders (not PM2-managed, may be dead):**
- `~/Projects/kraken-bot-new/` — zombie of deleted kraken-bot
- `~/Projects/quick-stats/` — launchd-managed (port 8102), not PM2
- Other folders checked against PM2 list: must be in PM2 to be a live service

**Approve before executing:** Always get Marcelo approval before nuking folders. Present: what it is, what it does (if anything), removal recommendation.

### D10: Unauthorized Parallel PM2 Daemon (worker profile spawned a second God Daemon)

**Trigger:** `ps aux | grep "PM2 v5.*God Daemon"` shows MORE THAN ONE God Daemon process, OR more than one `pub.sock` exists in `~/.hermes/profiles/*/home/.pm2/`. The canonical daemon at `~/.pm2/` should be the only one.

**Why this fires (pattern observed 2026-06-08, `t_incident_localhost_drift_2026_06_08`):** A kanban-worker profile (e.g. `bossman`, `ops`, `builder`) running a PM2-affecting card or a `pm2 start` call from its own shell context will start a SECOND PM2 god daemon in `~/.hermes/profiles/<profile>/home/.pm2/`. The worker doesn't know it's making an unauthorized infrastructure change — `pm2 start` is a routine command. But the second daemon:

- Owns its own `dump.pm2` (so `pm2 save` from the main session doesn't capture its processes)
- Carries the worker session's env in its process env (so its forked children inherit `HERMES_SESSION_ID`, `HERMES_KANBAN_TASK`, `HERMES_KANBAN_BOARD`, `PM2_HOME` from the wrong home)
- Persists across reboots if `pm2 save` is ever run in the wrong home
- Is invisible to the canonical `pm2 jlist`

**Diagnostic — full chain in 5 commands:**
```bash
# 1. How many God Daemons are alive?
ps aux | grep -E '[P]M2 v5.*God Daemon' | wc -l
# Expected: 1. If >1, capture all PIDs and PM2_HOMEs.

# 2. Each daemon's PM2_HOME and the operator session that owns it
for pid in $(pgrep -f "PM2 v5.*God Daemon"); do
  echo "--- PID $pid ---"
  ps -o pid,etime,command -p $pid
  ps eww -p $pid 2>/dev/null | tr ' ' '\n' | grep -E '^(HERMES|PORT|PM2_HOME|HOST)=' | head -15
done

# 3. Look for HERMES_KANBAN_* keys — these prove the daemon was started by
#    a worker, not the main session. THIS IS THE SMOKING GUN.
#    Expected: empty. If HERMES_KANBAN_TASK is set, the daemon is worker-owned.

# 4. Every dump.pm2 on disk
for d in ~/.pm2 ~/.hermes/profiles/*/home/.pm2; do
  [ -f $d/dump.pm2 ] && echo "$d: $(cat $d/dump.pm2 | python3 -c 'import json,sys; print([p[\"name\"] for p in json.load(sys.stdin)])')"
done
# Expected: only ~/.pm2/dump.pm2 has entries.

# 5. Sockets present on disk with no live owner
for s in ~/.hermes/profiles/*/home/.pm2/pub.sock; do
  owner=$(lsof "$s" 2>/dev/null | tail -1 | awk '{print $2}')
  echo "$s owner PID: ${owner:-(DEAD — leftover socket)}"
done
```

**Per-incident example (2026-06-08, see `../service-drift-root-cause/references/localhost-drift-evidence-2026-06-08.md`):**
```
PID 55237 PM2 v5.4.2: God Daemon (/Users/bigdawg/.pm2)              ← canonical
PID  7903 PM2 v5.4.2: God Daemon (/Users/bigdawg/.hermes/pro...    ← unauthorized
  └─ env: PM2_HOME=/Users/bigdawg/.hermes/profiles/bossman/home/.pm2
  └─ env: HERMES_KANBAN_BOARD=bossman
  └─ env: HERMES_KANBAN_TASK=t_apistatus_elapsedms_normalize_1780979094
  └─ env: HERMES_KANBAN_RUN_ID=155
  └─ started: 2026-06-08 21:26:26 (still running 65+ min later)
  └─ caused commit 9a1a4d7 at 21:26:45 (19s after daemon start)
```

**Why this is a hard `not safe to auto-fix` situation:** the unauthorized daemon is a worker-owned process; killing it may be appropriate, but only after you've documented which worker session is the operator and confirmed no in-flight work will be lost. Stop the worker's cron first (`cronjob action=pause job_id=<worker_cron_id>`), then evaluate. The unauthorized daemon is not under BossMan's normal control — it's owned by a different profile, and its `dump.pm2` lives in a different `PM2_HOME`.

**Recommended manual sequence (after Marcelo approval, NOT auto-fix):**
```bash
# 1. Identify the owning worker profile
WORKER_PM2_HOME=/Users/bigdawg/.hermes/profiles/bossman/home/.pm2   # from the env match
WORKER_DAEMON_PID=$(lsof $WORKER_PM2_HOME/pub.sock 2>/dev/null | tail -1 | awk '{print $2}')

# 2. Pause any cron that might restart the worker
hermes cron pause 01dff7ff61e4  # PM2 Health Monitor (agent-based) — only if D10 fired via this monitor
# Or pause the specific worker cron that produced the daemon

# 3. Kill the unauthorized daemon
kill -TERM $WORKER_DAEMON_PID
sleep 2
# Verify port 4160 (or whatever the worker was using) is free
# Verify the canonical pm2 jlist still shows the right processes
pm2 jlist | python3 -c "import json,sys; print([p['name'] for p in json.load(sys.stdin)])"

# 4. Remove the dead profile .pm2 dir (optional, only after verification)
rm -rf $WORKER_PM2_HOME

# 5. Add a governance rule preventing the next occurrence
#    See ../service-drift-root-cause skill, Phase 4.1: "bossman_profile_safety"
```

**DO NOT auto-fix this.** The fix is destructive (kills a live process) and the decision to kill a worker-owned daemon is a governance choice. File an incident, file a card, get Marcelo sign-off, then execute.

**Prevention (what to do BEFORE this fires):**
- Every worker profile that touches PM2 must have `PM2_HOME=/Users/bigdawg/.pm2` pinned in its `.env`. (See D13 below.)
- Every autonomous worker that could call `pm2 start` must have a governance card requiring `awaiting_approval` for ≥10 minutes before promotion. (See `../service-drift-root-cause` Phase 4.2.)
- The canonical daemon should be the only place `pm2 save` is ever run. Add a `dump.pm2`-diff check to `pm2-audit`.

### D11.5: PM2 module_conf.json per-app env override (D9b, 2026-06-08)

**Trigger:** Service binds the wrong port despite:
- Daemon env being clean (L1 verified)
- App `.env`, `ecosystem.config.cjs`, and `process.env.PORT || default` all correct
- D9 daemon-env fix already applied (`pm2 kill + env -i pm2 resurrect`)
- `pm2 jlist` shows process `online` on wrong port
- `pm2_env.env` for the process contains a key **named after the service itself** (e.g. `env.bakery = '{"PORT":"8040"}'`) — that JSON-stringified value is the smoking gun

**Root cause:** `~/.pm2/module_conf.json` is a per-app JSON file PM2 reads on every `pm2 start <name>` and merges into the child's env. It survives `pm2 kill` and `pm2 resurrect`. The 5-pillar env-var persistence triad:
- L1 — Daemon process env (dies with daemon, fixable with `env -i` wrapper)
- L2 — `~/.pm2/dump.pm2` env block (survives `pm2 kill`, reset by fresh start)
- **L3 — `~/.pm2/module_conf.json` per-app overrides (survives everything, fixable only by file edit)**
- L4 — `ecosystem.config.cjs` in the project
- L5 — `.env` in the project

**Quick diagnostic:**
```bash
SERVICE=bakery
# Look for the smoking gun
pm2 jlist | python3 -c "import json,sys; p=next(p for p in json.load(sys.stdin) if p['name']=='$SERVICE'); print(p['pm2_env']['env'])"
# The source of truth
cat ~/.pm2/module_conf.json
# Remove the key
python3 -c "import json; p='/Users/bigdawg/.pm2/module_conf.json'; d=json.load(open(p)); d.pop('$SERVICE', None); json.dump(d, open(p,'w'), indent=2)"
# Restart
pm2 stop $SERVICE && pm2 delete $SERVICE && pm2 start /path/to/script --name $SERVICE --cwd /path
```

**Why this is its own rule, not a D9 sub-rule:** D9b survives `pm2 kill` + `pm2 resurrect` + `pm2 save`. The fix is a file edit, not a daemon restart. Conflating the two wastes cycles.

**Full recipe with 5-pillar triad, fix variants, prevention, and validation:** `references/d9b-module-conf-override-2026-06-08.md`

### D12: Hermes Profile PM2_HOME Fragmentation
```
Trigger: Service in BLACKLIST appears in PM2 list
Fix: pm2 delete <name> immediately. Never restart. Log deletion. No Marcelo notification needed.
```

When Marcelo says "we did a cleanup, clean this up" — verify against past cleanup docs:
1. Read `~/Desktop/CLAW-Backup/2026-04-29-performance-cleanup.md` (quick-stats retirement)
2. Read `~/Desktop/CLAW-Backup/INFRA_AUDIT_2026-05-22.md` (team-standup-bot flagged for deletion)
3. GitHub: `cd ~/Desktop/CLAW-Backup && git log --oneline --grep="clean\|retire\|remove\|delete"` — past cleanup commits

**Standard removal sequence (dead service confirmed):**
```
# Step 1: Stop + delete from PM2
pm2 stop <name> && pm2 delete <name>

# Step 2: Remove project folder if fully dead
rm -rf ~/Projects/<name>

# Step 3: Check for orphan folders (name + name-new patterns)
ls ~/Projects/ | grep <name>

# Step 4: Save PM2 state
pm2 save

# Step 5: Verify gone
pm2 list | grep <name>  # should return nothing
```

**Known dead services (2026-05-28):**
- `kraken-bot` — fully deleted (PM2 + project folder)

**Known legacy project folders (not PM2-managed, may be dead):**
- `~/Projects/kraken-bot-new/` — zombie of deleted kraken-bot
- `~/Projects/quick-stats/` — launchd-managed (port 8102), not PM2
- Other folders checked against PM2 list: must be in PM2 to be a live service

**Approve before executing:** Always get Marcelo approval before nuking folders. Present: what it is, what it does (if anything), removal recommendation.

## PITFALL: Node.js server.js BIND ADDRESS — localhost-only vs all-interfaces

**Pattern (learned 2026-06-01):** A Node.js/Next.js server can be running on the correct port via PM2, but still unreachable from remote/VPN users because the server's `server.js` defaults to `hostname='127.0.0.1'` instead of `'0.0.0.0'`.

**Symptom:** `lsof -i :<PORT>` shows the process IS listening, but `curl http://<tailscale-host>:<PORT>` returns "connection refused" or times out. On the host machine, `curl http://127.0.0.1:<PORT>` works fine.

**Root cause in server.js:**
```javascript
const hostname = process.env.HOST || '127.0.0.1';  // binds to localhost only
app.prepare().then(() => {
  createServer(...).listen(port, hostname, ...)  // hostname controls bind address
});
```

`127.0.0.1` = loopback interface only. Remote machines on the tailnet cannot reach it.

**Fix:**
```javascript
const hostname = process.env.HOST || '0.0.0.0';  // binds to all interfaces
```

**For Squares (verified working on Mac Studio M4 Max — 2026-06-01):**
- Changed `server.js`: `hostname = process.env.HOST || '127.0.0.1'` → `'0.0.0.0'`
- `pm2 restart squarepayouts` after the fix
- Confirmed: `lsof -i :8030 -P -n | grep LISTEN` → `TCP *:8030 (LISTEN)` ✅
- Confirmed Tailscale access: `curl http://bigdawgs-mac-mini-2.tailed3212.ts.net:8030/` → HTTP 200 ✅

**Check all services for this pattern:**
```bash
# Find all Node.js server.js files with localhost bind
grep -r "127\.0\.0\.1" ~/Projects/*/server.js 2>/dev/null
grep -r "HOST.*127\.0\.0\.1" ~/Projects/*/ecosystem.config.* 2>/dev/null

# Verify bind is 0.0.0.0 for VPN-reachable services
lsof -i :<PORT> -P -n | grep LISTEN
# TCP *:<PORT> = all interfaces ✅
# TCP 127.0.0.1:<PORT> = localhost only ❌
```

**Key diagnostic:** `lsof -i :PORT -P -n | grep LISTEN` tells you immediately whether a service is reachable from outside. If it shows `127.0.0.1:<PORT>`, the service is localhost-only regardless of PM2's port configuration.

**Services checked (2026-06-01):**
- ✅ `squarepayouts` — fixed, now `*:8030`
- ⚠️ `bakery` (port 8040) — still `127.0.0.1:8040` — same pattern if View Site needed
- ✅ `client-hub` (port 8050) — was already `*:8050` via PM2 ecosystem

## PITFALL: TOLERANCE-AS-PERCENTAGE OF NEAR-ZERO PRODUCES FALSE-POSITIVE ALERTS (2026-06-15)

**Pattern observed:** The Binance bot's `health-check.js` used `tolExchange = apiBalance * 0.05` to compute the "5% tolerance" for divergence between the bot's in-process balance and the live exchange balance. When the bot was starting up and the in-process `balance` field hadn't been populated yet, it returned the sentinel value `0.01` (cents). `0.01 * 0.05 = 0.0005` — round to 2 decimals → `0.00`. So a tolerance of $0.00 was applied to a divergence that was actually $128.04. The check correctly reported FAIL, and a Telegram alert fired every 5 minutes during every bot restart.

**Generalized pattern:** Any "tolerance as percentage of value" formula has this failure mode when the value is near zero:
- `value * 0.05` at value=0.01 → tol=0.0005 (rounds to 0.00, any divergence fails)
- `value * 0.02` at value=0    → tol=0.00 (same)
- `value * 0.10` at value=1.00 → tol=0.10 (passes only if exactly aligned)

**Three-line fix for any tolerance-as-percentage health check:**

```js
// BEFORE — fails on near-zero
const tol = value * 0.05;

// AFTER — floor the tolerance to a sane minimum
const tol = Math.max(1.0, value * 0.05);  // $1 floor; raise to your scale
```

**Companion fix: distinguish "uninitialized" from "actually zero":**

```js
// If the API returns a sentinel < $1 (e.g. 0.01) and the real exchange
// returns a meaningful balance, treat as a startup race — PASS with note,
// not FAIL with alert.
if (apiBalance > 0 && apiBalance < 1.0 && usdtBal > 10) {
  CHECKS.push({ name, status: 'PASS', detail: `... | note: api looks like startup sentinel (<$1); exchange agrees with internal, healthy` });
  return;
}
```

**Detection audit (run this against any existing health-check script):**

```bash
# Find every place that computes a tolerance as a percentage
grep -rn "tol.*=.*\* *0\.\|tolerance.*=.*\*.*0\." ~/Projects/*/health-check.js ~/Projects/*/*.js 2>/dev/null

# For each, manually check: what happens when the left-hand side is 0?
# If the result is 0 or rounds to 0, this pitfall applies.
```

**When to apply this fix:**

- ANY health check that compares two balance/snapshot values
- ANY divergence check (latency, file size, count, etc.) using `value * pct`
- ANY alert that fires "Value diverged from expected" with a `tol = f(value)` formula

**Class-level scope:** Not just balance. Applies to latency comparisons (`maxLatency = pingMs * 0.5` → 0 when offline), file-size checks, rate counters. The pattern is "percentage of a quantity that's near zero" — fix is "floor the percentage result before comparing."

**Verification after fix:** Run the health check once. It must report PASS without the divergence being actually 0. Then restart the service to force a near-zero sentinel read; the check must still PASS (not FAIL, not ERROR).

**Reference:** `binance-bot-health-check-2026-06-15` cron (ID `4d4552dc85c9`) — false-positive alert that surfaced the bug.

## NEXT.JS SPECIFIC RULE (Permanent)
Never use `pm2 restart` alone when Next.js build corruption is suspected.
Required sequence: stop → rm -rf .next → build → start → verify.

### D7-ALT: Next.js out-of-sync runtime (newer pattern, 2026-06-03)

A second Next.js D7 variant surfaced in production (card t_daa05643, Travel OS): the served HTML referenced a `buildId` and chunk hash from a **previous** build, but the on-disk `.next/` had been regenerated. The running `next-server` process was started from an older `.next/`, then a rebuild replaced the on-disk chunks while the running process kept serving its in-memory version of the page. The browser then got an HTTP 400 on the old chunk.

**Symptoms:**
- HTML served at HTTP 200, but the RSC payload embedded `buildId: "OLD_ID"` that does not match `.next/BUILD_ID` on disk
- One specific chunk URL returns HTTP 400 (or 404); other shared chunks return 200
- App cannot bootstrap in the browser, throws `ChunkLoadError`

**Root cause vs D7-SUB (wrong cwd during build):**
- D7-SUB: build was run from wrong directory, so the cached `.next/` contains wrong-context output
- D7-ALT: build was correct, but the **running process is older than the build** — out-of-sync runtime

**Fix:** Same as D7 — stop → rm -rf .next → build → start → verify.

**Prevention:** Always restart the PM2 process after a rebuild. Never assume a running Next process will pick up a regenerated `.next/` automatically. A safe-restart helper script that automates the full R3 sequence lives at `scripts/restart-clean.sh` in the travel-os repo; the full reusable pattern is documented in `references/travel-os-restart-clean-script.md` and is portable to any Next.js project. A safe-restart helper script that automates the full R3 sequence lives in the travel-os repo at `scripts/restart-clean.sh` — see `references/travel-os-restart-clean-script.md` for the full reusable pattern.

## PM2 START/STOP GOTCHAS

**`pm2 start <name>` does NOT re-create a deleted entry.** It errors with "Script not found: <path>". To re-add a deleted entry, you must re-issue the full start command:

```bash
# WRONG — fails with "Script not found" if the name was just deleted
pm2 start travel-os

# CORRECT — re-create the entry with the original spec
pm2 start /usr/local/bin/node \
  --name travel-os \
  --cwd /Users/bigdawg/Projects/travel-os-dashboard \
  -- ./node_modules/next/dist/bin/next start -p 3535
```

This matters whenever a `pm2 delete` is followed by a `pm2 start` in the same repair sequence (e.g. inside `restart-clean.sh`). The script MUST keep the original direct-node spec, not call `pm2 start <name>`.

## PM2 FOR PYTHON SERVICES — DIRECT VENV PYTHON, NOT BASH WRAPPER

Pattern (learned 2026-06-03 building Boss Hub): for Flask / FastAPI / aiohttp services, **call the venv python directly in `ecosystem.config.cjs`**, not a bash wrapper script:

```js
// WRONG — bash wrapper hides cwd and adds indirection
{
  name: 'hub',
  cwd: '/path/to/hub',
  script: '/path/to/start-hub.sh',  // bash script
}

// CORRECT — direct venv python, no wrapper
{
  name: 'hub-internal',
  cwd: '/Users/bigdawg/Projects/hub',
  script: '/Users/bigdawg/Projects/hub/venv/bin/python',  // venv python
  args: 'hub/app.py',
  interpreter: 'none',  // venv python IS the interpreter
  env: { PORT: 8160, EXTERNAL_ONLY: '0' },
}
```

**Why:**
- `pm2 start /usr/local/bin/python` errors with "Script not found: /usr/local/bin/python" — that symlink doesn't exist on most macOS homebrew python installs. The CLI parses the first arg as the script path.
- Bash wrapper (e.g. `start-hub.sh` doing `cd $DIR && exec venv/bin/python hub/app.py`) hides the actual cwd from PM2. If the wrapper changes cwd before exec, PM2's `pm_cwd` field is wrong, restart loops can lose the cwd, and `pm2 save` round-trips get ugly.
- Direct venv python + `interpreter: 'none'` makes `pm2 jlist` show the actual binary path, correct args, and correct cwd — clean state, no ghost entries.

**When to use:** any Python service that would otherwise need a bash wrapper (Flask, Django, FastAPI, aiohttp, etc.). Use the same venv python the developer would run locally.

**Verification:**
```bash
pm2 jlist | python3 -c "
import json, sys
for p in json.load(sys.stdin):
    if 'hub' in p.get('name',''):
        e = p.get('pm2_env', {})
        print(f'  pm_exec: {e.get(\"pm_exec_path\")}')
        print(f'  args:    {e.get(\"args\")}')
        print(f'  pm_cwd:  {e.get(\"pm_cwd\")}')
        print(f'  env:     PORT={e.get(\"env\",{}).get(\"PORT\")}')
"
# Expect: pm_exec=/path/to/venv/bin/python, args=['hub/app.py'], pm_cwd=/path/to/hub
# NOT: pm_exec=/bin/bash, pm_cwd=/Users/bigdawg
```

## LAUNCHD PLIST BOOTSTRAP FOR PM2 (Permanent)

The PM2 launchd plist on macOS is generated by `pm2 startup launchd -u <user> --hp <home>` and lands at `~/Library/LaunchAgents/pm2.<user>.plist`. It calls `pm2 resurrect` on every user login/reboot, restoring the saved process list from `~/.pm2/dump.pm2`.

**Bootstrap pattern (idempotent — re-run any time):**
```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/pm2.<user>.plist
launchctl enable gui/$(id -u)/com.PM2
```

**Verify the plist is properly loaded and enabled:**
```bash
launchctl list | grep pm2                # shows live PID + label
launchctl print-disabled gui/$(id -u) | grep pm2   # must say "enabled"
plutil -lint ~/Library/LaunchAgents/pm2.<user>.plist   # syntax check
```

**Critical: `LaunchOnlyOnce: true` means the agent fires `pm2 resurrect` ONCE per user login session.** After the first `pm2 resurrect` fires in a given login, the agent stays in launchd's "ran-once" state and will not re-fire until the next login or reboot. This is the correct setting for PM2 (it would be wasteful to re-resurrect on every minute), but it means:

- `pm2 kill` in a test session will not auto-recover; you must `pm2 resurrect` manually (or the user must log out / log in)
- A real Mac reboot does re-fire the agent (it's a new login session)
- `pm2 kill` + `pm2 resurrect` is therefore the closest safe equivalent of a real reboot for verification — same plist code path, same dump file, same daemon startup

**Verification pitfall with `LaunchOnlyOnce`: `launchctl print gui/$UID/com.PM2` will return `Bad request: Could not find service "com.PM2"` after the agent has fired once in the current session.** This is NOT a registration failure — the agent is correctly registered. The right verification after a bootstrap is:

```bash
# WRONG (will return "Could not find service" once LaunchOnlyOnce has fired):
launchctl print gui/$(id -u)/com.PM2

# CORRECT (always shows true registration state):
launchctl print-disabled gui/$(id -u) | grep -i pm2    # must say "enabled"
launchctl list                                          # service may not appear here, also OK
```

If `print-disabled` shows the plist as `enabled`, the plist is correctly registered and will fire on the next real login/reboot. Do NOT re-bootstrap trying to "fix" the `print` "not found" message — that creates spurious duplicate registrations. Pattern observed 2026-06-03 on card `t_a535309b`.

## POST-CARD SELF-AUDIT (Permanent, 2026-06-03)

After closing any runtime-hygiene or PM2-cleanup kanban card, **do not stop at "I ran the steps".** Run a clean re-verification of the final state from scratch, exactly the way the four reboot-survival checks are run:

1. PM2 list — exactly the expected set of processes, correct pids, 0 restarts, correct cwd
2. HTTP canonical route — HTTP 200, buildId in body matches `.next/BUILD_ID`
3. Every chunk in served HTML — HTTP 200
4. launchd plist — bootstrapped, enabled, will fire on next login

This catches issues introduced by the work itself (duplicate PM2 entries, plist lost during `pm2 kill`, lingering stale processes, etc.). A run that looks green at the end of the work can still be wrong; the re-verify is what makes the close honest. If anything fails, fix it before reporting — do not surface internal blockers to Marcelo.

When the post-card self-audit finds issues, **add a follow-up comment to the same card** (not a new card) with the issue, fix, and re-verification. The card stays `done`; the comment is the audit trail.

## MANDATORY SEQUENCE: PAUSE AUTO-REPAIR BEFORE PM2 CLEANUP
**Before any PM2 cleanup operation (delete, stop, or major restructure):**
1. Pause the auto-repair cron: `cronjob(action='pause', job_id='01dff7ff61e4')`
2. Perform the cleanup
3. Re-enable after PM2 state is saved: `cronjob(action='resume', job_id='01dff7ff61e4')`

**Why:** The auto-repair cron runs every 5 minutes. If it fires during a cleanup, it can fight with the cleanup (restart a service you're trying to delete, restore a ghost entry you just removed, etc.).

**Cron job ID:** `01dff7ff61e4` (auto-repair health monitor)

## PITFALL: RE-ENABLING THE AUTO-REPAIR CRON CAN BE EXPLOITED BY A WORKER (2026-06-08)

**Pattern observed (post-remediation regression, 2026-06-08 23:13 PDT):** The localhost-drift incident was fully remediated — single canonical daemon, 11 services online, 2 tracked_only as designed. The flock guard was added to the auto-repair prompt, and the cron was re-enabled. Within ~10 minutes, the `bossman`-profile kanban worker auto-executed three ready cards in parallel, including unauthorized app-level changes to `squarepayouts` and `fresh-dashboard`. The worker also started a new bossman-profile PM2 daemon, re-introducing exactly the pattern the entire incident was meant to fix.

**Why the prompt-level guards failed:**

- The **flock guard** (`mkdir /tmp/pm2-health-monitor.lock`) only prevents *concurrent runs of the same cron job*. It does nothing against a separate worker profile running an unrelated card.
- The **READ-ONLY prompt invariant** ("MAY NOT run `pm2 start`") is prose in a system prompt. A Claude agent can read the rule, decide the user is implicitly OK with the action, and execute anyway. There is no enforcement layer between the prompt and the shell.
- The **per-card `awaiting_approval` gate** is honored by the *user-facing Telegram session*, not by a different profile's autonomous worker. The worker does not see the "no autonomous workers during the maintenance window" constraint, because that constraint was expressed in the user session, not the worker session.

**What this means for the auto-repair cron:** **Pausing it is the only reliable gate.** The flock guard + read-only prompt invariant are defense-in-depth, but they cannot be trusted to constrain a kanban worker that has its own autonomy, its own `HERMES_HOME`, and its own dump.pm2.

**Permanent gate protocol (effective 2026-06-08):**

1. The auto-repair cron (`01dff7ff61e4`) is **paused by default** between maintenance windows.
2. **Resuming it requires a new governance card** in `ready` state with a documented "monitoring window" (start time, end time, what to watch for).
3. **At the end of the window, the cron is paused again.** The BossMan or the user explicitly approves the next window.
4. **Any detected parallel daemon (D10), unauthorized registry edit, or autonomous kanban work during a window** triggers an immediate auto-pause and an incident report.

**Card decision tree for the auto-repair cron:**

| Card state | Cron state | Action |
|---|---|---|
| `ready` with explicit monitoring window | `paused` → `resumed` | OK to run during window |
| `ready` without monitoring window | `paused` | Do not resume — open a windowed card first |
| `in_progress` by user session | `paused` | OK to resume if explicitly approved |
| `in_progress` by autonomous worker profile | `paused` | Do not resume — investigate the worker session first |
| `done` | `paused` | Default state — cron must be re-armed per window |

**Per-worker profile rule (effective immediately):**

Every Hermes profile that runs kanban workers — `bossman`, `ops`, `builder`, anything else — must have the following in its `~/.hermes/profiles/<profile>/home/.env`:

```bash
# PM2_HOME pin prevents the worker from starting its own PM2 god daemon
# in a per-profile home. Without this pin, the worker's `pm2 start` spawns
# a parallel daemon in ~/.hermes/profiles/<profile>/home/.pm2 that is
# invisible to the main session's `pm2 list`.
echo 'PM2_HOME=/Users/bigdawg/.pm2' >> ~/.hermes/profiles/<profile>/home/.env
```

**Detection rule (must be added to pm2-audit D10 detection):**

If `ps eww -p $(pgrep -f "PM2 v5.*God Daemon" | head -1) | tr ' ' '\n' | grep -E '^HERMES_KANBAN_'` is non-empty, **a worker profile started a daemon mid-task.** This is the smoking gun. The expected output of that command is empty. If anything is set, the auto-repair cron must be paused immediately and the worker session investigated via `task_runs` in `~/.hermes/kanban.db`.

**This pitfall is the post-approval half of the localhost-drift incident.** See `docs/INCIDENT-localhost-drift-root-cause-2026-06-08.md` § J for the full worked example with the bossman-profile worker's three auto-executed cards and the `task_runs` evidence.

## PITFALL: "I see a process on my port — DON'T kill it yet, check PM2 first" (2026-06-10)

**Pattern observed (PMD Phase 3 dev-server bring-up, 2026-06-10):** I tried to start a dev server on port 7575 and got `EADDRINUSE`. `lsof -nP -iTCP:7575 -sTCP:LISTEN` showed a `node <pid>` process. My first instinct was `kill <pid>` and try again. But that process was actually `next-server (v16.2.6)` — a child of the **PM2 god daemon** managing `client-hub`. I almost killed a legitimate service to free a port I "owned."

**The trap:** `lsof` shows a PID but not its parent. The process may LOOK like an orphan (no obvious parent) because PM2 detaches the child from the shell session. The PM2 daemon owns it and will respawn it on the next `pm2 start` of that service.

**Mandatory entry-point diagnostic — run BEFORE killing any process on a port you want:**

```bash
# Step 1: What PID does lsof report?
lsof -nP -iTCP:<PORT> -sTCP:LISTEN
# → node <pid> next-server (v16.2.6)

# Step 2: Is that PID actually in PM2's process list?
pm2 jlist | python3 -c "import json,sys; print([p['name'] for p in json.load(sys.stdin) if p['pid']==<pid>])"
# → ['client-hub']   ← IT'S PM2-MANAGED, DON'T KILL IT
# → []               ← genuinely orphan, safe to kill

# Step 3: Is that PID's parent the PM2 god daemon?
ps -o pid,ppid,command -p <pid>
# PPID <god_daemon_pid>  PM2 v5.4.2: God Daemon (/Users/bigdawg/.pm2)
# ↑ if PPID is the god daemon, you are about to kill a child of a managed service

# Step 4: If the answer to step 2 OR 3 is "yes", stop and apply the
#    CORRECT FIX (port-mismatch between intended service and actual service
#    on the port) — not the "kill the orphan" fix.
```

**The correct response when you discover a PM2-managed process holds your port:**

1. **Identify which service that process is** — `pm2 jlist | python3 -c "import json,sys; [print(p['name'], 'port-actual=', p.get('pm2_env',{}).get('env',{}).get('PORT')) for p in json.load(sys.stdin) if p['pid']==<pid>]"`
2. **Decide: is the port mismatch fixable without killing the process?**
   - If yes (env override, port change in config): fix and `pm2 restart <name>` — the daemon handles it
   - If no (port is hardcoded in the service, the service is yours to manage): see option A or B below
3. **Option A — switch to a different port** (safest): change your new service's port, leave PM2's process alone
4. **Option B — properly free the port** (only if the PM2 process is also yours to retire):
   ```bash
   pm2 stop <service_name>      # not `kill <pid>` — PM2 will respawn it
   pm2 delete <service_name>    # removes from PM2's list; daemon won't respawn
   # NOW the port is free, and lsof shows nothing
   ```

**Why `kill <pid>` is the wrong reflex even when lsof shows it:**

| Action | What PM2 does | Result |
|---|---|---|
| `kill <pid>` (SIGTERM) | Daemon sees child die, respawns it | Port back in 1-2s, you keep retrying, you get the SAME error in a loop |
| `pm2 stop <name>` | Stops cleanly, no respawn | Port freed in 2-3s, daemon stays healthy |
| `pm2 delete <name>` | Removes from list, frees port | Port freed, daemon stays healthy, no future auto-respawn |

**Subtle gotcha — `lsof` itself can be stale:** Right after a process starts/stops, `lsof` may show ghost results from a few seconds earlier. Always re-check with `sleep 1 && lsof -nP -iTCP:<PORT> -sTCP:LISTEN` before assuming the port is still bound. A single `lsof` call mid-restart can mislead you into "killing" a process that already exited. (Same pattern observed 2026-06-10, mid-PM2-restart of `client-hub`.)

**General rule for any port work in PM2-managed environments:**

1. Run `pm2 jlist` FIRST (before `lsof`, before `kill`, before anything).
2. Identify which PM2 services are alive.
3. Cross-reference with the registry (`~/Projects/boss-hub/registry/services-registry.yaml` or the canonical route table in this skill).
4. ONLY THEN decide whether the port is "free for the taking" or "owned by a service you need to work around."

The 2026-06-10 PMD Phase 3 incident: lsof showed a process, I tried to kill 5 PIDs across two cycles, all respawned — burned ~5 minutes and almost killed `client-hub` and `travel-os` before I ran `pm2 list` and saw the real owner. **The fix would have been step 1 of the diagnostic above, not step 4.**

## APPROVAL BOUNDARY
Marcelo is ONLY contacted for:
- Destructive operations (drop table, rm -rf data)
- Security credential changes
- Architecture changes affecting multiple services
- True blockers requiring vendor/platform intervention

Routine runtime repair is fully autonomous — Marcelo sees the report after recovery.

## RELATED FILES
- `references/pm2-projects-audit-2026-05-28.md` — full ~/Projects/ audit vs PM2 state, zombie folders, team-standup-bot conflict
- `references/money-pipeline-actual-revenue-closeout-2026-05-28.md` — actual_revenue ReferenceError investigation: error log staleness pattern, historical vs live bug discrimination
- `references/pm2-stopped-services-purpose-2026-05-28.md` — purpose guide for stopped/disabled services: csdawg-dashboard, health-dashboard, hub; key distinction hub≠client-hub
- `references/binance-bot-self-healing-2026-05-31.md` — Binance bot self-healing: safe-start.js (8 gates), restart-health-check.js (16 checks), auto-recovery decision tree, Telegram alert routing, hard restart gate card graph
- `references/binance-bot-pm2-ghost-entry-2026-05-31.md` — PM2 ghost entry: pid=0, pm2 restart silent failure, correct fix sequence (delete+start), duplicate cleanup
- `references/binance-bot-orphan-kill-2026-05-31.md` — orphan process on port 8104 owned by fragmented `.hermes/pro` PM2 daemon: parent-daemon kill vs orphan-kill, PM2_HOME fragmentation pattern
- `references/internal-health-check-script-2026-05-31.md` — Marcelo's internal health check script: `nmap`-style port scan using native macOS tools (`nc`, `curl`), `pm2 jlist` parsing, Ollama model listing, Hermes gateway status, alert format template, `timeout` command not available on macOS (use `gtimeout` from coreutils or direct file reads)
- `references/binance-bot-tolerance-floor-2026-06-15.md` — **Binance bot health-check false-positive fix (2026-06-15):** tolerance-as-percentage of near-zero sentinel produced 0.00 threshold during startup race, false-positive Telegram alert every 5 min. Three-line fix: floor the tolerance, recognize the sentinel, PASS with note. Worked example for the new PITFALL section above.
- `references/travel-os-restart-clean-script.md` — reusable R3 automation: full `restart-clean.sh` + `extract-buildid.py` for any Next.js project, three iteration pitfalls (buildId regex, `pm2 start <name>`, bash heredoc)
- `references/pmd-phase3-port-ownership-2026-06-10.md` — **PMD Phase 3 incident (2026-06-10):** lsof shows a process on your port; instinct says `kill`, but the process is a PM2-managed child (client-hub/travel-os in this case). Full timeline, wrong-path vs right-path, the 4-step entry-point diagnostic. **Read this before killing any process on a port in a PM2-managed environment.**
- `references/boss-hub-health-monitor-2026-06-10.md` — **Boss Hub in-app health monitor (2026-06-10):** the next-generation service-level (not just PM2-process-level) health monitor. Background thread in the Flask process, per-slug failure tracking, anti-spam alert file pattern, UI banner + per-card history. 5-file stack: monitor module + Flask wiring + API endpoint + UI banner + CSS. The cron-based pm2-health-check and this in-app monitor are complementary (process-level vs service-level). **Read this when building any "watch N services and alert on outage" feature.**
- `references/pm2-daemon-env-leak-2026-06-09.md` — full raw incident notes: 3 workarounds tried, observed output per step, one-liner diagnostic to detect D9 quickly. Use this when a PM2-managed service binds the wrong port despite the registry having the right value.
- `references/d9b-module-conf-override-2026-06-08.md` — **D9b**: PM2 per-app module config override at `~/.pm2/module_conf.json`. The 5-pillar env-var persistence triad (L1 daemon / L2 dump.pm2 / L3 module_conf / L4 ecosystem / L5 .env), the `env.<app_name> = '{...}'` smoking gun, and the fix recipe. **Read this when D9 fix doesn't work** — the env leak has a second persistence layer that survives `pm2 kill + pm2 resurrect`.
- `references/re-enable-exploitation-post-approval-2026-06-08.md` — post-approval regression: bossman-profile kanban worker auto-executed 3 ready cards (one legitimate, two UNAPPROVED app-level changes) within 10 minutes of cron re-enable. Includes the `task_runs` evidence, why the prompt-level guards (flock, READ-ONLY) failed, and the permanent fix (cron paused by default, per-profile `PM2_HOME` pin, kanban-env smoking-gun detection rule). **Read this before re-enabling 01dff7ff61e4** — the gate protocol in the new "PITFALL: RE-ENABLING THE AUTO-REPAIR CRON CAN BE EXPLOITED BY A WORKER" section above is mandatory.
- `references/pm2-unauthorized-parallel-daemon-2026-06-08.md` — D10 detection: full chain of evidence for the bossman-profile worker that spawned its own PM2 god daemon, the 19-second smoking gun, the `ps eww` macOS env diagnostic, and a detection rule for `pm2-audit`. Use this when `ps aux | grep "PM2 v5"` shows more than one God Daemon, or when a commit's authorship is in question.
- `references/service-registry-audit-2026-06-03.md` — full pre-hub audit: probed 19 documented ports, found 5 actually live, 14 dead/wired-never. Companion to the new `service-registry-audit` skill.
- `scripts/audit-services.sh` — re-runnable audit script. Single command, read-only, produces the source-of-truth table in stdout. Replaces ad-hoc `lsof` + `curl` + `pm2 list` chains.
- **`service-drift-root-cause` skill** — the umbrella for the "services keep drifting" / "deep dive" / "root cause" class of work. Read-only, evidence-first, A-F report structure with approval-gated remediation. This skill (pm2-health-check) is one of the tools called AFTER that skill's report is approved.
- **`service-registry-audit` skill** — the canonical "what services are actually live?" method. Use this when the question is broader than "is X down right now?" (which is what this skill answers).

## REPORT FORMAT (post-incident to Marcelo)
```
SERVICE: <name>
ISSUE: <what broke>
FIX: <what was done>
STATUS: ✅ RECOVERED
ROUTE: http://localhost:<PORT>/login
RESTARTS: <final count>
```

---

## BINANCE-BOT 24/7 RULE (Permanent — 2026-06-16, Phase 6 Track B)

**Crypto is 24/7, so `binance-bot` is expected ONLINE 24/7 with `autostart: true`.** This is the new normal under Phase 6 Track B (card `t_1c502da6`). The "online = alert, stopped = healthy" stance is retired.

**Before alerting on `binance-bot` STOPPED:**

1. Run `hermes kanban list --label maintenance` — if a `binance-bot` maintenance card is open with a defined window (start/end time), STOPPED is allowed. No alert.
2. Run `hermes kanban list --label incident` (or search title for `binance`) — if a `binance-bot` incident card is open explaining the outage, STOPPED is allowed. No alert.
3. If neither exists, STOPPED is a **L2/L3 alert**. Page Marcelo via Telegram with this block:
   ```
   ALERT binance-bot STOPPED (no maintenance/incident card)
   Status: stopped
   Expected: online 24/7 (autostart: true, Phase 6 Track B)
   Restart count: <N>
   Last good: <ISO timestamp from /api/status or last log line>
   Actions tried: <one-liner, e.g. "verified no maintenance/incident card on kanban">
   Needs your decision on: restart, accept outage, or open maintenance/incident card
   ```

**Other binance-bot alert conditions (also L2/L3):**
- `restart_time >= 5` in 24h → L2 (Page Marcelo)
- `/api/status` non-200 or fails → L2 (Page Marcelo)
- `/api/status` shows `totalExposure > maxExposure * 1.10` or any open position that contradicts the most recent signal → L2/L3
- `pm2 logs` shows exceptions, crash loops, or > 3 safe-start failures in 60 min → L2 (Page Marcelo)

**DO NOT alert just because `binance-bot` is online.** ONLINE is the expected state.

**Repair whitelist entry for binance-bot** is unchanged: it appears in the ALLOWED list above and is auto-repairable. The 24/7 rule is about the alert threshold, not the auto-repair policy. If `binance-bot` is STOPPED with no card and the auto-repair playbook is triggered, BossMan may attempt a single `pm2 start binance-bot` then page Marcelo. If `pm2 start` fails twice in a row, page without retrying.

See also: `~/Projects/binance-bot/RUNBOOK.md` §"Operational Policy — 24/7 ONLINE" and `~/.hermes/knowledge/error-escalation.md` §"Binance Bot — Expected State (24/7 ONLINE)".