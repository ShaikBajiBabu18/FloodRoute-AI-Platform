import { Request, Response } from 'express';
import { DistrictsService, districtsService } from './districts.service';

export class DistrictsController {
  constructor(private service: DistrictsService = districtsService) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const districts = await this.service.getDistricts();
      return res.json({ districts });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve district telemetry.' });
    }
  };

  getByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const district = await this.service.getDistrictByName(name);
      if (!district) return res.status(404).json({ error: `District "${name}" not found.` });
      return res.json({ district });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to retrieve district.' });
    }
  };
}

export const districtsController = new DistrictsController();
