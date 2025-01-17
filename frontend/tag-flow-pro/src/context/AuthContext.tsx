import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";
import { toast } from "react-toastify";

interface AuthContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userEmail: string | null;
  userName: string | null;
  logout: () => boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  forgetPassword: (email: string, newPassword: string) => Promise<boolean>;
  roleId: string;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  userEmail: null,
  userName: null,
  logout: () => false,
  login: async () => false,
  forgetPassword: async () => false,
  roleId: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("userEmail")
  );
  const [userName, setUsername] = useState<string | null>(
    localStorage.getItem("userName")
  );
  const [roleId, setRoleId] = useState<string | null>(
    localStorage.getItem("roleId")
  );

  const logout = (): boolean => {
    setToken(null);
    setUserEmail(null);
    setUsername(null);

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
        storage.setItem("roleId", roleId.toString());

        setToken(token);
        setUserEmail(email);
        setUsername(userName);
        setRoleId(roleId.toString());

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
      localStorage.setItem("userEmail", userEmail || "");
      localStorage.setItem("userName", userName || "");
      localStorage.setItem("roleId", roleId || "");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("roleId");
    }
  }, [token, userEmail, userName, roleId]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userEmail,
        userName,
        logout,
        login,
        forgetPassword,
        roleId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
