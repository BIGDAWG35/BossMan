# Crypto / Trading Knowledge Base Audit

**Date:** 2026-06-13
**Owner:** Marcelo
**Auditor:** BossMan Hermes
**Scope:** All past attempts to build a crypto / trading learning system and database
**Card:** `t_6cd5ed96` (MoneyPipeline project — false-positive match by intake gate; this is actually a Trading/Crypto audit, not MoneyPipeline work)

---

## TL;DR — One-paragraph summary

There are **two parallel crypto knowledge systems** that have been built over the last ~12 weeks, plus **seven live operational trading repos** (5 production, 2 orphaned), and a **third partial system** in OpenClaw/legacy workspace that's been frozen since April 2026. The two systems are:

1. **CSDAWG 2.0 Crypto Intelligence** — a **structured, live, weekly-cadence** intelligence engine that is **currently generating reports** (latest: 2026-06-08) and being read by the live Binance bot via `INTEL_GATE`. This is the **canonical, integrated, working** crypto knowledge system. It lives at `~/.hermes/knowledge/crypto-intel/` and powers the live `csdawg-dashboard` on port 8150.

2. **CLAW-Backup vault** — a **larger but stale** knowledge base in `~/Desktop/CLAW-Backup/` containing the original CSDAWG 2.0 design docs, question bank, review cycle, weekly template, journal, and a "Crypto Intelligence" sub-vault. It is **orphaned** — not referenced by any live system, not on the BossMan repo, and predates the live engine (last touched 2026-05-20).

3. **OpenClaw legacy** — frozen since 2026-04-28 (`.openclaw/memory/csdawg.sqlite`, `~/.claude/projects/-Users-bigdawg-Projects-crypto-portfolio/`). Has the earliest JSONL session logs from crypto work but is effectively dead.

**Recommendation:** the live CSDAWG 2.0 engine is the system to keep and grow. The CLAW-Backup vault has design material that's been **superseded** by the live implementation but still has unique content (the question bank, the journal, the review cycle). **Revive + integrate** the unique content from CLAW-Backup into the Hermes knowledge canon; **ignore** the OpenClaw legacy; **archive** the orphaned repos.

---

## GitHub status

### Repos

| Repo | Path | Git? | Branch | Last commit | Last touched | Status | Recommendation |
|---|---|---|---|---|---|---|---|
| **BossMan (canon)** | `~/Repos/BossMan` | ✅ | `main` | `a08989f` 2026-06-13 | 2026-06-13 | Live, synced to origin `BIGDAWG35/BossMan.git` | **Keep** |
| **binance-bot** | `~/Projects/binance-bot` | ✅ | `main` | `47fead1` 2026-05-30 | 2026-06-13 (uncommitted `debug_api.js`, `test_inline.js`) | **PAPER mode, online, INTEL_GATE wired** | **Keep** (active) |
| **money-making-dashboard** | `~/Projects/money-making-dashboard` | ✅ | `main` | `f9df33d` 2026-06-13 | 2026-06-13 | Active, remote `BIGDAWG35/MoneyMakingPipeline.git` | **Keep** (trading content is minor) |
| **master-dashboard** | `~/Projects/master-dashboard` | ✅ | `main` | `462e417` 2026-04-15 | 2026-06-01 | Stale uncommitted changes | **Keep** (multi-dashboard hub, not crypto-specific) |
| **csdawg-dashboard** | `~/Projects/csdawg-dashboard` | ❌ | — | n/a | 2026-06-03 (files) | **NO GIT**, but server live on 8150 | **Revive + integrate** (add git + commit) |
| **trading-control** | `~/Projects/trading-control` | ❌ | — | n/a | 2026-06-03 (files) | **NO GIT**, but PM2 online | **Revive + integrate** (add git + commit) |
| **coinbase-bot** | `~/Projects/coinbase-bot` | ❌ | — | n/a | 2026-03-30 (code frozen) | Stale code, no `.env`, no PM2 | **Archive** |
| **trading-review** | `~/Projects/trading-review` | ❌ | — | n/a | 2026-05-20 (pre-trade-hook.js) | Single-file library used by binance-bot | **Keep** as library, archive folder |
| **provider-monitor** | `~/Projects/provider-monitor` | ❌ | — | n/a | 2026-04-21 | Tracks DeepSeek/OpenAI cost; not trading | **Keep** (separate concern) |
| **provider-balance-dashboard** | `~/Projects/provider-balance-dashboard` | ❌ | — | n/a | 2026-05-20 | Single 7.5KB `server.js`; unclear purpose | **Archive** (duplicate of provider-monitor) |
| **fresh-dashboard** | `~/Projects/fresh-dashboard` | ❌ | — | n/a | 2026-04-24 | Empty app dir, three 0-byte dbs | **Archive** |

