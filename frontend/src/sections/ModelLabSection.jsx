import React, { useState, useEffect } from 'react';
import { Cpu, TrendingUp, Layers, CheckCircle2, ArrowRight, BarChart2, Award } from 'lucide-react';
import { api } from '../lib/api';

export default function ModelLabSection() {
  const [metrics, setMetrics] = useState({
    logistic_regression: {
      accuracy: 0.7875,
      precision: 0.7852,
      recall: 0.7875,
      f1_score: 0.7789,
      roc_auc: 0.8388
    },
    random_forest: {
      accuracy: 0.8407,
      precision: 0.8454,
      recall: 0.8407,
      f1_score: 0.8338,
      roc_auc: 0.8869
    }
  });

  const [featureImportances, setFeatureImportances] = useState([
    { rank: 1, feature: 'fAlpha', display_name: 'Orientation Angle', importance: 0.4349, importance_percent: 43.49, unit: 'deg', description: 'Angle between shower major axis and camera center vector.' },
    { rank: 2, feature: 'fLength', display_name: 'Major Axis Length', importance: 0.2297, importance_percent: 22.97, unit: 'mm', description: 'RMS spread of light along the longitudinal development axis.' },
    { rank: 3, feature: 'fWidth', display_name: 'Minor Axis Width', importance: 0.1188, importance_percent: 11.88, unit: 'mm', description: 'RMS spread of light along the lateral shower axis.' },
    { rank: 4, feature: 'fSize', display_name: 'Total Shower Light', importance: 0.0879, importance_percent: 8.79, unit: 'log10 photons', description: 'Logarithm of total number of Cherenkov photons detected.' },
    { rank: 5, feature: 'fM3Long', display_name: '3rd Longitudinal Moment', importance: 0.0636, importance_percent: 6.36, unit: 'mm', description: 'Third root of the third moment along the major axis.' },
    { rank: 6, feature: 'fDist', display_name: 'Distance from Center', importance: 0.0198, importance_percent: 1.98, unit: 'mm', description: 'Distance between shower centroid and the camera center.' },
    { rank: 7, feature: 'fAsym', display_name: 'Longitudinal Skew', importance: 0.0166, importance_percent: 1.66, unit: 'mm', description: 'Distance from highest density center to center of gravity.' },
    { rank: 8, feature: 'fConc', display_name: 'Core Concentration', importance: 0.0145, importance_percent: 1.45, unit: 'ratio', description: 'Fraction of light concentrated in the two brightest PMT pixels.' },
    { rank: 9, feature: 'fConc1', display_name: 'Peak Pixel Ratio', importance: 0.0077, importance_percent: 0.77, unit: 'ratio', description: 'Fraction of total shower light in the single brightest pixel.' },
    { rank: 10, feature: 'fM3Trans', display_name: '3rd Transverse Moment', importance: 0.0065, importance_percent: 0.65, unit: 'mm', description: 'Third root of the third moment along the minor axis.' }
  ]);

  useEffect(() => {
    let isMounted = true;
    api.getModelMetrics()
      .then(res => {
        if (isMounted && res.logistic_regression && res.random_forest) {
          setMetrics(res);
        }
      })
      .catch(() => {});

    api.getFeatureImportance()
      .then(res => {
        if (isMounted && res.features && res.features.length > 0) {
          setFeatureImportances(res.features);
        }
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const lr = metrics.logistic_regression;
  const rf = metrics.random_forest;

  const comparisonRows = [
    {
      metric: 'Accuracy',
      meaning: 'Overall fraction of holdout events correctly classified',
      lr: `${(lr.accuracy * 100).toFixed(2)}%`,
      rf: `${(rf.accuracy * 100).toFixed(2)}%`,
      delta: `+${((rf.accuracy - lr.accuracy) * 100).toFixed(2)}%`,
      relative: '+6.76% rel'
    },
    {
      metric: 'Weighted Precision',
      meaning: 'Purity of classified events across both classes',
      lr: `${(lr.precision * 100).toFixed(2)}%`,
      rf: `${(rf.precision * 100).toFixed(2)}%`,
      delta: `+${((rf.precision - lr.precision) * 100).toFixed(2)}%`,
      relative: '+7.67% rel'
    },
    {
      metric: 'Weighted Recall',
      meaning: 'Retention rate of authentic cosmic events',
      lr: `${(lr.recall * 100).toFixed(2)}%`,
      rf: `${(rf.recall * 100).toFixed(2)}%`,
      delta: `+${((rf.recall - lr.recall) * 100).toFixed(2)}%`,
      relative: '+6.76% rel'
    },
    {
      metric: 'F1 Harmonic Score',
      meaning: 'Harmonic mean balancing precision and recall',
      lr: `${(lr.f1_score * 100).toFixed(2)}%`,
      rf: `${(rf.f1_score * 100).toFixed(2)}%`,
      delta: `+${((rf.f1_score - lr.f1_score) * 100).toFixed(2)}%`,
      relative: '+7.05% rel'
    },
    {
      metric: 'ROC-AUC',
      meaning: 'Ranking separability across all decision thresholds',
      lr: lr.roc_auc.toFixed(4),
      rf: rf.roc_auc.toFixed(4),
      delta: `+${(rf.roc_auc - lr.roc_auc).toFixed(4)}`,
      relative: '+5.73% rel'
    }
  ];

  const chartMetrics = [
    { name: 'Accuracy', lrVal: lr.accuracy * 100, rfVal: rf.accuracy * 100, delta: `+${((rf.accuracy - lr.accuracy) * 100).toFixed(2)}%` },
    { name: 'Precision', lrVal: lr.precision * 100, rfVal: rf.precision * 100, delta: `+${((rf.precision - lr.precision) * 100).toFixed(2)}%` },
    { name: 'Recall', lrVal: lr.recall * 100, rfVal: rf.recall * 100, delta: `+${((rf.recall - lr.recall) * 100).toFixed(2)}%` },
    { name: 'F1-Score', lrVal: lr.f1_score * 100, rfVal: rf.f1_score * 100, delta: `+${((rf.f1_score - lr.f1_score) * 100).toFixed(2)}%` },
    { name: 'ROC-AUC', lrVal: lr.roc_auc * 100, rfVal: rf.roc_auc * 100, delta: `+${((rf.roc_auc - lr.roc_auc) * 100).toFixed(2)} pp` }
  ];

  return (
    <section id="models" className="obs-band obs-band--warm">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Cpu size={13} style={{ color: 'var(--color-primary)' }} />
              <span>04 · THE MODELS</span>
            </div>
            <h2 className="obs-title">Two Models. One Question.</h2>
            <p className="obs-subtitle">
              Which one separates signal from background more reliably? Tested against 3,742 holdout air showers using Apache Spark MLlib.
            </p>
          </div>

          {/* Advantage Chip */}
          <div className="chip chip--amber" style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}>
            <TrendingUp size={14} style={{ marginRight: '4px' }} />
            <span>Better on this holdout set · RF +5.32% Accuracy</span>
          </div>
        </div>

        {/* Human Explanation: Two Models Explained Simply */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Model 1: Logistic Regression */}
          <div className="card-base card-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="chip chip--neutral">Linear Model</span>
              <span style={{ fontSize: '12px', fontFamily: 'var(--font-sans)', color: 'var(--color-muted)', fontVariantNumeric: 'proportional-nums' }}>Spark MLlib</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 6px 0' }}>
              Logistic Regression
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
              Finds a weighted linear boundary between the two classes. Works well for simple proportional separations, but struggles when parameters interact non-linearly.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums' }}>
              <span>Accuracy: <strong>{(lr.accuracy * 100).toFixed(2)}%</strong></span>
              <span>ROC-AUC: <strong>{lr.roc_auc.toFixed(4)}</strong></span>
            </div>
          </div>

          {/* Model 2: Random Forest (Better on this holdout set) */}
          <div className="card-base card-lift" style={{ border: '2px solid var(--color-primary)', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="chip chip--blue">100 Decision Trees</span>
              <span className="chip chip--green" style={{ fontSize: '11px', fontWeight: 600 }}>Better on this holdout set</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 6px 0' }}>
              Random Forest
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.55, margin: '0 0 14px 0' }}>
              Combines 100 decision trees to capture more complex relationships between the measurements. Correctly classifies irregular, branching cascades where a flat linear plane fails.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', color: 'var(--color-primary-pressed)' }}>
              <span>Accuracy: <strong>{(rf.accuracy * 100).toFixed(2)}%</strong> (+5.32%)</span>
              <span>ROC-AUC: <strong>{rf.roc_auc.toFixed(4)}</strong> (+0.0481)</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            FEATURE A: MODEL PERFORMANCE COMPARISON CHART (Restrained Editorial Bar Chart)
            ------------------------------------------------------------------ */}
        <div className="card-base" style={{ backgroundColor: '#FFFFFF', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <BarChart2 size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Model Performance Comparison
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
                Holdout Evaluation Across 5 Key Metrics
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-body-secondary)', margin: '4px 0 0 0' }}>
                Tested on 3,742 holdout events the models never encountered during Spark training.
              </p>
            </div>

            {/* Chart Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#94A3B8', display: 'inline-block' }} />
                <span style={{ color: 'var(--color-body-secondary)' }}>Logistic Regression</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#0075DE', display: 'inline-block' }} />
                <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Random Forest</span>
              </div>
            </div>
          </div>

          {/* Grouped Comparison Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {chartMetrics.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '13.5px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{item.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontVariantNumeric: 'proportional-nums' }}>
                    <span style={{ color: 'var(--color-body-secondary)' }}>LR: {item.lrVal.toFixed(2)}%</span>
                    <span style={{ color: '#0075DE', fontWeight: 700 }}>RF: {item.rfVal.toFixed(2)}%</span>
                    <span style={{ color: '#059669', fontWeight: 600, fontSize: '12px', backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px' }}>
                      {item.delta}
                    </span>
                  </div>
                </div>

                {/* Bars track */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', backgroundColor: 'var(--color-surface-warm)', padding: '6px 8px', borderRadius: '6px' }}>
                  {/* Logistic Regression Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', height: '10px', width: '100%' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.lrVal}%`,
                        backgroundColor: '#94A3B8',
                        borderRadius: '3px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                  {/* Random Forest Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', height: '10px', width: '100%' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.rfVal}%`,
                        backgroundColor: '#0075DE',
                        borderRadius: '3px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Analytical Note Callout */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              backgroundColor: 'var(--color-primary-tint)',
              borderLeft: '3px solid var(--color-primary)',
              borderRadius: '0 6px 6px 0',
              fontSize: '13px',
              lineHeight: 1.5,
              color: 'var(--color-ink)'
            }}
          >
            <strong>Analytical Takeaway:</strong> Random Forest improves ROC-AUC by approximately{' '}
            <strong>{((rf.roc_auc - lr.roc_auc) * 100).toFixed(2)} percentage points</strong> over Logistic Regression ({rf.roc_auc.toFixed(4)} vs {lr.roc_auc.toFixed(4)}), performing better across every reported evaluation metric on this holdout set.
          </div>
        </div>

        {/* Primary Analytical Benchmark Table */}
        <div className="editorial-table-wrap" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-hairline-trans)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                SPARK MLLIB EVALUATION MATRIX
              </span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '2px' }}>
                Holdout Test Set Performance (N = 3,742 Showers)
              </div>
            </div>
            <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-sans)', color: 'var(--color-body-secondary)', fontVariantNumeric: 'proportional-nums' }}>
              Deterministic Partition (seed=42)
            </div>
          </div>

          <table className="editorial-table">
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Metric</th>
                <th style={{ width: '22%' }}>Logistic Regression</th>
                <th style={{ width: '22%' }}>Random Forest</th>
                <th style={{ width: '12%' }}>Difference (Δ)</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Relative Gain</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{row.metric}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-body-secondary)' }}>{row.meaning}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: 'var(--color-body-secondary)', fontVariantNumeric: 'proportional-nums' }}>
                    {row.lr}
                  </td>
                  <td style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', fontWeight: 700, color: '#0075DE', fontVariantNumeric: 'proportional-nums' }}>
                    {row.rf}
                  </td>
                  <td style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)', fontVariantNumeric: 'proportional-nums' }}>
                    {row.delta}
                  </td>
                  <td style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', textAlign: 'right', color: 'var(--color-body-secondary)', fontVariantNumeric: 'proportional-nums' }}>
                    {row.relative}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------------------------------
            FEATURE B: RANDOM FOREST FEATURE IMPORTANCE (Spark Gini Impurity)
            ------------------------------------------------------------------ */}
        <div className="card-base" style={{ backgroundColor: '#FFFFFF', padding: '24px', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Award size={16} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                SPARK ML MODEL INTROSPECTION
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-ink)', margin: 0 }}>
              Feature Importance · What Matters Most to the Model?
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-body-secondary)', margin: '4px 0 0 0' }}>
              Actual Gini impurity importance values extracted directly from the 100 decision trees in the PySpark Random Forest model.
            </p>
          </div>

          {/* Ranked Feature Importance List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {featureImportances.map((item) => {
              // Normalize relative to highest feature (fAlpha ~ 0.4349)
              const maxImp = featureImportances[0]?.importance || 0.45;
              const barWidth = Math.min(100, Math.max(2, (item.importance / maxImp) * 100));

              return (
                <div key={item.feature} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          backgroundColor: item.rank <= 3 ? 'var(--color-primary-tint)' : 'var(--color-surface-warm)',
                          color: item.rank <= 3 ? 'var(--color-primary)' : 'var(--color-muted)',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontVariantNumeric: 'proportional-nums'
                        }}
                      >
                        {String(item.rank).padStart(2, '0')}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-ink)' }}>
                        {item.display_name}
                      </span>
                      <code style={{ fontSize: '12px', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'var(--color-surface-warm)', color: 'var(--color-body-secondary)' }}>
                        {item.feature}
                      </code>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontVariantNumeric: 'proportional-nums' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 700, color: item.rank <= 3 ? '#0075DE' : 'var(--color-ink)' }}>
                        {item.importance_percent.toFixed(2)}%
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-body-secondary)' }}>
                        ({item.importance.toFixed(4)})
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Track */}
                  <div style={{ display: 'flex', alignItems: 'center', height: '10px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${barWidth}%`,
                        backgroundColor: item.rank === 1 ? '#0075DE' : item.rank <= 3 ? '#38BDF8' : '#94A3B8',
                        borderRadius: '3px',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>

                  {/* Micro Description */}
                  <div style={{ fontSize: '12px', color: 'var(--color-body-secondary)', lineHeight: 1.4 }}>
                    {item.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Physical Interpretation Callout */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--color-hairline-trans)',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'var(--color-body-secondary)'
            }}
          >
            <strong style={{ color: 'var(--color-ink)' }}>Why Orientation Angle (fAlpha) Dominates (43.49%):</strong> Primary celestial gamma rays originate from point sources in deep space and point directly back toward the optical camera center (α ≈ 0°–15°). Hadronic cosmic rays arrive randomly from every direction across the atmosphere. Combined with shower length (22.97%) and shower width (11.88%), these top three geometric Hillas parameters account for over 78% of the Random Forest model's total discriminative power.
          </div>
        </div>

        {/* Why Random Forest Prevails: 3 Reasons in Plain English */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
            Why Random Forest Prevails · 3 Physical Reasons
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Reason 01 */}
            <div className="card-base card-lift">
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '4px', fontVariantNumeric: 'proportional-nums' }}>
                01
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '6px' }}>
                Handles Relationships Between Measurements
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.5, margin: 0 }}>
                Orientation angle (<code>fAlpha</code>) and concentration (<code>fConc</code>) do not work independently. A compact shower pointing away from the camera origin is still noise. Decision trees isolate these joint relationships where linear formulas stumble.
              </p>
            </div>

            {/* Reason 02 */}
            <div className="card-base card-lift">
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '4px', fontVariantNumeric: 'proportional-nums' }}>
                02
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '6px' }}>
                Less Sensitive to Extreme Values
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.5, margin: 0 }}>
                Third moments like <code>fAsym</code> and <code>fM3Long</code> have wild outlier ranges (−397 to +348 mm). Decision trees split by threshold conditions rather than weighted sums, preventing extreme outliers from skewing the classification.
              </p>
            </div>

            {/* Reason 03 */}
            <div className="card-base card-lift">
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '4px', fontVariantNumeric: 'proportional-nums' }}>
                03
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '6px' }}>
                Combines 100 Decision Trees
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.5, margin: 0 }}>
                A single tree can overfit. Combining 100 randomized trees averages out individual mistakes, boosting test precision from 78.52% to 84.54% and reducing both missed gammas and false alarms simultaneously.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
