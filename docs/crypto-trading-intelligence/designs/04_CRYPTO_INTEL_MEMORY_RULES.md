# CRYPTO_INTEL_MEMORY_RULES.md — Memory & Tagging Rules for Crypto Intelligence
**Date:** 2026-05-22 | **Phase:** Phase 9 | **Tags:** [TRADING] [MEMORY] [PROJECT:CryptoIntel]
**Status:** ✅ DRAFT — Phase 9 Design Only

---

## Overview

Crypto Intelligence entries in Hermes memory follow the same 4-tier storage hierarchy as all other projects, with additional rules specific to trading intelligence:
- Speculative content MUST be marked [NEEDS VERIFICATION]
- Intelligence is INTELLIGENCE ONLY — no execution logic saved
- Separation by project tag (CryptoIntel / MoneyPipeline / BinanceBot)

---

## Tag Schema for Crypto Intelligence

### Primary Project Tags (one or more required)

| Tag | Use When |
|-----|----------|
| [PROJECT:CryptoIntel] | Any crypto intelligence entry |
| [PROJECT:MoneyPipeline] | Money Pipeline specific entry |
| [PROJECT:BinanceBot] | Binance Bot specific entry |

### Primary Category Tags

| Tag | Use When |
|-----|----------|
| [TRADING] | Trading intelligence, market analysis, coin rankings |
| [REGIME] | Market regime classification (BULL/BEAR/MID_CYCLE/EXTREME) |
| [NARRATIVE] | Narrative or social intelligence |
| [SIGNAL] | Coin band assignment, regime change, sector rotation signal |
| [MEMORY] | Memory system rules and policies |

### Secondary Tags (optional, combine with primary)

| Tag | Use When |
|-----|----------|
| [ARCHITECTURE] | System design, integration design, schema specs |
| [WORKFLOW] | Process, cron schedules, report generation |
| [SECURITY] | Risk flags, volatility alerts, safety rules |
| [PERFORMANCE] | System health, uptime, service monitoring |
| [DECISION] | Major decision made with rationale |
| [PROJECT:BinanceBot] | Binance Bot specific |
| [PROJECT:MoneyPipeline] | Money Pipeline specific |
| [PROJECT:CryptoIntel] | Crypto Intel specific |

### Confidence Tags (append to any entry)

| Tag | Use When |
|-----|----------|
| [HIGH_CONFIDENCE] | 3+ indicators agree, cross-checked |
| [MEDIUM_CONFIDENCE] | 2 indicators agree |
| [LOW_CONFIDENCE] | Mixed signals, regime uncertain |
| [NEEDS VERIFICATION] | Speculative, unconfirmed, single source |

---

## When to Save Memory — Intelligence Triggers

### Regime Changes
- **Save when:** Regime switches BULL ↔ BEAR ↔ MID_CYCLE ↔ EXTREME
- **Format:**
  ```
  ### [REGIME] [TRADING] [PROJECT:CryptoIntel]
  **Regime Change:** [OLD_REGIME] → [NEW_REGIME]
  **Date:** YYYY-MM-DD
  **Confidence:** X.X / 1.0
  **Indicators:** [list of indicators that changed]
  **Key drivers:** [2-3 sentence explanation]
  **Affected:** [coins/sectors/strategies affected]
  ```

### Coin Band Changes
- **Save when:** A coin moves between bands (HOT ↔ WARM ↔ WATCH ↔ COLD)
- **Format:**
  ```
  ### [SIGNAL] [TRADING] [PROJECT:CryptoIntel]
  **Band Change:** [SYMBOL] [OLD_BAND] → [NEW_BAND]
  **Date:** YYYY-MM-DD
  **Trigger:** [what caused the move]
  **Band Score:** [OLD_SCORE] → [NEW_SCORE]
  **Binance Bot Impact:** ALLOWED / BLOCKED / IGNORED
  ```

### Sector Rotation Signals
- **Save when:** A sector moves between LEADING / NEUTRAL / LAGGING
- **Format:**
  ```
  ### [SIGNAL] [TRADING] [PROJECT:CryptoIntel]
  **Sector Rotation:** [SECTOR_NAME] [OLD_SIGNAL] → [NEW_SIGNAL]
  **Date:** YYYY-MM-DD
  **7d Return:** [X]% vs BTC [Y]%
  **Coins affected:** [list]
  **Money Pipeline Impact:** [which opportunities are more/less relevant]
  ```

