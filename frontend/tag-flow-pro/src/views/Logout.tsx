import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext.tsx";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    navigate("/auth/login");
  }, [logout, navigate]);

  return null;
};

export default Logout;