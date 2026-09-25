import { Router } from 'express';
import { copilotController } from './copilot.controller';

const router = Router();

router.post('/chat', copilotController.chat);

export default router;
