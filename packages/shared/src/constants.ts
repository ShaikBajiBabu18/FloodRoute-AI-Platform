export const INDIA_MAP_BOUNDS = {
  minLon: 68.1,
  minLat: 6.7,
  maxLon: 97.4,
  maxLat: 35.7,
  centerLon: 78.9629,
  centerLat: 20.5937,
  defaultZoom: 5,
};

export const RISK_LEVELS = {
  LOW: { label: 'LOW RISK', min: 0, max: 24, color: '#10B981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  MODERATE: { label: 'MODERATE CAUTION', min: 25, max: 49, color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  HIGH: { label: 'HIGH RISK', min: 50, max: 74, color: '#F97316', bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  CRITICAL: { label: 'CRITICAL / FLOODED', min: 75, max: 100, color: '#EF4444', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
};

export const MAP_LEGEND_COLORS = {
  SAFE: '#10B981',       // Green
  CAUTION: '#F59E0B',    // Yellow
  HIGH_RISK: '#F97316',  // Orange
  FLOODED: '#EF4444',    // Red
  BLOCKED: '#1E293B',    // Black / Dark Slate
  RESOURCE: '#3B82F6',   // Blue
  OFFICIAL_ALERT: '#A855F7', // Purple
};

export const DEMO_SAMPLE_LOCATIONS = [
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
];
