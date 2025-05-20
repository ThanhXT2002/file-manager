// folder-path.service.ts
import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { FileModel } from '../interfaces/file.interfaces';
import { EncryptionService } from './encryption.service';

export interface FolderPathItem {
  id: number;
  name: string;
  routerLink?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FolderPathService {
  constructor(
    private fileService: FileService,
    private encryptionService: EncryptionService
  ) {}

  // Xây dựng đường dẫn thư mục bằng cách lấy lần lượt từng thư mục cha
  buildFolderPath(folderId: number): Observable<FolderPathItem[]> {
    return this.buildPathRecursively(folderId, []);
  }

  private buildPathRecursively(folderId: number, currentPath: FolderPathItem[]): Observable<FolderPathItem[]> {
    // Lấy thông tin của thư mục hiện tại
    return this.fileService.getFileById(folderId).pipe(
      switchMap(response => {
        const folder = response.data;

        if (!folder) {
          return of(currentPath);
        }

        // Thêm thư mục hiện tại vào đường dẫn
        const folderItem: FolderPathItem = {
          id: folder.id,
          name: folder.name,
          routerLink: `/manager-file/files/${this.encryptionService.encryptId(folder.id)}`
        };

        // Nếu thư mục có parentId và không phải thư mục gốc
        if (folder.parentId && !folder.isRootFolder) {
          // Đệ quy để lấy thư mục cha
          return this.buildPathRecursively(folder.parentId, [folderItem, ...currentPath]);
        } else {
          // Đã đến thư mục gốc, hoàn thành đường dẫn
          return of([folderItem, ...currentPath]);
        }
      }),
      catchError(error => {
        console.error('Error building folder path:', error);
        return of(currentPath);
      })
    );
  }
}
