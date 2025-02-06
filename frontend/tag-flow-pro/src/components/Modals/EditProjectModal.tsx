import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "reactstrap";
import Select from "react-select";

interface ProjectEditModalProps {
  isOpen: boolean;
  toggle: () => void;
  editedProjectName: string;
  setEditedProjectName: (name: string) => void;
  editedAssignedUsers: { label: string; value: number }[];
  setEditedAssignedUsers: (users: { label: string; value: number }[]) => void;
  filteredUserOptions: { label: string; value: number }[];
  applyChangesToEditedProject: () => void;
}

const EditProjectModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  toggle,
  editedProjectName,
  setEditedProjectName,
  editedAssignedUsers,
  setEditedAssignedUsers,
  filteredUserOptions,
  applyChangesToEditedProject,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProjectNameInvalid, setIsProjectNameInvalid] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!editedProjectName.trim()) {
      setIsProjectNameInvalid(true);
      setErrorMessage("Project name cannot be empty.");
      isValid = false;
    } else {
      setIsProjectNameInvalid(false);
    }

    if (isValid) {
      setErrorMessage(null);
    }
    return isValid;
  };

  const handleApplyChanges = () => {
    if (validateInputs()) {
      applyChangesToEditedProject();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Project</ModalHeader>
      <ModalBody>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <div>
          <label>Project Name</label>
          <Input
            value={editedProjectName}
            onChange={(e) => setEditedProjectName(e.target.value)}
            placeholder="Enter project name"
            invalid={isProjectNameInvalid}
          />
        </div>

        <div className="mt-3">
          <label>Assign Users</label>
          <Select
            isMulti
            name="users"
            options={filteredUserOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={editedAssignedUsers}
            onChange={(selectedUsers) =>
              setEditedAssignedUsers(
                Array.isArray(selectedUsers) ? [...selectedUsers] : []
              )
            }
            placeholder={
              editedAssignedUsers.length === 0 ? "Select users..." : ""
            }
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleApplyChanges}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditProjectModal;
