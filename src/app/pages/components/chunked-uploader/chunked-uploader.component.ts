import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChunkUploadProgress } from '../../../core/interfaces/ChunkUploadProgress';
import { ChunkedUploadService } from '../../../core/service/chunked-upload.service';

@Component({
  selector: 'app-chunked-uploader',
  imports: [],
  templateUrl: './chunked-uploader.component.html',
  styleUrl: './chunked-uploader.component.scss'
})
export class ChunkedUploaderComponent {
  @Input() parentId?: number;
  @Output() uploadComplete = new EventEmitter<any>();

  activeUploads: ChunkUploadProgress[] = [];

  constructor(private uploadService: ChunkedUploadService) {}

  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files.length === 0) return;

    // Xử lý từng file được chọn
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    this.uploadService.uploadFile(file, this.parentId).subscribe(
      (progress: ChunkUploadProgress) => {
        // Cập nhật hoặc thêm mới vào danh sách active uploads
        const existingIndex = this.activeUploads.findIndex(u => u.uploadId === progress.uploadId);
        if (existingIndex !== -1) {
          this.activeUploads[existingIndex] = progress;
        } else {
          this.activeUploads.push(progress);
        }
      },
      (error) => {
        console.error('Upload error:', error);
      },
      () => {
        // Upload completed successfully
        console.log('Upload completed.');
      }
    );
  }

  pauseUpload(uploadId: string): void {
    this.uploadService.pauseUpload(uploadId);
  }

  resumeUpload(uploadId: string): void {
    const resumeObservable = this.uploadService.resumeUpload(uploadId);
    if (resumeObservable) {
      resumeObservable.subscribe(
        (progress: ChunkUploadProgress) => {
          const existingIndex = this.activeUploads.findIndex(u => u.uploadId === progress.uploadId);
          if (existingIndex !== -1) {
            this.activeUploads[existingIndex] = progress;
          }
        },
        (error) => {
          console.error('Resume upload error:', error);
        }
      );
    }
  }

  cancelUpload(uploadId: string): void {
    this.uploadService.cancelUpload(uploadId).subscribe(
      () => {
        // Xóa khỏi danh sách active uploads
        this.activeUploads = this.activeUploads.filter(u => u.uploadId !== uploadId);
      }
    );
  }

  formatSpeed(bytesPerSecond: number): string {
    if (bytesPerSecond < 1024) {
      return `${bytesPerSecond.toFixed(2)} B/s`;
    } else if (bytesPerSecond < 1024 * 1024) {
      return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`;
    } else {
      return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`;
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

}
