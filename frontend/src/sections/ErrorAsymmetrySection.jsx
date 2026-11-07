import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ErrorAsymmetrySection() {
  return (
    <section className="editorial-section border-t border-[#F4F1EA]/10 bg-[#07080C] pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Subheader */}
        <div className="space-y-3 max-w-3xl">
          <span className="chapter-tag">ASTROPHYSICAL COST ASYMMETRY</span>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#F4F1EA] tracking-tight">
            Why Error Direction Carries Unequal Scientific Penalty.
          </h3>
          <p className="text-[#9AA0A6] text-sm sm:text-base leading-relaxed font-sans font-light">
            In standard machine learning benchmarks, false positives and false negatives receive equal penalty weights. In observational gamma-ray astronomy, however, error directions produce starkly disparate scientific consequences.
          </p>
        </div>

        {/* Dual Error Direction Comparison Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/10 border border-[#F4F1EA]/10">
          
          {/* Critical Error: Hadron -> Gamma */}
          <div className="p-8 sm:p-10 bg-[#0B0D13] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F4F1EA]/5 pb-3">
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest">
                CRITICAL ASYMMETRIC ERROR
              </span>
              <span className="font-mono text-[10px] text-amber-400 border border-amber-400/30 px-2 py-0.5">
                FALSE ALARM
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm font-mono text-[#F4F1EA]">
              <span className="text-[#5B8EA6]">Hadron (Background)</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span className="text-[#E08A3C]">Predicted Gamma (Signal)</span>
            </div>

            <p className="text-xs text-[#9AA0A6] font-sans font-light leading-relaxed">
              When a diffuse hadronic cosmic ray shower mimics an electromagnetic gamma shower, the telescope registers a ghost photon. Because hadrons outnumber gammas heavily in nature, high false alarm rates create spurious point sources and pollute celestial catalogs.
            </p>

            <div className="p-4 border border-[#F4F1EA]/10 bg-[#07080C] text-xs font-mono text-[#9AA0A6] space-y-1">
              <span className="text-[#F4F1EA] block text-[10px] uppercase font-semibold">OBSERVATORY IMPACT:</span>
              <p className="font-sans font-light text-[11px]">
                Requires strict ROC-AUC threshold tuning to suppress background leakage below 1-5%.
              </p>
            </div>
          </div>

          {/* Secondary Error: Gamma -> Hadron */}
          <div className="p-8 sm:p-10 bg-[#0B0D13] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F4F1EA]/5 pb-3">
              <span className="font-mono text-[10px] text-[#9AA0A6] uppercase tracking-widest">
                OPERATIONAL EFFICIENCY LOSS
              </span>
              <span className="font-mono text-[10px] text-[#9AA0A6] border border-[#F4F1EA]/15 px-2 py-0.5">
                MISSED SIGNAL
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm font-mono text-[#F4F1EA]">
              <span className="text-[#E08A3C]">Gamma (Signal)</span>
              <ArrowRight className="w-4 h-4 text-[#9AA0A6]" />
              <span className="text-[#5B8EA6]">Predicted Hadron (Background)</span>
            </div>

            <p className="text-xs text-[#9AA0A6] font-sans font-light leading-relaxed">
              When a genuine gamma-ray photon is mistakenly classified as a background cosmic ray, the event is filtered out. The telescope loses sensitivity and requires longer integration times, but the scientific purity of surviving data remains uncorrupted.
            </p>

            <div className="p-4 border border-[#F4F1EA]/10 bg-[#07080C] text-xs font-mono text-[#9AA0A6] space-y-1">
              <span className="text-[#F4F1EA] block text-[10px] uppercase font-semibold">OBSERVATORY IMPACT:</span>
              <p className="font-sans font-light text-[11px]">
                Reduces total photon statistics on faint targets, necessitating longer telescope exposure runs.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
