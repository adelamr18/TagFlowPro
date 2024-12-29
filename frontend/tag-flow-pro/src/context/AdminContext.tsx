import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import adminService from "../services/adminService";
import { toast } from "react-toastify";
import { Role } from "types/Role";
import { User } from "types/User";
import { Tag } from "types/Tag";
import { UpdateTagDetails } from "types/UpdateTagDetails";
import { AddTagDetails } from "types/AddTagDetails";

interface AdminContextType {
  roles: Role[];
  fetchRoles: () => void;
  updateRole: (roleId: number, newRoleName: string) => Promise<boolean>;
  tags: Tag[];
  fetchAllTags: () => void;
  createTag: (tagDetails: AddTagDetails) => Promise<boolean>;
  updateTag: (tagDetails: UpdateTagDetails) => Promise<boolean>;
  deleteTag: (tagId: number) => Promise<boolean>;
  editedTags: number[];
  setEditedTags: React.Dispatch<React.SetStateAction<number[]>>;
  users: User[];
  fetchAllUsers: () => void;
}

const AdminContext = createContext<AdminContextType>({
  roles: [],
  fetchRoles: () => {},
  updateRole: () => Promise.resolve(false),
  tags: [],
  fetchAllTags: () => {},
  createTag: () => Promise.resolve(false),
  updateTag: () => Promise.resolve(false),
  deleteTag: () => Promise.resolve(false),
  editedTags: [],
  setEditedTags: () => {},
  users: [],
  fetchAllUsers: () => {},
});

export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editedTags, setEditedTags] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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

  const createTag = async (tagDetails: AddTagDetails) => {
    const { success, message } = await adminService.createTag(tagDetails);

    if (success) {
      toast.success(message || "Tag created successfully!");

      await fetchAllTags();
    } else {
      toast.error(message || "Failed to create tag. Please try again.");
    }

    return success;
  };

  const fetchAllUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateTag = async (tagDetails: UpdateTagDetails) => {
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

  const deleteTag = async (tagId: number) => {
    const { success, message } = await adminService.deleteTag(tagId);

    if (success) {
      toast.success(message || "Tag deleted successfully!");

      setTags((prevTags) => prevTags.filter((tag) => tag.tagId !== tagId));
    } else {
      toast.error(message || "Failed to delete tag. Please try again.");
    }

    return success;
  };

  useEffect(() => {
    fetchRoles();
    fetchAllTags();
    fetchAllUsers();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        roles,
        fetchRoles,
        updateRole,
        fetchAllTags,
        createTag,
        tags,
        updateTag,
        deleteTag,
        editedTags,
        setEditedTags,
        users,
        fetchAllUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  return useContext(AdminContext);
};
