import { prisma } from '../config/database';

export class ReportsRepository {
  async countReports(): Promise<number> {
    return prisma.floodReport.count();
  }

  async createReport(data: {
    reportCode: string;
    userId?: string;
    hazardType: string;
    severity: string;
    waterLevel: string;
    latitude: number;
    longitude: number;
    locationName: string;
    district?: string;
    state?: string;
    description: string;
    imageUrl?: string;
    status?: string;
  }) {
    return prisma.floodReport.create({
      data: {
        reportCode: data.reportCode,
        userId: data.userId || null,
        hazardType: data.hazardType,
        severity: data.severity,
        waterLevel: data.waterLevel,
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName,
        district: data.district || null,
        state: data.state || null,
        description: data.description,
        imageUrl: data.imageUrl || null,
        status: data.status || 'PENDING',
      },
    });
  }

  async createFloodImage(data: {
    reportId: string;
    imageUrl: string;
    thumbnailUrl?: string;
    fileName: string;
    fileSize?: number;
    mimeType?: string;
    checksum?: string;
  }) {
    return prisma.floodImage.create({
      data: {
        reportId: data.reportId,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        fileName: data.fileName,
        fileSize: data.fileSize || null,
        mimeType: data.mimeType || null,
        checksum: data.checksum || null,
      },
    });
  }

  async getReports(params: {
    status?: string;
    severity?: string;
    hazardType?: string;
    state?: string;
    district?: string;
    search?: string;
    limit?: number;
  }) {
    const where: any = { deletedAt: null };
    if (params.status) where.status = params.status;
    if (params.severity) where.severity = params.severity;
    if (params.hazardType) where.hazardType = params.hazardType;
    if (params.state) where.state = { contains: params.state };
    if (params.district) where.district = { contains: params.district };
    if (params.search) {
      where.OR = [
        { locationName: { contains: params.search } },
        { description: { contains: params.search } },
        { reportCode: { contains: params.search } },
      ];
    }

    return prisma.floodReport.findMany({
      where,
      include: {
        aiAnalysis: true,
        images: true,
        communityItems: true,
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit || 100,
    });
  }

  async getReportById(id: string) {
    return prisma.floodReport.findFirst({
      where: { id, deletedAt: null },
      include: {
        aiAnalysis: true,
        images: true,
        communityItems: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async updateReportStatus(
    id: string,
    data: {
      status: string;
      adminNotes?: string;
      verifiedBy?: string;
      verifiedAt?: Date;
    }
  ) {
    return prisma.floodReport.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.adminNotes && { adminNotes: data.adminNotes }),
        ...(data.verifiedBy && { verifiedBy: data.verifiedBy }),
        ...(data.verifiedAt && { verifiedAt: data.verifiedAt }),
      },
      include: {
        aiAnalysis: true,
        images: true,
      },
    });
  }

  async upvoteReport(id: string) {
    return prisma.floodReport.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
  }

  async createCommunityReport(data: {
    reportId?: string;
    userId?: string;
    authorName?: string;
    hazardType?: string;
    severity?: string;
    waterDepthCm?: number;
    description: string;
    latitude: number;
    longitude: number;
    locationName: string;
  }) {
    return prisma.communityReport.create({
      data: {
        reportId: data.reportId || null,
        userId: data.userId || null,
        authorName: data.authorName || 'Citizen Reporter',
        hazardType: data.hazardType || 'WATERLOGGING',
        severity: data.severity || 'MEDIUM',
        waterDepthCm: data.waterDepthCm || null,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        locationName: data.locationName,
      },
    });
  }
}

export const reportsRepository = new ReportsRepository();
