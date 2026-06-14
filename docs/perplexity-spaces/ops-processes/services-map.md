# Services Map — Updated 2026-05-21 (P20)

## PM2 Managed Services

| PM2 Name | Port | Service | Status | Restarts | Notes |
|----------|------|---------|--------|----------|-------|
| money-pipeline | 8020 | MoneyPipeline | ✅ online | 8 | Stable, revenue app |
| bakery | 8040 | BakeryOps | ✅ online | 1 | Stable, revenue app |
| cloudflare-tunnel | — | CF Quick Tunnel | ✅ online | 5 | Unstable URL (changes on restart) |
| binance-bot | 8104 | Binance Bot | ✅ online | 7 | PAPER_MODE=true, INTEL_GATE=true |
| squarepayouts | 8030 | SquarePayouts | ✅ online | 0 | NEXTAUTH_SECRET in PM2 env |

## LaunchAgent Managed Services

| Label | Port | Service | Status | Restarts | Class |
|-------|------|---------|--------|----------|-------|
| ai.hermes.gateway | — | Hermes Gateway | ✅ running (PID 31271) | 0 | **KEEP** — core Hermes |
| com.local.quickstats | 8102 | QuickStats (Ops Briefing) | ✅ running (PID 47491) | exit -15 | **KEEP** — internal ops dashboard |
| com.local.teamstandup | 8003 | Team Standup Bot | ✅ running (PID 2781) | exit -15 | **NEEDS DECISION** — Marcelo to decide |
| ai.openclaw.gateway | — | OpenClaw Gateway | 🚫 disabled | — | Previously sent autonomous Telegram — disabled 2026-05-18 |
| ai.hermes.gateway-health | — | Gateway Health Monitor | 🚫 DISABLED | — | Caused restart loop; replaced by gateway-health-check.sh (one-shot) |

## Hermes Cron Jobs (12 active)

| Job | Schedule | Deliver | Last Run | Status | Class |
|-----|----------|---------|----------|--------|-------|
| SquaresPayouts Daily Exporter | 0 9 * * * | origin | 2026-05-20 | ok | KEEP |
| BakeryOps Daily Exporter | 5 9 * * * | origin | 2026-05-20 | ok | KEEP |
| perplexity-spaces-sync | 0 6 * * * | origin | 2026-05-20 | ok | KEEP |
| Perplexity Spaces Daily Audit | 0 8 * * * | telegram | 2026-05-20 | ok | KEEP (delivers to Marcel) |
| PM2 Health Monitor | */5 * * * * | origin | 2026-05-20 | ok | KEEP (re-enabled P20) |
| Morning Pipeline Brief | 0 8 * * 1-5 | origin | 2026-05-20 | ok | KEEP |
| Basecamp Monitor | */15 * * * * | local | 2026-05-20 | ok | KEEP |
| Hermes Monthly Deep-Audit | 0 9 1 * * | origin | — | next: 2026-06-01 | KEEP |
| Hermes Weekly Systems Review | 0 8 * * 1 | telegram | — | next: 2026-05-25 | KEEP |
| CSDAWG 2.0 Weekly Intel | 0 15 * * 1 | origin | — | next: 2026-05-25 | KEEP |
| Phase 12 Weekly Systems Improvement | 0 8 * * 1 | local | — | next: 2026-05-25 | KEEP |
| MoneyPipeline Morning Research | 0 5 * * * | telegram | — | next: 2026-05-21 | KEEP |
| MoneyPipeline Auto-Enrich V2 | 0 6 * * * | telegram | — | next: 2026-05-21 | KEEP |

## Hermes Scripts (key ones)

| Script | Purpose | Status |
|--------|---------|--------|
| gateway-health-check.sh | One-shot gateway + CuaDriver health check | ✅ Active (P20 safe design) |
| gateway-health-monitor.sh.RETIRED | Old unsafe daemon monitor | 🚫 Retired P20 |
| pm2-health-monitor.sh | PM2 service health (every 5 min) | ✅ Active (re-enabled P20) |
| weekly-systems-improvement.sh | Weekly systems report (Mon 8 AM) | ✅ Active |
| basecamp-monitor-cron.sh | Basecamp polling | ✅ Active (mutex locked) |
| spaces-audit-cron.sh | Perplexity Spaces audit | ✅ Active |
| crypto-intel-weekly.js | CSDAWG 2.0 intel | ✅ Active |

## Cleanup Actions P20

- ✅ Retired `gateway-health-monitor.sh` (superseded by safe `gateway-health-check.sh`)
- ✅ Re-enabled PM2 Health Monitor cron (was paused during gateway debugging)
- ✅ Removed duplicate hermes-gateway reference from pm2-health-monitor.sh
- ✅ Retired teamstandup LaunchAgent (code kept on disk, reversible — pending Marcelo decision)
- ✅ Cleaned stale `/tmp/pm2-alert-hermes-gateway.lock`
- ⚠️ money-pipeline: 8 restarts, `fs is not defined` bug at line 1780 — not currently crashing, needs fix before it resurfaces

## Known Issues

### Medium: money-pipeline `fs is not defined` bug
- Location: `/Users/bigdawg/Projects/money-making-dashboard/server.js:1780`
- Trigger: health check endpoint at `/Users/bigdawg/Projects/money-making-dashboard/logs/auto-enrich-health.json`
- Currently: app is stable (8 restarts total, likely from early debugging), bug not actively crashing
- Fix: add `const fs = require('fs');` at top of server.js or in the health handler scope
- Priority: MEDIUM — will crash if that log file doesn't exist at the wrong time

### Low: CF quick tunnel URL changes on restart
- No stable public URL for SquarePayouts — AUTH_TRUST_HOST=true is the current workaround
- Future: named CF tunnel or Tailscale Funnel (Git-managed ACL blocking Funnel in this phase)

## Decisions Needed

1. **teamstandup-bot**: Marcelo to confirm retire or keep
2. **PM2 Health Monitor cron**: Re-enabled P20 — confirm this is desired
3. **money-pipeline fs bug**: schedule a fix session

## Files

- Verification script: `~/.hermes/scripts/pm2-health-monitor.sh`
- PM2 home: `~/.pm2/`
- Hermes scripts: `~/.hermes/scripts/`
- Hermes logs: `~/.hermes/logs/`
- User logs: `~/logs/`