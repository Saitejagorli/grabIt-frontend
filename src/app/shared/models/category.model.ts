export interface Category {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
}

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}