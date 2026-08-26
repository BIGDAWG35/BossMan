# AUTOMATION_INVENTORY.md — Hermes Automation Helper-Script Inventory

> **CANONICAL SOURCE OF TRUTH** for all helper scripts that drive cron jobs, watchdogs, drift checks, or backup/repair flows under `~/.hermes/scripts/`.
> Mirrors: Obsidian `Hermes/automation-inventory.md` (read-only) + GitHub `BIGDAWG35/Hermes` mirror.

This inventory exists so:
1. Every cron job, watchdog, or self-healing helper has a one-line justification.
2. Drift signals surface fast — when a script goes stale, an orphaned `.RETIRED-*` is moved here.
3. New helpers don't sneak in without justification. Any helper that triggers from cron OR can run on demand with side effects MUST be registered here.

> **Rule of thumb (Permanent 2026-08-06, Card `t_v3_stack_audit_v1_20260806`):** Every entry below has a one-line justification, a lane owner, a `trigger` (cron / watchdog / manual / card-driver), and a `last_audit` ISO date. New cron jobs require a separate kanban card + Marcelo approval (V3 carve-out); new **on-demand** helpers do not.

---

## A. Backup / snapshot / revert

| Script | One-line justification | Lane | Trigger | Last audit |
|---|---|---|---|---|
| `~/.hermes/scripts/git-snapshot-before-fix.sh` | Snap a repo's working tree before a non-trivial mutation; enforces `LEARNED_7_RULE_CONTRACT.md` Rule #8; returns SHA on stdout. | ops, builder, trading | Manual + card-driver | 2026-08-06 |
| `~/.hermes/scripts/git-revert-last-fix.sh` | Auto-revert a non-trivial mutation when Step-5 verdict is FAIL or regression appears; default `git revert`, ops-only `--hard-reset` for declarative config. | ops, builder, trading | Manual + card-driver + Step-5 FAIL | 2026-08-06 |
| `~/.hermes/scripts/git-snapshot-md-file.sh` | Snap ONE MD file before any trim/dedup/shave; enforces `LEARNED_7_RULE_CONTRACT.md` Rule #9; writes ledger entry to `~/.hermes/logs/md-trim-snapshots.log`; return SHA on stdout. Companion to Rule #8 but MD-targeted + idempotent on no-op (rc=2). | knowledge-canon, ops | Manual + card-driver | 2026-08-06 |
| `~/.hermes/scripts/openclaw-backup.sh` | Weekly LBC35/OpenClaw state backup; required by V3 SOUL §6 historical context (LBC35 gateway was disabled but residual state still needs weekly snap). | ops | Cron (weekly, see cron/jobs.json) | 2026-07-22 |
| `~/.hermes/scripts/critical-repos-weekly-backup.sh` | Weekly tar+rsync of designated critical repos to the secondary backup tree at `~/.hermes/state/critical-repo-backups/`. | ops | Cron (weekly Sun 03:00 PT) | 2026-08-01 |
| `~/.hermes/scripts/kanban-snapshot.sh` + `kanban-snapshot.py` | Daily dump of kanban DB to `~/.hermes/state/kanban-snapshots/` for offline review + postmortem. | knowledge-canon | Cron (daily 04:00 PT) | 2026-07-29 |
| `~/.hermes/scripts/hermes-canon-drift-check.sh` | Drift-check the canon mirror (Obsidian + GitHub); 90-day GC of stale `state/git-snapshots/`. | knowledge-canon | Cron (weekly Sun 05:00 PT) | 2026-08-05 |

## B. Drift / canary / health watchdogs

