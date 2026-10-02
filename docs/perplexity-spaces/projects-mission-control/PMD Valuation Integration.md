**Version:** v4 · **Date:** 2026-07-27 · **Source:** `~/.hermes/knowledge/LEARNED_PMD_VALUATION_INTEGRATION.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# PMD Valuation Integration — LEARNED (2026-07-21)
**Version:** v1.0
**Date:** 2026-07-21
**Owner:** BossMan Hermes
**Status:** Canonical — learned facts from the PMD valuation integration execution
**Source of truth:** kanban card `t_pmd_valuation_integration_execution_20260721`

---

## What happened

PMD was `STABLE BUT PARTIALLY BLIND (valuation)` — uptime + truthfulness both verified by
Step-5 verdict `step5-verdict-pmd-restore-20260716.json` PASS. MV / rent-comp cells rendered
"Unavailable" because no live provider integration was wired. Marcelo approved an execution
pass to wire ATTOM as primary provider.

## Provider research summary

| Provider | Self-serve? | Pricing band | Coverage | Verdict |
|---|---|---|---|---|
| **Zillow (Bridge Interactive)** | No public API | Negotiated commercial | Likely covers JAX/PHX | **Rejected** — commercial overhead too high for 4-property scale |
| **HouseCanary** | Sales approval | Basic $190/yr → Teams $1,990/yr + usage overages (opaque) | Nationwide | Conditional — viable, kept on bench |
| **ATTOM Data** | **Yes — free dev key** | Sub-$200/mo (needs sales quote) | 99% U.S. population | **Selected — primary** |

Source URLs (per research):
- https://www.zillowgroup.com/bridge/
- https://api-docs.housecanary.com/
- https://www.housecanary.com/pricing
- https://www.attomdata.com/solutions/delivery/property-data-api/
- https://www.attomdata.com/solutions/ai-powered/valuation-analytics/avm/

## Architectural decisions

1. **Zero schema changes.** The existing `market_value_snapshots` + `rent_comp_snapshots`
   + `provider_health` tables + `formulas/equity.js` + `entities/marketValue.js`
   `VALID_PROVIDERS` whitelist already enforce truthfulness. Stub provider names
   (`Stub*`) are filtered out of the live chain via `allow_stub_estimates=false`.

2. **Real client in the existing stub file.** `server/providers/attom.js` keeps the
   `ProviderClient` interface and changes its self-id from `StubATTOM` → `ATTOM`.
   No new file. The fallback chain (already keyed by `provider_order`) routes the
   `ATTOM` entry to the live client automatically.

3. **Fallback chain order.** `settings.provider_order` updated from `["Zillow","HouseCanary","ATTOM"]`
   to `["ATTOM"]` (Zillow dropped per Marcelo decision). Default in
   `server/providers/fallback.js` updated to match.

4. **One active mortgage per property.** PMD's `mortgages` table has
   `uq_mortgages_one_active` UNIQUE INDEX. No schema change. For 17th St + Midway
   we insert a single canonical Chase row each (no HELOC modeled yet — deferred).

5. **Refresh cron, deliver local.** `20d51fba150d` runs daily at 6 AM PDT via
   `~/.hermes/scripts/pmd-valuation-refresh.sh`. Wrapper is a thin shim over the
   existing `scripts/refresh-market-data.cjs`. No provider logic in the wrapper.
   Cron is silent when healthy (writes to `~/.hermes/logs/pmd-valuation-refresh-<date>.log`).

6. **Env var hardening.** Wrapper reads `~/.hermes/.env` line-by-line, only
   exports the keys it needs (`ATTOM_API_KEY`, `PMD_BASE_URL`, `PMD_*_SKIP_HOURS`,
   `PMD_JITTER_MS`). This avoids triggering on malformed lines elsewhere in
   `.env` (e.g. the `Chrome.app/Contents/MacOS/Google: No such file or directory`
   path error that the naive `set -a; . ~/.hermes/.env; set +a` produces).

## Truthfulness guarantees (preserved)

- `is_live=0` is the safe default in `entities/marketValue.js#createSnapshot`. Any
  provider that forgets `is_live=true` writes a stub-labeled snapshot.
