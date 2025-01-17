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
import { Tag } from "types/Tag";
import { User } from "types/User";
import { ADMIN_ROLE_ID, UNPROCESSED_FILE_STATUS } from "shared/consts";
import { useFile } from "context/FileContext";
import { UploadFileDetails } from "types/UploadFileDetails";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const FileUpload: React.FC = () => {
  const { tags, users } = useAdmin();
  const { userEmail, roleId, userName } = useAuth();
  const { uploadFile } = useFile();

  const currentUser = users.find(
    (user: User) => user.email.toLowerCase() === userEmail.toLowerCase()
  );
  const userId = currentUser?.userId || 0;

  const [file, setFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedValues, setSelectedValues] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);

  const availableTags =
    parseInt(roleId, 10) === ADMIN_ROLE_ID
      ? tags.map((tag: Tag) => ({
          value: tag.tagId.toString(),
          label: tag.tagName,
        }))
      : tags
          .filter((tag: Tag) => tag.assignedUserIds.includes(userId))
          .map((tag: Tag) => ({
            value: tag.tagId.toString(),
            label: tag.tagName,
          }));

  const availableTagValues = availableTags.flatMap((tag) => {
    const tagObj = tags.find((t) => t.tagId.toString() === tag.value);
    return tagObj
      ? tagObj.tagValues.map((value, index) => ({
          value: tagObj.tagValuesIds[index].toString(),
          label: value,
        }))
      : [];
  });

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

    const selectedTagsDetails = selectedTags.map((tag) => {
      const tagId = parseInt(tag.value, 10);
      const tagData = tags.find((t) => t.tagId === tagId);
      const tagValuesIds = selectedValues
        .filter((value) =>
          tagData?.tagValuesIds.includes(parseInt(value.value, 10))
        )
        .map((value) => parseInt(value.value, 10));
      return { tagId, tagValuesIds };
    });

    const fileDetails: UploadFileDetails = {
      fileName: file.name,
      fileStatus: UNPROCESSED_FILE_STATUS,
      fileRowsCount,
      selectedTags: selectedTagsDetails,
      uploadedByUserName: userName,
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
                      setFile(selectedFile); // Set only the first file
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Tags</strong>
                  </label>
                  <Select
                    isMulti
                    options={availableTags}
                    onChange={(newValue) => {
                      setSelectedTags(newValue);
                    }}
                    value={selectedTags}
                    placeholder="Select Tags..."
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <strong>Select Tag Values</strong>
                  </label>
                  <Select
                    isMulti
                    options={availableTagValues}
                    onChange={(newValue) => setSelectedValues(newValue)}
                    value={selectedValues}
                    placeholder="Select Values..."
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
