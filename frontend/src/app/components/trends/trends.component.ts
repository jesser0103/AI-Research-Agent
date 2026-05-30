// src/app/components/trends/trends.component.ts  (phase3-redesign)
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendService } from '../../services/trend.service';
import { TrendTopic } from '../../models/trend-topic.model';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trends-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">LLM Trend Analysis</h1>
          <p class="page-subtitle">AI-synthesized insights from cross-platform data</p>
        </div>
        <button (click)="loadTrends()" [disabled]="loading()" class="btn-primary" id="refresh-trends-btn">
          @if (loading()) {
            <span class="btn-spinner"></span>
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          }
          Refresh Data
        </button>
      </div>

      <!-- Loading State: Skeleton -->
      @if (loading()) {
        <div class="trends-grid">
          @for (i of [1,2,3,4]; track i) {
            <div class="trend-card">
              <div style="padding: 24px">
                <div class="skeleton skeleton-title" style="width: 60%"></div>
                <div class="skeleton skeleton-text" style="width: 100%"></div>
                <div class="skeleton skeleton-text" style="width: 90%"></div>
                <div class="skeleton skeleton-text" style="width: 80%"></div>
                <div style="margin-top: 24px; padding: 16px; background: var(--surface-2); border-radius: 12px">
                  <div class="skeleton skeleton-text" style="width: 40%"></div>
                  <div class="skeleton skeleton-text" style="width: 100%"></div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Failed to load trends: {{ error() }}
        </div>
      } @else if (trends().length === 0) {
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-dim)">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <p>No trends discovered yet. Wait for the LLM Analysis pipeline to complete.</p>
        </div>
      } @else {
        <div class="trends-grid">
          @for (trend of trends(); track trend.id) {
            <div class="trend-card animate-in">
              <div class="card-main">
                <div class="card-header">
                  <h3 class="trend-title">{{ trend.topic }}</h3>
                  <span class="category-pill">{{ trend.category }}</span>
                </div>
                
                <p class="trend-summary">{{ trend.summary }}</p>
                
                <div class="ai-reasoning">
                  <div class="reasoning-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    AI Reasoning
                  </div>
                  <p>{{ trend.reasoning }}</p>
                </div>
              </div>
              
              <div class="card-footer">
                <div class="stats-row">
                  <div class="stat-box">
                     <span class="stat-label">Trend Score</span>
                     <!-- Animated Score Bar -->
                     <div class="score-container">
                       <div class="score-value">{{ trend.trendScore | number:'1.1-2' }}</div>
                       <div class="score-track">
                         <div class="score-fill bar-animated" [style.width.%]="getScorePercent(trend.trendScore)"></div>
                       </div>
                     </div>
                  </div>
                  <div class="stat-box">
                     <span class="stat-label">Mentions</span> 
                     <span class="stat-val text-bold">{{ trend.mentionCount }}</span>
                  </div>
                  <div class="stat-box">
                     <span class="stat-label">Platform</span> 
                     <span class="platform-chip" [attr.data-platform]="trend.primaryPlatform">
                       @if (trend.primaryPlatform === 'REDDIT') {
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 13.38c.15.36.24.74.24 1.14 0 2.92-3.4 5.29-7.59 5.29-4.19 0-7.59-2.37-7.59-5.29 0-.4.09-.78.24-1.14-.78-.45-1.3-1.3-1.3-2.27 0-1.45 1.17-2.62 2.62-2.62.72 0 1.37.29 1.84.76 1.41-.91 3.31-1.51 5.38-1.6l1.11-3.93a.45.45 0 0 1 .55-.32l3.05.68c.28-.58.87-.98 1.56-.98.95 0 1.72.77 1.72 1.72s-.77 1.72-1.72 1.72c-.91 0-1.65-.7-1.72-1.59l-2.62-.59-.96 3.4c1.98.13 3.81.73 5.18 1.6.48-.48 1.13-.77 1.85-.77 1.45 0 2.62 1.17 2.62 2.62 0 .97-.53 1.82-1.31 2.27z"/></svg>
                       } @else if (trend.primaryPlatform === 'HACKERNEWS') {
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm11.09 14.29V20h1.75v-5.71L17.16 4h-1.97l-3.24 7.57L8.72 4H6.78l4.31 10.29z"/></svg>
                       } @else if (trend.primaryPlatform === 'PRODUCTHUNT') {
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.125 15H9.75V9h3.375C14.784 9 16 10.216 16 11.875v.25C16 13.784 14.784 15 13.125 15z"/></svg>
                       }
                       {{ trend.primaryPlatform }}
                     </span>
                  </div>
                  <div class="stat-box">
                     <span class="stat-label">Detected</span> 
                     <span class="stat-val">{{ trend.detectedAt | date:'MM/dd' }}</span>
                  </div>
                </div>

                <div class="meta-section">
                  <div class="meta-item">
                    <span class="meta-label">Sample Post IDs</span> 
                    <p class="meta-mono">{{ trend.samplePostIds || 'None recorded' }}</p>
                  </div>
                  
                  @if (trend.analysis) {
                    <div class="meta-item">
                      <span class="meta-label">Parent Analysis Job</span> 
                      <p class="meta-mono">
                        <span class="text-accent">ID:</span> {{ trend.analysis.id }} &nbsp;&bull;&nbsp; 
                        <span class="text-accent">Raw Ctx:</span> {{ trend.analysis.rawAnalysis ? 'Yes' : 'No' }} &nbsp;&bull;&nbsp; 
                        <span class="text-accent">Run:</span> {{ trend.analysis.analyzedAt | date:'medium' }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .trends-page {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Header ── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--surface-2);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-family: var(--font);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      border-color: var(--accent);
      background: rgba(108, 99, 255, 0.08);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    /* ── Grid ── */
    .trends-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 24px;
    }

    @media (max-width: 768px) {
      .trends-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ── Card ── */
    .trend-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: all 0.3s ease;
      position: relative;
    }

    .trend-card:hover {
      border-color: rgba(108, 99, 255, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    }

    .card-main {
      padding: 28px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .trend-title {
      font-size: 22px;
      font-weight: 800;
      line-height: 1.3;
      letter-spacing: -0.02em;
      color: var(--text);
    }

    .category-pill {
      background: rgba(108, 99, 255, 0.1);
      color: var(--accent);
      border: 1px solid rgba(108, 99, 255, 0.2);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .trend-summary {
      font-size: 15px;
      color: var(--text);
      line-height: 1.6;
      font-weight: 500;
    }

    /* ── Reasoning Box ── */
    .ai-reasoning {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 20px;
      margin-top: 8px;
      position: relative;
    }

    .reasoning-label {
      position: absolute;
      top: -12px;
      left: 16px;
      background: var(--surface-2);
      padding: 0 8px;
      font-size: 11px;
      font-weight: 700;
      color: var(--accent-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ai-reasoning p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }

    /* ── Footer / Stats ── */
    .card-footer {
      background: var(--surface-2);
      border-top: 1px solid var(--border);
      padding: 24px 28px;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .stat-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }

    .stat-val {
      font-size: 14px;
      color: var(--text);
    }

    .text-bold {
      font-weight: 700;
    }

    /* ── Score Bar ── */
    .score-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .score-value {
      font-size: 16px;
      font-weight: 800;
      color: var(--accent);
      width: 32px;
    }

    .score-track {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      border-radius: 2px;
    }

    .bar-animated {
      animation: bar-grow 0.8s ease-out both;
    }
    @keyframes bar-grow { from { width: 0; } }

    /* ── Chips ── */
    .platform-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .platform-chip[data-platform="REDDIT"] { color: #FF6B35; }
    .platform-chip[data-platform="HACKERNEWS"] { color: #FF6600; }
    .platform-chip[data-platform="PRODUCTHUNT"] { color: #DA552F; }

    /* ── Meta Section ── */
    .meta-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .meta-mono {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: var(--text-muted);
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      margin: 0;
      word-break: break-all;
    }

    .text-accent {
      color: var(--accent);
      font-weight: 600;
    }

    /* ── Error & Empty ── */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: rgba(255, 107, 107, 0.08);
      border: 1px solid rgba(255, 107, 107, 0.2);
      border-radius: var(--radius-md);
      color: var(--accent-3);
      font-size: 14px;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: var(--surface);
      border: 1px dashed var(--border);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .empty-state p {
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class TrendsComponent implements OnInit {
  private trendService = inject(TrendService);

  trends = signal<TrendTopic[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadTrends();
  }

  loadTrends() {
    this.loading.set(true);
    this.error.set(null);
    this.trendService.getTopTrends().subscribe({
      next: (data) => {
        this.trends.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  getScorePercent(score: number): number {
    // Assuming score is generally 0-10 or 0-100.
    // If it's a 0-100 scale, simply return the score.
    // Let's cap it at 100 for safety.
    return Math.min(100, Math.max(0, score * 10)); // Example assuming score is 0-10. Adjust if needed based on actual data range.
  }
}
