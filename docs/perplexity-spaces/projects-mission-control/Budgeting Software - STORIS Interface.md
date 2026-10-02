**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/projects-mission-control/PROJ-2026-07_budgeting-software/STORIS_INTERFACE.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BudgetingSoftware — Phase 2 STORIS Interface

**Phase:** 2 of 10
**Date:** 2026-07-21
**Parent:** `ARCHITECTURE.md` + `DB_SCHEMA.md`
**Status:** STORIS interface locked 2026-07-21 (Phase 2 closed; Phase 3 MVP live 2026-07-22; Phase 4+ paused)

---

## 1. Goals

Per Q3.1 + Q3.2 (Marcelo 2026-07-21):
- Build the app **STORIS-aware from day 1** so Phase 7 is config-swap, not rewrite
- **Don't block Phase 2/3** on live STORIS creds — use a `MockStorisClient` that returns fixtures
- When sandbox creds arrive, swap to `RealStorisClient` via env var (`STORIS_MODE=real`)

## 2. Interface contract

`server/lib/storis-client.js`:

```js
// server/lib/storis-client.js
//
// StorisClient — the canonical interface STORIS-aware code talks to.
// Two implementations:
//   - MockStorisClient (default in v1, returns fixture data)
//   - RealStorisClient (Phase 7, talks to https://api.storis.com via STORIS_API_BASE_URL)
//
// Usage:
//   const sc = require('./lib/storis-client').getStorisClient();
//   const budgets = await sc.getBudgets({ fiscalYear: 2026 });
//   const summary = await sc.getSummary({ fiscalYear: 2026 });
//
// All methods return the same shape regardless of mode.
// All methods are async and may throw StorisClientError on failure.

class StorisClient {
  // --- Auth ---
  async authenticate() { /* returns { token, expiresAt } */ }

  // --- System ---
  async getSystemInfo() { /* returns { u2Version, apiControlSettings, activeSubmodules } */ }
  async getSystemSettings({ settingGroupType = 1 } = {}) { /* returns GLSettings { accountDelimiter, accountMask, ... } */ }
  async getRateLimits() { /* returns Array<{ endpoint, timePeriod, limit }> + whiteList */ }

  // --- General Ledger (budget data) ---
  async getBudgets({ fiscalYear }) { /* returns Array<GLBudget { accountId, fiscalYear, budgetId, period1..12 }> */ }
  async getSummary({ fiscalYear }) { /* returns Array<GLSummary { accountId, periods[] }> */ }
  async searchHistory({ fromDate, toDate, accountId, page = 1, pageSize = 100 }) { /* returns Array<GLItem> */ }

  // --- Reporting ---
  async getDailySalesData({ fromDate, toDate }) { /* returns Array<DailySalesData> */ }

  // --- Health ---
  async healthCheck() { /* returns { ok: true, version: ... } */ }
}

class StorisClientError extends Error {
  constructor(message, { code, transactionId, httpStatus } = {}) {
    super(message);
    this.code = code;                    // 'auth_failed' | 'rate_limited' | 'network' | 'parse' | 'unexpected'
    this.transactionId = transactionId;  // from STORIS response wrapper
    this.httpStatus = httpStatus;
  }
}

function getStorisClient() {
  if (process.env.STORIS_MODE === 'real') {
    return require('./real-storis');
  }
  return require('./mock-storis');
}

module.exports = { StorisClient, StorisClientError, getStorisClient };
```

## 3. MockStorisClient — fixture strategy

`server/lib/mock-storis.js` returns deterministic fixtures so the app can develop + run the pilot without live STORIS.

