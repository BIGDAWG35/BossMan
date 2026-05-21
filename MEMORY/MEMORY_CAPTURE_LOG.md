# Hermes Memory Capture Log
Updated: 2026-05-21T06:06:35Z

---

## [PROJECT:SquarePayouts][AUTH][CONFIG][2026-05-21]
**Finding:** NEXTAUTH_SECRET missing from PM2 env — sessions don't persist
**Root cause:** `server.js` is custom Next.js server, does NOT auto-load `.env.local`
**Fix:** Added `NEXTAUTH_SECRET` to PM2 `ecosystem.config.js` env block
**Verified:** host/admin/guest sessions all persist correctly after fix

## [PROJECT:SquarePayouts][AUTH][CONFIG][URL]
**Finding:** AUTH_TRUST_HOST=true + X-Forwarded-Host = safe auto-detection pattern
**Note:** CF quick tunnel URL changes on restart — but AUTH_TRUST_HOST=true means no hardcoded NEXTAUTH_URL needed
**Future:** Stable URL via Tailscale Funnel (blocked by Git-managed ACL) or named CF tunnel

## [PROJECT:SquarePayouts][AUTH][FINDING]
**Finding:** Protected route `/host` returns 404 (not 307) for GET requests
**Note:** Likely middleware only triggers on navigation; GET to /host without cookie returns 404 from the page itself
**Requires:** Browser-based UI test to fully verify role-based access control

## [PROJECT:Hermes][SECURITY][FINDING]
**Finding:** CF quick tunnels have no uptime guarantee and are rate-limited
**Note:** Use named tunnel or stable domain for production; quick tunnels are dev/QA only
**Action:** Documented as future infra item

## [WORKFLOW][HERMES][PHASE18]
**Pattern discovered:** Custom Next.js server (`server.js`) doesn't auto-load `.env.local`
**Pattern verified:** Only PM2 env vars and `.env.production` are loaded at runtime
**Action:** Always check PM2 env explicitly for production Next.js apps



---

## [PROJECT:Hermes][WORKFLOW][PERFORMANCE][2026-05-21]
**Action:** Phase 20 — Hermes Team-Standup & PM2 Cleanup
**Findings:**
- PM2 list: 5 revenue processes all healthy + cloudflare-tunnel
- hermes-gateway: running via LaunchAgent, stable (PID 31271, 0 restarts)
- teamstandup-bot (port 8003): retired cleanly (LaunchAgent unloaded, code kept on disk)
- quickstats (port 8102): running via LaunchAgent, healthy (exit -15 is SIGTERM status, not error)
- pm2-health-monitor.sh: re-enabled, monitors 5 PM2 services
- gateway-health-monitor.sh: retired (superseded by safe gateway-health-check.sh)
- money-pipeline: 8 restarts, `fs is not defined` bug at line 1780 — currently stable but needs fix
**Decision P20:** Retire teamstandup-bot — Marcelo solo, team standup not needed
**Finding:** Exit -15 from launchctl list is SIGTERM status, NOT an error — no issue with running services

## [WORKFLOW][PM2][HERMES][P20]
**Cleanup:** Retired gateway-health-monitor.sh, re-enabled pm2-health-monitor.sh, updated SERVICES_MAP.md
**Pattern:** One-shot scripts > daemon loops for health monitoring
