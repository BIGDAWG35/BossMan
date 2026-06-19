---
name: daily-radar-pipeline
description: DAILY-RADAR pipeline — daily USDT-pair heat-tag, per-pair intel briefs, and price-windowed intel package. The bot's `checkIntelGate()` reads it only when Stage 5 lands; until then it's write-only and zero bot impact. **Stage 6 (preview-gated, L-CRYPTO-14 governance) consumes this intel package as input to the BossMan decision layer** — pipeline itself remains advisory-only at the wire. Triggers include daily_radar, DAILY_RADAR_10, DAILY_MEMO, PAIR_BRIEFS, price_window, intel gate design, advisory-only intel, Stage 2.5, daily pair brief, stage 4 decision layer, do_not_touch, watchlist radar, L-CRYPTO-14, BossMan decision.
---

# Daily Radar Pipeline (DAILY-RADAR)

## Profile

A daily-running intel pipeline that produces per-coin heat-tags + per-pair intel briefs for the **bot's 15-pair universe** (XRP, DOGE, ADA, LINK, VET, AVAX, HBAR, DOT, XLM, SUI, CAKE, PEPE, HYPE, FET, NEAR). Output is **strictly advisory** — the bot's `checkIntelGate()` reads it only when Stage 5 lands; until then it's write-only and zero bot impact.

**Decision layer (L-CRYPTO-14, governance lock 2026-06-19):** when Stage 6 ships, this pipeline's outputs (`data/daily_radar.json`, `data/pair_briefs.json`, latest memo) become inputs to the BossMan decision layer, which produces `data/bossman_decision.json`. This pipeline does NOT make decisions — it only produces intel. The decision authority sits in the BossMan decision layer, not here.

**Project root:** `/Users/bigdawg/Projects/binance-bot/`
**Scripts:** `scripts/daily_census.js` (Stage 1) · `scripts/daily_memo.js` (Stage 3) · `scripts/daily_decision.js` (Stage 4) · `scripts/daily_pair_brief.js` (Stage 2.5)
**Bot-readable outputs:** `data/daily_radar.json` (heatmap) · `data/pair_briefs.json` (per-pair intel)
**Daily archive:** `~/.hermes/knowledge/crypto-intel/daily/` (DAILY_RADAR_10_*, DAILY_MEMO_*, PAIR_BRIEFS_*)
**Cost log:** `~/.hermes/knowledge/crypto-intel/daily/TOKEN_LOG.jsonl` (one line per LLM call, JSONL append)
**Canonical design doc:** `~/.hermes/knowledge/crypto-intel/daily/CRYPTO_INTEL_GATE_DESIGN.md`
**Epic kanban:** `t_aefb15e8` (5 sub-cards under it, all `done` as of 2026-06-19 except Stage 2 and Stage 5)

**Cost budget:** ≤$0.002/day total. One batched DeepSeek call for the per-pair stage (~$0.0002), one DeepSeek call for the memo (~$0.0006), zero LLM calls for census/decision/pair-brief-skeleton.

## Pipeline Stages

| Stage | Script | Output | LLM? | Cost |
|---|---|---|---|---|
| **1 — Census** | `daily_census.js` | `data/daily_radar.json` with `bands` + `price_window` + `top_struct` | None | $0 |
| **2 — Research (Perplexity)** | Browser QA + Perplexity Search (NOT API) | Perplexity Space thread (machine-readable via local mirror) | N/A (no API key) | $0 |
| **3 — Memo** | `daily_memo.js` | `DAILY_MEMO_<date>.json` with `top_3_thesis` + `watchlist_changes` + `do_not_touch` | DeepSeek | ~$0.0006 |
| **4 — Decision** | `daily_decision.js` | Extends `data/daily_radar.json` with `do_not_touch` + `watchlist` + `regime_today` | None (reads Stage 1+3 outputs) | $0 |
| **2.5 — Pair Briefs** | `daily_pair_brief.js` | `data/pair_briefs.json` + `PAIR_BRIEFS_<date>.json` with 15 pair-level intel briefs | DeepSeek (one batched call) | ~$0.0002 |

**Stage 5 — Wire-up (PENDING, Marcelo preview approval):** Stage 2.5's `data/pair_briefs.json` and Stage 1's `data/daily_radar.json` get read by the bot's `checkIntelGate()`. **Bot behavior change** — `server.js` edit. Triggers user approval gate (security/system change).

