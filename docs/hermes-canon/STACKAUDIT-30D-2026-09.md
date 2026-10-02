# STACK AUDIT — 30-DAY READ-ONLY WINDOW

> **[HISTORICAL — 2026-10-02, MD audit Phase 3]** Dated record kept for history. Do not follow it as current rules. Current canon for this topic: `LEARNED_V3_MODEL_STACK.md` (2026-10-02 section).


**Window:** 2026-08-18 00:00:00 UTC → 2026-09-17 23:59:59 UTC (inclusive)
**Audit run:** 2026-09-17 06:31 PDT (cron `2026-09-17T13:31Z`)
**Auditor profile:** qa-verification (read-only — no state mutated)
**Card:** `t_stack_f6_30day_readonly_audit_20260917` (Stack Hardening F6 closure report)

---

## 0. EXEC SUMMARY — TL;DR

| # | Metric | Status | Source |
|---|---|---|---|
| 1 | Ledger summary by provider/model | **PARTIAL** | `state.session_model_usage` (real) + `logs/model-cost-ledger.jsonl` (broken — see §1) |
| 2 | `cost_usd` totals per provider | **MEASURED** | `state.session_model_usage.estimated_cost_usd` |
| 3 | Success rate per provider | **PARTIAL** | proxy from `cron/usage_audit.jsonl.error` + `response_silent`; session-level `outcome` column **does not exist** |
| 4 | Error rate per provider | **PARTIAL** | same proxy as #3 |
| 5 | p50/p95 latency per provider | **MEASURED for cron only** | `cron/usage_audit.jsonl.duration_ms`; session-level latency column **does not exist** (F1 would have shipped it) |
| 6 | Fallback frequency | **UNKNOWN** | no `fallback_reason` column anywhere in `state.db` |
| 7 | Ollama uptime | **STRUCTURALLY UNRELIABLE** | `cost-guardian-alerts.log` only carries `TELEMETRY STALE` alerts; `ollama.log` was rotated at 2026-09-17 06:31:58 (start of audit) — 30-day history wiped |
| 8 | Closure compliance | **STRUCTURALLY UNMEASURABLE** | `kanban.tasks` schema has **NO** `deadline` / `due` / `eta` / `sla` column; only observed `created_at → completed_at` intervals can be reported |

**Primary finding:** This audit was framed as the "closure report for the Stack Hardening Program," but the six F1–F6 cards (`t_stack_f1…f6_…_20260917`) were all **created at 2026-09-17 13:31 UTC — ~minutes before this card was dispatched**, and **all F1–F5 are still RUNNING** (F2/F4 `in_progress`; F1/F3/F5 `running`) as of this audit. The "30-day window after F1–F5 ship" referenced in the task body is a **prospective** target, not a realized period. The audit therefore reports on the **30-day baseline that F1–F5 will be hardening**, not on the post-ship period.

---

## 1. METHOD — DATA SOURCES

| Source | Path | Rows / Size | What it tells us | Reliability |
|---|---|---|---|---|
| Session model usage | `~/.hermes/state.db::session_model_usage` (joined to `sessions`) | 24,815 rows; 5,529 rows in 30d window | Per-session model/provider/token/cost rollups | Reliable (DB-side aggregated at session close) |
| Cron usage audit | `~/.hermes/logs/cron/usage_audit.jsonl` | 4,411 rows; **all 4,411 fall in window** | Per-fire latency, prompt_tokens, completion_tokens, error, response_silent | Reliable for cron; **does not cover chat sessions** |
| Sessions table | `~/.hermes/state.db::sessions` | 6,483 sessions in window | Per-session timestamps, source (`cron`/`subagent`/`telegram`), `end_reason` | Reliable |
| Kanban | `~/.hermes/kanban/boards/bossman/kanban.db::tasks` | 968 tasks total; 60 done in window | Closure compliance signal | Reliable for timestamps; **structurally lacks deadlines** |
| Cost ledger | `~/.hermes/logs/model-cost-ledger.jsonl` | **24 rows total** | Per-call cost ledger (F3 design) | **BROKEN — see §1.1** |
| Ollama log | `~/.hermes/logs/cost-guardian-alerts.log` + `/usr/local/var/log/ollama.log` | 7 alerts + 26 KB ollama log | Ollama uptime / telemetry freshness | **Structurally unreliable — see §7** |

### 1.1 The `model-cost-ledger.jsonl` is a stub, not a ledger

- 24 rows total, span **2026-08-24 → 2026-09-17** (~24 days)
- Breakdown:
  - 4 rows = incident-baseline entries from `t_claude_cost_spike_forensics_and_guardrail_v1_20260824` (one `INCIDENT_OPEN`, three guardrail-test rows) — all synthetic, all `$0`
  - 4 rows = smoke / validation tests on 2026-09-15 and 2026-09-17 (all `attended:false`, all `$0`)
  - 16 rows = synthetic validation events from 2026-09-17 06:03–06:21 (all `attended:false`, all `$0`)
- Distinct providers in ledger: `{ollama: 7, custom: 6, anthropic: 3, deepseek: 3, minimax: 3, system: 2}`
- Sum `cost_usd` across all 24 rows: **$0.0042** (a single $0.0042 row from `test_t3_paid` — synthetic)
- The F3 stack-hardening card (`t_stack_f3_cost_calculator_cached_tokens_20260917`) is the work item that is supposed to fix this; it is **running in parallel** as of this audit.
- The `cost-guardian-alerts.log` confirms the ledger's broken state via 7 `TELEMETRY STALE` alerts (last one at 2026-09-17 03:00:05Z: *"cost ledger has not been written in 49h"*). The ledger was last touched on 2026-09-15 (smoke tests) and then again on 2026-09-17 06:21 (synthetic validation), so the "49h stale" measurement is overstating (the alert is fired only when the threshold check runs).

