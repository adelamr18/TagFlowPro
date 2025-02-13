import { useAdmin } from "context/AdminContext";
import { useAuth } from "context/AuthContext";
import { useFile } from "context/FileContext";
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Input,
} from "reactstrap";
import Select from "react-select";
import { ADMIN_ROLE_ID, VIEWER_ROLE_ID } from "shared/consts";
import { useState, useEffect } from "react";
import "./Header.css";
import { OverviewDto } from "types/OverviewDto";

interface HeaderProps {
  canShowDashboard?: boolean;
}

const Header = ({ canShowDashboard = true }: HeaderProps) => {
  const { userName, roleId, userId } = useAuth();
  const { projects, patientTypes } = useAdmin();
  const { getOverview } = useFile();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedPatientType, setSelectedPatientType] = useState<string | null>(
    null
  );
  const [fileUploadedOn, setFileUploadedOn] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [overview, setOverview] = useState<OverviewDto | null>(null);

  const availableProjects = [ADMIN_ROLE_ID, VIEWER_ROLE_ID].includes(
    parseInt(roleId || "0")
  )
    ? projects.map((project) => ({
        value: project.projectId,
        label: project.projectName,
      }))
    : projects
        .filter((project) => project.assignedUserIds.includes(userId))
        .map((project) => ({
          value: project.projectId,
          label: project.projectName,
        }));

  useEffect(() => {
    if (fileUploadedOn && selectedProject && selectedPatientType) {
      getOverview(
        fileUploadedOn,
        selectedProject.label,
        selectedPatientType
      ).then((data) => {
        if (data) {
          setOverview(data);
        }
      });
    } else {
      // Default: if no project or patient type is selected, fetch overview for ALL projects and all patient types.
      getOverview(fileUploadedOn, "", "").then((data) => {
        if (data) {
          setOverview(data);
        }
      });
    }
  }, [fileUploadedOn, selectedProject, selectedPatientType, getOverview]);

  const handlePatientTypeSelect = (type: string) => {
    setSelectedPatientType(type);
  };

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          {canShowDashboard && (
            <>
              {userName &&
                [ADMIN_ROLE_ID, VIEWER_ROLE_ID].includes(
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
                          control: (base) => ({
                            ...base,
                            position: "relative",
                          }),
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
                    {patientTypes.map((type) => (
                      <button
                        key={type.patientTypeId}
                        type="button"
                        className={`btn btn-outline-white ${
                          selectedPatientType === type.name ? "active" : ""
                        }`}
                        onClick={() => handlePatientTypeSelect(type.name)}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </Col>
              </Row>
              <Row className="mb-4 text-white">
                <Col lg="12">
                  <label
                    className="form-label"
                    style={{ color: "white", fontWeight: "bold" }}
                  >
                    Select Upload Date:
                  </label>
                  <Input
                    type="date"
                    value={fileUploadedOn}
                    onChange={(e) => setFileUploadedOn(e.target.value)}
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
                              {overview ? overview.insuredPatients : 0}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                              <i className="fas fa-hand-holding-heart" />
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
                              {overview ? overview.nonInsuredPatients : 0}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                              <i className="fas fa-exclamation-circle" />
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
                              {overview ? overview.saudiPatients : 0}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                              <i className="fas fa-flag" />
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
                              {overview ? overview.nonSaudiPatients : 0}
                            </span>
                          </div>
                          <Col className="col-auto">
                            <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                              <i className="fas fa-globe-americas" />
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
    </>
  );
};

export default Header;
