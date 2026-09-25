import React, { useState } from 'react';
import { Bell, X, Check, CloudRain, AlertTriangle, Car, ShieldAlert, Home } from 'lucide-react';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({ isOpen, onClose }) => {
  const [prefs, setPrefs] = useState({
    heavyRain: true,
    verifiedFlood: true,
    roadClosure: true,
    officialAlert: true,
    shelterNearby: false,
  });
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('floodroute_notification_prefs', JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl p-6 sm:p-7 bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-6 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">Notification Preferences</h3>
            <p className="text-xs text-slate-400">Configure proactive life-safety alerts</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Heavy Rainfall */}
          <div
            onClick={() => handleToggle('heavyRain')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Heavy Rainfall Nearby</div>
                <div className="text-[11px] text-slate-400">Alert when rain exceeds 20 mm/h within 5km</div>
              </div>
            </div>
            <input type="checkbox" checked={prefs.heavyRain} readOnly className="rounded text-cyan-500 w-4 h-4 cursor-pointer" />
          </div>

          {/* Verified Flood Ahead */}
          <div
            onClick={() => handleToggle('verifiedFlood')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Verified Flood Ahead</div>
                <div className="text-[11px] text-slate-400">Instant notification when active route is compromised</div>
              </div>
            </div>
            <input type="checkbox" checked={prefs.verifiedFlood} readOnly className="rounded text-cyan-500 w-4 h-4 cursor-pointer" />
          </div>

          {/* Road Closures */}
          <div
            onClick={() => handleToggle('roadClosure')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Road Closure Updates</div>
                <div className="text-[11px] text-slate-400">Barricades, submerged subways and diversions</div>
              </div>
            </div>
            <input type="checkbox" checked={prefs.roadClosure} readOnly className="rounded text-cyan-500 w-4 h-4 cursor-pointer" />
          </div>

          {/* Official Alerts */}
          <div
            onClick={() => handleToggle('officialAlert')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Official Disaster Alerts</div>
                <div className="text-[11px] text-slate-400">NDMA, CWC dam discharge & Cyclone bulletins</div>
              </div>
            </div>
            <input type="checkbox" checked={prefs.officialAlert} readOnly className="rounded text-cyan-500 w-4 h-4 cursor-pointer" />
          </div>

          {/* Shelter Nearby */}
          <div
            onClick={() => handleToggle('shelterNearby')}
            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">Emergency Shelter Proximity</div>
                <div className="text-[11px] text-slate-400">High-ground safe shelters when risk is elevated</div>
              </div>
            </div>
            <input type="checkbox" checked={prefs.shelterNearby} readOnly className="rounded text-cyan-500 w-4 h-4 cursor-pointer" />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          <span>{saved ? 'Preferences Saved!' : 'Save Notification Preferences'}</span>
        </button>
      </div>
    </div>
  );
};
