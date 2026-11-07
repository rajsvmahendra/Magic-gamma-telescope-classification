import React, { useState, useEffect } from 'react';
import { Radio, Play, RotateCcw, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Info, Swords, Check, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import ShowerVisualizer from '../components/ShowerVisualizer';

const DEFAULT_EVENT = {
  fLength: 31.6036,
  fWidth: 11.7235,
  fSize: 2.5185,
  fConc: 0.5303,
  fConc1: 0.3773,
  fAsym: 26.2722,
  fM3Long: 23.8238,
  fM3Trans: -9.9574,
  fAlpha: 6.3609,
  fDist: 205.261
};

const PRESETS = {
  gamma_sample_01: {
    id: 'gamma_sample_01',
    label: 'Realistic Gamma Event',
    type: 'Gamma Candidate',
    description: 'Compact, collimated shower pointing directly toward the camera origin (low α = 6.4°, width = 11.7mm).',
    features: {
      fLength: 31.6,
      fWidth: 11.7,
      fSize: 2.52,
      fConc: 0.53,
      fConc1: 0.38,
      fAsym: 26.3,
      fM3Long: 23.8,
      fM3Trans: -10.0,
      fAlpha: 6.4,
      fDist: 205.3
    }
  },
  hadron_sample_01: {
    id: 'hadron_sample_01',
    label: 'Realistic Hadron Event',
    type: 'Hadron Candidate',
    description: 'Wide, irregular cosmic-ray cascade pointing far from the origin (high α = 78.5°, width = 38.6mm).',
    features: {
      fLength: 72.4,
      fWidth: 38.6,
      fSize: 3.10,
      fConc: 0.24,
      fConc1: 0.12,
      fAsym: -35.2,
      fM3Long: -48.0,
      fM3Trans: 22.5,
      fAlpha: 78.5,
      fDist: 250.0
    }
  },
  massive_cascade: {
    id: 'massive_cascade',
    label: 'Extreme Event',
    type: 'Extreme Event',
    description: 'High-energy elongated shower sprawling across the camera face (length = 165mm, size = 4.85 log10).',
    features: {
      fLength: 165.0,
      fWidth: 68.0,
      fSize: 4.85,
      fConc: 0.18,
      fConc1: 0.08,
      fAsym: -95.0,
      fM3Long: 120.0,
      fM3Trans: -45.0,
      fAlpha: 62.4,
      fDist: 320.0
    }
  }
};

export default function PredictionLabSection() {
  const [features, setFeatures] = useState(DEFAULT_EVENT);
  const [modelType, setModelType] = useState('random-forest'); // 'random-forest' | 'logistic-regression' | 'model-duel'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [error, setError] = useState(null);
  const [activePreset, setActivePreset] = useState('gamma_sample_01');

  const handleSliderChange = (key, value) => {
    setFeatures(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
    setActivePreset(null);
    setResult(null);
    setDuelResult(null);
  };

  const handleSelectPreset = (presetKey) => {
    const p = PRESETS[presetKey];
    if (p) {
      setFeatures({ ...p.features });
      setActivePreset(presetKey);
      setResult(null);
      setDuelResult(null);
      setError(null);
    }
  };

  const handleClassify = async () => {
    setLoading(true);
    setError(null);

    try {
      if (modelType === 'model-duel') {
        const [rfRes, lrRes] = await Promise.all([
          api.predictRandomForest(features),
          api.predictLogisticRegression(features)
        ]);
        const agree = rfRes.prediction_index === lrRes.prediction_index;
        setDuelResult({
          rf: rfRes,
          lr: lrRes,
          agree,
          predictedClass: agree ? rfRes.prediction : null
        });
        setResult(null);
      } else if (modelType === 'random-forest') {
        const res = await api.predictRandomForest(features);
        setResult(res);
        setDuelResult(null);
      } else {
        const res = await api.predictLogisticRegression(features);
        setResult(res);
        setDuelResult(null);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Inference call failed. Verify PySpark service is running on port 8000.');
      setLoading(false);
    }
  };

  const featureGroups = [
    {
      title: 'Shower Shape & Energy (Hillas Moments)',
      items: [
        { key: 'fLength', name: 'fLength', label: 'Shower Length', unit: 'mm', min: 4, max: 250, step: 0.1 },
        { key: 'fWidth', name: 'fWidth', label: 'Shower Width', unit: 'mm', min: 0, max: 180, step: 0.1 },
        { key: 'fSize', name: 'fSize', label: 'Photon Intensity', unit: 'log10', min: 1.9, max: 5.5, step: 0.01 },
        { key: 'fConc', name: 'fConc', label: 'Core Concentration', unit: 'ratio', min: 0.01, max: 0.9, step: 0.01 },
        { key: 'fConc1', name: 'fConc1', label: 'Peak Pixel Ratio', unit: 'ratio', min: 0.001, max: 0.7, step: 0.005 }
      ]
    },
    {
      title: 'Geometry & Shower Orientation',
      items: [
        { key: 'fAlpha', name: 'fAlpha', label: 'Orientation Angle', unit: 'deg', min: 0, max: 90, step: 0.1 },
        { key: 'fDist', name: 'fDist', label: 'Distance from Origin', unit: 'mm', min: 5, max: 450, step: 0.5 },
        { key: 'fAsym', name: 'fAsym', label: 'Head-to-Tail Skew', unit: 'mm', min: -300, max: 300, step: 0.1 },
        { key: 'fM3Long', name: 'fM3Long', label: 'Longitudinal 3rd', unit: 'mm', min: -250, max: 250, step: 0.1 },
        { key: 'fM3Trans', name: 'fM3Trans', label: 'Transverse 3rd', unit: 'mm', min: -180, max: 180, step: 0.1 }
      ]
    }
  ];

  return (
    <section id="predict" className="obs-band obs-band--white">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Radio size={13} style={{ color: 'var(--color-primary)' }} />
              <span>07 · TEST AN EVENT</span>
            </div>
            <h2 className="obs-title">Want to Test One?</h2>
            <p className="obs-subtitle">
              Change the measurements of an event and let the trained Spark model make the call.
            </p>
          </div>

          {/* Model Selector / Duel Switcher */}
          <div className="segmented-control" style={{ backgroundColor: 'var(--color-surface-warm)' }}>
            <button
              onClick={() => { setModelType('random-forest'); setResult(null); setDuelResult(null); }}
              className={`segmented-control__btn ${modelType === 'random-forest' ? 'active' : ''}`}
            >
              Random Forest
            </button>
            <button
              onClick={() => { setModelType('logistic-regression'); setResult(null); setDuelResult(null); }}
              className={`segmented-control__btn ${modelType === 'logistic-regression' ? 'active' : ''}`}
            >
              Logistic Regression
            </button>
            <button
              onClick={() => { setModelType('model-duel'); setResult(null); setDuelResult(null); }}
              className={`segmented-control__btn ${modelType === 'model-duel' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: modelType === 'model-duel' ? 'var(--color-primary)' : 'var(--color-ink)'
              }}
            >
              <Swords size={12} />
              <span>Model Duel</span>
            </button>
          </div>
        </div>

        {/* Tactile Presets Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
              Experimental Starting Points:
            </span>
            {Object.keys(PRESETS).map((presetKey) => {
              const p = PRESETS[presetKey];
              const isSelected = activePreset === presetKey;
              const isGamma = p.type === 'Gamma Candidate';

              return (
                <button
                  key={presetKey}
                  onClick={() => handleSelectPreset(presetKey)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: isSelected ? 600 : 500,
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-hairline-trans)',
                    backgroundColor: isSelected ? 'var(--color-primary-tint)' : '#FFFFFF',
                    color: isSelected ? 'var(--color-primary-pressed)' : 'var(--color-ink)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isGamma ? '#D97706' : '#2563EB', display: 'inline-block' }} />
                  {p.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setFeatures(DEFAULT_EVENT); setResult(null); setDuelResult(null); setError(null); setActivePreset('gamma_sample_01'); }}
            className="btn-ghost"
            style={{ fontSize: '13px', color: 'var(--color-body-secondary)' }}
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Active Preset Explanation Hint */}
        {activePreset && PRESETS[activePreset] && (
          <div style={{ marginTop: '-20px', fontSize: '13px', color: 'var(--color-body-secondary)', display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '8px' }}>
            <Info size={14} style={{ color: 'var(--color-primary)' }} />
            <span><strong>Loaded {PRESETS[activePreset].type}:</strong> {PRESETS[activePreset].description}</span>
          </div>
        )}

        {/* Two-Column Scientific Layout: Left Controls, Right Preview & Decision */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* LEFT: 10 Parameter Sliders with Grouping & Units */}
          <div className="card-base" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ink)' }}>
                10 Hillas Input Parameters
              </span>
              <span className="chip chip--neutral" style={{ fontFamily: 'var(--font-sans)', fontSize: '11.5px', fontVariantNumeric: 'proportional-nums' }}>
                Mode: {modelType === 'model-duel' ? 'Model Duel (Both)' : modelType === 'random-forest' ? 'Random Forest' : 'Logistic Regression'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {featureGroups.map((group, gIdx) => (
                <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {group.title}
                  </div>

                  {group.items.map((cfg) => (
                    <div key={cfg.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <div>
                          <code style={{ fontWeight: 700, color: 'var(--color-ink)', marginRight: '6px' }}>{cfg.name}</code>
                          <span style={{ color: 'var(--color-body-secondary)' }}>({cfg.label})</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontVariantNumeric: 'proportional-nums', color: 'var(--color-body-secondary)' }}>
                          {Number(features[cfg.key]).toFixed(3)} {cfg.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={cfg.min}
                        max={cfg.max}
                        step={cfg.step}
                        value={features[cfg.key]}
                        onChange={(e) => handleSliderChange(cfg.key, e.target.value)}
                        className="editorial-slider"
                        aria-label={`${cfg.name} slider`}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Execute Spark Inference CTA */}
            <div style={{ borderTop: '1px solid var(--color-hairline-trans)', paddingTop: '16px' }}>
              <button
                onClick={handleClassify}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', minHeight: '44px', fontSize: '15px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Executing Apache Spark Inference...</span>
                  </>
                ) : modelType === 'model-duel' ? (
                  <>
                    <Swords size={16} />
                    <span>Run Model Duel (Compare Both Models) →</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span>Run Prediction with {modelType === 'random-forest' ? 'Random Forest' : 'Logistic Regression'} →</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Visual Event Preview & Real Inference Decision */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Live PMT Camera Projection */}
            <div className="card-warm" style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase' }}>
                    Illustrative Event Projection
                  </span>
                  <div style={{ fontSize: '11px', color: 'var(--color-body-secondary)' }}>
                    These numbers describe the physical shape of the air shower
                  </div>
                </div>
                <span className="chip chip--amber" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontVariantNumeric: 'proportional-nums' }}>
                  α = {Number(features.fAlpha).toFixed(1)}°
                </span>
              </div>

              <ShowerVisualizer
                fLength={features.fLength}
                fWidth={features.fWidth}
                fAlpha={features.fAlpha}
                fDist={features.fDist}
                fAsym={features.fAsym}
                isSignal={result ? result.is_signal : duelResult ? duelResult.rf.is_signal : (features.fAlpha < 25)}
              />

              <div style={{ fontSize: '12px', color: 'var(--color-body-secondary)', textAlign: 'center', margin: 0 }}>
                Adjusting sliders immediately changes the shower geometry (length, width, orientation angle α).
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                style={{
                  padding: '14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#991B1B'
                }}
              >
                <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '2px' }}>Inference Notice:</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                FEATURE 6: MODEL DUEL OUTCOME CARD (Two Models · One Event)
                --------------------------------------------------------------- */}
            {modelType === 'model-duel' && duelResult ? (
              <div
                className="card-base"
                style={{
                  borderTop: duelResult.agree ? '4px solid #059669' : '4px solid #F59E0B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Consensus / Disagreement Header Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Swords size={16} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Two Models. One Event.
                    </span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      backgroundColor: duelResult.agree ? '#D1FAE5' : '#FEF3C7',
                      color: duelResult.agree ? '#065F46' : '#92400E'
                    }}
                  >
                    {duelResult.agree ? (
                      <>
                        <Check size={13} />
                        <span>AGREE</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={13} />
                        <span>DISAGREE</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Consensus Explanation */}
                <div style={{ fontSize: '13.5px', color: 'var(--color-ink)', lineHeight: 1.5 }}>
                  {duelResult.agree ? (
                    <span>
                      Both models independently classify this event as{' '}
                      <strong>{duelResult.rf.is_signal ? 'Gamma (Signal)' : 'Hadron (Background)'}</strong>.
                    </span>
                  ) : (
                    <span>
                      <strong>The two models classify this event differently.</strong> Random Forest predicted{' '}
                      <em>{duelResult.rf.prediction}</em> while Logistic Regression predicted <em>{duelResult.lr.prediction}</em>.
                    </span>
                  )}
                </div>

                {/* Side-by-Side Duel Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  
                  {/* Logistic Regression Result */}
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '8px', border: '1px solid var(--color-hairline-trans)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase' }}>
                      Logistic Regression (Linear)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: duelResult.lr.is_signal ? '#D97706' : '#2563EB', margin: '4px 0' }}>
                      {duelResult.lr.is_signal ? 'Gamma (Signal)' : 'Hadron (Noise)'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-body-secondary)', marginBottom: '8px' }}>
                      Predicted probability: <strong>{(Math.max(duelResult.lr.probability.gamma, duelResult.lr.probability.hadron) * 100).toFixed(1)}%</strong>
                    </div>

                    {/* Probability Distribution Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', fontVariantNumeric: 'proportional-nums' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body-secondary)' }}>
                        <span>γ: {(duelResult.lr.probability.gamma * 100).toFixed(1)}%</span>
                        <span>h: {(duelResult.lr.probability.hadron * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${duelResult.lr.probability.gamma * 100}%`, height: '100%', backgroundColor: '#D97706' }} />
                        <div style={{ width: `${duelResult.lr.probability.hadron * 100}%`, height: '100%', backgroundColor: '#2563EB' }} />
                      </div>
                    </div>
                  </div>

                  {/* Random Forest Result */}
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-primary-tint)', borderRadius: '8px', border: '1.5px solid var(--color-primary)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      Random Forest (100 Trees)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: duelResult.rf.is_signal ? '#D97706' : '#2563EB', margin: '4px 0' }}>
                      {duelResult.rf.is_signal ? 'Gamma (Signal)' : 'Hadron (Noise)'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-body-secondary)', marginBottom: '8px' }}>
                      Predicted probability: <strong>{(Math.max(duelResult.rf.probability.gamma, duelResult.rf.probability.hadron) * 100).toFixed(1)}%</strong>
                    </div>

                    {/* Probability Distribution Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', fontVariantNumeric: 'proportional-nums' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body-secondary)' }}>
                        <span>γ: {(duelResult.rf.probability.gamma * 100).toFixed(1)}%</span>
                        <span>h: {(duelResult.rf.probability.hadron * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: `${duelResult.rf.probability.gamma * 100}%`, height: '100%', backgroundColor: '#D97706' }} />
                        <div style={{ width: `${duelResult.rf.probability.hadron * 100}%`, height: '100%', backgroundColor: '#2563EB' }} />
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', color: 'var(--color-body-secondary)', borderTop: '1px solid var(--color-hairline-trans)', paddingTop: '8px' }}>
                  <span>Engine: Apache Spark 3.5.9 MLlib</span>
                  <span>Evaluated over identical 10 Hillas moments</span>
                </div>
              </div>
            ) : result ? (
              /* Single Model Prediction Outcome Card */
              <div
                className="card-base"
                style={{
                  borderTop: result.is_signal ? '4px solid #D97706' : '4px solid #2563EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-hairline-trans)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-sans)', color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Model: {result.model === 'random_forest' ? 'Random Forest' : 'Logistic Regression'}
                  </span>
                  <span className="chip chip--green" style={{ fontSize: '11px', fontWeight: 600 }}>
                    <CheckCircle2 size={12} style={{ marginRight: '2px' }} />
                    Spark Inference Complete
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-ink)' }}>
                      {result.is_signal ? 'Gamma (Signal)' : 'Hadron (Background)'}
                    </span>
                    <span className={result.is_signal ? 'chip chip--amber' : 'chip chip--blue'} style={{ fontWeight: 600 }}>
                      {result.is_signal ? 'Primary Photon' : 'Cosmic Noise'}
                    </span>
                  </div>

                  <p style={{ fontSize: '14px', color: 'var(--color-ink-85)', lineHeight: 1.5, margin: 0 }}>
                    {result.model === 'random_forest' ? 'Random Forest' : 'Logistic Regression'} classified this event as{' '}
                    <strong>{result.is_signal ? 'Gamma' : 'Hadron'}</strong> with{' '}
                    <strong>{(Math.max(result.probability.gamma, result.probability.hadron) * 100).toFixed(1)}%</strong> predicted probability.
                  </p>
                </div>

                {/* Predicted Probability Breakdown Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-hairline-trans)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', fontWeight: 600 }}>
                    <span style={{ color: '#D97706' }}>Gamma: {(result.probability.gamma * 100).toFixed(1)}%</span>
                    <span style={{ color: '#2563EB' }}>Hadron: {(result.probability.hadron * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${result.probability.gamma * 100}%`, height: '100%', backgroundColor: '#D97706', transition: 'width 0.4s ease' }} />
                    <div style={{ width: `${result.probability.hadron * 100}%`, height: '100%', backgroundColor: '#2563EB', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Section 14: "Illustrative Measurement Breakdown" */}
                <div style={{ padding: '12px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '8px', border: '1px solid var(--color-hairline-trans)', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} style={{ color: 'var(--color-primary)' }} />
                    <span>Illustrative Measurement Breakdown</span>
                  </div>
                  <p style={{ color: 'var(--color-body-secondary)', margin: '0 0 8px 0', lineHeight: 1.45, fontSize: '12px' }}>
                    Physical descriptors associated with this event (explanatory visualization of prominent shower characteristics, not a formal causal feature attribution):
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', fontSize: '11.5px' }}>
                    <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--color-hairline-trans)' }}>
                      <span style={{ color: 'var(--color-body-secondary)', display: 'block' }}>fAlpha (Orientation)</span>
                      <strong style={{ color: Number(features.fAlpha) < 20 ? '#D97706' : '#2563EB' }}>
                        {Number(features.fAlpha).toFixed(1)}°
                      </strong>
                    </div>
                    <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--color-hairline-trans)' }}>
                      <span style={{ color: 'var(--color-body-secondary)', display: 'block' }}>fWidth (Width)</span>
                      <strong style={{ color: 'var(--color-ink)' }}>
                        {Number(features.fWidth).toFixed(1)} mm
                      </strong>
                    </div>
                    <div style={{ padding: '6px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--color-hairline-trans)' }}>
                      <span style={{ color: 'var(--color-body-secondary)', display: 'block' }}>fConc (Density)</span>
                      <strong style={{ color: 'var(--color-ink)' }}>
                        {Number(features.fConc).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', color: 'var(--color-body-secondary)' }}>
                  <span>Engine: Apache Spark 3.5.9 MLlib</span>
                  <span>FastAPI REST Endpoint</span>
                </div>
              </div>
            ) : (
              <div
                className="card-base"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  backgroundColor: 'var(--color-surface-card)'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Awaiting Prediction Execution
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', margin: 0 }}>
                  Adjust parameters on the left or select a calibrated preset, then click <strong>"Run Prediction"</strong> to execute real PySpark inference.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
