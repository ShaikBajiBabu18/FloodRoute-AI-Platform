import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { ENV } from '../config/env';
import { AIAnalysisResult } from '@floodroute/shared';

export class AIServiceClient {
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
      console.warn('[AIServiceClient] AI microservice call failed or unavailable:', err.message);
      
      // Graceful fallback with clear disclaimer
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

  async analyzeReportText(text: string): Promise<any> {
    try {
      const response = await axios.post(`${ENV.AI_SERVICE_URL}/analyze-report`, { text }, {
        timeout: 5000,
      });
      return response.data;
    } catch (err: any) {
      console.warn('[AIServiceClient] Text classification unavailable:', err.message);
      return {
        floodRelevanceScore: 0.5,
        detectedKeywords: [],
        suggestedSeverity: 'MEDIUM',
        isActionable: true,
        explanation: 'Standard citizen report. AI text classification unavailable.',
      };
    }
  }
}

export const aiServiceClient = new AIServiceClient();
