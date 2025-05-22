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
import { SearchService } from '../../../core/service/search.service';
import { FileManagerService } from '../../../core/service/file-manager.service';
import { Subscription } from 'rxjs';


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
  currentMode: 'files' | 'trash' | 'favorites' | 'search' = 'files';
  isSearchMode = false;
  private fileChangeSubscription: Subscription | null = null;
  selectedFiles: FileModel[] = [];
  isShowBoxFunction = false;

  menuItemFunction: Array<any> = [];

  listItemFunction = {
    deleteAll: {
      label: 'Xóa tất cả',
      icon: 'pi pi-trash',
      action: () => this.deleteAll(),
      colorClass: 'hover:bg-red-300 dark:hover:bg-red-700'
    },
    emptyTrash: {
      label: 'Làm trống thùng rác',
      icon: 'pi pi-trash-alt',
      action: () => this.emptyTrash(),
      colorClass: 'hover:bg-red-300 dark:hover:bg-red-700'
    },
    replayAll: {
      label: 'Khôi phục tất cả',
      icon: 'pi pi-replay',
      action: () => this.replayAll(),
      colorClass: 'hover:bg-green-300 dark:hover:bg-green-700'
    },
    starredAll: {
      label: 'Yêu thích tất cả',
      icon: 'pi pi-star-fill',
      action: () => this.starredAll(),
      colorClass: 'hover:bg-orange-300 dark:hover:bg-orange-500'
    },
    unstarredAll: {
      label: 'Loại bỏ tất cả khỏi yêu thích',
      icon: 'pi pi-star',
      action: () => this.unstarredAll(),
      colorClass: 'hover:bg-gray-300 dark:hover:bg-gray-700'
    }
  }


  constructor(
    protected override globalSer: GlobalService,
    private fileService: FileService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private encryptionService: EncryptionService,
    private breadcrumbService: BreadcrumbService,
    private folderPathService: FolderPathService,
    private searchService: SearchService,
    private fileManagerService: FileManagerService
  ) {
    super(globalSer);
  }

  ngOnInit() {
    // Đặt lại isSearchMode mặc định
    this.isSearchMode = false;

    // Kết hợp cả thông tin từ paramMap và data của route
    this.route.params.subscribe((params) => {
      this.route.data.subscribe((data) => {
        // Xử lý mode đặc biệt trước (trash, favorites, search, etc.)
        if (data['mode']) {
          this.currentMode = data['mode'];

          if (this.currentMode === 'trash') {
            // Tải danh sách file trong thùng rác
            this.loadTrashFiles();
          } else if (this.currentMode === 'favorites') {
            // Tải danh sách file yêu thích
            this.loadFavoriteFiles();
          } else if (this.currentMode === 'search') {
            // Xử lý mode search
            const keyword = params['keyword'];
            if (keyword) {
              this.searchTerm = decodeURIComponent(keyword);
              this.isSearchMode = true;

              // Cập nhật giá trị tìm kiếm cho SearchComponent
              if (this.searchService) {
                this.searchService.updateSearchTerm(this.searchTerm);
              }

              // Tìm kiếm files với từ khóa
              this.searchFiles(this.searchTerm);
            } else {
              // Nếu không có từ khóa, quay về trang chủ
              this.router.navigate(['/manager-file/my-files']);
            }
          }
        } else {
          this.currentMode = 'files';

          // Trường hợp mode files - xử lý theo folder ID
          const encryptedId = params['encryptedId'];
          if (encryptedId) {
            const folderId = this.encryptionService.decryptId(encryptedId);
            if (folderId !== null) {
              this.currentFolder = folderId;
              this.loadFiles();
            } else {
              this.router.navigate(['/manager-file/my-files']);
            }
          } else {
            this.currentFolder = undefined;
            this.loadFiles();
          }
        }

        // Cập nhật breadcrumb dựa trên mode hiện tại
        this.updateBreadcrumbsByMode();
      });
    });

    // Đăng ký lắng nghe sự kiện thay đổi file
    this.fileChangeSubscription =
      this.fileManagerService.fileChanged$.subscribe(() => {
        this.loadFiles();
      });

    this.buildBoxFunction();

    this.createDelayObservable().subscribe(() => {
      this.pageLoaded();
    });
  }

  ngOnChanges() {
    this.buildBoxFunction();
  }

  buildBoxFunction() {
    if(this.currentMode === 'trash'){
      this.menuItemFunction = [
        this.listItemFunction.emptyTrash,
        this.listItemFunction.replayAll,
      ];
    }
    else if(this.currentMode === 'favorites'){
      this.menuItemFunction = [
        this.listItemFunction.deleteAll,
        this.listItemFunction.unstarredAll,
      ];
    }
    else if(this.currentMode === 'files' || this.currentMode === 'search'){
      this.menuItemFunction = [
        this.listItemFunction.deleteAll,
        this.listItemFunction.starredAll,
      ];
    }
  }


  // Các phương thức để tải dữ liệu theo các mode khác nhau
  loadTrashFiles() {
    this.loading = true;
    this.fileService
      .getDeletedFiles(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.totalRecords = response.data?.totalCount || 0;
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
      });
  }

  loadFavoriteFiles() {
    this.loading = true;
    this.fileService
      .getFavoriteFiles(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.fileList = response.data?.items || [];
          this.totalRecords = response.data?.totalCount || 0;
          this.loading = false;
        },
        error: (error) => {
          this.handleError(error);
        },
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

  updateBreadcrumbsByMode(): void {
    switch (this.currentMode) {
      case 'trash':
        this.breadcrumbService.updateBreadcrumbs([
          { label: 'My Files', routerLink: '/manager-file/my-files' },
          { label: 'Thùng rác', routerLink: '/manager-file/trash' },
        ]);
        break;
      case 'favorites':
        this.breadcrumbService.updateBreadcrumbs([
          { label: 'My Files', routerLink: '/manager-file/my-files' },
          { label: 'Yêu thích', routerLink: '/manager-file/favorites' },
        ]);
        break;
      case 'search':
        this.breadcrumbService.updateBreadcrumbs([
          { label: 'My Files', routerLink: '/manager-file/my-files' },
          {
            label: `Tìm kiếm: "${this.searchTerm}"`,
            routerLink: `/manager-file/search/${encodeURIComponent(
              this.searchTerm
            )}`,
          },
        ]);
        break;
      case 'files':
        if (this.currentFolder) {
          this.updateBreadcrumbForFolder(this.currentFolder);
        } else {
          this.breadcrumbService.updateBreadcrumbs([
            { label: 'My Files', routerLink: '/manager-file/my-files' },
          ]);
        }
        break;
    }
  }

  updateBreadcrumbForFolder(folderId: number): void {
    this.folderPathService.buildFolderPath(folderId).subscribe((folderPath) => {
      const breadcrumbItems: MenuItem[] = [
        { label: 'My Files', routerLink: '/manager-file/my-files' },
      ];

      folderPath.forEach((folder) => {
        breadcrumbItems.push({
          label: folder.name,
          routerLink: folder.routerLink,
        });
      });

      this.breadcrumbService.updateBreadcrumbs(breadcrumbItems);
    });
  }

  navigateToFolder(folderId?: number): void {
    if (folderId) {
      // Đi đến thư mục cụ thể
      const encryptedId = this.encryptionService.encryptId(folderId);
      this.router.navigate(['/manager-file/files', encryptedId]);
      // currentMode và currentFolder sẽ được cập nhật trong ngOnInit khi route thay đổi
      // breadcrumb cũng sẽ được cập nhật tự động sau đó
    } else {
      // Quay lại thư mục gốc
      this.router.navigate(['/manager-file/my-files']);
      // currentMode và currentFolder sẽ được cập nhật trong ngOnInit khi route thay đổi
      // breadcrumb cũng sẽ được cập nhật tự động sau đó
    }
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

  handleDoubleClick(file: FileModel): void {
    if (this.currentMode === 'trash') {
      // Trong thùng rác, chỉ cho phép xem chi tiết file
      this.showFileDetails(file);
      return;
    }

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

  // Xử lý sự kiện thay đổi trang
  onPageChange(event: any): void {
    this.currentPage = event.page + 1;
    // Chỉ gọi loadPagedItems khi đang ở chế độ phân trang
    if (this.shouldPaginate) {
      this.loadPagedItems();
    }
  }

  // Tìm kiếm file
  searchFiles(keyword: string): void {
    if (!keyword || !keyword.trim()) {
      this.loadFiles();
      return;
    }

    this.loading = true;
    this.fileService
      .searchFiles(
        { searchTerm: keyword.trim() },
        this.currentPage,
        this.pageSize
      )
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

  // Phương thức khôi phục file từ thùng rác
  restoreFile(file: FileModel): void {
    this.fileService.restoreFile(file.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã khôi phục tệp tin',
        });
        // Tải lại danh sách file rác
        this.loadTrashFiles();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể khôi phục tệp tin',
        });
      },
    });
  }

  // Hiển thị xác nhận xóa vĩnh viễn
  confirmPermanentDelete(file: FileModel): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn "${file.name}" không? Thao tác này không thể hoàn tác.`,
      header: 'Xác nhận xóa vĩnh viễn',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.permanentDeleteFile(file),
    });
  }

  // Xóa vĩnh viễn file
  permanentDeleteFile(file: FileModel): void {
    this.fileService.permanentDeleteFile(file.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa vĩnh viễn tệp tin',
        });
        // Tải lại danh sách file rác
        this.loadTrashFiles();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể xóa vĩnh viễn tệp tin',
        });
      },
    });
  }

  // Xác nhận làm trống thùng rác
  confirmEmptyTrash(): void {
    this.confirmationService.confirm({
      message:
        'Bạn có chắc chắn muốn làm trống thùng rác? Tất cả tệp tin sẽ bị xóa vĩnh viễn và không thể khôi phục.',
      header: 'Xác nhận làm trống thùng rác',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.emptyTrash(),
    });
  }

  // Làm trống thùng rác
  emptyTrash(): void {
    // Giả sử bạn đã có API endpoint cho thao tác này
    // Nếu không có, bạn có thể xóa vĩnh viễn từng file trong danh sách
    this.fileService.emptyTrash().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã làm trống thùng rác',
        });
        this.loadTrashFiles(); // Tải lại danh sách trống
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể làm trống thùng rác',
        });
      },
    });
  }

// Check if a file is selected
isFileSelected(file: FileModel): boolean {
  return this.selectedFiles.some(f => f.id === file.id);
}

// Toggle selection of a single file
toggleFileSelection(file: FileModel, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }

  const index = this.selectedFiles.findIndex(f => f.id === file.id);
  if (index === -1) {
    this.selectedFiles.push(file);
  } else {
    this.selectedFiles.splice(index, 1);
  }
}

// Check if all files on current page are selected
areAllFilesSelected(): boolean {
  return this.fileList.length > 0 && this.fileList.every(file => this.isFileSelected(file));
}

// Toggle selection of all files on current page
toggleSelectAll(): void {
  if (this.areAllFilesSelected()) {
    // Deselect all files on current page
    this.fileList.forEach(file => {
      const index = this.selectedFiles.findIndex(f => f.id === file.id);
      if (index !== -1) {
        this.selectedFiles.splice(index, 1);
      }
    });
  } else {
    // Select all files on current page
    this.fileList.forEach(file => {
      if (!this.isFileSelected(file)) {
        this.selectedFiles.push(file);
      }
    });
  }
}

// Get Math object for template
get Math() {
  return Math;
}

// Get pages for pagination
getPages(): number[] {
  const totalPages = Math.ceil(this.totalRecords / this.pageSize);
  const visiblePages = 5; // Number of page buttons to show

  let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
  let endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  return Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
}

  override ngOnDestroy() {
    // Hủy đăng ký lắng nghe khi component bị hủy
    if (this.fileChangeSubscription) {
      this.fileChangeSubscription.unsubscribe();
      this.fileChangeSubscription = null;
    }
  }

  getItemColorClass(item: any): string {
    return item.colorClass || 'hover:bg-gray-300 dark:hover:bg-gray-700';
  }

  // Các action methods
  deleteAll() {
    console.log('Xóa tất cả');
    // Logic xóa tất cả
  }


  replayAll() {
    console.log('Khôi phục tất cả');
    // Logic khôi phục tất cả
  }

  starredAll() {
    console.log('Yêu thích tất cả');
    // Logic đánh dấu tất cả là yêu thích
  }

  unstarredAll() {
    console.log('Loại bỏ tất cả khỏi yêu thích');
    // Logic loại bỏ tất cả khỏi yêu thích
  }
}
