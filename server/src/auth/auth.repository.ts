import { prisma } from '../config/database';

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: null,
      },
      include: {
        adminProfile: {
          include: {
            roleObj: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        adminProfile: true,
      },
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
    phone?: string;
    role?: string;
  }) {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
        role: data.role || 'CITIZEN',
      },
    });
  }

  async createSession(data: {
    userId: string;
    token: string;
    refreshToken?: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return prisma.session.create({
      data: {
        userId: data.userId,
        token: data.token,
        refreshToken: data.refreshToken,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findSessionByToken(token: string) {
    return prisma.session.findFirst({
      where: {
        token,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async findSessionByRefreshToken(refreshToken: string) {
    return prisma.session.findFirst({
      where: {
        refreshToken,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async revokeSession(token: string) {
    return prisma.session.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async updateLastActive(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });
  }

  async setResetPasswordToken(email: string, token: string, expires: Date) {
    return prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
    });
  }

  async findByResetToken(token: string) {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
        deletedAt: null,
      },
    });
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }
}

export const authRepository = new AuthRepository();
