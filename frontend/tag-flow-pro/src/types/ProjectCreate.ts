export interface ProjectCreate {
  projectName: string;
  createdByAdminEmail: string;
  assignedUserIds?: number[];
}
