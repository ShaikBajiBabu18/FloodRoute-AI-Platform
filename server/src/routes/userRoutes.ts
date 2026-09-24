import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/me', authenticate, (req, res, next) => userController.getProfile(req, res).catch(next));
router.put('/me', authenticate, (req, res, next) => userController.updateProfile(req, res).catch(next));

router.get('/saved-locations', authenticate, (req, res, next) => userController.getSavedLocations(req, res).catch(next));
router.post('/saved-locations', authenticate, (req, res, next) => userController.addSavedLocation(req, res).catch(next));
router.delete('/saved-locations/:id', authenticate, (req, res, next) => userController.deleteSavedLocation(req, res).catch(next));

router.get('/notifications', authenticate, (req, res, next) => userController.getNotifications(req, res).catch(next));
router.put('/notifications/:id/read', authenticate, (req, res, next) => userController.markNotificationRead(req, res).catch(next));

// Admin user management
router.get('/', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => userController.getAllUsers(req, res).catch(next));
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'ADMIN']), (req, res, next) => userController.updateUserAdmin(req, res).catch(next));

export default router;
