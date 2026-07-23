#!/bin/bash
# pm2-hermes.sh — Safe PM2 CLI wrapper for hermes/agent invocations.
#
# Problem (2026-07-22): When BossMan or a sub-agent invokes `pm2` CLI with
# a non-canonical PM2_HOME (e.g., PM2_HOME=~/.hermes/pro), PM2 spawns a
# god daemon at that PM2_HOME. The daemon is designed to self-terminate
# when the CLI process exits, but a race condition causes some to persist
# as zombie daemons. Over time, these accumulate and break the canonical
# 1-daemon invariant.
#
# This script solves the problem with **isolation + kill-by-PID**:
#   1. Set PM2_HOME to a fresh tmpdir (mktemp -d) → daemon spawns there
#   2. Run the requested pm2 subcommand
#   3. Find the per-session daemon's PID via lsof on the IPC socket
#   4. kill -TERM by PID (NOT `pm2 kill`, which would kill canonical too)
#   5. rm -rf the tmpdir
#
# This pattern was confirmed safe in test t_pm2_zombie_spawn_root_cause_20260722:
#   - per-session tmpdir: ✓ daemon spawns in tmpdir, NOT ~/.hermes/pro
#   - kill -TERM by PID: ✓ only kills the per-session daemon, canonical untouched
#   - cleanup pattern via `pm2 kill`: ✗ UNSAFE — kills canonical daemon too
#
# Usage:
#   bash pm2-hermes.sh <pm2_subcommand> [args...]
# Examples:
#   bash pm2-hermes.sh list
#   bash pm2-hermes.sh jlist
#   bash pm2-hermes.sh logs pmd-web --lines 50 --nostream
#
# Permanent 2026-07-22 (Card t_pm2_zombie_spawn_root_cause_20260722).
# Companion file: ~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md §"PM2 CLI Usage Policy"

set -uo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <pm2_subcommand> [args...]" >&2
  echo "Examples:" >&2
  echo "  $0 list" >&2
  echo "  $0 jlist" >&2
  echo "  $0 logs pmd-web --lines 50 --nostream" >&2
  exit 64  # EX_USAGE
fi

# Step 1: Create fresh per-session PM2_HOME in tmpdir
PM2_TMP=$(mktemp -d -t pm2-hermes-XXXXXX)
if [ ! -d "$PM2_TMP" ]; then
  echo "ERROR: failed to create tmpdir" >&2
  exit 73  # EX_CANTCREAT
fi
export PM2_HOME="$PM2_TMP"

# Step 2: Run the pm2 command (stdout/stderr passed through)
PM2_OUTPUT=$(PM2_HOME="$PM2_TMP" pm2 "$@" 2>&1)
PM2_EXIT=$?
echo "$PM2_OUTPUT"

# Step 3: Find the per-session daemon PID via lsof on the IPC socket
# The RPC socket file is at $PM2_TMP/rpc.sock; the process holding it is the daemon
SESSION_PID=""
if [ -e "$PM2_TMP/rpc.sock" ]; then
  SESSION_PID=$(lsof -t "$PM2_TMP/rpc.sock" 2>/dev/null | head -1)
fi

# Fallback: grep ps for the PM2 daemon using this PM2_HOME
if [ -z "$SESSION_PID" ]; then
  SESSION_PID=$(ps aux | grep "PM2 v5.*God Daemon" | grep -v grep | grep -F "$PM2_TMP" | awk '{print $2}' | head -1)
fi

# Step 4: kill -TERM the per-session daemon (NEVER use `pm2 kill` here — that
# would also kill the canonical PM2 daemon, which is the actual production bug)
if [ -n "$SESSION_PID" ]; then
  kill -TERM "$SESSION_PID" 2>/dev/null
  # Wait briefly for graceful exit
  for _ in 1 2 3 4 5; do
    if ! ps -p "$SESSION_PID" > /dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done
  # If still alive after 1s, SIGKILL as last resort
  if ps -p "$SESSION_PID" > /dev/null 2>&1; then
    kill -KILL "$SESSION_PID" 2>/dev/null
  fi
fi

# Step 5: Clean up tmpdir
rm -rf "$PM2_TMP"

exit "$PM2_EXIT"
