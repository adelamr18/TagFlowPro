import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  adminEmail: string | null;
  userName: string | null;
  logout: () => boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  forgetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  adminEmail: null,
  userName: null,
  logout: () => false,
  login: async () => false,
  forgetPassword: async () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [adminEmail, setAdminEmail] = useState<string | null>(
    localStorage.getItem("userEmail")
  );
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  const logout = (): boolean => {
    setToken(null);
    setAdminEmail(null);
    setUserName(null);

    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");

    toast.success("Logged out successfully!");
    return true;
  };

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    try {
      const { success, token, message, userName } = await authService.login(
        email,
        password
      );

      if (success && token) {
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("authToken", token);
        storage.setItem("userEmail", email);
        storage.setItem("userName", userName);

        setToken(token);
        setAdminEmail(email);
        setUserName(userName);

        toast.success(message || "Login successful!");
        return true;
      } else {
        toast.error(message || "Login failed. Please try again.");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
  };

  const forgetPassword = async (
    email: string,
    newPassword: string
  ): Promise<boolean> => {
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

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", adminEmail || "");
      localStorage.setItem("userName", userName || "");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    }
  }, [token, adminEmail, userName]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        adminEmail,
        userName,
        logout,
        login,
        forgetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
