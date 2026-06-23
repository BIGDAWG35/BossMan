# Weekly Systems Review — 2026-06-15
**Owner:** BossMan
**Schedule:** Every Monday 8 AM PDT via Hermes cron
**Week of:** 2026-06-09 to 2026-06-15
**Cron run ID:** 01dff7ff61e4 (pm2-health-check)

---

## Section 1: PM2 Health

**13 processes registered in PM2** (up from 13 last week, identical):
| Process | Port | Status | Restarts | Uptime | Notes |
|---|---|---|---|---|---|
| binance-bot | 8104 | ✅ online | 0 | 4D | PAPER mode, $128.05, `/api/health` 200 |
| money-pipeline | 8020 | ✅ online | 0 | 4D | `/api/health` 200, research cron healthy |
| csdawg-dashboard | 8150 | ✅ online | 0 | 4D | 116 MB, stable |
| health-dashboard | 8110 | ✅ online | 0 | 4D | 125 MB, stable |
| trading-control | — | ✅ online | 0 | 4D | 286 MB, stable |
| youtube-dashboard | — | ✅ online | 0 | 4D | 119 MB, stable |
| client-hub | 8050 | ✅ online | 2 | 3D | 288 MB, `/` 307 redirect ✅ |
| travel-os | 3535 | ✅ online | 2 | 3D | 189 MB, Next.js render errors in log |
| boss-hub-internal | 8160 | ✅ online | 5 | 3D | 67 MB, `/api/health` 200 (pinging cleanly) |
| boss-hub-external | 8161 | ✅ online | 5 | 3D | 59 MB, Tailscale-routable |
| pmd-web | — | ✅ online | **37** | 3D | 335 MB — **HIGH CHURN** (SQLite experimental warning, lockfile conflicts) |
| bakery | 8040 (claims) | ⚠️ online (false) | 3 | 2D | **EADDRINUSE on 3001** — listed in PM2 but no listener on 8040. Port colliding silently. |
| caddy | — | 🚨 **waiting restart** | **82,084** | 0s | **CRASH LOOP** — `Caddyfile` missing at `~/Projects/boss-hub/Caddyfile`. PM2 keeps restarting; need to either fix config or stop the process. |

**Missing from PM2 (REGRESSED — 2nd week running):**
- 🚨 **squarepayouts** — port 8030 NOT listening, NOT in PM2 (was online 06-01, missing 06-08, still missing 06-15). 14-day outage. Ecosystem config exists at `~/Projects/squarepayouts/ecosystem.config.js` but never registered.
- 🚨 **cloudflare-tunnel** — not in PM2 (frozen per t_64af1cb5 Tailscale serve decision). Not a regression, but unmoved for 2 weeks.

**Recovery events this week:**
- ✅ **bakery "came back"** — but it's a false positive. PM2 shows online 2D, but actual port 8040 not bound. The first 2 of 3 colliding instances are zombies, the visible one is the 3rd starter that hit EADDRINUSE. Needs full reset: kill all node processes on 3001, restart from clean state.

**PM2 save status:** ✅ Synced (still valid from 2026-06-05 t_beb37c74 verification).

---

## Section 2: Log Errors & Health-Check Notes

**New findings since 06-08:**
1. **Caddy crash loop (82,084 restarts)** — `caddy-error.log`: `Error: reading config from file: open /Users/bigdawg/Projects/boss-hub/Caddyfile: no such file or directory`. Root cause: the Caddyfile was archived to `Caddyfile.unauthorized` as part of t_64af1cb5 freeze (2026-06-05). PM2's caddy entry is still pointing at the missing file. PM2 has been trying to restart it every second for 10+ days. **Action:** either restore Caddyfile from `.unauthorized` backup, or `pm2 delete caddy` and `pm2 save`.
2. **Bakery EADDRINUSE — silent zombie state** — PM2 reports "online" but the process isn't actually binding its port. This is a false-positive health signal because the parent process stays alive while the listener dies. Logs show 3 EADDRINUSE errors on port 3001 in the last 24h.
3. **pmd-web high restart churn (37 restarts in 3 days)** — Log shows `Detected additional lockfiles: /Users/bigdawg/Projects/property-management-dashboard/web/package-lock.json` plus `ExperimentalWarning: SQLite`. Likely Next.js dev server being killed and respawned; not catastrophic but burning CPU.
4. **travel-os Next.js render errors** — Stale `async doRender` errors in `base-server.js` — may be related to a stale `.next` build cache. Suggest `stop → rm -rf .next → build → start` per the Next.js permanent rule in SOUL.md.

**Recurring:**
- CSDAWG 2.0 intelligence.json age 6d — within healthy threshold (≤8d). No alert.
- Binance health-check cron — no alerts; bot stable.

---

## Section 3: Service Port Status (Ground Truth)

| Port | Service | Status | Source |
|---|---|---|---|
| 8020 | money-pipeline | ✅ LISTENING (200 OK) | lsof + curl |
| 8050 | client-hub | ✅ LISTENING (307) | lsof + curl |
| 8102 | quick-stats | ✅ LISTENING | lsof |
| 8104 | binance-bot | ✅ LISTENING (200 OK) | lsof + curl |
| 8110 | health-dashboard | ✅ LISTENING | lsof |
| 8150 | csdawg-dashboard | ✅ LISTENING | lsof |
| 3535 | travel-os | ✅ LISTENING | lsof |
| 8160 | boss-hub-internal | ✅ LISTENING (Python) | lsof |
| 8161 | boss-hub-external | ✅ LISTENING (Python) | lsof |
| **8030** | **squarepayouts** | 🚨 **NOT LISTENING** | lsof + curl 000 |
| **8040** | **bakery** | 🚨 **NOT LISTENING** | lsof + curl 000 (PM2 lies) |
| 8001 | mission-control | (not deployed) | n/a |
| 8100 | overview | ❌ NOT LISTENING | lsof |
| 8106 | kraken-bot | ❌ NOT LISTENING | lsof |
| 5050 | fresh-dashboard | ❌ NOT LISTENING | lsof |

