import React, { useState, useEffect } from 'react';
import { Target, Check, BarChart2, BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function HillasAnatomySection() {
  const [activeParam, setActiveParam] = useState('fAlpha');
  const [hoveredParam, setHoveredParam] = useState(null);
  const [viewMode, setViewMode] = useState('gamma'); // 'gamma' | 'hadron'
  const [detailTab, setDetailTab] = useState('anatomy'); // 'anatomy' | 'distribution'
  const [distributions, setDistributions] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getFeatureDistributions()
      .then(res => {
        if (isMounted && res) {
          setDistributions(res);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const features = {
    fAlpha: {
      name: 'fAlpha',
      humanTitle: 'Orientation Angle',
      unit: 'degrees [0° – 90°]',
      role: 'Core Discriminant',
      plainDesc: 'How the shower is oriented relative to the camera center.',
      summary: 'Angle between the ellipse major axis and the radial vector from the camera optical center to the shower centroid.',
      whyModelCares: 'Gamma rays come from celestial point sources and point directly back toward the optical center (α ≈ 0°–15°). Hadronic cosmic rays arrive isotropically from random directions (α up to 90°).',
      whyDifficult: 'Diffuse hadron cascades that happen to be geometrically aligned with the camera origin mimic low orientation angles (α < 15°), generating false alarms that require other parameters to reject.',
      stat: 'Mean: 27.65° | Min: 0.0° | Max: 90.0°'
    },
    fLength: {
      name: 'fLength',
      humanTitle: 'Shower Length',
      unit: 'millimeters (mm)',
      role: 'Shower Elongation',
      plainDesc: 'How elongated the detected light pattern is.',
      summary: 'RMS spread of Cherenkov light along the longitudinal development axis in the atmosphere.',
      whyModelCares: 'Electromagnetic cascades develop compactly in the stratosphere (mean ~53mm). Hadronic nuclear cascades are prolonged and irregular due to penetrating muons.',
      whyDifficult: 'Substantial overlap occurs between 30mm and 60mm where compact hadronic showers look nearly identical in length to moderate-energy gamma cascades.',
      stat: 'Mean: 53.25mm | Range: 4.2 – 334.2mm'
    },
    fWidth: {
      name: 'fWidth',
      humanTitle: 'Shower Width',
      unit: 'millimeters (mm)',
      role: 'Lateral Spread',
      plainDesc: 'How spread out the light pattern appears.',
      summary: 'RMS spread of Cherenkov light perpendicular to the longitudinal shower axis.',
      whyModelCares: 'Multiple scattering of electrons is small, producing thin ellipses. Hadron collisions transfer large transverse momentum, producing wide, scattered cascades.',
      whyDifficult: 'High-energy hadrons with deeply penetrating single-pion cascades can produce deceptively narrow showers that fool simple width cutoffs.',
      stat: 'Mean: 22.18mm | Range: 0.0 – 256.4mm'
    },
    fDist: {
      name: 'fDist',
      humanTitle: 'Distance from Origin',
      unit: 'millimeters (mm)',
      role: 'Impact Geometry',
      plainDesc: 'Distance from optical center to the shower center.',
      summary: 'Distance from the camera optical center to the air shower image centroid.',
      whyModelCares: 'Indicates the impact parameter and where the shower core intersects the telescope field of view.',
      whyDifficult: 'Showers hitting the edge of the camera (high fDist) suffer from image truncation, making both gamma and hadron shapes distorted and harder to reconstruct.',
      stat: 'Mean: 193.82mm | Range: 1.3 – 500.0mm'
    },
    fSize: {
      name: 'fSize',
      humanTitle: 'Total Light (Energy)',
      unit: 'log10 (photons)',
      role: 'Primary Energy',
      plainDesc: 'Total light collected, proportional to energy.',
      summary: 'Total integrated Cherenkov light collected by all 1,039 PMT camera pixels.',
      whyModelCares: 'Directly proportional to the primary cosmic particle energy (E ≥ 50 GeV).',
      whyDifficult: 'Both gammas and hadrons span identical total energy ranges (1.9 to 5.3 log10), so size alone carries virtually zero class separation power without shape context.',
      stat: 'Mean: 2.83 | Range: 1.94 – 5.31'
    },
    fConc: {
      name: 'fConc',
      humanTitle: 'Core Concentration',
      unit: 'ratio [0 – 1]',
      role: 'Core Density',
      plainDesc: 'Fraction of light in the 2 brightest pixels.',
      summary: 'Fraction of total Cherenkov light concentrated in the two brightest PMT pixels.',
      whyModelCares: 'Pure electromagnetic showers possess a dense single core; hadronic showers exhibit fragmented multi-cores.',
      whyDifficult: 'Dim showers near the telescope trigger threshold contain few illuminated pixels total, artificially inflating the concentration ratio even for noisy hadrons.',
      stat: 'Mean: 0.38 | Range: 0.01 – 0.89'
    },
    fConc1: {
      name: 'fConc1',
      humanTitle: 'Peak Pixel Ratio',
      unit: 'ratio [0 – 1]',
      role: 'Peak Intensity',
      plainDesc: 'Fraction of light in the single brightest pixel.',
      summary: 'Fraction of total light collected in the single brightest photomultiplier pixel.',
      whyModelCares: 'Captures the maximum energy deposition density at the atmospheric shower core.',
      whyDifficult: 'Direct muon hits on camera PMT glass create bright single-pixel spikes that simulate the peak intensity of a real electromagnetic shower core.',
      stat: 'Mean: 0.21 | Range: 0.00 – 0.68'
    },
    fAsym: {
      name: 'fAsym',
      humanTitle: 'Head-to-Tail Skew',
      unit: 'millimeters (mm)',
      role: 'Asymmetry',
      plainDesc: 'Displacement of brightest pixel along major axis.',
      summary: 'Displacement of the highest-intensity pixel from the shower center along the major axis.',
      whyModelCares: 'Reveals the direction of shower growth as the cascade plunges downward through atmospheric layers.',
      whyDifficult: 'Atmospheric density fluctuations cause symmetric showers to develop irregular sub-clumps, causing wide variance (−457mm to +575mm) that can deceive linear models.',
      stat: 'Mean: -4.32mm | Range: -397.9 – 348.3mm'
    },
    fM3Long: {
      name: 'fM3Long',
      humanTitle: 'Longitudinal 3rd Moment',
      unit: 'millimeters (mm)',
      role: 'Axial Asymmetry',
      plainDesc: 'Measures how early or late the shower peaks.',
      summary: 'Third root of the 3rd longitudinal moment along the principal shower axis.',
      whyModelCares: 'Distinguishes early-developing electromagnetic cascades from late-peaking hadronic showers.',
      whyDifficult: 'Shower development depth depends strongly on arrival zenith angle, shifting the longitudinal peak independent of particle type.',
      stat: 'Mean: 10.58mm | Range: -331.7 – 344.8mm'
    },
    fM3Trans: {
      name: 'fM3Trans',
      humanTitle: 'Transverse 3rd Moment',
      unit: 'millimeters (mm)',
      role: 'Lateral Asymmetry',
      plainDesc: 'Detects irregular sideways sub-cascades.',
      summary: 'Third root of the 3rd transverse moment across the shower width.',
      whyModelCares: 'Near zero for symmetric gamma showers; erratic for branching hadronic sub-cascades.',
      whyDifficult: 'Low-energy hadron cascades often lack sufficient energy to generate wide lateral sub-clusters, remaining misleadingly symmetric.',
      stat: 'Mean: 0.25mm | Range: -205.8 – 165.3mm'
    }
  };

  const currentKey = hoveredParam || activeParam;
  const curr = features[currentKey];
  const isG = viewMode === 'gamma';

  // Ellipse parameters
  const rx = isG ? 56 : 82;
  const ry = isG ? 20 : 46;
  const rot = isG ? 12 : 72;
  const strokeColor = isG ? '#D97706' : '#2563EB';

  const distData = distributions?.[currentKey];

  return (
    <section id="signal" className="obs-band">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div className="obs-section-header" style={{ marginBottom: 0 }}>
            <div className="obs-eyebrow">
              <Target size={13} style={{ color: 'var(--color-primary)' }} />
              <span>03 · THE SIGNAL</span>
            </div>
            <h2 className="obs-title">So What Does One Telescope Event Look Like?</h2>
            <p className="obs-subtitle">
              The telescope doesn't hand the model a photograph. It reduces the light pattern to 10 numerical measurements called Hillas parameters. Those measurements become the model's input.
            </p>
          </div>

          {/* Collimated vs Diffuse Toggle */}
          <div className="segmented-control" style={{ backgroundColor: 'var(--color-surface-warm)' }}>
            <button
              onClick={() => setViewMode('gamma')}
              className={`segmented-control__btn ${isG ? 'active' : ''}`}
              style={{
                color: isG ? 'var(--color-gamma)' : 'var(--color-body-secondary)',
                fontWeight: isG ? 600 : 500
              }}
            >
              ● Gamma (Collimated Signal)
            </button>
            <button
              onClick={() => setViewMode('hadron')}
              className={`segmented-control__btn ${!isG ? 'active' : ''}`}
              style={{
                color: !isG ? 'var(--color-hadron)' : 'var(--color-body-secondary)',
                fontWeight: !isG ? 600 : 500
              }}
            >
              ● Hadron (Diffuse Noise)
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Focal Plane Diagram, Right Parameter Exploration */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}
        >
          {/* LEFT: 2D Focal Plane Projection SVG */}
          <div className="visualization-frame" style={{ width: '100%', height: 'auto', minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
            <div className="visualization-frame__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isG ? '#D97706' : '#2563EB' }} />
                <span>{isG ? 'GAMMA-RAY CASCADE (SIGNAL)' : 'HADRONIC CASCADE (NOISE)'}</span>
              </div>
              <span style={{ color: 'var(--color-primary)' }}>
                HIGHLIGHTED: {curr.name} ({curr.humanTitle})
              </span>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <svg width="100%" height="360" viewBox="0 0 360 360" style={{ maxWidth: '400px' }}>
                {/* PMT Pixel Grid & Rings */}
                <circle cx="180" cy="180" r="160" fill="none" stroke="#1E293B" strokeWidth="1.5" />
                <circle cx="180" cy="180" r="120" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="180" cy="180" r="80" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="180" cy="180" r="40" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Optical Center Crosshairs */}
                <line x1="180" y1="20" x2="180" y2="340" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="2 4" />
                <line x1="20" y1="180" x2="340" y2="180" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="2 4" />

                {/* Camera Center Marker */}
                <circle cx="180" cy="180" r="3.5" fill="#FFFFFF" />
                <text x="188" y="176" fill="#94A3B8" fontSize="9" fontFamily="var(--font-sans)">CAMERA ORIGIN (0,0)</text>

                {/* Distance vector (fDist) */}
                <line
                  x1="180"
                  y1="180"
                  x2={isG ? '205' : '235'}
                  y2={isG ? '140' : '110'}
                  stroke="#64748B"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* Reconstructed Shower Ellipse (Hillas Moments) */}
                <g transform={`translate(${isG ? 205 : 235}, ${isG ? 140 : 110}) rotate(${rot})`}>
                  {/* Hadron satellite clusters */}
                  {!isG && (
                    <>
                      <ellipse cx="-40" cy="30" rx="22" ry="14" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 2" />
                      <ellipse cx="38" cy="-28" rx="18" ry="12" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 2" />
                    </>
                  )}

                  {/* Core Hillas ellipse */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={rx}
                    ry={ry}
                    fill={strokeColor}
                    fillOpacity={isG ? 0.22 : 0.16}
                    stroke={strokeColor}
                    strokeWidth={currentKey === 'fLength' || currentKey === 'fWidth' ? '3' : '2'}
                  />

                  {/* Major axis (fLength) line */}
                  <line
                    x1={-rx - 15}
                    y1="0"
                    x2={rx + 15}
                    y2="0"
                    stroke={currentKey === 'fLength' || currentKey === 'fAlpha' ? '#F59E0B' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={currentKey === 'fLength' || currentKey === 'fAlpha' ? '2.5' : '1'}
                    strokeDasharray={currentKey === 'fLength' ? 'none' : '4 3'}
                  />

                  {/* Minor axis (fWidth) line */}
                  <line
                    x1="0"
                    y1={-ry - 10}
                    x2="0"
                    y2={ry + 10}
                    stroke={currentKey === 'fWidth' ? '#F59E0B' : 'rgba(255,255,255,0.4)'}
                    strokeWidth={currentKey === 'fWidth' ? '2.5' : '1'}
                    strokeDasharray={currentKey === 'fWidth' ? 'none' : '4 3'}
                  />

                  {/* Core PMT pixels (fConc & fConc1) */}
                  <circle cx="5" cy="0" r="8" fill="#FDE047" fillOpacity="0.8" />
                  <circle cx="-8" cy="2" r="6" fill="#FDE047" fillOpacity="0.6" />
                </g>

                {/* Subtitle labels on canvas */}
                <text x="24" y="32" fill="#94A3B8" fontSize="10" fontFamily="var(--font-sans)">
                  PMT FOCAL PLANE (1039 PIXELS)
                </text>
                <text x="24" y="340" fill="#94A3B8" fontSize="10.5" fontFamily="var(--font-sans)" fontVariantNumeric="proportional-nums">
                  {isG ? 'COLLIMATED: α = 12.0° | WIDTH = 20mm' : 'DIFFUSE: α = 72.0° | WIDTH = 46mm'}
                </text>
              </svg>
            </div>

            <div className="visualization-frame__footer">
              <span>What am I looking at? Geometry of the light pattern on the camera face.</span>
              <span style={{ color: '#FFFFFF' }}>FOV ±1.75°</span>
            </div>
          </div>

          {/* RIGHT: Active Detail Card with Dual Tabs (Anatomy vs Empirical Distribution) + Parameter Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Active Parameter Physical Detail Card */}
            <div className="card-warm" style={{ borderLeft: '4px solid var(--color-primary)', padding: '20px' }}>
              
              {/* Header: Title, Unit, and View Mode Tabs */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="chip chip--blue">{curr.role}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--color-body-secondary)' }}>{curr.unit}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', margin: '6px 0 2px 0' }}>
                    <code>{curr.name}</code> — {curr.humanTitle}
                  </h3>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    "{curr.plainDesc}"
                  </div>
                </div>

                {/* Toggle: Anatomy vs Gamma/Hadron Distribution */}
                <div style={{ display: 'flex', backgroundColor: 'var(--color-surface)', borderRadius: '6px', padding: '2px', border: '1px solid var(--color-hairline-trans)' }}>
                  <button
                    onClick={() => setDetailTab('anatomy')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: detailTab === 'anatomy' ? 600 : 500,
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: detailTab === 'anatomy' ? '#FFFFFF' : 'transparent',
                      color: detailTab === 'anatomy' ? 'var(--color-primary)' : 'var(--color-body-secondary)',
                      boxShadow: detailTab === 'anatomy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Anatomy
                  </button>
                  <button
                    onClick={() => setDetailTab('distribution')}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11.5px',
                      fontWeight: detailTab === 'distribution' ? 600 : 500,
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: detailTab === 'distribution' ? '#FFFFFF' : 'transparent',
                      color: detailTab === 'distribution' ? 'var(--color-primary)' : 'var(--color-body-secondary)',
                      boxShadow: detailTab === 'distribution' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Gamma vs Hadron
                  </button>
                </div>
              </div>

              {/* Tab 1: Physical Anatomy */}
              {detailTab === 'anatomy' ? (
                <>
                  <p style={{ fontSize: '14px', color: 'var(--color-ink-85)', lineHeight: 1.55, margin: '0 0 12px 0' }}>
                    {curr.summary}
                  </p>
                  <div style={{ padding: '12px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-hairline-trans)', fontSize: '13px', color: 'var(--color-body-secondary)' }}>
                    <strong style={{ color: 'var(--color-ink)', display: 'block', marginBottom: '2px' }}>Why Machine Learning Cares:</strong>
                    {curr.whyModelCares}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', color: 'var(--color-muted)' }}>
                    {curr.stat}
                  </div>
                </>
              ) : (
                /* Tab 2: Feature Comparison — Gamma vs Hadron Empirical Statistics */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-body-secondary)' }}>
                    Empirical distributions derived from all 19,020 authentic records (12,332 Gamma vs 6,688 Hadron):
                  </div>

                  {/* Summary Metric Cards */}
                  {distData && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <div style={{ padding: '10px', backgroundColor: '#FEF3C7', borderRadius: '6px', border: '1px solid rgba(217, 119, 6, 0.2)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#B45309', textTransform: 'uppercase' }}>Gamma (Signal · 12,332)</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#92400E', marginTop: '2px', fontVariantNumeric: 'proportional-nums' }}>
                          Mean: {distData.gamma.mean}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#B45309', fontVariantNumeric: 'proportional-nums' }}>
                          Median: {distData.gamma.median} | Std: {distData.gamma.std}
                        </div>
                      </div>

                      <div style={{ padding: '10px', backgroundColor: '#EFF6FF', borderRadius: '6px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>Hadron (Noise · 6,688)</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1E40AF', marginTop: '2px', fontVariantNumeric: 'proportional-nums' }}>
                          Mean: {distData.hadron.mean}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#1D4ED8', fontVariantNumeric: 'proportional-nums' }}>
                          Median: {distData.hadron.median} | Std: {distData.hadron.std}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comparative Density / Histogram Visualization */}
                  {distData?.histogram && (
                    <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-surface)', borderRadius: '6px', border: '1px solid var(--color-hairline-trans)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ color: '#D97706' }}>■ Gamma Frequency</span>
                        <span style={{ color: '#2563EB' }}>■ Hadron Frequency</span>
                      </div>

                      {/* Overlapping Frequency Bars across 10 bins */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px', padding: '4px 0', borderBottom: '1px solid var(--color-hairline)' }}>
                        {distData.histogram.gamma.frequencies.map((gFreq, i) => {
                          const hFreq = distData.histogram.hadron.frequencies[i] || 0;
                          const maxFreq = Math.max(...distData.histogram.gamma.frequencies, ...distData.histogram.hadron.frequencies, 0.1);
                          const gHeight = Math.min(100, Math.max(4, (gFreq / maxFreq) * 100));
                          const hHeight = Math.min(100, Math.max(4, (hFreq / maxFreq) * 100));

                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%', gap: '1px' }}>
                              <div
                                title={`Gamma bin: ${distData.histogram.gamma.bins[i]} (${(gFreq * 100).toFixed(1)}%)`}
                                style={{
                                  width: '45%',
                                  height: `${gHeight}%`,
                                  backgroundColor: '#D97706',
                                  borderRadius: '2px 2px 0 0',
                                  opacity: 0.85
                                }}
                              />
                              <div
                                title={`Hadron bin: ${distData.histogram.hadron.bins[i]} (${(hFreq * 100).toFixed(1)}%)`}
                                style={{
                                  width: '45%',
                                  height: `${hHeight}%`,
                                  backgroundColor: '#2563EB',
                                  borderRadius: '2px 2px 0 0',
                                  opacity: 0.85
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-muted)', marginTop: '2px', fontVariantNumeric: 'proportional-nums' }}>
                        <span>Min: {distData.histogram.range[0]}</span>
                        <span>Max (99th %tile): {distData.histogram.range[1]}</span>
                      </div>
                    </div>
                  )}

                  {/* Why this classification is difficult note */}
                  <div style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid #F59E0B', fontSize: '12.5px', color: 'var(--color-ink-85)', lineHeight: 1.45 }}>
                    <strong>Why Classification is Difficult:</strong> {curr.whyDifficult}
                  </div>
                </div>
              )}
            </div>

            {/* 10 Hillas Moments Grid Selection with Plain English Translations */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-body-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Select Measurement to Inspect (10 Features)
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px'
                }}
              >
                {Object.keys(features).map((key) => {
                  const feat = features[key];
                  const isSelected = activeParam === key;
                  const isHovered = hoveredParam === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveParam(key)}
                      onMouseEnter={() => setHoveredParam(key)}
                      onMouseLeave={() => setHoveredParam(null)}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline-trans)',
                        backgroundColor: isSelected ? 'var(--color-primary-tint)' : isHovered ? '#F6F5F4' : 'var(--color-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <code style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? 'var(--color-primary-pressed)' : 'var(--color-ink)' }}>
                          {feat.name}
                        </code>
                        {isSelected && <Check size={14} style={{ color: 'var(--color-primary)' }} />}
                      </div>
                      <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--color-ink-85)', marginTop: '2px' }}>
                        {feat.humanTitle}
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--color-body-secondary)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {feat.unit}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
