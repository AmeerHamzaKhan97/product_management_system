import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, ImportJob } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ImportService {
  private readonly base = `${environment.apiUrl}/products/import`;

  constructor(private http: HttpClient) {}

  uploadCsv(file: File): Observable<{ jobId: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http
      .post<ApiResponse<{ jobId: string }>>(this.base, form)
      .pipe(map(res => res.data));
  }

  getHistory(): Observable<ImportJob[]> {
    return this.http
      .get<ApiResponse<{ items: ImportJob[] }>>(`${this.base}/history`)
      .pipe(map(res => res.data.items));
  }

  getStatus(jobId: string): Observable<ImportJob> {
    return this.http
      .get<ApiResponse<ImportJob>>(`${this.base}/status/${jobId}`)
      .pipe(map(res => res.data));
  }

  downloadErrorCsv(jobId: string): Observable<Blob> {
    return this.http.get(`${this.base}/error/${jobId}`, { responseType: 'blob' });
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.base}/template`, { responseType: 'blob' });
  }
}
