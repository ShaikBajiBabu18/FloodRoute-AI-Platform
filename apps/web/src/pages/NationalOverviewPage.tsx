import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  AlertTriangle,
  CloudRain,
  Car,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

interface StateData {
  id: string;
  name: string;
  capital: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentRainfallMm: number;
  reportsCount: number;
  activeAlertsCount: number;
  roadClosuresCount: number;
  districts: string[];
}

const INDIAN_STATES: StateData[] = [
  {
    id: 'TN',
    name: 'Tamil Nadu',
    capital: 'Chennai',
    riskScore: 78,
    riskLevel: 'CRITICAL',
    currentRainfallMm: 34.2,
    reportsCount: 28,
    activeAlertsCount: 3,
    roadClosuresCount: 8,
    districts: ['Chennai', 'Chengalpattu', 'Kanchipuram', 'Tiruvallur', 'Cuddalore', 'Madurai', 'Coimbatore'],
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    capital: 'Mumbai',
    riskScore: 74,
    riskLevel: 'CRITICAL',
    currentRainfallMm: 28.4,
    reportsCount: 32,
    activeAlertsCount: 2,
    roadClosuresCount: 9,
    districts: ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Raigad', 'Ratnagiri', 'Pune', 'Kolhapur'],
  },
  {
    id: 'KA',
    name: 'Karnataka',
    capital: 'Bengaluru',
    riskScore: 62,
    riskLevel: 'HIGH',
    currentRainfallMm: 19.5,
    reportsCount: 16,
    activeAlertsCount: 1,
    roadClosuresCount: 4,
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Dakshina Kannada', 'Udupi', 'Kodagu', 'Shivamogga'],
  },
  {
    id: 'AS',
    name: 'Assam',
    capital: 'Dispur / Guwahati',
    riskScore: 86,
    riskLevel: 'CRITICAL',
    currentRainfallMm: 45.0,
    reportsCount: 41,
    activeAlertsCount: 4,
    roadClosuresCount: 14,
    districts: ['Kamrup Metropolitan', 'Kamrup', 'Darrang', 'Nagaon', 'Morigaon', 'Dhubri', 'Barpeta'],
  },
  {
    id: 'BR',
    name: 'Bihar',
    capital: 'Patna',
    riskScore: 68,
    riskLevel: 'HIGH',
    currentRainfallMm: 24.0,
    reportsCount: 19,
    activeAlertsCount: 2,
    roadClosuresCount: 5,
    districts: ['Patna', 'Bhagalpur', 'Katihar', 'Purnia', 'Muzaffarpur', 'Darbhanga', 'Vaishali'],
  },
  {
    id: 'KL',
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    riskScore: 52,
    riskLevel: 'HIGH',
    currentRainfallMm: 14.5,
    reportsCount: 11,
    activeAlertsCount: 1,
    roadClosuresCount: 2,
    districts: ['Ernakulam', 'Wayanad', 'Idukki', 'Alappuzha', 'Kottayam', 'Thrissur', 'Kozhikode'],
  },
  {
    id: 'TG',
    name: 'Telangana',
    capital: 'Hyderabad',
    riskScore: 54,
    riskLevel: 'HIGH',
    currentRainfallMm: 16.0,
    reportsCount: 9,
    activeAlertsCount: 1,
    roadClosuresCount: 3,
    districts: ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal', 'Khammam', 'Karimnagar'],
  },
  {
    id: 'DL',
    name: 'National Capital Territory of Delhi',
    capital: 'New Delhi',
    riskScore: 48,
    riskLevel: 'MODERATE',
    currentRainfallMm: 10.2,
    reportsCount: 7,
    activeAlertsCount: 1,
    roadClosuresCount: 2,
    districts: ['Central Delhi', 'East Delhi', 'North Delhi', 'South Delhi', 'West Delhi', 'New Delhi'],
  },
  {
    id: 'WB',
    name: 'West Bengal',
    capital: 'Kolkata',
    riskScore: 65,
    riskLevel: 'HIGH',
    currentRainfallMm: 22.0,
    reportsCount: 18,
    activeAlertsCount: 2,
    roadClosuresCount: 4,
    districts: ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Purba Medinipur'],
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    capital: 'Gandhinagar',
    riskScore: 42,
    riskLevel: 'MODERATE',
    currentRainfallMm: 6.5,
    reportsCount: 5,
    activeAlertsCount: 0,
    roadClosuresCount: 1,
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Kutch'],
  },
];

