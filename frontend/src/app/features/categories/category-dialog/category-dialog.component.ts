import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../../models';

export interface CategoryDialogData {
  category?: Category;
}

@Component({
  selector: 'app-category-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.category ? 'Edit Category' : 'Add Category' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="onSave()" id="categoryForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" maxlength="100" autocomplete="off" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">
            Category name is required
          </mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('maxlength')">
            Must not exceed 100 characters
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        type="submit"
        form="categoryForm"
        [disabled]="form.invalid"
        (click)="onSave()"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; display: block; }
    mat-dialog-content { min-width: min(320px, calc(100vw - 64px)); }
  `],
})
export class CategoryDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: [data.category?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.dialogRef.close((this.form.value.name as string).trim());
  }
}
