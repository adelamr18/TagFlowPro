import { useAdmin } from "context/AdminContext";
import { useAuth } from "context/AuthContext";
import { useFile } from "context/FileContext";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  CardTitle,
} from "reactstrap";
import Select from "react-select";
import { ADMIN_ROLE_ID, OPERATOR_ROLE_ID, VIEWER_ROLE_ID } from "shared/consts";
import { useState, useEffect, useCallback } from "react";
import "./Header.css";
import { OverviewDto } from "types/OverviewDto";

interface HeaderProps {
  onOverviewUpdate?: (overview: OverviewDto) => void;
  canShowDashboard?: boolean;
}

const Header = ({ onOverviewUpdate, canShowDashboard = true }: HeaderProps) => {
  const { userName, roleId, userId } = useAuth();
  const { projects, patientTypes } = useAdmin();
  const { getOverview } = useFile();
  const [overview, setOverview] = useState<OverviewDto | null>(null);

  const [fromDate, setFromDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const availableProjects = [ADMIN_ROLE_ID, OPERATOR_ROLE_ID].includes(
    parseInt(roleId || "0")
  )
    ? [
        { value: "all", label: "All" },
        ...projects.map((project) => ({
          value: project.projectId,
          label: project.projectName,
        })),
      ]
    : projects
        .filter((project) => project.assignedUserIds.includes(userId))
        .map((project) => ({
          value: project.projectId,
          label: project.projectName,
        }));

  const [selectedProject, setSelectedProject] = useState<any>(
    availableProjects[0]
  );
  const [selectedPatientType, setSelectedPatientType] = useState<string>("all");

  const isAdminOrOperator = [ADMIN_ROLE_ID, OPERATOR_ROLE_ID].includes(
    parseInt(roleId || "0")
  );

  const fetchOverview = useCallback(() => {
    const projectParam = isAdminOrOperator
      ? selectedProject &&
        selectedProject.value.toString().trim().toLowerCase() === "all"
        ? ""
        : selectedProject?.label || ""
      : selectedProject?.label || "";
    const patientParam =
      selectedPatientType.trim().toLowerCase() === "all"
        ? ""
        : selectedPatientType;
    if (fromDate && toDate) {
      getOverview(fromDate, toDate, projectParam, patientParam).then((data) => {
        if (data && onOverviewUpdate) {
          setOverview(data);
          onOverviewUpdate(data);
        }
      });
    }
  }, [
    fromDate,
    toDate,
    selectedProject,
    selectedPatientType,
    getOverview,
    onOverviewUpdate,
    isAdminOrOperator,
  ]);

  useEffect(() => {
    fetchOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, selectedProject, selectedPatientType]);

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        {canShowDashboard && (
          <>
            {userName &&
              [ADMIN_ROLE_ID, OPERATOR_ROLE_ID].includes(
                parseInt(roleId || "0")
              ) && (
                <Row className="mb-4 text-white">
                  <Col lg="12">
                    <label
                      className="form-label"
                      style={{ color: "white", fontWeight: "bold" }}
                    >
                      Select Project Name:
                    </label>
                    <Select
                      options={availableProjects}
                      value={selectedProject}
                      onChange={setSelectedProject}
                      className="w-100"
                      placeholder="Select Project..."
                      styles={{
                        control: (base) => ({ ...base, position: "relative" }),
                        menu: (base) => ({
                          ...base,
                          position: "absolute",
                          zIndex: 3,
                          marginTop: 0,
                        }),
                        singleValue: (base) => ({ ...base, color: "black" }),
                        option: (base) => ({
                          ...base,
                          color: "black",
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                        }),
                      }}
                    />
                  </Col>
                </Row>
              )}
            <Row className="mb-4 text-white">
              <Col lg="12">
                <label
                  className="form-label"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Select Patient Type:
                </label>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Patient Type"
                  style={{ marginLeft: "10px" }}
                >
                  <button
                    type="button"
                    className={`btn btn-outline-white ${
                      selectedPatientType.trim().toLowerCase() === "all"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectedPatientType("all")}
                  >
                    All
                  </button>
                  {patientTypes.map((type) => (
                    <button
                      key={type.patientTypeId}
                      type="button"
                      className={`btn btn-outline-white ${
                        selectedPatientType === type.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedPatientType(type.name)}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </Col>
            </Row>
            <Row className="mb-4 text-white">
              <Col lg="6">
                <label
                  className="form-label"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Select From Date:
                </label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-100"
                />
              </Col>
              <Col lg="6">
                <label
                  className="form-label"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Select To Date:
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-100"
                />
              </Col>
            </Row>
            <div className="header-body">
              <Row>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle tag="h5" className="text-muted mb-0">
                            Insured Patients
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {overview?.insuredPatients ?? "0"}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                            <i
                              className="fas fa-user-shield"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle tag="h5" className="text-muted mb-0">
                            Uninsured Patients
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {overview?.nonInsuredPatients ?? "0"}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                            <i
                              className="fas fa-user-times"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle tag="h5" className="text-muted mb-0">
                            Saudi Patients
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {overview?.saudiPatients ?? "0"}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                            <i
                              className="fas fa-flag"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg="6" xl="3">
                  <Card className="card-stats mb-4 mb-xl-0">
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle tag="h5" className="text-muted mb-0">
                            Non-Saudi Patients
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0">
                            {overview?.nonSaudiPatients ?? "0"}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                            <i
                              className="fas fa-globe"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Header;
