import { Router } from 'express';
import { reportsController } from './reports.controller';
import { optionalAuthenticate, authenticate, requireRole } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/', optionalAuthenticate, uploadSingleImage.single('image'), reportsController.createReport);
router.get('/', reportsController.getReports);
router.get('/:id', reportsController.getReportById);
router.patch('/:id/status', authenticate, requireRole(['ANALYST', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN']), reportsController.updateStatus);
router.post('/:id/upvote', reportsController.upvote);
router.post('/:id/community', optionalAuthenticate, reportsController.addCommunityObservation);

export default router;
