export interface User {
  id: string;
  email: string;
}

export interface Category {
  id: string;
  uniqueId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ProductCategory {
  id: string;
  name: string;
  uniqueId: string;
}

export interface Product {
  id: string;
  uniqueId: string;
  name: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  category?: ProductCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  imageUrl: string;
  price: number;
  categoryId: string;
}

export type ImportJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImportJob {
  id: string;
  jobId: string;
  fileName: string;
  filePath: string;
  status: ImportJobStatus;
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  errorCsvPath: string | null;
  createdBy: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