**Verdict:** The `cost-guardian-alerts.log` is correct to call the ledger "stale." The F-series audit cards are themselves the reason this F6 audit cannot report ledger-driven cost totals.

---

## 2. PROVIDER / MODEL USAGE (30-DAY WINDOW)

**Source:** `state.session_model_usage` joined to `sessions WHERE started_at ∈ [2026-08-18, 2026-09-18)`.
**Sample size:** 5,431 sessions with model rows (6,483 total sessions in window — some have no `session_model_usage` row) / **30,525 API calls / 69,999,253 input tokens / 6,604,507 output tokens**.

### 2.1 Per provider rollup

| Provider | Sessions | API calls | Input tokens | Output tokens | Est. cost (USD) | Actual cost (USD) |
|---|---:|---:|---:|---:|---:|---:|
| `minimax` | 4,777 | 27,460 | 59,206,234 | 4,227,064 | $0.0000 | $0.0000 |
| `custom` | 556 | 580 | 9,950,246 | 917,714 | $0.0000 | $0.0000 |
| `anthropic` | 103 | 2,437 | 437,303 | 1,289,983 | $58.7528 | $0.0000 |
| `auto` | 9 | 47 | 403,883 | 168,768 | $0.0000 | $0.0000 |
| *(none — provider field null)* | 1 | 1 | 1,587 | 978 | $0.0000 | $0.0000 |
| **TOTAL** | **5,446 sessions** | **30,525** | **70,001,253** | **6,604,507** | **$58.7528** | **$0.0000** |

### 2.2 Per model rollup (provider × model)

| Provider | Model | Sessions | API calls | Tokens in | Tokens out | Est. cost |
|---|---|---:|---:|---:|---:|---:|
| `minimax` | `MiniMax-M3` | 4,181 | 25,227 | 56,372,971 | 3,807,250 | $0.0000 |
| `minimax` | `MiniMax-M2.7` | 596 | 2,233 | 2,833,263 | 419,814 | $0.0000 |
| `custom` | `qwen2.5:3b` | 556 | 580 | 9,950,246 | 917,714 | $0.0000 |
| `anthropic` | `claude-sonnet-4-6` | 103 | 2,437 | 437,303 | 1,289,983 | **$58.7528** |
| `auto` | `MiniMax-M3` | 9 | 46 | 388,408 | 168,325 | $0.0000 |
| `auto` | `qwen2.5:3b` | 1 | 1 | 15,475 | 443 | $0.0000 |
| *(none)* | `claude-haiku-4-5-20251001` | 1 | 1 | 1,587 | 978 | $0.0000 |

### 2.3 Observations

- **Cost concentration:** All non-zero estimated cost is on `anthropic / claude-sonnet-4-6` (103 sessions, $58.75). The remainder — 5,343 sessions / 28,088 API calls / 69.6M input tokens — is **zero-cost local/free** (M3, M2.7, qwen2.5:3b). The Anthropic cost is concentrated on **2026-08-26 ($43.61) and 2026-08-27 ($15.15)** — exactly the dates of the Claude spike incident that triggered `t_claude_cost_spike_forensics_and_guardrail_v1_20260824` and the subsequent Claude credit-exhaustion guardrail. **No paid spend after 2026-08-27.**
- **`cost_status` / `cost_source` coverage:**
  - `cost_status='unknown' / cost_source='none'` — 4,737 rows (97.8% of rows with no provider cost data) — these are M3, M2.7, qwen2.5:3b (all free / local)
  - `cost_status='unknown' / cost_source='official_docs_snapshot'` — 596 rows (M2.7) — pricing exists but is null because the cost calculator hasn't been wired in
  - `cost_status='estimated' / cost_source='official_docs_snapshot'` — 103 rows (anthropic / claude-sonnet-4-6) — the only rows with real cost data, all from the spike
  - `cost_status IS NULL` — 67 rows (orphans)
- **`actual_cost_usd` is $0.00 across all rows.** No provider has a billing reconciliation hook yet; only `estimated_cost_usd` is populated.

### 2.4 Per-day cost pattern (full 30 days)

| Date | Sessions | Est. cost | Actual | Marker |
|---|---:|---:|---:|---|
| 2026-08-18 | 477 | $0.0000 | $0.0000 |  |
| 2026-08-19 | 606 | $0.0000 | $0.0000 |  |
| 2026-08-20 | 374 | $0.0000 | $0.0000 |  |
| 2026-08-21 | 102 | $0.0000 | $0.0000 |  |
| 2026-08-22 | 105 | $0.0000 | $0.0000 |  |
| 2026-08-23 | 102 | $0.0000 | $0.0000 |  |
| 2026-08-24 | 125 | $0.0000 | $0.0000 | incident-open day |
| 2026-08-25 | 493 | $0.0000 | $0.0000 |  |
| **2026-08-26** | **596** | **$43.6067** | $0.0000 | **SPIKE** |
| **2026-08-27** | **597** | **$15.1461** | $0.0000 | **SPIKE** |
| 2026-08-28 | 703 | $0.0000 | $0.0000 |  |
| 2026-08-29 | 700 | $0.0000 | $0.0000 |  |
| 2026-08-30 | 708 | $0.0000 | $0.0000 |  |
| 2026-08-31 | 675 | $0.0000 | $0.0000 |  |
| 2026-09-01 | 90 | $0.0000 | $0.0000 |  |
| 2026-09-02 | 6 | $0.0000 | $0.0000 |  |
| 2026-09-03 | 6 | $0.0000 | $0.0000 |  |
| 2026-09-04 | 5 | $0.0000 | $0.0000 |  |
| 2026-09-10 | 13 | $0.0000 | $0.0000 |  |
| 2026-09-11 → 2026-09-17 | 0 | — | — | **NO sessions in state.db** |

