import React, { useMemo, useState } from "react";
import { Container, Row } from "reactstrap";
import Header from "components/Headers/Header";
import FileStatusTable from "components/Tables/FileStatusTable";
import { useFile } from "context/FileContext";
import { useAuth } from "context/AuthContext";
import { OPERATOR_ROLE_ID } from "shared/consts";

const FileStatus: React.FC = () => {
  const { files, deleteFile } = useFile();
  const { roleId, userId } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 10;

  const filteredFiles = useMemo(() => {
    let filtered = files;
    if (parseInt(roleId, 10) === OPERATOR_ROLE_ID) {
      filtered = filtered.filter((file) => file.userId === userId);
    }
    if (!searchQuery.trim()) {
      return filtered;
    }
    return filtered.filter((file) =>
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery, roleId, userId]);

  const totalPages = useMemo(
    () => Math.ceil(filteredFiles.length / pageSize),
    [filteredFiles, pageSize]
  );

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredFiles.slice(startIndex, endIndex);
  }, [filteredFiles, currentPage, pageSize]);

  const paginateFilesTable = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOnSearchTable = (value: string): void => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleDeleteFile = async (fileId: number) => {
    await deleteFile(fileId);
  };

  return (
    <>
      <Header canShowDashboard={false} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <FileStatusTable
              files={paginatedFiles}
              currentPage={currentPage}
              totalPages={totalPages}
              paginateFilesTable={paginateFilesTable}
              onSearch={handleOnSearchTable}
              handleDeleteFile={handleDeleteFile}
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default FileStatus;
