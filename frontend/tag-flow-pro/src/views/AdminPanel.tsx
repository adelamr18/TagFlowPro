import Header from "components/Headers/Header.tsx";
import { useState } from "react";
import { useAdmin } from "context/AdminContext.tsx";
import { User } from "types/User";
import { Tag } from "types/Tag";
import { Role } from "types/Role";
import { ITEMS_PER_PAGE } from "shared/consts";
import RoleEditModal from "components/Modals/RoleEditModal";
import TagEditModal from "components/Modals/TagEditModal";
import TagValuesModal from "components/Modals/TagValuesModal";
import AddTagModal from "components/Modals/AddTagModal";
import { AddTagDetails } from "types/AddTagDetails";
import { useAuth } from "context/AuthContext";
import RolesManagementTable from "components/Tables/RolesManagementTable";
import TagsManagementTable from "../components/Tables/TagsManagementTable";
import UsersManagementTable from "components/Tables/UsersManagementTable";
import EditUserModal from "components/Modals/EditUserModal";
import AddUserModal from "components/Modals/AddUserModal";
import { Container, Row } from "reactstrap";

interface UserOption {
  label: string;
  value: number;
}

const AdminPanel = () => {
  // Context Hooks
  const {
    roles,
    updateRole,
    tags,
    updateTag,
    users,
    createTag,
    deleteTag,
    deleteUser,
    addUser,
  } = useAdmin();
  const { userName } = useAuth();

  // State: Roles Management
  const [currentRolePage, setCurrentRolePage] = useState(1);
  const [roleModal, setRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const rolesPerPage = 5;
  const totalPages = Math.ceil((roles?.length || 0) / rolesPerPage);
  const indexOfLastRole = currentRolePage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = (roles || []).slice(indexOfFirstRole, indexOfLastRole);

  // State: Tags Management
  const [currentTagPage, setCurrentTagPage] = useState(1);
  const [tagEditModal, setTagEditModal] = useState(false);
  const [tagValuesModal, setTagValuesModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [editedTagValues, setEditedTagValues] = useState<string[]>([]);
  const [editedAssignedUsers, setEditedAssignedUsers] = useState<UserOption[]>(
    []
  );
  const [updatedTagValues, setUpdatedTagValues] = useState("");
  const totalTagParentPages = Math.ceil((tags?.length || 0) / ITEMS_PER_PAGE);
  const indexOfLastTag = currentTagPage * ITEMS_PER_PAGE;
  const indexOfFirstTag = indexOfLastTag - ITEMS_PER_PAGE;
  const currentTags = (tags || []).slice(indexOfFirstTag, indexOfLastTag);
  const [currentEditTagPage, setCurrentEditTagPage] = useState(1);

  // State: Users Management
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const totalUserPages = Math.ceil((users?.length || 0) / ITEMS_PER_PAGE);
  const indexOfLastUser = currentUserPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = (users || []).slice(indexOfFirstUser, indexOfLastUser);

  // State: Add Tag Modal
  const [addTagModal, setAddTagModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagValues, setTagValues] = useState<string[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<UserOption[]>([]);

  // State: Add User Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddUserModal = () => setAddUserModal(!addUserModal);

  // Derived User Options
  const userOptions = users.map((user: User) => ({
    value: user.userId,
    label: user.username,
  }));
  const filteredUserOptions = userOptions.filter(
    (option: UserOption) =>
      !editedAssignedUsers.some(
        (user: UserOption) => user.label === option.label
      )
  );

  // Utility Functions: Role Pagination
  const paginateRolesTable = (pageNumber: number) =>
    setCurrentRolePage(pageNumber);

  const getPermissions = (role_id: number) => {
    switch (role_id) {
      case 1:
        return "Full Access";
      case 2:
        return "File Upload, View Status";
      case 3:
        return "View Status Only";
      default:
        return "No Permissions";
    }
  };

  // Utility Functions: Users Managements
  const paginateUsersTable = (pageNumber: number) =>
    setCurrentUserPage(pageNumber);

  const handleDeleteUser = async (userId: number) => {
    await deleteUser(userId);
  };

  const handleAddUser = async (userDetails: User) => {
    const success = await addUser(userDetails, userDetails.createdByAdminEmail);

    if (success) {
      toggleAddUserModal();
    }
  };

  // Utility Functions: Tag Management
  const paginateTagsTable = (pageNumber: number) =>
    setCurrentTagPage(pageNumber);

  const openEditTagModal = (tag: Tag) => {
    const assignedUsers = tag.assignedUsers.map((user, key) => ({
      value: key,
      label: user,
    }));
    setSelectedTag(tag);
    setEditedTagName(tag.tagName || "Unnamed Tag");
    setEditedTagValues([...tag.tagValues]);
    setEditedAssignedUsers(assignedUsers.length ? assignedUsers : []);
    setCurrentEditTagPage(1);
    toggleEditTagModal();
  };

  const handleAddValue = () => {
    setEditedTagValues((prevValues: string[]) => {
      const newValues = [...prevValues, ""];
      const totalValues = newValues.length;
      const lastPage = Math.ceil(totalValues / ITEMS_PER_PAGE);
      setCurrentEditTagPage(lastPage);
      return newValues;
    });
  };

  const handleValueChange = (index: number, newValue: string) => {
    const correctIndex = (currentEditTagPage - 1) * ITEMS_PER_PAGE + index;
    const updatedValues = [...editedTagValues];
    updatedValues[correctIndex] = newValue;
    setEditedTagValues(updatedValues);
  };

  const handleAddNewTagValueChange = (index: number, newValue: string) => {
    const correctIndex = (currentEditTagPage - 1) * ITEMS_PER_PAGE + index;
    const updatedValues = [...tagValues];
    updatedValues[correctIndex] = newValue;
    setTagValues(updatedValues);
  };

  const handleAddNewTagValue = () => {
    const newValues = [...tagValues];
    newValues.push("");
    setTagValues(newValues);
  };

  const handleDeleteValue = (index: number) => {
    const correctIndex = (currentEditTagPage - 1) * ITEMS_PER_PAGE + index;
    const updatedValues = [...editedTagValues];
    updatedValues.splice(correctIndex, 1);
    setEditedTagValues(updatedValues);
  };

  const handleDeleteNewValue = (index: number) => {
    const correctIndex = (currentEditTagPage - 1) * ITEMS_PER_PAGE + index;
    const updatedValues = [...tagValues];
    updatedValues.splice(correctIndex, 1);
    setTagValues(updatedValues);
  };

  const handleDeleteOuterTag = (tag: Tag) => {
    deleteTag(tag.tagId);
  };

  const applyChangesToEditedTag = async () => {
    const assignedUsers = editedAssignedUsers.map(
      (user: UserOption) => user.label
    );

    const updatedTag = {
      ...selectedTag,
      tagName: editedTagName,
      tagValues: editedTagValues,
      updatedByAdminId: null,
      assignedUsers,
    };
    const success = await updateTag(updatedTag);
    if (success) {
      toggleEditTagModal();
    }
  };

  const applyChangesToCreatedTag = async () => {
    const tagDetails: AddTagDetails = {
      tagName: tagName,
      tagValues: tagValues,
      assignedUsers: assignedUsers.map((user) => user.label),
      adminUsername: userName,
    };

    const success = await createTag(tagDetails);

    if (success) {
      setTagName("");
      setTagValues([]);
      setAssignedUsers([]);
      toggleAddTagModal();
    }
  };

  // Modal Toggle Functions
  const toggleRoleModal = () => setRoleModal(!roleModal);
  const toggleTagValuesModal = () => setTagValuesModal(!tagValuesModal);
  const toggleEditTagModal = () => setTagEditModal(!tagEditModal);
  const toggleAddTagModal = () => setAddTagModal(!addTagModal);
  const toggleUserModal = () => setUserModal(!userModal);

  // Modal Open Functions
  const openEditRoleModal = (role: Role) => {
    setSelectedRole(role);
    toggleRoleModal();
  };

  const openTagValuesModal = (tag: Tag) => {
    setUpdatedTagValues(tag.tagValues.join("\n"));
    toggleTagValuesModal();
  };

  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    toggleUserModal();
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <RolesManagementTable
              roles={currentRoles}
              currentPage={currentRolePage}
              totalPages={totalPages}
              paginateRolesTable={paginateRolesTable}
              getPermissions={getPermissions}
              openEditRoleModal={openEditRoleModal}
            />
          </div>
        </Row>

        <RoleEditModal
          isOpen={roleModal}
          toggle={toggleRoleModal}
          selectedRole={selectedRole}
          updateRole={updateRole}
        />

        <TagEditModal
          isOpen={tagEditModal}
          toggle={toggleEditTagModal}
          editedTagName={editedTagName}
          setEditedTagName={setEditedTagName}
          editedTagValues={editedTagValues}
          setEditedTagValues={setEditedTagValues}
          editedAssignedUsers={editedAssignedUsers}
          setEditedAssignedUsers={setEditedAssignedUsers}
          filteredUserOptions={filteredUserOptions}
          currentEditTagPage={currentEditTagPage}
          setCurrentEditTagPage={setCurrentEditTagPage}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          handleValueChange={handleValueChange}
          handleDeleteValue={handleDeleteValue}
          handleAddValue={handleAddValue}
          applyChangesToEditedTag={applyChangesToEditedTag}
        />

        <TagValuesModal
          isOpen={tagValuesModal}
          toggle={toggleTagValuesModal}
          tagValues={updatedTagValues}
        />

        <EditUserModal
          isOpen={userModal}
          toggle={toggleUserModal}
          user={selectedUser}
          roles={roles}
          preSelectedTags={selectedUser?.assignedTags ?? []}
          tags={tags}
        />

        <AddUserModal
          isOpen={addUserModal}
          toggle={toggleAddUserModal}
          roles={roles}
          tags={tags}
          handleAddUser={handleAddUser}
        />

        {/* Add Tag Modal */}
        <AddTagModal
          isOpen={addTagModal}
          toggle={toggleAddTagModal}
          tagName={tagName}
          setTagName={setTagName}
          tagValues={tagValues}
          setTagValues={setTagValues}
          assignedUsers={assignedUsers}
          setAssignedUsers={setAssignedUsers}
          filteredUserOptions={userOptions}
          currentEditTagPage={currentEditTagPage}
          setCurrentEditTagPage={setCurrentEditTagPage}
          ITEMS_PER_PAGE={ITEMS_PER_PAGE}
          handleAddNewTagValueChange={handleAddNewTagValueChange}
          handleDeleteNewValue={handleDeleteNewValue}
          handleAddNewTagValue={handleAddNewTagValue}
          applyChangesToCreatedTag={applyChangesToCreatedTag}
        />

        <Row className="mt-5">
          <div className="col">
            <TagsManagementTable
              tags={currentTags}
              currentPage={currentTagPage}
              totalPages={totalTagParentPages}
              paginateTagsTable={paginateTagsTable}
              openEditTagModal={openEditTagModal}
              openTagValuesModal={openTagValuesModal}
              toggleAddTagModal={toggleAddTagModal}
              handleDeleteOuterTag={handleDeleteOuterTag}
            />
          </div>
        </Row>

        <Row className="mt-5">
          <div className="col">
            <UsersManagementTable
              users={currentUsers}
              currentPage={currentUserPage}
              totalPages={totalUserPages}
              paginateUsersTable={paginateUsersTable}
              openEditUserModal={openEditUserModal}
              handleDeleteUser={handleDeleteUser}
              toggleAddUserModal={toggleAddUserModal}
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AdminPanel;