| Script | One-line justification | Lane | Trigger | Last audit |
|---|---|---|---|---|
| `~/.hermes/scripts/pm2-canon-drift-check.sh` | Validates PM2 process manifest matches canon; honors Ollama-routing restriction post-2026-07-25 patch. | ops | Cron + manual | 2026-08-05 |
| `~/.hermes/scripts/computer-use-health.sh` | Per `LEARNED_CUADRIVER_HEALTH.md` — checks cua-driver daemon liveness + AX tree reachability. | ops | Cron (every 10min) | 2026-07-30 |
| `~/.hermes/scripts/cuadriver-health-cron.sh` | Short-version cron wrapper for the CuaDriver health check (single-line verdict; no spam). Path fixed 2026-08-24 to `~/.hermes/profiles/ops/scripts/`. | ops | Cron (every 10min) | 2026-08-24 |
| `~/.hermes/scripts/gateway-health-check.sh` | Hermes gateway heartbeat; pinned for t_h_health_reporter card. | ops | Cron (every 5min) | 2026-07-15 |
| `~/.hermes/scripts/binance-health-check.sh` | Trading bot health check (binance-bot). Trading lane enforces PAPER_MODE guardrail. | trading | Cron (every 60s) | 2026-07-22 |
| `binance-bot/pre-start.js` | Safe-start architecture v1: 4-mode dispatcher (validate-only/health-only/paper/live). 7-signal LIVE gate. Only binance-bot-live in PM2. | trading | PM2 (binance-bot-live only) | 2026-08-25 |
| `binance-bot/ecosystem.config.cjs` | PM2 config: only binance-bot-live defined (autorestart=false). validate/health/paper are one-shot CLI. | trading | PM2 ecosystem | 2026-08-25 |
| `binance-bot/health-cron-wrapper.sh` | Safe health cron entry (9 AM + 9 PM PDT). Uses read-only health-check-real.js. Stale direct health-check.js entries retired 2026-08-25. | trading | Cron (9 AM/9 PM PDT) | 2026-08-25 |
| `~/.hermes/scripts/claude-cost-guardian.sh` | Claude budget cap watchdog — enforces daily ($5/$10) and 7-day ($20/$35) thresholds; silent on healthy days, Telegram alert on breach. Created by t_claude_cost_spike_forensics_and_guardrail_v1_20260824. | ops | Cron (every 4h) | 2026-08-24 |
| `~/.hermes/profiles/ops/scripts/provider_policy.py` | Provider firewall gate — blocks paid SDK init in non-interactive contexts (cron/pm2/launchagent/gateway-worker/self-heal); fails closed, auto-incident on violation. Created t_paid_model_background_regression_guard_v1_20260824. | ops | Called by all model-initializing jobs | 2026-08-24 |
| `~/.hermes/profiles/ops/scripts/regression_test_suite.py` | 28-test regression matrix — proves no paid provider reachable from any background context. Zero cost delta, all results in `~/.hermes/logs/regression_test_results.json`. Created t_paid_model_background_regression_guard_v1_20260824. | ops | Manual + cron (on change) | 2026-08-24 |
| `~/.hermes/profiles/ops/scripts/background_model_guard.py` | Drift scanner — scans cron jobs, PM2, LaunchAgents, env vars, scripts for prohibited providers or paid key exposure. Classifies: prohibited_provider, paid_key_exposed, direct_sdk_import, unpinned_route. Created t_paid_model_background_regression_guard_v1_20260824. | ops | Cron (daily) | 2026-08-24 |
| `~/.hermes/profiles/ops/scripts/key_containment_check.py` | Paid key scanner — checks active env, .env files, logs, PM2 configs, LaunchAgents for leaked keys. Skips `~/.hermes/secrets/` (expected). Created t_paid_model_background_regression_guard_v1_20260824. | ops | Cron (daily) | 2026-08-24 |
| `~/.hermes/profiles/ops/scripts/pre_change_scan.py` | Pre-change protection — runs before any change to protected files; auto-reverts if paid provider detected. Created t_paid_model_background_regression_guard_v1_20260824. | ops | Manual + card-driver | 2026-08-24 |
| `~/.hermes/scripts/pmd-health-watchdog.sh.orphaned-20260731` | **Retired** 2026-07-31 — superseded by per-service watchdogs + PM2 canon guard. Kept in inventory for audit trail. | ops | (none) | 2026-07-31 |
| `~/.hermes/scripts/gateway-health-monitor.sh.RETIRED-2026-05-21` | **Retired** 2026-05-21 — superseded by `gateway-health-check.sh`. | ops | (none) | 2026-05-21 |

