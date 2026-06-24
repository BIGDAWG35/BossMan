# Binance Bot — Rollback Runbook
**Bot:** binance-bot | **File:** RUNBOOK.md  
**Purpose:** If X breaks, do Y. Designed for unattended operation.

---

## Operational Policy — 24/7 ONLINE (Updated 2026-06-16, Phase 6 Track B)

**Expected state:** `binance-bot` is **ONLINE 24/7**. Crypto markets never close, so the bot must not.

**`autostart: true`** in `ecosystem.config.cjs`. On reboot, the pre-start wrapper runs the 18/18 safe-start gate before the main process stays up.

**Allowed OFF states** (no alert):

1. **Explicit maintenance window** — a maintenance card is on the kanban (`label:maintenance`) with a start/end time.
2. **Open incident card** — a `binance-bot` incident card is on the kanban explaining why the bot is off.

If `binance-bot` is STOPPED and **neither** of the above exists, that is a **Level 2/3 alert** and BossMan must page Marcelo.

**Alert conditions for `binance-bot`:**

| Condition | Severity | Action |
|---|---|---|
| `binance-bot` STOPPED, no maintenance/incident card | L2 | Page Marcelo via BossMan; do not auto-restart (operator decision) |
| `restart_time >= 5` in 24h | L2 | Page Marcelo; auto-recover (pre-start wrapper) if sane |
| `/api/status` fails or non-200 | L2 | Page Marcelo; check `pm2 logs` |
| `/api/status` shows abnormal exposure, positions, or balance | L2/L3 (depending on severity) | Page Marcelo; freeze trading if exposure > 50% of max |
| `pm2 logs` shows exceptions, crash loops, repeated safe-start failures | L2 | Page Marcelo; capture stack trace to incident card |

**DO NOT alert just because `binance-bot` is online.** ONLINE is the expected state; alerting on it creates noise.

---

## Emergency Rollback Triggers

| Symptom | Severity | Immediate Action |
|---------|----------|-----------------|
| Bot offline / PM2 not online | HIGH | `pm2 logs binance-bot` → identify error type → apply matching procedure below |
| Multiple restarts in short period | HIGH | `pm2 stop binance-bot` immediately, then investigate |
| Balance divergence >5% | HIGH | `pm2 stop binance-bot`, do not restart until root cause found |
| SQLite error in logs | HIGH | `pm2 stop binance-bot`, fix schema or DB corruption before restart |
| SyntaxError / ReferenceError / TypeError | CRITICAL | `pm2 stop binance-bot`, do not restart until fixed and safe-start passes |
| Duplicate fills / race condition | CRITICAL | `pm2 stop binance-bot`, run `node safe-start.js`, verify dbRunAwait in code |
| INTEL_GATE blocking all signals | MEDIUM | Check intelligence.json freshness, run Phase 9B or disable INTEL_GATE |
| Health check FAIL alert received | HIGH | `pm2 stop binance-bot`, run `node safe-start.js`, resolve failures |

---

## Procedures by Error Type

### Procedure A — SyntaxError / ReferenceError (crash loop)
```
1. pm2 stop binance-bot
2. node -c ~/Projects/binance-bot/server.js  (check syntax)
3. grep -n "SyntaxError\|ReferenceError" ~/.pm2/logs/binance-bot-error.log
4. Identify the line causing the error
5. Patch or restore from backup
6. node safe-start.js  (must pass 18/18 before continuing)
7. pm2 start binance-bot
8. node restart-health-check.js  (must pass before declaring GO)
```

### Procedure B — SQLITE_ERROR (DB schema / corruption)
```
1. pm2 stop binance-bot
2. sqlite3 ~/Projects/binance-bot/data/bot.db ".schema trades"
   → Check for missing columns: current_sl, trailing_stages, rr_ratio
3. If missing column:
   sqlite3 ~/Projects/binance-bot/data/bot.db "ALTER TABLE trades ADD COLUMN <name> <type>;"
4. If DB is corrupted (cannot open):
   cp ~/Projects/binance-bot/data/bot.db ~/backups/bot-$(date +%Y%m%d-%H%M%S).db
   → Restore from most recent backup in ~/Projects/binance-bot/backups/
5. node safe-start.js
6. pm2 start binance-bot
7. node restart-health-check.js
```

