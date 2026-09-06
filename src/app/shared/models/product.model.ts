import { ImageFile, UploadedImage } from './media.model';

interface ProductBase{
  id: string;
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
}
export interface Product extends ProductBase {
  images: UploadedImage[];
}
export interface ProductRequest extends Omit<ProductBase, 'id'> {
  imageUploadSessionId?: string;
  retainedImages?: {
    id: string;
    displayOrder: number;
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

export type ProductImage = ImageFile | UploadedImage;