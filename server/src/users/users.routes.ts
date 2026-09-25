import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

// Profile
router.get('/profile', authenticate, usersController.getProfile);
router.put('/profile', authenticate, usersController.updateProfile);

// Saved Locations
router.get('/saved-locations', authenticate, usersController.getSavedLocations);
router.post('/saved-locations', authenticate, usersController.createSavedLocation);
router.delete('/saved-locations/:id', authenticate, usersController.deleteSavedLocation);

// Notifications
router.get('/notifications', authenticate, usersController.getNotifications);
router.patch('/notifications/:id/read', authenticate, usersController.markNotificationRead);
router.post('/notifications/read-all', authenticate, usersController.markAllNotificationsRead);

// Admin-only user management
router.get('/', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), usersController.listUsers);
router.patch('/:id/status', authenticate, requireRole(['ADMIN', 'SUPER_ADMIN']), usersController.updateUserStatus);

export default router;
