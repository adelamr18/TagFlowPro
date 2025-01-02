import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  adminEmail: string | null;
  adminUsername: string | null;
  logout: () => boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  forgetPassword: (email: string, newPassword: string) => Promise<boolean>;
  currentRoleId: number;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  adminEmail: null,
  adminUsername: null,
  logout: () => false,
  login: async () => false,
  forgetPassword: async () => false,
  currentRoleId: null,
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
  const [adminUsername, setAdminUsername] = useState<string | null>(
    localStorage.getItem("userName")
  );
  const [currentRoleId, setCurrentRoleId] = useState(0);

  const logout = (): boolean => {
    setToken(null);
    setAdminEmail(null);
    setAdminUsername(null);

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
      const { success, token, message, userName, roleId } =
        await authService.login(email, password);

      if (success && token) {
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem("authToken", token);
        storage.setItem("userEmail", email);
        storage.setItem("userName", userName);

        setToken(token);
        setAdminEmail(email);
        setAdminUsername(userName);
        setCurrentRoleId(roleId);

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
      localStorage.setItem("userName", adminUsername || "");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
    }
  }, [token, adminEmail, adminUsername]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        adminEmail,
        adminUsername,
        logout,
        login,
        forgetPassword,
        currentRoleId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
