import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Sparkles, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';

export default function ModelBattleSection() {
  const [metrics, setMetrics] = useState({
    logistic_regression: {
      accuracy: 0.7875,
      precision: 0.7852,
      recall: 0.7875,
      f1_score: 0.7789,
      roc_auc: 0.8388
    },
    random_forest: {
      accuracy: 0.8407,
      precision: 0.8454,
      recall: 0.8407,
      f1_score: 0.8338,
      roc_auc: 0.8869
    }
  });

  useEffect(() => {
    api.getModelMetrics()
      .then(res => {
        if (res.logistic_regression && res.random_forest) {
          setMetrics(res);
        }
      })
      .catch(() => {});
  }, []);

  const lr = metrics.logistic_regression;
  const rf = metrics.random_forest;

  const comparisons = [
    {
      label: 'OVERALL ACCURACY',
      lrVal: (lr.accuracy * 100),
      rfVal: (rf.accuracy * 100),
      displayLr: `${(lr.accuracy * 100).toFixed(2)}%`,
      displayRf: `${(rf.accuracy * 100).toFixed(2)}%`,
      delta: `+${((rf.accuracy - lr.accuracy) * 100).toFixed(2)}%`
    },
    {
      label: 'AREA UNDER ROC (DISCRIMINATION)',
      lrVal: (lr.roc_auc * 100),
      rfVal: (rf.roc_auc * 100),
      displayLr: lr.roc_auc.toFixed(4),
      displayRf: rf.roc_auc.toFixed(4),
      delta: `+${(rf.roc_auc - lr.roc_auc).toFixed(4)}`
    },
    {
      label: 'WEIGHTED PRECISION (PURITY)',
      lrVal: (lr.precision * 100),
      rfVal: (rf.precision * 100),
      displayLr: `${(lr.precision * 100).toFixed(2)}%`,
      displayRf: `${(rf.precision * 100).toFixed(2)}%`,
      delta: `+${((rf.precision - lr.precision) * 100).toFixed(2)}%`
    },
    {
      label: 'WEIGHTED RECALL (SENSITIVITY)',
      lrVal: (lr.recall * 100),
      rfVal: (rf.recall * 100),
      displayLr: `${(lr.recall * 100).toFixed(2)}%`,
      displayRf: `${(rf.recall * 100).toFixed(2)}%`,
      delta: `+${((rf.recall - lr.recall) * 100).toFixed(2)}%`
    },
    {
      label: 'WEIGHTED F1-SCORE (HARMONIC)',
      lrVal: (lr.f1_score * 100),
      rfVal: (rf.f1_score * 100),
      displayLr: `${(lr.f1_score * 100).toFixed(2)}%`,
      displayRf: `${(rf.f1_score * 100).toFixed(2)}%`,
      delta: `+${((rf.f1_score - lr.f1_score) * 100).toFixed(2)}%`
    }
  ];

  return (
    <section id="battle" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0D13] border-t border-[#F4F1EA]/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#E08A3C]/40 bg-[#E08A3C]/10 text-[#E08A3C] text-[11px] font-mono tracking-widest uppercase">
              <Swords className="w-3.5 h-3.5" />
              <span>HEAD-TO-HEAD BENCHMARK</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#F4F1EA] font-normal tracking-tight">
              Which Model Sees the Signal Better?
            </h2>
            <p className="text-[#9BA0AA] text-sm sm:text-base leading-relaxed">
              Evaluating the 3,742 holdout test events. Random Forest systematically outperforms Logistic Regression across every single metric.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 self-start md:self-auto">
            <Trophy className="w-4 h-4" />
            <span>RANDOM FOREST WINS ALL 5 BENCHMARKS</span>
          </div>
        </div>

        {/* Head-to-Head Hero Matchup Plate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/10 border border-[#F4F1EA]/10">
          
          {/* Left: Logistic Regression */}
          <div className="p-8 sm:p-10 bg-[#07080C] space-y-4">
            <span className="font-mono text-[10px] text-[#5B8EA6] uppercase tracking-widest block">
              BASELINE LINEAR
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA] font-normal">
              Logistic Regression
            </h3>
            <div className="font-serif text-5xl sm:text-6xl text-[#9BA0AA] font-normal pt-2">
              {(lr.accuracy * 100).toFixed(2)}<span className="text-2xl font-sans">%</span>
            </div>
            <span className="font-mono text-xs text-[#5B8EA6] block">
              ROC-AUC: {lr.roc_auc.toFixed(4)} &bull; F1: {(lr.f1_score * 100).toFixed(2)}%
            </span>
          </div>

          {/* Right: Random Forest (Winner) */}
          <div className="p-8 sm:p-10 bg-[#07080C] space-y-4 relative border-t md:border-t-0 md:border-l border-[#E08A3C]/30 shadow-[inset_0_0_40px_rgba(224,138,60,0.08)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#E08A3C] uppercase tracking-widest block font-bold">
                TOP PERFORMER
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[#E08A3C] text-[#07080C] font-bold">
                +5.32% ACCURACY
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F4F1EA] font-normal">
              Random Forest (100 Trees)
            </h3>
            <div className="font-serif text-5xl sm:text-6xl text-[#E08A3C] font-normal pt-2">
              {(rf.accuracy * 100).toFixed(2)}<span className="text-2xl font-sans text-[#F4F1EA]">%</span>
            </div>
            <span className="font-mono text-xs text-[#E08A3C] block font-bold">
              ROC-AUC: {rf.roc_auc.toFixed(4)} (+0.0481) &bull; F1: {(rf.f1_score * 100).toFixed(2)}%
            </span>
          </div>

        </div>

        {/* Dynamic Metric Comparison Bars */}
        <div className="p-6 sm:p-8 border border-[#F4F1EA]/10 bg-[#07080C] space-y-8">
          <div className="flex items-center justify-between border-b border-[#F4F1EA]/10 pb-3 text-xs font-mono text-[#9BA0AA]">
            <span>METRIC COMPARISON (N = 3,742 TEST EVENTS)</span>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-[#5B8EA6]">
                <span className="w-2.5 h-2.5 bg-[#5B8EA6] inline-block" />
                Logistic Regression
              </span>
              <span className="flex items-center gap-2 text-[#E08A3C]">
                <span className="w-2.5 h-2.5 bg-[#E08A3C] inline-block" />
                Random Forest
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {comparisons.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F4F1EA] font-medium">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#5B8EA6]">{item.displayLr}</span>
                    <span className="text-[#9BA0AA]">vs</span>
                    <span className="text-[#E08A3C] font-bold">{item.displayRf}</span>
                    <span className="text-emerald-400 font-bold border-l border-[#F4F1EA]/10 pl-2">{item.delta}</span>
                  </div>
                </div>

                {/* Comparative Double Bars */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-[#141721] overflow-hidden">
                    <div
                      className="h-full bg-[#5B8EA6] transition-all duration-700"
                      style={{ width: `${item.lrVal}%` }}
                    />
                  </div>
                  <div className="w-full h-2 bg-[#141721] overflow-hidden">
                    <div
                      className="h-full bg-[#E08A3C] transition-all duration-700 shadow-[0_0_8px_rgba(224,138,60,0.4)]"
                      style={{ width: `${item.rfVal}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
