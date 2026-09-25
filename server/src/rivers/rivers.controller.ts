import { Request, Response } from 'express';
import { RiversService, riversService } from './rivers.service';

export class RiversController {
  constructor(private service: RiversService = riversService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const stations = await this.service.getStations();
      return res.json({ stations });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve river monitoring stations.' });
    }
  };
}

export const riversController = new RiversController();
