import { Role } from "./Role";

export interface User {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  roleId: number;
  role: Role | null;
  createdBy: number;
  createdByAdmin: User | null;
  userTagPermissions: any[];
  files: any[];
}
