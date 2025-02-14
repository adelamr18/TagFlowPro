import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts";
import Header from "components/Headers/Header.tsx";
import { useFile } from "context/FileContext";
import { OverviewDto, ProjectPatientAnalyticsDto } from "types/OverviewDto";

declare global {
  interface Window {
    Chart?: typeof Chart;
  }
}

const Index: React.FC = () => {
  const { getOverview } = useFile();
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [fromDate, setFromDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [toDate, setToDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedPatientType, setSelectedPatientType] = useState<string>("all");
  const [overview, setOverview] = useState<OverviewDto | null>(null);
  const [projectsAnalytics, setProjectsAnalytics] = useState<
    ProjectPatientAnalyticsDto[]
  >([]);

  if (window.Chart) {
    parseOptions(window.Chart, chartOptions());
  }

  const toggleNavs = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  useEffect(() => {
    const projectParam =
      selectedProject.trim().toLowerCase() === "all" ? "" : selectedProject;
    const patientParam =
      selectedPatientType.trim().toLowerCase() === "all"
        ? ""
        : selectedPatientType;
    if (fromDate && toDate) {
      getOverview(fromDate, toDate, projectParam, patientParam).then((data) => {
        if (data) {
          setOverview(data);
          setProjectsAnalytics(data.projectsPerPatientAnalytics);
        }
      });
    }
  }, [fromDate, toDate, selectedProject, selectedPatientType, getOverview]);

  return (
    <>
      <Header
        onOverviewUpdate={(data) => {
          setOverview(data);
          setProjectsAnalytics(data.projectsPerPatientAnalytics);
        }}
      />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {overview && (
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Projects Per Patient</h3>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th>Project Name</th>
                      <th>Total Patients</th>
                      <th>Insured</th>
                      <th>Non Insured</th>
                      <th>% PatientsPerProject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectsAnalytics.map((p) => (
                      <tr key={p.projectName}>
                        <td>{p.projectName}</td>
                        <td>{p.totalPatients}</td>
                        <td>{p.insuredPatients}</td>
                        <td>{p.nonInsuredPatients}</td>
                        <td>{p.percentageOfPatientsPerProject}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Index;
