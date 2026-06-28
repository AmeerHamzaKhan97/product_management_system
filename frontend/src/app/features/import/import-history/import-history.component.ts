import { Component, OnInit } from '@angular/core';
import { ImportJob } from '../../../models';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ImportService } from '../services/import.service';

@Component({
  selector: 'app-import-history',
  standalone: false,
  template: `
    <!-- ── Page header ───────────────────────────────────── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Import History</h1>
        <p class="page-subtitle">Track your CSV import jobs and download error reports</p>
      </div>
    </div>

    <!-- ── Stats row ─────────────────────────────────────── -->
    <div class="stats-row" *ngIf="!loading && jobs.length > 0">
      <div class="stat-card">
        <span class="stat-value">{{ jobs.length }}</span>
        <span class="stat-label">Total Imports</span>
      </div>
      <div class="stat-card stat-success">
        <span class="stat-value success-text">{{ completedCount }}</span>
        <span class="stat-label">Completed</span>
      </div>
      <div class="stat-card stat-error" *ngIf="failedCount > 0">
        <span class="stat-value error-text">{{ failedCount }}</span>
        <span class="stat-label">Failed</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalRowsImported | number }}</span>
        <span class="stat-label">Rows Imported</span>
      </div>
    </div>

    <!-- ── Table card ────────────────────────────────────── -->
    <div class="table-card">

      <!-- Loading -->
      <div *ngIf="loading" class="loading-wrap">
        <mat-progress-spinner mode="indeterminate" [diameter]="40"></mat-progress-spinner>
        <p class="loading-text">Loading import history…</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && jobs.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <mat-icon class="empty-icon">upload_file</mat-icon>
        </div>
        <h3 class="empty-title">No imports yet</h3>
        <p class="empty-desc">Upload a CSV file from the Products page to get started.</p>
      </div>

      <!-- Table -->
      <div class="table-container" *ngIf="!loading && jobs.length > 0">
        <table mat-table [dataSource]="jobs" class="history-table" aria-label="Import history table">

          <!-- File Name -->
          <ng-container matColumnDef="fileName">
            <mat-header-cell *matHeaderCellDef>File Name</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <div class="file-cell">
                <mat-icon class="file-icon">description</mat-icon>
                <span class="filename-text">{{ row.fileName }}</span>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Upload Date -->
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef>Uploaded</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="date-value">{{ row.createdAt | date:'mediumDate' }}</span>
              <span class="time-value">{{ row.createdAt | date:'shortTime' }}</span>
            </mat-cell>
          </ng-container>

          <!-- Status -->
          <ng-container matColumnDef="status">
            <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <div class="status-chip" [ngClass]="'chip-' + row.status">
                <mat-icon class="chip-icon">{{ statusIcon(row.status) }}</mat-icon>
                <span>{{ row.status | titlecase }}</span>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Total Records -->
          <ng-container matColumnDef="totalRows">
            <mat-header-cell *matHeaderCellDef>Total</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="count-value">{{ row.totalRows ?? '—' }}</span>
            </mat-cell>
          </ng-container>

          <!-- Successful Records -->
          <ng-container matColumnDef="successfulRows">
            <mat-header-cell *matHeaderCellDef>Successful</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="count-value count-success" *ngIf="row.successfulRows > 0">
                <mat-icon class="count-icon">check</mat-icon>
                {{ row.successfulRows }}
              </span>
              <span class="count-value count-neutral" *ngIf="!row.successfulRows || row.successfulRows === 0">
                {{ row.successfulRows ?? '—' }}
              </span>
            </mat-cell>
          </ng-container>

          <!-- Failed Records -->
          <ng-container matColumnDef="failedRows">
            <mat-header-cell *matHeaderCellDef>Failed</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="count-value count-failed" *ngIf="row.failedRows > 0">
                <mat-icon class="count-icon">close</mat-icon>
                {{ row.failedRows }}
              </span>
              <span class="count-value count-neutral" *ngIf="!row.failedRows || row.failedRows === 0">
                0
              </span>
            </mat-cell>
          </ng-container>

          <!-- Actions -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef class="col-actions"></mat-header-cell>
            <mat-cell *matCellDef="let row" class="col-actions">
              <button
                *ngIf="row.status === 'failed' && row.errorCsvPath"
                mat-stroked-button
                color="warn"
                (click)="downloadErrorReport(row)"
                [disabled]="downloadingJobId === row.jobId"
                matTooltip="Download error report CSV"
                aria-label="Download error report"
                class="error-report-btn"
              >
                <mat-icon>download</mat-icon>
                <span class="btn-label">Error Report</span>
              </button>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </table>
      </div>

      <!-- Footer -->
      <div *ngIf="!loading && jobs.length > 0" class="table-footer">
        <span class="footer-label">{{ jobs.length }} import{{ jobs.length !== 1 ? 's' : '' }} total</span>
      </div>
    </div>
  `,
  styles: [`
    /* ── Page header ───────────────────────────────────── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      gap: 16px;
    }

    .page-title {
      margin: 0 0 4px;
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }

    /* ── Stats row ─────────────────────────────────────── */
    .stats-row {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 110px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .success-text { color: #059669; }
    .error-text   { color: #dc2626; }

    /* ── Table card ────────────────────────────────────── */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .table-container { overflow-x: auto; }

    .history-table { width: 100%; }

    .col-actions {
      width: 148px;
      padding-right: 12px !important;
    }

    /* ── File cell ─────────────────────────────────────── */
    .file-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 260px;
      overflow: hidden;
    }

    .file-icon {
      font-size: 16px !important;
      width: 16px !important;
      height: 16px !important;
      color: #94a3b8;
      flex-shrink: 0;
    }

    .filename-text {
      font-size: 13px;
      font-weight: 500;
      color: #0f172a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ── Date cell ─────────────────────────────────────── */
    .date-value {
      font-size: 13px;
      color: #0f172a;
      display: block;
    }

    .time-value {
      font-size: 11px;
      color: #94a3b8;
      display: block;
    }

    /* ── Status chip ───────────────────────────────────── */
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px 4px 7px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    .chip-icon {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
    }

    .chip-pending {
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .chip-processing {
      background: #f0f9ff;
      color: #0284c7;
      border: 1px solid #bae6fd;
    }

    .chip-completed {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }

    .chip-failed {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }

    /* ── Count values ──────────────────────────────────── */
    .count-value {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 13px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }

    .count-icon {
      font-size: 13px !important;
      width: 13px !important;
      height: 13px !important;
    }

    .count-neutral { color: #94a3b8; font-weight: 400; }
    .count-success { color: #059669; }
    .count-failed  { color: #dc2626; }

    /* ── Error report button ───────────────────────────── */
    .error-report-btn {
      font-size: 12px !important;
      height: 32px !important;
      padding: 0 10px !important;
      border-color: #fecaca !important;
      color: #dc2626 !important;
    }

    .error-report-btn:hover {
      background: #fef2f2 !important;
    }

    /* ── Loading / Empty ───────────────────────────────── */
    .loading-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 64px 24px;
      gap: 16px;
    }

    .loading-text {
      margin: 0;
      font-size: 14px;
      color: #94a3b8;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 72px 24px;
      gap: 12px;
      text-align: center;
    }

    .empty-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .empty-icon {
      font-size: 36px !important;
      width: 36px !important;
      height: 36px !important;
      color: #2563eb;
    }

    .empty-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #0f172a;
    }

    .empty-desc {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }

    /* ── Footer ────────────────────────────────────────── */
    .table-footer {
      padding: 10px 16px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
    }

    .footer-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* ── Responsive ────────────────────────────────────── */
    @media (max-width: 480px) {
      .stats-row { gap: 8px; }
      .stat-card { min-width: 90px; padding: 12px 14px; }
      .btn-label { display: none; }
    }
  `],
})
export class ImportHistoryComponent implements OnInit {
  displayedColumns = [
    'fileName', 'createdAt', 'status',
    'totalRows', 'successfulRows', 'failedRows', 'actions',
  ];

