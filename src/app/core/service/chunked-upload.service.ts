import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChunkUploadProgress } from '../interfaces/ChunkUploadProgress';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChunkedUploadService {

  private apiUrl = `${environment.apiUrl}/api/ChunkedUpload`;
  private chunkSize = 5 * 1024 * 1024; // 5MB chunks
  private activeUploads: Map<string, {
    cancelUpload: boolean,
    pauseUpload: boolean,
    progress: ChunkUploadProgress
  }> = new Map();

  constructor(private http: HttpClient) { }

  /**
   * Tải file lên theo từng chunk
   * @param file File cần tải lên
   * @param parentId ID của thư mục cha (nếu có)
   * @returns Observable sẽ emit tiến trình tải lên
   */
  uploadFile(file: File, parentId?: number): Observable<ChunkUploadProgress> {
    const uploadId = this.generateUploadId();
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    const progress$ = new Subject<ChunkUploadProgress>();

    // Khởi tạo thông tin về tiến trình
    const uploadProgress: ChunkUploadProgress = {
      uploadId,
      fileName: file.name,
      totalSize: file.size,
      uploadedSize: 0,
      progress: 0,
      status: 'uploading',
      chunksUploaded: 0,
      totalChunks
    };

    // Lưu trữ thông tin upload trong Map
    this.activeUploads.set(uploadId, {
      cancelUpload: false,
      pauseUpload: false,
      progress: uploadProgress
    });

    // Bắt đầu tải lên các chunks
    this.processChunks(file, uploadId, totalChunks, parentId, progress$);

    return progress$.asObservable();
  }

  /**
   * Tạm dừng tải lên
   * @param uploadId ID của quá trình tải lên
   */
  pauseUpload(uploadId: string): void {
    const upload = this.activeUploads.get(uploadId);
    if (upload) {
      upload.pauseUpload = true;
      upload.progress.status = 'paused';
      this.activeUploads.set(uploadId, upload);
    }
  }

  /**
   * Tiếp tục tải lên
   * @param uploadId ID của quá trình tải lên
   */
  resumeUpload(uploadId: string): Observable<ChunkUploadProgress> | null {
    const upload = this.activeUploads.get(uploadId);
    if (upload) {
      upload.pauseUpload = false;
      upload.progress.status = 'uploading';
      this.activeUploads.set(uploadId, upload);

      const progress$ = new Subject<ChunkUploadProgress>();

      // Gọi API để lấy thông tin về các chunks đã tải lên
      this.getUploadStatus(uploadId).subscribe(status => {
        const file = this.getFileFromCache(uploadId);
        if (file) {
          const totalChunks = Math.ceil(file.size / this.chunkSize);
          // Tiếp tục tải các chunks còn lại
          this.processChunks(file, uploadId, totalChunks, undefined, progress$, status.receivedChunks);
        } else {
          progress$.error('File không còn tồn tại trong cache.');
        }
      });

      return progress$.asObservable();
    }

    return null;
  }

  /**
   * Hủy tải lên
   * @param uploadId ID của quá trình tải lên
   */
  cancelUpload(uploadId: string): Observable<any> {
    const upload = this.activeUploads.get(uploadId);
    if (upload) {
      upload.cancelUpload = true;
      this.activeUploads.set(uploadId, upload);
    }

    return this.http.delete(`${this.apiUrl}/cancel/${uploadId}`).pipe(
      map(response => {
        this.activeUploads.delete(uploadId);
        return response;
      }),
      catchError(error => {
        console.error('Error canceling upload:', error);
        return of({ success: false, message: 'Không thể hủy tải lên.' });
      })
    );
  }

  /**
   * Lấy trạng thái tải lên
   * @param uploadId ID của quá trình tải lên
   */
  getUploadStatus(uploadId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${uploadId}`).pipe(
      map((response: any) => response.data),
      catchError(error => {
        console.error('Error getting upload status:', error);
        return of({ success: false, message: 'Không thể lấy trạng thái tải lên.' });
      })
    );
  }

  /**
   * Xử lý việc tải lên từng chunk
   */
  private async processChunks(
    file: File,
    uploadId: string,
    totalChunks: number,
    parentId?: number,
    progress$?: Subject<ChunkUploadProgress>,
    alreadyUploadedChunks?: number[]
  ): Promise<void> {
    const uploadInfo = this.activeUploads.get(uploadId);
    if (!uploadInfo) return;

    const uploadedChunks = alreadyUploadedChunks || [];
    let chunksUploaded = uploadedChunks.length;
    let totalUploaded = chunksUploaded * this.chunkSize;
    let startTime = Date.now();

    // Lưu file vào cache cho việc resume
    this.storeFileInCache(uploadId, file);

    try {
      for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
        // Kiểm tra nếu chunk này đã được tải lên rồi
        if (uploadedChunks.includes(chunkNumber)) {
          continue;
        }

        // Kiểm tra nếu upload bị hủy
        if (this.activeUploads.get(uploadId)?.cancelUpload) {
          if (progress$) {
            progress$.complete();
          }
          return;
        }

        // Kiểm tra nếu upload bị tạm dừng
        if (this.activeUploads.get(uploadId)?.pauseUpload) {
          if (progress$) {
            progress$.next({
              ...uploadInfo.progress,
              status: 'paused',
              message: 'Đã tạm dừng tải lên.'
            });
          }
          return;
        }

        // Tính toán vị trí bắt đầu và kết thúc của chunk
        const start = chunkNumber * this.chunkSize;
        const end = Math.min(start + this.chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Tạo form data
        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('chunkNumber', chunkNumber.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('chunkSize', (end - start).toString());
        formData.append('totalFileSize', file.size.toString());
        formData.append('fileName', file.name);
        formData.append('contentType', file.type);
        formData.append('chunkData', chunk, file.name);

        if (parentId) {
          formData.append('parentId', parentId.toString());
        }

        // Tải lên chunk
        try {
          const response = await this.http.post(`${this.apiUrl}/upload-chunk`, formData).toPromise();

          // Cập nhật tiến trình
          chunksUploaded++;
          totalUploaded += (end - start);
          const elapsedTime = (Date.now() - startTime) / 1000; // seconds
          const speed = totalUploaded / elapsedTime; // bytes per second
          const remainingBytes = file.size - totalUploaded;
          const remainingTime = speed > 0 ? remainingBytes / speed : 0;

          const updatedProgress: ChunkUploadProgress = {
            uploadId,
            fileName: file.name,
            totalSize: file.size,
            uploadedSize: totalUploaded,
            progress: Math.round((totalUploaded / file.size) * 100),
            status: 'uploading',
            chunksUploaded,
            totalChunks,
            speed,
            remainingTime
          };

          if (uploadInfo) {
            uploadInfo.progress = updatedProgress;
            this.activeUploads.set(uploadId, uploadInfo);
          }

          if (progress$) {
            progress$.next(updatedProgress);
          }

          // Kiểm tra nếu đã tải lên tất cả chunks
          if (chunksUploaded === totalChunks) {
            await this.completeUpload(uploadId, progress$);
          }
        } catch (error) {
          console.error(`Error uploading chunk ${chunkNumber}:`, error);

          // Cập nhật trạng thái lỗi
          if (progress$) {
            progress$.next({
              ...uploadInfo?.progress,
              status: 'error',
              message: `Lỗi khi tải lên chunk ${chunkNumber}. Thử lại sau.`
            });
          }

          // Thử lại sau 3 giây
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Giảm chunkNumber để thử lại chunk hiện tại
          chunkNumber--;
        }
      }
    } catch (error) {
      console.error('Error in processChunks:', error);
      if (progress$) {
        progress$.error(error);
      }
    }
  }

  /**
   * Hoàn tất quá trình tải lên
   */
  private async completeUpload(uploadId: string, progress$?: Subject<ChunkUploadProgress>): Promise<void> {
    try {
      const uploadInfo = this.activeUploads.get(uploadId);
      if (!uploadInfo) return;

      // Cập nhật trạng thái
      if (progress$) {
        progress$.next({
          ...uploadInfo.progress,
          status: 'uploading',
          message: 'Đang hoàn tất tải lên...'
        });
      }

      // Gọi API để hoàn tất tải lên
      const response = await this.http.post(`${this.apiUrl}/complete/${uploadId}`, {}).toPromise();

      // Cập nhật trạng thái hoàn thành
      if (progress$) {
        progress$.next({
          ...uploadInfo.progress,
          status: 'completed',
          progress: 100,
          message: 'Tải lên thành công.'
        });
        progress$.complete();
      }

      // Xóa khỏi danh sách active uploads
      this.activeUploads.delete(uploadId);

      // Xóa file khỏi cache
      this.removeFileFromCache(uploadId);
    } catch (error) {
      console.error('Error completing upload:', error);

      const uploadInfo = this.activeUploads.get(uploadId);
      if (uploadInfo && progress$) {
        progress$.next({
          ...uploadInfo.progress,
          status: 'error',
          message: 'Lỗi khi hoàn tất tải lên. Thử lại sau.'
        });
      }
    }
  }

  /**
   * Tạo ID ngẫu nhiên cho quá trình tải lên
   */
  private generateUploadId(): string {
    return 'upload_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /**
   * Lưu file vào cache (IndexedDB) để sử dụng cho việc resume upload
   */
  private storeFileInCache(uploadId: string, file: File): void {
    // Sử dụng IndexedDB để lưu trữ - code thực tế sẽ phức tạp hơn
    // Đây chỉ là mô phỏng
    console.log(`Storing file in cache: ${uploadId}`);
  }

  /**
   * Lấy file từ cache
   */
  private getFileFromCache(uploadId: string): File | null {
    // Sử dụng IndexedDB để lấy file - code thực tế sẽ phức tạp hơn
    // Đây chỉ là mô phỏng
    console.log(`Getting file from cache: ${uploadId}`);
    return null;
  }

  /**
   * Xóa file khỏi cache
   */
  private removeFileFromCache(uploadId: string): void {
    // Xóa file từ IndexedDB - code thực tế sẽ phức tạp hơn
    console.log(`Removing file from cache: ${uploadId}`);
  }
}
