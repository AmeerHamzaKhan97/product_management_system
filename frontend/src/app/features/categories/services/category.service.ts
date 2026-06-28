import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, Category } from '../../../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly url = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<{ items: Category[] }>>(this.url)
      .pipe(map(res => res.data.items));
  }

  create(name: string): Observable<Category> {
    return this.http
      .post<ApiResponse<Category>>(this.url, { name })
      .pipe(map(res => res.data));
  }

  update(id: string, name: string): Observable<Category> {
    return this.http
      .put<ApiResponse<Category>>(`${this.url}/${id}`, { name })
      .pipe(map(res => res.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
