#!/usr/bin/env node
/**
 * bossman_decision.js — Stage 6 of DAILY-RADAR pipeline (L-CRYPTO-14 governance)
 *
 * Purpose:
 *   Pure BossMan decision emitter. Reads Stage 1-3 intel + weekly regime + the
 *   canonical 15-pair PAIRS universe (read-only). Emits ONE structured artifact:
 *     - data/bossman_decision.json             (latest, overwritten each run)
 *     - data/bossman_decision.<date>.json      (dated archive)
 *
 * Hard rules (L-CRYPTO-14 + L-CRYPTO-15 — enforced before any file write):
 *   1. No per-coin notional_usd < 75 (drop or deny; artifact must NOT contain sub-75).
 *   2. universe.active MUST be the canonical 15 USDT pairs (from server.js PAIRS).
 *   3. watchlist ≤ 3, do_not_touch ≤ 3, no overlap.
 *   4. do_not_touch entries MUST be drawn from the original PAIRS list (block only).
 *   5. aggression_tier ∈ {TIER_1_CONSERVATIVE, TIER_2_BASE, TIER_3_AGGRESSIVE}.
 *   6. regime_today ∈ valid enum set.
 *   7. Strategy class ∈ {scalper, swing, position, hedge} (L-CRYPTO-12 fixed set).
 *   8. Schema validation (inline Ajv-style). On any hard reject: do NOT write.
 *
 * Wire discipline (L-CRYPTO-03 + L-CRYPTO-14):
 *   - Does NOT mutate .env, server.js, pre-trade-hook.js, ecosystem.config.cjs.
 *   - Does NOT send Telegram / push / email.
 *   - Does NOT trigger, size, block, or alter any trade.
 *   - Does NOT flip PAPER ↔ LIVE.
 *   - Does NOT change numeric risk/aggression bands or LIVE_PILOT_MAX_NOTIONAL.
 *
 * Usage:
 *   node scripts/bossman_decision.js                  # today's decision
 *   node scripts/bossman_decision.js --date 2026-06-19  # backfill
 *   node scripts/bossman_decision.js --dry-run        # show, write nothing
 *   node scripts/bossman_decision.js --schema         # print JSON schema and exit
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// ─── Constants ───────────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, '..', 'data');
const HEAT_TAG_PATH = path.join(DATA_DIR, 'daily_radar.json');
const PAIR_BRIEFS_PATH = path.join(DATA_DIR, 'pair_briefs.json');
const DECISION_PATH = path.join(DATA_DIR, 'bossman_decision.json');
const KNOWLEDGE_DIR = path.join(os.homedir(), '.hermes', 'knowledge', 'crypto-intel', 'daily');
const WEEKLY_INTEL = path.join(os.homedir(), '.hermes', 'knowledge', 'crypto-intel', 'weekly', 'latest', 'intelligence.json');

// Canonical 15-pair universe — mirrored from server.js PAIRS constant.
// Stage 6 reads PAIRS via grep on server.js (read-only) and falls back to this
// hard-coded copy. Stage 6 NEVER rewrites server.js.
const FALLBACK_PAIRS = [
  'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT', 'VETUSDT',
  'AVAXUSDT', 'HBARUSDT', 'DOTUSDT', 'XLMUSDT', 'SUIUSDT',
  'CAKEUSDT', 'PEPEUSDT', 'HYPEUSDT', 'FETUSDT', 'NEARUSDT',
];

const USDT_SYMBOL_RE = /^[A-Z0-9]{2,15}USDT$/;
const VALID_REGIMES = new Set([
  'EARLY_CYCLE', 'MID_CYCLE', 'LATE_CYCLE', 'DISTRIBUTION',
  'RISK_OFF', 'RECOVERY', 'UNKNOWN',
]);
const VALID_TIERS = new Set([
  'TIER_1_CONSERVATIVE', 'TIER_2_BASE', 'TIER_3_AGGRESSIVE',
]);
const VALID_STRATEGIES = new Set(['scalper', 'swing', 'position', 'hedge']);
const VALID_DECISIONS = new Set(['QUALIFY', 'DENY', 'WATCH_ONLY']);
const VALID_CONFIDENCE = new Set(['HIGH', 'MEDIUM', 'LOW']);
const VALID_RESEARCH_QUALITY = new Set(['OK', 'PARTIAL', 'MISSING']);
const HARD_MIN_NOTIONAL_USD = 75;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readJson(p, fallback = null) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function parseArgs(argv) {
  const args = { date: null, dryRun: false, schema: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--date') args.date = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--schema') { args.schema = true; }
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/bossman_decision.js [--date YYYY-MM-DD] [--dry-run] [--schema]');
      process.exit(0);
    }
  }
  return args;
}

/**
 * Read the canonical 15-pair universe from server.js PAIRS constant.
 * Read-only — parses the source, never writes back. Falls back to the
 * hard-coded FALLBACK_PAIRS if parsing fails.
 */
