export interface ProjectAnalyticsDto {
  projectName: string;
  timeLabel: string;
  totalPatients: number;
  insuredPatients: number;
  nonInsuredPatients: number;
}

export interface ProjectAnalytics {
  analytics: ProjectAnalyticsDto[];
}