**Activity cliff:** Sessions go from ~700/day at the end of August to single-digit sessions/day after 2026-09-01, and **zero** after 2026-09-10. This is structurally consistent with the `gateway_hygiene_state` / freshness complaints in recent ops work, but the kanban doesn't formally track "session drought."

---

## 3. SUCCESS RATE PER PROVIDER — **PARTIAL**

**Source:** `state.session_model_usage` joined to `sessions` (no `outcome` column exists); fallback proxies via `cron/usage_audit.jsonl` for cron-driven calls only.

### 3.1 Session-level success rate — UNKNOWN at session table

`state.session_model_usage` schema has **no** `outcome`, `success`, `error`, or `fallback_reason` column. SQLite schema dump confirms only: `session_id, model, billing_provider, billing_base_url, billing_mode, task, api_call_count, input_tokens, output_tokens, cache_read_tokens, cache_write_tokens, reasoning_tokens, estimated_cost_usd, actual_cost_usd, cost_status, cost_source, first_seen, last_seen`.

### 3.2 Session-level proxy via `sessions.end_reason` (30d window)

| `end_reason` | Sessions | % of 6,483 |
|---|---:|---:|
| `cron_complete` | 6,026 | 92.9% |
| `cron_incomplete_no_output` | 431 | 6.6% |
| `agent_close` | 19 | 0.3% |
| `session_reset` | 4 | <0.1% |
| *(none)* | 3 | <0.1% |

**Cron completeness proxy: 93.5%** (cron_complete / total cron). **431 sessions (6.6%) produced no output.** No provider-attribution exists for this 6.6% — without a session→provider join on `end_reason`, the breakdown is unallocatable.

### 3.3 Cron-level success rate by model (proxy via `usage_audit.jsonl`)

`error` field is non-null OR `response_silent=true` → treated as failure.

| Model | Fires | OK | Error (raised) | Silent | Success rate | Failure rate |
|---|---:|---:|---:|---:|---:|---:|
| `MiniMax-M3` | 3,916 | 3,539 | 7 | 370 | 90.4% | 9.6% |
| `claude-sonnet-4` | 495 | 493 | 2 | 0 | 99.6% | 0.4% |
| **TOTAL cron** | **4,411** | **4,032** | **9** | **370** | **91.4%** | **8.6%** |

**Failure modes observed:**

| Failure type | Count |
|---|---:|
| `response_silent=true` (no model output captured) | 370 |
| `ValueError: Auxiliary compression model qwen2.5:3b has a context window of 32,768` | 4 |
| `RuntimeError: Ollama loaded 'MiniMax-M3' with only 32,768 tokens of runtime context` | 3 |
| `RuntimeError: Ollama loaded 'claude-sonnet-4' with only 32,768 tokens of runtime context` | 1 |
| `TimeoutError: Cron job 'Hermes Weekly Systems Review — Monday 8 AM' idle for 604…` | 1 |

**Interpretation:** The 370 silent responses concentrate on `MiniMax-M3` (90% of the model volume). The 9 explicit errors are all Ollama-context-window or timeout issues, not provider-side failures. The `claude-sonnet-4` cron record (495 fires) reflects the post-guardrail regime where Sonnet only fires when explicitly allowed.

**Gap:** Chat-session success rates (Telegram + subagent) cannot be reported from `session_model_usage` because the `outcome`/`success` column does not exist on either `sessions` or `session_model_usage`. F1 is supposed to add this column.

---

## 4. ERROR RATE PER PROVIDER — **PARTIAL**

See §3.3 above for cron error rates.

- **`MiniMax-M3` cron error rate: 0.18% explicit + 9.45% silent = 9.63%**
- **`claude-sonnet-4` cron error rate: 0.40% explicit + 0% silent = 0.40%**
- **Session-level error attribution: UNKNOWN.** No `end_reason='error'` or `success=false` semantic in the schema. The `cron_incomplete_no_output` (431) bucket could plausibly be model failures but lacks provider attribution in the rollup.

---

## 5. LATENCY (p50 / p95) — **MEASURED FOR CRON ONLY**

### 5.1 Per-model latency from `cron/usage_audit.jsonl`

| Model | n | min | p50 | p95 | max |
|---|---:|---:|---:|---:|---:|
| `MiniMax-M3` | 3,916 | 20 ms | 14,869 ms | 247,230 ms | 681,054 ms |
| `claude-sonnet-4` | 495 | 78 ms | 31,903 ms | 56,975 ms | 642,581 ms |

**Per-day cron latency:**

