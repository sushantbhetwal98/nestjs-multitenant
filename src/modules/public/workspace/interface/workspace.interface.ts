import { UserInterface } from '../../user/interface/user.interface';

export interface WorkspaceInterface {
  id: string;
  name: string;
  owner?: UserInterface;
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
