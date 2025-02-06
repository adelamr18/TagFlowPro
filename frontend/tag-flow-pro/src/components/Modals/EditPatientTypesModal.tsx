import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "reactstrap";

interface EditPatientTypeModalProps {
  isOpen: boolean;
  toggle: () => void;
  editedPatientTypeName: string;
  setEditedPatientTypeName: (name: string) => void;
  applyChangesToEditedPatientType: () => void;
}

const EditPatientTypeModal: React.FC<EditPatientTypeModalProps> = ({
  isOpen,
  toggle,
  editedPatientTypeName,
  setEditedPatientTypeName,
  applyChangesToEditedPatientType,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPatientTypeNameInvalid, setIsPatientTypeNameInvalid] =
    useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!editedPatientTypeName.trim()) {
      setIsPatientTypeNameInvalid(true);
      setErrorMessage("Patient type name cannot be empty.");
      isValid = false;
    } else {
      setIsPatientTypeNameInvalid(false);
    }

    if (isValid) {
      setErrorMessage(null);
    }
    return isValid;
  };

  const handleApplyChanges = () => {
    if (validateInputs()) {
      applyChangesToEditedPatientType();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Patient Type</ModalHeader>
      <ModalBody>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <div>
          <label>Patient Type Name</label>
          <Input
            value={editedPatientTypeName}
            onChange={(e) => setEditedPatientTypeName(e.target.value)}
            placeholder="Enter patient type name"
            invalid={isPatientTypeNameInvalid}
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

export default EditPatientTypeModal;
