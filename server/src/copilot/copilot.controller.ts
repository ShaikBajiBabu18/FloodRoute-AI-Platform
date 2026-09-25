import { Request, Response } from 'express';
import { CopilotService, copilotService } from './copilot.service';

export class CopilotController {
  constructor(private service: CopilotService = copilotService) {}

  chat = async (req: Request, res: Response) => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      const response = await this.service.processQuery({ message, context });
      return res.json(response);
    } catch (error: any) {
      console.error('[CopilotController] Chat error:', error);
      return res.status(500).json({ error: 'Copilot query failed.' });
    }
  };
}

export const copilotController = new CopilotController();
