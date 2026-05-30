import { Platform } from './platform.enum';
import { TrendAnalysis } from './trend-analysis.model';

export interface TrendTopic {
  id: number;
  topic: string;
  summary: string;
  reasoning: string;
  category: string;
  mentionCount: number;
  trendScore: number;
  primaryPlatform: Platform;
  samplePostIds: string;
  analysis: TrendAnalysis;
  detectedAt: string;
}
