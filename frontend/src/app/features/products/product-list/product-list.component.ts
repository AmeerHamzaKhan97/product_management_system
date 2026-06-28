import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, takeWhile } from 'rxjs/operators';
import { CreateProductDto, PaginationMeta, Product } from '../../../models';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ImportBannerService } from '../../import/services/import-banner.service';
import { ImportService } from '../../import/services/import.service';
import { UploadDialogComponent } from '../../import/upload-dialog/upload-dialog.component';
import { ProductDialogComponent, ProductDialogData } from '../product-dialog/product-dialog.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  template: `
    <!-- ── Page header ───────────────────────────────────── -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Products</h1>
        <p class="page-subtitle">Manage and track your product catalog</p>
      </div>
      <button mat-flat-button color="primary" (click)="openCreateDialog()" class="add-btn">
        <mat-icon>add</mat-icon>
        Add Product
      </button>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────── -->
    <div class="toolbar-card">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search products</mat-label>
        <mat-icon matPrefix class="search-prefix">search</mat-icon>
        <input matInput [formControl]="searchControl" placeholder="Name, category…" />
        <button
          *ngIf="searchControl.value"
          mat-icon-button
          matSuffix
          (click)="clearSearch()"
          aria-label="Clear search"
          class="clear-btn"
        >
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>

      <div class="toolbar-actions">
        <button mat-stroked-button (click)="onUploadCsv()" matTooltip="Upload Product CSV" class="tool-btn">
          <mat-icon>cloud_upload</mat-icon>
          <span class="btn-text">Upload CSV</span>
        </button>

        <button mat-stroked-button (click)="onDownloadTemplate()" matTooltip="Download CSV Template" class="tool-btn">
          <mat-icon>file_download</mat-icon>
          <span class="btn-text">Template</span>
        </button>

        <button
          mat-stroked-button
          (click)="onDownloadReport()"
          matTooltip="Download Product Report"
          [disabled]="reportInProgress"
          class="tool-btn"
        >
          <mat-icon>{{ reportInProgress ? 'hourglass_top' : 'summarize' }}</mat-icon>
          <span class="btn-text">{{ reportInProgress ? 'Generating…' : 'Report' }}</span>
        </button>

        <button mat-icon-button (click)="resetFilters()" matTooltip="Reset all filters" class="reset-icon-btn" aria-label="Reset filters">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
    </div>

    <!-- ── Import Status Banner ──────────────────────────── -->
    <app-import-banner></app-import-banner>

    <!-- ── Table card ────────────────────────────────────── -->
    <div class="table-card">

      <!-- Loading -->
      <div *ngIf="loading" class="loading-wrap">
        <mat-progress-spinner mode="indeterminate" [diameter]="40"></mat-progress-spinner>
        <p class="loading-text">Loading products…</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && products.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <mat-icon class="empty-icon">inventory_2</mat-icon>
        </div>
        <h3 class="empty-title">
          {{ searchControl.value ? 'No products match your search' : 'No products yet' }}
        </h3>
        <p class="empty-desc" *ngIf="searchControl.value">
          Try different keywords or
          <button mat-button color="primary" class="inline-link" (click)="resetFilters()">clear filters</button>
        </p>
        <p class="empty-desc" *ngIf="!searchControl.value">
          Add your first product or import from a CSV file.
        </p>
        <div class="empty-actions" *ngIf="!searchControl.value">
          <button mat-flat-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> Add Product
          </button>
          <button mat-stroked-button (click)="onUploadCsv()">
            <mat-icon>cloud_upload</mat-icon> Upload CSV
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container" *ngIf="!loading && products.length > 0">
        <table
          mat-table
          [dataSource]="products"
          matSort
          [matSortActive]="sortBy"
          [matSortDirection]="sortOrder"
          (matSortChange)="onSortChange($event)"
          class="product-table"
          aria-label="Products table"
        >
          <!-- Image Column -->
          <ng-container matColumnDef="image">
            <mat-header-cell *matHeaderCellDef class="col-image">Image</mat-header-cell>
            <mat-cell *matCellDef="let row" class="col-image">
              <img
                *ngIf="!brokenImages.has(row.imageUrl)"
                [src]="row.imageUrl"
                [alt]="row.name"
                (error)="onImageError(row.imageUrl)"
                class="product-thumbnail"
              />
              <div *ngIf="brokenImages.has(row.imageUrl)" class="img-placeholder">
                <mat-icon>image_not_supported</mat-icon>
              </div>
            </mat-cell>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Product Name</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="product-name">{{ row.name }}</span>
            </mat-cell>
          </ng-container>

          <!-- Category Column -->
          <ng-container matColumnDef="category">
            <mat-header-cell *matHeaderCellDef>Category</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="category-badge" *ngIf="row.category?.name">{{ row.category.name }}</span>
              <span class="no-value" *ngIf="!row.category?.name">—</span>
            </mat-cell>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Price</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="price-value">{{ row.price | currency:'INR':'symbol':'1.2-2' }}</span>
            </mat-cell>
          </ng-container>

          <!-- Created Date Column -->
          <ng-container matColumnDef="createdAt">
            <mat-header-cell *matHeaderCellDef mat-sort-header>Added</mat-header-cell>
            <mat-cell *matCellDef="let row">
              <span class="date-value">{{ row.createdAt | date:'mediumDate' }}</span>
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
                  matTooltip="Edit product"
                  aria-label="Edit product"
                  class="action-edit"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  (click)="openDeleteDialog(row)"
                  matTooltip="Delete product"
                  aria-label="Delete product"
                  class="action-delete"
                >
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </mat-cell>
          </ng-container>

          <mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></mat-header-row>
          <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
        </table>
      </div>

      <!-- Paginator -->
      <mat-paginator
        *ngIf="!loading && products.length > 0"
        [length]="pagination.total"
        [pageSize]="pagination.pageSize"
        [pageSizeOptions]="pageSizeOptions"
        [pageIndex]="pagination.page - 1"
        (page)="onPageChange($event)"
        showFirstLastButtons
      ></mat-paginator>

      <!-- Total count row -->
      <div *ngIf="!loading && products.length > 0" class="total-row">
        <span class="total-label">
          {{ pagination.total | number }} product{{ pagination.total !== 1 ? 's' : '' }} total
        </span>
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

    .add-btn {
      flex-shrink: 0;
      height: 40px;
      font-size: 14px !important;
      font-weight: 600 !important;
      padding: 0 16px !important;
      box-shadow: 0 1px 3px rgba(37,99,235,0.25) !important;
    }

    /* ── Toolbar ───────────────────────────────────────── */
    .toolbar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 16px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .search-field {
      flex: 1;
      min-width: 220px;
    }

    .search-prefix {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: #94a3b8 !important;
      margin-right: 6px !important;
    }

    .clear-btn {
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
      color: #94a3b8 !important;
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding-top: 4px;
    }

    .tool-btn {
      height: 40px;
      font-size: 13px !important;
      font-weight: 500 !important;
    }

    .reset-icon-btn {
      color: #94a3b8 !important;
      flex-shrink: 0;
    }

    .reset-icon-btn:hover {
      color: #475569 !important;
      background: #f1f5f9 !important;
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

    .product-table {
      width: 100%;
    }

    /* Column widths */
    .col-image {
      width: 72px;
      padding-left: 20px !important;
      padding-right: 8px !important;
    }

    .col-actions {
      width: 96px;
      padding-right: 8px !important;
    }

    /* Cell content */
    .product-thumbnail {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      display: block;
      border: 1px solid #e2e8f0;
    }

    .img-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
    }

    .img-placeholder mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .product-name {
      font-weight: 500;
      color: #0f172a;
      font-size: 14px;
    }

    .category-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }

    .no-value {
      color: #cbd5e1;
    }

    .price-value {
      font-weight: 600;
      color: #0f172a;
      font-variant-numeric: tabular-nums;
    }

    .date-value {
      color: #64748b;
      font-size: 13px;
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

    /* Total row */
    .total-row {
      padding: 10px 16px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
    }

    .total-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* ── Loading state ──────────────────────────────────── */
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

    /* ── Empty state ────────────────────────────────────── */
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

    .inline-link {
      padding: 0 4px !important;
      min-width: 0 !important;
      font-size: 14px !important;
      line-height: inherit !important;
      vertical-align: baseline;
    }

    .empty-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 4px;
    }

    /* ── Responsive ──────────────────────────────────────── */
    @media (max-width: 768px) {
      .toolbar-card { flex-direction: column; align-items: stretch; }
      .search-field { min-width: unset; width: 100%; }
      .toolbar-actions { padding-top: 0; justify-content: flex-start; }
      .btn-text { display: none; }
      .tool-btn { min-width: 40px !important; padding: 0 10px !important; }
    }

    @media (max-width: 480px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .add-btn { width: 100%; }
    }
  `],
})
export class ProductListComponent implements OnInit, OnDestroy {
  displayedColumns = ['image', 'name', 'category', 'price', 'createdAt', 'actions'];
  pageSizeOptions = [10, 20, 50, 100];

  products: Product[] = [];
  pagination: PaginationMeta = {
    total: 0, page: 1, pageSize: 10, totalPages: 0, hasNext: false, hasPrev: false,
  };
  loading = false;
  reportInProgress = false;

  searchControl = new FormControl('');
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();
  private reportPoll: Subscription | null = null;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private importBannerService: ImportBannerService,
    private importService: ImportService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    this.importBannerService.job$.pipe(
      map(job => job?.status),
      distinctUntilChanged(),
      filter(status => status === 'completed'),
      takeUntil(this.destroy$),
    ).subscribe(() => this.loadProducts());

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pagination = { ...this.pagination, page: 1 };
        if (this.paginator) this.paginator.pageIndex = 0;
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading = true;
    const search = this.searchControl.value?.trim() || undefined;
    this.productService
      .getAll({
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        search,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      })
      .subscribe({
        next: result => {
          this.products = result.items;
          this.pagination = result.pagination;
          this.loading = false;
        },
        error: () => {
          this.snackbar.error('Failed to load products.');
          this.loading = false;
        },
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onSortChange(sort: Sort): void {
    this.sortBy = sort.active && sort.direction ? sort.active : 'createdAt';
    this.sortOrder = (sort.direction as 'asc' | 'desc') || 'desc';
    this.pagination = { ...this.pagination, page: 1 };
    if (this.paginator) this.paginator.pageIndex = 0;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pagination = { ...this.pagination, page: event.pageIndex + 1, pageSize: event.pageSize };
    this.loadProducts();
  }

  resetFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.sortBy = 'createdAt';
    this.sortOrder = 'desc';
    this.pagination = { ...this.pagination, page: 1, pageSize: 10 };
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 10;
    }
    this.loadProducts();
  }

  openCreateDialog(): void {
    const ref = this.dialog.open<ProductDialogComponent, ProductDialogData, CreateProductDto>(
      ProductDialogComponent,
      { data: {}, width: '520px' },
    );
    ref.afterClosed().subscribe(dto => {
      if (!dto) return;
      this.productService.create(dto).subscribe({
        next: () => {
          this.snackbar.success('Product created successfully.');
          this.loadProducts();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to create product.');
        },
      });
    });
  }

  openEditDialog(product: Product): void {
    const ref = this.dialog.open<ProductDialogComponent, ProductDialogData, CreateProductDto>(
      ProductDialogComponent,
      { data: { product }, width: '520px' },
    );
    ref.afterClosed().subscribe(dto => {
      if (!dto) return;
      this.productService.update(product.id, dto).subscribe({
        next: () => {
          this.snackbar.success('Product updated successfully.');
          this.loadProducts();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to update product.');
        },
      });
    });
  }

  openDeleteDialog(product: Product): void {
    const ref = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Delete Product',
          message: `Are you sure you want to delete "${product.name}"?`,
        },
        width: '380px',
      },
    );
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.snackbar.success('Product deleted successfully.');
          this.loadProducts();
        },
        error: (err: { error?: { message?: string } }) => {
          this.snackbar.error(err?.error?.message ?? 'Failed to delete product.');
        },
      });
    });
  }

  readonly brokenImages = new Set<string>();

  onImageError(imageUrl: string): void {
    this.brokenImages.add(imageUrl);
  }

  onUploadCsv(): void {
    const ref = this.dialog.open<UploadDialogComponent, void, string>(
      UploadDialogComponent,
      { width: '480px', disableClose: true },
    );
    ref.afterClosed().subscribe(jobId => {
      if (!jobId) return;
      this.importBannerService.startPolling(jobId);
    });
  }

  onDownloadTemplate(): void {
    this.importService.downloadTemplate().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-products.csv';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.snackbar.error('Failed to download template.'),
    });
  }

  onDownloadReport(): void {
    this.reportInProgress = true;
    const search = this.searchControl.value?.trim() || undefined;

    this.productService.generateReport({ search, sortBy: this.sortBy, sortOrder: this.sortOrder })
      .subscribe({
        next: ({ jobId }) => {
          this.snackbar.success('Report generation started. Download will begin shortly.');
          this.pollReport(jobId);
        },
        error: () => {
          this.snackbar.error('Failed to start report generation.');
          this.reportInProgress = false;
        },
      });
  }

  private pollReport(jobId: string): void {
    this.reportPoll?.unsubscribe();

    this.reportPoll = timer(0, 2000)
      .pipe(
        switchMap(() => this.productService.getReportStatus(jobId)),
        takeWhile(result => result.status !== 'completed' && result.status !== 'failed', true),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: result => {
          if (result.status === 'completed') {
            this.productService.downloadReport(jobId).subscribe({
              next: blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `products-report-${jobId}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                this.reportInProgress = false;
              },
              error: () => {
                this.snackbar.error('Failed to download report.');
                this.reportInProgress = false;
              },
            });
          } else if (result.status === 'failed') {
            this.snackbar.error('Report generation failed.');
            this.reportInProgress = false;
          }
        },
        error: () => {
          this.snackbar.error('Failed to check report status.');
          this.reportInProgress = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.reportPoll?.unsubscribe();
  }
}
