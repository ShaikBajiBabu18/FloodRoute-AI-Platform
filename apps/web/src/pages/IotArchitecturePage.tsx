import React from 'react';
import { Cpu, Wifi, Radio, Eye, Camera, ShieldCheck, Database, Server, Smartphone, Layers } from 'lucide-react';

export const IotArchitecturePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          Hardware & Edge Telemetry Ingestion Pipeline
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-white">
          IoT, Drone & Edge Sensor Grid Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Comprehensive multi-layer topology connecting physical river ultrasonic sensors, tipping bucket rain gauges, municipal traffic CCTVs, drone orthomosaics, and citizen reports into the neural risk engine.
        </p>
      </div>

      {/* Primary SVG Architecture Diagram */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <Layers className="w-5 h-5 text-cyan-400" />
            End-to-End Disaster Telemetry Topology
          </h2>
          <span className="text-xs font-mono text-emerald-400">Zero External Image Dependencies • Native SVG</span>
        </div>

        {/* Scalable High-Fidelity SVG Diagram */}
        <div className="w-full overflow-x-auto bg-[#030712] rounded-2xl p-4 sm:p-6 border border-slate-800/80">
          <svg viewBox="0 0 1100 540" className="w-full min-w-[850px] h-auto font-sans" fill="none">
            <defs>
              <linearGradient id="gradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Background Grid Pattern */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            <rect width="1100" height="540" fill="url(#gridPattern)" />

            {/* ================= COLUMN 1: FIELD SENSOR LAYER ================= */}
            <text x="120" y="35" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1" textAnchor="middle">
              1. PERCEPTUAL EDGE SENSORS
            </text>

            {/* Sensor 1: IoT Ultrasonic Water Sensor */}
            <g transform="translate(30, 60)">
              <rect width="180" height="75" rx="12" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
              <circle cx="30" cy="38" r="14" fill="#0369a1" />
              <text x="30" y="42" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">IoT</text>
              <text x="60" y="32" fill="#f8fafc" fontSize="12" fontWeight="600">Ultrasonic Water</text>
              <text x="60" y="48" fill="#94a3b8" fontSize="10">Culverts & River Canals</text>
              <text x="60" y="62" fill="#38bdf8" fontSize="9" fontFamily="monospace">LoRaWAN / 865 MHz</text>
            </g>

            {/* Sensor 2: Tipping Bucket Rain Gauge */}
            <g transform="translate(30, 150)">
              <rect width="180" height="75" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <circle cx="30" cy="38" r="14" fill="#0891b2" />
              <text x="30" y="42" fill="#67e8f9" fontSize="11" fontWeight="700" textAnchor="middle">IMD</text>
              <text x="60" y="32" fill="#f8fafc" fontSize="12" fontWeight="600">Digital Rain Gauges</text>
              <text x="60" y="48" fill="#94a3b8" fontSize="10">0.2mm Precision Bucket</text>
              <text x="60" y="62" fill="#67e8f9" fontSize="9" fontFamily="monospace">Telemetry Satellite Grid</text>
            </g>

            {/* Sensor 3: Traffic CCTV Feeds */}
            <g transform="translate(30, 240)">
              <rect width="180" height="75" rx="12" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="30" cy="38" r="14" fill="#1d4ed8" />
              <text x="30" y="42" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle">CAM</text>
              <text x="60" y="32" fill="#f8fafc" fontSize="12" fontWeight="600">Municipal CCTVs</text>
              <text x="60" y="48" fill="#94a3b8" fontSize="10">Underpass & Junctions</text>
              <text x="60" y="62" fill="#93c5fd" fontSize="9" fontFamily="monospace">RTSP / H.264 Video Stream</text>
            </g>

            {/* Sensor 4: Drone Aerial Orthomosaics */}
            <g transform="translate(30, 330)">
              <rect width="180" height="75" rx="12" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.5" />
              <circle cx="30" cy="38" r="14" fill="#6d28d9" />
              <text x="30" y="42" fill="#c4b5fd" fontSize="11" fontWeight="700" textAnchor="middle">UAV</text>
              <text x="60" y="32" fill="#f8fafc" fontSize="12" fontWeight="600">Drone Recon Imagery</text>
              <text x="60" y="48" fill="#94a3b8" fontSize="10">NDRF Aerial Survey</text>
              <text x="60" y="62" fill="#c4b5fd" fontSize="9" fontFamily="monospace">GeoTIFF / High-Res JPG</text>
            </g>

            {/* Sensor 5: Citizen Crowdsourced Reports */}
            <g transform="translate(30, 420)">
              <rect width="180" height="75" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="30" cy="38" r="14" fill="#047857" />
              <text x="30" y="42" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">APP</text>
              <text x="60" y="32" fill="#f8fafc" fontSize="12" fontWeight="600">Citizen Community</text>
              <text x="60" y="48" fill="#94a3b8" fontSize="10">Geo-tagged Inundation</text>
              <text x="60" y="62" fill="#6ee7b7" fontSize="9" fontFamily="monospace">REST API + Multer</text>
            </g>

            {/* ================= CONNECTING BUS 1: EDGE GATEWAY ================= */}
            <path d="M 210 97 H 280 V 270 H 330" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 210 187 H 280 V 270 H 330" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 210 277 H 330" stroke="#3b82f6" strokeWidth="2" />
            <path d="M 210 367 H 280 V 270 H 330" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 210 457 H 280 V 270 H 330" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />

            {/* ================= COLUMN 2: INGESTION GATEWAY ================= */}
            <text x="420" y="195" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1" textAnchor="middle">
              2. INGESTION & BROKER
            </text>

            <g transform="translate(330, 210)">
              <rect width="180" height="120" rx="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" filter="drop-shadow(0 0 10px rgba(14,165,233,0.3))" />
              <text x="90" y="32" fill="#f8fafc" fontSize="13" fontWeight="700" textAnchor="middle">Edge Gateway Broker</text>
              <text x="90" y="52" fill="#94a3b8" fontSize="10" textAnchor="middle">MQTT / Kafka Streaming</text>
              <line x1="20" y1="64" x2="160" y2="64" stroke="#1e293b" strokeWidth="1" />
              <text x="90" y="80" fill="#38bdf8" fontSize="10" textAnchor="middle">Data Deduplication</text>
              <text x="90" y="96" fill="#38bdf8" fontSize="10" textAnchor="middle">Sensor Health Watchdog</text>
              <text x="90" y="112" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">99.98% Latency &lt; 50ms</text>
            </g>

            {/* ================= CONNECTING BUS 2: TO AI SERVICE ================= */}
            <path d="M 510 270 H 590" stroke="#38bdf8" strokeWidth="2.5" />

            {/* ================= COLUMN 3: AI PROCESSING MICROSERVICES ================= */}
            <text x="690" y="135" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1" textAnchor="middle">
              3. AI & NEURAL VISION ENGINE
            </text>

            <g transform="translate(590, 150)">
              <rect width="200" height="240" rx="18" fill="#0f172a" stroke="#818cf8" strokeWidth="2" filter="drop-shadow(0 0 12px rgba(129,140,248,0.2))" />
              <text x="100" y="32" fill="#f8fafc" fontSize="14" fontWeight="800" textAnchor="middle">AI Services Hub</text>
              <text x="100" y="50" fill="#a5b4fc" fontSize="10" textAnchor="middle">FastAPI Python Port 8000</text>
              <line x1="20" y1="62" x2="180" y2="62" stroke="#1e293b" strokeWidth="1" />

              <rect x="20" y="74" width="160" height="42" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="100" y="92" fill="#e0e7ff" fontSize="11" fontWeight="600" textAnchor="middle">Water Segmentation</text>
              <text x="100" y="106" fill="#a5b4fc" fontSize="9" textAnchor="middle">HSV Mask + Flood Density</text>

              <rect x="20" y="126" width="160" height="42" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="100" y="144" fill="#e0e7ff" fontSize="11" fontWeight="600" textAnchor="middle">Predictive Risk Model</text>
              <text x="100" y="158" fill="#a5b4fc" fontSize="9" textAnchor="middle">Multi-Variable 0-100 Score</text>

              <rect x="20" y="178" width="160" height="42" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1" />
              <text x="100" y="196" fill="#e0e7ff" fontSize="11" fontWeight="600" textAnchor="middle">Vehicle Accessibility</text>
              <text x="100" y="210" fill="#a5b4fc" fontSize="9" textAnchor="middle">Depth &amp; Stall Risk Evaluator</text>
            </g>

            {/* ================= CONNECTING BUS 3: TO CENTRAL GATEWAY ================= */}
            <path d="M 790 270 H 870" stroke="#818cf8" strokeWidth="2.5" />

            {/* ================= COLUMN 4: DISASTER COMMAND CENTER ================= */}
            <text x="970" y="115" fill="#94a3b8" fontSize="12" fontWeight="700" letterSpacing="1" textAnchor="middle">
              4. INCIDENT COMMAND
            </text>

            <g transform="translate(870, 130)">
              <rect width="200" height="280" rx="18" fill="#0f172a" stroke="#10b981" strokeWidth="2" filter="drop-shadow(0 0 12px rgba(16,185,129,0.2))" />
              <text x="100" y="32" fill="#f8fafc" fontSize="14" fontWeight="800" textAnchor="middle">NDRF Command Hub</text>
              <text x="100" y="50" fill="#6ee7b7" fontSize="10" textAnchor="middle">Central Gateway Port 5000</text>
              <line x1="20" y1="62" x2="180" y2="62" stroke="#1e293b" strokeWidth="1" />

              <rect x="20" y="74" width="160" height="46" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1" />
              <text x="100" y="94" fill="#ecfdf5" fontSize="11" fontWeight="600" textAnchor="middle">Admin Incident Portal</text>
              <text x="100" y="108" fill="#a7f3d0" fontSize="9" textAnchor="middle">Triage &amp; NDRF Dispatch</text>

              <rect x="20" y="130" width="160" height="46" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1" />
              <text x="100" y="150" fill="#ecfdf5" fontSize="11" fontWeight="600" textAnchor="middle">Citizen Live GIS Map</text>
              <text x="100" y="164" fill="#a7f3d0" fontSize="9" textAnchor="middle">OSRM Safe Route Guidance</text>

              <rect x="20" y="186" width="160" height="46" rx="8" fill="#064e3b" stroke="#059669" strokeWidth="1" />
              <text x="100" y="206" fill="#ecfdf5" fontSize="11" fontWeight="600" textAnchor="middle">Emergency Broadcast</text>
              <text x="100" y="220" fill="#a7f3d0" fontSize="9" textAnchor="middle">NDMA Sachet &amp; SMS Flash</text>

              <text x="100" y="258" fill="#10b981" fontSize="10" fontFamily="monospace" textAnchor="middle">Socket.IO Subscriptions</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Sensor Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
            <Radio className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">IoT Ultrasonic River Sensors</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Battery-operated ultrasonic time-of-flight transducers installed under bridges. Transmits millimeter-level water surface elevation via LoRaWAN at 5-minute intervals.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Drone Reconnaissance Orthomosaics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Autonomous hexacopters equipped with 4K multispectral cameras fly predefined flood basin missions. Imagery is ingested via the FastAPI microservice for surface water contouring.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Crowdsourced Ground Reality</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Citizen reports provide ground-truth corroboration. Each upload includes GPS coordinates, depth estimation, and photo integrity checksums verified by moderators.
          </p>
        </div>
      </div>
    </div>
  );
};
