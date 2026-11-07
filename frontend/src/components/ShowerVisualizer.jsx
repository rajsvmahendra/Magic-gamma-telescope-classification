import React from 'react';

export default function ShowerVisualizer({
  fLength = 31.6,
  fWidth = 11.7,
  fAlpha = 6.4,
  fDist = 205.2,
  fAsym = 26.2,
  isSignal = true,
  className = ''
}) {
  const cx = 150;
  const cy = 150;

  // Scale distance from [0, 450] mm to [0, 105] svg units
  const r = Math.min((Number(fDist) / 450) * 105, 115);

  // Position center at fixed nominal theta for stable visualization
  const theta = -Math.PI / 4;
  const ellipseCenterX = cx + r * Math.cos(theta);
  const ellipseCenterY = cy + r * Math.sin(theta);

  // Scale length and width
  const rx = Math.max(6, Math.min((Number(fLength) / 200) * 55, 75));
  const ry = Math.max(3, Math.min((Number(fWidth) / 120) * 35, 45));

  // Alpha rotation relative to radial vector
  const rotationDegrees = (theta * 180) / Math.PI + (Number(fAlpha) || 0);

  const strokeColor = isSignal ? '#D97706' : '#2563EB';
  const fillColor = isSignal ? 'rgba(217, 119, 6, 0.22)' : 'rgba(37, 99, 235, 0.22)';

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <div
        style={{
          width: '100%',
          maxWidth: '320px',
          aspectRatio: '1 / 1',
          position: 'relative',
          backgroundColor: '#070A14',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '8px',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 300 300" style={{ width: '100%', height: '100%' }}>
          {/* PMT Camera Focal Plane Reticle */}
          <circle cx={cx} cy={cy} r="45" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2 3" />
          <circle cx={cx} cy={cy} r="85" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r="125" fill="none" stroke="rgba(255, 255, 255, 0.14)" />

          {/* Coordinate Crosshairs */}
          <line x1="20" y1={cy} x2="280" y2={cy} stroke="rgba(255, 255, 255, 0.08)" />
          <line x1={cx} y1="20" x2={cx} y2="280" stroke="rgba(255, 255, 255, 0.08)" />

          {/* Camera Center Optical Origin */}
          <circle cx={cx} cy={cy} r="3" fill="#FFFFFF" />
          <text x={cx + 6} y={cy - 6} fill="#94A3B8" fontSize="8" fontFamily="var(--font-mono)">
            ORIGIN (0,0)
          </text>

          {/* Radial vector to shower center */}
          <line
            x1={cx}
            y1={cy}
            x2={ellipseCenterX}
            y2={ellipseCenterY}
            stroke="rgba(255, 255, 255, 0.25)"
            strokeDasharray="2 2"
          />

          {/* Reconstructed Hillas Shower Ellipse */}
          <g transform={`rotate(${rotationDegrees}, ${ellipseCenterX}, ${ellipseCenterY})`}>
            {/* Core Bivariate Equidensity Ellipse */}
            <ellipse
              cx={ellipseCenterX}
              cy={ellipseCenterY}
              rx={rx}
              ry={ry}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Major Axis Line */}
            <line
              x1={ellipseCenterX - rx * 1.25}
              y1={ellipseCenterY}
              x2={ellipseCenterX + rx * 1.25}
              y2={ellipseCenterY}
              stroke={strokeColor}
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />
            {/* Minor Axis Line */}
            <line
              x1={ellipseCenterX}
              y1={ellipseCenterY - ry}
              x2={ellipseCenterX}
              y2={ellipseCenterY + ry}
              stroke={strokeColor}
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          </g>

          {/* Shower Center Marker */}
          <circle cx={ellipseCenterX} cy={ellipseCenterY} r="2.5" fill="#FFFFFF" />

          {/* Telemetry Annotations */}
          <text x="14" y="24" fill="#94A3B8" fontSize="8" fontFamily="var(--font-mono)">
            PMT FOCAL PLANE (1039 PIXELS)
          </text>
          <text x="14" y="286" fill="#94A3B8" fontSize="8" fontFamily="var(--font-mono)">
            DIST: {Number(fDist).toFixed(1)}mm • ALPHA: {Number(fAlpha).toFixed(1)}°
          </text>
        </svg>

        {/* Status corner tag */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            padding: '2px 6px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#94A3B8',
            backgroundColor: 'rgba(7, 10, 20, 0.8)',
            borderRadius: '4px'
          }}
        >
          FOV ±1.75°
        </div>
      </div>
    </div>
  );
}
