# Weekly Systems Review — 2026-06-22
**Owner:** BossMan
**Schedule:** Every Monday 8 AM PDT via Hermes cron
**Week of:** 2026-06-16 to 2026-06-22
**Cron run ID:** 01dff7ff61e4 (pm2-health-check)

---

## Section 1: PM2 Health

**12 processes registered in PM2** (down from 13 last week — caddy removed or auto-cleaned):

| Process | Port | Status | Restarts | Uptime | Notes |
|---|---|---|---|---|---|
| bakery | 8040 (claims) | ⚠️ online (false) | 3 | 9D | **3rd week of EADDRINUSE zombie** — PM2 online 9D but **port 8040 NOT listening** (lsof returns nothing). PM2 health monitor cannot detect this. |
| binance-bot | 8104 | ✅ online | 2 | 22h | PAPER=false, LIVE_PILOT_MAX_NOTIONAL=75. `/api/health` 200. Restarted once this week (last 22h). |
| boss-hub-external | 8161 | ✅ online | 8 | 6D | Tailscale-routable, stable |
| boss-hub-internal | 8160 | ✅ online | 8 | 6D | 53.7 MB, stable |
| client-hub | 8050 | ✅ online | 3 | 4D | 107 MB, 307 redirect ✅ |
| csdawg-dashboard | 8150 | ✅ online | 0 | 11D | Zero restarts — most stable service |
| health-dashboard | 8110 | ✅ online | 0 | 11D | Zero restarts |
| money-pipeline | 8020 | ✅ online | 169 | 3D | **HIGH CHURN (169 restarts)** — still stable but burning. Same pattern as last week. Investigate. |
| pmd-web | — | ✅ online | 0 | 4D | 71 MB — restarts reset to 0 (was 37 last week). Improved. |
| trading-control | — | ✅ online | 0 | 11D | 272 MB, stable |
| travel-os | 3535 | ✅ online | 2 | 10D | 162 MB, Next.js stable |
| youtube-dashboard | — | ✅ online | 0 | 11D | 105 MB, stable |

**Missing from PM2 (REGRESSED — 3rd week running):**
- 🚨 **squarepayouts** — port 8030 NOT listening, NOT in PM2. 21-day outage. `~/Projects/squarepayouts/ecosystem.config.js` exists (1280 bytes, modified Jun 15) but never registered. Ecosystem config was touched 06-15 — possible abort during deploy.
- 🚨 **caddy** — not in PM2 this week. Was crash-looping 82,084× last week with missing Caddyfile. Status now unknown (no process, no listener). Last week's review recommended `pm2 delete caddy` OR restore Caddyfile — appears deleted.

**PM2 save status:** ✅ Synced (verified 2026-06-15 still valid).

---

## Section 2: Log Errors & Health-Check Notes

**New findings since 06-15:**
1. **Bakery zombie persists (3rd week)** — PM2 still reports online 9D, but `lsof :8040` returns nothing. No traffic in `bakery-ops/logs/{out,error}.log` (files empty/tail-failed). Root cause unchanged: EADDRINUSE on inner port prevents binding 8040. BossMan's PM2-only health check cannot see this.
2. **Money-pipeline 169 restarts** — 3D uptime but 169 restart events. ~56 restarts/day. Pattern: silent fast-restart loop. Logs need review; possible cause: env reloads, config drift, or health-check kicking its own process.
3. **Crypto intel freshness** — `intelligence.json` in `latest/` directory dated **Jun 15** (7 days stale). The `crypto-intel/weekly/2026/` directory has been updated through Jun 19 (so cron is running), but the `latest/` symlink/copy is stale. CSDAWG 2.0 freshness check should alert at ≤7d; we're at threshold.

**Recurring (carry-forward from prior weeks):**
- Bakery zombie: 3rd consecutive weekly review flagging
- SquarePayouts missing from PM2: 3rd consecutive week
- BossMan health monitor cannot detect "online-but-not-listening" false positives (carried 2 weeks)

