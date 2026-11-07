import React, { useEffect, useRef } from 'react';

/**
 * AtmosphericBackground — Cinematic Noir Mesh & Cosmic Atmosphere
 * 
 * Implements a persistent, GPU-accelerated WebGL shader field:
 * - Layer 1: Dark graphite/charcoal atmospheric base
 * - Layer 2: Slow organic mesh deformation with soft paper-white highlights
 * - Layer 3: High-frequency dither & tactile grain (eliminates banding)
 * - Layer 4: Faint drifting cosmic dust particles
 * - Layer 5: Subtle deep Cherenkov cyan & cosmic plum depth
 * - Layer 6: Parallax displacement driven by window scroll
 */

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_scroll;
  uniform vec2 u_mouse;
  uniform float u_reduced_motion;

  // 2D Simplex Noise utilities
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal Brownian Motion (FBM)
  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 4; i++) {
      f += w * snoise(p);
      p *= 2.02;
      w *= 0.48;
    }
    return f;
  }

  // Pseudo-random generator for dither & dust
  float hash12(vec2 p) {
    vec3 p3  = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 st = (v_uv - 0.5) * aspect;

    float t = u_time * (u_reduced_motion > 0.5 ? 0.015 : 0.065);
    float scrollOffset = u_scroll * 1.8;

    // Subtle interactive mouse offset
    vec2 mouseOffset = (u_mouse - 0.5) * 0.08;

    // --- LAYER 1 & 2: NOIR GRAPHITE MESH FIELD ---
    vec2 q = vec2(
      fbm(st * 1.35 + vec2(t * 0.5, t * 0.3) + mouseOffset),
      fbm(st * 1.35 + vec2(-t * 0.4, t * 0.6) - mouseOffset)
    );

    vec2 r = vec2(
      fbm(st * 2.2 + 3.0 * q + vec2(0.2 * t, 0.4 * t) + vec2(0.0, scrollOffset * 0.5)),
      fbm(st * 2.2 + 3.0 * q + vec2(-0.3 * t, 0.1 * t) - vec2(0.0, scrollOffset * 0.3))
    );

    float f = fbm(st * 1.8 + 3.5 * r + vec2(0.0, scrollOffset * 0.8));

    // Base atmospheric tones (Deep charcoal & graphite)
    vec3 cBaseVoid    = vec3(0.024, 0.031, 0.043); // #06080D
    vec3 cGraphite    = vec3(0.055, 0.070, 0.094); // #0E1218
    vec3 cMidSlate    = vec3(0.095, 0.118, 0.145); // #181E25
    vec3 cPaperWhite  = vec3(0.88, 0.86, 0.82);    // Soft highlight crest

    // Color mixing for Noir Mesh
    vec3 color = mix(cBaseVoid, cGraphite, clamp(f * f * 2.5, 0.0, 1.0));
    color = mix(color, cMidSlate, clamp(length(q) * 0.85, 0.0, 1.0));

    // Soft paper-white ridge illumination (sparingly on high-order crests)
    float crest = smoothstep(0.42, 0.85, f) * smoothstep(0.95, 0.5, f);
    color += cPaperWhite * (crest * 0.075);

    // --- LAYER 5: SUBTLE CHERENKOV CYAN & COSMIC PLUM ACCENTS ---
    vec3 cCherenkov = vec3(0.12, 0.28, 0.42); // Faint electric blue/cyan
    vec3 cCosmicPlum = vec3(0.24, 0.14, 0.28); // Faint deep plum/violet
    vec3 cGammaAmber = vec3(0.38, 0.22, 0.08); // Rare warm gamma whisper

    float cherenkovZone = smoothstep(-0.3, 0.7, sin(st.x * 1.2 + t * 0.3 + r.y * 2.0));
    float plumZone = smoothstep(-0.2, 0.8, cos(st.y * 1.4 - t * 0.25 + r.x * 2.0));
    float amberWhisper = smoothstep(0.65, 1.1, fbm(st * 3.0 + t * 0.1));

    color += cCherenkov * (cherenkovZone * 0.06);
    color += cCosmicPlum * (plumZone * 0.045);
    color += cGammaAmber * (amberWhisper * 0.04);

    // --- LAYER 4: FAINT DRIFTING COSMIC DUST PARTICLES ---
    vec2 dustGrid = fract(st * 45.0 + vec2(t * 0.8, -t * 0.6 + scrollOffset * 2.0));
    float dustHash = hash12(floor(st * 45.0 + vec2(t * 0.8, -t * 0.6 + scrollOffset * 2.0)));
    if (dustHash > 0.985) {
      float distToCenter = length(dustGrid - 0.5);
      float dustBrightness = smoothstep(0.4, 0.0, distToCenter) * (0.15 + 0.25 * sin(t * 3.0 + dustHash * 6.28));
      color += vec3(0.7, 0.8, 0.95) * dustBrightness * 0.35;
    }

    // --- LAYER 3: TACTILE DITHER & FILM GRAIN ---
    // High-frequency dither prevents gradient banding and adds paper-like texture
    float grain = (hash12(gl_FragCoord.xy + fract(u_time * 0.1)) - 0.5) * 0.028;
    color += grain;

    // Atmospheric subtle vignette
    float vignette = 1.0 - smoothstep(0.45, 1.45, length(st * 0.9));
    color *= mix(0.78, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function AtmosphericBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = mediaQuery.matches ? 1.0 : 0.0;
    const handleMotionChange = (e) => {
      prefersReducedMotion = e.matches ? 1.0 : 0.0;
    };
    mediaQuery.addEventListener?.('change', handleMotionChange);

    // Setup WebGL Context
    const gl = canvas.getContext('webgl', { alpha: false, depth: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    // Compile shader helper
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Atmospheric shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Atmospheric program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uScrollLoc = gl.getUniformLocation(program, 'u_scroll');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uReducedMotionLoc = gl.getUniformLocation(program, 'u_reduced_motion');

    let mouseX = 0.5;
    let mouseY = 0.5;
    let currentScroll = 0;
    let targetScroll = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = window.scrollY / maxScroll;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize handling with DPR cap of 1.5 to guarantee high FPS
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const displayWidth = Math.floor(window.innerWidth * dpr);
      const displayHeight = Math.floor(window.innerHeight * dpr);

      if (width !== displayWidth || height !== displayHeight) {
        width = displayWidth;
        height = displayHeight;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Render loop
    let animationFrameId;
    let startTime = performance.now();

    const render = () => {
      // Smooth interpolation for scroll
      currentScroll += (targetScroll - currentScroll) * 0.08;

      const elapsed = (performance.now() - startTime) * 0.001;

      gl.uniform2f(uResLoc, width, height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uScrollLoc, currentScroll);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);
      gl.uniform1f(uReducedMotionLoc, prefersReducedMotion);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.95
      }}
    />
  );
}