**Stage 6 — BossMan decision layer (L-CRYPTO-14, PENDING WIRE — emitter shipped 2026-06-19):** reads Stages 1-3 outputs and emits `data/bossman_decision.json` (overwrite) plus a dated archive `data/bossman_decision.<YYYY-MM-DD>.json`. Inline schema validator enforces 8 hard-reject conditions; on any failure the artifact is NOT written. Decisions cover coin rotation (active/watchlist/do_not_touch), strategy class per coin, aggression tier (T1/T2/T3, fixed), per-trade qualify/deny. Hard $75 floor enforced at the signal layer (sub-75 rows dropped, counted in `floor_audit.denied_below_floor`). **Does NOT execute trades.** Decisions still pass through Policy Gate (L-CRYPTO-02 / `INTEL_GATE`). Wire discipline is preserved: pipeline stages never mutate bot config, never send Telegram, never trigger a trade. See `scripts/bossman_decision.js`, `~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md` v1.4 (Stage 6 section), and `L-CRYPTO-15` in `LEARNED_CRYPTO_INTELLIGENCE.md`.

**Bot integration (Stage 7 — separate card, separate approval):** bot MAY consult `data/bossman_decision.json` for trade gating. Not in scope for the current skill.

## Hard Rule — Advisory-Only Contract (L-CRYPTO-03 + L-CRYPTO-14)

**The daily radar NEVER:**
- Writes to `.env`, `server.js`, `pre-trade-hook.js`, or any bot config
- Modifies `PAIRS` universe in `server.js`
- Sends Telegram, email, push, SMS, or ntfy to the operator
- Triggers, blocks, sizes, or alters any trade
- Adjusts position sizing, leverage, stop-loss, take-profit, or risk parameters
- **Makes decisions** (coin rotation, tier selection, strategy class, per-trade qualify/reject) — those are the BossMan decision layer's job, not this pipeline's. (L-CRYPTO-14)

**The daily radar ONLY:**
- Writes `data/daily_radar.json` and `data/pair_briefs.json`
- Writes daily archives to `~/.hermes/knowledge/crypto-intel/daily/`
- Appends one line per LLM call to `TOKEN_LOG.jsonl` (cost + stage + tokens)
- Reads Binance.US public API (`/api/v3/ticker/24hr`, `/api/v3/exchangeInfo`)
- Acts as **input** to the BossMan decision layer (Stage 6, L-CRYPTO-14) when that ships. Until Stage 6 lands, the pipeline's outputs are read-only intel that the bot does not consume.

**Future Stage 5 wire-up (when approved):** the bot MAY consult advisory files for confidence adjustments, but always fails-open (no intel = default band = WARM). The only blocking signal is `do_not_touch` from the memo, and it always fails-open on missing/stale data.

## Price-Window Rule (effective 2026-06-19)

A USDT-pair is **eligible for intel-gate advisory** only if its spot price satisfies:

```
0.00000001 USD ≤ price ≤ 25.00 USD
```

**Always-excluded by design:** `BTCUSDT`, `ETHUSDT` (high-portfolio-impact, separate risk profile).

**Per-pair fields in `data/pair_briefs.json`:**
```json
{
  "symbol": "DOGEUSDT",
  "price_window_status": "in",
  "price_window_reason": null,
  ...
}
```

**`data/daily_radar.json` `price_window` map (sibling of `bands`):**
```json
{
  "bands": { "DOGEUSDT": "WARM", ... },
  "price_window": {
    "DOGEUSDT": { "status": "in", "reason": null, "price": 0.083 },
    "HYPEUSDT": { "status": "out", "reason": "price_above_25", "price": 70.48 },
    "BTCUSDT":  { "status": "excluded_design", "reason": "design_exclusion", "price": 63053.38 }
  }
}
```

**Live snapshot (2026-06-19, Binance.US):**
- 121 non-COLD pairs: `in: 109` · `out: 10` · `excluded_design: 2`
- Bot's 15-pair universe: `in: 14` (XRP, DOGE, ADA, LINK, VET, AVAX, HBAR, DOT, XLM, SUI, CAKE, PEPE, FET, NEAR) · `out: 1` (HYPEUSDT @ $70.48)

**Change control:** price-window bounds, always-excluded list, advisory-only contract, and per-pair schema all require Marcelo preview/approval (security/system change). Other changes (new fields, new sectors, new `price_window_reason` enum values) may be made by BossMan with epic `comment` + `cron` audit trail.

## Pillar Pitfalls — The Three Bugs This Pipeline Burned In

These are the **class-level pitfalls** for any future "add a sibling field to a heat-tag" or "add a new enrichment pass" task. Read before modifying any stage.

### 1. Schema-mirroring: sibling maps MUST share scope

