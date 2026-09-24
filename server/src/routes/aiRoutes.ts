import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/analyze-image', uploadSingleImage.single('file'), (req, res, next) => aiController.analyzeImage(req, res).catch(next));
router.post('/analyze-report', (req, res, next) => aiController.analyzeReport(req, res).catch(next));

export default router;
