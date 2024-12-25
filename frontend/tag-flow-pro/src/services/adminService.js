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
};

export default adminService;
