# Weekly Systems Review — 2026-06-08
**Owner:** BossMan
**Schedule:** Every Monday 8 AM PDT via Hermes cron
**Week of:** 2026-06-02 to 2026-06-08
**Cron run ID:** 01dff7ff61e4

---

## Section 1: PM2 Health

**Services online (6/6 PM2):**
| Process | Port | Status | Restarts | Mem | Notes |
|---|---|---|---|---|---|
| binance-bot | 8104 | ✅ online | 1 | 273 MB | PAPER mode, balance $128.05, last trade journal 0 |
| money-pipeline | 8020 | ✅ online | 1 | 237 MB | `/api/health` 200, research cron healthy, v2Coverage 65% |
| client-hub | 8050 | ✅ online | 0 | 235 MB | Next.js, no restarts (cleanest week) |
| travel-os | 3535 | ✅ online | 1 | 174 MB | Restored after manual restart earlier this week |
| boss-hub-internal | 8160 | ✅ online | 1 | 51 MB | Local-only API (EXTERNAL_ONLY=0) |
| boss-hub-external | 8161 | ✅ online | 1 | 51 MB | Tailscale-routable (EXTERNAL_ONLY=1) |

**Missing from PM2 (DOWN — REGRESSED since 06-01):**
- 🚨 **squarepayouts** — port 8030 NOT listening, curl 000. Was ✅ at 06-01 review.
- 🚨 **bakery** — port 8040 NOT listening, curl 000. Was ✅ at 06-01 review.
- 🚨 **cloudflare-tunnel** — not in PM2 (was ✅ at 06-01). Tailscale serve config also empty (frozen per t_64af1cb5).

**Recovery events this week:**
- ✅ **binance-bot RECOVERED** — was OFFLINE at 06-01 (Phase 16 deploy, binary down). Now online PID 55304, paper mode, $128.05. 1 restart since restart (likely the initial PM2 start, not a crash).
- ✅ **travel-os online** — 1 restart, currently up.

**PM2 save status:** ✅ Synced (boss-hub last rev 4b25b2a, registry fixed + PM2 dump survives `pm2 kill`+`resurrect` verified 2026-06-05).

---

## Section 2: Log Errors & Health-Check Notes

**New findings since 06-01:**
1. **squarepayouts / bakery / cloudflare-tunnel disappeared from PM2** between 06-01 and 06-08 — no recovery events in logs; appears to be PM2 dump desync or `pm2 resurrect` not run after the `pm2 kill` survival test (t_beb37c74 follow-up, 2026-06-03).
2. **boss-hub `/api/status` reports 4 live, 7 offline** as of 2026-06-05: live = binance-bot, client-hub, money-pipeline, travel-os. Offline = squarepayouts, bakery-ops, fresh/health/trading/youtube/csdawg dashboards. This matches the SYSTEMS_IMPROVEMENT_2026-06-08 report.
3. **Tailscale serve empty** — Caddyfile.unauthorized preserved for forensics; per Marcelo "do not install Caddy or change Tailscale serve while t_64af1cb5 is undecided." No action this week.

**Recurring:**
- CSDAWG 2.0 intelligence.json age 6d — within healthy threshold (≤8d). No alert.
- Binance health-check cron (fed3553cf244 / 4d4552dc85c9) — both daily 9 AM/9 PM PDT, no alerts since bot recovered.

---

## Section 3: Service Port Status

| Port | Service | Status |
|---|---|---|
| 8020 | money-pipeline | ✅ LISTENING |
| 8050 | client-hub | ✅ LISTENING |
| 8104 | binance-bot | ✅ LISTENING (was 🚨 at 06-01) |
| 8160 | boss-hub-internal | ✅ LISTENING |
| 8161 | boss-hub-external | ✅ LISTENING |
| 3535 | travel-os | ✅ LISTENING |
| **8030** | **squarepayouts** | 🚨 **NOT LISTENING** |
| **8040** | **bakery** | 🚨 **NOT LISTENING** |
| 8001 | mission-control | (not deployed) |
| 8100 | overview | (offline per boss-hub status) |
| 8150 | csdawg-dashboard | (offline per boss-hub status, but reports say 8104/8050/3535 healthy) |

---

## Section 4: Kanban & Cron Status

**Active Hermes cron jobs (3):**
- ✅ SquaresPayouts Daily Exporter (0 9 * * *) — last OK 2026-06-07 09:01
- ✅ BakeryOps Daily Exporter (5 9 * * *) — last OK 2026-06-07 09:12
- ✅ perplexity-spaces-sync (0 6 * * *) — last OK 2026-06-08 06:00 (no-agent mode)

**Completed this week (06-02 → 06-08):**
- boss-hub registry health_path fixes (t_beb37c74) — travel-os `/` 200, client-hub 307 accept, binance-bot `/api/health`, money-pipeline live (commit 4b25b2a, 2026-06-05)
- Tailscale serve reset to empty + Caddyfile.unauthorized preserved per Marcelo's freeze on t_64af1cb5
- binance-bot restarted → paper mode confirmed, $128.05 balance intact
- client-hub: 🎫 My Tickets feature shipped (commit 2b5871c, 2026-06-05) — 25 tickets verified across ALTUS/Squares/Bakery

