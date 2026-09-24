import { Router } from 'express';
import { roadConditionController } from '../controllers/roadConditionController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req, res, next) => roadConditionController.getRoadConditions(req, res).catch(next));
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']), (req, res, next) => roadConditionController.createRoadCondition(req, res).catch(next));
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']), (req, res, next) => roadConditionController.updateRoadCondition(req, res).catch(next));
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => roadConditionController.deleteRoadCondition(req, res).catch(next));

export default router;
