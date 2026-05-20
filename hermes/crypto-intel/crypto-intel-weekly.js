#!/usr/bin/env node
/**
 * crypto-intel-weekly.js — CSDAWG 2.0 Weekly Intelligence Generator
 * 
 * Phase 9B: Implements the CSDAWG 2.0 intelligence engine from CRYPTO_INTEL_ENGINE_SPEC.md
 * Reads from: Binance US public API, CoinGecko public API
 * Outputs to:
 *   - ~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json (for INTEL_GATE)
 *   - ~/.hermes/knowledge/crypto-intel/weekly/YYYY/CRYPTO_INTEL_YYYY-MM-DD.md (human report)
 * 
 * Run: node crypto-intel-weekly.js
 * Cron: Monday 08:00 PDT via Hermes cron (job_id: tbd)
 * 
 * Tags: [TRADING] [WORKFLOW] [PROJECT:CryptoIntel]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ─────────────────────────────────────────────────────────────────────
const BINANCE_US_API = 'https://api.binance.us';
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const OUTPUT_DIR = path.join(process.env.HOME, '.hermes/knowledge/crypto-intel/weekly');
const LATEST_LINK = path.join(OUTPUT_DIR, 'latest');
const SECTORS = {
  'L1': ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'ADAUSDT', 'AVAXUSDT', 'MATICUSDT', 'DOTUSDT', 'ATOMUSDT'],
  'DeFi': ['UNIUSDT', 'AAVEUSDT', 'CRVUSDT', 'MKRUSDT', 'LINKUSDT'],
  'Memecoins': ['DOGEUSDT', 'SHIBUSDT', 'PEPEUSDT', 'WIFUSDT', 'FLOKIUSDT'],
  'AI': ['FETUSDT', 'AGIXUSDT', 'OCEANUSDT'],
  'Gaming': ['AXSUSDT', 'SANDUSDT', 'MANAUSDT']
};
const ALL_SYMBOLS = Object.values(SECTORS).flat();
const BTC_ATH = 73750; // BTC all-time high (approx — update if needed)

// ── HTTP Helper ────────────────────────────────────────────────────────────────
function httpGet(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Hermes-CryptoIntel/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse failed for ${url}: ${data.substring(0, 200)}`)); }
      });
    });
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
    req.on('error', reject);
  });
}

// ── Step 1: Regime Detection ───────────────────────────────────────────────────
async function detectRegime() {
  console.log('[intel] Detecting market regime...');
  
  // Fetch BTC data from CoinGecko (price history, current price)
  let btcData;
  try {
    btcData = await httpGet(`${COINGECKO_API}/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&include_roi=false`);
  } catch(e) {
    // Fallback: try Binance for BTC price
    const btcTicker = await httpGet(`${BINANCE_US_API}/api/v3/ticker/price?symbol=BTCUSDT`);
    btcData = {
      market_data: {
        current_price: { usd: parseFloat(btcTicker.price) },
        ath: { usd: BTC_ATH },
        price_change_percentage_90d: 0
      }
    };
  }
  
  const btcPrice = btcData.market_data.current_price.usd;
  const btcATH = btcData.market_data.ath.usd;
  const drawdownFromATH = ((btcATH - btcPrice) / btcATH) * 100;
  const momentum90d = btcData.market_data.price_change_percentage_90d || 0;
  
  // BTC 200d SMA via Binance klines (daily, 200 candles)
  let sma200 = null;
  try {
    const klines = await httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=200`);
    const closes = klines.map(k => parseFloat(k[4]));
    sma200 = closes.reduce((a, b) => a + b, 0) / closes.length;
  } catch(e) {
    console.log('[intel] Could not compute SMA200, using fallback');
    sma200 = btcPrice; // neutral fallback
  }
  
  // 50d SMA
  let sma50 = null;
  try {
    const klines50 = await httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=50`);
    const closes50 = klines50.map(k => parseFloat(k[4]));
    sma50 = closes50.reduce((a, b) => a + b, 0) / closes50.length;
  } catch(e) {
    sma50 = sma200;
  }
  
  const above200 = btcPrice > sma200;
  const crossSignal = sma50 > sma200 ? 'golden_cross' : (sma50 < sma200 ? 'death_cross' : 'neutral');
  
  // 20d volatility (stddev of daily returns over 20 days)
  let volatilityRegime = 'NORMAL';
  try {
    const klines20 = await httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=25`);
    const returns = [];
    for (let i = 1; i < klines20.length; i++) {
      const prev = parseFloat(klines20[i-1][4]);
      const curr = parseFloat(klines20[i][4]);
      if (prev > 0) returns.push((curr - prev) / prev);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const stddev = Math.sqrt(variance);
    const annualizedVol = stddev * Math.sqrt(365);
    if (annualizedVol > 1.2) volatilityRegime = 'EXTREME';
    else if (annualizedVol > 0.8) volatilityRegime = 'HIGH';
    else if (annualizedVol < 0.4) volatilityRegime = 'LOW';
  } catch(e) {
    // ignore volatility if API fails
  }
  
  // Count agreeing indicators
  const indicators = [];
  if (btcPrice > sma200) indicators.push('btc_above_200d');
  if (drawdownFromATH < 20) indicators.push('low_drawdown');
  if (momentum90d > 15) indicators.push('positive_momentum');
  if (drawdownFromATH > 50) indicators.push('high_drawdown');
  if (momentum90d < -20) indicators.push('negative_momentum');
  if (crossSignal === 'golden_cross') indicators.push('golden_cross');
  if (crossSignal === 'death_cross') indicators.push('death_cross');
  
  // Determine regime
  let regime;
  if (volatilityRegime === 'EXTREME' && drawdownFromATH > 75) {
    regime = 'EXTREME';
  } else if (btcPrice < sma200 && drawdownFromATH > 50 && momentum90d < -20) {
    regime = 'BEAR';
  } else if (btcPrice > sma200 && drawdownFromATH < 20 && momentum90d > 15) {
    regime = 'BULL';
  } else {
    regime = 'MID_CYCLE';
  }
  
  const confidence = indicators.length >= 4 ? 0.85 : (indicators.length >= 2 ? 0.65 : 0.45);
  
  console.log(`[intel] Regime: ${regime} (confidence: ${confidence})`);
  console.log(`[intel] BTC $${btcPrice.toFixed(2)} | ATH drawdown: ${drawdownFromATH.toFixed(1)}% | 90d momentum: ${momentum90d.toFixed(1)}%`);
  
  return {
    regime,
    regime_confidence: confidence,
    regime_signal_date: new Date().toISOString().split('T')[0],
    btc_200d_sma: sma200,
    btc_50d_vs_200d: crossSignal,
    btc_current_price: btcPrice,
    drawdown_from_ath_pct: drawdownFromATH,
    momentum_90d_pct: momentum90d,
    volatility_regime: volatilityRegime,
    indicators_agreeing: indicators
  };
}

// ── Step 2: Trend Analysis (per coin) ─────────────────────────────────────────
async function analyzeTrends(regimeData) {
  console.log('[intel] Analyzing trends for', ALL_SYMBOLS.length, 'coins...');
  
  const btc7d = regimeData.btc_7d_pct || 0;
  const trends = {};
  
  for (const symbol of ALL_SYMBOLS) {
    try {
      // 7d and 30d klines
      const [klines7d, klines30d] = await Promise.all([
        httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=${symbol}&interval=1d&limit=8`),
        httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=${symbol}&interval=1d&limit=31`)
      ]);
      
      if (!klines7d || klines7d.length < 2) { trends[symbol] = null; continue; }
      
      const latestPrice = parseFloat(klines7d[klines7d.length - 1][4]);
      const price7dAgo = parseFloat(klines7d[0][4]);
      const price30dAgo = parseFloat(klines30d[0][4]);
      
      const price7dPct = ((latestPrice - price7dAgo) / price7dAgo) * 100;
      const price30dPct = ((latestPrice - price30dAgo) / price30dAgo) * 100;
      
      // 7d volume avg
      const vol7d = klines7d.slice(1).map(k => parseFloat(k[5]));
      const vol7dAvg = vol7d.reduce((a, b) => a + b, 0) / vol7d.length;
      
      // 14d volume avg (for trend)
      const klines14d = await httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=${symbol}&interval=1d&limit=15`);
      const vol14d = klines14d.slice(1).map(k => parseFloat(k[5]));
      const vol14dAvg = vol14d.reduce((a, b) => a + b, 0) / vol14d.length;
      const volume7dTrend = vol14dAvg > 0 ? ((vol7dAvg - vol14dAvg) / vol14dAvg) * 100 : 0;
      
      const relativeToBTC = price7dPct - btc7d;
      
      trends[symbol] = {
        symbol,
        price: latestPrice,
        price_7d_pct: price7dPct,
        price_30d_pct: price30dPct,
        volume_7d_avg: vol7dAvg,
        volume_7d_trend: volume7dTrend,
        relative_to_btc_pct: relativeToBTC,
        trend_direction: price7dPct > 0 && price30dPct > 0 ? 'UP' : (price7dPct < 0 && price30dPct < 0 ? 'DOWN' : 'MIXED')
      };
    } catch(e) {
      trends[symbol] = null;
    }
  }
  
  return trends;
}

// ── Step 3: Sector Rotation ───────────────────────────────────────────────────
async function analyzeSectors(trends, regimeData) {
  console.log('[intel] Analyzing sector rotation...');
  
  const btc7d = regimeData.btc_7d_pct || 0;
  const sectors = {};
  
  for (const [sectorName, symbols] of Object.entries(SECTORS)) {
    const sectorTrends = symbols.map(s => trends[s]).filter(t => t !== null);
    if (sectorTrends.length === 0) continue;
    
    const avg7d = sectorTrends.reduce((a, t) => a + t.price_7d_pct, 0) / sectorTrends.length;
    const vsBTC = avg7d - btc7d;
    
    let signal;
    if (vsBTC > 5) signal = 'LEADING';
    else if (vsBTC < -5) signal = 'LAGGING';
    else signal = 'NEUTRAL';
    
    sectors[sectorName] = {
      name: sectorName,
      avg_7d_return: avg7d,
      vs_btc: vsBTC,
      signal,
      coin_count: sectorTrends.length
    };
  }
  
  // Rank sectors by relative performance
  const sectorRank = Object.values(sectors).sort((a, b) => b.vs_btc - a.vs_btc).map(s => s.name);
  
  return { sectors, sector_rank: sectorRank };
}

// ── Step 4: Coin Band Assignment ───────────────────────────────────────────────
function assignBands(trends, regimeData, sectorData) {
  console.log('[intel] Assigning coin bands...');
  
  const { regime, regime_confidence } = regimeData;
  const { sectors, sector_rank } = sectorData;
  
  // Regime multiplier
  const regimeMult = { 'EXTREME': 0.5, 'BEAR': 0.7, 'MID_CYCLE': 1.0, 'BULL': 1.2 };
  const rmult = regimeMult[regime] || 1.0;
  
  const coinRankings = [];
  
  for (const [symbol, trend] of Object.entries(trends)) {
    if (!trend) continue;
    
    // Find sector for this coin
    const sectorEntry = Object.entries(SECTORS).find(([, syms]) => syms.includes(symbol));
    const sectorName = sectorEntry ? sectorEntry[0] : 'Other';
    const sectorIdx = sector_rank.indexOf(sectorName);
    const sectorNorm = sector_rank.length > 0 ? 1 - (sectorIdx / Math.max(sector_rank.length - 1, 1)) : 0.5;
    
    // Normalize metrics (0–1) across all coins with data
    const allTrends = Object.values(trends).filter(t => t !== null);
    const max7d = Math.max(...allTrends.map(t => Math.abs(t.price_7d_pct)), 1);
    const maxVolTrend = Math.max(...allTrends.map(t => Math.abs(t.volume_7d_trend)), 1);
    
    const priceMomNorm = Math.min(Math.abs(trend.price_7d_pct) / max7d, 1);
    const volTrendNorm = Math.min(Math.abs(trend.volume_7d_trend) / maxVolTrend, 1);
    
    // Band score formula from spec
    const bandScore = (
      0.4 * priceMomNorm +
      0.2 * volTrendNorm +
      rmult * 0.4 +  // simplified regime multiplier (0.2–0.6)
      0.2 * sectorNorm
    );
    
    // Band assignment based on score and regime
    let band;
    if (regime === 'EXTREME') {
      band = 'WARM'; // downgrade all in extreme
    } else if (regime === 'BEAR') {
      band = trend.price_7d_pct > 0 && bandScore > 0.7 ? 'WATCH' : 'COLD';
    } else if (bandScore > 0.75 && trend.price_7d_pct > 0) {
      band = 'HOT';
    } else if (bandScore > 0.55 && trend.relative_to_btc_pct > -3) {
      band = 'WARM';
    } else if (bandScore > 0.35 && trend.price_7d_pct > -5) {
      band = 'WATCH';
    } else {
      band = 'COLD';
    }
    
    // Override: regime filters
    if (regime === 'BEAR' && (band === 'HOT' || band === 'WARM')) band = 'WATCH';
    
    coinRankings.push({
      symbol,
      band,
      band_score: Math.round(bandScore * 100) / 100,
      price_7d_pct: Math.round(trend.price_7d_pct * 10) / 10,
      price: trend.price,
      volume_7d_trend: Math.round(trend.volume_7d_trend * 10) / 10,
      relative_to_btc_pct: Math.round(trend.relative_to_btc_pct * 10) / 10,
      sector: sectorName,
      reason: buildBandReason(band, trend, regime, sectorName)
    });
  }
  
  // Sort by band score descending
  coinRankings.sort((a, b) => b.band_score - a.band_score);
  
  const hot = coinRankings.filter(c => c.band === 'HOT');
  const warm = coinRankings.filter(c => c.band === 'WARM');
  const watch = coinRankings.filter(c => c.band === 'WATCH');
  const cold = coinRankings.filter(c => c.band === 'COLD');
  
  return { coin_rankings: coinRankings, hot_count: hot.length, warm_count: warm.length, watch_count: watch.length, cold_count: cold.length };
}

function buildBandReason(band, trend, regime, sector) {
  const parts = [];
  if (trend.price_7d_pct > 5) parts.push(`${trend.price_7d_pct.toFixed(1)}% 7d`);
  if (trend.relative_to_btc_pct > 3) parts.push(`+${trend.relative_to_btc_pct.toFixed(1)}% vs BTC`);
  if (trend.volume_7d_trend > 15) parts.push(`vol +${trend.volume_7d_trend.toFixed(0)}%`);
  parts.push(`${sector} sector`);
  if (regime !== 'MID_CYCLE') parts.push(`${regime} regime`);
  return parts.join(' | ');
}

// ── Step 5: Signal Generation ──────────────────────────────────────────────────
function generateSignals(coinRankings, prevIntel) {
  const signals = [];
  let sigIdx = 1;
  const today = new Date().toISOString().split('T')[0];
  
  for (const coin of coinRankings) {
    let prevBand = null;
    if (prevIntel && prevIntel.coin_rankings) {
      const prev = prevIntel.coin_rankings.find(c => c.symbol === coin.symbol);
      if (prev) prevBand = prev.band;
    }
    
    if (prevBand && prevBand !== coin.band) {
      signals.push({
        signal_id: `SIG-${today.replace(/-/g,'')}-${String(sigIdx).padStart(3,'0')}`,
        signal_type: prevBand < coin.band ? 'BAND_PROMOTION' : 'BAND_DEMOTION',
        symbol: coin.symbol,
        band_from: prevBand,
        band_to: coin.band,
        trigger: `band_score ${prevBand}→${coin.band}`,
        confidence: coin.band_score
      });
      sigIdx++;
    }
  }
  
  return signals;
}

// ── Step 6: Risk Flagging ──────────────────────────────────────────────────────
function flagRisks(regimeData, trends, coinRankings) {
  const flags = [];
  
  if (regimeData.volatility_regime === 'EXTREME') {
    flags.push({ flag: 'EXTREME_VOLATILITY', status: 'ACTIVE', severity: 'HIGH', action: 'Reduce position size, widen SL' });
  }
  
  if (regimeData.regime === 'BEAR' || regimeData.regime === 'EXTREME') {
    flags.push({ flag: 'BEAR_REGIME', status: 'ACTIVE', severity: regimeData.regime === 'EXTREME' ? 'HIGH' : 'MEDIUM', action: 'Pause new entries, tighten SL' });
  }
  
  const memecoins = coinRankings.filter(c => c.sector === 'Memecoins' && c.band === 'HOT');
  if (memecoins.length > 0) {
    flags.push({ flag: 'MEMECOIN_PUMP', status: 'ACTIVE', severity: 'MEDIUM', action: 'Monitor closely, reduce memecoin exposure' });
  }
  
  if (regimeData.regime_confidence < 0.5) {
    flags.push({ flag: 'REGIME_UNCERTAINTY', status: 'ACTIVE', severity: 'MEDIUM', action: 'Lower confidence in band assignments — verify manually' });
  }
  
  return flags;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('==========================================');
  console.log('CSDAWG 2.0 Weekly Intelligence Generator');
  console.log('Date:', new Date().toISOString());
  console.log('==========================================');
  
  // Load previous intelligence (for signal diff)
  let prevIntel = null;
  const prevPath = path.join(LATEST_LINK, 'intelligence.json');
  if (fs.existsSync(prevPath)) {
    try { prevIntel = JSON.parse(fs.readFileSync(prevPath, 'utf8')); }
    catch { prevIntel = null; }
  }
  
  try {
    // Step 1: Regime
    const regimeData = await detectRegime();
    
    // Get BTC 7d pct for sector relative calculation
    try {
      const btcKlines = await httpGet(`${BINANCE_US_API}/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=8`);
      const btcLatest = parseFloat(btcKlines[btcKlines.length - 1][4]);
      const btc7dAgo = parseFloat(btcKlines[0][4]);
      regimeData.btc_7d_pct = ((btcLatest - btc7dAgo) / btc7dAgo) * 100;
    } catch(e) {
      regimeData.btc_7d_pct = 0;
    }
    
    // Step 2: Trends
    const trends = await analyzeTrends(regimeData);
    
    // Step 3: Sectors
    const sectorData = await analyzeSectors(trends, regimeData);
    
    // Step 4: Bands
    const bandData = assignBands(trends, regimeData, sectorData);
    
    // Step 5: Signals
    const signals = generateSignals(bandData.coin_rankings, prevIntel);
    
    // Step 6: Risk flags
    const riskFlags = flagRisks(regimeData, trends, bandData.coin_rankings);
    
    // Build final intelligence object
    const intelligence = {
      report_date: new Date().toISOString().split('T')[0],
      generated_at: new Date().toISOString(),
      ...regimeData,
      coin_rankings: bandData.coin_rankings,
      hot_count: bandData.hot_count,
      warm_count: bandData.warm_count,
      watch_count: bandData.watch_count,
      cold_count: bandData.cold_count,
      sectors: Object.values(sectorData.sectors),
      sector_rank: sectorData.sector_rank,
      signals,
      risk_flags: riskFlags,
      source: 'CSDAWG 2.0',
      version: '1.0'
    };
    
    // ── Write intelligence.json ──────────────────────────────────────────────
    fs.mkdirSync(LATEST_LINK, { recursive: true });
    const intelPath = path.join(LATEST_LINK, 'intelligence.json');
    fs.writeFileSync(intelPath, JSON.stringify(intelligence, null, 2));
    console.log('[intel] Written:', intelPath);
    
    // ── Archive copy ─────────────────────────────────────────────────────────
    const year = new Date().getFullYear();
    const dateStr = intelligence.report_date;
    const archiveDir = path.join(OUTPUT_DIR, String(year));
    fs.mkdirSync(archiveDir, { recursive: true });
    const archivePath = path.join(archiveDir, `CRYPTO_INTEL_${dateStr}.json`);
    fs.writeFileSync(archivePath, JSON.stringify(intelligence, null, 2));
    console.log('[intel] Archived:', archivePath);
    
    // ── Write human-readable report ───────────────────────────────────────────
    const reportPath = path.join(archiveDir, `CRYPTO_INTEL_${dateStr}.md`);
    const report = buildMarkdownReport(intelligence);
    fs.writeFileSync(reportPath, report);
    console.log('[intel] Report:', reportPath);
    
    // ── Summary output ───────────────────────────────────────────────────────
    console.log('\n==========================================');
    console.log('INTELLIGENCE SUMMARY');
    console.log('==========================================');
    console.log(`Regime: ${regimeData.regime} (${regimeData.regime_confidence})`);
    console.log(`BTC: $${regimeData.btc_current_price?.toFixed(2) || 'unknown'}`);
    console.log(`HOT: ${bandData.hot_count} | WARM: ${bandData.warm_count} | WATCH: ${bandData.watch_count} | COLD: ${bandData.cold_count}`);
    console.log(`Sectors: ${sectorData.sector_rank.join(' > ')}`);
    console.log(`Signals: ${signals.length} band changes`);
    console.log(`Risk flags: ${riskFlags.length}`);
    console.log(`Output: ${intelPath}`);
    
    return intelligence;
    
  } catch(e) {
    console.error('[intel] ERROR:', e.message);
    
    // Fallback: write safe placeholder if script fails
    const fallback = {
      report_date: new Date().toISOString().split('T')[0],
      generated_at: new Date().toISOString(),
      regime: 'MID_CYCLE',
      regime_confidence: 0.5,
      regime_signal_date: new Date().toISOString().split('T')[0],
      btc_200d_sma: null,
      btc_50d_vs_200d: 'unknown',
      btc_current_price: null,
      drawdown_from_ath_pct: null,
      momentum_90d_pct: null,
      volatility_regime: 'NORMAL',
      indicators_agreeing: [],
      coin_rankings: [],
      hot_count: 0, warm_count: 0, watch_count: 0, cold_count: 0,
      sectors: [],
      sector_rank: [],
      signals: [],
      risk_flags: [],
      source: 'CSDAWG 2.0',
      version: '1.0',
      error: e.message
    };
    
    fs.mkdirSync(LATEST_LINK, { recursive: true });
    fs.writeFileSync(path.join(LATEST_LINK, 'intelligence.json'), JSON.stringify(fallback, null, 2));
    throw e;
  }
}

function buildMarkdownReport(intel) {
  const lines = [];
  const d = intel;
  
  lines.push(`# CSDAWG 2.0 Weekly Intelligence Report`);
  lines.push(`**Report Date:** ${d.report_date}`);
  lines.push(`**Generated:** ${d.generated_at}`);
  lines.push(`**Regime:** ${d.regime} (confidence: ${d.regime_confidence})`);
  lines.push('');
  lines.push('## Market Regime');
  lines.push(`| Indicator | Value | Signal |`);
  lines.push('|-----------|-------|--------|');
  if (d.btc_current_price) lines.push(`| BTC Price | $${d.btc_current_price.toFixed(2)} | — |`);
  if (d.btc_200d_sma) lines.push(`| BTC 200d SMA | $${d.btc_200d_sma.toFixed(2)} | ${d.btc_current_price > d.btc_200d_sma ? 'Above' : 'Below'} |`);
  if (d.momentum_90d_pct !== null) lines.push(`| BTC 90d Momentum | ${d.momentum_90d_pct.toFixed(1)}% | ${d.momentum_90d_pct > 0 ? '+' : ''}${d.momentum_90d_pct.toFixed(1)}% |`);
  if (d.drawdown_from_ath_pct !== null) lines.push(`| BTC Drawdown from ATH | ${d.drawdown_from_ath_pct.toFixed(1)}% | ${d.drawdown_from_ath_pct < 20 ? 'LOW' : d.drawdown_from_ath_pct > 50 ? 'HIGH' : 'MED'} |`);
  lines.push(`| Volatility | ${d.volatility_regime} | — |`);
  lines.push('');
  if (d.indicators_agreeing?.length) lines.push(`**Indicators agreeing:** ${d.indicators_agreeing.join(', ')}`);
  lines.push('');
  
  lines.push('## Coin Rankings');
  lines.push(`| Symbol | Band | Score | 7d % | vs BTC | Sector | Reason |`);
  lines.push('|--------|------|-------|------|--------|--------|--------|');
  for (const c of d.coin_rankings || []) {
    const bandIcon = c.band === 'HOT' ? '🔥' : c.band === 'WARM' ? '🟡' : c.band === 'WATCH' ? '🟠' : '❄️';
    lines.push(`| ${c.symbol.replace('USDT','')} | ${bandIcon} ${c.band} | ${c.band_score} | ${c.price_7d_pct}% | ${c.relative_to_btc_pct > 0 ? '+' : ''}${c.relative_to_btc_pct}% | ${c.sector} | ${c.reason.substring(0,50)} |`);
  }
  lines.push('');
  lines.push(`**Band Summary:** 🔥${d.hot_count} HOT | 🟡${d.warm_count} WARM | 🟠${d.watch_count} WATCH | ❄️${d.cold_count} COLD`);
  lines.push('');
  
  lines.push('## Sector Rotation');
  lines.push(`| Sector | 7d Return | vs BTC | Signal |`);
  lines.push('|--------|-----------|--------|--------|');
  for (const s of d.sectors || []) {
    lines.push(`| ${s.name} | ${s.avg_7d_return?.toFixed(1)}% | ${s.vs_btc > 0 ? '+' : ''}${s.vs_btc?.toFixed(1)}% | ${s.signal} |`);
  }
  lines.push('');
  lines.push(`**Sector Rank:** ${(d.sector_rank || []).join(' > ')}`);
  lines.push('');
  
  if (d.signals?.length) {
    lines.push('## Signals');
    lines.push(`| Signal | Symbol | From | To | Trigger |`);
    lines.push('|--------|--------|------|-----|---------|');
    for (const s of d.signals) {
      lines.push(`| ${s.signal_id} | ${s.symbol.replace('USDT','')} | ${s.band_from} | ${s.band_to} | ${s.trigger} |`);
    }
    lines.push('');
  }
  
  if (d.risk_flags?.length) {
    lines.push('## Risk Flags');
    lines.push(`| Flag | Status | Severity | Action |`);
    lines.push('|------|--------|----------|--------|');
    for (const f of d.risk_flags) {
      lines.push(`| ${f.flag} | ${f.status} | ${f.severity} | ${f.action} |`);
    }
    lines.push('');
  }
  
  lines.push('---');
  lines.push(`*CSDAWG 2.0 v1.0 | Source: Binance US + CoinGecko public APIs*`);
  
  return lines.join('\n');
}

// Run
main().then(() => { console.log('[intel] Done.'); process.exit(0); }).catch(e => {
  console.error('[intel] Fatal:', e.message);
  process.exit(1);
});