import { UserInterface } from '../../user/interface/user.interface';

export interface WorkspaceInterface {
  id: string;
  name: string;
  owner?: UserInterface;
  isActive: boolean;
  isArchiver: boolean;
  createdAt: Date;
  updatedAt: Date;
}
