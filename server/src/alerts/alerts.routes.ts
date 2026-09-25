import { Router } from 'express';
import { alertsController } from './alerts.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', alertsController.getAlerts);
router.get('/:id', alertsController.getAlertById);
router.post('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), alertsController.createAlert);
router.put('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), alertsController.updateAlert);
router.delete('/:id', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), alertsController.deleteAlert);

export default router;
