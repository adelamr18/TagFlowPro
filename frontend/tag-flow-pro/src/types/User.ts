export interface User {
  userId?: number;
  username: string;
  password?: string;
  email: string;
  createdAt?: string;
  roleName?: string;
  createdBy?: number;
  createdByAdminName?: string;
  createdByAdminEmail: string;
  userTagPermissions?: any[];
  files?: any[];
  roleId: number;
  assignedTags?: string[];
  assignedTagIds: number[];
}
