import { prisma } from '../config/database';

export class WeatherRepository {
  async getCachedWeather(cacheKey: string) {
    return prisma.weatherCache.findFirst({
      where: {
        cacheKey,
        expiresAt: { gt: new Date() },
        deletedAt: null,
      },
    });
  }

  async getAnyCachedWeather(lat: number, lng: number) {
    // Find closest cached entry within 0.1 degree (~11km)
    return prisma.weatherCache.findFirst({
      where: {
        latitude: { gte: lat - 0.15, lte: lat + 0.15 },
        longitude: { gte: lng - 0.15, lte: lng + 0.15 },
        deletedAt: null,
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }

  async upsertWeatherCache(data: {
    cacheKey: string;
    latitude: number;
    longitude: number;
    locationName: string;
    temperatureC: number;
    feelsLikeC?: number;
    humidityPercent: number;
    windSpeedKmh: number;
    rainfallMm: number;
    condition: string;
    weatherRisk: string;
    payloadJson: string;
    source: string;
    expiresAt: Date;
    isDemo?: boolean;
  }) {
    return prisma.weatherCache.upsert({
      where: { cacheKey: data.cacheKey },
      create: {
        cacheKey: data.cacheKey,
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName,
        temperatureC: data.temperatureC,
        feelsLikeC: data.feelsLikeC,
        humidityPercent: data.humidityPercent,
        windSpeedKmh: data.windSpeedKmh,
        rainfallMm: data.rainfallMm,
        condition: data.condition,
        weatherRisk: data.weatherRisk,
        payloadJson: data.payloadJson,
        source: data.source,
        expiresAt: data.expiresAt,
        isDemo: data.isDemo || false,
      },
      update: {
        temperatureC: data.temperatureC,
        feelsLikeC: data.feelsLikeC,
        humidityPercent: data.humidityPercent,
        windSpeedKmh: data.windSpeedKmh,
        rainfallMm: data.rainfallMm,
        condition: data.condition,
        weatherRisk: data.weatherRisk,
        payloadJson: data.payloadJson,
        source: data.source,
        expiresAt: data.expiresAt,
        fetchedAt: new Date(),
      },
    });
  }

  async getActiveWeatherAlerts() {
    return prisma.weatherAlert.findMany({
      where: {
        isActive: true,
        expiryTime: { gt: new Date() },
        deletedAt: null,
      },
      orderBy: { startTime: 'desc' },
    });
  }
}

export const weatherRepository = new WeatherRepository();
