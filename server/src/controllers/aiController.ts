import { Request, Response } from 'express';
import { aiServiceClient } from '../services/aiServiceClient';

export class AIController {
  async analyzeImage(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: 'Please provide an image file to analyze.' });
    }

    try {
      const result = await aiServiceClient.analyzeImageFile(req.file.path);
      return res.json({ result });
    } catch (err: any) {
      return res.status(503).json({
        error: 'AI analysis is temporarily unavailable.',
        details: err.message,
      });
    }
  }

  async analyzeReport(req: Request, res: Response) {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string is required for report analysis.' });
    }

    try {
      const result = await aiServiceClient.analyzeReportText(text);
      return res.json({ result });
    } catch (err: any) {
      return res.status(503).json({
        error: 'AI analysis is temporarily unavailable.',
        details: err.message,
      });
    }
  }
}

export const aiController = new AIController();
