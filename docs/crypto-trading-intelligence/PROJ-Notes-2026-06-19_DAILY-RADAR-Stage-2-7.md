---
id: PROJ-2026-06_crypto-trading-intelligence
related: [PROJ-Overview, PROJ-Timeline, PROJ-Decisions]
date: 2026-06-19
tags: [DAILY-RADAR, stage-2, stage-7, capture, post-mortem]
---

# Project Notes — Crypto Trading Intelligence — 2026-06-19 Capture

## Stage 2 — Perplexity enrichment, end-to-end

### What got built
- `daily_research.js` extended with 3-source taxonomy
- `--source internal` CLI flag for honest fallback path
- `finalize()` writes memo-compatible shape (`research.symbols[]` + `research.research[symbol]` + `research.coins_covered`)

### What got killed (and why)
- **Perplexity Browser QA primary path** — CUA daemon zero-bounds. Documented since 2026-05-23. Cannot use.
- **Brave Search via curl** — HTTP 429 from this IP. Tested empirically on 2026-06-19. Cannot use.
- **Perplexity Search API** — forbidden by locked rule (no API key by design). Cannot use.

### What replaced it
**Internal derivation** that consumes Stage 1 + Stage 3 outputs. Emits `source: bot_internal_only` and marks external dimensions `null`. Never fabricated.

### What changed downstream
- `daily_memo.js` now 3-way labels research source honestly
- DeepSeek instruction set recognises PARTIAL as a valid rating
- `daily_decision.js` reads `research_quality` correctly: PARTIAL → MEDIUM confidence (not MISSING → LOW)

---

## Stage 7 — Cron + logging

### What got built
- `scripts/daily_pipeline.sh` (160 lines) — 8-stage wrapper
- Cron `2141a756a0aa` — `0 12 * * *` PDT daily
- `run_log_YYYY-MM-DD.jsonl` — per-stage events
- `run_summary_YYYY-MM-DD.json` — daily totals

### Logging format
- **JSONL events:** `{ts, stage, status, elapsed_ms, date}`
- **JSON summary:** `{date, completed_at, total_stages, ok_count, failed_count, total_elapsed_ms, stages[]}`

### Degraded-mode behavior (verified)
- Brave 429 → automatic fallback to `--source internal`
- Stage 4 memo failure → wrapper logs as `fail`, decision layer still runs with prior-day memo
- Bot keeps trading under existing price-window gates regardless of pipeline outcome
- Bot runtime **never receives a Telegram ping** from this pipeline

---

## Failures & fixes (post-mortem)

### F1: Schema drift (Stage 2 → Stage 3/4)
- **Symptom:** `daily_decision.js:117` reads `memo.research_quality` and reports MISSING when Stage 2 ran successfully
- **Root cause:** `daily_research.js` and `daily_memo.js` wrote/read slightly different shapes
- **Fix:** Extended `finalize()` to emit both legacy + memo-compatible shapes. Idempotent.

### F2: DeepSeek source mislabelling
- **Symptom:** DeepSeek rated research as MISSING even when internal derivation was complete and valid
- **Root cause:** `buildPrompt()` hardcoded "Perplexity Search Pro" label regardless of actual source
- **Fix:** 3-way switch on `research.source`. Honest labels + PARTIAL-aware instructions.

### F3: `do_not_touch` schema violation
- **Symptom:** DeepSeek emitted `"MEMECOINS WITH LOW VOLUME AND HIGH VOLATILITY (E.G., SPXUSDT, 1000MOGUSDT)USDT"` as a single string
- **Root cause:** DeepSeek can emit sentence fragments for symbol lists
- **Fix:** Two-layer sanitization — producer-side (`sanitizeMemo`) + consumer-side (strict regex)
- **Severity:** Critical — would have broken bot contract

### F4: BSD `date` doesn't support `%3N`
- **Symptom:** Elapsed-time math crashed with `illegal time format`
- **Root cause:** macOS BSD `date` lacks millisecond precision; `gdate` not installed
- **Fix:** Replaced with Python `time.time()*1000`. Cross-platform-safe.

---

## Run evidence

End-to-end pipeline run on 2026-06-19 13:04 PDT:

```
2026-06-19T20:03:09  stage_1_census                       ok   1123ms
2026-06-19T20:03:15  stage_3_briefs                       ok   5463ms
2026-06-19T20:03:15  stage_2_phase_a_research_prompts     ok     71ms
2026-06-19T20:04:14  stage_2_phase_b_brave                fallback_to_internal 0ms
2026-06-19T20:04:14  stage_2_phase_b_internal_fallback    ok     81ms
2026-06-19T20:04:14  stage_2_finalize                     ok     70ms
2026-06-19T20:04:20  stage_4_memo                         ok   6148ms
2026-06-19T20:04:21  stage_5_decision                     ok     72ms
total_elapsed_ms: 13028
```

Bot runtime (PM2 `binance-bot` PID 4696): **online, 105 MB, 0% CPU, unaffected.**

---

## Linked artifacts

- Canonical knowledge doc: `~/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md`
- Epic card: `t_aefb15e8`
- Stage 1 child: `t_210f2ec8`
- Cron: `2141a756a0aa`
- Scripts: `/Users/bigdawg/Projects/binance-bot/scripts/daily_{census,research,pair_brief,memo,decision}.js` + `daily_pipeline.sh`
- Run evidence: `~/.hermes/knowledge/crypto-intel/daily/run_log_2026-06-19.jsonl` + `run_summary_2026-06-19.json`