function readPairsFromServer() {
  const serverJs = path.join(__dirname, '..', 'server.js');
  if (!fs.existsSync(serverJs)) return FALLBACK_PAIRS.slice();
  try {
    const src = fs.readFileSync(serverJs, 'utf8');
    const m = src.match(/const\s+PAIRS\s*=\s*\[([^\]]+)\]/);
    if (!m) return FALLBACK_PAIRS.slice();
    const pairs = m[1]
      .split(',')
      .map((s) => s.trim().replace(/^['"]|['"]$/g, '').toUpperCase())
      .filter((s) => USDT_SYMBOL_RE.test(s));
    if (pairs.length !== FALLBACK_PAIRS.length) return FALLBACK_PAIRS.slice();
    return pairs;
  } catch {
    return FALLBACK_PAIRS.slice();
  }
}

function cleanSymbol(s) {
  if (!s) return null;
  s = String(s).toUpperCase().trim();
  if (!USDT_SYMBOL_RE.test(s)) return null;
  return s;
}

function uuid() {
  return crypto.randomBytes(8).toString('hex');
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// ─── Normalization (memo + radar → watchlist / do_not_touch) ────────────────

/**
 * Apply L-CRYPTO-03 contract: max 3 watchlist, max 3 do-not-touch.
 * do-not-touch ALWAYS wins over watchlist (a symbol cannot be both).
 * do-not-touch only from the original PAIRS list (we block, never add).
 */
function normalizeUniverse({ memo, pairsUniverse }) {
  const memoChanges = memo?.watchlist_changes || {};
  const memoDoNotTouch = memo?.do_not_touch || [];

  const pairSet = new Set(pairsUniverse);
  const watchRaw = [
    ...(memoChanges.added || []),
    ...(memo?.top_3_thesis || []).map((t) => t.symbol).slice(0, 3),
  ];
  const dntRaw = [
    ...memoDoNotTouch,
    ...(memoChanges.removed || []),
  ];

  const watchSet = new Set();
  const dntSet = new Set();
  for (const w of watchRaw) {
    const c = cleanSymbol(w);
    // L-CRYPTO-15 conservative rule: watchlist only from PAIRS universe
    // (avoid emitting watchlist entries that contradict per_coin coverage).
    if (c && pairSet.has(c)) watchSet.add(c);
  }
  for (const d of dntRaw) {
    const c = cleanSymbol(d);
    // do_not_touch: only accept symbols from the canonical PAIRS universe.
    if (c && pairSet.has(c)) dntSet.add(c);
  }

  // do-not-touch wins over watchlist.
  for (const sym of dntSet) watchSet.delete(sym);

  // Trim to 3 each (L-CRYPTO-03 hard cap).
  const watchlist = [...watchSet].slice(0, 3);
  const do_not_touch = [...dntSet].slice(0, 3);

  return { watchlist, do_not_touch };
}

// ─── Per-coin decision logic ─────────────────────────────────────────────────

/**
 * Map band + risk_callout + price_window → decision/tier/strategy/notional.
 * The signal-layer $75 floor is enforced by setting notional_usd = 75 (the
 * minimum) and emitting DENY if score is null/risk_callout is blocking.
 */
function decideCoin({ symbol, brief, defaultBand, confidence, researchQuality }) {
  const band = brief?.band || defaultBand || 'WARM';
  const risk = brief?.risk_callout || 'none';
  const pw = brief?.price_window_status || 'unknown';
  const score = brief?.score;
  const sector = brief?.sector || 'uncovered';

  // Blocking conditions → DENY (still emits a row, but decision=DENY).
  let decision = 'QUALIFY';
  const reasons = [];

  if (pw === 'out') {
    decision = 'DENY';
    reasons.push('price_window=out');
  }
  if (risk === 'low_liquidity' || risk === 'manipulation') {
    decision = 'DENY';
    reasons.push(`risk_callout=${risk}`);
  }
  if (band === 'COLD') {
    decision = 'DENY';
    reasons.push('band=COLD');
  }
  if (score !== null && score !== undefined && score < 0.4) {
    decision = 'DENY';
    reasons.push(`score=${score.toFixed(2)}<0.4`);
  }

  // Tier selection (named, fixed — BossMan picks, never redefines).
  let tier;
  if (band === 'HOT' && risk === 'none' && confidence === 'HIGH' && score !== null && score >= 0.7) {
    tier = 'TIER_3_AGGRESSIVE';
  } else if (band === 'HOT' || band === 'WARM') {
    tier = 'TIER_2_BASE';
  } else {
    tier = 'TIER_1_CONSERVATIVE';
  }

  // Strategy class (L-CRYPTO-12 fixed set, band-driven default + rationale).
  let strategyClass;
  if (band === 'HOT' && (sector === 'L1' || sector === 'memecoin')) {
    strategyClass = 'scalper';
  } else if (band === 'WARM' && (sector === 'L1' || sector === 'DeFi')) {
    strategyClass = 'swing';
  } else if (sector === 'store_of_value' || sector === 'L1') {
    strategyClass = 'position';
  } else {
    strategyClass = 'swing';
  }

  // Notional: hard $75 minimum, T3 capped at 1.5×.
  let notional = HARD_MIN_NOTIONAL_USD;
  if (tier === 'TIER_3_AGGRESSIVE') {
    notional = Math.round(HARD_MIN_NOTIONAL_USD * 1.5); // = 113
  }

  // Hard $75 signal-layer floor: if notional < 75, drop the row entirely.
  // We never produce a sub-75 rec.
  if (notional < HARD_MIN_NOTIONAL_USD) {
    return null; // dropped
  }

  // Watchlist / do-not-touch overrides.
  // (Caller will handle dnt → DENY and watchlist → boost, after this returns.)

  // Soft warning downgrade: if confidence=LOW or research=MISSING,
  // downgrade QUALIFY → WATCH_ONLY.
  if ((confidence === 'LOW' || researchQuality === 'MISSING') && decision === 'QUALIFY') {
    decision = 'WATCH_ONLY';
    reasons.push(`downgraded:confidence=${confidence},research=${researchQuality}`);
  }

  const rationaleParts = [
    `${band}`,
    `sector=${sector}`,
    score !== null && score !== undefined ? `score=${score.toFixed(2)}` : null,
    `tier=${tier}`,
    `class=${strategyClass}`,
    reasons.length ? `flags=[${reasons.join(',')}]` : null,
  ].filter(Boolean);

  return {
    symbol,
    decision,
    strategy_class: strategyClass,
    aggression_tier: tier,
    notional_usd: notional,
    rationale: rationaleParts.join(' | ').slice(0, 200),
    risk_callout: risk,
    price_window_status: pw,
  };
}

// ─── Inline schema validator (no Ajv dependency) ────────────────────────────

/**
 * Validates the candidate artifact against the L-CRYPTO-15 schema.
 * Returns { ok: true } or { ok: false, reason: '...' }.
 * On false, the caller MUST NOT write the artifact.
 */
function validateArtifact(artifact, pairsUniverse) {
  // Top-level required fields.
  const required = [
    'schema_version', 'generated_at', 'date', 'decision_layer',
    'l_crypto_rule', 'regime_today', 'confidence', 'research_quality',
    'universe', 'per_coin', 'floor_audit', 'mode', 'next_action', 'preview_id',
  ];
  for (const f of required) {
    if (!(f in artifact)) return { ok: false, reason: `missing field: ${f}` };
  }

  if (artifact.schema_version !== '1.0') {
    return { ok: false, reason: `bad schema_version: ${artifact.schema_version}` };
  }
  if (artifact.decision_layer !== 'bossman_v1') {
    return { ok: false, reason: `bad decision_layer: ${artifact.decision_layer}` };
  }
  if (artifact.l_crypto_rule !== 'L-CRYPTO-14') {
    return { ok: false, reason: `bad l_crypto_rule: ${artifact.l_crypto_rule}` };
  }

  if (!VALID_REGIMES.has(artifact.regime_today)) {
    return { ok: false, reason: `bad regime_today: ${artifact.regime_today}` };
  }
  if (!VALID_CONFIDENCE.has(artifact.confidence)) {
    return { ok: false, reason: `bad confidence: ${artifact.confidence}` };
  }
  if (!VALID_RESEARCH_QUALITY.has(artifact.research_quality)) {
    return { ok: false, reason: `bad research_quality: ${artifact.research_quality}` };
  }

  // universe.active: exact 15 USDT pairs, no extras.
  const u = artifact.universe;
  if (!Array.isArray(u.active) || u.active.length !== pairsUniverse.length) {
    return { ok: false, reason: `universe.active length=${u.active?.length}, expected ${pairsUniverse.length}` };
  }
  const pairSet = new Set(pairsUniverse);
  for (const sym of u.active) {
    if (!USDT_SYMBOL_RE.test(sym)) return { ok: false, reason: `universe.active non-USDT: ${sym}` };
    if (!pairSet.has(sym)) return { ok: false, reason: `universe.active not in canonical PAIRS: ${sym}` };
  }
  // Order check: identical ordering to server.js PAIRS.
  for (let i = 0; i < u.active.length; i++) {
    if (u.active[i] !== pairsUniverse[i]) {
      return { ok: false, reason: `universe.active order mismatch at ${i}: ${u.active[i]} vs ${pairsUniverse[i]}` };
    }
  }

  if (!Array.isArray(u.watchlist) || u.watchlist.length > 3) {
    return { ok: false, reason: `watchlist length ${u.watchlist?.length} > 3` };
  }
  if (!Array.isArray(u.do_not_touch) || u.do_not_touch.length > 3) {
    return { ok: false, reason: `do_not_touch length ${u.do_not_touch?.length} > 3` };
  }
  for (const sym of [...u.watchlist, ...u.do_not_touch]) {
    if (!USDT_SYMBOL_RE.test(sym)) {
      return { ok: false, reason: `non-USDT in watchlist/dnt: ${sym}` };
    }
  }
  // do_not_touch MUST come from PAIRS only.
  for (const sym of u.do_not_touch) {
    if (!pairSet.has(sym)) {
      return { ok: false, reason: `do_not_touch contains non-PAIR: ${sym}` };
    }
  }
  // No overlap between watchlist and do_not_touch.
  const watchSet = new Set(u.watchlist);
  for (const sym of u.do_not_touch) {
    if (watchSet.has(sym)) {
      return { ok: false, reason: `watchlist ∩ do_not_touch: ${sym}` };
    }
  }

  // per_coin: must cover all 15 active symbols (some may be WATCH_ONLY/DENY).
  if (!Array.isArray(artifact.per_coin) || artifact.per_coin.length !== pairsUniverse.length) {
    return {
      ok: false,
      reason: `per_coin length ${artifact.per_coin?.length}, expected ${pairsUniverse.length}`,
    };
  }
  const perCoinSymbols = new Set();
  for (const row of artifact.per_coin) {
    if (!row.symbol || !pairSet.has(row.symbol)) {
      return { ok: false, reason: `per_coin has non-PAIR: ${row.symbol}` };
    }
    if (perCoinSymbols.has(row.symbol)) {
      return { ok: false, reason: `per_coin duplicate: ${row.symbol}` };
    }
    perCoinSymbols.add(row.symbol);

    if (!VALID_DECISIONS.has(row.decision)) {
      return { ok: false, reason: `per_coin ${row.symbol} bad decision: ${row.decision}` };
    }
    if (!VALID_STRATEGIES.has(row.strategy_class)) {
      return { ok: false, reason: `per_coin ${row.symbol} bad strategy_class: ${row.strategy_class}` };
    }
    if (!VALID_TIERS.has(row.aggression_tier)) {
      return { ok: false, reason: `per_coin ${row.symbol} bad aggression_tier: ${row.aggression_tier}` };
    }
    // Hard $75 floor (signal layer).
    if (typeof row.notional_usd !== 'number' || row.notional_usd < HARD_MIN_NOTIONAL_USD) {
      return {
        ok: false,
        reason: `per_coin ${row.symbol} notional_usd ${row.notional_usd} < ${HARD_MIN_NOTIONAL_USD}`,
      };
    }
    if (!row.rationale || typeof row.rationale !== 'string') {
      return { ok: false, reason: `per_coin ${row.symbol} missing rationale` };
    }
  }
  // All 15 PAIRS must appear exactly once.
  for (const sym of pairsUniverse) {
    if (!perCoinSymbols.has(sym)) {
      return { ok: false, reason: `per_coin missing: ${sym}` };
    }
  }

  // floor_audit.
  const fa = artifact.floor_audit;
  if (!fa || fa.min_notional_usd !== HARD_MIN_NOTIONAL_USD) {
    return { ok: false, reason: 'floor_audit.min_notional_usd != 75' };
  }
  if (fa.min_notional_source !== 'L-CRYPTO-14 hard rule') {
    return { ok: false, reason: 'floor_audit.min_notional_source wrong' };
  }
  if (typeof fa.violations_dropped !== 'number' || fa.violations_dropped < 0) {
    return { ok: false, reason: 'floor_audit.violations_dropped invalid' };
  }
  if (typeof fa.denied_below_floor !== 'number' || fa.denied_below_floor < 0) {
    return { ok: false, reason: 'floor_audit.denied_below_floor invalid' };
  }

  // mode: READ_FROM_ENV strings only.
  const mode = artifact.mode;
  if (mode.PAPER_MODE !== 'READ_FROM_ENV' ||
      mode.LIVE_PILOT_MAX_NOTIONAL !== 'READ_FROM_ENV' ||
      mode.stage_6_mutation !== 'NONE — advisory only') {
    return { ok: false, reason: 'mode block malformed (Stage 6 must not mutate env)' };
  }

  // next_action must be a known string.
  if (!['human_review_or_approval_required', 'human_review_required', 'auto_proceed'].includes(artifact.next_action)) {
    return { ok: false, reason: `bad next_action: ${artifact.next_action}` };
  }

  return { ok: true };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function buildArtifact({ date, pairsUniverse, heatTag, briefs, memo, weekly }) {
  const watchSet = new Set();
  const dntSet = new Set();
  // universe normalization
  const { watchlist, do_not_touch } = normalizeUniverse({ memo, pairsUniverse });
  for (const s of watchlist) watchSet.add(s);
  for (const s of do_not_touch) dntSet.add(s);

  const confidence = memo?.confidence || 'LOW';
  const researchQuality = memo?.research_quality || 'MISSING';
  const regime = memo?.regime_today || weekly?.regime || 'UNKNOWN';

  // Build brief lookup.
  const briefBySym = {};
  for (const b of briefs || []) {
    if (b?.symbol) briefBySym[b.symbol] = b;
  }

  // Per-coin decisions.
  let violations_dropped = 0;
  let denied_below_floor = 0;
  const perCoin = [];
  const added = [];
  const removed = [];

  for (const sym of pairsUniverse) {
    const brief = briefBySym[sym];
    const row = decideCoin({
      symbol: sym,
      brief,
      defaultBand: heatTag?.default_band || 'WARM',
      confidence,
      researchQuality,
    });
    if (!row) {
      violations_dropped += 1;
      continue; // dropped at signal layer
    }

    // watchlist boost: WATCH_ONLY → QUALIFY (still respects band/score gates).
    if (watchSet.has(sym) && row.decision === 'WATCH_ONLY' && researchQuality === 'OK') {
      row.decision = 'QUALIFY';
      row.rationale += ' | watchlist_boost';
    }
    // do_not_touch hard block.
    if (dntSet.has(sym)) {
      row.decision = 'DENY';
      row.rationale += ' | do_not_touch';
    }

    if (row.notional_usd < HARD_MIN_NOTIONAL_USD) {
      // defensive — should never trigger because decideCoin guards this
      denied_below_floor += 1;
      continue;
    }

    perCoin.push(row);
  }

  // Rotations: pairs that flipped band or have risk_callout = blocking.
  // Conservative: only emit rotations when there's a CLEAR signal in the radar.
  const radarBands = heatTag?.bands || {};
  for (const sym of pairsUniverse) {
    const band = radarBands[sym];
    const brief = briefBySym[sym];
    if (brief?.risk_callout === 'manipulation' && band === 'HOT') {
      removed.push({ symbol: sym, reason: 'manipulation risk_callout while HOT' });
    }
  }

  // Determine next_action.
  let next_action = 'human_review_or_approval_required';
  if (confidence === 'LOW' || researchQuality === 'MISSING') {
    next_action = 'human_review_required';
  }

  const artifact = {
    schema_version: '1.0',
    generated_at: new Date().toISOString(),
    date,
    decision_layer: 'bossman_v1',
    l_crypto_rule: 'L-CRYPTO-14',

    regime_today: regime,
    confidence,
    research_quality: researchQuality,

    universe: {
      active: pairsUniverse.slice(),
      watchlist,
      do_not_touch,
      rotations: {
        added,
        removed,
      },
    },

    per_coin: perCoin,

    floor_audit: {
      min_notional_usd: HARD_MIN_NOTIONAL_USD,
      min_notional_source: 'L-CRYPTO-14 hard rule',
      violations_dropped,
      denied_below_floor,
    },

    mode: {
      PAPER_MODE: 'READ_FROM_ENV',
      LIVE_PILOT_MAX_NOTIONAL: 'READ_FROM_ENV',
      stage_6_mutation: 'NONE — advisory only',
    },

    next_action,
    preview_id: uuid(),
  };

  return artifact;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.schema) {
    console.log(JSON.stringify({
      type: 'object',
      required: ['schema_version', 'generated_at', 'date', 'decision_layer',
                 'l_crypto_rule', 'regime_today', 'confidence', 'research_quality',
                 'universe', 'per_coin', 'floor_audit', 'mode', 'next_action', 'preview_id'],
      properties: {
        schema_version: { const: '1.0' },
        decision_layer: { const: 'bossman_v1' },
        l_crypto_rule: { const: 'L-CRYPTO-14' },
        regime_today: { enum: [...VALID_REGIMES] },
        confidence: { enum: [...VALID_CONFIDENCE] },
        research_quality: { enum: [...VALID_RESEARCH_QUALITY] },
        per_coin: {
          items: {
            properties: {
              decision: { enum: [...VALID_DECISIONS] },
              strategy_class: { enum: [...VALID_STRATEGIES] },
              aggression_tier: { enum: [...VALID_TIERS] },
              notional_usd: { minimum: HARD_MIN_NOTIONAL_USD },
            },
          },
        },
        floor_audit: {
          properties: {
            min_notional_usd: { const: HARD_MIN_NOTIONAL_USD },
            min_notional_source: { const: 'L-CRYPTO-14 hard rule' },
          },
        },
      },
    }, null, 2));
    return;
  }

  const date = args.date || new Date().toISOString().slice(0, 10);

  const heatTag = readJson(HEAT_TAG_PATH);
  if (!heatTag) {
    console.error(`[bossman_decision] FATAL: missing ${HEAT_TAG_PATH}. Run daily_census.js first.`);
    process.exit(1);
  }
  const briefsRaw = readJson(PAIR_BRIEFS_PATH, null);
  // pair_briefs.json is an object with a top-level "briefs" array.
  const briefs = Array.isArray(briefsRaw) ? briefsRaw : (briefsRaw?.briefs || []);
  const memoPath = path.join(KNOWLEDGE_DIR, `DAILY_MEMO_${date}.json`);
  const memo = readJson(memoPath);
  if (!memo) {
    console.error(`[bossman_decision] FATAL: missing ${memoPath}. Run daily_memo.js first.`);
    process.exit(1);
  }
  const weekly = readJson(WEEKLY_INTEL, null);

  const pairsUniverse = readPairsFromServer();
  const artifact = buildArtifact({ date, pairsUniverse, heatTag, briefs, memo, weekly });

  // Hard validation BEFORE any write.
  const v = validateArtifact(artifact, pairsUniverse);
  if (!v.ok) {
    console.error(`[bossman_decision] HARD REJECT: ${v.reason}`);
    console.error(`[bossman_decision] artifact NOT written (L-CRYPTO-15 contract).`);
    process.exit(2);
  }

  // SHA-256 stability check on the candidate payload (deterministic JSON).
  const canonical = JSON.stringify(artifact, Object.keys(artifact).sort(), 2) + '\n';
  const payload = JSON.stringify(artifact, null, 2) + '\n';
  const hash = sha256(payload);

  if (args.dryRun) {
    console.log(`[bossman_decision] DRY-RUN — would write ${DECISION_PATH}`);
    console.log(`[bossman_decision] sha256=${hash}`);
    console.log(`[bossman_decision] universe.active.length=${artifact.universe.active.length}`);
    console.log(`[bossman_decision] per_coin.length=${artifact.per_coin.length}`);
    console.log(`[bossman_decision] floor_audit.denied_below_floor=${artifact.floor_audit.denied_below_floor}`);
    console.log(`[bossman_decision] floor_audit.violations_dropped=${artifact.floor_audit.violations_dropped}`);
    console.log(`[bossman_decision] regime=${artifact.regime_today} confidence=${artifact.confidence}`);
    console.log(`[bossman_decision] watchlist=[${artifact.universe.watchlist.join(',')}]`);
    console.log(`[bossman_decision] do_not_touch=[${artifact.universe.do_not_touch.join(',')}]`);
    console.log(`[bossman_decision] next_action=${artifact.next_action}`);
    console.log('---ARTIFACT---');
    console.log(payload);
    return;
  }

  // Write the artifact + dated archive.
  fs.writeFileSync(DECISION_PATH, payload);
  const datedPath = path.join(DATA_DIR, `bossman_decision.${date}.json`);
  fs.writeFileSync(datedPath, payload);

  console.log(`[bossman_decision] OK — wrote ${DECISION_PATH}`);
  console.log(`[bossman_decision] OK — wrote ${datedPath}`);
  console.log(`[bossman_decision] sha256=${hash}`);
  console.log(`[bossman_decision] universe.active.length=${artifact.universe.active.length}`);
  console.log(`[bossman_decision] per_coin.length=${artifact.per_coin.length}`);
  console.log(`[bossman_decision] floor_audit.denied_below_floor=${artifact.floor_audit.denied_below_floor}`);
  console.log(`[bossman_decision] floor_audit.violations_dropped=${artifact.floor_audit.violations_dropped}`);
  console.log(`[bossman_decision] regime=${artifact.regime_today} confidence=${artifact.confidence}`);
  console.log(`[bossman_decision] watchlist=[${artifact.universe.watchlist.join(',')}]`);
  console.log(`[bossman_decision] do_not_touch=[${artifact.universe.do_not_touch.join(',')}]`);
  console.log(`[bossman_decision] next_action=${artifact.next_action}`);
}

main().catch((e) => {
  console.error(`[bossman_decision] FATAL: ${e.message}`);
  if (e.stack) console.error(e.stack);
  process.exit(1);
});
