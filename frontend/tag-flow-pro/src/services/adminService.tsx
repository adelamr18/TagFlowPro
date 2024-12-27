import axios from "axios";
import { API_URL } from "shared/consts";

interface Role {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  values: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface TagDetails {
  tagId: number;
  tagName: string;
  tagValues: string[];
}

const MAIN_URL = `${API_URL}/admin`;

const adminService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-roles`);
      return response.data.roles; // Assuming the response contains a "roles" field
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
      return response.data.tags; // Assuming the response contains a "tags" field
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  // Update a tag's details (name and values)
  updateTag: async (tagDetails: TagDetails): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.put(`${MAIN_URL}/update-tag`, {
        tagId: tagDetails.tagId,
        tagName: tagDetails.tagName,
        tagValues: tagDetails.tagValues,
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
};

export default adminService;