export const NationalOverviewPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData>(INDIAN_STATES[0]);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredStates = INDIAN_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.capital.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          National Disaster Management Authority (NDMA) • All-India Dashboard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
          State Analytics & National Flood Intelligence
        </h1>
        <p className="text-sm text-slate-400">
          Interactive national overview: Select any State to inspect vulnerable districts, flood reports, rainfall intensity, and road conditions.
        </p>
      </div>

      {/* Main Grid: Left Interactive State Map & List, Right Detailed State Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive States Navigator (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              States & Union Territories ({filteredStates.length})
            </h3>
            <input
              type="text"
              value={filterQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterQuery(e.target.value)}
              placeholder="Filter states..."
              className="px-3 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-36"
            />
          </div>

          {/* Interactive State Cards */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredStates.map((s) => {
              const isSelected = selectedState.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedState(s)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 font-mono">[{s.id}]</span>
                      <h4 className="text-sm font-bold text-white font-heading">{s.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">{s.capital}</p>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.riskScore >= 75
                            ? 'bg-rose-500 text-white'
                            : s.riskScore >= 50
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-sky-500 text-white'
                        }`}
                      >
                        {s.riskScore}/100
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{s.currentRainfallMm} mm/h</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected State Intelligence Command Hub (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-6">
            {/* Title & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs uppercase tracking-wider font-mono text-cyan-400 font-bold">
                  STATE DISASTER DOSSIER
                </span>
                <h2 className="text-3xl font-extrabold text-white font-heading">{selectedState.name}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  State Emergency Operations Centre (SEOC) • Capital: {selectedState.capital}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedState.riskScore >= 75
                      ? 'bg-rose-500 text-white animate-pulse'
                      : selectedState.riskScore >= 50
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-sky-500 text-white'
                  }`}
                >
                  {selectedState.riskLevel} VULNERABILITY
                </span>
                <div className="text-2xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mt-1">
                  {selectedState.riskScore}/100 Score
                </div>
              </div>
            </div>

            {/* 4 State Telemetry KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <CloudRain className="w-5 h-5 text-cyan-400 mb-1" />
                <div className="text-[10px] text-slate-400 uppercase">Rainfall Peak</div>
                <div className="text-lg font-bold text-white font-mono">{selectedState.currentRainfallMm} mm/h</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <AlertTriangle className="w-5 h-5 text-amber-400 mb-1" />
                <div className="text-[10px] text-slate-400 uppercase">Active Reports</div>
                <div className="text-lg font-bold text-white font-mono">{selectedState.reportsCount} Reports</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <Car className="w-5 h-5 text-rose-400 mb-1" />
                <div className="text-[10px] text-slate-400 uppercase">Road Closures</div>
                <div className="text-lg font-bold text-white font-mono">{selectedState.roadClosuresCount} Roads</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
                <div className="text-[10px] text-slate-400 uppercase">Official Alerts</div>
                <div className="text-lg font-bold text-white font-mono">{selectedState.activeAlertsCount} NDMA</div>
              </div>
            </div>

            {/* Vulnerable Districts Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300">
                Priority Vulnerable Districts in {selectedState.name} ({selectedState.districts.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedState.districts.map((dist, idx) => (
                  <a
                    key={idx}
                    href={`/districts`}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/60 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{dist}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`/live-map?state=${encodeURIComponent(selectedState.name)}`}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>View {selectedState.name} on Live GIS Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="/route-planner"
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Plan Inter-State Evacuation Route &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
