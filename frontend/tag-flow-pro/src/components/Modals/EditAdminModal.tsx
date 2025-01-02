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
import { UpdateAdminDetails } from "types/UpdateAdminDetails";
import { Admin } from "types/Admin";

interface EditAdminModalProps {
  isOpen: boolean;
  toggle: () => void;
  admin: Admin | null;
  updatedBy: string;
  updateAdmin: (adminId: number, adminDetails: UpdateAdminDetails) => void;
}

const EditAdminModal: React.FC<EditAdminModalProps> = ({
  isOpen,
  toggle,
  admin,
  updatedBy,
  updateAdmin,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (admin) {
      setUsername(admin.username);
      setEmail(admin.email || "");
    }
  }, [admin]);

  const handleSubmit = () => {
    if (!admin) {
      return;
    }

    const adminDetails: UpdateAdminDetails = {
      username,
      email,
      updatedBy,
    };

    updateAdmin(admin.adminId, adminDetails);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Admin</ModalHeader>
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
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default EditAdminModal;
