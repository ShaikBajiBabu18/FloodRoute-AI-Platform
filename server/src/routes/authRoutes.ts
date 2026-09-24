import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authRateLimiter, (req, res, next) => authController.register(req, res).catch(next));
router.post('/login', authRateLimiter, (req, res, next) => authController.login(req, res).catch(next));
router.get('/me', authenticate, (req, res, next) => authController.me(req, res).catch(next));

export default router;
