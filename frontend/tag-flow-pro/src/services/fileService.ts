import axios from "axios";
import { API_URL } from "shared/consts";
import { ApiResponse } from "types/ApiResponse";
import { OverviewDto } from "types/OverviewDto";
import { ProjectAnalytics } from "types/ProjectAnalyticsDto";
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
      formData.append("userId", fileDetails.userId.toString());
      formData.append("isAdmin", fileDetails.isAdmin.toString());
      formData.append(
        "fileUploadedOn",
        fileDetails.fileUploadedOn.toISOString()
      );
      if (
        fileDetails.selectedProjectId !== undefined &&
        fileDetails.selectedProjectId !== null
      ) {
        formData.append(
          "selectedProjectId",
          fileDetails.selectedProjectId.toString()
        );
      }
      if (
        fileDetails.selectedPatientTypeIds &&
        fileDetails.selectedPatientTypeIds.length > 0
      ) {
        formData.append(
          "selectedPatientTypeIds",
          JSON.stringify(fileDetails.selectedPatientTypeIds)
        );
      }
      formData.append("file", file);
      const response = await axios.post(`${MAIN_URL}/upload-file`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return {
        success: true,
        message: response.data.message,
        fileName: response.data.fileName,
        fileId: response.data.fileId,
      };
    } catch (error: any) {
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
      const response = await axios.get(`${MAIN_URL}/get-all-files`);
      return {
        success: true,
        data: response.data.files,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while getting the files. Please try again.",
      };
    }
  },
  downloadFile: async (
    fileName: string,
    fileId: number
  ): Promise<ApiResponse<null>> => {
    try {
      const downloadUrl = `${MAIN_URL}/download?fileName=${encodeURIComponent(
        fileName
      )}&fileId=${fileId}`;
      const response = await axios.get(downloadUrl, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      return { success: true, message: "File downloaded successfully!" };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while downloading the file. Please try again.",
      };
    }
  },
  deleteFile: async (fileId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${MAIN_URL}/delete/${fileId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the file.",
      };
    }
  },
  getOverview: async (
    fromDate: string,
    toDate: string,
    projectName: string,
    patientType: string,
    viewerId?: number
  ): Promise<ApiResponse<OverviewDto>> => {
    try {
      const response = await axios.get(`${MAIN_URL}/overview`, {
        params: { fromDate, toDate, projectName, patientType, viewerId },
      });
      return {
        success: true,
        data: response.data.overview,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching the overview. Please try again.",
      };
    }
  },
  getDetailedOverview: async (
    fromDate: string,
    toDate: string,
    projectName: string,
    patientType: string,
    timeGranularity: string,
    viewerId?: number
  ): Promise<ApiResponse<ProjectAnalytics>> => {
    try {
      const response = await axios.get(`${MAIN_URL}/project-analytics`, {
        params: {
          fromDate,
          toDate,
          projectName,
          patientType,
          timeGranularity,
          viewerId,
        },
      });
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while fetching the overview. Please try again.",
      };
    }
  },
};

export default fileService;
