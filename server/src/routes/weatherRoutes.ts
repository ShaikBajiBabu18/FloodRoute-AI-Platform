import { Router } from 'express';
import { weatherController } from '../controllers/weatherController';

const router = Router();

router.get('/current', (req, res, next) => weatherController.getCurrent(req, res).catch(next));
router.get('/forecast', (req, res, next) => weatherController.getForecast(req, res).catch(next));

export default router;
