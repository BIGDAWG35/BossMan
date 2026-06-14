const express = require('express');
const path = require('path');
const config = require('./config');
const { getSummary } = require('./routes/summary');
const { getEvents } = require('./routes/events');
const { getHealth } = require('./routes/health');

const app = express();
const PORT = config.PORT;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/summary', async (req, res) => {
  try {
    const data = await getSummary();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await getEvents();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const data = await getHealth();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`trading-control running on http://localhost:${PORT}`);
  console.log(`Hub route: http://localhost:8090/trading (add /trading proxy to hub/server.js)`);
});
