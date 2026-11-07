import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FibonacciParticleGlobe({ count = 2800 }) {
  const pointsRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Generate spherical Fibonacci particle coordinates with density modulation
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const r = 2.6;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color nodes: subtle warm ivory and deep starlight grey
      // Highlight Roque de los Muchachos coordinates (28.76°N, 17.89°W)
      const lat = (Math.PI / 2 - phi) * (180 / Math.PI);
      const lon = (theta % (2 * Math.PI)) * (180 / Math.PI) - 180;
      const isLaPalma = Math.abs(lat - 28.76) < 14 && Math.abs(lon - (-17.89)) < 14;

      if (isLaPalma) {
        // Muted Warm Amber indicator at La Palma
        col[i * 3] = 0.95;
        col[i * 3 + 1] = 0.65;
        col[i * 3 + 2] = 0.25;
      } else {
        // High-character astronomical dust
        const brightness = 0.35 + Math.random() * 0.45;
        col[i * 3] = brightness * 0.92;
        col[i * 3 + 1] = brightness * 0.90;
        col[i * 3 + 2] = brightness * 0.88;
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Slow constant physical rotation
      pointsRef.current.rotation.y += delta * 0.08;
      // Gentle responsive tilt toward cursor
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(
        pointsRef.current.rotation.x,
        state.mouse.y * 0.25,
        0.04
      );
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Thin Geometric Equatorial & Meridian Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.61, 2.62, 64]} />
        <meshBasicMaterial color="#F4F1EA" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function ParticleGlobe() {
  return (
    <section id="data-universe" className="editorial-section bg-[#07080C] overflow-hidden">
      <div className="obs-container space-y-12">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="chapter-tag">
              CHAPTER 04 / OBSERVATION UNIVERSE
            </div>
            <h2 className="text-4xl sm:text-6xl tracking-tight">
              Global Ground-Based Detection.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-[#9BA0AA] text-base leading-relaxed pt-2">
            <p>
              Ground-based Imaging Atmospheric Cherenkov Telescopes (IACTs) sample the upper atmosphere as an immense calorimeter. While spaceborne gamma-ray satellites like Fermi-LAT have effective collection areas limited to approximately 1 m², ground-based Cherenkov arrays utilize the optical shower footprint to achieve effective detection areas exceeding <span className="text-[#F4F1EA]">100,000 m²</span>.
            </p>
          </div>
        </div>

        {/* Dedicated Grand Particle Globe Canvas */}
        <div className="relative w-full h-[520px] sm:h-[620px] flex items-center justify-center my-6">
          
          {/* 3D Three.js Globe */}
          <Canvas
            camera={{ position: [0, 0, 5.8], fov: 42 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <FibonacciParticleGlobe count={2600} />
          </Canvas>

          {/* Editorial Astronomical Telemetry Callouts around the Globe */}
          <div className="absolute top-4 left-4 max-w-xs space-y-1 font-mono text-xs text-[#9BA0AA] pointer-events-none">
            <span className="text-[#606570] text-[10px] uppercase block tracking-wider">OBSERVATORY LOCATION</span>
            <div className="text-sm font-semibold text-[#F4F1EA]">Roque de los Muchachos</div>
            <div className="text-[11px] text-[#E08A3C]">La Palma, Canary Islands</div>
            <div className="text-[10px] text-[#606570]">Coordinates: 28.76°N, 17.89°W</div>
          </div>

          <div className="absolute bottom-4 right-4 max-w-xs space-y-1 font-mono text-xs text-right text-[#9BA0AA] pointer-events-none">
            <span className="text-[#606570] text-[10px] uppercase block tracking-wider">ATMOSPHERIC CALORIMETER</span>
            <div className="text-sm font-semibold text-[#F4F1EA]">Elevation: 2,200m ASL</div>
            <div className="text-[11px] text-[#8BB6C7]">Optical Threshold: &gt; 50 GeV</div>
            <div className="text-[10px] text-[#606570]">Cherenkov Flash: 2 - 5 Nanoseconds</div>
          </div>
        </div>

        {/* Editorial Footnote */}
        <div className="pt-6 hairline-t flex flex-col sm:flex-row items-baseline justify-between text-xs font-mono text-[#606570]">
          <span>FIG 04.1 / 2,600 STOCHASTIC FIBONACCI SAMPLING NODES</span>
          <span>SPHERICAL ROTATION WITH INTERTIAL DAMPING</span>
        </div>
      </div>
    </section>
  );
}
