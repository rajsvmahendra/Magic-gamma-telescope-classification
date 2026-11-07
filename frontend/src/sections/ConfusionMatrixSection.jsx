import React, { useState, useEffect } from 'react';
import { Grid, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { api } from '../lib/api';

export default function ConfusionMatrixSection() {
  const [selectedModel, setSelectedModel] = useState('random_forest');
  const [cmData, setCmData] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  const fallbackMatrices = {
    random_forest: {
      true_gamma_pred_gamma: 2298,
      true_gamma_pred_hadron: 119,
      true_hadron_pred_gamma: 477,
      true_hadron_pred_hadron: 848
    },
    logistic_regression: {
      true_gamma_pred_gamma: 2189,
      true_gamma_pred_hadron: 228,
      true_hadron_pred_gamma: 567,
      true_hadron_pred_hadron: 758
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.getConfusionMatrix(selectedModel)
      .then(res => {
        if (isMounted && res.matrix) setCmData(res.matrix);
      })
      .catch(() => {
        if (isMounted) setCmData(fallbackMatrices[selectedModel]);
      });
    return () => { isMounted = false; };
  }, [selectedModel]);

  const current = cmData || fallbackMatrices[selectedModel];
  const isRF = selectedModel === 'random_forest';

  const cellDetails = {
    TP: {
      key: 'TP',
      title: 'Correct Gamma',
      count: current.true_gamma_pred_gamma,
      badge: isRF ? '95.08% Gamma Recall' : '90.57% Gamma Recall',
      whatHappened: 'The model correctly identified real celestial gamma-ray signal.',
      scientificConsequence: 'The model successfully detected 2,298 out of 2,417 gamma events in the holdout set (95.08% recall).'
    },
    FN: {
      key: 'FN',
      title: 'Missed Gamma',
      count: current.true_gamma_pred_hadron,
      badge: isRF ? '119 Missed (-47.8% vs LR)' : '228 Missed Photons',
      whatHappened: 'The model missed 119 real gamma events.',
      scientificConsequence: 'Real celestial gamma photons discarded by mistake. Random Forest cuts this loss down from 228 (Logistic Regression) to 119.'
    },
    FP: {
      key: 'FP',
      title: 'False Alarm',
      count: current.true_hadron_pred_gamma,
      badge: isRF ? '477 Alarms (-90 vs LR)' : '567 False Alarms',
      whatHappened: 'The model mistook 477 hadronic events for gamma events.',
      scientificConsequence: 'Background cosmic-ray noise mistaken for signal. Random Forest reduces false alarms from 567 down to 477.'
    },
    TN: {
      key: 'TN',
      title: 'Correct Hadron',
      count: current.true_hadron_pred_hadron,
      badge: isRF ? '64.00% Hadron Recall' : '57.21% Hadron Recall',
      whatHappened: 'The model correctly identified and filtered out cosmic background noise.',
      scientificConsequence: 'Noise successfully identified and filtered out (848 out of 1,325 hadron events, 64.00% recall).'
    }
  };

  const selectedExplanation = activeCell ? cellDetails[activeCell] : null;

  return (
    <section id="matrix" className="obs-band obs-band--white">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Grid size={13} style={{ color: 'var(--color-primary)' }} />
              <span>05 · THE ERRORS</span>
            </div>
            <h2 className="obs-title">Where Does the Model Make Mistakes?</h2>
            <p className="obs-subtitle">
              Every prediction ends one of four ways. Accuracy tells me how often the model is right. The confusion matrix tells me <em>how</em> it is wrong: <strong>Correct Gamma</strong>, <strong>Missed Gamma</strong>, <strong>False Alarm</strong>, or <strong>Correct Hadron</strong>.
            </p>
          </div>

          {/* Model Switcher Tabs */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              backgroundColor: 'var(--color-surface-warm)',
              borderRadius: '8px',
              border: '1px solid var(--color-hairline-trans)'
            }}
          >
            <button
              onClick={() => { setSelectedModel('random_forest'); setCmData(null); }}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: isRF ? 'var(--color-primary-tint)' : 'transparent',
                color: isRF ? 'var(--color-primary-pressed)' : 'var(--color-body-secondary)'
              }}
            >
              Random Forest (Ensemble)
            </button>
            <button
              onClick={() => { setSelectedModel('logistic_regression'); setCmData(null); }}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: !isRF ? 'var(--color-primary-tint)' : 'transparent',
                color: !isRF ? 'var(--color-primary-pressed)' : 'var(--color-body-secondary)'
              }}
            >
              Logistic Regression
            </button>
          </div>
        </div>

        {/* 2x2 Matrix & Real Scientific Consequences Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* LEFT: 2x2 Matrix Grid */}
          <div className="card-base" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Holdout Evaluation (N = 3,742 Showers)
              </span>
              <span className="chip chip--neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                {isRF ? 'Model: Random Forest' : 'Model: Logistic Regression'}
              </span>
            </div>

            {/* Matrix Table Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 1fr',
                gap: '8px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {/* Corner */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--color-muted)' }}>
                ACTUAL \ PRED
              </div>
              <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                Pred Gamma (Signal)
              </div>
              <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                Pred Hadron (Noise)
              </div>

              {/* Row 1: Actual Gamma */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309' }}>Actual Gamma</span>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>2,417 events</span>
              </div>

              {/* Cell TP: Correct Gamma -> TRUE GAMMA */}
              <div
                onMouseEnter={() => setActiveCell('TP')}
                onMouseLeave={() => setActiveCell(null)}
                onClick={() => setActiveCell(activeCell === 'TP' ? null : 'TP')}
                style={{
                  padding: '16px',
                  backgroundColor: activeCell === 'TP' ? '#FEF3C7' : '#FFFBEB',
                  border: activeCell === 'TP' ? '2px solid #D97706' : '1px solid #FDE68A',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#B45309', fontWeight: 600 }}>
                  <span>TRUE GAMMA</span>
                  <CheckCircle2 size={14} style={{ color: '#D97706' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-ink)', margin: '6px 0 2px 0' }}>
                  {current.true_gamma_pred_gamma.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                  {isRF ? '95.08% Gamma Recall' : '90.57% Gamma Recall'}
                </div>
              </div>

              {/* Cell FN: Missed Gamma */}
              <div
                onMouseEnter={() => setActiveCell('FN')}
                onMouseLeave={() => setActiveCell(null)}
                onClick={() => setActiveCell(activeCell === 'FN' ? null : 'FN')}
                style={{
                  padding: '16px',
                  backgroundColor: activeCell === 'FN' ? '#FEE2E2' : '#FEF2F2',
                  border: activeCell === 'FN' ? '2px solid #DC2626' : '1px solid #FECACA',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                  <span>MISSED GAMMA</span>
                  <XCircle size={14} style={{ color: '#DC2626' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#DC2626', margin: '6px 0 2px 0' }}>
                  {current.true_gamma_pred_hadron.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#B91C1C' }}>
                  {isRF ? '119 Missed (-47.8% vs LR)' : '228 Missed Photons'}
                </div>
              </div>

              {/* Row 2: Actual Hadron */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>Actual Hadron</span>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>1,325 events</span>
              </div>

              {/* Cell FP: False Alarm */}
              <div
                onMouseEnter={() => setActiveCell('FP')}
                onMouseLeave={() => setActiveCell(null)}
                onClick={() => setActiveCell(activeCell === 'FP' ? null : 'FP')}
                style={{
                  padding: '16px',
                  backgroundColor: activeCell === 'FP' ? '#FFEDD5' : '#FFF7ED',
                  border: activeCell === 'FP' ? '2px solid #EA580C' : '1px solid #FED7AA',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#EA580C', fontWeight: 600 }}>
                  <span>FALSE ALARM</span>
                  <AlertTriangle size={14} style={{ color: '#EA580C' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#C2410C', margin: '6px 0 2px 0' }}>
                  {current.true_hadron_pred_gamma.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#C2410C' }}>
                  {isRF ? '477 Alarms (-90 vs LR)' : '567 False Alarms'}
                </div>
              </div>

              {/* Cell TN: Correct Hadron -> TRUE HADRON */}
              <div
                onMouseEnter={() => setActiveCell('TN')}
                onMouseLeave={() => setActiveCell(null)}
                onClick={() => setActiveCell(activeCell === 'TN' ? null : 'TN')}
                style={{
                  padding: '16px',
                  backgroundColor: activeCell === 'TN' ? '#DBEAFE' : '#EFF6FF',
                  border: activeCell === 'TN' ? '2px solid #2563EB' : '1px solid #BFDBFE',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#1D4ED8', fontWeight: 600 }}>
                  <span>TRUE HADRON</span>
                  <CheckCircle2 size={14} style={{ color: '#2563EB' }} />
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-ink)', margin: '6px 0 2px 0' }}>
                  {current.true_hadron_pred_hadron.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: 600 }}>
                  {isRF ? '64.00% Hadron Recall' : '57.21% Hadron Recall'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-hairline-trans)', fontSize: '12px', color: 'var(--color-body-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Click or hover any quadrant to see what it means</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>Holdout: 2,417 Gamma / 1,325 Hadron</span>
            </div>
          </div>

          {/* RIGHT: Consequence Lens */}
          <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span className="chip chip--blue" style={{ marginBottom: '8px' }}>
                Scientific Consequence
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', margin: '4px 0 6px 0' }}>
                {selectedExplanation ? selectedExplanation.title : 'Why Do These Errors Matter?'}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.55, margin: 0 }}>
                {selectedExplanation ? (
                  <>
                    <strong style={{ display: 'block', color: 'var(--color-ink)', marginBottom: '4px' }}>
                      {selectedExplanation.whatHappened}
                    </strong>
                    {selectedExplanation.scientificConsequence}
                  </>
                ) : (
                  'In gamma-ray astronomy, mistakes carry direct scientific costs: false negatives discard irreplaceable deep-space photons, while false alarms create phantom celestial sources that waste telescope observation hours.'
                )}
              </p>
            </div>

            {/* Error Dimension Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                onClick={() => setActiveCell('FN')}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: activeCell === 'FN' ? '2px solid #DC2626' : '1px solid #FECACA',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#DC2626', marginBottom: '4px' }}>
                  <XCircle size={15} />
                  <span>{isRF ? '119 Missed Photons' : '228 Missed Photons'} (False Negatives)</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-body-secondary)', margin: 0 }}>
                  Real gamma rays mistaken for noise. Random Forest reduces lost gamma signals by 47.8% compared to Logistic Regression (from 228 down to 119).
                </p>
              </div>

              <div
                onClick={() => setActiveCell('FP')}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: activeCell === 'FP' ? '2px solid #EA580C' : '1px solid #FED7AA',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#EA580C', marginBottom: '4px' }}>
                  <AlertTriangle size={15} />
                  <span>{isRF ? '477 False Alarms' : '567 False Alarms'} (False Positives)</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-body-secondary)', margin: 0 }}>
                  Hadronic noise mimicking gamma showers. Random Forest eliminates 90 false alarms (from 567 down to 477), preventing skymap contamination.
                </p>
              </div>
            </div>

            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-body-secondary)', borderTop: '1px solid var(--color-hairline-trans)', paddingTop: '10px' }}>
              Random Forest cuts both error types at the same time.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
