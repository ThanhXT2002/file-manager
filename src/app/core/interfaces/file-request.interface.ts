export interface CreateFolderRequest {
  name: string;
  parentId?: number;
}

export interface RenameFileRequest {
  newName: string;
}

export interface MoveFileRequest {
  newParentId: number;
}

export interface ShareFileRequest {
  fileId: number;
  sharedWithUserId?: number;
  accessLevel: number;
  generateLink: boolean;
  expireDate?: Date;
  password?: string;
  allowDownload: boolean;
}

export interface RestoreFileVersionRequest {
  fileId: number;
  versionId: number;
  comment?: string;
}
