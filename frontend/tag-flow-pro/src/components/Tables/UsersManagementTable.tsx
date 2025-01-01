import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import TableWrapper from "components/Tables/TableWrapper";
import { User } from "types/User";

interface UsersManagementTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  paginateUsersTable: (pageNumber: number) => void;
  openEditUserModal: (user: User) => void;
  handleDeleteUser: (userId: number) => void;
  toggleAddUserModal: () => void;
}

const UsersManagementTable: React.FC<UsersManagementTableProps> = ({
  users,
  currentPage,
  totalPages,
  paginateUsersTable,
  openEditUserModal,
  handleDeleteUser,
  toggleAddUserModal,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserTags, setSelectedUserTags] = useState<string[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const toggleModal = () => setModalOpen(!modalOpen);

  const openAssignedTagsModal = (user: User) => {
    setSelectedUserTags(user.assignedTags || []);
    setSelectedUserName(user.username);
    toggleModal();
  };

  const columns = [
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (user: User) => user.roleName || "N/A", // Render role name
    },
    {
      header: "Assigned Tags",
      accessor: "tags",
      render: (user: User) => {
        const userTags = user.assignedTags || []; // Directly use assignedTags from user

        return userTags.length > 3 ? (
          <>
            {userTags.slice(0, 3).join(", ")}{" "}
            <Button
              color="link"
              style={{ color: "blue", textDecoration: "underline" }}
              onClick={() => openAssignedTagsModal(user)}
            >
              +{userTags.length - 3} more
            </Button>
          </>
        ) : (
          userTags.join(", ") || "No tags assigned"
        );
      },
    },
    { header: "Created By UserName", accessor: "createdByAdminName" },
    { header: "Created By Email", accessor: "createdByAdminEmail" },
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
        onPageChange={paginateUsersTable} // Handle pagination
        toggleAddModal={toggleAddUserModal}
        canShowAddButton={true}
        addButtonHeader="Add User"
      />
      {/* Modal for Assigned Tags */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Assigned Tags for {selectedUserName}
        </ModalHeader>
        <ModalBody>
          {selectedUserTags.length > 0 ? (
            <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
              {selectedUserTags.map((tagName, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                  {tagName}
                </li>
              ))}
            </ul>
          ) : (
            "No tags assigned."
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UsersManagementTable;
