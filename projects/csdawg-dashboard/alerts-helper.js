/**
 * CSDAWG Alerts Helper — shared between dashboard API and outbound delivery
 * P9M v1 — Tuned severity ladder, confidence scoring, rationale, history-aware noise reduction
 */

const UNCERTAIN_TERMS = /uncertain|insufficient data|speculative|incomplete|weak signal|thin|no trend|high uncertainty|unclear|cannot confirm/gi;

/**
 * Build alert-summary objects with:
 *   type, severity, confidence, title, detail, source, rationale
 */
function buildAlertSummary(intel, historySnapshots) {
  const alerts = [];
  // historySnapshots[0] = current report, [1] = prior, [2] = 2-weeks ago, [3] = 3-weeks ago
  const prev  = historySnapshots[1] || null;
  const prev2 = historySnapshots[2] || null; // 2 reports back

  if (!intel) return alerts;

  // ── 1. Regime Changed ─────────────────────────────────────────────────────
  // Default: warning. Escalate to critical if funding also worsened OR certainty dropped to UNCERTAINTY
  if (prev && intel.regime && prev.regime && intel.regime !== prev.regime) {
    const certaintyDropped = intel.regime_certainty === 'UNCERTAINTY' && prev.regime_certainty !== 'UNCERTAINTY';
    const fundingWorsened   = intel.funding_regime && prev.funding_regime &&
                               ['NEUTRAL', 'HEATED', 'NEGATIVE'].indexOf(intel.funding_regime) >
                               ['NEUTRAL', 'HEATED', 'NEGATIVE'].indexOf(prev.funding_regime);
    let severity   = 'warning';
    let confidence = 'medium';
    let rationale  = 'regime_label changed without compounding signals';

    if (certaintyDropped && fundingWorsened) {
      severity  = 'critical';
      confidence = 'high';
      rationale = 'regime changed + funding worsened + certainty dropped to UNCERTAINTY';
    } else if (certaintyDropped || fundingWorsened) {
      severity  = 'critical';
      confidence = 'high';
      rationale = certaintyDropped
        ? 'regime changed + certainty dropped to UNCERTAINTY'
        : 'regime changed + funding worsened simultaneously';
    } else if (intel.regime_confidence != null && intel.regime_confidence >= 0.7) {
      confidence = 'high';
      rationale  = 'regime changed with high confidence, no compounding signals';
    }

    alerts.push({
      type:       'regime_changed',
      severity,
      confidence,
      title:      'Regime Changed',
      detail:     `${prev.regime} → ${intel.regime}`,
      source:     `vs ${prev.report_date}`,
      rationale,
    });
  }

  // ── 2. Regime Certainty Worsened ─────────────────────────────────────────
  // Default: warning. Critical if CONFIRMED → UNCERTAINTY + BTC trend is already weak
  if (prev && intel.regime_certainty && prev.regime_certainty &&
      intel.regime_certainty === 'UNCERTAINTY' && prev.regime_certainty !== 'UNCERTAINTY') {
    // Use BTC drawdown from cycle_context as proxy for market weakness
    const btcDrawdown = intel.cycle_context?.btc_drawdown_from_ath ?? null;
    const alreadyWeak  = btcDrawdown !== null && btcDrawdown <= -30;
    const severity  = alreadyWeak ? 'critical' : 'warning';
    const confidence = alreadyWeak ? 'high' : 'medium';
    const rationale  = alreadyWeak
      ? 'CONFIRMED → UNCERTAINTY during severe BTC drawdown (≤-30% from ATH)'
      : 'regime certainty dropped from CONFIRMED to UNCERTAINTY';

    alerts.push({
      type:      'certainty_worsened',
      severity,
      confidence,
      title:     'Regime Certainty Worsened',
      detail:    `${prev.regime_certainty} → ${intel.regime_certainty}`,
      source:    `vs ${prev.report_date}`,
      rationale,
    });
  }

  // ── 3. Funding Regime Worsened ────────────────────────────────────────────
  // Default: warning. Critical if HEATED→NEGATIVE directly, or NEGATIVE persists ≥2 reports
  if (prev && intel.funding_regime && prev.funding_regime && intel.funding_regime !== prev.funding_regime) {
    const order  = ['NEUTRAL', 'HEATED', 'NEGATIVE'];
    const curIdx  = order.indexOf(intel.funding_regime);
    const prevIdx = order.indexOf(prev.funding_regime);

    if (curIdx > prevIdx) { // worsening
      let severity   = curIdx - prevIdx >= 2 ? 'critical' : 'warning';
      let confidence = 'high';
      let rationale  = `direct worsening: ${prev.funding_regime} → ${intel.funding_regime}`;

      // HEATED → NEGATIVE (skipping NEUTRAL)
      if (intel.funding_regime === 'NEGATIVE' && prev.funding_regime === 'HEATED') {
        severity  = 'critical';
        rationale = 'funding escalated directly from HEATED to NEGATIVE (hot money fully rotated out)';
      }

      // NEGATIVE persisting 2+ consecutive reports
      if (intel.funding_regime === 'NEGATIVE' && prev.funding_regime === 'NEGATIVE') {
        // prev2 tells us if it was already NEGATIVE before
        severity   = 'warning'; // persistent, not new escalation
        confidence = 'high';
        rationale  = 'NEGATIVE funding regime persists for 2+ consecutive reports';
      } else if (intel.funding_regime === 'NEGATIVE' && prev2?.funding_regime === 'NEGATIVE') {
        // Current, prior, and prior-prior are all NEGATIVE
        severity  = 'warning';
        confidence = 'high';
        rationale = 'NEGATIVE funding regime persists for 3+ consecutive reports';
      }

      alerts.push({
        type:      'funding_regime_worsened',
        severity,
        confidence,
        title:     'Funding Regime Worsened',
        detail:    `${prev.funding_regime} → ${intel.funding_regime}`,
        source:    `vs ${prev.report_date}`,
        rationale,
      });
    }
  }

  // ── 4. AI Sector Shifted ≥ 3pp ───────────────────────────────────────────
  // info: ≥3pp, warning: ≥6pp, critical: ≥8pp + contradicts trend or regime deterioration
  if (prev && intel.ai_vs_btc != null && prev.ai_vs_btc != null) {
    const diff    = intel.ai_vs_btc - prev.ai_vs_btc;
    const absD   = Math.abs(diff);
    if (absD >= 3) {
      let severity   = absD >= 6 ? 'warning' : 'info';
      let confidence = 'medium';
      let rationale  = `AI sector delta vs BTC: ${prev.ai_vs_btc.toFixed(1)}% → ${intel.ai_vs_btc.toFixed(1)}% (${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp change)`;

      // Critical: ≥8pp move AND (contradicts prior direction OR regime deteriorating)
      if (absD >= 8) {
        const prevDir  = prev.ai_vs_btc - (historySnapshots[2]?.ai_vs_btc ?? prev.ai_vs_btc);
        const curDir   = intel.ai_vs_btc - prev.ai_vs_btc;
        const contradictsTrend = prevDir * curDir < 0; // sign flip
        const regimeDeteriorating = intel.regime_certainty === 'UNCERTAINTY' && (prev.regime_certainty !== 'UNCERTAINTY');
        if (contradictsTrend || regimeDeteriorating) {
          severity   = 'critical';
          confidence = 'high';
          rationale  = contradictsTrend
            ? `AI sector reversed direction by ${absD.toFixed(1)}pp (prior trend: ${prevDir > 0 ? 'positive' : 'negative'}, now: ${curDir > 0 ? 'positive' : 'negative'})`
            : `AI sector shifted ${absD.toFixed(1)}pp while regime certainty deteriorated`;
        }
      }

      if (absD >= 6 && severity !== 'critical') {
        confidence = 'high';
      }

      alerts.push({
        type:      'sector_shift_ai',
        severity,
        confidence,
        title:     `AI Sector Shifted ${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp`,
        detail:    `${prev.ai_vs_btc.toFixed(1)}% → ${intel.ai_vs_btc.toFixed(1)}% vs BTC`,
        source:    `vs ${prev.report_date}`,
        rationale,
      });
    }
  }

  // ── 5. RWA Sector Shifted ≥ 3pp ──────────────────────────────────────────
  if (prev && intel.rwa_vs_btc != null && prev.rwa_vs_btc != null) {
    const diff    = intel.rwa_vs_btc - prev.rwa_vs_btc;
    const absD    = Math.abs(diff);
    if (absD >= 3) {
      let severity   = absD >= 6 ? 'warning' : 'info';
      let confidence = 'medium';
      let rationale  = `RWA sector delta vs BTC: ${prev.rwa_vs_btc.toFixed(1)}% → ${intel.rwa_vs_btc.toFixed(1)}% (${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp change)`;

      if (absD >= 8) {
        const prevDir  = prev.rwa_vs_btc - (historySnapshots[2]?.rwa_vs_btc ?? prev.rwa_vs_btc);
        const curDir   = intel.rwa_vs_btc - prev.rwa_vs_btc;
        const contradictsTrend = prevDir * curDir < 0;
        const regimeDeteriorating = intel.regime_certainty === 'UNCERTAINTY' && (prev.regime_certainty !== 'UNCERTAINTY');
        if (contradictsTrend || regimeDeteriorating) {
          severity   = 'critical';
          confidence = 'high';
          rationale  = contradictsTrend
            ? `RWA sector reversed direction by ${absD.toFixed(1)}pp (prior trend: ${prevDir > 0 ? 'positive' : 'negative'}, now: ${curDir > 0 ? 'positive' : 'negative'})`
            : `RWA sector shifted ${absD.toFixed(1)}pp while regime certainty deteriorated`;
        }
      }

      if (absD >= 6 && severity !== 'critical') confidence = 'high';

      alerts.push({
        type:      'sector_shift_rwa',
        severity,
        confidence,
        title:     `RWA Sector Shifted ${diff > 0 ? '+' : ''}${diff.toFixed(1)}pp`,
        detail:    `${prev.rwa_vs_btc.toFixed(1)}% → ${intel.rwa_vs_btc.toFixed(1)}% vs BTC`,
        source:    `vs ${prev.report_date}`,
        rationale,
      });
    }
  }

  // ── 6. Analyst View Uncertainty ─────────────────────────────────────────
  // Scored: info=1 keyword, warning=2+ keywords across summary+points
  // No critical from keywords alone
  if (intel.analyst_view) {
    const summaryText = intel.analyst_view.summary || '';
    const bulletText  = (intel.analyst_view.summary_bullets || []).join(' ');
    const pointsText  = (intel.analyst_view.points || []).map(p => p.text || '').join(' ');
    const fullText    = [summaryText, bulletText, pointsText].join(' ').toLowerCase();

    const allMatches = [...fullText.matchAll(UNCERTAIN_TERMS)].map(m => m[0].toLowerCase());
    const uniqueTerms = [...new Set(allMatches)];

    // Count how many summary/bullets vs points
    const inSummary  = [...(summaryText + ' ' + bulletText).toLowerCase().matchAll(UNCERTAIN_TERMS)];
    const inSummaryCount = new Set([...inSummary].map(m => m[0].toLowerCase())).size;
    const inPointsCount  = uniqueTerms.length - Math.min(inSummaryCount, uniqueTerms.length);

    if (uniqueTerms.length > 0) {
      let severity   = uniqueTerms.length >= 2 ? 'warning' : 'info';
      let confidence = uniqueTerms.length >= 2 ? 'high'   : 'medium';
      let rationale  = uniqueTerms.length >= 2
        ? `${uniqueTerms.length} uncertainty keywords found across summary and Analyst View points`
        : `uncertainty keyword "${uniqueTerms[0]}" found in Analyst View`;

      alerts.push({
        type:      'analyst_uncertainty',
        severity,
        confidence,
        title:     'Analyst View — Uncertainty Language',
        detail:    uniqueTerms.length >= 2
          ? `${uniqueTerms.slice(0, 3).join(', ')}${uniqueTerms.length > 3 ? '…' : ''} (${uniqueTerms.length} terms)`
          : `Keyword "${uniqueTerms[0]}" detected — interpret Analyst View with caution`,
        source:    `Week of ${intel.report_date}`,
        rationale,
      });
    }
  }

  return alerts;
}

/**
 * Sort alerts by severity (critical > warning > info), then by confidence (high > medium > low)
 */
function sortAlerts(alerts) {
  const sevOrder  = { critical: 0, warning: 1, info: 2 };
  const confOrder = { high: 0, medium: 1, low: 2 };
  return [...alerts].sort((a, b) =>
    (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3) ||
    (confOrder[a.confidence] ?? 9) - (confOrder[b.confidence] ?? 9)
  );
}

/**
 * Generate a stable content-hash for an alert (type + detail) to detect repeats
 */
function alertSignature(alert) {
  return `${alert.type}::${alert.detail}`;
}

module.exports = { buildAlertSummary, sortAlerts, alertSignature };