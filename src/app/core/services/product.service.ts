import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import {
  Product,
  ProductList,
  ProductRequest,
} from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.PRODUCT_SERVICE_BASE_URL}/products`;

  createProduct(request: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, request);
  }

  updateProduct(
    productId: string,
    request: ProductRequest,
  ): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(
      `${this.apiUrl}/${productId}`,
      request,
    );
  }

  getProductById(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${productId}`);
  }

  checkSkuExists(sku: string): Observable<ApiResponse<{ exists: boolean }>> {
    return this.http.get<ApiResponse<{ exists: boolean }>>(
      `${this.apiUrl}/check-sku/${sku}`,
    );
  }

  getProductsList(page = 0, size = 10): Observable<ApiResponse<ProductList>> {
    return this.http.get<ApiResponse<ProductList>>(this.apiUrl, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }
}
