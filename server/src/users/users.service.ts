import { UsersRepository, usersRepository } from './users.repository';

export class UsersService {
  constructor(private repo: UsersRepository = usersRepository) {}

  async getProfile(userId: string) {
    const profile = await this.repo.getProfile(userId);
    if (!profile) {
      throw new Error('User profile not found.');
    }
    return profile;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    return this.repo.updateProfile(userId, data);
  }

  async getSavedLocations(userId: string) {
    return this.repo.getSavedLocations(userId);
  }

  async createSavedLocation(userId: string, data: {
    name: string;
    locationName: string;
    latitude: number;
    longitude: number;
    notes?: string;
  }) {
    return this.repo.createSavedLocation(userId, data);
  }

  async deleteSavedLocation(userId: string, locationId: string) {
    return this.repo.deleteSavedLocation(userId, locationId);
  }

  async getNotifications(userId: string) {
    return this.repo.getNotifications(userId);
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    return this.repo.markNotificationAsRead(userId, notificationId);
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.repo.markAllNotificationsAsRead(userId);
  }

  async listUsers(params: { page?: number; limit?: number; role?: string; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    return this.repo.listUsers({ page, limit, role: params.role, search: params.search });
  }

  async updateUserStatus(userId: string, isActive: boolean, role?: string) {
    return this.repo.updateUserStatus(userId, isActive, role);
  }
}

export const usersService = new UsersService();