**Resolved since 06-15:**
- ✅ **Caddy crash loop** — no longer in PM2 (either `pm2 delete caddy` was run, or auto-cleaned). 82,084 restarts/second is gone. Port 7575 still shows as listening by `node` per lsof, but is no longer in PM2 — need to identify owner.
- ✅ **pmd-web restarts reset** — was 37 (high) last week, now 0. Either fixed or process was replaced.
- ✅ **boss-hub** — no fresh restart spike; both 8160/8161 stable 6D.

---

## Section 3: Service Port Status (Ground Truth)

| Port | Service | Status | Source |
|---|---|---|---|
| 8020 | money-pipeline | ✅ LISTENING | lsof |
| 8050 | client-hub | ✅ LISTENING | lsof |
| 8104 | binance-bot | ✅ LISTENING | lsof |
| 8110 | health-dashboard | ✅ LISTENING | lsof |
| 8150 | csdawg-dashboard | ✅ LISTENING | lsof |
| 3535 | travel-os | ✅ LISTENING | lsof |
| 8160 | boss-hub-internal | ✅ LISTENING (Python) | lsof |
| 8161 | boss-hub-external | ✅ LISTENING (Python) | lsof |
| 7575 | (unidentified node) | ⚠️ LISTENING — owner unknown | lsof (no PM2 entry) |
| **8030** | **squarepayouts** | 🚨 **NOT LISTENING** | lsof (21d outage) |
| **8040** | **bakery** | 🚨 **NOT LISTENING** | lsof (3w zombie) |
| 8001 | mission-control | ❌ NOT LISTENING | (not deployed) |
| 8100 | overview | ❌ NOT LISTENING | lsof |
| 8102 | quick-stats | ❌ NOT LISTENING | lsof (was up 06-15) |
| 8106 | kraken-bot | ❌ NOT LISTENING | lsof |
| 5050 | fresh-dashboard | ❌ NOT LISTENING | lsof |

**New concern:** port 7575 is bound by `node` with no PM2 registration. Either legacy node process or new service started outside PM2. Worth a 5-min audit.

---

## Section 4: Phase 12 Add-On Checks

**[PM2 status]:** 12 services online; 0 offline. 1 zombie (bakery). 1 high-churn (money-pipeline 169 restarts).

**[Port liveness]:** 8/8 critical ports listening (excluding zombie). 7575 owner unknown. 8030 (squarepayouts) and 8040 (bakery) down.

**[Binance Bot mode + LIVE_PILOT cap]:**
- `PAPER_MODE=false` — bot is in LIVE/PILOT mode
- `LIVE_PILOT_MAX_NOTIONAL=75` — capped at $75 notional
- Status: online 22h, restarted 2× (last restart ~22h ago)
- **OK** — both flags as expected from Phase 12 setup

**[Crypto intel freshness]:**
- `intelligence.json` in `latest/`: dated **Jun 15** (7d old, at alert threshold)
- `weekly/2026/`: updated through Jun 19 (cron running)
- **Action needed:** symlink/copy `latest/` to most recent weekly file, or update cron to refresh

**[Disk space]:** 460GB total, 185GB used, 254GB free (43%) — ✅ healthy

