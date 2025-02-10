import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Select from "react-select";
import { User } from "types/User";
import { Role } from "types/Role";
import { UpdateUserDetails } from "types/UpdateUserDetails";

interface EditUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: User | null;
  roles: Role[];
  preSelectedTags: string[];
  updateUser: (userId: number, userDetails: UpdateUserDetails) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  toggle,
  user,
  roles,
  updateUser,
}) => {
  const [username, setUsername] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const roleOptions = roles
    .filter((role) => role.roleId !== 1)
    .map((role) => ({
      value: role.roleId,
      label: role.roleName,
    }));

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setSelectedRoleId(user.roleId || null);
    }
  }, [user]);

  const handleRoleChange = (selectedOption: any) => {
    setSelectedRoleId(selectedOption ? selectedOption.value : null);
  };

  const handleSubmit = async () => {
    if (!user || !selectedRoleId) {
      return;
    }

    updateUser(user.userId, {
      username,
      roleId: selectedRoleId,
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit User</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="role">Role</Label>
            <Select
              id="role"
              value={roleOptions.find((role) => role.value === selectedRoleId)}
              options={roleOptions}
              onChange={handleRoleChange}
              placeholder="Select Role"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditUserModal;
