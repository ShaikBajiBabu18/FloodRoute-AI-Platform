import { Router } from 'express';
import { districtsController } from './districts.controller';

const router = Router();

router.get('/', districtsController.getAll);
router.get('/:name', districtsController.getByName);

export default router;
