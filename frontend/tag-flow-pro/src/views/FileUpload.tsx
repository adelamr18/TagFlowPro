import React, { useState } from "react";
import Select, { MultiValue } from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useAdmin } from "context/AdminContext.tsx";
import { useAuth } from "context/AuthContext";
import { User } from "types/User";
import { ADMIN_ROLE_ID, UNPROCESSED_FILE_STATUS } from "shared/consts";
import { useFile } from "context/FileContext";
import { UploadFileDetails } from "types/UploadFileDetails";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Project } from "types/Project";

const FileUpload: React.FC = () => {
  const { users, projects, patientTypes } = useAdmin();
  const { userEmail, roleId, userName, userId } = useAuth();
  const { uploadFile } = useFile();

  const currentUser = users.find(
    (user: User) => user.email.toLowerCase() === userEmail?.toLowerCase()
  );
  const currentUserId = currentUser?.userId || 0;

  const [file, setFile] = useState<File | null>(null);
  const [selectedProject, setSelectedProject] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedPatientTypes, setSelectedPatientTypes] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [fileUploadedOn, setFileUploadedOn] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const availableProjects =
    parseInt(roleId || "0", 10) === ADMIN_ROLE_ID
      ? projects.map((project: Project) => ({
          value: project.projectId.toString(),
          label: project.projectName,
        }))
      : projects
          .filter((project: Project) =>
            project.assignedUserIds.includes(currentUserId)
          )
          .map((project: Project) => ({
            value: project.projectId.toString(),
            label: project.projectName,
          }));

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const readFile = (file: File) =>
      new Promise<ArrayBuffer>((resolve, reject) => {
        const allowedTypes = [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Invalid file type. Please upload an Excel file.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as ArrayBuffer);
          } else {
            reject(new Error("Failed to read file."));
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });

    const data = await readFile(file);
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const fileRowsCount = sheetData.length - 1;
    const selectedProjectId = selectedProject
      ? parseInt(selectedProject.value, 10)
      : null;
    const selectedPatientTypesDetails = selectedPatientTypes.map((pt) =>
      parseInt(pt.value, 10)
    );
    const fileDetails: UploadFileDetails = {
      fileName: file.name,
      fileStatus: UNPROCESSED_FILE_STATUS,
      fileRowsCount,
      selectedProjectId,
      selectedPatientTypeIds: selectedPatientTypesDetails,
      uploadedByUserName: userName || "",
      isAdmin: parseInt(roleId || "0", 10) === ADMIN_ROLE_ID,
      userId,
      fileUploadedOn: new Date(fileUploadedOn),
    };
    await uploadFile(fileDetails, file);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8"></div>
      <Container className="mt--7">
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <Card className="shadow">
              <CardBody>
                <CardTitle tag="h3" className="text-center mb-4">
                  File Upload
                </CardTitle>
                <div className="mb-4">
                  <label htmlFor="fileInput" className="form-label">
                    <strong>Select File</strong>
                  </label>
                  <Input
                    type="file"
                    id="fileInput"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const selectedFile = e.target.files
                        ? e.target.files[0]
                        : null;
                      setFile(selectedFile);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Project</strong>
                  </label>
                  <Select
                    options={availableProjects}
                    onChange={(newValue) =>
                      setSelectedProject(
                        newValue as { value: string; label: string } | null
                      )
                    }
                    value={selectedProject}
                    placeholder="Select Project..."
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Patient Types</strong>
                  </label>
                  <Select
                    options={patientTypes.map((pt) => ({
                      value: pt.patientTypeId.toString(),
                      label: pt.name,
                    }))}
                    onChange={(newValue) => setSelectedPatientTypes(newValue)}
                    value={selectedPatientTypes}
                    placeholder="Select Patient Types..."
                    isMulti
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Upload Date</strong>
                  </label>
                  <Input
                    type="date"
                    value={fileUploadedOn}
                    onChange={(e) => setFileUploadedOn(e.target.value)}
                  />
                </div>
                <div className="text-center">
                  <Button color="primary" onClick={handleFileUpload}>
                    Upload Files
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FileUpload;
