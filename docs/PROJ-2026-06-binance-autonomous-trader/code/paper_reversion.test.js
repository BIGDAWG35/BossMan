// ── paper_reversion.test.js ────────────────────────────────────────────────────
// Phase 3 unit tests — 2026-06-18
// Pure-Node test runner (node:test, no external deps).
// Run with: node --test paper_reversion.test.js

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const modeState = require('./mode_state');
const modeAudit = require('./mode_audit');
const paperReversion = require('./paper_reversion');
const modeCycleHook = require('./mode_cycle_hook');

// ── helpers ───────────────────────────────────────────────────────────────────
function makeEntryAt(hoursAgo) {
  const at = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
  return modeState.freshState(); // not used directly; we use _setState
}

// ── mode_state tests ──────────────────────────────────────────────────────────

test('mode_state: default mode is PAPER (env default true)', () => {
  // Save + restore env
  const saved = process.env.PAPER_MODE;
  process.env.PAPER_MODE = 'true';
  modeState._reset();
  assert.equal(modeState.current(), 'PAPER');
  assert.equal(modeState.isPaper(), true);
  if (saved !== undefined) process.env.PAPER_MODE = saved; else delete process.env.PAPER_MODE;
});

test('mode_state: env PAPER_MODE=false yields LIVE', () => {
  const saved = process.env.PAPER_MODE;
  process.env.PAPER_MODE = 'false';
  modeState._reset();
  assert.equal(modeState.current(), 'LIVE');
  assert.equal(modeState.isPaper(), false);
  if (saved !== undefined) process.env.PAPER_MODE = saved; else delete process.env.PAPER_MODE;
});

test('mode_state: recordTransition LIVE→PAPER sets currentEntry + logs transition', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE', currentEntry: null });
  const entry = modeState.recordTransition({
    to: 'PAPER',
    reason: 'test entry',
    operator: 'bossman',
    reversionCardId: 'card_123',
  });
  assert.equal(entry.from, 'LIVE');
  assert.equal(entry.to, 'PAPER');
  assert.equal(modeState.current(), 'PAPER');
  const cur = modeState.currentPaperEntry();
  assert.ok(cur !== null);
  assert.equal(cur.reason, 'test entry');
  assert.equal(cur.operator, 'bossman');
  assert.equal(cur.reversionCardId, 'card_123');
  assert.ok(typeof cur.at === 'string' && cur.at.length > 0);
});

test('mode_state: recordTransition rejects no-op (PAPER→PAPER)', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'PAPER' });
  assert.throws(
    () => modeState.recordTransition({ to: 'PAPER', reason: 'x', operator: 'y' }),
    /refusing no-op transition/
  );
});

test('mode_state: recordDecision requires reason when kind=stay_paper', () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: new Date().toISOString(), reason: 'r', operator: 'o', reversionCardId: null },
  });
  assert.throws(
    () => modeState.recordDecision({ kind: 'stay_paper', operator: 'bossman' }),
    /requires reason/
  );
});

test('mode_state: recordDecision accepts valid stay_paper', () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: new Date().toISOString(), reason: 'r', operator: 'o', reversionCardId: null },
  });
  const d = modeState.recordDecision({ kind: 'stay_paper', operator: 'bossman', reason: 'awaiting approval' });
  assert.equal(d.kind, 'stay_paper');
  assert.equal(d.reason, 'awaiting approval');
  assert.equal(d.operator, 'bossman');
});

test('mode_state: recordDecision rejects when in LIVE mode', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE' });
  assert.throws(
    () => modeState.recordDecision({ kind: 'revert_live', operator: 'bossman' }),
    /cannot record decision while in LIVE/
  );
});

test('mode_state: latestDecision returns null when no decisions', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'PAPER' });
  assert.equal(modeState.latestDecision(), null);
});

// ── paper_reversion.evaluate tests ────────────────────────────────────────────

test('paper_reversion: status=live when in LIVE mode', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE' });
  const e = paperReversion.evaluate({ now: new Date() });
  assert.equal(e.status, 'live');
  assert.equal(e.deadline, null);
  assert.equal(e.currentEntry, null);
});

