import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Upload,
  Crosshair,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { HazardType, SeverityLevel, WaterLevel, AIAnalysisResult } from '@floodroute/shared';

export const ReportHazardPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [hazardType, setHazardType] = useState<HazardType>('FLOODED_ROAD');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [waterLevel, setWaterLevel] = useState<WaterLevel>('DIFFICULT_CARS');
  const [locationName, setLocationName] = useState('Velachery 100 Feet Road, Chennai');
  const [latitude, setLatitude] = useState(12.9805);
  const [longitude, setLongitude] = useState(80.2195);
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Submission & status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Image Selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Use Browser Geolocation
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(parseFloat(pos.coords.latitude.toFixed(5)));
        setLongitude(parseFloat(pos.coords.longitude.toFixed(5)));
        setLocationName(`Current GPS (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`);
      },
      () => {
        alert('Location permission was not granted. Search for a location manually.');
      }
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 5) {
      setErrorMessage('Please provide a description of at least 5 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('hazardType', hazardType);
    formData.append('severity', severity);
    formData.append('waterLevel', waterLevel);
    formData.append('locationName', locationName);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('description', description);

    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      const res = await api.createReport(formData);
      setSubmittedReport(res);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <PlusCircle className="w-6 h-6 text-rose-500" />
          <span>Report Flood or Road Hazard</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Crowdsource ground conditions to alert fellow commuters and activate municipal disaster response.
        </p>
      </div>

      {submittedReport ? (
        /* Submission Success Confirmation */
        <div className="glass-panel-elevated p-8 rounded-2xl border border-emerald-500/40 space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">Report Received Successfully</h2>
            <p className="text-xs text-slate-400">
              Your field incident report has been securely registered on the disaster grid.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Report Code:</span>
              <span className="font-bold text-cyan-400 text-sm">{submittedReport.reportCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Moderation Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PENDING VERIFICATION
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-200">{submittedReport.report?.locationName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reported At:</span>
              <span className="text-slate-200">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* AI Vision Telemetry Preview */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2 text-xs text-left">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI-Assisted Image Analysis Pipeline</span>
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              If an image was uploaded, it is currently undergoing OpenCV segmentation for water surface turbidity, axle clearance, and lane obstruction.
            </div>
            <div className="text-[10px] text-slate-500 italic pt-1 border-t border-cyan-900/50">
              AI-assisted estimate. Not an official disaster determination.
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSubmittedReport(null);
                setDescription('');
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700"
            >
              Submit Another Report
            </button>
            <button
              onClick={() => navigate('/live-map')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20"
            >
              View on Live Map
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            {/* 1. Hazard Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                1. Hazard Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'FLOODED_ROAD', label: 'Flooded Road', icon: '🌊' },
                  { id: 'WATERLOGGING', label: 'Waterlogging', icon: '🌧️' },
                  { id: 'ROAD_BLOCKED', label: 'Road Blocked', icon: '⛔' },
                  { id: 'BRIDGE_CLOSED', label: 'Bridge Closed', icon: '🌉' },
                  { id: 'LANDSLIDE', label: 'Landslide', icon: '⛰️' },
                  { id: 'FALLEN_TREE', label: 'Fallen Tree', icon: '🌳' },
                  { id: 'ACCIDENT', label: 'Accident', icon: '⚠️' },
                  { id: 'OTHER', label: 'Other', icon: '📌' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHazardType(item.id as HazardType)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      hazardType === item.id
                        ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-md font-bold'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Severity & Water Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Severity */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  2. Severity Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'LOW', label: 'LOW', color: 'text-emerald-400' },
                    { id: 'MEDIUM', label: 'MEDIUM', color: 'text-amber-400' },
                    { id: 'HIGH', label: 'HIGH', color: 'text-orange-400' },
                    { id: 'CRITICAL', label: 'CRITICAL', color: 'text-rose-400' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id as SeverityLevel)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                        severity === s.id
                          ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 ' + s.color
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  3. Water Depth / Passability
                </label>
                <select
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(e.target.value as WaterLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="PASSABLE">Road Passable (Surface Water)</option>
                  <option value="DIFFICULT_SMALL">Difficult for Small Vehicles / Two-Wheelers</option>
                  <option value="DIFFICULT_CARS">Difficult for Cars / Sedans</option>
                  <option value="IMPASSABLE">Vehicles Cannot Pass (Complete Submergence)</option>
                  <option value="UNKNOWN">Unknown Depth</option>
                </select>
              </div>
            </div>

            {/* 3. Location Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  4. Location Information
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  Use Current GPS Location
                </button>
              </div>

              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Velachery 100 Feet Road, Chennai or landmark"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-900">
                  Latitude: <span className="text-white">{latitude}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-900">
                  Longitude: <span className="text-white">{longitude}</span>
                </div>
              </div>
            </div>

            {/* 4. Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                5. Field Observation Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current water depth, stranded vehicles, lane blockages, or municipal pumps in action..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            {/* 5. Photo Upload & AI Image Processing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center justify-between">
                <span>6. Photo Evidence (Optional)</span>
                <span className="text-cyan-400 font-normal text-[10px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Auto-Analysis Enabled
                </span>
              </label>

              <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-950/30">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block space-y-2">
                  {photoPreview ? (
                    <div className="space-y-2">
                      <img
                        src={photoPreview}
                        alt="Flood evidence preview"
                        className="max-h-48 rounded-xl mx-auto object-cover border border-slate-700 shadow-lg"
                      />
                      <span className="text-xs text-cyan-400 underline block">Change image</span>
                    </div>
                  ) : (
                    <div className="space-y-1 py-4">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                      <div className="text-xs text-slate-300 font-semibold">Click to upload photo</div>
                      <div className="text-[11px] text-slate-500 font-mono">JPEG, PNG or WebP up to 10MB</div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Submitting & Analyzing with Vision Engine...' : 'Submit Report'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
