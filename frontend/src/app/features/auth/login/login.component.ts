import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="login-page">

      <!-- Left panel: branding -->
      <div class="login-brand-panel" aria-hidden="true">
        <div class="brand-content">
          <div class="brand-logo-wrap">
            <mat-icon class="brand-icon">inventory_2</mat-icon>
          </div>
          <h2 class="brand-headline">Manage your products with confidence.</h2>
          <p class="brand-body">
            Track inventory, organize categories, and bulk-import via CSV — all in one place.
          </p>
          <div class="brand-features">
            <div class="feature-item">
              <mat-icon>check_circle</mat-icon>
              <span>Real-time inventory tracking</span>
            </div>
            <div class="feature-item">
              <mat-icon>check_circle</mat-icon>
              <span>Bulk CSV import with error reports</span>
            </div>
            <div class="feature-item">
              <mat-icon>check_circle</mat-icon>
              <span>Category management</span>
            </div>
            <div class="feature-item">
              <mat-icon>check_circle</mat-icon>
              <span>Exportable product reports</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel: form -->
      <div class="login-form-panel">
        <div class="login-card">

          <div class="login-header">
            <div class="header-logo-wrap">
              <mat-icon class="header-logo-icon">inventory_2</mat-icon>
            </div>
            <h1 class="login-title">ProductHub</h1>
            <p class="login-subtitle">Sign in to your account</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email address</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">mail_outline</mat-icon>
              <input
                matInput
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="you@example.com"
              />
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Enter a valid email address</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="field-prefix-icon">lock_outline</mat-icon>
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword = !hidePassword"
                [attr.aria-label]="hidePassword ? 'Show password' : 'Hide password'"
                class="toggle-pw-btn"
              >
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div class="submit-row">
              <button
                *ngIf="!loading"
                mat-flat-button
                color="primary"
                type="submit"
                class="login-btn"
                [disabled]="form.invalid"
              >
                Sign In
                <mat-icon class="btn-arrow">arrow_forward</mat-icon>
              </button>
              <div *ngIf="loading" class="spinner-row">
                <mat-progress-spinner mode="indeterminate" [diameter]="36" class="login-spinner"></mat-progress-spinner>
                <span class="loading-text">Signing in…</span>
              </div>
            </div>

          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Layout ─────────────────────────────────────────── */
    .login-page {
      display: flex;
      min-height: 100vh;
    }

    /* Left branding panel */
    .login-brand-panel {
      flex: 1;
      background: linear-gradient(145deg, #0f172a 0%, #1e3a5f 55%, #0f2558 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      position: relative;
      overflow: hidden;
    }

    .login-brand-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 28px 28px;
    }

    .brand-content {
      position: relative;
      max-width: 380px;
    }

    .brand-logo-wrap {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
    }

    .brand-icon {
      color: #fff;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-headline {
      margin: 0 0 16px;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
      letter-spacing: -0.03em;
    }

    .brand-body {
      margin: 0 0 32px;
      font-size: 16px;
      color: rgba(255,255,255,0.55);
      line-height: 1.6;
    }

    .brand-features {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255,255,255,0.75);
      font-size: 14px;
      font-weight: 500;
    }

    .feature-item mat-icon {
      color: #34d399;
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    /* Right form panel */
    .login-form-panel {
      width: 480px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 32px 40px;
    }

    /* ── Login card ──────────────────────────────────────── */
    .login-card {
      width: 100%;
      max-width: 380px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
      overflow: hidden;
    }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 32px 20px;
      text-align: center;
      background: #ffffff;
      border-bottom: 1px solid #f1f5f9;
    }

    .header-logo-wrap {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .header-logo-icon {
      color: #fff;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .login-title {
      margin: 0 0 4px;
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .login-subtitle {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }

    /* ── Form ────────────────────────────────────────────── */
    .login-form {
      padding: 24px 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .form-field {
      width: 100%;
      display: block;
      margin-bottom: 8px;
    }

    .field-prefix-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: #94a3b8 !important;
      margin-right: 6px !important;
    }

    .toggle-pw-btn {
      color: #94a3b8 !important;
    }

    .submit-row {
      margin-top: 8px;
    }

    .login-btn {
      width: 100%;
      height: 46px;
      font-size: 15px;
      font-weight: 600 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .btn-arrow {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      transition: transform 0.2s ease;
    }

    .login-btn:hover .btn-arrow {
      transform: translateX(3px);
    }

    .spinner-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 4px 0;
      color: #64748b;
      font-size: 14px;
    }

    .login-spinner {
      --mdc-circular-progress-active-indicator-color: #2563eb;
    }

    /* ── Responsive ─────────────────────────────────────── */
    @media (max-width: 900px) {
      .login-brand-panel { display: none; }
      .login-form-panel { width: 100%; padding: 24px 16px; }
    }

    @media (max-width: 480px) {
      .login-form-panel { padding: 16px; }
      .login-form { padding: 20px 20px 24px; }
      .login-header { padding: 24px 20px 16px; }
    }
  `],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        const message = err?.error?.message ?? 'Login failed. Please try again.';
        this.snackbar.error(message);
      },
    });
  }
}
