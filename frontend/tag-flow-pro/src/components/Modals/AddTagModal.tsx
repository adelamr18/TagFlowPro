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

interface AddTagModalProps {
  isOpen: boolean;
  toggle: () => void;
  tagName: string;
  setTagName: (name: string) => void;
  tagValues: string[];
  setTagValues: (values: string[]) => void;
  assignedUsers: { label: string; value: number }[];
  setAssignedUsers: (users: { label: string; value: number }[]) => void;
  filteredUserOptions: { label: string; value: number }[];
  currentEditTagPage: number;
  setCurrentEditTagPage: (page: number) => void;
  ITEMS_PER_PAGE: number;
  handleAddNewTagValueChange: (index: number, newValue: string) => void;
  handleDeleteNewValue: (index: number) => void;
  applyChangesToCreatedTag: () => void;
  handleAddNewTagValue: () => void;
}

const AddTagModal: React.FC<AddTagModalProps> = ({
  isOpen,
  toggle,
  tagName,
  setTagName,
  tagValues,
  setTagValues,
  assignedUsers,
  setAssignedUsers,
  filteredUserOptions,
  currentEditTagPage,
  ITEMS_PER_PAGE,
  handleAddNewTagValueChange,
  handleDeleteNewValue,
  applyChangesToCreatedTag,
  handleAddNewTagValue,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTagNameInvalid, setIsTagNameInvalid] = useState(false);
  const [isTagValuesInvalid, setIsTagValuesInvalid] = useState(false);

  const resetForm = useCallback(() => {
    setTagName("");
    setTagValues([""]);
    setAssignedUsers([]);
    setErrorMessage(null);
    setIsTagNameInvalid(false);
    setIsTagValuesInvalid(false);
  }, [setTagName, setTagValues, setAssignedUsers]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateInputs = () => {
    let isValid = true;

    if (!tagName.trim()) {
      setIsTagNameInvalid(true);
      setErrorMessage("Tag name cannot be empty.");
      isValid = false;
    } else {
      setIsTagNameInvalid(false);
    }

    if (tagValues.some((value) => !value.trim())) {
      setIsTagValuesInvalid(true);
      setErrorMessage("All tag values must be non-empty.");
      isValid = false;
    } else {
      setIsTagValuesInvalid(false);
    }

    if (isValid) {
      setErrorMessage(null);
    }

    return isValid;
  };

  const handleApplyChanges = () => {
    if (validateInputs()) {
      applyChangesToCreatedTag();
    }
  };

  const indexOfLastValue = currentEditTagPage * ITEMS_PER_PAGE;
  const indexOfFirstValue = indexOfLastValue - ITEMS_PER_PAGE;
  const currentValues = tagValues.slice(indexOfFirstValue, indexOfLastValue);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Tag</ModalHeader>
      <ModalBody>
        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        {/* Tag Name Input */}
        <div>
          <label>Tag Name</label>
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            invalid={isTagNameInvalid}
          />
        </div>

        {/* Tag Values Section */}
        <div className="mt-3">
          <label>Add Values</label>
          {currentValues.map((value, index) => (
            <div className="d-flex align-items-center mt-2" key={index}>
              <Input
                value={value}
                onChange={(e) =>
                  handleAddNewTagValueChange(index, e.target.value)
                }
                placeholder="Enter value"
                invalid={isTagValuesInvalid && !value.trim()}
              />
              <Button
                color="danger"
                className="ml-2"
                onClick={() => handleDeleteNewValue(index)}
              >
                Delete
              </Button>
            </div>
          ))}
          <div className="mt-3">
            <Button
              color="success"
              className="mt-2 w-100"
              onClick={handleAddNewTagValue}
            >
              Add New Value
            </Button>
          </div>
        </div>

        {/* Assigned Users Section */}
        <div className="mt-3">
          <label>Assigned Users</label>
          <Select
            isMulti
            name="users"
            options={filteredUserOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={assignedUsers}
            onChange={(selectedUsers) =>
              setAssignedUsers(
                Array.isArray(selectedUsers) ? [...selectedUsers] : []
              )
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

export default AddTagModal;
