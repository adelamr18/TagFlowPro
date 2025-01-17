import TableWrapper from "components/Tables/TableWrapper";
import { Button } from "reactstrap";
import { Role } from "types/Role";

interface RolesManagementTableProps {
  roles: Role[];
  currentPage: number;
  totalPages: number;
  paginateRolesTable: (page: number) => void;
  getPermissions: (roleId: number) => string;
  openEditRoleModal: (role: Role) => void;
}

const RolesManagementTable = ({
  roles,
  currentPage,
  totalPages,
  paginateRolesTable,
  getPermissions,
  openEditRoleModal,
}: RolesManagementTableProps) => {
  const columns = [
    { header: "Role Name", accessor: "roleName" },
    { header: "Created By", accessor: "createdBy" },
    {
      header: "Permissions",
      accessor: "roleId",
      render: (role: Role) => getPermissions(role.roleId),
    },
    { header: "Updated By", accessor: "updatedBy" },
    {
      header: "Actions",
      accessor: "",
      render: (role: Role) => (
        <Button color="primary" onClick={() => openEditRoleModal(role)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <TableWrapper
      title="Roles Management"
      columns={columns}
      data={roles}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={paginateRolesTable}
      canShowAddButton={false}
      toggleAddModal={() => {}}
      searchPlaceholder=""
    />
  );
};

export default RolesManagementTable;
