# Trading Ops — System Overview

> Marcelo's trading operations hub — Binance bot, portfolio tracking, and market analysis.
> Last updated: 2026-05-07

---

## Overview

Trading Ops is where all crypto and stock trading activity lives. This Space handles:

- **Strategy** — rules, parameters, pair universe, entry/exit logic
- **Bot health** — service status, health checks, cron monitoring
- **Portfolio** — holdings, performance, P&L tracking
- **Signals** — market research, opportunity alerts

**Important:** Hermes's `trading` profile owns analysis and recommendations. No trades are executed without Marcelo's explicit approval.

---

## Service Architecture

```
Trading Bot (8104)
├── Binance Bot — trading engine
│   ├── Balance: TODO (fill from bot status)
│   ├── Cycle: TODO
│   └── Pairs: 16 pairs (see trading-rules.md)
├── Crypto Tracker (8020) — portfolio tracking
│   └── Holdings: TODO
└── Health checks via ops profile
```

## Dashboards

| Dashboard | Port | Direct | Hub Route |
|-----------|------|--------|-----------|
| Binance Bot | 8104 | localhost:8104 | /8104 |
| Crypto Tracker | 8020 | localhost:8020 | — |
| Trading Control | TODO | localhost:8130 | /trading |
| Trading Review | TODO | localhost:8132 | /8132 |

---

## Current State

| Item | Value | Status |
|------|-------|--------|
| Bot status | TODO | Fill from binance-bot-status.md |
| Current cycle | TODO | TODO |
| Cycle target | TODO | TODO |
| Balance | TODO | TODO |
| Open positions | TODO | TODO |
| Today's P&L | TODO | TODO |
| Daily loss limit hit | TODO | TODO |
| Consecutive losses | TODO | TODO |

---

## Health Check Schedule

| Check | Time | Channel |
|-------|------|---------|
| Morning health | 9 AM PDT | Telegram (ops cron) |
| Evening health | 9 PM PDT | Telegram (ops cron) |
| Weekly strategy | Saturday 8 PM PDT | Telegram (trading → bossman) |

---

## Alert Types

The bot monitors for:
- Service down
- High restart counts
- Trading signals
- P&L events (win/loss thresholds)
- Daily loss limit approaching

---

## Related Files

- `trading-rules.md` — risk parameters, position rules, pair universe
- `binance-bot-status.md` — current bot config, balance, API status
