import { Platform } from './platform.enum';

export interface TrendAnalysis {
  id: number;
  rawAnalysis: string;
  platform: Platform;
  postAnalysis: number;
  analyzedAt: string;
}
