import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'posts', 
        loadComponent: () => import('./components/posts/posts.component').then(m => m.PostsComponent) 
      },
      { 
        path: 'trends', 
        loadComponent: () => import('./components/trends/trends.component').then(m => m.TrendsComponent) 
      }
    ]
  }
];
