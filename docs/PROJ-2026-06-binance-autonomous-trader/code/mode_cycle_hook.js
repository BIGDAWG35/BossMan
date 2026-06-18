// ── mode_cycle_hook.js ─────────────────────────────────────────────────────────
// Phase 3 (Paper-Mode Build) — 2026-06-18
// Cycle-loop integration. Called once per checkAndTrade cycle from server.js.
// Wires together mode_state + paper_reversion + mode_audit.
//
// BEHAVIOR (per SPEC § "PAPER/LIVE discipline with 24-hour decision rule"):
//   - In LIVE: nothing to do.
//   - In PAPER, in window: nothing to do.
//   - In PAPER, no decision, overdue:
//        * mark the most recent transition as 'overdue'
//        * emit a critical alert (caller routes to console / Kanban / Telegram)
//        * NEVER auto-flip LIVE
//   - In PAPER, decision recorded: nothing to do (decision cleared the deadline).
//
// The caller controls how alerts are routed (Kanban comment, Telegram, console).
// This module is sync except for the alert dispatch (caller-provided callback).

'use strict';

const modeState = require('./mode_state');
const modeAudit = require('./mode_audit');
const paperReversion = require('./paper_reversion');

/**
 * Run the cycle hook.
 *
 * @param {Object} opts
 * @param {Function} [opts.alert] — async (alertPayload) => void. Called when overdue.
 *                                    If absent, alert is logged to console only.
 * @param {Date}     [opts.now]  — current time (inject for tests).
 * @param {Object}   [opts.modeStateOverride] — override mode state (tests only).
 *
 * @returns {Object} { evaluation, alertEmitted: boolean }
 */
async function runCycleHook({ alert = null, now = new Date(), modeStateOverride = null } = {}) {
  const evaluation = paperReversion.evaluate({ now, modeStateOverride });

  if (evaluation.status !== 'paper_overdue_no_decision') {
    return { evaluation, alertEmitted: false };
  }

  // Overdue — record + alert.
  // Find the most recent PAPER entry transition row id to mark overdue.
  let transitionId = null;
  try {
    const latest = modeAudit.latestTransition();
    if (latest && latest.to_mode === 'PAPER' && latest.deadline_status === 'armed') {
      transitionId = typeof latest.id === 'number' ? latest.id : null;
    }
  } catch (e) {
    // If audit DB is unreachable, still emit alert — the alert is the source of truth.
  }

  if (transitionId !== null) {
    try {
      modeAudit.markOverdue(transitionId);
    } catch (e) {
      // Audit write failed — log + continue to alert
      console.error('[mode_cycle_hook] markOverdue failed:', e.message);
    }
  }

  const alertPayload = paperReversion.buildOverdueAlert(evaluation, evaluation.currentEntry?.reversionCardId);

  if (alert) {
    try {
      await alert(alertPayload);
    } catch (e) {
      console.error('[mode_cycle_hook] alert dispatch failed:', e.message);
    }
  } else {
    console.warn('[mode_cycle_hook] OVERDUE (no alert handler wired):');
    console.warn(alertPayload ? alertPayload.body : '(no payload)');
  }

  return { evaluation, alertEmitted: true };
}

module.exports = {
  runCycleHook,
};