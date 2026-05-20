#!/bin/bash
# =============================================================================
# gateway-health-check.sh — Hermes Gateway + CuaDriver Health Check
# =============================================================================
# Safe design: ONE-SHOT only. No daemon loop. No auto-restart.
#
# Modes:
#   check    — run once, report status, NO auto-restart (default)
#   status   — human-readable status report
#
# Philosophy:
#   - Report-first: always tell BossMan what's happening
#   - No restart loops: restart only on explicit BossMan command
#   - Human in the loop: gateway state changes require BossMan decision
#   - No infinite loops: script exits after every check
#
# Root cause of previous failure (2026-05-20):
#   The daemon mode of gateway-health-monitor.sh had a restart loop that
#   detected false DOWN states during normal launchd transitions, then
#   repeatedly tried to restart the gateway, creating a restart storm.
#   The grep on "launchctl list" was unreliable during restart cycles.
#
# Safe design rules:
#   1. Report only — never auto-restart in a loop
#   2. One restart attempt max, then exit and report
#   3. No daemon/KeepAlive — one-shot only via BossMan cron or manual trigger
#   4. No infinite loops under any circumstance
# =============================================================================

set -euo pipefail

LOG_DIR="/Users/bigdawg/logs"
LOG_FILE="${LOG_DIR}/gateway-health.log"
STATE_FILE="/tmp/gateway-health-state.json"
LOCK_FILE="/tmp/gateway-health.lock"
SOCKET_PATH="/Users/bigdawg/Library/Caches/cua-driver/cua-driver.sock"
CUADRIVER_PID_FILE="/tmp/cuadriver-hm.pid"

# Tunables
MAX_RESTART_ATTEMPTS=1  # hard cap — one restart, then report and stop

# Colors
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'; NC='\033[0m'

log() {
    local level="$1"; shift
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*"
    echo -e "$msg"
    echo -e "$msg" >> "$LOG_FILE"
}

mkdir -p "$LOG_DIR"
touch "$LOG_FILE"

# =============================================================================
# STATE MANAGEMENT
# =============================================================================

read_state() {
    if [[ -f "$STATE_FILE" ]]; then
        cat "$STATE_FILE"
    else
        echo '{"status":"UNKNOWN","restart_count":0,"last_restart":"","last_stable":""}'
    fi
}

write_state() {
    echo "$1" > "$STATE_FILE"
}

get_status() {
    echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN"
}

get_restart_count() {
    echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('restart_count',0))" 2>/dev/null || echo "0"
}

increment_restart_count() {
    local state="$(read_state)"
    local count=$(echo "$state" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('restart_count',0)+1)" 2>/dev/null)
    local ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$state" | python3 -c "import json,sys; d=json.load(sys.stdin); d['restart_count']=$count; d['last_restart']='$ts'; print(json.dumps(d))" > "$STATE_FILE"
}

reset_restart_count() {
    local state="$(read_state)"
    local ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$state" | python3 -c "import json,sys; d=json.load(sys.stdin); d['restart_count']=0; d['status']='OK'; d['last_stable']='$ts'; print(json.dumps(d))" > "$STATE_FILE"
}

# =============================================================================
# ACQUISITION
# =============================================================================

acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local pid=$(cat "$LOCK_FILE" 2>/dev/null)
        if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
            log "WARN" "Another instance running (PID $pid), exiting"
            exit 0
        fi
        log "WARN" "Stale lock file from PID $pid, removing"
        rm -f "$LOCK_FILE"
    fi
    echo $$ > "$LOCK_FILE"
    trap 'rm -f "$LOCK_FILE"' EXIT
}

# =============================================================================
# DIAGNOSTICS — all checks are READ-ONLY
# =============================================================================

check_cuadriver_socket() {
    # Is the CuaDriver socket present?
    if [[ -S "$SOCKET_PATH" ]]; then
        return 0
    fi
    return 1
}