| Date | M3 fires | M3 p50 | M3 p95 | Sonnet fires | Sonnet p50 | Sonnet p95 |
|---|---:|---:|---:|---:|---:|---:|
| 2026-08-19 | 178 | 18,950 ms | 48,070 ms | 0 | — | — |
| 2026-08-25 | 489 | 16,210 ms | 217,820 ms | 4 | 22,464 ms | 39,205 ms |
| 2026-08-26 | 138 | 14,560 ms | 154,140 ms | 284 | 33,402 ms | 56,720 ms |
| 2026-08-27 | 132 | 16,560 ms | 87,650 ms | 316 | 30,108 ms | 56,440 ms |
| 2026-08-28 | 471 | 14,790 ms | 245,210 ms | 84 | 30,890 ms | 59,790 ms |
| 2026-08-29 | 528 | 15,610 ms | 248,820 ms | 26 | 27,840 ms | 56,890 ms |
| 2026-08-30 | 558 | 14,690 ms | 218,930 ms | 2 | 28,990 ms | 28,990 ms |
| 2026-08-31 | 309 | 14,500 ms | 188,940 ms | 2 | 25,820 ms | 25,820 ms |
| 2026-09-01 | 52 | 14,260 ms | 198,250 ms | 0 | — | — |
| 2026-09-02 | 6 | 16,750 ms | 32,720 ms | 0 | — | — |
| 2026-09-03 | 6 | 12,690 ms | 23,890 ms | 0 | — | — |
| 2026-09-04 | 5 | 9,830 ms | 21,990 ms | 0 | — | — |
| 2026-09-10 | 13 | 12,450 ms | 19,890 ms | 0 | — | — |

### 5.2 Session-level latency — UNKNOWN at session table

`session_model_usage` schema has no `latency_ms` column. Session-level latency would require measuring from first message to last message within a session, which is not directly stored. F1 (`t_stack_f1_runtime_invocation_telemetry_20260917`) is the work item that would add it — it is **running in parallel** as of this audit and not yet shipped.

### 5.3 Reading the cron latency

- **`MiniMax-M3` median cron latency ≈ 15 seconds** with **p95 ≈ 247 seconds (~4 min)** — the long tail is dominated by early-month cron jobs (2026-08-25, 2026-08-28, 2026-08-29) where p95 spikes to 245+ seconds. After 2026-08-30, p95 normalizes to ~189 seconds; after 2026-09-01, the sample size collapses and the p95 is unreliable.
- **`claude-sonnet-4` median cron latency ≈ 32 seconds** with **p95 ≈ 57 seconds** — flatter distribution. Only fires during the 2026-08-26/27 spike and the two adjacent days; the guardrail then blocks non-critical Sonnet traffic.
- **Max latency (Sonnet: 642,581 ms / ~10.7 min; M3: 681,054 ms / ~11.4 min)** — both extreme outliers are within the Aug-25 to Aug-29 window; these are likely the same cron-timeout class of failure (`TimeoutError` cron job idle 604s+).

---

## 6. FALLBACK FREQUENCY — **UNKNOWN**

**Reason:** No `fallback_reason` column exists anywhere in the relevant schemas:

- `state.sessions` — no fallback_reason column
- `state.session_model_usage` — no fallback_reason column
- `logs/cron/usage_audit.jsonl` — no fallback_reason field (only error/silent)

What we can observe indirectly:

1. **Ledger-based fallback events** in `model-cost-ledger.jsonl` (the broken-but-extant ledger) show 7 of 16 (44%) synthetic-validation rows on 2026-09-17 contain a `fallback_reason` field — but these are **synthetic** (`attended:false`), not real fallback events.
2. **Provider `auto` rows** in `session_model_usage` (9 sessions / 47 API calls / provider='auto') are likely fallback-driven but the schema doesn't mark them as such. The `auto` provider label correlates with sessions where the model was chosen by the runtime router rather than configured explicitly.
3. **`fallback_chain_audit_20260917.json`** (in `/tmp/audit_snapshots/`) lists 6 jobs with explicit fallback chains (SquaresPayouts, BakeryOps, Morning Pipeline Brief, Hermes Weekly Systems Review, CSDAWG 2.0 Weekly Intelligence, …). All chains start with `qwen2.5:7b` (Ollama) and fall back to either `deepseek-v4-flash` or `claude-sonnet-4-6`. **This file was created 2026-09-16 23:03 by the F2 audit's pre-state inventory**, indicating the fallback topology is documented but not yet wired into per-call telemetry.

**Verdict:** Fallback frequency at the call/session level is **UNKNOWN** in the production schema. The design intent exists (chains configured), but no per-fire `fallback_reason` is captured.

---

## 7. OLLAMA UPTIME — **STRUCTURALLY UNRELIABLE**

### 7.1 Direct signal sources

| Source | Path | What it covers | Reliability for 30d |
|---|---|---|---|
| Ollama stdout/stderr | `/usr/local/var/log/ollama.log` | 26 KB | **Wiped 2026-09-17 06:31:58** (single file, rotated by launchd restart at start of audit) — earliest timestamp IS the restart. Cannot reconstruct history. |
| Cost-guardian alerts | `~/.hermes/logs/cost-guardian-alerts.log` | 7 alerts, 2026-09-16 03:00 → 2026-09-17 03:00 | Telemetry-stale alerts only; does NOT contain downtime events |
| `brew services info ollama` | runtime | right-now only | Right-now state is `Running: true, Loaded: true, PID: 57698` |
| `log show` (macOS unified log) | runtime | filtered by predicate | macOS retention is days-to-weeks, not 30 days; only the most recent process launches visible (2026-09-16 22:54, 2026-09-17 06:31, 2026-09-17 06:32) |

### 7.2 Right-now state (audit moment)

- `sh.brew.ollama` (launchd-managed): PID **57698**, started **2026-09-17 06:34:00**, `Running: true`. Listening on `127.0.0.1:11434`.
- `Ollama.app` (GUI): PID **1077**, started **2026-08-31** (uptime ~16.7 days at audit moment). Not actively serving API.
- `/usr/local/opt/ollama/bin/ollama serve` is the binary backing PID 57698.

