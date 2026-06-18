// ── mode_audit.js ──────────────────────────────────────────────────────────────
// Phase 3 (Paper-Mode Build) — 2026-06-18
// Mode transition audit log. Writes to SQLite if available, falls back to
// append-only JSONL file (tests + first-run).
//
// SCHEMA (added to bot.db by server.js on init):
//   CREATE TABLE IF NOT EXISTS mode_transitions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     ts TEXT NOT NULL,                  -- ISO 8601
//     from_mode TEXT NOT NULL,
//     to_mode TEXT NOT NULL,
//     reason TEXT,
//     operator TEXT,
//     reversion_card_id TEXT,
//     deadline_iso TEXT,                 -- computed deadline (PAPER entries only)
//     deadline_status TEXT               -- 'armed' | 'cleared' | 'overdue' | 'resolved'
//   )
//   CREATE TABLE IF NOT EXISTS mode_decisions (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     ts TEXT NOT NULL,
//     kind TEXT NOT NULL,                -- 'revert_live' | 'stay_paper'
//     reason TEXT,
//     operator TEXT,
//     transition_id INTEGER              -- FK to mode_transitions.id (entry being decided)
//   )
//
// FALLBACK (when db is null):
//   - Append entries to mode_audit.jsonl in __dirname.
//   - Tests can use the JSONL writer to assert on entries without SQLite.

'use strict';

const fs = require('fs');
const path = require('path');

const FALLBACK_LOG = path.join(__dirname, 'mode_audit.jsonl');

let _db = null;

/**
 * Wire the SQLite database. Call once on server init.
 * Pass null to use JSONL fallback only.
 */
function setDb(dbHandle) {
  _db = dbHandle;
}

/**
 * Initialize the mode_transitions + mode_decisions tables.
 * Idempotent — safe to call on every startup.
 */
function initSchema(dbHandle) {
  const db = dbHandle || _db;
  if (!db) return;
  db.run(`CREATE TABLE IF NOT EXISTS mode_transitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    from_mode TEXT NOT NULL,
    to_mode TEXT NOT NULL,
    reason TEXT,
    operator TEXT,
    reversion_card_id TEXT,
    deadline_iso TEXT,
    deadline_status TEXT DEFAULT 'armed'
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS mode_decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts TEXT NOT NULL,
    kind TEXT NOT NULL,
    reason TEXT,
    operator TEXT,
    transition_id INTEGER
  )`);
}

/**
 * Log a mode transition.
 * Returns the inserted row id (DB) or a synthetic id (JSONL fallback).
 */
function logTransition({ fromMode, toMode, reason, operator, reversionCardId = null, deadlineIso = null }) {
  const ts = new Date().toISOString();
  const deadlineStatus = toMode === 'PAPER' ? 'armed' : 'cleared';

  if (_db) {
    const stmt = _db.prepare(`INSERT INTO mode_transitions
      (ts, from_mode, to_mode, reason, operator, reversion_card_id, deadline_iso, deadline_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(ts, fromMode, toMode, reason || null, operator || null,
                          reversionCardId || null, deadlineIso || null, deadlineStatus);
    return Number(info.lastInsertRowid);
  }

  // Fallback: JSONL
  const entry = {
    kind: 'transition',
    id: `jsonl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts, fromMode, toMode, reason, operator, reversionCardId, deadlineIso, deadlineStatus,
  };
  fs.appendFileSync(FALLBACK_LOG, JSON.stringify(entry) + '\n');
  return entry.id;
}

/**
 * Log a decision about a current PAPER run.
 */
function logDecision({ kind, reason = null, operator, transitionId = null }) {
  const ts = new Date().toISOString();
  if (_db) {
    const stmt = _db.prepare(`INSERT INTO mode_decisions
      (ts, kind, reason, operator, transition_id)
      VALUES (?, ?, ?, ?, ?)`);
    const info = stmt.run(ts, kind, reason || null, operator || null, transitionId || null);
    // Also mark the source transition's deadline_status as 'resolved'
    if (transitionId !== null) {
      _db.prepare(`UPDATE mode_transitions SET deadline_status = 'resolved' WHERE id = ?`).run(transitionId);
    }
    return Number(info.lastInsertRowid);
  }
  const entry = {
    kind: 'decision',
    id: `jsonl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts, decisionKind: kind, reason, operator, transitionId,
  };
  fs.appendFileSync(FALLBACK_LOG, JSON.stringify(entry) + '\n');
  return entry.id;
}

/**
 * Mark a transition's deadline_status as 'overdue'. Called by the cycle
 * loop when checkReversion reports paper_overdue_no_decision.
 */
function markOverdue(transitionId) {
  if (_db) {
    _db.prepare(`UPDATE mode_transitions SET deadline_status = 'overdue' WHERE id = ? AND deadline_status = 'armed'`).run(transitionId);
    return true;
  }
  const entry = {
    kind: 'overdue_mark',
    ts: new Date().toISOString(),
    transitionId,
  };
  fs.appendFileSync(FALLBACK_LOG, JSON.stringify(entry) + '\n');
  return true;
}

/**
 * Get the most recent transition row (for tests + reconciliation).
 */
function latestTransition() {
  if (_db) {
    return _db.prepare(`SELECT * FROM mode_transitions ORDER BY id DESC LIMIT 1`).get();
  }
  if (!fs.existsSync(FALLBACK_LOG)) return null;
  const lines = fs.readFileSync(FALLBACK_LOG, 'utf8').trim().split('\n').filter(Boolean);
  if (lines.length === 0) return null;
  // Walk backwards for last 'transition' kind
  for (let i = lines.length - 1; i >= 0; i--) {
    const parsed = JSON.parse(lines[i]);
    if (parsed.kind === 'transition') return parsed;
  }
  return null;
}

/**
 * Reset (clear) the fallback JSONL. Tests only.
 */
function _resetFallback() {
  if (fs.existsSync(FALLBACK_LOG)) {
    fs.unlinkSync(FALLBACK_LOG);
  }
  _db = null;
}

module.exports = {
  setDb,
  initSchema,
  logTransition,
  logDecision,
  markOverdue,
  latestTransition,
  _resetFallback,
  FALLBACK_LOG,
};