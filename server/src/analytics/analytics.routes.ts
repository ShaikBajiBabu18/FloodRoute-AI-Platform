import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/overview', authenticate, requireRole(['ANALYST', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']), analyticsController.getOverview);
router.get('/stats', authenticate, requireRole(['ANALYST', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']), analyticsController.getStats);

export default router;
