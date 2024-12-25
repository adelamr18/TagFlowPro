import axios from "axios";
import { API_URL } from "shared/consts";

const MAIN_URL = `${API_URL}/auth`;

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${MAIN_URL}/login`, {
        email,
        password,
      });
      return {
        success: true,
        message: response.data.message,
        token: response.data.token,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  },

  forgetPassword: async (email, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/forget-password`, {
        email,
        newPassword,
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

export default authService;
