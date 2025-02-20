import axios from "axios";
import { API_URL } from "shared/consts";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  userName: string;
  roleId: number;
  userId: number;
}

interface AuthResponse {
  success: boolean;
  message: string;
}

const MAIN_URL = `${API_URL}/auth`;

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${MAIN_URL}/login`, {
        email,
        password,
      });
      return {
        success: true,
        message: response.data.message,
        token: response.data.token,
        userName: response.data.userName,
        roleId: response.data.roleId,
        userId: response.data.userId,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
        userName: "",
        roleId: 0,
        token: "",
        userId: 0,
      };
    }
  },

  forgetPassword: async (
    email: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${MAIN_URL}/forget-password`, {
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
