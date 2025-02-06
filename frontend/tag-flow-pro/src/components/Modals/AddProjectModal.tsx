import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "reactstrap";
import Select from "react-select";

interface AddProjectModalProps {
  isOpen: boolean;
  toggle: () => void;
  projectName: string;
  setProjectName: (name: string) => void;
  assignedUsers: { label: string; value: number }[];
  setAssignedUsers: (users: { label: string; value: number }[]) => void;
  filteredUserOptions: { label: string; value: number }[];
  applyChangesToCreatedProject: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  toggle,
  projectName,
  setProjectName,
  assignedUsers,
  setAssignedUsers,
  filteredUserOptions,
  applyChangesToCreatedProject,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProjectNameInvalid, setIsProjectNameInvalid] = useState(false);
  console.log(isOpen);

  const resetForm = useCallback(() => {
    setProjectName("");
    setAssignedUsers([]);
    setErrorMessage(null);
    setIsProjectNameInvalid(false);
  }, [setProjectName, setAssignedUsers]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateInputs = () => {
    let isValid = true;
    if (!projectName.trim()) {
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
      applyChangesToCreatedProject();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Project</ModalHeader>
      <ModalBody>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <div>
          <label>Project Name</label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            invalid={isProjectNameInvalid}
          />
        </div>
        <div className="mt-3">
          <label>Assigned Users</label>
          <Select
            isMulti
            name="users"
            options={filteredUserOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={assignedUsers}
            onChange={(selected) =>
              setAssignedUsers(Array.isArray(selected) ? selected : [])
            }
            placeholder={assignedUsers.length === 0 ? "Select users..." : ""}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleApplyChanges}>
          Save
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddProjectModal;
