/**
 * CSDAWG Alert Delivery v1 — P9M (Tuned)
 * Sends Telegram notification after a weekly CSDAWG run.
 * Dedupe: one message per report_date per channel (ledger-based).
 * P9M noise suppression: info alerts with repeated signatures are
 *   displayed on dashboard but NOT sent to Telegram unless severity increased.
 * Failure: logs and exits cleanly without failing the weekly run.
 * Zero trading side effects.
 */

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOME = process.env.HOME || '/Users/bigdawg';
const INTEL_DIR    = path.join(HOME, '.hermes', 'knowledge', 'crypto-intel');
const HISTORY_DIR  = path.join(INTEL_DIR, 'history');
const ALERTS_DIR   = path.join(INTEL_DIR, 'alerts');
const LEDGER_FILE  = path.join(ALERTS_DIR, 'delivery-log.json');

// ── Telegram config (same credentials as pm2-health-monitor.sh) ──────────────
const TG_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8320439483:AAGBouPvuyowf4ab7shRVS2VgYN3DvTA-E0';
const TG_CHAT_ID   = process.env.TELEGRAM_CHAT_ID   || '8536867361';
const DASHBOARD_URL = 'http://localhost:8150';

const SEV_EMOJI  = { critical: '🔴', warning: '🟡', info: '🔵' };
const CONF_EMOJI = { high: '▲', medium: '◆', low: '◇' };

// ── Ledger helpers ───────────────────────────────────────────────────────────

function readLedger() {
  try {
    if (!fs.existsSync(LEDGER_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEDGER_FILE, 'utf8'));
  } catch { return []; }
}

function writeLedger(entries) {
  fs.mkdirSync(ALERTS_DIR, { recursive: true });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(entries, null, 2));
}

function alreadyDelivered(reportDate, channel = 'telegram') {
  const ledger = readLedger();
  return ledger.some(e => e.report_date === reportDate && e.channel === channel);
}

function markDelivered(reportDate, channel, alertCount, contentHash, suppressedCount, alertSignatures) {
  const ledger = readLedger().filter(e => !(e.report_date === reportDate && e.channel === channel));
  ledger.push({
    report_date:        reportDate,
    channel,
    sent_at:           new Date().toISOString(),
    alert_count:       alertCount,
    content_hash:       contentHash || null,
    suppressed_count:   suppressedCount || 0,
    alert_signatures:   alertSignatures || [],
  });
  writeLedger(ledger);
}

function getLastDelivery(channel = 'telegram') {
  const ledger = readLedger().filter(e => e.channel === channel);
  if (!ledger.length) return null;
  return ledger.sort((a, b) => b.sent_at.localeCompare(a.sent_at))[0];
}

function getPriorDeliverySignatures(reportDate, channel = 'telegram') {
  const ledger = readLedger()
    .filter(e => e.report_date === reportDate && e.channel === channel);
  if (!ledger.length) return [];
  return ledger[0].alert_signatures || [];
}

// ── History snapshot reader (for shared helper + suppression logic) ────────

function getHistorySnapshots(n = 4) {
  try {
    if (!fs.existsSync(HISTORY_DIR)) return [];
    const years = fs.readdirSync(HISTORY_DIR).filter(y => /^\d{4}$/.test(y)).sort().reverse();
    let snaps = [];
    for (const year of years) {
      const files = fs.readdirSync(path.join(HISTORY_DIR, year))
        .filter(f => /^\d{4}-\d{2}-\d{2}-intelligence\.json$/.test(f)).sort().reverse();
      for (const file of files) {
        try {
          const obj = JSON.parse(fs.readFileSync(path.join(HISTORY_DIR, year, file), 'utf8'));
          snaps.push({
            report_date:        obj.report_date || file.replace('-intelligence.json',''),
            regime:             obj.regime || '—',
            regime_certainty:   obj.regime_certainty || '—',
            regime_confidence:  obj.regime_confidence != null ? obj.regime_confidence : null,
            funding_regime:     obj.cycle_context?.funding_regime || null,
            funding_count:      obj.cycle_context?.funding_weekly_count || null,
            ai_vs_btc:          obj.sector_pulse?.ai?.sector_perf_7d_vs_btc_avg != null
                                 ? +obj.sector_pulse.ai.sector_perf_7d_vs_btc_avg : null,
            rwa_vs_btc:         obj.sector_pulse?.rwa?.sector_perf_7d_vs_btc_avg != null
                                 ? +obj.sector_pulse.rwa.sector_perf_7d_vs_btc_avg : null,
            analyst_view:       obj.analyst_view || null,
          });
        } catch(_) {}
        if (snaps.length >= n) break;
      }
      if (snaps.length >= n) break;
    }
    return snaps.slice(0, n);
  } catch { return []; }
}

// ── Import shared alert helper ───────────────────────────────────────────────
const { buildAlertSummary, sortAlerts, alertSignature } = require('./alerts-helper.js');

// ── Suppression logic (P9M noise reduction) ──────────────────────────────────
/**
 * Apply suppression rules:
 * - Warning/critical alerts → always delivered to Telegram
 * - Info alerts:
 *   - Delivered if: (a) signature not seen before, OR (b) severity/escalation increased
 *   - Suppressed if: same signature fired in prior report_date and no severity increase
 * Returns { toDeliver, suppressed } — both arrays of alert objects
 */
