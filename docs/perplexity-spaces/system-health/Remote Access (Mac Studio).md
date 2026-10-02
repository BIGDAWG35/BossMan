**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/LEARNED_REMOTE_ACCESS.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED — Remote access to BigDawg's Mac Studio

**Version:** v1 · **Date:** 2026-10-02 · **Owner:** BossMan (ops) · **Status:** Current canon
**Verified on 2026-10-02** by Perplexity Computer and BossMan with read-only checks on the Mac.

## Rule
Connect with **macOS Screen Sharing over Tailscale** first. **AnyDesk is the backup.** Use **SSH over Tailscale** when only a terminal is needed. None of these routes needs anyone at the Mac.

## Ways to connect
| # | Path | Address | Login | Notes |
|---|---|---|---|---|
| 1 | **Screen Sharing (VNC) over Tailscale** | `vnc://100.92.223.82` | macOS user `bigdawg` + the Mac password | No license and no session limit, so there's no Allow click. On the MacBook (Apple silicon) pick **High Performance**. On iPhone/iPad use Screens 5 or RealVNC Viewer with Tailscale ON. |
| 2 | **SSH over Tailscale** | `ssh bigdawg@100.92.223.82` | Mac password or key | Terminal only. Already used from Cello's MacBook Pro on 2026-10-02. |
| 3 | **AnyDesk (backup)** | ID `1003261270` | Unattended Access password | Free license (`free-1`). Read "AnyDesk problems" below. |

Use the **100.92.223.82** IP rather than the MagicDNS name. The Mac Studio runs with Tailscale DNS off (`CorpDNS=false`).

## Verified state (2026-10-02)
- Tailscale v1.102.4 is running and set to start at login. WantRunning=true, ShieldsUp=false.
  - Funnel is on for `bigdawgs-mac--studio.tailed3212.ts.net`.
- **The node key expires 2027-03-29.** Turn off key expiry for this machine in the Tailscale admin console. The weekly check warns 30 days ahead.
- Listening on the Tailscale IP: **5900** answers `RFB 003.889` (Screen Sharing) and **22** answers `SSH-2.0-OpenSSH_10.3`.
  - No restrictions are set on who may use Screen Sharing or SSH.
- Reboot and power loss:
  - FileVault is **Off** and auto-login is set to `bigdawg`.
  - `pmset`: sleep 0, autorestart 1, womp 1, so the Mac restarts after a power cut.
  - The Mac therefore comes back, logs in and starts Tailscale with nobody there.
  - If FileVault is ever turned on, this stops working: the Mac waits at the pre-boot unlock screen. For planned restarts use `sudo fdesetup authrestart`.
- AnyDesk 9.7.0:
  - The service is installed as a root LaunchDaemon and running.
  - The **Unattended Access** profile is enabled and has a password set.
  - Screen Recording, Accessibility and Full Disk Access are granted.

## AnyDesk problems and causes
- **"Session limit reached":** the limit is counted on the **connecting** device's license, not the Mac Studio's.
  - The 2026-10-02 12:13 PT attempt never reached the Mac; the Mac's AnyDesk log shows nothing after 10:27.
  - The free license allows one outgoing session at a time. A session left open on another device (iPad/iPhone in the background, another window) uses up the slot. AnyDesk can also limit free accounts it thinks are used for business.
  - This Mac's AnyDesk was once signed in as `mdeavila@sitnsleep.com`. Keep personal devices off the work AnyDesk account.
- **Fix for the session limit:**
  1. Fully quit AnyDesk on every other device.
  2. Sign out of any work account in AnyDesk.
  3. Wait 2–3 minutes and reconnect.
  4. If it keeps happening, file the whitelist request at anydesk.com/en/commercial-use, or use path 1.
- **"Allow" prompt on the Mac:** this means the client connected without the unattended password, so AnyDesk showed the accept window. On 2026-10-01 that window timed out after 10 minutes with nobody there.
  - Fix: on each client, enter the **Unattended Access password** when asked and tick **"Log in automatically from now on"**.

## Monitoring
- `~/.hermes/scripts/remote_access_check.sh` runs as the no-agent cron `remote-access-check`, every 15 minutes.
- It checks:
  - that Tailscale is running and online, and reopens the app if it isn't;
  - ports 5900 and 22 on the Tailscale IP;
  - that the AnyDesk service is running;
  - that Mac sleep is off and restart-after-power-loss is on;
  - how many days are left on the Tailscale key.
- It is silent when everything is OK. It posts only when the state changes (problem found / recovered). State file: `~/.hermes/state/remote_access_check.state`.

## Do not
- Don't open port 5900 or 22 to the internet. Use them only over Tailscale.
- Don't turn on FileVault, Mac sleep or Tailscale "Shields Up" without updating this doc. Each of these breaks remote access.