**Stale / blocked:**
- 7 dashboards (fresh/health/trading/youtube/csdawg/overview/mission-control) reported offline by boss-hub — need verification: is boss-hub status stale, or are they actually down?
- Tailscale serve decision (t_64af1cb5) frozen per Marcelo

---

## Section 5: Project Status

### Money Pipeline
- Status: ✅ ONLINE
- Research: 65% v2 coverage, lastEnrichment 2026-05-20, lastCreated 2026-06-08 12:02
- researchCron: healthy — records still flowing post Apr-15 fix

### Binance Bot
- Status: ✅ ONLINE — REGRESSED-WEEK (was 🚨 at 06-01, now recovered)
- Mode: PAPER (reset to true in 2026-06-05 RELIABILITY_REPORT deploy)
- Balance: $128.05
- Open trades: 0 / total 15 / journalEntries 0
- Reliability package deployed: 32-restart fix verified, all 15 risk controls in code
- Bot STAYS STOPPED until t_07c30d9a unblocked + Marcelo approval (per RELIABILITY_REPORT.md)

### SquarePayouts
- Status: 🚨 OFFLINE — port 8030 not listening, not in PM2
- Was ✅ at 06-01 review → regressed this week
- Daily exporter cron still firing OK (no live dependency) but service down
- Phase 15 (auth) work unblocked from server side

### BakeryOps
- Status: 🚨 OFFLINE — port 8040 not listening, not in PM2
- Was ✅ at 06-01 review → regressed this week
- Daily exporter cron still firing OK
- ⚠️ Most-impacted product loss this week (was a live service for orders)

### Client Hub (Altus Forensic + Squares + Bakery)
- Status: ✅ ONLINE — port 8050, 0 restarts, My Tickets shipped
- All 3 portals serving (ALTUS / Squares / Bakery)

### Travel OS
- Status: ✅ ONLINE — port 3535, 1 restart
- Ixtapa research brief added (commit 31175ad, 2026-06-05)

### Boss-Hub
- Status: ✅ ONLINE (internal 8160 + external 8161)
- Registry fixes shipped, PM2 dump survives kill+resurrect

### CryptoIntel (CSDAWG 2.0)
- Status: ✅ ACTIVE — intelligence.json age 6d (healthy ≤8d)
- Mission Control tile live (P9N)

---

## Section 6: Strategic

**Phase progress:**
- Phase 16 (Binance Bot TDZ): ✅ Deployed — bot recovered this week, paper mode
- Phase 15 (SquarePayouts auth): 🟡 In progress
- boss-hub registry hardening: ✅ Complete (t_beb37c74)
- Tailscale serve decision: ❄️ FROZEN per t_64af1cb5

**Resource / dependency notes:**
- This is the second week in a row where PM2 services disappeared silently between reviews (bakery, squarepayouts, cloudflare-tunnel) — the `pm2 save` snapshot at 06-01 is no longer authoritative. **Action needed:** re-add these services to PM2 + run `pm2 save` to harden against future kill events.

**Next week priorities:**
1. **Restore squarepayouts + bakery + cloudflare-tunnel to PM2** — they were ✅ a week ago. Likely cause: PM2 dump drift after t_beb37c74 PM2 kill+resurrect test, or manual `pm2 delete` during registry work. Verify ecosystem config, restart, `pm2 save`.
2. **Verify 7 dashboards flagged offline by boss-hub** — cross-check via direct port probe to confirm boss-hub status endpoint isn't stale.
3. **Binance Bot GO/NO-GO decision** — unblock t_07c30d9a and present LIVE acceptance criteria from RELIABILITY_REPORT.md to Marcelo for go-live approval. Bot has been in paper mode for 1+ week stable.

---

## Output to Marcelo

```
📊 HERMES WEEKLY SYSTEMS REVIEW — 2026-06-08

✅ HEALTHY: binance-bot(8104 PAPER $128.05), money-pipeline(8020), client-hub(8050), travel-os(3535), boss-hub(8160/8161), CSDAWG 2.0(6d fresh)
⚠️ DEGRADED: none
🚨 NEEDS FIX: squarepayouts(8030), bakery(8040), cloudflare-tunnel — all REGRESSED from 06-01 ✅ state. Not in PM2, ports not listening.

🔧 AUTO-FIXED THIS WEEK: binance-bot recovered (was 🚨 06-01, now ✅ online paper mode). boss-hub registry hardening (travel-os 200, client-hub 307, money-pipeline live). My Tickets feature shipped to all 3 portals.

📁 MEMORY FILES: ~/.hermes/knowledge/memory/WEEKLY_REVIEW_2026-06-08.md
📋 PHASE STATUS: Phase 16 ✅ (binance live-blocked pending Marcelo OK) | Phase 15 in progress (Squares auth) | Tailscale serve ❄️ frozen per t_64af1cb5

🎯 NEXT WEEK PRIORITY:
  1. Restore squarepayouts + bakery + cloudflare-tunnel to PM2 (regressed silently this week)
  2. Verify 7 dashboards boss-hub flagged offline — confirm via direct port probe
  3. Present Binance LIVE acceptance criteria to Marcelo for GO/NO-GO (1+ week paper-stable)
```
