export interface UpdateUserDetails {
  username?: string;
  email?: string;
  roleId?: number;
  assignedTagIds: number[];
}
