import React, { useState, useEffect } from 'react';
import { DistrictTelemetry } from '@floodroute/shared';
import { API_BASE } from '../services/api';
import {
  Building2,
  Search,
  CloudRain,
  AlertTriangle,
  ShieldCheck,
  Hospital,
  Car,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DistrictCommandPage: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictTelemetry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictTelemetry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/districts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.districts) {
          setDistricts(data.districts);
          setSelectedDistrict(data.districts[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredDistricts = districts.filter(
    (d) =>
      d.districtName.toLowerCase().includes(search.toLowerCase()) ||
      d.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4" />
            National Disaster Management Authority (NDMA) • District Integrated Command
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            District Command View
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time district-level weather, active reports, road closures, alerts, resources, and risk scores.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search district or state..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading district disaster telemetry...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: District List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Monitored Indian Districts ({filteredDistricts.length})
            </h3>
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredDistricts.map((d) => (
                <div
                  key={d.districtName}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedDistrict?.districtName === d.districtName
                      ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{d.districtName}</h4>
                      <p className="text-[11px] text-slate-400">{d.state}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.riskScore >= 75
                            ? 'bg-rose-500 text-white'
                            : d.riskScore >= 50
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-sky-500 text-white'
                        }`}
                      >
                        {d.riskScore}/100
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">{d.weather.rainfallMm} mm/h</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected District Command Dashboard */}
          {selectedDistrict && (
            <div className="lg:col-span-2 space-y-6">
              {/* Main Banner Card */}
              <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-mono text-cyan-400 font-bold">
                      DISTRICT EMERGENCY PROFILE
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      {selectedDistrict.districtName}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedDistrict.state} • Coordinates: {selectedDistrict.coordinates.lat.toFixed(4)},{' '}
                      {selectedDistrict.coordinates.lng.toFixed(4)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Vulnerability Index</div>
                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-heading">
                      {selectedDistrict.riskScore}/100
                    </div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                        selectedDistrict.riskScore >= 75
                          ? 'bg-rose-500 text-white'
                          : selectedDistrict.riskScore >= 50
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-sky-500 text-white'
                      }`}
                    >
                      {selectedDistrict.riskLevel} ALERT
                    </span>
                  </div>
                </div>

                {/* 4 Core Telemetry Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Weather */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <CloudRain className="w-5 h-5 text-cyan-400 mb-2" />
                    <div className="text-[10px] text-slate-400 uppercase">Precipitation</div>
                    <div className="text-base font-bold text-white font-mono">{selectedDistrict.weather.rainfallMm} mm/h</div>
                    <div className="text-[10px] text-slate-400 truncate">{selectedDistrict.weather.condition}</div>
                  </div>

                  {/* Active Reports */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mb-2" />
                    <div className="text-[10px] text-slate-400 uppercase">Citizen Reports</div>
                    <div className="text-base font-bold text-white font-mono">{selectedDistrict.reportsCount} Verified</div>
                    <div className="text-[10px] text-slate-400">Ground Inundation</div>
                  </div>

                  {/* Road Closures */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <Car className="w-5 h-5 text-rose-400 mb-2" />
                    <div className="text-[10px] text-slate-400 uppercase">Road Closures</div>
                    <div className="text-base font-bold text-white font-mono">{selectedDistrict.roadClosuresCount} Closed</div>
                    <div className="text-[10px] text-slate-400">Barricaded / Blocked</div>
                  </div>

                  {/* Relief Shelters */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <Hospital className="w-5 h-5 text-emerald-400 mb-2" />
                    <div className="text-[10px] text-slate-400 uppercase">Nodal Centers</div>
                    <div className="text-base font-bold text-white font-mono">{selectedDistrict.resourcesCount} Active</div>
                    <div className="text-[10px] text-slate-400">Hospitals & Shelters</div>
                  </div>
                </div>

                {/* Population At Risk Banner */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Estimated Population in Inundation Corridor:</div>
                    <div className="text-lg font-bold text-slate-100 font-mono">
                      ~{selectedDistrict.populationAtRisk.toLocaleString()} Residents
                    </div>
                  </div>
                  <a
                    href={`/live-map?lat=${selectedDistrict.coordinates.lat}&lng=${selectedDistrict.coordinates.lng}&zoom=13`}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    Open in GIS Map <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