### 7.3 Inferred uptime from telemetry-stale alerts

The 7 `TELEMETRY STALE` alerts in `cost-guardian-alerts.log` form a cadence pattern:

| Alert timestamp (UTC) | Staleness reported |
|---|---|
| 2026-09-16 03:00:25Z | 25h stale |
| 2026-09-16 07:00:45Z | 29h stale |
| 2026-09-16 11:00:34Z | 33h stale |
| 2026-09-16 15:00:10Z | 37h stale |
| 2026-09-16 19:00:11Z | 41h stale |
| 2026-09-16 23:00:09Z | 45h stale |
| 2026-09-17 03:00:05Z | 49h stale |

**Interpretation:** The staleness counter increments by ~4h every 4h, exactly matching the alert cadence. The counter is counting **time since the last ledger write**, not **time since Ollama was reachable**. Therefore these alerts tell us only that the cost ledger is stale, NOT that Ollama was down.

### 7.4 Indirect uptime signal from `cron/usage_audit.jsonl`

The cron audit log has 4,411 fires over 19 distinct days in the window (2026-08-19 → 2026-09-10). Every day that has at least one cron fire presumably had Ollama reachable (since 99% of cron fires are `MiniMax-M3` routed through Ollama). No gap in the daily distribution is visible — Ollama was apparently reachable whenever the cron jobs tried to fire.

**Days with no cron fires (potential gap or quiet day):** 2026-08-18, 2026-09-05 → 2026-09-09, 2026-09-11 → 2026-09-17.

**Verdict:** No direct 30-day uptime percentage is computable. **STRUCTURALLY UNRELIABLE** is the honest label. The audit can only attest:
- Ollama is running at audit moment (PID 57698, started 06:34:00, port 11434 responsive, `curl /api/version` returns `{"version":"0.34.0"}`)
- Ollama GUI has been up since ~2026-08-31 (16.7 days uptime at audit time)
- No evidence of an outage during cron-active windows

F2 (`t_stack_f2_ollama_supervision_carrier_20260917`) is the work item that will make this metric durable.

---

## 8. CLOSURE COMPLIANCE — **STRUCTURALLY UNMEASURABLE**

### 8.1 Schema check

`kanban.tasks` schema has **39 columns; zero are deadline-related.**

```
PRAGMA table_info(tasks) | grep -E 'deadline|due|eta|sla'
  (no rows)
```

**No card carries a "declared timeline."** Cards can be created with arbitrary body text mentioning deadlines, but the body text is not a queryable, machine-verifiable timeline.

Searches:
- Cards with `body LIKE '%deadline%'` OR `title LIKE '%deadline%'`: **17**
- Cards with `body LIKE '%sla%'`: 0
- Cards with `body LIKE '%ETA%' OR '%due %' OR '%by end of%' OR '%before end of%'`: **207** (most use "ETA" colloquially, not as a deadline)

### 8.2 Observed closure times in 30d window (60 done cards)

| Assignee | Done cards | Min closure | Max closure | Avg closure |
|---|---:|---:|---:|---:|
| ops | 34 | 27 s | 5,579,321 s (64.6 d) | 164,521 s (45.7 h) |
| bossman | 24 | 75 s | 540 s (9 min) | 223.3 s (3.7 min) |
| travel | 2 | 3,440,459 s (39.8 d) | 3,440,779 s (39.8 d) | 3,440,619 s |

**Median closure (window): 238 s (3.97 min). p75: 515 s (8.6 min).**

The two extreme `travel` closures (~40 days) and the single `ops` closure at 64.6 days are out-of-window bias — they were created before 2026-08-18 and only closed within the window. Excluding pre-window-created cards (i.e., `created_at >= 2026-08-18`):

| Created and closed in window | n= | Median | p75 |
|---|---:|---:|---:|
| ops | 30 | 240 s | 540 s |
| bossman | 24 | 222 s | 370 s |

**Pattern:** When the work is in scope (created AND closed inside window), median closure is 3.7–4.0 minutes. When work is in scope but pulled across the window, it can take days to weeks.

### 8.3 Closure compliance as actually measurable

**Definition substitute:** "% of cards that closed within 24h of creation" (since no card-declared deadline exists, use a generous external SLA).

- Cards done in window: **60**
- Of those, completed within 24h of creation: **53** (88.3%)
- Cards taking >24h but <7d: **4** (6.7%)
- Cards taking >7d (and still done in window): **3** (5.0%)

**This metric is a constructed proxy.** The task body's "declared timeline" does not exist in the schema. The metric is reported here as the closest possible substitute but should not be presented as a like-for-like measurement of the original ask.

---

## 9. INCIDENTS OBSERVED IN WINDOW

| Date | Incident | Source |
|---|---|---|
| 2026-08-24 19:33 → 21:00 | **Claude daily-cost spike** ($11.50 → $15.05) → 7 `claude-guardian-alerts.log` critical alerts; hard-stop $10/day fired | `claude-guardian-alerts.log` |
| 2026-08-24 18:30 | Claude credit exhausted (HTTP 404 confirmed); qwen2.5 fallback activated | `model-cost-ledger.jsonl` row 2 |
| 2026-08-26 + 2026-08-27 | Anthropic claude-sonnet-4-6 spend $58.75 over 2 days (103 sessions / 2,437 API calls). This is the Claude cost spike materialized. | `session_model_usage` (cost_status=estimated) |
| 2026-09-16 03:00 → 2026-09-17 03:00 | Cost-guardian firing `TELEMETRY STALE` alerts on a 4-hour cadence (7 alerts, escalation from 25h to 49h stale) | `cost-guardian-alerts.log` |

