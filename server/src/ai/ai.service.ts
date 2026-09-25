import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ENV } from '../config/env';
import { AIAnalysisResult } from '@floodroute/shared';

export class AIService {
  async analyzeImageFile(filePath: string): Promise<AIAnalysisResult> {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.post(`${ENV.AI_SERVICE_URL}/analyze-image`, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 12000,
      });

      const d = response.data;
      return {
        floodDetected: d.floodDetected,
        estimatedSeverity: d.estimatedSeverity,
        roadVisibility: d.roadVisibility,
        vehicleAccessibility: d.vehicleAccessibility,
        confidence: d.confidence,
        waterCoveragePercent: d.waterCoveragePercent,
        dominantColor: d.dominantColor,
        explanation: d.explanation,
        disclaimer: d.disclaimer || 'AI-assisted estimate. Not an official disaster determination.',
        analyzedAt: d.analyzedAt || new Date().toISOString(),
      };
    } catch (err: any) {
      console.warn('[AIService] AI microservice call failed or unavailable:', err.message);

      return {
        floodDetected: false,
        estimatedSeverity: 'LOW',
        roadVisibility: 'UNKNOWN',
        vehicleAccessibility: 'UNKNOWN',
        confidence: 0,
        explanation: 'AI vision microservice is currently unreachable. Image queued for manual analyst review.',
        disclaimer: 'AI analysis is temporarily unavailable. Manual verification required.',
        analyzedAt: new Date().toISOString(),
      };
    }
  }

  async checkHealth(): Promise<{ status: string; url: string; reachable: boolean }> {
    try {
      const res = await axios.get(`${ENV.AI_SERVICE_URL}/health`, { timeout: 3000 });
      return { status: 'healthy', url: ENV.AI_SERVICE_URL, reachable: res.status === 200 };
    } catch {
      return { status: 'unreachable', url: ENV.AI_SERVICE_URL, reachable: false };
    }
  }
}

export const aiService = new AIService();
