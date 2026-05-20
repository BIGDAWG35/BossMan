# Weekly Systems Review — 2026-05-22
**Owner:** BossMan
**Date:** 2026-05-22 (Phase 4 test run)
**Status:** ✅ TEST RUN COMPLETE
**Template:** `WEEKLY_REVIEW_TEMPLATE.md`

---

## Section 1: PM2 Health

**Week of:** 2026-05-15 to 2026-05-22

**All services online as of 2026-05-22:**

| Service | Uptime | Restarts | Status |
|---------|--------|---------|--------|
| money-pipeline | 3D | 2 | ✅ Online |
| binance-bot | 43h | 6 | ⚠️ Errors |
| bakery | 2D | 1 | ✅ Online |
| cloudflare-tunnel | 41h | 0 | ✅ Online |
| node (port 8003) | 10h | 0 | ✅ Online |
| squarepayouts | 8h | 0 | ✅ Online |

**Notable events (May 15–22):**
- SquarePayouts: crash loop on May 15 (↺22 restarts) — auto-escalated, recovered same day
- binance-bot: 6 restarts total — ongoing DB errors (see below)
- Money Pipeline: 2 restarts — research pipeline broken since ~2026-04-07
- Bakery: 1 restart — EADDRINUSE port 3001 resolved

---

## Section 2: Log Errors

**New error patterns this week:**

**binance-bot:**
1. `SQLITE_ERROR: table trades has no column named current_sl` — trailing stop updates not persisted
2. `ReferenceError: Cannot access 'liveBal' before initialization` — TDZ error cascades after SQL error
3. `SyntaxError: Identifier 'openTrades' has already been declared` — duplicate `let openTrades` declaration at line 801
4. `[review-hook] Error for HYPEUSDT: rr.toFixed is not a function` — repeated 6x in recent logs

**Bakery:**
- `EADDRINUSE: address already in use :::3001` — PM2 restart conflict on May 15, resolved

**Recurring:**
- `[review-hook] E6 ESCALATION for HBARUSDT: tight_SL` — informational, not an error

---

## Section 3: Kanban Backlog

**Phase progress:**
- ✅ Phase 1 (Kanban + Foundation): DONE
- ✅ Phase 2 (Memory Automation): DONE
- ✅ Phase 3 (Self-Audit & Performance): DONE
- 🔄 Phase 4 (Weekly Review): TEST RUN DONE
- ⏳ Phase 5 (Deep Audit): Not started
- ⏳ Phase 8 (Money Pipeline rebuild): Not started (blocked by research pipeline)
- ⏳ Phase 10 (Binance Bot restoration): Not started (blocked by DB schema + code errors)

**Blocked:**
- t_e752ea85 (Binance US Intelligence): blocked — bot has errors, needs Phase 10 fix

---

## Section 4: Memory Quality Check

**Recent `[PERFORMANCE]` entries (Phase 3):**
- BinanceBot: SQLITE_ERROR + ReferenceError — Phase 10 will fix
- MoneyPipeline: research broken since ~2026-04-07 — Phase 8 will fix
- Bakery: EADDRINUSE port 3001 — resolved
- Hermes: PM2 health monitor extended to 5 services (was 3)
- Hermes: PM2 save confirmed after Phase 3 changes

**New patterns:**
- binance-bot shows TDZ error after SQL error cascades — error propagation chain is fragile
- Unknown ports 8102 (quickstats?) and 8003 (teamstandup?) still not confirmed

---

## Section 5: Project Status

### Money Pipeline
- **Status:** ⚠️ Degraded
- **Research pipeline:** Broken since ~2026-04-07
- **API:** Responding on 8020, KPis load (v2: 253, v1: 89)
- **Phase:** Phase 8 addresses rebuild

### Binance Bot
- **Status:** 🚨 Errors (online but broken)
- **Balance:** $128.05
- **Signal state:** no_signal (correct — errors prevent trading)
- **Errors:** SQLITE_ERROR + ReferenceError + SyntaxError
- **Phase:** Phase 10 addresses restoration

### SquarePayouts
- **Status:** ✅ Healthy
- **Uptime:** 8h, 0 restarts since last crash loop recovery
- **Phase:** Active revenue

### BakeryOps
- **Status:** ✅ Healthy
- **Uptime:** 2D, 1 restart (port conflict, resolved)
- **Phase:** Ops mode

### Cloudflare Tunnel
- **Status:** ✅ Healthy
- **Uptime:** 41h, 0 restarts

---

## Section 6: Risks & Blockers

| Risk | Severity | Status |
|------|----------|--------|
| BinanceBot not trading (DB errors) | HIGH | Phase 10 fix in pipeline |
| Money Pipeline research broken | MEDIUM | Phase 8 fix in pipeline |
| Unknown ports 8102/8003/9119 | LOW | Investigate in Phase 5 |
| PM2 unsynced after changes | MEDIUM | Fixed — pm2 save run |
| SquarePayouts crash loop history | MEDIUM | Stable for 8h — monitor |

---

## Section 7: Recommended Focus — Next Week

1. **[Hermes/ops] WR4-03:** Schedule Monday 8 AM weekly review via Hermes cron
2. **[Hermes/ops] WR4-05:** Confirm unknown ports 8102 and 8003 (Phase 5 T4 investigation)
3. **[Builder] Phase 8 prep:** Begin Money Pipeline research rebuild — blocked items identified
4. **[Builder] Phase 10 prep:** BinanceBot restoration — schema fix + SyntaxError fix + TDZ error fix
5. **[ops] Deep Audit prep:** Phase 5 T4 procedure — prepare service map, security review checklist
6. **[ops] PM2 health monitor:** Verify bakery and cloudflare-tunnel monitoring is stable after extension

---

## Output to Marcelo

```
📊 HERMES WEEKLY SYSTEMS REVIEW — 2026-05-22

✅ HEALTHY: bakery, squarepayouts, cloudflare-tunnel, money-pipeline (API), node (8003)
⚠️ DEGRADED: money-pipeline (research broken since ~2026-04-07)
🚨 NEEDS FIX: binance-bot (SQLITE_ERROR + SyntaxError + ReferenceError — not trading)
🔧 AUTO-FIXED: bakery EADDRINUSE (May 15), squarepayouts crash loop (May 15)

📁 FILES: PERFORMANCE_FINDINGS.md, SELF_AUDIT_CHECKLIST.md, WEEKLY_REVIEW_TEMPLATE.md
📁 LOCATION: ~/.hermes/knowledge/memory/

📋 PHASE STATUS:
  ✅ Phases 1-4 DONE (Kanban, Memory, Self-Audit, Weekly Review)
  ⏳ Phase 5: Deep Audit — next
  ⏳ Phase 8: Money Pipeline rebuild
  ⏳ Phase 10: Binance Bot restoration

🎯 NEXT WEEK PRIORITY:
  1. Schedule Monday 8 AM cron (WR4-03)
  2. Unknown ports investigation (Phase 5 T4)
  3. Phase 8/10 prep work
```

---

**Report generated:** 2026-05-22 by BossMan Phase 4 test run
**Next scheduled review:** Monday 2026-05-26 8 AM PDT (if cron scheduled)