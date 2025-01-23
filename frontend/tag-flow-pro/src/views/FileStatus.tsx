import Header from "components/Headers/Header";
import FileStatusTable from "components/Tables/FileStatusTable";
import React, { useMemo, useState } from "react";
import { Container, Row } from "reactstrap";
import { useFile } from "context/FileContext";

const FileStatus: React.FC = () => {
  const { files } = useFile();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = useMemo(() => {
    return Math.ceil(files.length / pageSize);
  }, [files, pageSize]);

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return files.slice(startIndex, endIndex);
  }, [files, currentPage, pageSize]);

  const paginateFilesTable = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default FileStatus;