test('paper_reversion: status=paper_in_window when fresh PAPER entry', () => {
  modeState._reset();
  const entryAt = new Date(Date.now() - 1 * 3600 * 1000).toISOString(); // 1h ago
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  });
  const e = paperReversion.evaluate({ now: new Date() });
  assert.equal(e.status, 'paper_in_window');
  assert.ok(e.deadline instanceof Date);
  assert.equal(e.latestDecision, null);
  assert.equal(e.overdueByMs, null);
});

test('paper_reversion: status=paper_overdue_no_decision when >24h, no decision', () => {
  modeState._reset();
  const entryAt = new Date(Date.now() - 25 * 3600 * 1000).toISOString(); // 25h ago
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  });
  const e = paperReversion.evaluate({ now: new Date() });
  assert.equal(e.status, 'paper_overdue_no_decision');
  assert.ok(e.overdueByMs > 0);
  assert.ok(e.overdueByMs >= 3600 * 1000); // at least 1h past
});

test('paper_reversion: status=paper_with_decision when decision recorded (even if overdue)', () => {
  modeState._reset();
  const entryAt = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
  const state = {
    current: 'PAPER',
    transitions: [],
    decisions: [{ at: new Date().toISOString(), kind: 'stay_paper', reason: 'wait', operator: 'bossman' }],
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  };
  const e = paperReversion.evaluate({ now: new Date(), modeStateOverride: state });
  assert.equal(e.status, 'paper_with_decision');
  assert.equal(e.latestDecision.kind, 'stay_paper');
});

test('paper_reversion: boundary — exactly 24h00m00s is overdue (>= deadline)', () => {
  modeState._reset();
  const now = new Date('2026-06-18T12:00:00Z');
  const entryAt = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: null },
  });
  const e = paperReversion.evaluate({ now });
  // At exactly the deadline, now >= deadline → overdue
  assert.equal(e.status, 'paper_overdue_no_decision');
});

test('paper_reversion: 23h59m is still in window', () => {
  modeState._reset();
  const now = new Date('2026-06-18T12:00:00Z');
  const entryAt = new Date(now.getTime() - (24 * 3600 * 1000 - 60 * 1000)).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: null },
  });
  const e = paperReversion.evaluate({ now });
  assert.equal(e.status, 'paper_in_window');
});

test('paper_reversion: PAPER with no entry record = overdue-no-decision anomaly', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'PAPER', currentEntry: null });
  const e = paperReversion.evaluate({ now: new Date() });
  assert.equal(e.status, 'paper_overdue_no_decision');
});

test('paper_reversion: computeDeadline returns entry + window', () => {
  const at = '2026-06-18T00:00:00Z';
  const deadline = paperReversion.computeDeadline(at);
  assert.equal(deadline.toISOString(), '2026-06-19T00:00:00.000Z');
});

test('paper_reversion: computeDeadline rejects invalid timestamp', () => {
  assert.throws(
    () => paperReversion.computeDeadline('not-a-date'),
    /invalid entry timestamp/
  );
});

test('paper_reversion: custom window override works', () => {
  const at = '2026-06-18T00:00:00Z';
  const deadline = paperReversion.computeDeadline(at, 60 * 1000); // 1 min
  assert.equal(deadline.toISOString(), '2026-06-18T00:01:00.000Z');
});

test('paper_reversion: buildOverdueAlert returns null when not overdue', () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE' });
  const e = paperReversion.evaluate({ now: new Date() });
  assert.equal(paperReversion.buildOverdueAlert(e, 'c1'), null);
});

test('paper_reversion: buildOverdueAlert contains key fields', () => {
  modeState._reset();
  const entryAt = new Date(Date.now() - 30 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'test new structure', operator: 'bossman', reversionCardId: 'card_abc' },
  });
  const e = paperReversion.evaluate({ now: new Date() });
  const alert = paperReversion.buildOverdueAlert(e, 'card_abc');
  assert.ok(alert !== null);
  assert.equal(alert.severity, 'critical');
  assert.equal(alert.title, 'PAPER decision overdue');
  assert.ok(alert.body.includes('test new structure'));
  assert.ok(alert.body.includes('card_abc'));
  assert.ok(alert.body.includes('Gate 1'));
  assert.ok(alert.body.includes('NEVER auto-flip LIVE') || alert.body.includes('NOT auto-flip LIVE'));
});

