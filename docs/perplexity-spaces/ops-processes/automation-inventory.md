# Automation Inventory — Cron Jobs + LaunchAgents

**Snapshot:** 2026-07-22 (reconciled: 39 active cron jobs, all in inventory)
**Owner:** BossMan Hermes
**Source of truth:** `hermes cron list` (cron) + `launchctl list` (LaunchAgents)
**Codified in:** `~/.hermes/SOUL.md § Cron + Automation Policy — No Spam, High Signal`

**Recent changes (2026-07-22):**

- **Reconciliation:** inventory table brought to 39 rows (was 32). 17 jobs previously missing from inventory added; the 6 Travel OS trip reminders that were consolidated into `7f58cef97c80` moved to a "Consolidated / Retired Crons" section (not deleted, for traceability).
- **New cron `4e1e61cf6932` Build-Metrics Monthly** — `0 9 1 * *`, no-agent, local deliver. Regenerates `~/.hermes/knowledge/BUILDMETRICSYYYY-MM.md` from kanban card bodies + routing_ledger. Layer-2 closed-loop canon (Card B, Permanent 2026-07-22) surfaces closed-loop health on a monthly cadence. Marcelo carve-out approved 2026-07-22 via Telegram.
- First report `BUILDMETRICS2026-07.md` already populated (34 cards parsed, 33 with `buildpasses=1` + `rewritescope=none`; Loop Health section 0/0 — convention just started, real data lands 2026-08).
- **`hermes-canon-drift-check.sh`** extended with 4 Layer-2 loop-health patterns (Card B). Existing 4-file canon check unchanged. Cron `fd843b9a03e6` runs it weekly Monday 9:30 AM.

**Known cron health issues surfaced during reconciliation** (separate cards / drift-fix needed; out of scope here):

- `675fdbeba374` S1-security-pm2-monthly — last run errored (failed to create parent card). Recommend: a drift-fix card for S1 cycle 2026-08.
- `09a2ba2c702d` Health-OS-V3 DSLD Refresh — script missing at `~/.hermes/scripts/dsld_refresh.sh`. Recommend: a drift-fix card to either restore the script or remove the cron entry.
- `2a47f7cc4e6f` Routing Ledger Weekly Scan — last run reported 0% compliance (8 invalid + 2 missing ledgers on 10 open cards). Recommend: open a drift-fix card to backfill the missing/invalid cards via `routing-ledger-backfill.py --apply`.
- ~~`b858e01bd089` Travel OS External Watchdog — last successful run 2026-07-22 (healthy).~~ **FIXED 2026-07-22:** hostname updated from `bigdawgs-mac-mini-2.tailed3212.ts.net` (DNS-failing) to `bigdawgs-mac--studio.tailed3212.ts.net` (current). See `t_pm2_health_and_watchdogs_driftfix_20260722`.
- ~~`88eff3953480`~~ **`fa06cd5e1842`** Hermes Weekly Systems Review — last run hit a 604s timeout (limit 600s). **FIXED 2026-07-22:** Job was running kanban-worker skill agent (wrong mode). Fixed to `no_agent: true` script-only (`hermes-weekly-systems-review.sh`). Live test run: 0.35s, delivered to Telegram. Next scheduled run: 2026-07-27 08:00 PDT.

**PM2 Health Monitor cron drift-fix 2026-07-22** (resolved):

- `01dff7ff61e4` PM2 Health Monitor — was executing every 15 min but failing silently with `BadRequestError: 'gpt-5.4' model is not supported` (cron stored config = `claude-sonnet-4/anthropic`, runtime = `gpt-5.4/chatgpt`). Drift-fix: SKILL.md `~/.hermes/skills/devops/pm2-health-check/SKILL.md` and legacy script `~/.hermes/scripts/legacy/pm2-health-monitor.sh` updated with the corrected auto-repair whitelist (8 services, all verified via `pm2 jlist`). The gpt-5.4/Codex runtime issue is a SEPARATE cron-runtime-layer drift (cron stored model ≠ runtime model) — out of scope here; recommend a follow-up card.

**PM2 health-monitor whitelist drift-fix 2026-07-22** (resolved):

