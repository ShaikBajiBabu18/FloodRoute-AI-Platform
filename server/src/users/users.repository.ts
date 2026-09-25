import { prisma } from '../config/database';

export class UsersRepository {
  async getProfile(userId: string) {
    return prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        lastActive: true,
        adminProfile: true,
      },
    });
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.phone !== undefined && { phone: data.phone?.trim() || null }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async getSavedLocations(userId: string) {
    return prisma.savedLocation.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSavedLocation(userId: string, data: {
    name: string;
    locationName: string;
    latitude: number;
    longitude: number;
    notes?: string;
  }) {
    return prisma.savedLocation.create({
      data: {
        userId,
        name: data.name,
        locationName: data.locationName,
        latitude: data.latitude,
        longitude: data.longitude,
        notes: data.notes || null,
      },
    });
  }

  async deleteSavedLocation(userId: string, locationId: string) {
    return prisma.savedLocation.updateMany({
      where: { id: locationId, userId },
      data: { deletedAt: new Date() },
    });
  }

  async getNotifications(userId: string, limit: number = 20) {
    return prisma.notification.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllNotificationsAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async listUsers(params: { page: number; limit: number; role?: string; search?: string }) {
    const where: any = { deletedAt: null };
    if (params.role) where.role = params.role;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search } },
        { email: { contains: params.search } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastActive: true,
        },
      }),
    ]);

    return { total, users, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async updateUserStatus(userId: string, isActive: boolean, role?: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isActive,
        ...(role && { role }),
      },
    });
  }
}

export const usersRepository = new UsersRepository();
