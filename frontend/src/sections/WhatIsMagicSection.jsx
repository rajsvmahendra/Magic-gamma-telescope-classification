import React from 'react';
import { Zap, ShieldAlert } from 'lucide-react';

export default function WhatIsMagicSection() {
  return (
    <section id="the-data" className="editorial-section bg-[#07080C]">
      <div className="obs-container space-y-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="chapter-tag">
              CHAPTER 02 / ASTROPHYSICAL CONTEXT
            </div>
            <h2 className="text-4xl sm:text-6xl tracking-tight">
              Capturing Ghosts of the Deep Cosmos.
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-6 text-[#9BA0AA] text-base sm:text-lg leading-relaxed pt-2">
            <p>
              High-energy cosmic gamma rays cannot penetrate Earth's atmosphere directly. When a primary photon with energy exceeding 50 GeV enters the stratosphere, it annihilates against atomic nuclei, creating an avalanche of relativistic electron-positron pairs.
            </p>
            <p>
              These charged leptons travel through air faster than the local phase velocity of light in the dielectric medium, emitting a faint, polarized blue flash of <span className="text-[#F4F1EA] font-medium">Cherenkov radiation</span> lasting merely 2 to 5 nanoseconds. The MAGIC reflectors capture these transient photons and focus them onto a high-speed photomultiplier camera.
            </p>
          </div>
        </div>

        {/* Editorial Two-Column Comparison */}
        <div className="hairline-t pt-12 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Gamma Ray Signal Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between hairline-b pb-4">
              <span className="text-xs font-mono text-[#E08A3C] uppercase tracking-wider font-semibold">
                SIGNAL • CLASS G (12,332 EVENTS / 64.84%)
              </span>
              <span className="text-xs font-mono text-[#606570]">INDEX 0.0</span>
            </div>

            <h3 className="text-3xl text-[#F4F1EA]">Primary Cosmic Gamma Rays</h3>
            
            <p className="text-sm text-[#9BA0AA] leading-relaxed">
              Originate from cataclysmic particle accelerators across the universe: active galactic nuclei (AGN), relativistic jets from supermassive black holes, pulsars, and supernova remnants.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">CASCADE NATURE</span>
                <span className="text-[#F4F1EA]">Purely Electromagnetic (e± pairs + bremsstrahlung)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">SHOWER GEOMETRY</span>
                <span className="text-[#E08A3C]">Narrow, highly symmetric, compact ellipse</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">CAMERA ALIGNMENT</span>
                <span className="text-[#F4F1EA]">Points toward center (fAlpha → 0°)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">OBSERVATORY ROLE</span>
                <span className="text-emerald-400 font-semibold">Primary Target of Scientific Investigation</span>
              </div>
            </div>
          </div>

          {/* Hadronic Background Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between hairline-b pb-4">
              <span className="text-xs font-mono text-[#8BB6C7] uppercase tracking-wider font-semibold">
                BACKGROUND • CLASS H (6,688 EVENTS / 35.16%)
              </span>
              <span className="text-xs font-mono text-[#606570]">INDEX 1.0</span>
            </div>

            <h3 className="text-3xl text-[#F4F1EA]">Hadronic Cosmic Rays</h3>
            
            <p className="text-sm text-[#9BA0AA] leading-relaxed">
              Relativistic charged protons and heavy atomic nuclei arriving isotropically from arbitrary directions. In uncalibrated night sky observations, hadronic noise outnumbers gamma photons by more than 1,000 to 1.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">CASCADE NATURE</span>
                <span className="text-[#F4F1EA]">Hadronic &amp; Nuclear (pions, muons, nuclear debris)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">SHOWER GEOMETRY</span>
                <span className="text-[#8BB6C7]">Broad, irregular, multi-core, high transverse spread</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">CAMERA ALIGNMENT</span>
                <span className="text-[#F4F1EA]">Random orientation (fAlpha → 90°)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-[#606570]">OBSERVATORY ROLE</span>
                <span className="text-red-400 font-semibold">Contaminating Background Noise (Must Reject)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
