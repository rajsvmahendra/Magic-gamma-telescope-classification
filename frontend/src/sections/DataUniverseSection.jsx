import React, { useState, useMemo } from 'react';
import { Database, Filter, Info, Eye, ArrowRight } from 'lucide-react';
import { useCountUp } from '../lib/useCountUp';

export default function DataUniverseSection() {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'GAMMA' | 'HADRON'
  const [hoveredClass, setHoveredClass] = useState(null); // 'GAMMA' | 'HADRON' | null
  const [hoveredParticle, setHoveredParticle] = useState(null);

  // Animated counters
  const totalCount = useCountUp(19020, 1100);
  const gammaCount = useCountUp(12332, 1100);
  const hadronCount = useCountUp(6688, 1100);

  // Generate 260 representative cosmic air shower nodes with calibrated physics
  const particles = useMemo(() => {
    const list = [];
    const count = 260;
    for (let i = 0; i < count; i++) {
      const isGamma = Math.random() < 0.6484; // Exact dataset ratio (64.84% gamma)
      const alpha = isGamma ? (Math.random() * 20 + 2) : (Math.random() * 75 + 12);
      const length = isGamma ? (22 + Math.random() * 38) : (35 + Math.random() * 95);
      const width = isGamma ? (10 + Math.random() * 20) : (18 + Math.random() * 50);
      const dist = 60 + Math.random() * 260;
      const x = (Math.random() - 0.5) * 88;
      const y = (Math.random() - 0.5) * 76;

      list.push({
        id: `EVT-${(1000 + i).toString()}`,
        isGamma,
        type: isGamma ? 'GAMMA' : 'HADRON',
        alpha: alpha.toFixed(1),
        length: length.toFixed(1),
        width: width.toFixed(1),
        dist: dist.toFixed(1),
        x,
        y,
        size: isGamma ? (5 + Math.random() * 2) : (6 + Math.random() * 4)
      });
    }
    return list;
  }, []);

  const activeFocus = hoveredClass || filter;

  return (
    <section id="explore" className="obs-band obs-band--warm">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Database size={13} style={{ color: 'var(--color-primary)' }} />
              <span>02 · THE DATASET</span>
            </div>
            <h2 className="obs-title">19,020 Telescope Events. Two Possible Answers.</h2>
            <p className="obs-subtitle">
              The models are asked one fundamental question: did this atmospheric light pattern come from a rare gamma-ray photon (signal) or a diffuse cosmic ray (background noise)?
            </p>
          </div>

          {/* Interactive Exploration Segmented Control */}
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
              onClick={() => setFilter('ALL')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: filter === 'ALL' ? 'var(--color-primary-tint)' : 'transparent',
                color: filter === 'ALL' ? 'var(--color-primary-pressed)' : 'var(--color-body-secondary)'
              }}
            >
              All Events (19,020)
            </button>
            <button
              onClick={() => setFilter('GAMMA')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: filter === 'GAMMA' ? '#FEF3C7' : 'transparent',
                color: filter === 'GAMMA' ? '#92400E' : 'var(--color-body-secondary)'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#D97706', display: 'inline-block' }} />
              See Gamma events (12,332)
            </button>
            <button
              onClick={() => setFilter('HADRON')}
              className="btn-ghost"
              style={{
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                backgroundColor: filter === 'HADRON' ? '#EFF6FF' : 'transparent',
                color: filter === 'HADRON' ? '#1E40AF' : 'var(--color-body-secondary)'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'inline-block' }} />
              See Hadron events (6,688)
            </button>
          </div>
        </div>

        {/* Three Data Summary Metric Cards with Synchronized Hover & Counts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {/* Card 1: Total Observations */}
          <div
            className="card-base card-lift"
            onClick={() => setFilter('ALL')}
            style={{
              cursor: 'pointer',
              border: filter === 'ALL' ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline-trans)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Telescope Events
              </span>
              <span className="chip chip--neutral" style={{ fontFamily: 'var(--font-mono)' }}>N = 19,020</span>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-1px', margin: '8px 0 4px 0' }}>
              {totalCount}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', margin: 0 }}>
              10 physical measurements extracted per Cherenkov shower. Click to view all events.
            </p>
          </div>

          {/* Card 2: Gamma Photons */}
          <div
            className="card-base card-lift"
            onMouseEnter={() => setHoveredClass('GAMMA')}
            onMouseLeave={() => setHoveredClass(null)}
            onClick={() => setFilter(filter === 'GAMMA' ? 'ALL' : 'GAMMA')}
            style={{
              borderTop: '3px solid #D97706',
              cursor: 'pointer',
              border: filter === 'GAMMA' ? '2px solid #D97706' : '1px solid var(--color-hairline-trans)',
              backgroundColor: activeFocus === 'GAMMA' ? '#FFFDF8' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Gamma Photons (Signal)
              </span>
              <span className="chip chip--amber" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>64.84%</span>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-1px', margin: '8px 0 4px 0' }}>
              {gammaCount}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', margin: 0 }}>
              Primary gamma rays from celestial point sources. Produce compact, narrow showers pointing toward the telescope origin.
            </p>
          </div>

          {/* Card 3: Hadron Cascades */}
          <div
            className="card-base card-lift"
            onMouseEnter={() => setHoveredClass('HADRON')}
            onMouseLeave={() => setHoveredClass(null)}
            onClick={() => setFilter(filter === 'HADRON' ? 'ALL' : 'HADRON')}
            style={{
              borderTop: '3px solid #2563EB',
              cursor: 'pointer',
              border: filter === 'HADRON' ? '2px solid #2563EB' : '1px solid var(--color-hairline-trans)',
              backgroundColor: activeFocus === 'HADRON' ? '#F8FBFF' : '#FFFFFF'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Hadron Cascades (Noise)
              </span>
              <span className="chip chip--blue" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>35.16%</span>
            </div>
            <div style={{ fontSize: '42px', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-1px', margin: '8px 0 4px 0' }}>
              {hadronCount}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', margin: 0 }}>
              Cosmic-ray nuclei and protons. Isotropic, diffuse, fragmented atmospheric cascades creating dominant background noise.
            </p>
          </div>
        </div>

        {/* Framed Interactive Particle Field Panel */}
        <div className="visualization-frame" style={{ height: '460px', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div className="visualization-frame__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0075DE' }} />
              <span style={{ color: '#F8FAFC', fontWeight: 600 }}>APERTURE FOCAL PLANE · 260 SAMPLED EVENTS</span>
              <span style={{ opacity: 0.6 }}>|</span>
              <span>FOV ±1.75°</span>
            </div>
            <div>
              <span>FOCUS: <strong style={{ color: '#38BDF8' }}>{activeFocus}</strong></span>
              <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>
              <span>HOVER NODE TO INSPECT MEASUREMENTS</span>
            </div>
          </div>

          {/* Canvas Area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Background Reticle Grid */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.12,
                backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
                backgroundSize: '32px 32px'
              }}
            />

            {/* Central Target Circle */}
            <div
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
                position: 'absolute',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'absolute',
                pointerEvents: 'none'
              }}
            />

            {/* Particle Nodes */}
            {particles.map((p) => {
              const isMatch = activeFocus === 'ALL' || (activeFocus === 'GAMMA' && p.isGamma) || (activeFocus === 'HADRON' && !p.isGamma);
              const opacity = isMatch ? 0.92 : 0.06;
              const scale = isMatch ? 1 : 0.35;
              const color = p.isGamma ? '#FFB110' : '#38BDF8';

              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoveredParticle(p)}
                  onMouseLeave={() => setHoveredParticle(null)}
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    transform: `translate(${p.x * 5.8}px, ${p.y * 2.8}px) scale(${scale})`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: color,
                    opacity: opacity,
                    boxShadow: isMatch ? `0 0 8px ${color}` : 'none',
                    transition: 'opacity 0.25s ease, transform 0.25s ease'
                  }}
                />
              );
            })}

            {/* Hovered Particle Card Overlay */}
            {hoveredParticle && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  zIndex: 20,
                  minWidth: '220px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
                  <span style={{ color: '#94A3B8' }}>{hoveredParticle.id}</span>
                  <span style={{ fontWeight: 600, color: hoveredParticle.isGamma ? '#FFB110' : '#38BDF8' }}>
                    {hoveredParticle.type}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: '#CBD5E1' }}>
                  <div>Alpha: <strong style={{ color: '#FFFFFF' }}>{hoveredParticle.alpha}°</strong></div>
                  <div>Dist: <strong style={{ color: '#FFFFFF' }}>{hoveredParticle.dist}mm</strong></div>
                  <div>Length: <strong style={{ color: '#FFFFFF' }}>{hoveredParticle.length}mm</strong></div>
                  <div>Width: <strong style={{ color: '#FFFFFF' }}>{hoveredParticle.width}mm</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Caption */}
          <div className="visualization-frame__footer">
            <div>
              <span style={{ color: '#94A3B8' }}>What am I looking at? </span>
              <span style={{ color: '#F1F5F9' }}>
                Sampled shower arrivals on the 3.5° camera focal plane. Gammas arrive compact & collimated; hadrons scatter diffusely.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                onClick={() => setFilter(filter === 'GAMMA' ? 'ALL' : 'GAMMA')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#FFB110', cursor: 'pointer' }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFB110' }} />
                Gamma Photons (Signal)
              </span>
              <span
                onClick={() => setFilter(filter === 'HADRON' ? 'ALL' : 'HADRON')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#38BDF8', cursor: 'pointer' }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38BDF8' }} />
                Hadron Cascades (Noise)
              </span>
            </div>
          </div>
        </div>

        {/* Class Distribution Bar: Interactive & Hoverable */}
        <div className="card-base" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Class Distribution & Majority-Class Baseline
              </span>
              <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', margin: '4px 0 0 0' }}>
                A model that always predicts the majority class would already be correct about 64.84% of the time. So accuracy alone is not enough.
              </p>
            </div>
            <div className="chip chip--neutral" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              Test Holdout: 3,742 Events (seed=42)
            </div>
          </div>

          {/* Proportional Split Bar */}
          <div
            style={{
              width: '100%',
              height: '14px',
              backgroundColor: '#E2E8F0',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
              margin: '14px 0',
              cursor: 'pointer'
            }}
          >
            <div
              onMouseEnter={() => setHoveredClass('GAMMA')}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => setFilter(filter === 'GAMMA' ? 'ALL' : 'GAMMA')}
              style={{
                width: '64.84%',
                height: '100%',
                backgroundColor: '#D97706',
                opacity: activeFocus === 'HADRON' ? 0.35 : 1,
                transition: 'opacity 0.2s ease'
              }}
              title="Gamma Photons: 64.84% (12,332 events) - Click to filter"
            />
            <div
              onMouseEnter={() => setHoveredClass('HADRON')}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => setFilter(filter === 'HADRON' ? 'ALL' : 'HADRON')}
              style={{
                width: '35.16%',
                height: '100%',
                backgroundColor: '#2563EB',
                opacity: activeFocus === 'GAMMA' ? 0.35 : 1,
                transition: 'opacity 0.2s ease'
              }}
              title="Hadron Cascades: 35.16% (6,688 events) - Click to filter"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            <div
              onMouseEnter={() => setHoveredClass('GAMMA')}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => setFilter(filter === 'GAMMA' ? 'ALL' : 'GAMMA')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 600, cursor: 'pointer' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D97706' }} />
              <span>Gamma Signal: 64.84% (12,332 events)</span>
            </div>

            <div style={{ color: 'var(--color-body-secondary)', fontSize: '12px' }}>
              <strong>Naive baseline accuracy: 64.84%</strong>
            </div>

            <div
              onMouseEnter={() => setHoveredClass('HADRON')}
              onMouseLeave={() => setHoveredClass(null)}
              onClick={() => setFilter(filter === 'HADRON' ? 'ALL' : 'HADRON')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1D4ED8', fontWeight: 600, cursor: 'pointer' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563EB' }} />
              <span>Hadron Noise: 35.16% (6,688 events)</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
