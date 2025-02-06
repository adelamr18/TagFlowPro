import axios from "axios";
import { Tag } from "types/Tag";
import { API_URL } from "shared/consts";
import { Role } from "types/Role";
import { User } from "types/User";
import { UpdateTagDetails } from "types/UpdateTagDetails";
import { AddTagDetails } from "types/AddTagDetails";
import { UpdateUserDetails } from "types/UpdateUserDetails";
import { Admin } from "types/Admin";
import { UpdateAdminDetails } from "types/UpdateAdminDetails";
import { AddAdminDetails } from "types/AddAdminDetails";
import { ApiResponse } from "types/ApiResponse";
import { PatientTypeCreate } from "types/PatientTypeCreate";
import { PatientTypeUpdate } from "types/PatientTypeUpdate";
import { ProjectCreate } from "types/ProjectCreate";
import { ProjectUpdate } from "types/ProjectUpdate";
import { Project } from "types/Project";
import { PatientType } from "types/PatientType";

const MAIN_URL = `${API_URL}/admin`;

const adminService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-roles`);
      return response.data.roles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  updateRole: async (
    roleId: number,
    newRoleName: string,
    updatedBy: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(`${MAIN_URL}/update-role`, {
        roleId,
        newRoleName,
        updatedBy,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },

  getAllTags: async (): Promise<Tag[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-tags`);
      return response.data.tags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  getAllAdmins: async (): Promise<Admin[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-admins`);
      return response.data.admins;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    }
  },

  updateTag: async (
    tagDetails: UpdateTagDetails
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(`${MAIN_URL}/update-tag`, {
        tagId: tagDetails.tagId,
        tagName: tagDetails.tagName,
        tagValues: tagDetails.tagValues,
        assignedUsers: tagDetails.assignedUsers,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-users`);
      return response.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  createTag: async (tagDetails: AddTagDetails): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(`${MAIN_URL}/create-tag`, {
        tagName: tagDetails.tagName,
        tagValues: tagDetails.tagValues,
        assignedUsers: tagDetails.assignedUsers,
        adminUsername: tagDetails.adminUsername,
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      };
    }
  },

  deleteTag: async (tagId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${MAIN_URL}/delete-tag/${tagId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the tag.",
      };
    }
  },

  deleteUser: async (userId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${MAIN_URL}/delete-user/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the user.",
      };
    }
  },

  updateUser: async (
    userId: number,
    userDetails: UpdateUserDetails
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(
        `${MAIN_URL}/update-user/${userId}`,
        userDetails
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while updating the user.",
      };
    }
  },

  addUser: async (
    userCreate: User,
    createdByAdminEmail: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(`${MAIN_URL}/add-user`, {
        ...userCreate,
        createdByAdminEmail,
      });
      if (response.data.success) {
        return { success: true, message: "User created successfully." };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to create user.",
        };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while creating the user.",
      };
    }
  },

  updateAdmin: async (
    adminId: number,
    adminDetails: UpdateAdminDetails
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(
        `${MAIN_URL}/update-admin/${adminId}`,
        adminDetails
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while updating the admin.",
      };
    }
  },

  addAdmin: async (
    adminDetails: AddAdminDetails
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(`${MAIN_URL}/add-admin`, adminDetails);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while creating the admin.",
      };
    }
  },

  deleteAdmin: async (adminId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/delete-admin/${adminId}`
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the admin.",
      };
    }
  },

  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-projects`);
      return response.data.projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  addProject: async (project: ProjectCreate): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(`${MAIN_URL}/add-project`, project);
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while adding the project.",
      };
    }
  },

  updateProject: async (project: ProjectUpdate): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(`${MAIN_URL}/update-project`, project);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while updating the project.",
      };
    }
  },

  deleteProject: async (projectId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/delete-project/${projectId}`
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the project.",
      };
    }
  },

  getAllPatientTypes: async (): Promise<PatientType[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-patient-types`);
      return response.data.patientTypes;
    } catch (error) {
      console.error("Error fetching patient types:", error);
      throw error;
    }
  },

  addPatientType: async (
    patientType: PatientTypeCreate
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(
        `${MAIN_URL}/add-patient-type`,
        patientType
      );
      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while adding the patient type.",
      };
    }
  },

  updatePatientType: async (
    patientType: PatientTypeUpdate
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(
        `${MAIN_URL}/update-patient-type`,
        patientType
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while updating the patient type.",
      };
    }
  },

  deletePatientType: async (
    patientTypeId: number
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(
        `${MAIN_URL}/delete-patient-type/${patientTypeId}`
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the patient type.",
      };
    }
  },
};

export default adminService;
