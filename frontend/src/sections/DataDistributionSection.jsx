import React from 'react';

export default function DataDistributionSection() {
  const gammaCount = 12332;
  const hadronCount = 6688;
  const gammaPct = 64.84;
  const hadronPct = 35.16;

  return (
    <section className="editorial-section border-t border-[#F4F1EA]/10 bg-[#07080C] pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Subheader */}
        <div className="space-y-3 max-w-3xl">
          <span className="chapter-tag">CLASS DISTRIBUTION & BASELINE BIAS</span>
          <h3 className="font-serif text-2xl sm:text-4xl font-normal text-[#F4F1EA] tracking-tight">
            Class Imbalance & The Limits of Raw Accuracy.
          </h3>
          <p className="text-[#9AA0A6] text-sm sm:text-base leading-relaxed font-sans font-light">
            The dataset features an intrinsic 65:35 signal-to-background split. A naive null classifier predicting "all gammas" would report a deceptively high 64.84% accuracy while failing completely at noise rejection.
          </p>
        </div>

        {/* Clean Proportion Bar */}
        <div className="p-8 sm:p-10 border border-[#F4F1EA]/10 bg-[#0B0D13] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs font-mono gap-2 border-b border-[#F4F1EA]/5 pb-4">
            <span className="text-[#E08A3C] uppercase tracking-wider">
              GAMMA SIGNAL: {gammaPct}% ({gammaCount.toLocaleString()} events)
            </span>
            <span className="text-[#5B8EA6] uppercase tracking-wider">
              HADRON BACKGROUND: {hadronPct}% ({hadronCount.toLocaleString()} events)
            </span>
          </div>

          <div className="w-full h-3 bg-[#141721] overflow-hidden flex">
            <div 
              className="h-full bg-[#E08A3C] transition-all duration-700"
              style={{ width: `${gammaPct}%` }}
            />
            <div 
              className="h-full bg-[#5B8EA6] transition-all duration-700"
              style={{ width: `${hadronPct}%` }}
            />
          </div>

          {/* Two-Column Physical Role Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#E08A3C] uppercase tracking-wider block">
                CLASS 0.0 • GAMMA (SIGNAL)
              </span>
              <h4 className="font-serif text-xl text-[#F4F1EA]">
                Electromagnetic Air Showers
              </h4>
              <p className="text-xs text-[#9AA0A6] font-sans font-light leading-relaxed">
                Primary cosmic photons that ionize the upper atmosphere in compact, collimated cascades. High recall ensures faint emitters are detected.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#5B8EA6] uppercase tracking-wider block">
                CLASS 1.0 • HADRON (BACKGROUND NOISE)
              </span>
              <h4 className="font-serif text-xl text-[#F4F1EA]">
                Hadronic Nuclear Showers
              </h4>
              <p className="text-xs text-[#9AA0A6] font-sans font-light leading-relaxed">
                Isotropic charged protons and nuclei that collide with atmospheric atoms, creating chaotic multi-particle showers. High precision prevents false source claims.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
