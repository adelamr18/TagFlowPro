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
  Container,
  Row,
  Col,
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts";
import Header from "components/Headers/Header.tsx";
import ProjectsPerPatientTable from "components/Tables/ProjectsPerPatientTable";
import { useFile } from "context/FileContext";
import { OverviewDto, ProjectPatientAnalyticsDto } from "types/OverviewDto";

declare global {
  interface Window {
    Chart?: typeof Chart;
  }
}

const Index: React.FC = () => {
  const { getOverview } = useFile();
  const [activeNav, setActiveNav] = useState<number>(1);
  const [chartExample1Data, setChartExample1Data] = useState<string>("data1");
  const [overview, setOverview] = useState<OverviewDto | null>(null);
  const [projectsAnalytics, setProjectsAnalytics] = useState<
    ProjectPatientAnalyticsDto[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const today = new Date().toISOString().slice(0, 10);

  if (window.Chart) {
    parseOptions(window.Chart, chartOptions());
  }

  const toggleNavs = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  // --- Pagination logic ---
  const totalPages = Math.ceil((projectsAnalytics?.length || 0) / rowsPerPage);
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Fetch overview when filters change (for simplicity, using fixed dates here)
  useEffect(() => {
    // For demonstration, we use today for both fromDate and toDate.
    // In a real scenario, these could come from header filters.
    getOverview(today, today, "", "").then((data) => {
      if (data) {
        setOverview(data);
        setProjectsAnalytics(data.projectsPerPatientAnalytics);
        setCurrentPage(1);
      }
    });
  }, [getOverview, today]);

  return (
    <>
      <Header
        onOverviewUpdate={(data: OverviewDto) => {
          setOverview(data);
          setProjectsAnalytics(data.projectsPerPatientAnalytics);
          setCurrentPage(1);
        }}
        canShowDashboard={true}
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
              <ProjectsPerPatientTable
                projectsAnalytics={projectsAnalytics}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Index;
