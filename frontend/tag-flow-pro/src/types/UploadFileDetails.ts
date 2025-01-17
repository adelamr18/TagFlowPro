export interface UploadFileDetails {
  fileName: string;
  fileStatus: string;
  fileRowsCount: number;
  uploadedByUserName: string;
  selectedTags: SelectedTag[];
}

export interface SelectedTag {
  tagId: number;
  tagValuesIds: number[];
}
