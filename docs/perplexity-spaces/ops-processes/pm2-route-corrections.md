# PM2 Canonical Route Corrections

## Discovered 2026-05-28 during health check

The skill doc has 2 wrong canonical routes. These are DOCUMENTATION errors only — the services themselves are healthy.

| Service | Port | Skill Says | Actual Working Route |
|---|---|---|---|
| binance-bot | 8104 | `/health` (404) | `/api/health` (200) |
| bakery | 3001 | `/api/health` (404) | `/` (200, root HTML) — NO dedicated health endpoint exists |

### Verified facts:
- **binance-bot (port 8104)**: Express app serving CSdawgbot Phase 4 Dashboard (HTML). `/api/health` returns 200. `/health` doesn't exist.
- **bakery (port 3001)**: Express app (bakery-pwa). No health endpoint implemented. Root `/` returns 200 (serves public/index.html).

### All other routes verified correct:
- client-hub 8050/login → 200 ✅
- squarepayouts 8030/login → 200 ✅
- money-pipeline 8020/api/health → 200 ✅
- csdawg-dashboard 8150/ → 200 ✅
- overview 8100/ → 200 ✅
- quick-stats 8102/ → 200 ✅
- health-dashboard 8110/ → 200 ✅
- hub 8090/ → 200 ✅
- fresh-dashboard 5050/ → 200 ✅
