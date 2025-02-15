import React from "react";
import TableWrapper from "components/Tables/TableWrapper";
import { ProjectPatientAnalyticsDto } from "types/OverviewDto";

interface ProjectsPerPatientTableProps {
  projectsAnalytics: ProjectPatientAnalyticsDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProjectsPerPatientTable: React.FC<ProjectsPerPatientTableProps> = ({
  projectsAnalytics,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns = [
    { header: "Project Name", accessor: "projectName" },
    { header: "Total Patients", accessor: "totalPatients" },
    { header: "Insured", accessor: "insuredPatients" },
    { header: "Non Insured", accessor: "nonInsuredPatients" },
    {
      header: "% Insured",
      accessor: "percentageOfPatientsPerProject",
      render: (row: ProjectPatientAnalyticsDto) =>
        `${row.percentageOfPatientsPerProject}%`,
    },
  ];

  return (
    <TableWrapper
      title="Projects Per Patient"
      columns={columns}
      data={projectsAnalytics}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      canShowAddButton={false}
      toggleAddModal={() => {}}
      searchPlaceholder=""
    />
  );
};

export default ProjectsPerPatientTable;
