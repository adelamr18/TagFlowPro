import TableWrapper from "components/Tables/TableWrapper";
import { FILENAME_SEARCH_PLACEHOLDER } from "shared/consts";
import { FileStatus } from "types/FileStatus";
import { Button } from "reactstrap";

interface FileStatusTableProps {
  files: FileStatus[];
  currentPage: number;
  totalPages: number;
  paginateFilesTable: (page: number) => void;
  onSearch?: (value: string) => void;
  handleDeleteFile: (fileId: number) => void;
}

const FileStatusTable = ({
  files,
  currentPage,
  totalPages,
  paginateFilesTable,
  onSearch,
  handleDeleteFile,
}: FileStatusTableProps) => {
  const columns = [
    { header: "File Name", accessor: "fileName" },
    { header: "Uploaded By", accessor: "uploadedByUserName" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (file: FileStatus) => new Date(file.createdAt).toLocaleString(),
    },
    {
      header: "File Uploaded On",
      accessor: "fileUploadedOn",
      render: (file: FileStatus) =>
        new Date(file.fileUploadedOn).toLocaleDateString(),
    },
    { header: "File Status", accessor: "fileStatus" },
    { header: "Total Rows", accessor: "fileRowsCounts" },
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
        ) : null,
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (file: FileStatus) => (
        <Button color="danger" onClick={() => handleDeleteFile(file.fileId)}>
          Delete
        </Button>
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
      searchPlaceholder={FILENAME_SEARCH_PLACEHOLDER}
      onSearch={onSearch}
    />
  );
};

export default FileStatusTable;
