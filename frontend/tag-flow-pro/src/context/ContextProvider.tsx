import { AuthProvider } from "./AuthContext.tsx";
import { AdminProvider } from "./AdminContext.tsx";

const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AdminProvider>{children}</AdminProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
