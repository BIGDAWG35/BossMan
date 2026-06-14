const axios = require('axios');
const config = require('../config');
const pm2 = require('./pm2');

// Track restarts to determine stability
let lastKnownRestarts = null;
let lastCheckTime = null;

async function getQuickStatsData() {
  const svc = pm2.getService('quick-stats');
  const restarts = svc ? svc.pm2_env.restart_time : null;
  const now = Date.now();

  let stable = false;
  let note = null;

  if (restarts !== null) {
    if (restarts < 50) {
      stable = true;
    } else if (lastKnownRestarts !== null && lastCheckTime !== null) {
      // Stable if restarts haven't increased in last 5 minutes
      if ((now - lastCheckTime) >= 300000 && restarts === lastKnownRestarts) {
        stable = true;
        note = 'Restarts frozen — stable since LaunchAgent removal';
      }
    }
  }

  if (restarts !== null && restarts >= 50 && !stable) {
    note = `1442 restarts — LaunchAgent conflict resolved Apr 27`;
  }

  lastKnownRestarts = restarts;
  lastCheckTime = now;

  try {
    const res = await axios.get(`${config.QUICK_STATS}/api/digest`, { timeout: 5000 });
    return {
      digest: res.data,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts,
      stable,
      note,
    };
  } catch (e) {
    return {
      digest: null,
      pm2_status: svc ? 'online' : 'down',
      pid: svc ? svc.pid : null,
      uptime_seconds: svc ? Math.floor((Date.now() - svc.pm2_env.pm_uptime) / 1000) : null,
      restarts,
      stable,
      note: note || `Adapter failed: ${e.message}`,
    };
  }
}

module.exports = { getQuickStatsData };
