import { Platform } from './platform.enum';

export interface ScrapedPost {
  id: number;
  platform: Platform;
  externalId: string;
  title: string;
  content: string;
  url: string;
  author: string;
  score: number;
  commentCount: number;
  subReddit: string;
  proxyIpUsed: string;
  scrapedAt: string;
  postedAt: string;
}