// ── mode_audit tests (JSONL fallback) ─────────────────────────────────────────

test('mode_audit: logTransition writes to JSONL when no DB', () => {
  modeAudit._resetFallback();
  const id = modeAudit.logTransition({
    fromMode: 'LIVE',
    toMode: 'PAPER',
    reason: 'jsonl test',
    operator: 'bossman',
    reversionCardId: 'c1',
    deadlineIso: '2026-06-19T00:00:00Z',
  });
  assert.ok(typeof id === 'string' && id.startsWith('jsonl_'));
  const latest = modeAudit.latestTransition();
  assert.equal(latest.toMode, 'PAPER');
  assert.equal(latest.reason, 'jsonl test');
  modeAudit._resetFallback();
});

test('mode_audit: logDecision + markOverdue write JSONL entries', () => {
  modeAudit._resetFallback();
  const tId = modeAudit.logTransition({
    fromMode: 'LIVE', toMode: 'PAPER',
    reason: 'r', operator: 'o',
    deadlineIso: new Date(Date.now() + 86400000).toISOString(),
  });
  modeAudit.logDecision({ kind: 'stay_paper', reason: 'wait', operator: 'bossman', transitionId: tId });
  modeAudit.markOverdue(tId);
  // Read the JSONL back
  const fs = require('fs');
  const lines = fs.readFileSync(modeAudit.FALLBACK_LOG, 'utf8').trim().split('\n');
  const kinds = lines.map(l => JSON.parse(l).kind);
  assert.ok(kinds.includes('transition'));
  assert.ok(kinds.includes('decision'));
  assert.ok(kinds.includes('overdue_mark'));
  modeAudit._resetFallback();
});

// ── mode_cycle_hook integration tests ─────────────────────────────────────────

test('mode_cycle_hook: LIVE mode = no alert emitted', async () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE' });
  let called = false;
  const r = await modeCycleHook.runCycleHook({ alert: async () => { called = true; } });
  assert.equal(called, false);
  assert.equal(r.alertEmitted, false);
  assert.equal(r.evaluation.status, 'live');
});

test('mode_cycle_hook: PAPER in window = no alert emitted', async () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: new Date(Date.now() - 1000).toISOString(), reason: 'r', operator: 'o', reversionCardId: null },
  });
  let called = false;
  const r = await modeCycleHook.runCycleHook({ alert: async () => { called = true; } });
  assert.equal(called, false);
  assert.equal(r.alertEmitted, false);
  assert.equal(r.evaluation.status, 'paper_in_window');
});

test('mode_cycle_hook: PAPER overdue = alert emitted, never flips LIVE', async () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: {
      at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
      reason: 'r', operator: 'bossman', reversionCardId: 'card_x',
    },
  });
  let alerted = null;
  const r = await modeCycleHook.runCycleHook({
    alert: async (p) => { alerted = p; },
  });
  assert.equal(r.alertEmitted, true);
  assert.ok(alerted !== null);
  assert.equal(alerted.title, 'PAPER decision overdue');
  assert.equal(r.evaluation.status, 'paper_overdue_no_decision');
  // CRITICAL: mode must still be PAPER — bot never auto-flips LIVE
  assert.equal(modeState.current(), 'PAPER');
});

test('mode_cycle_hook: PAPER with decision = no alert', async () => {
  modeState._reset();
  const state = {
    current: 'PAPER',
    transitions: [],
    decisions: [{ at: new Date().toISOString(), kind: 'stay_paper', reason: 'awaiting', operator: 'bossman' }],
    currentEntry: {
      at: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
      reason: 'r', operator: 'o', reversionCardId: 'c1',
    },
  };
  let called = false;
  const r = await modeCycleHook.runCycleHook({
    alert: async () => { called = true; },
    modeStateOverride: state,
  });
  assert.equal(called, false);
  assert.equal(r.alertEmitted, false);
  assert.equal(r.evaluation.status, 'paper_with_decision');
});

