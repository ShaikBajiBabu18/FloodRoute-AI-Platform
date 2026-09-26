import { Request, Response } from 'express';
import { WeatherService, weatherService } from './weather.service';

export class WeatherController {
  constructor(private service: WeatherService = weatherService) {}

  getLiveWeather = async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lng) parameters are required.' });
      }

      if (lat < 6 || lat > 38 || lng < 68 || lng > 98) {
        return res.status(400).json({ error: 'Coordinates are outside of India region coverage.' });
      }

      const weather = await this.service.getWeather(lat, lng);
      return res.json(weather);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve weather data.' });
    }
  };

  getForecast = async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: 'Valid lat and lng query parameters are required.' });
      }

      const weather = await this.service.getWeather(lat, lng);
      return res.json({
        forecast: weather,
        current: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
        sourceMeta: weather.sourceMeta,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve weather forecast.' });
    }
  };

  getAlerts = async (req: Request, res: Response) => {
    try {
      const alerts = await this.service.getActiveAlerts();
      return res.json({ alerts });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve weather alerts.' });
    }
  };
}

export const weatherController = new WeatherController();
