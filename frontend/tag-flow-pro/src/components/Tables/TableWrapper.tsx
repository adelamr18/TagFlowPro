import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";

interface TableColumn {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

interface TableWrapperProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  toggleAddTagModal: () => void;
  canShowAddButton: boolean;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
  title,
  columns,
  data,
  currentPage,
  totalPages,
  onPageChange,
  toggleAddTagModal,
  canShowAddButton,
}) => {
  return (
    <div className="col">
      <Card className="shadow">
        <CardHeader className="border-0">
          <h3 className="mb-0">{title}</h3>
        </CardHeader>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              {columns.map((col, index) => (
                <th key={index} scope="col">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(item) : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <CardFooter className="py-4">
          {canShowAddButton && (
            <Button color="primary" onClick={toggleAddTagModal}>
              Add New Tag
            </Button>
          )}
          <nav aria-label="Pagination">
            <Pagination
              className="pagination justify-content-end mb-0"
              listClassName="justify-content-end mb-0"
            >
              <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage - 1);
                  }}
                >
                  <i className="fas fa-angle-left" />
                  <span className="sr-only">Previous</span>
                </PaginationLink>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem
                  key={index}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(index + 1);
                    }}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem
                className={currentPage === totalPages ? "disabled" : ""}
              >
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(currentPage + 1);
                  }}
                >
                  <i className="fas fa-angle-right" />
                  <span className="sr-only">Next</span>
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </nav>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TableWrapper;
