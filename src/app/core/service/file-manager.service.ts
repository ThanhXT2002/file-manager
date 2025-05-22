import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { Subject } from 'rxjs';
import { CustomToastService } from './custom-toast.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateFolderDialogComponent } from '../../pages/manager-file/components/create-folder-dialog/create-folder-dialog.component';
import { UploadFileDialogComponent } from '../../pages/manager-file/components/upload-file-dialog/upload-file-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class FileManagerService {
  private fileChangedSubject = new Subject<void>();
  fileChanged$ = this.fileChangedSubject.asObservable();

  constructor(
    private dialogService: DialogService,
    private toastService: CustomToastService,
    private translateService: TranslateService
  ) {}

  // Hiển thị dialog tạo thư mục
  showCreateFolderDialog(parentId?: number): DynamicDialogRef {
    const ref = this.dialogService.open(CreateFolderDialogComponent, {
      header: 'Tạo thư mục mới',
      width: '450px',
      data: {
        parentId: parentId,
      },
    });

    ref.onClose.subscribe((result) => {
      if (result && result.success) {
        this.toastService.showToast('success', {
          detail: 'Tạo thư mục thành công',
          life: 3000,
        });

        // Thông báo cho các component khác biết rằng có thay đổi
        this.fileChangedSubject.next(); // Đảm bảo dòng này được thực thi
      } else if (result && !result.success) {
        this.toastService.showToast('error', {
          detail: 'Không thể tạo thư mục',
          life: 3000,
        });
      }
    });

    return ref;
  }

  // Hiển thị dialog tải lên file
  showUploadFileDialog(parentId?: number): DynamicDialogRef {
    const ref = this.dialogService.open(UploadFileDialogComponent, {
      header: 'Tải lên tệp tin',
      width: '600px',
      data: {
        parentId: parentId,
      },
    });

    ref.onClose.subscribe((result) => {
      if (result && result.success) {
        this.toastService.showToast('success', {
          detail: 'Tải lên tệp tin thành công',
          life: 3000,
        });
        // Thông báo cho các component khác biết rằng có thay đổi
        this.fileChangedSubject.next();
      }
    });

    return ref;
  }

  // Thông báo cho các component về thay đổi (có thể gọi trực tiếp khi cần)
  notifyFileChanged(): void {
    this.fileChangedSubject.next();
  }
}
