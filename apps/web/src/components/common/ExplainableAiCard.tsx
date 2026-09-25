import React from 'react';
import { PredictiveOutput } from '@floodroute/shared';
import { Sparkles, AlertTriangle, ShieldCheck, CheckCircle, Truck, Car, Bike, Info, ArrowUpRight } from 'lucide-react';

interface ExplainableAiCardProps {
  prediction: PredictiveOutput;
  locationTitle?: string;
  onExploreAlternateRoute?: () => void;
}

export const ExplainableAiCard: React.FC<ExplainableAiCardProps> = ({
  prediction,
  locationTitle = 'Velachery Basin, Chennai',
  onExploreAlternateRoute,
}) => {
  const { floodProbability, confidence, riskLevel, explanation, factors, accessibility, affectedRadius } = prediction;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-white',
          glow: 'shadow-rose-500/20',
        };
      case 'SEVERE':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/40',
          text: 'text-orange-400',
          badge: 'bg-orange-500 text-white',
          glow: 'shadow-orange-500/20',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500 text-slate-900',
          glow: 'shadow-amber-500/20',
        };
      case 'MODERATE':
        return {
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/40',
          text: 'text-sky-400',
          badge: 'bg-sky-500 text-white',
          glow: 'shadow-sky-500/20',
        };
      default:
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500 text-white',
          glow: 'shadow-emerald-500/20',
        };
    }
  };

  const colors = getRiskColor(riskLevel);

  const getAccessibilityIcon = (cat: string) => {
    switch (cat) {
      case 'IMPASSABLE':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'SUV_RECOMMENDED':
        return <Truck className="w-5 h-5 text-orange-400" />;
      case 'CAR_DIFFICULT':
        return <Car className="w-5 h-5 text-amber-400" />;
      case 'BIKE_ONLY':
        return <Bike className="w-5 h-5 text-sky-400" />;
      default:
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className={`rounded-2xl p-6 bg-slate-900/90 backdrop-blur-xl border ${colors.border} shadow-2xl ${colors.glow} space-y-6 relative overflow-hidden`}>
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI ESTIMATE • AI FLOOD PREDICTION
          </span>
          <span className="text-xs text-slate-400">Confidence: {confidence}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>{riskLevel} RISK</span>
          <span className="text-xs text-slate-400 font-mono">Radius: {affectedRadius} km</span>
        </div>
      </div>

      {/* Main Score & Probability Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Probability Metric */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">Flood Probability</span>
          <div className="text-5xl font-extrabold tracking-tight font-heading text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            {floodProbability}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1">Multi-variable Hydrological Projection</span>
        </div>

        {/* Natural Language Synthesis */}
        <div className="md:col-span-2 space-y-2">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Situation Assessment for {locationTitle}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
            {explanation}
          </p>
        </div>
      </div>

      {/* Road Accessibility Model */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
            {getAccessibilityIcon(accessibility.category)}
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">Vehicle Transit Model</div>
            <div className="text-sm font-bold text-slate-100">{accessibility.categoryLabel}</div>
            <div className="text-[11px] text-cyan-300 font-mono">Est. Water Depth: ~{accessibility.estimatedWaterDepthCm} cm</div>
          </div>
        </div>
        <div className="text-xs text-slate-300 max-w-sm">
          <strong>Advisory:</strong> {accessibility.recommendedAction}
        </div>
      </div>

      {/* Explainable AI: Why? Factor Breakdown with Percentages */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
          <span>Why this prediction?</span>
          <span className="text-[10px] text-cyan-400 font-normal">(Explainable Factor Contribution)</span>
        </h4>

        <div className="space-y-2.5">
          {factors.map((f, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${f.isElevated ? 'bg-amber-400' : 'bg-slate-500'}`} />
                  {f.name}
                </span>
                <span className="font-mono font-bold text-cyan-400">{f.contributionPercent}% Weight</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    f.isElevated ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, f.contributionPercent * 2.2)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Disclaimer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          ⚠️ <strong>DISCLAIMER:</strong> {prediction.disclaimer} Always follow instructions from NDMA, SDMA, and local police.
        </p>
        {onExploreAlternateRoute && (
          <button
            onClick={onExploreAlternateRoute}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium text-xs whitespace-nowrap"
          >
            Explore Elevated Bypass <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
