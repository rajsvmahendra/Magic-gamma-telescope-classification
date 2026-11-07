import React from 'react';
import { ArrowUp, Database, Cpu, Layout, Radio, Compass } from 'lucide-react';

export default function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-hairline-trans)',
        paddingTop: '64px',
        paddingBottom: '32px',
        color: 'var(--color-ink-85)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* 4-Column Structured Desktop Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '36px'
          }}
        >
          {/* Column 1: Brand & Academic Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#0075DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
                  <line x1="12" y1="2" x2="12" y2="8.5" stroke="#FFFFFF" strokeWidth="1.2" />
                  <line x1="12" y1="15.5" x2="12" y2="22" stroke="#FFFFFF" strokeWidth="1.2" />
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#000000', letterSpacing: '-0.2px' }}>
                MAGIC <span style={{ color: '#0075DE' }}>Gamma</span> Explorer
              </span>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--color-body-secondary)', lineHeight: 1.6, margin: 0 }}>
              Interactive scientific explorer for 19,020 MAGIC Gamma Telescope air shower events and distributed Apache Spark MLlib classification. Developed for INT315 Project 68.
            </p>

            <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-sans)', color: 'var(--color-muted)', marginTop: '4px', lineHeight: 1.5 }}>
              Roque de los Muchachos Observatory<br />
              La Palma, Canary Islands (2,200m ASL)
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Story Sections
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <a href="#hero" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>01 · Start Here</a>
              <a href="#explore" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>02 · The Dataset</a>
              <a href="#signal" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>03 · The Signal</a>
              <a href="#models" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>04 · The Models</a>
              <a href="#matrix" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>05 · The Errors</a>
              <a href="#class-metrics" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>06 · Class Metrics</a>
              <a href="#predict" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>07 · Test an Event</a>
              <a href="#insights" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>08 · What We Learned</a>
              <a href="#method" className="btn-ghost" style={{ padding: '2px 0', justifyContent: 'flex-start' }}>09 · How It Was Built</a>
            </div>
          </div>

          {/* Column 3: Dataset Attribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Dataset Attribution
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-body-secondary)', lineHeight: 1.6, margin: 0 }}>
              Simulated Cherenkov shower events donated by R. Bock (Max-Planck-Institute for Physics, Munich) via the UCI Machine Learning Repository.
            </p>
            <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', color: 'var(--color-body-secondary)', backgroundColor: 'var(--color-surface-warm)', padding: '10px', borderRadius: '6px', lineHeight: 1.6 }}>
              19,020 Total Records<br />
              12,332 Gamma Photons (64.84%)<br />
              6,688 Hadron Showers (35.16%)
            </div>
          </div>

          {/* Column 4: Technology Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Technology Stack
            </span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: 'var(--color-body-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Distributed ML:</strong> Apache Spark 3.5.9 (PySpark MLlib)</li>
              <li><strong>Backend Service:</strong> FastAPI + Uvicorn ASGI (Port 8000)</li>
              <li><strong>Frontend Engine:</strong> React 18, Vite, Three.js / R3F</li>
              <li><strong>Design System:</strong> Editorial Notion-Derived System</li>
            </ul>

            <button
              onClick={scrollToTop}
              className="btn-secondary-white"
              style={{
                borderRadius: '9999px',
                width: 'fit-content',
                marginTop: '10px',
                padding: '6px 16px',
                fontSize: '13px'
              }}
            >
              <span>Return to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>

        </div>

        {/* Bottom Tier: Academic Notice & Runtime Verification */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            borderTop: '1px solid var(--color-hairline-trans)',
            paddingTop: '24px',
            fontSize: '12px',
            color: 'var(--color-body-secondary)'
          }}
        >
          <div>
            © {new Date().getFullYear()} INT315 Project 68 · Academic Machine Learning Demonstration. Parent workspace is read-only.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-sans)', fontVariantNumeric: 'proportional-nums', fontSize: '11px', color: '#059669' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1AAE39' }} />
            <span>Apache PySpark 3.5.9 Runtime · FastAPI Port 8000</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
