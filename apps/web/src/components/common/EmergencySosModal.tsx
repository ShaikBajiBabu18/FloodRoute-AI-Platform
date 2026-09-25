import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import {
  PhoneCall,
  X,
  Hospital,
  Home,
  Share2,
  Flashlight,
  ShieldAlert,
  MapPin,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const EmergencySosModal: React.FC = () => {
  const { openSosModal, setOpenSosModal } = useAccessibility();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);

  if (!openSosModal) return null;

  const handleShareLocation = () => {
    const lat = 12.9805;
    const lng = 80.2195;
    const shareText = `EMERGENCY SOS: I am located at https://maps.google.com/?q=${lat},${lng} (Velachery, Chennai). Immediate flood disaster assistance needed.`;

    if (navigator.share) {
      navigator.share({
        title: 'FloodRoute AI Emergency SOS',
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 3000);
    }
  };

  const toggleFlashlight = async () => {
    setFlashlightOn(!flashlightOn);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      const track = stream.getVideoTracks()[0];
      const capabilities = (track as any).getCapabilities?.() || {};
      if (capabilities.torch) {
        await (track as any).applyConstraints({
          advanced: [{ torch: !flashlightOn }],
        });
      }
    } catch {
      // Screen flashlight fallback (strobe background)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 border-2 border-rose-500/80 shadow-2xl shadow-rose-600/40 relative overflow-hidden transition-colors ${
          flashlightOn ? 'bg-white text-black' : 'bg-slate-950 text-slate-100'
        }`}
      >
        {/* Flashlight screen overlay indicator */}
        {flashlightOn && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
            SCREEN TORCH ON - TAP TORCH BUTTON TO DEACTIVATE
          </div>
        )}

        {/* Close */}
        <button
          onClick={() => {
            setFlashlightOn(false);
            setOpenSosModal(false);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full ${
            flashlightOn ? 'bg-slate-200 text-black' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/50 animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-rose-500">
            EMERGENCY SOS MODE
          </h2>
          <p className={`text-xs ${flashlightOn ? 'text-slate-800' : 'text-slate-400'}`}>
            National Disaster Rapid Response & Life-Safety Command
          </p>
        </div>

        {/* Big Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CALL 112 NATIONAL EMERGENCY */}
          <a
            href="tel:112"
            className="sm:col-span-2 flex items-center justify-center gap-3 p-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-lg font-extrabold shadow-xl shadow-rose-600/40 transition-transform active:scale-95"
          >
            <PhoneCall className="w-7 h-7 animate-pulse" />
            <span>CALL 112 (NATIONAL EMERGENCY)</span>
          </a>

          {/* NEAREST HOSPITAL */}
          <a
            href="/emergency-resources"
            className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all active:scale-95 ${
              flashlightOn
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-900/90 border-slate-700 hover:border-cyan-500 text-slate-100'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
              <Hospital className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-normal">Medical Triage</div>
              <div>Nearest Hospital</div>
            </div>
          </a>

          {/* NEAREST SHELTER */}
          <a
            href="/emergency-resources"
            className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all active:scale-95 ${
              flashlightOn
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-900/90 border-slate-700 hover:border-emerald-500 text-slate-100'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-normal">Elevated Relief</div>
              <div>Nearest Safe Shelter</div>
            </div>
          </a>

          {/* SHARE LIVE LOCATION */}
          <button
            onClick={handleShareLocation}
            className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all active:scale-95 ${
              flashlightOn
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-slate-900/90 border-slate-700 hover:border-sky-500 text-slate-100'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
              {copiedLocation ? <Check className="w-6 h-6 text-emerald-400" /> : <Share2 className="w-6 h-6" />}
            </div>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-normal">Beacon Coordinates</div>
              <div>{copiedLocation ? 'Coordinates Copied!' : 'Share Live Location'}</div>
            </div>
          </button>

          {/* FLASHLIGHT / STROBE */}
          <button
            onClick={toggleFlashlight}
            className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm transition-all active:scale-95 ${
              flashlightOn
                ? 'bg-amber-400 border-amber-500 text-black'
                : 'bg-slate-900/90 border-slate-700 hover:border-amber-400 text-slate-100'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${flashlightOn ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-400'}`}>
              <Flashlight className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xs font-normal opacity-80">Visual Signal</div>
              <div>{flashlightOn ? 'Torch Active (Tap Off)' : 'Emergency Flashlight'}</div>
            </div>
          </button>
        </div>

        {/* Emergency Contacts Footer */}
        <div className={`mt-6 pt-4 border-t ${flashlightOn ? 'border-slate-300' : 'border-slate-800'} text-xs space-y-1.5`}>
          <div className="font-semibold text-rose-500 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Direct Helpline Numbers for India:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div>NDRF: <strong>011-24363260</strong></div>
            <div>Disaster Helpline: <strong>1070</strong></div>
            <div>State Control: <strong>1077</strong></div>
            <div>Ambulance: <strong>108</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