check_cuadriver_process() {
    # Is the CuaDriver daemon process actually running?
    if ps aux | grep -v grep | grep "cua-driver serve" > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

check_gateway_process() {
    # Check gateway by process name (more reliable than launchctl list during transitions)
    # || true prevents set -e from exiting on grep returning 1 (no match)
    if ps aux | grep -v grep | grep "hermes_cli.main gateway" > /dev/null 2>&1; then
        return 0
    fi
    return 1
}

check_gateway_launchagent_loaded() {
    # Is hermes-gateway registered with launchd?
    # Use LoadState = OnDemand as proxy — if not present at all, grep returns non-zero
    if launchctl list 2>/dev/null | grep -q "ai.hermes.gateway"; then
        return 0
    fi
    return 1
}

check_mcp_session() {
    # Try a quick hermes computer-use status to see if MCP stack is alive
    # This exercises: gateway → MCP → CuaDriver socket
    local result
    result=$(cd /Users/bigdawg/.hermes/hermes-agent && \
        venv/bin/hermes computer-use status 2>&1)
    if echo "$result" | grep -qi "error\|fail\|closed\|unavailable\|not reachable"; then
        return 1
    fi
    return 0
}

# =============================================================================
# STATUS REPORT (read-only, no side effects)
# =============================================================================

report_status() {
    local status
    status=$(get_status)
    local restart_count
    restart_count=$(get_restart_count)

    local last_restart
    last_restart=$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('last_restart','never'))" 2>/dev/null)
    local last_stable
    last_stable=$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('last_stable','never'))" 2>/dev/null)

    local socket_ok=$(check_cuadriver_socket && echo "YES" || echo "NO")
    local cuadriver_ok=$(check_cuadriver_process && echo "UP" || echo "DOWN")
    local gateway_ok=$(check_gateway_process && echo "UP" || echo "DOWN")
    local mcp_ok=$(check_mcp_session && echo "ALIVE" || echo "DEAD")

    echo ""
    echo "=== Hermes Gateway Health Report ==="
    echo "  Overall:       $status"
    echo "  Restart count: $restart_count / $MAX_RESTART_ATTEMPTS"
    echo "  Last restart:  $last_restart"
    echo "  Last stable:   $last_stable"
    echo ""
    echo "  CuaDriver process: $cuadriver_ok"
    echo "  CuaDriver socket:  exists=$socket_ok"
    echo "  hermes-gateway:     $gateway_ok"
    echo "  MCP session:        $mcp_ok"
    echo ""

    # Determine overall health
    if [[ "$cuadriver_ok" == "UP" ]] && [[ "$gateway_ok" == "UP" ]] && [[ "$mcp_ok" == "ALIVE" ]]; then
        echo "✅ ALL SYSTEMS OPERATIONAL"
        return 0
    else
        echo "⚠️  SYSTEM DEGRADED — review required"
        return 1
    fi
}

# =============================================================================
# ONE-SHOT HEALTH CHECK (primary mode)
# =============================================================================

do_check() {
    local cuadriver_ok=false
    local gateway_ok=false
    local mcp_ok=false

    # Gather status (all read-only)
    if check_cuadriver_process; then
        cuadriver_ok=true
    fi

    if check_gateway_process; then
        gateway_ok=true
    fi

    if [[ "$cuadriver_ok" == "true" ]] && [[ "$gateway_ok" == "true" ]]; then
        if check_mcp_session; then
            mcp_ok=true
        fi
    fi

    local current_status
    current_status=$(get_status)

    # === DETERMINE STATE ===
    if [[ "$cuadriver_ok" == "true" ]] && [[ "$gateway_ok" == "true" ]] && [[ "$mcp_ok" == "true" ]]; then
        # ALL HEALTHY
        if [[ "$current_status" != "OK" ]]; then
            log "INFO" "=== Gateway + CuaDriver fully healthy ==="
            reset_restart_count
        fi
        write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='OK'; print(json.dumps(d))")"
        log "INFO" "Health check OK — all systems operational"
        return 0

    elif [[ "$cuadriver_ok" == "true" ]] && [[ "$gateway_ok" == "true" ]] && [[ "$mcp_ok" == "false" ]]; then
        # SESSION_STALE: process alive, MCP session dead
        log "WARN" "SESSION_STALE: CuaDriver + gateway alive, MCP session dead"
        log "WARN" "No auto-restart. BossMan must decide action."
        write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='SESSION_STALE'; print(json.dumps(d))")"
        # Write alert marker for BossMan cron to pick up
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) SESSION_STALE" >> "${LOG_DIR}/gateway-unhealthy.log"
        return 1

    elif [[ "$cuadriver_ok" == "true" ]] && [[ "$gateway_ok" == "false" ]]; then
        # Gateway process dead, CuaDriver alive
        log "WARN" "Gateway process DOWN — CuaDriver alive"
        log "WARN" "No auto-restart. BossMan must decide action."
        write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='GATEWAY_DOWN'; print(json.dumps(d))")"
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) GATEWAY_DOWN" >> "${LOG_DIR}/gateway-unhealthy.log"
        return 1

    elif [[ "$cuadriver_ok" == "false" ]]; then
        # CuaDriver daemon down
        log "WARN" "CuaDriver daemon DOWN"
        log "WARN" "No auto-restart. BossMan must decide action."
        write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='CUADRIVER_DOWN'; print(json.dumps(d))")"
        echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) CUADRIVER_DOWN" >> "${LOG_DIR}/gateway-unhealthy.log"
        return 1
    fi
}