test('mode_cycle_hook: idempotent — multiple cycles while overdue do not throw', async () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: {
      at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
      reason: 'r', operator: 'o', reversionCardId: 'c1',
    },
  });
  let count = 0;
  const alert = async () => { count++; };
  for (let i = 0; i < 5; i++) {
    await modeCycleHook.runCycleHook({ alert });
  }
  assert.equal(count, 5);
  // mode is still PAPER (never flipped)
  assert.equal(modeState.current(), 'PAPER');
});

test('mode_cycle_hook: alert handler error does not throw out of cycle hook', async () => {
  modeState._reset();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: {
      at: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
      reason: 'r', operator: 'o', reversionCardId: null,
    },
  });
  const r = await modeCycleHook.runCycleHook({
    alert: async () => { throw new Error('handler boom'); },
  });
  // Hook should swallow the error and report alertEmitted=true
  assert.equal(r.alertEmitted, true);
});

// ── FINAL GUARANTEE — the 24h rule itself ─────────────────────────────────────

test('GUARANTEE: bot never auto-flips LIVE after 24h overdue', async () => {
  // Simulate the full timeline: LIVE → PAPER → 25h pass → many cycles
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE', currentEntry: null });

  // Pin entry 25h before "now()", so the deadline = entry + 24h ≈ 1h before now()
  const entryAt = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'test structure X', operator: 'bossman', reversionCardId: 'card_z' },
  });

  // Run 10 cycles at the current time (which is 25h after entry → already overdue)
  let alertCount = 0;
  for (let i = 0; i < 10; i++) {
    const r = await modeCycleHook.runCycleHook({
      alert: async () => { alertCount++; },
    });
    assert.equal(r.alertEmitted, true, `cycle ${i} should emit alert — entry is 25h old`);
  }
  assert.equal(alertCount, 10);

  // Also test crossing the boundary: at hour 23, no alert; at hour 24, alert.
  modeState._reset();
  const entryBoundary = new Date(Date.now() - 23 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryBoundary, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  });
  const r23 = await modeCycleHook.runCycleHook({ now: new Date() });
  assert.equal(r23.alertEmitted, false, '23h entry should not be overdue');

  // Now advance entry to 25h
  const entryOverdue = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryOverdue, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  });
  const r25 = await modeCycleHook.runCycleHook({ now: new Date() });
  assert.equal(r25.alertEmitted, true, '25h entry should be overdue');

  // CRITICAL — still PAPER. Bot did not flip LIVE on its own.
  assert.equal(modeState.current(), 'PAPER', 'BOT AUTO-FLIPPED LIVE — RULE VIOLATION');
});

test('GUARANTEE: operator decision stops overdue from firing', async () => {
  modeState._reset();
  modeState._setState({ ...modeState.freshState(), current: 'LIVE' });

  // Pin entry 25h before now → overdue from the start
  const entryAt = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
  modeState._setState({
    ...modeState.freshState(),
    current: 'PAPER',
    currentEntry: { at: entryAt, reason: 'r', operator: 'o', reversionCardId: 'c1' },
  });

  // 25 hours pass with no decision → overdue
  let r1 = await modeCycleHook.runCycleHook({ now: new Date() });
  assert.equal(r1.alertEmitted, true);

  // Operator records decision (stay_paper with reason)
  modeState.recordDecision({ kind: 'stay_paper', reason: 'awaiting Marcelo sign-off on Phase 4', operator: 'bossman' });

  // 1 more hour — no alert
  const t2 = new Date(Date.now() + 1 * 3600 * 1000);
  let r2 = await modeCycleHook.runCycleHook({ now: t2 });
  assert.equal(r2.alertEmitted, false);
  assert.equal(r2.evaluation.status, 'paper_with_decision');
});