**Symptom:** A new sibling field map (e.g. `price_window`) is written from the **full scored array** (e.g. 201 entries) when the canonical map (e.g. `bands`) is filtered to a **subset** (e.g. non-COLD, 121 entries). The two maps diverge in scope and consumer code silently reads the wrong shape.

**Rule:** When adding a sibling map to a JSON output, **mirror the exact same filter chain as the canonical map**. If `bands = scored.filter(r => r.band !== 'COLD').map(...)`, then `price_window = scored.filter(r => r.band !== 'COLD').map(...)` — never `.map(...)` over the unscored base.

**Verification:** Count entries of both maps; if `bands.length !== price_window.length`, the scopes diverge. Fix and re-run.

### 2. Enrichment-pass lookup: use the full-scope source, not the top-N source

**Symptom:** An enrichment pass (e.g. Stage 2.5's `pairBase`) initializes per-pair records from the **top-N struct** (e.g. `top_struct`, 10 entries) and gets `null` for the other 105 non-top-10 pairs. The enriched output shows correct data for top-10 but `null/empty` for the long tail.

**Rule:** Identify the **full-scope data source** for each field. For price/score/sector/price_window fields, consult the broader heat-tag map (`data/daily_radar.json.bands` or `price_window`) which covers all 121 non-COLD pairs. Reserve `top_struct` for fields that genuinely only exist for the top-10 (e.g. `reason` text, `volume24hQuote`).

**Verification:** After enrichment, check that **every** input pair has populated required fields. If 13/15 pairs show `price: null`, you forgot to consult the full-scope source.

### 3. API endpoint fabrication: never invent URLs

**Symptom:** A new stage needs an LLM call. The agent invents a plausible endpoint URL (e.g. `api.minimax.chat`) and writes `fetch()` to it, only to fail at runtime with DNS/connect errors. The cost log is then corrupted with fake entries.

**Rule:** Before writing any LLM call, **list the verified env keys** in `.env` (`grep -E "_API_KEY|_KEY=" .env | sed 's/=.*/=[REDACTED]/'`). Use only the endpoints that are (a) confirmed in `.env`, (b) already used elsewhere in the pipeline (e.g. `daily_memo.js` for the call pattern), and (c) tested with a tiny dry-run before live use.

**Verification:** First call logs `cost_usd` matching DeepSeek's per-1K-token pricing. If the cost is `0` or the call times out, the endpoint is wrong — fix and retry, never paper over.

## Reference Files

- `references/stage-2.5-pair-briefs.md` — Stage 2.5 design, batched DeepSeek call, all 15 pairs, $0.0002 cost
- `references/stage-1-census-and-price-window.md` — Stage 1 schema + price-window rule
- `references/kanban-card-t_15af72e0.md` — Stage 2.5 sub-card body (template for future Stage-X cards)
- `references/cost-log-format.md` — `TOKEN_LOG.jsonl` schema: `{ ts, stage, model, cost_usd, prompt_tokens, completion_tokens, duration_ms }`

## Out-of-Scope

- No weekly regime engine (that's `crypto-intelligence` skill, CSDAWG 2.0, separate)
- No bot config writes (Stage 5 only, with Marcelo approval)
- No execution logic, position sizing, or capital allocation
- **No decisions** (coin rotation, tier, strategy class, per-trade qualify/reject) — those are the BossMan decision layer (Stage 6, L-CRYPTO-14). Emitter shipped 2026-06-19; this pipeline does NOT make them.
- No Telegram/email/push (zero outbound channels to operator)
- No 3rd-party API keys (DeepSeek via `.env`; Perplexity via Browser QA — no API key)

## L-CRYPTO-14 governance amendment (2026-06-19)

L-CRYPTO-14 upgraded BossMan to autonomous decision authority for crypto. This pipeline was amended to:

1. Name BossMan as the decision consumer (in the frontmatter description, Profile section, and "Reference Files" section).
2. Add Stage 6 to the pipeline table. **Status 2026-06-19: PENDING WIRE — emitter shipped; bot integration (Stage 7) is a separate, future card.**
3. Add a "no decisions" item to the "NEVER" list above (L-CRYPTO-14 hard constraint).
4. Add Stage 6 mention to the Profile section so the next reader knows the wire is intel-only, not decision.

**Wire discipline is preserved.** This pipeline does not write to bot config, does not send Telegram, does not mutate any user-facing state. The new behavior is upstream: BossMan (separate layer) consumes our outputs and decides. The intel wire stays advisory-only (L-CRYPTO-03); the decision wire is a separate L-CRYPTO-14 layer.
