import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-responose.model';
import { SubCategory } from '../../shared/models/subcategory.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class SubcategoryService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.PRODUCT_SERVICE_BASE_URL}/subcategories`;

  getSubcategories(): Observable<ApiResponse<SubCategory[]>> {
    return this.http.get<ApiResponse<SubCategory[]>>(this.apiUrl);
  }

  getSubcategoriesByCategoryId(
    categoryId: string,
  ): Observable<ApiResponse<SubCategory[]>> {
    const params = new HttpParams().set('categoryId', categoryId);

    return this.http.get<ApiResponse<SubCategory[]>>(this.apiUrl, { params });
  }
}
