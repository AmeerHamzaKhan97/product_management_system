import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  template: `
    <div class="dialog-header">
      <div class="warn-icon-wrap">
        <mat-icon class="warn-icon">warning_amber</mat-icon>
      </div>
    </div>
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content class="dialog-body">
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(false)" class="cancel-btn">Cancel</button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)" class="confirm-btn">
        <mat-icon>delete_outline</mat-icon>
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      padding: 20px 24px 0;
    }

    .warn-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #fef2f2;
      border: 1px solid #fecaca;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .warn-icon {
      color: #dc2626;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .dialog-body p {
      margin: 0;
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
    }

    .cancel-btn {
      color: #475569 !important;
      font-weight: 500 !important;
    }

    .confirm-btn {
      --mdc-filled-button-container-color: #dc2626 !important;
      font-weight: 600 !important;
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
