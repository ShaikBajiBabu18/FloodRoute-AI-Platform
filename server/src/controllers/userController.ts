import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { auditService } from '../services/auditService';

export class UserController {
  async getProfile(req: AuthenticatedRequest, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        savedLocations: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...rest } = user;
    return res.json({ profile: rest });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    const { name, phone } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
      },
      select: { id: true, email: true, name: true, phone: true, role: true },
    });

    return res.json({ message: 'Profile updated', user: updated });
  }

  async getSavedLocations(req: AuthenticatedRequest, res: Response) {
    const locations = await prisma.savedLocation.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ locations });
  }

  async addSavedLocation(req: AuthenticatedRequest, res: Response) {
    const { name, locationName, latitude, longitude, notes } = req.body;
    if (!name || !locationName || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'Name, locationName, latitude and longitude are required.' });
    }

    const saved = await prisma.savedLocation.create({
      data: {
        userId: req.user!.userId,
        name,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        notes: notes || null,
      },
    });

    return res.status(201).json({ message: 'Saved location added', location: saved });
  }

  async deleteSavedLocation(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await prisma.savedLocation.deleteMany({
      where: { id, userId: req.user!.userId },
    });
    return res.json({ message: 'Saved location removed' });
  }

  async getNotifications(req: AuthenticatedRequest, res: Response) {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ notifications });
  }

  async markNotificationRead(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    await prisma.notification.updateMany({
      where: { id, userId: req.user!.userId },
      data: { isRead: true },
    });
    return res.json({ message: 'Notification marked as read' });
  }

  // Admin user management
  async getAllUsers(req: AuthenticatedRequest, res: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: { reports: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ users });
  }

  async updateUserAdmin(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role ? { role } : {}),
        ...(typeof isActive === 'boolean' ? { isActive } : {}),
      },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    await auditService.log({
      adminId: req.user!.userId,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: id,
      details: `Role updated to ${role || 'unchanged'}, Active: ${isActive}`,
      ipAddress: req.ip,
    });

    return res.json({ message: 'User updated successfully', user: updated });
  }
}

export const userController = new UserController();
