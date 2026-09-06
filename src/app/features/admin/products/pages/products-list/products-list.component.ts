import {
  ChangeDetectionStrategy,
  Component,
  DEFAULT_CURRENCY_CODE,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { ProductListItem } from '../../../../../shared/models/product.model';
import { ProductService } from '../../../../../core/services/product.service';
import { environment } from '../../../../../../environments/environment';



interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-products-list',
  imports: [CardModule, TableModule,TagModule,RouterLink,CurrencyPipe,DatePipe,TitleCasePipe],
  providers: [{provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' }],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListComponent implements OnInit {
  productService = inject(ProductService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  products = signal<ProductListItem[]>([]);

  page = signal(0);
  size = signal(5);
  totalRecords = signal<number>(0);

  cols: Column[] = [];

  ngOnInit(): void {
    this.cols = [
      { field: 'thumnailImage', header: 'Image' },
      { field: 'name', header: 'Name' },
      { field: 'sku', header: 'SKU' },
      { field: 'brandName', header: 'Brand' },
      { field: 'categoryName', header: 'Category' },
      { field: 'sellingPrice', header: 'Price' },
      { field: 'status', header: 'Status' },
      { field: 'updatedAt', header: 'Updated At' },
      { field: 'actions', header: 'Actions' },
    ];

    this.activatedRoute.queryParamMap.subscribe((params) => {
      let page = Number(params.get('page'));
      let size = Number(params.get('size'));

      const invalidPage = !Number.isInteger(page) || page < 0;
      const invalidSize = !Number.isInteger(size) || size <= 0;

      if (invalidPage) {
        page = 0;
      }

      if (invalidSize) {
        size = 5;
      }

      if (invalidPage || invalidSize) {
        this.router.navigate([], {
          queryParams: {
            page,
            size,
          },
          queryParamsHandling: 'merge',
        });

        return;
      }

      this.page.set(page);
      this.size.set(size);
      this.loadProducts(page, size);
    });
  }

  loadProducts(page: number, size: number): void {
    this.productService.getProductsList(page, size).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products.set(response.data.content);
          this.totalRecords.set(response.data.totalRecords);
          console.log('Products List:', response.data.content);
        }
      },
    });
  }

  onLazyLoad(event: any): void {
    console.log('Page Change Event:', event);
    const size = event.rows;
    const page = event.first / size;

    this.router.navigate([], {
      queryParams: {
        page,
        size,
      },
      queryParamsHandling: 'merge',
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warn';
      default:
        return '';
    }
  }

  getImageUrl(objectKey:string): string {
    return `${environment.CDN_URL}/${objectKey}`;
  }
}