## C. Memory + knowledge canon helpers

| Script | One-line justification | Lane | Trigger | Last audit |
|---|---|---|---|---|
| `~/.hermes/scripts/memory-health-check.py` | MEMORY.md + USER.md size guard per cap (2200 / 1375 chars); monthly audit log under `~/.hermes/knowledge/memory/`. | self-improvement | Cron (monthly 1st) | 2026-08-01 |
| `~/.hermes/scripts/hermes-canon-sync.sh` | Obsidian → GitHub mirror sync for `~/.hermes/knowledge/`. | knowledge-canon | Manual + cron (weekly Sun 06:00 PT) | 2026-08-05 |
| `~/.hermes/scripts/sync-canon-to-obsidian.sh` | Inverse mirror (GitHub → Obsidian) for round-trip recovery. | knowledge-canon | Manual | 2026-08-01 |
| `~/.hermes/scripts/deep-audit-cron.sh` | Periodic deep-audit card driver; iterates `LEARNED_*` docs for staleness. | qa-verification | Cron (weekly Sat 09:00 PT) | 2026-07-27 |

## D. Per-platform / service helpers

| Script | One-line justification | Lane | Trigger | Last audit |
|---|---|---|---|---|
| `~/.hermes/scripts/brave-cdp-watchdog.sh` | Re-attaches Long-Lived Brave CDP host if it goes dormant (per `long-lived-brave-cdp-host` skill). | ops | Cron (every 30min) | 2026-07-30 |
| `~/.hermes/scripts/travel-os-external-watchdog.sh` | Travel OS external-API health probe (sub-route routing per `LEARNED_TRAVELOS.md`). | travel | Cron (every 5min) | 2026-07-22 |
| `~/.hermes/scripts/regenerate-services-map.py` | Heartbeat: regenerate `SERVICES_MAP.md` + `SERVICES_MAP_SNAPSHOT_<date>.md` from Boss Hub registry (`~/Projects/boss-hub/registry/services-registry.yaml`); READ-ONLY on registry; silent on success, Telegram alert on failure. | knowledge-canon | Cron (daily 06:00 local) | 2026-08-06 |
| `~/.hermes/scripts/regenerate-services-map.sh.RETIRED-2026-08-06` | **Retired** 2026-08-06 — initial bash/yq design-only shim superseded by Python+PyYAML implementation (`regenerate-services-map.py`). | (none) | (none) | 2026-08-06 |

---

## How to add a new helper (Permanent 2026-08-06)

1. Pick the section above (or open a new one if the script class isn't covered).
2. Add a row with: name, one-line justification, lane owner, trigger, last-audit date.
3. Justification MUST answer: "why is this script *needed* and *not* a one-shot terminal command?"
4. If the helper is **cron-driven**, you need a V3 carve-out kanban card + Marcelo approval (per the global cron policy + Rule #7).
5. If the helper is **on-demand** (card-driver or manual), no carve-out — just add the row.
6. Mirror to Obsidian at the next `hermes-canon-sync.sh` run.

## How to retire a helper (Permanent)

Rename the file to `original-name.RETIRED-<YYYY-MM-DD>`. Add a row under the appropriate section with the retirement date. Don't delete — preserve for at least 90 days in case the consumer still references it.

## Drift signals

- New helper script appears in `~/.hermes/scripts/` with no row in this inventory → `t_drift_automation_inventory_<date>` card.
- Cron entry references a helper not in inventory → same drift card.
- A helper's last-audit date is > 90 days stale → knowledge-canon opens a `t_re-audit_<helper>` card.
- A `.RETIRED-*` marker with no row → drift card pointing at the user-facing harm.

---

*Owner: knowledge-canon lane. Mirror sync target: Obsidian `Hermes/automation-inventory.md`.*



