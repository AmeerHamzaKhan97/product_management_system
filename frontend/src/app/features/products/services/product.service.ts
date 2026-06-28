import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, CreateProductDto, PaginatedResponse, Product } from '../../../models';

export interface ReportStatus {
  status: 'processing' | 'completed' | 'failed';
  jobId: string;
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(params: ProductQueryParams): Observable<PaginatedResponse<Product>> {
    let httpParams = new HttpParams();
    if (params.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize != null) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http
      .get<ApiResponse<PaginatedResponse<Product>>>(this.url, { params: httpParams })
      .pipe(map(res => res.data));
  }

  getById(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.url}/${id}`)
      .pipe(map(res => res.data));
  }

  create(data: CreateProductDto): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.url, data)
      .pipe(map(res => res.data));
  }

  update(id: string, data: CreateProductDto): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.url}/${id}`, data)
      .pipe(map(res => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  generateReport(params: { search?: string; sortBy?: string; sortOrder?: string }): Observable<{ jobId: string }> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

    return this.http
      .get<ApiResponse<{ jobId: string }>>(`${this.url}/report`, { params: httpParams })
      .pipe(map(res => res.data));
  }

  getReportStatus(jobId: string): Observable<ReportStatus> {
    return this.http
      .get<ApiResponse<ReportStatus>>(`${this.url}/report/${jobId}/status`)
      .pipe(map(res => res.data));
  }

  downloadReport(jobId: string): Observable<Blob> {
    return this.http.get(`${this.url}/report/${jobId}/download`, { responseType: 'blob' });
  }
}
