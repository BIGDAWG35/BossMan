const axios = require('axios');
const config = require('../config');
const pm2 = require('../adapters/pm2');

const HEALTH_SERVICES = [
  { service: 'binance_bot',        port: 8104, name: 'binance-bot' },
  { service: 'crypto_portfolio',    port: 8105, name: 'crypto-portfolio' },
  { service: 'money_pipeline',      port: 8020, name: 'money-pipeline' },
  { service: 'quick_stats',         port: 8102, name: 'quick-stats' },
  { service: 'trading_monitor',   port: 8135, name: 'trading-monitor' },
  { service: 'trading_review',     port: 8132, name: 'trading-review' },
  { service: 'hub',               port: 8090, name: 'hub' },
  { service: 'pm_dashboard',      port: 5050, name: 'fresh-dashboard' },
  { service: 'health_dashboard',  port: 8110, name: 'health-dashboard' },
  { service: 'searxng',            port: 8080, name: 'searxng' },
  { service: 'square_payouts',     port: 3100, name: 'squarepayouts' },
  { service: 'bakery',            port: 3101, name: 'bakery' },
];

async function checkService(entry) {
  const svc = pm2.getService(entry.name);
  const restarts = svc ? svc.pm2_env.restart_time : null;
  const uptime_seconds = svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null;

  let status = 'ok';
  let note = null;

  try {
    await axios.get(`http://127.0.0.1:${entry.port}/`, { timeout: 5000 });
    status = 'ok';
  } catch (e) {
    if (e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT' || e.code === 'ENOTFOUND') {
      status = 'down';
      note = e.message;
    } else if (e.response) {
      status = 'ok'; // Got a response (even non-200), service is running
    } else {
      status = 'down';
      note = e.message;
    }
  }

  // Upgrade to warn if restarts > 10
  if (status === 'ok' && restarts !== null && restarts > 10) {
    status = 'warn';
    note = `${restarts} restarts`;
  }

  const result = {
    service: entry.service,
    port: entry.port,
    status,
    last_heartbeat: new Date().toISOString(),
    pid: svc ? svc.pid : null,
    uptime_seconds,
    restarts,
  };

  if (note) result.note = note;
  return result;
}

async function getHealth() {
  const results = await Promise.all(HEALTH_SERVICES.map(checkService));

  const summary = {
    total: results.length,
    ok: results.filter(s => s.status === 'ok').length,
    warn: results.filter(s => s.status === 'warn').length,
    down: results.filter(s => s.status === 'down').length,
  };

  return {
    timestamp: new Date().toISOString(),
    services: results,
    summary,
  };
}

module.exports = { getHealth };
