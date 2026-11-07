import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import DataUniverseSection from './sections/DataUniverseSection';
import HillasAnatomySection from './sections/HillasAnatomySection';
import ModelLabSection from './sections/ModelLabSection';
import ConfusionMatrixSection from './sections/ConfusionMatrixSection';
import ClassMetricsSection from './sections/ClassMetricsSection';
import PredictionLabSection from './sections/PredictionLabSection';
import InsightEngineSection from './sections/InsightEngineSection';
import MethodologySection from './sections/MethodologySection';
import FooterSection from './sections/FooterSection';

export default function App() {
  return (
    <div className="obs-shell">
      {/* 00 — Fixed Navigation Header (64px, White, Centered Nav, Right Status & CTA) */}
      <Navbar />

      {/* Main Narrative Flow: 10 Editorial Bands with Alternating Surface Rhythm */}
      <main style={{ flex: '1 0 auto' }}>
        {/* 01 — INTRO / HERO (White Canvas) */}
        <HeroSection />

        {/* 02 — THE DATASET (Warm Stone Surface) */}
        <DataUniverseSection />

        {/* 03 — SIGNAL ANATOMY (White Canvas) */}
        <HillasAnatomySection />

        {/* 04 — MODEL BENCHMARK (Warm Stone Surface) */}
        <ModelLabSection />

        {/* 05 — ERROR AUDIT (White Canvas) */}
        <ConfusionMatrixSection />

        {/* 06 — CLASS METRICS (Warm Stone Surface) */}
        <ClassMetricsSection />

        {/* 07 — PREDICTION LAB (White Canvas) */}
        <PredictionLabSection />

        {/* 08 — SCIENTIFIC INSIGHTS (Warm Stone Surface) */}
        <InsightEngineSection />

        {/* 09 — METHODOLOGY & ARCHITECTURE (White Canvas) */}
        <MethodologySection />
      </main>

      {/* 10 / 11 — STRUCTURED EDITORIAL FOOTER (White Surface) */}
      <FooterSection />
    </div>
  );
}
