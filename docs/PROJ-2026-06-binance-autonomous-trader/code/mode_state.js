// ── mode_state.js ──────────────────────────────────────────────────────────────
// Phase 3 (Paper-Mode Build) — 2026-06-18
// Mode tracking wrapper. PAPER_MODE is the canonical env var; this module
// surfaces it as a typed object plus transition history helpers.
//
// RULES (locked in SPEC-BINANCE-AUTONOMOUS-TRADER.md v1.2):
//   - LIVE is the default, normal operating state.
//   - PAPER_MODE is a SAFETY TOOL, not a relaxed mode.
//   - PAPER and LIVE share 100% of code paths except the final place_order step.
//   - The bot NEVER auto-flips LIVE on its own. Mode flips are operator actions
//     under Gate 1.
//   - Every LIVE → PAPER entry creates an audit entry + reversion card and
//     arms a 24h decision deadline (see paper_reversion.js).
//
// This module is the single source of truth for "what mode are we in NOW?"
// Callers should NOT read process.env.PAPER_MODE directly; they should call
// modeState.current().

'use strict';

const fs = require('fs');
const path = require('path');

// ── Mode enum (locked) ────────────────────────────────────────────────────────
const MODE_LIVE = 'LIVE';
const MODE_PAPER = 'PAPER';

// ── Env read (single point) ───────────────────────────────────────────────────
function readPaperModeFromEnv() {
  return (process.env.PAPER_MODE || 'true').toLowerCase() === 'true';
}

// ── Default state (no transitions yet) ────────────────────────────────────────
function freshState() {
  return {
    current: readPaperModeFromEnv() ? MODE_PAPER : MODE_LIVE,
    transitions: [],     // [{ from, to, at, reason, operator, reversionCardId }]
    decisions: [],       // [{ at, kind: 'revert_live'|'stay_paper', reason, operator }]
    currentEntry: null,  // { at, reason, operator, reversionCardId } when in PAPER
  };
}

// ── In-memory state (single instance per process) ─────────────────────────────
let _state = null;

function getState() {
  if (_state === null) _state = freshState();
  return _state;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the current mode: 'PAPER' | 'LIVE'.
 * Computed from env at startup; runtime flips MUST go through recordTransition().
 */
function current() {
  return getState().current;
}

/**
 * Returns true if currently in PAPER mode.
 */
function isPaper() {
  return current() === MODE_PAPER;
}

/**
 * Returns the current PAPER entry metadata (or null if in LIVE).
 * Used by paper_reversion.js to compute deadline.
 */
function currentPaperEntry() {
  return getState().currentEntry;
}

/**
 * Record a mode transition. Caller MUST pass reason + operator.
 * If entering PAPER, sets currentEntry + arms reversion deadline.
 * If returning to LIVE, clears currentEntry.
 *
 * Throws if transitioning to the mode we're already in (no-op transitions
 * are bugs — they would silently re-arm the deadline).
 */
function recordTransition({ to, reason, operator, reversionCardId = null }) {
  const s = getState();
  const from = s.current;
  if (from === to) {
    throw new Error(`mode_state: refusing no-op transition ${from} -> ${to}`);
  }
  const at = new Date().toISOString();
  const entry = { from, to, at, reason, operator, reversionCardId };
  s.transitions.push(entry);
  s.current = to;
  if (to === MODE_PAPER) {
    s.currentEntry = {
      at,
      reason,
      operator,
      reversionCardId,
    };
  } else {
    // Returning to LIVE
    s.currentEntry = null;
  }
  return entry;
}

/**
 * Record an operator decision about a current PAPER run.
 * `kind` is 'revert_live' or 'stay_paper'.
 * For 'stay_paper', `reason` is required.
 *
 * Decision recording does NOT change mode. It just logs the decision so
 * the 24h overdue check no longer fires.
 */
function recordDecision({ kind, reason = null, operator }) {
  const s = getState();
  if (s.current !== MODE_PAPER) {
    throw new Error(`mode_state: cannot record decision while in ${s.current}`);
  }
  if (kind !== 'revert_live' && kind !== 'stay_paper') {
    throw new Error(`mode_state: invalid decision kind '${kind}'`);
  }
  if (kind === 'stay_paper' && !reason) {
    throw new Error(`mode_state: 'stay_paper' decision requires reason`);
  }
  const at = new Date().toISOString();
  const decision = { at, kind, reason, operator };
  s.decisions.push(decision);
  return decision;
}

/**
 * Return the most recent decision (or null).
 * Used by paper_reversion.js to determine if the overdue check should fire.
 */
function latestDecision() {
  const s = getState();
  return s.decisions.length > 0 ? s.decisions[s.decisions.length - 1] : null;
}

/**
 * Reset state. For tests only.
 */
function _reset() {
  _state = freshState();
}

/**
 * Public access to internal state (read-only by convention).
 * Used by paper_reversion.js to read current state.
 */
function getState() {
  if (_state === null) _state = freshState();
  return _state;
}

/**
 * Test helpers
 */
function _setState(state) {
  _state = state;
}

module.exports = {
  MODE_LIVE,
  MODE_PAPER,
  current,
  isPaper,
  currentPaperEntry,
  recordTransition,
  recordDecision,
  latestDecision,
  freshState,
  getState,
  // Test-only
  _reset,
  _setState,
};