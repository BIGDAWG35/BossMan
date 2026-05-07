# Trading Ops — Non-Negotiable Trading Rules

> These rules are HARD LIMITS. No exceptions without explicit approval from Marcelo.
> Last updated: 2026-05-07
> Owner: trading (Hermes profile) — analysis only, no live money

---

## Risk Parameters

| Rule | Value | Notes |
|------|-------|-------|
| Risk per trade | 3% of capital | HARD LIMIT |
| Daily loss limit | 6% of capital | Pause trading if hit |
| Max open positions | 3 | HARD LIMIT |
| Minimum Reward:Risk | 2:1 (MIN_RR) | Must clear before entry |

---

## Position Rules

| Condition | Action |
|-----------|--------|
| Trailing stop +5% | Move to Break-even |
| Trailing stop +10% | Lock in +5% profit |
| Trailing stop +15% | Hard exit |
| News event | No trades without Marcelo approval |
| Major trend bearish | No entries against trend |

---

## Uptrend Confirmation (Required Before Every Entry)

```
1H EMA50 > EMA200  (bullish trend confirmed)
THEN
15m pullback entry (RSI 35–73)
AND
Bullish candle confirmation
= VALID ENTRY
```

---

## Pair Universe

> TODO: FILL IN — These are the trading pairs Hermes monitors. Update from current bot config.

### Binance — TODO (copy from bot config)
```
BTCUSDT, ETHUSDT, SOLUSDT, XRPUSDT, BNBUSDT,
ADAUSDT, DOTUSDT, LINKUSDT, AVAXUSDT, SUIUSDT,
HBARUSDT, NEARUSDT, VETUSDT, DOGEUSDT, LTCUSDT, ATOMUSDT
```

### Kraken — TODO (if applicable)
```
TODO: Add Kraken pairs if Kraken bot is active
```

### Other Exchanges — TODO
```
TODO: Add other exchange pairs as bot expands
```

---

## HBAR Safety Lock

> TODO: FILL IN — Document the HBAR lock logic and current status.

**Current HBAR lock status:** `[LOCKED / UNLOCKED — update this]`

**Lock reason:** `[Why is HBAR locked? E.g., "1 position open", "divergence detected", etc.]`

**Lock trigger:** `[What condition enables the lock? E.g., "duplicate entries beyond 1 position"]`

**Unlock condition:** `[What clears the HBAR lock? E.g., "position closed + manual review"]`

**Historical HBAR notes:**
- Last position: TODO (date, reason, P&L)
- Collateral amount: ~1,129 HBAR (verify current)

---

## Divergence Pause Rule

If divergence is detected on any holding → **pause new entries until reviewed by trading and approved by Marcelo.**

Divergence detection criteria:
- `[TODO: Define what counts as divergence — e.g., RSI hidden divergence on 1H, MACD histogram flip, etc.]`

---

## Review Cadence

| Check | Time | Owner |
|-------|------|-------|
| Morning health check | 9 AM PDT | ops (cron) |
| Evening health check | 9 PM PDT | ops (cron) |
| Weekly strategy review | Saturday 8 PM PDT | trading → bossman → Marcelo |

---

## Trading Bot API Endpoints

```
GET  http://localhost:8104/api/status   — Full bot status, balance, positions
GET  http://localhost:8104/api/health  — Health check
POST http://localhost:8104/api/review   — Submit trade for review
```

---

## Trading Profile Ownership

- **Owner:** trading (Hermes profile)
- **Does NOT touch live money** — analysis and recommendations only
- **Changes to bot config require explicit Marcelo approval**
- **Bossman routes all trading tasks to trading profile**

---

## What Needs Marcelo's Input

These items block Hermes from being fully operational for live trading:

- [ ] **Pair universe** — confirm which pairs are active
- [ ] **HBAR lock status** — current lock state and reason
- [ ] **Kraken bot status** — is Kraken trading active?
- [ ] **Current bot balance** — what capital is deployed?
- [ ] **Cycle target** — what is the current cycle goal?
- [ ] **Exchange API keys** — which exchanges are connected?

Fill in the `[TODO]` sections above to complete this doc.
