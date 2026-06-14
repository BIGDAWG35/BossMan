const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8150;

// CORS for Mission Control (P9N tile)
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

const INTEL_DIR   = path.join(process.env.HOME || '/Users/bigdawg', '.hermes', 'knowledge', 'crypto-intel');
const LATEST_INTEL = path.join(INTEL_DIR, 'weekly', 'latest', 'intelligence.json');
const WEEKLY_DIR  = path.join(INTEL_DIR, 'weekly', '2026');
const HISTORY_DIR  = path.join(INTEL_DIR, 'history');

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Read last N history snapshots, newest first */
function getHistorySnapshots(n = 4) {
  try {
    if (!fs.existsSync(HISTORY_DIR)) return [];
    const years = fs.readdirSync(HISTORY_DIR).filter(y => /^\d{4}$/.test(y)).sort().reverse();
    let snapshots = [];
    for (const year of years) {
      const yearDir = path.join(HISTORY_DIR, year);
      const files = fs.readdirSync(yearDir)
        .filter(f => /^\d{4}-\d{2}-\d{2}-intelligence\.json$/.test(f))
        .sort().reverse();
      for (const file of files) {
        try {
          const raw = fs.readFileSync(path.join(yearDir, file), 'utf8');
          const obj = JSON.parse(raw);
          snapshots.push({
            report_date:  obj.report_date || file.replace('-intelligence.json',''),
            version:     obj.version || '?',
            regime:      obj.regime || '—',
            regime_certainty:   obj.regime_certainty || '—',
            regime_confidence:  obj.regime_confidence != null ? obj.regime_confidence : null,
            funding_regime: obj.cycle_context?.funding_regime || null,
            funding_count: obj.cycle_context?.funding_weekly_count || null,
            ai_vs_btc:    obj.sector_pulse?.ai?.sector_perf_7d_vs_btc_avg != null
                           ? +obj.sector_pulse.ai.sector_perf_7d_vs_btc_avg : null,
            rwa_vs_btc:   obj.sector_pulse?.rwa?.sector_perf_7d_vs_btc_avg != null
                           ? +obj.sector_pulse.rwa.sector_perf_7d_vs_btc_avg : null,
          });
        } catch(_) {}
        if (snapshots.length >= n) break;
      }
      if (snapshots.length >= n) break;
    }
    return snapshots.slice(0, n);
  } catch(e) { return []; }
}

/** Generate alerts by comparing current vs prior snapshot */
function generateAlerts(current, history) {
  // Use shared tuned helper (P9M severity ladder, confidence, rationale)
  const { buildAlertSummary } = require('./alerts-helper.js');
  return buildAlertSummary(current, history);
}

// ── API endpoint ──────────────────────────────────────────────────────────────
app.get('/api/intel', (req, res) => {
  try {
    if (!fs.existsSync(LATEST_INTEL)) {
      return res.json({ status: 'missing', error: 'intelligence.json not found' });
    }
    const raw = fs.readFileSync(LATEST_INTEL, 'utf8');
    const intel = JSON.parse(raw);

    // Latest markdown
    let markdownContent = null;
    if (intel.report_date) {
      const mdPath = path.join(WEEKLY_DIR, `CRYPTO_INTEL_${intel.report_date}.md`);
      if (fs.existsSync(mdPath)) markdownContent = fs.readFileSync(mdPath, 'utf8');
    }

    // History snapshots
    const history = getHistorySnapshots(4);

    // Alerts
    const alerts = generateAlerts({
      report_date:       intel.report_date,
      regime:            intel.regime || null,
      regime_certainty:  intel.regime_certainty || null,
      regime_confidence:  intel.regime_confidence != null ? intel.regime_confidence : null,
      funding_regime:     intel.cycle_context?.funding_regime || null,
      funding_count:      intel.cycle_context?.funding_weekly_count || null,
      ai_vs_btc:         intel.sector_pulse?.ai?.sector_perf_7d_vs_btc_avg != null
                           ? +intel.sector_pulse.ai.sector_perf_7d_vs_btc_avg : null,
      rwa_vs_btc:        intel.sector_pulse?.rwa?.sector_perf_7d_vs_btc_avg != null
                           ? +intel.sector_pulse.rwa.sector_perf_7d_vs_btc_avg : null,
      analyst_view:      intel.analyst_view || null,
    }, history);

    const stat = fs.statSync(LATEST_INTEL);

    // Delivery status (from ledger)
    let delivery_status = null;
    try {
      const ledgerPath = path.join(INTEL_DIR, 'alerts', 'delivery-log.json');
      if (fs.existsSync(ledgerPath)) {
        const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8')).filter(e => e.channel === 'telegram');
        if (ledger.length) {
          const last = ledger.sort((a, b) => b.sent_at.localeCompare(a.sent_at))[0];
          delivery_status = { at: last.sent_at, count: last.alert_count, suppressed: last.suppressed_count || 0, channel: 'telegram' };
        }
      }
    } catch(_) {}

    res.json({
      status:          'ok',
      generated_at:    stat.mtime.toISOString(),
      report_date:     intel.report_date,
      version:         intel.version,
      regime:          intel.regime || null,
      regime_confidence: intel.regime_confidence || null,
      regime_certainty: intel.regime_certainty || null,
      cycle_context:   intel.cycle_context || null,
      regime_summary:   intel.regime_summary || null,
      sector_pulse:    intel.sector_pulse || null,
      analyst_view:    intel.analyst_view || null,
      predictions:      intel.predictions || null,
      learning_notes:   intel.learning_notes || null,
      markdown:         markdownContent,
      alerts,
      history,
      delivery_status,
      execution_advisory: intel.execution_advisory || null,
      predictions: intel.predictions || null,
    });
  } catch (e) {
    res.json({ status: 'error', error: e.message });
  }
});

