import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  CloudRain,
  ShieldAlert,
  BarChart3,
  Layers,
  Bell,
  Home,
  Navigation,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  X,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Info,
  Waves,
  Bot,
  PhoneCall,
  Clock,
  Compass,
} from 'lucide-react';
import { useDemo, DEMO_STEPS } from '../../context/DemoContext';
import { DataSourceBadge } from '../ui/DataSourceBadge';

interface OneClickJudgeDemoProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const OneClickJudgeDemo: React.FC<OneClickJudgeDemoProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const navigate = useNavigate();
  const {
    isDemoMode,
    activeStep,
    isAutoPlaying,
    setIsAutoPlaying,
    nextStep,
    prevStep,
    jumpToStep,
    resetDemo,
    demoConfig,
    showDemoModal,
    setShowDemoModal,
  } = useDemo();

  const isVisible = propIsOpen !== undefined ? propIsOpen : showDemoModal;
  const handleClose = propOnClose !== undefined ? propOnClose : () => setShowDemoModal(false);

  // Default to step 1 if activeStep is 0
  const currentStep = activeStep > 0 ? activeStep : 1;
  const totalSteps = 7;

  // Auto-play timer
  useEffect(() => {
    if (!isVisible || !isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < totalSteps) {
        nextStep();
      } else {
        setIsAutoPlaying(false);
      }
    }, 5500);

    return () => clearTimeout(timer);
  }, [isVisible, isAutoPlaying, currentStep, nextStep]);

  if (!isVisible) return null;

  const stepLabels = [
    'Location',
    'Weather',
    'Flood Risk',
    'Alerts',
    'Emergency Services',
    'Route Analysis',
    'AI Explanation',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-3xl bg-slate-900 border-2 border-sky-500/50 shadow-2xl shadow-sky-500/20 text-slate-100 relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                  FloodRoute AI • Presentation Demo Mode
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  DEMO SCENARIO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Predictable 7-Stage Walkthrough with Transparent Model Estimates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoPlaying ? 'Pause Flow' : 'Auto Play'}</span>
            </button>

            <button
              onClick={resetDemo}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              title="Close Demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Pills */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;
            return (
              <button
                key={label}
                onClick={() => jumpToStep(stepNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-400/50'
                    : isCompleted
                    ? 'bg-slate-800/90 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{stepNum}.</span>
                <span>{label}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Animated Progress Bar */}
        <div className="px-6 pt-3 pb-1 shrink-0">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span className="font-bold text-sky-400">
              STAGE {currentStep} OF {totalSteps}: {stepLabels[currentStep - 1]}
            </span>
            <span className="text-slate-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Viewport */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <AnimatePresence mode="wait">
            {/* STAGE 1: LOCATION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        1. Demo Location: {demoConfig.location.name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        CONFIGURED DEMO HUB
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Target metropolitan basin selected for simulation. Configurable via environment variables (<code>DEMO_LOCATION_NAME</code>).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Geographic Coordinates</div>
                    <div className="text-base font-bold text-white font-mono">
                      {demoConfig.location.latitude.toFixed(4)}° N, {demoConfig.location.longitude.toFixed(4)}° E
                    </div>
                    <div className="text-[11px] text-slate-400">Sub-meter GPS precision</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Terrain Elevation</div>
                    <div className="text-base font-bold text-amber-400">
                      {demoConfig.location.elevationMsl}m MSL (Low-Lying Basin)
                    </div>
                    <div className="text-[11px] text-slate-400">Vulnerable to natural ponding</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Drainage Catchment</div>
                    <div className="text-base font-bold text-cyan-400 truncate">
                      {demoConfig.location.drainageBasin}
                    </div>
                    <div className="text-[11px] text-slate-400">Stormwater discharge canal</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-sky-400" />
                    <div>
                      <div className="text-xs font-bold text-white">Live GIS Map State Ready</div>
                      <div className="text-[11px] text-slate-400">Centered with 4-tier risk heatmap overlay</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/live-map');
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>View on Live Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: WEATHER */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-start gap-3">
                  <CloudRain className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        2. Weather Telemetry: {demoConfig.weather.condition}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        FORECAST DATA / OPEN-METEO
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Continuous meteorological precipitation monitoring assimilating numerical radar models.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Rain Rate</div>
                    <div className="text-2xl font-extrabold text-rose-400 font-mono">
                      {demoConfig.weather.rainfallMmH} <span className="text-xs font-normal">mm/h</span>
                    </div>
                    <div className="text-[11px] text-rose-300">Heavy Cloudburst</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">24h Accumulation</div>
                    <div className="text-2xl font-extrabold text-amber-400 font-mono">
                      {demoConfig.weather.accumulation24hMm} <span className="text-xs font-normal">mm</span>
                    </div>
                    <div className="text-[11px] text-amber-300">Saturating Catchment</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Temperature</div>
                    <div className="text-2xl font-extrabold text-white font-mono">
                      {demoConfig.weather.tempC}°C
                    </div>
                    <div className="text-[11px] text-slate-400">High Humidity ({demoConfig.weather.humidity}%)</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 uppercase font-mono">Wind Gusts</div>
                    <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                      {demoConfig.weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Monsoon Squall</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Precipitation data feeds directly into hydrological runoff exceedance algorithm.</span>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/weather');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>Full Weather Deck</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: FLOOD RISK (REQUIREMENT 8) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                {/* LARGE VISUALLY CLEAR RISK CARD */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/15 via-slate-900 to-slate-950 border-2 border-orange-500/40 shadow-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-500/20 pb-4">
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <span>FLOOD RISK</span>
                      </div>
                      <h3 className="font-heading font-extrabold text-2xl text-white mt-1">
                        Risk Level: <span className="text-orange-400">{demoConfig.floodRisk.level}</span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-xs text-slate-400 font-mono">RISK SCORE</div>
                        <div className="text-3xl font-extrabold text-orange-400 font-mono">
                          {demoConfig.floodRisk.score}
                          <span className="text-sm font-normal text-slate-400">/100</span>
                        </div>
                      </div>
                      <div className="border-l border-slate-800 pl-4">
                        <div className="text-xs text-slate-400 font-mono">CONFIDENCE</div>
                        <div className="text-xl font-bold text-emerald-400 font-mono">
                          {demoConfig.floodRisk.confidence}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WHY? Section with Factors */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-sky-400" />
                      <span>Why? Multi-Factor Hydrological Attribution:</span>
                    </div>

                    <div className="space-y-2">
                      {demoConfig.floodRisk.factors.slice(0, 3).map((factor, idx) => (
                        <div
                          key={factor.name}
                          className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>Factor {idx + 1}: {factor.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-sky-300">
                                Weight: {factor.weight}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[11px]">{factor.description}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-amber-400 text-sm">
                              {factor.score}/100
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statutory Label */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="text-amber-300 font-semibold">
                      🏷️ Model-estimated risk
                    </span>
                    <span>Advisory guidance only. Not official government certification.</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: ALERTS */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Bell className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        4. Active Disaster Alerts & Warnings
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        SIMULATED SCENARIO
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Synthesized disaster alert feed modeled after NDMA and SDMA regional flood bulletins.
                    </p>
                  </div>
                </div>

                {demoConfig.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-5 rounded-3xl bg-slate-950 border-2 border-amber-500/40 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-orange-500 text-white font-extrabold text-xs">
                          {alert.severity} ALERT
                        </span>
                        <span className="text-xs font-mono text-slate-400">{alert.id}</span>
                      </div>
                      <span className="text-xs text-slate-400">{alert.issuedBy}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{alert.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>

                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                      <strong>Civil Defense Guidance:</strong> {alert.guidance}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* STAGE 5: EMERGENCY SERVICES */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                  <Home className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        5. Verified High-Ground Relief Shelters
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        HIGH GROUND INDEX
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Relief centers mapped with verified elevation above MSL, bed capacities, and direct 112 emergency line.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demoConfig.emergencyServices.map((shelter) => (
                    <div
                      key={shelter.name}
                      className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                          {shelter.type}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          Elev: {shelter.elevationMsl}m MSL
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{shelter.name}</h4>
                      <div className="text-xs text-slate-400">
                        {shelter.distance} • Capacity: {shelter.capacity} persons
                      </div>
                      <div className="text-xs text-emerald-300 font-semibold">{shelter.status}</div>

                      <div className="pt-2 flex items-center gap-2">
                        <a
                          href={`tel:${shelter.phone}`}
                          className="flex-1 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call 112</span>
                        </a>
                        <button
                          onClick={() => {
                            handleClose();
                            navigate(`/route-planner?to=${encodeURIComponent(shelter.name)}`);
                          }}
                          className="flex-1 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Safe Route</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STAGE 6: ROUTE PRESENTATION (REQUIREMENT 9) */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3">
                  <Navigation className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        6. Demonstration Route Comparison
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        OPENSTREETMAP / OSRM
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      <strong>Origin:</strong> {demoConfig.route.originName} →{' '}
                      <strong>Destination:</strong> {demoConfig.route.destinationName}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* RECOMMENDED ROUTE */}
                  <div className="p-5 rounded-3xl bg-slate-950 border-2 border-emerald-500/60 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs">
                        RECOMMENDED CORRIDOR
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {demoConfig.routeComparison.safestRoute.durationMins} MINS
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {demoConfig.routeComparison.safestRoute.name}
                    </h4>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div>
                        <strong>Distance:</strong> {demoConfig.routeComparison.safestRoute.distanceKm} km
                      </div>
                      <div>
                        <strong>Estimated Travel Time:</strong>{' '}
                        {demoConfig.routeComparison.safestRoute.durationMins} minutes
                      </div>
                      <div className="text-emerald-400 font-bold">
                        <strong>Exposure:</strong> {demoConfig.routeComparison.safestRoute.riskExposure}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {demoConfig.routeComparison.safestRoute.hazardNotes}
                      </div>
                    </div>
                  </div>

                  {/* DIRECT HIGH-RISK ROUTE */}
                  <div className="p-5 rounded-3xl bg-slate-950 border-2 border-rose-500/40 space-y-3 opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs">
                        DIRECT PATH (HIGH RISK)
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-400">
                        {demoConfig.routeComparison.directRoute.durationMins} MINS
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {demoConfig.routeComparison.directRoute.name}
                    </h4>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div>
                        <strong>Distance:</strong> {demoConfig.routeComparison.directRoute.distanceKm} km
                      </div>
                      <div>
                        <strong>Estimated Travel Time:</strong>{' '}
                        {demoConfig.routeComparison.directRoute.durationMins} minutes
                      </div>
                      <div className="text-rose-400 font-bold">
                        <strong>Exposure:</strong> {demoConfig.routeComparison.directRoute.riskExposure}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {demoConfig.routeComparison.directRoute.hazardNotes}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono text-center">
                  ⚠️ Note: Labeled as <strong>"Lower modeled flood-risk exposure"</strong> rather than &quot;guaranteed safe.&quot;
                </div>
              </motion.div>
            )}

            {/* STAGE 7: AI EXPLANATION (REQUIREMENT 10) */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-sky-500/40 flex items-start gap-3">
                  <Bot className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">
                        7. Context-Aware AI Explanation
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                        NEURAL COPILOT
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Automatic context assimilation translating hydrometeorology into plain-language transit guidance.
                    </p>
                  </div>
                </div>

                {/* Pre-Loaded Context Summary Card */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono font-bold text-sky-400 uppercase">
                    Auto-Loaded Situational Context
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Selected Location:</span>
                      <strong className="text-white">{demoConfig.location.name}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Current Weather:</span>
                      <strong className="text-cyan-300">
                        {demoConfig.weather.rainfallMmH} mm/h ({demoConfig.weather.condition})
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Flood Risk:</span>
                      <strong className="text-orange-400">
                        {demoConfig.floodRisk.score}/100 ({demoConfig.floodRisk.level})
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Main Contributing Factor:</span>
                      <strong className="text-amber-300">Heavy Cloudburst Rain (35% Weight)</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-200 leading-relaxed">
                    {demoConfig.aiExplanation.initialSummary}
                  </div>
                </div>

                {/* Sample Inquiry Questions */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 uppercase font-mono">
                    Frequently Asked Presentation Inquiries:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {demoConfig.aiExplanation.sampleQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          handleClose();
                          // trigger copilot inquiry
                          window.dispatchEvent(new CustomEvent('open_copilot_with_query', { detail: { query: q } }));
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white text-xs font-medium border border-slate-700 transition-all"
                      >
                        <span>💬 &quot;{q}&quot;</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80 shrink-0">
          <button
            onClick={prevStep}
            disabled={currentStep <= 1}
            className="h-11 px-4 sm:px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="h-11 px-6 sm:px-8 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Next Stage</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                handleClose();
                navigate('/live-map');
              }}
              className="h-11 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Live Map</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
