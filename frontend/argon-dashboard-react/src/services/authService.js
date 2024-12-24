import axios from "axios";

const API_URL = "http://localhost:5500/api/auth";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
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
};

export const forgetPassword = async (email, newPassword) => {
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
        error.response?.data?.message || "An error occurred. Please try again.",
    };
  }
};
