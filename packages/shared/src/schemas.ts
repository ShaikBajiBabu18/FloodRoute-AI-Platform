import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const reportCreateSchema = z.object({
  hazardType: z.enum([
    'FLOODED_ROAD',
    'WATERLOGGING',
    'ROAD_BLOCKED',
    'BRIDGE_CLOSED',
    'LANDSLIDE',
    'FALLEN_TREE',
    'ACCIDENT',
    'OTHER',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  waterLevel: z.enum([
    'PASSABLE',
    'DIFFICULT_SMALL',
    'DIFFICULT_CARS',
    'IMPASSABLE',
    'UNKNOWN',
  ]),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  locationName: z.string().min(2, 'Location name is required'),
  district: z.string().optional(),
  state: z.string().optional(),
  description: z.string().min(5, 'Please provide at least a brief description'),
  imageUrl: z.string().optional(),
});

export const reportStatusUpdateSchema = z.object({
  status: z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'RESOLVED']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  notes: z.string().optional(),
});

export const routeQuerySchema = z.object({
  originLat: z.number(),
  originLng: z.number(),
  destLat: z.number(),
  destLng: z.number(),
  originName: z.string().optional(),
  destName: z.string().optional(),
  avoidFlooded: z.boolean().default(true),
  avoidHighRisk: z.boolean().default(true),
  preferSafer: z.boolean().default(true),
  preferFastest: z.boolean().default(false),
});

export const roadConditionSchema = z.object({
  roadName: z.string().min(2),
  locationName: z.string().min(2),
  condition: z.enum(['SAFE', 'CAUTION', 'FLOODED', 'BLOCKED', 'UNKNOWN']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  reason: z.string().min(3),
  latitude: z.number(),
  longitude: z.number(),
  expectedResolutionTime: z.string().optional(),
});

export const alertCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  severity: z.enum(['INFO', 'CAUTION', 'WARNING', 'DANGER', 'CRITICAL']),
  locationName: z.string().min(2),
  state: z.string().optional(),
  district: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radiusKm: z.number().positive().default(10),
  startTime: z.string().optional(),
  expiryTime: z.string().optional(),
});
