# Clean Baseline Snapshot — 2026-06-15 20:03 PDT

**Captured by:** BossMan, after Marcelo's 2026-06-15 audit cycle.
**Status:** AUDIT-ONLY snapshot. No changes made.

## Files in this directory
- `2026-06-15-clean-baseline-hermes-cron.txt` — full `hermes cron list` output
- `2026-06-15-clean-baseline-system-crontab.txt` — system crontab (empty)
- `2026-06-15-clean-baseline-pm2.txt` — pm2 process list

## Summary

- **24 active Hermes crons** (post-audit, post-consolidation)
- **0 system crontab entries** (duplicate squarespayouts exporter removed)
- **12 PM2 processes** (caddy removed)

## What's intentionally NOT in the system (cleaned in 2026-06-15 audit)

- 2 ghost PM2 god daemons (killed)
- 2 orphan PM2 home directories (`~/.hermes/pro`, `~/.hermes/profiles/ops/home/.pm2`)
- 1 caddy PM2 process (90,812 restart loop, no Caddyfile)
- 2 obsolete Hermes crons: `dcdb8bf68e01` (disabled broken), `d7baa1737ba8` (Basecamp Monitor)
- 1 system crontab duplicate (squarespayouts exporter)
- 1 stale `module_conf.json` port override (squarepayouts:8030)
- 2 Monday 8am weekly review crons → 1 (88eff3953480 absorbs 2ba797d7ccfa)
- 6 Travel OS trip reminder crons → 1 (7f58cef97c80 consolidated)

## What was throttled (per Marcelo directive)

- PM2 Health Monitor: `*/5` → `*/15` (01dff7ff61e4)
- Travel OS External Watchdog: `*/5` → `*/15` (b858e01bd089)

## What was preserved (per Marcelo directive)

- binance-bot-live-monitor (0d9d490f7ec2) — `*/5` UNCHANGED
- binance-bot-auto-ticket (691b1d66658e) — `*/5` UNCHANGED
- All 3 Travel OS crons UNTOUCHED

## Bot status snapshot

- **binance-bot:** PM2 online, 5h uptime, 1 restart, 0 unstable, `pre-start.js` fail-closed wrapper, `PAPER_MODE=false`, `LIVE_PILOT_MAX_NOTIONAL=75`. **LIVE.**
- **squarepayouts:** not in PM2 (removed in earlier audit; Hermes cron 0561fcffeba1 SquaresPayouts Daily Exporter still active at 0 9 daily).

## Use this snapshot for

- Comparing future state against a known-good baseline
- Kanban documentation of the "clean baseline" state
- Pre/post comparison when investigating any drift