  jobs: ImportJob[] = [];
  loading = false;
  downloadingJobId: string | null = null;

  constructor(
    private importService: ImportService,
    private snackbar: SnackbarService,
  ) {}

  get completedCount(): number {
    return this.jobs.filter(j => j.status === 'completed').length;
  }

  get failedCount(): number {
    return this.jobs.filter(j => j.status === 'failed').length;
  }

  get totalRowsImported(): number {
    return this.jobs.reduce((sum, j) => sum + (j.successfulRows ?? 0), 0);
  }

  statusIcon(status: string): string {
    switch (status) {
      case 'completed':  return 'check_circle';
      case 'failed':     return 'error';
      case 'processing': return 'autorenew';
      case 'pending':    return 'schedule';
      default:           return 'help_outline';
    }
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.importService.getHistory().subscribe({
      next: jobs => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: () => {
        this.snackbar.error('Failed to load import history.');
        this.loading = false;
      },
    });
  }

  downloadErrorReport(job: ImportJob): void {
    this.downloadingJobId = job.jobId;
    this.importService.downloadErrorCsv(job.jobId).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-report-${job.jobId}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloadingJobId = null;
      },
      error: () => {
        this.snackbar.error('Failed to download error report.');
        this.downloadingJobId = null;
      },
    });
  }
}
