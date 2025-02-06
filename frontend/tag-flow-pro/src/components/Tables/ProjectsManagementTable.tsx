import TableWrapper from "components/Tables/TableWrapper";
import { Button } from "reactstrap";
import { PROJECTS_PLACEHOLDER } from "shared/consts";
import { Project } from "types/Project";

interface ProjectsManagementTableProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  paginateProjectsTable: (page: number) => void;
  openEditProjectModal: (project: Project) => void;
  toggleAddProjectModal: () => void;
  handleDeleteProject: (project: Project) => void;
  onSearch: (searchQuery: string) => void;
}

const ProjectsManagementTable = ({
  projects,
  currentPage,
  totalPages,
  paginateProjectsTable,
  openEditProjectModal,
  toggleAddProjectModal,
  handleDeleteProject,
  onSearch,
}: ProjectsManagementTableProps) => {
  const columns = [
    { header: "Project Name", accessor: "projectName" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (project: Project) =>
        new Date(project.createdAt).toLocaleString(),
    },
    { header: "Created By", accessor: "createdByAdminEmail" },
    {
      header: "Assigned Users",
      accessor: "assignedUserIds",
      render: (project: Project) =>
        project.assignedUserIds && project.assignedUserIds.length > 0
          ? project.assignedUserIds.join(", ")
          : "No assigned users",
    },
    {
      header: "Actions",
      accessor: "",
      render: (project: Project) => (
        <>
          <Button color="primary" onClick={() => openEditProjectModal(project)}>
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeleteProject(project)}
            className="ml-2"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <TableWrapper
      title="Projects Management"
      columns={columns}
      data={projects}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={paginateProjectsTable}
      toggleAddModal={toggleAddProjectModal}
      canShowAddButton={true}
      addButtonHeader="Add  Project"
      searchPlaceholder={PROJECTS_PLACEHOLDER}
      onSearch={onSearch}
    />
  );
};

export default ProjectsManagementTable;
