const axios = require('axios');
const config = require('../config');
const pm2 = require('./pm2');

async function getCryptoPortfolioData() {
  const svc = pm2.getService('crypto-portfolio');
  try {
    await axios.get(`${config.CRYPTO_PORTFOLIO}/`, { timeout: 5000 });
    return {
      up: true,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts: svc ? svc.pm2_env.restart_time : null,
    };
  } catch (e) {
    return {
      up: false,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts: svc ? svc.pm2_env.restart_time : null,
      note: `Adapter failed: ${e.message}`,
    };
  }
}

module.exports = { getCryptoPortfolioData };
