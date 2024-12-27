import React, { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  forgetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logout: () => {},
  forgetPassword: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

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

  const forgetPassword = async (email: string, newPassword: string) => {
    try {
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
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
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
