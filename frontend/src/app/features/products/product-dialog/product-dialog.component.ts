import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category, CreateProductDto, Product } from '../../../models';
import { CategoryService } from '../../categories/services/category.service';

export interface ProductDialogData {
  product?: Product;
}

@Component({
  selector: 'app-product-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form" id="productForm" (ngSubmit)="onSave()">

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" maxlength="255" autocomplete="off" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">Product name is required</mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('maxlength')">Must not exceed 255 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('categoryId')?.hasError('required')">Category is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price (₹)</mat-label>
          <input matInput type="number" formControlName="price" min="0.01" step="0.01" />
          <mat-error *ngIf="form.get('price')?.hasError('required')">Price is required</mat-error>
          <mat-error *ngIf="form.get('price')?.hasError('min')">Price must be greater than 0</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" type="url" placeholder="https://example.com/image.jpg" />
          <mat-error *ngIf="form.get('imageUrl')?.hasError('required')">Image URL is required</mat-error>
          <mat-error *ngIf="form.get('imageUrl')?.hasError('pattern')">Must be a valid URL starting with http:// or https://</mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        type="submit"
        form="productForm"
        [disabled]="form.invalid"
        (click)="onSave()"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: min(420px, calc(100vw - 64px));
    }
    .full-width {
      width: 100%;
      display: block;
      margin-bottom: 4px;
    }
  `],
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.form = this.fb.group({
      name: [data.product?.name ?? '', [Validators.required, Validators.maxLength(255)]],
      categoryId: [data.product?.categoryId ?? '', [Validators.required]],
      price: [data.product?.price ?? null, [Validators.required, Validators.min(0.01)]],
      imageUrl: [
        data.product?.imageUrl ?? '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: cats => (this.categories = cats),
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    const dto: CreateProductDto = {
      name: (this.form.value.name as string).trim(),
      categoryId: this.form.value.categoryId as string,
      price: this.form.value.price as number,
      imageUrl: (this.form.value.imageUrl as string).trim(),
    };
    this.dialogRef.close(dto);
  }
}
