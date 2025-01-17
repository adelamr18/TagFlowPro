import { AuthProvider } from "./AuthContext.tsx";
import { AdminProvider } from "./AdminContext.tsx";
import { FileProvider } from "./FileContext.tsx";

const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AdminProvider>
        <FileProvider>{children}</FileProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default ContextProvider;