### Procedure C — Multiple restarts (unstable)
```
1. pm2 logs binance-bot --lines 100 | grep -i "restart\|Error"
2. Identify restart cause: memory leak, unhandled rejection, exchange API error
3. pm2 stop binance-bot
4. If memory: check PM2 max_memory_restart setting (current: 500M)
   → reduce to 400M in ecosystem.config.cjs if needed
5. node safe-start.js
6. pm2 start binance-bot
7. Watch for 10 minutes: pm2 monit
8. If stable: node restart-health-check.js
9. If still crashing: Procedure A + escalate
```

### Procedure D — Balance divergence alert
```
1. Check Binance.US balance manually
2. Compare with ~/Projects/binance-bot/internal_balance.json
3. If divergence >5%: pm2 stop binance-bot
4. Update internal_balance.json with correct balance
5. Investigate: was there a manual trade? a failed trade that consumed balance?
6. Restart only after divergence resolved and root cause documented
```

### Procedure E — Pre-trade hook blocking all signals (INTEL_GATE)
```
1. pm2 logs binance-bot | grep "intel gate\|INTEL_GATE"
2. Check intelligence.json: cat ~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json
3. If regime=BEAR or band=WATCH/COLD: this is expected behavior — bot is protecting capital
4. If regime looks wrong: run Phase 9B to regenerate intelligence.json
5. To override temporarily (NOT recommended for live trading):
   - Edit .env: INTEL_GATE_ENABLED=false
   - pm2 restart binance-bot
   - Monitor closely
   - Re-enable INTEL_GATE when market stabilizes
```

### Procedure F — Health check FAIL (automated alert)
```
1. Telegram alert received with failure details
2. Log into Mac mini
3. Run: node ~/Projects/binance-bot/health-check.js  (full output)
4. Apply matching procedure above based on failure type
5. After fix: pm2 restart binance-bot
6. Wait 5 min → run node restart-health-check.js
7. If 5/5 PASS: bot is GO. Continue monitoring.
```

---

## Safe Restart Sequence (never skip)

```
STEP 1 — Confirm bot is stopped:
  pm2 list | grep binance-bot
  → must show "stopped"

STEP 2 — Run safe-start checks:
  cd ~/Projects/binance-bot && node safe-start.js
  → must pass 18/18

STEP 3 — Confirm hard gates cleared:
  # Phase 6 Track B: pre-trade hook is verified by pre-start.js checks #11 + #12
  # and health-check.js "Code Guards". No kanban gate required.
  cd ~/Projects/binance-bot && node -e "require('/Users/bigdawg/Projects/trading-review/pre-trade-hook')"
  → must exit 0 (hook loads cleanly)
  → confirm Marcelo has approved Phase 6 Track B restart (card t_1c502da6 status=running)

STEP 4 — Start bot:
  pm2 start binance-bot

STEP 5 — Run restart health check:
  cd ~/Projects/binance-bot && node restart-health-check.js
  → must pass all checks (GO)

STEP 6 — Confirm no new errors:
  pm2 logs binance-bot --lines 50 --nostream
  → no SyntaxError, SQLITE_ERROR, ReferenceError

STEP 7 — Verify bot is scanning:
  curl http://127.0.0.1:8104/api/status
  → balance, openPositions fields present

STEP 8 — Monitor for 10 minutes:
  pm2 monit
  → watch memory (should be stable <200MB), no restarts
```

---

## Hard Gates — Never Restart Without These

