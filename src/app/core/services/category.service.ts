import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-responose.model';
import { Category } from '../../shared/models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class CategoryService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.PRODUCT_SERVICE_BASE_URL}/categories`;

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl);
  }

}
