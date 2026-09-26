import { Router } from 'express';
import { copilotController } from './copilot.controller';

const router = Router();

router.post('/', copilotController.chat);
router.post('/chat', copilotController.chat);
router.post('/message', copilotController.chat);

export default router;
