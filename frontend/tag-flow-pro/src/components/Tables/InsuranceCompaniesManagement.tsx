import TableWrapper from "components/Tables/TableWrapper";
import { InsuranceCompanyPatientAnalyticsDto } from "types/OverviewDto";

interface InsuranceCompaniesManagementProps {
  insuranceAnalytics: InsuranceCompanyPatientAnalyticsDto[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InsuranceCompaniesManagement: React.FC<
  InsuranceCompaniesManagementProps
> = ({ insuranceAnalytics, currentPage, totalPages, onPageChange }) => {
  const columns = [
    { header: "Insurance Company", accessor: "insuranceCompany" },
    { header: "Insured Patients", accessor: "insuredPatients" },
    {
      header: "%PatientsPerInsuranceCompany",
      accessor: "percentageOfPatients",
      render: (row: InsuranceCompanyPatientAnalyticsDto) =>
        `${row.percentageOfPatients}%`,
    },
  ];

  return (
    <TableWrapper
      title="Total Patients Per Payer"
      columns={columns}
      data={insuranceAnalytics}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      toggleAddModal={() => {}}
      canShowAddButton={false}
      searchPlaceholder=""
    />
  );
};

export default InsuranceCompaniesManagement;
