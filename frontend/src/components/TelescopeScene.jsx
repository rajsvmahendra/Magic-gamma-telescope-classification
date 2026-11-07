import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCcw, Play, Pause, Compass } from 'lucide-react';

function Starfield({ count = 500 }) {
  const points = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

      if (Math.random() > 0.82) {
        col[i * 3] = 1.0;
        col[i * 3 + 1] = 0.72;
        col[i * 3 + 2] = 0.25; // Warm Gamma photon star
      } else {
        col[i * 3] = 0.4;
        col[i * 3 + 1] = 0.75;
        col[i * 3 + 2] = 1.0; // Cherenkov blue star
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={points}>
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
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CherenkovTelescopeModel({ rotState, autoRotate, isInteracting }) {
  const group = useRef();
  const cameraFocus = useRef();

  const facets = useMemo(() => {
    const list = [];
    const rings = 5;
    for (let r = 1; r <= rings; r++) {
      const radius = r * 0.6;
      const count = r * 6;
      for (let i = 0; i < count; i++) {
        const theta = (i / count) * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        const z = -(x * x + y * y) * 0.08;
        list.push({ position: [x, y, z], rotation: [y * 0.08, -x * 0.08, 0] });
      }
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;

    // Apply inertia velocity when not dragging
    if (!rotState.current.isDragging) {
      // Damping friction (smooth deceleration)
      rotState.current.vx *= 0.92;
      rotState.current.vy *= 0.92;

      rotState.current.rotY += rotState.current.vx;
      rotState.current.rotX += rotState.current.vy;

      // Idle auto-rotation resumes when not interacting and inertia has settled
      if (autoRotate && !isInteracting.current && Math.abs(rotState.current.vx) < 0.001) {
        rotState.current.rotY += delta * 0.22;
      }
    }

    // Clamp pitch (rotX) to prevent awkward upside-down angles
    rotState.current.rotX = Math.max(-0.65, Math.min(0.65, rotState.current.rotX));

    // Responsive lerp: tighter during drag (0.6) for immediate feel, smoother on inertia (0.2)
    const lerpFactor = rotState.current.isDragging ? 0.65 : 0.22;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotState.current.rotY, lerpFactor);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, rotState.current.rotX, lerpFactor);

    if (cameraFocus.current) {
      cameraFocus.current.rotation.z += 0.012;
    }
  });

  return (
    <group ref={group} position={[0, -0.15, 0]} scale={0.92}>
      {/* Central Telescope Mount Base */}
      <mesh position={[0, 0, -1.2]}>
        <cylinderGeometry args={[1.2, 1.8, 0.6, 16]} />
        <meshStandardMaterial color="#0A1020" roughness={0.7} metalness={0.8} />
      </mesh>

      {/* Segmented Parabolic Dish Facets */}
      <group>
        {facets.map((facet, idx) => (
          <mesh key={idx} position={facet.position} rotation={facet.rotation}>
            <circleGeometry args={[0.26, 6]} />
            <meshStandardMaterial
              color="#6EC8FF"
              emissive="#1E3A8A"
              emissiveIntensity={0.25}
              roughness={0.15}
              metalness={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Outer Truss Support Ring */}
      <mesh position={[0, 0, -0.5]}>
        <torusGeometry args={[3.2, 0.08, 8, 36]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Carbon-fiber Quadripod Trusses */}
      {[
        [-2.2, -2.2, 0],
        [2.2, -2.2, 0],
        [-2.2, 2.2, 0],
        [2.2, 2.2, 0]
      ].map((start, i) => {
        const target = [0, 0, 3.8];
        const dir = new THREE.Vector3(...target).sub(new THREE.Vector3(...start));
        const len = dir.length();
        const mid = new THREE.Vector3(...start).add(dir.clone().multiplyScalar(0.5));
        
        return (
          <group key={i} position={mid.toArray()}>
            <mesh
              quaternion={new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                dir.clone().normalize()
              )}
            >
              <cylinderGeometry args={[0.03, 0.04, len, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.4} />
            </mesh>
          </group>
        );
      })}

      {/* Prime Focus PMT Camera Housing (1,039 Photomultipliers) */}
      <group position={[0, 0, 3.8]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.5, 14]} />
          <meshStandardMaterial color="#0A1020" roughness={0.4} metalness={0.9} />
        </mesh>
        {/* PMT Hexagonal Photomultiplier Face */}
        <mesh ref={cameraFocus} position={[0, 0, -0.26]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.65, 18]} />
          <meshStandardMaterial
            color="#FF7A3D"
            emissive="#FF5A36"
            emissiveIntensity={0.65}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#FF7A3D" intensity={2.6} distance={6} />
      </group>

      {/* Incident Lighting */}
      <directionalLight position={[5, 10, 8]} intensity={1.2} color="#FFFFFF" />
      <pointLight position={[-4, -4, 2]} intensity={1.8} color="#4EA8FF" />
    </group>
  );
}

export default function TelescopeScene() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Rotation physics state in ref for 60fps performance without re-render lag
  const rotState = useRef({
    rotX: 0.1,
    rotY: -0.15,
    vx: 0,
    vy: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0
  });

  const isInteracting = useRef(false);
  const idleTimer = useRef(null);
  const containerRef = useRef(null);

  const wakeInteraction = () => {
    isInteracting.current = true;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, 3200);
  };

  const handlePointerDown = (e) => {
    wakeInteraction();
    rotState.current.isDragging = true;
    rotState.current.lastX = e.clientX;
    rotState.current.lastY = e.clientY;
    rotState.current.vx = 0;
    rotState.current.vy = 0;
    setIsDragging(true);
    setHasInteracted(true);

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e) => {
    if (!rotState.current.isDragging) return;
    wakeInteraction();

    const dx = e.clientX - rotState.current.lastX;
    const dy = e.clientY - rotState.current.lastY;

    // High tactile sensitivity: ~1px pointer movement = perceptible smooth rotation
    const sensitivity = 0.018;
    rotState.current.rotY += dx * sensitivity;
    rotState.current.rotX += dy * sensitivity;

    rotState.current.vx = dx * sensitivity * 0.55;
    rotState.current.vy = dy * sensitivity * 0.55;

    rotState.current.lastX = e.clientX;
    rotState.current.lastY = e.clientY;
  };

  const handlePointerUp = (e) => {
    if (!rotState.current.isDragging) return;
    rotState.current.isDragging = false;
    setIsDragging(false);

    if (e.currentTarget.releasePointerCapture) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleReset = () => {
    wakeInteraction();
    rotState.current.rotX = 0.1;
    rotState.current.rotY = -0.15;
    rotState.current.vx = 0;
    rotState.current.vy = 0;
  };

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="3D Interactive Cherenkov Telescope model. Drag anywhere on canvas to rotate instrument view."
      role="region"
    >
      <Canvas
        camera={{ position: [0, 0.3, 7.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.45} />
        <Starfield count={500} />
        <CherenkovTelescopeModel
          rotState={rotState}
          autoRotate={autoRotate}
          isInteracting={isInteracting}
        />
      </Canvas>

      {/* Floating Scientific Instrument Controls Bar (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toggle Auto-Rotate */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="btn-ghost"
          style={{
            padding: '4px 10px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '6px',
            color: '#CBD5E1',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backdropFilter: 'blur(8px)'
          }}
          title={autoRotate ? 'Pause idle rotation' : 'Resume idle rotation'}
          aria-label={autoRotate ? 'Pause idle rotation' : 'Resume idle rotation'}
        >
          {autoRotate ? <Pause size={12} style={{ color: '#38BDF8' }} /> : <Play size={12} style={{ color: '#94A3B8' }} />}
          <span>{autoRotate ? 'Rotate: On' : 'Rotate: Paused'}</span>
        </button>

        {/* Reset View */}
        <button
          onClick={handleReset}
          className="btn-ghost"
          style={{
            padding: '4px 10px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '6px',
            color: '#CBD5E1',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backdropFilter: 'blur(8px)'
          }}
          title="Reset telescope view orientation"
          aria-label="Reset telescope view orientation"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Subtle First-Time Drag Affordance Hint (Bottom Left - Fades out once interacted) */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(6, 9, 19, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          padding: '5px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#CBD5E1',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          pointerEvents: 'none',
          opacity: hasInteracted ? 0 : 0.9,
          transition: 'opacity 0.6s ease'
        }}
      >
        <Compass size={12} style={{ color: '#0075DE' }} />
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
