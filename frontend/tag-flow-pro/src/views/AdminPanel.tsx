import Header from "components/Headers/Header.tsx";
import { useState } from "react";
import { useAdmin } from "context/AdminContext.tsx";
import { User } from "types/User";
import { Role } from "types/Role";
import {
  ADMINS_TABLE_TYPE,
  ITEMS_PER_PAGE,
  PATIENT_TYPES_TABLE_TYPE,
  PROJECTS_TABLE_TYPE,
  USERS_TABLE_TYPE,
} from "shared/consts";
import RoleEditModal from "components/Modals/RoleEditModal";
import { useAuth } from "context/AuthContext";
import RolesManagementTable from "components/Tables/RolesManagementTable";
import UsersManagementTable from "components/Tables/UsersManagementTable";
import EditUserModal from "components/Modals/EditUserModal";
import AddUserModal from "components/Modals/AddUserModal";
import { Container, Row } from "reactstrap";
import { UpdateUserDetails } from "types/UpdateUserDetails";
import AdminsManagementTable from "../components/Tables/AdminsManagementTable";
import { Admin } from "types/Admin";
import EditAdminModal from "components/Modals/EditAdminModal";
import { UpdateAdminDetails } from "types/UpdateAdminDetails";
import AddAdminModal from "components/Modals/AddAdminModal";
import { AddAdminDetails } from "types/AddAdminDetails";
import ProjectsManagementTable from "components/Tables/ProjectsManagementTable";
import { Project } from "types/Project";
import AddProjectModal from "components/Modals/AddProjectModal";
import EditProjectModal from "components/Modals/EditProjectModal";
import { PatientType } from "types/PatientType";
import PatientTypesManagementTable from "components/Tables/PatientTypesManagementTable";
import AddPatientTypeModal from "components/Modals/AddPatientTypeModal";
import EditPatientTypeModal from "components/Modals/EditPatientTypesModal";

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
    users,
    deleteUser,
    addUser,
    updateUser,
    admins,
    updateAdmin,
    addAdmin,
    deleteAdmin,
    projects,
    deleteProject,
    addProject,
    updateProject,
    updatePatientType,
    addPatientType,
    deletePatientType,
    patientTypes,
  } = useAdmin();
  const { userEmail } = useAuth();

  // Utility functions: Tables Management
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [projectSearchTerm, setProjectSearchTerm] = useState("");

  // State: Roles Management
  const [currentRolePage, setCurrentRolePage] = useState(1);
  const [roleModal, setRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const rolesPerPage = 5;
  const totalPages = Math.ceil((roles?.length || 0) / rolesPerPage);
  const indexOfLastRole = currentRolePage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = (roles || []).slice(indexOfFirstRole, indexOfLastRole);

  // State: Projects Management
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const filteredProjects = (projects || []).filter((project) =>
    project.projectName.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );
  const projectsPerPage = 5;
  const totalProjectPages = Math.ceil(
    (filteredProjects?.length || 0) / ITEMS_PER_PAGE
  );
  const indexOfLastProject = currentProjectPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // State for Patient Types Management
  const [patientTypeSearchTerm, setPatientTypeSearchTerm] = useState("");
  const [currentPatientTypePage, setCurrentPatientTypePage] = useState(1);

  // State: Users Management
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const filteredUsers = (users || []).filter(
    (admin) =>
      admin.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );
  const totalUserPages = Math.ceil(
    (filteredUsers?.length || 0) / ITEMS_PER_PAGE
  );
  const indexOfLastUser = currentUserPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // State: Admins Management
  const [currentAdminPage, setCurrentAdminPage] = useState(1);
  const filteredAdmins = (admins || []).filter(
    (admin) =>
      admin.username.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );
  const totalAdminPages = Math.ceil(
    (filteredAdmins.length || 0) / ITEMS_PER_PAGE
  );
  const indexOfLastAdmin = currentAdminPage * ITEMS_PER_PAGE;
  const indexOfFirstAdmin = indexOfLastAdmin - ITEMS_PER_PAGE;
  const currentAdmins = filteredAdmins.slice(
    indexOfFirstAdmin,
    indexOfLastAdmin
  );

  // State: Add User Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const toggleAddUserModal = () => setAddUserModal(!addUserModal);

  // State: Edit Admin Modal
  const [editAdminModal, setEditAdminModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  // State: Add Admin Modal
  const [addAdminModal, setAddAdminModal] = useState(false);

  // Derived User Options
  const userOptions = users.map((user: User) => ({
    value: user.userId,
    label: user.username,
  }));

  // State: Add Project Modal
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [assignedProjectUsers, setAssignedProjectUsers] = useState<
    UserOption[]
  >([]);

  // ***** NEW: State for Add Patient Type Modal *****
  const [patientTypeName, setPatientTypeName] = useState("");
  const [addPatientTypeModal, setAddPatientTypeModal] = useState(false);

  // State for Edit Project Modal
  const [editProjectModal, setEditProjectModal] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [editedAssignedProjectUsers, setEditedAssignedProjectUsers] = useState<
    UserOption[]
  >([]);

  // State for Edit Patient Type Modal
  const [editPatientTypeModal, setEditPatientTypeModal] = useState(false);
  const [selectedPatientType, setSelectedPatientType] =
    useState<PatientType | null>(null);

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
  const handleUpdateRole = async (roleId: number, roleName: string) => {
    const success = await updateRole(selectedRole!.roleId, roleName, userEmail);
    if (success) {
      toggleRoleModal();
    }
  };

  // Utility Functions: Users Management
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
  const handleUpdateUser = async (
    userId: number,
    userDetails: UpdateUserDetails
  ) => {
    const userDetailsUpdated = { ...userDetails, updatedBy: userEmail };
    const success = await updateUser(userId, userDetailsUpdated);
    if (success) {
      toggleUserModal();
    }
  };

  // Utility Functions: Projects Management
  const paginateProjectsTable = (pageNumber: number) =>
    setCurrentProjectPage(pageNumber);
  const handleDeleteProject = async (project: Project) => {
    await deleteProject(project.projectId);
  };

  const applyChangesToEditedProject = async () => {
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        projectName: editedProjectName,
        assignedUserIds: editedAssignedProjectUsers.map((user) => user.value),
        updatedBy: userEmail,
      };
      const success = await updateProject(updatedProject);
      if (success) {
        toggleEditProjectModal();
      }
    }
  };

  // Utility Functions: Patient Types Management
  const filteredPatientTypes = (patientTypes || []).filter((pt: PatientType) =>
    pt.name.toLowerCase().includes(patientTypeSearchTerm.toLowerCase())
  );
  const patientTypesPerPage = 5;
  const totalPatientTypePages = Math.ceil(
    (filteredPatientTypes?.length || 0) / ITEMS_PER_PAGE
  );
  const indexOfLastPatientType = currentPatientTypePage * patientTypesPerPage;
  const indexOfFirstPatientType = indexOfLastPatientType - patientTypesPerPage;
  const currentPatientTypes = filteredPatientTypes.slice(
    indexOfFirstPatientType,
    indexOfLastPatientType
  );

  const paginatePatientTypesTable = (pageNumber: number) =>
    setCurrentPatientTypePage(pageNumber);
  const toggleAddPatientTypeModal = () =>
    setAddPatientTypeModal(!addPatientTypeModal);
  const toggleEditPatientTypeModal = () =>
    setEditPatientTypeModal(!editPatientTypeModal);
  const openEditPatientTypeModal = (pt: PatientType) => {
    setSelectedPatientType(pt);
    toggleEditPatientTypeModal();
  };
  const handleDeletePatientType = async (pt: PatientType) => {
    await deletePatientType(pt.patientTypeId);
  };

  const applyChangesToCreatedProject = async () => {
    const projectDetails = {
      projectName,
      createdByAdminEmail: userEmail,
      assignedUserIds: assignedProjectUsers.map((user) => user.value),
    };
    const success = await addProject(projectDetails);
    if (success) {
      setAddProjectModal(false);
    }
  };

  const applyChangesToCreatedPatientType = async () => {
    const patientTypeDetails = {
      name: patientTypeName,
      createdByAdminEmail: userEmail,
    };
    const success = await addPatientType(patientTypeDetails);
    console.log(success);
    if (success) {
      toggleAddPatientTypeModal();
      setAddPatientTypeModal(false);
    }
  };

  // Utility Functions: Admins Management
  const paginateAdminsTable = (pageNumber: number) =>
    setCurrentAdminPage(pageNumber);
  const handleDeleteAdmin = async (adminId: number) => {
    await deleteAdmin(adminId);
  };
  const handleUpdateAdmin = async (
    adminId: number,
    updateAdminDetails: UpdateAdminDetails
  ) => {
    const success = await updateAdmin(adminId, updateAdminDetails);
    if (success) {
      toggleEditAdminModal();
    }
  };
  const handleAddAdmin = async (adminDetails: AddAdminDetails) => {
    const success = await addAdmin(adminDetails);
    if (success) {
      toggleAddAdminModal();
    }
  };

  const handleOnSearchTable = (searchValue: string, tableType: string) => {
    if (tableType === ADMINS_TABLE_TYPE) {
      setAdminSearchTerm(searchValue.toLowerCase());
      setCurrentAdminPage(1);
    }
    if (tableType === USERS_TABLE_TYPE) {
      setUserSearchTerm(searchValue.toLowerCase());
      setCurrentUserPage(1);
    }

    if (tableType === PROJECTS_TABLE_TYPE) {
      setProjectSearchTerm(searchValue.toLowerCase());
      setCurrentProjectPage(1);
    }
    if (tableType === PATIENT_TYPES_TABLE_TYPE) {
      setPatientTypeSearchTerm(searchValue.toLowerCase());
      setCurrentPatientTypePage(1);
    }
  };

  // Modal Toggle Functions
  const toggleRoleModal = () => setRoleModal(!roleModal);
  const toggleUserModal = () => setUserModal(!userModal);
  const toggleAddProjectModal = () => setAddProjectModal(!addProjectModal);
  const toggleEditProjectModal = () => setEditProjectModal(!editProjectModal);
  const toggleEditAdminModal = () => setEditAdminModal(!editAdminModal);
  const toggleAddAdminModal = () => setAddAdminModal(!addAdminModal);

  // Modal Open Functions
  const openEditRoleModal = (role: Role) => {
    setSelectedRole(role);
    toggleRoleModal();
  };

  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    toggleUserModal();
  };
  const openEditAdminModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    toggleEditAdminModal();
  };

  const openEditProjectModal = (project: Project) => {
    setSelectedProject(project);
    setEditedProjectName(project.projectName);

    const assignedUsersOptions = userOptions.filter((userOption) =>
      project.assignedUserIds?.includes(userOption.value)
    );
    setEditedAssignedProjectUsers(assignedUsersOptions);
    toggleEditProjectModal();
  };

  const setEditedPatientTypeName = (name: string) => {
    if (selectedPatientType) {
      setSelectedPatientType({ ...selectedPatientType, name });
    }
  };

  const applyEditedPatientTypeChanges = async () => {
    if (selectedPatientType) {
      const success = await updatePatientType({
        ...selectedPatientType,
        updatedBy: userEmail,
      });
      if (success) {
        toggleEditPatientTypeModal();
      }
    }
  };

  return (
    <>
      <Header canShowDashboard={false} />
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
          updateRole={handleUpdateRole}
        />

        <EditAdminModal
          isOpen={editAdminModal}
          toggle={toggleEditAdminModal}
          admin={selectedAdmin}
          updatedBy={userEmail}
          updateAdmin={handleUpdateAdmin}
        />

        <EditUserModal
          isOpen={userModal}
          toggle={toggleUserModal}
          user={selectedUser}
          roles={roles}
          preSelectedTags={selectedUser?.assignedTags ?? []}
          updateUser={handleUpdateUser}
        />

        <AddUserModal
          isOpen={addUserModal}
          toggle={toggleAddUserModal}
          roles={roles}
          tags={tags}
          handleAddUser={handleAddUser}
        />

        <AddAdminModal
          isOpen={addAdminModal}
          toggle={toggleAddAdminModal}
          handleAddAdmin={handleAddAdmin}
        />

        <AddProjectModal
          isOpen={addProjectModal}
          toggle={toggleAddProjectModal}
          projectName={projectName}
          setProjectName={setProjectName}
          assignedUsers={assignedProjectUsers}
          setAssignedUsers={setAssignedProjectUsers}
          filteredUserOptions={userOptions}
          applyChangesToCreatedProject={applyChangesToCreatedProject}
        />

        <AddPatientTypeModal
          isOpen={addPatientTypeModal}
          toggle={toggleAddPatientTypeModal}
          patientTypeName={patientTypeName}
          setPatientTypeName={setPatientTypeName}
          applyChangesToCreatedPatientType={applyChangesToCreatedPatientType}
        />

        <EditProjectModal
          isOpen={editProjectModal}
          toggle={toggleEditProjectModal}
          editedProjectName={editedProjectName}
          setEditedProjectName={setEditedProjectName}
          editedAssignedUsers={editedAssignedProjectUsers}
          setEditedAssignedUsers={setEditedAssignedProjectUsers}
          filteredUserOptions={userOptions}
          applyChangesToEditedProject={applyChangesToEditedProject}
        />

        <EditPatientTypeModal
          isOpen={editPatientTypeModal}
          toggle={toggleEditPatientTypeModal}
          editedPatientTypeName={
            selectedPatientType ? selectedPatientType.name : ""
          }
          setEditedPatientTypeName={setEditedPatientTypeName}
          applyChangesToEditedPatientType={applyEditedPatientTypeChanges}
        />

        <Row className="mt-5">
          <div className="col">
            <ProjectsManagementTable
              projects={currentProjects}
              currentPage={currentProjectPage}
              totalPages={totalProjectPages}
              paginateProjectsTable={paginateProjectsTable}
              openEditProjectModal={openEditProjectModal}
              toggleAddProjectModal={toggleAddProjectModal}
              handleDeleteProject={handleDeleteProject}
              onSearch={(searchValue) =>
                handleOnSearchTable(searchValue, PROJECTS_TABLE_TYPE)
              }
            />
          </div>
        </Row>

        <Row className="mt-5">
          <div className="col">
            <PatientTypesManagementTable
              patientTypes={currentPatientTypes}
              currentPage={currentPatientTypePage}
              totalPages={totalPatientTypePages}
              paginatePatientTypesTable={paginatePatientTypesTable}
              openEditPatientTypeModal={openEditPatientTypeModal}
              toggleAddPatientTypeModal={toggleAddPatientTypeModal}
              handleDeletePatientType={handleDeletePatientType}
              onSearch={(searchValue) =>
                handleOnSearchTable(searchValue, PATIENT_TYPES_TABLE_TYPE)
              }
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
              onSearch={(searchValue) =>
                handleOnSearchTable(searchValue, USERS_TABLE_TYPE)
              }
            />
          </div>
        </Row>

        <Row className="mt-5">
          <div className="col">
            <AdminsManagementTable
              admins={currentAdmins}
              currentPage={currentAdminPage}
              totalPages={totalAdminPages}
              paginateAdminsTable={paginateAdminsTable}
              openEditAdminModal={openEditAdminModal}
              handleDeleteAdmin={handleDeleteAdmin}
              toggleAddAdminModal={toggleAddAdminModal}
              currentAdminEmail={userEmail}
              onSearch={(searchValue) =>
                handleOnSearchTable(searchValue, ADMINS_TABLE_TYPE)
              }
            />
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AdminPanel;