### Narrative Detection
- **Save when:** A new narrative cluster is identified (e.g., "L2 summer", "AI coin frenzy", "DeFi revival")
- **Format:**
  ```
  ### [NARRATIVE] [TRADING] [PROJECT:CryptoIntel] [NEEDS VERIFICATION]
  **New Narrative:** [NARRATIVE_NAME]
  **First Detected:** YYYY-MM-DD
  **Evidence:** [headlines, social volume, price action — 2-3 items]
  **Coins affected:** [list]
  **Duration estimate:** [SPECULATIVE — needs verification]
  **Reliability:** SPECULATIVE / LIKELY / CONFIRMED
  ```

### Volatility Regime Changes
- **Save when:** Volatility regime changes (LOW ↔ NORMAL ↔ HIGH ↔ EXTREME)
- **Format:**
  ```
  ### [SECURITY] [TRADING] [PROJECT:CryptoIntel]
  **Volatility Regime Change:** [OLD] → [NEW]
  **BTC 20d Vol:** [X]%
  **Binance Bot Action:** [BLOCK ALL / TIGHTER FILTERS / NORMAL]
  **Date:** YYYY-MM-DD
  ```

### Pre-Binance Scout Findings
- **Save when:** A coin is identified as likely to list on Binance US
- **Format:**
  ```
  ### [NARRATIVE] [TRADING] [PROJECT:CryptoIntel] [NEEDS VERIFICATION]
  **Pre-Binance Scout:** [COIN_NAME] ([TICKER])
  **CoinGecko Rank:** [#]
  **Social Volume 7d:** [+/- X%]
  **Current Exchange:** [exchange]
  **Listing Probability:** HIGH / MEDIUM / LOW
  **Estimated Timeline:** [SPECULATIVE]
  **Note:** Research only — no insider information. Public data only.
  ```

### Weekly Intelligence Summaries
- **Save when:** Weekly report is generated (Monday)
- **Format:**
  ```
  ### [REGIME] [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
  **Weekly Intel Summary:** Week of YYYY-MM-DD
  **Regime:** [REGIME] (confidence: X.X)
  **Hot Coins:** [list]
  **Leading Sector:** [SECTOR]
  **Risk Flags:** [list or "none"]
  **Report file:** CRYPTO_INTEL_YYYY-MM-DD.md
  ```

---

## When NOT to Save Memory — Intelligence Exclusion Rules

### Do NOT Save
1. **Single-source hype** — a coin going up 30% in 24h on social media buzz alone is NOT intelligence, it is speculation. Do not save without corroboration.
2. **Unverified listing claims** — any "coin X is listing on Binance US" that cannot be confirmed via public announcements. Mark [NEEDS VERIFICATION] or do not save.
3. **Regime calls with confidence < 0.5** — do not save as a firm regime call. Note it as [LOW_CONFIDENCE] or [NEEDS VERIFICATION] with a question.
4. **Coin predictions** — "X will hit $Y" is not intelligence, it is speculation. Do not save as fact.
5. **Trading strategy changes** — these belong in Binance Bot memory, not Crypto Intel. Use [PROJECT:BinanceBot].
6. **Execution results** — P&L data belongs in Binance Bot signal_journal, not in intelligence memory.
7. **Data that will be stale within 7 days** — daily price moves, short-term volume spikes without narrative context.

---

## 4-Tier Storage for Crypto Intelligence

### Tier 1: Hermes Memory Tool (Immediate)
- Regime change alerts
- Coin band change alerts
- High-priority risk flags
- Maximum ~100 words per entry

### Tier 2: Internal Knowledge Docs
- `MEMORY_CAPTURE_LOG.md` — crypto intel entries with [TRADING] [PROJECT:CryptoIntel] tags
- `CRYPTO_INTEL_ENGINE_SPEC.md` — engine thresholds and methodology
- `CRYPTO_INTEL_WEEKLY_*.md` — weekly report archives
- Maximum ~500 words per entry

### Tier 3: Obsidian
- `~/Desktop/CLAW-Backup/CRYPTO_INTEL_ENGINE_SPEC.md`
- `~/Desktop/CLAW-Backup/CRYPTO_INTEL_WEEKLY_YYYY-MM-DD.md`
- `~/Desktop/CLAW-Backup/CRYPTO_INTEL_INTEGRATION_PLAN.md`
- `~/Desktop/CLAW-Backup/CRYPTO_INTEL_MEMORY_RULES.md`

