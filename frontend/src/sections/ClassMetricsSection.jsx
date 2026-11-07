import React, { useState } from 'react';
import { Target, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ClassMetricsSection() {
  const [selectedClass, setSelectedClass] = useState('ALL'); // 'ALL' | 'GAMMA' | 'HADRON'

  const classData = [
    {
      id: 'GAMMA',
      className: 'Gamma (Signal Photons)',
      tag: 'Class 0.0 · Primary Photons',
      borderAccent: '#D97706',
      badgeBg: '#FEF3C7',
      badgeColor: '#92400E',
      plainRecall: 'Of the real gamma events, 95.08% were detected.',
      description: 'Sensitivity to primary cosmic photons. Maximizing recall ensures faint celestial emitters remain detectable in deep-space observational catalogs.',
      lr: { precision: '79.43%', recall: '90.57%' },
      rf: { precision: '82.81%', recall: '95.08%' },
      deltas: { precision: '+3.38%', recall: '+4.51%' }
    },
    {
      id: 'HADRON',
      className: 'Hadron (Background Noise)',
      tag: 'Class 1.0 · Cosmic Noise',
      borderAccent: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeColor: '#1E40AF',
      plainRecall: 'Of the real hadron events, 64.00% were correctly identified.',
      description: 'Rejection of isotropic charged cosmic-ray cascades. High precision prevents false detections and spurious point-source artifacts in sky maps.',
      lr: { precision: '76.88%', recall: '57.21%' },
      rf: { precision: '87.69%', recall: '64.00%' },
      deltas: { precision: '+10.81%', recall: '+6.79%' }
    }
  ];

  return (
    <section id="class-metrics" className="obs-band obs-band--warm">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Target size={13} style={{ color: 'var(--color-primary)' }} />
              <span>06 · CLASS METRICS</span>
            </div>
            <h2 className="obs-title">Is the Model Equally Good at Both Classes?</h2>
            <p className="obs-subtitle">
              The model is especially good at retaining gamma-ray signal, but it is less successful at identifying every hadron event.
            </p>
          </div>

          {/* Interactive Class Switcher */}
          <div
            style={{
              display: 'inline-flex',
              padding: '3px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid var(--color-hairline-trans)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <button
              onClick={() => setSelectedClass('ALL')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: selectedClass === 'ALL' ? 'var(--color-primary-tint)' : 'transparent',
                color: selectedClass === 'ALL' ? 'var(--color-primary-pressed)' : 'var(--color-body-secondary)'
              }}
            >
              All Classes
            </button>
            <button
              onClick={() => setSelectedClass('GAMMA')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: selectedClass === 'GAMMA' ? '#FEF3C7' : 'transparent',
                color: selectedClass === 'GAMMA' ? '#92400E' : 'var(--color-body-secondary)'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
              Gamma (Signal)
            </button>
            <button
              onClick={() => setSelectedClass('HADRON')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: selectedClass === 'HADRON' ? '#EFF6FF' : 'transparent',
                color: selectedClass === 'HADRON' ? '#1E40AF' : 'var(--color-body-secondary)'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'inline-block' }} />
              Hadron (Noise)
            </button>
          </div>
        </div>

        {/* Dual Class Editorial Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {classData.map((item) => {
            const isDimmed = selectedClass !== 'ALL' && selectedClass !== item.id;
            const isEmphasized = selectedClass === item.id;

            return (
              <div
                key={item.className}
                className="card-base card-lift"
                onClick={() => setSelectedClass(selectedClass === item.id ? 'ALL' : item.id)}
                style={{
                  borderTop: `4px solid ${item.borderAccent}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.35 : 1,
                  boxShadow: isEmphasized ? `0 0 0 2px ${item.borderAccent}` : undefined,
                  transition: 'all 0.25s ease'
                }}
              >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {item.tag}
                  </span>
                  <span className="chip chip--green" style={{ fontSize: '11px', fontWeight: 600 }}>
                    RF Superior
                  </span>
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', margin: '4px 0 8px 0' }}>
                  {item.className}
                </h3>
                
                {/* Plain language recall quote */}
                <div
                  style={{
                    padding: '8px 12px',
                    backgroundColor: item.badgeBg,
                    borderLeft: `3px solid ${item.borderAccent}`,
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: item.badgeColor,
                    marginBottom: '10px'
                  }}
                >
                  "{item.plainRecall}"
                </div>

                <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              {/* Metric Breakdown Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Precision */}
                <div style={{ padding: '14px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '8px', border: '1px solid var(--color-hairline-trans)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-body-secondary)', textTransform: 'uppercase' }}>Class Precision</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>{item.deltas.precision} gain</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                      LR: {item.lr.precision}
                    </span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: item.borderAccent, fontFamily: 'var(--font-mono)' }}>
                      RF: {item.rf.precision}
                    </span>
                  </div>
                </div>

                {/* Recall */}
                <div style={{ padding: '14px', backgroundColor: 'var(--color-surface-warm)', borderRadius: '8px', border: '1px solid var(--color-hairline-trans)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-body-secondary)', textTransform: 'uppercase' }}>Class Recall</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>{item.deltas.recall} gain</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                      LR: {item.lr.recall}
                    </span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: item.borderAccent, fontFamily: 'var(--font-mono)' }}>
                      RF: {item.rf.recall}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Scientific Meaning & F1 Note Panel */}
        <div
          className="card-base"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-hairline-trans)'
          }}
        >
          <AlertCircle size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: 'var(--color-body-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--color-ink)', display: 'block', fontSize: '14px', marginBottom: '2px' }}>
              Scientific Interpretation of Asymmetric Class Behavior:
            </strong>
            The model is exceptionally strong at retaining gamma events (<strong>95.08% Recall</strong>), preserving almost all faint celestial signals. The harder physical problem is correctly retaining and filtering hadron cosmic-ray noise (<strong>64.00% Recall</strong>). Random Forest significantly cuts both confusion dimensions compared with Logistic Regression. Spark's overall weighted F1 score reaches <strong>83.38%</strong> for Random Forest versus <strong>77.89%</strong> for Logistic Regression.
          </div>
        </div>

      </div>
    </section>
  );
}
