import { Router } from 'express';
import { routingController } from './routing.controller';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.get('/geocode', routingController.searchLocations);
router.post('/calculate', optionalAuthenticate, routingController.calculateRoute);
router.get('/history', optionalAuthenticate, routingController.getHistory);
router.get('/:id', routingController.getById);

export default router;