- `VALID_PROVIDERS = ['Zillow', 'HouseCanary', 'ATTOM', 'ManualOverride']` blocks
  stub names from being written as live.
- `allow_stub_estimates=false` (default in settings) drops Stub* clients from the
  fallback chain before they can be tried.
- `formulas/equity.js#computeEquity` returns `null` equity/LTV when MV is missing
  or stale. UI renders "Unavailable".
- Cron `pmd-valuation-refresh` marks latest snapshot `is_stale=1` when all providers
  fail, propagating "Unavailable" everywhere consistently.

## What still requires Marcelo

- **ATTOM dev API key.** Sign up at https://www.attomdata.com/solutions/delivery/property-data-api/
  (free). Add to `~/.hermes/.env` as `ATTOM_API_KEY=<value>`. Restart `pmd-api` via `pm2 restart pmd-api`.
  Cron will then start populating real MV/RC snapshots on its next 6 AM run, or
  immediately via `bash ~/.hermes/scripts/pmd-valuation-refresh.sh`.

## Files changed (2026-07-21)

- `server/providers/attom.js` — replaced StubATTOM body with real v4 client (sub-agent delegation)
- `server/providers/fallback.js` — default `provider_order` updated to `['ATTOM']`
- `data/pmd.db` — 2 new mortgage rows (17th St Chase, Midway Chase)
- `data/pmd.db.bak-pre-chase-insert-20260721` — pre-insert backup
- `~/.hermes/scripts/pmd-valuation-refresh.sh` — new cron wrapper (created)
- V3 mirrors: `ops-processes/Automation Inventory — v3.md`,
  `system-health/Automation Inventory — v3.md`,
  `shared/Automation Inventory — v3 (Shared) — v3.md`,
  `projects-mission-control/Property Management Dashboard — Project Overview — v3.md`
- Settings row `provider_order`: `["Zillow","HouseCanary","ATTOM"]` → `["ATTOM"]`
- New Hermes cron `20d51fba150d` (PMD valuation refresh, daily 6 AM, deliver local)

## Cross-references

- `t_pmd_valuation_integration_20260721` — planning card (done)
- `t_pmd_valuation_integration_execution_20260721` — execution card (running)
- `step5-verdict-pmd-restore-20260716.json` — prior Step-5 PASS
- `~/.hermes/logs/pmd-valuation-refresh-<date>.log` — daily cron output
- `~/.hermes/scripts/pmd-valuation-refresh.sh` — wrapper script
- **`~/.hermes/knowledge/PMD_RENT_COMP_SNAPSHOT_2026-07-27.md`** — read-only freeze of current rent-comp/market-value state taken BEFORE the "rent comps way off" investigation; re-runnable via `scripts/export-rent-comp-snapshot.mjs`. SHA256: `dbdfa528ee18e204045c8f4dcfe6a6dd2adba1dc8d1106d848e4355810bdec6d`. Restore path documented inside the snapshot file.
- **`~/.hermes/knowledge/PMD_RENT_COMP_FIX_REPORT_2026-07-27.md`** — Stage 2 post-fix report: ATTOM rentalAVM is uncalibrated for all 4 PMD properties (10–55% under market per Perplexity ground truth); 3 rows marked `is_stale=1` + `comparables_count=NULL`; `/api/rent-comp-snapshots` and `/api/market-value-snapshots` repaired (cross-property `listAll()` added to `server/entities/{rentComp,marketValue}.js`); pre-fix DB at `data/pmd.db.pre-stage2-fix-2026-07-27`. SHA256: `1a82106c9329d65d2f4c86a5cbedf70151761219af478bd6a905ffe26845926c`.
