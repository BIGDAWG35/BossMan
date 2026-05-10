# Blocker Resolutions — Phase 1 Findings

**Source:** `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md`
**Status:** Resolved where noted — Phase 6 still pending

---

## Blocker 1 — Binance Bot Pre-Trade-Hook

**Status:** 🔴 NOT RESOLVED — Binance bot STOPPED but hook not restored

**What happened:**
- Phase 1 identified missing pre-trade-hook module at `/Projects/trading-review/pre-trade-hook`
- Bot was actively trading WITHOUT pre-trade review (hook was log-only non-blocking)
- Recommendation: STOP the bot until Phase 2 restoration

**What actually happened:**
- Binance bot was STOPPED (confirmed in SERVICES_MAP as STOPPED as of 2026-05-07)
- Pre-trade-hook has NOT been restored
- Phase 6 Track B (`t_faa6d371`) is the restoration plan

**Current state:** Bot remains STOPPED. Phase 6 Track B awaiting Marcelo approval.

---

## Blocker 2 — Port 3001 Conflict (Hermes vs Bakery)

**Status:** ✅ RESOLVED

**What happened:**
- Phase 1 assumed Hermes gateway wanted port 3001
- Found: Bakery owns 3001 as a Next.js web app (active, 6D uptime)
- Hermes gateway is NOT running as a PM2 service — it's a LaunchAgent

**Resolution:**
- Hermes gateway does NOT use port 3001
- Bakery keeps port 3001
- No conflict exists in practice

---

## Blocker 3 — Port 3100 Conflict (OpenHue vs SquarePayouts)

**Status:** ✅ RESOLVED

**What happened:**
- Phase 1 assumed OpenHue might want port 3100
- Found: SquarePayouts owns 3100 as a Next.js web app (active, 6D uptime)
- OpenHue is NOT installed or running

**Resolution:**
- SquarePayouts keeps port 3100
- OpenHue not needed on this machine
- No conflict exists

---

## Phase 6 Blockers (Still Active)

| Card | Blocker | Status |
|------|---------|--------|
| `t_71fdab1a` | Finance data source for Money Pipeline rebuild | 🔴 Awaiting Marcelo decision |
| `t_faa6d371` | Binance bot pre-trade-hook restoration | 🔴 Awaiting Marcelo approval |

Both are Phase 6 items — cannot proceed until Marcelo decides.

---

## Key Learnings

1. **Port conflicts are often theoretical** — always verify what is actually running before declaring a conflict
2. **Services not installed ≠ services that will be installed** — don't reserve ports for software not present
3. **Live trading without safety hooks is dangerous** — the Binance bot was actively trading without the pre-trade hook functioning
4. **Phase 1 audit saved the day** — the missing hook was found before a major trading loss

---

## Related Files

- `~/.hermes/knowledge/BLOCKER_RESOLUTIONS.md` — Full Phase 1 blocker analysis
- `~/.hermes/knowledge/SERVICES_MAP.md` — Port and service map (updated 2026-05-07)
- `~/.hermes/knowledge/PHASE1_AUDIT_REPORT.md` — Full audit findings