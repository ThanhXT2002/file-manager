export interface ChunkUploadProgress {
  uploadId: string;
  fileName: string;
  totalSize: number;
  uploadedSize: number;
  progress: number;
  status: 'uploading' | 'paused' | 'completed' | 'error';
  chunksUploaded: number;
  totalChunks: number;
  remainingTime?: number;
  speed?: number;
  message?: string;
}