```js
// server/lib/mock-storis.js
const { StorisClient, StorisClientError } = require('./storis-client');
const fs = require('fs');
const path = require('path');

const FIXTURES_DIR = path.join(__dirname, '..', '..', 'test', 'fixtures');

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, 'mock-storis', `${name}.json`), 'utf8'));
}

class MockStorisClient extends StorisClient {
  async authenticate() {
    return { token: 'mock-token-' + Date.now(), expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  }
  async getSystemInfo() {
    return loadFixture('system-info');
  }
  async getSystemSettings({ settingGroupType = 1 } = {}) {
    return loadFixture('system-settings');
  }
  async getRateLimits() {
    return loadFixture('rate-limits');
  }
  async getBudgets({ fiscalYear }) {
    return loadFixture(`budgets-${fiscalYear}`);
  }
  async getSummary({ fiscalYear }) {
    return loadFixture(`summary-${fiscalYear}`);
  }
  async searchHistory({ fromDate, toDate, accountId }) {
    return loadFixture('search-history-sample');
  }
  async getDailySalesData({ fromDate, toDate }) {
    return loadFixture('daily-sales-sample');
  }
  async healthCheck() {
    return { ok: true, version: 'mock-1.0.0', mode: 'mock' };
  }
}

module.exports = new MockStorisClient();
```

**Fixtures location:** `test/fixtures/mock-storis/`

```
budgets-2024.json
budgets-2025.json
budgets-2026.json
summary-2024.json
summary-2025.json
summary-2026.json
system-info.json
system-settings.json          # contains accountDelimiter: '-', accountMask: 'NNNN'
rate-limits.json
search-history-sample.json
daily-sales-sample.json
```

**Initial fixtures** are hand-curated from the pilot Company's reference data (`INFO.md` 2026 totals) and the 13-Department table. Each `budgets-2026.json` row corresponds to a `line_items` row in our schema.

## 4. RealStorisClient — Phase 7

`server/lib/real-storis.js` — placeholder, defined when sandbox creds arrive. Phase 2 deliverable: stub with TODO markers.

```js
// server/lib/real-storis.js — Phase 7 implementation
//
// Implements the real HTTP client against STORIS API v4.
// Auth: Basic auth → POST /api/authenticate/user → bearer token
// Token cache: ~/.storis-cache/token.json (mode 0600)
// Refresh: at 90% of expiry (expires_in is in DAYS per LEARNED_STORIS_API.md §2)
//
// All 9 endpoints from the interface above are wired here.
// Rate limit handling: respect per-endpoint limits from getRateLimits(), throttle to 80%
// Pagination: handle ?Page=N&PageSize=M (most), ?PageNumber=N (4 endpoints), ?JobId=... (chunked)
// Response: every response is wrapped in StorisApiResponse — check .success, unwrap .data
//
// Source of truth for shape: ~/.hermes/knowledge/STORIS_API_REFERENCE.md
// Open questions to confirm with STORIS integrator:
//   1. Base URL?
//   2. accountDelimiter + accountMask for the pilot tenant?
//   3. Budget endpoint read-only or writable?

class RealStorisClient extends StorisClient {
  // STUB: implemented in Phase 7
}

module.exports = new RealStorisClient();
```

## 5. Settings cache (`storis_settings` table)

Per Q3.3, never hardcode the `accountDelimiter` or `accountMask`. Read from STORIS at startup, cache in DB.

```js
// server/lib/storis-settings.js
const { getStorisClient } = require('./storis-client');
const db = require('../db');

async function refreshStorisSettings() {
  const sc = getStorisClient();
  const sysInfo = await sc.getSystemInfo();
  const sysSettings = await sc.getSystemSettings({ settingGroupType: 1 });

  const settings = [
    { key: 'u2Version',         value: sysInfo.u2Version },
    { key: 'accountDelimiter',   value: sysSettings.accountDelimiter },
    { key: 'accountMask',       value: sysSettings.accountMask },
    { key: 'fiscalYearStart',   value: sysSettings.fiscalYearStart },
    // ...
  ];

  const now = Math.floor(Date.now() / 1000);
  const upsert = db.prepare(`
    INSERT INTO storis_settings (id, company_id, setting_key, setting_value, source, fetched_at)
    VALUES (@id, @company_id, @setting_key, @setting_value, @source, @fetched_at)
    ON CONFLICT(company_id, setting_key) DO UPDATE SET
      setting_value = excluded.setting_value,
      source = excluded.source,
      fetched_at = excluded.fetched_at
  `);

  for (const s of settings) {
    upsert.run({
      id: uuid(),
      company_id: process.env.STORIS_COMPANY_ID,  // single-tenant v1
      setting_key: s.key,
      setting_value: s.value,
      source: 'system_settings',
      fetched_at: now,
    });
  }
}

function getStorisSetting(key) {
  const row = db.prepare(`
    SELECT setting_value FROM storis_settings
    WHERE company_id = ? AND setting_key = ? AND fetched_at > ?
  `).get(process.env.STORIS_COMPANY_ID, key, Math.floor(Date.now() / 1000) - 24 * 3600);
  return row?.setting_value;
}

module.exports = { refreshStorisSettings, getStorisSetting };
```

