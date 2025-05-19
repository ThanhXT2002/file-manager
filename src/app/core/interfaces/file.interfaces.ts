import { AccessLevel, FileType } from "../enum/file.enum";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface FileShare {
  id: number;
  fileId: number;
  fileName: string;
  sharedByUserId: number;
  sharedByUserEmail: string;
  sharedWithUserId?: number;
  sharedWithUserEmail?: string;
  accessLevel: number;
  shareCode: string;
  expireDate?: Date;
  isActive: boolean;
  isPasswordProtected: boolean;
  allowDownload: boolean;
  viewCount: number;
}

export interface FileVersion {
  id: number;
  fileId: number;
  versionNumber: number;
  size: number;
  formattedSize: string;
  modifiedByUserId: number;
  modifiedByUserEmail: string;
  createdAt: Date;
  comment: string;
}

export interface FileModel {
  id: number;
  name: string;
  virtualPath: string;
  type: FileType;
  extension: string;
  contentType: string;
  size: number;
  userId: number;
  userEmail?: string;
  parentId?: number;
  isRootFolder: boolean;
  isShared: boolean;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
  thumbnailUrl?: string;
  version: number;
  tags: Tag[];
  isFavorite: boolean;
  shares: FileShare[];
  formattedSize: string;
}

export interface FileListResponse {
  items: FileModel[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalSize: number;
}

export interface FolderStructure {
  id: number;
  name: string;
  parentId?: number;
  isRootFolder: boolean;
  children: FolderStructure[];
}

export interface FileFilter {
  searchTerm?: string;
  type?: FileType;
  extensions?: string[];
  minSize?: number;
  maxSize?: number;
  createdFrom?: Date;
  createdTo?: Date;
  isShared?: boolean;
  isFavorite?: boolean;
  tagIds?: number[];
}
