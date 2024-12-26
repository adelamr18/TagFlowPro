import axios from "axios";
import { API_URL } from "shared/consts";

const MAIN_URL = `${API_URL}/admin`;

const adminService = {
  getAllRoles: async () => {
    try {
      const response = await axios.get(`${MAIN_URL}/get-all-roles`);
      return response.data.roles;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  updateRole: async (roleId, newRoleName) => {
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
};

export default adminService;
