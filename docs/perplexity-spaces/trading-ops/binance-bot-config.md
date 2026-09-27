# LEARNED_BINANCE_BOT.md
**Last updated:** 2026-08-25
**Safe-start architecture:** t_binance_bot_safe_start_implementation_v1_20260824
**Migration:** t_binance_bot_legacy_to_safe_start_migration_v1_20260824

---

## Architecture Overview

binance-bot runs in one of four modes, controlled by `BOT_STARTUP_MODE`:

| Mode | Purpose | Exchange keys | Trading loop | PM2 managed |
|------|---------|--------------|--------------|-------------|
| `validate-only` | Config/schema/DB validation | NONE | NOT LOADED | One-shot CLI |
| `health-only` | Local health checks | NONE | NOT LOADED | One-shot CLI |
| `paper` | Isolated paper trading | NONE | NOT LOADED | One-shot CLI |
| `live` | Live trading | BINANCEUS KEY + SECRET | LOADS | YES — `binance-bot-live` |

**Critical rule:** Only `binance-bot-live` receives exchange credentials. validate/health/paper receive model keys only.

---

## PM2 Process Names

| Process | Purpose | Autostart | Managed by |
|---------|---------|-----------|-----------|
| `binance-bot-live` | Live trading | **NO** | PM2 |
| *(validate/health/paper)* | One-shot checks | N/A | Direct `node` call |

**Legacy name `binance-bot` is RETIRED. Do NOT use.**

---

## Safe-Start Commands

### Run a check (one-shot, no trading)

```bash
# validate-only — config, DB, schema, risk limits
BOT_STARTUP_MODE=validate-only \
  DEEPSEEK_API_KEY=<key> OPENAI_API_KEY=<key> \
  PAPER_MODE=false LIVE_PILOT_MAX_NOTIONAL=75 \
  node /Users/bigdawg/Projects/binance-bot/pre-start.js

# health-only — local health checks, no exchange
BOT_STARTUP_MODE=health-only \
  DEEPSEEK_API_KEY=<key> OPENAI_API_KEY=<key> \
  PAPER_MODE=false LIVE_PILOT_MAX_NOTIONAL=75 \
  node /Users/bigdawg/Projects/binance-bot/pre-start.js

# paper — isolated simulation
BOT_STARTUP_MODE=paper \
  DEEPSEEK_API_KEY=<key> OPENAI_API_KEY=<key> \
  PAPER_MODE=false LIVE_PILOT_MAX_NOTIONAL=75 \
  node /Users/bigdawg/Projects/binance-bot/pre-start.js
```

### Start live (requires Marcelo written approval)

```bash
pm2 start /Users/bigdawg/Projects/binance-bot/ecosystem.config.cjs --only binance-bot-live
```

### Stop live

```bash
pm2 stop binance-bot-live
```

### Replace live process

```bash
pm2 delete binance-bot-live && pm2 start /Users/bigdawg/Projects/binance-bot/ecosystem.config.cjs --only binance-bot-live
```

---

## Live Start Prerequisites (ALL must be true)

```
1. binance-bot-validate PASS → "pre-flight complete"
2. binance-bot-health PASS   → "health-only is complete"
3. 0 open positions           → DB: SELECT * FROM trades WHERE status != 'closed'
4. 0 open orders             → signal journal = 0
5. Auto-recovery = GO        → auto-recovery.js check returns action=GO
6. Regression suite 28/28    → ~/.hermes/logs/regression_test_results.json
7. Marcelo approval record    → ~/.hermes/knowledge/approvals/binance-live-approval-YYYYMMDD.md
```

### Approval record format

```markdown
# Binance Live Trading Approval
**Date:** YYYY-MM-DD
**Approved by:** Marcelo
**Expiry:** 24h from approval
```

---

## 7-Signal LIVE Gate

pre-start.js enforces all 7 signals before server.js loads:

1. `BOT_STARTUP_MODE=live`
2. `LIVE_TRADING_ACK` present and ≥ 8 characters
3. Approval record exists at `~/.hermes/knowledge/approvals/binance-live-approval-*.md`
4. Approval record fresh (< 24h)
5. Auto-recovery `action === 'GO'`
6. `LIVE_PILOT_MAX_NOTIONAL >= 75`
7. `PAPER_MODE === 'false'`

Any failure → `process.exit(1)` → no trading loop.

---

## Key Files

| File | Purpose |
|------|---------|
| `pre-start.js` | PM2 pre-flight wrapper — 4-mode dispatcher, credential gates, LIVE 7-signal gate |
| `ecosystem.config.cjs` | PM2 config — only `binance-bot-live` defined |
| `entrypoint.js` | (legacy) Mode dispatcher — superseded by pre-start.js routing |
| `safe-start.js` | 18-step config/health validator |
| `auto-recovery.js` | Restart budget enforcement |
| `server.js` | Trading loop — only loaded in live mode |

---

## What NOT to do

- **NEVER** run `pm2 start binance-bot` — legacy name, retired
- **NEVER** `pm2 start ecosystem.config.cjs` (generic) — starts all instances, live not autostarted but validate/health would run
- **NEVER** start live without Marcelo's written approval record
- **NEVER** run health checks that make live Binance API calls from non-approved contexts
- **NEVER** use ANTHROPIC_API_KEY, ATTOM_API_KEY, or REPLICATE_API_TOKEN with binance-bot

---

## Credentials

| Key | Used by | Mode |
|-----|---------|------|
| DEEPSEEK_API_KEY | All modes | Signal generation |
| OPENAI_API_KEY | All modes | Signal generation |
| BINANCEUS_API_KEY | binance-bot-live ONLY | Live trading |
| BINANCEUS_API_SECRET | binance-bot-live ONLY | Live trading |

---

## Incident Records

- `t_binance_bot_safe_start_design_v1_20260824` — architecture design
- `t_binance_bot_safe_start_implementation_v1_20260824` — implementation
- `t_binance_bot_legacy_to_safe_start_migration_v1_20260824` — migration
- `t_binance_bot_restart_preflight_v1_20260824` — restart preflight

---

## Rollback

```bash
# Restore from backup
cp ~/.hermes/backups/binance-safe-start-20260825/20260824_202633/pre-start.js \
   /Users/bigdawg/Projects/binance-bot/pre-start.js
cp ~/.hermes/backups/binance-safe-start-20260825/20260824_202633/ecosystem.config.cjs \
   /Users/bigdawg/Projects/binance-bot/ecosystem.config.cjs

# Stop new and restart legacy (if legacy backup is valid)
pm2 delete binance-bot-live
pm2 start /Users/bigdawg/Projects/binance-bot/ecosystem.config.cjs
```
