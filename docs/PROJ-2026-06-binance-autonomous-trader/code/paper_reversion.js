// ── paper_reversion.js ─────────────────────────────────────────────────────────
// Phase 3 (Paper-Mode Build) — 2026-06-18
// 24-hour decision rule for PAPER_MODE transitions.
//
// SPEC LOCKED BEHAVIOR (SPEC-BINANCE-AUTONOMOUS-TRADER.md v1.2 §
// "PAPER/LIVE discipline with 24-hour decision rule"):
//
//   1. On LIVE → PAPER transition:
//        - audit log records: timestamp, reason, operator
//        - decision_deadline = entry_time + 24h
//        - create/update a "PAPER → LIVE reversion" Kanban card
//
//   2. On every cycle, evaluate reversion state:
//        - if now < deadline: normal PAPER, no action
//        - if now >= deadline AND no operator decision:
//              * mark epic BLOCKED (reason: 'PAPER decision overdue')
//              * surface as clear task (Kanban comment + audit log)
//              * continue PAPER mode (do NOT silently remain; do NOT auto-flip LIVE)
//        - if operator decision recorded: no overdue action
//
//   3. Allowed decisions (must be explicit):
//        (a) revert LIVE — requires Gate 1; bot does NOT auto-execute
//        (b) stay PAPER with explicit reason — epic marked BLOCKED; deadline resets
//
//   4. Forbidden: silent, indefinite PAPER.
//
// THIS MODULE DOES NOT FLIP MODES. It only:
//   - tracks deadline
//   - reports overdue state (caller decides how to surface)
//   - records decisions
//   - is idempotent (cycle-safe)

'use strict';

const modeState = require('./mode_state');

// ── Constants (locked) ────────────────────────────────────────────────────────
const DEFAULT_DECISION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Deadline computation ──────────────────────────────────────────────────────
/**
 * Compute decision_deadline from a PAPER entry timestamp (ISO 8601) + window.
 * Returns Date object.
 */
function computeDeadline(entryAtIso, windowMs = DEFAULT_DECISION_WINDOW_MS) {
  const entryMs = Date.parse(entryAtIso);
  if (Number.isNaN(entryMs)) {
    throw new Error(`paper_reversion: invalid entry timestamp '${entryAtIso}'`);
  }
  return new Date(entryMs + windowMs);
}

// ── Cycle evaluation ──────────────────────────────────────────────────────────

/**
 * Evaluate current reversion state. Pure function — no side effects.
 * Caller is responsible for surfacing overdue state.
 *
 * @param {Object} opts
 * @param {Date}   opts.now                — current time (inject for tests)
 * @param {Object} [opts.modeStateOverride] — mode state object (inject for tests)
 * @param {number} [opts.windowMs]          — override 24h (tests only)
 *
 * @returns {Object} {
 *   status: 'live' | 'paper_in_window' | 'paper_overdue_no_decision' | 'paper_with_decision',
 *   currentEntry: { at, reason, operator, reversionCardId } | null,
 *   deadline: Date | null,
 *   latestDecision: { at, kind, reason, operator } | null,
 *   overdueByMs: number | null,   // positive = how long past deadline
 *   windowMs: number,
 * }
 */
function evaluate({ now = new Date(), modeStateOverride = null, windowMs = DEFAULT_DECISION_WINDOW_MS } = {}) {
  const ms = modeStateOverride || modeState.getState();
  const result = {
    status: 'live',
    currentEntry: null,
    deadline: null,
    latestDecision: null,
    overdueByMs: null,
    windowMs,
  };

  if (ms.current === modeState.MODE_LIVE) {
    result.status = 'live';
    return result;
  }

  // We're in PAPER
  const entry = ms.currentEntry;
  if (!entry) {
    // PAPER mode but no entry record — anomalous; treat as overdue-no-decision
    // so the caller surfaces the inconsistency rather than silently passing.
    result.status = 'paper_overdue_no_decision';
    result.currentEntry = null;
    return result;
  }

  result.currentEntry = entry;
  const deadline = computeDeadline(entry.at, windowMs);
  result.deadline = deadline;
  // Latest decision: read from override (if provided) directly, else via module.
  let latestDec;
  if (modeStateOverride !== null && Array.isArray(modeStateOverride.decisions)) {
    const decs = modeStateOverride.decisions;
    latestDec = decs.length > 0 ? decs[decs.length - 1] : null;
  } else {
    latestDec = modeState.latestDecision();
  }
  result.latestDecision = latestDec;

  // If there's a decision, the overdue check is satisfied regardless of clock.
  if (latestDec !== null) {
    result.status = 'paper_with_decision';
    return result;
  }

  // No decision — compare to clock
  if (now.getTime() < deadline.getTime()) {
    result.status = 'paper_in_window';
    return result;
  }

  result.status = 'paper_overdue_no_decision';
  result.overdueByMs = now.getTime() - deadline.getTime();
  return result;
}

// ── Surfacers (caller invokes these to act on overdue state) ──────────────────

/**
 * Build a human-readable overdue alert payload.
 * Used by the caller to write audit entries + post Kanban comments.
 *
 * Returns null if not overdue.
 */
function buildOverdueAlert(evaluation, reversionCardId) {
  if (evaluation.status !== 'paper_overdue_no_decision') return null;
  return {
    severity: 'critical',
    title: 'PAPER decision overdue',
    body: [
      `Bot has been in PAPER mode for >${formatDuration(evaluation.windowMs)} without an operator decision.`,
      `PAPER entry: ${evaluation.currentEntry ? evaluation.currentEntry.at : 'unknown'}`,
      `Reason at entry: ${evaluation.currentEntry ? evaluation.currentEntry.reason : 'unknown'}`,
      `Operator at entry: ${evaluation.currentEntry ? evaluation.currentEntry.operator : 'unknown'}`,
      `Decision deadline: ${evaluation.deadline ? evaluation.deadline.toISOString() : 'unknown'}`,
      `Overdue by: ${evaluation.overdueByMs !== null ? formatDuration(evaluation.overdueByMs) : 'unknown'}`,
      `Reversion card: ${reversionCardId || evaluation.currentEntry?.reversionCardId || 'NONE — create one now'}`,
      ``,
      `REQUIRED ACTION — choose one:`,
      `  (a) Revert to LIVE with the new structure → Gate 1 approval required`,
      `  (b) Stay in PAPER with explicit reason → mark epic BLOCKED, record decision`,
      ``,
      `Bot will NOT auto-flip LIVE. Operator decision is mandatory.`,
    ].join('\n'),
    reversionCardId: reversionCardId || evaluation.currentEntry?.reversionCardId || null,
  };
}

/**
 * Format milliseconds as 'Xh Ym' or 'Xm Ys'.
 */
function formatDuration(ms) {
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
}

// ── Convenience: cycle hook ───────────────────────────────────────────────────

/**
 * Convenience entry point called from the cycle loop.
 * Returns the evaluation; caller decides whether to surface overdue state.
 */
function checkReversion({ now = new Date() } = {}) {
  return evaluate({ now });
}

module.exports = {
  DEFAULT_DECISION_WINDOW_MS,
  computeDeadline,
  evaluate,
  checkReversion,
  buildOverdueAlert,
  formatDuration,
};