### BossMan repo trading/crypto content

| File | Size | Status |
|---|---|---|
| `memory-trading-intelligence.md` | 65 lines | ✅ Synced, reflects Phase 11B LIVE go-live (2026-05-21/22) |
| `docs/perplexity-spaces/trading-ops/` | 5 files (15 KB) | ✅ Synced, last touched 2026-05-27 |
| `docs/perplexity-spaces/finance-money-ops/trading-profit-targets.md` | present | ✅ Synced |
| `docs/perplexity-spaces/Trading Strategy & Portfolio/SETUP.md` | 1.4 KB | ✅ Synced |
| `docs/perplexity-spaces/Trading Ops/SETUP.md` | 1.4 KB | ✅ Synced |
| `hermes/crypto-intel/crypto-intel-weekly.js` | present | ✅ Synced (the weekly cron job) |
| `hermes/profiles/trading/` | present | ✅ Synced (profile config) |

**BossMan repo HAS the live crypto intelligence engine code**, but it does NOT have:
- The `csdawg-dashboard/` server code (no git)
- The `trading-control/` server code (no git)
- The `binance-bot/` server code (in its own repo, not in BossMan)
- The CLAW-Backup design docs (CSDAWG_QUESTION_BANK.md, CRYPTO_INTEL_ENGINE_SPEC.md, etc.)

---

## Obsidian status

| Location | Path | Last modified | Content | Status |
|---|---|---|---|---|
| `Trading Strategy & Portfolio` | `~/Obsidian/Hermes/60_Knowledge-Topics/perplexity-spaces/Trading Strategy & Portfolio/` | 2026-05-07 | `SETUP.md` only (1.4 KB) | **Stub** — auto-generated by Spaces mirror, no real content |
| `Trading Ops` | `~/Obsidian/Hermes/60_Knowledge-Topics/perplexity-spaces/Trading Ops/` | 2026-05-07 | `SETUP.md` only (1.4 KB) | **Stub** — same |
| `trading-ops` (real content) | `~/Obsidian/Hermes/60_Knowledge-Topics/perplexity-spaces/trading-ops/` | 2026-05-27 | 5 files: `05-ai-stack-v2-trading.md`, `binance-bot-config.md`, `kraken-bot-config.md`, `telegram-commands.md`, `trading-cron-jobs.md` | **Real content**, 15 KB total, last touched 2026-05-27 |
| `finance-money-ops/trading-profit-targets.md` | `~/Obsidian/Hermes/60_Knowledge-Topics/perplexity-spaces/finance-money-ops/` | 2026-05-10 | Targets doc | **Real content** |
| **CLAW-Backup vault** (the real one) | `~/Desktop/CLAW-Backup/` | 2026-05-20 | **145 files**, 1.8 MB — full crypto/CSDAWG design | **Orphaned, not in Hermes vault** |
| Hermes vault project folders | `~/Obsidian/Hermes/40_Projects/` | 2026-06-13 | **5 active + 1 archive**, **no crypto project** | **Missing** — no `PROJ-2026-*_crypto-trading-intelligence/` exists |

### CLAW-Backup contents (the orphaned crypto vault)

