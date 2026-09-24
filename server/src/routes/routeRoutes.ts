import { Router } from 'express';
import { routeController } from '../controllers/routeController';
import { optionalAuthenticate } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuthenticate, (req, res, next) => routeController.calculateRoutes(req, res).catch(next));
router.get('/geocode', (req, res, next) => routeController.searchLocations(req, res).catch(next));
router.get('/:id', (req, res, next) => routeController.getRouteById(req, res).catch(next));

export default router;
