export interface SubCategory {
  id: string;
  name: string;
  description: string;
  status: SubCategoryStatus;
}

export enum SubCategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}