import { Router } from 'express';
import { resourceController } from '../controllers/resourceController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req, res, next) => resourceController.getResources(req, res).catch(next));
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => resourceController.createResource(req, res).catch(next));

export default router;