### Tier 4: GitHub
- `~/Projects/BossMan/hermes/knowledge/CRYPTO_INTEL_ENGINE_SPEC.md`
- `~/Projects/BossMan/hermes/knowledge/CRYPTO_INTEL_WEEKLY_YYYY-MM-DD.md`
- `~/Projects/BossMan/hermes/knowledge/CRYPTO_INTEL_INTEGRATION_PLAN.md`
- `~/Projects/BossMan/hermes/knowledge/CRYPTO_INTEL_MEMORY_RULES.md`

---

## Separation by Project

### CryptoIntel Memory
- Regime classifications
- Coin band assignments
- Sector rotation
- Narrative tracking
- Pre-Binance scouting
- Weekly reports
**Never contains:** trading execution, position sizes, P&L

### MoneyPipeline Memory
- Opportunity scoring and enrichment
- Stage progression
- Revenue tracking
- KPI summaries
**Never contains:** regime classifications (references CryptoIntel instead)

### BinanceBot Memory
- Trade execution (PAPER/LIVE mode)
- Signal journal entries
- Pre-trade hook validations
- Position management
- Safety layer triggers
**References CryptoIntel for:** regime context, band filters, risk flags (does not store these itself)

---

## Example Memory Entries

### Example 1: Regime Change
```
### [REGIME] [TRADING] [PROJECT:CryptoIntel] [HIGH_CONFIDENCE]
**Regime Change:** MID_CYCLE → BULL
**Date:** 2026-05-22
**Confidence:** 0.82 / 1.0
**Indicators:** BTC above 200d SMA ✅, drawdown from ATH 12% ✅, 90d momentum +28% ✅
**Key drivers:** BTC held $100K support after ETF inflows resumed. Volume picking up. Altcoins starting to move.
**Affected:** L1 coins (SOL, AVAX) now eligible for HOT band. Binance Bot: ACTIVE mode.
```

### Example 2: Narrative Detection (Speculative)
```
### [NARRATIVE] [TRADING] [PROJECT:CryptoIntel] [NEEDS VERIFICATION]
**New Narrative:** "L2 Summer" — ETH L2 tokens rallying
**First Detected:** 2026-05-22
**Evidence:** ARB +23% this week, OP +18%, MATIC +12%. ETH gas fees rising. Twitter mentions increasing.
**Coins affected:** ARB, OP, MATIC, BASE
**Duration estimate:** SPECULATIVE — 2-4 weeks if sustained. Could be rotation or start of altseason.
**Reliability:** NEEDS VERIFICATION — single-week price action insufficient.
```

### Example 3: Coin Band Promotion
```
### [SIGNAL] [TRADING] [PROJECT:CryptoIntel]
**Band Change:** SOLUSDT WATCH → HOT
**Date:** 2026-05-22
**Trigger:** Price 7d +14%, social volume up 340%, BTC bull regime confirmed
**Band Score:** 0.45 → 0.88
**Binance Bot Impact:** ALLOWED — SOL now eligible for signal execution
```

### Example 4: Weekly Intel Summary
```
### [REGIME] [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
**Weekly Intel Summary:** Week of 2026-05-19
**Regime:** BULL (confidence: 0.82)
**Hot Coins:** SOL, DOGE, PEPE
**Leading Sector:** Memecoins (7d +22% vs BTC +8%)
**Risk Flags:** PUMP_AND_DUMP_RISK (DOGE social volume elevated), MARKET_CHOPPY (BTC 7d range 8.3%)
**Report file:** CRYPTO_INTEL_2026-05-19.md
```

---

## Memory Policy Integration

This document extends MEMORY_POLICY.md with crypto-specific rules:

**Added to MEMORY_POLICY.md Section: "When to Save Memory"**
- Regime change → save immediately with [REGIME] tag
- Coin band change → save immediately with [SIGNAL] tag
- Narrative detection → save with [NEEDS VERIFICATION] if unconfirmed
- Weekly summary → save at end of each week

**Added to MEMORY_POLICY.md Section: "When NOT to Save Memory"**
- Single-source hype (speculation, not intelligence)
- Unverified listing claims
- Regime calls with confidence < 0.5
- Coin price predictions

**No changes to:**
- 4-tier storage hierarchy
- Tag schema (adding crypto-specific triggers only)
- Safety rules

---

**Tags:** [TRADING] [MEMORY] [PROJECT:CryptoIntel] [PROJECT:MoneyPipeline] [PROJECT:BinanceBot]