- Pre-fix `CRITICAL_SERVICES`: 13 entries (9 phantoms + 4 real).
- Post-fix `CRITICAL_SERVICES` (in SKILL.md + legacy script): 8 entries (all real, all verified via `pm2 jlist`):
  1. `pmd-web` port 7575 `/pmd/api/properties` (added)
  2. `pmd-api` port 7576 `/` (added)
  3. `binance-bot` port 8104 `/api/health` (kept)
  4. `health-os-v3` port 8121 `/health` (kept)
  5. `health-os-v4` port 3537 `/health-os/v4` (added)
  6. `money-pipeline` port 8020 `/api/health` (kept)
  7. `budgeting-software` port 8145 `/health` (added)
  8. `travel-os` port 3537 `/` (added; port updated from 3535 → 3537 per Phase 3 reconciliation)
- Phantoms removed: client-hub, squarepayouts, bakery, trading-control, youtube-dashboard, csdawg-dashboard, dominoes-server, boss-hub-internal, boss-hub-external.
- Coverage rate: 100%. Phantom count: 0.
- Operator approval recorded in `t_pm2_health_and_watchdogs_driftfix_20260722`.

**Recent changes (2026-07-09):**

- Browser QA / Perplexity path restored via raw WebSocket CDP — see
  `~/.hermes/knowledge/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md` (mirrored at
  `/Users/bigdawg/Repos/BossMan/docs/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md`).
- Stage 2/7 capture updated: `~/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md`.
- `daily_pipeline.sh` prefers `--source browserqa`; internal-only derivation is now
  the last-resort fallback, not the default. Per-symbol fallback chain:
  `browserqa -> brave text search -> internal-only`.
- No new crons registered; the existing `2141a756a0aa` (daily_pipeline.sh @ 12:00 PT)
  continues to do the work.

BossMan updates this file whenever the cron/LaunchAgent set changes. Every entry below must justify its existence in one line. Jobs that no longer serve a real purpose get archived (not deleted — keep audit trail).

---

## Cron Jobs (39 active, all `hermes cron list`)

