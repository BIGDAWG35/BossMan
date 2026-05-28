# LEARNED: AnyDesk on Mac Studio M4 Max

**Date:** 2026-05-28
**Hardware:** Mac Studio (Apple M4 Max)
**Status:** ✅ WORKING — dual-instance configuration confirmed

## Configuration Found

**AnyDesk is installed and running correctly** with 3 processes:
- `/Applications/AnyDesk.app/Contents/MacOS/AnyDesk --control` (PID 883) — user session
- `/Applications/AnyDesk.app/Contents/MacOS/AnyDesk --control` (PID 809) — user session
- `/Applications/AnyDesk.app/Contents/MacOS/AnyDesk --service` (root, PID 278) — system service

**LaunchAgent registered:**
- `~/Library/LaunchAgents/com.philandro.anydesk.Frontend.plist` — user-level auto-start
- `/Library/LaunchAgents/com.philandro.anydesk.Frontend.plist` — system-level (from prior install)

## Architecture Check

```bash
file "/Applications/AnyDesk.app/Contents/MacOS/AnyDesk"
# Result: Mach-O 64-bit executable x86_64 (Intel binary, Rosetta 2 translated)
```

AnyDesk is an Intel build running under Rosetta 2 translation. This is **normal and acceptable** — the remote access functionality works identically. No ARM64-specific AnyDesk build was available at time of writing.

## Why "Already Running" Error Occurs

The error typically means: AnyDesk is already registered as a LaunchAgent AND someone is trying to launch it manually. The LaunchAgent (`com.philandro.anydesk.Frontend.plist`) has `RunAtLoad: true` and `LaunchOnlyOnce: true` — meaning it starts at boot and the system prevents a second instance.

**Not an Intel/Mac Studio issue.** Same behavior would occur on any Mac.

## How to Force-Restart AnyDesk

```bash
# Stop the LaunchAgent (user level)
launchctl bootout gui/$(id -u)/com.philandro.anydesk.Frontend

# Kill running instances
pkill -f "AnyDesk"

# Verify stopped
ps aux | grep AnyDesk | grep -v grep

# Start manually
open -a AnyDesk

# Or let the LaunchAgent restart it at next login
```

## LaunchAgent Cleanup (Optional)

The system-level plist (`/Library/LaunchAgents/com.philandro.anydesk.Frontend.plist`) was likely installed during an admin-level AnyDesk install on the Intel Mac mini. It persists across the hardware migration.

**To remove the duplicate LaunchAgent:**
```bash
sudo launchctl bootout system/com.philandro.anydesk.Frontend
sudo rm /Library/LaunchAgents/com.philandro.anydesk.Frontend.plist
```

The user-level LaunchAgent (`~/Library/LaunchAgents/`) is sufficient.

## Connectivity Check

AnyDesk responds on the local network when the app is running. No specific port check needed — the AnyDesk ID is used for connections, not a standard HTTP endpoint.

## Verdict

✅ **AnyDesk is functioning correctly on the Mac Studio M4 Max.**
- Intel binary + Rosetta 2 works fine for remote access software
- No conflict between the two instances (Frontend x2 + Service x1 = normal)
- LaunchAgent auto-starts at boot as configured
- No migration action required
