import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  template: `
    <div class="spinner-overlay" *ngIf="loading">
      <mat-progress-spinner mode="indeterminate" [diameter]="48"></mat-progress-spinner>
    </div>
  `,
  styles: [
    `
      .spinner-overlay {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() loading = false;
}
