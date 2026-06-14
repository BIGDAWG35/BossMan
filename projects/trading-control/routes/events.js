function getEvents() {
  // Alerts derived from quick-stats restarts
  const alerts = [];
  // Placeholder: alerts will be populated as services are checked
  return {
    timestamp: new Date().toISOString(),
    trades: [],  // Always array
    alerts: [],  // Always array
  };
}

module.exports = { getEvents };
