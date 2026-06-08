# 🛠️ Systems Improvement Report — 2026-06-08

**Generated:** 2026-06-08 08:00:55 
**Schedule:** Every Monday 08:00 AM local
**Projects with issues:** 5

---

## 🔴 CRITICAL SquarePayouts

| | |
|--|--|
| **Action** | 🔴 Immediate investigation — service down or degraded |
| **Escalate?** | YES — escalate to Marcelo |

**Findings:**

- 🔴 squarepayouts NOT FOUND in PM2 — service is down
- 🔴 Port 8030 (SquarePayouts) is not responding

---

## 🔴 CRITICAL BakeryOps

| | |
|--|--|
| **Action** | 🔴 Immediate investigation — service down or degraded |
| **Escalate?** | YES — escalate to Marcelo |

**Findings:**

- 🔴 bakery NOT FOUND in PM2 — service is down
- 🔴 Port 8040 (BakeryOps) is not responding

---

## 🔴 CRITICAL CloudflareTunnel

| | |
|--|--|
| **Action** | 🔴 Immediate investigation — service down or degraded |
| **Escalate?** | YES — escalate to Marcelo |

**Findings:**

- 🔴 cloudflare-tunnel NOT FOUND in PM2 — service is down

---

## ✅ OK Hermes

| | |
|--|--|
| **Action** | 🟢 Monitor — no immediate action needed |
| **Escalate?** | None |

**Findings:**

- 🟢 hermes-gateway active (PID 1679

---

## ✅ OK CryptoIntel

| | |
|--|--|
| **Action** | 🟢 Monitor — no immediate action needed |
| **Escalate?** | None |

**Findings:**

- 🟢 CSDAWG 2.0 active (intelligence.json age: 6d)

---

## Raw Output

```
[PROJECT:SquarePayouts][CRITICAL] squarepayouts NOT FOUND in PM2 — service is down
[PROJECT:BakeryOps][CRITICAL] bakery NOT FOUND in PM2 — service is down
[PROJECT:CloudflareTunnel][CRITICAL] cloudflare-tunnel NOT FOUND in PM2 — service is down
[PROJECT:SquarePayouts][WARNING] Port 8030 (SquarePayouts) is not responding
[PROJECT:BakeryOps][WARNING] Port 8040 (BakeryOps) is not responding
[PROJECT:Hermes][OK] hermes-gateway active (PID 1679
-)
[PROJECT:CryptoIntel][OK] CSDAWG 2.0 active (intelligence.json age: 6d)
```
