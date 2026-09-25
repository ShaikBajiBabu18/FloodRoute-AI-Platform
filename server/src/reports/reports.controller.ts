import { Request, Response } from 'express';
import { ReportsService, reportsService } from './reports.service';
import { AuthRequest } from '../middleware/auth';
import { reportCreateSchema, reportStatusUpdateSchema } from '@floodroute/shared';

export class ReportsController {
  constructor(private service: ReportsService = reportsService) {}

  createReport = async (req: AuthRequest, res: Response) => {
    try {
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
        imageUrl: req.body.imageUrl || undefined,
      };

      const validated = reportCreateSchema.parse(rawData);

      const report = await this.service.createReport({
        userId: req.user?.userId,
        hazardType: validated.hazardType,
        severity: validated.severity,
        waterLevel: validated.waterLevel,
        latitude: validated.latitude,
        longitude: validated.longitude,
        locationName: validated.locationName,
        district: validated.district,
        state: validated.state,
        description: validated.description,
        file: req.file,
        imageUrl: validated.imageUrl,
      });

      return res.status(201).json({
        message: 'Report received successfully.',
        reportId: report.id,
        reportCode: report.reportCode,
        status: report.status,
        report,
      });
    } catch (error: any) {
      console.error('[ReportsController] Report creation failed:', error);
      return res.status(400).json({ error: error.message || 'Failed to submit report.' });
    }
  };

  getReports = async (req: Request, res: Response) => {
    try {
      const { status, severity, hazardType, state, district, search, limit } = req.query;
      const reports = await this.service.getReports({
        status: status as string | undefined,
        severity: severity as string | undefined,
        hazardType: hazardType as string | undefined,
        state: state as string | undefined,
        district: district as string | undefined,
        search: search as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      return res.json({ reports });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve reports.' });
    }
  };

  getReportById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const report = await this.service.getReportById(id);
      return res.json({ report });
    } catch (error: any) {
      return res.status(404).json({ error: error.message || 'Report not found.' });
    }
  };

  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const validated = reportStatusUpdateSchema.parse(req.body);

      const updated = await this.service.updateReportStatus({
        reportId: id,
        status: validated.status,
        adminNotes: (validated as any).adminNotes || (validated as any).notes,
        adminId: req.user!.userId,
        ipAddress: req.ip,
      });

      return res.json({
        message: `Report ${updated.reportCode} marked as ${updated.status}`,
        report: updated,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Status update failed.' });
    }
  };

  upvote = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await this.service.upvoteReport(id);
      return res.json({ success: true, upvotes: updated.upvotes });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to upvote report.' });
    }
  };

  addCommunityObservation = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { authorName, hazardType, severity, waterDepthCm, description, latitude, longitude, locationName } = req.body;

      if (!description || latitude === undefined || longitude === undefined || !locationName) {
        return res.status(400).json({ error: 'Description, locationName, and coordinates are required.' });
      }

      const item = await this.service.addCommunityReport({
        reportId: id,
        userId: req.user?.userId,
        authorName,
        hazardType,
        severity,
        waterDepthCm: waterDepthCm ? parseFloat(waterDepthCm) : undefined,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        locationName,
      });

      return res.status(201).json({ item });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to submit community observation.' });
    }
  };
}

export const reportsController = new ReportsController();
