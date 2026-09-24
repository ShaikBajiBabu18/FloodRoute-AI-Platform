import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Protect all admin endpoints with RBAC
router.use(authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST']));

router.get('/dashboard', (req, res, next) => adminController.getDashboardKpis(req, res).catch(next));
router.get('/analytics', (req, res, next) => adminController.getAnalytics(req, res).catch(next));
router.get('/ai-analytics', (req, res, next) => adminController.getAiAnalytics(req, res).catch(next));
router.get('/audit-logs', (req, res, next) => adminController.getAuditLogs(req, res).catch(next));

export default router;
