import { HttpEventType, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FileService } from '../../../../core/service/file.service';
import { FileUploadResult } from '../../../../core/interfaces/file.interfaces';
import { UploadEvent } from '../../../../core/interfaces/file.interfaces';


@Component({
  selector: 'app-file-upload',
  imports: [
    CommonModule,
    FormsModule,
    FileUploadModule,
    ButtonModule,
    ProgressBarModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  private fileService = inject(FileService);
  private messageService = inject(MessageService);

  @Input() parentFolderId?: number;
  @Output() uploaded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  selectedFiles: File[] = [];
  progress = 0;
  uploading = false;
  uploadResults: FileUploadResult[] = [];
  message = '';

  onSelectFiles(event: UploadEvent) {
    // Reset mảng và thêm các files mới - tránh duplicate
    this.selectedFiles = [...event.files];
    console.log('Selected files:', this.selectedFiles);
  }

  uploadFiles(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn ít nhất một tệp tin để tải lên'
      });
      return;
    }

    this.uploading = true;
    this.progress = 0;
    this.message = 'Đang tải lên...';
    this.uploadResults = []; // Reset kết quả trước khi upload mới

    // Sử dụng service upload nhiều file
    this.fileService.uploadFiles(this.selectedFiles, this.parentFolderId).subscribe({
      next: (response) => {
        // Cập nhật progress để chỉ thị hoàn thành
        this.progress = 100;

        if (response.success && response.data) {
          // Lấy danh sách kết quả upload từ response
          this.uploadResults = response.data.files || [];

          // Hiển thị thông báo từ API
          this.message = response.message || `Đã tải lên thành công ${response.data.successCount}/${response.data.totalCount} tệp tin`;

          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: this.message
          });

          // Thông báo cho component cha biết đã upload xong
          this.uploaded.emit();

          // Đặt timeout để người dùng thấy được thông báo thành công trước khi đóng dialog
          setTimeout(() => {
            // Tự động đóng dialog sau 1.5 giây
            this.cancel.emit();
          }, 1500);
        } else {
          this.message = response.message || 'Có lỗi xảy ra khi tải lên tệp tin.';
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: this.message
          });
        }

        // Đánh dấu đã hoàn thành upload
        this.uploading = false;

        // Xóa các file đã chọn
        if (this.fileUpload) {
          this.fileUpload.clear();
        }
        this.selectedFiles = [];
      },
      error: (error) => {
        this.uploading = false;
        this.progress = 0;
        this.message = 'Có lỗi xảy ra khi tải lên tệp tin.';
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: this.message
        });
        console.error('Upload error:', error);
      }
    });
  }

  cancelUpload(): void {
    if (this.uploading) {
      // Ghi chú: API thực tế có thể không hỗ trợ hủy upload đang diễn ra
      this.uploading = false;
      this.message = 'Đã hủy quá trình tải lên.';
    }
    this.cancel.emit();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
