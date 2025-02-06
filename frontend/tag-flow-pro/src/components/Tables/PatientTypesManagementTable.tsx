import TableWrapper from "components/Tables/TableWrapper";
import { Button } from "reactstrap";
import { PATIENT_TYPES_PLACEHOLDER } from "shared/consts";
import { PatientType } from "types/PatientType";

interface PatientTypesManagementTableProps {
  patientTypes: PatientType[];
  currentPage: number;
  totalPages: number;
  paginatePatientTypesTable: (page: number) => void;
  openEditPatientTypeModal: (patientType: PatientType) => void;
  toggleAddPatientTypeModal: () => void;
  handleDeletePatientType: (patientType: PatientType) => void;
  onSearch: (searchQuery: string) => void;
}

const PatientTypesManagementTable = ({
  patientTypes,
  currentPage,
  totalPages,
  paginatePatientTypesTable,
  openEditPatientTypeModal,
  toggleAddPatientTypeModal,
  handleDeletePatientType,
  onSearch,
}: PatientTypesManagementTableProps) => {
  const columns = [
    { header: "Patient Type", accessor: "name" },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (patientType: PatientType) =>
        new Date(patientType.createdAt).toLocaleString(),
    },
    { header: "Created By", accessor: "createdByAdminEmail" },
    {
      header: "Actions",
      accessor: "",
      render: (patientType: PatientType) => (
        <>
          <Button
            color="primary"
            onClick={() => openEditPatientTypeModal(patientType)}
          >
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeletePatientType(patientType)}
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
      title="Patient Types Management"
      columns={columns}
      data={patientTypes}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={paginatePatientTypesTable}
      toggleAddModal={toggleAddPatientTypeModal}
      canShowAddButton={true}
      addButtonHeader="Add Patient Type"
      searchPlaceholder={PATIENT_TYPES_PLACEHOLDER}
      onSearch={onSearch}
    />
  );
};

export default PatientTypesManagementTable;