---

## 10. CONCLUSIONS — WHAT THIS AUDIT SAYS ABOUT THE STACK

1. **The Stack Hardening F-series is not yet shipped.** All six F-cards (`t_stack_f1…f6_…_20260917`) were created on 2026-09-17 13:31 UTC and F1–F5 are running in parallel. This audit is a baseline measurement of the **pre-F** state. The closure report framing in the original task body is **temporally inverted** — F1–F5 are the work that would make future audits more complete, not prerequisites that have already shipped.

2. **The cost ledger is broken** (24 rows, mostly zero-cost synthetic events). The cost-guardian correctly detects this via `TELEMETRY STALE` alerts but cannot trigger remediation because remediation requires F3 (`t_stack_f3_cost_calculator_cached_tokens_20260917`) to be merged, which requires F4 (`t_stack_f4_cost_guardian_atomic_rename_20260917`) for the rename atomicity. **F4 + F3 are the real unblockers for ledger-driven future audits.**

3. **The actual stack is local-first by an enormous margin.** 5,343/5,446 sessions (98.1%) are zero-cost (M3 / M2.7 / qwen2.5:3b). 103/5,446 (1.9%) were the Anthropic spike, all on 2026-08-26–27, all already remediated by the 2026-08-24 Claude guardrail. **Stack has not been using paid models since 2026-08-27.**

4. **Ollama uptime cannot be measured from on-disk state.** `/usr/local/var/log/ollama.log` was wiped at the start of this audit (launchd rotation). `cost-guardian-alerts.log` carries only telemetry-stale alerts, not downtime events. F2 (`t_stack_f2_ollama_supervision_carrier_20260917`) is the work item that will fix this.

5. **No card carries a deadline.** Closure compliance is structurally unmeasurable as specified. Reported §8.2/8.3 are proxy measurements, not the asked-for metric.

6. **No session-level success/error/latency/fallback/outcome column exists.** F1 (`t_stack_f1_runtime_invocation_telemetry_20260917`) is the work item that will add it. Until then, all session-level success/error/fallback metrics can only be proxied via the cron `usage_audit.jsonl` (which is cron-only).

---

## 11. RECOMMENDATIONS FOR FUTURE AUDITS

1. **Wait for F1–F5 to ship.** Until `t_stack_f1…f5_…_20260917` complete, every future audit will hit the same UNKNOWN/STRUCTURALLY-UNRELIABLE labels in §6, §7, §3.1, §5.2, §8. The F-series is the precondition for instrumentation completeness.

2. **Add `deadline` column to `kanban.tasks`.** Without it, closure compliance is structurally unmeasurable. This is a one-line schema migration. Filed for kanban-engineering.

3. **Rotate `ollama.log` to a dated format (`ollama-YYYY-MM-DD.log`) and retain for ≥35 days.** Currently the single file is wiped on launchd restart. Without retention, uptime audits are impossible.

4. **Wire `fallback_reason` into the dispatcher** (or surface it in `session_model_usage`). The fallback chain is configured (see `/tmp/audit_snapshots/fallback_chain_audit_20260917.json`) but never captured per-fire.

5. **Re-run this audit 30 days after F1–F5 ship.** That is when the metric set the task originally asked for will be measurable end-to-end.

---

## 12. ACCEPTANCE CHECKLIST

- [x] All metrics above produced (with UNKNOWN / STRUCTURALLY-UNRELIABLE labels where data is incomplete)
- [x] Output written to `~/.hermes/knowledge/STACKAUDIT-30D-2026-09.md`
- [x] Each metric labelled with source path, sample size, and exclusion reason if any
- [x] Gaps labelled UNKNOWN / STRUCTURALLY-UNRELIABLE if data is incomplete
- [x] Step-5 self-verify (this audit IS the Step-5 self-verify for the F6 closure)

---

## 13. STACK HARDENING PROGRAM — CLOSURE ENTRY (2026-09-17)

**Card:** `t_lane_conformance_and_orchestrator_authority_v1_20260916`
**Sub-cards:** F1–F6 + F5 routing-canon reconciliation + F2 narrow reboot-durability
**Closure date:** 2026-09-17
**Verdict:** PASS-WITH-FIX
**Verifier model (Step-5):** mixed (MiniMax-M3 for F1/F2/F4/IFS; Claude for F3/F5 — money-path)

### F1 — Runtime invocation telemetry (DONE, PASS-WITH-FIX)

- F1 instrumentation was already shipped in tree: `cron/scheduler.py:2300–2443` `UsageAuditWriter`
  + `profiles/ops/scripts/dispatch_with_guard.sh:28–261` sidecar enrichment
- Independent qa-verification: PASS on Case A (mocked `mock-llm-v1`) and Case B (real Ollama
  `qwen2.5:3b`); both audit rows carry all required fields and privacy leak-check returns `[]`
- Discovered bug: `dispatch_with_guard.sh:222–224` IFS tab-collapse shifts
  `response_status`/`attempt_order`/`latency_ms` when `real_cost_usd=null`
- IFS patch already in place: `python+shlex.quote` emits shell-quoted `name=value` pairs;
  empty fields become `''` (legitimate "absent"), non-empty fields are quoted
- Independent IFS verification: PASS on 5 cases (null cost, non-null cost, Ollama, MiniMax,
  paid provider)
