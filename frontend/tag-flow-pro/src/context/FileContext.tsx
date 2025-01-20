import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { UploadFileDetails } from "types/UploadFileDetails";
import { toast } from "react-toastify";
import fileService from "services/fileService";

interface FileContextType {
  uploadFile: (fileDetails: UploadFileDetails, file: File) => Promise<boolean>;
  files: UploadFileDetails[];
  setFiles: React.Dispatch<React.SetStateAction<UploadFileDetails[]>>;
}

const FileContext = createContext<FileContextType>({
  uploadFile: async () => false,
  files: [],
  setFiles: () => {},
});

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<UploadFileDetails[]>([]);

  const uploadFile = async (
    fileDetails: UploadFileDetails,
    file: File
  ): Promise<boolean> => {
    try {
      const { success, message, fileName } = await fileService.uploadFile(
        fileDetails,
        file
      );

      if (success) {
        toast.success(message || "File uploaded successfully!");

        if (fileName) {
          fileService.downloadFile(fileName);
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

  return (
    <FileContext.Provider value={{ uploadFile, files, setFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = (): FileContextType => {
  return useContext(FileContext);
};
