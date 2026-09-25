import { Router } from 'express';
import { riversController } from './rivers.controller';

const router = Router();

router.get('/', riversController.getAll);

export default router;
