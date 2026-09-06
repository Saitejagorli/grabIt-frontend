export interface FileMetaData {
    fileName: string;
    contentType: string;
    size: number;
    url?:string;
    displayOrder:number;
}

export interface UploadSessionResponse {
  sessionId: string;
  status: UploadSessionStatus;
  expiresAt: string;
  filesUploadResponse: FileUploadResponse[];
}

export interface FileUploadResponse {
  fileName: string;
  objectKey: string;
  url: string;
}

export enum UploadSessionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED'
}

export interface ImageFile extends File {
  url?: string;
  displayOrder: number;
}

export interface UploadedImage {
  id: string;
  objectKey: string;
  fileName: string;
  contentType: string;
  size: number;
  displayOrder: number;
}