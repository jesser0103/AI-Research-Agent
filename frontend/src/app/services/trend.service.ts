import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TrendTopic } from '../models/trend-topic.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrendService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/trends`;

  getTopTrends(): Observable<TrendTopic[]> {
    return this.http.get<TrendTopic[]>(this.baseUrl);
  }

  getLatestTrends(): Observable<TrendTopic[]> {
    return this.http.get<TrendTopic[]>(`${this.baseUrl}/latest`);
  }

  getTrendsByCategory(category: string): Observable<TrendTopic[]> {
    return this.http.get<TrendTopic[]>(`${this.baseUrl}/category/${category}`);
  }

  getTrendsByPlatform(platform: string): Observable<TrendTopic[]> {
    return this.http.get<TrendTopic[]>(`${this.baseUrl}/platform/${platform}`);
  }

  getDashboardStats(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/stats`);
  }
}
