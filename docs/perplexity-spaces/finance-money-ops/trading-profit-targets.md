# Trading Profit Targets

**Source:** PHASE2_PLANNING.md, Phase 1 audit
**Status:** Active — Phase 2 set these targets

---

## Monthly Profit Targets

| Bot | Target | Status |
|-----|--------|--------|
| **Binance bot** | $3,000/month | 🔴 STOPPED — pre-trade-hook missing |
| **Kraken bot** | $1,500/month | ⚠️ Needs verification — not in SERVICES_MAP |

**Combined target:** $4,500/month from crypto trading

---

## Binance Bot (port 8104)

**Target:** $3,000/month

**Current state:** 🔴 STOPPED
- Missing pre-trade-hook module
- 32 PM2 restarts (critically unstable)
- Pre-trade review silently not happening

**Phase 6 Track B** (`t_faa6d371`) is the Binance bot fix — awaiting Marcelo approval.

---

## Kraken Bot (port 8106)

**Target:** $1,500/month

**Current state:** ⚠️ Needs verification
- Not listed in current SERVICES_MAP.md (updated 2026-05-07)
- May have been offline at time of Phase 1 audit
- "Adjusted parameters" noted in Phase 2 planning

**Action needed:** Verify current status with `pm2 list | grep kraken` and `curl localhost:8106`.

---

## Combined Revenue Target

| Source | Target |
|--------|--------|
| Binance trading | $3,000/month |
| Kraken trading | $1,500/month |
| **Total crypto** | **$4,500/month** |

This is separate from:
- Bakery revenue (home bakery business — port 3001)
- SquarePayouts (sports betting pool — port 8030, external reviewer: https://bigdawg-squares.loca.lt/squares)
- YouTube automation (port 8140)

---

## Phase 6 Review

Phase 6 should include a capital risk review that:
1. Verifies both bots are operating with correct parameters
2. Reviews profit targets against current market conditions
3. Updates exposure caps if needed
4. Documents any parameter changes

---

## Related Files

- `~/.hermes/knowledge/PHASE2_PLANNING.md` — Phase 2 planning with profit targets
- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Binance bot blocker analysis