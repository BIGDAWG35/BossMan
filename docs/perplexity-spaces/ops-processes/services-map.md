# Services Map — Verified 2026-05-20

## PM2 Managed Services

| PM2 Name | Port | Service | Status | Notes |
|----------|------|---------|--------|-------|
| quick-stats | 8102 | QuickStats | ⚠️ RESTART LOOP | 43k+ restarts, uptime ~3s, online but unstable |

## LaunchAgent Managed Services

| Label | Port | Service | Status |
|-------|------|---------|--------|
| com.local.quickstats | 8102 | QuickStats | stopped (-15) |
| com.local.teamstandup | 8003 | TeamStandup | stopped (-15) |
| ai.hermes.gateway | — | Hermes Gateway | running (PID 73036) |
| ai.openclaw.gateway | — | OpenClaw Gateway | disabled |

## Port Audit (Live)

| Port | Service | HTTP | Response |
|------|---------|------|---------|
| 3001 | bakery | 200 | 1.8ms ✅ |
| 8020 | money-pipeline | 200 | 2.8ms ✅ |
| 8030 | squarepayouts | 200 | 2.2ms ✅ |
| 8104 | binance-bot | 200 | 1.7ms ✅ |
| 8102 | quick-stats | 200 | 1.3ms ✅ |
| 9119 | hermes dashboard | 200 | 2.9ms ✅ |
| 8100 | overview | — | offline |
| 8110 | health-dashboard | — | offline |
| 8130 | trading-control | — | offline |
| 8140 | youtube-dashboard | — | offline |
| 8106 | kraken-bot | — | offline |
| 8003 | teamstandup | — | offline |

## Unknown Ports — Resolved

| Port | Process | Identity |
|------|---------|----------|
| 9119 | python3.1 (PID 38075) | `hermes dashboard` CLI, localhost only |
| 8003 | node (PID 83551) | teamstandup, LaunchAgent present but stopped |

## Cron Jobs

| Schedule | Job | Last Run | Status |
|----------|-----|----------|--------|
| 0 9 * * * | squarespayouts-status-exporter | 2026-05-19 | ✅ working |

## Issues

### 🚨 CRITICAL: quick-stats PM2 restart loop
- 43,767 restarts, uptime ~3s → crashes and restarts immediately
- Root cause: unknown (check `~/.hermes/profiles/ops/home/.pm2/logs/quick-stats-error.log`)
- Both PM2 `quick-stats` AND LaunchAgent `com.local.quickstats` registered — possible port conflict
- **Action needed:** Investigate crash logs, determine if PM2 instance should be stopped in favor of LaunchAgent version, or vice versa

### 📋 PM2 save
- Run `pm2 save` after any PM2 change to persist current state

### 📋 No health monitor cron found
- No ~/.hermes/health-monitor.log or health monitoring cron configured
- Recommendation: set up weekly cron running `hermes-service-verification.sh`

## System LaunchAgents (benign)

| Label | Purpose |
|-------|---------|
| com.google.keystone.* | Google Update |
| com.philandro.anydesk.Frontend.plist | AnyDesk |
| application.com.brave.Browser.* | Brave Browser |
| application.ai.perplexity.* | Perplexity |
| application.io.tailscale.* | Tailscale |

## Files

- Verification script: `~/.hermes/profiles/ops/scripts/hermes-service-verification.sh`
- PM2 home: `~/.hermes/profiles/ops/home/.pm2/`
- Quick Stats: `/Users/bigdawg/Projects/quick-stats/`