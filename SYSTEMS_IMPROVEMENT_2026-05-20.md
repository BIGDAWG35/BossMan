# Systems Improvement Report -- 2026-05-20

**Generated:** 2026-05-20 19:16:49  via Phase 12 Weekly Systems Improvement Loop
**Schedule:** Every Monday 08:00 AM local
**Trigger:** 8 project(s) with issues or improvement opportunities

---

## [BinanceBot] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better / nice-to-have:** Investigate root cause during next available cycle.

**Details:**
  - [WARNING] binance-bot has 6 restarts — possible instability (uptime: 0h 0m)
  - [UNKNOWN] [TRADING] Binance Bot is in LIVE mode — monitor closely
  - [UNKNOWN] [TRADING] Last trade log: unknown

---

## [BakeryOps] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better / nice-to-have:** Investigate root cause during next available cycle.

**Details:**
  - [WARNING] Port 8040 (BakeryOps) is not responding

---

## [Mission Control] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better / nice-to-have:** Investigate root cause during next available cycle.

**Details:**
  - [WARNING] Port 8100 (Mission Control) is not responding

---

## [Mission Control Alt] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better / nice-to-have:** Investigate root cause during next available cycle.

**Details:**
  - [WARNING] Port 8140 (Mission Control Alt) is not responding

---

## [Mission Control Primary] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better / nice-to-have:** Investigate root cause during next available cycle.

**Details:**
  - [WARNING] Port 8001 (Mission Control Primary) is not responding

---

## [MoneyPipeline] 🟢 IMPROVE

- **What we can address now:** Monitor -- no immediate action needed.
- **What needs Marcelo's approval:** None.
- **What could be better / nice-to-have:** Improvement opportunity for future sprint.

**Details:**
  - [IMPROVE] money-pipeline has 4 restarts — investigate pattern (uptime: 0h 0m)

---

## [Hermes] 🟢 IMPROVE

- **What we can address now:** Monitor -- no immediate action needed.
- **What needs Marcelo's approval:** None.
- **What could be better / nice-to-have:** Improvement opportunity for future sprint.

**Details:**
  - [OK] hermes-gateway active (PID 31271)
  - [IMPROVE] cua-driver sock exists but process not responding — may need restart

---

## [CryptoIntel] 🟢 IMPROVE

- **What we can address now:** Monitor -- no immediate action needed.
- **What needs Marcelo's approval:** None.
- **What could be better / nice-to-have:** Improvement opportunity for future sprint.

**Details:**
  - [IMPROVE] No Binance/Crypto cron entries found

---

## Raw Check Output

```
[PROJECT:BinanceBot][WARNING] binance-bot has 6 restarts — possible instability (uptime: 0h 0m)
[PROJECT:MoneyPipeline][IMPROVE] money-pipeline has 4 restarts — investigate pattern (uptime: 0h 0m)
[PROJECT:BakeryOps][WARNING] Port 8040 (BakeryOps) is not responding
[PROJECT:Mission Control][WARNING] Port 8100 (Mission Control) is not responding
[PROJECT:Mission Control Alt][WARNING] Port 8140 (Mission Control Alt) is not responding
[PROJECT:Mission Control Primary][WARNING] Port 8001 (Mission Control Primary) is not responding
[PROJECT:Hermes][OK] hermes-gateway active (PID 31271)
[PROJECT:Hermes][IMPROVE] cua-driver sock exists but process not responding — may need restart
[PROJECT:CryptoIntel][IMPROVE] No Binance/Crypto cron entries found
[PROJECT:BinanceBot][TRADING] Binance Bot is in LIVE mode — monitor closely
[PROJECT:BinanceBot][TRADING] Last trade log: unknown
```