```
~/Desktop/CLAW-Backup/
├── CRYPTO_INTEL_ENGINE_SPEC.md          337 lines, 2026-05-20 ✅ detailed design
├── CRYPTO_INTEL_INPUTS_2026-05.md       235 lines, 2026-05-20 ✅ input schema
├── CRYPTO_INTEL_INTEGRATION_PLAN.md     330 lines, 2026-05-20 ✅ integration design
├── CRYPTO_INTEL_MEMORY_RULES.md         290 lines, 2026-05-20 ✅ memory tagging rules
├── CRYPTO_INTEL_WEEKLY_TEMPLATE.md      240 lines, 2026-05-20 ✅ report template
├── CSDAWG_QUESTION_BANK.md               89 lines, 2026-04-25 ✅ A-H series questions
├── CSDAWG_REVIEW_CYCLE.md               167 lines, 2026-04-25 ✅ review cadence
├── CSdawgbot.md                          67 lines, 2026-04-25 ✅ role definition
├── Trading - CSDAWGBOT Weekly Strategy Review.md  146 lines, 2026-05-20 ✅ workflow
├── Trading — Kraken + CSDAWGBOT Weekly Review Recovery.md  176 lines, 2026-05-20 ✅ recovery
├── BINANCE_BOT_AUDIT_2026-05.md         ~480 lines, 2026-05-20 ✅ deep audit
├── CSDAWG_CURRICULUM.md (live copy)      52 KB, 2026-05-21
├── CSDAWG_LESSONS_2026-05-21.md          3.3 KB, 2026-05-21
├── CSDAWG_PREDICTIONS_LOG.json          6.9 KB, 2026-06-08 (has live data!)
├── Crypto Intelligence/
│   ├── CRYPTO_INTEL_2026-05-20.md        3.2 KB
│   ├── intelligence.json                8.8 KB
│   └── (the same ENGINE_SPEC, INPUTS, INTEGRATION_PLAN, MEMORY_RULES, WEEKLY_TEMPLATE)
├── learn/
│   ├── CRYPTO_QUICK_REFERENCE.md        1.4 KB
│   ├── CRYPTO_TRADING_GUIDE.md          6.2 KB
│   └── CRYPTO_TRADING_JOURNAL.md        466 B (mostly empty)
├── history/                             (empty)
├── predictions/                         (empty)
├── alerts/                              (3 files)
├── sector_pulse.db                       36 KB
├── btc_cycle_history.db                 135 KB
├── btc_market_structure.db               70 KB
├── sector_universes.json                 1.2 KB
└── (60+ other unrelated files, AGENTS.md, etc.)
```

**The CLAW-Backup vault has 12 unique design/template docs** that are NOT in the live `~/.hermes/knowledge/crypto-intel/` engine. The most valuable:
- `CRYPTO_INTEL_ENGINE_SPEC.md` — original design (now realized)
- `CSDAWG_QUESTION_BANK.md` — A-H question series, 89 lines
- `CSDAWG_REVIEW_CYCLE.md` — review cadence framework
- `CSDAWG_PREDICTIONS_LOG.json` — has actual data through 2026-06-08
- `BINANCE_BOT_AUDIT_2026-05.md` — 480-line deep audit
- `Trading - CSDAWGBOT Weekly Strategy Review.md` — workflow spec
- `Trading — Kraken + CSDAWGBOT Weekly Review Recovery.md` — recovery notes

---

## Hermes / .hermes/knowledge status

### Live crypto knowledge in `~/.hermes/knowledge/crypto-intel/`

| File | Size | Last modified | Status |
|---|---|---|---|
| `CSDAWG_CURRICULUM.md` | 52 KB / 1,801 lines | 2026-05-21 | ✅ Canonical curriculum |
| `CSDAWG_LESSONS_2026-05-21.md` | 3.3 KB | 2026-05-21 | ✅ Lesson log |
| `CSDAWG_PREDICTIONS_LOG.json` | 6.9 KB | 2026-06-08 | ✅ Predictions with data |
| `alerts/` | 3 files | 2026-05-21 | ✅ |
| `btc_cycle_history.db` | 135 KB | 2026-05-21 | ✅ |
| `btc_market_structure.db` | 70 KB | 2026-05-21 | ✅ |
| `sector_pulse.db` | 36 KB | 2026-05-21 | ✅ |
| `sector_universes.json` | 1.2 KB | 2026-05-21 | ✅ |
| `history/2026/` | 5 intelligence.json files (2026-05-21 → 2026-06-08) | 2026-06-08 | ✅ **LIVE — most recent is 2026-06-08** |
| `weekly/2026/` | 5 weekly markdown reports | 2026-06-08 | ✅ **LIVE** |
| `weekly/latest/intelligence.json` | 22 KB | 2026-06-08 | ✅ **LIVE — current state** |

