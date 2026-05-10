# Exposure Caps and Position Sizing Rules

**Source:** PHASE2_PLANNING.md, Phase 1 audit, OPERATING_BLUEPRINT.md
**Status:** Active — capital risk rules

---

## Capital Risk Principles

1. **No autonomous trading decisions** — LBC35 cannot approve trading strategy changes without BossMan/Marcelo approval
2. **Exposure caps** — max position size defined per bot
3. **Profit targets** — Binance $3k/month, Kraken $1.5k/month
4. **Pre-trade review** — Binance bot has a pre-trade-hook (currently missing — Phase 6 issue)

---

## Exposure Rules

### Binance Bot (port 8104)

| Rule | Value | Source |
|------|-------|--------|
| Max position size | Not formally documented | Phase 2 planning |
| Pre-trade hook | Required | BLOCKER_RESOLUTIONS.md |
| Profit target | $3,000/month | Phase 2 planning |
| Current status | 🔴 STOPPED | Pre-trade-hook missing |

**Phase 6 Track B will restore the pre-trade-hook module.**

### Kraken Bot (port 8106)

| Rule | Value | Source |
|------|-------|--------|
| Max position size | Not formally documented | Phase 2 planning |
| Adjusted parameters | Yes | Phase 2 planning |
| Profit target | $1,500/month | Phase 2 planning |
| Current status | ⚠️ Needs verification | Not in SERVICES_MAP |

---

## Position Sizing Best Practices

1. **Never risk more than 2% of portfolio on a single trade**
2. **Diversify across at least 3 positions**
3. **Stop loss required** — no position without a defined exit
4. **Daily review** — check exposure at end of each trading day

---

## Phase 6 Capital Risk Review

Phase 6 should include:
1. Document formal max position sizes for both bots
2. Review current exposure against targets
3. Update parameters if market conditions changed
4. Verify Kraken bot is operating correctly (currently unverified)

---

## Alert Conditions

Alert Marcelo immediately if:
- Any single position exceeds 5% of portfolio
- Daily loss exceeds 3% of portfolio
- Bot restart count exceeds 10 in 24 hours
- Unusual trading activity (not aligned with normal strategy)

---

## Related Files

- `~/.hermes/knowledge/PHASE2_PLANNING.md` — Profit targets and capital rules
- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Binance bot pre-trade-hook analysis
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — System architecture including risk management