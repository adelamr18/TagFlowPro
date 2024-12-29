import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Select from "react-select";

interface TagEditModalProps {
  isOpen: boolean;
  toggle: () => void;
  editedTagName: string;
  setEditedTagName: (name: string) => void;
  editedTagValues: string[];
  setEditedTagValues: (values: string[]) => void;
  editedAssignedUsers: { label: string; value: number }[];
  setEditedAssignedUsers: (users: { label: string; value: number }[]) => void;
  filteredUserOptions: { label: string; value: number }[];
  currentEditTagPage: number;
  setCurrentEditTagPage: (page: number) => void;
  ITEMS_PER_PAGE: number;
  handleValueChange: (index: number, newValue: string) => void;
  handleDeleteValue: (index: number) => void;
  handleAddValue: () => void;
  applyChangesToEditedTag: () => void;
}

const TagEditModal: React.FC<TagEditModalProps> = ({
  isOpen,
  toggle,
  editedTagName,
  setEditedTagName,
  editedTagValues,
  setEditedTagValues,
  editedAssignedUsers,
  setEditedAssignedUsers,
  filteredUserOptions,
  currentEditTagPage,
  setCurrentEditTagPage,
  ITEMS_PER_PAGE,
  handleValueChange,
  handleDeleteValue,
  applyChangesToEditedTag,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTagNameInvalid, setIsTagNameInvalid] = useState(false);
  const [isTagValuesInvalid, setIsTagValuesInvalid] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    // Validate tag name
    if (!editedTagName.trim()) {
      setIsTagNameInvalid(true);
      setErrorMessage("Tag name cannot be empty.");
      isValid = false;
    } else {
      setIsTagNameInvalid(false);
    }

    // Validate tag values
    if (editedTagValues.some((value) => !value.trim())) {
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
      applyChangesToEditedTag();
    }
  };

  const filteredValues = editedTagValues;
  const totalTagPages = Math.ceil(filteredValues.length / ITEMS_PER_PAGE);

  const indexOfLastValue = currentEditTagPage * ITEMS_PER_PAGE;
  const indexOfFirstValue = indexOfLastValue - ITEMS_PER_PAGE;
  const currentValues = editedTagValues.slice(
    indexOfFirstValue,
    indexOfLastValue
  );

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Edit Tag</ModalHeader>
      <ModalBody>
        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        {/* Tag Name Input */}
        <div>
          <label>Tag Name</label>
          <Input
            value={editedTagName}
            onChange={(e) => setEditedTagName(e.target.value)}
            placeholder="Enter tag name"
            invalid={isTagNameInvalid}
          />
        </div>

        {/* Multi-selection Dropdown for Assigned Users */}
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

        {/* Tag Values Section */}
        <div className="mt-3">
          <label>Tag Values</label>
          {currentValues.map((value, index) => (
            <div className="d-flex align-items-center mt-2" key={index}>
              <Input
                value={value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder="Enter value"
                invalid={isTagValuesInvalid && !value.trim()}
              />
              <Button
                color="danger"
                className="ml-2"
                onClick={() => handleDeleteValue(index)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredValues.length > ITEMS_PER_PAGE && (
          <Pagination className="mt-3">
            <PaginationItem disabled={currentEditTagPage === 1}>
              <PaginationLink
                previous
                onClick={() => setCurrentEditTagPage(currentEditTagPage - 1)}
              />
            </PaginationItem>
            {Array.from({ length: totalTagPages }, (_, index) => (
              <PaginationItem
                key={index}
                active={currentEditTagPage === index + 1}
              >
                <PaginationLink
                  onClick={() => setCurrentEditTagPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem disabled={currentEditTagPage === totalTagPages}>
              <PaginationLink
                next
                onClick={() => setCurrentEditTagPage(currentEditTagPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        )}

        {/* Add New Value */}
        <Button
          color="success"
          className="mt-3"
          onClick={() => setEditedTagValues([...editedTagValues, ""])}
        >
          Add New Value
        </Button>
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

export default TagEditModal;