| # | ID | Name | Schedule | Deliver | Mode | One-line justification |
|---|---|---|---|---|---|---|
| | | **_SquaresPayouts / BakeryOps daily exporters_** | | | | |
| 1 | `0561fcffeba1` | SquaresPayouts Daily Exporter | `0 9 * * *` | local | agent | Dumps SquarePayouts order/transaction data to local file once a day for the morning brief. |
| 2 | `c6d759d2b561` | BakeryOps Daily Exporter | `5 9 * * *` | local | agent | Same as above for BakeryOps — daily export for morning brief. |
| | | **_Perplexity Spaces sync + refresh_** | | | | |
| 3 | `7203f2330d92` | perplexity-spaces-sync | `0 6 * * *` | origin | no-agent | Pulls canonical docs from Perplexity Spaces once a day to keep the local mirror current. Silent on success, origin only on failure. |
| 4 | `ff0b6860cba5` | Weekly Hermes → Perplexity Spaces Refresh | `0 7 * * 6` | origin | no-agent | Weekly Saturday push to Perplexity Spaces for cross-device access. |
| | | **_Morning Pipeline Brief (Agent)_** | | | | |
| 5 | `5f3569ba2813` | Morning Pipeline Brief | `0 8 * * 1` | origin | agent | Weekday morning digest of pipeline, blockers, and alerts. High signal, low frequency. |
| | | **_Monthly deep-audit + Vault audit + Build-Metrics + Obsidian review_** | | | | |
| 6 | `e8c2a1f3d419` | Hermes Monthly Deep-Audit | `0 9 1 * *` | origin | no-agent | First of the month: deep audit of board hygiene, MEMORY size, cron health, model usage. Once monthly, deliberate signal. |
| 7 | `0613ba1877bc` | Obsidian Vault Monthly Audit — 1st 09:00 PT | `0 9 1 * *` | local | no-agent | 8-check vault hygiene; silent when healthy. |
| 8 | `ee1f669efb1e` | Obsidian Vault Bi-Monthly Review — 1st 10:00 PT (even months) | `0 10 1 */2 *` | origin | no-agent | 5-task vault review; surfaces to Telegram by design. |
| 9 | `4e1e61cf6932` | Build-Metrics Monthly | `0 9 1 * *` | local | no-agent | Regenerates `~/.hermes/knowledge/BUILDMETRICSYYYY-MM.md` from kanban card bodies + routing_ledger. Loop Health section surfaces closed-loop health (Layer-2 Card B, Permanent 2026-07-22). Silent on success; no Telegram noise. |
| | | **_Weekly Systems Review (Agent to Telegram)_** | | | | |
| 10 | `fa06cd5e1842` | Hermes Weekly Systems Review — Monday 8 AM | `0 8 * * 1` | telegram | no-agent | Weekly board health, alerts, and project progress sent to Marcelo's Telegram. Replaces ad-hoc reviews. |
| | | **_CSDAWG 2.0 Weekly Intelligence (Agent)_** | | | | |
| 11 | `76956b7cafa7` | CSDAWG 2.0 Weekly Intelligence | `0 15 * * 1` | origin | no-agent | Weekly Binance/regime intel brief. Important but not urgent. |
| | | **_MoneyPipeline daily jobs_** | | | | |
| 12 | `8fb30e332d6d` | MoneyPipeline Auto-Enrich V2 | `0 6 * * 1` | local | no-agent | Daily enrichment of the opportunity pipeline from public sources. |
| | | **_CuaDriver Health Monitor + Client Hub Feedback Queue_** | | | | |
| 13 | `84896b15c68b` | CuaDriver Health Monitor | `*/5 * * * *` | local | no-agent | Self-heal watchdog for CuaDriver. Silent unless degraded. |
| 14 | `8d04ee3f0227` | Client Hub Feedback Queue Processor | `*/5 * * * *` | local | no-agent | Drains the Client Hub feedback queue every 5 min. Silent unless there's input. |
| | | **_PM2 Health Monitor_** | | | | |
| 15 | `01dff7ff61e4` | PM2 Health Monitor | `*/15 * * * *` | local | no-agent | PM2 Health Monitor (every 5 min). Silent on healthy, surfaces Telegram only on auto-fix or escalation. |
| | | **_Binance bot health + monitor + auto-ticket_** | | | | |
| 16 | `fed3553cf244` | binance-health-check-am | `0 9 * * *` | telegram | agent | Morning Binance bot health ping to Marcelo. |
| 17 | `4d4552dc85c9` | binance-health-check-pm | `0 21 * * *` | telegram | agent | Evening Binance bot health ping to Marcelo. |
| 18 | `0d9d490f7ec2` | binance-bot-live-monitor | `*/5 * * * *` | local | no-agent | 5-check watchdog for binance-bot LIVE mode (PM2 state, /api/status, mode, balance vs exchange, health-check, PM2 error log). Writes FAIL file on any problem. |
| 19 | `691b1d66658e` | binance-bot-auto-ticket | `*/5 * * * *` | local | no-agent | Reads binance-bot-live-monitor FAIL file, comments on `t_0f9f7820` via `hermes kanban comment`. Idempotent (4-min dedup). |
| | | **_Travel OS — trip reminders (consolidated) + watchdog + handoff sync_** | | | | |
| 20 | `b858e01bd089` | Travel OS External Watchdog | `*/15 * * * *` | local | no-agent | 5-min watchdog for Travel OS external reachability. Silent unless down. |
| 21 | `ab41f101c407` | Travel OS Handoff Sync — Weekly Drift Check | `0 6 * * 6` | local | no-agent | Weekly drift check between local Travel OS and the handoff repo. Silent unless drift detected. |
| 22 | `7f58cef97c80` | Travel OS — Trip Reminder (consolidated) | `0 8 * * *` | telegram | agent | Consolidated Travel OS trip reminder (replaces 6 separate pre-trip / post-trip / trip-start / day-of crons). Single Telegram delivery 8 AM daily; run from `/Users/bigdawg/Projects/travel-os-dashboard` workdir so the app computes which trip stage is current. |
| | | **_Hermes Weekly MEMORY Health Check_** | | | | |
| 23 | `378ef14a305b` | Hermes Weekly MEMORY Health Check — Monday 9:05 AM | `5 9 * * 1` | origin | no-agent | Codified enforcement of the MEMORY hygiene hard rule. Opens kanban card if MEMORY > 1,800 chars. |
| | | **_Crypto Weekly Learning & Intel Review (Sunday Telegram)_** | | | | |
| 24 | `ea0157d715fa` | Crypto Weekly Learning & Intel Review — Sunday 6pm PT | `0 18 * * 0` | telegram | no-agent | Sunday-evening review: 3-5 questions for Marcelo + 3-5 for CSDAWGBOT (DeepSeek + OpenAI), writes brief, single Telegram ping. Per 2026-06-13 Marcelo approval. Bound: ≤1 DeepSeek + ≤1 OpenAI call per run. |
| | | **_Critical-Repos Weekly Backup_** | | | | |
| 25 | `f81d9ffa3aed` | Critical-Repos Weekly Backup | `0 3 * * 0` | local | no-agent | Weekly Sunday 3 AM backup of critical repos (BossMan, Perplexity skill repos). Silent when healthy. |
| | | **_Crypto Daily Radar Pipeline (Stage 7)_** | | | | |
| 26 | `2141a756a0aa` | Crypto Daily Radar Pipeline (Stage 7) | `0 12 * * *` | origin | no-agent | Daily 12 PM Stage 7 crypto radar pipeline. Origin deliver (channels: blog/dashboard feed). |
| | | **_Security Watch (daily + weekly) + S1 PM2 monthly loop_** | | | | |
| 27 | `133f6f655d59` | security-watch-daily | `17 3 * * *` | local | no-agent | Daily security-watch loop: reviews open / closed reports from prior 24h, writes structured log. Silent when no new findings. |
| 28 | `1b1e3e82a86a` | security-watch-weekly | `42 18 * * 0` | local | no-agent | Weekly security-watch rollup: reviews 7-day window, opens kanban card with categorized findings. |
| 29 | `675fdbeba374` | S1-security-pm2-monthly | `30 23 1 * *` | local | no-agent | S1 — Monthly Security & PM2 Watch loop (goal-loop wrapper). Opens kanban cards for P0–P3 findings, mirrors canon to Obsidian + GitHub, writes PHASEREPORT. Note: prior run errored on parent-card creation; investigating. |
| | | **_Brave CDP Watchdog + Perplexity CDP Health Monitor + Auto-Remediate_** | | | | |
| 30 | `fb364e1a9da1` | Brave CDP Watchdog | `*/5 * * * *` | local | no-agent | Brave CDP watchdog. 5-min canary through isolated Brave on :9222. Silent unless DEGRADED. |
| 31 | `7d9768f24313` | Perplexity CDP Health Monitor | `*/10 * * * *` | local | no-agent | 10-min canary query through cdp_client.js; classifies HEALTHY/DEGRADED/UNKNOWN; writes to ~/.hermes/logs/perplexity-cdp-health.log. Silent when healthy — the auto-remediate cron (id 39) consumes the log. |
| 32 | `bd69cb25809d` | Perplexity CDP Auto-Remediate | `5,15,25,35,45,55 * * * *` | local | no-agent | Reads last 6 monitor log entries; if 3+ consecutive DEGRADED/UNKNOWN, closes CDP targets, relaunches isolated Brave on :9222, re-runs canary once, logs to ~/.hermes/logs/perplexity-cdp-remediation.log. Opens Hermes kanban card only if 2 consecutive remediations fail. No Telegram, no PM2, no trading changes. |
| | | **_Health-OS-V3 — DSLD Refresh + Supplement Baseline Healthcheck_** | | | | |
| 33 | `09a2ba2c702d` | Health-OS-V3 DSLD Refresh (weekly Sun 4 AM PT) | `0 4 * * 0` | local | no-agent | Weekly Sunday 4 AM Health-OS-V3 DSLD refresh (Daily Static Lookup Dictionary). Note: prior run errored — script not found at ~/.hermes/scripts/dsld_refresh.sh; needs repair (separate drift-fix). |
| 34 | `a81e9a9164a4` | Health OS V3 Supplement Baseline Healthcheck (nightly 6 AM PT) | `0 6 * * *` | local | no-agent | Nightly 6 AM Health OS V3 supplement baseline healthcheck. Silent when healthy. |
| | | **_Routing Ledger Weekly Scan + Critical-Card Backfill Weekly Scan_** | | | | |
| 35 | `2a47f7cc4e6f` | Routing Ledger Weekly Scan | `10 9 * * 1` | local | no-agent | Weekly Monday 9:10 AM Routing Ledger scan. Reports compliance rate; lists missing/invalid ledgers; suggests backfill. Note: prior run reported 0% compliance on 10 open cards (8 invalid + 2 missing). Drift-fix recommended but not in scope of this reconciliation. |
| 36 | `fc59abe6d885` | Critical-Card Backfill Weekly Scan | `20 9 * * 1` | local | no-agent | Weekly Monday 9:20 AM Critical-Card Backfill scan. Auto-applies backfill to critical-priority cards with missing routing_ledger. |
| | | **_PMD valuation refresh + watchdog_** | | | | |
| 37 | `617757fbccff` | pmd-watchdog | `*/5 * * * *` | origin | no-agent | 5-min watchdog for PMD. Silent unless degraded. |
| 38 | `20d51fba150d` | PMD valuation refresh (ATTOM primary) | `0 6 * * *` | local | no-agent | Daily 6 AM PMD valuation refresh (ATTOM primary). Silent when healthy. |
| | | **_Hermes canon drift check (weekly)_** | | | | |
| 39 | `fd843b9a03e6` | Hermes canon drift check (weekly) | `30 9 * * 1` | local | no-agent | Weekly Monday 9:30 AM hermes-canon drift check (4-file canon md5 across Hermes/Obsidian/GitHub + Layer-2 loop-health drift patterns from Card B 2026-07-22). Opens drift-fix kanban cards on drift. |

