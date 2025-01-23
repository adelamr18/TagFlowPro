export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  fileName?: string;
  fileId?: string;
}
