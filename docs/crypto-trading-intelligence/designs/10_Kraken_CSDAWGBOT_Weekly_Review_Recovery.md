# Kraken + CSDAWGBOT Weekly Review Recovery

## Purpose
This document captures the full recovery of Kraken private API authentication and stabilization of the CSDAWGBOT Weekly Strategy Review workflow. The work was done to fix repeated "EAPI:Invalid key" errors, stabilize the Saturday weekly review cron, and lock in a standardized Telegram output format with baseline settings preserved.

## Original Issues
The original problems encountered during this recovery:

- **"EAPI:Invalid key" errors**: Repeated authentication failures when calling Kraken private API endpoints
- **Port 8899 path failing**: The Kraken server at port 8899 was returning invalid key errors while standalone tests worked
- **PM2 / env loading confusion**: Key environment variables were not consistently loaded across different execution paths
- **Auth implementation mismatch**: The server.js implementation used different signing logic than the verified working reference script
- **Workflow instability risk**: Without fixing this, the Saturday weekly review would fail or produce unreliable output

## Investigation Timeline
The debugging path in chronological order:

1. **Initial key failures**: Old API key rotations attempted — still failing
2. **New key rotation**: New keys generated but "EAPI:Invalid key" persisted
3. **.env.kraken setup**: Created dedicated env file `~/Projects/kraken-bot-new/.env.kraken`
4. **PM2 restart confusion**: PM2 services required restarts to pick up env changes
5. **Direct reference script**: Created `kraken-balance-reference-test.cjs` as a minimal known-good client
6. **Working standalone auth**: Reference script returned balance successfully — isolated issue to server path
7. **Shared auth module**: Created `lib/krakenAuth.cjs` as the verified shared implementation
8. **Weekly review bypass**: Updated weekly review to call krakenAuth directly instead of port 8899
9. **Port 8899 refactor**: Later refactored server.js to use the same shared krakenAuth module
10. **Format locking**: Standardized Telegram output with `weekly-review-template.cjs`

## Root Cause(s)
The honest assessment of what went wrong:

- The main issue was NOT the Kraken API or key validity
- The real issue was inconsistent auth implementation across different code paths
- Standalone reference script used the correct algorithm while server.js used different logic
- Weekly review became stable only after switching to verified shared auth
- Standard Telegram output format was not locked before this work
- There was no single source of truth for Kraken authentication

## Final Working Architecture
The final architecture after recovery:

### Data Sources
- **Binance**: port `8104` (`http://localhost:8104/api/status`)
- **Kraken**: shared module `~/Projects/kraken-bot-new/lib/krakenAuth.cjs` (used by both weekly review and port 8899)

### Scripts
| Script | Purpose |
|--------|---------|
| `~/Projects/kraken-bot-new/scripts/weekly-review.cjs` | Main weekly review data fetcher |
| `~/Projects/kraken-bot-new/scripts/weekly-review-template.cjs` | Telegram output formatter |
| `~/Projects/kraken-bot-new/scripts/weekly-review-test.cjs` | Test runner with both endpoints |
| `~/Projects/kraken-bot-new/scripts/kraken-balance-reference-test.cjs` | Standalone Kraken auth verification |
| `~/Projects/kraken-bot-new/scripts/kraken-weekly-data.cjs` | CLI helper for weekly data |

### Kraken Infrastructure
| File | Purpose |
|------|---------|
| `~/Projects/kraken-bot-new/lib/krakenAuth.cjs` | Shared auth module (verified working) |
| `~/Projects/kraken-bot-new/.env.kraken` | API keys (permissions 600) |
| `~/Projects/kraken-bot-new/server.js` | Port 8899 server |
| `~/Projects/kraken-bot-new/ecosystem.config.cjs` | PM2 ecosystem config |

### Cron Job
- **Name**: CSDAWGBOT-Weekly-Strategy-Review
- **Schedule**: `0 20 * * 6` (Saturdays 8 PM PDT)
- **Data sources**: Binance 8104 + Kraken krakenAuth

## Final Frozen Baseline
The currently approved baseline settings:

