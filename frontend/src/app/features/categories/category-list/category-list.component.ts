import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CategoryDialogComponent, CategoryDialogData } from '../category-dialog/category-dialog.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Category } from '../../../models';

@Component({
  selector: 'app-category-list',
  standalone: false,
  template: `
    <!-- ── Page header ───────────────────────────────────── -->
    <div class="page-header">
      <div class="page-header-left">
        <div class="title-row">
          <h1 class="page-title">Categories</h1>
          <span class="count-badge" *ngIf="!loading">{{ categories.length }}</span>
        </div>
        <p class="page-subtitle">Organise your products into logical groups</p>
      </div>
      <button mat-flat-button color="primary" (click)="openCreateDialog()" class="add-btn">
        <mat-icon>add</mat-icon>
        Add Category
      </button>
    </div>

    <!-- ── Table card ────────────────────────────────────── -->
    <div class="table-card">

      <!-- Loading -->
      <div *ngIf="loading" class="loading-wrap">
        <mat-progress-spinner mode="indeterminate" [diameter]="40"></mat-progress-spinner>
        <p class="loading-text">Loading categories…</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && categories.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <mat-icon class="empty-icon">label</mat-icon>
        </div>
        <h3 class="empty-title">No categories yet</h3>
        <p class="empty-desc">Create your first category to start organising products.</p>
        <button mat-flat-button color="primary" (click)="openCreateDialog()">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </div>

      <!-- Table -->
      <div class="table-container" *ngIf="!loading && categories.length > 0">
        <mat-table [dataSource]="categories" class="category-table" aria-label="Categories table">

          <!-- Index Column -->
          <ng-container matColumnDef="index">
            <mat-header-cell *matHeaderCellDef class="col-index">#</mat-header-cell>
            <mat-cell *matCellDef="let row; let i = index" class="col-index">
              <span class="index-num">{{ i + 1 }}</span>
            </mat-cell>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef>Category Name</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <div class="category-name-cell">
                <div class="category-dot"></div>
                <span class="category-name">{{ row.name }}</span>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Unique ID Column -->
          <ng-container matColumnDef="uniqueId">
            <mat-header-cell *matHeaderCellDef>Unique ID</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <code class="unique-id-badge">{{ row.uniqueId }}</code>
            </mat-cell>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <mat-header-cell *matHeaderCellDef class="col-actions"></mat-header-cell>
            <mat-cell *matCellDef="let row" class="col-actions">
              <div class="row-actions">
                <button
                  mat-icon-button
                  (click)="openEditDialog(row)"
                  matTooltip="Edit category"
                  aria-label="Edit category"
                  class="action-edit"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="openDeleteDialog(row)"
                  matTooltip="Delete category"
                  aria-label="Delete category"
                  class="action-delete"
                >
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </mat-table>
      </div>

      <!-- Footer -->
      <div *ngIf="!loading && categories.length > 0" class="table-footer">
        <span class="footer-label">{{ categories.length }} categor{{ categories.length !== 1 ? 'ies' : 'y' }}</span>
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

    .title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }

    .count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      padding: 0 8px;
      border-radius: 20px;
      background: #eff6ff;
      color: #2563eb;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #bfdbfe;
    }

    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: #64748b;
    }

    .add-btn {
      flex-shrink: 0;
      height: 40px;
      font-size: 14px !important;
      font-weight: 600 !important;
      padding: 0 16px !important;
      box-shadow: 0 1px 3px rgba(37,99,235,0.25) !important;
    }

    /* ── Table card ────────────────────────────────────── */
    .table-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .table-container {
      overflow-x: auto;
    }

    .category-table {
      width: 100%;
    }

    /* Column widths */
    .col-index {
      width: 56px;
      padding-left: 20px !important;
      padding-right: 8px !important;
    }

    .col-actions {
      width: 100px;
      padding-right: 8px !important;
    }

    /* Cell content */
    .index-num {
      font-size: 13px;
      color: #94a3b8;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }

    .category-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      flex-shrink: 0;
    }

    .category-name {
      font-weight: 500;
      color: #0f172a;
      font-size: 14px;
    }

    .unique-id-badge {
      font-size: 12px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 2px 8px;
      color: #475569;
    }

    /* Row actions — always visible, no box border */
    .row-actions {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .action-edit,
    .action-delete {
      width: 32px !important;
      height: 32px !important;
    }

    /* Loading state */
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

    /* Empty state */
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

    /* Table footer */
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

    /* Responsive */
    @media (max-width: 480px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .add-btn { width: 100%; }
    }
  `],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  loading = false;
  displayedColumns = ['index', 'name', 'uniqueId', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: data => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.snackbar.error('Failed to load categories.');
        this.loading = false;
      },
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open<CategoryDialogComponent, CategoryDialogData, string>(
      CategoryDialogComponent,
      { data: {}, width: '400px' },
    );
    ref.afterClosed().subscribe(name => {
      if (!name) return;
      this.categoryService.create(name).subscribe({
        next: () => {
          this.snackbar.success('Category created successfully.');
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to create category.');
        },
      });
    });
  }

  openEditDialog(category: Category): void {
    const ref = this.dialog.open<CategoryDialogComponent, CategoryDialogData, string>(
      CategoryDialogComponent,
      { data: { category }, width: '400px' },
    );
    ref.afterClosed().subscribe(name => {
      if (!name) return;
      this.categoryService.update(category.id, name).subscribe({
        next: () => {
          this.snackbar.success('Category updated successfully.');
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to update category.');
        },
      });
    });
  }

  openDeleteDialog(category: Category): void {
    const ref = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Delete Category',
          message: `Are you sure you want to delete "${category.name}"?`,
        },
        width: '380px',
      },
    );
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.categoryService.delete(category.id).subscribe({
        next: () => {
          this.snackbar.success('Category deleted successfully.');
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to delete category.');
        },
      });
    });
  }
}
