export interface Tag {
  tagId: number;
  tagName: string;
  tagValues: string[];
  assignedUsers: string[];
  createdByEmail: string;
  createdByUserName: string;
  assignedUserIds: number[];
  tagValuesIds: number[];
}