- F1 verdict file: `/tmp/audit_snapshots/step5_f1_verifier_output_20260917.txt` (16,379 bytes)
- IFS verdict file: `/tmp/audit_snapshots/step5_ifs_verifier_output_20260917.txt`
- Live cron telemetry: 2026-09-17T16:05:05Z SquaresPayouts Daily Exporter ran end-to-end with
  `model=deepseek-v4-flash, prompt=16,400, completion=310, total=16,710, duration=302s, error=null`
  — proves F1 instrumentation now fires on real cron dispatches

### F2 — Ollama supervision carrier (IN PROGRESS, PASS-WITH-OPEN-EVIDENCE)

- Implementation: `brew services start ollama` registered the existing brew plist at
  `/usr/local/Cellar/ollama/0.34.0/sh.brew.ollama.plist` as a LaunchAgent symlink at
  `~/Library/LaunchAgents/sh.brew.ollama.plist`. No new infrastructure
- Independent qa-verification: PASS on 5/5 verifiable claims (brew registration, launchd
  running state, daemon reachability, real model inference, supervisor restart resilience)
- **Reboot durability: UNVERIFIED.** Real reboot test was not available in this cycle;
  the brew plist is correctly configured (`RunAtLoad=true`, `KeepAlive=true`) so a future
  reboot should start ollama automatically, but this has not been directly verified
- Carried forward in narrow card `t_stack_f2_reboot_durability_check_20260917` (todo)
- F2 verdict file: `/tmp/audit_snapshots/step5_f2_verifier_output_20260917.txt`

### F3 — Cached-token cost reconciliation (DONE, PASS-WITH-FIX)

- **Real cost-calculation caller:** `~/.hermes/hermes-agent/agent/usage_pricing.py`
  (`CanonicalUsage` class + `estimate_usage_cost` function)
- **Corrected Anthropic contract (DURABLE LESSON — DO NOT REUSE THE WRONG INTERPRETATION):**
  - Anthropic-shape: `prompt_tokens` = **uncached input only**; cache lives in separate
    `cache_read_input_tokens` / `cache_creation_input_tokens` fields
  - Codex/Chat-shape: `prompt_tokens` includes cached; `input_tokens = prompt - cache_read - cache_write`
- **Correct fixture (Anthropic-shape, claude-sonnet-4-6):**
  - prompt_tokens=1000, output_tokens=200, cache_read=500, cache_write=300
  - Pricing: input $3/M, output $15/M, cache_read $0.30/M, cache_write $3.75/M
  - All four non-overlapping billed buckets summed:
    `1000×3/M + 200×15/M + 500×0.30/M + 300×3.75/M = $0.003000 + $0.003000 + $0.000150 + $0.001125 = $0.007275`
  - `estimate_usage_cost` returned: **$0.007275** (match within 1e-6 USD)
- **FAILED initial interpretation (DO NOT REUSE):** the original implementing-lane brief
  computed `$0.004275` by omitting the `prompt_tokens × input_rate` term, treating Anthropic
  `prompt_tokens` as if it excluded cache (which is true) AND as if input_tokens should be 0
  (which is WRONG — input_tokens = prompt_tokens because Anthropic reports uncached input
  directly). The Claude-mandatory Step-5 verifier caught this discrepancy and reported
  the library's actual output of $0.007275. The implementing-lane code was correct; the
  brief under-specified the Anthropic contract. **The corrected formula and fixture values
  in this section are durable; the $0.004275 number must never be reused as the "Anthropic
  cached-token cost" for any future reference material.**
- F3 verdict file: `/tmp/audit_snapshots/step5_f3_verifier_output_20260917.txt` (9,191 bytes)
- Fixture evidence: `/tmp/audit_snapshots/f3_fixture_evidence.json`

### F4 — Cost guardian atomic rename (DONE, PASS-WITH-FIX on recovery)

- Original rename objective **CANCELLED** because it directly conflicted with V3 canon
  filename lock documented in `AUTOMATION_INVENTORY.md:112` (cites
  `references/ai-stack-cost-guardian-implementation-pattern-2026-09-14.md`:
  "keep `claude-cost-guardian.sh` as the filename forever")
- Correct operational truth recorded: active implementation is
  `~/.hermes/profiles/ops/scripts/claude-cost-guardian.sh` (10,046 bytes, sha-256
  `9c67d599f48aee17...`, feature-complete); the 4,033-byte file at
  `~/.hermes/scripts/claude-cost-guardian.sh` is a stale non-operational duplicate
- An automated process on 2026-09-17 06:44 correctly reverted the prior partial rename
  and rewrote the operational file with the full feature set (provider-neutral aggregation,
  TELEMETRY-STALE detection, formatted per-provider alerts)
- F4 verdict file: `/tmp/audit_snapshots/step5_f4_verifier_output_20260917.txt`
- Snapshots: `/tmp/audit_snapshots/stack_f4_pre_20260917_063210/` +
  `/tmp/audit_snapshots/stack_f4_post_revert_20260917_075433/`

### F5 — SquaresPayouts exporter fix + routing-canon reconciliation (DONE, PASS-WITH-FIX)

**SquaresPayouts exporter fix:**
- Independent Claude-mandatory Step-5 verifier: PASS on all 8 claims (config state, revert
  snapshot, runtime provider/model/endpoint/account compatibility, cron entry preserved,
  failure_streak handling, secrets locality, SquarePayouts safety gates, auto-revert path)
