import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Chart from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";
import { chartOptions, parseOptions, chartExample1 } from "variables/charts";
import Header from "components/Headers/Header.tsx";
import ProjectsPerPatientTable from "components/Tables/ProjectsPerPatientTable";
import InsuranceCompaniesManagement from "components/Tables/InsuranceCompaniesManagement";
import { useFile } from "context/FileContext";
import {
  OverviewDto,
  ProjectPatientAnalyticsDto,
  InsuranceCompanyPatientAnalyticsDto,
} from "types/OverviewDto";
import { useAdmin } from "context/AdminContext";
import { OPERATOR_ROLE_ID } from "shared/consts";
import { useAuth } from "context/AuthContext";
import ProjectsPerPatientPieChart from "components/PieCharts/ProjectsPerPatientPieChart";
import SimpleBarChartExample from "components/PieCharts/InsuranceCompaniesBarChart";

declare global {
  interface Window {
    Chart?: typeof Chart;
  }
}

const Index: React.FC = () => {
  const { getOverview } = useFile();
  const { projects } = useAdmin();
  const { roleId, userId } = useAuth();

  const [activeNav, setActiveNav] = useState<number>(1);
  const [chartExample1Data, setChartExample1Data] = useState<string>("data1");
  const [overview, setOverview] = useState<OverviewDto | null>(null);
  const [projectsAnalytics, setProjectsAnalytics] = useState<
    ProjectPatientAnalyticsDto[]
  >([]);
  const [insuranceAnalytics, setInsuranceAnalytics] = useState<
    InsuranceCompanyPatientAnalyticsDto[]
  >([]);

  // Pagination for Projects Per Patient
  const [currentProjectPage, setCurrentProjectPage] = useState<number>(1);
  const projectsRowsPerPage = 5;
  const indexOfLastProject = currentProjectPage * projectsRowsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsRowsPerPage;
  const currentProjects = projectsAnalytics.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalProjectPages = Math.ceil(
    projectsAnalytics.length / projectsRowsPerPage
  );

  // Pagination for Insurance Companies
  const [currentInsurancePage, setCurrentInsurancePage] = useState<number>(1);
  const insuranceRowsPerPage = 5;
  const indexOfLastInsurance = currentInsurancePage * insuranceRowsPerPage;
  const indexOfFirstInsurance = indexOfLastInsurance - insuranceRowsPerPage;
  const currentInsurance = insuranceAnalytics.slice(
    indexOfFirstInsurance,
    indexOfLastInsurance
  );
  const totalInsurancePages = Math.ceil(
    insuranceAnalytics.length / insuranceRowsPerPage
  );

  if (window.Chart) {
    parseOptions(window.Chart, chartOptions());
  }

  const toggleNavs = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  // For demonstration we use today's date for both fromDate and toDate.
  const today = new Date().toISOString().slice(0, 10);

  // Fetch overview and set both analytics arrays

  useEffect(() => {
    getOverview(today, today, "", "").then((data) => {
      if (data) {
        let filteredProjectsAnalytics = data.projectsPerPatientAnalytics;
        let filteredInsuranceAnalytics =
          data.insuranceCompaniesPertPatientAnalytics;
        // If the user is a viewer, filter projects to only those assigned to them.
        if (parseInt(roleId || "0") === OPERATOR_ROLE_ID) {
          const effectiveProjects = projects.filter((project) =>
            project.assignedUserIds.includes(userId)
          );
          filteredProjectsAnalytics = data.projectsPerPatientAnalytics.filter(
            (item) =>
              effectiveProjects.some(
                (project) => project.projectName === item.projectName
              )
          );
          // If desired, you could also filter the insurance analytics similarly.
        }
        setOverview(data);
        setProjectsAnalytics(filteredProjectsAnalytics);
        setInsuranceAnalytics(filteredInsuranceAnalytics);
        setCurrentProjectPage(1);
        setCurrentInsurancePage(1);
      }
    });
  }, [getOverview, today, roleId, userId, projects]);

  const paginateProjects = (pageNumber: number) => {
    setCurrentProjectPage(pageNumber);
  };

  const paginateInsurance = (pageNumber: number) => {
    setCurrentInsurancePage(pageNumber);
  };

  return (
    <>
      <Header
        onOverviewUpdate={(data: OverviewDto) => {
          setOverview(data);
          setProjectsAnalytics(data.projectsPerPatientAnalytics);
          setInsuranceAnalytics(data.insuranceCompaniesPertPatientAnalytics);
          setCurrentProjectPage(1);
          setCurrentInsurancePage(1);
        }}
        canShowDashboard={true}
      />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0">
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
          {/* <Col lg="4">
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
          </Col> */}
        </Row>
        {overview && (
          <>
            <Row className="mt-5">
              <Col className="mb-5 mb-xl-0">
                <ProjectsPerPatientTable
                  projectsAnalytics={currentProjects}
                  currentPage={currentProjectPage}
                  totalPages={totalProjectPages}
                  onPageChange={paginateProjects}
                />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col className="mb-5 mb-xl-0">
                <InsuranceCompaniesManagement
                  insuranceAnalytics={currentInsurance}
                  currentPage={currentInsurancePage}
                  totalPages={totalInsurancePages}
                  onPageChange={paginateInsurance}
                />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col lg="6" className="mb-5 mb-xl-0">
                <ProjectsPerPatientPieChart
                  projectsAnalytics={currentProjects}
                />
              </Col>
              <Col lg="6" className="mb-5 mb-xl-0">
                <SimpleBarChartExample insuranceAnalytics={currentInsurance} />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Index;
