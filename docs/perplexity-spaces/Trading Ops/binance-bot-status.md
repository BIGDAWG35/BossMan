# Trading Ops — Binance Bot Status

> Current live status of the Binance trading bot.
> Owner: trading (Hermes profile)
> Last updated: 2026-05-07

---

## Current State

| Field | Value | Notes |
|-------|-------|-------|
| Balance | TODO | Fill from `GET localhost:8104/api/status` |
| Cycle | TODO | E.g., "open_1" |
| Status | TODO | Live / paused / stopped |
| Target | TODO | E.g., $3,000 per cycle |
| Progress | TODO | E.g., 18.1% |
| Open positions | TODO | Count |
| Daily loss limit hit | TODO | true/false |
| Today's closed P&L | TODO | USDT |
| Consecutive losses | TODO | Count |

---

## Bot Config

| Parameter | Value |
|-----------|-------|
| MIN_RR | 2:1 |
| MAX_EXPOSURE | 80% (TODO: confirm) |
| Cycle | TODO |
| Risk per trade | 3% |
| Daily loss limit | 6% |
| Pairs | 16 (see trading-rules.md) |

---

## API Endpoints

```
GET  http://localhost:8104/api/status   — Full bot status, balance, positions
GET  http://localhost:8104/api/health  — Health check
POST http://localhost:8104/api/review  — Submit trade for review
```

---

## Status Response Shape

```json
{
  "cycle": 1,
  "status": "open_1",
  "balance": 543.80,
  "target": 3000,
  "progress": 18.1,
  "lastCheck": "2026-04-28T...",
  "open_count": 0,
  "dailyLimitHit": false,
  "todayClosedPnl": 0,
  "consecutiveLosses": 0
}
```

---

## Pair Universe (16 pairs)

```
BTCUSDT, ETHUSDT, SOLUSDT, XRPUSDT, BNBUSDT,
ADAUSDT, DOTUSDT, LINKUSDT, AVAXUSDT, SUIUSDT,
HBARUSDT, NEARUSDT, VETUSDT, DOGEUSDT, LTCUSDT, ATOMUSDT
```

---

## HBAR Safety Lock

**Current status:** `[LOCKED / UNLOCKED]`
**Lock reason:** `[Why is HBAR currently locked?]`
**Collateral amount:** ~1,129 HBAR (verify current)
**Lock trigger:** Duplicate entries beyond 1 position (bot code rule)

---

## Health Checks

| Check | Time | Output |
|-------|------|--------|
| Morning | 9 AM PDT | Telegram (ops cron) |
| Evening | 9 PM PDT | Telegram (ops cron) |

---

## Historical Notes

> TODO: Fill in from bot logs

- Previous position closes: TODO (date, pair, reason, P&L)
- Bot restart history: TODO restarts (last 30 days)
- Notable events: TODO

---

## How to Update This File

1. Run: `curl http://localhost:8104/api/status`
2. Copy the JSON output
3. Update the table above with current values
4. Note any changes in Historical Notes

**To check bot health:** `curl http://localhost:8104/api/health`
