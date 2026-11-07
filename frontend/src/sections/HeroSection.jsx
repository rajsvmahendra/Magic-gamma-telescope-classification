import React, { useState } from 'react';
import { ArrowRight, Compass, Info, ChevronDown } from 'lucide-react';
import TelescopeScene from '../components/TelescopeScene';
import { useCountUp } from '../lib/useCountUp';

export default function HeroSection() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Animated metric counters
  const eventsCount = useCountUp(19020, 1100);
  const featuresCount = useCountUp(10, 800);
  const classesCount = useCountUp(2, 600);
  const accuracyCount = useCountUp(84.07, 1200, 2);

  const factItems = [
    {
      id: 'events',
      num: eventsCount,
      label: 'telescope events',
      tooltip: 'The complete MAGIC dataset used in this project.',
      href: '#explore'
    },
    {
      id: 'features',
      num: featuresCount,
      label: 'measurements per event',
      tooltip: 'Each event is described by 10 numerical measurements.',
      href: '#signal'
    },
    {
      id: 'classes',
      num: classesCount,
      label: 'classes',
      tooltip: 'Gamma-ray signal vs hadronic background.',
      href: '#explore'
    },
    {
      id: 'accuracy',
      num: `${accuracyCount}%`,
      label: 'best holdout accuracy',
      tooltip: 'Random Forest accuracy on the 3,742-event holdout set.',
      href: '#models',
      highlight: true
    }
  ];

  const specDetails = {
    dish: {
      title: 'Reflective Dish',
      val: '236 m²',
      explainer: 'Collects faint Cherenkov light created in the atmosphere.'
    },
    camera: {
      title: 'PMT Camera',
      val: '1,039 Pixels',
      explainer: "Records the shower's light pattern with nanosecond timing."
    },
    fov: {
      title: 'Field of View',
      val: '3.5° Aperture',
      explainer: 'The patch of sky observed by the camera.'
    },
    holdout: {
      title: 'Holdout Set',
      val: '3,742 Events',
      explainer: 'Data the models never saw during training.'
    }
  };

  const [hoveredSpec, setHoveredSpec] = useState(null);

  return (
    <section
      id="hero"
      className="obs-band obs-band--white"
      style={{
        paddingTop: '64px',
        paddingBottom: '72px',
        borderBottom: '1px solid var(--color-hairline-trans)'
      }}
    >
      <div className="obs-container">
        
        {/* Top Editorial Narrative & Headline Block */}
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Eyebrow Chip */}
          <div className="chip chip--lavender" style={{ fontWeight: 600 }}>
            <Compass size={13} style={{ marginRight: '2px' }} />
            <span>01 · START HERE</span>
          </div>

          {/* Subheading Identity */}
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              letterSpacing: '-0.2px'
            }}
          >
            MAGIC Gamma Explorer
          </div>

          {/* Hero Display Headline: Intriguing Human Question */}
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(36px, 5.2vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-2.2px',
              color: 'var(--color-ink)',
              margin: 0
            }}
          >
            Can a machine tell a gamma ray <br className="hidden sm:inline" />
            from cosmic noise?
          </h1>

          {/* Supporting Narrative: Plain English First */}
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '18px',
              lineHeight: 1.55,
              color: 'var(--color-body-secondary)',
              maxWidth: '700px',
              margin: '4px 0 8px 0',
              fontWeight: 400
            }}
          >
            We're exploring 19,020 real telescope events from the MAGIC Gamma Telescope. Each event is described by 10 measurements, and two Spark ML models try to decide whether it came from a gamma-ray signal or hadronic background.
            <span style={{ display: 'block', marginTop: '6px' }}>
              Explore the measurements, see where the models get things wrong, and test an event yourself.
            </span>
          </p>

          {/* Primary Action Buttons: Clear Purpose */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '4px'
            }}
          >
            <a
              href="#explore"
              className="btn-primary"
              style={{ padding: '8px 22px', minHeight: '42px', fontSize: '15px' }}
            >
              <span>Explore the Data →</span>
            </a>

            <a
              href="#predict"
              className="btn-secondary"
              style={{ padding: '8px 22px', minHeight: '42px', fontSize: '15px' }}
            >
              <span>Test an Event</span>
            </a>
          </div>

          {/* Interactive Hero Fact Strip: Animated & Clickable */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '6px 14px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-surface-warm)',
              border: '1px solid var(--color-hairline-trans)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'proportional-nums',
              letterSpacing: '-0.01em',
              marginTop: '12px'
            }}
          >
            {factItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <a
                  href={item.href}
                  onMouseEnter={() => setActiveTooltip(item.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: item.highlight ? 'var(--color-gamma)' : 'var(--color-body-secondary)',
                    textDecoration: 'none',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    transition: 'background-color 0.15s ease'
                  }}
                  title={item.tooltip}
                >
                  <strong style={{ color: item.highlight ? 'var(--color-gamma)' : 'var(--color-ink)', fontWeight: 700 }}>
                    {item.num}
                  </strong>
                  <span>{item.label}</span>
                </a>
                {idx < factItems.length - 1 && (
                  <span style={{ color: 'var(--color-hairline)' }}>•</span>
                )}
              </React.Fragment>
            ))}

            {/* Active Micro-Tooltip when hovering Fact Strip */}
            {activeTooltip && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  marginTop: '8px',
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '12px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 20,
                  maxWidth: '320px',
                  pointerEvents: 'none'
                }}
              >
                {factItems.find(f => f.id === activeTooltip)?.tooltip}
              </div>
            )}
          </div>
        </div>

        {/* Deliberately Framed Scientific Instrument Panel (Telescope Visual) */}
        <div
          style={{
            marginTop: '44px',
            maxWidth: '1080px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <div className="visualization-frame" style={{ borderRadius: '12px' }}>
            
            {/* Visualizer Header */}
            <div className="visualization-frame__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#1AAE39',
                    boxShadow: '0 0 6px #1AAE39'
                  }}
                />
                <span style={{ color: '#F1F5F9', fontWeight: 600 }}>
                  Cherenkov Instrument · MAGIC-I
                </span>
                <span style={{ opacity: 0.6 }}>|</span>
                <span>Roque de los Muchachos (2,200m ASL)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="hidden sm:inline">28.76°N, 17.89°W</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 117, 222, 0.25)',
                    color: '#6EC8FF',
                    fontWeight: 600
                  }}
                >
                  ONLINE
                </span>
              </div>
            </div>

            {/* Contained 3D Telescope Scene */}
            <div style={{ height: '420px', width: '100%', position: 'relative' }}>
              <TelescopeScene />
            </div>

            {/* Instrument Specifications Footer Strip: Educational & Explanatory */}
            <div
              style={{
                backgroundColor: 'rgba(3, 7, 18, 0.95)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                fontFamily: 'var(--font-sans)',
                fontVariantNumeric: 'proportional-nums',
                fontSize: '12px'
              }}
            >
              {Object.keys(specDetails).map((key) => {
                const s = specDetails[key];
                const isHovered = hoveredSpec === key;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHoveredSpec(key)}
                    onMouseLeave={() => setHoveredSpec(null)}
                    style={{
                      cursor: 'help',
                      position: 'relative',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <div style={{ color: '#94A3B8', fontSize: '10px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{s.title}</span>
                      <Info size={10} style={{ opacity: 0.6 }} />
                    </div>
                    <div style={{ color: key === 'holdout' ? '#38BDF8' : '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>
                      {s.val}
                    </div>

                    {/* Explanatory Tooltip */}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '0',
                          marginBottom: '8px',
                          backgroundColor: 'rgba(15, 23, 42, 0.96)',
                          border: '1px solid rgba(255, 255, 255, 0.16)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#E2E8F0',
                          fontSize: '11px',
                          fontFamily: 'var(--font-sans)',
                          lineHeight: 1.45,
                          zIndex: 30,
                          width: '240px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                        }}
                      >
                        {s.explainer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Small "WHAT YOU ARE SEEING" Educational Moment */}
        <div
          style={{
            maxWidth: '840px',
            margin: '28px auto 0 auto',
            backgroundColor: 'var(--color-surface-warm)',
            border: '1px solid var(--color-hairline-trans)',
            borderRadius: '10px',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              WHAT YOU ARE SEEING
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-body-secondary)', lineHeight: 1.5, margin: 0 }}>
              A gamma ray entering Earth's atmosphere creates a cascade of secondary particles. The MAGIC telescope does not directly photograph the gamma ray. It records the brief Cherenkov light produced by the shower. <strong>Those light patterns become numbers.</strong>
            </p>
          </div>

          <a
            href="#explore"
            className="btn-ghost"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-hairline-trans)'
            }}
          >
            <span>Next: See how the numbers look →</span>
          </a>
        </div>

        {/* Scroll Cue Indicator */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a
            href="#explore"
            className="btn-ghost"
            style={{
              color: 'var(--color-body-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)'
            }}
          >
            <span>Scroll to Explore Dataset</span>
            <ChevronDown size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}
