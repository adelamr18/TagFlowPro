import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext.tsx";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(null);

    localStorage.removeItem("authToken");

    navigate("/auth/login");
  }, [setToken, navigate]);

  return null;
};

export default Logout;
