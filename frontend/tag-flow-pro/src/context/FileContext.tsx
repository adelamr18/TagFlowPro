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

interface FileContextType {
  uploadFile: (fileDetails: UploadFileDetails, file: File) => Promise<boolean>;
  getAllFiles: () => Promise<void>;
  files: FileStatus[];
  setFiles: React.Dispatch<React.SetStateAction<FileStatus[]>>;
}

const FileContext = createContext<FileContextType>({
  uploadFile: async () => false,
  getAllFiles: async () => {},
  files: [],
  setFiles: () => {},
});

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileStatus[]>([]);

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
          await getAllFiles();
        }
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

  useEffect(() => {
    getAllFiles();
  }, []);

  return (
    <FileContext.Provider value={{ uploadFile, getAllFiles, files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = (): FileContextType => {
  return useContext(FileContext);
};
