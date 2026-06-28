import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { ImportJob } from '../../../models';
import { ImportBannerService } from '../../import/services/import-banner.service';

@Component({
  selector: 'app-import-banner',
  standalone: false,
  template: `
    <ng-container *ngIf="bannerService.job$ | async as job">
      <div class="banner" [ngClass]="'banner-' + (isActive(job) ? 'processing' : job.status)">

        <div class="banner-icon-wrap">
          <mat-spinner *ngIf="isActive(job)" [diameter]="18" class="inline-spinner"></mat-spinner>
          <mat-icon *ngIf="job.status === 'completed'" class="status-icon icon-success">check_circle</mat-icon>
          <mat-icon *ngIf="job.status === 'failed'"    class="status-icon icon-warn">error</mat-icon>
        </div>

        <div class="banner-body">
          <ng-container *ngIf="isActive(job)">
            <strong>Import in progress</strong>
            <span class="banner-desc">Importing products in the background — this may take a moment.</span>
          </ng-container>

          <ng-container *ngIf="job.status === 'completed'">
            <strong>Import completed</strong>
            <span class="banner-desc">Your products have been successfully added to the catalog.</span>
          </ng-container>

          <ng-container *ngIf="job.status === 'failed'">
            <strong>Import failed</strong>
            <span class="banner-desc">
              Some rows failed validation.
              <button mat-button class="inline-link" (click)="goToHistory()">View error report</button>
              to review and fix the issues.
            </span>
          </ng-container>
        </div>

        <button
          mat-icon-button
          class="dismiss-btn"
          (click)="dismiss()"
          aria-label="Dismiss"
          matTooltip="Dismiss"
        >
          <mat-icon>close</mat-icon>
        </button>

      </div>
    </ng-container>
  `,
  styles: [`
    .banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      border: 1px solid transparent;
    }

    .banner-processing {
      background: #f0f9ff;
      border-color: #bae6fd;
    }

    .banner-completed {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }

    .banner-failed {
      background: #fffbeb;
      border-color: #fde68a;
    }

    .banner-icon-wrap {
      flex-shrink: 0;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    .icon-success { color: #059669; }
    .icon-warn    { color: #d97706; }

    .banner-body {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: 6px;
      flex-wrap: wrap;
      font-size: 14px;
    }

    .banner-body strong {
      color: #0f172a;
      font-weight: 600;
      white-space: nowrap;
    }

    .banner-desc {
      color: #475569;
      font-size: 13px;
    }

    .inline-link {
      padding: 0 3px !important;
      min-width: 0 !important;
      line-height: inherit !important;
      font-size: 13px !important;
      vertical-align: baseline;
      color: #2563eb !important;
      font-weight: 500 !important;
    }

    .dismiss-btn {
      flex-shrink: 0;
      color: #94a3b8 !important;
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
    }

    .dismiss-btn:hover {
      color: #475569 !important;
      background: rgba(0,0,0,0.05) !important;
    }
  `],
})
export class ImportBannerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public bannerService: ImportBannerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.bannerService.job$.pipe(
      filter(job => job?.status === 'completed'),
      take(1),
      switchMap(() => timer(5000)),
      takeUntil(this.destroy$),
    ).subscribe(() => this.bannerService.dismiss());
  }

  isActive(job: ImportJob): boolean {
    return job.status === 'pending' || job.status === 'processing';
  }

  dismiss(): void {
    this.bannerService.dismiss();
  }

  goToHistory(): void {
    this.router.navigate(['/import/history']);
    this.bannerService.dismiss();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
