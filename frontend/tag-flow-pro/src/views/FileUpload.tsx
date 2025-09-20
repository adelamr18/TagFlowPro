import React, { useState } from "react";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Input,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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

const SSN_REGEX = /^[123]\d{9}$/i;

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
  const [selectedPatientType, setSelectedPatientType] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [fileUploadedOn, setFileUploadedOn] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // NEW: modal state + invalid details
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [invalidSummary, setInvalidSummary] = useState<{
    count: number;
    examples: string[];
  }>({ count: 0, examples: [] });
  const [cleanWorkbookPayload, setCleanWorkbookPayload] = useState<{
    header: any[];
    validRows: any[][];
    originalName: string;
  } | null>(null);

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

  const availablePatientTypes = patientTypes.map((pt) => ({
    value: pt.patientTypeId.toString(),
    label: pt.name,
  }));

  const readFile = (file: File) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      const allowedTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(file.type)) {
        reject(new Error("Invalid file type. Please upload an Excel file."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        e.target?.result
          ? resolve(e.target.result as ArrayBuffer)
          : reject(new Error("Failed to read file."));
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });

  const validateAndPrepare = (wb: XLSX.WorkBook, originalName: string) => {
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
    });

    if (!rows.length) throw new Error("Excel sheet is empty.");
    const header = (rows[0] || []).map((h: any) =>
      typeof h === "string" ? h.trim() : h
    );
    const dataRows = rows.slice(1);

    // Find SSN col (case-insensitive, exact "SSN")
    const ssnIdx = header.findIndex(
      (h) => String(h || "").toLowerCase() === "ssn"
    );
    if (ssnIdx === -1)
      throw new Error("The Excel file must contain a column named 'SSN'.");

    const invalids: string[] = [];
    const validRows: any[][] = [];

    for (const r of dataRows) {
      const ssn = (r?.[ssnIdx] || "").toString().trim();
      if (!ssn || SSN_REGEX.test(ssn)) {
        validRows.push(r);
      } else {
        invalids.push(ssn);
      }
    }

    const summary = {
      count: invalids.length,
      examples: invalids.slice(0, 5),
    };

    setInvalidSummary(summary);
    setCleanWorkbookPayload({ header, validRows, originalName });
    return summary;
  };

  // NEW: build a new xlsx file with only valid rows and upload
  const uploadCleanedFile = async () => {
    if (!file || !cleanWorkbookPayload) return;

    const { header, validRows, originalName } = cleanWorkbookPayload;

    const newSheet = XLSX.utils.aoa_to_sheet([header, ...validRows]);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newSheet, "Sheet1");

    const outArray = XLSX.write(newWb, { type: "array", bookType: "xlsx" });
    const cleanName = originalName.toLowerCase().endsWith(".xlsx")
      ? originalName.replace(/\.xlsx$/i, ".cleaned.xlsx")
      : `${originalName}.cleaned.xlsx`;

    const cleanedFile = new File([outArray], cleanName, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    await actuallyUpload(cleanedFile);
    setShowInvalidModal(false);
    toast.success(
      `Uploaded cleaned file (removed ${invalidSummary.count} invalid row${
        invalidSummary.count === 1 ? "" : "s"
      }).`
    );
  };

  const actuallyUpload = async (uploadable: File) => {
    const data = await readFile(uploadable);
    const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const fileRowsCount = Math.max((sheetData.length || 1) - 1, 0);

    const selectedProjectId = parseInt(selectedProject!.value, 10);
    const selectedPatientTypeId = parseInt(selectedPatientType!.value, 10);

    const fileDetails: UploadFileDetails = {
      fileName: uploadable.name,
      fileStatus: UNPROCESSED_FILE_STATUS,
      fileRowsCount,
      selectedProjectId,
      selectedPatientTypeIds: [selectedPatientTypeId],
      uploadedByUserName: userName || "",
      isAdmin: parseInt(roleId || "0", 10) === ADMIN_ROLE_ID,
      userId,
      fileUploadedOn: new Date(fileUploadedOn),
    };

    await uploadFile(fileDetails, uploadable);
  };

  const handleFileUpload = async () => {
    try {
      if (!file) {
        toast.error("Please select a file to upload");
        return;
      }
      if (!selectedProject) {
        toast.error("Project is required.");
        return;
      }
      if (!selectedPatientType) {
        toast.error("Patient type is required.");
        return;
      }

      // read and pre-validate before sending to backend
      const data = await readFile(file);
      const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
      const summary = validateAndPrepare(workbook, file.name);

      if (summary.count > 0) {
        setShowInvalidModal(true);
        return;
      }

      await actuallyUpload(file);
      toast.success("File uploaded successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload file");
    }
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
                    onChange={(v) => setSelectedProject(v as any)}
                    value={selectedProject}
                    placeholder="Select Project..."
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Patient Type</strong>
                  </label>
                  <Select
                    options={availablePatientTypes}
                    onChange={(v) => setSelectedPatientType(v as any)}
                    value={selectedPatientType}
                    placeholder="Select Patient Type..."
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

      {/* Modal for invalid SSNs */}
      <Modal
        isOpen={showInvalidModal}
        toggle={() => setShowInvalidModal(false)}
      >
        <ModalHeader toggle={() => setShowInvalidModal(false)}>
          Invalid SSNs detected
        </ModalHeader>
        <ModalBody>
          The file you uploaded contains <strong>{invalidSummary.count}</strong>{" "}
          invalid SSN
          {invalidSummary.count === 1 ? "" : "s"}.<br />
          SSNs must be exactly 10 digits and start with 1, 2, or 3.
          {invalidSummary.examples.length > 0 && (
            <>
              <br />
              <div className="mt-2">
                <small>
                  Examples: {invalidSummary.examples.join(", ")}
                  {invalidSummary.count > invalidSummary.examples.length
                    ? "…"
                    : ""}
                </small>
              </div>
            </>
          )}
          <div className="mt-3">
            Would you like to remove those rows and upload the cleaned file?
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowInvalidModal(false)}>
            No
          </Button>
          <Button color="primary" onClick={uploadCleanedFile}>
            Yes, remove & upload
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default FileUpload;
