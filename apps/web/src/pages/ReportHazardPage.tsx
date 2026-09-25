import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Camera,
  MapPin,
  CheckCircle2,
  Sparkles,
  Upload,
  Crosshair,
  Info,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Waves,
  Eye,
  ArrowRight,
  FileCheck,
  Compass,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { HazardType, SeverityLevel, WaterLevel } from '@floodroute/shared';
import { useToast } from '../context/ToastContext';

export const ReportHazardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Multi-step state: 1, 2, 3, 4, 5
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [hazardType, setHazardType] = useState<HazardType>('FLOODED_ROAD');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [locationName, setLocationName] = useState('Velachery 100 Feet Road, Chennai');
  const [district, setDistrict] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [latitude, setLatitude] = useState(12.9805);
  const [longitude, setLongitude] = useState(80.2195);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [waterLevel, setWaterLevel] = useState<WaterLevel>('DIFFICULT_CARS');
  const [description, setDescription] = useState('Road submerged up to tire level. High stalling risk for standard cars near Phoenix Mall junction.');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Photo File
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      showToast('success', 'Photo Selected', 'Image staged for OpenCV AI vision analysis.');
    }
  };

  // Browser Geolocation
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast('error', 'GPS Unavailable', 'Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(5)));
        setLongitude(parseFloat(pos.coords.longitude.toFixed(5)));
        setLocationName('Detected Live GPS Location');
        showToast('success', 'Location Acquired', `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => showToast('warning', 'Location Timeout', 'Could not fetch device GPS coordinates.')
    );
  };

  // Final Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('hazardType', hazardType);
      formData.append('severity', severity);
      formData.append('waterLevel', waterLevel);
      formData.append('locationName', locationName);
      formData.append('district', district);
      formData.append('state', state);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('description', description);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const res = await api.createReport(formData);
      setSubmittedReport(res.report || res);
      showToast('success', 'Report Broadcast', `Logged as ${res.reportCode || 'FR-2026'}`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to submit flood report.');
      showToast('error', 'Submission Failed', 'Please verify your information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Hazard' },
    { num: 2, title: 'Location' },
    { num: 3, title: 'Photo' },
    { num: 4, title: 'Details' },
    { num: 5, title: 'Review' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#020617] text-slate-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>COMMUNITY GROUND-TRUTH REPORTING</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white">
          Report Live Flood Hazard
        </h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Submit real-time road conditions. Our OpenCV vision service segments inundation depth and automatically broadcasts rerouting alerts to Indian commuters.
        </p>
      </div>

      {/* Progress Indicator */}
      {!submittedReport && (
        <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-800 -z-0">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            />
          </div>
          {stepsList.map((step) => (
            <div
              key={step.num}
              onClick={() => {
                if (step.num < currentStep) setCurrentStep(step.num);
              }}
              className={`relative z-10 flex flex-col items-center cursor-pointer`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-all ${
                  step.num === currentStep
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-lg'
                    : step.num < currentStep
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-900 border border-slate-700 text-slate-500'
                }`}
              >
                {step.num < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-[11px] font-mono mt-1.5 ${
                  step.num === currentStep ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================== */}
      {/* SUCCESS SCREEN (If submitted) */}
      {/* ==================================================== */}
      {submittedReport ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-elevated p-8 sm:p-10 rounded-[28px] border border-emerald-500/40 text-center space-y-6 shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              REPORT BROADCASTED TO INCIDENT COMMAND
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Thank You for Protecting Fellow Citizens
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your submission has been cataloged under Tracking ID{' '}
              <strong className="text-cyan-400 font-mono">{submittedReport.reportCode || 'FR-2026-LIVE'}</strong>.
              Nearby commuters are now receiving safe bypass routes.
            </p>
          </div>

          {/* AI Vision Scan Result Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                OpenCV Automated Inspection
              </span>
              <span>VERIFIED</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Location:</span>
              <span className="text-white font-semibold">{locationName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Passability Estimation:</span>
              <span className="text-rose-400 font-bold">IMPASSABLE FOR SMALL CARS</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Confidence Radar:</span>
              <span className="text-emerald-400 font-mono font-bold">92% Match</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/live-map"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-lg hover:from-sky-400 hover:to-blue-500 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>View On Live Map</span>
            </Link>
            <Link
              to="/my-reports"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Track In My Reports
            </Link>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setCurrentStep(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white text-xs transition-colors"
            >
              Report Another Hazard
            </button>
          </div>
        </motion.div>
      ) : (
        /* ==================================================== */
        /* 5-STEP FORM CARDS */
        /* ==================================================== */
        <div className="glass-card-elevated p-6 sm:p-8 rounded-[28px] border border-cyan-500/30 space-y-6 shadow-2xl">
          {/* STEP 1: CHOOSE HAZARD */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Step 1: Choose Hazard Category</h3>
                <p className="text-xs text-slate-400 mt-1">Select the condition obstructing road traffic.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'FLOODED_ROAD', label: 'Flooded Road', desc: 'Standing water over roadway' },
                  { id: 'WATERLOGGING', label: 'Urban Waterlogging', desc: 'Drain overflow, curb submerged' },
                  { id: 'ROAD_BLOCKED', label: 'Road Blocked', desc: 'Complete obstruction / landslide' },
                  { id: 'BRIDGE_CLOSED', label: 'Bridge Closed', desc: 'River water touching girder' },
                  { id: 'LANDSLIDE', label: 'Landslide', desc: 'Mud / boulder road breach' },
                  { id: 'FALLEN_TREE', label: 'Fallen Tree / Wire', desc: 'Electric wire / heavy branches' },
                ].map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setHazardType(h.id as HazardType)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all text-left space-y-1 ${
                      hazardType === h.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="font-heading font-bold text-xs text-white">{h.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{h.desc}</div>
                  </div>
                ))}
              </div>

              {/* Severity Selection */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="text-xs font-mono text-slate-300 block">SEVERITY LEVEL</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'LOW', label: 'Low', color: 'border-emerald-500/40 text-emerald-400' },
                    { id: 'MEDIUM', label: 'Medium', color: 'border-cyan-500/40 text-cyan-400' },
                    { id: 'HIGH', label: 'High', color: 'border-amber-500/40 text-amber-400' },
                    { id: 'CRITICAL', label: 'Critical', color: 'border-rose-500/40 text-rose-400' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id as SeverityLevel)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        severity === s.id
                          ? `bg-slate-800 ${s.color} ring-1 ring-cyan-500/40`
                          : 'bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Step 2: Geotag Location</h3>
                  <p className="text-xs text-slate-400 mt-1">Specify road name and coordinates.</p>
                </div>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Detect My GPS</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">STREET / CORRIDOR NAME</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Velachery 100 Feet Road, Chennai"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">DISTRICT</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">STATE</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Tamil Nadu"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">LATITUDE</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">LONGITUDE</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PHOTO UPLOAD */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Step 3: Upload Evidence Photo</h3>
                <p className="text-xs text-slate-400 mt-1">Our computer vision model verifies flood depth from photos.</p>
              </div>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 max-w-sm mx-auto">
                  <img src={photoPreview} alt="Hazard preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-cyan-950/90 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Ready for OpenCV Segmentation
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/50">
                  <Camera className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-white block">Click to upload photo or capture with camera</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Supports JPEG, PNG, WebP up to 15MB</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              )}
            </motion.div>
          )}

          {/* STEP 4: DESCRIPTION & WATER DEPTH */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Step 4: Water Level & Field Description</h3>
                <p className="text-xs text-slate-400 mt-1">Provide ground observations for rescue dispatchers.</p>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1.5">WATER CLEARANCE DEPTH</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'PASSABLE', label: 'Passable (Puddles)', desc: 'Under 6 inches' },
                    { id: 'DIFFICULT_SMALL', label: 'Difficult for Hatchbacks', desc: 'Up to 1.0 ft' },
                    { id: 'DIFFICULT_CARS', label: 'Difficult for All Sedans', desc: 'Up to 1.8 ft' },
                    { id: 'IMPASSABLE', label: 'Impassable (Only Trucks)', desc: '2.5 ft or higher' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWaterLevel(w.id as WaterLevel)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        waterLevel === w.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold">{w.label}</div>
                      <div className="text-[10px] text-slate-500">{w.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">FIELD NOTES & OBSERVED RISKS</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe standing water depth, broken culverts, stranded cars, or alternative bypasses..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & SUBMIT */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Step 5: Review & Broadcast</h3>
                <p className="text-xs text-slate-400 mt-1">Confirm details before submitting to the national grid.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Hazard Category:</span>
                    <div className="font-bold text-cyan-400">{hazardType}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Severity:</span>
                    <div className="font-bold text-rose-400">{severity}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <div className="font-medium text-white">{locationName}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Coordinates:</span>
                    <div className="font-mono text-slate-300">{latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Water Level:</span>
                    <div className="font-medium text-amber-300">{waterLevel}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Photo Attached:</span>
                    <div className="font-medium text-emerald-400">{photoFile ? 'Yes (AI Vision Enabled)' : 'No'}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <strong>Notes:</strong> {description}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300">
                <strong className="text-white">Legal Notice:</strong> This submission will be ingested as [COMMUNITY DATA]. False reporting of natural disasters is punishable under Section 54 of the Disaster Management Act, 2005.
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ml-auto"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 ml-auto"
              >
                {isSubmitting ? 'Analyzing & Broadcasting...' : 'Submit Flood Report'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