| Setting | Value |
|--------|-------|
| Binance balance | $204.49 |
| Kraken balance | $205.00 |
| Combined | $409.49 |
| RSI (Binance) | 40-65 |
| Risk per trade | 3% |
| Daily cap | 6% |
| Max positions | 3 |
| RSI 38-68 | Pending — NOT applied |
| Parameter changes | None allowed in output |

## DeepSeek / OpenAI Role Split
The finalized model responsibility split:

### DeepSeek (exchange-level analysis)
- Binance exchange-level analysis
- Kraken exchange-level analysis
- Exchange-level recommendation (KEEP/WATCH/ADJUST/ESCALATE)

### OpenAI (cross-exchange synthesis)
- Cross-exchange synthesis
- Final recommendation
- Next action wording

## Final Saturday Telegram Format
The weekly review now uses a locked standard Telegram format with fixed section order:

1. **SYSTEM STATUS** — Binance/Kraken/Telegram health, Review Mode
2. **BINANCE** — balance, status, exposure, PnL, DeepSeek View, Recommendation
3. **KRAKEN** — balance, status, orders, trades, DeepSeek View, Recommendation
4. **CROSS-EXCHANGE** — combined balance, alignment, risk posture, OpenAI Synthesis, Final Recommendation
5. **PARAMETERS** — RSI, Risk/Trade, Daily Cap, Max Positions, Changes
6. **ALERTS** — Up to 3 alert lines
7. **NEXT ACTION** — Single next action line

**Critical rule**: Output must NOT imply parameter changes that were not actually applied.

## Verification Commands
Practical commands to verify everything:

```bash
# Cron exists
openclaw cron list | grep CSDAWGBOT

# Cron run history
openclaw cron runs CSDAWGBOT-Weekly-Strategy-Review

# Run weekly review manually
cd ~/Projects/kraken-bot-new && node scripts/weekly-review.cjs

# Run weekly review test
cd ~/Projects/kraken-bot-new && node scripts/weekly-review-test.cjs

# Run Kraken reference auth test
cd ~/Projects/kraken-bot-new && node scripts/kraken-balance-reference-test.cjs

# Verify Kraken API server
curl -s http://localhost:8899/api/status
curl -s http://localhost:8899/api/orders
curl -s http://localhost:8899/api/trades

# Verify Binance status
curl -s http://localhost:8104/api/status
```

## Alert Conditions
Active alert triggers to monitor:

- Telegram delivery fails
- Kraken data fails (port 8899 or krakenAuth)
- Binance data path changes (port 8104)
- Weekly review output format breaks

## What Is Still Pending
Items intentionally left pending:

- **RSI 38-68 widening**: Remains pending — not applied to baseline
- **Strategy changes**: No changes should be made until after another review cycle unless something breaks
- **Infrastructure mode**: Now in observe/monitor mode, not tweak mode

## Lessons Learned
Key lessons from this recovery:

1. **Do not rotate keys endlessly** before isolating code-path differences
2. **Create a minimal known-good reference client** early in debugging
3. **Use one shared auth module** across all Kraken paths
4. **Freeze baseline** immediately after infrastructure repair
5. **Document runbooks** and final format right after stabilization
6. **Lock Telegram output** so it cannot imply unapproved changes

## Change Log
| Date | Change |
|------|--------|
| 2026-04-08 | Created kraken-balance-reference-test.cjs as verified reference |
| 2026-04-08 | Created lib/krakenAuth.cjs as shared auth module |
| 2026-04-08 | Updated weekly-review.cjs to use direct krakenAuth |
| 2026-04-08 | Refactored port 8899 server.js to use krakenAuth.cjs |
| 2026-04-08 | Created weekly-review-template.cjs with locked Telegram format |
| 2026-04-08 | Frozen baseline: RSI 40-65, 3% risk, 6% daily cap, 3 positions |
| 2026-04-08 | Locked Telegram output (no implied parameter changes) |
| 2026-04-09 | Binance auto-proposal kill-switch: AUTO_PROPOSAL_ENABLED = false |

---

*Document created: 2026-04-08*
*Last updated: 2026-04-09*