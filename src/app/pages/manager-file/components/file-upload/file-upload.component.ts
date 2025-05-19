import { HttpEventType, HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FileService } from '../../../../core/service/file.service';

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

  private fileService = inject(FileService);
  private messageService = inject(MessageService);

  @Input() parentFolderId?: number;
  @Output() uploaded = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos: any[] = [];
  uploading = false;

  selectFiles(event: any): void {
    this.selectedFiles = event.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file = this.selectedFiles[0];
      this.selectedFiles = undefined;
      this.currentFile = file;
      this.progress = 0;
      this.uploading = true;

      this.fileService.uploadFile(file, this.parentFolderId).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = 'Tải lên thành công!';
            this.uploaded.emit();
            this.uploading = false;
          }
        },
        error: (err: any) => {
          this.progress = 0;
          this.message = 'Không thể tải lên tệp tin!';
          this.currentFile = undefined;
          this.uploading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tải lên tệp tin'
          });
        }
      });
    }
  }

  cancelUpload(): void {
    this.cancel.emit();
  }

}
