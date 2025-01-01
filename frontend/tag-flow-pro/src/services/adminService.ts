import axios from "axios";
import { Tag } from "types/Tag";
import { API_URL } from "shared/consts";
import { Role } from "types/Role";
import { User } from "types/User";
import { UpdateTagDetails } from "types/UpdateTagDetails";
import { AddTagDetails } from "types/AddTagDetails";
import { UpdateUserDetails } from "types/UpdateUserDetails";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

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
    newRoleName: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(`${MAIN_URL}/update-role`, {
        roleId,
        newRoleName,
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
    userCreateDto: User,
    createdByAdminEmail: string
  ): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.post(`${MAIN_URL}/add-user`, {
        ...userCreateDto,
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
};

export default adminService;
