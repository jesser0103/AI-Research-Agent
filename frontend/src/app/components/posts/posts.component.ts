// src/app/components/posts/posts.component.ts  (phase3-redesign)
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrapeService } from '../../services/scrape.service';
import { ScrapedPost } from '../../models/scraped-post.model';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="posts-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Scraped Posts</h1>
          <p class="page-subtitle">Raw data collected from all platforms</p>
        </div>
        <div class="header-actions">
          <div class="post-count" id="post-count-badge">
            @if (!loading() && posts().length > 0) {
              <span class="count-num">{{ posts().length }}</span> posts
            }
          </div>
          <button (click)="loadPosts()" [disabled]="loading()" class="btn-primary" id="refresh-posts-btn">
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
      </div>

      <!-- Loading: Skeleton -->
      @if (loading()) {
        <div class="posts-list">
          @for (i of [1,2,3,4]; track i) {
            <div class="post-card">
              <div class="skeleton skeleton-title"></div>
              <div class="skeleton skeleton-text" style="width: 80%"></div>
              <div class="skeleton skeleton-text" style="width: 60%"></div>
              <div style="display: flex; gap: 8px; margin-top: 16px">
                <div class="skeleton" style="width: 80px; height: 26px; border-radius: 6px"></div>
                <div class="skeleton" style="width: 80px; height: 26px; border-radius: 6px"></div>
                <div class="skeleton" style="width: 80px; height: 26px; border-radius: 6px"></div>
              </div>
            </div>
          }
        </div>
      } @else if (error()) {
        <div class="error-banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Failed to load posts: {{ error() }}
        </div>
      } @else if (posts().length === 0) {
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-dim)">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>No posts found. Trigger a scrape cycle from the dashboard.</p>
        </div>
      } @else {
        <div class="posts-list">
          @for (post of posts(); track post.id) {
            <div class="post-card animate-in">
              <div class="post-top">
                <div class="post-main">
                  <h3 class="post-title">{{ post.title }}</h3>
                  <div class="post-meta">
                    <span class="chip chip-platform" [attr.data-platform]="post.platform">{{ post.platform }}</span>
                    <span class="chip chip-neutral">Score: {{ post.score }}</span>
                    <span class="chip chip-neutral">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {{ post.commentCount }}
                    </span>
                    @if (post.subReddit) {
                      <span class="chip chip-subreddit">r/{{ post.subReddit }}</span>
                    }
                    @if (post.author) {
                      <span class="chip chip-neutral">u/{{ post.author }}</span>
                    }
                  </div>
                </div>
              </div>

              <div class="post-details">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">External ID</span>
                    <span class="detail-value mono">{{ post.externalId }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Proxy IP</span>
                    <span class="detail-value mono accent-ip">{{ post.proxyIpUsed || 'Direct' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Scraped At</span>
                    <span class="detail-value">{{ post.scrapedAt | date:'short' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Posted At</span>
                    <span class="detail-value">{{ post.postedAt ? (post.postedAt | date:'short') : 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="post-body">
                <p>{{ post.content || 'No content body available.' }}</p>
              </div>

              <div class="post-footer">
                <a [href]="post.url" target="_blank" rel="noopener" class="link-source" id="post-link-{{ post.id }}">
                  View Original Source
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .posts-page {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .post-count {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .count-num {
      color: var(--accent);
      font-weight: 700;
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

    /* ── Post Cards ── */
    .posts-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .post-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .post-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }

    .post-top {
      padding: 24px 24px 16px;
    }

    .post-title {
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: -0.01em;
      margin-bottom: 12px;
      color: var(--text);
    }

    .post-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }

    /* ── Chips ── */
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .chip-neutral {
      background: var(--surface-2);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .chip-platform {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 10px;
      font-weight: 700;
    }

    .chip-platform[data-platform="REDDIT"] {
      background: rgba(255, 107, 53, 0.12);
      color: #FF6B35;
      border: 1px solid rgba(255, 107, 53, 0.2);
    }

    .chip-platform[data-platform="HACKERNEWS"] {
      background: rgba(255, 102, 0, 0.12);
      color: #FF6600;
      border: 1px solid rgba(255, 102, 0, 0.2);
    }

    .chip-platform[data-platform="PRODUCTHUNT"] {
      background: rgba(218, 85, 47, 0.12);
      color: #DA552F;
      border: 1px solid rgba(218, 85, 47, 0.2);
    }

    .chip-subreddit {
      background: rgba(255, 107, 53, 0.08);
      color: #FF8C5A;
      border: 1px solid rgba(255, 107, 53, 0.15);
    }

    /* ── Details ── */
    .post-details {
      padding: 0 24px 16px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      padding: 14px 16px;
      background: var(--surface-2);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
    }

    .detail-label {
      display: block;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      margin-bottom: 4px;
      font-weight: 500;
    }

    .detail-value {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .mono {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }

    .accent-ip {
      color: var(--accent-2);
    }

    /* ── Body ── */
    .post-body {
      padding: 0 24px 16px;
    }

    .post-body p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.7;
      background: var(--surface-2);
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      white-space: pre-wrap;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* ── Footer ── */
    .post-footer {
      padding: 14px 24px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
    }

    .link-source {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--accent);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .link-source:hover {
      color: #8B83FF;
      transform: translateX(2px);
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
export class PostsComponent implements OnInit {
  private scrapeService = inject(ScrapeService);

  posts = signal<ScrapedPost[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.error.set(null);
    this.scrapeService.getRecentPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
