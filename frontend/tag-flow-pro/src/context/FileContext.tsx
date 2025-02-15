import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";
import { UploadFileDetails } from "types/UploadFileDetails";
import { toast } from "react-toastify";
import fileService from "services/fileService";
import { FileStatus } from "types/FileStatus";
import signalRService from "services/signalRService";
import { OverviewDto } from "types/OverviewDto";

interface FileContextType {
  uploadFile: (fileDetails: UploadFileDetails, file: File) => Promise<boolean>;
  getAllFiles: () => Promise<void>;
  deleteFile: (fileId: number) => Promise<void>;
  getOverview: (
    fromDate: string,
    toDate: string,
    projectName: string,
    patientType: string
  ) => Promise<OverviewDto | null>;
  files: FileStatus[];
  setFiles: React.Dispatch<React.SetStateAction<FileStatus[]>>;
}

const FileContext = createContext<FileContextType>({
  uploadFile: async () => false,
  getAllFiles: async () => {},
  deleteFile: async () => {},
  getOverview: async () => null,
  files: [],
  setFiles: () => {},
});

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileStatus[]>([]);

  useEffect(() => {
    signalRService.startConnection();
    const onFileStatusUpdate = async (
      fileId: number,
      downloadLink: string,
      fileStatus: string
    ) => {
      await getAllFiles();
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.fileId === fileId ? { ...file, downloadLink, fileStatus } : file
        )
      );
    };
    signalRService.onFileStatusUpdated(onFileStatusUpdate);
    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const uploadFile = async (
    fileDetails: UploadFileDetails,
    file: File
  ): Promise<boolean> => {
    try {
      const { success, message, fileName, fileId } =
        await fileService.uploadFile(fileDetails, file);
      if (success) {
        toast.success(message || "File uploaded successfully!");
        if (fileName) {
          fileService.downloadFile(fileName, parseInt(fileId, 10));
        }
        await getAllFiles();
      } else {
        toast.error(message || "Failed to upload file. Please try again.");
      }
      return success;
    } catch (error) {
      toast.error("An error occurred during file upload. Please try again.");
      return false;
    }
  };

  const getAllFiles = async (): Promise<void> => {
    try {
      const { success, data, message } = await fileService.getAllFiles();
      if (success) {
        setFiles(data || []);
      } else {
        toast.error(message || "Failed to fetch files.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching files. Please try again.");
    }
  };

  const deleteFile = async (fileId: number): Promise<void> => {
    try {
      const { success, message } = await fileService.deleteFile(fileId);
      if (success) {
        toast.success(message || "File deleted successfully!");
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.fileId !== fileId)
        );
      } else {
        toast.error(message || "Failed to delete file. Please try again.");
      }
    } catch (error) {
      toast.error(
        "An error occurred while deleting the file. Please try again."
      );
    }
  };

  const getOverview = async (
    fromDate: string,
    toDate: string,
    projectName: string,
    patientType: string
  ): Promise<OverviewDto | null> => {
    const projectParam =
      projectName.trim().toLowerCase() === "all" ? "" : projectName;
    const patientParam =
      patientType.trim().toLowerCase() === "all" ? "" : patientType;
    try {
      const { success, data, message } = await fileService.getOverview(
        fromDate,
        toDate,
        projectParam,
        patientParam
      );
      if (success && data) {
        return data;
      } else {
        toast.error(message || "Failed to fetch overview.");
        return null;
      }
    } catch (error) {
      toast.error(
        "An error occurred while fetching overview. Please try again."
      );
      return null;
    }
  };

  useEffect(() => {
    getAllFiles();
    getOverview("", "", "all", "all");
  }, []);

  return (
    <FileContext.Provider
      value={{
        uploadFile,
        getAllFiles,
        deleteFile,
        getOverview,
        files,
        setFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFile = (): FileContextType => useContext(FileContext);
