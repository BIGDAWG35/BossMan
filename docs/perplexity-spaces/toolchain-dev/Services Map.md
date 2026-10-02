**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Projects/boss-hub/registry/services-registry.yaml` (2026-09-30 19:39) + `~/.pm2/dump.pm2` (2026-09-30 19:36) · **Status:** Current — space-only doc: this copy is the canon (edit here)

# Services Map — v4 (2026-10-01)

Single source of truth for what runs on the Mac Studio. Rebuilt from the Boss Hub registry and the saved PM2 state. Replaces every older "Services Map — Obsidian (live mirror)" copy.

## PM2 apps online (17)

| PM2 name | Port | What it is | Project dir |
|---|---|---|---|
| travel-os | 3537 | Travel OS (canonical port; leave alone) | ~/Projects/travel-os-dashboard |
| pmd-web | 7575 (0.0.0.0, iPhone LAN) | Property Management Dashboard web | ~/Projects/property-management-dashboard/web |
| pmd-api | 7576 | Property Management Dashboard API | ~/Projects/property-management-dashboard |
| client-hub | 8050 | Client Hub | ~/Projects/client-hub |
| money-pipeline | 8020 | Money Pipeline v2 | ~/Projects/money-making-dashboard |
| trading-control | 8130 | Trading Control | ~/Projects/trading-control |
| youtube-dashboard | 8140 | YouTube Dashboard | ~/Projects/youtube-dashboard |
| budgeting-software | 8145 | Budgeting Software (Pilot IT) | ~/Projects/budgeting |
| csdawg-dashboard | 8150 | CSDAWG Dashboard | ~/Projects/csdawg-dashboard |
| boss-hub-internal | 8160 | Boss Hub (internal) | ~/Projects/boss-hub |
| boss-hub-external | 8161 | Boss Hub (Tailscale) | ~/Projects/boss-hub |
| bakery | 3002 | Bakery | ~/Projects/bakery |
| ca-lottery-dashboard | 8536 | CA Lottery Dashboard | ~/Projects/ca-lottery-analytics |
| overview | 8000 | Master Dashboard | ~/Projects/master-dashboard |
| ticketflow-web | 8888 | TicketFlow web | ~/Projects/ticketflow/web |
| content-os | 3001 | Content OS (Crypto & AI Studio) | ~/Projects/crypto-ai-studio-content-os |
| cloudflare-tunnel | — | cloudflared quick tunnel → http://127.0.0.1:8030 | /tmp |

## Registered but not running (by design)

| Name | Port | PM2 name | State |
|---|---|---|---|
| Binance Bot (CSdawgbot) | 8104 | binance-bot-live | See "Binance Bot - Current State.md" in Trading Ops |
| SquarePayouts | 8030 | squarepayouts | Private QA; not running. The cloudflare-tunnel points at it, so the tunnel serves nothing until SquarePayouts runs (decision below) |

## Stale registry entries (to remove from the registry)

| Name | Port | Why stale |
|---|---|---|
| Health OS V4 | 3535 | Deleted 2026-09-30 (Marcelo-approved) |
| Health Dashboard | 8110 | No PM2 app |
| Fresh Dashboard | 5050 | Not in PM2 |
| Test Stub Dashboard | 9999 | Test entry |
| BakeryOps | 3001 | No PM2 app; port collides with content-os |

## Hermes endpoints

- Hermes gateway API (default profile): http://127.0.0.1:8642 — profile APIs are path-routed, e.g. ops at http://127.0.0.1:8642/p/ops/v1/
- Ollama: http://127.0.0.1:11434 (fallback model qwen3.5:35b-a3b-nvfp4 since 2026-10-02, 128K ctx; light pinned jobs qwen2.5:7b)
- Remote access: Tailscale (LAN + tailnet only for private apps)

## Open decision

- cloudflare-tunnel: keep (only useful when SquarePayouts runs) or stop it until SquarePayouts QA resumes.

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
