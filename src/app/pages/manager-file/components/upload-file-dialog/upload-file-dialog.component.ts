import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';

@Component({
  selector: 'app-upload-file-dialog',
  imports: [CommonModule, ButtonModule, FileUploadModule, ProgressBarModule, MessageModule, FileUploadComponent],
  providers: [MessageService],
  templateUrl: './upload-file-dialog.component.html',
  styleUrl: './upload-file-dialog.component.scss'
})
export class UploadFileDialogComponent implements OnInit {
  parentId?: number;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // Nhận parentId từ config
    this.parentId = this.config.data?.parentId;
  }

  onUploaded(): void {
    // Đóng dialog và thông báo thành công
    this.ref.close({ success: true });
  }

  onCancel(): void {
    this.ref.close();
  }
}
