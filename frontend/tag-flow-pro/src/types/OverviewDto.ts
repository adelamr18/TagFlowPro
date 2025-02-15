export interface ProjectPatientAnalyticsDto {
  projectName: string;
  totalPatients: number;
  insuredPatients: number;
  nonInsuredPatients: number;
  percentageOfPatientsPerProject: number;
}

export interface AnalyticsDataPoint {
  timeLabel: string;
  count: number;
}

export interface OverviewDto {
  insuredPatients: number;
  nonInsuredPatients: number;
  saudiPatients: number;
  nonSaudiPatients: number;
  patientAnalytics: AnalyticsDataPoint[];
  projectsPerPatientAnalytics: ProjectPatientAnalyticsDto[];
  insuranceCompaniesPertPatientAnalytics: InsuranceCompanyPatientAnalyticsDto[];
}

export interface InsuranceCompanyPatientAnalyticsDto {
  insuranceCompany: string;
  insuredPatients: number;
  percentageOfPatients: number;
}