### Hermes knowledge root (not in crypto-intel/)

**No `LEARNED_TRADING.md`, `LEARNED_CRYPTO.md`, `LEARNED_CSDAWG.md`, or `LEARNED_BINANCE.md` file exists** in `~/.hermes/knowledge/`. The 26 `LEARNED_*.md` files cover:
- Tech stacks (Airbnb, ASP, AWS, Azure, GCP, Java, OpenShift, PowerShell, Python, TSQL, SAP, Whiteboards)
- Side projects (Bakery, Budgeting, Squares, Soccer Pools, Baseball Betting)
- Academic (CS50, Resources, Core Architecture)
- None are crypto/trading-specific.

The **trading knowledge is scattered** across:
- `MEMORY_CAPTURE_LOG.md` (13 KB, references crypto)
- `MODEL_ROUTING_WORKFLOW.md` / `MODEL-STACK-WORKFLOWS.md` (mentions CSDAWG 2.0)
- `KANBAN_ROADMAP.md` (17 KB, has crypto track)
- `BLOCKER_RESOLUTIONS.md` (9.3 KB, has Binance bot blockers)
- `marcels-os-blueprint.md` (lessons)
- `LEARNED_BAKERY_SYSTEM.md` (no, this is bakery)

### Hermes scripts that touch crypto

| Script | Purpose | Last modified |
|---|---|---|
| `~/.hermes/scripts/crypto-intel-weekly.js` | Weekly intelligence cron | present |
| `~/.hermes/scripts/backfill_btc_history.js` | BTC history backfill | present |
| `~/.hermes/scripts/backfill_btc_history.py` | Python version | present |
| `~/.hermes/scripts/backfill_funding_rate.py` | Funding rate backfill | present |
| `~/.hermes/scripts/csdawg-history-analyzer.js` | History analyzer | present |
| `~/.hermes/scripts/csdawg-prediction-grader.js` | Prediction grader | present |
| `~/.hermes/scripts/binance-health-check.sh` | Bot health check | present |
| `~/.hermes/scripts/check_yahoo_mailboxes.scpt` | (not crypto) | present |

**8 active crypto-related scripts** in `~/.hermes/scripts/`. All are referenced by either `binance-bot` health checks or the `crypto-intel` weekly cron.

### OpenClaw legacy (frozen)

| Path | Last modified | Status |
|---|---|---|
| `~/.openclaw/memory/csdawg.sqlite` | 2026-04-21 | Frozen (FTS5 embeddings table for chunks) |
| `~/.openclaw/memory/main.sqlite` | 2026-04-28 | Frozen (same schema) |
| `~/.openclaw/memory/{debugdawg,ideasdawg,lbc35}.sqlite` | 2026-04-22-23 | Frozen |
| `~/.claude/projects/-Users-bigdawg-Projects-crypto-portfolio/` | 2026-04-30 | 2 JSONL session logs, 2 empty memory dir |
| `~/Desktop/Openclaw Brain/...` | 2026-04-28 | Frozen |

**All OpenClaw crypto work is from April 2026** — before CSDAWG 2.0 (May 2026) and the LIVE go-live (May 21-22). It's effectively dead and superseded.

---

## Kanban trading cards (bossman board)

**15 cards with `assignee='trading'`**, of which:

