import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { optionalAuthenticate, authenticate, requireRole } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/', optionalAuthenticate, uploadSingleImage.single('photo'), (req, res, next) => reportController.createReport(req, res).catch(next));
router.get('/', (req, res, next) => reportController.getReports(req, res).catch(next));
router.get('/:id', (req, res, next) => reportController.getReportById(req, res).catch(next));
router.put('/:id/status', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST']), (req, res, next) => reportController.updateReportStatus(req, res).catch(next));
router.patch('/:id/status', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'ANALYST']), (req, res, next) => reportController.updateReportStatus(req, res).catch(next));
router.post('/:id/upvote', (req, res, next) => reportController.upvoteReport(req, res).catch(next));

export default router;
