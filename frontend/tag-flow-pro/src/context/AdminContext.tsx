import React, { createContext, useState, useEffect, ReactNode } from "react";
import adminService from "../services/adminService";
import { toast } from "react-toastify";

interface Role {
  roleId: number;
  roleName: string;
  createdAt: string;
  createdBy: string | null;
}

interface Tag {
  tagId: number;
  tagName: string;
  tagValues: string[];
  assignedUsers: string[];
  createdByEmail: string;
  createdByUserName: string;
}

interface TagUpdateDetails {
  tagId: number;
  tagName: string;
  description?: string;
  tagValues: string[];
  updatedByAdminId: number | null;
}

interface AdminContextType {
  roles: Role[];
  fetchRoles: () => void;
  updateRole: (roleId: number, newRoleName: string) => Promise<boolean>;
  tags: Tag[];
  fetchAllTags: () => void;
  updateTag: (tagDetails: TagUpdateDetails) => Promise<boolean>;
  editedTags: number[];
  setEditedTags: React.Dispatch<React.SetStateAction<number[]>>;
}

const AdminContext = createContext<AdminContextType>({
  roles: [],
  fetchRoles: () => {},
  updateRole: () => Promise.resolve(false),
  tags: [],
  fetchAllTags: () => {},
  updateTag: () => Promise.resolve(false),
  editedTags: [],
  setEditedTags: () => {},
});

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editedTags, setEditedTags] = useState<number[]>([]);

  const fetchRoles = async () => {
    try {
      const data = await adminService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const updateRole = async (roleId: number, newRoleName: string) => {
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
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const updateTag = async (tagDetails: TagUpdateDetails) => {
    try {
      setEditedTags((prevEditedTags) => [...prevEditedTags, tagDetails.tagId]);

      const { success, message } = await adminService.updateTag(tagDetails);

      if (success) {
        toast.success(message || "Tag updated successfully!");

        setTags((prevTags) =>
          prevTags.map((tag) =>
            tag.tagId === tagDetails.tagId ? { ...tag, ...tagDetails } : tag
          )
        );

        setEditedTags((prevEditedTags) =>
          prevEditedTags.filter((id) => id !== tagDetails.tagId)
        );
      } else {
        toast.error(message || "Failed to update tag. Please try again.");
      }

      return success;
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");

      setEditedTags((prevEditedTags) =>
        prevEditedTags.filter((id) => id !== tagDetails.tagId)
      );

      return false;
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAllTags();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        roles,
        fetchRoles,
        updateRole,
        fetchAllTags,
        tags,
        updateTag,
        editedTags,
        setEditedTags,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return React.useContext(AdminContext);
};