| Gate | How to verify | NO-GO condition |
|------|---------------|----------------|
| Pre-trade hook operational (code, not card) | `node -e "require('/Users/bigdawg/Projects/trading-review/pre-trade-hook')"` — exit 0 | Hook fails to load → do not restart (regression from t_07c30d9a / t_0f9f7820) |
| Pre-start.js 18/18 | `cd ~/Projects/binance-bot && node safe-start.js` | Any check fails → do not restart |
| Phase 6 Track B approval on record | `hermes kanban show t_1c502da6` — status=running | No approval card → do not restart |
| Error log is clean | `~/.pm2/logs/binance-bot-error.log` — 0 bytes or no critical errors | SyntaxError/SQLITE_ERROR/RefError in log → fix first |
| Error log is clean | `~/.pm2/logs/binance-bot-error.log` — 0 bytes or no critical errors | SyntaxError/SQLITE_ERROR/RefError in log → fix first |
| dbRunAwait present | `grep dbRunAwait ~/Projects/binance-bot/server.js` | Missing → race condition risk not fixed |
| 32-restart instability not regressed | `pm2 describe binance-bot | grep restarts` — restarts = 0 | Any restarts since last clean start → investigate |
| safe-start.js passes 18/18 | `cd ~/Projects/binance-bot && node safe-start.js` | Any failure → fix and re-run |

---

## What "Healthy and Ready" Means

**PM2:**
- status = online
- restarts = 0 (clean start)
- memory < 500M (never exceed ecosystem.config.cjs limit)
- uptime > 10 minutes (stable after initial startup)

**Error log:**
- 0 bytes OR no SyntaxError/SQLITE_ERROR/ReferenceError entries

**Health check:**
- 5/5 PASS via `node health-check.js`
- Balance internal ≈ API ≈ Binance (±2%/±5%)

**Safe-start:**
- 18/18 passed

**Restart health-check:**
- All checks GO

**Pre-trade hook:**
- `node -e "require('/Users/bigdawg/Projects/trading-review/pre-trade-hook')"` — no error

**Hard gates:**
- Pre-trade hook loads cleanly (`node -e "require('/Users/bigdawg/Projects/trading-review/pre-trade-hook')"` exits 0)
- Phase 6 Track B approval card `t_1c502da6` status = running

---

## Phase 6 Track B Live-Readiness Gates (2026-06-16)

**Authority:** Marcelo explicit go-live approval, 2026-06-16 (card `t_1c502da6`). "Online" is now the expected healthy state. Alerts fire only on real issues (crash loops, API failures, position anomalies), not on the mere fact of the bot being online.

**This section supersedes the prior STOPPED-by-default policy** in `INCIDENT.md` and the prior `t_1cb4ec89` enforcement.

### What changed
| Item | Before | After |
|------|--------|-------|
| `autostart` in ecosystem.config.cjs | `false` (t_1cb4ec89 hardening) | `true` — pre-start.js wrapper handles bad-deploy protection |
| Pre-trade hook gate | `t_07c30d9a` card status | Code-level `require()` check at STEP 3 |
| Telegram alert trigger | "Bot is online when it should be stopped" | Crash loops, bad API responses, position anomalies (see `~/.hermes/knowledge/error-escalation.md`) |
| `error-escalation.md` / `health-monitoring.md` | Missing on disk | Recreated 2026-06-16 (see Knowledge section below) |
| Monitoring cron (9 AM / 9 PM PDT) | Aspirational, not wired | Wired via `crontab -l` (see Knowledge section below) |

### Pre-flight (run before every `pm2 start`)
```bash
cd ~/Projects/binance-bot
node safe-start.js              # must show 18/18 passed
curl -s http://127.0.0.1:8104/api/status | python3 -m json.tool
# Expect: status="no_signal", totalExposure=0, paperMode=false (or true for paper)
# If any check fails, STOP — do not pm2 start.
```

### Stay-alive criteria (run continuously)
- PM2: status=online, restart count = 0 over 24h, mem < 500M
- Health check: 5/5 PASS at 9 AM PDT and 9 PM PDT (cron-driven)
- API: HTTP 200 from `/api/status` within 1s
- Logs: no SyntaxError / SQLITE_ERROR / ReferenceError / 401/403 in last 24h

