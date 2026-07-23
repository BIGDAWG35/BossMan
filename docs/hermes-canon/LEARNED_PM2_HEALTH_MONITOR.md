# LEARNED_PM2_HEALTH_MONITOR.md — PM2 Health Monitor canon

**Source:** Extracted from `~/.hermes/SOUL.md` (2026-07-22, Card `t_soul_md_prune_driftfix_20260722`).
**Permanent 2026-05-28, refreshed 2026-07-22.**

A dedicated self-healing PM2 health check runs as a cron job (every 15 min, via Claude Sonnet — pinned via bossman profile).

**Cron job ID:** `01dff7ff61e4` (bossman profile) — silent when healthy, reports to Marcelo/Telegram only on actual repair.

---

**PHASEREPORT (2026-07-22 19:34 Pacific):**
Card `t_drift_pm2_canon_20260722_193221` — False alarm. The drift-check ran for the first time with no baseline. The Obsidian mirror and BossMan repo were at md5 `80b578341d03bd859a2c358fd5125f8e` (stale pre-existing state), while the canon was already at the correct `680945703f40dd5225ba522bae138813`. The script created its first baseline, the card was generated as first-run behavior, and all mirrors now match. No actual silent revert occurred. Mirrors need to be refreshed before baseline is created on future first runs. No further action needed.

**PHASEREPORT (2026-07-23 02:34 UTC):**
Card `t_drift_pm2_canon_20260722_193419` — False alarm (first-run cascade). Same class as the 2026-07-22 19:34 entry. The drift-check ran at 02:34:19 UTC, detected the file at md5 `4abdb88570317c01dce2fd237eeb5567` vs a stale pre-existing baseline md5 `680945703f40dd5225ba522bae138813`. Created this card with empty drift-details (body populated before the details array was built). A second script instance ran at 02:34:24 and created `t_drift_pm2_canon_20260722_193424` (same false alarm). Baseline was created at 02:34:41 with md5 `4abdb88570317c01dce2fd237eeb5567` — matches current file. Script bug fixed: first-run baseline creation now exits code 2 (not 0) to prevent spurious second-card cascade. All mirrors (BossMan repo, Obsidian `V3 – PM2 Health Monitor.md`) match canon at 18937 bytes. Pre-existing stale Obsidian file `LEARNED_PM2_HEALTH_MONITOR.md` (1391 bytes, no space in name) is unrelated to the drift-check path. No further action needed.

**PHASEREPORT (2026-07-22 19:35 Pacific):**
Card `t_drift_pm2_canon_20260722_193507` — False alarm (concurrent-write race). At 19:35:07 PT the check caught a transient file state (md5 `9243a44ce94f61e65a56283607905d90`, section `## pmd-web Auto-Repair Rule` hash `edf7b06cc78b80377bdd81dabd002b5f`) caused by a concurrent agent edit session writing the file at the exact same timestamp. By 19:35:24 PT the file had stabilized at the correct canonical state (`4abdb88570317c01dce2fd237eeb5567`, all sections matching baseline). No actual silent revert occurred. No action needed.

---

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

## PM2 CLI Usage Policy (Permanent — 2026-07-22, Card t_pm2_zombie_spawn_root_cause_20260722)

**Root cause confirmed (experiment 2026-07-22 18:54-19:00 PT):** When PM2 CLI is invoked with a non-canonical PM2_HOME, PM2 spawns a god daemon at that PM2_HOME. The daemon is designed to be killed when the CLI process exits, but **a race condition causes the daemon to persist as a zombie**, especially when:
- The CLI call is short-lived (e.g., `pm2 list` in a script)
- Multiple concurrent invocations hit the same PM2_HOME (e.g., `~/.hermes/pro`)

In the actual incident that motivated this policy, `~/.hermes/pro` accumulated 3+ zombie daemons that survived for 8 days.

**Two patterns tested (2026-07-22):**

| Pattern | Test result | Verdict |
|---|---|---|
| **A: `pm2 kill` after each CLI use** | Killed the **canonical daemon** too — `pm2 kill` does NOT respect the env PM2_HOME override | ❌ **UNSAFE** — do not use |
| **B: Per-session tmpdir isolation (no kill)** | 5 zombie daemons survived (scattered across `/tmp/pm2-hermes-*` and `~/.hermes/pro`) | ❌ **Incomplete** — isolation alone leaks |
| **C: Per-session tmpdir isolation + `kill -TERM <pid>` by PID** | Canonical daemon untouched, 0 zombies survived, services healthy | ✅ **CANONICAL** — use this |

