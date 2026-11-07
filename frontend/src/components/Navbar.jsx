import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ connected: false, loading: true });
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let isMounted = true;
    api.getHealth()
      .then(res => {
        if (isMounted) setBackendStatus({ connected: Boolean(res.spark_connected), loading: false });
      })
      .catch(() => {
        if (isMounted) setBackendStatus({ connected: false, loading: false });
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const sectionIds = ['hero', 'explore', 'signal', 'models', 'matrix', 'predict', 'method'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Data', href: '#explore', id: 'explore' },
    { name: 'Signal', href: '#signal', id: 'signal' },
    { name: 'Models', href: '#models', id: 'models' },
    { name: 'Errors', href: '#matrix', id: 'matrix' },
    { name: 'Predict', href: '#predict', id: 'predict' },
    { name: 'How It Works', href: '#method', id: 'method' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        height: '64px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 0px 0px',
        transition: 'box-shadow 0.2s ease',
        width: '100%'
      }}
    >
      <div
        className="obs-container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          height: '64px',
          gap: '16px'
        }}
      >
        {/* LEFT: Humanized Scientific Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="#hero"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              borderRadius: '6px',
              padding: '4px'
            }}
          >
            {/* Scientific Aperture & Segmented Reflector Emblem */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#0075DE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
                <line x1="12" y1="2" x2="12" y2="8.5" stroke="#FFFFFF" strokeWidth="1.2" />
                <line x1="12" y1="15.5" x2="12" y2="22" stroke="#FFFFFF" strokeWidth="1.2" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#000000',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2
                }}
              >
                MAGIC <span style={{ color: '#0075DE' }}>Gamma</span> Explorer
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--color-body-secondary)',
                  letterSpacing: '0.02em',
                  fontVariantNumeric: 'proportional-nums'
                }}
              >
                19,020 events · 10 measurements
              </span>
            </div>
          </a>
        </div>

        {/* CENTER: Story-Explaining Navigation Links (Desktop with ScrollSpy) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          className="obs-nav-desktop"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className="btn-ghost"
                style={{
                  color: isActive ? 'var(--color-primary)' : 'rgba(0, 0, 0, 0.85)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--color-primary-tint)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* RIGHT: Truthful Live Status & Primary Action CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          {/* Truthful Runtime Status Pill (Desktop) */}
          <div
            className="obs-status-desktop"
            title={backendStatus.connected ? 'Connected to the Spark ML service.' : backendStatus.loading ? 'Connecting to backend...' : 'Service offline'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: backendStatus.loading ? '#F6F5F4' : backendStatus.connected ? '#D0F4D8' : '#FEE2E2',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              fontSize: '11.5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 550,
              letterSpacing: '0.01em',
              fontVariantNumeric: 'proportional-nums',
              whiteSpace: 'nowrap',
              color: backendStatus.loading ? 'var(--color-body-secondary)' : backendStatus.connected ? '#065F46' : '#991B1B',
              cursor: 'default'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendStatus.loading ? '#A39E98' : backendStatus.connected ? '#1AAE39' : '#DC2626',
                flexShrink: 0
              }}
            />
            <span style={{ whiteSpace: 'nowrap' }}>
              {backendStatus.loading
                ? 'CONNECTING'
                : backendStatus.connected
                ? 'LIVE DATA'
                : 'OFFLINE'}
            </span>
          </div>

          {/* Primary Action CTA: Test an Event */}
          <a
            href="#predict"
            className="btn-primary btn-primary--header"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <span>Test an Event</span>
            <ArrowRight size={14} />
          </a>

          {/* Mobile Menu Toggle Button (44px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="obs-mobile-toggle"
            style={{
              width: '44px',
              height: '44px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              color: '#000000',
              backgroundColor: mobileMenuOpen ? '#F6F5F4' : 'transparent',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #DFDCD9',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
            padding: '16px 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 99
          }}
        >
          {/* Status inside mobile drawer */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: backendStatus.loading ? '#F6F5F4' : backendStatus.connected ? '#D0F4D8' : '#FEE2E2',
              fontSize: '11.5px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 550,
              letterSpacing: '0.01em',
              fontVariantNumeric: 'proportional-nums',
              color: backendStatus.loading ? 'var(--color-body-secondary)' : backendStatus.connected ? '#065F46' : '#991B1B',
              width: 'fit-content',
              marginBottom: '4px'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendStatus.loading ? '#A39E98' : backendStatus.connected ? '#1AAE39' : '#DC2626'
              }}
            />
            <span>
              {backendStatus.loading
                ? 'CONNECTING'
                : backendStatus.connected
                ? 'LIVE DATA'
                : 'OFFLINE'}
            </span>
          </div>

          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-primary)' : '#000000',
                  textDecoration: 'none',
                  backgroundColor: isActive ? 'var(--color-primary-tint)' : 'rgba(0, 0, 0, 0.02)'
                }}
              >
                {link.name}
              </a>
            );
          })}
          
          <a
            href="#predict"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '8px'
            }}
          >
            <span>Test an Event →</span>
          </a>
        </div>
      )}

      {/* Responsive Breakpoint Styles for Header */}
      <style>{`
        @media (max-width: 1120px) {
          .obs-nav-desktop a {
            padding: 6px 8px !important;
            font-size: 13px !important;
          }
          .obs-status-desktop {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }
        }
        @media (max-width: 960px) {
          .obs-nav-desktop {
            display: none !important;
          }
          .obs-status-desktop {
            display: none !important;
          }
          .btn-primary--header {
            display: none !important;
          }
          .obs-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
