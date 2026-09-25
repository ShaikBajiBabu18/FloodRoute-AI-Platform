import { Router } from 'express';
import { floodController } from './flood.controller';

const router = Router();

router.get('/risk', floodController.getRisk);
router.get('/predict', floodController.predictFlood);
router.post('/predict', floodController.predictFlood);
router.get('/zones', floodController.getZones);
router.get('/reports', floodController.getFloodReports);
router.get('/river-stages', floodController.getRiverStages);

export default router;
