import { RolesInterface } from '../../role/interface/role.interface';
import { UserInterface } from '../../user/interface/user.interface';
import { WorkspaceInterface } from '../../workspace/interface/workspace.interface';

export interface UserWorkspaceInterface {
  id: string;
  user: UserInterface;
  workspace: WorkspaceInterface;
  role: RolesInterface;
  isActive: boolean;
  isArchiver: boolean;
  createdAt: Date;
  updatedAt: Date;
}
