import React, { createContext, useState, useEffect } from "react";
import adminService from "services/adminService";
import { toast } from "react-toastify";

const AdminContext = createContext({
  roles: [],
  fetchRoles: () => {},
  updateRole: () => {},
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

  const updateRole = async (roleId, newRoleName) => {
    const { success, message } = await adminService.updateRole(
      roleId,
      newRoleName
    );

    if (success) {
      toast.success(message || "Role updated successfully!");

      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.roleId === roleId ? { ...role, roleName: newRoleName } : role
        )
      );
    } else {
      toast.error(message || "Failed to update role. Please try again.");
    }

    return success;
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <AdminContext.Provider value={{ roles, fetchRoles, setRoles, updateRole }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return React.useContext(AdminContext);
};
