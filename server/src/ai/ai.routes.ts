import { Router } from 'express';
import { aiController } from './ai.controller';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/analyze-image', uploadSingleImage.single('file'), aiController.analyzeImage);
router.get('/health', aiController.health);

export default router;
