export interface OverviewDto {
  nonInsuredPatients: number;
  saudiPatients: number;
  nonSaudiPatients: number;
  insuredPatients: number;
  totalPatientsPerProjectOverview: Record<string, number>;
}
