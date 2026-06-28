import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  template: `
    <header class="app-header">
      <div class="header-inner">

        <!-- Brand -->
        <div class="header-brand">
          <div class="brand-logo-wrap">
            <mat-icon class="brand-logo-icon">inventory_2</mat-icon>
          </div>
          <span class="brand-name">ProductHub</span>
        </div>

        <!-- Navigation -->
        <nav class="header-nav" aria-label="Main navigation">
          <a routerLink="/dashboard" routerLinkActive="nav-active" class="nav-link" aria-label="Products">
            <mat-icon class="nav-icon">grid_view</mat-icon>
            <span class="nav-label">Products</span>
          </a>
          <a routerLink="/categories" routerLinkActive="nav-active" class="nav-link" aria-label="Categories">
            <mat-icon class="nav-icon">label</mat-icon>
            <span class="nav-label">Categories</span>
          </a>
          <a routerLink="/import/history" routerLinkActive="nav-active" class="nav-link" aria-label="Import History">
            <mat-icon class="nav-icon">upload_file</mat-icon>
            <span class="nav-label">Import History</span>
          </a>
        </nav>

        <!-- User section -->
        <div class="header-user">
          <div class="user-avatar" [title]="userEmail">{{ userInitials }}</div>
          <span class="user-email-text">{{ userEmail }}</span>
          <button
            mat-icon-button
            (click)="logout()"
            matTooltip="Sign out"
            aria-label="Sign out"
            class="signout-btn"
          >
            <mat-icon>logout</mat-icon>
          </button>
        </div>

      </div>
    </header>

    <main class="main-content">
      <div class="content-wrapper">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: [`
    /* ── Header ─────────────────────────────────── */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 12px rgba(0,0,0,0.3);
    }

    .header-inner {
      display: flex;
      align-items: center;
      height: 62px;
      padding: 0 24px;
      gap: 8px;
    }

    /* Brand */
    .header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .brand-logo-wrap {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      flex-shrink: 0;
    }

    .brand-logo-icon {
      color: #fff;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.02em;
      white-space: nowrap;
    }

    /* Navigation */
    .header-nav {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 7px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.55);
      transition: background 0.15s ease, color 0.15s ease;
      cursor: pointer;
      line-height: 1;
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.85);
    }

    .nav-link.nav-active {
      background: rgba(255,255,255,0.1);
      color: #ffffff;
    }

    .nav-icon {
      font-size: 17px;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
    }

    /* User section */
    .header-user {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
      flex-shrink: 0;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      letter-spacing: 0.5px;
      box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
    }

    .user-email-text {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .signout-btn {
      color: rgba(255,255,255,0.4) !important;
      flex-shrink: 0;
    }

    .signout-btn:hover {
      color: rgba(255,255,255,0.8) !important;
      background: rgba(255,255,255,0.07) !important;
    }

    /* ── Content ─────────────────────────────────── */
    .main-content {
      min-height: calc(100vh - 62px);
      background: #f1f5f9;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 28px 24px;
    }

    /* ── Responsive ─────────────────────────────── */
    @media (max-width: 900px) {
      .nav-label      { display: none; }
      .nav-link       { padding: 8px; }
      .user-email-text { display: none; }
    }

    @media (max-width: 600px) {
      .header-inner   { padding: 0 16px; height: 56px; }
      .brand-name     { display: none; }
      .content-wrapper { padding: 16px; }
      .main-content   { min-height: calc(100vh - 56px); }
    }
  `],
})
export class MainLayoutComponent {
  get userEmail(): string {
    return this.authService.getCurrentUser()?.email ?? '';
  }

  get userInitials(): string {
    const email = this.authService.getCurrentUser()?.email ?? '';
    const local = email.split('@')[0];
    const parts = local.split(/[._\-+]/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.substring(0, 2).toUpperCase();
  }

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
