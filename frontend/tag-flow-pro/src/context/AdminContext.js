import React, { createContext, useState, useEffect } from "react";
import adminService from "services/adminService";

const AdminContext = createContext({
  roles: [],
  fetchRoles: () => {},
});

export const AdminProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const data = await adminService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <AdminContext.Provider value={{ roles, fetchRoles }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return React.useContext(AdminContext);
};
