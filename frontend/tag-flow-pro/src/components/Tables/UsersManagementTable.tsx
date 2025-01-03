import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
      render: (user: User) => user.roleName || "N/A",
    },
    { header: "Created By", accessor: "createdByAdminEmail" },
    {
      header: "Assigned Tags",
      accessor: "tags",
      render: (user: User) => {
        const userTags = user.assignedTags || [];

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
        onPageChange={paginateUsersTable} // Handle pagination
        toggleAddModal={toggleAddUserModal}
        canShowAddButton={true}
        addButtonHeader="Add User"
        onSearch={onSearch}
        searchPlaceholder={USERS_AND_ADMINS_SEARCH_PLACEHOLDER}
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
