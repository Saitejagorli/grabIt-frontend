import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  FileMetaData,
  UploadSessionResponse,
} from '../../shared/models/media.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.MEDIA_SERVICE_BASE_URL}/upload-sessions`;

  createUploadSession(
    images: FileMetaData[],
  ): Observable<UploadSessionResponse> {
    return this.http.post<UploadSessionResponse>(this.apiUrl, images);
  }

  completeUploadSession(sessionId: string): Observable<UploadSessionResponse> {
    return this.http.patch<UploadSessionResponse>(
      `${this.apiUrl}/${sessionId}/complete`,
      {},
    );
  }

  uploadFiletoS3(presignedUrl:string, file: File):Observable<void>{
    return this.http.put<void>(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  }
}
