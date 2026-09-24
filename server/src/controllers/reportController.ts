import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth';
import { aiServiceClient } from '../services/aiServiceClient';
import { socketService } from '../services/socketService';
import { auditService } from '../services/auditService';
import { reportCreateSchema, reportStatusUpdateSchema } from '@floodroute/shared';

// Helper to generate unique report code like FR-2026-000182
async function generateReportCode(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.floodReport.count();
  const seq = String(count + 182).padStart(6, '0');
  return `FR-${year}-${seq}`;
}

export class ReportController {
  async createReport(req: AuthenticatedRequest, res: Response) {
    const rawData = {
      hazardType: req.body.hazardType,
      severity: req.body.severity,
      waterLevel: req.body.waterLevel,
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      locationName: req.body.locationName,
      district: req.body.district || undefined,
      state: req.body.state || undefined,
      description: req.body.description,
      imageUrl: req.body.imageUrl || (req.file ? `/uploads/${req.file.filename}` : undefined),
    };

    const validated = reportCreateSchema.parse(rawData);
    const reportCode = await generateReportCode();

    const report = await prisma.floodReport.create({
      data: {
        reportCode,
        userId: req.user?.userId || null,
        hazardType: validated.hazardType,
        severity: validated.severity,
        waterLevel: validated.waterLevel,
        latitude: validated.latitude,
        longitude: validated.longitude,
        locationName: validated.locationName,
        district: validated.district || null,
        state: validated.state || null,
        description: validated.description,
        imageUrl: validated.imageUrl || null,
        status: 'PENDING',
        isDemo: false,
      },
    });

    // If file was uploaded, trigger AI analysis asynchronously
    if (req.file) {
      const filePath = req.file.path;
      aiServiceClient.analyzeImageFile(filePath)
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

          // Broadcast updated analysis
          socketService.broadcast('report.updated', {
            id: report.id,
            reportCode: report.reportCode,
            hasAiAnalysis: true,
          });
        })
        .catch(err => console.error('AI Analysis failed:', err));
    }

    // Broadcast real-time event to admin operations and public maps
    socketService.broadcast('report.created', report);

    return res.status(201).json({
      message: 'Report received successfully.',
      reportId: report.id,
      reportCode: report.reportCode,
      status: report.status,
      report,
    });
  }

  async getReports(req: Request, res: Response) {
    const { status, severity, hazardType, state, district, search, limit = '100' } = req.query;

    const where: any = {};
    if (status) where.status = String(status);
    if (severity) where.severity = String(severity);
    if (hazardType) where.hazardType = String(hazardType);
    if (state) where.state = { contains: String(state) };
    if (district) where.district = { contains: String(district) };
    if (search) {
      where.OR = [
        { reportCode: { contains: String(search) } },
        { locationName: { contains: String(search) } },
        { description: { contains: String(search) } },
      ];
    }

    const reports = await prisma.floodReport.findMany({
      where,
      include: {
        aiAnalysis: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(String(limit), 10),
    });

    return res.json({ reports });
  }

  async getReportById(req: Request, res: Response) {
    const { id } = req.params;
    const report = await prisma.floodReport.findUnique({
      where: { id },
      include: {
        aiAnalysis: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.json({ report });
  }

  async updateReportStatus(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const data = reportStatusUpdateSchema.parse(req.body);

    const existing = await prisma.floodReport.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const updated = await prisma.floodReport.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.severity ? { severity: data.severity } : {}),
        ...(data.notes ? { adminNotes: data.notes } : {}),
        verifiedAt: data.status === 'VERIFIED' ? new Date() : existing.verifiedAt,
        verifiedBy: data.status === 'VERIFIED' ? req.user!.userId : existing.verifiedBy,
      },
      include: { aiAnalysis: true },
    });

    // Audit log
    await auditService.log({
      adminId: req.user!.userId,
      action: `REPORT_${data.status}`,
      entity: 'FloodReport',
      entityId: id,
      details: `Status set to ${data.status}. Severity: ${updated.severity}. Notes: ${data.notes || 'None'}`,
      ipAddress: req.ip,
    });

    // Real-time broadcast
    if (data.status === 'VERIFIED') {
      socketService.broadcast('report.approved', updated);
    } else if (data.status === 'REJECTED') {
      socketService.broadcast('report.rejected', updated);
    } else if (data.status === 'RESOLVED') {
      socketService.broadcast('report.resolved', updated);
    } else {
      socketService.broadcast('report.updated', updated);
    }

    return res.json({
      message: `Report status updated to ${data.status}`,
      report: updated,
    });
  }

  async upvoteReport(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await prisma.floodReport.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
    return res.json({ message: 'Upvoted', upvotes: updated.upvotes });
  }
}

export const reportController = new ReportController();
