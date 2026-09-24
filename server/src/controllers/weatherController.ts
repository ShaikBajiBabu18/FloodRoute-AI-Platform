import { Request, Response } from 'express';
import { weatherService } from '../services/weatherService';

export class WeatherController {
  async getCurrent(req: Request, res: Response) {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) query parameters are required.' });
    }

    try {
      const forecast = await weatherService.getWeather(lat, lng);
      return res.json({
        weather: forecast.current,
        source: forecast.current.source,
        timestamp: forecast.current.timestamp,
        latitude: lat,
        longitude: lng,
        sourceMeta: forecast.sourceMeta,
      });
    } catch (err: any) {
      return res.status(503).json({
        error: 'Weather data temporarily unavailable.',
        details: err.message,
      });
    }
  }

  async getForecast(req: Request, res: Response) {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) query parameters are required.' });
    }

    try {
      const forecast = await weatherService.getWeather(lat, lng);
      return res.json({
        forecast,
        source: forecast.current.source,
        timestamp: forecast.current.timestamp,
        latitude: lat,
        longitude: lng,
      });
    } catch (err: any) {
      return res.status(503).json({
        error: 'Weather forecast temporarily unavailable.',
        details: err.message,
      });
    }
  }
}

export const weatherController = new WeatherController();
