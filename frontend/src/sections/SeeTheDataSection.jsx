import React from 'react';
import ParticleGlobe from '../components/ParticleGlobe';

export default function SeeTheDataSection() {
  return (
    <section id="see-the-data" className="editorial-section border-t border-[#F4F1EA]/10 bg-[#07080C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Section Header */}
        <div className="space-y-4 max-w-3xl">
          <span className="chapter-tag">04 — SEE THE DATA</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F4F1EA] tracking-tight leading-tight">
            The Observation Universe.
          </h2>
          <p className="text-[#9AA0A6] text-base sm:text-lg leading-relaxed font-sans font-light">
            A physical point-density particle sphere charting global cosmic event geometry. Suspended at 2,200 meters above sea level atop Roque de los Muchachos on the Atlantic island of La Palma, the twin MAGIC reflectors observe Cherenkov air showers triggered by distant galactic sources.
          </p>
        </div>

        {/* Dedicated Full-Width Visualization Area */}
        <div className="w-full relative border border-[#F4F1EA]/10 bg-[#050608] min-h-[560px] sm:min-h-[640px] flex flex-col justify-between p-6 sm:p-10">
          
          {/* Top Telemetry Overlay */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 pointer-events-none">
            <div className="space-y-1">
              <span className="font-mono text-[10px] tracking-widest text-[#E08A3C] uppercase block">
                PRIMARY DETECTOR SITE
              </span>
              <span className="font-serif text-xl sm:text-2xl text-[#F4F1EA]">
                Roque de los Muchachos Observatory
              </span>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs text-[#9AA0A6]">
              <div>
                <span className="text-[10px] block uppercase text-[#9AA0A6]/60">COORDINATES</span>
                <span className="text-[#F4F1EA]">28.76°N, 17.89°W</span>
              </div>
              <div className="border-l border-[#F4F1EA]/10 pl-6">
                <span className="text-[10px] block uppercase text-[#9AA0A6]/60">ALTITUDE</span>
                <span className="text-[#E08A3C]">2,200m ASL</span>
              </div>
              <div className="border-l border-[#F4F1EA]/10 pl-6 hidden md:block">
                <span className="text-[10px] block uppercase text-[#9AA0A6]/60">MIRROR SURFACE</span>
                <span className="text-[#F4F1EA]">236 m²</span>
              </div>
            </div>
          </div>

          {/* Interactive Three.js Particle Globe Canvas */}
          <div className="w-full h-[400px] sm:h-[480px] my-2">
            <ParticleGlobe />
          </div>

          {/* Bottom Interaction Guide & Atmospheric Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 pt-4 border-t border-[#F4F1EA]/10 text-xs font-mono text-[#9AA0A6]">
            <div className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-[#E08A3C] animate-pulse inline-block" />
              <span>DRAG TO ROTATE SPHERE • SCROLL TO ADJUST CAMERA DISTANCE</span>
            </div>
            <span>STOCHASTIC CONTINENTAL POINT DENSITY (N = 2,600 PARTICLES)</span>
          </div>

        </div>

      </div>
    </section>
  );
}
