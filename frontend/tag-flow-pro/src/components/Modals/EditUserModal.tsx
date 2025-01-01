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
import { Tag } from "types/Tag";
import { useAdmin } from "context/AdminContext";

interface EditUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: User | null;
  roles: Role[];
  tags: Tag[];
  preSelectedTags: string[];
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  toggle,
  user,
  roles,
  tags,
  preSelectedTags,
}) => {
  const [username, setUsername] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { updateUser } = useAdmin();

  const tagOptions = tags.map((tag) => ({
    value: tag.tagId,
    label: tag.tagName,
  }));

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

      const initialSelectedTags = tags.filter((tag) =>
        preSelectedTags.includes(tag.tagName)
      );
      setSelectedTags(initialSelectedTags);
    }
  }, [user, preSelectedTags, tags]);

  const handleRoleChange = (selectedOption: any) => {
    setSelectedRoleId(selectedOption ? selectedOption.value : null);
  };

  const handleTagsChange = (selectedOptions: any) => {
    setSelectedTags(
      selectedOptions
        ? selectedOptions.map((option: any) =>
            tags.find((tag) => tag.tagId === option.value)
          )
        : []
    );
  };

  const handleSubmit = async () => {
    if (!user || !selectedRoleId) {
      return;
    }

    const success = await updateUser(user.userId, {
      username,
      roleId: selectedRoleId,
      assignedTagIds: selectedTags.map((tag) => tag.tagId),
    });

    if (success) {
      toggle();
    }
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
          <FormGroup>
            <Label for="tags">Tags</Label>
            <Select
              id="tags"
              value={selectedTags.map((tag) =>
                tagOptions.find((option) => option.value === tag.tagId)
              )}
              options={tagOptions}
              isMulti
              onChange={handleTagsChange}
              placeholder="Select Tags"
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
