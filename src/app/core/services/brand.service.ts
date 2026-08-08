import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-responose.model';
import { Brand } from '../../shared/models/brand.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export default class BrandService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.PRODUCT_SERVICE_BASE_URL}/brands`;

  getBrands(): Observable<ApiResponse<Brand[]>> {
    return this.http.get<ApiResponse<Brand[]>>(this.apiUrl);
  }
}
