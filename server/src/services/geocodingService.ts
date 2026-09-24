import axios from 'axios';
import { ENV } from '../config/env';
import { LocationSearchResult } from '@floodroute/shared';

const geocodeCache = new Map<string, LocationSearchResult[]>();

// Pre-seeded major Indian landmark & city directory for zero-latency fallbacks
const KNOWN_INDIAN_LOCATIONS: LocationSearchResult[] = [
  { displayName: 'Velachery, Chennai, Tamil Nadu', name: 'Velachery', district: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 12.9805, longitude: 80.2195 },
  { displayName: 'Tidel Park, Tharamani, Chennai, Tamil Nadu', name: 'Tidel Park', district: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 12.9892, longitude: 80.2483 },
  { displayName: 'Central Silk Board, Bengaluru, Karnataka', name: 'Silk Board', district: 'Bengaluru Urban', state: 'Karnataka', country: 'India', latitude: 12.9177, longitude: 77.6238 },
  { displayName: 'Kurla West, Mumbai, Maharashtra', name: 'Kurla', district: 'Mumbai Suburban', state: 'Maharashtra', country: 'India', latitude: 19.0688, longitude: 72.8790 },
  { displayName: 'Moosarambagh, Hyderabad, Telangana', name: 'Moosarambagh', district: 'Hyderabad', state: 'Telangana', country: 'India', latitude: 17.3753, longitude: 78.5098 },
  { displayName: 'Marina Beach, Chennai, Tamil Nadu', name: 'Marina Beach', district: 'Chennai', state: 'Tamil Nadu', country: 'India', latitude: 13.0499, longitude: 80.2824 },
  { displayName: 'Connaught Place, New Delhi, Delhi', name: 'Connaught Place', district: 'New Delhi', state: 'Delhi', country: 'India', latitude: 28.6315, longitude: 77.2167 },
  { displayName: 'Howrah Bridge, Kolkata, West Bengal', name: 'Howrah Bridge', district: 'Kolkata', state: 'West Bengal', country: 'India', latitude: 22.5851, longitude: 88.3468 },
  { displayName: 'Prakasam Barrage, Vijayawada, Andhra Pradesh', name: 'Prakasam Barrage', district: 'Krishna', state: 'Andhra Pradesh', country: 'India', latitude: 16.5074, longitude: 80.6050 },
  { displayName: 'Brahmaputra Riverfront, Guwahati, Assam', name: 'Brahmaputra Riverfront', district: 'Kamrup Metropolitan', state: 'Assam', country: 'India', latitude: 26.1850, longitude: 91.7450 },
  { displayName: 'MG Road, Kochi, Kerala', name: 'MG Road', district: 'Ernakulam', state: 'Kerala', country: 'India', latitude: 9.9723, longitude: 76.2783 },
  { displayName: 'RK Beach, Visakhapatnam, Andhra Pradesh', name: 'RK Beach', district: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', latitude: 17.7126, longitude: 83.3213 },
];

export class GeocodingService {
  async search(query: string): Promise<LocationSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const cacheKey = trimmed.toLowerCase();
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey)!;
    }

    try {
      const response = await axios.get(`${ENV.GEOCODING_API_URL}/search`, {
        params: {
          q: trimmed,
          format: 'json',
          addressdetails: 1,
          limit: 8,
          countrycodes: 'in', // Restrict strictly to India coverage
        },
        headers: {
          'User-Agent': 'FloodRoute-AI-Disaster-Platform/1.0 (contact@floodroute.ai)',
          'Accept-Language': 'en-IN,en;q=0.9',
        },
        timeout: 4000,
      });

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const results: LocationSearchResult[] = response.data.map((item: any) => {
          const addr = item.address || {};
          const district = addr.state_district || addr.county || addr.city_district || addr.district;
          const state = addr.state;
          const name = item.name || addr.suburb || addr.neighbourhood || addr.city || addr.town || addr.village || trimmed;

          return {
            id: item.place_id ? String(item.place_id) : undefined,
            displayName: item.display_name,
            name,
            district,
            state,
            country: addr.country || 'India',
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            type: item.type,
          };
        });

        geocodeCache.set(cacheKey, results);
        return results;
      }
    } catch (err) {
      console.warn('[GeocodingService] Nominatim request failed. Falling back to local index.', err);
    }

    // Fallback: match known locations
    const matches = KNOWN_INDIAN_LOCATIONS.filter(loc =>
      loc.displayName.toLowerCase().includes(cacheKey) ||
      loc.name.toLowerCase().includes(cacheKey) ||
      (loc.district && loc.district.toLowerCase().includes(cacheKey)) ||
      (loc.state && loc.state.toLowerCase().includes(cacheKey))
    );

    return matches;
  }
}

export const geocodingService = new GeocodingService();
