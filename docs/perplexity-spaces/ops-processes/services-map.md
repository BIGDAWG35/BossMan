# SERVICES_MAP_SNAPSHOT_2026-08-19.md — Auto-Generated

**Generated:** 2026-08-19 (heartbeat cron `0 6 * * *`)
**Source of truth:** `/Users/bigdawg/Projects/boss-hub/registry/services-registry.yaml`
**Registry SHA-256:** `883e0549471b2c752f4891e1a5362d3b5e0aa4fc724f0d3630b02f744abf9289`
**Service count:** 17
**Lifecycle breakdown:** {'active': 16, 'offline': 1}

---

## Services by Category

### Client (1 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| client-hub | Client Hub | 8050 | client-hub | live | active | persistent |

### Dashboard (7 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| travel-os | Travel OS | 3537 | travel-os | online | active | persistent |
| fresh-dashboard | Fresh Dashboard | 5050 | fresh-dashboard | live | active | tracked_only |
| health-dashboard | Health Dashboard | 8110 | health-dashboard | offline | active | persistent |
| youtube-dashboard | YouTube Dashboard | 8140 | youtube-dashboard | offline | active | persistent |
| pmd-web | Property Management Dashboard (Web) | 7575 | pmd-web | online | active | persistent |
| csdawg-dashboard | CSDAWG Dashboard | 8150 | csdawg-dashboard | offline | active | persistent |
| health-os-v4 | Health OS V4 (luxury health concierge) | 3535 | health-os-v4 | online | active | persistent |

### Finance (1 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| budgeting-software | BudgetingSoftware (Pilot IT) | 8145 | budgeting-software | online | active | persistent |

### Other (3 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| pmd-api | Property Management Dashboard (API) | 7576 | pmd-api | planned | offline | persistent |
| boss-hub-internal | Boss Hub (Internal) | 8160 | boss-hub-internal | unknown | active | persistent |
| boss-hub-external | Boss Hub (External/Tailscale) | 8161 | boss-hub-external | unknown | active | persistent |

### Revenue App (3 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| money-pipeline | Money Pipeline | 8020 | money-pipeline | live | active | persistent |
| squarepayouts | SquarePayouts | 8030 | squarepayouts | live | active | persistent |
| bakery | Bakery | 3001 | bakery | unknown | active | persistent |

### Trading (2 service(s))

| slug | name | port | pm2_name | status_hint | lifecycle | run_mode |
| --- | --- | --- | --- | --- | --- | --- |
| binance-bot | Binance Bot (CSdawgbot) | 8104 | binance-bot | live | active | persistent |
| trading-control | Trading Control | 8130 | trading-control | offline | active | persistent |

## PM2-Managed Services

| pm2_name | name | port | pm2_cwd | status_hint | lifecycle |
| --- | --- | --- | --- | --- | --- |
| travel-os | Travel OS | 3537 | /Users/bigdawg/Projects/travel-os-dashboard | online | active |
| client-hub | Client Hub | 8050 | /Users/bigdawg/Projects/client-hub | live | active |
| binance-bot | Binance Bot (CSdawgbot) | 8104 | /Users/bigdawg/Projects/binance-bot | live | active |
| money-pipeline | Money Pipeline | 8020 | /Users/bigdawg/Projects/money-making-dashboard | live | active |
| squarepayouts | SquarePayouts | 8030 | /Users/bigdawg/Projects/squarepayouts | live | active |
| fresh-dashboard | Fresh Dashboard | 5050 | /Users/bigdawg/Projects/fresh-dashboard | live | active |
| health-dashboard | Health Dashboard | 8110 | /Users/bigdawg/Projects/health-dashboard | offline | active |
| trading-control | Trading Control | 8130 | /Users/bigdawg/Projects/trading-control | offline | active |
| budgeting-software | BudgetingSoftware (Pilot IT) | 8145 | /Users/bigdawg/Projects/budgeting | online | active |
| youtube-dashboard | YouTube Dashboard | 8140 | /Users/bigdawg/Projects/youtube-dashboard | offline | active |
| pmd-web | Property Management Dashboard (Web) | 7575 | /Users/bigdawg/Projects/property-management-dashboard/web | online | active |
| pmd-api | Property Management Dashboard (API) | 7576 | /Users/bigdawg/Projects/property-management-dashboard | planned | offline |
| csdawg-dashboard | CSDAWG Dashboard | 8150 | /Users/bigdawg/Projects/csdawg-dashboard | offline | active |
| boss-hub-internal | Boss Hub (Internal) | 8160 | /Users/bigdawg/Projects/boss-hub | unknown | active |
| boss-hub-external | Boss Hub (External/Tailscale) | 8161 | /Users/bigdawg/Projects/boss-hub | unknown | active |
| bakery | Bakery | 3001 | /Users/bigdawg/Projects/bakery | unknown | active |
| health-os-v4 | Health OS V4 (luxury health concierge) | 3535 | /Users/bigdawg/Projects/health-os-v4 | online | active |

## LaunchAgent-Managed Services

_No LaunchAgent-managed services in registry._

## Externally Exposed Services

| name | port | external_url | status_hint |
| --- | --- | --- | --- |
| Client Hub | 8050 | https://bigdawgs-mac-mini-2.tailed3212.ts.net/client-hub | live |
| Binance Bot (CSdawgbot) | 8104 | https://bigdawgs-mac-mini-2.tailed3212.ts.net/binance-bot | live |
| Money Pipeline | 8020 | https://bigdawgs-mac-mini-2.tailed3212.ts.net/money-pipeline | live |

## Health Check Endpoints

| name | port | method | path | expect | timeout_ms |
| --- | --- | --- | --- | --- | --- |
| Travel OS | 3537 | GET | / | 200 | 2000 |
| Client Hub | 8050 | GET | / | 30x | 2000 |
| Binance Bot (CSdawgbot) | 8104 | GET | /api/health | 200 | 2000 |
| Money Pipeline | 8020 | GET | /api/health | 200 | 2000 |
| SquarePayouts | 8030 | GET | / | 200 | 2000 |
| Fresh Dashboard | 5050 | GET | /api/health | 200 | 2000 |
| Health Dashboard | 8110 | GET | / | 200 | 2000 |
| Trading Control | 8130 | GET | /api/health | 200 | 2000 |
| BudgetingSoftware (Pilot IT) | 8145 | GET | /health | 200 | 5000 |
| YouTube Dashboard | 8140 | GET | / | 200 | 2000 |
| Property Management Dashboard (Web) | 7575 | GET | /portfolio | 200 | 5000 |
| Property Management Dashboard (API) | 7576 | GET | /api/health | 200 | 2000 |
| CSDAWG Dashboard | 8150 | GET | / | 200 | 2000 |
| Boss Hub (Internal) | 8160 | GET | /healthz | 200 | 2000 |
| Boss Hub (External/Tailscale) | 8161 | GET | /healthz | 200 | 2000 |
| Bakery | 3001 | GET | / | 200 | 2000 |
| Health OS V4 (luxury health concierge) | 3535 | GET | /health-os/v4/ | 200 | 5000 |

---

**Auto-generated by:** `~/.hermes/scripts/regenerate-services-map.py`
**Heartbeat cron:** `0 6 * * *` (daily 06:00 local, no-agent mode)
**Card reference:** `~/.hermes/cron/output/t_heartbeat_wire_v1_20260806.md`

DO NOT EDIT — this file is regenerated every 24 hours from the registry.