### When to alert Marcelo
See `~/.hermes/knowledge/error-escalation.md` → "Live-Trading-Specific Escalation" section.
Do NOT alert on:
- Bot going from stopped → online (this is the expected transition under Phase 6 Track B)
- Routine 9 AM / 9 PM health check PASS
- `pm2 save` output
- `git pull` output

DO alert on:
- 2+ crash restarts in 5 min (crash loop)
- HTTP 401/403 from Binance.US (key compromised)
- OOM kill (exit 137) twice in 24h
- Balance divergence >5% between internal / API / Binance
- `intelligence.json` older than 7 days
- Pre-trade hook REJECT count > 5 in 1 hour (anomalous signal stream)

---

## Knowledge Anchor Files (recreated 2026-06-16)

| File | Source | Purpose |
|------|--------|---------|
| `~/.hermes/knowledge/error-escalation.md` | `~/.hermes/skills/troubleshooting-mode/SKILL.md` §7 + Live-Trading-Specific section | When and how to alert Marcelo |
| `~/.hermes/knowledge/health-monitoring.md` | Skill verbatim + Binance Bot Monitoring section | Cron schedule, PASS/FAIL semantics, 9 AM/9 PM PDT cadence |
| `~/.hermes/skills/troubleshooting-mode/SKILL.md` | Canonical | 8-step protocol, ALERT block format |
| `~/.hermes/knowledge/ROUTING-RULES.md` | `## Troubleshooting Mode (Incidents)` section | Routes incidents to the skill |

### Cron verification
```bash
crontab -l | grep binance-health-check
# Expect 2 entries:
#   0 16 * * * cd /Users/bigdawg/Projects/binance-bot && /usr/local/bin/node health-check.js >> /Users/bigdawg/Projects/binance-bot/health-cron.log 2>&1
#   0 4  * * * cd /Users/bigdawg/Projects/binance-bot && /usr/local/bin/node health-check.js >> /Users/bigdawg/Projects/binance-bot/health-cron.log 2>&1
# (9 AM PDT = 16:00 UTC during PDT; 9 PM PDT = 04:00 UTC. Adjust for PST in winter.)
```

---

## Unattended Operation Baseline

Once bot is GO after a clean start and has been stable for 30+ minutes:
- Morning health check runs at 9 AM PDT (cron: `binance-health-check-morning`)
- Evening health check runs at 9 PM PDT (cron: `binance-health-check-evening`)
- Both write to `health-log.json` silently when healthy
- Telegram alert only fires if health check FAILS
- BossMan receives FAIL alert via Telegram → executes matching procedure

**Marcelo receives Telegram alerts only when:**
- Health check fails
- Balance divergence >5%
- Multiple restarts detected
- Critical error in PM2 log

**Marcelo does NOT receive routine "bot is running" messages.**

---

## Emergency Contacts / Escalation

| Scenario | Action |
|----------|--------|
| BossMan cannot resolve crash | Alert Marcelo via Telegram with error log excerpt |
| Suspicious trading activity | `pm2 stop binance-bot` immediately, alert Marcelo |
| Exchange API failure (Binance down) | Bot waits — no manual action needed unless >1 hour |
| Bot appears to be in crash loop | `pm2 stop binance-bot` — do not restart until investigated |

---

## Rollback to Known-Good Baseline

If bot is in a bad state and cannot be quickly fixed:

```
1. Identify last known-good backup:
   ls -la ~/Projects/binance-bot/backups/
   → look for most recent backup with known-good server.js

2. Restore server.js from backup:
   cp ~/Projects/binance-bot/server.js ~/Projects/binance-bot/backups/bad-server-$(date +%Y%m%d).js
   cp <known-good>/server.js ~/Projects/binance-bot/server.js

3. Restore bot.db if corrupted:
   cp ~/Projects/binance-bot/data/bot.db ~/Projects/binance-bot/data/bot-corrupt-$(date +%Y%m%d).db
   cp <known-good>/bot.db ~/Projects/binance-bot/data/bot.db

4. node safe-start.js
5. pm2 start binance-bot
6. node restart-health-check.js
```

Last resort: `pm2 stop binance-bot` → leave stopped → escalate to Marcelo.