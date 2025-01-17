import axios from "axios";
import { API_URL } from "shared/consts";
import { ApiResponse } from "types/ApiResponse";
import { UploadFileDetails } from "types/UploadFileDetails";

const MAIN_URL = `${API_URL}/file`;

const fileService = {
  uploadFile: async (
    fileDetails: UploadFileDetails,
    file: File
  ): Promise<ApiResponse<null>> => {
    try {
      const formData = new FormData();

      formData.append("addedFileName", fileDetails.fileName);
      formData.append("fileStatus", fileDetails.fileStatus);
      formData.append("fileRowsCount", fileDetails.fileRowsCount.toString());
      formData.append("uploadedByUserName", fileDetails.uploadedByUserName);
      formData.append("selectedTags", JSON.stringify(fileDetails.selectedTags));
      formData.append("file", file);

      const response = await axios.post(`${MAIN_URL}/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },

  getAllFiles: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.get(`${MAIN_URL}/update-file`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },
};

export default fileService;
