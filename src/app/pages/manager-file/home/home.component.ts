import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TreeModule } from 'primeng/tree';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { GlobalService } from '../../../core/service/global.service';
import { BasicPage } from '../../../core/shares/basic-page';
import { FileModel } from '../../../core/interfaces/file.interfaces';
import { FileType } from '../../../core/enum/file.enum';
import { FileService } from '../../../core/service/file.service';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { FileBrowserComponent } from '../components/file-browser/file-browser.component';
import { EncryptionService } from '../../../core/service/encryption.service';
import { FolderPathService } from '../../../core/service/folder-path.service';
import { BreadcrumbService } from '../../../core/service/breadcrumb.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TreeModule,
    MenuModule,
    ProgressBarModule,
    // FileListComponent,
    FileUploadComponent,
    FileBrowserComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent extends BasicPage {
  fileList: FileModel[] = [];
  currentFolder?: number;
  breadcrumbItems: { id?: number; name: string }[] = [];
  loading = false;
  totalRecords = 0;
  currentPage = 1;
  pageSize = 1000;
  shouldPaginate = false;
  searchTerm = '';

  showCreateFolderDialog = false;
  showRenameDialog = false;
  showUploadDialog = false;

  newFolderName = '';
  newFileName = '';
  selectedFile?: FileModel;

  // Dialog để xem chi tiết file
  fileDetailDialog = false;
  fileDetail?: FileModel;

  // Enum cho template
  FileType = FileType;

  constructor(
    protected override globalSer: GlobalService,
    private fileService: FileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private breadcrumbService: BreadcrumbService,
    private folderPathService: FolderPathService
  ) {
    super(globalSer);
  }

  ngOnInit() {
  // Kết hợp cả thông tin từ paramMap và data của route
  this.route.params.subscribe(params => {
    this.route.data.subscribe(data => {
      // Xử lý mode đặc biệt trước (trash, favorites, etc.)
      if (data['mode']) {
        if (data['mode'] === 'trash') {
          this.breadcrumbService.updateBreadcrumbs([
            { label: 'My files', routerLink: '/manager-file/my-files' },
            { label: 'Thùng rác', routerLink: '/manager-file/trash' },
          ]);
          // Có thể thực hiện các xử lý khác dành riêng cho chế độ trash
          this.loadTrashFiles();
          return;
        } else if (data['mode'] === 'favorites') {
          this.breadcrumbService.updateBreadcrumbs([
            { label: 'My files', routerLink: '/manager-file/my-files' },
            { label: 'Yêu thích', routerLink: '/manager-file/favorites' },
          ]);
          // Có thể thực hiện các xử lý khác dành riêng cho chế độ favorites
          this.loadFavoriteFiles();
          return;
        }
      }

      // Trường hợp thông thường: xử lý theo folder ID
      const encryptedId = params['encryptedId'];
      if (encryptedId) {
        const folderId = this.encryptionService.decryptId(encryptedId);
        if (folderId !== null) {
          this.currentFolder = folderId;
          // Lấy đường dẫn thư mục đầy đủ và cập nhật breadcrumb
          this.updateBreadcrumbForFolder(folderId);
          this.loadFiles(); // Tải danh sách files trong thư mục
        } else {
          // ID không hợp lệ, chuyển về root
          this.router.navigate(['/manager-file/my-files']);
          this.breadcrumbService.reset();
        }
      } else {
        // Trường hợp root folder
        this.currentFolder = undefined;
        this.breadcrumbService.reset(); // Reset breadcrumb về "My Files"
        this.loadFiles(); // Tải danh sách files gốc
      }
    });
  });

  this.createDelayObservable().subscribe(() => {
    this.pageLoaded();
  });
}

// Các phương thức để tải dữ liệu theo các mode khác nhau
loadTrashFiles() {
  this.loading = true;
  this.fileService.getDeletedFiles(this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        this.fileList = response.data?.items || [];
        this.totalRecords = response.data?.totalCount || 0;
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
}

loadFavoriteFiles() {
  this.loading = true;
  this.fileService.getFavoriteFiles(this.currentPage, this.pageSize)
    .subscribe({
      next: (response) => {
        this.fileList = response.data?.items || [];
        this.totalRecords = response.data?.totalCount || 0;
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
}

  loadFiles(): void {
    this.loading = true;

    // Sử dụng một giá trị đủ lớn cho pageSize khi chưa biết nếu cần phân trang hay không
    const initialPageSize = 1000; // Hoặc một giá trị lớn hơn theo nhu cầu

    this.fileService
      .getFiles(this.currentFolder, 1, initialPageSize)
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.totalRecords = response.data?.totalCount || 0;

          // Quyết định nếu cần phân trang sau khi đã có dữ liệu
          this.shouldPaginate = this.totalRecords > 1000;

          // Nếu cần phân trang và tổng số bản ghi lớn hơn số đã tải
          // thì mới cần tải lại theo trang (hiếm khi xảy ra)
          if (this.shouldPaginate && this.totalRecords > initialPageSize) {
            // Trong trường hợp rất hiếm khi có nhiều hơn 1000 items,
            // và ta cần hiển thị trang khác với trang đầu tiên
            if (this.currentPage > 1) {
              this.loadPagedItems();
            }
          }

          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  // Phương thức này chỉ được gọi khi cần chuyển trang và có hơn 1000 items
  loadPagedItems(): void {
    this.loading = true;
    this.fileService
      .getFiles(this.currentFolder, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  // Phương thức lấy tất cả items cùng lúc
  loadAllItems(): void {
    this.fileService
      .getFiles(this.currentFolder, 1, 1000) // Lấy tối đa 1000 items
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  // Phương thức xử lý lỗi
  private handleError(error: any): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể tải danh sách tệp tin',
    });
    this.loading = false;
  }

  setBreadcrumb(): void {
    // Logic để thiết lập breadcrumb dựa vào thư mục hiện tại
    this.breadcrumbItems = [{ name: 'My Files', id: undefined }];

    if (this.currentFolder) {
      // Cần lấy thông tin đường dẫn thư mục từ API
      // Ví dụ đơn giản:
      this.breadcrumbItems.push({
        name: 'Thư mục hiện tại',
        id: this.currentFolder,
      });
    }
  }


  updateBreadcrumbForFolder(folderId: number): void {
  this.folderPathService.buildFolderPath(folderId).subscribe(
    folderPath => {
      const breadcrumbItems: MenuItem[] = [
        { label: 'My Files', routerLink: '/manager-file/my-files' }
      ];

      folderPath.forEach(folder => {
        breadcrumbItems.push({
          label: folder.name,
          routerLink: folder.routerLink
        });
      });

      this.breadcrumbService.updateBreadcrumbs(breadcrumbItems);
    }
  );
}

  navigateToFolder(folderId?: number): void {
    if (folderId) {
      const encryptedId = this.encryptionService.encryptId(folderId);
      this.router.navigate(['/manager-file/files', encryptedId]);
      // Breadcrumb sẽ được cập nhật trong ngOnInit khi route thay đổi
    } else {
      this.router.navigate(['/manager-file/my-files']);
      this.breadcrumbService.reset();
    }
  }

  openCreateFolderDialog(): void {
    this.newFolderName = '';
    this.showCreateFolderDialog = true;
  }

  createFolder(): void {
    if (!this.newFolderName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Tên thư mục không được để trống',
      });
      return;
    }

    this.fileService
      .createFolder({
        name: this.newFolderName,
        parentId: this.currentFolder,
      })
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo thư mục thành công',
          });
          this.showCreateFolderDialog = false;
          this.loadFiles();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tạo thư mục',
          });
        },
      });
  }

  openRenameDialog(file: FileModel): void {
    this.selectedFile = file;
    this.newFileName = file.name;
    this.showRenameDialog = true;
  }

  renameFile(): void {
    if (!this.selectedFile || !this.newFileName.trim()) {
      return;
    }

    this.fileService
      .renameFile(this.selectedFile.id, {
        newName: this.newFileName,
      })
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đổi tên thành công',
          });
          this.showRenameDialog = false;
          this.loadFiles();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể đổi tên tệp tin',
          });
        },
      });
  }

  confirmDelete(file: FileModel): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa "${file.name}" không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteFile(file),
    });
  }

  deleteFile(file: FileModel): void {
    this.fileService.deleteFile(file.id).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã chuyển vào thùng rác',
        });
        this.loadFiles();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa tệp tin',
        });
      },
    });
  }

  openFile(file: FileModel): void {
    if (file.type === FileType.Folder) {
      this.navigateToFolder(file.id);
    } else {
      this.showFileDetails(file);
    }
  }

  showFileDetails(file: FileModel): void {
    this.fileDetail = file;
    this.fileDetailDialog = true;
  }

  downloadFile(file: FileModel): void {
    if (file.type === FileType.File) {
      this.fileService.downloadFile(file.id).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
    }
  }

  toggleFavorite(file: FileModel, event: Event): void {
    event.stopPropagation();

    if (file.isFavorite) {
      this.fileService.removeFromFavorites(file.id).subscribe({
        next: () => {
          file.isFavorite = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã xóa khỏi mục yêu thích',
          });
        },
      });
    } else {
      this.fileService.addToFavorites(file.id).subscribe({
        next: () => {
          file.isFavorite = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã thêm vào mục yêu thích',
          });
        },
      });
    }
  }

  openUploadDialog(): void {
    this.showUploadDialog = true;
  }

  onFileUploaded(): void {
    this.showUploadDialog = false;
    this.loadFiles();
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Tải lên tệp tin thành công',
    });
  }

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    // Chỉ gọi loadPagedItems khi đang ở chế độ phân trang
    if (this.shouldPaginate) {
      this.loadPagedItems();
    }
  }

  // Tìm kiếm file
  searchFiles(): void {
    if (!this.searchTerm.trim()) {
      this.loadFiles();
      return;
    }

    this.loading = true;
    this.fileService
      .searchFiles({ searchTerm: this.searchTerm }, 1, this.pageSize)
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.totalRecords = response.data?.totalCount || 0;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tìm kiếm tệp tin',
          });
          this.loading = false;
        },
      });
  }
}
