# Tailscale VPN — Money Pipeline Access

**Source:** Phase 1 audit, OPERATING_BLUEPRINT.md
**Status:** Active — Tailscale running for remote access

---

## What Tailscale Provides

Tailscale provides a VPN that allows Marcelo to access the Money Pipeline dashboard (and other services) remotely. This is relevant for Phase 6 when finance data decisions require remote review.

---

## Current Status

**Tailscale is running** on this machine (from Phase 1 audit — OpenClaw gateway on port 18789 showed Tailscale was running).

**MagicDNS name:** Should be visible in `tailscale status`

---

## Accessing Money Pipeline Remotely

### From another device with Tailscale installed:
1. Connect to Tailscale VPN
2. Open browser to `http://<this-machine>:8020` (if on same tailnet)
3. Or use the machine's Tailscale DNS name if configured

### Quick check:
```bash
# On this machine — verify Tailscale is running
tailscale status

# Get the Tailscale IP
tailscale ip -4

# Check if port 8020 is accessible locally
curl -s localhost:8020 | head -5
```

---

## Money Pipeline Service Details

| Attribute | Value |
|-----------|-------|
| PM2 Name | `money-pipeline` |
| Port | 8020 |
| Alternate Port | 8120 |
| Health Check | `curl localhost:8020` |
| Status | ⚠️ Active — 8 restarts, monitor |
| Owner | Marcelo |

---

## Tailscale Usage for Phase 6

During Phase 6, Marcelo needs to review finance data sources for the Money Pipeline rebuild. Tailscale allows him to:

- Access the current Money Pipeline dashboard remotely
- Review transaction history
- Check bot performance from any device

---

## Tailscale Quick Commands

```bash
# Check status
tailscale status

# Connect (if not connected)
tailscale up

# Disconnect
tailscale down

# Get help
tailscale status --help
```

---

## Security Note

Money Pipeline on port 8020 contains financial data. Access is controlled by:
1. Tailscale VPN (only accessible on the tailnet)
2. The dashboard itself (no auth info in Phase 1 audit — may need a login in Phase 6 rebuild)

Phase 6 rebuild should include authentication for the Money Pipeline dashboard.