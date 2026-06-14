const axios = require('axios');
const config = require('../config');
const pm2 = require('./pm2');

async function getBinanceData() {
  const svc = pm2.getService('binance-bot');
  try {
    const res = await axios.get(`${config.BINANCE_BOT}/api/status`, { timeout: 5000 });
    const d = res.data;
    return {
      balance_usd: d.balance || null,
      status: d.status || 'unknown',
      last_trade: d.last_trade_time ? new Date(d.last_trade_time).toISOString() : null,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts: svc ? svc.pm2_env.restart_time : null,
    };
  } catch (e) {
    return {
      balance_usd: null,
      status: 'unreachable',
      last_trade: null,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts: svc ? svc.pm2_env.restart_time : null,
      note: `Adapter failed: ${e.message}`,
    };
  }
}

module.exports = { getBinanceData };
