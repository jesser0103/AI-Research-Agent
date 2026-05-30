// src/app/shared/layout/layout.component.ts  (phase3-redesign)
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span class="brand-dot"></span>
          </div>
          <div class="brand-text">
            <span class="brand-name">AI Research</span>
            <span class="brand-sub">Agent</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/posts" routerLinkActive="active" class="nav-link">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Scraped Posts</span>
          </a>
          <a routerLink="/trends" routerLinkActive="active" class="nav-link">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>Trend Analysis</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="version-badge">v1.0.0 — Angular 21</div>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      background: var(--bg);
      overflow: hidden;
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 260px;
      min-width: 260px;
      background: var(--surface-2);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border);
      position: relative;
      z-index: 10;
    }

    .sidebar-brand {
      padding: 28px 24px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1px solid var(--border);
    }

    .brand-icon {
      position: relative;
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: var(--accent);
      border-radius: 50%;
      animation: pulse-glow 2s ease-in-out infinite;
      box-shadow: 0 0 8px var(--accent);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .brand-sub {
      font-size: 13px;
      font-weight: 400;
      color: var(--text-muted);
      letter-spacing: 0.02em;
    }

    /* ── Navigation ── */
    .sidebar-nav {
      flex: 1;
      padding: 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 12px;
      color: var(--text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      position: relative;
    }

    .nav-link:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.04);
    }

    .nav-link.active {
      color: var(--accent);
      background: rgba(108, 99, 255, 0.12);
      border-left-color: var(--accent);
    }

    .nav-link.active .nav-icon {
      stroke: var(--accent);
    }

    .nav-icon {
      flex-shrink: 0;
      opacity: 0.7;
      transition: all 0.2s ease;
    }

    .nav-link:hover .nav-icon,
    .nav-link.active .nav-icon {
      opacity: 1;
    }

    /* ── Footer ── */
    .sidebar-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border);
    }

    .version-badge {
      font-size: 11px;
      color: var(--text-dim);
      letter-spacing: 0.05em;
      text-align: center;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
    }

    /* ── Main Content ── */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      background: var(--bg);
    }
  `]
})
export class LayoutComponent {}
