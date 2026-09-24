import { Router } from 'express';
import { floodController } from '../controllers/floodController';

const router = Router();

router.get('/risk', (req, res, next) => floodController.getRisk(req, res).catch(next));
router.get('/reports', (req, res, next) => floodController.getFloodReports(req, res).catch(next));

export default router;