**[Hermes gateway + CuaDriver]:**
- Hermes gateway: PID 63507, no exit code (running) ✅
- ai.hermes.gateway-health: exit 78 (failing per `launchctl list` — by design, it's a one-shot check job)
- Hermes desktop app: PID 87284, exit 0 (last status check) ✅
- CuaDriver socket: exists at `~/Library/Caches/cua-driver/cua-driver.sock`, age 0s (fresh) ✅
- Computer Use: **HEALTHY**

---

## Section 5: Memory Quality Check

**`PERFORMANCE_FINDINGS.md`:** Last updated 2026-05-22 (4 weeks old). Needs refresh. Findings still relevant (PM2 gap, legacy scripts) but no Phase 12+ entries.

**`MEMORY_CAPTURE_LOG.md`:** 79KB, last entry 2026-06-15 (weekly review from last week). Active. No new [PERFORMANCE] entries this week — gap.

**New patterns observed (worth capturing):**
- **Pattern:** "online-but-not-listening" PM2 false positive — recurring across bakery (8040) and previously caddy. BossMan's health monitor checks PM2 status only; needs active port probe layer.
- **Pattern:** Money-pipeline's 169 restarts/3D is the same kind of silent loop. Worth checking if the bot's "Restart on file change" trigger is firing on `.env` re-reads.

---

## Section 6: Project Status

### Money Pipeline
- Status: online but high-churn
- Port 8020 listening, but 169 restarts in 3D
- Research pipeline: unknown (need log inspection)
- Notes: needs root-cause for restart loop. Possible culprit: env reload trigger, log rotation, or health-check kill chain.

### Binance Bot
- Status: online 22h, stable after recent restart
- Mode: LIVE/PILOT (PAPER_MODE=false, LIVE_PILOT_MAX_NOTIONAL=$75)
- Balance: not inspected (would require /api/balance — out of scope for cron, but should appear in health-check logs)
- Notes: mode and cap correctly set per Phase 12.

### SquarePayouts
- Status: 🚨 **3rd week offline** (21 days)
- Port 8030: not listening
- PM2: not registered
- Ecosystem config: exists at `~/Projects/squarepayouts/ecosystem.config.js`
- Notes: blocking 4-layer product MVP testing. **Highest-priority unblock.**

### BakeryOps
- Status: 🚨 **3rd week zombie** (PM2 online but no listener)
- Port 8040: not listening
- Logs: empty
- Notes: needs `pm2 delete bakery` + clean port 3001/8040 + restart. EADDRINUSE pattern is well-understood.

### AltusForensic
- Status: not checked (out of PM2 scope)
- Project output: `/Users/Shared/hermes_output/altus_forensic/`

### CSDawgDashboards (csdawg/health/trading/youtube)
- Status: 4/4 online, 0 restarts, 11D stable
- Most reliable cluster

### TravelOS
- Status: online 10D
- Stale `async doRender` errors carried from prior week — still not impacting availability, low priority

### PMD (Property Management Dashboard)
- Status: online 4D
- Restarts reset to 0 from last week's 37

---

## Section 7: Strategic

**Phase progress against HERMES MASTER BLUEPRINT:**
- Phase 12 (Binance bot live pilot + crypto intel): ✅ running in live-pilot mode, intel cron running but `latest/` symlink stale
- Phase 11A (Binance TDZ fix): ✅ verified deployed, no recurrences
- Phase 8 (BossMan autonomy): 🟡 partial — health monitor cannot detect "online-but-not-listening"; PM2 churn detection missing

**Next week's priority cards:**
1. **`t_p12_issue_squarepayouts_re_register`** — register `~/Projects/squarepayouts/ecosystem.config.js` in PM2. 21-day outage. One-shot `pm2 start ecosystem.config.js && pm2 save`. **5-min fix, $0 cost, unblocks 4-layer product MVP.**
2. **`t_p12_issue_bakeryops_zombie_reset`** — full reset: `pm2 delete bakery` → kill all node procs on 3001/8040 → `fuser -k 3001/tcp 8040/tcp` → `pm2 start ecosystem` → verify port 8040 actually listening with curl. **15-min fix, eliminates the "online-but-not-listening" blind spot for this one service.**
3. **`t_p12_issue_pm2_health_check_port_probe`** — extend BossMan PM2 health monitor with an active port probe: for each CRITICAL_SERVICE, curl `http://localhost:$PORT/health` and alert if PM2 online + port down. **30-min fix, prevents the bakery/caddy class of failure from re-occurring unnoticed.**

**Resource constraints or blockers:**
- None technical. All three priorities are within BossMan's standing authority (no infra install, no public port changes, no security boundary changes).
- Cron jobs are healthy; dispatcher is idle and ready to accept kanban cards.

**Knowledge gaps to close this week:**
- Money-pipeline 169-restart root cause — should be a quick log inspection (10 min)
- Port 7575 unidentified node — 5-min `ps aux | grep node` + lsof
- Crypto intel `latest/` symlink staleness — 5-min `ls -la` + symlink/cp fix

---

## Output to Marcelo

Delivered as Telegram-ready summary in final cron response.