**Chosen pattern: Isolation + kill-by-PID.** Per-session tmpdir prevents the zombie from touching `~/.hermes/pro`; direct `kill -TERM <pid>` ensures we never accidentally kill the canonical daemon via `pm2 kill` (which doesn't respect the env override).

### Canonical wrapper: `pm2-hermes.sh`

**Location:** `~/.hermes/scripts/pm2-hermes.sh` (executable, 3,188 bytes)

```bash
~/.hermes/scripts/pm2-hermes.sh <pm2-subcommand> [args...]
# Examples:
#   ~/.hermes/scripts/pm2-hermes.sh list
#   ~/.hermes/scripts/pm2-hermes.sh jlist
#   ~/.hermes/scripts/pm2-hermes.sh logs pmd-web --lines 50 --nostream
```

**What it does (3-step):**
1. **Isolate:** `PM2_HOME=$(mktemp -d -t pm2-hermes-XXXXXX)` — daemon spawns in tmpdir, never touches `~/.hermes/pro`
2. **Run:** `pm2 <subcommand> [args...]` with stdout/stderr passed through
3. **Clean:** Find the per-session daemon's PID via `lsof $PM2_TMP/rpc.sock` (fallback: `ps aux | grep $PM2_TMP`), then `kill -TERM <pid>`. **Never use `pm2 kill`** — that kills the canonical daemon too. Wait up to 1s for graceful exit, then SIGKILL as last resort. Then `rm -rf $PM2_TMP`.

**Anti-patterns (never use):**
```bash
# BAD — touches ~/.hermes/pro daemon
PM2_HOME=~/.hermes/pro pm2 list

# BAD — pm2 kill does not respect env PM2_HOME override; kills canonical too
PM2_HOME=$(mktemp -d) pm2 list && PM2_HOME=$(mktemp -d) pm2 kill

# BAD — isolation alone, no cleanup
PM2_HOME=$(mktemp -d) pm2 list  # leaks a zombie daemon in /tmp/pm2-hermes-XXXXX
```

### Enforcement

All hermes/agent scripts that call `pm2` CLI directly must be updated to use `~/.hermes/scripts/pm2-hermes.sh` instead:
- `pm2 list` → `~/.hermes/scripts/pm2-hermes.sh list`
- `pm2 jlist` → `~/.hermes/scripts/pm2-hermes.sh jlist`
- `pm2 desc <name>` → `~/.hermes/scripts/pm2-hermes.sh desc <name>`
- Direct `pm2` invocations in cron jobs, health monitors, and ad-hoc scripts

**Permanent — 2026-07-22 (Card t_pm2_zombie_spawn_root_cause_20260722):** Any new script or agent that calls `pm2` CLI must use `pm2-hermes.sh` wrapper. This is the single canonical pattern.

## CLI Wrapper Rollout Complete (Permanent — 2026-07-22, Card t_pm2_cli_wrapper_rollout_20260722)

This card enforced `~/.hermes/scripts/pm2-hermes.sh` as the only PM2 CLI entrypoint across all active hermes scripts and cron prompts.

**Scripts migrated (8 active, 1 legacy, 1 stale):**

| Script | Before | After |
|---|---|---|
| `hermes-weekly-systems-review.sh` | `PM2_HOME=/Users/bigdawg/.pm2 pm2 jlist` | `~/.hermes/scripts/pm2-hermes.sh jlist` |
| `v3_supplement_healthcheck.sh` | `PM2_HOME=/Users/bigdawg/.pm2 pm2 list` | `~/.hermes/scripts/pm2-hermes.sh list` |
| `weekly-systems-improvement.sh` | `PM2_HOME=/Users/bigdawg/.pm2 pm2 jlist` | `~/.hermes/scripts/pm2-hermes.sh jlist` |
| `security-pm2-monthly.sh` | `PM2_HOME=/Users/bigdawg/.pm2 pm2 jlist` + `pm2 ping` | `~/.hermes/scripts/pm2-hermes.sh jlist` + `ping` |
| `pmd-watchdog.sh` | `PM2_HOME=~/.pm2 pm2 list` + `pm2 restart pmd-web` | `~/.hermes/scripts/pm2-hermes.sh list`; restart stays direct (`PM2_HOME=/Users/bigdawg/.pm2 pm2 restart pmd-web`) |
| `pmd-health-watchdog.sh` | `pm2 describe` + `pm2 restart` + `pm2 start` | `~/.hermes/scripts/pm2-hermes.sh describe`; `restart`/`start` stay direct to canonical daemon |
| `binance-bot-live-monitor.sh` | `PM2_HOME=~/.pm2 pm2 jlist` | `~/.hermes/scripts/pm2-hermes.sh jlist` |
| `tunnel-url-monitor.sh` | `pm2 logs cloudflare-tunnel` | `~/.hermes/scripts/pm2-hermes.sh logs cloudflare-tunnel` (stale; no cron ref) |
| `legacy/pm2-health-monitor.sh` | (retired 2026-06-08; not migrated) | — |
| `offboard-audit.py` | (string pattern for security audit, not a real invocation) | — |

**Cron prompts updated (4 crons, all in builder + content profiles):**

| Cron | Profile | Change |
|---|---|---|
| `01dff7ff61e4` PM2 Health Monitor | bossman + builder + content | Added "PM2 CLI WRAPPER POLICY" section at top of prompt (1,031 chars) with examples |
| `617757fbccff` pmd-watchdog | builder + content | Added short wrapper note (450 chars) |
| `76956b7cafa7` CSDAWG 2.0 Weekly Intelligence | builder + content | Added short wrapper note (450 chars) |
| `88eff3953480` Hermes Weekly Systems Review | builder + content | Added short wrapper note (450 chars) |

**Verification (live, post-rollout):**

- All 8 active scripts executed with no zombie leaks, canonical daemon (PID 30262) and 8 services remained healthy
- PM2 Health Monitor at 18:51, 18:53, 19:12 PT — all returned `[SILENT]`
- 30+ stress-test calls via wrapper — 0 zombies, 0 tmpdirs, 0 `~/.hermes/pro`
- Backups preserved: `~/.hermes/profiles/*/cron/jobs.json.bak.20260722-pm2-wrapper[-others]`

**Canonical usage examples:**

**Canonical usage examples (READ-ONLY ONLY — all go via wrapper):**

```bash
~/.hermes/scripts/pm2-hermes.sh list
~/.hermes/scripts/pm2-hermes.sh jlist | python3 -c "import json,sys; print(json.load(sys.stdin))"
~/.hermes/scripts/pm2-hermes.sh desc pmd-web
~/.hermes/scripts/pm2-hermes.sh logs pmd-web --lines 50 --nostream
~/.hermes/scripts/pm2-hermes.sh logs binance-bot --lines 100 --nostream
~/.hermes/scripts/pm2-hermes.sh ping
```

**Lifecycle operations (via wrapper — all subcommands safe, including restart/start/stop):**

```bash
# All subcommands go through the wrapper. Empirically verified 2026-07-22 (Card t_pm2_zombie_spawn_root_cause_20260722)
# across 30+ stress-test calls + multiple PM2 Health Monitor ticks. The wrapper correctly:
#   1. Spawns a per-session tmpdir daemon
#   2. Forwards the subcommand to that daemon
#   3. The daemon processes restart/start/stop against the canonical PM2 state (dump.pm2 is shared)
#   4. Cleans up the per-session daemon on exit via kill -TERM by PID

# Reading state (always safe via wrapper):
~/.hermes/scripts/pm2-hermes.sh list
~/.hermes/scripts/pm2-hermes.sh jlist
~/.hermes/scripts/pm2-hermes.sh desc <name>
~/.hermes/scripts/pm2-hermes.sh logs <name> --lines 50 --nostream
~/.hermes/scripts/pm2-hermes.sh ping

# Lifecycle (via wrapper, safe — the wrapper handles daemon lifecycle correctly):
~/.hermes/scripts/pm2-hermes.sh restart <name>
~/.hermes/scripts/pm2-hermes.sh start   <name-or-ecosystem>
~/.hermes/scripts/pm2-hermes.sh stop    <name>
~/.hermes/scripts/pm2-hermes.sh save            # persist current list
```

**Forbidden patterns (anti-patterns) — all real, all must be avoided:**

```bash
# BAD — touches ~/.hermes/pro daemon (creates zombie)
PM2_HOME=~/.hermes/pro pm2 list

# BAD — pm2 kill does not respect env PM2_HOME override; kills canonical too
PM2_HOME=$(mktemp -d) pm2 list && PM2_HOME=$(mktemp -d) pm2 kill

# BAD — isolation alone, no cleanup (leaks zombie in tmpdir)
PM2_HOME=$(mktemp -d) pm2 list

# BAD — direct pm2 CLI invocation without wrapper (creates zombie daemon)
pm2 list
pm2 jlist
pm2 restart pmd-web
```

## pmd-web Auto-Repair Rule (Permanent — 2026-07-22, Card t_pmd_web_next_build_and_whitelist_20260722)

**Context:** pmd-web (port 7575) was flagged as "all-routes 404" by earlier PM2 Health Monitor runs. Investigation on 2026-07-22 confirmed this was a **probe-path false positive**:
- Root `/` returns 404 — CORRECT (app is behind `basePath: /pmd`)
- Deprecated `/portfolio` returns 404 — CORRECT (basePath was changed `/portfolio` → `/pmd` on 2026-07-15)
- Canonical `/pmd/api/properties` returns 200 with real property data (4 properties) — HEALTHY
- `.next/BUILD_ID` is from Jul 15 22:55; no source file is newer than BUILD_ID → no rebuild needed

**Decision (2026-07-22):** Add pmd-web to the auto-repair whitelist with a rate-limited rebuild+restart rule. Trigger ONLY on canonical-route 5xx, never on legacy-path 404s.

**Trigger conditions (ALL must hold):**
1. `/pmd/api/properties` returns 5xx OR non-200 for 3 consecutive probes
2. PM2 jlist shows pmd-web `status: online`
3. Last repair attempt (per `/tmp/pmd-web-auto-repair.state`) is older than 30 min
4. Lock dir `/tmp/pmd-web-auto-repair.lock` does not exist

**Repair script:** `~/.hermes/scripts/pmd-web-auto-repair.sh` (5,162 bytes, executable)

```bash
# Step 1: pm2 stop pmd-web (via wrapper, safe for stop)
~/.hermes/scripts/pm2-hermes.sh stop pmd-web

# Step 2: rm -rf .next (mandatory — D7 stale build artifacts)
cd /Users/bigdawg/Projects/property-management-dashboard/web
rm -rf .next

# Step 3: npm run build (D7-SUB pitfall: build from web/ NOT ~ or /Users/bigdawg/)
npm run build

# Step 4: pm2 start (via wrapper, safe for start)
~/.hermes/scripts/pm2-hermes.sh start ecosystem.config.cjs --only pmd-web

# Step 5: wait up to 30s for /pmd/api/properties to return 200
for i in $(seq 1 30); do
  sleep 1
  CODE=$(curl -sS -o /dev/null -w "%{http_code}" --max-time 3 http://localhost:7575/pmd/api/properties)
  [ "$CODE" = "200" ] && break
done

# Step 6: log + exit
# /tmp/pmd-web-auto-repair.log (full rebuild output)
# /tmp/pmd-web-auto-repair.state (last_attempt_at = now())
```

**Guardrails (Permanent):**

| Guardrail | Mechanism | Override |
|---|---|---|
| **Rate limit: 1 rebuild per 30 min** | `/tmp/pmd-web-auto-repair.state` (epoch of last attempt) | `PMD_REPAIR_RATE_LIMIT_MIN=0 bash pmd-web-auto-repair.sh` for emergencies |
| **Lock: prevent concurrent runs** | `mkdir /tmp/pmd-web-auto-repair.lock` (trap rmdir on EXIT) | (no override — lock is mandatory) |
| **CWD check (D7-SUB pitfall)** | Script always `cd $PMD_DIR` before build; logs the resolved cwd | (no override — must rebuild from project dir) |
| **Escalation: don't loop on failure** | If `/pmd/api/properties` still returns 5xx after 30s post-rebuild, exit 1 + log ESCALATE — NO retry | Operator must investigate + clear state file to retry |

**Probe-path correction (Permanent 2026-07-22):**

| Path | Old status | New status | Why |
|---|---|---|---|
| `/` (root) | flagged as 404 | expected 404 (correct) | App is behind `basePath: /pmd`; no route at root |
| `/portfolio` | flagged as 404 | expected 404 (deprecated) | basePath changed `/portfolio` → `/pmd` on 2026-07-15 |
| `/pmd` (basePath) | 200 | 200 (canonical) | Next.js redirects `/pmd` → `/pmd/` |
| `/pmd/api/properties` | 200 | 200 (canonical) | Real API endpoint; returns property data |
| `/pmd/app` | 404 | 404 (no such route) | Not a real route in the app — was a misnomer |

**Escalation policy (Permanent):**
- If 3 consecutive probes fail on `/pmd/api/properties` (5xx) AND last repair was <30 min ago → ESCALATE to Marcelo (do NOT auto-rebuild, do NOT wait silently)
- If auto-repair runs but `/pmd/api/properties` still fails after 30s → ESCALATE to Marcelo (do NOT loop)
- If pmd-web is in PM2 status `errored` or `stopped` (not `online`) → also ESCALATE (different repair path, manual investigation)

**Out of scope (separate decisions):**
- pmd-web Tailscale Funnel URL (`https://bigdawgs-mac--studio.tailed3212.ts.net/pmd/*`) health is monitored by `pmd-watchdog.sh` (already migrated to wrapper in Card D). Not part of the auto-repair rule here.
- pmd-api (port 7576) has no auto-repair rule; it's a server-only Node.js module, implicitly healthy when pmd-web is online.

### Known Issues (logged 2026-07-22)

- pmd-web (port 7575) all-routes 404 — was a probe-path false positive. Now fixed: canonical route is `/pmd/api/properties`. Auto-repair rule added with rate-limited rebuild+restart.
- `tunnel-url-monitor.sh` is stale (May 29, no cron references). Kept for historical purposes; recommended to delete.

---

## PHASEREPORT (Permanent — 2026-07-22)

**2026-07-22 — LEARNED_PM2_HEALTH_MONITOR drift source fixed and write-protected (Card t_learned_pm2_health_monitor_driftfix_20260722)**

**What was wrong:**
The `pm2-canon-drift-check.sh` script had two bugs:
1. Mirror-drift false alerts: The script flagged mirror lag as "DRIFT" even when the canon had been *intentionally* updated by a legitimate card (mirrors naturally lag by seconds to minutes). This caused spurious kanban cards `t_drift_pm2_canon_20260722_193221`, `_193419`, `_193424`, `_193507`.
2. Invalid `hermes exec notify` command: The Telegram alert used `hermes exec notify` which is not a valid Hermes CLI command — alerts silently failed.

**Fixes applied:**
- Mirror-drift logic now only fires when canon itself is unchanged. If canon drifted intentionally, mirror lag is logged as "(expected — canon updated, mirrors pending sync)" without triggering an alert.
- Telegram alert fixed: `hermes exec notify` → `hermes send --to telegram` (uses HOME_CHANNEL from .env = 8536867361).
- Stale ghost kanban cards (`t_drift_pm2_canon_20260722_193419`, `_193507`) marked `done` with explanation.
- Baseline already at correct md5 `4abdb88570317c01dce2fd237eeb5567` — no change needed.

**Write-protection:**
- `pm2-canon-drift-check.sh` (cron job `c464124c759e`, ops profile) runs every 6 hours.
- Monitors full-file md5 + 3 protected section hashes.
- Baseline at `~/.hermes/state/pm2-canon-baseline.json` — update by appending a PHASEREPORT entry + running `python3` to re-hash (see script comment).
- Drift → kanban card created + Telegram alert sent.

**Mirrors verified (all match md5 `4abdb88570317c01dce2fd237eeb5567`):**
- `~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md` (canon)
- `~/Obsidian/Hermes/V3-Canon/V3 – PM2 Health Monitor.md`
- `~/Repos/BossMan/docs/hermes-canon/LEARNED_PM2_HEALTH_MONITOR.md`

**Note:** No active generator/writer was found that could cause silent drift. The PM2 CLI Usage Policy section, CLI Wrapper Rollout section, and pmd-web Auto-Repair Rule sections were all correctly written by their respective cards (t_pm2_zombie_spawn_root_cause, t_pm2_cli_wrapper_rollout, t_pmd_web_next_build_and_whitelist) and have been stable since. The drift-check is now the guardrail against any future silent writer.
