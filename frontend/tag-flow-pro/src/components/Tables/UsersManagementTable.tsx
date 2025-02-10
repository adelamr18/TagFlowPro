import React from "react";
import { Button } from "reactstrap";
import TableWrapper from "components/Tables/TableWrapper";
import { User } from "types/User";
import { USERS_AND_ADMINS_SEARCH_PLACEHOLDER } from "shared/consts";

interface UsersManagementTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  paginateUsersTable: (pageNumber: number) => void;
  openEditUserModal: (user: User) => void;
  handleDeleteUser: (userId: number) => void;
  toggleAddUserModal: () => void;
  onSearch: (searchValue: string) => void;
  searchPlaceholder?: string;
}

const UsersManagementTable: React.FC<UsersManagementTableProps> = ({
  users,
  currentPage,
  totalPages,
  paginateUsersTable,
  openEditUserModal,
  handleDeleteUser,
  toggleAddUserModal,
  onSearch,
  searchPlaceholder,
}) => {
  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (user: User) => user.roleName || "N/A",
    },
    { header: "Created By", accessor: "createdByAdminEmail" },
    { header: "Updated By", accessor: "updatedBy" },
    {
      header: "Actions",
      accessor: "",
      render: (user: User) => (
        <>
          <Button color="primary" onClick={() => openEditUserModal(user)}>
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeleteUser(user.userId)}
            className="ml-2"
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
        title="Users Management"
        columns={columns}
        data={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginateUsersTable}
        toggleAddModal={toggleAddUserModal}
        canShowAddButton={true}
        addButtonHeader="Add User"
        onSearch={onSearch}
        searchPlaceholder={USERS_AND_ADMINS_SEARCH_PLACEHOLDER}
      />
    </>
  );
};

export default UsersManagementTable;
