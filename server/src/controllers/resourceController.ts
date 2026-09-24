import { Request, Response } from 'express';
import { prisma } from '../config/database';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class ResourceController {
  async getResources(req: Request, res: Response) {
    const { category, city, lat, lng, radiusKm = '30' } = req.query;

    const where: any = {};
    if (category) where.category = String(category);
    if (city) where.city = { contains: String(city) };

    const resources = await prisma.emergencyResource.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    let results = resources.map(r => ({
      ...r,
      categoryLabel: r.category.replace('_', ' '),
      distanceKm: undefined as number | undefined,
    }));

    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      const maxRadius = parseFloat(radiusKm as string);

      if (!isNaN(userLat) && !isNaN(userLng)) {
        results = results
          .map(r => ({
            ...r,
            distanceKm: Math.round(getDistanceKm(userLat, userLng, r.latitude, r.longitude) * 10) / 10,
          }))
          .filter(r => r.distanceKm! <= maxRadius)
          .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }
    }

    return res.json({ resources: results });
  }

  async createResource(req: Request, res: Response) {
    const { name, category, address, city, state, phone, latitude, longitude, notes } = req.body;

    const resource = await prisma.emergencyResource.create({
      data: {
        name,
        category,
        address,
        city: city || null,
        state: state || null,
        phone: phone || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        notes: notes || null,
        isOpen: true,
        isDemo: false,
      },
    });

    return res.status(201).json({ message: 'Emergency resource added', resource });
  }
}

export const resourceController = new ResourceController();
