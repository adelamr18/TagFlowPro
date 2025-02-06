import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import adminService from "../services/adminService";
import { toast } from "react-toastify";
import { Role } from "types/Role";
import { User } from "types/User";
import { Tag } from "types/Tag";
import { UpdateTagDetails } from "types/UpdateTagDetails";
import { AddTagDetails } from "types/AddTagDetails";
import { UpdateUserDetails } from "types/UpdateUserDetails";
import { Admin } from "types/Admin";
import { UpdateAdminDetails } from "types/UpdateAdminDetails";
import { AddAdminDetails } from "types/AddAdminDetails";

import { PatientType } from "types/PatientType";
import { PatientTypeCreate } from "types/PatientTypeCreate";
import { PatientTypeUpdate } from "types/PatientTypeUpdate";
import { ProjectCreate } from "types/ProjectCreate";
import { ProjectUpdate } from "types/ProjectUpdate";
import { Project } from "types/Project";

interface AdminContextType {
  roles: Role[];
  projects: Project[];
  patientTypes: PatientType[];
  fetchRoles: () => void;
  updateRole: (
    roleId: number,
    newRoleName: string,
    updatedBy: string
  ) => Promise<boolean>;
  tags: Tag[];
  fetchAllTags: () => void;
  createTag: (tagDetails: AddTagDetails) => Promise<boolean>;
  updateTag: (tagDetails: UpdateTagDetails) => Promise<boolean>;
  deleteTag: (tagId: number) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
  deleteAdmin: (adminId: number) => Promise<boolean>;
  updateUser: (
    userId: number,
    userDetails: UpdateUserDetails
  ) => Promise<boolean>;
  addUser: (
    userCreateDto: User,
    createdByAdminEmail: string
  ) => Promise<boolean>;
  editedTags: number[];
  setEditedTags: React.Dispatch<React.SetStateAction<number[]>>;
  users: User[];
  fetchAllUsers: () => void;
  updateUsers: (updatedUsers: User[]) => void;
  admins: Admin[];
  fetchAllAdmins: () => void;
  updateAdmin: (
    adminId: number,
    updateAdminDetails: UpdateAdminDetails
  ) => Promise<boolean>;
  addAdmin: (adminDetails: AddAdminDetails) => Promise<boolean>;
  fetchAllProjects: () => void;
  addProject: (project: ProjectCreate) => Promise<boolean>;
  updateProject: (project: ProjectUpdate) => Promise<boolean>;
  deleteProject: (projectId: number) => Promise<boolean>;
  fetchAllPatientTypes: () => void;
  addPatientType: (pt: PatientTypeCreate) => Promise<boolean>;
  updatePatientType: (pt: PatientTypeUpdate) => Promise<boolean>;
  deletePatientType: (patientTypeId: number) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  roles: [],
  fetchRoles: () => {},
  updateRole: () => Promise.resolve(false),
  tags: [],
  fetchAllTags: () => {},
  createTag: () => Promise.resolve(false),
  updateTag: () => Promise.resolve(false),
  deleteTag: () => Promise.resolve(false),
  deleteUser: () => Promise.resolve(false),
  updateUser: () => Promise.resolve(false),
  addUser: () => Promise.resolve(false),
  editedTags: [],
  setEditedTags: () => {},
  users: [],
  fetchAllUsers: () => {},
  updateUsers: () => {},
  admins: [],
  fetchAllAdmins: () => {},
  updateAdmin: () => Promise.resolve(false),
  addAdmin: () => Promise.resolve(false),
  deleteAdmin: () => Promise.resolve(false),
  fetchAllProjects: async () => [],
  addProject: () => Promise.resolve(false),
  updateProject: () => Promise.resolve(false),
  deleteProject: () => Promise.resolve(false),
  fetchAllPatientTypes: () => {},
  addPatientType: () => Promise.resolve(false),
  updatePatientType: () => Promise.resolve(false),
  deletePatientType: () => Promise.resolve(false),
  projects: [],
  patientTypes: [],
});

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editedTags, setEditedTags] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [patientTypes, setPatientTypes] = useState<PatientType[]>([]);

  const fetchRoles = async () => {
    try {
      const data = await adminService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const updateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
  };

  const updateRole = async (
    roleId: number,
    newRoleName: string,
    updatedBy: string
  ) => {
    const { success, message } = await adminService.updateRole(
      roleId,
      newRoleName,
      updatedBy
    );
    if (success) {
      toast.success(message || "Role updated successfully!");
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.roleId === roleId ? { ...role, roleName: newRoleName } : role
        )
      );
      fetchRoles();
    } else {
      toast.error(message || "Failed to update role. Please try again.");
    }
    return success;
  };

  const fetchAllTags = async () => {
    try {
      const data = await adminService.getAllTags();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const createTag = async (tagDetails: AddTagDetails) => {
    const { success, message } = await adminService.createTag(tagDetails);
    if (success) {
      toast.success(message || "Tag created successfully!");
      await fetchAllTags();
    } else {
      toast.error(message || "Failed to create tag. Please try again.");
    }
    return success;
  };

  const fetchAllUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateTag = async (tagDetails: UpdateTagDetails) => {
    try {
      setEditedTags((prevEditedTags) => [...prevEditedTags, tagDetails.tagId]);
      const { success, message } = await adminService.updateTag(tagDetails);
      if (success) {
        toast.success(message || "Tag updated successfully!");
        await fetchAllUsers();
        setTags((prevTags) =>
          prevTags.map((tag) =>
            tag.tagId === tagDetails.tagId ? { ...tag, ...tagDetails } : tag
          )
        );
        setEditedTags((prevEditedTags) =>
          prevEditedTags.filter((id) => id !== tagDetails.tagId)
        );
      } else {
        toast.error(message || "Failed to update tag. Please try again.");
      }
      return success;
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      setEditedTags((prevEditedTags) =>
        prevEditedTags.filter((id) => id !== tagDetails.tagId)
      );
      return false;
    }
  };

  const deleteTag = async (tagId: number) => {
    const { success, message } = await adminService.deleteTag(tagId);
    if (success) {
      toast.success(message || "Tag deleted successfully!");
      setTags((prevTags) => prevTags.filter((tag) => tag.tagId !== tagId));
    } else {
      toast.error(message || "Failed to delete tag. Please try again.");
    }
    return success;
  };

  const deleteUser = async (userId: number) => {
    const { success, message } = await adminService.deleteUser(userId);
    if (success) {
      toast.success(message || "User deleted successfully!");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
      await fetchAllTags();
    } else {
      toast.error(message || "Failed to delete user. Please try again.");
    }
    return success;
  };

  const updateUser = async (userId: number, userDetails: UpdateUserDetails) => {
    const { success, message } = await adminService.updateUser(
      userId,
      userDetails
    );
    if (success) {
      toast.success(message || "User updated successfully!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, ...userDetails } : user
        )
      );
      await Promise.all([fetchAllUsers(), fetchAllTags()]);
    } else {
      toast.error(message || "Failed to update user. Please try again.");
    }
    return success;
  };

  const addUser = async (userCreate: User, createdByAdminEmail: string) => {
    const { success, message } = await adminService.addUser(
      userCreate,
      createdByAdminEmail
    );
    if (success) {
      toast.success(message || "User created successfully!");
      await Promise.all([fetchAllUsers(), fetchAllTags()]);
    } else {
      toast.error(message || "Failed to create user. Please try again.");
    }
    return success;
  };

  const fetchAllAdmins = async () => {
    try {
      const data = await adminService.getAllAdmins();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const updateAdmin = async (
    adminId: number,
    updateAdminDetails: UpdateAdminDetails
  ) => {
    const { success, message } = await adminService.updateAdmin(
      adminId,
      updateAdminDetails
    );
    if (success) {
      toast.success(message || "Admin updated successfully!");
      await Promise.all([
        fetchAllUsers(),
        fetchAllTags(),
        fetchRoles(),
        fetchAllAdmins(),
      ]);
    } else {
      toast.error(message || "Failed to update admin. Please try again.");
    }
    return success;
  };

  const addAdmin = async (adminDetails: AddAdminDetails) => {
    const { success, message } = await adminService.addAdmin(adminDetails);
    if (success) {
      toast.success(message || "Admin created successfully!");
      await fetchAllAdmins();
    } else {
      toast.error(message || "Failed to create admin. Please try again.");
    }
    return success;
  };

  const deleteAdmin = async (adminId: number) => {
    const { success, message } = await adminService.deleteAdmin(adminId);
    if (success) {
      toast.success(message || "Admin deleted successfully!");
      await fetchAllAdmins();
    } else {
      toast.error(message || "Failed to delete admin. Please try again.");
    }
    return success;
  };

  const fetchAllProjects = async () => {
    try {
      const data = await adminService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  const addProject = async (project: ProjectCreate): Promise<boolean> => {
    const { success, message } = await adminService.addProject(project);
    try {
      if (success) {
        toast.success(message || "Project added successfully!");
        await fetchAllProjects();
      } else {
        toast.error(message || "Failed to add Project. Please try again.");
      }
    } catch (error) {
      return false;
    }
    return success;
  };

  const updateProject = async (project: ProjectUpdate): Promise<boolean> => {
    const { success, message } = await adminService.updateProject(project);
    try {
      if (success) {
        toast.success(message || "Project updated successfully!");
        await fetchAllProjects();
      } else {
        toast.error(message || "Failed to update Project. Please try again.");
      }
    } catch (error) {
      return false;
    }
    return success;
  };

  const deleteProject = async (projectId: number): Promise<boolean> => {
    try {
      const { success, message } = await adminService.deleteProject(projectId);
      if (success) {
        toast.success(message || "Project deleted successfully!");
        await fetchAllProjects();
      } else {
        toast.error(message || "Failed to delete Project. Please try again.");
      }
    } catch (error) {
      return false;
    }
  };

  const fetchAllPatientTypes = async () => {
    try {
      const patientTypes = await adminService.getAllPatientTypes();
      setPatientTypes(patientTypes);
    } catch (error) {
      console.error("Error fetching patient types:", error);
      throw error;
    }
  };

  const addPatientType = async (pt: PatientTypeCreate): Promise<boolean> => {
    const { success, message } = await adminService.addPatientType(pt);

    try {
      if (success) {
        toast.success(message || "Patient type added successfully!");
        await fetchAllPatientTypes();
      } else {
        toast.error(message || "Failed to add Project. Please try again.");
      }
    } catch (error) {
      return success;
    }
    return success;
  };

  const updatePatientType = async (pt: PatientTypeUpdate): Promise<boolean> => {
    const { success, message } = await adminService.updatePatientType(pt);
    try {
      if (success) {
        toast.success(message || "Patient type updated successfully!");
        await fetchAllPatientTypes();
      } else {
        toast.error(
          message || "Failed to update patient type. Please try again."
        );
      }
    } catch (error) {
      return false;
    }
    return success;
  };

  const deletePatientType = async (patientTypeId: number): Promise<boolean> => {
    try {
      const { success, message } = await adminService.deletePatientType(
        patientTypeId
      );
      if (success) {
        toast.success(message || "Patient type deleted successfully!");
        await fetchAllPatientTypes();
      } else {
        toast.error(
          message || "Failed to delete patient type. Please try again."
        );
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAllTags();
    fetchAllUsers();
    fetchAllAdmins();
    fetchAllPatientTypes();
    fetchAllProjects();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        roles,
        fetchRoles,
        updateRole,
        fetchAllTags,
        createTag,
        tags,
        updateTag,
        deleteTag,
        deleteUser,
        updateUser,
        addUser,
        editedTags,
        setEditedTags,
        users,
        fetchAllUsers,
        updateUsers,
        fetchAllAdmins,
        admins,
        projects,
        updateAdmin,
        addAdmin,
        deleteAdmin,
        fetchAllProjects,
        addProject,
        updateProject,
        deleteProject,
        patientTypes,
        fetchAllPatientTypes,
        addPatientType,
        updatePatientType,
        deletePatientType,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
