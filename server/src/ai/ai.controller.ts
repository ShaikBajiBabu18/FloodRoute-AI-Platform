import { Request, Response } from 'express';
import { AIService, aiService } from './ai.service';

export class AIController {
  constructor(private service: AIService = aiService) {}

  analyzeImage = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file upload is required.' });
      }

      const result = await this.service.analyzeImageFile(req.file.path);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'AI image analysis failed.' });
    }
  };

  health = async (req: Request, res: Response) => {
    try {
      const health = await this.service.checkHealth();
      return res.json(health);
    } catch (error: any) {
      return res.status(500).json({ error: 'Health check failed.' });
    }
  };
}

export const aiController = new AIController();
