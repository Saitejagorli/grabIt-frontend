export interface Brand {
  id: string;
  name: string;
  description: string;
  status: BrandStatus;
}

export enum BrandStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}