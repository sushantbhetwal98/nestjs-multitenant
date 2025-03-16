import { PermissionInterface } from './permission.interface';

export interface RolesInterface {
  id: string;
  isMutable: boolean;
  name: string;
  permissions: PermissionInterface[];
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
