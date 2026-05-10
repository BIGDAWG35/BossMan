# Kraken Bot Configuration

**Source:** Phase 1 audit, SERVICES_MAP.md, Phase 2 planning
**Status:** ⚠️ Needs verification — adjusted parameters in Phase 2

---

## Known Configuration

| Attribute | Value | Source |
|-----------|-------|--------|
| Port | 8106 | Phase 1 audit |
| PM2 Name | `kraken-bot` (implied) | Not listed in SERVICES_MAP.md |
| Strategy | Adjusted parameters | Phase 2 planning |
| Profit Target | $1,500/month | Phase 2 planning |

---

## Status

The Kraken bot is not listed in the current SERVICES_MAP.md (which was updated 2026-05-07). This may mean:
1. It was not running at the time of the Phase 1 audit
2. It was running under a different PM2 name
3. It was not included in the port scan

**Action needed:** Verify current status with `pm2 list` and confirm port 8106 is responding.

---

## Quick Status Check

```bash
# Check if Kraken bot process is running
pm2 list | grep -i kraken

# Check port 8106
curl -s localhost:8106 | head -10

# Check Kraken bot logs
tail -10 ~/.pm2/logs/*kraken* 2>/dev/null || echo "No Kraken log files found"
```

---

## Profit Target

| Bot | Target |
|-----|--------|
| Binance bot | $3,000/month |
| Kraken bot | $1,500/month |

These targets were set in Phase 2 planning and should be reviewed as part of Phase 6 capital risk review.

---

## Related Files

- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
- `~/.hermes/knowledge/PHASE2_PLANNING.md` — Phase 2 planning with profit targets
