import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ImportService } from '../services/import.service';

@Component({
  selector: 'app-upload-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Upload Product CSV</h2>

    <mat-dialog-content class="upload-content">

      <div class="info-box">
        <mat-icon class="info-icon">info_outline</mat-icon>
        <p class="info-text">
          Required columns: <strong>Product Name</strong>, <strong>Category</strong>,
          <strong>Price</strong>, <strong>Image URL</strong>. Only <code>.csv</code> files are accepted.
        </p>
      </div>

      <input
        #fileInput
        type="file"
        accept=".csv"
        (change)="onFileSelected($event)"
        style="display: none"
      />

      <div
        class="drop-zone"
        [class.has-file]="selectedFile"
        (click)="fileInput.click()"
        role="button"
        aria-label="Click to select a CSV file"
      >
        <div class="drop-zone-inner" *ngIf="!selectedFile">
          <div class="drop-icon-wrap">
            <mat-icon class="drop-icon">cloud_upload</mat-icon>
          </div>
          <p class="drop-title">Click to select a file</p>
          <p class="drop-hint">CSV files only</p>
        </div>

        <div class="file-selected" *ngIf="selectedFile">
          <mat-icon class="file-icon">description</mat-icon>
          <div class="file-info">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
          </div>
          <mat-icon class="file-check">check_circle</mat-icon>
        </div>
      </div>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()" [disabled]="uploading" class="cancel-btn">
        Cancel
      </button>
      <button
        mat-flat-button
        color="primary"
        type="button"
        [disabled]="!selectedFile || uploading"
        (click)="onUpload()"
        class="upload-btn"
      >
        <mat-spinner *ngIf="uploading" [diameter]="16" class="btn-spinner"></mat-spinner>
        <mat-icon *ngIf="!uploading">cloud_upload</mat-icon>
        {{ uploading ? 'Uploading…' : 'Upload' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .upload-content {
      padding: 0 24px 8px !important;
      min-width: min(420px, calc(100vw - 64px));
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Info box */
    .info-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 8px;
    }

    .info-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: #0284c7;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .info-text {
      margin: 0;
      font-size: 13px;
      color: #0369a1;
      line-height: 1.5;
    }

    .info-text code {
      font-family: 'SFMono-Regular', Consolas, monospace;
      background: rgba(2, 132, 199, 0.1);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 12px;
    }

    /* Drop zone */
    .drop-zone {
      border: 2px dashed #e2e8f0;
      border-radius: 10px;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      min-height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drop-zone:hover {
      border-color: #2563eb;
      background: #eff6ff;
    }

    .drop-zone.has-file {
      border-style: solid;
      border-color: #a7f3d0;
      background: #ecfdf5;
    }

    .drop-zone-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
    }

    .drop-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: #eff6ff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .drop-icon {
      font-size: 24px !important;
      width: 24px !important;
      height: 24px !important;
      color: #2563eb;
    }

    .drop-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }

    .drop-hint {
      margin: 0;
      font-size: 12px;
      color: #94a3b8;
    }

    /* File selected */
    .file-selected {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      width: 100%;
    }

    .file-icon {
      font-size: 28px !important;
      width: 28px !important;
      height: 28px !important;
      color: #059669;
      flex-shrink: 0;
    }

    .file-info {
      flex: 1;
      overflow: hidden;
    }

    .file-name {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-size {
      display: block;
      font-size: 12px;
      color: #64748b;
    }

    .file-check {
      font-size: 22px !important;
      width: 22px !important;
      height: 22px !important;
      color: #059669;
      flex-shrink: 0;
    }

    /* Buttons */
    .cancel-btn {
      color: #475569 !important;
      font-weight: 500 !important;
    }

    .upload-btn {
      min-width: 110px;
      font-weight: 600 !important;
      gap: 6px;
    }

    .btn-spinner {
      display: inline-block;
    }
  `],
})
export class UploadDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    private importService: ImportService,
    private snackbar: SnackbarService,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.snackbar.error('Only .csv files are allowed.');
      input.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }

  onUpload(): void {
    if (!this.selectedFile || this.uploading) return;

    this.uploading = true;
    this.importService.uploadCsv(this.selectedFile).subscribe({
      next: result => {
        this.snackbar.success("Import started. We'll notify you when it's done.");
        this.dialogRef.close(result.jobId);
      },
      error: (err: { error?: { message?: string } }) => {
        this.snackbar.error(err?.error?.message ?? 'Upload failed. Please try again.');
        this.uploading = false;
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
