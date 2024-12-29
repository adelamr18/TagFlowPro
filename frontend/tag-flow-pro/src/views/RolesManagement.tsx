import TableWrapper from "components/Tables/TableWrapper";
import { Button } from "reactstrap";
import { Role } from "types/Role";

const RolesManagement = ({
  roles,
  currentPage,
  totalPages,
  paginateRolesTable,
  getPermissions,
  openEditRoleModal,
}) => {
  const columns = [
    { header: "Role Name", accessor: "roleName" },
    { header: "Created By", accessor: "createdBy" },
    {
      header: "Permissions",
      accessor: "roleId",
      render: (role: Role) => getPermissions(role.roleId),
    },
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
      toggleAddTagModal={() => {}}
    />
  );
};

export default RolesManagement;
