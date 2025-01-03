import React from "react";
import { Button } from "reactstrap";
import TableWrapper from "components/Tables/TableWrapper";
import { Admin } from "types/Admin";
import { USERS_AND_ADMINS_SEARCH_PLACEHOLDER } from "shared/consts";

interface AdminsManagementProps {
  admins: Admin[];
  currentPage: number;
  totalPages: number;
  paginateAdminsTable: (pageNumber: number) => void;
  openEditAdminModal: (admin: Admin) => void;
  handleDeleteAdmin: (adminId: number) => void;
  toggleAddAdminModal: () => void;
  currentAdminEmail: string;
  onSearch?: (value: string) => void;
}

const AdminsManagementTable: React.FC<AdminsManagementProps> = ({
  admins,
  currentPage,
  totalPages,
  paginateAdminsTable,
  openEditAdminModal,
  handleDeleteAdmin,
  toggleAddAdminModal,
  currentAdminEmail,
  onSearch,
}) => {
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Created By", accessor: "createdByAdminEmail" },
    { header: "Updated By", accessor: "updatedBy" },
    {
      header: "Actions",
      accessor: "",
      render: (admin: Admin) => (
        <>
          <Button
            color="primary"
            onClick={() => openEditAdminModal(admin)}
            disabled={
              admin.email.toLowerCase() === currentAdminEmail.toLowerCase()
            }
          >
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeleteAdmin(admin.adminId)}
            className="ml-2"
            disabled={
              admin.email.toLowerCase() === currentAdminEmail.toLowerCase()
            }
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <TableWrapper
        title="Admins Management"
        columns={columns}
        data={admins}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginateAdminsTable}
        toggleAddModal={toggleAddAdminModal}
        canShowAddButton={true}
        addButtonHeader="Add Admin"
        onSearch={onSearch}
        searchPlaceholder={USERS_AND_ADMINS_SEARCH_PLACEHOLDER}
      />
    </>
  );
};

export default AdminsManagementTable;
