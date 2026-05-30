// src/app/components/dashboard/dashboard.component.ts  (phase3-redesign)
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendService } from '../../services/trend.service';
import { ScrapeService } from '../../services/scrape.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Real-time overview of your research pipeline</p>
        </div>
        <button (click)="loadStats()" [disabled]="loading()" class="btn-primary" id="refresh-stats-btn">
          @if (loading()) {
            <span class="btn-spinner"></span>
          } @else {
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          }
          Refresh Stats
        </button>
      </div>

      <!-- Loading State: Skeleton -->
      @if (loading()) {
        <div class="stats-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="stat-card">
              <div class="skeleton skeleton-text" style="width: 50%"></div>
              <div class="skeleton skeleton-title" style="width: 70%; height: 36px; margin-top: 12px"></div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error() }}
        </div>
      } @else if (stats()) {
        <!-- Stat Cards -->
        <div class="stats-grid">
          <div class="stat-card animate-in">
            <div class="stat-label">Total Posts</div>
            <div class="stat-value">
              <span class="stat-number" id="stat-totalPosts">{{ animatedValues()['totalPosts'] || 0 }}</span>
            </div>
            <div class="stat-trend trend-up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
              Active pipeline
            </div>
          </div>
          <div class="stat-card animate-in">
            <div class="stat-label">Reddit Posts</div>
            <div class="stat-value">
              <span class="stat-number" id="stat-redditPosts">{{ animatedValues()['redditPosts'] || 0 }}</span>
            </div>
            <div class="stat-icon-badge" style="color: #FF6B35">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 13.38c.15.36.24.74.24 1.14 0 2.92-3.4 5.29-7.59 5.29-4.19 0-7.59-2.37-7.59-5.29 0-.4.09-.78.24-1.14-.78-.45-1.3-1.3-1.3-2.27 0-1.45 1.17-2.62 2.62-2.62.72 0 1.37.29 1.84.76 1.41-.91 3.31-1.51 5.38-1.6l1.11-3.93a.45.45 0 0 1 .55-.32l3.05.68c.28-.58.87-.98 1.56-.98.95 0 1.72.77 1.72 1.72s-.77 1.72-1.72 1.72c-.91 0-1.65-.7-1.72-1.59l-2.62-.59-.96 3.4c1.98.13 3.81.73 5.18 1.6.48-.48 1.13-.77 1.85-.77 1.45 0 2.62 1.17 2.62 2.62 0 .97-.53 1.82-1.31 2.27z"/></svg>
            </div>
          </div>
          <div class="stat-card animate-in">
            <div class="stat-label">HackerNews Posts</div>
            <div class="stat-value">
              <span class="stat-number" id="stat-hnPosts">{{ animatedValues()['hnPosts'] || 0 }}</span>
            </div>
            <div class="stat-icon-badge" style="color: #FF6600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0v24h24V0H0zm11.09 14.29V20h1.75v-5.71L17.16 4h-1.97l-3.24 7.57L8.72 4H6.78l4.31 10.29z"/></svg>
            </div>
          </div>
          <div class="stat-card animate-in">
            <div class="stat-label">ProductHunt Posts</div>
            <div class="stat-value">
              <span class="stat-number" id="stat-phPosts">{{ animatedValues()['phPosts'] || 0 }}</span>
            </div>
            <div class="stat-icon-badge" style="color: #DA552F">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.125 15H9.75V9h3.375C14.784 9 16 10.216 16 11.875v.25C16 13.784 14.784 15 13.125 15z"/></svg>
            </div>
          </div>
          <div class="stat-card animate-in">
            <div class="stat-label">Total Trends</div>
            <div class="stat-value">
              <span class="stat-number" id="stat-totalTrends">{{ animatedValues()['totalTrends'] || 0 }}</span>
            </div>
            <div class="stat-trend trend-up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              LLM detected
            </div>
          </div>
          <div class="stat-card animate-in">
            <div class="stat-label">Last Analysis</div>
            <div class="stat-value stat-value-sm">
              <span id="stat-lastAnalysis">{{ stats()!['lastAnalysis'] | date:'MMM d, HH:mm' }}</span>
            </div>
            <div class="stat-trend">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Timestamp
            </div>
          </div>
        </div>

        <!-- Platform Breakdown Chart -->
        <div class="chart-card animate-in">
          <h2 class="section-title">Platform Breakdown</h2>
          <div class="bar-chart">
            @if (stats()!['redditPosts'] || stats()!['hnPosts'] || stats()!['phPosts']) {
              <div class="bar-row">
                <span class="bar-label">Reddit</span>
                <div class="bar-track">
                  <div class="bar-fill bar-animated" [style.width.%]="getBarPercent('redditPosts')">
                    <span class="bar-value">{{ stats()!['redditPosts'] }}</span>
                  </div>
                </div>
              </div>
              <div class="bar-row">
                <span class="bar-label">HackerNews</span>
                <div class="bar-track">
                  <div class="bar-fill bar-animated" [style.width.%]="getBarPercent('hnPosts')">
                    <span class="bar-value">{{ stats()!['hnPosts'] }}</span>
                  </div>
                </div>
              </div>
              <div class="bar-row">
                <span class="bar-label">ProductHunt</span>
                <div class="bar-track">
                  <div class="bar-fill bar-animated" [style.width.%]="getBarPercent('phPosts')">
                    <span class="bar-value">{{ stats()!['phPosts'] }}</span>
                  </div>
                </div>
              </div>
            } @else {
              <div class="empty-chart">No data yet — run a scrape cycle</div>
            }
          </div>
        </div>
      }

      <!-- Scrape Trigger Section -->
      <div class="action-card">
        <div class="action-header">
          <div>
            <h2 class="section-title">Run AI Agent Pipeline</h2>
            <p class="section-desc">Scrape all platforms, then analyze with LLM</p>
          </div>
          <div class="scrape-status">
            <span class="status-dot" [class.idle]="!scraping()" [class.running]="scraping()" [class.done]="scrapeResult() && !scraping()"></span>
            <span class="status-text">{{ scraping() ? 'Running...' : scrapeResult() ? 'Complete' : 'Idle' }}</span>
          </div>
        </div>
        <button (click)="triggerScrape()" [disabled]="scraping()" class="btn-accent" id="trigger-scrape-btn">
          @if (scraping()) {
            <span class="btn-spinner"></span>
            Running Orchestrator Cycle...
          } @else {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Trigger Full Scrape & Analysis
          }
        </button>
        @if (scrapeResult()) {
          <div class="result-block animate-in">
            <pre>{{ scrapeResult() | json }}</pre>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ── Page Header ── */
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

    /* ── Buttons ── */
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

    .btn-accent {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: var(--accent);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 0 0 0 rgba(108, 99, 255, 0);
    }

    .btn-accent:hover:not(:disabled) {
      box-shadow: 0 0 24px rgba(108, 99, 255, 0.35);
      transform: translateY(-1px);
    }

    .btn-accent:disabled {
      opacity: 0.6;
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

    /* ── Stats Grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 24px;
      position: relative;
      transition: border-color 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--border-hover);
    }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 12px;
    }

    .stat-value {
      font-size: 36px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat-value-sm {
      font-size: 18px;
      font-weight: 600;
    }

    .stat-number {
      display: inline-block;
      animation: count-up-fade 0.5s ease-out both;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 12px;
    }

    .stat-trend.trend-up {
      color: var(--accent-2);
    }

    .stat-trend.trend-down {
      color: var(--accent-3);
    }

    .stat-icon-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      opacity: 0.6;
    }

    /* ── Chart Card ── */
    .chart-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }

    .bar-chart {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .bar-label {
      width: 100px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      text-align: right;
      flex-shrink: 0;
    }

    .bar-track {
      flex: 1;
      height: 32px;
      background: var(--surface-2);
      border-radius: var(--radius-sm);
      overflow: hidden;
      position: relative;
    }

    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;
      min-width: 40px;
      position: relative;
    }

    .bar-animated {
      animation: bar-grow 0.8s ease-out both;
    }

    .bar-value {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .empty-chart {
      text-align: center;
      color: var(--text-muted);
      padding: 32px;
      font-size: 14px;
    }

    /* ── Action Card ── */
    .action-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 28px;
    }

    .action-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .section-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .scrape-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .status-dot.idle {
      background: var(--text-dim);
    }

    .status-dot.running {
      background: var(--accent);
      animation: pulse-glow 1s ease-in-out infinite;
      color: var(--accent);
    }

    .status-dot.done {
      background: var(--accent-2);
      animation: pulse-glow 2s ease-in-out infinite;
      color: var(--accent-2);
    }

    .status-text {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .result-block {
      margin-top: 20px;
      padding: 20px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: auto;
    }

    .result-block pre {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 12px;
      color: var(--accent-2);
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }

    /* ── Error Banner ── */
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
  `]
})
export class DashboardComponent implements OnInit {
  private trendService = inject(TrendService);
  private scrapeService = inject(ScrapeService);

  stats = signal<Record<string, any> | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  animatedValues = signal<Record<string, number>>({});

  scraping = signal<boolean>(false);
  scrapeResult = signal<any>(null);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.error.set(null);
    this.trendService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        this.animateCounters(data);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  triggerScrape() {
    this.scraping.set(true);
    this.scrapeService.triggerFullCycle().subscribe({
      next: (res) => {
        this.scrapeResult.set(res);
        this.scraping.set(false);
        this.loadStats();
      },
      error: (err) => {
        this.scrapeResult.set({ error: err.message });
        this.scraping.set(false);
      }
    });
  }

  getBarPercent(key: string): number {
    const s = this.stats();
    if (!s) return 0;
    const total = (s['redditPosts'] || 0) + (s['hnPosts'] || 0) + (s['phPosts'] || 0);
    if (total === 0) return 0;
    return Math.max(5, ((s[key] || 0) / total) * 100);
  }

  private animateCounters(data: Record<string, any>) {
    const keys = ['totalPosts', 'redditPosts', 'hnPosts', 'phPosts', 'totalTrends'];
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const vals: Record<string, number> = {};
      keys.forEach(k => {
        const target = Number(data[k]) || 0;
        vals[k] = Math.round(target * eased);
      });
      this.animatedValues.set(vals);
      if (step >= steps) {
        clearInterval(timer);
        // Set final exact values
        const finalVals: Record<string, number> = {};
        keys.forEach(k => finalVals[k] = Number(data[k]) || 0);
        this.animatedValues.set(finalVals);
      }
    }, interval);
  }
}
