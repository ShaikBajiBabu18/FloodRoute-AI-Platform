import { Response } from 'express';
import { UsersService, usersService } from './users.service';
import { AuthRequest } from '../middleware/auth';

export class UsersController {
  constructor(private service: UsersService = usersService) {}

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const profile = await this.service.getProfile(req.user.userId);
      return res.json({ profile });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Profile not found.' });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const { name, phone } = req.body;
      const updated = await this.service.updateProfile(req.user.userId, { name, phone });
      return res.json({ user: updated });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to update profile.' });
    }
  };

  getSavedLocations = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const locations = await this.service.getSavedLocations(req.user.userId);
      return res.json({ locations });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve saved locations.' });
    }
  };

  createSavedLocation = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const { name, locationName, latitude, longitude, notes } = req.body;
      if (!name || !locationName || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Name, locationName, latitude, and longitude are required.' });
      }

      const location = await this.service.createSavedLocation(req.user.userId, {
        name,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        notes,
      });
      return res.status(201).json({ location });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to save location.' });
    }
  };

  deleteSavedLocation = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const { id } = req.params;
      await this.service.deleteSavedLocation(req.user.userId, id);
      return res.json({ success: true, message: 'Saved location removed.' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to remove saved location.' });
    }
  };

  getNotifications = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const notifications = await this.service.getNotifications(req.user.userId);
      return res.json({ notifications });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve notifications.' });
    }
  };

  markNotificationRead = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      const { id } = req.params;
      await this.service.markNotificationAsRead(req.user.userId, id);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to mark notification read.' });
    }
  };

  markAllNotificationsRead = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
      await this.service.markAllNotificationsAsRead(req.user.userId);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to mark all notifications read.' });
    }
  };

  listUsers = async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const role = req.query.role as string | undefined;
      const search = req.query.search as string | undefined;

      const result = await this.service.listUsers({ page, limit, role, search });
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to list users.' });
    }
  };

  updateUserStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive, role } = req.body;
      const updated = await this.service.updateUserStatus(id, isActive, role);
      return res.json({ user: updated });
    } catch (error: any) {
      return res.status(400).json({ error: 'Failed to update user status.' });
    }
  };
}

export const usersController = new UsersController();
