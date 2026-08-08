import { UploadedImage } from '../../features/admin/products/pages/product-form/product-form.component';

export interface Product {
  id?: string;
  name: string;
  description: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  status: ProductStatus;
  visibility: ProductVisibility;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  imageUploadSessionId?: string;
  images?: UploadedImage[];
  retainedImages?: {
    id:string;
    displayOrder:number;
  }[];
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ProductVisibility {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}
