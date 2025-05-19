export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors: { [key: string]: string[] };
  errorCode?: string;
}
