import React, { createContext, useState, useEffect } from "react";
import authService from "services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext({
  token: null,
  setToken: () => {},
  logout: () => {},
  forgetPassword: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  const forgetPassword = async (email, newPassword) => {
    const { success, message } = await authService.forgetPassword(
      email,
      newPassword
    );

    if (success) {
      toast.success(message || "Password reset successfully!");
    } else {
      toast.error(message || "Failed to reset password. Please try again.");
    }

    return success;
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, forgetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};