// ── Serve dashboard ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSDAWG Operator Dashboard</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0d1117; color: #c9d1d9; padding: 20px; font-size: 14px;
    line-height: 1.5;
  }
  .container { max-width: 1200px; margin: 0 auto; }

/* ── Header ── */
  .header {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
    padding: 12px 16px; background: #161b22; border: 1px solid #30363d;
    border-radius: 8px;
  }
  .header-title { font-size: 18px; font-weight: 700; color: #f0f6fc; }
  .header-meta { font-size: 11px; color: #8b949e; }
  .header-right { display: flex; align-items: center; gap: 12px; }
  .status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 6px; font-size: 11px;
    background: #0d1117; border: 1px solid #30363d;
  }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; }
  .dot.green { background: #3fb950; }
  .dot.yellow { background: #d29922; }
  .dot.red { background: #f85149; }
  .btn-refresh {
    padding: 6px 14px; border: 1px solid #30363d; border-radius: 6px;
    background: #21262d; color: #c9d1d9; cursor: pointer; font-size: 12px;
  }
  .btn-refresh:hover { background: #30363d; }
  .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Panel Base ── */
  .panel {
    background: #161b22; border: 1px solid #30363d; border-radius: 8px;
    padding: 16px; margin-bottom: 16px;
  }
  .panel-title {
    font-size: 11px; font-weight: 600; color: #8b949e;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;
  }
  .panel-empty {
    color: #484f58; font-style: italic; font-size: 13px;
  }
  .panel-error {
    background: #2d1b1b; border: 1px solid #da3633;
    padding: 12px; border-radius: 6px; color: #f85149; font-size: 13px;
  }

/* ── REGIME Row ── */
  .regime-row {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    padding: 20px; background: #161b22; border: 1px solid #30363d;
    border-radius: 8px; margin-bottom: 16px;
  }
  .regime-name {
    font-size: 28px; font-weight: 800; color: #f0f6fc;
    letter-spacing: 1px;
  }
  .regime-name.bullish { color: #3fb950; }
  .regime-name.bearish { color: #f85149; }
  .regime-name.neutral { color: #d29922; }
  .certainty-badge {
    padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
  }
  .certainty-high { background: #1c3a1f; color: #7ee787; }
  .certainty-medium { background: #2d2a1b; color: #e3b341; }
  .certainty-low { background: #2d1b1b; color: #f85149; }
  .certainty-uncertainty { background: #2d2a1b; color: #d29922; }
  .posture-badge {
    margin-left: auto; padding: 8px 16px; border-radius: 6px;
    font-size: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px;
  }
  .posture-cautious { background: #1c2d3d; color: #79c0ff; border: 1px solid #388bfd; }
  .posture-constructive { background: #1c3a1f; color: #7ee787; border: 1px solid #2ea043; }
  .posture-neutral { background: #2d2a1b; color: #e3b341; border: 1px solid #d29922; }

/* ── MARKET CONTEXT Row ── */
  .market-row {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
    background: #30363d; border-radius: 8px; overflow: hidden;
    margin-bottom: 16px;
  }
  .market-cell {
    background: #161b22; padding: 16px; text-align: center;
  }
  .market-label { font-size: 10px; color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .market-value { font-size: 20px; font-weight: 700; }
  .market-value.up { color: #3fb950; }
  .market-value.down { color: #f85149; }
  .market-value.neutral { color: #d29922; }
  .market-sub { font-size: 11px; color: #8b949e; margin-top: 2px; }

/* ── SECTOR SIGNALS ── */
  .sector-row {
    display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 12px;
  }
  .sector-badge {
    flex: 1; min-width: 160px; padding: 16px; border-radius: 8px;
    background: #0d1117; text-align: center;
  }
  .sector-name { font-size: 11px; color: #8b949e; margin-bottom: 6px; }
  .sector-value { font-size: 32px; font-weight: 800; }
  .sector-value.up { color: #3fb950; }
  .sector-value.down { color: #f85149; }
  .sector-value.missing { color: #484f58; }
  .sector-indicator { font-size: 14px; margin-top: 4px; }
  .token-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .token-chip {
    padding: 4px 10px; border-radius: 4px; font-size: 11px;
    background: #0d1117; display: flex; gap: 6px; align-items: center;
  }
  .token-chip .sym { font-weight: 700; color: #c9d1d9; }
  .token-chip .chg { font-size: 10px; }
  .chg-positive { color: #3fb950; }
  .chg-negative { color: #f85149; }
  .chg-null { color: #484f58; }
  .sector-warning {
    padding: 8px 12px; background: #2d1b1b; border: 1px solid #da3633;
    border-radius: 6px; color: #f85149; font-size: 12px; margin-top: 8px;
  }

/* ── PREDICTIONS Table ── */
  .pred-table { width: 100%; border-collapse: collapse; }
  .pred-table th {
    text-align: left; padding: 8px 12px; font-size: 10px; font-weight: 600;
    color: #8b949e; text-transform: uppercase; border-bottom: 1px solid #30363d;
  }
  .pred-table td {
    padding: 10px 12px; border-bottom: 1px solid #21262d; font-size: 13px;
  }
  .pred-table tr:last-child td { border-bottom: none; }
  .pred-type { font-weight: 600; color: #c9d1d9; }
  .pred-value { font-weight: 700; }
  .pred-value.up { color: #3fb950; }
  .pred-value.down { color: #f85149; }
  .pred-value.neutral { color: #d29922; }
  .conf-badge {
    display: inline-block; padding: 2px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 700;
  }
  .conf-high { background: #1c3a1f; color: #7ee787; }
  .conf-medium { background: #2d2a1b; color: #e3b341; }
  .conf-low { background: #2d1b1b; color: #f85149; }

/* ── ANALYST VIEW ── */
  .analyst-summary {
    font-size: 14px; line-height: 1.6; color: #c9d1d9;
    padding: 12px 16px; background: #0d1117; border-radius: 6px;
    margin-bottom: 12px; border-left: 3px solid #388bfd;
  }
  .analyst-bullets { margin-bottom: 12px; }
  .analyst-bullet {
    padding: 6px 0; font-size: 13px; color: #c9d1d9;
    display: flex; gap: 8px;
  }
  .analyst-bullet::before { content: '•'; color: #58a6ff; flex-shrink: 0; }
  .analyst-points { margin-top: 12px; }
  .analyst-point {
    padding: 8px 12px; margin-bottom: 6px; background: #0d1117;
    border-radius: 6px; font-size: 12px; display: flex; gap: 8px; align-items: flex-start;
  }
  .analyst-tag {
    padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600;
    flex-shrink: 0;
  }
  .tag-risk { background: #3d1b1b; color: #ff7b72; }
  .tag-sector { background: #1b2d3d; color: #79c0ff; }
  .tag-macro { background: #1c3a1f; color: #7ee787; }
  .tag-regime { background: #1c3a1f; color: #7ee787; }
  .tag-prediction { background: #2d1b3d; color: #d2a8ff; }
  .tag-meta { background: #2d2d1b; color: #e3b341; }
  .point-text { flex: 1; color: #c9d1d9; }
  .point-model {
    font-size: 10px; color: #8b949e; padding: 2px 6px;
    background: #21262d; border-radius: 3px;
  }

/* ── EXECUTION ADVISORY ── */
  .advisory-banner {
    background: #2d2a1b; border: 1px solid #d29922; border-radius: 8px;
    padding: 16px; margin-bottom: 12px;
  }
  .advisory-warning {
    display: flex; align-items: center; gap: 8px; font-size: 13px;
    font-weight: 600; color: #e3b341; margin-bottom: 12px;
  }
  .advisory-warning::before { content: '⚠️'; font-size: 16px; }
  .advisory-posture {
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  }
  .advisory-posture-label { font-size: 12px; color: #8b949e; }
  .advisory-posture-value { font-size: 16px; font-weight: 700; }
  .advisory-posture-value.cautious { color: #79c0ff; }
  .advisory-posture-value.constructive { color: #7ee787; }
  .advisory-posture-value.neutral { color: #e3b341; }
  .advisory-conf { font-size: 12px; color: #8b949e; margin-bottom: 12px; }
  .advisory-conf span { font-weight: 600; }
  .advisory-conf .high { color: #7ee787; }
  .advisory-conf .medium { color: #e3b341; }
  .advisory-conf .low { color: #f85149; }
  .advisory-reasons { margin-top: 8px; }
  .advisory-reason {
    padding: 4px 0; font-size: 12px; color: #c9d1d9; display: flex; gap: 8px;
  }
  .advisory-reason::before { content: '•'; color: #8b949e; }
  .advisory-empty {
    padding: 16px; text-align: center; color: #484f58; font-style: italic;
  }

/* ── ALERTS ── */
  .alert-list { display: flex; flex-direction: column; gap: 8px; }
  .alert-card {
    padding: 10px 14px; border-radius: 6px; border-left: 3px solid;
    background: #0d1117; display: flex; gap: 10px; align-items: flex-start;
  }
  .alert-card.sev-critical { border-color: #f85149; background: #2d1b1b; }
  .alert-card.sev-warning { border-color: #d29922; background: #2d2a1b; }
  .alert-card.sev-info { border-color: #58a6ff; background: #1b2d3d; }
  .alert-emoji { font-size: 16px; flex-shrink: 0; }
  .alert-body { flex: 1; }
  .alert-title { font-weight: 600; font-size: 13px; margin-bottom: 2px; }
  .sev-critical .alert-title { color: #f85149; }
  .sev-warning .alert-title { color: #d29922; }
  .sev-info .alert-title { color: #79c0ff; }
  .alert-detail { font-size: 12px; color: #c9d1d9; }
  .alert-conf { flex-shrink: 0; }
  .alert-why { font-size: 10px; color: #8b949e; margin-top: 4px; font-style: italic; }
  .alerts-empty { color: #484f58; font-style: italic; text-align: center; padding: 16px; }
</style>
</head>
<body>
<div class="container" id="app">

  <!-- ── HEADER ── -->
  <div class="header">
    <div>
      <div class="header-title">CSDAWG Operator Dashboard</div>
      <div class="header-meta">Report: <span id="report-date">—</span> &bull; v<span id="version">—</span></div>
    </div>
    <div class="header-right">
      <div class="status-badge">
        <span class="status-dot green" id="status-dot"></span>
        <span id="status-text">OK</span>
        <span id="last-updated" style="color:#8b949e;font-size:11px;"></span>
      </div>
      <button class="btn-refresh" id="refreshBtn" onclick="refreshData()">↻ Refresh</button>
    </div>
  </div>

  <!-- ── REGIME ROW ── -->
  <div class="regime-row" id="regime-row">
    <div class="regime-name" id="regime-name">—</div>
    <div class="certainty-badge" id="certainty-badge">—</div>
    <div class="posture-badge" id="posture-badge">—</div>
  </div>

  <!-- ── MARKET CONTEXT ── -->
  <div class="panel">
    <div class="panel-title">Market Context</div>
    <div class="market-row" id="market-row">
      <div class="market-cell">
        <div class="market-label">BTC vs ATH</div>
        <div class="market-value" id="btc-drawdown">—</div>
        <div class="market-sub" id="btc-drawdown-label"></div>
      </div>
      <div class="market-cell">
        <div class="market-label">Fear / Greed</div>
        <div class="market-value" id="fear-greed-value">—</div>
        <div class="market-sub" id="fear-greed-label"></div>
      </div>
      <div class="market-cell">
        <div class="market-label">Cross State</div>
        <div class="market-value" id="cross-state">—</div>
        <div class="market-sub" id="cross-age"></div>
      </div>
      <div class="market-cell">
        <div class="market-label">Funding Regime</div>
        <div class="market-value" id="funding-regime">—</div>
        <div class="market-sub" id="funding-count"></div>
      </div>
    </div>
  </div>

  <!-- ── SECTOR SIGNALS ── -->
  <div class="panel">
    <div class="panel-title">Sector Signals</div>
    <div class="sector-row" id="sector-row">
      <div class="sector-badge">
        <div class="sector-name">AI vs BTC</div>
        <div class="sector-value" id="ai-vs-btc">—</div>
        <div class="sector-indicator" id="ai-indicator"></div>
      </div>
      <div class="sector-badge">
        <div class="sector-name">RWA vs BTC</div>
        <div class="sector-value" id="rwa-vs-btc">—</div>
        <div class="sector-indicator" id="rwa-indicator"></div>
      </div>
    </div>
    <div class="sector-warning" id="sector-warning" style="display:none;"></div>
    <div id="ai-tokens" class="token-list"></div>
    <div id="rwa-tokens" class="token-list"></div>
  </div>

  <!-- ── PREDICTIONS ── -->
  <div class="panel">
    <div class="panel-title">Predictions (7-day horizon)</div>
    <div id="predictions-content">
      <div class="panel-empty">Loading...</div>
    </div>
  </div>

  <!-- ── ANALYST VIEW ── -->
  <div class="panel">
    <div class="panel-title">Analyst View</div>
    <div id="analyst-content">
      <div class="panel-empty">Loading...</div>
    </div>
  </div>

  <!-- ── EXECUTION ADVISORY ── -->
  <div class="panel">
    <div class="panel-title">Execution Advisory (Shadow Mode)</div>
    <div id="advisory-content">
      <div class="panel-empty">Loading...</div>
    </div>
  </div>

  <!-- ── ALERTS ── -->
  <div class="panel">
    <div class="panel-title">Alerts</div>
    <div id="alerts-content">
      <div class="panel-empty">Loading...</div>
    </div>
  </div>

</div>

<script>
async function refreshData() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true; btn.textContent = '↻ Refreshing...';

  try {
    const res = await fetch('/api/intel');
    const data = await res.json();

    // Header
    document.getElementById('version').textContent = data.version || '—';
    document.getElementById('report-date').textContent = data.report_date || '—';
    if (data.generated_at) {
      const d = new Date(data.generated_at);
      document.getElementById('last-updated').textContent =
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // Status
    if (data.status === 'missing' || data.status === 'error') {
      document.getElementById('status-dot').className = 'status-dot red';
      document.getElementById('status-text').textContent = data.status === 'missing' ? 'No intel' : 'Error';
      btn.disabled = false; btn.textContent = '↻ Refresh';
      return;
    }
    document.getElementById('status-dot').className = 'status-dot green';
    document.getElementById('status-text').textContent = 'OK';

    // Render all sections
    renderRegime(data);
    renderMarketContext(data);
    renderSectorSignals(data);
    renderPredictionsTable(data);
    renderAnalystView(data);
    renderExecutionAdvisory(data);
    renderAlertsSection(data);

  } catch(e) {
    document.getElementById('status-dot').className = 'status-dot red';
    document.getElementById('status-text').textContent = 'Connection error';
  }
  btn.disabled = false; btn.textContent = '↻ Refresh';
}

// ── REGIME ──
function renderRegime(data) {
  const regime = data.regime || '—';
  const certainty = data.regime_certainty || '—';
  const confidence = data.regime_confidence != null ? data.regime_confidence : null;
  const ea = data.execution_advisory;
  const posture = ea ? ea.risk_posture : null;

  // Regime name with color
  const rEl = document.getElementById('regime-name');
  rEl.textContent = regime;
  rEl.className = 'regime-name';
  if (regime.includes('BULL') || regime.includes('THAW')) rEl.classList.add('bullish');
  else if (regime.includes('BEAR') || regime.includes('ACCUM')) rEl.classList.add('bearish');
  else rEl.classList.add('neutral');

  // Certainty badge
  const cEl = document.getElementById('certainty-badge');
  cEl.className = 'certainty-badge';
  if (certainty === 'CONFIRMED') { cEl.classList.add('certainty-high'); cEl.textContent = 'CONFIRMED'; }
  else if (certainty === 'UNCERTAINTY') { cEl.classList.add('certainty-uncertainty'); cEl.textContent = 'UNCERTAINTY'; }
  else if (confidence != null) {
    if (confidence >= 0.7) { cEl.classList.add('certainty-high'); cEl.textContent = 'HIGH ' + (confidence * 100).toFixed(0) + '%'; }
    else if (confidence >= 0.4) { cEl.classList.add('certainty-medium'); cEl.textContent = 'MEDIUM ' + (confidence * 100).toFixed(0) + '%'; }
    else { cEl.classList.add('certainty-low'); cEl.textContent = 'LOW ' + (confidence * 100).toFixed(0) + '%'; }
  } else { cEl.textContent = certainty; cEl.classList.add('certainty-medium'); }

  // Posture badge
  const pEl = document.getElementById('posture-badge');
  pEl.className = 'posture-badge';
  if (posture === 'cautious') { pEl.classList.add('posture-cautious'); pEl.textContent = '🛡️ CAUTIOUS'; }
  else if (posture === 'constructive') { pEl.classList.add('posture-constructive'); pEl.textContent = '🚀 CONSTRUCTIVE'; }
  else { pEl.classList.add('posture-neutral'); pEl.textContent = '⚖️ ' + (posture || '—').toUpperCase(); }
}

// ── MARKET CONTEXT ──
function renderMarketContext(data) {
  const cc = data.cycle_context || {};

  // BTC vs ATH
  const drawdown = cc.ath_drawdown_pct;
  const dEl = document.getElementById('btc-drawdown');
  const dlEl = document.getElementById('btc-drawdown-label');
  if (drawdown != null) {
    dEl.textContent = drawdown.toFixed(1) + '%';
    dEl.className = 'market-value ' + (drawdown < -40 ? 'down' : drawdown < -20 ? 'neutral' : 'up');
    dlEl.textContent = drawdown < -40 ? 'deep drawdown' : drawdown < -20 ? 'moderate' : 'shallow';
  } else { dEl.textContent = '—'; dEl.className = 'market-value'; }

  // Fear/Greed
  const fg = cc.fear_greed_score;
  const fgLabel = cc.fear_greed_label || '—';
  const fgEl = document.getElementById('fear-greed-value');
  const fglEl = document.getElementById('fear-greed-label');
  if (fg != null) {
    fgEl.textContent = fg;
    fgEl.className = 'market-value ' + (fg <= 30 ? 'down' : fg <= 50 ? 'neutral' : 'up');
    fglEl.textContent = fgLabel;
  } else { fgEl.textContent = '—'; fgEl.className = 'market-value'; fglEl.textContent = ''; }

  // Cross State
  const cross = cc.cross_state || '—';
  const crossAge = cc.cross_age_weeks;
  const csEl = document.getElementById('cross-state');
  const caEl = document.getElementById('cross-age');
  csEl.textContent = cross;
  csEl.className = 'market-value ' + (cross === 'DEATH' ? 'down' : cross === 'GOLDEN' ? 'up' : 'neutral');
  caEl.textContent = crossAge ? crossAge + ' weeks' : '';

  // Funding Regime
  const fr = cc.funding_regime || '—';
  const fc = cc.funding_weekly_count;
  const frEl = document.getElementById('funding-regime');
  const fcEl = document.getElementById('funding-count');
  frEl.textContent = fr;
  frEl.className = 'market-value ' + (fr === 'NEGATIVE' ? 'down' : fr === 'HEATED' ? 'up' : 'neutral');
  fcEl.textContent = fc ? fc + ' weekly' : '';
}

// ── SECTOR SIGNALS ──
function renderSectorSignals(data) {
  const sp = data.sector_pulse || {};

  // AI vs BTC
  const aiVal = sp.ai ? sp.ai.sector_perf_7d_vs_btc_avg : null;
  const aiEl = document.getElementById('ai-vs-btc');
  const aiIndEl = document.getElementById('ai-indicator');
  if (aiVal != null) {
    aiEl.textContent = (aiVal >= 0 ? '+' : '') + aiVal.toFixed(1) + '%';
    aiEl.className = 'sector-value ' + (aiVal >= 0 ? 'up' : 'down');
    aiIndEl.textContent = aiVal >= 0 ? '✅' : '⚠️';
  } else { aiEl.textContent = '—'; aiEl.className = 'sector-value missing'; aiIndEl.textContent = ''; }

  // RWA vs BTC
  const rwaVal = sp.rwa ? sp.rwa.sector_perf_7d_vs_btc_avg : null;
  const rwaEl = document.getElementById('rwa-vs-btc');
  const rwaIndEl = document.getElementById('rwa-indicator');
  if (rwaVal != null) {
    rwaEl.textContent = (rwaVal >= 0 ? '+' : '') + rwaVal.toFixed(1) + '%';
    rwaEl.className = 'sector-value ' + (rwaVal >= 0 ? 'up' : 'down');
    rwaIndEl.textContent = rwaVal >= 0 ? '✅' : '⚠️';
  } else { rwaEl.textContent = '—'; rwaEl.className = 'sector-value missing'; rwaIndEl.textContent = ''; }

  // Warning
  const warnEl = document.getElementById('sector-warning');
  const warnAI = sp.ai && (!sp.ai.trend_4w || sp.ai.trend_4w.direction === 'insufficient_data');
  const warnRWA = sp.rwa && (!sp.rwa.trend_4w || sp.rwa.trend_4w.direction === 'insufficient_data');
  if (warnAI || warnRWA) {
    let w = '⚠️ ';
    if (warnAI) w += 'AI trend: insufficient data (need 4 weeks).';
    if (warnRWA) w += ' RWA trend: insufficient data (need 4 weeks).';
    warnEl.textContent = w;
    warnEl.style.display = 'block';
  } else { warnEl.style.display = 'none'; }

  // AI Tokens
  const aiTokensEl = document.getElementById('ai-tokens');
  const aiTokens = sp.ai && sp.ai.top_tokens ? sp.ai.top_tokens : [];
  if (aiTokens.length) {
    aiTokensEl.innerHTML = aiTokens.map(t => {
      const v = t.perf_7d_vs_btc_pct != null ? t.perf_7d_vs_btc_pct : t.perf_7d_vs_btc;
      const cls = v == null ? 'chg-null' : v >= 0 ? 'chg-positive' : 'chg-negative';
      const txt = v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
      return '<div class="token-chip"><span class="sym">' + t.symbol + '</span><span class="chg ' + cls + '">' + txt + '</span></div>';
    }).join('');
  } else { aiTokensEl.innerHTML = ''; }

  // RWA Tokens
  const rwaTokensEl = document.getElementById('rwa-tokens');
  const rwaTokens = sp.rwa && sp.rwa.top_tokens ? sp.rwa.top_tokens : [];
  if (rwaTokens.length) {
    rwaTokensEl.innerHTML = rwaTokens.map(t => {
      const v = t.perf_7d_vs_btc_pct != null ? t.perf_7d_vs_btc_pct : t.perf_7d_vs_btc;
      const cls = v == null ? 'chg-null' : v >= 0 ? 'chg-positive' : 'chg-negative';
      const txt = v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
      return '<div class="token-chip"><span class="sym">' + t.symbol + '</span><span class="chg ' + cls + '">' + txt + '</span></div>';
    }).join('');
  } else { rwaTokensEl.innerHTML = ''; }
}

// ── PREDICTIONS TABLE ──
function renderPredictionsTable(data) {
  const el = document.getElementById('predictions-content');
  const preds = data.predictions;
  if (!preds || !preds.entries || !preds.entries.length) {
    el.innerHTML = '<div class="panel-empty">No predictions this week.</div>';
    return;
  }

  let html = '<table class="pred-table"><thead><tr><th>Type</th><th>Value</th><th>Confidence</th></tr></thead><tbody>';
  for (const p of preds.entries) {
    const valCls = p.value === 'outperform' || p.value === 'constructive' ? 'up' :
                   p.value === 'underperform' || p.value === 'cautious' ? 'down' : 'neutral';
    const confCls = p.confidence === 'high' ? 'conf-high' :
                    p.confidence === 'medium' ? 'conf-medium' : 'conf-low';
    const confIcon = p.confidence === 'high' ? '▲' : p.confidence === 'medium' ? '◆' : '◇';
    html += '<tr>' +
      '<td class="pred-type">' + p.type + '</td>' +
      '<td class="pred-value ' + valCls + '">' + p.value + '</td>' +
      '<td><span class="conf-badge ' + confCls + '">' + confIcon + ' ' + (p.confidence || '—').toUpperCase() + '</span></td>' +
      '</tr>';
  }
  html += '</tbody></table>';
  el.innerHTML = html;
}

// ── ANALYST VIEW ──
function renderAnalystView(data) {
  const el = document.getElementById('analyst-content');
  const av = data.analyst_view;
  if (!av || (!av.summary && !av.summary_bullets && !av.points)) {
    el.innerHTML = '<div class="panel-empty">Analyst View not generated this week.</div>';
    return;
  }

  let html = '';

  // Summary paragraph
  if (av.summary) {
    html += '<div class="analyst-summary">' + av.summary + '</div>';
  }

  // Summary bullets
  if (av.summary_bullets && av.summary_bullets.length) {
    html += '<div class="analyst-bullets">';
    for (const b of av.summary_bullets) {
      html += '<div class="analyst-bullet">' + b + '</div>';
    }
    html += '</div>';
  }

  // Model-sourced points
  if (av.points && av.points.length) {
    html += '<div class="analyst-points">';
    for (const pt of av.points) {
      const cat = pt.category || 'meta';
      html += '<div class="analyst-point">' +
        '<span class="analyst-tag tag-' + cat + '">' + cat + '</span>' +
        '<span class="point-text">' + pt.text + '</span>' +
        (pt.model ? '<span class="point-model">' + pt.model + '</span>' : '') +
        '</div>';
    }
    html += '</div>';
  }

  el.innerHTML = html;
}

// ── EXECUTION ADVISORY ──
function renderExecutionAdvisory(data) {
  const el = document.getElementById('advisory-content');
  const ea = data.execution_advisory;
  if (!ea) {
    el.innerHTML = '<div class="advisory-empty">No advisory data. Run crypto-intel-weekly.js.</div>';
    return;
  }

  const postureIcon = ea.risk_posture === 'cautious' ? '🛡️' : ea.risk_posture === 'constructive' ? '🚀' : '⚖️';
  const postureClass = ea.risk_posture || 'neutral';
  const confClass = ea.confidence || 'medium';

  let html = '<div class="advisory-banner">' +
    '<div class="advisory-warning">Shadow-mode — does NOT change INTEL_GATE or bot behavior</div>' +
    '<div class="advisory-posture">' +
      '<span class="advisory-posture-label">Posture:</span>' +
      '<span class="advisory-posture-value ' + postureClass + '">' + postureIcon + ' ' + (ea.risk_posture || '—').toUpperCase() + '</span>' +
    '</div>' +
    '<div class="advisory-conf">Confidence: <span class="' + confClass + '">' + (ea.confidence || '—').toUpperCase() + '</span></div>';

  if (ea.reasons && ea.reasons.length) {
    html += '<div class="advisory-reasons">';
    for (const r of ea.reasons) {
      html += '<div class="advisory-reason">' + r + '</div>';
    }
    html += '</div>';
  }
  html += '</div>';

  el.innerHTML = html;
}

// ── ALERTS ──
function renderAlertsSection(data) {
  const el = document.getElementById('alerts-content');
  const alerts = data.alerts || [];
  if (!alerts.length) {
    el.innerHTML = '<div class="alerts-empty">No significant changes detected this week.</div>';
    return;
  }

  const SEV = { critical: '🔴', warning: '🟡', info: '🔵' };
  let html = '<div class="alert-list">';
  for (const a of alerts) {
    const sevEmoji = SEV[a.severity] || '•';
    const confBadge = a.confidence ? '<span class="conf-badge conf-' + a.confidence + '">' +
      (a.confidence === 'high' ? '▲ HIGH' : a.confidence === 'medium' ? '◆ MED' : '◇ LOW') + '</span>' : '';
    const whyLine = a.rationale ? '<div class="alert-why">Why: ' + a.rationale + '</div>' : '';

    html += '<div class="alert-card sev-' + (a.severity || 'info') + '">' +
      '<span class="alert-emoji">' + sevEmoji + '</span>' +
      '<div class="alert-body">' +
        '<div class="alert-title">' + (a.title || '—') + '</div>' +
        '<div class="alert-detail">' + (a.detail || '') + '</div>' +
        whyLine +
      '</div>' +
      (confBadge ? '<div class="alert-conf">' + confBadge + '</div>' : '') +
    '</div>';
  }
  html += '</div>';
  el.innerHTML = html;
}

refreshData();
</script>
</body>
</html>`);
});

// ── /api/overview — lightweight tile data for Mission Control (P9N) ───────────
app.get('/api/overview', (req, res) => {
  try {
    if (!fs.existsSync(LATEST_INTEL)) {
      return res.json({ status: 'stale', error: 'intelligence.json not found' });
    }
    const intel = JSON.parse(fs.readFileSync(LATEST_INTEL, 'utf8'));
    const { report_date } = intel;
    const daysOld = report_date
      ? Math.floor((Date.now() - new Date(report_date + 'T00:00:00Z').getTime()) / 86400000)
      : Infinity;

    // Status: healthy (<=8d), degraded (9-21d or critical alert), stale (>21d or unreadable)
    let status = 'healthy';
    if (daysOld > 21) status = 'stale';
    else if (daysOld > 8) status = 'degraded';

    // Build top alert from tuned helper
    let topAlert = null;
    try {
      const { buildAlertSummary } = require('./alerts-helper.js');
      const { sortAlerts } = require('./alerts-helper.js');
      const current = {
        report_date, regime: intel.regime || null, regime_certainty: intel.regime_certainty || null,
        regime_confidence: intel.regime_confidence != null ? intel.regime_confidence : null,
        funding_regime: intel.cycle_context?.funding_regime || null,
        ai_vs_btc: intel.sector_pulse?.ai?.sector_perf_7d_vs_btc_avg != null
          ? +intel.sector_pulse.ai.sector_perf_7d_vs_btc_avg : null,
        rwa_vs_btc: intel.sector_pulse?.rwa?.sector_perf_7d_vs_btc_avg != null
          ? +intel.sector_pulse.rwa.sector_perf_7d_vs_btc_avg : null,
        analyst_view: intel.analyst_view || null,
      };
      const alerts = buildAlertSummary(current, []);
      const sorted = sortAlerts(alerts);
      if (sorted.length) {
        const a = sorted[0];
        topAlert = { severity: a.severity, confidence: a.confidence, title: a.title, rationale: a.rationale };
        if (status === 'healthy' && a.severity === 'critical') status = 'degraded';
      }
    } catch(_) { /* non-fatal */ }

    res.json({
      status,
      report_date,
      regime_label: intel.regime || null,
      regime_certainty: intel.regime_certainty || null,
      regime_confidence: intel.regime_confidence != null ? intel.regime_confidence : null,
      funding_regime: intel.cycle_context?.funding_regime || null,
      top_alert: topAlert,
    });
  } catch (e) {
    res.json({ status: 'stale', error: e.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CSDAWG Operator Dashboard v1.1 running on http://0.0.0.0:${PORT}`);
});
