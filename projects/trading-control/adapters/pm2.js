const { execSync } = require('child_process');

function getServices() {
  try {
    const out = execSync('pm2 jlist', { timeout: 5000 });
    return JSON.parse(out.toString());
  } catch (e) {
    return [];
  }
}

function getService(name) {
  const services = getServices();
  return services.find(s => s.name === name) || null;
}

module.exports = { getServices, getService };
