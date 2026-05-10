# Active Projects — Full List

**Source:** Phase 1 audit, Basecamp, SERVICES_MAP.md
**Status:** Active

---

## Revenue-Generating Apps (Public)

### SquarePayouts — Sports Betting Pool
| Attribute | Value |
|-----------|-------|
| Port | 3100 |
| PM2 Name | `squarepayouts` |
| Basecamp Project | Yes — testing guide + checklist pinned |
| Type | Next.js web app |
| Purpose | Sports betting pool management |
| Status | ✅ Active — 6D uptime |
| GitHub | `BIGDAWG35/Squares` (private) |

**Revenue:** Part of Marcelo's revenue stream — not client work.

---

### BakeryOps — Home Bakery Business
| Attribute | Value |
|-----------|-------|
| Port | 3001 |
| PM2 Name | `bakery` |
| Basecamp Project | Yes — testing guide + checklist pinned |
| Type | Next.js web app |
| Purpose | Home bakery business management |
| Status | ✅ Active — 6D uptime |

**Revenue:** Home bakery business — Marcelo's own venture.

---

### Money Pipeline / Crypto Tracker
| Attribute | Value |
|-----------|-------|
| Port | 8020 |
| PM2 Name | `money-pipeline` |
| Type | Node.js web |
| Purpose | Crypto tracking + market research |
| Status | ⚠️ Active — 8 restarts, monitor |
| Phase | Phase 6 target (rebuild planned) |

---

## Trading Bots

### Binance Bot
| Attribute | Value |
|-----------|-------|
| Port | 8104 |
| PM2 Name | `binance-bot` |
| Status | 🔴 STOPPED — pre-trade-hook missing |
| Profit Target | $3,000/month |
| Phase | Phase 6 Track B (awaiting approval) |

### Kraken Bot
| Attribute | Value |
|-----------|-------|
| Port | 8106 |
| Status | ⚠️ Needs verification |
| Profit Target | $1,500/month |

---

## Dashboard Apps (Internal Tools)

| App | Port | PM2 Name | Status |
|-----|------|----------|--------|
| Fresh dashboard | 5050 | `fresh-dashboard` | ✅ Active |
| OpenClaw hub | 8090 | `hub` | ✅ Active |
| Overview dashboard | 8100 | `overview` | ✅ Active |
| Health dashboard | 8110 | `health-dashboard` | ✅ Active |
| Trading control | 8130 | `trading-control` | ✅ Active |
| YouTube dashboard | 8140 | `youtube-dashboard` | ✅ Active |

---

## Phase Projects

| Phase | Card | Status |
|-------|------|--------|
| Phase 6 | `t_71fdab1a` — Money Pipeline rebuild | 🔴 Blocked — finance data needed |
| Phase 6 | `t_faa6d371` — Binance bot fix | 🔴 Blocked — needs approval |
| Phase 7 | Perplexity Spaces | ✅ Complete (SETUP.md only — content being added) |
| Phase 7 | PM Dashboard retirement | ⚠️ Effectively moot (port 5000 offline) |

---

## Project Health Summary

| Category | Count | Healthy | Warning | Critical |
|----------|-------|---------|---------|----------|
| Revenue apps | 3 | 2 | 1 | 0 |
| Trading bots | 2 | 0 | 1 | 1 |
| Dashboards | 6 | 6 | 0 | 0 |
| **Total** | **11** | **8** | **2** | **1** |

---

## Related Files

- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map
- `~/.hermes/knowledge/PHASE1_AUDIT_REPORT.md` — Full audit
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — Phase roadmap