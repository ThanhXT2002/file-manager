import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FileFilter,
  FileListResponse,
  FileModel,
  FileUploadResponse,
  FileUploadResult,
  FileVersion,
  FolderStructure,
} from '../interfaces/file.interfaces';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import {
  CreateFolderRequest,
  MoveFileRequest,
  RenameFileRequest,
} from '../interfaces/file-request.interface';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly baseUrl = `${environment.apiUrl}/file`;
  private http = inject(HttpClient);

  // Lấy danh sách file theo parentId
  getFiles(
    parentId?: number,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<ApiResponse<FileListResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (parentId !== undefined) {
      params = params.set('parentId', parentId.toString());
    }

    return this.http.get<ApiResponse<FileListResponse>>(`${this.baseUrl}`, {
      params,
    });
  }

  // Lấy thông tin chi tiết file
  getFileById(id: number): Observable<ApiResponse<FileModel>> {
    return this.http.get<ApiResponse<FileModel>>(`${this.baseUrl}/${id}`);
  }

  // Lấy danh sách file đã xóa (thùng rác)
  getDeletedFiles(
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<ApiResponse<FileListResponse>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<FileListResponse>>(
      `${this.baseUrl}/trash`,
      { params }
    );
  }

  // Lấy nội dung file
  getFileContent(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}/content`);
  }

  // Lấy cấu trúc thư mục
  getFolderStructure(): Observable<ApiResponse<FolderStructure[]>> {
    return this.http.get<ApiResponse<FolderStructure[]>>(
      `${this.baseUrl}/folders/structure`
    );
  }

  // Tìm kiếm file
  searchFiles(
    filter: FileFilter,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<ApiResponse<FileListResponse>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (filter.searchTerm) {
      params = params.set('searchTerm', filter.searchTerm);
    }

    // Thêm các tham số khác của filter nếu cần

    return this.http.get<ApiResponse<FileListResponse>>(
      `${this.baseUrl}/search`,
      { params }
    );
  }

  // Lấy danh sách file yêu thích
  getFavoriteFiles(
    pageNumber: number = 1,
    pageSize: number = 20
  ): Observable<ApiResponse<FileListResponse>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<FileListResponse>>(
      `${this.baseUrl}/favorites`,
      { params }
    );
  }

  // Lấy phiên bản của file
  getFileVersions(fileId: number): Observable<ApiResponse<FileVersion[]>> {
    return this.http.get<ApiResponse<FileVersion[]>>(
      `${this.baseUrl}/${fileId}/versions`
    );
  }

  // Tạo thư mục mới
  createFolder(
    request: CreateFolderRequest
  ): Observable<ApiResponse<FileModel>> {
    return this.http.post<ApiResponse<FileModel>>(
      `${this.baseUrl}/folder`,
      request
    );
  }

  // Cập nhật phương thức uploads multiple files
uploadFiles(files: File[], parentId?: number): Observable<ApiResponse<FileUploadResponse>> {
  const formData = new FormData();
  // Thêm nhiều file vào formData
  files.forEach(file => {
    formData.append('files', file);  // <-- THAY ĐỔI NÀY
  });

  let url = `${this.baseUrl}/uploads`;
  if (parentId !== undefined) {
    url += `?parentId=${parentId}`;
  }

  return this.http.post<ApiResponse<FileUploadResponse>>(url, formData);
}

  // Tải lên file
  uploadFile(
    file: File,
    parentId?: number
  ): Observable<ApiResponse<FileModel>> {
    const formData = new FormData();
    formData.append('file', file);

    let url = `${this.baseUrl}/upload`;
    if (parentId !== undefined) {
      url += `?parentId=${parentId}`;
    }

    return this.http.post<ApiResponse<FileModel>>(url, formData);
  }

  // Đổi tên file
  renameFile(
    id: number,
    request: RenameFileRequest
  ): Observable<ApiResponse<FileModel>> {
    return this.http.put<ApiResponse<FileModel>>(
      `${this.baseUrl}/${id}/rename`,
      request
    );
  }

  // Di chuyển file
  moveFile(
    id: number,
    request: MoveFileRequest
  ): Observable<ApiResponse<FileModel>> {
    return this.http.put<ApiResponse<FileModel>>(
      `${this.baseUrl}/${id}/move`,
      request
    );
  }

  // Thêm vào yêu thích
  addToFavorites(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/${id}/favorite`,
      {}
    );
  }

  // Xóa khỏi yêu thích
  removeFromFavorites(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}/favorite`);
  }

  // Khôi phục phiên bản file
  restoreFileVersion(
    fileId: number,
    versionId: number
  ): Observable<ApiResponse<FileModel>> {
    return this.http.post<ApiResponse<FileModel>>(
      `${this.baseUrl}/${fileId}/versions/${versionId}/restore`,
      {}
    );
  }

  // Xóa file (chuyển vào thùng rác)
  deleteFile(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }

  // Xóa vĩnh viễn file
  permanentDeleteFile(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/${id}/permanent`
    );
  }

  // Khôi phục file từ thùng rác
  restoreFile(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/${id}/restore`,
      {}
    );
  }

  // Tải xuống file
  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
  }

  emptyTrash(): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/trash/empty`);
  }
}
