import TableWrapper from "components/Tables/TableWrapper";
import { FileStatus } from "types/FileStatus";

interface FileStatusTableProps {
  files: FileStatus[];
  currentPage: number;
  totalPages: number;
  paginateFilesTable: (page: number) => void;
}

const FileStatusTable = ({
  files,
  currentPage,
  totalPages,
  paginateFilesTable,
}: FileStatusTableProps) => {
  const columns = [
    { header: "File Name", accessor: "fileName" },
    { header: "Uploaded By", accessor: "uploadedByUserName" },
    { header: "Created At", accessor: "createdAt" },
    { header: "File Status", accessor: "fileStatus" },
    { header: "Total Uploaded Rows", accessor: "fileRowsCounts" },
    {
      header: "Download",
      accessor: "fileName",
      render: (file: FileStatus) =>
        file.downloadLink ? (
          <a
            href={file.downloadLink}
            download={file.fileName}
            title="Download File"
          >
            <i className="fa fa-download" style={{ cursor: "pointer" }} />
          </a>
        ) : (
          <></>
        ),
    },
  ];

  return (
    <TableWrapper
      title="File Status"
      columns={columns}
      data={files}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={paginateFilesTable}
      canShowAddButton={false}
      toggleAddModal={() => {}}
      searchPlaceholder="Search files..."
    />
  );
};

export default FileStatusTable;