function applySuppression(allAlerts, priorSignatures = []) {
  if (!priorSignatures || priorSignatures.length === 0) {
    return { toDeliver: allAlerts, suppressed: [] };
  }

  const priorSet = new Set(priorSignatures);
  const toDeliver = [];
  const suppressed = [];

  for (const alert of allAlerts) {
    const sig = alertSignature(alert);
    if (alert.severity === 'info' && priorSet.has(sig)) {
      // Check if any higher-severity version of same alert exists in this run
      const higherSevere = allAlerts.find(a =>
        a.type === alert.type && a !== alert && a.severity !== 'info'
      );
      if (!higherSevere) {
        suppressed.push({ ...alert, suppressed: true, reason: 'info alert with identical signature in prior week — no severity increase' });
        continue;
      }
    }
    toDeliver.push(alert);
  }

  return { toDeliver, suppressed };
}

// ── Telegram sender ─────────────────────────────────────────────────────────

function sendTelegram(text) {
  return new Promise((resolve) => {
    const url  = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
    const body = JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'Markdown' });
    const { execSync } = require('child_process');
    try {
      const out = execSync(
        `curl -s -X POST "${url}" -H "Content-Type: application/json" -d '${body.replace(/'/g, "'\"'\"'")}'`,
        { timeout: 15000 }
      );
      resolve({ ok: true, out: out.toString() });
    } catch(e) {
      resolve({ ok: false, err: e.message });
    }
  });
}

// ── Telegram message builder (P9M format with confidence) ──────────────────

function buildMessage(intel, alerts, suppressedCount) {
  const sev  = SEV_EMOJI;
  const conf = CONF_EMOJI;
  const sorted = sortAlerts(alerts);
  const top = sorted.slice(0, 3);

  const lines = [
    `*CSDAWG Weekly Alerts — ${intel.report_date}*`,
    `Regime: ${intel.regime || '—'} (${intel.regime_certainty || '—'}${intel.regime_confidence != null ? ` ${(intel.regime_confidence*100).toFixed(0)}%` : ''})`,
    `Funding: ${intel.funding_regime || '—'}`,
    `AI vs BTC: ${intel.ai_vs_btc != null ? (intel.ai_vs_btc >= 0 ? '+' : '') + intel.ai_vs_btc.toFixed(1) + '%' : '—'}`,
    `RWA vs BTC: ${intel.rwa_vs_btc != null ? (intel.rwa_vs_btc >= 0 ? '+' : '') + intel.rwa_vs_btc.toFixed(1) + '%' : '—'}`,
    `Alerts: ${alerts.length}${suppressedCount > 0 ? ` (${suppressedCount} quieter alerts → dashboard)` : ''}`,
  ];

  if (top.length) {
    lines.push('');
    for (const a of top) {
      lines.push(`${sev[a.severity] || '•'} *${a.title}* [${a.confidence || 'medium'}]`);
      lines.push(`   ${a.detail}`);
    }
  } else {
    lines.push('_No significant changes this week._');
  }

  lines.push('');
  lines.push(`Dashboard: ${DASHBOARD_URL}`);
  return lines.join('\n');
}

// ── Main delivery function (called by crypto-intel-weekly.js) ────────────────

async function deliverAlerts(intelPath) {
  let intel;
  try {
    intel = JSON.parse(fs.readFileSync(intelPath, 'utf8'));
  } catch(e) {
    console.error('[alert-delivery] ERROR: Could not read intel file:', e.message);
    return { delivered: false, reason: 'intel file unreadable' };
  }

  const reportDate = intel.report_date;
  if (!reportDate) {
    console.error('[alert-delivery] ERROR: No report_date in intel file');
    return { delivered: false, reason: 'no report_date' };
  }

  // Dedupe check (per report_date)
  if (alreadyDelivered(reportDate, 'telegram')) {
    console.log(`[alert-delivery] Already delivered for ${reportDate} — skipping.`);
    return { delivered: false, reason: 'already delivered', report_date: reportDate };
  }

  // Compute tuned alerts using shared helper
  const history     = getHistorySnapshots(4);
  const allAlerts   = buildAlertSummary(intel, history);
  const priorSigs   = getPriorDeliverySignatures(reportDate, 'telegram');
  const { toDeliver, suppressed } = applySuppression(allAlerts, priorSigs);
  const suppressedCount = suppressed.length;

  // Build and send
  const sigs        = allAlerts.map(alertSignature);
  const contentHash = crypto.createHash('md5').update(JSON.stringify({ sigs })).digest('hex').slice(0, 8);
  const msg        = buildMessage(intel, toDeliver, suppressedCount);
  const result      = await sendTelegram(msg);

  if (!result.ok) {
    console.error('[alert-delivery] Telegram error:', result.err);
    return { delivered: false, reason: 'telegram failed', error: result.err, report_date: reportDate };
  }

  // Mark delivered (include all sigs so future suppression can reference them)
  markDelivered(reportDate, 'telegram', allAlerts.length, contentHash, suppressedCount, sigs);
  console.log(`[alert-delivery] ✅ Delivered for ${reportDate} — ${toDeliver.length} alerts (${suppressedCount} quieter alerts suppressed for Telegram)`);
  return { delivered: true, report_date: reportDate, alert_count: allAlerts.length, delivered_count: toDeliver.length, suppressed_count: suppressedCount };
}

// ── CLI mode ─────────────────────────────────────────────────────────────────

if (require.main === module) {
  const intelPath = process.argv[2] || path.join(INTEL_DIR, 'weekly', 'latest', 'intelligence.json');
  deliverAlerts(intelPath).then(r => {
    console.log(JSON.stringify(r));
    process.exit(r.delivered ? 0 : 1);
  });
}

module.exports = { deliverAlerts, getLastDelivery, getHistorySnapshots, buildAlertSummary, sortAlerts, alertSignature };