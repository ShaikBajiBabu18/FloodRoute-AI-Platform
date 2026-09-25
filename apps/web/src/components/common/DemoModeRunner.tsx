import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  Sparkles,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  MapPin,
  CloudRain,
  Navigation,
  Camera,
  Bot,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

interface DemoStepInfo {
  step: number;
  title: string;
  description: string;
  icon: any;
  actionText: string;
  targetUrl: string;
}

const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    title: '1. National GIS India Overview',
    description: 'Scanning satellite precipitation anomalies and multi-state disaster floodplains.',
    icon: MapPin,
    actionText: 'Load National GIS Map',
    targetUrl: '/live-map',
  },
  {
    step: 2,
    title: '2. Search Target Vulnerable Hub: Chennai',
    description: 'Auto-geocoding Velachery low-lying basin (Elevation: 4.2m MSL).',
    icon: MapPin,
    actionText: 'Focus Velachery Basin',
    targetUrl: '/live-map?lat=12.9805&lng=80.2195&zoom=14',
  },
  {
    step: 3,
    title: '3. Multi-Provider Weather Ingestion',
    description: 'IMD & Open-Meteo telemetry detects 34.2 mm/h heavy monsoon cloudburst.',
    icon: CloudRain,
    actionText: 'Analyze Atmospheric Telemetry',
    targetUrl: '/weather',
  },
  {
    step: 4,
    title: '4. Flood-Aware Route Calculation',
    description: 'OSRM routing engine intersects hazard buffers and generates 3 corridor options.',
    icon: Navigation,
    actionText: 'Compare FASTEST vs SAFEST Routes',
    targetUrl: '/route-planner',
  },
  {
    step: 5,
    title: '5. Citizen Hazard Report Submission',
    description: 'Crowdsourced submission: FR-2026-000182 with flooded road photo upload.',
    icon: Camera,
    actionText: 'Inspect Hazard Report',
    targetUrl: '/report-hazard',
  },
  {
    step: 6,
    title: '6. AI Computer Vision Segmentation',
    description: 'FastAPI microservice segments water surface: 94% confidence, impassable for cars.',
    icon: Bot,
    actionText: 'View AI Neural Analysis',
    targetUrl: '/live-map?report=FR-2026-000182',
  },
  {
    step: 7,
    title: '7. Disaster Command Verification',
    description: 'NDRF state moderator corroborates traffic cameras and marks status VERIFIED.',
    icon: ShieldCheck,
    actionText: 'Approve Incident in Admin Operations',
    targetUrl: 'http://localhost:5174',
  },
  {
    step: 8,
    title: '8. Real-time Public Map Dispatch',
    description: 'WebSocket broadcasts report.verified across all citizen navigation systems.',
    icon: CheckCircle,
    actionText: 'Verify Live Map Broadcast',
    targetUrl: '/live-map',
  },
  {
    step: 9,
    title: '9. Official NDMA Alert Generated',
    description: 'Emergency broadcast triggered: Chembarambakkam reservoir outflow warning.',
    icon: AlertTriangle,
    actionText: 'View Active Alert Ribbon',
    targetUrl: '/disaster-alerts',
  },
  {
    step: 10,
    title: '10. Incident Analytics Hub Updated',
    description: 'Command center aggregations record new closure, updating district risk score to 78/100.',
    icon: BarChart3,
    actionText: 'Review District Analytics',
    targetUrl: '/districts',
  },
];

export const DemoModeRunner: React.FC = () => {
  const { openDemoModal, setOpenDemoModal, readAloud } = useAccessibility();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!openDemoModal || !isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < DEMO_STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 7000); // 7 seconds per showcase step

    return () => clearTimeout(timer);
  }, [openDemoModal, isPlaying, currentStepIndex]);

  if (!openDemoModal) return null;

  const currentStep = DEMO_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
  };

  const handleNavigateStep = () => {
    if (currentStep.targetUrl.startsWith('http')) {
      window.open(currentStep.targetUrl, '_blank');
    } else {
      window.location.href = currentStep.targetUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl p-6 sm:p-8 bg-slate-900 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/20 text-slate-100 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsPlaying(false);
            setOpenDemoModal(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/30">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading flex items-center gap-2">
              FloodRoute AI Verse
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                Cinematic Hackathon Presentation
              </span>
            </h2>
            <p className="text-xs text-slate-400">10-Step End-to-End Autonomous Disaster Response Showcase</p>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              STEP {currentStep.step} OF {DEMO_STEPS.length}
            </span>
            <span className="text-cyan-400 font-bold">{Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Active Showcase Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-xl space-y-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-1">
              <StepIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-heading">{currentStep.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={handleNavigateStep}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>{currentStep.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => readAloud(`${currentStep.title}. ${currentStep.description}`)}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
            >
              Narrate Voiceover
            </button>
          </div>
        </div>

        {/* Step Chips Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none mb-4">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => handleStepClick(idx)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all ${
                idx === currentStepIndex
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : idx < currentStepIndex
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.step}. {s.title.split('.')[1]?.trim().slice(0, 14)}...
            </button>
          ))}
        </div>

        {/* Control Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isPlaying ? 'Pause Auto-Play' : 'Resume Auto-Play'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Restart Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              if (currentStepIndex < DEMO_STEPS.length - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                setOpenDemoModal(false);
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            {currentStepIndex < DEMO_STEPS.length - 1 ? 'Next Step' : 'Finish Presentation'}
          </button>
        </div>
      </div>
    </div>
  );
};