---

## Section 4: Kanban & Cron Status

**Active Hermes cron jobs:** BossMan pm2-health-check (01dff7ff61e4) running cleanly on 5-min interval. SquarePayouts/BakeryOps daily exporter jobs paused implicitly because the source services are down.

**Completed this week (06-09 → 06-15):**
- No BossMan-managed card completions logged this week (card table query returned no rows; kanban DB may have moved schemas).

**Stale / blocked:**
- 🚨 **squarepayouts restoration** — 14 days in regression. No BossMan card yet for the PM2 re-registration work.
- 🚨 **bakery port collision** — false-positive "online" state hides real failure. Need to identify the rogue node process binding 3001.
- 🚨 **caddy crash loop** — 82K restarts. Should be a 5-min `pm2 delete caddy` task.
- 7 dashboards (fresh/health/trading/youtube/csdawg/overview/mission-control) reported offline by boss-hub — verification showed 4 of those ARE actually listening (health/trading/youtube/csdawg). Boss-hub status table is stale. May be a registry refresh issue.
- Tailscale serve decision (t_64af1cb5) frozen per Marcelo

---

## Section 5: Project Status

### Money Pipeline (8020)
- Status: ✅ online
- Research pipeline: working, cron healthy
- Notes: 0 restarts in 4D — most stable service in the stack.

### Binance Bot (8104)
- Status: ✅ online, PAPER mode
- Balance: $128.05
- Notes: 4D uptime, 0 restarts. Ready for LIVE GO/NO-GO review with Marcelo.

### SquarePayouts (8030)
- Status: 🚨 **DOWN — 14 days**
- Notes: PM2 entry missing. Ecosystem config exists at `~/Projects/squarepayouts/ecosystem.config.js` but never registered. Re-import via `pm2 start ~/Projects/squarepayouts/ecosystem.config.js` then `pm2 save`.

### BakeryOps (8040)
- Status: ⚠️ **PM2 false positive — port not bound**
- Notes: EADDRINUSE on internal port 3001. Need to kill all bakery-related node processes and restart from clean state. 3 colliding instances in process table.

### CloudflareTunnel
- Status: 🚨 **NOT IN PM2** (frozen per t_64af1cb5)
- Notes: No action this week — pending Marcelo decision.

### BossMan Health Monitor
- Status: ✅ running, cron 01dff7ff61e4
- Notes: Self-healing in place, but didn't catch the caddy crash loop or bakery false-positive. Detection rules may need an update.

---

## Section 6: Strategic

**Phase progress against HERMES MASTER BLUEPRINT:**
- Phase 17 (PM2 hardening) — partly degraded: 2 known false-positives (bakery zombie state) and 1 active crash loop (caddy). Detection rules need updates.
- Phase 18 (Binance LIVE) — awaiting Marcelo GO/NO-GO; bot stable 4D.
- Phase 19 (SquarePayouts stabilization) — STALLED 14 days, no BossMan card.

**Next week's priority cards:**
1. **[URGENT] Restore squarepayouts to PM2** — 14-day outage. Re-register via ecosystem config + verify 8030 listener + pm2 save.
2. **[URGENT] Fix caddy crash loop** — 82K restarts wasting CPU. Either restore Caddyfile or `pm2 delete caddy`.
3. **[URGENT] Fix bakery false-positive health** — Kill zombie node processes on port 3001, restart cleanly, update boss-hub registry to do active port probe instead of trusting PM2 status.

**Resource constraints or blockers:**
- t_64af1cb5 (Tailscale serve) — still frozen, blocks cloudflare-tunnel work.
- SquarePayouts work has model restriction (Claude/DeepSeek/OpenAI only) per AGENTS.md.
- BossMan pm2-health-check detection rules need an update to catch: (a) services "online" in PM2 but not listening on port, (b) crash loops where the process keeps respawning without successful bind.

---

## Output to Marcelo

```
📊 HERMES WEEKLY SYSTEMS REVIEW — 2026-06-15

✅ HEALTHY (9): binance-bot, money-pipeline, client-hub, travel-os,
                boss-hub-{internal,external}, csdawg-dashboard,
                health-dashboard, trading-control, youtube-dashboard

⚠️ DEGRADED (2): bakery (false-positive — EADDRINUSE zombie),
                 pmd-web (37 restarts, lockfile noise)

🚨 NEEDS FIX (3): squarepayouts (14d down), caddy (82K crash loop),
                  cloudflare-tunnel (frozen per t_64af1cb5)

🔧 AUTO-FIXED THIS WEEK: None — BossMan health monitor didn't catch
   the bakery false-positive or the caddy crash loop. Detection rule
   gap to address in next week's PM2 hardening pass.

📁 MEMORY FILES: ~/.hermes/knowledge/memory/
   • 12 daily/weekly reports this week
   • MEMORY_CAPTURE_LOG.md appended with this review

📋 PHASE STATUS:
   • Phase 17 (PM2 hardening) — degraded, 2 false-positives + 1 crash loop
   • Phase 18 (Binance LIVE) — bot ready 4D stable, awaiting GO/NO-GO
   • Phase 19 (SquarePayouts) — STALLED 14 days

🎯 NEXT WEEK PRIORITY:
   1. Restore squarepayouts to PM2 (14-day outage)
   2. Stop caddy crash loop (82K restarts, 5-min fix)
   3. Fix bakery false-positive + update health monitor rules
```
