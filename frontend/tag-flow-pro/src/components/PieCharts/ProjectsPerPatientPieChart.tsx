import React, { useMemo } from "react";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Pie } from "react-chartjs-2";
import { ProjectPatientAnalyticsDto } from "types/OverviewDto";

interface ProjectsPerPatientPieChartProps {
  projectsAnalytics: ProjectPatientAnalyticsDto[];
}

const ProjectsPerPatientPieChart: React.FC<ProjectsPerPatientPieChartProps> = ({
  projectsAnalytics,
}) => {
  const pieData = useMemo(
    () => ({
      labels: projectsAnalytics.map((item) => item.projectName),
      datasets: [
        {
          data: projectsAnalytics.map((item) => item.totalPatients),
          backgroundColor: [
            "#f5365c",
            "#fb6340",
            "#11cdef",
            "#2dce89",
            "#5e72e4",
            "#ffd600",
          ],
        },
      ],
    }),
    [projectsAnalytics]
  );

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: "right" as const,
      labels: {
        fontColor: "#000",
        boxWidth: 20,
        padding: 10,
      },
    },
  };

  return (
    <Card className="shadow">
      <CardHeader className="bg-transparent">
        <h3 className="mb-0">Total Patients Per Project Pie Chart</h3>
      </CardHeader>
      <CardBody style={{ height: "230px" }}>
        <Pie data={pieData} options={pieOptions} />
      </CardBody>
    </Card>
  );
};

export default ProjectsPerPatientPieChart;