# =============================================================================
# CONTROLLED RESTART (only for BossMan cron use — not automatic)
# This is a separate command mode, not used in the auto loop
# =============================================================================

do_restart_once() {
    local restart_count
    restart_count=$(get_restart_count)

    if [[ $restart_count -ge $MAX_RESTART_ATTEMPTS ]]; then
        log "ERROR" "Max restart attempts ($MAX_RESTART_ATTEMPTS) reached — stopping, manual intervention required"
        return 1
    fi

    local current_status
    current_status=$(get_status)

    # Decide what needs restarting based on what is actually down
    if ! check_cuadriver_process; then
        log "WARN" "CuaDriver down — attempting one restart..."
        if pkill -f "cua-driver serve" 2>/dev/null; then
            sleep 2
        fi
        open -n -g -a CuaDriver --args serve 2>/dev/null || \
            nohup cua-driver serve > "$LOG_DIR/cuadriver.log" 2>&1 &
        sleep 4
        if ! check_cuadriver_process; then
            log "ERROR" "CuaDriver restart FAILED — stopping"
            write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='RESTART_FAILED'; print(json.dumps(d))")"
            echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) RESTART_FAILED" >> "${LOG_DIR}/gateway-unhealthy.log"
            return 1
        fi
        log "INFO" "CuaDriver restarted successfully"
    fi

    if ! check_gateway_process; then
        log "WARN" "Gateway down — attempting one restart..."
        launchctl bootout gui/$(id -u)/ai.hermes.gateway 2>/dev/null || true
        sleep 2
        launchctl load /Users/bigdawg/Library/LaunchAgents/ai.hermes.gateway.plist 2>/dev/null || true
        sleep 4
        if ! check_gateway_process; then
            log "ERROR" "Gateway restart FAILED — stopping, manual intervention required"
            write_state "$(echo "$(read_state)" | python3 -c "import json,sys; d=json.load(sys.stdin); d['status']='RESTART_FAILED'; print(json.dumps(d))")"
            echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) RESTART_FAILED" >> "${LOG_DIR}/gateway-unhealthy.log"
            return 1
        fi
        log "INFO" "Gateway restarted successfully"
    fi

    increment_restart_count
    return 0
}

# =============================================================================
# ENTRY POINT
# =============================================================================

MODE="${1:-check}"
acquire_lock

case "$MODE" in
    check)
        do_check
        ;;
    status)
        report_status
        ;;
    restart)
        # Explicit restart mode — only for BossMan use, not automatic
        do_restart_once
        ;;
    *)
        echo "Usage: $0 {check|status|restart}"
        echo ""
        echo "  check    — Run one health check, report status, NO auto-restart (default)"
        echo "  status   — Human-readable status report"
        echo "  restart  — One controlled restart attempt (BossMan only, not automatic)"
        exit 1
        ;;
esac