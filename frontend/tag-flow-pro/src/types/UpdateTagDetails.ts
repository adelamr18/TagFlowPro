export interface UpdateTagDetails {
  tagId: number;
  tagName: string;
  description?: string;
  tagValues: string[];
  updatedByAdminId: number | null;
  assignedUsers: string[];
  updatedBy: string;
}
