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
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { Tag } from "types/Tag";
import { Role } from "types/Role";
import { User } from "types/User";
import { useAuth } from "context/AuthContext";

interface AddUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  roles: Role[];
  tags: Tag[];
  handleAddUser: (userDetails: User) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  toggle,
  roles,
  tags,
  handleAddUser,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [assignedTags, setAssignedTags] = useState<number[]>([]);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const { userEmail } = useAuth();

  const roleOptions = roles
    .filter((role) => role.roleId !== 1)
    .map((role) => ({
      value: role.roleId,
      label: role.roleName,
    }));

  const tagOptions = tags.map((tag) => ({
    value: tag.tagId,
    label: tag.tagName,
  }));

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{9,}$/;

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);

    if (value.trim() === "") {
      setIsEmailInvalid(true);
      setEmailErrorMessage("Email is required.");
    } else if (!emailRegex.test(value)) {
      setIsEmailInvalid(true);
      setEmailErrorMessage("Please enter a valid email address.");
    } else {
      setIsEmailInvalid(false);
      setEmailErrorMessage("");
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);

    if (value.trim() === "") {
      setIsPasswordInvalid(true);
      setPasswordErrorMessage("Password is required.");
    } else if (!passwordRegex.test(value)) {
      setIsPasswordInvalid(true);
      setPasswordErrorMessage(
        "Password must be at least 9 characters long, start with a capital letter, and include numbers and special characters."
      );
    } else {
      setIsPasswordInvalid(false);
      setPasswordErrorMessage("");
    }
  };

  const handleRoleChange = (selectedOption: any) => {
    setSelectedRoleId(selectedOption ? selectedOption.value : null);
  };

  const handleTagChange = (selectedOptions: any) => {
    setAssignedTags(selectedOptions.map((option: any) => option.value));
  };

  const validateForm = () => {
    let isValid = true;

    if (!username || !password || !email || !selectedRoleId) {
      setFormErrorMessage("All fields must be non-empty.");
      isValid = false;
    } else {
      setFormErrorMessage(null);
    }

    if (isEmailInvalid || isPasswordInvalid) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    handleAddUser({
      username,
      password,
      email,
      roleId: selectedRoleId,
      assignedTagIds: assignedTags,
      createdByAdminEmail: userEmail,
    });

    toggle();
    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setSelectedRoleId(null);
    setAssignedTags([]);
    setFormErrorMessage(null);
    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New User</ModalHeader>
      <ModalBody>
        {formErrorMessage && (
          <div className="alert alert-danger">{formErrorMessage}</div>
        )}

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
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              invalid={isPasswordInvalid}
            />
            {isPasswordInvalid && (
              <FormFeedback>{passwordErrorMessage}</FormFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              invalid={isEmailInvalid}
            />
            {isEmailInvalid && <FormFeedback>{emailErrorMessage}</FormFeedback>}
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
              isMulti
              value={tagOptions.filter((tag) =>
                assignedTags.includes(tag.value)
              )}
              options={tagOptions}
              onChange={handleTagChange}
              placeholder="Assign Tags"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Add User
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddUserModal;
