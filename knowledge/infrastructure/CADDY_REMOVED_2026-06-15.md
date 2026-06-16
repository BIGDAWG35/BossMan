# Caddy Removed from PM2 — 2026-06-15

## Status
- **Removed from PM2:** yes, 2026-06-15, by audit cleanup directive.
- **Caddyfile state:** `/Users/bigdawg/Projects/boss-hub/Caddyfile` is **MISSING** and was NOT recreated.
- **Caddyfile.unauthorized exists** as a marker: `~/Projects/boss-hub/Caddyfile.unauthorized`.

## Why removed
Caddy was in a 90,812-restart loop (`waiting restart` status). Root cause: PM2 launched `/usr/local/opt/caddy/bin/caddy` with `pm_cwd: /Users/bigdawg/Projects/boss-hub`, but no Caddyfile exists there. Caddy has no config to serve, dies on startup, PM2 restarts it, repeat.

## If Caddy is ever needed again

1. **Decide WHY first** — what service needs the Caddyfile? Caddy was a reverse-proxy candidate but no consumer was wired.
2. **Recreate Caddyfile** at `~/Projects/boss-hub/Caddyfile` (not `.unauthorized`) with the specific routes + upstreams needed.
3. **Test the Caddyfile standalone** with `caddy run --config ~/Projects/boss-hub/Caddyfile` to verify it parses and starts.
4. **Add to PM2** with the explicit cwd override: `pm2 start /usr/local/opt/caddy/bin/caddy --name caddy -- run --config ~/Projects/boss-hub/Caddyfile`.
5. **Verify** the service it fronts is reachable via the Caddy-proxied URL.
6. **Re-add to PM2 whitelist** in `~/.hermes/skills/devops/pm2-health-check/SKILL.md` with the health-check route.

## What was lost
Nothing. Caddy was a ghost — running but not serving anything, restarting 90,812 times over 3 days. Total CPU wasted: ~3% sustained.

## Binary
Caddy is still installed at `/usr/local/opt/caddy/bin/caddy` (Homebrew). Removal from PM2 does NOT uninstall the binary. If you decide you never want Caddy again, `brew uninstall caddy`.
