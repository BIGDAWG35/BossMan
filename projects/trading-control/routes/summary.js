const binance = require('../adapters/binance');
const cryptoPortfolio = require('../adapters/crypto-portfolio');
const moneyPipeline = require('../adapters/money-pipeline');
const quickStats = require('../adapters/quick-stats');

async function getSummary() {
  const [binanceData, cryptoData, moneyData, qsData] = await Promise.all([
    binance.getBinanceData(),
    cryptoPortfolio.getCryptoPortfolioData(),
    moneyPipeline.getMoneyPipelineData(),
    quickStats.getQuickStatsData(),
  ]);

  const exchanges = [];
  if (binanceData.balance_usd !== null) {
    exchanges.push({
      exchange: 'binance',
      balance_usd: parseFloat(binanceData.balance_usd.toFixed(2)),
      currency: 'USDT',
    });
  }
  // Kraken placeholder (no active balance)
  exchanges.push({ exchange: 'kraken', balance_usd: 0.00, currency: 'USD' });

  const total = exchanges.reduce((sum, ex) => sum + ex.balance_usd, 0);

  const services = [];

  // Binance
  const bnSVC = { service: 'binance_bot', port: 8104, ...binanceData };
  delete bnSVC.balance_usd;
  delete bnSVC.status;
  services.push(bnSVC);

  // Crypto Portfolio
  const cpSVC = { service: 'crypto_portfolio', port: 8105, ...cryptoData };
  delete cpSVC.up;
  services.push(cpSVC);

  // Money Pipeline
  const mpSVC = { service: 'money_pipeline', port: 8020, ...moneyData };
  delete mpSVC.up;
  services.push(mpSVC);

  // Quick Stats
  const qsSVC = { service: 'quick_stats', port: 8102, ...qsData };
  delete qsSVC.digest;
  services.push(qsSVC);

  return {
    timestamp: new Date().toISOString(),
    portfolio: {
      total_value_usd: parseFloat(total.toFixed(2)),
      exchanges,
    },
    pnl: {
      today_realized_usd: null,
      open_unrealized_usd: null,
      note: 'Realized P&L requires trade history from binance-bot',
    },
    services,
  };
}

module.exports = { getSummary };
