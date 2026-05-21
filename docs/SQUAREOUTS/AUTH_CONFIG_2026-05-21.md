# SquarePayouts Auth Configuration
**Date:** 2026-05-21  
**Phase:** P18+P19  
**Status:** ✅ Auth working, session persistence confirmed

---

## Stable URL Status
- **Tailscale Funnel:** BLOCKED — Git-managed Tailscale ACL policy; not modifying in this phase
- **Current:** CF quick tunnel (unstable, changes on restart) + AUTH_TRUST_HOST=true
- **Fallback plan:** Future infra phase for named CF tunnel or real domain

## Auth Configuration

### PM2 ecosystem.config.js (runtime env)
```
AUTH_TRUST_HOST: 'true'
NEXTAUTH_SECRET: 'E7MX1TsnHUUlpBxpptrL1CYgmqx/rLNUeSUVlBEDHmA='
PORT: '8030'
NODE_ENV: 'production'
```

### .env.local (build-time reference)
```
NEXTAUTH_SECRET=E7MX1TsnHUUlpBxpptrL1CYgmqx/rLNUeSUVlBEDHmA=
AUTH_TRUST_HOST=true
```
`.env.local` is NOT loaded at runtime by the custom `server.js`. Only PM2 env applies at runtime.

### AUTH_TRUST_HOST=true Pattern
- CF tunnel sets `X-Forwarded-Host` automatically on every request
- NextAuth uses `X-Forwarded-Host` to build correct callback URLs
- No hardcoded NEXTAUTH_URL needed → survives CF tunnel restarts

## Test Users (seed data)
| Email | Role | Password |
|-------|------|----------|
| host@example.com | host | host123 |
| guest@example.com | guest | guest123 |
| admin@squarepayouts.com | admin | admin123 |

## Auth Flow Test Results (2026-05-21)
- ✅ CSRF endpoint: returns valid token
- ✅ Providers endpoint: signinUrl correct
- ✅ Protected routes: redirect to /login
- ✅ Host login: session persisted with role=host
- ✅ Admin login: session persisted with role=admin, mfa_enrolled=true
- ✅ Guest login: session persisted with role=user
- ✅ Session persists across requests (NEXTAUTH_SECRET fix verified)

## Key Finding: NEXTAUTH_SECRET Missing from PM2 Env
**Problem:** `server.js` is a custom Next.js server that does NOT auto-load `.env.local`.
Without NEXTAUTH_SECRET in PM2 env, NextAuth uses a runtime-generated fallback secret.
Sessions cannot persist — JWT signed with different secret each request.

**Fix:** Added NEXTAUTH_SECRET explicitly to PM2 ecosystem.config.js env block.

## Infrastructure Notes
- SquarePayouts port: 8030
- CF quick tunnel: changes on every restart (no stable URL)
- Session cookie: `__Secure-next-auth.session-token` (Secure flag set when HTTPS)
- JWT strategy: HS256 with base64-encoded NEXTAUTH_SECRET
- CSRF: `__Host-next-auth.csrf-token` (double-submit cookie pattern)
