import { Router } from 'express';
import { alertController } from '../controllers/alertController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', (req, res, next) => alertController.getAlerts(req, res).catch(next));
router.get('/:id', (req, res, next) => alertController.getAlertById(req, res).catch(next));
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']), (req, res, next) => alertController.createPlatformAlert(req, res).catch(next));
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']), (req, res, next) => alertController.updateAlertStatus(req, res).catch(next));

export default router;
