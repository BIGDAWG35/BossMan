# Clean Baseline — 2026-06-15 20:03 PDT

Source: /Users/bigdawg/hermes-cron-backups-2026-06-15-200309/
- hermes-cronjob-list.txt (24 active crons)
- system-crontab.txt (empty)
- pm2-status.txt (12 processes)
- Mirrored to BossMan repo: knowledge/audits/2026-06-15-clean-baseline.md (commit e792a5d)

Expected state locked in:

CRONS (24)
- SquaresPayouts Daily Exporter (0561fcffeba1) — 0 9 * *
- BakeryOps Daily Exporter (c6d759d2b561) — 5 9 * *
- perplexity-spaces-sync (7203f2330d92) — 0 6 * *
- Morning Pipeline Brief (5f3569ba2813) — 0 8 1-5 *
- Hermes Monthly Deep-Audit (e8c2a1f3d419) — 0 9 1 *
- Hermes Weekly Systems Review (88eff3953480) — 0 8 1 *
- CSDAWG 2.0 Weekly Intelligence (76956b7cafa7) — 0 15 1 *
- MoneyPipeline Morning Research (c77d492c5b6d) — 0 5 * *
- MoneyPipeline Auto-Enrich V2 (8fb30e332d6d) — 0 6 * *
- CuaDriver Health Monitor (84896b15c68b) — */5 * * * *
- Client Hub Feedback Queue Processor (8d04ee3f0227) — */5 * * * *
- PM2 Health Monitor (01dff7ff61e4) — */15 * * * *
- binance-health-check-am (fed3553cf244) — 0 9 * *
- binance-health-check-pm (4d4552dc85c9) — 0 21 * *
- Weekly Hermes → Perplexity Spaces Refresh (ff0b6860cba5) — 0 7 6 *
- Travel OS External Watchdog (b858e01bd089) — */15 * * * *
- Travel OS Handoff Sync — Weekly Drift Check (ab41f101c407) — 0 6 6 *
- Hermes Weekly MEMORY Health Check (378ef14a305b) — 5 9 1 *
- Obsidian Vault Monthly Audit (0613ba1877bc) — 0 9 1 *
- Obsidian Vault Bi-Monthly Review (ee1f669efb1e) — 0 10 1 */2
- Crypto Weekly Learning & Intel Review (ea0157d715fa) — 0 18 0 *
- binance-bot-live-monitor (0d9d490f7ec2) — */5 * * * *
- binance-bot-auto-ticket (691b1d66658e) — */5 * * * *
- Travel OS — Trip Reminder (7f58cef97c80) — 0 8 * *

PM2 (12 online)
- money-pipeline
- client-hub
- travel-os
- health-dashboard
- bakery
- youtube-dashboard
- trading-control
- csdawg-dashboard
- boss-hub-internal
- boss-hub-external
- pmd-web
- binance-bot (LIVE, pre-start.js, $75 cap)

System crontab: empty (no system-level jobs).

Key invariants:
- Binance bot is LIVE, protected by pre-start fail-closed wrapper + $75 max notional + health checks.
- SquarePayouts runs via daily export cron only (no PM2 service on port 3100).
- Travel OS is a full dashboard + 3 intentional crons (watchdog, handoff, trip reminders).
- No Basecamp, PMD, or hub-specific crons remain; those apps are PM2-only.

