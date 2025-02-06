import { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "reactstrap";

interface AddPatientTypeModalProps {
  isOpen: boolean;
  toggle: () => void;
  patientTypeName: string;
  setPatientTypeName: (name: string) => void;
  applyChangesToCreatedPatientType: () => void;
}

const AddPatientTypeModal: React.FC<AddPatientTypeModalProps> = ({
  isOpen,
  toggle,
  patientTypeName,
  setPatientTypeName,
  applyChangesToCreatedPatientType,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPatientTypeNameInvalid, setIsPatientTypeNameInvalid] =
    useState(false);

  const resetForm = useCallback(() => {
    setPatientTypeName("");
    setErrorMessage(null);
    setIsPatientTypeNameInvalid(false);
  }, [setPatientTypeName]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateInputs = () => {
    let isValid = true;
    if (!patientTypeName.trim()) {
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
      applyChangesToCreatedPatientType();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Patient Type</ModalHeader>
      <ModalBody>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <div>
          <label>Patient Type Name</label>
          <Input
            value={patientTypeName}
            onChange={(e) => setPatientTypeName(e.target.value)}
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
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddPatientTypeModal;
