import React, { useState } from 'react';
import { useDemo, DEMO_STEPS } from '../../context/DemoContext';
import {
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Eye,
  Layers,
  MapPin,
  ShieldAlert,
  Radio,
  X,
  CheckCircle2,
} from 'lucide-react';

export const DemoControlPanel: React.FC = () => {
  const {
    isDemoMode,
    setDemoMode,
    activeStep,
    isAutoPlaying,
    setIsAutoPlaying,
    startDemo,
    resetDemo,
    nextStep,
    prevStep,
    jumpToStep,
    demoConfig,
    showDemoModal,
    setShowDemoModal,
  } = useDemo();

  const [minimized, setMinimized] = useState<boolean>(false);

  // Current active step info
  const currentStepInfo =
    activeStep > 0 && activeStep <= DEMO_STEPS.length
      ? DEMO_STEPS[activeStep - 1]
      : null;

  return (
    <>
      {/* Floating Demo Control Strip at Top-Right / Bottom */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all">
        <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 shadow-2xl p-2 sm:p-2.5 flex items-center gap-2 text-slate-100 max-w-[95vw]">
          {/* Live vs Demo Data Indicator Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
              isDemoMode
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
            }`}
            title={
              isDemoMode
                ? 'Demo Mode active: using model estimates & demo scenarios'
                : 'Connected to Live Open-Meteo & Database'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span className="hidden sm:inline">
              {isDemoMode ? 'DEMO MODE' : 'LIVE DATA'}
            </span>
            <span className="sm:hidden">{isDemoMode ? 'DEMO' : 'LIVE'}</span>
          </div>

          {/* Primary Action: Start Demo / View Demo Flow */}
          {!showDemoModal ? (
            <button
              onClick={startDemo}
              className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Demo</span>
            </button>
          ) : (
            <button
              onClick={() => setShowDemoModal(true)}
              className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 font-bold text-xs flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Show Demo Modal</span>
            </button>
          )}

          {/* Reset Demo Button */}
          {isDemoMode && (
            <button
              onClick={resetDemo}
              className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
              title="Reset Demo to Initial Live State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          )}

          {/* Step Quick Controls if active */}
          {isDemoMode && activeStep > 0 && (
            <div className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={prevStep}
                disabled={activeStep <= 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                title="Previous Demo Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-sky-400 font-bold">
                {activeStep}/{DEMO_STEPS.length}
              </span>
              <button
                onClick={nextStep}
                disabled={activeStep >= DEMO_STEPS.length}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                title="Next Demo Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
