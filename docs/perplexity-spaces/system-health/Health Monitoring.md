**Version:** v4 · **Date:** 2026-06-16 · **Source:** `~/.hermes/knowledge/health-monitoring.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# Health Monitoring — Cron Schedule and PASS/FAIL Semantics

**Source of truth:** `~/.hermes/skills/troubleshooting-mode/SKILL.md` + this file's "Binance Bot Monitoring" section.

**Updated:** 2026-06-16 (Phase 6 Track B launch). Binance bot is **ONLINE 24/7** with `autostart: true`. "Online" is no longer an alert condition. "Stopped" is an alert **unless** a `label:maintenance` or `binance-bot` incident card is on the kanban.

---

## General monitoring principles

1. **Silent when healthy, loud when broken.** Cron-driven checks write to logs silently on PASS. ALERTs fire only on FAIL.
2. **Cron is the heartbeat.** If a check does not run on schedule, that itself is an alert (e.g., `last_run` > 26 hours).
3. **One source of truth for "is X healthy."** Each service has exactly one health-check binary. Don't fork it.
4. **Reversibility first.** If a check starts failing after a code change, revert the change before debugging the check.

---

## Binance Bot Monitoring (Phase 6 Track B, 2026-06-16)

### Schedule
| Slot | Local (PDT) | UTC | Cron |
|------|-------------|-----|------|
| Morning health check | 9:00 AM PDT | 16:00 UTC | `0 16 * * *` |
| Evening health check | 9:00 PM PDT | 04:00 UTC | `0 4 * * *` |

**PDT/PST shift:** Cron runs in UTC. In November (PST, UTC-8), 9 AM PST = 17:00 UTC, 9 PM PST = 05:00 UTC. The cron entries are NOT auto-adjusted; they will drift by one hour. Acceptable: still fires twice per day. Not acceptable: skipping a day. If drift becomes important, switch to a `launchd` plist with calendar intervals, or update the cron in early November and early March.

### Entry point
`/Users/bigdawg/Projects/binance-bot/health-cron-wrapper.sh` (chmod +x) wraps `node health-check.js`, parses the 5/5 PASS line, and:

- On **PASS**: appends `HEALTH=PASS` to `health-cron.log`, removes `/tmp/bossman-binance-health-fail` marker
- On **FAIL**: appends `HEALTH=FAIL` to `health-cron.log`, writes `/tmp/bossman-binance-health-fail` with timestamp + last 30 lines of output, exits non-zero

BossMan's PM2 health monitor (cron `01dff7ff61e4`) reads the marker file and escalates via Telegram only when the marker is present.

### PASS conditions (5/5 must hold)
1. `process_up` — `pm2 list | grep binance-bot` shows `online` and restart count = 0
2. `api_responding` — `curl -s --max-time 5 http://127.0.0.1:8104/api/status` returns HTTP 200 with JSON
3. `balance_consistent` — internal balance ≈ API balance (±2%) and API balance ≈ Binance.US balance (±5%)
4. `pre_trade_hook_loaded` — `node -e "require('/Users/bigdawg/Projects/trading-review/pre-trade-hook')"` exits 0
5. `intelligence_fresh` — `intelligence.json` mtime ≤ 7 days

### FAIL → ALERT conditions
See `~/.hermes/knowledge/error-escalation.md` §"Live-Trading-Specific Escalation" for the full list. The short version:

- Process not online → no ALERT (this is the start/stop transition, not an error)
- API not responding → ALERT Binance Bot API Down
- Balance divergence >5% → ALERT Binance Balance Reconciliation
- Hook fails to load → ALERT Pre-Trade Hook Regression
- Intel stale >7d → ALERT Binance Intelligence (monitor, not stop)
- Process in crash loop → ALERT Binance Bot (auto-stop already executed)

### Manual override
To run a health check outside the cron schedule:
```bash
cd /Users/bigdawg/Projects/binance-bot && /usr/local/bin/node health-check.js
```

To force a FAIL signal for testing the alert path:
```bash
touch /tmp/bossman-binance-health-fail
echo "$(date '+%Y-%m-%d %H:%M:%S') test FAIL signal" >> /tmp/bossman-binance-health-fail
```

To clear a stale FAIL marker after a real PASS:
```bash
rm -f /tmp/bossman-binance-health-fail
```

### Log files
- `~/.pm2/logs/binance-bot-out.log` — stdout, last 200 lines available via `pm2 logs`
- `~/.pm2/logs/binance-bot-error.log` — stderr, ALERT source for SyntaxError / SQLITE_ERROR / ReferenceError
- `/Users/bigdawg/Projects/binance-bot/health-cron.log` — cron-run health-check results (1 entry per cron run, ~50 lines)
- `/Users/bigdawg/Projects/binance-bot/health-log.json` — structured health history (`restart-health-check.js` writes here)

---

## What healthy means under Phase 6 Track B

| Signal | Before (STOPPED policy) | After (Phase 6 Track B, 2026-06-16) |
|--------|------------------------|--------------------------------------|
| `pm2 list binance-bot` status | `stopped` = healthy | `online` = healthy |
| `pm2 list binance-bot` status | `online` = ALERT | `stopped` = investigate |
| Restart count | 0 expected | 0 expected (any restart = investigate) |
| Health check 5/5 | n/a (bot was off) | 5/5 PASS expected twice daily |
| Bot not responding | n/a | ALERT (real failure) |

The flip happens **once** at `pm2 start binance-bot` on 2026-06-16. After that, the new rules apply.
