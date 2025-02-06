export interface Project {
  projectId: number;
  projectName: string;
  createdAt: string;
  createdByAdminEmail: string;
  assignedUserIds: number[];
}