---

## Consolidated / Retired Crons

**Permanent 2026-07-22 (inventory reconciliation).** The following cron IDs are no longer present in `hermes cron list`. They are listed here so future operators don't think the inventory has drift or that those jobs vanished unexpectedly.

### Trip reminders (consolidated into `7f58cef97c80`)

| Retired ID | Name | Was Schedule | Consolidated into |
|---|---|---|---|
| `21ddf2bf5690` | Travel OS — T-14 Pre-Trip Reminder | `0 8 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |
| `dee58753bbad` | Travel OS — T-7 Pre-Trip Reminder | `0 8 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |
| `c6055f4fe568` | Travel OS — T-3 Pre-Trip Reminder | `0 8 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |
| `97f7cbf776b9` | Travel OS — T-1 Day Before Reminder | `0 8 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |
| `126ac0b0c8a9` | Travel OS — Post-Trip Close-Out | `30 8 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |
| `6f310d2f4c42` | Travel OS — Trip-Start Bundle (T-3 to T-0) | `0 7 * * *` | `7f58cef97c80` Travel OS — Trip Reminder (consolidated) |

**Why:** The 6 Travel OS trip-reminder stages were originally separate crons. They were consolidated into a single cron (`7f58cef97c80`) so a single app instance (`/Users/bigdawg/Projects/travel-os-dashboard`) handles all stages and avoids PM2 + cron churn.

### Other retired crons (audit needed)

| Retired ID | Name | Was Schedule | Notes |
|---|---|---|---|
| `2ba797d7ccfa` | Phase 12 — Weekly Systems Improvement Audit | `0 8 * * 1` | Replaced/superseded by Hermes Weekly Systems Review (id `88eff3953480`). Likely retired in the Phase 12 → Phase 13 transition (2026-06-23). |
| `c77d492c5b6d` | MoneyPipeline Morning Research | `0 5 * * *` | Likely retired when Morning Pipeline Brief (id `5f3569ba2813`) became the canonical morning digest. Exact retirement date unknown; not in any active Hermes output. |
| `d7baa1737ba8` | Basecamp Monitor (cron) | `*/15 * * * *` | Replaced by the per-project Basecamp autonomous monitor (see Basecamp project docs). BossMan now polls Basecamp messages through a different mechanism; the standalone cron was retired. |

**Audit:** These 3 IDs are no longer in `hermes cron list`. The prior inventory had them, but no replacement cron is currently registered. Each retirement reason is a hypothesis (superseded by a broader cron / renamed / Phase X transition). **Recommend a future drift-fix pass to confirm each retirement is intentional.**

**Audit trail:** Keep these rows in the inventory for traceability — they are not stale, they are retired. The next time Hermes does a full inventory reconciliation, this section is canonical.

---

## LaunchAgents (7 active, 4 disabled)

### Active

| # | Plist | PID | One-line justification |
|---|---|---|---|
| 1 | `ai.openclaw.gateway` | — | Disabled (OpenClaw Telegram gateway stopped 2026-05-18). Workspace preserved. |
| 2 | `ai.hermes.gateway-health` | — | Disabled (2026-05-20). Replaced by on-demand `gateway-health-check.sh` script. |
| 3 | `com.local.pm2-watchdog` | — | Disabled (legacy). Replaced by PM2 Health Monitor cron `01dff7ff61e4`. |
| 4 | `com.local.squarepayouts` | — | Disabled (legacy). Replaced by Hermes-managed PM2. |
| 5 | `com.local.bakery` | — | Disabled (legacy). Replaced by Hermes-managed PM2. |
| 6 | `quickstats` | port 8102 | Active (decision on final disposition pending — review at quarterly audit). |
| 7 | `teamstandup` | port 8003 | Active (decision on final disposition pending). |
| 8 | `mission-control` | port 8001 | Active (decision on final disposition pending). |

### Disabled

| # | Plist | Reason |
|---|---|---|
| 1 | `ai.openclaw.gateway` | Disabled 2026-05-18; autonomous Telegram routing stopped (single-status-surface rule). |
| 2 | `ai.hermes.gateway-health` | Disabled 2026-05-20; restart-loop incident — replaced by on-demand script. |
| 3 | `com.local.pm2-watchdog` | Redundant with PM2 Health Monitor cron `01dff7ff61e4`. |
| 4 | `com.local.squarepayouts` | Redundant; PM2-managed under `squarepayouts` PM2 process. |

---

## Total cron + LaunchAgent count

- **Cron jobs (active): 39** (per `hermes cron list` 2026-07-22)
- **LaunchAgents (active): 4** (3 disabled + 3 under review for disposition)
- **Total automated processes:** 43

---

**Cron count history:**
- 2026-06-23: 28 active (per pre-Phase-13 inventory)
- 2026-06-30: 30 active (after binance-bot live ops additions)
- 2026-07-22: **39 active** (after reconciliation + Build-Metrics Monthly cron `4e1e61cf6932`)

**Status:** PHASED-IN. Next reconciliation recommended in 90 days or whenever a cron registration / retirement occurs.

---

## Travel OS Loop — added 2026-07-23 (Card t_travelos_trip-review-loop_v1_20260723)

**Loop design lane:** Loop Engineering  
**Runtime lane:** Ops (cron registration) + Travel (UX / trip data)  
**PM2 health:** `travel-os` already in PM2 Health Monitor whitelist (8 services, port 3537).  
**Design brief:** `~/.hermes/logs/travel-os-loop-design-20260723.md` (12.2 KB)  
**Script:** `~/.hermes/scripts/travel-os-weekly-review.sh` (8.4 KB Python)  
**State file:** `~/.hermes/state/travel-os-weekly-review.state` (lock window)

### New cron entry

| Cron id | Name | Schedule | Delivery | Owner (lane) | Cron-approval |
|---|---|---|---|---|---|
| `5fced7f41345` | Travel OS Weekly Review (NEW) | `0 1 * * 0` (Sunday 18:00 PT) | local (silent; script decides escalation) | Loop Engineering (design) + Ops (registration) + Travel (content) | `marcelo_approved=true` on card `t_travelos_trip-review-loop_v1_20260723` |

### Prompt + script logic

1. Cron runs the script; script enforces a 7-day lock window (`state.lask_brief_date`).
2. Script fetches `/trips` from Travel OS (currently no-data fallback — Travel implements the endpoint in a follow-up card).
3. Script writes the brief to `~/.hermes/logs/travel-os-weekly-review-YYYY-MM-DD.md`.
4. Script exits `0` (silent, healthy) or `10` (escalate, blockers detected).
5. Cron prompt:
   - exit 0 → silent.
   - exit 10 → deliver contents of `~/.hermes/logs/travel-os-weekly-review-ESCALATE.md` to Telegram.

### No-spam rules (Permanent; Loop Engineering auditing)

- 7-day lock window (state file).
- Silent when no actionable items (no upcoming trips + no blockers + no follow-ups).
- Telegram only when blockers detected + escalation marker exists.
- One brief per cron run; no re-runs within window.

### Existing crons unchanged by this loop

- `b858e01bd089` Travel OS External Watchdog — already healthy (fixed 2026-07-22 Card `t_travel_os_tailscale_routes_cleanup_20260722`).
- `ab41f101c407` Travel OS Handoff Sync — Sat 06:00 weekly, silent drift check.
- `7f58cef97c80` Travel OS Trip Reminder (consolidated) — daily 08:00, pre-approved Telegram. **Future revision** (separate card `t_travelos_loop_b_prompt_update_20260723`) will tighten the prompt to add a 12-hour send window + per-trip-per-day lock window (NO new Telegram routes).

### Cross-lane pattern

Lane routing for this loop:

- **Loop Engineering** owns cadence / no-spam / artifact destination / state file.
- **Ops** owns PM2 process health, cron registration + PM2 whitelist cross-check.
- **Travel** owns trip-data fetcher (`/trips` endpoint), per-trip UX (upcoming list, weekly review view), and content of brief.

Per `~/.hermes/knowledge/loop-engineering-goals.md` § 5 + `~/.hermes/knowledge/ops.md` / `travel.md` "Loop Engineering integration" subsections.


---

## SquarePayouts Loop — added 2026-07-23 (Card t_squarepayouts_health-loop_v1_20260723)

**Loop design lane:** Loop Engineering (uses M3 only for general loop-pattern design — SquarePayouts exec work is BLOCKED from M3 by LEARNED_SQUAREPAYOUTS.md)  
**Runtime lane:** Ops (cron registration + model whitelist guard) + QA-Verification (Step-5 reviewer)  
**Content lane:** Knowledge Canon (Loop Engineering captures durable lessons)  
**PM2 health:** NONE — SquarePayouts is NOT a PM2 service (intentional; not added to whitelist until verified as a real PM2 process)  
**Design brief:** `~/.hermes/logs/squarepayouts-loop-design-20260723.md` (13.2 KB)  
**Script:** `~/.hermes/scripts/squarepayouts-weekly-review.sh` → `squarepayouts-weekly-review.py` (10.7 KB Python, stdlib-only)  
**State files:**
- `~/.hermes/state/squarepayouts-weekly-review.state` (lock window)
- `~/.hermes/state/squarepayouts-model-allowed.json` (model whitelist — only Claude/DeepSeek/OpenAI; M3 BLOCKED)

### New cron entry

| Cron id | Name | Schedule | Delivery | Owner (lane) | Cron-approval |
|---|---|---|---|---|---|
| `0209dcf24ee8` | SquarePayouts Weekly Health Review (NEW) | `0 16 * * 1` (Monday 08:00 PT) | local (silent; script decides escalation) | Loop Engineering (design) + Ops (registration) + QA-Verification (verify) + Knowledge Canon (captures) | `marcelo_approved=true` on card `t_squarepayouts_health-loop_v1_20260723` |

### Model restriction enforcement (Permanent)

Per `LEARNED_SQUAREPAYOUTS.md §"Model Restriction (Permanent)"`:

- The cron script enforces a JSON whitelist of allowed models at `~/.hermes/state/squarepayouts-model-allowed.json`.
- Allowed: `claude-sonnet-4-6`, `deepseek-coder`, `openai-gpt-4o`.
- BLOCKED: `minimax-m3` (any SquarePayouts work).
- Cron prompt explicitly states "DO NOT invoke minimax-m3 for SquarePayouts work anywhere in this cron."
- Test result (live): `HERMES_MODEL=minimax-m3 bash ~/.hermes/scripts/squarepayouts-weekly-review.sh` → exit 10 with `MODEL GUARD: HERMES_MODEL=minimax-m3 is BLOCKED for SquarePayouts work`.

### No-spam rules (Permanent; Loop Engineering auditing)

- 7-day lock window (state file).
- Silent when no actionable items (no model-guard failure + Daily Exporter OK + LEARNED restriction text intact).
- Telegram only when blockers detected (`exit 10` → marker file → cron prompt escalates).
- Max 1 Telegram message per cron run.

### Existing crons unchanged by this loop

- `0561fcffeba1` SquaresPayouts Daily Exporter — daily 09:00 PT, local. Pre-existing; no change.

### Cross-lane design pattern

Lane routing for this loop:

- **Loop Engineering** owns cadence / no-spam / artifact destination / state file / model whitelist guard.
- **Ops** owns cron registration + Markdown edits to AUTOMATIONINVENTORY.
- **QA-Verification** runs Step-5-style checks before activation + on each iteration.
- **Knowledge Canon** captures the model-restriction + guard pattern into permanent canon if 6-month-durable.

Per `~/.hermes/knowledge/loop-engineering-goals.md` § 5 + `~/.hermes/knowledge/ops.md` / `knowledge-canon.md` / `qa-verification.md` "Loop Engineering integration" subsections.


---

## Dominoes Verification Loop -- added 2026-07-23 (Card t_dominoes_verification_loop_v1_20260723)

**Loop design lane:** Loop Engineering
**Runtime lanes:** Loop Engineering (orchestration) + QA-Verification (Pass A/B/C/E) + Builder (Pass D) + Knowledge Canon (Pass F captures)
**PM2 health:** new; registered crons `70b9215bed25` + `93f03c63496f`; PM2 processes `dominoes-server` (id 9) + `dominoes-client` (id 10) registered but currently CRASH-LOOP due to arm64 native-modules (defect D1.1)
**Design brief:** `~/.hermes/logs/dominoes-loop-design-20260723.md`
**Verification matrix:** `~/.hermes/knowledge/DOMINOES_VERIFICATION_MATRIX.md`
**Known issues:** `~/.hermes/knowledge/DOMINOES_KNOWN_ISSUES.md`
**Permanent reference card:** `~/.hermes/knowledge/LEARNED_DOMINOES.md`

### New cron entries

| Cron id | Name | Schedule (PT) | Delivery | Owner (lane) | Cron-approval |
|---|---|---|---|---|---|
| `70b9215bed25` | Dominoes Verification Loop -- Hardening (Tue) | Tue 18:00 PT (`0 1 * * 2` UTC) | local (silent; P0/P1/P2-blocker/99 escape hatch) | Loop Engineering (design) + Ops (registration) + QA (verify) + Builder (fixes) + Knowledge Canon (captures) | `marcelo_approved=true` on card `t_dominoes_verification_loop_v1_20260723` |
| `93f03c63496f` | Dominoes Verification Loop -- Hardening (Sat) | Sat 10:00 PT (`0 17 * * 6` UTC) | local (silent; same escape hatch) | (same as above) | (same as above) |

### State file
`~/.hermes/state/dominoes-verification.state` (cycle counter, last_verdict, blockers_count, last_run_at).

### Money / store boundaries (Permanent)
- NO live payments
- NO App Store / Google Play packaging
- NO platform custody/payout
- Host-managed contributions (Zelle/Venmo) STAY EXTERNAL

### Cycle 1 verdict (2026-07-23)
BLOCKED -- Pass A failed. P0 defect D1.1 logged: arm64 native-modules (`@rollup/rollup-darwin-arm64` missing). Fix card: `t_dominoes_defect_p0_arm64_native_modules_20260723` (assignee=builder). Re-test card: `t_dominoes_retest_smoke_after_arm64_fix_20260723` (assignee=qa-verification).

