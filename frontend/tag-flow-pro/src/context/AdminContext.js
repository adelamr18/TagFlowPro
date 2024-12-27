import React, { createContext, useState, useEffect } from "react";
import adminService from "services/adminService";
import { toast } from "react-toastify";

const AdminContext = createContext({
  roles: [],
  fetchRoles: () => {},
  updateRole: () => {},
  tags: [],
  fetchAllTags: () => {},
});

export const AdminProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [tags, setTags] = useState([]);

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

  const fetchAllTags = async () => {
    try {
      const data = await adminService.getAllTags();
      console.log("Fetched Tags:", data);
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAllTags();
  }, []);

  return (
    <AdminContext.Provider
      value={{ roles, fetchRoles, setRoles, updateRole, fetchAllTags, tags }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return React.useContext(AdminContext);
};