- **3 are blocked** (the strategic work that's stalled):
  - `t_e752ea85` TRACK — Binance US Intelligence and Strategy Rebuild
  - `t_ec89434d` TRACK — Controlled Execution Support and Optimization
  - `t_e53da070` Crypto Education Curriculum — Modular Foundation
  - `t_16e717ee` 4-Cycle Historical Analysis — 2017, 2020-2021, 2022, 2024-2025
  - `t_ec23a194` Market Regime Identification Framework
  - `t_8149c340` Signal Classification System — Strong/Weak/Setup/No-Setup
  - `t_faa6d371` Phase 6 — Rebuild or retire trading-monitor + poller cron job
  - `t_07c30d9a` Binance Bot — Pre-Trade Hook Restoration + Strategy Documentation

- **4 are todo** (small follow-ups, not strategic):
  - `t_394bcecb` MP6-02, `t_7086e063` MP6-03, `t_f3009e4b` MP6-13, `t_0f9f7820` self-healing, `t_6e32069c` builder impl, `t_b11_04` tiny LIVE test

- **1 is ready**: `t_phase11` Binance Bot Phase 11A — Go-Live (LIVE Trading)

The blocked cards are **the actual stalled crypto learning work**. The 6 crypto-specific ones (regime, signals, curriculum, 4-cycle, pre-trade hook) are the core of "the crypto / trading learning system."

---

## What's actually working right now (live verification at audit time)

| System | Port | Status | Evidence |
|---|---|---|---|
| `csdawg-dashboard` (intel read-only API) | 8150 | ✅ ONLINE | `curl :8150/api/intel` returns full intelligence.json v1.8, regime MID_CYCLE, 5 history snapshots, alerts array |
| `binance-bot` (live trader) | 8104 | ✅ ONLINE (PAPER mode) | `curl :8104/api/status` returns `mode=PAPER, paperMode=true, intelGate=true, balance=0.01, lastCheck=2026-06-14T01:43:10.995Z` |
| `money-making-dashboard` | 8020 | ✅ ONLINE | (separate money pipeline) |
| `crypto-intel-weekly.js` cron | (cron) | ✅ Last ran 2026-06-08 | `history/2026/2026-06-08-intelligence.json` exists, 22.3 KB |

**The intelligence engine is producing weekly reports. The bot is reading them via INTEL_GATE. The dashboard is serving them. The loop is closed.**

---

## Reusable schemas, folders, naming patterns

For a unified crypto knowledge base, the following patterns are already established and should be preserved:

### File naming
- **Weekly reports:** `~/.hermes/knowledge/crypto-intel/weekly/2026/CRYPTO_INTEL_YYYY-MM-DD.md` and `intelligence.json` paired files
- **Latest pointer:** `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`
- **History snapshots:** `~/.hermes/knowledge/crypto-intel/history/YYYY/YYYY-MM-DD-intelligence.json`
- **Predictions:** `CSDAWG_PREDICTIONS_LOG.json` (live), one entry per day
- **Audit docs:** `BINANCE_BOT_AUDIT_YYYY-MM.md` (CLAW-Backup pattern), `*_AUDIT_2026-05.md`

### Schema (intelligence.json)
```json
{
  "report_date": "YYYY-MM-DD",
  "generated_at": "ISO8601",
  "version": "1.8",
  "regime": "MID_CYCLE|BULL|BEAR|CHOP",
  "regime_confidence": 0.45,
  "regime_certainty": "CONFIRMED|UNCERTAINTY",
  "btc_200d_sma": float,
  "btc_50d_vs_200d": "death_cross|golden_cross",
  "btc_current_price": float,
  "drawdown_from_ath_pct": float,
  "momentum_90d_pct": float,
  "volatility_regime": "LOW|MEDIUM|HIGH",
  "indicators_agreeing": [...],
  "btc_7d_pct": float,
  "coin_rankings": [{symbol, band, band_score, price_7d_pct, price, volume_7d_trend, relative_to_btc_pct, sector, reason}],
  "sector_pulse": {ai: {...}, rwa: {...}},
  "cycle_context": {ath_drawdown_pct, cross_state, sma_50, sma_200, fear_greed_score, funding_regime, funding_weekly_count},
  "analyst_view": {summary, summary_bullets, points: [{model, category, horizon, text}], model_sources: []},
  "predictions": {report_date, horizon_days, entries: [{id, type, horizon_days, value, confidence, created_at, notes, model_sources}], total_entries},
  "learning_notes": {summary, points: [{category, confidence, text}], model_sources},
  "alerts": [{type, severity, confidence, title, detail, source, rationale}],
  "history": [{report_date, version, regime, regime_certainty, regime_confidence, funding_regime, funding_count, ai_vs_btc, rwa_vs_btc}],
  "delivery_status": {at, count, suppressed, channel},
  "execution_advisory": {advisory_mode, non_binding, report_date, regime_context, risk_posture, confidence, reasons, generated_at}
}
```

### Folders
```
~/.hermes/knowledge/crypto-intel/
├── weekly/
│   ├── 2026/                          # year-archived markdown reports
│   │   └── CRYPTO_INTEL_2026-06-08.md
│   └── latest/                        # symlink-equivalent: most recent intel
│       └── intelligence.json
├── history/
│   └── 2026/                          # year-archived JSON snapshots
│       └── 2026-06-08-intelligence.json
├── predictions/                       # (currently empty)
├── alerts/                            # alert templates / rules
├── *.db                               # supporting SQLite (cycle history, sector pulse)
├── *.json                             # supporting config (sector_universes)
└── CSDAWG_*.md                        # human-readable docs (curriculum, lessons)
```

### Cross-references
- **Binance bot reads** `~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json` (via `INTEL_GATE`)
- **CSDawg dashboard serves** the same path over HTTP on port 8150
- **Weekly cron** writes to `weekly/2026/CRYPTO_INTEL_<date>.md` AND `history/2026/<date>-intelligence.json` AND `weekly/latest/intelligence.json`

---

## Recommendation per piece

| Piece | Recommendation | Why |
|---|---|---|
| **`~/.hermes/knowledge/crypto-intel/` (live engine)** | ✅ **Keep + grow** | This IS the unified crypto knowledge base. It's live, integrated with the bot, generating weekly reports, and has the canonical schema. |
| **`~/Repos/BossMan` (GitHub backup)** | ✅ **Keep** | Already syncs memory-trading-intelligence.md, crypto-intel-weekly.js, and Spaces content. Missing: csdawg-dashboard server code (which has no git). |
| **`~/Projects/binance-bot`** (live bot) | ✅ **Keep** | Paper mode, online, INTEL_GATE wired. Phase 11B LIVE go-live was approved 2026-05-21/22. |
| **`~/Projects/money-making-dashboard`** | ✅ **Keep** | Not crypto-specific, but it has trading-related portfolio tracking. |
| **`~/Projects/master-dashboard`** | ✅ **Keep** | Multi-dashboard hub, not crypto-specific. |
| **`~/Projects/csdawg-dashboard`** | 🔄 **Revive + integrate** | Server is live (8150), but no git history. Should be added to BossMan repo as a tracked service so the live code has a backup. |
| **`~/Projects/trading-control`** | 🔄 **Revive + integrate** | Server is online via PM2, but no git history. Same fix. |
| **`~/Projects/coinbase-bot`** | 🗄️ **Archive** | Frozen since 2026-03-30, no PM2, no `.env`, no `.git`. Strangler of the strategy. |
| **`~/Projects/trading-review`** | 📦 **Keep as library** | `pre-trade-hook.js` is actively used by binance-bot. Don't archive the function; just note it's a shared library, not a service. |
| **`~/Projects/provider-monitor`** | ✅ **Keep** | Tracks DeepSeek/OpenAI cost, not trading-specific. |
| **`~/Projects/provider-balance-dashboard`** | 🗄️ **Archive** | Duplicate of provider-monitor functionality, 7.5KB single file. |
| **`~/Projects/fresh-dashboard`** | 🗄️ **Archive** | Empty app dir, three 0-byte DBs, no code. |
| **`~/Desktop/CLAW-Backup/`** (orphaned crypto vault) | 🔄 **Revive + integrate** | 12 unique design docs (CSDAWG_QUESTION_BANK, CSDAWG_REVIEW_CYCLE, BINANCE_BOT_AUDIT, etc.) that are NOT in the live engine. Should be moved into `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` per the OBSIDIAN_VAULT_WORKFLOW.md standard, and the unique content (question bank, audit, review cycle) should be synced to the BossMan repo. The DBs and stale .md files in CLAW-Backup can be archived. |
| **`~/Desktop/Openclaw Brain/` and `~/.openclaw/memory/`** | 🗄️ **Archive** | Frozen since April 2026, predates CSDAWG 2.0, superseded by everything. |
| **`~/.claude/projects/-Users-bigdawg-Projects-crypto-portfolio/`** | 🗄️ **Archive** | 2 JSONL session logs from April 2026, empty memory dir. No recoverable value. |
| **Obsidian `Trading Strategy & Portfolio` / `Trading Ops` SETUP.md stubs** | 🗄️ **Archive or replace** | Auto-generated 1.4KB stubs with no real content. Either replace with the live engine's dashboard data, or archive. |
| **Obsidian `trading-ops/` (real content)** | ✅ **Keep** | 5 real docs (15 KB), 2026-05-27. |
| **Kanban blocked cards (6 crypto-specific)** | 🔄 **Revive + integrate** | These are the actual stalled "crypto learning system" work. Need a parent card to triage them. |
| **Missing `LEARNED_CRYPTO.md` / `LEARNED_TRADING.md`** | ✏️ **Add** | After audit findings are integrated, create `LEARNED_CRYPTO_INTELLIGENCE.md` with the patterns established in this audit. |

---

## Concrete next-step proposal (not auto-executed)

If approved, I would do the following — in order, gated by approval:

1. **Move `~/Desktop/CLAW-Backup/` unique crypto content** → `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` per OBSIDIAN_VAULT_WORKFLOW.md. 12 files (CRYPTO_INTEL_*, CSDAWG_*, BINANCE_BOT_AUDIT, Trading review docs). This is non-destructive (originals stay in CLAW-Backup with a redirect note, in case you want to verify).
2. **Sync those 12 files to `~/Repos/BossMan/docs/crypto/`** and commit. This gives them the GitHub backup stream.
3. **Init git in `~/Projects/csdawg-dashboard/` and `~/Projects/trading-control/`** and commit their current state to BossMan. They have no git history and are running live code.
4. **Archive** `coinbase-bot/`, `provider-balance-dashboard/`, `fresh-dashboard/`, and the OpenClaw legacy paths. (Move to a `~/archive/2026-06-13/` subfolder with timestamps, not delete.)
5. **Replace** the Obsidian `Trading Strategy & Portfolio` / `Trading Ops` SETUP.md stubs with a real Dashboard tile linking the live engine.
6. **Add `LEARNED_CRYPTO_INTELLIGENCE.md`** to `~/.hermes/knowledge/` with: schema, fallback chain, file-naming convention, cron schedule, the "INTEL_GATE is the integration point" rule, the audit cadence.
7. **Add a new project folder** `PROJ-2026-06_crypto-trading-intelligence/` under `~/Obsidian/Hermes/40_Projects/Active/` with `PROJ-Overview.md`, `PROJ-Timeline.md`, `PROJ-Decisions.md`.
8. **Triage the 6 blocked trading kanban cards** with a parent card: "Crypto Intelligence — Phase 2 work (regime, signals, curriculum, 4-cycle, pre-trade hook, monitor rebuild)" — decide which to revive, archive, or pivot.

---

## Open questions for Marcelo

1. **CLAW-Backup fate:** is it a one-time harvest (move unique content to Hermes, archive the rest), or do you want to keep the full vault as a parallel archive?
2. **Archived projects:** move-to-archive-folder (recoverable) or hard delete? My recommendation is move-to-archive, but that crosses the "destructive admin" boundary and needs your explicit approval.
3. **Obsidian stubs:** replace `Trading Strategy & Portfolio` / `Trading Ops` SETUP.md with live engine pointers, or leave them alone?
4. **New project folder:** create `PROJ-2026-06_crypto-trading-intelligence/` (active) or under `On-Hold/`? My read is the live engine is **active**, so it should be Active.
5. **Kanban triage:** do you want me to spawn a parent card for the 6 blocked cards, or are those your private queue to triage yourself?