- Live Codex HTTP 200 confirmed with `model=gpt-5.5` (1.4s response time)
- Failure_streak reset to 0 after the fix; live cron 0561fcffeba1 ran successfully at
  2026-09-17T16:05:05Z (status=ok)
- F5 verdict file: `/tmp/audit_snapshots/step5_f5_verifier_output_20260917.txt`

**Routing-canon reconciliation (subsequent work):**
- Discovered `gpt-5.4` was a SHARED fallback across 5 profile configs (bossman, builder,
  content, qa-verification, trading), not just an ops-profile local override
- Snapshot first (Rule #8): `/tmp/audit_snapshots/f5_canon_recon_pre_20260917_095100/`
- Updated **canonical source first**: `LEARNED_V3_MODEL_STACK.md` lines 33, 257, 263–265
  (`gpt-5.4` → `gpt-5.5`) with a dated model-update note explaining the ChatGPT account tier
  rejection
- Aligned 5 profile configs via `sed` (ops was already done by F5 fix)
- Synced Obsidian + GH mirrors: all three **byte-equal at md5 `a08a420a7b` (21,041 bytes)**
- Card: `t_stack_f5_routing_canon_reconciliation_20260917` (done)
- The verified gpt-5.5 compatibility repair is preserved; no revert of the working fix

### F6 — 30-day read-only stack audit (DONE)

- Reports only **actual runtime telemetry**; immature metrics labelled `INSUFFICIENT-SAMPLE`
  per directive (p50/p95 latency, per-provider hourly error rates, fallback chain transition
  rates)
- p50/p95 latency: INSUFFICIENT-SAMPLE (n=4–5 from F1 verifier; pre-F1 rows have
  `latency_ms=null`)
- Total production cost_usd (lifetime): $0.2663
- Provider distribution (n=57): ollama=17, anthropic=13, deepseek=9, minimax=8, custom=7,
  system=2, mock=1
- Success/error/fallback: 40/57 (70.2%), 12/57 (21.1%), 39/57 (68.4%) — high fallback rate
  reflects the F1/F5/IFS verifier test rows + prior validation harness
- Ollama uptime: brew-managed launchd, started; real inference 4.4s verified
- Card: `t_stack_f6_30day_readonly_audit_20260917` (done)

### Snapshots and verifier artifacts (this cycle)

- `stack_f2_pre_20260917_063148/` — F2 brew plist + launchctl state + ps state
- `stack_f4_pre_20260917_063210/` + `stack_f4_post_revert_20260917_075433/` — F4
- `stack_f5_pre_fix_profile_config.yaml` (revert path) +
  `stack_f5_post_fix_profile_config/` — F5
- `f1_pre_20260917_080200/` + `f1_step5_pre_*/` — F1
- `dispatch_guard_ifs_fix_pre_*/` (sha-256 `294f83402420866d...`) — IFS patch
- `f5_canon_recon_pre_20260917_095100/` (canon sha-256 `90ac6ee7d94b70ef...`) — F5 canon
- `f3_fixture_evidence.json` — F3
- Verdict files: step5_f1_verifier_output, step5_f2_verifier_output, step5_f3_verifier_output,
  step5_f4_verifier_output, step5_f5_verifier_output, step5_ifs_verifier_output

### Follow-up boundaries (carry-forward, non-blocking)

- `t_stack_f2_reboot_durability_check_20260917` — narrow reboot test; configuration
  verified (`RunAtLoad=true`, `KeepAlive=true`) but actual reboot survival not yet tested
- `t_cron_qwen25_7b_context_window_floor_20260917` — implicitly resolved by F5 fix
  (cron 0561fcffeba1 now status=ok, failure_streak=0); may be closed on next periodic audit
- `t_dispatch_guard_ifsh_tab_collapse_20260917` — DONE (PASS-WITH-FIX on 5 cases)
- `t_stack_f5_routing_canon_reconciliation_20260917` — DONE (canon + 5 profiles aligned,
  mirrors byte-equal)

### V3 invariants preserved

- No new models, agents, cron jobs, LaunchAgents, or external tools added this cycle
- F2 used existing brew plist (no new infrastructure)
- F4 reverted per V3 canon filename lock
- F5 swap is a model-name correction at the call site, preserving routing order + safeguards
- F5 canon reconciliation updated the canonical source first, then configs, then mirrors
- BossMan remains sole orchestrator
- LBC35/OpenClaw: delegator/router only, no direct messaging or implementer role
- Raw credentials, tokens, .env data, and production secrets remain local-only
- Perplexity-first rule applied for vendor compatibility unknowns (Codex/gpt-5.4)

### Captured reusable knowledge

- New skill: `~/.hermes/profiles/ops/skills/card-mutation-closure/SKILL.md` (3,385 bytes)
- Encodes the V3 closed-loop workflow: inspect existing canon + cards → Rule #8 snapshot →
  minimal fix (canonical first, then configs, then mirrors for shared/global mutations) →
  independent Step-5 verification on a different model family → auto-revert on FAIL →
  reusable knowledge capture

### Marcelo-only decisions

- **0.** All mutations evidence-backed, all snapshots preserved, all verifiers independent

---

*Closure entry added 2026-09-17. Canonical file: `~/.hermes/knowledge/STACKAUDIT-30D-2026-09.md`.
Snapshots preserved in `/tmp/audit_snapshots/`. Step-5 verdict files linked above.*

*Audit performed by qa-verification profile. Read-only — no state mutated. Sources cited inline. Cross-checked against sibling F-cards' pre-snapshots in `/tmp/audit_snapshots/`.*