import { Router } from 'express';
import { weatherController } from './weather.controller';

const router = Router();

router.get('/live', weatherController.getLiveWeather);
router.get('/current', weatherController.getLiveWeather);
router.get('/forecast', weatherController.getForecast);
router.get('/alerts', weatherController.getAlerts);

export default router;
