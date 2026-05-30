import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ScrapedPost } from '../models/scraped-post.model';
import { Platform } from '../models/platform.enum';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrapeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/scrape`;

  triggerFullCycle(): Observable<{ scrapeResult: Record<string, number>, postsAnalyzed: number, analysisId: any }> {
    return this.http.post<{ scrapeResult: Record<string, number>, postsAnalyzed: number, analysisId: any }>(`${this.baseUrl}/run`, {});
  }

  scrapePlatform(platform: Platform): Observable<ScrapedPost[]> {
    return this.http.post<ScrapedPost[]>(`${this.baseUrl}/platform/${platform}`, {});
  }

  getRecentPosts(platform?: Platform): Observable<ScrapedPost[]> {
    let params = new HttpParams();
    if (platform) {
      params = params.set('platform', platform);
    }
    return this.http.get<ScrapedPost[]>(`${this.baseUrl}/posts `, { params });
  }
}
