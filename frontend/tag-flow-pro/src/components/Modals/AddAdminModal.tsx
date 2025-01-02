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
import { useAuth } from "context/AuthContext";
import { AddAdminDetails } from "types/AddAdminDetails";
import { ADMIN_ROLE_ID } from "shared/consts";

interface AddAdminModalProps {
  isOpen: boolean;
  toggle: () => void;
  handleAddAdmin: (adminDetails: AddAdminDetails) => void;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  toggle,
  handleAddAdmin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const { adminEmail } = useAuth();

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

  const validateForm = () => {
    let isValid = true;

    if (!username || !password || !email) {
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

    handleAddAdmin({
      userName: username,
      password,
      email,
      roleId: ADMIN_ROLE_ID,
      createdBy: adminEmail,
    });

    resetForm();
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setEmail("");
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
      <ModalHeader toggle={toggle}>Add New Admin</ModalHeader>
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
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Add Admin
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddAdminModal;