**Cache TTL:** 24 hours. Refreshed by the daily cron (`storis-daily-sync.js`).

## 6. GL data cache (`storis_cache` table)

```js
// In server/scripts/storis-daily-sync.js (Phase 7)
const sc = getStorisClient();
const fiscalYear = new Date().getFullYear();

const budgets = await sc.getBudgets({ fiscalYear });
db.prepare(`
  INSERT INTO storis_cache (id, company_id, fiscal_year, data_type, payload_json, fetched_at)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(company_id, fiscal_year, data_type) DO UPDATE SET
    payload_json = excluded.payload_json,
    fetched_at = excluded.fetched_at
`).run(uuid(), companyId, fiscalYear, 'budgets', JSON.stringify(budgets), Math.floor(Date.now() / 1000));

const summary = await sc.getSummary({ fiscalYear });
// ... same pattern with data_type = 'summary'
```

The UI reads `storis_cache` for the "STORIS comparison" view (Phase 7).

## 7. Sandbox creds — when they arrive

When Marcelo provides STORIS sandbox creds:

1. Add to `.env`:
   ```
   STORIS_MODE=real
   STORIS_API_BASE_URL=https://<sandbox>.storis.com
   STORIS_API_USER=<user>
   STORIS_API_SECRET=<secret>
   ```
2. Implement `server/lib/real-storis.js` (per the Phase 7 stub)
3. Run `node -e "require('./lib/storis-client').getStorisClient().getSystemInfo().then(console.log)"` to verify the auth + the unusual `model` header pattern
4. Confirm `accountDelimiter` + `accountMask` from `getSystemSettings` — flush to `storis_settings` table
5. Run `node scripts/storis-daily-sync.js` manually to verify the daily cron will work
6. Update `LEARNED_STORIS_API.md` with the live observations (R1 mitigation)

**No code change** beyond `real-storis.js` — the interface is locked.

## 8. Failure handling

```js
// When RealStorisClient hits a failure, it must:
//   1. Log to storis_cache with data_type='error_log' (so we have a historical record)
//   2. Throw StorisClientError with the right code
//   3. NOT crash the calling route — the caller catches and falls back to cache
//
// Caller pattern:
//   try {
//     const fresh = await sc.getBudgets({ fiscalYear });
//     cache.put('budgets', fresh);
//     return fresh;
//   } catch (err) {
//     console.error('STORIS live fetch failed, serving from cache:', err.message);
//     return cache.get('budgets');  // last known good
//   }
```

## 9. Phase 2 deliverables checklist

- [x] `server/lib/storis-client.js` — interface contract + `getStorisClient()` factory
- [x] `server/lib/mock-storis.js` — fixture-backed implementation
- [x] `server/lib/real-storis.js` — Phase 7 stub with TODOs
- [x] `server/lib/storis-settings.js` — refresh + read helpers
- [x] `test/fixtures/mock-storis/` — fixture JSONs (created in Phase 3, hand-curated from INFO.md)
- [ ] **Phase 3 deliverable:** install `xlsx` + `csv-parse` + `node-fetch` npm deps
- [ ] **Phase 7 deliverable:** implement `real-storis.js` + live API smoke test

## 10. Open questions (carry into Phase 7 kickoff)

When STORIS sandbox creds arrive, confirm:
1. Base URL (live + sandbox)
2. `accountDelimiter` + `accountMask` for the pilot tenant
3. Whether the budget endpoint is writable (LEARNED §10 says probably not — confirm)
4. Pagination strategy: do they prefer `?Page=N&PageSize=M` or `?UpdatedAt=ISO` delta sync?
5. Webhooks: do they support event subscription? (out of scope for v1, but useful for Phase 7+)

---

**Status:** STORIS interface locked. Phase 3 can build against `MockStorisClient`; Phase 7 swaps the implementation.