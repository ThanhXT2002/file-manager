import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileService } from '../../../../core/service/file.service';


@Component({
  selector: 'app-create-folder-dialog',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './create-folder-dialog.component.html',
  styleUrl: './create-folder-dialog.component.scss'
})
export class CreateFolderDialogComponent implements OnInit {
  folderName: string = '';
  parentId?: number;
  isLoading: boolean = false;

  constructor(
    private fileService: FileService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // Nhận parentId từ config
    this.parentId = this.config.data?.parentId;
  }

  createFolder(): void {
    if (!this.folderName.trim()) {
      return;
    }

    this.isLoading = true;

    this.fileService.createFolder({
      name: this.folderName.trim(),
      parentId: this.parentId
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Đóng dialog và trả về kết quả thành công
        this.ref.close({
          success: true,
          data: response.data
        });
      },
      error: (error) => {
        this.isLoading = false;
        // Đóng dialog và trả về lỗi
        this.ref.close({
          success: false,
          error: error
        });
      }
    });
  }

  cancel(): void {
    this.ref.close();
  }
}
