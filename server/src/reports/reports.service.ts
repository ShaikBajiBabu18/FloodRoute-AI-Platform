import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ReportsRepository, reportsRepository } from './reports.repository';
import { aiService } from '../ai/ai.service';
import { socketService } from '../websocket/socket.service';
import { prisma } from '../config/database';

export class ReportsService {
  constructor(private repo: ReportsRepository = reportsRepository) {}

  async generateReportCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repo.countReports();
    const seq = String(count + 182).padStart(6, '0');
    return `FR-${year}-${seq}`;
  }

  async createReport(params: {
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
    file?: Express.Multer.File;
    imageUrl?: string;
  }) {
    const reportCode = await this.generateReportCode();

    let finalImageUrl = params.imageUrl || null;
    let checksum: string | undefined;

    if (params.file) {
      finalImageUrl = `/uploads/${params.file.filename}`;

      // Calculate SHA256 checksum for image integrity
      try {
        const fileBuffer = fs.readFileSync(params.file.path);
        checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      } catch (err) {
        console.warn('[ReportsService] Checksum computation warning:', err);
      }
    }

    const report = await this.repo.createReport({
      reportCode,
      userId: params.userId,
      hazardType: params.hazardType,
      severity: params.severity,
      waterLevel: params.waterLevel,
      latitude: params.latitude,
      longitude: params.longitude,
      locationName: params.locationName,
      district: params.district,
      state: params.state,
      description: params.description,
      imageUrl: finalImageUrl || undefined,
    });

    // Save image metadata in FloodImage model
    if (params.file && finalImageUrl) {
      await this.repo.createFloodImage({
        reportId: report.id,
        imageUrl: finalImageUrl,
        thumbnailUrl: finalImageUrl,
        fileName: params.file.originalname,
        fileSize: params.file.size,
        mimeType: params.file.mimetype,
        checksum,
      });

      // Asynchronously trigger AI microservice analysis
      aiService
        .analyzeImageFile(params.file.path)
        .then(async (aiRes) => {
          await prisma.aIAnalysis.create({
            data: {
              reportId: report.id,
              floodDetected: aiRes.floodDetected,
              estimatedSeverity: aiRes.estimatedSeverity,
              roadVisibility: aiRes.roadVisibility,
              vehicleAccessibility: aiRes.vehicleAccessibility,
              confidence: aiRes.confidence,
              waterCoveragePercent: aiRes.waterCoveragePercent,
              dominantColor: aiRes.dominantColor,
              explanation: aiRes.explanation,
              disclaimer: aiRes.disclaimer,
            },
          });

          socketService.broadcast('report.updated', {
            id: report.id,
            reportCode: report.reportCode,
            hasAiAnalysis: true,
          });
        })
        .catch((err) => console.error('[ReportsService] AI analysis worker failed:', err));
    }

    // Realtime notification broadcast
    socketService.broadcastReportCreated(report);

    return report;
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
    return this.repo.getReports(params);
  }

  async getReportById(id: string) {
    const report = await this.repo.getReportById(id);
    if (!report) throw new Error('Report not found.');
    return report;
  }

  async updateReportStatus(params: {
    reportId: string;
    status: string;
    adminNotes?: string;
    adminId: string;
    ipAddress?: string;
  }) {
    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED'];
    if (!validStatuses.includes(params.status)) {
      throw new Error(`Invalid status: ${params.status}. Must be one of: ${validStatuses.join(', ')}`);
    }

    const updated = await this.repo.updateReportStatus(params.reportId, {
      status: params.status,
      adminNotes: params.adminNotes,
      verifiedBy: params.adminId,
      verifiedAt: params.status === 'VERIFIED' ? new Date() : undefined,
    });

    // Record immutable audit log
    await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: `REPORT_${params.status}`,
        entity: 'FloodReport',
        entityId: params.reportId,
        details: `Updated report ${updated.reportCode} status to ${params.status}. Notes: ${params.adminNotes || 'N/A'}`,
        ipAddress: params.ipAddress || null,
      },
    });

    // Broadcast specific typed events
    if (params.status === 'VERIFIED') {
      socketService.broadcastReportVerified(updated);
    } else if (params.status === 'RESOLVED') {
      socketService.broadcastReportResolved(updated);
    } else {
      socketService.broadcast('report.updated', updated);
    }

    return updated;
  }

  async upvoteReport(id: string) {
    const updated = await this.repo.upvoteReport(id);
    socketService.broadcast('report.updated', { id, upvotes: updated.upvotes });
    return updated;
  }

  async addCommunityReport(params: {
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
    const communityItem = await this.repo.createCommunityReport(params);
    socketService.broadcast('community.created', communityItem);
    return communityItem;
  }
}

export const reportsService = new ReportsService();
