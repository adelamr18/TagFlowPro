export interface UploadFileDetails {
  fileName: string;
  fileStatus: string;
  fileRowsCount: number;
  uploadedByUserName: string;
  selectedProjectId?: number;
  selectedPatientTypeIds?: number[];
  userId: number;
  isAdmin: boolean;
  fileUploadedOn: Date;
}
