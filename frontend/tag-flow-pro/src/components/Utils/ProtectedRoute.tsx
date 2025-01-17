import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    toast.info("Please login first.", {
      position: "top-center",
      autoClose: 3000,
    });

    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
