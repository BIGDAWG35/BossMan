# Weekly Systems Review — 2026-06-01
**Owner:** BossMan
**Schedule:** Every Monday 8 AM PDT via Hermes cron
**Week of:** 2026-05-26 to 2026-06-01

---

## Section 1: PM2 Health

**Services online (10/10):**
- bakery (23h uptime, 0 restarts)
- client-hub (23h uptime, 0 restarts)
- cloudflare-tunnel (23h uptime, 0 restarts)
- csdawg-dashboard (23h uptime, 0 restarts)
- fresh-dashboard (23h uptime, 0 restarts)
- health-dashboard (23h uptime, 0 restarts)
- hub (23h uptime, 0 restarts)
- money-pipeline (23h uptime, 0 restarts)
- overview (23h uptime, 0 restarts)
- squarepayouts (23h uptime, 0 restarts)

**Missing from PM2:**
- binance-bot — NOT in PM2 (port 8104 not listening). Last seen Phase 16 deployment. Binary not started.

**Auto-restart recovery events:** None this week — all stable.

**PM2 save status:** ✅ Synced — `pm2 save` run post last restart.

---

## Section 2: Log Errors

**New errors this week:**

1. **Binance bot not in PM2** — cron health checks (06-01 08:00, 05-31 21:00, 05-31 09:00) all report `binance-bot not found`. The binary is not running.
2. **Tirith pipe-to-interpreter block** — `pm2 jlist | python3` blocked by security. Cron jobs need fixing to use `pm2 jlist 2>&1` pattern instead of pipe.
3. **Background review denials** — cron sessions trying to use `read_file`, `write_file`, `patch` in background. Background sessions restricted to `memory`/`skill` tools only.
4. **Skill name collision** — `binance-bot` skill ambiguous: 2 candidates (`trading/binance-bot` and `devops/kanban-orchestrator/references/binance-bot.md`). Needs disambiguation.
5. **date command illegal format** — `date -j` macOS syntax used in a Linux-style cron. Cosmetic only.
6. **Skill `trading/binance-bot` not found** — cron trying to load a skill that doesn't exist in the active profile.

**Recurring (ongoing):**
- binance-bot health check cron fires every 6h and always fails with "binance-bot not found" since ~2026-05-25. This is a known degraded state documented in SYSTEMS_IMPROVEMENT_2026-06-01.

---

## Section 3: Service Port Status

| Port | Service | Status |
|------|---------|--------|
| 3001 | — | Not listening (bakery was here historically) |
| 8040 | bakery | ✅ LISTENING |
| 8020 | money-pipeline | ✅ LISTENING |
| 8030 | squarepayouts | ✅ LISTENING |
| 8050 | client-hub | ✅ LISTENING |
| 8090 | hub | ✅ LISTENING |
| 8104 | binance-bot | 🚨 NOT LISTENING |
| 8150 | csdawg-dashboard | ✅ LISTENING |

---

## Section 4: Kanban Backlog

**Known active cards (from systems improvement reports):**
- BinanceBot: binance-bot down, needs manual restart and investigation
- Binance Bot: Phase 16 already fixed — LIVE trade TDZ issue resolved May 30
- Hermes: CuaDriver daemon self-heal confirmed stable
- CryptoIntel: CSDAWG 2.0 active (intelligence.json age 6d)

**Completed this week:**
- P9M: alerts-helper.js for Mission Control
- P9N: CSDAWG tile on Mission Control
- Phase 16: Binance Bot liveBal TDZ fix deployed May 30
- CSDawg dashboard `/api/overview` + CORS added

---

## Section 5: Project Status

### Money Pipeline
- Status: ✅ ONLINE
- Research pipeline: healthy (481 records, last enrichment 2026-05-20, last created 2026-06-01)
- v2Coverage: 71%, v2Count: 342
- researchCron: healthy
- Notes: Working correctly.

### Binance Bot
- Status: 🚨 OFFLINE — not in PM2, port 8104 not listening
- Last deployed: Phase 16 (2026-05-30 22:32)
- Last health: ALERT fires every ~6h from cron (last at 08:00 today)
- Root cause: binary not started after Phase 16 deployment. Needs `pm2 start ecosystem.config.cjs` or manual restart.
- Balance: unknown (service down)

### SquarePayouts
- Status: ⚠️ DEGRADED (auth issues ongoing since Phase 15 start)
- Notes: Auth fix in progress.

### BakeryOps
- Status: ✅ ONLINE — 23h uptime, 0 restarts, port 8040 listening

---

## Section 6: Strategic

**Phase progress:**
- Phase 16 (Binance Bot TDZ): ✅ Deployed May 30
- Phase 15 (SquarePayouts auth): 🟡 In progress
- Phase 14 (Hermes cron cleanup): ✅ Complete

**Next week priorities:**
1. Restart binance-bot — binary not running, investigate why PM2 didn't pick it up after Phase 16
2. Continue SquarePayouts auth fix — Phase 15
3. Investigate PM2 health cron false positives (tirith blocks, background review denials)

---

## Output to Marcelo

```
📊 HERMES WEEKLY SYSTEMS REVIEW — 2026-06-01

✅ HEALTHY: bakery(8040), money-pipeline(8020), squarepayouts(8030), client-hub(8050), hub(8090), csdawg-dashboard(8150), overview, health-dashboard, fresh-dashboard, cloudflare-tunnel
⚠️ DEGRADED: squarepayouts (auth issue Phase 15)
🚨 NEEDS FIX: binance-bot — NOT in PM2, port 8104 not listening, binary down since ~2026-05-30

🔧 AUTO-FIXED THIS WEEK: CuaDriver self-heal circuit confirmed stable. No actual failures requiring auto-fix.

📁 MEMORY FILES: ~/.hermes/knowledge/memory/
📋 PHASE STATUS: Phase 16 done | Phase 15 auth in progress
🎯 NEXT WEEK PRIORITY:
  1. Restart binance-bot manually + fix PM2 registration
  2. SquarePayouts auth fix (Phase 15)
  3. PM2 health cron — fix tirith blocks and background review denials
```