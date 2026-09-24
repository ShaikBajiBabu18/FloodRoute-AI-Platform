import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const router = Router();

router.get('/', (req, res, next) => healthController.getHealth(req, res).catch(next));

export default router;
