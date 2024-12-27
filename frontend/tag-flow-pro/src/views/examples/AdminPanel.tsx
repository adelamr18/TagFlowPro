import {
  Card,
  CardHeader,
  CardFooter,
  Table,
  Container,
  Row,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import Header from "components/Headers/Header.tsx";
import React, { useState } from "react";
import { useAdmin } from "context/AdminContext.tsx";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const { roles, updateRole, tags, updateTag } = useAdmin();
  const [currentRolePage, setCurrentRolePage] = useState(1);
  const [currentEditTagPage, setCurrentEditTagPage] = useState(1);
  const [roleModal, setRoleModal] = useState(false);
  const [tagValuesModal, setTagValuesModal] = useState(false);
  const [tagEditModal, setTagEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [updatedRoleName, setUpdatedRoleName] = useState("");
  const [updatedTagValues, setUpdatedTagValues] = useState("");

  const rolesPerPage = 5;
  const totalPages = Math.ceil((roles?.length || 0) / rolesPerPage);
  const indexOfLastRole = currentRolePage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = (roles || []).slice(indexOfFirstRole, indexOfLastRole);

  const [selectedTag, setSelectedTag] = useState(null);
  const [editedTagName, setEditedTagName] = useState("");
  const [editedTagDescription, setEditedTagDescription] = useState("");
  const [editedTagValues, setEditedTagValues] = useState([]);
  const [searchTerm] = useState("");
  const valuesPerPage = 5;

  const paginateRolesTable = (pageNumber) => setCurrentRolePage(pageNumber);

  const openEditTagModal = (tag) => {
    setSelectedTag(tag);
    setEditedTagName(tag.tagName || "Unnamed Tag");
    setEditedTagDescription(tag.description || "No description provided.");
    setEditedTagValues([...tag.tagValues]);
    setCurrentEditTagPage(1);
    toggleEditTagModal();
  };

  const handleAddValue = () => {
    setEditedTagValues((prevValues) => {
      const newValues = [...prevValues, ""];
      const totalValues = newValues.length;
      const lastPage = Math.ceil(totalValues / valuesPerPage);

      setCurrentEditTagPage(lastPage);

      return newValues;
    });
  };

  const handleValueChange = (index, newValue) => {
    const correctIndex = (currentEditTagPage - 1) * valuesPerPage + index;
    const updatedValues = [...editedTagValues];

    updatedValues[correctIndex] = newValue;
    setEditedTagValues(updatedValues);
  };

  const applyChanges = async () => {
    const updatedTag = {
      ...selectedTag,
      tagName: editedTagName,
      description: editedTagDescription,
      tagValues: editedTagValues,
    };
    const success = await updateTag(updatedTag);

    if (success) {
      toggleEditTagModal();
    }
  };

  const handleDeleteValue = (index) => {
    const correctIndex = (currentEditTagPage - 1) * valuesPerPage + index;
    const updatedValues = [...editedTagValues];
    updatedValues.splice(correctIndex, 1);
    setEditedTagValues(updatedValues);
  };

  const getPermissions = (role_id) => {
    switch (role_id) {
      case 1:
        return "Full Access";
      case 2:
        return "File Upload, View Status";
      case 3:
        return "View Status Only";
      default:
        return "No Permissions";
    }
  };

  const toggleRoleModal = () => setRoleModal(!roleModal);
  const toggleTagValuesModal = () => setTagValuesModal(!tagValuesModal);
  const toggleEditTagModal = () => setTagEditModal(!tagEditModal);

  const openEditRoleModal = (role) => {
    setSelectedRole(role);
    setUpdatedRoleName(role.roleName);
    toggleRoleModal();
  };

  const openTagValuesModal = (tag) => {
    setUpdatedTagValues(tag.tagValues.join("\n"));
    toggleTagValuesModal();
  };

  const handleSaveRole = async () => {
    if (!updatedRoleName.trim()) {
      toast.error("Role name cannot be empty.");
      return;
    }

    const success = await updateRole(selectedRole.roleId, updatedRoleName);

    if (success) {
      toggleRoleModal();
    }
  };

  const filteredValues = searchTerm
    ? editedTagValues.filter((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : editedTagValues;
  const totalTagPages = Math.ceil(filteredValues.length / valuesPerPage);

  const indexOfLastValue = currentEditTagPage * valuesPerPage;
  const indexOfFirstValue = indexOfLastValue - valuesPerPage;
  const currentValues = editedTagValues.slice(
    indexOfFirstValue,
    indexOfLastValue
  );

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Roles Management</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Role Name</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Permissions</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoles.map((role, index) => (
                    <tr key={index}>
                      <th scope="row">{role.roleName}</th>
                      <td>{role.createdBy}</td>
                      <td>{getPermissions(role.roleId)}</td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => openEditRoleModal(role)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem
                      className={currentRolePage === 1 ? "disabled" : ""}
                    >
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginateRolesTable(currentRolePage - 1);
                        }}
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem
                        key={index}
                        className={
                          currentRolePage === index + 1 ? "active" : ""
                        }
                      >
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            paginateRolesTable(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      className={
                        currentRolePage === totalPages ? "disabled" : ""
                      }
                    >
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => {
                          e.preventDefault();
                          paginateRolesTable(currentRolePage + 1);
                        }}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>

        <Modal isOpen={roleModal} toggle={toggleRoleModal}>
          <ModalHeader toggle={toggleRoleModal}>Edit Role</ModalHeader>
          <ModalBody>
            <label htmlFor="roleName">Role Name</label>
            <Input
              id="roleName"
              value={updatedRoleName}
              onChange={(e) => setUpdatedRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSaveRole}>
              Save
            </Button>
            <Button color="secondary" onClick={toggleRoleModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {/* Tag Edit Modal */}
        <Modal isOpen={tagEditModal} toggle={toggleEditTagModal}>
          <ModalHeader toggle={toggleEditTagModal}>Edit Tag</ModalHeader>
          <ModalBody>
            <div>
              <label>Tag Name</label>
              <Input
                value={editedTagName}
                onChange={(e) => setEditedTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="mt-3">
              <label>Tag Values</label>
              {currentValues.map((value, index) => (
                <div className="d-flex align-items-center mt-2" key={index}>
                  <Input
                    value={value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
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
            {filteredValues.length > valuesPerPage && (
              <Pagination className="mt-3">
                {/* Previous Page Button */}
                <PaginationItem disabled={currentEditTagPage === 1}>
                  <PaginationLink
                    previous
                    onClick={() =>
                      setCurrentEditTagPage(currentEditTagPage - 1)
                    }
                  />
                </PaginationItem>

                {/* Page Number Buttons */}
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

                {/* Next Page Button */}
                <PaginationItem disabled={currentEditTagPage === totalTagPages}>
                  <PaginationLink
                    next
                    onClick={() =>
                      setCurrentEditTagPage(currentEditTagPage + 1)
                    }
                  />
                </PaginationItem>
              </Pagination>
            )}

            {/* Add New Value */}
            <Button color="success" className="mt-3" onClick={handleAddValue}>
              Add New Value
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={applyChanges}>
              Apply Changes
            </Button>
            <Button color="secondary" onClick={toggleEditTagModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={tagValuesModal} toggle={toggleTagValuesModal}>
          <ModalHeader toggle={toggleTagValuesModal}>Tag Values</ModalHeader>
          <ModalBody>
            <div
              id="tagValues"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {updatedTagValues.split("\n").map((value, index) => (
                <ul key={index}>
                  <li>{value}</li>
                </ul>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleTagValuesModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Row className="mt-5">
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Tags Management</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Tag Name</th>
                    <th scope="col">Tag Values</th>
                    <th scope="col">Assigned Users</th>
                    <th scope="col">Created By UserName</th>
                    <th scope="col">Created By Email</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags && tags.length > 0 ? (
                    tags.map((tag, index) => {
                      const {
                        tagName,
                        tagValues = [],
                        assignedUsers = [],
                        createdByUserName = "N/A",
                        createdByEmail = "N/A",
                      } = tag;

                      return (
                        <tr key={index}>
                          <th scope="row">{tagName || "Unnamed Tag"}</th>
                          <td>
                            {tagValues.length > 3 ? (
                              <>
                                {tagValues.slice(0, 3).join(", ")}{" "}
                                <Button
                                  color="link"
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => openTagValuesModal(tag)}
                                >
                                  +{tagValues.length - 3} more
                                </Button>
                              </>
                            ) : (
                              tagValues.join(", ")
                            )}
                          </td>
                          <td>
                            {Array.isArray(assignedUsers) &&
                            assignedUsers.length > 0 ? (
                              assignedUsers.join(", ")
                            ) : (
                              <span>No assigned users</span>
                            )}
                          </td>
                          <td>{createdByUserName}</td>
                          <td>{createdByEmail}</td>
                          <td>
                            <Button
                              onClick={() => openEditTagModal(tag)}
                              color="primary"
                            >
                              Edit
                            </Button>
                            <Button color="danger">Delete</Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No tags found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AdminPanel;
