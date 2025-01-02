import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";

interface RoleEditModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedRole: { roleId: number; roleName: string } | null;
  updateRole: (roleId: number, roleName: string) => void;
}

const RoleEditModal: React.FC<RoleEditModalProps> = ({
  isOpen,
  toggle,
  selectedRole,
  updateRole,
}) => {
  const [updatedRoleName, setUpdatedRoleName] = useState<string>("");

  useEffect(() => {
    setUpdatedRoleName(selectedRole?.roleName || "");
  }, [selectedRole]);

  const handleSaveRole = async () => {
    if (!updatedRoleName.trim()) {
      toast.error("Role name cannot be empty.");
      return;
    }

    if (selectedRole) {
      updateRole(selectedRole.roleId, updatedRoleName);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Role</ModalHeader>
      <ModalBody>
        <label htmlFor="roleName">Role Name</label>
        <Input
          id="roleName"
          value={updatedRoleName}
          onChange={(e) => setUpdatedRoleName(e.target.value)}
          placeholder="Enter role name"
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSaveRole}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RoleEditModal;
